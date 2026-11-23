import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { TERRAINS, WEATHER, FIELD_TURNS } from '../src/core/weather';
import { ENEMY_DEFS } from '../src/data/enemies';
import { allCards } from '../src/data/cards';

const make = () => new Combat({ character: 'riolu', deck: [], enemies: ['blizzi'], seed: 'm', hp: 60, maxHp: 60, relics: [] } as never);

describe('Météos et champs', () => {
  it('chaque météo et chaque champ peut apparaître (ennemi ou carte)', () => {
    const ids = new Set<string>();
    for (const e of Object.values(ENEMY_DEFS)) for (const m of e.moves) if (m.meteo) ids.add(m.meteo);
    for (const c of allCards()) for (const f of c.effects) if (f.kind === 'meteo') ids.add(f.id);
    for (const id of [...Object.keys(WEATHER), ...Object.keys(TERRAINS)]) expect(ids, id).toContain(id);
  });
  it('durent toujours 5 tours', () => {
    const c = make();
    c.setField('pluie', 99); c.setField('champ-herbu', 2);
    expect(c.weather!.turns).toBe(FIELD_TURNS); expect(c.terrain!.turns).toBe(5);
  });
  it('Soleil Intense annule l’Eau, Déluge annule le Feu', () => {
    const c = make();
    c.setField('soleil-intense'); expect(c.fieldMult('eau')).toBe(0); expect(c.fieldMult('feu')).toBe(1.5);
    c.setField('deluge'); expect(c.fieldMult('feu')).toBe(0);
  });
  it('Champ Psychique empêche la Confusion', () => {
    const c = make();
    c.setField('champ-psychique');
    const e = c.enemies[0];
    (c as unknown as { addStatus: (...a: unknown[]) => void }).addStatus(e, e.uid, 'confusion', 2);
    expect(e.statuses.confusion ?? 0).toBe(0);
  });
});
