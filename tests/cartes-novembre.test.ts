// Clonage (Protection persistante), Lance-Soleil (différé, ou immédiat au soleil), Abattage (Attaque −1 ce tour), Bélier.
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';

const mk = (character = 'vipelierre') => {
  const c = new Combat({ character, deck: [], enemies: ['onix', 'rattata'], seed: 'NOV', relics: [] } as never);
  c.drainEvents(); c.player.energy = 9;
  return c;
};
const turn = (c: Combat) => { c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); c.endEnemyTurn(); c.player.energy = 9; };

describe('cartes de novembre', () => {
  it('Clonage : la Protection persistante reste au tour suivant', () => {
    const c = mk();
    c.hand = [{ uid: 1, defId: 'vip-clonage', upgraded: false }];
    c.play(1);
    expect(c.player.statuses.clone).toBe(15);
    for (const e of c.aliveEnemies()) e.intent = { ...e.intent, damage: 0, intent: 'boost' } as never;
    turn(c);
    expect(c.player.statuses.clone).toBe(15);
  });
  it('Lance-Soleil frappe au début du tour suivant, ou tout de suite au soleil', () => {
    const a = mk(), b = mk();
    for (const c of [a, b]) c.hand = [{ uid: 1, defId: 'vip-lance-soleil', upgraded: false }];
    b.setField('zenith');
    const ea = a.aliveEnemies()[1], eb = b.aliveEnemies()[1];
    const ha = ea.hp, hb = eb.hp;
    a.play(1); b.play(1);
    expect(ea.hp).toBe(ha);
    expect(eb.hp).toBeLessThan(hb);
    turn(a);
    expect(a.aliveEnemies().length < 2 || a.aliveEnemies()[1].hp < ha).toBe(true);
  });
  it('Abattage : −1 Attaque seulement pour ce tour', () => {
    const c = mk();
    const e = c.aliveEnemies()[0];
    const before = e.statuses.attaque ?? 0;
    c.hand = [{ uid: 1, defId: 'vip-abattage', upgraded: false }];
    c.play(1, e.uid);
    expect(e.statuses.attaque ?? 0).toBe(before - 1);
    turn(c);
    expect(e.statuses.attaque ?? 0).toBe(before);
  });
  it('Bélier inflige autant que la Protection', () => {
    const c = mk();
    c.player.block = 20;
    const e = c.aliveEnemies()[1], h = e.hp + e.block;
    c.hand = [{ uid: 1, defId: 'vip-belier', upgraded: false }];
    c.play(1, e.uid);
    expect(h - (e.hp + e.block)).toBeGreaterThan(10);
  });
});

describe('Écho et malédictions', () => {
  it('Écho : la carte se joue deux fois la première fois seulement', async () => {
    const { enchantId } = await import('../src/data/cards');
    const c = mk();
    const id = enchantId('echo', 'vip-abattage');
    const e = c.aliveEnemies()[0];
    c.hand = [{ uid: 1, defId: id, upgraded: false }];
    const h0 = e.hp + e.block;
    c.play(1, e.uid);
    const first = h0 - (e.hp + e.block);
    c.hand = [{ uid: 1, defId: id, upgraded: false }];
    const h1 = e.hp + e.block;
    c.play(1, e.uid);
    const second = h1 - (e.hp + e.block);
    expect(first).toBeGreaterThan(second);
  });
  it('8 malédictions, toutes injouables', async () => {
    const { CURSES, cardDef } = await import('../src/data/cards');
    expect(CURSES).toHaveLength(8);
    for (const id of CURSES) expect(cardDef(id).keywords).toContain('injouable');
  });
});
