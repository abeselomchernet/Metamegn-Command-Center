import { describe, it, expect } from 'vitest';
import { TRANSACTION_STATES } from '../src/domain/types';
import { runReconciliation } from '../src/domain/reconciliation';
import {
  computeBankLens,
  computeMerchantLens,
  computeOperatorLens,
  computeSystemInclusionMetrics,
} from '../src/domain/value';
import {
  DEFAULT_BANK_INPUTS,
  DEFAULT_MERCHANT_INPUTS,
  DEFAULT_OPERATOR_INPUTS,
  SYSTEM_INCLUSION_HYPOTHESES,
  CHALLENGE_MODE_ROWS,
  VALUE_LAB_TOP_LINE,
  BANK_ALREADY_SOLVES_IT_MESSAGE,
  MERCHANT_GAINS_NOTE,
  NO_PRICE_WORKS_SENTENCE,
  BANK_CEILING_BELOW_FLOOR_REASON,
  CHALLENGE_PANEL_FOOTER_LINE,
} from '../src/data/valueLab';
import { MockAdapter } from '../src/data/MockAdapter';
import { LedgerEvent, StatementRow } from '../src/domain/types';
import { enTranslations } from '../src/i18n/en';
import { amTranslations } from '../src/i18n/am';
import { omTranslations } from '../src/i18n/om';

