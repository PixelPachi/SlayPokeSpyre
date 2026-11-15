// Toutes les cartes du jeu. Ajouter une carte = ajouter une entrée ici (aucun code à écrire).
// Règle du GDD : la plupart des cartes portent le nom d'une capacité que le Pokémon peut apprendre dans les jeux.
import type { CardDef } from '../core/model';

const CARDS: CardDef[] = [
  // ——— Carte bouclier de départ (commune à Vipélierre, Kangourex et Caninos) ———
  {
    id: 'abri', name: 'Abri', character: 'normal', pokeType: 'normal', category: 'technique',
    rarity: 'depart', cost: 1, target: 'soi',
    effects: [{ kind: 'protection', amount: 5 }],
    upgrade: { effects: [{ kind: 'protection', amount: 8 }] },
  },

  // ——— Attaques de base des starters (4 exemplaires dans chaque deck de départ) ———
  {
    id: 'ruse', name: 'Ruse', character: 'riolu', pokeType: 'normal', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6 }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }] },
  },
  {
    id: 'charge', name: 'Charge', character: 'vipelierre', pokeType: 'normal', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6 }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }] },
  },
  {
    id: 'ecras-face', name: "Écras'Face", character: 'kangourex', pokeType: 'normal', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6 }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }] },
  },
  {
    id: 'griffe', name: 'Griffe', character: 'caninos', pokeType: 'normal', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6 }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }] },
  },

  // ——— Riolu : départ ———
  {
    id: 'detection', name: 'Détection', character: 'riolu', pokeType: 'combat', category: 'technique',
    rarity: 'depart', cost: 1, target: 'soi',
    effects: [{ kind: 'protection', amount: 5 }],
    upgrade: { effects: [{ kind: 'protection', amount: 8 }] },
  },
  {
    id: 'poing-karate', name: 'Poing-Karaté', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 8 }],
    upgrade: { effects: [{ kind: 'degats', amount: 11 }] },
  },
  {
    id: 'aurasphere', name: 'Aurasphère', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'depart', cost: 3, target: 'ennemi',
    effects: [{ kind: 'degats-aura', mult: 2 }],
    upgrade: { cost: 2 },
  },

  // ——— Riolu : récompenses ———
  {
    id: 'riposte', name: 'Riposte', character: 'riolu', pokeType: 'combat', category: 'technique',
    rarity: 'commune', cost: 1, target: 'soi',
    effects: [{ kind: 'protection', amount: 4 }, { kind: 'aura', amount: 4 }],
    upgrade: { effects: [{ kind: 'protection', amount: 6 }, { kind: 'aura', amount: 6 }] },
  },
  {
    id: 'balayette', name: 'Balayette', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'commune', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 5 }, { kind: 'statut', status: 'peur', stacks: 1, on: 'cible' }],
    upgrade: { effects: [{ kind: 'degats', amount: 7 }, { kind: 'statut', status: 'peur', stacks: 2, on: 'cible' }] },
  },
  {
    id: 'tenacite', name: 'Ténacité', character: 'riolu', pokeType: 'normal', category: 'technique',
    rarity: 'commune', cost: 0, target: 'soi',
    effects: [{ kind: 'perte-pv', amount: 3 }, { kind: 'pioche', amount: 2 }],
    upgrade: { effects: [{ kind: 'perte-pv', amount: 3 }, { kind: 'pioche', amount: 3 }] },
  },
  {
    id: 'forte-paume', name: 'Forte-Paume', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'commune', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 9 }, { kind: 'statut', status: 'paralysie', stacks: 1, on: 'cible' }],
    upgrade: { effects: [{ kind: 'degats', amount: 12 }, { kind: 'statut', status: 'paralysie', stacks: 2, on: 'cible' }] },
  },
  {
    id: 'mach-punch', name: 'Mach Punch', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'commune', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6 }, { kind: 'pioche', amount: 1 }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }, { kind: 'pioche', amount: 1 }] },
  },
  {
    id: 'pisto-poing', name: 'Pisto-Poing', character: 'riolu', pokeType: 'acier', category: 'attaque',
    rarity: 'commune', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 7 }],
    upgrade: { effects: [{ kind: 'degats', amount: 10 }] },
  },
  {
    id: 'vive-attaque', name: 'Vive-Attaque', character: 'riolu', pokeType: 'normal', category: 'attaque',
    rarity: 'commune', cost: 0, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 4 }],
    upgrade: { effects: [{ kind: 'degats', amount: 4 }, { kind: 'pioche', amount: 1 }] },
  },
  {
    id: 'gonflette', name: 'Gonflette', character: 'riolu', pokeType: 'combat', category: 'technique',
    rarity: 'peu-commune', cost: 1, target: 'soi',
    effects: [{ kind: 'statut', status: 'attaque', stacks: 1, on: 'soi' }, { kind: 'statut', status: 'defense', stacks: 1, on: 'soi' }],
    keywords: ['epuisee'],
    upgrade: { cost: 0 },
  },
  {
    id: 'coup-croix', name: 'Coup-Croix', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'peu-commune', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 14 }, { kind: 'perte-pv', amount: 2 }],
    upgrade: { effects: [{ kind: 'degats', amount: 19 }, { kind: 'perte-pv', amount: 2 }] },
  },
  {
    id: 'close-combat', name: 'Close Combat', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'peu-commune', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 18 }, { kind: 'statut', status: 'defense', stacks: -1, on: 'soi' }],
    upgrade: { effects: [{ kind: 'degats', amount: 24 }, { kind: 'statut', status: 'defense', stacks: -1, on: 'soi' }] },
  },
  {
    id: 'vitesse-extreme', name: 'Vitesse Extrême', character: 'riolu', pokeType: 'normal', category: 'attaque',
    rarity: 'rare', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6, hits: 2 }, { kind: 'pioche', amount: 1 }],
    upgrade: { effects: [{ kind: 'degats', amount: 8, hits: 2 }, { kind: 'pioche', amount: 1 }] },
  },
  {
    id: 'megapoing', name: 'Mégapoing', character: 'riolu', pokeType: 'normal', category: 'attaque',
    rarity: 'rare', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 20 }],
    upgrade: { effects: [{ kind: 'degats', amount: 27 }] },
  },
  {
    id: 'ultimawashi', name: 'Ultimawashi', character: 'riolu', pokeType: 'normal', category: 'attaque',
    rarity: 'rare', cost: 3, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 30 }],
    upgrade: { effects: [{ kind: 'degats', amount: 38 }] },
  },
  {
    id: 'machination', name: 'Machination', character: 'riolu', pokeType: 'tenebres', category: 'technique',
    rarity: 'rare', cost: 1, target: 'soi',
    effects: [{ kind: 'aura', amount: 10 }, { kind: 'pa', amount: 1 }],
    keywords: ['epuisee'],
    upgrade: { effects: [{ kind: 'aura', amount: 15 }, { kind: 'pa', amount: 1 }] },
  },

  // ——— Vipélierre : départ ———
  {
    id: 'vampigraine', name: 'Vampigraine', character: 'vipelierre', pokeType: 'plante', category: 'technique',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'statut', status: 'vampigraine', stacks: 4, on: 'cible' }],
    upgrade: { effects: [{ kind: 'statut', status: 'vampigraine', stacks: 6, on: 'cible' }] },
  },
  {
    id: 'tempete-verte', name: 'Tempête Verte', character: 'vipelierre', pokeType: 'plante', category: 'attaque',
    rarity: 'depart', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 12 }, { kind: 'statut', status: 'attaque', stacks: -2, on: 'soi' }],
    upgrade: { effects: [{ kind: 'degats', amount: 16 }, { kind: 'statut', status: 'attaque', stacks: -2, on: 'soi' }] },
  },

  // ——— Caninos : départ ———
  {
    id: 'flammeche', name: 'Flammèche', character: 'caninos', pokeType: 'feu', category: 'attaque',
    rarity: 'depart', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 8 }, { kind: 'statut', status: 'brulure', stacks: 2, on: 'cible' }],
    upgrade: { effects: [{ kind: 'degats', amount: 10 }, { kind: 'statut', status: 'brulure', stacks: 3, on: 'cible' }] },
  },
  {
    id: 'morsure', name: 'Morsure', character: 'caninos', pokeType: 'tenebres', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 7 }, { kind: 'statut', status: 'peur', stacks: 1, on: 'cible' }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }, { kind: 'statut', status: 'peur', stacks: 2, on: 'cible' }] },
  },
];

export const CARD_DEFS: Record<string, CardDef> = Object.fromEntries(CARDS.map((c) => [c.id, c]));

/** Définition d'une carte, version améliorée appliquée si besoin. */
export function cardDef(defId: string, upgraded = false): CardDef {
  const base = CARD_DEFS[defId];
  if (!base) throw new Error(`Carte inconnue : ${defId}`);
  if (!upgraded) return base;
  return { ...base, ...base.upgrade, name: `${base.name}+` };
}

/** Cartes qu'un personnage peut obtenir en récompense (hors cartes de départ). */
export function rewardPool(character: string): CardDef[] {
  return CARDS.filter((c) => c.character === character && c.rarity !== 'depart');
}
