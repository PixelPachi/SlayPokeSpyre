// Hasard avec graine : la même graine donne toujours la même run (utile pour tester et reproduire un bug).

export class Rng {
  private state: number;

  constructor(seed: string) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    this.state = h >>> 0;
  }

  /** État interne (pour sauvegarder une run et la reprendre exactement). */
  get snapshot(): number {
    return this.state;
  }

  set snapshot(v: number) {
    this.state = v >>> 0;
  }

  /** Nombre entre 0 (inclus) et 1 (exclu). */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Entier entre min et max inclus. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(list: readonly T[]): T {
    return list[Math.floor(this.next() * list.length)];
  }

  shuffle<T>(list: T[]): T[] {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  /** Tirage pondéré. */
  weighted<T extends { weight: number }>(list: readonly T[]): T {
    const total = list.reduce((s, x) => s + x.weight, 0);
    let r = this.next() * total;
    for (const x of list) {
      r -= x.weight;
      if (r < 0) return x;
    }
    return list[list.length - 1];
  }
}

export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
