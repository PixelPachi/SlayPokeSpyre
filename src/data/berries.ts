// Les baies : l'équivalent des potions de Slay the Spire. 3 emplacements par run.

import type { StatusId } from '../core/model';
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
}

const BAD: StatusId[] = ['brulure', 'poison', 'vampigraine', 'paralysie', 'peur', 'confusion', 'sommeil', 'gel', 'etourdi'];
const SNAME: Partial<Record<StatusId, string>> = {
  brulure: 'Brûlure', poison: 'Poison', paralysie: 'Paralysie', peur: 'Peur', confusion: 'Confusion',
  sommeil: 'Sommeil', gel: 'Gel', etourdi: 'Étourdi', attaque: 'Attaque', defense: 'Défense', vampigraine: 'Vampigraine',
};

function describe(fx: BerryFx): string {
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
const conf = (heal: number, extra: BerryFx): BerryFx => ({ heal, ...extra, self: [...(extra.self ?? []), { status: 'confusion', stacks: 1 }] });
const res = (t: PokeType): BerryFx => ({ resist: t });

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
];

export { BAD as BAD_STATUSES };

export const BERRY_DEFS: Record<string, BerryDef> = Object.fromEntries(BERRIES.map((x) => [x.id, x]));
export const MAX_BERRIES = 3;

export function berryPrice(id: string): number {
  return { commune: 45, 'peu-commune': 65, rare: 90 }[BERRY_DEFS[id].rarity];
}
