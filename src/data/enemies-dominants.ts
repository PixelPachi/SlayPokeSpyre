// Seconds dominants (élites) de chaque zone : chaque zone en propose deux, tirés au hasard.
import type { EnemyDef } from '../core/model';

export const DOMINANT_ENEMIES: EnemyDef[] = [
  // ——— Acte 1 ———
  {
    id: 'papilusion', name: 'Papilusion', dex: 12, types: ['insecte', 'vol'], hp: [46, 50],
    moves: [
      { id: 'tornade', name: 'Tornade', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 4, hits: 3 },
      { id: 'choc-mental', name: 'Choc Mental', weight: 30, intent: 'attaque', pokeType: 'psy', damage: 11 },
      { id: 'poudre-dodo', name: 'Para-Spore', weight: 20, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
      { id: 'papillodanse', name: 'Papillodanse', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 8 },
    ],
  },
  {
    id: 'coxyclaque', name: 'Coxyclaque', dex: 166, types: ['insecte', 'vol'], hp: [48, 52],
    moves: [
      { id: 'poing-comete', name: 'Poing Comète', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 4 },
      { id: 'mach-punch', name: 'Mach Punch', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 10 },
      { id: 'mur-lumiere', name: 'Mur Lumière', weight: 20, intent: 'defense', block: 14 },
      { id: 'hate', name: 'Hâte', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 6 },
    ],
  },
  {
    id: 'pifeuil', name: 'Pifeuil', dex: 274, types: ['plante', 'tenebres'], hp: [46, 50],
    moves: [
      { id: 'feinte', name: 'Feinte', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 11 },
      { id: 'tranch-herbe', name: "Tranch'Herbe", weight: 30, intent: 'attaque', pokeType: 'plante', damage: 5, hits: 2 },
      { id: 'aiguisage', name: 'Aiguisage', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 } },
      { id: 'tourmente', name: 'Tourmente', weight: 15, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
    ],
  },
  {
    id: 'cheniselle', name: 'Cheniselle', dex: 413, types: ['insecte', 'plante'], hp: [52, 56],
    moves: [
      { id: 'tranch-feuille', name: "Tranch'Feuille", weight: 35, intent: 'attaque', pokeType: 'plante', damage: 10 },
      { id: 'piqure', name: 'Piqûre', weight: 25, intent: 'attaque', pokeType: 'insecte', damage: 4, hits: 2 },
      { id: 'abri-cocon', name: 'Armure', weight: 25, intent: 'defense', block: 16 },
      { id: 'vampigraine', name: 'Vampigraine', weight: 15, intent: 'handicap', playerStatus: { status: 'vampigraine', stacks: 3 } },
    ],
  },
  {
    id: 'manternel', name: 'Manternel', dex: 542, types: ['insecte', 'plante'], hp: [46, 50],
    moves: [
      { id: 'plaie-croix', name: 'Plaie-Croix', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 12 },
      { id: 'lame-feuille', name: 'Lame-Feuille', weight: 30, intent: 'attaque', pokeType: 'plante', damage: 6, hits: 2 },
      { id: 'danse-lames', name: 'Danse-Lames', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 } },
      { id: 'secretion', name: 'Sécrétion', weight: 15, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
    ],
  },
  {
    id: 'ectoplasma', name: 'Ectoplasma', dex: 94, types: ['spectre', 'poison'], hp: [50, 54],
    moves: [
      { id: 'ball-ombre', name: "Ball'Ombre", weight: 35, intent: 'attaque', pokeType: 'spectre', damage: 12 },
      { id: 'bomb-beurk', name: 'Bomb-Beurk', weight: 25, intent: 'attaque', pokeType: 'poison', damage: 7, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'hypnose', name: 'Hypnose', weight: 20, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'devoreve', name: 'Dévorêve', weight: 20, intent: 'attaque', pokeType: 'psy', damage: 4, hits: 3 },
    ],
  },

  // ——— Acte 2 ———
  {
    id: 'parasect', name: 'Parasect', dex: 47, types: ['insecte', 'plante'], hp: [76, 80],
    moves: [
      { id: 'plaie-croix', name: 'Plaie-Croix', weight: 30, intent: 'attaque', pokeType: 'insecte', damage: 12 },
      { id: 'spore', name: 'Para-Spore', weight: 20, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 3 } },
      { id: 'vampi-poing', name: 'Vampipoing', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 10, block: 6 },
      { id: 'poudre-toxik', name: 'Poudre Toxik', weight: 20, intent: 'handicap', playerStatus: { status: 'poison', stacks: 5 } },
    ],
  },
  {
    id: 'tentacruel', name: 'Tentacruel', dex: 73, types: ['eau', 'poison'], hp: [74, 78],
    moves: [
      { id: 'hydrocanon', name: 'Hydrocanon', weight: 25, intent: 'attaque', pokeType: 'eau', damage: 16 },
      { id: 'ligotage', name: 'Ligotage', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 4, hits: 3 },
      { id: 'toxik', name: 'Toxik', weight: 25, intent: 'handicap', playerStatus: { status: 'poison', stacks: 6 } },
      { id: 'acidarmure', name: 'Acidarmure', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 14 },
    ],
  },
  {
    id: 'galegon', name: 'Galegon', dex: 306, types: ['acier', 'roche'], hp: [84, 88],
    moves: [
      { id: 'tete-de-fer', name: 'Tête de Fer', weight: 30, intent: 'attaque', pokeType: 'acier', damage: 13, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'eboulement', name: 'Éboulement', weight: 25, intent: 'attaque', pokeType: 'roche', damage: 5, hits: 2 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 25, intent: 'defense', block: 20 },
      { id: 'tacle-lourd', name: 'Tacle Lourd', weight: 20, intent: 'attaque', pokeType: 'acier', damage: 18 },
    ],
  },
  {
    id: 'tarinorme', name: 'Tarinorme', dex: 476, types: ['roche', 'acier'], hp: [80, 84],
    moves: [
      { id: 'lame-de-roc', name: 'Lame de Roc', weight: 30, intent: 'attaque', pokeType: 'roche', damage: 14 },
      { id: 'cage-eclair', name: 'Cage-Éclair', weight: 20, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 3 } },
      { id: 'pouvoir-antique', name: 'Pouvoir Antique', weight: 25, intent: 'attaque', pokeType: 'roche', damage: 9, selfStatus: { status: 'attaque', stacks: 1 } },
      { id: 'reflet-magik', name: 'Reflet Magik', weight: 25, intent: 'defense', block: 18 },
    ],
  },
  {
    id: 'lamperoie', name: 'Lampéroie', dex: 603, types: ['electrik'], hp: [72, 76],
    moves: [
      { id: 'etincelle', name: 'Étincelle', weight: 30, intent: 'attaque', pokeType: 'electrik', damage: 11, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'ligotage', name: 'Ligotage', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 4, hits: 3 },
      { id: 'ultimapoing', name: 'Électacle', weight: 25, intent: 'attaque', pokeType: 'electrik', damage: 17 },
      { id: 'chargeur', name: 'Chargeur', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 10 },
    ],
  },

  // ——— Acte 3 ———
  {
    id: 'kicklee', name: 'Kicklee', dex: 106, types: ['combat'], hp: [118, 124],
    moves: [
      { id: 'pied-voltige', name: 'Pied Voltige', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 22 },
      { id: 'double-pied', name: 'Double Pied', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 8, hits: 2 },
      { id: 'mawashi-geri', name: 'Mawashi Geri', weight: 20, intent: 'attaque', pokeType: 'combat', damage: 12, playerStatus: { status: 'peur', stacks: 2 } },
      { id: 'gonflette', name: 'Gonflette', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 14 },
    ],
  },
  {
    id: 'cizayox', name: 'Cizayox', dex: 212, types: ['insecte', 'acier'], hp: [122, 128],
    moves: [
      { id: 'pisto-poing', name: 'Pisto-Poing', weight: 30, intent: 'attaque', pokeType: 'acier', damage: 14 },
      { id: 'plaie-croix', name: 'Plaie-Croix', weight: 25, intent: 'attaque', pokeType: 'insecte', damage: 18 },
      { id: 'tranche-nuit', name: 'Tranche-Nuit', weight: 25, intent: 'attaque', pokeType: 'tenebres', damage: 6, hits: 3 },
      { id: 'danse-lames', name: 'Danse-Lames', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 4 }, block: 12 },
    ],
  },
  {
    id: 'metalosse', name: 'Métalosse', dex: 376, types: ['acier', 'psy'], hp: [130, 136],
    moves: [
      { id: 'poing-meteor', name: 'Poing Météor', weight: 30, intent: 'attaque', pokeType: 'acier', damage: 20, selfStatus: { status: 'attaque', stacks: 1 } },
      { id: 'psyko', name: 'Psyko', weight: 25, intent: 'attaque', pokeType: 'psy', damage: 16, playerStatus: { status: 'confusion', stacks: 1 } },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 25, intent: 'defense', block: 24 },
      { id: 'seisme', name: 'Séisme', weight: 20, intent: 'attaque', pokeType: 'sol', damage: 7, hits: 2 },
    ],
  },
  {
    id: 'dimoret', name: 'Dimoret', dex: 461, types: ['tenebres', 'glace'], hp: [112, 118],
    moves: [
      { id: 'tranche-nuit', name: 'Tranche-Nuit', weight: 30, intent: 'attaque', pokeType: 'tenebres', damage: 15 },
      { id: 'eclats-glace', name: 'Éclats Glace', weight: 25, intent: 'attaque', pokeType: 'glace', damage: 5, hits: 4 },
      { id: 'machination', name: 'Machination', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 4 } },
      { id: 'poing-glace', name: 'Poing Glace', weight: 25, intent: 'attaque', pokeType: 'glace', damage: 13, playerStatus: { status: 'gel', stacks: 1 } },
    ],
  },
  {
    id: 'trioxhydre', name: 'Trioxhydre', dex: 635, types: ['tenebres', 'dragon'], hp: [128, 134],
    moves: [
      { id: 'dracochoc', name: 'Draco-Choc', weight: 30, intent: 'attaque', pokeType: 'dragon', damage: 21 },
      { id: 'machouille', name: 'Mâchouille', weight: 25, intent: 'attaque', pokeType: 'tenebres', damage: 7, hits: 3 },
      { id: 'vibrobscur', name: 'Vibrobscur', weight: 25, intent: 'attaque', pokeType: 'tenebres', damage: 14, playerStatus: { status: 'peur', stacks: 2 } },
      { id: 'machination', name: 'Machination', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 16 },
    ],
  },

  // ——— Sommet et Salle Originelle ———
  {
    id: 'mammochon', name: 'Mammochon', dex: 473, types: ['glace', 'sol'], hp: [112, 118],
    moves: [
      { id: 'seisme', name: 'Séisme', weight: 30, intent: 'attaque', pokeType: 'sol', damage: 16 },
      { id: 'chute-glace', name: 'Chute Glace', weight: 25, intent: 'attaque', pokeType: 'glace', damage: 14, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'eclats-glace', name: 'Éclats Glace', weight: 25, intent: 'attaque', pokeType: 'glace', damage: 4, hits: 4 },
      { id: 'boul-armure', name: "Boul'Armure", weight: 20, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 18 },
    ],
  },
  {
    id: 'gardevoir-mega', name: 'Méga-Gardevoir', dex: 10051, types: ['psy', 'fee'], hp: [200, 210],
    moves: [
      { id: 'vampibaiser', name: 'Vampibaiser', weight: 25, intent: 'attaque', pokeType: 'fee', damage: 22, block: 10 },
      { id: 'psyko', name: 'Psyko', weight: 25, intent: 'attaque', pokeType: 'psy', damage: 26 },
      { id: 'eclat-magique', name: 'Éclat Magique', weight: 20, intent: 'attaque', pokeType: 'fee', damage: 8, hits: 3 },
      { id: 'plenitude', name: 'Plénitude', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 24 },
      { id: 'hypnose', name: 'Hypnose', weight: 15, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 3 } },
    ],
  },
];
