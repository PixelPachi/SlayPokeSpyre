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
    talent: { name: 'Instinct maternel', text: 'Le Bébé Kangourex apparaît au début de chaque combat et encaisse les attaques à ta place tant qu’il est debout. Chaque fois que Kangourex ou son Bébé perd des PV, Kangourex gagne 1 Rage.' },
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
  quelorior: {
    id: 'quelorior', name: 'Quelorior', dex: [235], types: ['normal'], maxHp: 72,
    talent: { name: 'Technicien', text: 'Les attaques copiées avec Gribouille infligent 25 % de dégâts en plus.' },
    starterDeck: ['ruse', 'ruse', 'ruse', 'ruse', 'abri', 'abri', 'abri', 'abri', 'quel-gribouille', 'quel-gribouille'],
  },
  duo: {
    id: 'duo', name: 'Posipi & Négapi', dex: [311, 312], types: ['electrik'], maxHp: 80,
    talent: { name: 'Plus & Moins', text: 'Deux combattants de 40 PV (+3 PV max chacun à chaque acte) : celui en première ligne encaisse les coups. Jouer une carte de celui en retrait le fait passer devant (Relais). Posipi : +2 dégâts à la prochaine carte Négapi. Négapi : +2 Protection et −1 PA à la prochaine carte Posipi à 2 PA ou plus. Alterner Posipi → Négapi → Posipi → Négapi dans un tour crée une Décharge Synchro.' },
    starterRelic: 'pile-synchro',
    starterDeck: ['duo-eclair', 'duo-eclair', 'duo-eclair', 'duo-eclair', 'duo-bouclier', 'duo-bouclier', 'duo-bouclier', 'duo-bouclier', 'duo-coup-main', 'duo-etincelle'],
  },
};
