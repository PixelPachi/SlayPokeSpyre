// Ennemis de l'acte 3 — les hauteurs de la Tour du Temps : sommets et lieux légendaires des cinq régions.
// Les gardiens sont des Pokémon légendaires ou pseudo-légendaires. Chiffres ajustés en simulant des combats avec un deck de fin d'acte 2.
import type { EnemyDef } from '../core/model';

export const ACT3_ENEMIES: EnemyDef[] = [
  // ——— Route Victoire (Kanto) ———
  {
    id: 'onix', name: 'Onix', dex: 95, types: ['roche', 'sol'], hp: [49, 54],
    moves: [
      { id: 'jet-pierres', name: 'Jet-Pierres', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 11 },
      { id: 'etreinte', name: 'Étreinte', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 4, hits: 3 },
      { id: 'armure', name: 'Armure', weight: 35, intent: 'defense', block: 17 },
    ],
  },
  {
    id: 'gravalanch', name: 'Gravalanch', dex: 75, types: ['roche', 'sol'], hp: [46, 49],
    moves: [
      { id: 'eboulement', name: 'Éboulement', weight: 40, intent: 'attaque', pokeType: 'roche', damage: 10, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'boul-armure', name: "Boul'Armure", weight: 30, intent: 'defense', block: 15 },
      { id: 'ampleur', name: 'Ampleur', weight: 30, intent: 'attaque', pokeType: 'sol', damage: 4, hits: 3 },
    ],
  },
  {
    id: 'ossatueur', name: 'Ossatueur', dex: 105, types: ['sol'], hp: [42, 48],
    moves: [
      { id: 'osmerang', name: 'Osmerang', weight: 40, intent: 'attaque', pokeType: 'sol', damage: 6, hits: 2 },
      { id: 'massd-os', name: "Massd'Os", weight: 35, intent: 'attaque', pokeType: 'sol', damage: 11 },
      { id: 'groz-yeux', name: "Groz'Yeux", weight: 25, intent: 'handicap', playerStatus: { status: 'defense', stacks: -2 } },
    ],
  },
  {
    id: 'machopeur', name: 'Machopeur', dex: 67, types: ['combat'], hp: [48, 51],
    moves: [
      { id: 'sacrifice', name: 'Sacrifice', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 13 },
      { id: 'gonflette', name: 'Gonflette', weight: 30, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 8 },
      { id: 'frappe-atlas', name: 'Frappe Atlas', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 10 },
    ],
  },
  {
    id: 'mackogneur', name: 'Mackogneur', dex: 68, types: ['combat'], hp: [119, 124],
    moves: [
      { id: 'dynamo-poing', name: 'Dynamo-Poing', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 18, playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'close-combat', name: 'Close Combat', weight: 30, intent: 'attaque', pokeType: 'combat', damage: 21, selfStatus: { status: 'defense', stacks: -1 } },
      { id: 'gonflette', name: 'Gonflette', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 12 },
      { id: 'poing-ombre', name: 'Poing Ombre', weight: 20, intent: 'attaque', pokeType: 'spectre', damage: 6, hits: 3 },
    ],
  },
  {
    id: 'dracolosse', name: 'Dracolosse', dex: 149, types: ['dragon', 'vol'], hp: [203, 203],
    moves: [
      { id: 'colere', name: 'Colère', weight: 25, intent: 'attaque', pokeType: 'dragon', damage: 8, hits: 3 },
      { id: 'vitesse-extreme', name: 'Vitesse Extrême', weight: 20, intent: 'attaque', pokeType: 'normal', damage: 14 },
      { id: 'danse-draco', name: 'Danse Draco', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 14 },
      { id: 'mitra-poing', name: 'Ouragan', weight: 20, intent: 'attaque', pokeType: 'dragon', damage: 10, playerStatus: { status: 'peur', stacks: 2 } },
      { id: 'atterrissage', name: 'Atterrissage', weight: 15, intent: 'defense', block: 22 },
    ],
  },

  // ——— Mont Argenté (Johto) ———
  {
    id: 'donphan', name: 'Donphan', dex: 232, types: ['sol'], hp: [51, 56],
    moves: [
      { id: 'roulade', name: 'Roulade', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 4, hits: 4 },
      { id: 'seisme', name: 'Séisme', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 13 },
      { id: 'boul-armure', name: "Boul'Armure", weight: 30, intent: 'defense', block: 17 },
    ],
  },
  {
    id: 'ursaring', name: 'Ursaring', dex: 217, types: ['normal'], hp: [54, 60],
    moves: [
      { id: 'tranche', name: 'Tranche', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 12 },
      { id: 'coup-bas', name: 'Bélier', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 16, selfStatus: { status: 'defense', stacks: -1 } },
      { id: 'grimace', name: 'Grimace', weight: 30, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'farfuret', name: 'Farfuret', dex: 215, types: ['tenebres', 'glace'], hp: [39, 42],
    moves: [
      { id: 'poing-glace', name: 'Poing Glace', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 10 },
      { id: 'feinte', name: 'Feinte', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 4, hits: 2, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'affutage', name: 'Affûtage', weight: 30, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'feuforeve', name: 'Feuforêve', dex: 200, types: ['spectre'], hp: [41, 44],
    moves: [
      { id: 'ball-ombre', name: "Ball'Ombre", weight: 40, intent: 'attaque', pokeType: 'spectre', damage: 11 },
      { id: 'onde-folie', name: 'Onde Folie', weight: 30, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 3 } },
      { id: 'malediction', name: 'Malédiction', weight: 30, intent: 'handicap', playerStatus: { status: 'poison', stacks: 5 } },
    ],
  },
  {
    id: 'ymphect', name: 'Ymphect', dex: 247, types: ['roche', 'sol'], hp: [128, 133],
    moves: [
      { id: 'mache-roc', name: 'Lame de Roc', weight: 30, intent: 'attaque', pokeType: 'roche', damage: 18 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 22 },
      { id: 'tempete-de-sable', name: 'Tempêtesable', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'machouille', name: 'Mâchouille', weight: 20, intent: 'attaque', pokeType: 'tenebres', damage: 14, playerStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'tyranocif', name: 'Tyranocif', dex: 248, types: ['roche', 'tenebres'], hp: [217, 217],
    moves: [
      { id: 'lame-de-roc', name: 'Lame de Roc', weight: 25, intent: 'attaque', pokeType: 'roche', damage: 20 },
      { id: 'machouille', name: 'Mâchouille', weight: 25, intent: 'attaque', pokeType: 'tenebres', damage: 14, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'danse-draco', name: 'Danse Draco', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 17 },
      { id: 'seisme', name: 'Séisme', weight: 15, intent: 'attaque', pokeType: 'sol', damage: 13 },
      { id: 'grimace', name: 'Grimace', weight: 15, intent: 'handicap', playerStatus: { status: 'peur', stacks: 3 } },
    ],
  },

  // ——— Pilier Céleste (Hoenn) ———
  {
    id: 'kaorine', name: 'Kaorine', dex: 344, types: ['sol', 'psy'], hp: [48, 53],
    moves: [
      { id: 'telluriforce', name: 'Telluriforce', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 11 },
      { id: 'rafale-psy', name: 'Rafale Psy', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 9, playerStatus: { status: 'confusion', stacks: 1 } },
      { id: 'protection', name: 'Protection', weight: 30, intent: 'defense', block: 19 },
    ],
  },
  {
    id: 'altaria', name: 'Altaria', dex: 334, types: ['dragon', 'vol'], hp: [46, 51],
    moves: [
      { id: 'draco-choc', name: 'Draco-Choc', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 11 },
      { id: 'chant', name: 'Berceuse', weight: 25, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
      { id: 'cotogarde', name: 'Cotogarde', weight: 40, intent: 'boost', selfStatus: { status: 'defense', stacks: 1 }, block: 14 },
    ],
  },
  {
    id: 'branette', name: 'Branette', dex: 354, types: ['spectre'], hp: [42, 46],
    moves: [
      { id: 'griffe-ombre', name: 'Griffe Ombre', weight: 40, intent: 'attaque', pokeType: 'spectre', damage: 11 },
      { id: 'feu-follet', name: 'Feu Follet', weight: 30, intent: 'handicap', playerStatus: { status: 'brulure', stacks: 4 } },
      { id: 'malediction', name: 'Malédiction', weight: 30, intent: 'handicap', playerStatus: { status: 'poison', stacks: 5 } },
    ],
  },
  {
    id: 'draby', name: 'Draby', dex: 371, types: ['dragon'], hp: [37, 41],
    moves: [
      { id: 'coup-d-boule', name: "Coup d'Boule", weight: 40, intent: 'attaque', pokeType: 'normal', damage: 10 },
      { id: 'dracosouffle', name: 'Dracosouffle', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 8, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'puissance', name: 'Puissance', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'drattak', name: 'Drattak', dex: 373, types: ['dragon', 'vol'], hp: [124, 128],
    moves: [
      { id: 'draco-charge', name: 'Draco-Charge', weight: 30, intent: 'attaque', pokeType: 'dragon', damage: 20 },
      { id: 'lance-flammes', name: 'Lance-Flammes', weight: 25, intent: 'attaque', pokeType: 'feu', damage: 14, playerStatus: { status: 'brulure', stacks: 3 } },
      { id: 'danse-draco', name: 'Danse Draco', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 14 },
      { id: 'cru-ailes', name: 'Cru-Ailes', weight: 25, intent: 'attaque', pokeType: 'vol', damage: 7, hits: 2 },
    ],
  },
  {
    id: 'rayquaza', name: 'Rayquaza', dex: 384, types: ['dragon', 'vol'], hp: [224, 224],
    moves: [
      { id: 'draco-ascension', name: 'Draco Ascension', weight: 20, intent: 'attaque', pokeType: 'vol', damage: 22, selfStatus: { status: 'defense', stacks: -1 } },
      { id: 'colere', name: 'Colère', weight: 25, intent: 'attaque', pokeType: 'dragon', damage: 9, hits: 3 },
      { id: 'danse-draco', name: 'Danse Draco', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 17 },
      { id: 'vitesse-extreme', name: 'Vitesse Extrême', weight: 20, intent: 'attaque', pokeType: 'normal', damage: 13 },
      { id: 'lame-d-air', name: "Lame d'Air", weight: 15, intent: 'attaque', pokeType: 'vol', damage: 9, playerStatus: { status: 'peur', stacks: 2 } },
    ],
  },

  // ——— Mont Abrupt (Sinnoh) ———
  {
    id: 'magmar', name: 'Magmar', dex: 126, types: ['feu'], hp: [44, 49],
    moves: [
      { id: 'poing-de-feu', name: 'Poing de Feu', weight: 40, intent: 'attaque', pokeType: 'feu', damage: 10, playerStatus: { status: 'brulure', stacks: 2 } },
      { id: 'brouillard', name: 'Brouillard', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'lance-flammes', name: 'Lance-Flammes', weight: 35, intent: 'attaque', pokeType: 'feu', damage: 13 },
    ],
  },
  {
    id: 'grolem', name: 'Grolem', dex: 76, types: ['roche', 'sol'], hp: [54, 60],
    moves: [
      { id: 'roulade', name: 'Roulade', weight: 30, intent: 'attaque', pokeType: 'roche', damage: 4, hits: 4 },
      { id: 'boul-armure', name: "Boul'Armure", weight: 35, intent: 'defense', block: 19 },
      { id: 'seisme', name: 'Séisme', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 14 },
    ],
  },
  {
    id: 'rhinocorne', name: 'Rhinocorne', dex: 111, types: ['sol', 'roche'], hp: [51, 56],
    moves: [
      { id: 'koud-korne', name: 'Koud\'Korne', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 11 },
      { id: 'pietisol', name: 'Piétisol', weight: 30, intent: 'attaque', pokeType: 'sol', damage: 10, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'puissance', name: 'Puissance', weight: 30, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 8 },
    ],
  },
  {
    id: 'smogogo', name: 'Smogogo', dex: 110, types: ['poison'], hp: [48, 51],
    moves: [
      { id: 'bomb-beurk', name: 'Bomb-Beurk', weight: 40, intent: 'attaque', pokeType: 'poison', damage: 10, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'purédpois', name: 'Purédpois', weight: 30, intent: 'handicap', playerStatus: { status: 'poison', stacks: 6 } },
      { id: 'brume', name: 'Brume', weight: 30, intent: 'defense', block: 17 },
    ],
  },
  {
    id: 'maganon', name: 'Maganon', dex: 467, types: ['feu'], hp: [122, 128],
    moves: [
      { id: 'deflagration', name: 'Déflagration', weight: 25, intent: 'attaque', pokeType: 'feu', damage: 21, playerStatus: { status: 'brulure', stacks: 3 } },
      { id: 'poing-eclair', name: 'Poing Éclair', weight: 25, intent: 'attaque', pokeType: 'electrik', damage: 14, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'boutefeu', name: 'Danse Flammes', weight: 25, intent: 'handicap', playerStatus: { status: 'brulure', stacks: 6 } },
      { id: 'telluriforce', name: 'Telluriforce', weight: 25, intent: 'attaque', pokeType: 'sol', damage: 12 },
    ],
  },
  {
    id: 'heatran', name: 'Heatran', dex: 485, types: ['feu', 'acier'], hp: [231, 231],
    moves: [
      { id: 'magma-storm', name: 'Vortex Magma', weight: 25, intent: 'attaque', pokeType: 'feu', damage: 13, playerStatus: { status: 'brulure', stacks: 5 } },
      { id: 'luminocanon', name: 'Luminocanon', weight: 20, intent: 'attaque', pokeType: 'acier', damage: 16, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'telluriforce', name: 'Telluriforce', weight: 20, intent: 'attaque', pokeType: 'sol', damage: 14 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 20, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 21 },
      { id: 'surchauffe', name: 'Surchauffe', weight: 15, intent: 'attaque', pokeType: 'feu', damage: 23, selfStatus: { status: 'attaque', stacks: -2 } },
    ],
  },

  // ——— Tour Dragospire (Unys) ———
  {
    id: 'gringolem', name: 'Gringolem', dex: 622, types: ['sol', 'spectre'], hp: [48, 53],
    moves: [
      { id: 'poing-ombre', name: 'Poing Ombre', weight: 40, intent: 'attaque', pokeType: 'spectre', damage: 10 },
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 30, intent: 'defense', block: 17 },
      { id: 'pietisol', name: 'Piétisol', weight: 30, intent: 'attaque', pokeType: 'sol', damage: 9, playerStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'drakkarmin', name: 'Drakkarmin', dex: 621, types: ['dragon'], hp: [53, 58],
    moves: [
      { id: 'dracogriffe', name: 'Dracogriffe', weight: 40, intent: 'attaque', pokeType: 'dragon', damage: 12 },
      { id: 'vengeance', name: 'Vengeance', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 10 },
      { id: 'grimace', name: 'Grimace', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
    ],
  },
  {
    id: 'incisache', name: 'Incisache', dex: 611, types: ['dragon'], hp: [42, 46],
    moves: [
      { id: 'draco-queue', name: 'Draco-Queue', weight: 35, intent: 'attaque', pokeType: 'dragon', damage: 10 },
      { id: 'danse-lames', name: 'Danse Lames', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 } },
      { id: 'tranche', name: 'Tranche', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 4, hits: 2 },
    ],
  },
  {
    id: 'polarhume', name: 'Polarhume', dex: 613, types: ['glace'], hp: [41, 44],
    moves: [
      { id: 'vent-glace', name: 'Vent Glace', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 10, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'poudreuse', name: 'Poudreuse', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 8 },
      { id: 'grele', name: 'Grêle', weight: 30, intent: 'handicap', playerStatus: { status: 'defense', stacks: -2 } },
    ],
  },
  {
    id: 'tranchodon', name: 'Tranchodon', dex: 612, types: ['dragon'], hp: [126, 129],
    moves: [
      { id: 'draco-ascension', name: 'Colère', weight: 25, intent: 'attaque', pokeType: 'dragon', damage: 8, hits: 3 },
      { id: 'guillotine', name: 'Guillotine', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 22 },
      { id: 'danse-draco', name: 'Danse Draco', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 15 },
      { id: 'seisme', name: 'Séisme', weight: 25, intent: 'attaque', pokeType: 'sol', damage: 14 },
    ],
  },
  {
    id: 'zekrom', name: 'Zekrom', dex: 644, types: ['dragon', 'electrik'], hp: [238, 238],
    moves: [
      { id: 'eclair-croix', name: 'Éclair Croix', weight: 25, intent: 'attaque', pokeType: 'electrik', damage: 20 },
      { id: 'charge-foudre', name: 'Charge Foudre', weight: 20, intent: 'attaque', pokeType: 'electrik', damage: 23, selfStatus: { status: 'defense', stacks: -1 } },
      { id: 'draco-charge', name: 'Draco-Charge', weight: 20, intent: 'attaque', pokeType: 'dragon', damage: 14, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'chargeur', name: 'Chargeur', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 18 },
      { id: 'cage-eclair', name: 'Cage-Éclair', weight: 15, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 3 } },
    ],
  },
  // Gardien possible de la Tour Dragospire, à la place de Zekrom
  {
    id: 'reshiram', name: 'Reshiram', dex: 643, types: ['dragon', 'feu'], hp: [238, 238],
    moves: [
      { id: 'flamme-croix', name: 'Flamme Croix', weight: 25, intent: 'attaque', pokeType: 'feu', damage: 18, playerStatus: { status: 'brulure', stacks: 2 } },
      { id: 'flamme-bleue', name: 'Flamme Bleue', weight: 15, intent: 'attaque', pokeType: 'feu', damage: 26, playerStatus: { status: 'brulure', stacks: 3 } },
      { id: 'draco-charge', name: 'Draco-Charge', weight: 20, intent: 'attaque', pokeType: 'dragon', damage: 14, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'danse-draco', name: 'Danse Draco', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 16 },
      { id: 'feu-sacre', name: 'Feu Sacré', weight: 15, intent: 'attaque', pokeType: 'feu', damage: 12, hits: 2 },
    ],
  },
];
