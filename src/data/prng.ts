/**
 * Deterministic PRNG using Mulberry32 algorithm.
 * Guarantees zero Math.random() in mock data generation.
 */

export class DeterministicPRNG {
  private state: number;

  constructor(seed: number = 42819) {
    this.state = seed;
  }

  /**
   * Generates a pseudo-random floating point number in [0, 1).
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates integer between min and max inclusive.
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Picks an item from an array deterministically.
   */
  pick<T>(items: readonly T[] | T[]): T {
    const idx = this.nextInt(0, items.length - 1);
    return items[idx];
  }
}

export const defaultPRNG = new DeterministicPRNG(1337);
