import { Translations } from './types';

export const omTranslations: Translations = {
  // Universal notice
  demoBanner: 'Oodeeffannoo demoo, kaffaltiin kallattii hin jiru',
  footerDisclaimer: 'Fakkiisa burqaa uummataa walaba. Sirna PSS miti. Daataan PSS, baankii ykn daldalaa hin jiru. Daataa fakkeenyaa qofa.',
  roleSwitcherLabel: 'Jijjiirraa gahee demoo, mirkaneessi hin jiru',
  sampleDataChip: 'Daataa fakkeenyaa',
  assumptionChip: 'Tilmaama',
  notTestedChip: 'Hin qoramne',
  needsApprovalChip: 'Hayyama barbaada',

  // Nav
  navLedger: 'Galmee Gochaa',
  navReconciliation: 'Araara & Garaagarummaa',
  navPOS: 'Kaashiyera POS',
  navShifts: 'Cufiinsa Garee',
  navReports: 'Gabaasaalee',
  navStaff: 'Hojjattoota & Odiitii',
  navAbout: 'Waa\'ee & Daangaa',
  navOptions: 'Filannoowwan',

  // Common
  allTills: 'Galmeessitoota Hunda',
  allRails: 'Karaalee Kaffaltii Hunda',
  filterByStatus: 'Haalaan calali',
  searchPlaceholder: 'Eenyummaa, kaashiyera ykn galmeessaa barbaadi...',
  refresh: 'Haaromsi',
  exportCsv: 'CSV Baasi',
  status: 'Haala',
  time: 'Yeroo',
  amount: 'Hanga',
  rail: 'Karaa Kaffaltii',
  till: 'Galmeessaa',
  action: 'Tarkaanfii',
  close: 'Cufi',
  save: 'Olkaa\'i',
  cancel: 'Dhiisi',
  notes: 'Yaada Furmaataa',
  reason: 'Sababa Haquu',
  details: 'Bal\'ina',

  // Statuses
  statusCaptured: 'Galmeessaatti qabame',
  statusAwaitingProvider: 'Qabameera, gabaasa dhiyeessaa eegaa jira',
  statusMatched: 'Gabaasa wajjin wal simate',
  statusException: 'Garaagarummaa / Adda bahe',
  statusVoided: 'To\'ataadhaan haqame',

  // Reconciliation
  reconcileTitle: 'Araara & Garaagarummaa Kaffaltii',
  reconcileSubtitle: 'Kaffaltii galmeessaa gabaasa dhiyeessitootaa fi baankii wajjin walsimsiisuu.',
  matchRate: 'Reetii walsimannaa (Match rate)',
  openExceptions: 'Garaagarummaa Banaa',
  oldestOpen: 'Isa Dheeraa Ture',
  totalVolume: 'Hanga Waliigalaa Qoratame',
  matchedVolume: 'Hanga Walsimate',
  runMatchingEngine: 'Piroogiraamii Walsimsiisaa Hojjechiisi',
  simulateStatement: 'Ibsa Galii Fakkisi',

  // Exception classes
  classMatched: 'Walsimate',
  classMissingAtProvider: 'Dhiyeessaa biratti hin argamne',
  classMissingAtTill: 'Galmeessaa biratti hin argamne',
  classAmountMismatch: 'Garaagarummaa Hanga',
  classDuplicate: 'Irra Deebiin Qabame',

  // POS / Cashier
  posTitle: 'Terminaala Qabiinsa Saffisaa',
  enterAmount: 'Hanga Galchi (ETB)',
  selectRail: 'Karaa Kaffaltii Filadhu',
  recordTransaction: 'Kaffaltii Galmeessi',
  offlineSimulationToggle: 'Haala Sararaan Alaa',
  offlineQueuedNotice: 'Sararaan alatti qabame — yeroo sararri deebi\'u ergama',
  replayQueue: 'Kanneen Qabaman Walsimsiisi',
  recordedAwaitingReport: 'Qabameera, gabaasa dhiyeessaa eegaa jira',

  // Shifts
  shiftTitle: 'Cufiinsa Garee & Lakkoofsa Maallaqaa',
  shiftSubtitle: 'Lakkoofsa maallaqaa harkaa gochoota galmaa\'an wajjin walsimsiisuu. Maallaqa hin dabarsu.',
  openingFloat: 'Maallaqa Jalqabaa',
  expectedCash: 'Maallaqa Eegamu',
  countedCash: 'Maallaqa Lakkaa\'ame',
  cashVariance: 'Garaagarummaa',
  closeShiftBtn: 'Lakkaa\'ii Garee Cufi',
  openShiftBtn: 'Garee Haaraa Bani',

  // Reports
  reportsTitle: 'Xiinxala Araara & Karaalee Kaffaltii',
  railMix: 'Qooda Karaalee Kaffaltii (Daataa Fakkeenyaa)',
  exceptionAgeing: 'Umurii Garaagarummaa Kaffaltii',
  tillDiscrepancies: 'Reetii Garaagarummaa Galmeessaan',

  // About
  aboutTitle: 'Acceptance 360: Fakkiisa Ijaaramaa',
  aboutSubtitle: 'Fakkiisa gaaffii qorannoo walaba ("Sirni araara baankii hojjechuu danda\'aa, baankiin maallaqa kaffalaafii?").',
  scopeBoundaryTitle: 'Daangaa Ijaarama Sirnaa',
  fourProofGates: 'Mirkaneessitoota Bu\'uuraa Afur',
  proof1Title: '1. Fedhii Baankii Bituu',
  proof2Title: '2. Hayyama Teeknikaa fi Seeraa',
  proof3Title: '3. Fudhatama Odiitii Oofisara Faayinaansii',
  proof4Title: '4. Qorannoo Nageenyaa fi Dhuunfaa Walaba',
  notStarted: 'Hin eegalle',
  whatIllustrationDoesNotShow: 'Wanta Fakkiisni Kun Gonkumaa Hin Hojjenne',

  // Options Explorer
  optionsFixedTopLine: 'Filannoon B yaalii duraa qoratamuu dha. Filannoon kamiyyuu hin filatamne. Mirkaneessitoonni afuran utuu hin argamin fi karraan seeraa, nageenyaa fi daldalaa utuu hin darbamin kamiyyuu filatamuu hin danda\'u. Karrawwan jajjaboon bu\'aa kamiyyuu caalu.',
  optionsTitle: 'Sakatta\'aa Filannoowwanii: Karaalee Tarsiimoo Banaa Ta\'an Shan',
  optionsSubtitle: 'Mala qorannoo jalatti filannoowwan ijaaramaa shan cinaa cinaan agarsiisuu: mirkaneessitoota afur, filannoowwan shan, karra tokko.',
  optionsFootnote: 'Shananuu daangaa wal-fakkaataa fi yeroo wal-fakkaataa irratti wal-bira qabamu. Qabxiileen calallii jalqabaa qorannicha keessa turan, garuu isaan murtii malee ragaa miti, ta\'e jedhamee asitti hin agarsiifamne.',
  currentStanceLabel: 'Dhaabbii ammaa',
  couldWinLabel: 'Moo\'achuu kan danda\'u...',
  wouldStopLabel: 'Dhaabbachuu kan danda\'u...',
  demoShowsLabel: 'Agarsiisni kun kan inni agarsiisu',
  whatWouldTestItLabel: 'Wanti isa qoru maal',
  whatCouldChangeTitle: 'Wanti haalicha jijjiiruu danda\'u',
  fourProofsTitle: 'Maallaqni kamiyyuu baasii ta\'uun dura mirkaneessitoota afur',
  fourProofsAppliesTo: 'Filannoowwan shanan hundaaf ni hojjeta',
  oneGateBarTitle: 'Mirkaneessitoonni arfan hundi utuu hin argamin yaaliin kallattii, bittaa ykn kaappitaalli hin jiru.',
  hardGatesOverride: 'Karrawwan jajjaboon bu\'aa kamiyyuu caalu.',
  compareOptions: 'Filannoowwan 2 Wal-bira Qabi',
  selectOptionPrompt: 'Filannoo wal-bira qabamu filadhu...',
  walkthroughStart: 'Na daawwachiisi',
  walkthroughNext: 'Filannoo itti-aanu',
  walkthroughPrev: 'Kan duraa',
  walkthroughClose: 'Daawwannaa cufi (Esc)',

  // Gate stages
  gateStageScreening: 'Calallii',
  gateStageFeasibility: 'Karra dandeettii raawwii',
  gateStageValidation: 'Mirkaneessa oomishaan alaa',
  gateStagePilot: 'Karra yaalii kallattii',
  gateStageScale: 'Karra bal\'isuu',

  // Conditions
  condition1: 'Oomishni kaffaltii jiru oomisha irratti bu\'a-qabeessa ta\'ee baankiin babal\'inaaf yoo mallatteesse, C filannoo jalqaba qoratamuu ta\'a.',
  condition2: 'Rakkon araara kaffaltii baankota miseensa biratti duraan kan furame yoo ta\'e, B gadi bu\'a.',
  condition3: 'Baasiin waliigalaa miiltoo dirqamoonni eegamaa ijaarsa yoo moo\'ate, D filannoo jalqaba qoratamuu ta\'a.',
  condition4: 'Baankiin kamiyyuu kaffaltii irra-deebii yoo hin committed fi gumaachi gaariin yoo hin jirre, E filannoo jalqaba qoratamuu ta\'a.',
  condition5: 'Yoo xiqqaate baankonni lama diinagdee moojulaaraa waloo yoo mallatteessan, karaan sadarkaan gara A deemamu deebisamee ilaalama.',
};
