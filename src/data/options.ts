/**
 * Options data module for Metamegn Command Center v3.
 * Represents five strategic architectural options kept open under the research methodology.
 * No scoring, weighting, ranking, rating, or preferred flags.
 */

export interface OptionDemoLink {
  label: string;
  to: string;
}

export interface OptionRecord {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  name: string;
  description: string;
  stance: string;
  couldWin: string;
  wouldStop: string;
  demoShows: string;
  demoLinks?: OptionDemoLink[];
  whatWouldTestIt: string[];
}

export interface ProofGateItem {
  id: string;
  title: string;
  description: string;
  appliesTo: string;
  status: 'Not started';
}

export interface GateStageItem {
  id: string;
  name: string;
  status: 'Not started';
}

export interface ChangeConditionItem {
  id: number;
  condition: string;
  targetOption: string;
}

export const OPTIONS_FIXED_TOP_LINE =
  'Option B is the first hypothesis to test. No option is chosen. None can be chosen until the four proofs exist and the hard legal, security and commercial gates are passed. Hard gates override any score.';

export const OPTIONS_METHODOLOGY_FOOTNOTE =
  'All five are compared on the same scope and the same time basis. Early screening scores existed in the research, but they are judgement, not evidence, and are deliberately not shown here.';

export const ONE_GATE_RULE =
  'No live pilot, procurement or capital until all four proofs exist.';

export const HARD_GATES_OVERRIDE_LINE =
  'Hard gates override any score.';

export const OPTIONS_DATA: readonly OptionRecord[] = [
  {
    id: 'A',
    name: 'Full suite',
    description: 'Several banks show demand across modules, with reusable assets and positive stressed economics.',
    stance: 'Not to be selected as the first funded delivery. A later architecture target only if staged modules pay for themselves.',
    couldWin: 'Several banks show demand across modules, with reusable assets and positive stressed economics.',
    wouldStop: 'Compound regulatory burden; unproven adoption; large capital need.',
    demoShows: 'Nothing beyond the screens listed under B.',
    whatWouldTestIt: [
      'Do several banks budget for one common service catalogue?',
      'Is component reuse verified?',
    ],
  },
  {
    id: 'B',
    name: 'Operate + Connect first',
    description: 'Banks fund measurable reconciliation and adapter value at a price the operator can sustain.',
    stance: 'First hypothesis to test, subject to a bank buyer who will pay and proof that existing systems can be reused.',
    couldWin: 'Banks fund measurable reconciliation and adapter value at a price the operator can sustain.',
    wouldStop: 'Banks already solve it cheaply; data feeds unusable; one-off custom costs.',
    demoShows: 'Ledger, reconciliation and exceptions, offline capture, shift close. Links to those screens.',
    demoLinks: [
      { label: 'Event Ledger', to: '/ledger' },
      { label: 'Reconciliation', to: '/reconcile' },
      { label: 'Cashier POS', to: '/pos' },
      { label: 'Shifts', to: '/shifts' },
    ],
    whatWouldTestIt: [
      'Will a bank pay for Operate + Connect?',
      'Are current reconciliation and exception costs material?',
      'Is a bank adapter reusable, or is every bank a custom build?',
    ],
  },
  {
    id: 'C',
    name: 'Existing-product-led',
    description: 'The existing stack is ready, authorised and cheaper to grow.',
    stance: 'A real comparator. Needs production economics, device and scheme readiness.',
    couldWin: 'The existing stack is ready, authorised and cheaper to grow.',
    wouldStop: 'Certification or device limits; weak incremental margin.',
    demoShows: 'The card-tap rail only, as a sample.',
    whatWouldTestIt: [
      'Does the existing product create a commercial wedge: enough qualifying cards, devices and merchant use?',
    ],
  },
  {
    id: 'D',
    name: 'Partner-managed',
    description: 'A vendor offers better total cost, risk transfer and exit terms.',
    stance: 'A mandatory comparator. Do not assume building is better than buying.',
    couldWin: 'A vendor offers better total cost, risk transfer and exit terms.',
    wouldStop: 'Hidden dependency, weak data control, FX and renewal costs.',
    demoShows: 'Nothing. The adapter seam shows where a partner feed would plug in.',
    whatWouldTestIt: [
      'Can a partner-led service beat a build on total cost over a common multi-year period, including rights, exit and data?',
    ],
  },
  {
    id: 'E',
    name: 'No new platform',
    description: 'Improving current operations beats a new service on a like-for-like comparison.',
    stance: 'A legitimate outcome, not a failed programme.',
    couldWin: 'Improving current operations beats a new service on a like-for-like comparison.',
    wouldStop: 'A validated bank need cannot be met within current operations.',
    demoShows: 'Nothing. This is a valid outcome.',
    whatWouldTestIt: [
      'Does improving current operations beat a new service on a like-for-like comparison?',
    ],
  },
];

export const FOUR_PROOFS: readonly ProofGateItem[] = [
  {
    id: 'proof-customer',
    title: 'Customer Proof',
    description: 'A bank buyer with budget authority, a measured baseline, and credible willingness to pay.',
    appliesTo: 'Applies to all five options',
    status: 'Not started',
  },
  {
    id: 'proof-tech-legal',
    title: 'Technical and Legal Proof',
    description: 'Permitted interfaces, tested controls, confirmed licence, scheme and data-protection scope.',
    appliesTo: 'Applies to all five options',
    status: 'Not started',
  },
  {
    id: 'proof-commercial-finance',
    title: 'Commercial and Finance Proof',
    description: 'Costs and revenue a finance officer accepts, stressed cash flows, all five options compared on the same basis.',
    appliesTo: 'Applies to all five options',
    status: 'Not started',
  },
  {
    id: 'proof-independent-review',
    title: 'Independent Review Proof',
    description: 'A reviewer outside the project challenges the evidence and signs an opinion with its limits.',
    appliesTo: 'Applies to all five options',
    status: 'Not started',
  },
];

export const GATE_STAGES: readonly GateStageItem[] = [
  { id: 'stage-1', name: 'Screening', status: 'Not started' },
  { id: 'stage-2', name: 'Feasibility gate', status: 'Not started' },
  { id: 'stage-3', name: 'Non-production validation', status: 'Not started' },
  { id: 'stage-4', name: 'Live pilot gate', status: 'Not started' },
  { id: 'stage-5', name: 'Scale gate', status: 'Not started' },
];

export const WHAT_COULD_CHANGE_THE_PICTURE: readonly ChangeConditionItem[] = [
  {
    id: 1,
    condition: 'If the existing acceptance product is production-efficient and a bank signs for expansion, then C becomes the first option to test.',
    targetOption: 'C',
  },
  {
    id: 2,
    condition: 'If the reconciliation problem is already solved at member banks, then B is downgraded.',
    targetOption: 'B',
  },
  {
    id: 3,
    condition: 'If a partner\'s total cost beats a build while obligations stay covered, then D becomes the first option to test.',
    targetOption: 'D',
  },
  {
    id: 4,
    condition: 'If no bank commits recurring fees and there is no positive contribution, then E becomes the first option to test.',
    targetOption: 'E',
  },
  {
    id: 5,
    condition: 'If at least two banks sign common modular economics, then a phased path to A is reconsidered.',
    targetOption: 'A',
  },
];
