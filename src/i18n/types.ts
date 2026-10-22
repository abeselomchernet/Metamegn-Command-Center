export type Locale = 'en' | 'am' | 'om';

export interface Translations {
  // Common & Universal notice
  demoBanner: string;
  footerDisclaimer: string;
  roleSwitcherLabel: string;
  sampleDataChip: string;
  assumptionChip: string;
  notTestedChip: string;
  needsApprovalChip: string;

  // Nav
  navLedger: string;
  navReconciliation: string;
  navPOS: string;
  navShifts: string;
  navReports: string;
  navStaff: string;
  navAbout: string;
  navOptions: string;

  // Common verbs & terms
  allTills: string;
  allRails: string;
  filterByStatus: string;
  searchPlaceholder: string;
  refresh: string;
  exportCsv: string;
  status: string;
  time: string;
  amount: string;
  rail: string;
  till: string;
  action: string;
  close: string;
  save: string;
  cancel: string;
  notes: string;
  reason: string;
  details: string;

  // Statuses
  statusCaptured: string;
  statusAwaitingProvider: string;
  statusMatched: string;
  statusException: string;
  statusVoided: string;

  // Reconciliation
  reconcileTitle: string;
  reconcileSubtitle: string;
  matchRate: string;
  openExceptions: string;
  oldestOpen: string;
  totalVolume: string;
  matchedVolume: string;
  runMatchingEngine: string;
  simulateStatement: string;

  // Exception classes
  classMatched: string;
  classMissingAtProvider: string;
  classMissingAtTill: string;
  classAmountMismatch: string;
  classDuplicate: string;

  // POS / Cashier
  posTitle: string;
  enterAmount: string;
  selectRail: string;
  recordTransaction: string;
  offlineSimulationToggle: string;
  offlineQueuedNotice: string;
  replayQueue: string;
  recordedAwaitingReport: string;

  // Shifts
  shiftTitle: string;
  shiftSubtitle: string;
  openingFloat: string;
  expectedCash: string;
  countedCash: string;
  cashVariance: string;
  closeShiftBtn: string;
  openShiftBtn: string;

  // Reports
  reportsTitle: string;
  railMix: string;
  exceptionAgeing: string;
  tillDiscrepancies: string;

  // About
  aboutTitle: string;
  aboutSubtitle: string;
  scopeBoundaryTitle: string;
  fourProofGates: string;
  proof1Title: string;
  proof2Title: string;
  proof3Title: string;
  proof4Title: string;
  notStarted: string;
  whatIllustrationDoesNotShow: string;

  // Options Explorer
  optionsFixedTopLine: string;
  optionsTitle: string;
  optionsSubtitle: string;
  optionsFootnote: string;
  currentStanceLabel: string;
  couldWinLabel: string;
  wouldStopLabel: string;
  demoShowsLabel: string;
  whatWouldTestItLabel: string;
  whatCouldChangeTitle: string;
  fourProofsTitle: string;
  fourProofsAppliesTo: string;
  oneGateBarTitle: string;
  hardGatesOverride: string;
  compareOptions: string;
  selectOptionPrompt: string;
  walkthroughStart: string;
  walkthroughNext: string;
  walkthroughPrev: string;
  walkthroughClose: string;

  // Gate stages
  gateStageScreening: string;
  gateStageFeasibility: string;
  gateStageValidation: string;
  gateStagePilot: string;
  gateStageScale: string;

  // Conditions
  condition1: string;
  condition2: string;
  condition3: string;
  condition4: string;
  condition5: string;
}
