// Toutes les cartes du jeu. Ajouter une carte = ajouter une entrée ici (aucun code à écrire).
// Règle du GDD : la plupart des cartes portent le nom d'une capacité que le Pokémon peut apprendre dans les jeux.
import type { CardDef } from '../core/model';
import { VIPELIERRE_CARDS } from './cards-vipelierre';
import { KANGOUREX_CARDS } from './cards-kangourex';
import { CANINOS_CARDS } from './cards-caninos';
import { MEW_CARDS } from './cards-mew';
import { RIOLU_CARDS } from './cards-riolu';
import { NEUTRAL_CARDS } from './cards-neutres';

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

// Diable inversé : les attaques de départ deviennent Vampirisme, les protections de départ deviennent Soin
CARDS.push({
  id: 'diable-vampirisme', name: 'Vampirisme', character: 'normal', pokeType: 'insecte', category: 'attaque', rarity: 'depart',
  cost: 1, target: 'ennemi', effects: [{ kind: 'degats', amount: 4 }, { kind: 'soin', amount: 2 }],
  upgrade: { effects: [{ kind: 'degats', amount: 6 }, { kind: 'soin', amount: 3 }] },
}, {
  id: 'diable-soin', name: 'Soin', character: 'normal', pokeType: 'normal', category: 'technique', rarity: 'depart',
  cost: 1, target: 'soi', effects: [{ kind: 'soin', amount: 5 }],
  upgrade: { effects: [{ kind: 'soin', amount: 7 }] },
});
// Malédiction d'un vœu raté (L'Étoile) : injouable, elle encombre la main
CARDS.push({
  id: 'voeu-brise', name: 'Vœu Brisé', character: 'normal', pokeType: 'spectre', category: 'statut', rarity: 'depart',
  cost: 0, target: 'soi', effects: [], keywords: ['injouable', 'conservee'],
  upgrade: { effects: [] },
});
// Cartes de gardien : glissées dans ton deck pendant un combat de gardien, injouables, elles agissent quand on les pioche
const bossCard = (id: string, name: string, pokeType: CardDef['pokeType'], onDraw: CardDef['onDraw']): CardDef => ({
  id, name, character: 'normal', pokeType, category: 'statut', rarity: 'depart', cost: 0, target: 'soi', effects: [],
  keywords: ['injouable', 'ephemere'], upgrade: { effects: [] }, onDraw,
});
CARDS.push(
  bossCard('g-dard-venimeux', 'Dard Venimeux', 'poison', [{ kind: 'statut', status: 'poison', stacks: 2, on: 'soi' }]),
  bossCard('g-ecaille-poudreuse', 'Écaille Poudreuse', 'insecte', []),
  bossCard('g-reve-lourd', 'Rêve Lourd', 'fee', [{ kind: 'pa', amount: -1 }]),
  bossCard('g-cendres', 'Cendres', 'feu', [{ kind: 'statut', status: 'brulure', stacks: 2, on: 'soi' }]),
  bossCard('g-electrocution', 'Électrocution', 'electrik', [{ kind: 'perte-pv', amount: 4 }]),
  bossCard('g-felure-temporelle', 'Fêlure Temporelle', 'dragon', [{ kind: 'pa', amount: -1 }]),
);
CARDS.push(...RIOLU_CARDS, ...VIPELIERRE_CARDS, ...KANGOUREX_CARDS, ...CANINOS_CARDS, ...MEW_CARDS, ...NEUTRAL_CARDS);

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

/** Cartes neutres que tous les Pokémon peuvent apprendre. */
export function neutralPool(): CardDef[] {
  return CARDS.filter((c) => c.character === 'normal' && c.rarity !== 'depart');
}

export function allCards(): CardDef[] {
  return CARDS;
}
