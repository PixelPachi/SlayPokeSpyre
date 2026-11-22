import { describe, expect, it } from 'vitest';
import { cardDef } from '../src/data/cards';
import { cardText } from '../src/ui/labels';
import { relicDef } from '../src/data/relics';

describe('Vipélierre : Ligoté, Épine, Pic Venin, Lunettes Filtre', () => {
  it('textes des cartes', () => {
    expect(cardText(cardDef('vip-ligotage'), null, null)).toContain('Ligoté');
    const ess = cardText(cardDef('vip-essorage'), null, null);
    expect(ess).toContain('Ligoté'); expect(ess).toContain('Vampigraine');
    expect(cardText(cardDef('vip-pico-defense'), null, null)).toContain('Épine');
    expect(cardText(cardDef('vip-peau-dure'), null, null)).toContain('Épine');
  });
  it('nouveaux objets', () => {
    expect(relicDef('pic-venin').owner).toBe('vipelierre');
    expect(relicDef('lunettes-filtre').sprite).toBe('safety-goggles');
  });
});

import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';
const start = (relics: string[], enemies = ['onix']) => {
  const c = new Combat({ character: 'vipelierre', deck: makeDeck(CHARACTERS.vipelierre.starterDeck), enemies, seed: 'LIG', relics });
  c.drainEvents(); c.player.energy = 9; return c;
};
const give = (c: Combat, defId: string) => { const card = { uid: 7000 + c.hand.length, defId, upgraded: false }; c.hand.push(card); return card; };
const endTurn = (c: Combat) => { c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); if ((c.phase as string) === 'ennemi') c.endEnemyTurn(); c.drainEvents(); c.player.energy = 9; };

describe('Ligoté et Épine en combat', () => {
  it('Ligoté : 6 PV par tour, un cumul part après 3 tours', () => {
    const c = start([]); const e = c.aliveEnemies()[0];
    c.play(give(c, 'vip-essorage').uid, e.uid);
    expect(e.statuses.ligote).toBe(1);
    const hp: number[] = [];
    for (let i = 0; i < 4; i++) { const h = e.hp; endTurn(c); hp.push(h - e.hp); }
    expect(e.statuses.ligote ?? 0).toBe(0);
    expect(hp[0]).toBeGreaterThanOrEqual(6);
  });
  it('Pic Venin : +1 cumul', () => {
    const c = start(['pic-venin']); const e = c.aliveEnemies()[0];
    c.play(give(c, 'vip-essorage').uid, e.uid);
    expect(e.statuses.ligote).toBe(2); expect(e.statuses.vampigraine).toBe(4);
  });
  it('Épine : l’attaquant se pique, Peau Dure en donne chaque tour', () => {
    const c = start([], ['rattata']);
    c.play(give(c, 'vip-peau-dure').uid);
    endTurn(c);
    expect(c.player.statuses.epine ?? 0).toBeGreaterThanOrEqual(2);
  });
});
