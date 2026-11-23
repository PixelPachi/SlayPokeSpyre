// Progression sauvegardée dans le navigateur (EXP de chaque Pokémon).
import type { CharacterId } from './model';
import { levelFor, unlockedCards, unlockedRelics } from '../data/unlocks';
import { SKINS, type SkinDef, type SkinStat } from '../data/skins';

const KEY = 'slaypokespyre-save-v1';

export interface SaveData {
  exp: Partial<Record<CharacterId, number>>;
  runs: number;
  /** Personnages jouables (Riolu au départ). */
  characters?: CharacterId[];
  /** Pokédex : n° des Pokémon croisés en combat, et de ceux croisés en chromatique. */
  seen?: number[];
  seenShiny?: number[];
  /** Statistiques cumulées sur toutes les runs, par personnage (objectifs des skins). */
  stats?: Partial<Record<CharacterId, Partial<Record<SkinStat, number>>>>;
  /** Skin choisi pour chaque personnage. */
  skins?: Partial<Record<CharacterId, string>>;
  /** Gardiens vaincus par personnage (ids). */
  beaten?: Partial<Record<CharacterId, string[]>>;
  /** Les 5 dernières parties (la plus récente en premier). */
  history?: RunRecord[];
}

export interface RunRecord {
  date: number;
  character: CharacterId;
  form: string;
  skin?: string;
  victory: boolean;
  floor: number;
  act: number;
  zone: string;
  /** Pokémon du dernier combat (ceux qui t'ont mis K.O. en cas de défaite). */
  killedBy: { name: string; dex: number }[];
  deck: { id: string; up: boolean }[];
  relics: string[];
  berries: string[];
  exp: number;
  seed: string;
  maxHp: number;
}

export function addHistory(s: SaveData, r: RunRecord): void {
  s.history = [r, ...(s.history ?? [])].slice(0, 5);
  writeSave(s);
}

export function statOf(s: SaveData, c: CharacterId, stat: SkinStat): number {
  return s.stats?.[c]?.[stat] ?? 0;
}

/** Gardiens déjà vaincus avec ce personnage (toutes runs confondues). */
export function beatenBosses(s: SaveData, c: CharacterId): string[] {
  return s.beaten?.[c] ?? [];
}

/** Progression d'un skin : [fait, objectif]. */
export function skinProgress(s: SaveData, c: CharacterId, skin: SkinDef): [number, number] {
  const k = skin.kills ? Math.min(skin.kills.goal, statOf(s, c, `ko-${skin.kills.type}`)) : 0;
  const kg = skin.kills?.goal ?? 0;
  if (skin.bosses) return [skin.bosses.filter((b) => beatenBosses(s, c).includes(b)).length + k, skin.bosses.length + kg];
  return [Math.min(skin.goal, statOf(s, c, skin.stat)), skin.goal];
}

/** Détail lisible de la progression d'un skin (gardiens et K.O. par type). */
export function skinDetail(s: SaveData, c: CharacterId, skin: SkinDef): string {
  const parts: string[] = [];
  if (skin.maxMoney) parts.push(`record ${Math.min(skin.maxMoney, statOf(s, c, 'maxMoney'))}/${skin.maxMoney} ₽`);
  if (skin.bosses?.length) parts.push(`gardiens ${skin.bosses.filter((b) => beatenBosses(s, c).includes(b)).length}/${skin.bosses.length}`);
  if (skin.kills) parts.push(`K.O. ${Math.min(skin.kills.goal, statOf(s, c, `ko-${skin.kills.type}`))}/${skin.kills.goal}`);
  if (!parts.length) { const [n, g] = skinProgress(s, c, skin); return `${n}/${g}`; }
  return parts.join(', ');
}

export function skinUnlocked(s: SaveData, c: CharacterId, skin: SkinDef): boolean {
  const [n, goal] = skinProgress(s, c, skin);
  return n >= goal;
}

/** Skin porté (seulement s'il est débloqué). */
export function equippedSkin(s: SaveData, c: CharacterId): string | undefined {
  const id = s.skins?.[c];
  const def = SKINS[c]?.find((k) => k.id === id);
  return def && skinUnlocked(s, c, def) ? id : undefined;
}

