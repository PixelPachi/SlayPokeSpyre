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
// Malédictions des coffres maudits : injouables, elles restent dans le deck (oublie-les au Marché Kecleon)
CARDS.push({
  id: 'cauchemar', name: 'Cauchemar', character: 'normal', pokeType: 'spectre', category: 'statut', rarity: 'depart',
  cost: 0, target: 'soi', effects: [], keywords: ['injouable'], onDraw: [{ kind: 'pa', amount: -1 }], upgrade: {},
});
CARDS.push({
  id: 'poisse', name: 'Poisse', character: 'normal', pokeType: 'tenebres', category: 'statut', rarity: 'depart',
  cost: 0, target: 'soi', effects: [], keywords: ['injouable'], onDraw: [{ kind: 'statut', status: 'confusion', stacks: 1, on: 'soi' }], upgrade: {},
});
export const CURSES = ['voeu-brise', 'cauchemar', 'poisse'];
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
// Ronflement et Blabla Dodo ne se jouent qu'endormi
for (const d of CARDS) if (/-(ronflement|blabla-dodo)$/.test(d.id)) d.requires = { ...d.requires, asleep: true };

export const CARD_DEFS: Record<string, CardDef> = Object.fromEntries(CARDS.map((c) => [c.id, c]));

/** Définition d'une carte, version améliorée appliquée si besoin. */
/** Id d'une carte fusionnée à la Pension (les « + » marquent les cartes améliorées). */
export function fusionId(a: string, upA: boolean, b: string, upB: boolean): string {
  return `fusion:${a}${upA ? '+' : ''}|${b}${upB ? '+' : ''}`;
}

/** Deux cartes peuvent-elles fusionner ? (pas de talent, de malédiction, ni de cibles incompatibles) */
export function canFuse(a: CardDef, b: CardDef): boolean {
  const ok = (d: CardDef) => (d.category === 'attaque' || d.category === 'technique') && !d.keywords?.includes('injouable')
    && !d.onDraw && !d.fusion && !d.requires && !d.enchant;
  if (!ok(a) || !ok(b)) return false;
  const t = new Set([a.target, b.target]);
  return !(t.has('ennemi') && t.has('tous'));
}

const RANK = { depart: 0, commune: 1, 'peu-commune': 2, rare: 3 } as Record<string, number>;

function fusionDef(defId: string, upgraded: boolean): CardDef {
  const [ra, rb] = defId.slice(7).split('|');
  const A = cardDef(ra.replace(/\+$/, ''), ra.endsWith('+') || upgraded);
  const B = cardDef(rb.replace(/\+$/, ''), rb.endsWith('+') || upgraded);
  const target = A.target === 'soi' ? B.target : A.target;
  const kw = [...new Set([...(A.keywords ?? []), ...(B.keywords ?? [])])];
  return {
    id: defId, name: `${A.name.replace(/\+$/, '')} & ${B.name.replace(/\+$/, '')}${upgraded ? '+' : ''}`,
    character: A.character, pokeType: A.pokeType,
    category: A.category === 'attaque' || B.category === 'attaque' ? 'attaque' : 'technique',
    rarity: (RANK[A.rarity] ?? 0) >= (RANK[B.rarity] ?? 0) ? A.rarity : B.rarity,
    cost: Math.max(A.cost, B.cost, A.cost + B.cost - 1), target,
    effects: [...A.effects, ...B.effects], keywords: kw.length ? kw : undefined,
    upgrade: {}, artName: A.name.replace(/\+$/, ''), fusion: [ra, rb],
  };
}

