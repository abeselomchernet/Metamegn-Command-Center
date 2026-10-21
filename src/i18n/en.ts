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
};
