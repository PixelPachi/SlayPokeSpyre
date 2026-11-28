// Historique du combat et statistiques de la run.
import { expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';

it('l’historique note les cartes jouées, les dégâts et les tours ; les statistiques comptent les dégâts par carte', () => {
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: 'griffe', upgraded: false }));
  const c = new Combat({ character: 'caninos', deck, enemies: ['rattata'], seed: 'LOG', relics: [] } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999;
  c.play(c.hand[0].uid, c.enemies[0].uid);
  c.drainEvents();
  c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); c.endEnemyTurn();
  c.drainEvents();
  const kinds = c.log.map((l) => l.entry.type);
  expect(kinds).toContain('turn');
  expect(kinds).toContain('play');
  expect(kinds).toContain('damage');
  expect(kinds).toContain('enemy-move');
  const g = Object.entries(c.stats.cards).find(([k]) => k.startsWith('Griffe'))![1];
  expect(g.n).toBe(1);
  expect(g.dmg).toBeGreaterThan(0);
  expect(c.stats.dealt).toBe(g.dmg);
  const run = new Run('LOG', 'caninos');
  run.addFightStats(c.stats, c.turn);
  run.addFightStats(c.stats, c.turn);
  expect(run.fightStats.fights).toBe(2);
  expect(run.fightStats.dealt).toBe(2 * c.stats.dealt);
});
