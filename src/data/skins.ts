// Skins des personnages : à débloquer avec des objectifs qui se cumulent sur plusieurs runs.
import type { CharacterId } from '../core/model';

export type SkinStat = 'shinies' | 'elites' | 'bosses' | 'combats' | 'wins';

export interface SkinDef {
  id: string;
  name: string;
  /** Statistique cumulée (avec ce personnage) et objectif à atteindre. */
  stat: SkinStat;
  goal: number;
  goalText: string;
  /** Gardiens à vaincre avec ce personnage (ids d'ennemis) : remplace la statistique. */
  bosses?: string[];
  /** Formes qui ont un sprite pour ce skin (n° du Pokédex). */
  dex?: number[];
}

const shiny = (stat: SkinStat, goal: number, goalText: string): SkinDef => ({ id: 'shiny', name: 'Chromatique', stat, goal, goalText });

// Même objectif pour tous : vaincre 5 Pokémon chromatiques en jouant ce Pokémon (cumulé sur toutes ses runs).
const SHINY_GOAL = shiny('shinies', 5, 'Vaincre 5 Pokémon chromatiques en jouant ce Pokémon');

export const SKINS: Record<CharacterId, SkinDef[]> = {
  riolu: [SHINY_GOAL, {
    id: 'magma', name: 'Magma', stat: 'bosses', goal: 2, bosses: ['camerupt', 'heatran'], dex: [447, 448, 10059],
    goalText: 'Vaincre le gardien du Mont Chimnée (Camérupt) et celui du Mont Abrupt (Heatran) en jouant Riolu',
  }],
  vipelierre: [SHINY_GOAL],
  kangourex: [SHINY_GOAL],
  caninos: [SHINY_GOAL],
  mew: [SHINY_GOAL],
} as Record<CharacterId, SkinDef[]>;

/** Chemin du sprite de combat selon le skin. */
export function skinSprite(dex: number, skin?: string): string {
  if (skin === 'shiny') return `sprites/pokemon/shiny/${dex}.png`;
  if (skin) return `sprites/pokemon/skins/${skin}/${dex}.png`;
  return `sprites/pokemon/front/${dex}.png`;
}
