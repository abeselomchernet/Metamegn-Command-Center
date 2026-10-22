import { describe, it, expect } from 'vitest';
import {
  OPTIONS_DATA,
  FOUR_PROOFS,
  GATE_STAGES,
  WHAT_COULD_CHANGE_THE_PICTURE,
  OPTIONS_FIXED_TOP_LINE,
  HARD_GATES_OVERRIDE_LINE,
  ONE_GATE_RULE,
} from '../src/data/options';
import { enTranslations } from '../src/i18n/en';
import { amTranslations } from '../src/i18n/am';
import { omTranslations } from '../src/i18n/om';

describe('Options Explorer Data and Invariants', () => {
  it('contains exactly five options with IDs A through E in order', () => {
    expect(OPTIONS_DATA).toHaveLength(5);
    const ids = OPTIONS_DATA.map((o) => o.id);
    expect(ids).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('guarantees every option has non-empty required fields and at least one inquiry question', () => {
    OPTIONS_DATA.forEach((opt) => {
      expect(opt.name.trim().length).toBeGreaterThan(0);
      expect(opt.description.trim().length).toBeGreaterThan(0);
      expect(opt.stance.trim().length).toBeGreaterThan(0);
      expect(opt.couldWin.trim().length).toBeGreaterThan(0);
      expect(opt.wouldStop.trim().length).toBeGreaterThan(0);
      expect(opt.demoShows.trim().length).toBeGreaterThan(0);
      expect(opt.whatWouldTestIt.length).toBeGreaterThanOrEqual(1);
      opt.whatWouldTestIt.forEach((q) => {
        expect(q.trim().length).toBeGreaterThan(0);
        // Questions should end with a question mark
        expect(q.endsWith('?')).toBe(true);
      });
    });
  });

  it('preserves exact brief wording for "What this demo shows" across all options', () => {
    const optA = OPTIONS_DATA.find((o) => o.id === 'A')!;
    const optB = OPTIONS_DATA.find((o) => o.id === 'B')!;
    const optC = OPTIONS_DATA.find((o) => o.id === 'C')!;
    const optD = OPTIONS_DATA.find((o) => o.id === 'D')!;
    const optE = OPTIONS_DATA.find((o) => o.id === 'E')!;

    expect(optA.demoShows).toBe('Nothing beyond the screens listed under B.');
    expect(optB.demoShows).toBe('Ledger, reconciliation and exceptions, offline capture, shift close. Links to those screens.');
    expect(optB.demoLinks).toBeDefined();
    expect(optB.demoLinks!.length).toBe(4);
    expect(optC.demoShows).toBe('The card-tap rail only, as a sample.');
    expect(optD.demoShows).toBe('Nothing. The adapter seam shows where a partner feed would plug in.');
    expect(optE.demoShows).toBe('Nothing. This is a valid outcome.');
  });

  it('ensures Option E has identical keys, structure, and equal visual weight as Options A-D', () => {
    const optA = OPTIONS_DATA.find((o) => o.id === 'A')!;
    const optE = OPTIONS_DATA.find((o) => o.id === 'E')!;

    const baseKeys = Object.keys(optA).sort();
    const eKeys = Object.keys(optE).sort();

    expect(eKeys).toEqual(baseKeys);
    expect(optE.name).toBe('No new platform');
    expect(optE.stance).toBe('A legitimate outcome, not a failed programme.');
  });

  it('enforces anti-bias data invariants: zero scoring, rating, ranking, or preferred properties', () => {
    const prohibitedKeys = ['score', 'weight', 'rank', 'rating', 'recommended', 'preferred', 'winner', 'points'];

    OPTIONS_DATA.forEach((opt) => {
      const keys = Object.keys(opt);
      prohibitedKeys.forEach((prohibited) => {
        expect(keys).not.toContain(prohibited);
      });
    });
  });

  it('asserts the exact required fixed top line and hard gates override statement', () => {
    expect(OPTIONS_FIXED_TOP_LINE).toBe(
      'Option B is the first hypothesis to test. No option is chosen. None can be chosen until the four proofs exist and the hard legal, security and commercial gates are passed. Hard gates override any score.'
    );
    expect(HARD_GATES_OVERRIDE_LINE).toBe('Hard gates override any score.');
    expect(ONE_GATE_RULE).toBe('No live pilot, procurement or capital until all four proofs exist.');
  });

  it('asserts all four proofs exist and each has status "Not started"', () => {
    expect(FOUR_PROOFS).toHaveLength(4);
    FOUR_PROOFS.forEach((proof) => {
      expect(proof.title.trim().length).toBeGreaterThan(0);
      expect(proof.description.trim().length).toBeGreaterThan(0);
      expect(proof.status).toBe('Not started');
      expect(proof.appliesTo).toBe('Applies to all five options');
    });
  });

  it('asserts all five gate stages exist in sequential order with status "Not started"', () => {
    expect(GATE_STAGES).toHaveLength(5);
    const expectedStages = [
      'Screening',
      'Feasibility gate',
      'Non-production validation',
      'Live pilot gate',
      'Scale gate',
    ];

    GATE_STAGES.forEach((stage, idx) => {
      expect(stage.name).toBe(expectedStages[idx]);
      expect(stage.status).toBe('Not started');
    });
  });

  it('contains exactly five pivot condition sentences mapped to target options', () => {
    expect(WHAT_COULD_CHANGE_THE_PICTURE).toHaveLength(5);
    const targetOptions = WHAT_COULD_CHANGE_THE_PICTURE.map((c) => c.targetOption);
    expect(targetOptions).toEqual(['C', 'B', 'D', 'E', 'A']);
  });
});

describe('Options Explorer Translations Parity (English, Amharic, Afaan Oromoo)', () => {
  const requiredKeys = [
    'optionsFixedTopLine',
    'optionsTitle',
    'optionsSubtitle',
    'optionsFootnote',
    'currentStanceLabel',
    'couldWinLabel',
    'wouldStopLabel',
    'demoShowsLabel',
    'whatWouldTestItLabel',
    'whatCouldChangeTitle',
    'fourProofsTitle',
    'fourProofsAppliesTo',
    'oneGateBarTitle',
    'hardGatesOverride',
    'compareOptions',
    'selectOptionPrompt',
    'walkthroughStart',
    'walkthroughNext',
    'walkthroughPrev',
    'walkthroughClose',
    'gateStageScreening',
    'gateStageFeasibility',
    'gateStageValidation',
    'gateStagePilot',
    'gateStageScale',
    'condition1',
    'condition2',
    'condition3',
    'condition4',
    'condition5',
  ] as const;

  it('guarantees all option translation keys exist and are non-empty in English', () => {
    requiredKeys.forEach((key) => {
      expect(enTranslations[key]).toBeDefined();
      expect(typeof enTranslations[key]).toBe('string');
      expect(enTranslations[key].trim().length).toBeGreaterThan(0);
    });
  });

  it('guarantees all option translation keys exist and are non-empty in Amharic', () => {
    requiredKeys.forEach((key) => {
      expect(amTranslations[key]).toBeDefined();
      expect(typeof amTranslations[key]).toBe('string');
      expect(amTranslations[key].trim().length).toBeGreaterThan(0);
    });
  });

  it('guarantees all option translation keys exist and are non-empty in Afaan Oromoo', () => {
    requiredKeys.forEach((key) => {
      expect(omTranslations[key]).toBeDefined();
      expect(typeof omTranslations[key]).toBe('string');
      expect(omTranslations[key].trim().length).toBeGreaterThan(0);
    });
  });
});
