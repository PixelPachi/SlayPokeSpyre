import type { CharacterDef, CharacterId } from '../core/model';

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  riolu: {
    id: 'riolu', name: 'Riolu', dex: [447, 448], types: ['combat'], maxHp: 75,
    evolutions: [{ act: 2, dex: 448, name: 'Lucario', types: ['combat', 'acier'], hp: 10 }],
    mega: { stone: 'lucarite', dex: 10059, name: 'Méga-Lucario', types: ['combat', 'acier'], fromAct: 2 },
    talent: { name: 'Justicier', text: 'Commence chaque combat avec 3 Aura.' },
    // 4 attaques de base, 4 cartes bouclier, 2 cartes de son type
    starterRelic: 'ceinture-noire',
    starterDeck: [
      'ruse', 'ruse', 'ruse', 'ruse',
      'detection', 'detection', 'detection', 'detection',
      'poing-karate', 'aurasphere',
    ],
  },
  vipelierre: {
    id: 'vipelierre', name: 'Vipélierre', dex: [495, 496, 497], types: ['plante'], maxHp: 70,
    evolutions: [{ act: 2, dex: 496, name: 'Lianaja', types: ['plante'], hp: 6 }, { act: 3, dex: 497, name: 'Majaspic', types: ['plante'], hp: 8 }],
    talent: { name: 'Contestation', text: 'Ses baisses d’Attaque et de Défense deviennent des hausses, et inversement.' },
    starterRelic: 'grain-miracle',
    starterDeck: ['charge', 'charge', 'charge', 'charge', 'abri', 'abri', 'abri', 'abri', 'vampigraine', 'tempete-verte'],
  },
  kangourex: {
    id: 'kangourex', name: 'Kangourex', dex: [115], types: ['normal'], maxHp: 85,
    mega: { stone: 'kangourexite', dex: 10039, name: 'Méga-Kangourex', types: ['normal'], fromAct: 1 },
    talent: { name: 'Instinct maternel', text: 'Le Bébé Kangourex apparaît au début de chaque combat. Chaque fois que Kangourex perd des PV, il gagne 1 Rage.' },
    starterRelic: 'lait-meumeu',
    starterDeck: ['ecras-face', 'ecras-face', 'ecras-face', 'ecras-face', 'abri', 'abri', 'abri', 'abri', 'kan-coup-main', 'kan-coup-double'],
  },
  caninos: {
    id: 'caninos', name: 'Caninos', dex: [58, 59], types: ['feu'], maxHp: 78,
    evolutions: [{ act: 2, dex: 59, name: 'Arcanin', types: ['feu'], hp: 12 }],
    talent: { name: 'Intimidation', text: 'Au premier tour, tous les ennemis ont Attaque −1.' },
    starterRelic: 'charbon',
    starterDeck: ['griffe', 'griffe', 'griffe', 'griffe', 'abri', 'abri', 'abri', 'abri', 'flammeche', 'morsure'],
  },
  mew: {
    id: 'mew', name: 'Mew', dex: [151], types: ['psy'], maxHp: 70,
    talent: { name: 'Gène ancestral', text: 'A accès aux cartes de tous les personnages.' },
    starterDeck: ['mew-ecras-face', 'mew-ecras-face', 'mew-ecras-face', 'mew-ecras-face', 'abri', 'abri', 'abri', 'abri', 'mew-morphing', 'mew-choc-mental'],
  },
};
