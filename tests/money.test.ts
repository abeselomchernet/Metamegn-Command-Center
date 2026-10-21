import { describe, it, expect } from 'vitest';
import {
  fromCents,
  fromMajor,
  toMajor,
  formatETB,
  addMoney,
  subtractMoney,
  calculateVariance,
} from '../src/domain/money';

describe('Money Domain & Minor Units Arithmetic', () => {
  it('converts major units to minor integer cents without rounding errors', () => {
    const m1 = fromMajor(12.5);
    expect(m1.cents).toBe(1250);
    expect(m1.currency).toBe('ETB');

    const m2 = fromMajor(0.01);
    expect(m2.cents).toBe(1);

    const m3 = fromMajor(1450.75);
    expect(m3.cents).toBe(145075);
  });

  it('converts minor cents back to major units', () => {
    expect(toMajor(1250)).toBe(12.5);
    expect(toMajor(fromCents(9900))).toBe(99.0);
  });

  it('formats ETB amounts consistently with two decimals and tabular formatting', () => {
    expect(formatETB(145000)).toBe('ETB 1,450.00');
    expect(formatETB(50)).toBe('ETB 0.50');
    expect(formatETB(fromCents(12345678))).toBe('ETB 123,456.78');
    expect(formatETB(100000, { showCurrency: false })).toBe('1,000.00');
  });

  it('adds and subtracts multiple money amounts using safe integers', () => {
    const sum = addMoney(1000, 2550, 450);
    expect(sum.cents).toBe(4000);

    const diff = subtractMoney(5000, 1250);
    expect(diff.cents).toBe(3750);
  });

  it('computes register cash variance correctly', () => {
    // Balanced
    const v1 = calculateVariance(200000, 200000);
    expect(v1.varianceCents).toBe(0);
    expect(v1.isBalanced).toBe(true);
    expect(v1.isOver).toBe(false);
    expect(v1.isShort).toBe(false);

    // Over (+50 ETB)
    const v2 = calculateVariance(205000, 200000);
    expect(v2.varianceCents).toBe(5000);
    expect(v2.isOver).toBe(true);
    expect(v2.isBalanced).toBe(false);

    // Short (-100 ETB)
    const v3 = calculateVariance(190000, 200000);
    expect(v3.varianceCents).toBe(-10000);
    expect(v3.isShort).toBe(true);
    expect(v3.isBalanced).toBe(false);
  });
});
