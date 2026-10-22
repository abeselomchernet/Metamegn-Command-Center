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
  navOptions: 'አማራጮች',

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

  // Options Explorer
  optionsFixedTopLine: 'አማራጭ B ለመፈተሽ የመጀመሪያው መላምት ነው። የትኛውም አማራጭ አልተመረጠም። አራቱ ማረጋገጫዎች እስካልተገኙ እና ጥብቅ የሕግ፣ የደህንነት እና የንግድ በሮች እስካልተላለፉ ድረስ የትኛውም ሊመረጥ አይችልም። ጠንካራ በሮች የትኛውንም ውጤት ይሽራሉ።',
  optionsTitle: 'የአማራጮች አሳሽ፡ አምስቱ ክፍት የተደረጉ ስትራቴጂካዊ መንገዶች',
  optionsSubtitle: 'በምርምር ዘዴው ስር አምስቱን የሥነ-ሕንፃ አማራጮች ጎን ለጎን ማሳየት፡ አራት ማረጋገጫዎች፣ አምስት አማራጮች፣ አንድ በር።',
  optionsFootnote: 'አምስቱም በተመሳሳይ ወሰን እና በተመሳሳይ የጊዜ መሠረት ይነጻጸራሉ። የመጀመሪያ ደረጃ የማጣሪያ ውጤቶች በምርምሩ ውስጥ ነበሩ፣ ነገር ግን እነሱ ፍርድ እንጂ ማስረጃ አይደሉም፣ እና ሆን ተብሎ እዚህ አልታዩም።',
  currentStanceLabel: 'የአሁን አቋም',
  couldWinLabel: 'ሊያሸንፍ የሚችለው...',
  wouldStopLabel: 'ሊቆም የሚችለው...',
  demoShowsLabel: 'ይህ ማሳያ የሚያሳየው',
  whatWouldTestItLabel: 'ምን ሊፈትሸው ይችላል',
  whatCouldChangeTitle: 'ሁኔታውን ምን ሊለውጠው ይችላል',
  fourProofsTitle: 'ማንኛውም ወጪ ከመደረጉ በፊት አራቱ ማረጋገጫዎች',
  fourProofsAppliesTo: 'ለሁሉም አምስት አማራጮች ተፈጻሚ ይሆናል',
  oneGateBarTitle: 'አራቱም ማረጋገጫዎች እስካልተገኙ ድረስ ምንም የቀጥታ ሙከራ፣ ግዥ ወይም ካፒታል አይኖርም።',
  hardGatesOverride: 'ጠንካራ በሮች የትኛውንም ውጤት ይሽራሉ።',
  compareOptions: '2 አማራጮችን አወዳድር',
  selectOptionPrompt: 'የሚነጻጸር አማራጭ ምረጥ...',
  walkthroughStart: 'አስጎብኘኝ',
  walkthroughNext: 'ቀጣይ አማራጭ',
  walkthroughPrev: 'ቀዳሚ',
  walkthroughClose: 'ጉብኝቱን ዝጋ (Esc)',

  // Gate stages
  gateStageScreening: 'ማጣራት',
  gateStageFeasibility: 'የአዋጭነት በር',
  gateStageValidation: 'ከምርት ውጭ ማረጋገጫ',
  gateStagePilot: 'የቀጥታ ሙከራ በር',
  gateStageScale: 'የማስፋፊያ በር',

  // Conditions
  condition1: 'አሁን ያለው የክፍያ ምርት በምርት ደረጃ ውጤታማ ከሆነ እና ባንክ ለማስፋፊያ ከፈረመ፣ ከዚያ C ለመፈተሽ የመጀመሪያው አማራጭ ይሆናል።',
  condition2: 'የማስታረቅ ችግሩ በአባል ባንኮች ዘንድ አስቀድሞ ከተፈታ፣ ከዚያ B ዝቅ ይላል።',
  condition3: 'የአጋር አጠቃላይ ወጪ ግዴታዎች እየተጠበቁ ግንባታን ካሸነፈ፣ ከዚያ D ለመፈተሽ የመጀመሪያው አማራጭ ይሆናል።',
  condition4: 'ማንኛውም ባንክ ተደጋጋሚ ክፍያዎችን ካልፈቀደ እና አዎንታዊ አስተዋጽኦ ከሌለ፣ ከዚያ E ለመፈተሽ የመጀመሪያው አማራጭ ይሆናል።',
  condition5: 'ቢያንስ ሁለት ባንኮች የጋራ ሞዱላር ኢኮኖሚክስ ከፈረሙ፣ ከዚያ ወደ A የሚወስደው ደረጃ በደረጃ መንገድ እንደገና ይታሰባል።',

  // v4: Navigation & States
  navValueLab: 'የእሴት ላብራቶሪ',
  statusInitiated: 'INITIATED',
  statusPending: 'PENDING',
  statusConfirmed: 'CONFIRMED',
  statusFailed: 'FAILED',
  statusReversed: 'REVERSED',
  statusNeedsReconciliation: 'NEEDS_RECONCILIATION',

  // v4: Exception classes
  classLateReversal: 'የዘገየ ስረዛ (Late Reversal)',
  classUnknownOutcome: 'ያልታወቀ ውጤት (Unknown Outcome)',

  // v4: Bank scope & Feed recovery
  bankScopeLabel: 'የባንክ ወሰን እይታ',
  bankScopeAll: 'ሁሉም ባንኮች (የተጠቃለለ)',
  bankScopeBank1: 'እንደ ባንክ 1 እይ',
  bankScopeBank2: 'እንደ ባንክ 2 እይ',
  bankScopeBank3: 'እንደ ባንክ 3 እይ',
  bankScopeSeparationTest: 'የባንኮች መለያየት ማረጋገጫ',
  feedDownSwitch: 'የአቅራቢ መረጃ መቆራረጥ ማስመሰያ',
  feedDownActiveNotice: 'የአቅራቢ መረጃ ተቋርጧል፡ የሂሳብ መግለጫ ረድፎች ቆመዋል። ግብይቶች በ PENDING ሁኔታ ላይ እየተጠራቀሙ ነው።',
  feedNormalNotice: 'የአቅራቢ መረጃ በመስመር ላይ ነው፡ መግለጫዎች በመደበኛነት እየደረሱ ነው።',
  feedReplayCatchup: 'መረጃውን መልስ እና አቻችይ',

  // v4: Value Lab
  valueLabTitle: 'የእሴት ላብራቶሪ፡ ማስመሰል እና ስሜታዊነት',
  valueLabSubtitle: 'ኢኮኖሚያዊ መካኒኮች እና "ምን ማመን ይጠበቅብዎታል" የተመጣጣኝ ትንተና።',
  valueLabTopLine: 'በቦታ ያዥ ግብዓቶች ላይ የተመሰረተ ማስመሰል። ውጤቶችን እና ስሜታዊነትን ያሳያል እንጂ ማንም እንደሚገዛ ማረጋገጫ አይደለም። ማንኛውንም መደምደሚያ ከማድረግዎ በፊት እያንዳንዱን ቦታ ያዥ በተለካ አሃዝ ይተኩ።',
  valueLabHonestLimit: 'በናሙና ውሂብ ላይ የተመሰረተ ማስመሰል ማንም ሰው እንደሚገዛ ማሳየት አይችልም። ከመካኒኮች የሚከተሉ ውጤቶችን፣ ለግብዓቶች ያለውን ስሜታዊነት እና በቃለ መጠይቅ ወቅት የትኞቹ መለካት እንዳለባቸው ያሳያል።',
  tabBankLens: 'የባንክ መነጽር',
  tabMerchantLens: 'የነጋዴ መነጽር',
  tabOperatorLens: 'የኦፕሬተር መነጽር',
  tabSystemLens: 'የሥርዓት እና ማካተት መነጽር',
  bankLensHeading: 'ባንኩ ምን ያገኛል?',
  bankAlreadySolvesItLabel: 'ባንኩ በውስጥ አሠራሩ አስቀድሞ ፈትቶታል',
  bankAlreadySolvesItNote: 'የባንኩ የራሱ ሂደት ቀድሞውኑ ጥሩ ከሆነ፣ የሚገዛ ምንም ነገር የለም።',
  merchantLensHeading: 'ነጋዴው ምን ያገኛል?',
  merchantAlreadyCopesLabel: 'ነጋዴው ቀድሞውኑ ይቋቋማል (የወረቀት ደብተር፣ ጥቂት አለመግባባቶች)',
  merchantAlreadyCopesNote: 'ነጋዴው የሚያተርፈው መዝገቡ የታመነ፣ ቀላል እና ከሚያድነው ጊዜ ያነሰ ወጪ የሚያስወጣ ከሆነ ብቻ ነው።',
  operatorLensHeading: 'ኦፕሬተሩ ምን ይሸከማል?',
  operatorSwitchingValue: 'የመቀያየሪያ እሴት ትንተና',
  operatorZeroBankMonths: 'ባንክ ባልፈረመባቸው ወራት የተጠራቀመ ወጪ',
  systemLensHeading: 'ከተዋዋይ ወገኖች ባሻገር ምን ሊለወጥ ይችላል?',
  systemInclusionLimitNote: 'ማካተት ትኩረት የመስጠት ምክንያት ነው እንጂ ማሳያው ሊያሳየው የሚችል ውጤት አይደለም።',
  challengeModeTitle: 'ይህ እንዴት ስህተት ሊሆን ይችላል (የፈተና ሁነታ)',
  challengeModeFooter: 'አሉታዊ ግኝቶች ይመዘገባሉ እንጂ በፍጹም አይገለሉም።',
};
