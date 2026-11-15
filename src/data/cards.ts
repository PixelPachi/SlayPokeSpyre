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
  {
    id: 'poing-karate', name: 'Poing-Karaté', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'commune', cost: 1, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 8 }],
    upgrade: { effects: [{ kind: 'degats', amount: 11 }] },
  },
  {
    id: 'detection', name: 'Détection', character: 'riolu', pokeType: 'combat', category: 'technique',
    rarity: 'commune', cost: 1, target: 'soi',
    effects: [{ kind: 'protection', amount: 7 }, { kind: 'pioche', amount: 1 }],
    upgrade: { effects: [{ kind: 'protection', amount: 10 }, { kind: 'pioche', amount: 1 }] },
  },
  {
    id: 'vive-attaque', name: 'Vive-Attaque', character: 'riolu', pokeType: 'normal', category: 'attaque',
    rarity: 'commune', cost: 0, target: 'ennemi',
    effects: [{ kind: 'degats', amount: 4 }],
    upgrade: { effects: [{ kind: 'degats', amount: 4 }, { kind: 'pioche', amount: 1 }] },
  },
  {
    id: 'aurasphere', name: 'Aurasphère', character: 'riolu', pokeType: 'combat', category: 'attaque',
    rarity: 'peu-commune', cost: 2, target: 'ennemi',
    effects: [{ kind: 'aura-mult', amount: 2 }, { kind: 'degats', amount: 8 }],
    upgrade: { effects: [{ kind: 'aura-mult', amount: 2 }, { kind: 'degats', amount: 12 }] },
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
    id: 'ultimawashi', name: 'Ultimawashi', character: 'riolu', pokeType: 'combat', category: 'technique',
    rarity: 'rare', cost: 1, target: 'soi',
    effects: [{ kind: 'aura', amount: 10 }, { kind: 'pa', amount: 1 }],
    keywords: ['epuisee'],
    upgrade: { effects: [{ kind: 'aura', amount: 15 }, { kind: 'pa', amount: 1 }] },
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
