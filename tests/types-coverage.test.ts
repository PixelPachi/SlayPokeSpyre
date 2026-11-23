import { test, expect } from 'vitest';
import { ENEMY_DEFS } from '../src/data/enemies';
import { ZONES } from '../src/data/zones';
const ALL: string[] = ['normal','feu','eau','plante','electrik','glace','combat','poison','sol','vol','psy','insecte','roche','spectre','dragon','tenebres','acier','fee'];
test('m', () => {
  for (const a of [1, 2, 3]) {
    const t = new Set(ZONES.filter((z) => z.act === a).flatMap((z) => z.encounters.flat()).flatMap((i) => ENEMY_DEFS[i].types as string[]));
    expect(ALL.filter((x) => !t.has(x)), `acte ${a}`).toEqual([]);
  }
});