export function equipSkin(s: SaveData, c: CharacterId, id: string | undefined): void {
  s.skins = { ...s.skins, [c]: id };
  writeSave(s);
}

/** Ajoute les statistiques d'une run ; renvoie les skins qui viennent d'être débloqués. */
export function recordRunStats(s: SaveData, c: CharacterId, add: Partial<Record<SkinStat, number>>, bossIds: string[] = []): SkinDef[] {
  const before = (SKINS[c] ?? []).filter((k) => skinUnlocked(s, c, k)).map((k) => k.id);
  const cur = { ...s.stats?.[c] };
  for (const [k, v] of Object.entries(add)) cur[k as SkinStat] = k === 'maxMoney' ? Math.max(cur.maxMoney ?? 0, v ?? 0) : (cur[k as SkinStat] ?? 0) + (v ?? 0);
  s.stats = { ...s.stats, [c]: cur };
  s.beaten = { ...s.beaten, [c]: [...new Set([...beatenBosses(s, c), ...bossIds])] };
  writeSave(s);
  return (SKINS[c] ?? []).filter((k) => skinUnlocked(s, c, k) && !before.includes(k.id));
}

const RUN_KEY = 'slaypokespyre-run-v1';

/** Sauvegarde automatique de la run en cours. */
export function saveRun(data: unknown): void {
  try {
    localStorage.setItem(RUN_KEY, JSON.stringify(data));
  } catch {
    // stockage indisponible
  }
}

export function loadRunData(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearRun(): void {
  try {
    localStorage.removeItem(RUN_KEY);
  } catch {
    // stockage indisponible
  }
}

/** Note les Pokémon croisés (Glossaire). */
export function recordEncounter(s: SaveData, list: { dex: number; shiny: boolean }[]): void {
  const seen = new Set(s.seen ?? []);
  const shiny = new Set(s.seenShiny ?? []);
  let changed = false;
  for (const e of list) {
    if (!seen.has(e.dex)) { seen.add(e.dex); changed = true; }
    if (e.shiny && !shiny.has(e.dex)) { shiny.add(e.dex); changed = true; }
  }
  if (!changed) return;
  s.seen = [...seen];
  s.seenShiny = [...shiny];
  writeSave(s);
}

/** Fichier de sauvegarde complet (progression + run en cours), pour l'exporter ou l'importer. */
export function exportAll(s: SaveData): string {
  return JSON.stringify({ game: 'SlayPokeSpyre', version: 1, date: new Date().toISOString(), save: s, run: loadRunData() }, null, 1);
}

export function importAll(text: string): boolean {
  try {
    const d = JSON.parse(text);
    if (d.game !== 'SlayPokeSpyre' || !d.save) return false;
    localStorage.setItem(KEY, JSON.stringify(d.save));
    if (d.run) localStorage.setItem(RUN_KEY, JSON.stringify(d.run));
    else localStorage.removeItem(RUN_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Rappel pour les écrans qui veulent noter une rencontre sans connaître la sauvegarde. */
export const saveHooks: { encounter?: (list: { dex: number; shiny: boolean }[]) => void } = {};

/** Personnages jouables. `?tous` dans l'adresse les débloque tous (pour tester). */
export function playableCharacters(s: SaveData): CharacterId[] {
  if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('tous')) {
    return ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew', 'quelorior'];
  }
  return ['riolu', ...(s.characters ?? []).filter((c) => c !== 'riolu')];
}

/** Débloque les personnages : gardien de l'acte 1 → Vipélierre, acte 2 → Kangourex, sommet atteint → Caninos, Dialga Primal apaisé → Mew. */
export function unlockCharacters(s: SaveData, bosses: number, victory: boolean, arceus = false): CharacterId[] {
  const want: CharacterId[] = [];
  if (bosses >= 1) want.push('vipelierre');
  if (bosses >= 2) want.push('kangourex');
  if (bosses >= 3) want.push('caninos'); // atteindre le sommet
  if (victory) want.push('mew'); // apaiser Dialga Primal
  if (arceus) want.push('quelorior'); // vaincre Arceus dans la Salle Originelle
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
  const all: CharacterId[] = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew', 'quelorior'];
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
