// Toutes les cartes du jeu. Ajouter une carte = ajouter une entrée ici (aucun code à écrire).
import type { CardDef } from '../core/model';

const CARDS: CardDef[] = [
  // ——— Cartes communes à tous ———
  {
    id: 'abri', name: 'Abri', character: 'normal', pokeType: 'normal', category: 'technique',
    rarity: 'depart', cost: 1, target: 'soi',
    effects: [{ kind: 'protection', amount: 5 }],
    upgrade: { effects: [{ kind: 'protection', amount: 8 }] },
  },
  {
    id: 'charge', name: 'Charge', character: 'normal', pokeType: 'normal', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6 }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }] },
  },

  // ——— Riolu ———
  {
    id: 'mach-punch', name: 'Mach Punch', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'depart', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 6 }],
    upgrade: { effects: [{ kind: 'degats', amount: 9 }] },
  },
  {
    id: 'forte-paume', name: 'Forte-Paume', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'depart', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 9 }, { kind: 'statut', status: 'paralysie', stacks: 1, on: 'cible' }],
    upgrade: { effects: [{ kind: 'degats', amount: 12 }, { kind: 'statut', status: 'paralysie', stacks: 2, on: 'cible' }] },
  },
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
    id: 'close-combat', name: 'Close Combat', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'peu-commune', cost: 2, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 18 }, { kind: 'statut', status: 'defense', stacks: -1, on: 'soi' }],
    upgrade: { effects: [{ kind: 'degats', amount: 24 }, { kind: 'statut', status: 'defense', stacks: -1, on: 'soi' }] },
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
