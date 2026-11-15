// Progression sauvegardée dans le navigateur (EXP de chaque Pokémon).
import type { CharacterId } from './model';
import { levelFor, unlockedCards, unlockedRelics } from '../data/unlocks';

const KEY = 'slaypokespyre-save-v1';

export interface SaveData {
  exp: Partial<Record<CharacterId, number>>;
  runs: number;
  /** Personnages jouables (Riolu au départ). */
  characters?: CharacterId[];
}

/** Personnages jouables. `?tous` dans l'adresse les débloque tous (pour tester). */
export function playableCharacters(s: SaveData): CharacterId[] {
  if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('tous')) {
    return ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew'];
  }
  return ['riolu', ...(s.characters ?? []).filter((c) => c !== 'riolu')];
}

/** Débloque les personnages selon la run : gardien de l'acte 1 → Vipélierre, acte 2 → Kangourex, sommet → Caninos. */
export function unlockCharacters(s: SaveData, bosses: number, victory: boolean): CharacterId[] {
  const want: CharacterId[] = [];
  if (bosses >= 1) want.push('vipelierre');
  if (bosses >= 2) want.push('kangourex');
  if (victory && bosses >= 3) want.push('caninos');
  const have = new Set(s.characters ?? []);
  const fresh = want.filter((c) => !have.has(c));
  if (fresh.length) {
    s.characters = [...have, ...fresh];
    writeSave(s);
  }
  return fresh;
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { exp: {}, runs: 0, ...JSON.parse(raw) };
  } catch {
    // stockage indisponible : progression non sauvegardée
  }
  return { exp: {}, runs: 0 };
}

export function writeSave(s: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // stockage indisponible
  }
}

export function characterLevel(s: SaveData, c: CharacterId): number {
  return levelFor(s.exp[c] ?? 0);
}

export function characterUnlocks(s: SaveData, c: CharacterId): string[] {
  if (c !== 'mew') return unlockedCards(c, characterLevel(s, c));
  // Gène ancestral : Mew a ses cartes et celles que chaque personnage a débloquées
  const all: CharacterId[] = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew'];
  return all.flatMap((ch) => unlockedCards(ch, characterLevel(s, ch)));
}

export function characterRelics(s: SaveData, c: CharacterId): string[] {
  return unlockedRelics(c, characterLevel(s, c));
}

/** Ajoute l'EXP d'une run ; renvoie les niveaux gagnés, les cartes et les objets débloqués. */
export function grantExp(s: SaveData, c: CharacterId, gained: number): { before: number; after: number; newCards: string[]; newRelics: string[] } {
  const before = characterLevel(s, c);
  const oldCards = new Set(characterUnlocks(s, c));
  const oldRelics = new Set(characterRelics(s, c));
  s.exp[c] = (s.exp[c] ?? 0) + gained;
  s.runs++;
  writeSave(s);
  const after = characterLevel(s, c);
  return {
    before, after,
    newCards: characterUnlocks(s, c).filter((id) => !oldCards.has(id)),
    newRelics: characterRelics(s, c).filter((id) => !oldRelics.has(id)),
  };
}
