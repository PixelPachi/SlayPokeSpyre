// Skin Caninos d'Hisui : Feu/Roche, Pierre Dure (attaques Normal → Roche), cartes Roche dans ses récompenses.
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';
import { cardDef } from '../src/data/cards';
import { skinDef } from '../src/data/skins';

describe('Caninos d’Hisui', () => {
  it('la Pierre Dure change les attaques Normal en Roche', () => {
    const c = new Combat({ character: 'caninos', deck: [], enemies: ['rattata'], seed: 'H', relics: ['pierre-dure'] } as never);
    expect(c.def({ uid: 1, defId: 'charge', upgraded: false }).pokeType).toBe('roche');
    expect(c.def({ uid: 2, defId: 'abri', upgraded: false }).pokeType).not.toBe('roche');
  });
  it('le skin donne Feu/Roche, la Pierre Dure et des cartes Roche', () => {
    const k = skinDef('caninos', 'hisui')!;
    expect(k.types).toEqual(['feu', 'roche']);
    expect(k.relic).toBe('pierre-dure');
    const run = new Run('H1', 'caninos');
    run.applySkin('hisui', k);
    expect(run.relics).toContain('pierre-dure');
    let roche = false;
    for (let i = 0; i < 40 && !roche; i++) roche = run.cardChoices('combat').some((id) => cardDef(id).pokeType === 'roche' && cardDef(id).character !== 'caninos');
    expect(roche).toBe(true);
  });
});
