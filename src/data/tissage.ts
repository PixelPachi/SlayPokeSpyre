// Nœud Destin (Vipélierre Tisserand de Soie Astrale) : au Centre Pokémon, on tisse une carte à partir de deux effets.
// Identifiant : « tissage:<effet 1>:<effet 2> ».
import type { CardDef, Effect } from '../core/model';

interface WeaveFx { name: string; value: number; offensive: boolean; make: (up: boolean) => Effect }
const u = (n: number, up: boolean) => (up ? Math.ceil(n * 1.4) : n);

export const WEAVE_FX: Record<string, WeaveFx> = {
  lame: { name: 'Lame', value: 7, offensive: true, make: (up) => ({ kind: 'degats', amount: u(7, up) }) },
  rafale: { name: 'Rafale', value: 8, offensive: true, make: (up) => ({ kind: 'degats', amount: u(4, up), hits: 2 }) },
  bouclier: { name: 'Bouclier', value: 7, offensive: false, make: (up) => ({ kind: 'protection', amount: u(7, up) }) },
  savoir: { name: 'Savoir', value: 7, offensive: false, make: (up) => ({ kind: 'pioche', amount: up ? 3 : 2 }) },
  venin: { name: 'Venin', value: 6, offensive: true, make: (up) => ({ kind: 'statut', status: 'poison', stacks: u(3, up), on: 'cible' }) },
  braise: { name: 'Braise', value: 6, offensive: true, make: (up) => ({ kind: 'statut', status: 'brulure', stacks: u(3, up), on: 'cible' }) },
  trouble: { name: 'Trouble', value: 5, offensive: true, make: (up) => ({ kind: 'statut', status: 'confusion', stacks: up ? 3 : 2, on: 'cible' }) },
  effroi: { name: 'Effroi', value: 4, offensive: true, make: (up) => ({ kind: 'statut', status: 'peur', stacks: up ? 2 : 1, on: 'cible' }) },
  breche: { name: 'Brèche', value: 4, offensive: true, make: (up) => ({ kind: 'statut', status: 'defense', stacks: up ? -2 : -1, on: 'cible' }) },
  faiblesse: { name: 'Faiblesse', value: 4, offensive: true, make: (up) => ({ kind: 'statut', status: 'attaque', stacks: up ? -2 : -1, on: 'cible' }) },
  graine: { name: 'Graine', value: 5, offensive: true, make: (up) => ({ kind: 'statut', status: 'vampigraine', stacks: up ? 3 : 2, on: 'cible' }) },
  force: { name: 'Force', value: 8, offensive: false, make: (up) => ({ kind: 'statut', status: 'attaque', stacks: up ? 2 : 1, on: 'soi' }) },
  elan: { name: 'Élan', value: 9, offensive: false, make: () => ({ kind: 'pa', amount: 1 }) },
  soin: { name: 'Soin', value: 5, offensive: false, make: (up) => ({ kind: 'soin', amount: u(4, up) }) },
  butin: { name: 'Butin', value: 4, offensive: false, make: (up) => ({ kind: 'argent', amount: u(8, up) }) },
  givre: { name: 'Givre', value: 6, offensive: true, make: (up) => ({ kind: 'statut', status: 'gel', stacks: up ? 2 : 1, on: 'cible' }) },
  epines: { name: 'Épines', value: 5, offensive: false, make: (up) => ({ kind: 'statut', status: 'epine', stacks: u(3, up), on: 'soi' }) },
};

/** Cartes créées (tissage, fusion) : les effets identiques se cumulent, et chaque coup d'une attaque multiple
 *  applique les statuts offensifs (Rafale + Venin : chaque coup empoisonne). */
