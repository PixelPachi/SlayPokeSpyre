// Skin Cramoisi (Riolu) : l'Aura inflige de la Brûlure au lieu de dégâts, sauf pour les cartes d'Aura.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';

const mk = (skin?: string) => {
  const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['onix'], seed: 'CRAM', relics: [], skin });
  c.drainEvents(); c.player.energy = 9; c.player.aura = 6;
  return c;
};

describe('skin Cramoisi', () => {
  it('une attaque normale consomme l’Aura et brûle la cible sans dégâts en plus', () => {
    const a = mk(), b = mk('magma');
    for (const c of [a, b]) c.hand = [{ uid: 1, defId: 'ruse', upgraded: false }];
    const ea = a.aliveEnemies()[0], eb = b.aliveEnemies()[0];
    const ha = ea.hp + ea.block, hb = eb.hp + eb.block;
    a.play(1, ea.uid); b.play(1, eb.uid);
    expect(b.player.aura).toBe(0);
    expect(eb.statuses.brulure).toBe(6);
    expect(hb - (eb.hp + eb.block)).toBeLessThan(ha - (ea.hp + ea.block));
  });
  it('Aurasphère garde ses dégâts d’Aura', () => {
    const c = mk('magma');
    c.hand = [{ uid: 1, defId: 'aurasphere', upgraded: false }];
    const e = c.aliveEnemies()[0], h = e.hp + e.block;
    c.play(1, e.uid);
    expect(h - (e.hp + e.block)).toBeGreaterThan(0);
    expect(e.statuses.brulure ?? 0).toBe(0);
  });
});
