// Ennemis de l'acte 2 — le cœur de la Tour du Temps : grottes et montagnes des cinq régions.
// Plus résistants que ceux de l'acte 1 : chiffres ajustés en simulant des combats avec un deck de fin d'acte 1.
import type { EnemyDef } from '../core/model';

export const ACT2_ENEMIES: EnemyDef[] = [
  // ——— Mont Sélénite (Kanto) ———
  {
    id: 'nosferapti', name: 'Nosferapti', dex: 41, types: ['poison', 'vol'], hp: [22, 26],
    moves: [
      { id: 'vampirisme', name: 'Vampirisme', weight: 40, intent: 'attaque', pokeType: 'insecte', damage: 6 },
      { id: 'cru-ailes', name: 'Cru-Ailes', weight: 35, intent: 'attaque', pokeType: 'vol', damage: 8 },
      { id: 'ultrason', name: 'Ultrason', weight: 25, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
    ],
  },
  {
    id: 'racaillou', name: 'Racaillou', dex: 74, types: ['roche', 'sol'], hp: [29, 32],
    moves: [
      { id: 'jet-pierres', name: 'Jet-Pierres', weight: 45, intent: 'attaque', pokeType: 'roche', damage: 8 },
      { id: 'boul-armure', name: "Boul'Armure", weight: 30, intent: 'defense', block: 10 },
      { id: 'ampleur', name: 'Ampleur', weight: 25, intent: 'attaque', pokeType: 'sol', damage: 4, hits: 3 },
    ],
  },
  {
    id: 'paras', name: 'Paras', dex: 46, types: ['insecte', 'plante'], hp: [24, 27],
    moves: [
      { id: 'griffe', name: 'Griffe', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 7 },
      { id: 'spore', name: 'Para-Spore', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
      { id: 'vampirisme', name: 'Vampirisme', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 6, selfStatus: { status: 'defense', stacks: 1 } },
    ],
  },
  {
    id: 'melofee', name: 'Mélofée', dex: 35, types: ['fee'], hp: [37, 41],
    moves: [
      { id: 'ecras-face', name: "Écras'Face", weight: 35, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'voix-enjoleuse', name: 'Voix Enjôleuse', weight: 35, intent: 'attaque', pokeType: 'fee', damage: 6, playerStatus: { status: 'attaque', stacks: -1 } },
      { id: 'boul-armure', name: "Boul'Armure", weight: 30, intent: 'defense', block: 12 },
    ],
  },
  {
    id: 'nosferalto', name: 'Nosferalto', dex: 42, types: ['poison', 'vol'], hp: [75, 78],
    moves: [
      { id: 'crochet-venin', name: 'Crochet Venin', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 9, playerStatus: { status: 'poison', stacks: 4 } },
      { id: 'tranch-air', name: "Lame d'Air", weight: 35, intent: 'attaque', pokeType: 'vol', damage: 12 },
      { id: 'onde-folie', name: 'Onde Folie', weight: 15, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 3 } },
      { id: 'buee-noire', name: 'Buée Noire', weight: 15, intent: 'defense', block: 15 },
    ],
  },
  {
    id: 'melodelfe', name: 'Mélodelfe', dex: 36, types: ['fee'], hp: [144, 144],
    moves: [
      { id: 'pouvoir-lunaire', name: 'Pouvoir Lunaire', weight: 30, intent: 'attaque', pokeType: 'fee', damage: 14, playerStatus: { status: 'attaque', stacks: -1 } },
      { id: 'metronome', name: 'Métronome', weight: 20, intent: 'attaque', pokeType: 'normal', damage: 5, hits: 3 },
      { id: 'lilliput', name: 'Lilliput', weight: 25, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 16 },
      { id: 'eclat-magique', name: 'Éclat Magique', weight: 25, intent: 'attaque', pokeType: 'fee', damage: 10, selfStatus: { status: 'attaque', stacks: 1 } },
    ],
  },

  // ——— Puits Ramoloss (Johto) ———
  {
    id: 'ramoloss', name: 'Ramoloss', dex: 79, types: ['eau', 'psy'], hp: [37, 42],
    moves: [
      { id: 'pistolet-a-o', name: 'Pistolet à O', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 7 },
      { id: 'choc-mental', name: 'Choc Mental', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 6, playerStatus: { status: 'confusion', stacks: 1 } },
      { id: 'repli', name: 'Repli', weight: 30, intent: 'defense', block: 14 },
    ],
  },
  {
    id: 'ptitard', name: 'Ptitard', dex: 60, types: ['eau'], hp: [22, 26],
    moves: [
      { id: 'bulles-d-o', name: "Bulles d'O", weight: 45, intent: 'attaque', pokeType: 'eau', damage: 6 },
      { id: 'hypnose', name: 'Hypnose', weight: 25, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
      { id: 'torgnoles', name: 'Torgnoles', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 2, hits: 4 },
    ],
  },
  {
    id: 'smogo', name: 'Smogo', dex: 109, types: ['poison'], hp: [27, 31],
    moves: [
      { id: 'detritus', name: 'Détritus', weight: 40, intent: 'attaque', pokeType: 'poison', damage: 6, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'brouillard', name: 'Purédpois', weight: 30, intent: 'handicap', playerStatus: { status: 'poison', stacks: 4 } },
      { id: 'detonation', name: 'Détonation', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 10, selfStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'flagadoss', name: 'Flagadoss', dex: 80, types: ['eau', 'psy'], hp: [82, 85],
    moves: [
      { id: 'hydroqueue', name: 'Hydroqueue', weight: 35, intent: 'attaque', pokeType: 'eau', damage: 11 },
      { id: 'psyko', name: 'Psyko', weight: 30, intent: 'attaque', pokeType: 'psy', damage: 10, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'repli', name: 'Repli', weight: 20, intent: 'defense', block: 20 },
      { id: 'plenitude', name: 'Plénitude', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'roigada', name: 'Roigada', dex: 199, types: ['eau', 'psy'], hp: [152, 152],
    moves: [
      { id: 'surf', name: 'Surf', weight: 25, intent: 'attaque', pokeType: 'eau', damage: 15 },
      { id: 'psyko', name: 'Psyko', weight: 25, intent: 'attaque', pokeType: 'psy', damage: 11, playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'machination', name: 'Machination', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 8 },
      { id: 'vibraqua', name: 'Vibraqua', weight: 15, intent: 'attaque', pokeType: 'eau', damage: 4, hits: 3 },
      { id: 'repos', name: 'Mur Lumière', weight: 15, intent: 'defense', block: 22 },
    ],
  },

  // ——— Mont Chimnée (Hoenn) ———
  {
    id: 'chamallot', name: 'Chamallot', dex: 322, types: ['feu', 'sol'], hp: [31, 34],
    moves: [
      { id: 'flammeche', name: 'Flammèche', weight: 40, intent: 'attaque', pokeType: 'feu', damage: 6, playerStatus: { status: 'brulure', stacks: 2 } },
      { id: 'pietisol', name: 'Piétisol', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 8 },
      { id: 'rengorgement', name: 'Rengorgement', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 1 }, block: 7 },
    ],
  },
  {
    id: 'spoink', name: 'Spoink', dex: 325, types: ['psy'], hp: [26, 29],
    moves: [
      { id: 'rafale-psy', name: 'Rafale Psy', weight: 45, intent: 'attaque', pokeType: 'psy', damage: 7, playerStatus: { status: 'confusion', stacks: 1 } },
      { id: 'bouclier', name: 'Bouclier', weight: 30, intent: 'defense', block: 11 },
      { id: 'regard-medusant', name: 'Regard Médusant', weight: 25, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
    ],
  },
  {
    id: 'spinda', name: 'Spinda', dex: 327, types: ['normal'], hp: [31, 36],
    moves: [
      { id: 'danse-folle', name: 'Danse-Folle', weight: 30, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 3 } },
      { id: 'uppercut', name: 'Uppercut', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'mania', name: 'Mania', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 4 },
    ],
  },
  {
    id: 'chartor', name: 'Chartor', dex: 324, types: ['feu'], hp: [78, 82],
    moves: [
      { id: 'lance-flammes', name: 'Lance-Flammes', weight: 35, intent: 'attaque', pokeType: 'feu', damage: 11, playerStatus: { status: 'brulure', stacks: 3 } },
      { id: 'repli', name: 'Repli', weight: 25, intent: 'defense', block: 22 },
      { id: 'surchauffe', name: 'Surchauffe', weight: 20, intent: 'attaque', pokeType: 'feu', damage: 18, selfStatus: { status: 'attaque', stacks: -2 } },
      { id: 'brouillard', name: 'Brouillard', weight: 20, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
    ],
  },
  {
    id: 'camerupt', name: 'Camérupt', dex: 323, types: ['feu', 'sol'], hp: [160, 160],
    moves: [
      { id: 'eruption', name: 'Éruption', weight: 20, intent: 'attaque', pokeType: 'feu', damage: 20 },
      { id: 'seisme', name: 'Séisme', weight: 25, intent: 'attaque', pokeType: 'sol', damage: 13 },
      { id: 'telluriforce', name: 'Telluriforce', weight: 20, intent: 'attaque', pokeType: 'sol', damage: 10, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'boutefeu', name: 'Danse Flammes', weight: 20, intent: 'handicap', playerStatus: { status: 'brulure', stacks: 5 } },
      { id: 'rengorgement', name: 'Rengorgement', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 16 },
    ],
  },

  // ——— Mont Couronné (Sinnoh) ———
  {
    id: 'machoc', name: 'Machoc', dex: 66, types: ['combat'], hp: [31, 34],
    moves: [
      { id: 'balayage', name: 'Balayage', weight: 40, intent: 'attaque', pokeType: 'combat', damage: 8 },
      { id: 'puissance', name: 'Puissance', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 } },
      { id: 'poing-karate', name: 'Poing-Karaté', weight: 35, intent: 'attaque', pokeType: 'combat', damage: 4, hits: 2 },
    ],
  },
  {
    id: 'kranidos', name: 'Kranidos', dex: 408, types: ['roche'], hp: [32, 36],
    moves: [
      { id: 'coup-d-boule', name: "Coup d'Boule", weight: 40, intent: 'attaque', pokeType: 'normal', damage: 9 },
      { id: 'eboulement', name: 'Éboulement', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 7, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'groz-yeux', name: "Groz'Yeux", weight: 25, intent: 'handicap', playerStatus: { status: 'defense', stacks: -1 } },
    ],
  },
  {
    id: 'dinoclier', name: 'Dinoclier', dex: 410, types: ['roche', 'acier'], hp: [36, 39],
    moves: [
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 40, intent: 'defense', block: 14 },
      { id: 'tete-de-fer', name: 'Tête de Fer', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 8 },
      { id: 'provoc', name: 'Provoc', weight: 25, intent: 'handicap', playerStatus: { status: 'attaque', stacks: -1 } },
    ],
  },
  {
    id: 'moufouette', name: 'Moufouette', dex: 434, types: ['poison', 'tenebres'], hp: [27, 31],
    moves: [
      { id: 'tranche', name: 'Tranche', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 8 },
      { id: 'puredpois', name: 'Purédpois', weight: 30, intent: 'handicap', playerStatus: { status: 'poison', stacks: 4 } },
      { id: 'feinte', name: 'Feinte', weight: 35, intent: 'attaque', pokeType: 'tenebres', damage: 6, playerStatus: { status: 'peur', stacks: 1 } },
    ],
  },
  {
    id: 'bastiodon', name: 'Bastiodon', dex: 411, types: ['roche', 'acier'], hp: [88, 92],
    moves: [
      { id: 'mur-de-fer', name: 'Mur de Fer', weight: 30, intent: 'defense', block: 22 },
      { id: 'tete-de-fer', name: 'Tête de Fer', weight: 30, intent: 'attaque', pokeType: 'acier', damage: 10, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'vengeance', name: 'Vengeance', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 13 },
      { id: 'abri', name: 'Garde Large', weight: 15, intent: 'boost', selfStatus: { status: 'defense', stacks: 2 }, block: 12 },
    ],
  },
  {
    id: 'charkos', name: 'Charkos', dex: 409, types: ['roche'], hp: [148, 148],
    moves: [
      { id: 'fracass-tete', name: "Fracass'Tête", weight: 20, intent: 'attaque', pokeType: 'roche', damage: 21 },
      { id: 'mitra-poing', name: 'Lame de Roc', weight: 25, intent: 'attaque', pokeType: 'roche', damage: 13 },
      { id: 'seisme', name: 'Séisme', weight: 20, intent: 'attaque', pokeType: 'sol', damage: 11 },
      { id: 'hate', name: 'Hâte', weight: 20, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 } },
      { id: 'grondement', name: 'Groz\'Yeux', weight: 15, intent: 'handicap', playerStatus: { status: 'defense', stacks: -2 } },
    ],
  },

  // ——— Grotte Électrolithe (Unys) ———
  {
    id: 'statitik', name: 'Statitik', dex: 595, types: ['insecte', 'electrik'], hp: [20, 24],
    moves: [
      { id: 'eclair', name: 'Éclair', weight: 35, intent: 'attaque', pokeType: 'electrik', damage: 6, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'vampirisme', name: 'Vampirisme', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 6 },
      { id: 'toile-elek', name: 'Toile Élek', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
    ],
  },
  {
    id: 'anchwatt', name: 'Anchwatt', dex: 602, types: ['electrik'], hp: [26, 29],
    moves: [
      { id: 'cage-eclair', name: 'Cage-Éclair', weight: 30, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
      { id: 'charge', name: 'Charge', weight: 40, intent: 'attaque', pokeType: 'normal', damage: 7 },
      { id: 'etincelle', name: 'Étincelle', weight: 30, intent: 'attaque', pokeType: 'electrik', damage: 8 },
    ],
  },
  {
    id: 'grindur', name: 'Grindur', dex: 597, types: ['plante', 'acier'], hp: [32, 36],
    moves: [
      { id: 'balle-graine', name: 'Balle Graine', weight: 35, intent: 'attaque', pokeType: 'plante', damage: 8 },
      { id: 'picots', name: 'Picots', weight: 30, intent: 'defense', block: 13 },
      { id: 'gyroballe', name: 'Gyroballe', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 9 },
    ],
  },
  {
    id: 'rototaupe', name: 'Rototaupe', dex: 529, types: ['sol'], hp: [31, 34],
    moves: [
      { id: 'tunnel', name: 'Tunnel', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 9, selfStatus: { status: 'defense', stacks: 1 } },
      { id: 'griffe-acier', name: 'Griffe Acier', weight: 35, intent: 'attaque', pokeType: 'acier', damage: 7 },
      { id: 'tour-rapide', name: 'Tour Rapide', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 3 },
    ],
  },
  {
    id: 'mygavolt', name: 'Mygavolt', dex: 596, types: ['insecte', 'electrik'], hp: [73, 76],
    moves: [
      { id: 'tonnerre', name: 'Tonnerre', weight: 30, intent: 'attaque', pokeType: 'electrik', damage: 11, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'plaie-croix', name: 'Plaie-Croix', weight: 30, intent: 'attaque', pokeType: 'insecte', damage: 10 },
      { id: 'toile-elek', name: 'Toile Élek', weight: 20, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 3 } },
      { id: 'rayon-signal', name: 'Rayon Signal', weight: 20, intent: 'attaque', pokeType: 'insecte', damage: 4, hits: 3 },
    ],
  },
  {
    id: 'ohmassacre', name: 'Ohmassacre', dex: 604, types: ['electrik'], hp: [156, 156],
    moves: [
      { id: 'eclair-fou', name: 'Éclair Fou', weight: 25, intent: 'attaque', pokeType: 'electrik', damage: 17 },
      { id: 'crocs-eclair', name: 'Crocs Éclair', weight: 25, intent: 'attaque', pokeType: 'electrik', damage: 9, playerStatus: { status: 'paralysie', stacks: 2 } },
      { id: 'mache-ecrase', name: 'Dracogriffe', weight: 20, intent: 'attaque', pokeType: 'dragon', damage: 12 },
      { id: 'recharge', name: 'Chargeur', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 12 },
      { id: 'vampi-poing', name: 'Vampi-Poing', weight: 15, intent: 'attaque', pokeType: 'combat', damage: 6, hits: 2 },
    ],
  },
];
