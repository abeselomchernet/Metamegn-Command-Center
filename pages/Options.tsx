import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  OPTIONS_DATA,
  FOUR_PROOFS,
  GATE_STAGES,
  WHAT_COULD_CHANGE_THE_PICTURE,
  OPTIONS_FIXED_TOP_LINE,
  OPTIONS_METHODOLOGY_FOOTNOTE,
  ONE_GATE_RULE,
  HARD_GATES_OVERRIDE_LINE,
  OptionRecord,
} from '../src/data/options';
import { EvidenceChip } from '../src/ui/EvidenceChip';
import { useTranslation } from '../src/i18n/I18nContext';
import {
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const Options: React.FC = () => {
  const { t } = useTranslation();

  // Mobile compare mode state (starts with NO option pre-selected)
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedOptionId1, setSelectedOptionId1] = useState<string>('');
  const [selectedOptionId2, setSelectedOptionId2] = useState<string>('');

  // Presenter Walkthrough Tour state
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Keyboard controls for tour (Escape to close, Left/Right arrows to step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (tourStep === null) return;

      if (e.key === 'Escape') {
        setTourStep(null);
      } else if (e.key === 'ArrowRight') {
        setTourStep((prev) => (prev !== null && prev < 5 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setTourStep((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tourStep]);

  const opt1 = OPTIONS_DATA.find((o) => o.id === selectedOptionId1);
  const opt2 = OPTIONS_DATA.find((o) => o.id === selectedOptionId2);

  const getConditionText = (id: number): string => {
    switch (id) {
      case 1:
        return t.condition1;
      case 2:
        return t.condition2;
      case 3:
        return t.condition3;
      case 4:
        return t.condition4;
      case 5:
        return t.condition5;
      default:
        return '';
    }
  };

  const getGateStageName = (id: string, defaultName: string): string => {
    switch (id) {
      case 'stage-1':
        return t.gateStageScreening || defaultName;
      case 'stage-2':
        return t.gateStageFeasibility || defaultName;
      case 'stage-3':
        return t.gateStageValidation || defaultName;
      case 'stage-4':
        return t.gateStagePilot || defaultName;
      case 'stage-5':
        return t.gateStageScale || defaultName;
      default:
        return defaultName;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Fixed Top Line in neutral banner */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed font-medium shadow-xs">
        <p>{OPTIONS_FIXED_TOP_LINE}</p>
      </div>

      {/* Screen-reader live region for tour announcement */}
      <div className="sr-only" aria-live="polite">
        {tourStep !== null && (
          tourStep < 5
            ? `Tour step ${tourStep + 1} of 6: Option ${OPTIONS_DATA[tourStep].id} - ${OPTIONS_DATA[tourStep].name}`
            : 'Tour step 6 of 6: Four Proofs and Gate Strip'
        )}
      </div>

      {/* 2. Header with Tour Action and Mobile Compare Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t.optionsTitle}</h1>
            <EvidenceChip status="Assumption" detail="Research method" />
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">{t.optionsSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Mobile compare toggle button */}
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              isCompareMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>{t.compareOptions}</span>
          </button>

          {/* Presenter Walkthrough Tour button */}
          <button
            onClick={() => setTourStep(tourStep === null ? 0 : null)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              tourStep !== null
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <HelpCircle size={14} className="text-slate-500" />
            <span>{tourStep !== null ? t.walkthroughClose : t.walkthroughStart}</span>
          </button>
        </div>
      </div>

      {/* Tour Controller Banner (when active) */}
      {tourStep !== null && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-bold">
              Stop {tourStep + 1} of 6
            </span>
            <span className="font-medium text-slate-200">
              {tourStep < 5
                ? `Focus: Option ${OPTIONS_DATA[tourStep].id} (${OPTIONS_DATA[tourStep].name})`
                : 'Focus: The Four Proofs & Hard Gate Strip'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={tourStep === 0}
              onClick={() => setTourStep((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded font-medium flex items-center gap-1"
            >
              <ChevronLeft size={13} />
              <span>{t.walkthroughPrev}</span>
            </button>
            <button
              disabled={tourStep === 5}
              onClick={() => setTourStep((prev) => (prev !== null && prev < 5 ? prev + 1 : prev))}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded font-medium flex items-center gap-1"
            >
              <span>{t.walkthroughNext}</span>
              <ChevronRight size={13} />
            </button>
            <button
              onClick={() => setTourStep(null)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              title="Close tour (Esc)"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Mobile Compare Mode View (Starts with NO options pre-selected) */}
      {isCompareMode && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t.compareOptions}
              </h2>
              <p className="text-[11px] text-slate-500">
                Pick any two options to inspect side-by-side without implied ranking.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedOptionId1('');
                setSelectedOptionId2('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Reset Selection
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dropdown 1 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Select Option 1
              </label>
              <select
                value={selectedOptionId1}
                onChange={(e) => setSelectedOptionId1(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-slate-900"
              >
                <option value="">-- {t.selectOptionPrompt} --</option>
                {OPTIONS_DATA.map((opt) => (
                  <option key={`opt1-${opt.id}`} value={opt.id}>
                    Option {opt.id}: {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown 2 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Select Option 2
              </label>
              <select
                value={selectedOptionId2}
                onChange={(e) => setSelectedOptionId2(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-slate-900"
              >
                <option value="">-- {t.selectOptionPrompt} --</option>
                {OPTIONS_DATA.map((opt) => (
                  <option key={`opt2-${opt.id}`} value={opt.id}>
                    Option {opt.id}: {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards Render */}
          {(!opt1 && !opt2) ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No options selected yet. Choose any two options above to compare their stance, triggers, and questions side by side.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[opt1, opt2].map((opt, idx) => (
                <div
                  key={opt ? opt.id : `empty-${idx}`}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs"
                >
                  {opt ? (
                    <>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-bold text-slate-900 text-sm">
                          Option {opt.id}: {opt.name}
                        </span>
                        <EvidenceChip status="Assumption" detail="Strategy" />
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                          {t.currentStanceLabel}
                        </span>
                        <p className="text-slate-700 italic">{opt.stance}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                          {t.couldWinLabel}
                        </span>
                        <p className="text-slate-600">{opt.couldWin}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                          {t.wouldStopLabel}
                        </span>
                        <p className="text-slate-600">{opt.wouldStop}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                          {t.demoShowsLabel}
                        </span>
                        <p className="text-slate-600">{opt.demoShows}</p>
                        {opt.demoLinks && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {opt.demoLinks.map((link) => (
                              <Link
                                key={link.to}
                                to={link.to}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] font-medium"
                              >
                                <span>{link.label}</span>
                                <ExternalLink size={10} />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-0.5">
                          {t.whatWouldTestItLabel}
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                          {opt.whatWouldTestIt.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      Select an option in dropdown above to compare here.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Five Equal-Width Columns Grid (Identical Layout & Neutral Colors for A through E) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
        {OPTIONS_DATA.map((opt, index) => {
          const isHighlightedInTour = tourStep === index;
          return (
            <div
              key={opt.id}
              className={`bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3.5 transition-all duration-150 ${
                isHighlightedInTour
                  ? 'ring-2 ring-slate-800 border-transparent shadow-md'
                  : 'border border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Option Tag & Title */}
                <div className="pb-2.5 border-b border-slate-100 flex items-start justify-between gap-1">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                      Option {opt.id}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">
                      {opt.name}
                    </h2>
                  </div>
                  <EvidenceChip status="Assumption" detail="Model" className="text-[10px] px-1.5 py-0" />
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-normal">
                  {opt.description}
                </p>

                {/* Current Stance */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] leading-snug">
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px] mb-1">
                    {t.currentStanceLabel}
                  </span>
                  <p className="text-slate-800 italic">
                    "{opt.stance}"
                  </p>
                </div>

                {/* Could Win If */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-800 block text-[11px]">
                    {t.couldWinLabel}
                  </span>
                  <p className="text-slate-600 leading-normal">
                    {opt.couldWin}
                  </p>
                </div>

                {/* Would Stop If */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-800 block text-[11px]">
                    {t.wouldStopLabel}
                  </span>
                  <p className="text-slate-600 leading-normal">
                    {opt.wouldStop}
                  </p>
                </div>

                {/* What This Demo Shows */}
                <div className="text-xs space-y-1 pt-1 border-t border-slate-100">
                  <span className="font-bold text-slate-800 block text-[11px]">
                    {t.demoShowsLabel}
                  </span>
                  <p className="text-slate-600 leading-normal">
                    {opt.demoShows}
                  </p>

                  {/* Inline Links for Option B */}
                  {opt.demoLinks && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {opt.demoLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium border border-slate-200 transition-colors"
                        >
                          <span>{link.label}</span>
                          <ExternalLink size={10} className="text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* What Would Test It (Questions Only) */}
              <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">
                    {t.whatWouldTestItLabel}
                  </span>
                  <EvidenceChip status="Assumption" detail="Inquiry" className="text-[9px] px-1 py-0" />
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] leading-tight">
                  {opt.whatWouldTestIt.map((q, qIdx) => (
                    <li key={qIdx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Early Screening Footnote */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 italic">
        {OPTIONS_METHODOLOGY_FOOTNOTE}
      </div>

      {/* 6. What Could Change the Picture Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t.whatCouldChangeTitle}</h2>
            <p className="text-xs text-slate-500">
              Conditions that would change which option is tested first (no ranking, no arrows)
            </p>
          </div>
          <EvidenceChip status="Assumption" detail="Pivot triggers" />
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {WHAT_COULD_CHANGE_THE_PICTURE.map((item) => (
            <div key={item.id} className="py-2.5 flex items-start gap-3">
              <span className="font-mono text-slate-400 font-bold shrink-0 mt-0.5">
                ({item.id})
              </span>
              <p className="text-slate-700 leading-normal">
                {getConditionText(item.id)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Four Proofs Before Any Money Is Spent Panel */}
      <div
        className={`bg-white border rounded-xl p-5 shadow-xs space-y-4 transition-all duration-150 ${
          tourStep === 5 ? 'ring-2 ring-slate-800 border-transparent shadow-md' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t.fourProofsTitle}</h2>
            <p className="text-xs text-slate-500">
              Prerequisites required before any live capital, procurement, or pilot
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {t.fourProofsAppliesTo}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FOUR_PROOFS.map((proof) => (
            <div
              key={proof.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900">{proof.title}</h3>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {proof.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{proof.appliesTo}</span>
                <span className="px-2 py-0.5 rounded font-mono font-medium bg-slate-200 text-slate-700">
                  {proof.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 8. One Gate Bar & Five Gate Stages Strip */}
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
          {/* Neutral Gate Bar */}
          <div className="p-3 rounded-lg border border-slate-300 bg-slate-100/80 text-center text-xs font-semibold text-slate-800 shadow-inner">
            {ONE_GATE_RULE}
          </div>

          {/* Five Gate Stages Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center text-xs">
            {GATE_STAGES.map((stage, sIdx) => (
              <div
                key={stage.id}
                className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col items-center justify-center space-y-1"
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Stage {sIdx + 1}
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {getGateStageName(stage.id, stage.name)}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded font-mono bg-slate-200 text-slate-600">
                  {stage.status}
                </span>
              </div>
            ))}
          </div>

          {/* Hard Gates Override Any Score Line */}
          <div className="text-center text-xs text-slate-500 font-medium pt-1">
            {HARD_GATES_OVERRIDE_LINE}
          </div>
        </div>
      </div>
    </div>
  );
};
