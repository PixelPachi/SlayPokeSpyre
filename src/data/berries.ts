// Les baies : l'équivalent des potions de Slay the Spire. 3 emplacements par run.

import type { CharacterId, Effect, StatusId } from '../core/model';
import { TYPE_LABELS, type PokeType } from '../core/types';

export type BerryRarity = 'commune' | 'peu-commune' | 'rare';

/** Effets d'une baie. Soin et PV max marchent partout ; le reste seulement en combat, pendant ton tour. */
export interface BerryFx {
  heal?: number;
  maxHp?: number;
  cure?: StatusId[] | 'tous';
  energy?: number;
  draw?: number;
  block?: number;
  self?: { status: StatusId; stacks: number }[];
  damageAll?: number;
  resist?: PokeType;
  /** Effets de carte (baies exclusives) et leur description. */
  effects?: Effect[];
  say?: string;
}

export interface BerryDef {
  id: string;
  name: string;
  /** Sprite dans sprites/items de PokeAPI (ex. oran-berry). */
  sprite: string;
  rarity: BerryRarity;
  fx: BerryFx;
  text: string;
  /** Utilisable seulement en combat. */
  combatOnly: boolean;
  /** Baie exclusive : on ne la trouve qu'avec ce personnage. */
  character?: CharacterId;
  /** Ne se trouve jamais en butin (baies empoisonnées de la Plaque Toxik). */
  noDrop?: boolean;
}

const BAD: StatusId[] = ['brulure', 'poison', 'vampigraine', 'paralysie', 'peur', 'confusion', 'sommeil', 'gel', 'etourdi', 'ligote'];
const SNAME: Partial<Record<StatusId, string>> = {
  brulure: 'Brûlure', poison: 'Poison', paralysie: 'Paralysie', peur: 'Peur', confusion: 'Confusion',
  sommeil: 'Sommeil', gel: 'Gel', etourdi: 'Étourdi', attaque: 'Attaque', defense: 'Défense', vampigraine: 'Vampigraine',
};

