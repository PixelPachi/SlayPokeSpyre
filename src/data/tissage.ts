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
};

export const weaveId = (a: string, b: string): string => `tissage:${a}:${b}`;

export function weaveDef(defId: string, upgraded: boolean): CardDef | undefined {
  const [, a, b] = defId.split(':');
  const A = WEAVE_FX[a], B = WEAVE_FX[b];
  if (!A || !B) return undefined;
  const effects = [A.make(upgraded), B.make(upgraded)];
  const attack = effects.some((e) => e.kind === 'degats');
  const offensive = A.offensive || B.offensive;
  const v = A.value + B.value;
  return {
    id: defId, name: `Tissage ${A.name} & ${B.name}${upgraded ? '+' : ''}`, character: 'vipelierre', pokeType: attack ? 'psy' : 'tenebres',
    category: attack ? 'attaque' : 'technique', rarity: 'rare', cost: v <= 9 ? 0 : v <= 13 ? 1 : 2,
    target: offensive ? 'ennemi' : 'soi', effects, upgrade: {}, artName: attack ? 'Psyko' : 'Machination',
  };
}

/** Trois effets au hasard (sans ceux déjà choisis). */
export function weaveChoices(rand: () => number, exclude: string[] = []): string[] {
  const pool = Object.keys(WEAVE_FX).filter((k) => !exclude.includes(k));
  const out: string[] = [];
  while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  return out;
}