export function stackEffects(effects: Effect[]): Effect[] {
  const out: Effect[] = [];
  const simple = (e: Effect) => Object.keys(e).every((k) => ['kind', 'amount', 'hits', 'stacks', 'status', 'on'].includes(k));
  for (const e of effects) {
    const twin = out.find((o) => o.kind === e.kind && simple(o) && simple(e) && (
      (e.kind === 'degats' && o.kind === 'degats' && o.amount === e.amount) ||
      (e.kind === 'statut' && o.kind === 'statut' && o.status === e.status && o.on === e.on) ||
      ['protection', 'pioche', 'soin', 'argent', 'pa'].includes(e.kind)));
    if (!twin) { out.push({ ...e } as Effect); continue; }
    if (twin.kind === 'degats' && e.kind === 'degats') twin.hits = (twin.hits ?? 1) + (e.hits ?? 1);
    else if (twin.kind === 'statut' && e.kind === 'statut') twin.stacks += e.stacks;
    else if ('amount' in twin && 'amount' in e) (twin as { amount: number }).amount += (e as { amount: number }).amount;
  }
  const hits = Math.max(1, ...out.map((e) => (e.kind === 'degats' ? e.hits ?? 1 : 1)));
  if (hits > 1) for (const e of out) if (e.kind === 'statut' && e.on !== 'soi' && e.stacks > 0) e.stacks *= hits;
  return out;
}

/** Illustration d'une carte créée : celle de son premier effet. */
export const weaveArt = (k: string): string => `Tissage ${WEAVE_FX[k]?.name ?? 'Lame'}`;

export const weaveId = (a: string, b: string): string => `tissage:${a}:${b}`;

export function weaveDef(defId: string, upgraded: boolean): CardDef | undefined {
  const [, a, b] = defId.split(':');
  const A = WEAVE_FX[a], B = WEAVE_FX[b];
  if (!A || !B) return undefined;
  const effects = stackEffects([A.make(upgraded), B.make(upgraded)]);
  const attack = effects.some((e) => e.kind === 'degats');
  const offensive = A.offensive || B.offensive;
  const v = A.value + B.value;
  return {
    id: defId, name: a === b ? `Tissage ${A.name} ×2${upgraded ? '+' : ''}` : `Tissage ${A.name} & ${B.name}${upgraded ? '+' : ''}`, character: 'vipelierre', pokeType: attack ? 'psy' : 'tenebres',
    category: attack ? 'attaque' : 'technique', rarity: 'rare', cost: v <= 9 ? 0 : v <= 13 ? 1 : 2,
    target: offensive ? 'ennemi' : 'soi', effects, upgrade: {}, artName: weaveArt(a),
  };
}

/** Trois effets au hasard (sans ceux déjà choisis). */
export function weaveChoices(rand: () => number, exclude: string[] = []): string[] { // exclude vide : un même effet peut revenir deux fois
  const pool = Object.keys(WEAVE_FX).filter((k) => !exclude.includes(k));
  const out: string[] = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  return out;
}

// ——— Nœud Destin + : talents tissés « <condition> : effet 1 et effet 2 » ———
export const TRIGGERS: Record<string, string> = {
  'debut-tour': 'Au début de ton tour',
  'fin-tour': 'À la fin de ton tour',
  attaque: 'Chaque fois que tu joues une Attaque',
  technique: 'Chaque fois que tu joues une Technique',
};
export const trameId = (t: string, a: string, b: string): string => `trame:${t}:${a}:${b}`;

/** Effet d'un talent tissé : la moitié de l'effet normal (il se déclenche souvent). */
export function trameFx(k: string): Effect {
  const e = { ...WEAVE_FX[k].make(false) } as Effect & { amount?: number; stacks?: number };
  if (typeof e.amount === 'number' && e.kind !== 'pa') e.amount = Math.max(1, Math.ceil(e.amount / 2));
  if (typeof e.stacks === 'number') e.stacks = Math.sign(e.stacks) * Math.max(1, Math.ceil(Math.abs(e.stacks) / 2));
  return e;
}

export function trameDef(defId: string, upgraded: boolean): CardDef | undefined {
  const [, t, a, b] = defId.split(':');
  if (!TRIGGERS[t] || !WEAVE_FX[a] || !WEAVE_FX[b]) return undefined;
  return {
    id: defId, name: `Trame ${WEAVE_FX[a].name} & ${WEAVE_FX[b].name}${upgraded ? '+' : ''}`, character: 'normal', pokeType: 'psy',
    category: 'talent', rarity: 'rare', cost: upgraded ? 1 : 2, target: 'soi',
    effects: [{ kind: 'trame', trigger: t, fx: [a, b] }], upgrade: {}, artName: weaveArt(a),
  };
}

/** Quatre conditions au hasard, on en propose trois. */
export function triggerChoices(rand: () => number): string[] {
  const pool = Object.keys(TRIGGERS);
  const out: string[] = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  return out;
}
