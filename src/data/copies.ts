// Gribouille (Quelorior) : une capacité ennemie copiée devient une carte du deck, jusqu'à la fin de la run.
// Identifiant : « copie:<id de l'ennemi>:<id de la capacité> ».
import type { CardDef, Effect, EnemyMove } from '../core/model';
import { ENEMY_DEFS } from './enemies';

export const COPY_PREFIX = 'copie:';
export const copyId = (enemyId: string, moveId: string): string => `${COPY_PREFIX}${enemyId}:${moveId}`;
export const isCopy = (defId: string): boolean => defId.includes(COPY_PREFIX);

/** Valeur approximative d'une capacité, pour fixer le coût de la carte copiée. */
function moveValue(m: EnemyMove): number {
  return (m.damage ?? 0) * (m.hits ?? 1) + (m.block ?? 0) * 0.8 + (m.heal ?? 0) * 0.8
    + Math.abs(m.playerStatus?.stacks ?? 0) * 3 + Math.max(0, m.selfStatus?.stacks ?? 0) * 3;
}

export function copyDef(defId: string, upgraded: boolean): CardDef | undefined {
  const [enemyId, moveId] = defId.slice(COPY_PREFIX.length).split(':');
  const m = ENEMY_DEFS[enemyId]?.moves.find((x) => x.id === moveId);
  if (!m) return undefined;
  const up = (n: number) => (upgraded ? Math.ceil(n * 1.3) : n);
  const effects: Effect[] = [];
  if (m.damage !== undefined) effects.push({ kind: 'degats', amount: up(m.damage), hits: m.hits });
  if (m.playerStatus) effects.push({ kind: 'statut', status: m.playerStatus.status, stacks: m.playerStatus.stacks + (upgraded && m.playerStatus.stacks > 0 ? 1 : 0), on: 'cible' });
  if (m.selfStatus) effects.push({ kind: 'statut', status: m.selfStatus.status, stacks: m.selfStatus.stacks + (upgraded && m.selfStatus.stacks > 0 ? 1 : 0), on: 'soi' });
  if (m.block) effects.push({ kind: 'protection', amount: up(m.block) });
  if (m.heal) effects.push({ kind: 'soin', amount: up(m.heal) });
  if (!effects.length) effects.push({ kind: 'protection', amount: up(5) });
  const v = moveValue(m);
  const offensive = m.damage !== undefined || !!m.playerStatus;
  return {
    id: defId, name: `${m.name}${upgraded ? '+' : ''}`, character: 'normal', pokeType: m.pokeType ?? 'normal',
    category: m.damage !== undefined ? 'attaque' : 'technique', rarity: 'commune',
    cost: v <= 7 ? 0 : v <= 14 ? 1 : v <= 24 ? 2 : 3,
    target: offensive ? 'ennemi' : 'soi', effects, upgrade: {}, artName: m.name, copiedFrom: ENEMY_DEFS[enemyId]!.name,
  };
}
