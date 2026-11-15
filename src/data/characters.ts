import type { CharacterDef, CharacterId } from '../core/model';

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  riolu: {
    id: 'riolu', name: 'Riolu', dex: [447, 448], types: ['combat'], maxHp: 75,
    talent: { name: 'Justicier', text: 'Commence chaque combat avec 3 Aura.' },
    // 4 attaques de base, 4 cartes bouclier, 2 cartes de son type
    starterDeck: [
      'ruse', 'ruse', 'ruse', 'ruse',
      'detection', 'detection', 'detection', 'detection',
      'poing-karate', 'aurasphere',
    ],
  },
  vipelierre: {
    id: 'vipelierre', name: 'Vipélierre', dex: [495, 496, 497], types: ['plante'], maxHp: 70,
    talent: { name: 'Contestation', text: 'Ses baisses de stats deviennent des hausses, et inversement.' },
    starterDeck: ['charge', 'charge', 'charge', 'charge', 'abri', 'abri', 'abri', 'abri', 'vampigraine', 'tempete-verte'],
  },
  kangourex: {
    id: 'kangourex', name: 'Kangourex', dex: [115], types: ['normal'], maxHp: 85,
    talent: { name: 'Instinct maternel', text: 'Le Bébé Kangourex apparaît au début de chaque combat.' },
    // + 2 cartes de son type, à créer avec la mécanique du Bébé
    starterDeck: ['ecras-face', 'ecras-face', 'ecras-face', 'ecras-face', 'abri', 'abri', 'abri', 'abri'],
  },
  caninos: {
    id: 'caninos', name: 'Caninos', dex: [58, 59], types: ['feu'], maxHp: 78,
    talent: { name: 'Intimidation', text: 'Au premier tour, tous les ennemis ont Attaque −1.' },
    starterDeck: ['griffe', 'griffe', 'griffe', 'griffe', 'abri', 'abri', 'abri', 'abri', 'flammeche', 'morsure'],
  },
  mew: {
    id: 'mew', name: 'Mew', dex: [151], types: ['psy'], maxHp: 70,
    talent: { name: 'Gène ancestral', text: 'A accès aux cartes de tous les personnages.' },
    starterDeck: [],
  },
};
