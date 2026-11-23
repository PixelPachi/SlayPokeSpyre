// Quelorior : Gribouille copie la capacité de l'ennemi ciblé ; la copie rejoint le deck de la run.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';
import { cardDef } from '../src/data/cards';
import { cardText } from '../src/ui/labels';
import { Run } from '../src/core/run';
import { ENEMY_DEFS } from '../src/data/enemies';

const mk = (ids: string[]) => {
  const c = new Combat({ character: 'quelorior', deck: makeDeck(CHARACTERS.quelorior.starterDeck), enemies: ['rattatac'], seed: 'QUEL', relics: [] });
  c.drainEvents(); c.player.energy = 9;
  c.hand = makeDeck(ids).map((x, i) => ({ ...x, uid: 700 + i }));
  return c;
};

describe('Quelorior', () => {
  it('deck de départ : 4 Ruse, 4 Abri, 2 Gribouille', () => {
    const d = CHARACTERS.quelorior.starterDeck;
    expect(d.filter((x) => x === 'ruse')).toHaveLength(4);
    expect(d.filter((x) => x === 'abri')).toHaveLength(4);
    expect(d.filter((x) => x === 'quel-gribouille')).toHaveLength(2);
    expect(cardDef('quel-gribouille').cost).toBe(0);
  });
  it('Gribouille copie la capacité préparée par la cible', () => {
    const c = mk(['quel-gribouille']);
    const e = c.aliveEnemies()[0];
    const intent = e.intent!.id;
    c.play(700, e.uid);
    expect(c.copiedCards).toEqual([`copie:rattatac:${intent}`]);
    const copy = cardDef(c.copiedCards[0]);
    expect(copy.name).toBe(e.intent!.name);
    expect(c.discardPile.some((x) => x.defId === c.copiedCards[0])).toBe(true);
    expect(cardText(copy, null, null).length).toBeGreaterThan(0);
  });
  it('Gribouille+ enchante la copie', () => {
    const c = mk(['quel-gribouille']);
    c.hand[0].upgraded = true;
    c.play(700, c.aliveEnemies()[0].uid);
    expect(c.copiedCards[0].startsWith('ench:')).toBe(true);
    expect(cardDef(c.copiedCards[0]).enchant).toBeTruthy();
  });
  it('la copie se joue et s’améliore', () => {
    const id = 'copie:rattatac:morsure';
    const d = cardDef(id), u = cardDef(id, true);
    const base = ENEMY_DEFS.rattatac.moves.find((m) => m.id === 'morsure')!.damage!;
    expect(d.effects[0]).toMatchObject({ kind: 'degats', amount: base });
    expect((u.effects[0] as { amount: number }).amount).toBeGreaterThan(base);
    const c = mk([]);
    c.hand = [{ uid: 1, defId: id, upgraded: false }];
    const e = c.aliveEnemies()[0], before = e.hp + e.block;
    c.play(1, e.uid);
    expect(e.hp + e.block).toBeLessThan(before);
  });
  it('ses récompenses sont des cartes neutres', () => {
    const run = new Run('QUELRUN', 'quelorior');
    const ids = run.cardChoices('combat');
    expect(ids).toHaveLength(3);
    for (const id of ids) expect(['normal', 'quelorior']).toContain(cardDef(id).character);
  });
});