describe('Metamegn v4: Mechanics & Value Lab Specification', () => {
  describe('Part A.1: Six Transaction States Invariant', () => {
    it('defines exactly six transaction states in correct lifecycle order', () => {
      expect(TRANSACTION_STATES).toHaveLength(6);
      expect(TRANSACTION_STATES).toEqual([
        'INITIATED',
        'PENDING',
        'CONFIRMED',
        'FAILED',
        'REVERSED',
        'NEEDS_RECONCILIATION',
      ]);
    });

    it('never confirms a captured event locally without external statement match', async () => {
      const adapter = new MockAdapter(1001);
      const event = await adapter.captureEvent({
        amountCents: 95000,
        railId: 'wallet_a',
        tillId: 'till-01',
        tillName: 'Till 01',
        cashierId: 'emp-01',
        cashierName: 'Alem T.',
      });

      // Crucial invariant: never CONFIRMED without reconciliation match
      expect(event.status).toBe('PENDING');
      expect(event.status).not.toBe('CONFIRMED');
    });
  });

  describe('Part A.2: Late Reversal & Unknown Outcome Reconciliation Exceptions', () => {
    it('correctly classifies a late reversal with ageing', () => {
      const event: LedgerEvent = {
        id: 'ev-rev-1',
        txRef: 'TXR-REV-01',
        amountCents: 120000,
        railId: 'wallet_a',
        bankId: 'bank-1',
        tillId: 'till-1',
        tillName: 'Till 1',
        cashierId: 'c1',
        cashierName: 'Alem',
        createdAt: '2026-10-21T07:00:00Z',
        status: 'REVERSED',
        isLateReversal: true,
      };

      const statement: StatementRow = {
        id: 'st-rev-1',
        statementDate: '2026-10-21',
        statementTime: '07:45:00',
        railId: 'wallet_a',
        bankId: 'bank-1',
        externalRef: 'TXR-REV-01',
        amountCents: 120000,
        isReversal: true,
        feeCents: 0,
        rawPayloadRef: 'RAW-REV-01',
      };

      const result = runReconciliation([event], [statement]);
      const revException = result.exceptions.find((ex) => ex.exceptionClass === 'late_reversal');
      expect(revException).toBeDefined();
      expect(revException?.eventId).toBe('ev-rev-1');
      expect(revException?.ageMinutes).toBeDefined();
      expect(revException?.ageMinutes).toBeGreaterThan(0);
    });

    it('correctly classifies an unknown outcome timeout with ageing', () => {
      const event: LedgerEvent = {
        id: 'ev-unk-1',
        txRef: 'TXR-UNK-01',
        amountCents: 45000,
        railId: 'card_tap',
        bankId: 'bank-2',
        tillId: 'till-2',
        tillName: 'Till 2',
        cashierId: 'c2',
        cashierName: 'Bereket',
        createdAt: '2026-10-21T06:00:00Z',
        status: 'NEEDS_RECONCILIATION',
        isUnknownOutcome: true,
      };

      const result = runReconciliation([event], []);
      const unkException = result.exceptions.find((ex) => ex.exceptionClass === 'unknown_outcome');
      expect(unkException).toBeDefined();
      expect(unkException?.eventId).toBe('ev-unk-1');
      expect(unkException?.ageMinutes).toBeDefined();
      expect(unkException?.ageMinutes).toBeGreaterThan(0);
    });

    it('seeds at least one exception older than 24 hours (1440 minutes) for visible ageing', async () => {
      const adapter = new MockAdapter(1002);
      const exceptions = await adapter.listExceptions();
      const olderThan24h = exceptions.filter((ex) => ex.ageMinutes !== undefined && ex.ageMinutes >= 1440);
      expect(olderThan24h.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Part A.3: Missing-Feed Recovery & Catch-up Replay Invariant', () => {
    it('pauses statements during outage and catches up to identical match count upon restore', async () => {
      // 1. Adapter A: normal flow with direct reconciliation
      const adapterNormal = new MockAdapter(4001);
      await adapterNormal.simulateIncomingStatement('TXR-2026-8941', 185000, 'wallet_a', 'bank-1');
      const normalResult = await adapterNormal.reconcileBatch();

      // 2. Adapter B: simulate feed down, buffer statements, then restore
      const adapterOutage = new MockAdapter(4001);
      await adapterOutage.setProviderFeedDown(true);
      expect(await adapterOutage.isProviderFeedDown()).toBe(true);

      // Statement arrives during outage -> buffered, not directly reconciled
      await adapterOutage.simulateIncomingStatement('TXR-2026-8941', 185000, 'wallet_a', 'bank-1');

      // Restore feed: buffered statements are released and batch reconciliation replays
      await adapterOutage.setProviderFeedDown(false);
      expect(await adapterOutage.isProviderFeedDown()).toBe(false);

      const outageResult = await adapterOutage.reconcileBatch();

      // Invariant: The end match state is identical to having experienced no outage
      expect(outageResult.matchedPairs.length).toEqual(normalResult.matchedPairs.length);
    });
  });

  describe('Part A.4: Multi-Bank Isolation & Scope Switch', () => {
    it('isolates Bank 1 view such that 0 Bank 2 records appear', async () => {
      const adapter = new MockAdapter(5001);

      const bank1Events = await adapter.listEvents({ bankId: 'bank-1' });
      const bank2EventsInBank1 = bank1Events.filter((e) => e.bankId === 'bank-2');
      const bank3EventsInBank1 = bank1Events.filter((e) => e.bankId === 'bank-3');

      expect(bank2EventsInBank1.length).toBe(0);
      expect(bank3EventsInBank1.length).toBe(0);

      const bank1Exceptions = await adapter.listExceptions({ bankId: 'bank-1' });
      const bank2ExceptionsInBank1 = bank1Exceptions.filter((e) => e.bankId === 'bank-2');

      expect(bank2ExceptionsInBank1.length).toBe(0);
    });
  });

  describe('Part B: Value Lab Pure Calculations & Sensitivity', () => {
    it('computes Bank lens break-even sentence and ceiling Z', () => {
      const outputs = computeBankLens({
        eventsPerDay: 100,
        minutesPerManualItem: 10,
        staffCostPerHourETB: 120,
        complaintSharePercent: 20,
        bankAlreadySolvesIt: false,
      });

      expect(outputs.hoursSavedPerMonth).toBeGreaterThan(0);
      expect(outputs.breakEvenSentence).toContain('The layer is worth paying for only if it removes at least');
      expect(outputs.breakEvenSentence).toContain('hours a month');
      expect(outputs.breakEvenSentence).toContain('customer complaints a month');
      expect(outputs.bankValueCeilingETBCents).toBeGreaterThan(0);
    });

    it('reduces staff effort when "Bank already solves it" is toggled', () => {
      const withoutToggle = computeBankLens({
        eventsPerDay: 100,
        minutesPerManualItem: 10,
        staffCostPerHourETB: 120,
        complaintSharePercent: 20,
        bankAlreadySolvesIt: false,
      });

      const withToggle = computeBankLens({
        eventsPerDay: 100,
        minutesPerManualItem: 10,
        staffCostPerHourETB: 120,
        complaintSharePercent: 20,
        bankAlreadySolvesIt: true,
      });

      expect(withToggle.baselineMatchRatePercent).toBe(99.5);
      expect(withToggle.hoursSavedPerMonth).toBeLessThan(withoutToggle.hoursSavedPerMonth);
      expect(withToggle.monthlyStaffSavingsETBCents).toBeLessThan(withoutToggle.monthlyStaffSavingsETBCents);
    });

    it('reflects lower disputes when "Merchant already copes" is toggled', () => {
      const withoutToggle = computeMerchantLens({
        salesPerDay: 80,
        minutesLostPerDispute: 15,
        merchantAlreadyCopes: false,
      });

      const withToggle = computeMerchantLens({
        salesPerDay: 80,
        minutesLostPerDispute: 15,
        merchantAlreadyCopes: true,
      });

      expect(withToggle.disputedSalesPerWeekWithout).toBeLessThanOrEqual(withoutToggle.disputedSalesPerWeekWithout);
      expect(withToggle.shiftVarianceWithoutETBCents).toBeLessThan(withoutToggle.shiftVarianceWithoutETBCents);
    });

    it('returns "No price works on these inputs. Option stops." when ceiling is below viable price floor', () => {
      const outputs = computeOperatorLens({
        supportCostPerHourETB: 150,
        fixedMonthlyRunCostETB: 45000,
        pricePerBankPerMonthETB: 20000,
        participatingBanksCount: 2,
        bankValueCeilingETB: 5000, // Ceiling 5,000 < Floor (approx 25,000)
      });

      expect(outputs.noPriceWorks).toBe(true);
      expect(outputs.statusSentence).toBe(NO_PRICE_WORKS_SENTENCE);
    });

    it('provides viable pricing window when ceiling exceeds floor', () => {
      const outputs = computeOperatorLens({
        supportCostPerHourETB: 150,
        fixedMonthlyRunCostETB: 15000,
        pricePerBankPerMonthETB: 20000,
        participatingBanksCount: 2,
        bankValueCeilingETB: 40000, // Ceiling 40,000 > Floor (approx 10,200)
      });

      expect(outputs.noPriceWorks).toBe(false);
      expect(outputs.statusSentence).toContain('Viable pricing window:');
    });

    it('calculates zero-bank runway accrual for 1, 3, 6, and 12 months', () => {
      const outputs = computeOperatorLens({
        supportCostPerHourETB: 150,
        fixedMonthlyRunCostETB: 20000,
        pricePerBankPerMonthETB: 10000,
        participatingBanksCount: 1,
        bankValueCeilingETB: 30000,
      });

      expect(outputs.zeroBankAccrualMonths).toHaveLength(4);
      expect(outputs.zeroBankAccrualMonths.map((m) => m.months)).toEqual([1, 3, 6, 12]);
      expect(outputs.zeroBankAccrualMonths[0].accruedCostETBCents).toBe(20000 * 100);
      expect(outputs.zeroBankAccrualMonths[3].accruedCostETBCents).toBe(240000 * 100);
    });

    it('computes system inclusion metrics identifying micro-transactions <= 200 ETB', () => {
      const sampleEvents = [
        { amountCents: 15000 }, // 150 ETB (micro)
        { amountCents: 19000 }, // 190 ETB (micro)
        { amountCents: 50000 }, // 500 ETB (regular)
        { amountCents: 120000 }, // 1200 ETB (regular)
      ];

      const metrics = computeSystemInclusionMetrics(sampleEvents);
      expect(metrics.totalSampleEvents).toBe(4);
      expect(metrics.microTransactionsCount).toBe(2);
      expect(metrics.microTransactionsSharePercent).toBe(50);
    });
  });

  describe('Part C & Research Invariants: Anti-bias & Proof Discipline', () => {
    it('labels every default input with Assumption evidence tag', () => {
      const allDefaultInputs = [
        ...Object.values(DEFAULT_BANK_INPUTS),
        ...Object.values(DEFAULT_MERCHANT_INPUTS),
        ...Object.values(DEFAULT_OPERATOR_INPUTS),
      ];

      for (const input of allDefaultInputs) {
        expect(input.evidenceTag).toBe('Assumption');
      }
    });

    it('tags system hypotheses as Not tested and Needs approval', () => {
      for (const hyp of SYSTEM_INCLUSION_HYPOTHESES) {
        expect(hyp.evidenceTags).toEqual(['Not tested', 'Needs approval']);
      }
    });

    it('has exactly six challenge mode rows and proper negative finding disclaimer', () => {
      expect(CHALLENGE_MODE_ROWS).toHaveLength(6);
      expect(CHALLENGE_PANEL_FOOTER_LINE).toBe('Negative findings are recorded, never excluded.');
    });

    it('contains exact top line on Value Lab', () => {
      expect(VALUE_LAB_TOP_LINE).toBe(
        'A simulation on placeholder inputs. It shows effects and sensitivity, not proof that anyone will pay. Replace every placeholder with a measured figure before drawing any conclusion.'
      );
    });

    it('verifies exact toggle messages for bank and merchant', () => {
      expect(BANK_ALREADY_SOLVES_IT_MESSAGE).toBe(
        "If the bank's own process is already good, there is nothing to buy."
      );
      expect(MERCHANT_GAINS_NOTE).toBe(
        'The merchant gains only if the record is trusted, simple and costs less than the time it saves.'
      );
    });

    it('anti-bias check: no winner or ranking language in Value Lab texts', () => {
      const textsToCheck = [
        VALUE_LAB_TOP_LINE,
        BANK_ALREADY_SOLVES_IT_MESSAGE,
        MERCHANT_GAINS_NOTE,
        NO_PRICE_WORKS_SENTENCE,
        CHALLENGE_PANEL_FOOTER_LINE,
      ];
      for (const t of textsToCheck) {
        expect(t.toLowerCase()).not.toContain('winner');
        expect(t.toLowerCase()).not.toContain('best');
        expect(t.toLowerCase()).not.toContain('rank');
        expect(t.toLowerCase()).not.toContain('score');
      }
    });
  });

  describe('i18n Parity Across All 3 Languages', () => {
    it('ensures en, am, and om share the exact same translation keys', () => {
      const enKeys = Object.keys(enTranslations).sort();
      const amKeys = Object.keys(amTranslations).sort();
      const omKeys = Object.keys(omTranslations).sort();

      expect(amKeys).toEqual(enKeys);
      expect(omKeys).toEqual(enKeys);
    });
  });
});
