// Cohérence des capacités ennemies et Colère des Pokémon joués.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';
import { ENEMY_DEFS } from '../src/data/enemies';
import { cardDef } from '../src/data/cards';

describe('cohérence des capacités', () => {
  it('Méga-Sangsue draine, Hypnose endort, Bélier blesse son lanceur', () => {
    new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'X' }); // applique les correctifs
    expect(ENEMY_DEFS.balignon.moves.find((m) => m.id === 'mega-sangsue')!.drain).toBe(true);
    expect(ENEMY_DEFS.ptitard.moves.find((m) => m.id === 'hypnose')!.playerStatus!.status).toBe('sommeil');
    expect(ENEMY_DEFS.ursaring.moves.find((m) => m.name === 'Bélier')!.recoil).toBeGreaterThan(0);
    expect(ENEMY_DEFS.ymphect.moves.find((m) => m.name === 'Tempêtesable')!.meteo).toBe('tempete-sable');
  });
  it('un ennemi qui draine récupère des PV', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['balignon'], seed: 'DR', hp: 200, maxHp: 200 });
    c.drainEvents();
    const e = c.aliveEnemies()[0];
    e.hp = 5; e.intent = ENEMY_DEFS.balignon.moves.find((m) => m.id === 'mega-sangsue')!;
    c.player.block = 0;
    c.endPlayerTurn(); c.enemyAct(e.uid);
    expect(e.hp).toBeGreaterThan(5);
  });
  it('Colère : plus forte, mais rend confus', () => {
    for (const id of ['can-colere', 'vip-colere', 'kan-colere']) {
      const d = cardDef(id);
      expect(d.effects.some((x) => x.kind === 'statut' && x.status === 'confusion' && x.on === 'soi' && x.stacks === 2)).toBe(true);
    }
  });
});
