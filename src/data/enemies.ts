// Ennemis et rencontres. Acte 1 — Forêt de Jade (Kanto).
import type { EnemyDef } from '../core/model';

const ENEMIES: EnemyDef[] = [
  {
    id: 'chenipan', name: 'Chenipan', dex: 10, types: ['insecte'], hp: [11, 15],
    moves: [
      { id: 'charge', name: 'Charge', weight: 50, intent: 'attaque', pokeType: 'normal', damage: 6 },
      { id: 'secretion', name: 'Sécrétion', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'armure', name: 'Armure', weight: 20, intent: 'defense', block: 6 },
    ],
  },
  {
    id: 'aspicot', name: 'Aspicot', dex: 13, types: ['insecte', 'poison'], hp: [12, 16],
    moves: [
      { id: 'dard-venin', name: 'Dard-Venin', weight: 50, intent: 'attaque', pokeType: 'poison', damage: 4, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'piqure', name: 'Piqûre', weight: 30, intent: 'attaque', pokeType: 'insecte', damage: 7 },
      { id: 'secretion', name: 'Sécrétion', weight: 20, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 1 } },
    ],
  },
  {
    id: 'roucool', name: 'Roucool', dex: 16, types: ['normal', 'vol'], hp: [24, 28],
    moves: [
      { id: 'tornade', name: 'Tornade', weight: 45, intent: 'attaque', pokeType: 'vol', damage: 8 },
      { id: 'vive-attaque', name: 'Vive-Attaque', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 2 },
      { id: 'jet-de-sable', name: 'Jet de Sable', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
    ],
  },
  {
    id: 'rattata', name: 'Rattata', dex: 19, types: ['normal'], hp: [12, 16],
    moves: [
      { id: 'charge', name: 'Charge', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 6 },
      { id: 'morsure', name: 'Morsure', weight: 30, intent: 'attaque', pokeType: 'tenebres', damage: 8 },
      { id: 'mimi-queue', name: 'Mimi-Queue', weight: 30, intent: 'handicap', playerStatus: { status: 'peur', stacks: 1 } },
    ],
  },
];

export const ENEMY_DEFS: Record<string, EnemyDef> = Object.fromEntries(ENEMIES.map((e) => [e.id, e]));

/** Rencontres possibles en combat normal dans la Forêt de Jade. */
export const ENCOUNTERS_FORET_DE_JADE: string[][] = [
  ['chenipan', 'aspicot'],
  ['roucool'],
  ['rattata', 'rattata'],
  ['chenipan', 'rattata'],
  ['aspicot', 'aspicot'],
];
