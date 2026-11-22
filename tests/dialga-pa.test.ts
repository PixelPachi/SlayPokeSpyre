// Dialga Primal : -1 PA dès le 3e tour et pour tout le combat ; Hurle-Temps retire 2 PA au tour suivant.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';

describe('Dialga Primal et les PA', () => {
  it('−1 PA à chaque tour dès le 3e, −2 de plus après Hurle-Temps', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['dialga-primal'], seed: 'DPA', relics: [], hp: 999, maxHp: 999, boss: true });
    c.drainEvents();
    let roarNext = false, roars = 0;
    for (let i = 0; i < 8 && c.phase === 'joueur'; i++) {
      roarNext = c.aliveEnemies()[0].intent?.id === 'hurle-temps';
      c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); if ((c.phase as string) === 'ennemi') c.endEnemyTurn();
      const ev = c.drainEvents().filter((x) => x.type === 'energy') as { reason: string; delta: number }[];
      const dist = ev.filter((x) => x.reason === 'Distorsion du Temps').length;
      const roar = ev.filter((x) => x.reason === 'Hurle-Temps').length;
      expect(dist, `tour ${c.turn}`).toBe(c.turn >= 3 ? 1 : 0);
      expect(roar, `tour ${c.turn}`).toBe(roarNext ? 1 : 0);
      roars += roar;
    }
    expect(roars).toBeGreaterThan(0);
  });
});
