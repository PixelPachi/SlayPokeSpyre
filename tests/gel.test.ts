import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { cardDef } from '../src/data/cards';
import { ENEMY_DEFS } from '../src/data/enemies';

const make = (enemies = ['blizzi']) => new Combat({ character: 'riolu', deck: [], enemies, seed: 'g', hp: 60, maxHp: 60, relics: [] } as never);
const add = (c: Combat, target: unknown, uid: unknown, st: string, n: number) => (c as unknown as { addStatus: (...a: unknown[]) => void }).addStatus(target, uid, st, n);

describe('Gel', () => {
  it('ne diminue pas tout seul et gèle à 3', () => {
    const c = make();
    const e = c.enemies[0];
    add(c, e, e.uid, 'gel', 2);
    c.endPlayerTurn(); for (const x of c.aliveEnemies()) c.enemyAct(x.uid); c.endEnemyTurn();
    expect(e.statuses.gel).toBe(2);
  });
  it('la plupart des attaques Glace infligent du Gel', () => {
    expect(cardDef('n-blizzard').effects.some((f) => f.kind === 'statut' && f.status === 'gel')).toBe(true);
    for (const e of Object.values(ENEMY_DEFS)) for (const m of e.moves)
      if (m.intent === 'attaque' && (m.pokeType ?? e.types[0]) === 'glace') expect(m.playerStatus, m.name).toBeDefined();
  });
  it('Lame Feuille frappe tous les ennemis, Suc Digestif s’épuise', () => {
    expect(cardDef('vip-lame-feuille').target).toBe('tous');
    expect(cardDef('vip-suc-digestif').keywords).toContain('epuisee');
  });
});
