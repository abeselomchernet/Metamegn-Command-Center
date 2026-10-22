/**
 * Value Lab Data Module (Part B & Part C).
 * All inputs are explicit placeholders with 'Assumption' evidence tags.
 * No real statistics, prices, tariffs, or proprietary bank claims.
 * No scoring, weights, rankings, ratings, or preferred indicators.
 */

export interface ValueLabInputConfig {
  id: string;
  label: string;
  defaultValue: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  evidenceTag: 'Assumption';
  description: string;
}

export interface SystemHypothesis {
  id: string;
  title: string;
  hypothesis: string;
  prerequisites: string;
  evidenceTags: ['Not tested', 'Needs approval'];
}

export interface ChallengeRow {
  id: number;
  challenge: string;
  demoCanShow: string;
  cannotShow: string;
  evidenceToAnswer: string;
}

export const VALUE_LAB_TOP_LINE =
  'A simulation on placeholder inputs. It shows effects and sensitivity, not proof that anyone will pay. Replace every placeholder with a measured figure before drawing any conclusion.';

export const BANK_ALREADY_SOLVES_IT_MESSAGE =
  "If the bank's own process is already good, there is nothing to buy.";

export const MERCHANT_GAINS_NOTE =
  'The merchant gains only if the record is trusted, simple and costs less than the time it saves.';

export const NO_PRICE_WORKS_SENTENCE =
  'No price works on these inputs. Option stops.';

export const BANK_CEILING_BELOW_FLOOR_REASON =
  'bank value ceiling below viable price floor';

export const INCLUSION_HONEST_LIMIT_TEXT =
  'Inclusion is the reason to care, not an outcome the demo can show.';

export const CHALLENGE_PANEL_FOOTER_LINE =
  'Negative findings are recorded, never excluded.';

export const DEFAULT_BANK_INPUTS: Record<string, ValueLabInputConfig> = {
  eventsPerDay: {
    id: 'eventsPerDay',
    label: 'Events per day',
    defaultValue: 500,
    unit: 'events/day',
    min: 50,
    max: 10000,
    step: 50,
    evidenceTag: 'Assumption',
    description: 'Average daily digital transaction events passing through merchant tills.',
  },
  minutesPerManualItem: {
    id: 'minutesPerManualItem',
    label: 'Minutes per manual item',
    defaultValue: 10,
    unit: 'min/item',
    min: 1,
    max: 60,
    step: 1,
    evidenceTag: 'Assumption',
    description: 'Staff time required to locate an un-matched transaction across bank and merchant feeds.',
  },
  staffCostPerHourETB: {
    id: 'staffCostPerHourETB',
    label: 'Staff cost per hour',
    defaultValue: 150,
    unit: 'ETB/hr',
    min: 50,
    max: 1000,
    step: 10,
    evidenceTag: 'Assumption',
    description: 'Loaded hourly cost for operational bank reconciliation specialists.',
  },
  complaintSharePercent: {
    id: 'complaintSharePercent',
    label: 'Customer complaint share',
    defaultValue: 20,
    unit: '% of exceptions',
    min: 0,
    max: 100,
    step: 5,
    evidenceTag: 'Assumption',
    description: 'Percentage of reconciliation gaps first identified via merchant or customer inquiry.',
  },
};

export const DEFAULT_MERCHANT_INPUTS: Record<string, ValueLabInputConfig> = {
  salesPerDay: {
    id: 'salesPerDay',
    label: 'Sales per day',
    defaultValue: 80,
    unit: 'sales/day',
    min: 10,
    max: 2000,
    step: 10,
    evidenceTag: 'Assumption',
    description: 'Average customer sales processed at merchant tills across all payment rails.',
  },
  minutesLostPerDispute: {
    id: 'minutesLostPerDispute',
    label: 'Minutes lost per unresolved sale',
    defaultValue: 25,
    unit: 'min/dispute',
    min: 5,
    max: 120,
    step: 5,
    evidenceTag: 'Assumption',
    description: 'Time spent by shop manager matching SMS confirmations with cash register totals.',
  },
};

