// Îles Écume (acte 2, Kanto) : grottes gelées battues par la mer, Pokémon Eau et Glace. Gardien : Artikodin.
import type { EnemyDef } from '../core/model';

export const ECUME_ENEMIES: EnemyDef[] = [
  {
    id: 'otaria', name: 'Otaria', dex: 86, types: ['eau'], hp: [27, 31],
    moves: [
      { id: 'onde-glace', name: 'Onde Boréale', weight: 40, intent: 'attaque', pokeType: 'glace', damage: 7, playerStatus: { status: 'attaque', stacks: -1 } },
      { id: 'coup-d-boule-ot', name: "Coup d'Boule", weight: 35, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'repos-ot', name: 'Repos', weight: 25, intent: 'boost', heal: 8 },
    ],
  },
  {
    id: 'krabby', name: 'Krabby', dex: 98, types: ['eau'], hp: [24, 28],
    moves: [
      { id: 'pince-masse', name: 'Pince-Masse', weight: 40, intent: 'attaque', pokeType: 'eau', damage: 9 },
      { id: 'armure-kr', name: 'Armure', weight: 30, intent: 'defense', block: 10, selfStatus: { status: 'defense', stacks: 1 } },
      { id: 'ecume', name: 'Écume', weight: 30, intent: 'attaque', pokeType: 'eau', damage: 3, hits: 2 },
    ],
  },
  {
    id: 'akwakwak', name: 'Akwakwak', dex: 55, types: ['eau'], hp: [29, 33],
    moves: [
      { id: 'hydrocanon-ak', name: 'Hydrocanon', weight: 30, intent: 'attaque', pokeType: 'eau', damage: 11 },
      { id: 'choc-mental-ak', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 7, playerStatus: { status: 'confusion', stacks: 1 } },
      { id: 'amnesie', name: 'Amnésie', weight: 35, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 6 },
    ],
  },
  {
    id: 'poissirene', name: 'Poissirène', dex: 118, types: ['eau'], hp: [22, 26],
    moves: [
      { id: 'koud-korne-po', name: 'Koud’Korne', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'cascade', name: 'Cascade', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 7, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'hate-po', name: 'Hâte', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 4 },
    ],
  },
  {
    id: 'lippouti', name: 'Lippouti', dex: 238, types: ['glace', 'psy'], hp: [21, 25],
    moves: [
      { id: 'poudreuse', name: 'Poudreuse', weight: 40, intent: 'attaque', pokeType: 'glace', damage: 6, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'bisou', name: 'Doux Baiser', weight: 30, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'choc-psy-li', name: 'Choc Psy', weight: 30, intent: 'attaque', pokeType: 'psy', damage: 8 },
    ],
  },
  {
    id: 'crustabri', name: 'Crustabri', dex: 91, types: ['eau', 'glace'], hp: [30, 34],
    moves: [
      { id: 'stalactite', name: 'Stalactite', weight: 40, intent: 'attaque', pokeType: 'glace', damage: 3, hits: 4 },
      { id: 'repli', name: 'Repli', weight: 35, intent: 'defense', block: 14, selfStatus: { status: 'defense', stacks: 1 } },
      { id: 'exuviation', name: 'Exuviation', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  // ——— Dominants ———
  {
    id: 'lamantine', name: 'Lamantine', dex: 87, types: ['eau', 'glace'], hp: [78, 82],
    moves: [
      { id: 'laser-glace-la', name: 'Laser Glace', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 12, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'aqua-jet', name: 'Aqua-Jet', weight: 30, intent: 'attaque', pokeType: 'eau', damage: 4, hits: 3 },
      { id: 'repos-la', name: 'Repos', weight: 15, intent: 'boost', heal: 16 },
      { id: 'grele', name: 'Grêle', weight: 20, intent: 'boost', block: 8, meteo: 'grele' },
    ],
  },
  {
    id: 'lippoutou', name: 'Lippoutou', dex: 124, types: ['glace', 'psy'], hp: [74, 78],
    moves: [
      { id: 'poing-glace', name: 'Poing Glace', weight: 35, intent: 'attaque', pokeType: 'glace', damage: 11, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'psyko-lp', name: 'Psyko', weight: 30, intent: 'attaque', pokeType: 'psy', damage: 13 },
      { id: 'berceuse-lp', name: 'Berceuse', weight: 20, intent: 'handicap', playerStatus: { status: 'sommeil', stacks: 1 } },
      { id: 'danse-lp', name: 'Danse Lune', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 8 },
    ],
  },
  // ——— Gardien ———
  {
    id: 'artikodin', name: 'Artikodin', dex: 144, types: ['glace', 'vol'], hp: [150, 150],
    moves: [
      { id: 'laser-glace-ar', name: 'Laser Glace', weight: 25, intent: 'attaque', pokeType: 'glace', damage: 13 },
      { id: 'lame-d-air-ar', name: "Lame d'Air", weight: 25, intent: 'attaque', pokeType: 'vol', damage: 6, hits: 2, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'brume-ar', name: 'Brume', weight: 20, intent: 'defense', block: 20 },
      { id: 'danse-glace', name: 'Vent Glace', weight: 15, intent: 'attaque', pokeType: 'glace', damage: 4, hits: 3 },
      { id: 'repos-ar', name: 'Atterrissage', weight: 15, intent: 'boost', heal: 18, selfStatus: { status: 'defense', stacks: 1 } },
    ],
  },
];
