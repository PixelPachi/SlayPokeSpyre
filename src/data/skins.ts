// Skins des personnages : à débloquer avec des objectifs qui se cumulent sur plusieurs runs.
import type { CharacterId } from '../core/model';
import type { PokeType } from '../core/types';

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
  /** Skin primordial : le Pokémon gagne le type Dragon (Acier devient Dragon). */
  addDragon?: boolean;
  /** Le Bébé de Kangourex a son propre sprite pour ce skin (skins/<id>/bebe.png). */
  baby?: boolean;
  /** Prévu pour plus tard : le skin remplace le deck de départ et/ou l'objet tenu de départ. */
  deck?: string[];
  relic?: string;
  /** Le skin remplace la lignée d'évolution (ex. Arcanâme, évolution inventée du Chien de la Lanterne). */
  evolutions?: { act: number; dex: number; name: string; types: PokeType[]; hp: number }[];
}

const shiny = (stat: SkinStat, goal: number, goalText: string): SkinDef => ({ id: 'shiny', name: 'Chromatique', stat, goal, goalText });

// Même objectif pour tous : vaincre 5 Pokémon chromatiques en jouant ce Pokémon (cumulé sur toutes ses runs).
const SHINY_GOAL = shiny('shinies', 5, 'Vaincre 5 Pokémon chromatiques en jouant ce Pokémon');

// Skin primordial : se débloque en apaisant Dialga Primal (victoire finale) avec ce Pokémon.
const primordial = (name: string, dex: number[], extra: Partial<SkinDef> = {}): SkinDef => ({
  id: 'primordial', name: 'Primordial', stat: 'bosses', goal: 1, bosses: ['dialga-primal'], dex,
  goalText: `Vaincre Dialga Primal en jouant ${name}. Le Pokémon gagne le type Dragon.`, addDragon: true, ...extra,
});

export const SKINS: Record<CharacterId, SkinDef[]> = {
  riolu: [SHINY_GOAL, {
    id: 'magma', name: 'Magma', stat: 'bosses', goal: 2, bosses: ['camerupt', 'heatran'], dex: [447, 448, 10059],
    goalText: 'Vaincre le gardien du Mont Chimnée (Camérupt) et celui du Mont Abrupt (Heatran) en jouant Riolu',
  }, primordial('Riolu', [447, 448, 10059])],
  vipelierre: [SHINY_GOAL, primordial('Vipélierre', [495, 496, 497])],
  kangourex: [SHINY_GOAL, primordial('Kangourex', [115], { baby: true })],
  caninos: [SHINY_GOAL, primordial('Caninos', [58, 59]), {
    id: 'lanterne', name: 'Chien de la Lanterne', stat: 'bosses', goal: 1, bosses: ['ossatueur-gardien'], dex: [58, 59, 9059],
    goalText: 'Vaincre le gardien de la Tour Pokémon de Lavanville (Ossatueur) en jouant Caninos',
    evolutions: [
      { act: 2, dex: 59, name: 'Arcanin', types: ['feu'], hp: 12 },
      { act: 3, dex: 9059, name: 'Arcanâme', types: ['feu', 'spectre'], hp: 8 },
    ],
  }],
  mew: [SHINY_GOAL],
} as Record<CharacterId, SkinDef[]>;

/** Chemin du sprite de combat selon le skin. */
export function skinSprite(dex: number, skin?: string): string {
  if (skin === 'shiny') return `sprites/pokemon/shiny/${dex}.png`;
  // Une forme sans sprite pour ce skin (ex. Méga-Kangourex primordial) garde son sprite normal
  if (skin && Object.values(SKINS).flat().some((k) => k.id === skin && (!k.dex || k.dex.includes(dex)))) return `sprites/pokemon/skins/${skin}/${dex}.png`;
  return `sprites/pokemon/front/${dex}.png`;
}

/** Sprite du Bébé de Kangourex selon le skin. */
export function babySprite(skin?: string): string {
  return skin && SKINS.kangourex?.some((k) => k.id === skin && k.baby) ? `sprites/pokemon/skins/${skin}/bebe.png` : 'sprites/pokemon/bebe-kangourex-v2.png';
}

/** Skin d'un personnage (pour appliquer son deck / objet de départ). */
export function skinDef(c: CharacterId, skin?: string): SkinDef | undefined {
  return skin ? SKINS[c]?.find((k) => k.id === skin) : undefined;
}

/** Types d'un Pokémon primordial : Acier devient Dragon, sinon Dragon s'ajoute. */
export function primordialTypes(types: PokeType[]): PokeType[] {
  if (types.includes('dragon')) return [...types];
  if (types.includes('acier')) return ['dragon', ...types.filter((t) => t !== 'acier')];
  return [...types, 'dragon'];
}
