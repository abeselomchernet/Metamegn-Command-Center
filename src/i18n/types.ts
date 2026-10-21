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
}
