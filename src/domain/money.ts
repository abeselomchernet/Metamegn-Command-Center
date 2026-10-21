/**
 * Money domain logic using integer minor units (ETB cents).
 * 1 ETB = 100 cents.
 * Prevents floating-point rounding issues in multi-event reconciliation.
 */

export interface Money {
  cents: number;
  currency: 'ETB';
}

/**
 * Creates a Money object from an integer amount in cents.
 */
export const fromCents = (cents: number): Money => {
  return {
    cents: Math.round(cents),
    currency: 'ETB',
  };
};

/**
 * Creates a Money object from major units (ETB birr).
 * Example: fromMajor(25.50) -> { cents: 2550, currency: 'ETB' }
 */
export const fromMajor = (birr: number): Money => {
  return {
    cents: Math.round(birr * 100),
    currency: 'ETB',
  };
};

/**
 * Converts Money to major unit floating number for charting/display.
 */
export const toMajor = (money: Money | number): number => {
  const cents = typeof money === 'number' ? money : money.cents;
  return cents / 100;
};

/**
 * Unified money formatter for ETB.
 * Always renders with two decimal places and tabular numerals.
 * Example: formatETB(125050) -> "ETB 1,250.50"
 */
export const formatETB = (amount: Money | number, options?: { showCurrency?: boolean }): string => {
  const cents = typeof amount === 'number' ? amount : amount.cents;
  const major = cents / 100;
  const formatted = major.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (options?.showCurrency === false) {
    return formatted;
  }
  return `ETB ${formatted}`;
};

/**
 * Safe integer addition of multiple Money items or cent numbers.
 */
export const addMoney = (...items: (Money | number)[]): Money => {
  const totalCents = items.reduce<number>((sum, item) => {
    const val = typeof item === 'number' ? item : item.cents;
    return sum + val;
  }, 0);
  return fromCents(totalCents);
};

/**
 * Safe integer subtraction (a - b).
 */
export const subtractMoney = (a: Money | number, b: Money | number): Money => {
  const centsA = typeof a === 'number' ? a : a.cents;
  const centsB = typeof b === 'number' ? b : b.cents;
  return fromCents(centsA - centsB);
};

/**
 * Computes variance between counted and expected (counted - expected).
 */
export const calculateVariance = (countedCents: number, expectedCents: number): {
  varianceCents: number;
  isOver: boolean;
  isShort: boolean;
  isBalanced: boolean;
} => {
  const varianceCents = countedCents - expectedCents;
  return {
    varianceCents,
    isOver: varianceCents > 0,
    isShort: varianceCents < 0,
    isBalanced: varianceCents === 0,
  };
};