export const DEFAULT_OPERATOR_INPUTS: Record<string, ValueLabInputConfig> = {
  supportCostPerHourETB: {
    id: 'supportCostPerHourETB',
    label: 'Operator support cost per hour',
    defaultValue: 120,
    unit: 'ETB/hr',
    min: 40,
    max: 800,
    step: 10,
    evidenceTag: 'Assumption',
    description: 'Support technician cost for investigating core switch feed anomalies.',
  },
  fixedMonthlyRunCostETB: {
    id: 'fixedMonthlyRunCostETB',
    label: 'Fixed monthly run cost',
    defaultValue: 15000,
    unit: 'ETB/month',
    min: 2000,
    max: 100000,
    step: 1000,
    evidenceTag: 'Assumption',
    description: 'Server infrastructure, network monitoring, and baseline engineering overhead.',
  },
  pricePerBankPerMonthETB: {
    id: 'pricePerBankPerMonthETB',
    label: 'Simulated price per bank',
    defaultValue: 0,
    unit: 'ETB/month',
    min: 0,
    max: 50000,
    step: 500,
    evidenceTag: 'Assumption',
    description: 'Optional fee tested against bank value ceiling and operator floor.',
  },
  participatingBanksCount: {
    id: 'participatingBanksCount',
    label: 'Participating banks',
    defaultValue: 2,
    unit: 'banks',
    min: 1,
    max: 10,
    step: 1,
    evidenceTag: 'Assumption',
    description: 'Number of sponsoring acquiring banks sharing fixed running costs.',
  },
};

export const SYSTEM_INCLUSION_HYPOTHESES: readonly SystemHypothesis[] = [
  {
    id: 'hyp-1',
    title: 'Cash-Flow Verification for MSME Working Capital',
    hypothesis:
      'Continuous, verified transaction event streams could provide objective digital turnover data to commercial micro-lenders without requiring traditional immovable collateral.',
    prerequisites:
      'Requires statutory data-protection framework, explicit merchant opt-in consent, and a licensed financial lender. Credit decisioning and underwriting are deliberately NOT simulated.',
    evidenceTags: ['Not tested', 'Needs approval'],
  },
  {
    id: 'hyp-2',
    title: 'Merchant & Consumer Acceptance Trust',
    hypothesis:
      'Deterministic timestamped recording and same-day exception triage reduce merchant uncertainty regarding payment receipts, accelerating consumer acceptance of digital QR and SoftPOS rails.',
    prerequisites:
      'Requires multi-bank SLA adherence, automated provider error reporting, and longitudinal merchant adoption field studies.',
    evidenceTags: ['Not tested', 'Needs approval'],
  },
];

export const CHALLENGE_MODE_ROWS: readonly ChallengeRow[] = [
  {
    id: 1,
    challenge: 'Which existing process does the bank pay to fix, and how is its cost verified?',
    demoCanShow: 'Shows the staff hours breakdown and reconciliation effort calculation.',
    cannotShow: 'Confirm whether an individual bank currently budgets or spends this amount.',
    evidenceToAnswer: 'Sponsoring bank finance officer signed baseline of manual reconciliation headcount.',
  },
  {
    id: 2,
    challenge: 'What is the cheapest alternative, including fixing internal operations?',
    demoCanShow: "The 'Bank already solves it' toggle demonstrating value collapse toward zero.",
    cannotShow: 'Price or quantify the internal engineering cost of bank-proprietary batch scripts.',
    evidenceToAnswer: 'Bank internal operations audit comparing core-banking patch costs against layer subscription.',
  },
  {
    id: 3,
    challenge: "Can a read-only event feed reproduce the bank's day-end reconciliation?",
    demoCanShow: 'Statement replay reproduces 100% of matches on deterministic sample data.',
    cannotShow: 'Prove that a real-world core banking feed is legally accessible or data-protection compliant.',
    evidenceToAnswer: 'Written regulatory determination and signed bank data-sharing agreement for read-only access.',
  },
  {
    id: 4,
    challenge: 'Show duplicates, late reversals, unknown outcomes and recovery from a missing feed.',
    demoCanShow: 'All four edge-cases rendered in the exception queue and recovery replay simulated live.',
    cannotShow: 'Dynamic network timeouts, TCP packet drops, or provider core-switch throttling under peak load.',
    evidenceToAnswer: 'Staged pilot replay against recorded production transaction dumps under stress.',
  },
  {
    id: 5,
    challenge: 'How is separation between banks tested?',
    demoCanShow: 'Bank 1 / Bank 2 visibility switch confirming zero Bank 2 records visible to Bank 1.',
    cannotShow: 'Cryptographic multi-tenant penetration test or database row-level security audit.',
    evidenceToAnswer: 'Independent third-party security audit and penetration test report on tenant isolation.',
  },
  {
    id: 6,
    challenge: 'Which negative cases would end this?',
    demoCanShow: 'Three interactive kill-switches (Bank solves it, Merchant copes, Operator floor > ceiling).',
    cannotShow: 'How frequently these negative market conditions occur across commercial banks in the sector.',
    evidenceToAnswer: 'Multi-bank market discovery interviews with commercial acquiring department heads.',
  },
];
