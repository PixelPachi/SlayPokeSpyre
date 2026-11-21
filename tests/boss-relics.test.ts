import { expect, it } from 'vitest';
import { Run } from '../src/core/run';
import { relicDef } from '../src/data/relics';
const isPA = (id: string) => relicDef(id).rarity === 'gardien';
it('gardien : 3 objets au choix, au plus un qui donne des PA', () => {
  for (let s = 0; s < 100; s++) {
    const r = new Run(`B${s}`, 'riolu');
    const ch = r.bossRelicChoices();
    expect(ch).toHaveLength(3);
    expect(new Set(ch).size).toBe(3);
    expect(ch.filter(isPA).length).toBeLessThanOrEqual(1);
  }
});
it('à 5 PA, plus aucun objet de PA n’est proposé', () => {
  for (let s = 0; s < 50; s++) {
    const r = new Run(`C${s}`, 'riolu');
    r.relics.push('orbe-adamant', 'orbe-perle');
    expect(r.bossRelicChoices().filter(isPA)).toHaveLength(0);
  }
});
