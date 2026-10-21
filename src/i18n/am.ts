import { Translations } from './types';

export const amTranslations: Translations = {
  // Universal notice
  demoBanner: 'የማሳያ መረጃ፣ ምንም የቀጥታ ክፍያ የለም',
  footerDisclaimer: 'ገለልተኛ የህዝብ ምንጭ ማሳያ። የPSS ሥርዓት አይደለም። የPSS፣ የባንክ ወይም የነጋዴ ውሂብ የለም። የናሙና ውሂብ ብቻ።',
  roleSwitcherLabel: 'የማሳያ ሚና መቀየሪያ፣ ማረጋገጫ የለም',
  sampleDataChip: 'የናሙና ውሂብ',
  assumptionChip: 'ግምት',
  notTestedChip: 'ያልተሞከረ',
  needsApprovalChip: 'ፈቃድ ያስፈልገዋል',

  // Nav
  navLedger: 'የክስተት መዝገብ',
  navReconciliation: 'ማስታረቅ እና ልዩነቶች',
  navPOS: 'የካሽየር ተርሚናል',
  navShifts: 'የፈረቃ መዝጊያ',
  navReports: 'ሪፖርቶች',
  navStaff: 'ሰራተኞች እና ኦዲት',
  navAbout: 'ስለ መተማመኛ እና ወሰን',

  // Common
  allTills: 'ሁሉም መመዝገቢያዎች',
  allRails: 'ሁሉም የክፍያ መስመሮች',
  filterByStatus: 'በሁኔታ አጣራ',
  searchPlaceholder: 'መለያ፣ ካሽየር ወይም መመዝገቢያ ፈልግ...',
  refresh: 'አድስ',
  exportCsv: 'CSV ላክ',
  status: 'ሁኔታ',
  time: 'ሰዓት',
  amount: 'መጠን',
  rail: 'የክፍያ መስመር',
  till: 'መመዝገቢያ',
  action: 'ድርጊት',
  close: 'ዝጋ',
  save: 'አስቀምጥ',
  cancel: 'ሰርዝ',
  notes: 'የመፍትሔ ማስታወሻ',
  reason: 'የስረዛ ምክንያት',
  details: 'ዝርዝሮች',

  // Statuses
  statusCaptured: 'በመመዝገቢያ ተመዝግቧል',
  statusAwaitingProvider: 'ተመዝግቧል፣ የአገልግሎት ሰጪ ሪፖርት በመጠበቅ ላይ',
  statusMatched: 'ከሪፖርት ጋር ተመሳክሯል',
  statusException: 'ልዩነት / ያልተጣጣመ',
  statusVoided: 'በተቆጣጣሪ ተሰርዟል',

  // Reconciliation
  reconcileTitle: 'የግብይት ማስታረቅ እና ልዩነቶች',
  reconcileSubtitle: 'የመመዝገቢያ ክስተቶችን ከአቅራቢ እና የባንክ መግለጫዎች ጋር ማዛመድ።',
  matchRate: 'የተዛማጅነት ምጣኔ (Match rate)',
  openExceptions: 'ክፍት ልዩነቶች',
  oldestOpen: 'ረዥም የቆየ ክፍት',
  totalVolume: 'ጠቅላላ የተገመገመ መጠን',
  matchedVolume: 'የተጣጣመ መጠን',
  runMatchingEngine: 'የማጣጣሚያ ፕሮግራሙን አሂድ',
  simulateStatement: 'የገባ መግለጫ አስመስል',

  // Exception classes
  classMatched: 'የተጣጣመ',
  classMissingAtProvider: 'በአቅራቢው ያልተገኘ',
  classMissingAtTill: 'በመመዝገቢያ ያልተገኘ',
  classAmountMismatch: 'የመጠን ልዩነት',
  classDuplicate: 'የተደገመ ግብይት',

  // POS / Cashier
  posTitle: 'የካሽየር ፈጣን መመዝገቢያ',
  enterAmount: 'መጠን አስገባ (ብር)',
  selectRail: 'የክፍያ መስመር ምረጥ',
  recordTransaction: 'ግብይቱን መዝግብ',
  offlineSimulationToggle: 'ከመስመር ውጭ ማስመሰያ',
  offlineQueuedNotice: 'ከመስመር ውጭ ተይዟል — መስመር ሲገናኝ ይላካል',
  replayQueue: 'የተያዙትን አመሳስል',
  recordedAwaitingReport: 'ተመዝግቧል፣ የአገልግሎት ሰጪ ሪፖርት በመጠበቅ ላይ',

  // Shifts
  shiftTitle: 'የፈረቃ መዝጊያ እና የጥሬ ገንዘብ ቆጠራ',
  shiftSubtitle: 'የጥሬ ገንዘብ ቆጠራን ከተመዘገቡ ግብይቶች ጋር ማስታረቅ። ምንም ገንዘብ አያስተላልፍም።',
  openingFloat: 'መነሻ ገንዘብ',
  expectedCash: 'የሚጠበቅ ጥሬ ገንዘብ',
  countedCash: 'የተቆጠረ ጥሬ ገንዘብ',
  cashVariance: 'ልዩነት',
  closeShiftBtn: 'ቆጥረህ ፈረቃ ዝጋ',
  openShiftBtn: 'አዲስ ፈረቃ ክፈት',

  // Reports
  reportsTitle: 'የማስታረቅ እና የክፍያ ትንታኔዎች',
  railMix: 'የክፍያ መስመር ድርሻ (የናሙና ውሂብ)',
  exceptionAgeing: 'የልዩነቶች የዕድሜ ትንተና',
  tillDiscrepancies: 'የልዩነት መጠን በመመዝገቢያ',

  // About
  aboutTitle: 'መተማመኛ፡ የሥነ-ሕንፃ ማሳያ',
  aboutSubtitle: 'የምርምር ጥያቄ ገለልተኛ ማሳያ ("የባንክ ማስታረቂያ ንብርብር ሊሠራ ይችላል? ባንክስ ይከፍልበታል?")። ፕሮፖዛል አይደለም።',
  scopeBoundaryTitle: 'የሥርዓቱ የወሰን ወሰን',
  fourProofGates: 'አራት የቅድመ-ሁኔታ ማረጋገጫዎች',
  proof1Title: '1. ከፋይ የባንክ ገዢ ፍላጎት',
  proof2Title: '2. ቴክኒካዊ እና ሕጋዊ ፈቃድ',
  proof3Title: '3. የፋይናንስ ኦፊሰር የኦዲት ተቀባይነት',
  proof4Title: '4. ገለልተኛ የደህንነት እና የግላዊነት ግምገማ',
  notStarted: 'አልተጀመረም',
  whatIllustrationDoesNotShow: 'ይህ ማሳያ በፍፁም የማያደርጋቸው ነገሮች',
};
