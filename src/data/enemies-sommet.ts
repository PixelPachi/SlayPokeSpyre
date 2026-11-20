// Sommet de la Tour du Temps : Noctunoir garde le passage, Dialga Primal attend au sommet.
import type { EnemyDef } from '../core/model';

export const SUMMIT_ENEMIES: EnemyDef[] = [
  // ——— Kecleon furieux (quand on attaque son marché) ———
  {
    id: 'kecleon', name: 'Kecleon', dex: 352, types: ['normal'], hp: [96, 100],
    moves: [
      { id: 'griffe-ombre', name: 'Griffe Ombre', weight: 25, intent: 'attaque', pokeType: 'spectre', damage: 13 },
      { id: 'furie', name: 'Furie', weight: 20, intent: 'attaque', pokeType: 'normal', damage: 4, hits: 4 },
      { id: 'queue-de-fer', name: 'Queue de Fer', weight: 20, intent: 'attaque', pokeType: 'acier', damage: 16, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'camouflage', name: 'Camouflage', weight: 20, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 18 },
      { id: 'grimace', name: 'Grimace', weight: 15, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
    ],
  },
  // ——— Duels des arcanes (L'Empereur, La Force) : plus forts à chaque acte ———
  {
    id: 'nidoking-duel', name: 'Nidoking', dex: 34, types: ['poison', 'sol'], hp: [62, 66],
    moves: [
      { id: 'koud-korne', name: 'Koud\'Korne', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 11 },
      { id: 'direct-toxik', name: 'Direct Toxik', weight: 25, intent: 'attaque', pokeType: 'poison', damage: 8, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'telluriforce', name: 'Telluriforce', weight: 25, intent: 'attaque', pokeType: 'sol', damage: 14 },
      { id: 'grondement', name: 'Groz\'Yeux', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 10 },
    ],
  },
  {
    id: 'machopeur-duel', name: 'Machopeur', dex: 67, types: ['combat'], hp: [58, 62],
    moves: [
      { id: 'balayage', name: 'Balayage', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 12 },
      { id: 'poing-karate', name: 'Poing-Karaté', weight: 25, intent: 'attaque', pokeType: 'combat', damage: 5, hits: 2 },
      { id: 'gonflette', name: 'Gonflette', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 10 },
      { id: 'frappe-atlas', name: 'Frappe Atlas', weight: 20, intent: 'attaque', pokeType: 'combat', damage: 15 },
    ],
  },
  {
    id: 'noctunoir', name: 'Noctunoir', dex: 477, types: ['spectre'], hp: [104, 110],
    moves: [
      { id: 'poing-ombre', name: 'Poing Ombre', weight: 30, intent: 'attaque', pokeType: 'spectre', damage: 14 },
      { id: 'ombre-portee', name: 'Ombre Portée', weight: 25, intent: 'attaque', pokeType: 'spectre', damage: 5, hits: 3 },
      { id: 'malediction', name: 'Malédiction', weight: 15, intent: 'handicap', playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'feu-follet', name: 'Feu Follet', weight: 15, intent: 'handicap', playerStatus: { status: 'brulure', stacks: 3 } },
      { id: 'vent-mauvais', name: 'Vent Mauvais', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 16 },
    ],
  },
  {
    id: 'dialga-primal', name: 'Dialga Primal', dex: 483, types: ['acier', 'dragon'], hp: [390, 390], look: 'primal',
    moves: [
      { id: 'distorsion', name: 'Distorsion', weight: 0, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 3 } },
      { id: 'draco-choc', name: 'Draco-Choc', weight: 0, intent: 'attaque', pokeType: 'dragon', damage: 18 },
      { id: 'luminocanon', name: 'Luminocanon', weight: 0, intent: 'attaque', pokeType: 'acier', damage: 14, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'tete-de-fer', name: 'Tête de Fer', weight: 0, intent: 'attaque', pokeType: 'acier', damage: 16, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'pouvoir-antique', name: 'Pouvoir Antique', weight: 0, intent: 'attaque', pokeType: 'roche', damage: 10, selfStatus: { status: 'attaque', stacks: 1 } },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 0, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 30 },
      { id: 'hurle-temps', name: 'Hurle-Temps', weight: 0, intent: 'attaque', pokeType: 'dragon', damage: 38 },
      { id: 'recharge', name: 'Recharge', weight: 0, intent: 'recharge' },
    ],
    // Hurle-Temps est annoncé un tour à l'avance et Dialga doit ensuite se recharger
    pattern: ['distorsion', 'draco-choc', 'luminocanon', 'mur-de-fer', 'hurle-temps', 'recharge', 'tete-de-fer', 'pouvoir-antique', 'draco-choc', 'hurle-temps', 'recharge'],
    phase2: {
      below: 0.5, name: 'Le temps se brise !', block: 30, selfStatus: { status: 'attaque', stacks: 2 },
      pattern: ['luminocanon', 'hurle-temps', 'recharge', 'pouvoir-antique', 'tete-de-fer', 'distorsion', 'hurle-temps', 'recharge', 'draco-choc'],
    },
  },
];
