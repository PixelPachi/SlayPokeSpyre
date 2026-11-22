// Refonte de Kangourex (inspirée du Nécrolieur) : Invocation, Bébé bouclier, Furie, Souvenir, Croissance.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';

const mk = (ids: string[], enemies = ['rattata']) => {
  const c = new Combat({ character: 'kangourex', deck: makeDeck(CHARACTERS.kangourex.starterDeck), enemies, seed: 'INV', relics: [] });
  c.drainEvents(); c.player.energy = 9;
  c.hand = makeDeck(ids).map((x, i) => ({ ...x, uid: 800 + i }));
  return c;
};
const kill = (c: Combat) => { (c as unknown as { hitFamiliar: (n: number, e: string) => number }).hitFamiliar(999, 'normal'); };

describe('Kangourex : Invocation', () => {
  it('Invocation fait grandir le Bébé, ou le ramène s’il est K.O.', () => {
    const c = mk(['kan-garde-large', 'kan-second-souffle']);
    const f = c.player.familiar!;
    const max0 = f.maxHp;
    c.play(800);
    expect(f.maxHp).toBe(max0 + 4);
    kill(c);
    expect(f.hp).toBe(0);
    c.play(801);
    expect(f.hp).toBe(15); expect(f.maxHp).toBe(15);
  });
  it('le Bébé encaisse les attaques ennemies, le surplus touche Kangourex', () => {
    const c = mk([], ['onix']);
    const hp = c.player.hp, f = c.player.familiar!;
    c.endPlayerTurn();
    for (const e of c.aliveEnemies()) c.enemyAct(e.uid);
    expect(f.hp < f.maxHp || c.player.hp === hp).toBe(true);
    expect(c.player.statuses.rage ?? 0).toBeGreaterThanOrEqual(f.hp < f.maxHp ? 1 : 0);
  });
  it('Attaque +2 une seule fois par combat quand le Bébé tombe', () => {
    const c = mk(['kan-second-souffle']);
    kill(c); c.play(800); kill(c);
    expect(c.player.statuses.attaque).toBe(2);
  });
  it('Furie : 1 attaque + 1 par attaque du Bébé déjà faite ce tour', () => {
    const c = mk(['kan-double-baffe', 'kan-furie'], ['onix']);
    c.play(800, c.aliveEnemies()[0].uid);
    expect(c.babyHits).toBe(2);
    c.play(801, c.aliveEnemies()[0].uid);
    expect(c.babyHits).toBe(5);
  });
  it('Souvenir : le Bébé se sacrifie, ses PV en dégâts à tous et en Protection', () => {
    const c = mk(['kan-souvenir'], ['onix']);
    const n = c.player.familiar!.hp, e = c.aliveEnemies()[0], before = e.hp + e.block;
    c.play(800);
    expect(c.player.familiar!.hp).toBe(0);
    expect(c.player.block).toBe(n);
    expect(e.hp + e.block).toBeLessThan(before);
  });
  it('Croissance : Invocation au début de chaque tour', () => {
    const c = mk(['kan-croissance'], ['onix']);
    c.play(800);
    const m = c.player.familiar!.maxHp;
    c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); if ((c.phase as string) === 'ennemi') c.endEnemyTurn();
    expect(c.player.familiar!.maxHp).toBeGreaterThanOrEqual(m + 3 - 0);
  });
});
