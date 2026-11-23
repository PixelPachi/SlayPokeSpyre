// Ballon (résiste au Sol) et Bulbe (Attaque et Défense +1 après une attaque Eau).
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';
import type { EnemyMove } from '../src/core/model';

const hit = (relics: string[], move: EnemyMove) => {
  const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['onix'], seed: 'BB', relics, hp: 200, maxHp: 200 });
  c.drainEvents();
  const e = c.aliveEnemies()[0];
  e.intent = move; e.statuses = {};
  c.player.block = 0;
  c.endPlayerTurn(); c.enemyAct(e.uid);
  return c;
};

describe('Ballon et Bulbe', () => {
  it('Ballon : moitié des dégâts Sol', () => {
    const m: EnemyMove = { id: 'seisme', name: 'Séisme', weight: 1, intent: 'attaque', pokeType: 'sol', damage: 20 };
    const a = hit([], m), b = hit(['ballon'], m);
    expect(200 - b.player.hp).toBeLessThan(200 - a.player.hp);
    expect(200 - b.player.hp).toBe(Math.floor((200 - a.player.hp) / 2));
  });
  it('Bulbe : Attaque et Défense +1 après une attaque Eau', () => {
    const m: EnemyMove = { id: 'surf', name: 'Surf', weight: 1, intent: 'attaque', pokeType: 'eau', damage: 6 };
    const c = hit(['bulbe'], m);
    expect(c.player.statuses.attaque).toBe(1);
    expect(c.player.statuses.defense).toBe(1);
  });
});

import { relicDef } from '../src/data/relics';
describe('Plaques d’Arceus', () => {
  it('+3 dégâts au type de la plaque', () => {
    expect(relicDef('plaque-fantome').name).toBe('Plaque Fantôme');
    const mk = (relics: string[]) => {
      const c = new Combat({ character: 'caninos', deck: makeDeck(CHARACTERS.caninos.starterDeck), enemies: ['onix'], seed: 'PL', relics });
      c.drainEvents(); c.player.energy = 9; c.hand = [{ uid: 1, defId: 'n-ombre-portee', upgraded: false }];
      const e = c.aliveEnemies()[0]; e.statuses = {}; const h = e.hp + e.block;
      c.play(1, e.uid); return h - (e.hp + e.block);
    };
    expect(mk(['plaque-fantome'])).toBeGreaterThan(mk([]));
  });
});
