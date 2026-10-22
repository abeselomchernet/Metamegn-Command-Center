import { Translations } from './types';

export const enTranslations: Translations = {
  // Universal notice
  demoBanner: 'Demo data, no live payments',
  footerDisclaimer: 'Independent public-source illustration. Not a PSS system. No PSS, bank or merchant data. Sample data only.',
  roleSwitcherLabel: 'Demo role switcher, no authentication',
  sampleDataChip: 'Sample data',
  assumptionChip: 'Assumption',
  notTestedChip: 'Not tested',
  needsApprovalChip: 'Needs approval',

  // Nav
  navLedger: 'Event Ledger',
  navReconciliation: 'Reconciliation',
  navPOS: 'Cashier POS',
  navShifts: 'Shifts & Registers',
  navReports: 'Reports',
  navStaff: 'Staff & Audit',
  navAbout: 'About & Scope',
  navOptions: 'Options',

  // Common
  allTills: 'All Tills',
  allRails: 'All Rails',
  filterByStatus: 'Filter status',
  searchPlaceholder: 'Search reference, cashier, or till...',
  refresh: 'Refresh Feed',
  exportCsv: 'Export CSV',
  status: 'Status',
  time: 'Time',
  amount: 'Amount',
  rail: 'Rail',
  till: 'Till',
  action: 'Action',
  close: 'Close',
  save: 'Save',
  cancel: 'Cancel',
  notes: 'Resolution Notes',
  reason: 'Reason for Void',
  details: 'Details',

  // Statuses
  statusCaptured: 'Recorded at till',
  statusAwaitingProvider: 'Recorded, awaiting provider report',
  statusMatched: 'Matched with report',
  statusException: 'Discrepancy / Exception',
  statusVoided: 'Voided by supervisor',

  // Reconciliation
  reconcileTitle: 'Reconciliation & Exceptions',
  reconcileSubtitle: 'Matching merchant till captures against asynchronous provider statements and bank settlement rows.',
  matchRate: 'Match rate',
  openExceptions: 'Open Exceptions',
  oldestOpen: 'Oldest Open',
  totalVolume: 'Total Evaluated Volume',
  matchedVolume: 'Reconciled Volume',
  runMatchingEngine: 'Re-run Matching Engine',
  simulateStatement: 'Simulate Inbound Statement',

  // Exception classes
  classMatched: 'Matched',
  classMissingAtProvider: 'Missing at Provider',
  classMissingAtTill: 'Missing at Till',
  classAmountMismatch: 'Amount Mismatch',
  classDuplicate: 'Duplicate Detected',

  // POS / Cashier
  posTitle: 'Cashier Fast Capture Terminal',
  enterAmount: 'Enter Amount (ETB)',
  selectRail: 'Select Payment Rail',
  recordTransaction: 'Record Transaction',
  offlineSimulationToggle: 'Offline Simulation Mode',
  offlineQueuedNotice: 'Queued offline — will sync when connected',
  replayQueue: 'Sync & Replay Offline Queue',
  recordedAwaitingReport: 'Recorded, awaiting provider report',

  // Shifts
  shiftTitle: 'Register Shifts & Cash Handover',
  shiftSubtitle: 'Cash count reconciliation against recorded ledger events. Zero fund custody or transfer.',
  openingFloat: 'Opening Float',
  expectedCash: 'Expected Cash',
  countedCash: 'Counted Cash',
  cashVariance: 'Variance',
  closeShiftBtn: 'Count & Close Shift',
  openShiftBtn: 'Open New Shift',

  // Reports
  reportsTitle: 'Reconciliation & Rail Analytics',
  railMix: 'Payment Rail Mix (Sample Data)',
  exceptionAgeing: 'Exception Ageing Breakdown',
  tillDiscrepancies: 'Discrepancy Rate by Till',

  // About
  aboutTitle: 'Acceptance 360: Architectural Illustration',
  aboutSubtitle: 'An independent illustration of a research question ("Could a bank-scoped transaction reconciliation layer work, and would a bank pay for it?").',
  scopeBoundaryTitle: 'Architectural Scope Boundary',
  fourProofGates: 'The Four Proof Gates (Prerequisites Before Any Real Use)',
  proof1Title: '1. Bank Buyer Commitment',
  proof2Title: '2. Technical & Legal Authorization',
  proof3Title: '3. Financial Officer Audit Acceptance',
  proof4Title: '4. Independent Security & Privacy Review',
  notStarted: 'Not started',
  whatIllustrationDoesNotShow: 'What This Illustration Strictly Does Not Do',

  // Options Explorer
  optionsFixedTopLine: 'Option B is the first hypothesis to test. No option is chosen. None can be chosen until the four proofs exist and the hard legal, security and commercial gates are passed. Hard gates override any score.',
  optionsTitle: 'Options Explorer: Five Strategic Paths Kept Open',
  optionsSubtitle: 'Illustrating five architectural options side-by-side under the research method: four proofs, five options, one gate.',
  optionsFootnote: 'All five are compared on the same scope and the same time basis. Early screening scores existed in the research, but they are judgement, not evidence, and are deliberately not shown here.',
  currentStanceLabel: 'Current stance',
  couldWinLabel: 'It could win if...',
  wouldStopLabel: 'It would stop if...',
  demoShowsLabel: 'What this demo shows',
  whatWouldTestItLabel: 'What would test it',
  whatCouldChangeTitle: 'What could change the picture',
  fourProofsTitle: 'Four proofs before any money is spent',
  fourProofsAppliesTo: 'Applies to all five options',
  oneGateBarTitle: 'No live pilot, procurement or capital until all four proofs exist.',
  hardGatesOverride: 'Hard gates override any score.',
  compareOptions: 'Compare 2 Options',
  selectOptionPrompt: 'Select option to compare...',
  walkthroughStart: 'Walk me through it',
  walkthroughNext: 'Next option',
  walkthroughPrev: 'Previous',
  walkthroughClose: 'Close tour (Esc)',

  // Gate stages
  gateStageScreening: 'Screening',
  gateStageFeasibility: 'Feasibility gate',
  gateStageValidation: 'Non-production validation',
  gateStagePilot: 'Live pilot gate',
  gateStageScale: 'Scale gate',

  // Conditions
  condition1: 'If the existing acceptance product is production-efficient and a bank signs for expansion, then C becomes the first option to test.',
  condition2: 'If the reconciliation problem is already solved at member banks, then B is downgraded.',
  condition3: 'If a partner\'s total cost beats a build while obligations stay covered, then D becomes the first option to test.',
  condition4: 'If no bank commits recurring fees and there is no positive contribution, then E becomes the first option to test.',
  condition5: 'If at least two banks sign common modular economics, then a phased path to A is reconsidered.',

  // v4: Navigation & States
  navValueLab: 'Value Lab',
  statusInitiated: 'INITIATED',
  statusPending: 'PENDING',
  statusConfirmed: 'CONFIRMED',
  statusFailed: 'FAILED',
  statusReversed: 'REVERSED',
  statusNeedsReconciliation: 'NEEDS_RECONCILIATION',

  // v4: Exception classes
  classLateReversal: 'Late Reversal',
  classUnknownOutcome: 'Unknown Outcome',

  // v4: Bank scope & Feed recovery
  bankScopeLabel: 'Bank Scope View',
  bankScopeAll: 'All Banks (Aggregated)',
  bankScopeBank1: 'View as Bank 1',
  bankScopeBank2: 'View as Bank 2',
  bankScopeBank3: 'View as Bank 3',
  bankScopeSeparationTest: 'Multi-Bank Separation Verification',
  feedDownSwitch: 'Provider Feed Down Simulator',
  feedDownActiveNotice: 'Provider feed is DOWN: statement rows halted. Events accumulating in PENDING status.',
  feedNormalNotice: 'Provider feed is ONLINE: statements arriving normally.',
  feedReplayCatchup: 'Restore Feed & Replay Catch-up',

  // v4: Value Lab
  valueLabTitle: 'Value Lab: Simulation & Sensitivity',
  valueLabSubtitle: 'Economic mechanics and "what you would have to believe" break-even analysis.',
  valueLabTopLine: 'A simulation on placeholder inputs. It shows effects and sensitivity, not proof that anyone will pay. Replace every placeholder with a measured figure before drawing any conclusion.',
  valueLabHonestLimit: 'A simulation on sample data cannot show that anyone will buy. It shows effects that follow from the mechanics, sensitivity to inputs, and which numbers must be measured in field interviews.',
  tabBankLens: 'Bank Lens',
  tabMerchantLens: 'Merchant Lens',
  tabOperatorLens: 'Operator Lens',
  tabSystemLens: 'System & Inclusion Lens',
  bankLensHeading: 'What Does the Bank Get?',
  bankAlreadySolvesItLabel: 'Bank already solves it internally',
  bankAlreadySolvesItNote: "If the bank's own process is already good, there is nothing to buy.",
  merchantLensHeading: 'What Does the Merchant Get?',
  merchantAlreadyCopesLabel: 'Merchant already copes (paper register, few disputes)',
  merchantAlreadyCopesNote: 'The merchant gains only if the record is trusted, simple and costs less than the time it saves.',
  operatorLensHeading: 'What Does the Operator Carry?',
  operatorSwitchingValue: 'Switching Value Analysis',
  operatorZeroBankMonths: 'Cost Accrual in Zero-Bank Runway Months',
  systemLensHeading: 'What Could Change Beyond the Parties?',
  systemInclusionLimitNote: 'Inclusion is the reason to care, not an outcome the demo can show.',
  challengeModeTitle: 'How This Could Be Wrong (Challenge Mode)',
  challengeModeFooter: 'Negative findings are recorded, never excluded.',
};
