import { expect, it } from 'vitest';
import { Run } from '../src/core/run';
import { cardDef } from '../src/data/cards';
it('chance de rare fixe : faible en combat, bien plus forte sur les dominants, garantie sur les gardiens', () => {
  const rate = (kind: 'combat' | 'elite' | 'boss') => {
    let rares = 0, total = 0;
    for (let s = 0; s < 60; s++) {
      const run = new Run(`R${s}`, 'riolu');
      for (let i = 0; i < 20; i++) for (const id of run.cardChoices(kind)) { total++; if (cardDef(id).rarity === 'rare') rares++; }
    }
    return rares / total;
  };
  const c = rate('combat'), e = rate('elite'), b = rate('boss');
  expect(c).toBeLessThan(0.06);
  expect(e).toBeGreaterThan(0.15);
  expect(b).toBeGreaterThan(0.9);
});
