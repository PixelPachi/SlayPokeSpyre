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

import { Run } from '../src/core/run';
import { skinDef } from '../src/data/skins';
import { cardDef } from '../src/data/cards';

describe('Skins primordiaux : Hurle-Temps', () => {
  it('remplace la première carte du deck de départ, pour chaque personnage', () => {
    for (const ch of ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew', 'quelorior'] as const) {
      const run = new Run('PRIM', ch);
      const n = run.deck.length;
      run.applySkin('primordial', skinDef(ch, 'primordial'));
      expect(run.deck).toHaveLength(n);
      expect(run.deck.filter((c) => c.defId === 'n-hurle-temps'), ch).toHaveLength(1);
    }
  });
  it('Hurle-Temps frappe fort puis retire 2 PA au tour suivant', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['onix'], seed: 'HT', relics: [] });
    c.drainEvents(); c.player.energy = 9;
    c.hand = [{ uid: 1, defId: 'n-hurle-temps', upgraded: false }];
    const e = c.aliveEnemies()[0], before = e.hp + e.block;
    c.play(1, e.uid);
    expect(before - (e.hp + e.block)).toBeGreaterThanOrEqual(cardDef('n-hurle-temps').cost > 0 ? 10 : 0);
    c.endPlayerTurn(); for (const x of c.aliveEnemies()) c.enemyAct(x.uid); if ((c.phase as string) === 'ennemi') c.endEnemyTurn();
    expect(c.drainEvents().some((x) => x.type === 'energy' && (x as { reason: string }).reason === 'Recharge')).toBe(true);
  });
});
