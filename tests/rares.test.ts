import { expect, it } from 'vitest';
import { Run } from '../src/core/run';
import { cardDef } from '../src/data/cards';
it('les cartes rares restent rares et ne se répètent pas', () => {
  let rares = 0, total = 0, dup = 0;
  for (let s = 0; s < 40; s++) {
    const run = new Run(`R${s}`, 'caninos');
    for (let i = 0; i < 25; i++) { // ~ deux actes de combats
      const ch = run.cardChoices('combat');
      for (const id of ch) { total++; if (cardDef(id).rarity === 'rare') rares++; }
      const rare = ch.find((id) => cardDef(id).rarity === 'rare');
      const pick = rare ?? ch[0];
      if (rare && run.deck.some((c) => c.defId === rare)) dup++;
      run.addCard(pick);
    }
  }
  expect(dup).toBe(0);
  expect(rares / total).toBeLessThan(0.08);
});
