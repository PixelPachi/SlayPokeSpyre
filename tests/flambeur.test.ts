// Quelorior Flambeur : Jackpot, Atout, Roulette, rabais, déblocage à 500 ₽ ; objets de skin partagés.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { Run } from '../src/core/run';
import { skinDef } from '../src/data/skins';
import { cardDef } from '../src/data/cards';
import { recordRunStats, skinProgress } from '../src/core/save';

const skinRun = () => { const r = new Run('FLB', 'quelorior'); r.applySkin('flambeur', skinDef('quelorior', 'flambeur')); return r; };

describe('Flambeur', () => {
  it('deck, objet et rabais', () => {
    const r = skinRun();
    expect(r.deck.filter((c) => c.defId === 'quel-jackpot')).toHaveLength(4);
    expect(r.deck.some((c) => c.defId === 'quel-atout')).toBe(true);
    expect(r.deck.filter((c) => c.defId === 'quel-gribouille')).toHaveLength(2);
    expect(r.relics).toContain('roulette');
    expect(r.gambler).toBe(true);
  });
  it('Jackpot rapporte des ₽, la Roulette ajoute 2 dégâts par 100 ₽', () => {
    const mk = (money: number) => {
      const c = new Combat({ character: 'quelorior', deck: makeDeck(['abri']), enemies: ['onix'], seed: 'J', relics: ['roulette'], money });
      c.drainEvents(); c.player.energy = 9; c.hand = [{ uid: 1, defId: 'quel-jackpot', upgraded: false }];
      const e = c.aliveEnemies()[0]; e.statuses = {}; const h = e.hp + e.block; c.play(1, e.uid);
      return { c, dmg: h - (e.hp + e.block) };
    };
    const a = mk(0), b = mk(300);
    expect(a.c.moneyGained).toBe(5);
    expect(b.dmg).toBeGreaterThan(a.dmg);
  });
  it('Atout joue les 2 cartes du dessus de la pioche', () => {
    const c = new Combat({ character: 'quelorior', deck: makeDeck(['abri']), enemies: ['onix'], seed: 'AT', relics: [] });
    c.drainEvents(); c.player.energy = 9; c.player.block = 0;
    c.hand = [{ uid: 1, defId: 'quel-atout', upgraded: false }];
    c.drawPile = makeDeck(['abri', 'abri']).map((x, i) => ({ ...x, uid: 50 + i }));
    c.play(1);
    expect(c.player.block).toBeGreaterThan(0);
    expect(c.drawPile).toHaveLength(0);
    expect(cardDef('quel-atout', true).cost).toBe(1);
  });
  it('déblocage : 500 ₽ en réserve pendant une run', () => {
    const k = skinDef('quelorior', 'flambeur')!;
    const save = { stats: {}, beaten: {} } as never;
    recordRunStats(save, 'quelorior', { maxMoney: 320 });
    recordRunStats(save, 'quelorior', { maxMoney: 120 });
    expect(skinProgress(save, 'quelorior', k)).toEqual([320, 500]);
    recordRunStats(save, 'quelorior', { maxMoney: 610 });
    expect(skinProgress(save, 'quelorior', k)).toEqual([500, 500]);
  });
  it('objets de skin débloqués : trouvables par les autres Pokémon (pas le Corail)', () => {
    const r = new Run('SH', 'riolu');
    r.sharedRelics = ['roulette', 'lanterne-bleue'];
    expect(r.relicPool()).toContain('roulette');
    expect(r.relicPool()).toContain('lanterne-bleue');
    r.sharedRelics = ['corail'];
    expect(r.relicPool()).not.toContain('corail');
  });
});

import { unlockedCards } from '../src/data/unlocks';
describe('Atout sans skin', () => {
  it('est débloqué dès le niveau 1 et proposé en récompense', () => {
    expect(unlockedCards('quelorior', 1)).toContain('quel-atout');
    const r = new Run('ATO', 'quelorior', unlockedCards('quelorior', 1));
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) for (const id of r.cardChoices('combat')) seen.add(id);
    expect(seen.has('quel-atout')).toBe(true);
  });
});
