// Kangourex Gardien Océanique : type Eau, Corail (Bébé +3 Protection par tour), Écume, cartes Eau.
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';
import { skinDef, babySprite } from '../src/data/skins';
import { cardDef } from '../src/data/cards';

const skinRun = () => { const r = new Run('OCE', 'kangourex'); r.applySkin('oceanique', skinDef('kangourex', 'oceanique')); return r; };

describe('Gardien Océanique', () => {
  it('type Eau, Corail, Écumes', () => {
    const r = skinRun();
    expect(r.form.types).toEqual(['eau']);
    expect(r.relics).toContain('corail');
    expect(r.relics).not.toContain('lait-meumeu');
    expect(r.deck.filter((c) => c.defId === 'kan-ecume')).toHaveLength(4);
    expect(cardDef('kan-ecume')).toMatchObject({ cost: 1, target: 'tous', pokeType: 'eau' });
    expect(babySprite('oceanique')).toContain('skins/oceanique/bebe.png');
  });
  it('le Bébé gagne 3 Protection à chaque tour', () => {
    const r = skinRun();
    const c = new Combat({ character: 'kangourex', deck: r.deck, enemies: ['onix'], seed: 'OCE', relics: r.relics, skin: 'oceanique', form: r.form });
    c.drainEvents();
    expect(c.player.types).toEqual(['eau']);
    expect(c.player.familiar!.block).toBe(3);
  });
  it('peut obtenir les cartes Eau des autres Pokémon', () => {
    const r = skinRun();
    const seen = new Set<string>();
    for (let i = 0; i < 400; i++) for (const id of r.cardChoices('elite')) seen.add(id);
    expect([...seen].some((id) => cardDef(id).pokeType === 'eau' && cardDef(id).character !== 'kangourex')).toBe(true);
  });
});