function describe(fx: BerryFx): string {
  if (fx.say) return fx.say;
  const t: string[] = [];
  if (fx.maxHp) t.push(`+${fx.maxHp} PV max`);
  if (fx.heal) t.push(`Restaure ${fx.heal} PV`);
  if (fx.cure === 'tous') t.push('Retire tous tes statuts négatifs');
  else if (fx.cure) t.push(`Retire ${fx.cure.map((x) => SNAME[x]).join(' et ')}`);
  if (fx.energy) t.push(`+${fx.energy} PA`);
  if (fx.draw) t.push(`Pioche ${fx.draw} carte${fx.draw > 1 ? 's' : ''}`);
  if (fx.block) t.push(`+${fx.block} Protection`);
  for (const x of fx.self ?? []) t.push(x.status === 'confusion' ? `mais ${x.stacks} Confusion` : `+${x.stacks} ${SNAME[x.status]}`);
  if (fx.damageAll) t.push(`Inflige ${fx.damageAll} dégâts à tous les ennemis`);
  if (fx.resist) t.push(`Pour ce combat, les attaques ${TYPE_LABELS[fx.resist]} te font moitié moins de dégâts`);
  const s = t.map((x, i) => (i ? x.charAt(0).toLowerCase() + x.slice(1) : x)).join(', ').replace(', mais', ' mais');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

const b = (id: string, name: string, rarity: BerryRarity, fx: BerryFx): BerryDef => {
  const combatOnly = Object.keys(fx).some((k) => k !== 'heal' && k !== 'maxHp');
  return { id, name: `Baie ${name}`, sprite: `${id}-berry`, rarity, fx, combatOnly,
    text: describe(fx) + (combatOnly ? ' (en combat)' : '') };
};
const CHAR_NAMES: Partial<Record<CharacterId, string>> = { riolu: 'Riolu', vipelierre: 'Vipélierre', kangourex: 'Kangourex', caninos: 'Caninos', mew: 'Mew', quelorior: 'Quelorior' };
const x = (id: string, name: string, character: CharacterId, say: string, effects: Effect[]): BerryDef => ({
  id, name: `Baie ${name}`, sprite: `${id}-berry`, rarity: 'peu-commune', fx: { effects, say }, combatOnly: true, character,
  text: `${say} (en combat) ★ Exclusive à ${CHAR_NAMES[character]}.`,
});
const conf = (heal: number, extra: BerryFx): BerryFx => ({ heal, ...extra, self: [...(extra.self ?? []), { status: 'confusion', stacks: 1 }] });
const res = (t: PokeType): BerryFx => ({ resist: t });

const st = (status: StatusId, stacks: number): Effect => ({ kind: 'statut', status, stacks, on: 'tous' });
const poisoned = (id: string, name: string, rarity: BerryRarity, say: string, effects: Effect[]): BerryDef => ({
  id, name, sprite: 'kebia-berry', rarity, fx: { effects, say }, combatOnly: true, noDrop: true,
  text: `${say} (en combat) ☠ Baie transformée par la Plaque Toxik.`,
});
/** Baie empoisonnée correspondant à une baie (selon sa rareté). */
export function poisonedBerry(id: string): string {
  const r = BERRY_DEFS[id]?.rarity ?? 'commune';
  return r === 'rare' ? 'empoisonnee-rare' : r === 'peu-commune' ? 'empoisonnee-forte' : 'empoisonnee';
}

export const BERRIES: BerryDef[] = [
  // Baies de soin et de statut
  b('cheri', 'Ceriz', 'commune', { cure: ['paralysie'], draw: 1 }),
  b('chesto', 'Maron', 'commune', { cure: ['sommeil', 'etourdi'], energy: 1 }),
  b('pecha', 'Pêcha', 'commune', { cure: ['poison', 'vampigraine'], heal: 4 }),
  b('rawst', 'Fraive', 'commune', { cure: ['brulure'], heal: 4 }),
  b('aspear', 'Willia', 'commune', { cure: ['gel'], block: 6 }),
  b('leppa', 'Mepo', 'commune', { energy: 2 }),
  b('oran', 'Oran', 'commune', { heal: 10 }),
  b('persim', 'Kika', 'commune', { cure: ['confusion', 'peur'], draw: 1 }),
  b('lum', 'Prine', 'peu-commune', { cure: 'tous' }),
  b('sitrus', 'Sitrus', 'peu-commune', { maxHp: 5, heal: 5 }),
  // Baies de confusion : gros soin + bonus, mais un peu de Confusion
  b('figy', 'Figuy', 'peu-commune', conf(15, { self: [{ status: 'attaque', stacks: 1 }] })),
  b('wiki', 'Wiki', 'peu-commune', conf(15, { draw: 2 })),
  b('mago', 'Mago', 'peu-commune', conf(15, { block: 8 })),
  b('aguav', 'Gowav', 'peu-commune', conf(15, { energy: 1 })),
  b('iapapa', 'Papaya', 'peu-commune', conf(15, { self: [{ status: 'defense', stacks: 1 }] })),
  // Baies d'amitié
  b('razz', 'Framby', 'commune', { draw: 2 }),
  b('pomeg', 'Grena', 'commune', { maxHp: 3 }),
  b('kelpsy', 'Alga', 'commune', { self: [{ status: 'attaque', stacks: 2 }] }),
  b('qualot', 'Qualot', 'commune', { self: [{ status: 'defense', stacks: 2 }] }),
  b('hondew', 'Lonme', 'commune', { damageAll: 8 }),
  b('grepa', 'Résin', 'commune', { block: 12 }),
  b('tamato', 'Tamato', 'commune', { energy: 1, draw: 1 }),
  // Baies de résistance aux types
  b('occa', 'Chocco', 'peu-commune', res('feu')), b('passho', 'Pocpoc', 'peu-commune', res('eau')),
  b('wacan', 'Parma', 'peu-commune', res('electrik')), b('rindo', 'Ratam', 'peu-commune', res('plante')),
  b('yache', 'Nanone', 'peu-commune', res('glace')), b('chople', 'Pomroz', 'peu-commune', res('combat')),
  b('kebia', 'Kébia', 'peu-commune', res('poison')), b('shuca', 'Jouca', 'peu-commune', res('sol')),
  b('coba', 'Cobaba', 'peu-commune', res('vol')), b('payapa', 'Yapap', 'peu-commune', res('psy')),
  b('tanga', 'Panga', 'peu-commune', res('insecte')), b('charti', 'Charti', 'peu-commune', res('roche')),
  b('kasib', 'Sédra', 'peu-commune', res('spectre')), b('haban', 'Fraigo', 'peu-commune', res('dragon')),
  b('colbur', 'Lampou', 'peu-commune', res('tenebres')), b('babiri', 'Babiri', 'peu-commune', res('acier')),
  // Baies de pincement (rares)
  b('liechi', 'Lichii', 'rare', { self: [{ status: 'attaque', stacks: 3 }] }),
  b('ganlon', 'Lingan', 'rare', { self: [{ status: 'defense', stacks: 3 }] }),
  b('salac', 'Sailak', 'rare', { energy: 2, draw: 2 }),
  b('petaya', 'Pitaye', 'rare', { damageAll: 15 }),
  // Baies exclusives : on ne les trouve qu'avec un personnage précis
  x('enigma', 'Enigma', 'riolu', 'Gagne 10 Aura.', [{ kind: 'aura', amount: 10 }]),
  x('micle', 'Micle', 'riolu', 'Double ton Aura.', [{ kind: 'aura-mult', amount: 2 }]),
  x('durin', 'Durin', 'vipelierre', 'Inflige 3 Vampigraine à tous les ennemis.', [{ kind: 'statut', status: 'vampigraine', stacks: 3, on: 'tous' }]),
  x('maranga', 'Rangma', 'vipelierre', '−2 Attaque et −2 Défense… que Contestation transforme en hausses !',
    [{ kind: 'statut', status: 'attaque', stacks: -2, on: 'soi' }, { kind: 'statut', status: 'defense', stacks: -2, on: 'soi' }]),
  x('kee', 'Éka', 'kangourex', 'Soigne le Bébé Kangourex de 15 PV (le ramène s\'il est K.O.) et lui donne 6 Protection.',
    [{ kind: 'bebe-soin', amount: 15 }, { kind: 'bebe-protection', amount: 6 }]),
  x('lansat', 'Lansat', 'kangourex', 'Le Bébé gagne 2 Puissance et attaque tout de suite.', [{ kind: 'bebe-puissance', amount: 2 }, { kind: 'bebe-attaque', times: 1 }]),
  x('jaboca', 'Jacoba', 'caninos', 'Inflige 3 Brûlure à tous les ennemis.', [{ kind: 'statut', status: 'brulure', stacks: 3, on: 'tous' }]),
  x('starf', 'Frista', 'caninos', '+2 Attaque et +1 PA.', [{ kind: 'statut', status: 'attaque', stacks: 2, on: 'soi' }, { kind: 'pa', amount: 1 }]),
  x('custap', 'Chérim', 'mew', 'Lance deux Métronomes.', [{ kind: 'metronome' }, { kind: 'metronome' }]),
  x('rowap', 'Pommo', 'mew', 'Ajoute 2 cartes au hasard dans ta main.', [{ kind: 'ajoute-carte', from: 'tous', count: 2 }]),
  // Baies empoisonnées : la Plaque Toxik (Vipélierre Alchimiste) transforme une baie en l'une d'elles, selon sa rareté
  poisoned('empoisonnee', 'Baie Empoisonnée', 'commune', 'Inflige 5 Poison à tous les ennemis.', [st('poison', 5)]),
  poisoned('empoisonnee-forte', 'Baie Empoisonnée+', 'peu-commune', 'Inflige 7 Poison et Attaque −1 à tous les ennemis.', [st('poison', 7), st('attaque', -1)]),
  poisoned('empoisonnee-rare', 'Baie Empoisonnée★', 'rare', 'Inflige 10 Poison, Attaque −1, Défense −1 et 2 Confusion à tous les ennemis.', [st('poison', 10), st('attaque', -1), st('defense', -1), st('confusion', 2)]),
];

export { BAD as BAD_STATUSES };

export const BERRY_DEFS: Record<string, BerryDef> = Object.fromEntries(BERRIES.map((x) => [x.id, x]));
export const MAX_BERRIES = 3;

export function berryPrice(id: string): number {
  return { commune: 45, 'peu-commune': 65, rare: 90 }[BERRY_DEFS[id].rarity];
}
