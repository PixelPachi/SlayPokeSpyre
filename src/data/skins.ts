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
}

const shiny = (stat: SkinStat, goal: number, goalText: string): SkinDef => ({ id: 'shiny', name: 'Chromatique', stat, goal, goalText });

export const SKINS: Record<CharacterId, SkinDef[]> = {
  riolu: [shiny('shinies', 5, 'Vaincre 5 Pokémon chromatiques')],
  vipelierre: [shiny('elites', 15, 'Vaincre 15 Pokémon dominants')],
  kangourex: [shiny('bosses', 6, 'Vaincre 6 gardiens')],
  caninos: [shiny('combats', 60, 'Gagner 60 combats')],
  mew: [shiny('wins', 1, 'Conquérir la Tour du Temps')],
} as Record<CharacterId, SkinDef[]>;

/** Chemin du sprite de combat selon le skin. */
export function skinSprite(dex: number, skin?: string): string {
  return skin === 'shiny' ? `sprites/pokemon/shiny/${dex}.png` : `sprites/pokemon/front/${dex}.png`;
}
