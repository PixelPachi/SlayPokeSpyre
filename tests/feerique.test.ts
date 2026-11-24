// Lucario Féerique : Peau Féerique (Normal → Fée, pas d'Aura au départ), Foulard Rose et Attraction, Charme.
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { cardDef } from '../src/data/cards';

const mk = (skin?: string, relics: string[] = []) => {
  const c = new Combat({ character: 'riolu', deck: [], enemies: ['onix'], seed: 'FEE', relics, skin } as never);
  c.drainEvents(); c.player.energy = 9;
  return c;
};

describe('Lucario Féerique', () => {
  it('Peau Féerique : Normal → Fée, et pas d’Aura au départ', () => {
    const c = mk('feerique');
    expect(c.def({ uid: 1, defId: 'ruse', upgraded: false }).pokeType).toBe('fee');
    expect(c.player.aura).toBe(0);
    expect(c.player.types).toEqual(['fee']);
    expect(mk().player.aura).toBe(3);
  });
  it('Foulard Rose : deux attaques sur le même ennemi → Attraction', () => {
    const c = mk(undefined, ['foulard-rose']);
    const e = c.aliveEnemies()[0];
    c.hand = [{ uid: 1, defId: 'ruse', upgraded: false }, { uid: 2, defId: 'ruse', upgraded: false }];
    c.play(1, e.uid);
    expect(e.statuses.attraction ?? 0).toBe(0);
    c.play(2, e.uid);
    expect(e.statuses.attraction).toBe(2);
  });
  it('Charme applique l’Attraction', () => {
    expect(cardDef('n-charme').effects).toContainEqual(expect.objectContaining({ kind: 'statut', status: 'attraction' }));
  });
  it('Attraction : l’ennemi rate parfois son action', () => {
    let missed = 0;
    for (let i = 0; i < 30; i++) {
      const c = new Combat({ character: 'riolu', deck: [], enemies: ['onix'], seed: 'A' + i, relics: [] } as never);
      const e = c.aliveEnemies()[0];
      e.statuses.attraction = 2;
      c.endPlayerTurn(); c.drainEvents(); c.enemyAct(e.uid);
      if (c.drainEvents().some((ev) => ev.type === 'enemy-move' && ev.name === 'Sous le charme !')) missed++;
    }
    expect(missed).toBeGreaterThan(3);
    expect(missed).toBeLessThan(20);
  });
});
