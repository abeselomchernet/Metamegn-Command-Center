import { describe, it, expect } from 'vitest';
import { runReconciliation } from '../src/domain/reconciliation';
import { LedgerEvent, StatementRow } from '../src/domain/types';

describe('5-Class Reconciliation Matching Engine', () => {
  it('Class 1: correctly matches events with statements of equal reference and amount', () => {
    const event: LedgerEvent = {
      id: 'ev-1',
      txRef: 'TXR-001',
      amountCents: 150000,
      railId: 'wallet_a',
      tillId: 'till-1',
      tillName: 'Till 1',
      cashierId: 'c1',
      cashierName: 'Alem',
      createdAt: '2026-10-21T10:00:00Z',
      status: 'awaiting_provider',
    };

    const statement: StatementRow = {
      id: 'st-1',
      statementDate: '2026-10-21',
      statementTime: '10:00:05',
      railId: 'wallet_a',
      externalRef: 'TXR-001',
      amountCents: 150000,
      feeCents: 750,
      rawPayloadRef: 'RAW-1',
    };

    const result = runReconciliation([event], [statement]);

    expect(result.matchedPairs).toHaveLength(1);
    expect(result.matchedPairs[0].event.id).toBe('ev-1');
    expect(result.matchedPairs[0].statement.id).toBe('st-1');
    expect(result.exceptions).toHaveLength(0);
    expect(result.summary.matchRatePercent).toBe(100);
  });

  it('Class 2: flags missing_at_provider when till event has no provider statement', () => {
    const event: LedgerEvent = {
      id: 'ev-2',
      txRef: 'TXR-002',
      amountCents: 85000,
      railId: 'bank_b',
      tillId: 'till-1',
      tillName: 'Till 1',
      cashierId: 'c1',
      cashierName: 'Alem',
      createdAt: '2026-10-21T10:00:00Z',
      status: 'awaiting_provider',
    };

    const result = runReconciliation([event], []);

    expect(result.matchedPairs).toHaveLength(0);
    expect(result.exceptions).toHaveLength(1);
    expect(result.exceptions[0].exceptionClass).toBe('missing_at_provider');
    expect(result.exceptions[0].eventId).toBe('ev-2');
  });

  it('Class 3: flags missing_at_till when statement exists but till event was not recorded', () => {
    const statement: StatementRow = {
      id: 'st-3',
      statementDate: '2026-10-21',
      statementTime: '10:00:05',
      railId: 'interop_qr',
      externalRef: 'TXR-ORPHAN-99',
      amountCents: 200000,
      feeCents: 600,
      rawPayloadRef: 'RAW-3',
    };

    const result = runReconciliation([], [statement]);

    expect(result.matchedPairs).toHaveLength(0);
    expect(result.exceptions).toHaveLength(1);
    expect(result.exceptions[0].exceptionClass).toBe('missing_at_till');
    expect(result.exceptions[0].statementId).toBe('st-3');
  });

  it('Class 4: flags amount_mismatch when references match but amounts differ', () => {
    const event: LedgerEvent = {
      id: 'ev-4',
      txRef: 'TXR-004',
      amountCents: 75000, // ETB 750.00
      railId: 'card_tap',
      tillId: 'till-1',
      tillName: 'Till 1',
      cashierId: 'c1',
      cashierName: 'Alem',
      createdAt: '2026-10-21T10:00:00Z',
      status: 'awaiting_provider',
    };

    const statement: StatementRow = {
      id: 'st-4',
      statementDate: '2026-10-21',
      statementTime: '10:00:05',
      railId: 'card_tap',
      externalRef: 'TXR-004',
      amountCents: 70000, // ETB 700.00 (diff 50.00)
      feeCents: 840,
      rawPayloadRef: 'RAW-4',
    };

    const result = runReconciliation([event], [statement]);

    expect(result.matchedPairs).toHaveLength(0);
    expect(result.exceptions).toHaveLength(1);
    expect(result.exceptions[0].exceptionClass).toBe('amount_mismatch');
    expect(result.exceptions[0].diffCents).toBe(5000);
  });

  it('Class 5: flags duplicate when reference is recorded more than once', () => {
    const ev1: LedgerEvent = {
      id: 'ev-5a',
      txRef: 'TXR-DUP-005',
      amountCents: 30000,
      railId: 'wallet_a',
      tillId: 'till-1',
      tillName: 'Till 1',
      cashierId: 'c1',
      cashierName: 'Alem',
      createdAt: '2026-10-21T10:00:00Z',
      status: 'awaiting_provider',
    };
    const ev2: LedgerEvent = {
      id: 'ev-5b',
      txRef: 'TXR-DUP-005',
      amountCents: 30000,
      railId: 'wallet_a',
      tillId: 'till-1',
      tillName: 'Till 1',
      cashierId: 'c1',
      cashierName: 'Alem',
      createdAt: '2026-10-21T10:00:04Z',
      status: 'awaiting_provider',
    };

    const result = runReconciliation([ev1, ev2], []);

    expect(result.exceptions).toHaveLength(2);
    expect(result.exceptions[0].exceptionClass).toBe('duplicate');
    expect(result.exceptions[1].exceptionClass).toBe('duplicate');
  });
});
