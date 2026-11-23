// Skin Alchimiste (Vipélierre) : Vampigraine → Poison, et Catalyse double le Poison.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';
import { Run } from '../src/core/run';
import { skinDef } from '../src/data/skins';
import { cardDef } from '../src/data/cards';
import { cardText, setStatusAlias } from '../src/ui/labels';

const mk = (skin?: string) => {
  const c = new Combat({ character: 'vipelierre', deck: makeDeck(CHARACTERS.vipelierre.starterDeck), enemies: ['onix'], seed: 'ALC', relics: [], skin });
  c.drainEvents(); c.player.energy = 9; return c;
};

describe('skin Alchimiste', () => {
  it('ajoute Catalyse au deck de départ', () => {
    const run = new Run('ALC', 'vipelierre');
    const n = run.deck.length;
    run.applySkin('alchimiste', skinDef('vipelierre', 'alchimiste'));
    expect(run.deck).toHaveLength(n + 1);
    expect(run.deck.some((c) => c.defId === 'vip-catalyse')).toBe(true);
  });
  it('Vampigraine devient du Poison, Catalyse le double', () => {
    const c = mk('alchimiste');
    c.hand = [{ uid: 1, defId: 'vampigraine', upgraded: false }, { uid: 2, defId: 'vip-catalyse', upgraded: false }];
    const e = c.aliveEnemies()[0];
    c.play(1, e.uid);
    expect(e.statuses.vampigraine ?? 0).toBe(0);
    const p = e.statuses.poison ?? 0;
    expect(p).toBeGreaterThan(0);
    c.play(2, e.uid);
    expect(e.statuses.poison).toBe(p * 2);
  });
  it('sans le skin, la Vampigraine reste une Vampigraine', () => {
    const c = mk();
    c.hand = [{ uid: 1, defId: 'vampigraine', upgraded: false }];
    const e = c.aliveEnemies()[0];
    c.play(1, e.uid);
    expect(e.statuses.vampigraine ?? 0).toBeGreaterThan(0);
  });
  it('le texte des cartes affiche Poison avec le skin', () => {
    setStatusAlias({ vampigraine: 'poison' });
    expect(cardText(cardDef('vampigraine'), null, null)).toContain('Poison');
    setStatusAlias({});
    expect(cardText(cardDef('vampigraine'), null, null)).toContain('Vampigraine');
  });
});