/** Enchantements du Marché noir : un bonus ajouté à une carte. */
export type EnchantRarity = 'commun' | 'rare' | 'legendaire';
export const ENCHANTS: Record<string, { name: string; text: string; rarity?: EnchantRarity; ok: (d: CardDef) => boolean; apply: (d: CardDef) => CardDef }> = {
  vif: { name: 'Vif', text: 'coûte 1 PA de moins', ok: (d) => d.cost > 0, apply: (d) => ({ ...d, cost: d.cost - 1 }) },
  force: {
    name: 'Puissant', text: '+3 dégâts', ok: (d) => d.effects.some((e) => e.kind === 'degats'),
    apply: (d) => {
      let done = false;
      return { ...d, effects: d.effects.map((e) => (!done && e.kind === 'degats' ? ((done = true), { ...e, amount: e.amount + 3 }) : e)) };
    },
  },
  garde: { name: 'Gardien', text: '+4 Protection', ok: () => true, apply: (d) => ({ ...d, effects: [...d.effects, { kind: 'protection', amount: 4 }] }) },
  savoir: { name: 'Savant', text: 'pioche 1 carte', ok: () => true, apply: (d) => ({ ...d, effects: [...d.effects, { kind: 'pioche', amount: 1 }] }) },
  venin: {
    name: 'Venimeux', text: '+2 Poison', ok: (d) => d.target !== 'soi',
    apply: (d) => ({ ...d, effects: [...d.effects, { kind: 'statut', status: 'poison', stacks: 2, on: d.target === 'tous' ? 'tous' : 'cible' }] }),
  },
  eternel: {
    name: 'Éternel', text: 'reste en main à la fin du tour', ok: (d) => !d.keywords?.includes('conservee'),
    apply: (d) => ({ ...d, keywords: [...(d.keywords ?? []), 'conservee'] }),
  },
  // ——— Rares ———
  vampire: { name: 'Vampirique', rarity: 'rare', text: 'récupère 3 PV', ok: () => true, apply: (d) => ({ ...d, effects: [...d.effects, { kind: 'soin', amount: 3 }] }) },
  energique: { name: 'Énergique', rarity: 'rare', text: 'rend 1 PA', ok: (d) => d.cost > 0, apply: (d) => ({ ...d, effects: [...d.effects, { kind: 'pa', amount: 1 }] }) },
  brulant: {
    name: 'Brûlant', rarity: 'rare', text: '+3 Brûlure', ok: (d) => d.target !== 'soi',
    apply: (d) => ({ ...d, effects: [...d.effects, { kind: 'statut', status: 'brulure', stacks: 3, on: d.target === 'tous' ? 'tous' : 'cible' }] }),
  },
  fortifiant: { name: 'Fortifiant', rarity: 'rare', text: '+1 Attaque', ok: () => true, apply: (d) => ({ ...d, effects: [...d.effects, { kind: 'statut', status: 'attaque', stacks: 1, on: 'soi' }] }) },
  // ——— Légendaires ———
  echo: { name: 'Écho', rarity: 'legendaire', text: 'ses effets s’appliquent deux fois', ok: (d) => !d.effects.some((e) => e.kind === 'decouverte'), apply: (d) => ({ ...d, effects: [...d.effects, ...d.effects] }) },
  gratuit: { name: 'Divin', rarity: 'legendaire', text: 'coûte 0 PA', ok: (d) => d.cost > 1, apply: (d) => ({ ...d, cost: 0 }) },
  titan: {
    name: 'Titanesque', rarity: 'legendaire', text: '+8 dégâts et +8 Protection', ok: (d) => d.effects.some((e) => e.kind === 'degats'),
    apply: (d) => {
      let done = false;
      return { ...d, effects: [...d.effects.map((e) => (!done && e.kind === 'degats' ? ((done = true), { ...e, amount: e.amount + 8 }) : e)), { kind: 'protection', amount: 8 }] };
    },
  },
};

/** Chances d'obtenir un enchantement de chaque rareté. */
export const ENCHANT_ODDS: Record<EnchantRarity, number> = { commun: 0.85, rare: 0.13, legendaire: 0.02 };

/** Tire un enchantement qui convient à la carte : les rares et légendaires sont bien plus rares. */
export function rollEnchant(d: CardDef, rand: () => number): string | null {
  const ok = Object.keys(ENCHANTS).filter((k) => ENCHANTS[k].ok(d));
  if (!ok.length) return null;
  const x = rand();
  const want: EnchantRarity = x < ENCHANT_ODDS.legendaire ? 'legendaire' : x < ENCHANT_ODDS.legendaire + ENCHANT_ODDS.rare ? 'rare' : 'commun';
  const order: EnchantRarity[] = want === 'legendaire' ? ['legendaire', 'rare', 'commun'] : want === 'rare' ? ['rare', 'commun'] : ['commun', 'rare'];
  for (const r of order) {
    const pool = ok.filter((k) => (ENCHANTS[k].rarity ?? 'commun') === r);
    if (pool.length) return pool[Math.floor(rand() * pool.length)];
  }
  return ok[0];
}

export function enchantId(enchant: string, defId: string): string {
  return `ench:${enchant}:${defId}`;
}

export function cardDef(defId: string, upgraded = false): CardDef {
  if (defId.startsWith('ench:')) {
    const [, k, ...rest] = defId.split(':');
    const inner = cardDef(rest.join(':'), upgraded);
    const e = ENCHANTS[k];
    return e ? { ...e.apply(inner), id: defId, name: inner.name, artName: inner.artName ?? inner.name.replace(/\+$/, ''), enchant: k } : inner;
  }
  if (defId.startsWith('fusion:')) return fusionDef(defId, upgraded);
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
