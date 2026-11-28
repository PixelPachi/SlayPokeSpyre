// Petits outils partagés pour écrire les cartes des personnages.
import type { CardDef, CharacterId, Effect, Keyword, PowerId, Rarity, StatusId, Target } from '../core/model';
import type { PokeType } from '../core/types';

export const dmg = (amount: number, extra: Partial<Extract<Effect, { kind: 'degats' }>> = {}): Effect => ({ kind: 'degats', amount, ...extra });
export const multi = (amount: number, hits: number, hitsMax?: number): Effect => ({ kind: 'degats', amount, hits, hitsMax });
export const st = (status: StatusId, stacks: number, on: 'cible' | 'soi' | 'tous' = 'cible'): Effect => ({ kind: 'statut', status, stacks, on });
export const prot = (amount: number): Effect => ({ kind: 'protection', amount });
export const draw = (amount: number): Effect => ({ kind: 'pioche', amount });
export const pa = (amount: number): Effect => ({ kind: 'pa', amount });
export const hpLoss = (amount: number): Effect => ({ kind: 'perte-pv', amount });
export const heal = (amount: number): Effect => ({ kind: 'soin', amount });
export const power = (p: PowerId, amount: number): Effect => ({ kind: 'pouvoir', power: p, amount });
export const smult = (status: StatusId, mult: number, on: 'cible' | 'tous' = 'cible'): Effect => ({ kind: 'statut-mult', status, mult, on });
export const addCards = (count: number, from: 'tous' | 'neutre' = 'tous'): Effect => ({ kind: 'ajoute-carte', from, count });
export const breakBlock: Effect = { kind: 'casse-protection' };
export const bebeAtk = (times = 1): Effect => ({ kind: 'bebe-attaque', times });
export const bebePow = (amount: number): Effect => ({ kind: 'bebe-puissance', amount });
export const invoc = (amount: number): Effect => ({ kind: 'invocation', amount });
export const bebeProt = (amount: number): Effect => ({ kind: 'bebe-protection', amount });

export type CardMaker = (
  id: string, name: string, pokeType: PokeType, category: CardDef['category'], rarity: Rarity, cost: number,
  target: Target, effects: Effect[], upgrade: CardDef['upgrade'], keywords?: Keyword[],
) => CardDef;

/** Fabrique de cartes pour un personnage ; les ids reçoivent un préfixe pour rester uniques. */
export function cardMaker(character: CharacterId, prefix: string): CardMaker {
  return (id, name, pokeType, category, rarity, cost, target, effects, upgrade, keywords) =>
    ({ id: `${prefix}-${id}`, name, character, pokeType, category, rarity, cost, target, effects, upgrade, keywords });
}
