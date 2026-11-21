// Acte secret : la Salle Originelle. On n'y entre qu'avec le Rouage du Temps ET le Rouage de l'Espace,
// après avoir apaisé Dialga Primal. Peu d'étages, mais des ennemis redoutables, et Arceus au sommet.
import type { EnemyDef } from '../core/model';

export const ORIGIN_ENEMIES: EnemyDef[] = [
  {
    id: 'maganon', name: 'Maganon', dex: 467, types: ['feu'], hp: [104, 112],
    moves: [
      { id: 'lance-flammes', name: 'Lance-Flammes', weight: 30, intent: 'attaque', pokeType: 'feu', damage: 18, playerStatus: { status: 'brulure', stacks: 3 } },
      { id: 'boutefeu', name: 'Boutefeu', weight: 20, intent: 'attaque', pokeType: 'feu', damage: 26 },
      { id: 'canon-graine', name: 'Canon Graine', weight: 20, intent: 'attaque', pokeType: 'plante', damage: 7, hits: 3 },
      { id: 'zenith', name: 'Zénith', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 16, meteo: 'zenith' },
      { id: 'feu-follet', name: 'Feu Follet', weight: 15, intent: 'handicap', playerStatus: { status: 'brulure', stacks: 5 } },
    ],
  },
  {
    id: 'elekable', name: 'Élekable', dex: 466, types: ['electrik'], hp: [104, 112],
    moves: [
      { id: 'poing-eclair', name: 'Poing Éclair', weight: 30, intent: 'attaque', pokeType: 'electrik', damage: 17, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'giga-impact', name: 'Giga Impact', weight: 15, intent: 'attaque', pokeType: 'normal', damage: 30 },
      { id: 'fatal-foudre', name: 'Fatal-Foudre', weight: 20, intent: 'attaque', pokeType: 'electrik', damage: 22 },
      { id: 'mach-punch', name: 'Mach Punch', weight: 20, intent: 'attaque', pokeType: 'combat', damage: 6, hits: 3 },
      { id: 'champ-electrifie', name: 'Champ Électrifié', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 14, meteo: 'champ-electrifie' },
    ],
  },
  {
    id: 'momartik', name: 'Momartik', dex: 478, types: ['glace', 'spectre'], hp: [92, 98],
    moves: [
      { id: 'ball-ombre', name: "Ball'Ombre", weight: 30, intent: 'attaque', pokeType: 'spectre', damage: 17, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'blizzard', name: 'Blizzard', weight: 25, intent: 'attaque', pokeType: 'glace', damage: 20, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'vent-glace', name: 'Vent Glace', weight: 20, intent: 'attaque', pokeType: 'glace', damage: 8, hits: 2, playerStatus: { status: 'gel', stacks: 1 } },
      { id: 'destin', name: 'Prélèvement Destin', weight: 15, intent: 'handicap', playerStatus: { status: 'peur', stacks: 3 } },
      { id: 'grele', name: 'Grêle', weight: 10, intent: 'boost', block: 18, meteo: 'grele' },
    ],
  },
  {
    id: 'bouldeneu', name: 'Bouldeneu', dex: 465, types: ['plante'], hp: [128, 136],
    moves: [
      { id: 'mega-fouet', name: 'Méga Fouet', weight: 30, intent: 'attaque', pokeType: 'plante', damage: 20 },
      { id: 'pouvoir-antique', name: 'Pouvoir Antique', weight: 20, intent: 'attaque', pokeType: 'roche', damage: 14, selfStatus: { status: 'attaque', stacks: 1 } },
      { id: 'vampigraine', name: 'Vampigraine', weight: 20, intent: 'handicap', playerStatus: { status: 'vampigraine', stacks: 5 } },
      { id: 'etreinte', name: 'Étreinte', weight: 15, intent: 'attaque', pokeType: 'normal', damage: 5, hits: 4 },
      { id: 'synthese', name: 'Synthèse', weight: 15, intent: 'boost', block: 26, heal: 18 },
    ],
  },
  {
    id: 'gallame-mega', name: 'Méga-Gallame', dex: 10068, types: ['psy', 'combat'], hp: [210, 220],
    moves: [
      { id: 'lame-psychique', name: 'Lame Psychique', weight: 25, intent: 'attaque', pokeType: 'psy', damage: 24 },
      { id: 'close-combat', name: 'Close Combat', weight: 25, intent: 'attaque', pokeType: 'combat', damage: 30, selfStatus: { status: 'defense', stacks: -1 } },
      { id: 'coupe-psycho', name: 'Coupe Psycho', weight: 20, intent: 'attaque', pokeType: 'psy', damage: 9, hits: 3 },
      { id: 'danse-lames', name: 'Danse Lames', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 24 },
      { id: 'hypnose', name: 'Hypnose', weight: 15, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 3 } },
    ],
  },
  {
    // Arceus copie ton deck : chacune de ses actions est une de tes cartes (voir le gimmick « miroir-originel »),
    // et tous les 4 tours il lance Jugement.
    id: 'arceus', name: 'Arceus', dex: 493, types: ['normal'], hp: [560, 560],
    moves: [
      { id: 'jugement', name: 'Jugement', weight: 0, intent: 'attaque', pokeType: 'normal', damage: 34, signature: true },
      { id: 'recuperation', name: 'Récupération', weight: 0, intent: 'boost', block: 30, heal: 30 },
    ],
    gimmick: { id: 'miroir-originel', name: 'Miroir Originel', text: 'Arceus copie ton deck : à chaque tour, il utilise une de tes propres cartes, en plus fort. Tous les 4 tours, il lance Jugement.' },
  },
];
