// Cartes créées : effets cumulés (Rafale + Venin), même effet deux fois, nom personnalisé, talents tissés (Nœud Destin +).
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { cardDef, namedId } from '../src/data/cards';
import { trameId, weaveId } from '../src/data/tissage';

describe('cartes créées', () => {
  it('Rafale + Venin : chaque coup empoisonne', () => {
    const d = cardDef(weaveId('rafale', 'venin'));
    const poison = d.effects.find((e) => e.kind === 'statut') as { stacks: number };
    expect(poison.stacks).toBe(6); // 3 Poison × 2 coups
  });
  it('un même effet deux fois se cumule', () => {
    const d = cardDef(weaveId('lame', 'lame'));
    expect(d.effects).toHaveLength(1);
    expect(d.effects[0]).toMatchObject({ kind: 'degats', amount: 7, hits: 2 });
    expect(d.name).toContain('×2');
  });
  it('on peut nommer une carte créée, l’amélioration garde le nom', () => {
    const id = namedId('Fil du Destin', weaveId('lame', 'venin'));
    expect(cardDef(id).name).toBe('Fil du Destin');
    expect(cardDef(id, true).name).toBe('Fil du Destin+');
    expect(cardDef(namedId('Autre', id)).name).toBe('Autre');
  });
  it('talent tissé : « au début du tour » déclenche ses effets', () => {
    const c = new Combat({ character: 'riolu', deck: [], enemies: ['onix'], seed: 'TR', relics: [] } as never);
    c.player.energy = 9;
    c.hand = [{ uid: 1, defId: trameId('debut-tour', 'venin', 'bouclier'), upgraded: false }];
    c.play(1);
    expect(c.trames).toHaveLength(1);
    const e = c.enemies[0];
    e.intent = { id: 'x', name: 'x', weight: 1, intent: 'boost' } as never;
    c.endPlayerTurn(); c.enemyAct(e.uid); c.endEnemyTurn();
    expect(e.statuses.poison ?? 0).toBeGreaterThan(0);
    expect(c.player.block).toBeGreaterThan(0);
  });
});

import { Combat as Combat2 } from '../src/core/combat';
it('Confusion : attaquer confus coûte autant de PV que de cumuls, et elle disparaît 2 tours après', () => {
  const deck = Array.from({ length: 10 }, (_, i) => ({ uid: i + 1, defId: 'ruse', upgraded: false }));
  const c = new Combat2({ character: 'riolu', deck, enemies: ['rattata'], seed: 'CF', relics: [] } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999;
  (c as unknown as { addStatus: (f: unknown, w: string, s: string, n: number) => void }).addStatus(c.player, 'player', 'confusion', 3);
  const hp = c.player.hp;
  c.play(c.hand[0].uid);
  expect(hp - c.player.hp).toBe(3);
  const turn = () => { c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); c.endEnemyTurn(); };
  turn();
  expect(c.player.statuses.confusion).toBe(3);
  turn();
  expect(c.player.statuses.confusion).toBeUndefined();
});
