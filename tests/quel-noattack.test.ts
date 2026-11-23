import { describe, it, expect } from 'vitest';
import { Run } from '../src/core/run';
import { cardDef } from '../src/data/cards';

describe('Quelorior sans attaques en récompense', () => {
  it('ni en combat ni au marché', () => {
    for (let s = 1; s <= 30; s++) {
      const run = new Run('s' + s, 'quelorior');
      const ids = [...run.cardChoices('combat'), ...run.cardChoices('elite'), ...run.cardChoices('boss'), ...run.cardChoices('boutique', 5), ...run.neutralChoices(2)];
      expect(ids.length).toBeGreaterThan(0);
      for (const id of ids) expect(cardDef(id).category).not.toBe('attaque');
    }
  });
});
