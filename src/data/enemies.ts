// Ennemis et rencontres. Acte 1 — Forêt de Jade (Kanto).
import type { EnemyDef } from '../core/model';
import { ACT2_ENEMIES } from './enemies-acte2';
import { ACT3_ENEMIES } from './enemies-acte3';
import { SUMMIT_ENEMIES } from './enemies-sommet';

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

  // ——— Élite ———
  {
    id: 'rattatac', name: 'Rattatac', dex: 20, types: ['normal'], hp: [44, 48],
    moves: [
      { id: 'morsure', name: 'Morsure', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 11 },
      { id: 'vive-attaque', name: 'Vive-Attaque', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 4, hits: 3 },
      { id: 'puissance', name: 'Puissance', weight: 30, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 8 },
    ],
  },

  // ——— Gardien de la Forêt de Jade ———
  {
    id: 'dardargnan', name: 'Dardargnan', dex: 15, types: ['insecte', 'poison'], hp: [86, 86],
    moves: [
      { id: 'double-dard', name: 'Double Dard', weight: 30, intent: 'attaque', pokeType: 'insecte', damage: 6, hits: 2 },
      { id: 'dard-venin', name: 'Dard-Venin', weight: 30, intent: 'attaque', pokeType: 'poison', damage: 7, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'furie', name: 'Furie', weight: 20, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 4 },
      { id: 'hate', name: 'Hâte', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 12 },
    ],
  },

  // ——— Bois aux Chênes (Johto) ———
  {
    id: 'hoothoot', name: 'Hoothoot', dex: 163, types: ['normal', 'vol'], hp: [14, 18],
    moves: [
      { id: 'picpic', name: 'Picpic', weight: 45, intent: 'attaque', pokeType: 'vol', damage: 6 },
      { id: 'coup-d-boule', name: "Coup d'Boule", weight: 30, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'rugissement', name: 'Rugissement', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'coxy', name: 'Coxy', dex: 165, types: ['insecte', 'vol'], hp: [13, 17],
    moves: [
      { id: 'poing-comete', name: 'Poing Comète', weight: 45, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 3 },
      { id: 'ecran-lumiere', name: 'Écran Lumière', weight: 25, intent: 'defense', block: 7 },
      { id: 'vive-attaque', name: 'Vive-Attaque', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 5 },
    ],
  },
  {
    id: 'mimigal', name: 'Mimigal', dex: 167, types: ['insecte', 'poison'], hp: [13, 17],
    moves: [
      { id: 'dard-venin', name: 'Dard-Venin', weight: 40, intent: 'attaque', pokeType: 'poison', damage: 4, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'vampirisme', name: 'Vampirisme', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 6 },
      { id: 'secretion', name: 'Sécrétion', weight: 25, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 1 } },
    ],
  },
  {
    id: 'migalos', name: 'Migalos', dex: 168, types: ['insecte', 'poison'], hp: [44, 48],
    moves: [
      { id: 'dard-venin', name: 'Dard-Venin', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 8, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'plaie-croix', name: 'Plaie-Croix', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 13 },
      { id: 'toile', name: 'Toile', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 }, block: 6 },
    ],
  },
  {
    id: 'scarhino', name: 'Scarhino', dex: 214, types: ['insecte', 'combat'], hp: [92, 92],
    moves: [
      { id: 'megacorne', name: 'Mégacorne', weight: 25, intent: 'attaque', pokeType: 'insecte', damage: 18 },
      { id: 'casse-brique', name: 'Casse-Brique', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 11 },
      { id: 'furie', name: 'Furie', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 4 },
      { id: 'gonflette', name: 'Gonflette', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 10 },
    ],
  },

  // ——— Bois Clématis (Hoenn) ———
  {
    id: 'zigzaton', name: 'Zigzaton', dex: 263, types: ['normal'], hp: [13, 17],
    moves: [
      { id: 'charge', name: 'Charge', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 6 },
      { id: 'coup-d-boule', name: "Coup d'Boule", weight: 30, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'mimi-queue', name: 'Mimi-Queue', weight: 30, intent: 'handicap', playerStatus: { status: 'peur', stacks: 1 } },
    ],
  },
  {
    id: 'chenipotte', name: 'Chenipotte', dex: 265, types: ['insecte'], hp: [11, 15],
    moves: [
      { id: 'charge', name: 'Charge', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'piqure', name: 'Piqûre', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 6 },
      { id: 'secretion', name: 'Sécrétion', weight: 25, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 1 } },
    ],
  },
  {
    id: 'balignon', name: 'Balignon', dex: 285, types: ['plante'], hp: [14, 18],
    moves: [
      { id: 'mega-sangsue', name: 'Méga-Sangsue', weight: 40, intent: 'attaque', pokeType: 'plante', damage: 6 },
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 6 },
      { id: 'para-spore', name: 'Para-Spore', weight: 25, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
    ],
  },
  {
    id: 'chapignon', name: 'Chapignon', dex: 286, types: ['plante', 'combat'], hp: [46, 50],
    moves: [
      { id: 'mach-punch', name: 'Mach Punch', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 10 },
      { id: 'balle-graine', name: 'Balle Graine', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 3, hits: 4 },
      { id: 'para-spore', name: 'Para-Spore', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 }, block: 6 },
    ],
  },
  {
    id: 'charmillon', name: 'Charmillon', dex: 267, types: ['insecte', 'vol'], hp: [88, 88],
    moves: [
      { id: 'vent-argente', name: 'Vent Argenté', weight: 30, intent: 'attaque', pokeType: 'insecte', damage: 9, selfStatus: { status: 'attaque', stacks: 1 } },
      { id: 'tornade', name: 'Tornade', weight: 30, intent: 'attaque', pokeType: 'vol', damage: 11 },
      { id: 'para-spore', name: 'Para-Spore', weight: 20, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
      { id: 'papillodanse', name: 'Papillodanse', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 12 },
    ],
  },

  // ——— Forêt de Vestigion (Sinnoh) ———
  {
    id: 'cheniti', name: 'Cheniti', dex: 412, types: ['insecte'], hp: [12, 16],
    moves: [
      { id: 'charge', name: 'Charge', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'piqure', name: 'Piqûre', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 6 },
      { id: 'protection', name: 'Protection', weight: 25, intent: 'defense', block: 7 },
    ],
  },
  {
    id: 'apitrini', name: 'Apitrini', dex: 415, types: ['insecte', 'vol'], hp: [12, 16],
    moves: [
      { id: 'tornade', name: 'Tornade', weight: 40, intent: 'attaque', pokeType: 'vol', damage: 6 },
      { id: 'piqure', name: 'Piqûre', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 5 },
      { id: 'doux-parfum', name: 'Doux Parfum', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
    ],
  },
  {
    id: 'ceribou', name: 'Ceribou', dex: 420, types: ['plante'], hp: [14, 18],
    moves: [
      { id: 'tranch-herbe', name: "Tranch'Herbe", weight: 40, intent: 'attaque', pokeType: 'plante', damage: 7 },
      { id: 'vampigraine', name: 'Vampigraine', weight: 30, intent: 'handicap', playerStatus: { status: 'vampigraine', stacks: 3 } },
      { id: 'croissance', name: 'Croissance', weight: 30, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 5 },
    ],
  },
  {
    id: 'cerifleur', name: 'Cerifleur', dex: 421, types: ['plante'], hp: [44, 48],
    moves: [
      { id: 'tempete-florale', name: 'Tempête Florale', weight: 40, intent: 'attaque', pokeType: 'plante', damage: 12 },
      { id: 'vampigraine', name: 'Vampigraine', weight: 30, intent: 'handicap', playerStatus: { status: 'vampigraine', stacks: 4 } },
      { id: 'croissance', name: 'Croissance', weight: 30, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 8 },
    ],
  },
  {
    id: 'apireine', name: 'Apireine', dex: 416, types: ['insecte', 'vol'], hp: [90, 90],
    moves: [
      { id: 'appel-attaque', name: 'Appel Attaque', weight: 30, intent: 'attaque', pokeType: 'insecte', damage: 7, hits: 2 },
      { id: 'appel-defense', name: 'Appel Défense', weight: 25, intent: 'defense', block: 15 },
      { id: 'dard-venin', name: 'Dard-Venin', weight: 25, intent: 'attaque', pokeType: 'poison', damage: 8, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'appel-soins', name: 'Appel Soins', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 8 },
    ],
  },

  // ——— Forêt d'Empoigne (Unys) ———
  {
    id: 'larveyette', name: 'Larveyette', dex: 540, types: ['insecte', 'plante'], hp: [12, 16],
    moves: [
      { id: 'charge', name: 'Charge', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 5 },
      { id: 'piqure', name: 'Piqûre', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 6 },
      { id: 'secretion', name: 'Sécrétion', weight: 25, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 1 } },
    ],
  },
  {
    id: 'venipatte', name: 'Venipatte', dex: 543, types: ['insecte', 'poison'], hp: [13, 17],
    moves: [
      { id: 'dard-venin', name: 'Dard-Venin', weight: 40, intent: 'attaque', pokeType: 'poison', damage: 4, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'charge', name: 'Charge', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 6 },
      { id: 'boul-armure', name: "Boul'Armure", weight: 25, intent: 'defense', block: 6 },
    ],
  },
  {
    id: 'chlorobule', name: 'Chlorobule', dex: 548, types: ['plante'], hp: [14, 18],
    moves: [
      { id: 'mega-sangsue', name: 'Méga-Sangsue', weight: 40, intent: 'attaque', pokeType: 'plante', damage: 6 },
      { id: 'para-spore', name: 'Para-Spore', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'croissance', name: 'Croissance', weight: 30, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 5 },
    ],
  },
  {
    id: 'couverdure', name: 'Couverdure', dex: 541, types: ['insecte', 'plante'], hp: [46, 50],
    moves: [
      { id: 'tranch-herbe', name: "Tranch'Herbe", weight: 35, intent: 'attaque', pokeType: 'plante', damage: 9 },
      { id: 'plaie-croix', name: 'Plaie-Croix', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 12 },
      { id: 'protection', name: 'Protection', weight: 30, intent: 'defense', block: 12 },
    ],
  },
  {
    id: 'brutapode', name: 'Brutapode', dex: 545, types: ['insecte', 'poison'], hp: [94, 94],
    moves: [
      { id: 'megacorne', name: 'Mégacorne', weight: 25, intent: 'attaque', pokeType: 'insecte', damage: 18 },
      { id: 'direct-toxik', name: 'Direct Toxik', weight: 30, intent: 'attaque', pokeType: 'poison', damage: 9, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'roulade', name: 'Roulade', weight: 25, intent: 'attaque', pokeType: 'roche', damage: 4, hits: 3 },
      { id: 'hate', name: 'Hâte', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 10 },
    ],
  },
];

export const ENEMY_DEFS: Record<string, EnemyDef> = Object.fromEntries([...ENEMIES, ...ACT2_ENEMIES, ...ACT3_ENEMIES, ...SUMMIT_ENEMIES].map((e) => [e.id, e]));
