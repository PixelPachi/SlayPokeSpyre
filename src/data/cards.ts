// Toutes les cartes du jeu. Ajouter une carte = ajouter une entrée ici (aucun code à écrire).
// Règle du GDD : la plupart des cartes portent le nom d'une capacité que le Pokémon peut apprendre dans les jeux.
import type { CardDef } from '../core/model';
import { RIOLU_CARDS } from './cards-riolu';

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

CARDS.push(...RIOLU_CARDS);

export const CARD_DEFS: Record<string, CardDef> = Object.fromEntries(CARDS.map((c) => [c.id, c]));

/** Définition d'une carte, version améliorée appliquée si besoin. */
export function cardDef(defId: string, upgraded = false): CardDef {
  const base = CARD_DEFS[defId];
  if (!base) throw new Error(`Carte inconnue : ${defId}`);
  if (!upgraded) return base;
  return { ...base, ...base.upgrade, name: `${base.name}+` };
}

/** Cartes qu'un personnage peut obtenir en récompense (hors cartes de départ), limitées aux cartes débloquées. */
export function rewardPool(character: string, unlocked?: string[]): CardDef[] {
  return CARDS.filter((c) => c.character === character && c.rarity !== 'depart' && (!unlocked || unlocked.includes(c.id)));
}

export function allCards(): CardDef[] {
  return CARDS;
}
