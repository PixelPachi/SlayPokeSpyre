// Progression sauvegardée dans le navigateur (EXP de chaque Pokémon).
import type { CharacterId } from './model';
import { levelFor, unlockedCards } from '../data/unlocks';

const KEY = 'slaypokespyre-save-v1';

export interface SaveData {
  exp: Partial<Record<CharacterId, number>>;
  runs: number;
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
  return unlockedCards(c, characterLevel(s, c));
}

/** Ajoute l'EXP d'une run ; renvoie les niveaux gagnés et les cartes débloquées. */
export function grantExp(s: SaveData, c: CharacterId, gained: number): { before: number; after: number; newCards: string[] } {
  const before = characterLevel(s, c);
  const oldCards = new Set(characterUnlocks(s, c));
  s.exp[c] = (s.exp[c] ?? 0) + gained;
  s.runs++;
  writeSave(s);
  const after = characterLevel(s, c);
  return { before, after, newCards: characterUnlocks(s, c).filter((id) => !oldCards.has(id)) };
}
