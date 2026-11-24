// Objets communs : Bracelet Macho, Herbe Mental, Pierre Ovale, Poké Poupée, Lunettes Noires.
import { describe, expect, it } from 'vitest';
import { Combat, HAND_SIZE } from '../src/core/combat';
import { RELIC_DEFS } from '../src/data/relics';

const mk = (relics: string[], deck = Array.from({ length: 12 }, (_, i) => ({ uid: i + 1, defId: 'ruse', upgraded: false }))) =>
  new Combat({ character: 'riolu', deck, enemies: ['onix'], seed: 'OBJ', relics } as never);

describe('nouveaux objets communs', () => {
  it('sont bien de rareté commune', () => {
    for (const id of ['bracelet-macho', 'herbe-mental', 'pierre-ovale', 'poke-poupee', 'lunettes-noires']) expect(RELIC_DEFS[id].rarity).toBe('commun');
  });
  it('Bracelet Macho, Poké Poupée, Lunettes Noires au début du combat', () => {
    const c = mk(['bracelet-macho', 'poke-poupee', 'lunettes-noires']);
    expect(c.player.statuses.attaque).toBe(2);
    expect(c.player.statuses.defense).toBe(-1);
    expect(c.player.statuses.clone).toBe(5);
    expect(c.enemies[0].statuses.defense).toBe(-1);
  });
  it('Pierre Ovale : une carte de plus au premier tour', () => {
    expect(mk(['pierre-ovale']).hand.length).toBe(HAND_SIZE + 1);
    expect(mk([]).hand.length).toBe(HAND_SIZE);
  });
  it('Herbe Mental annule le premier statut négatif seulement', () => {
    const c = mk(['herbe-mental']);
    const add = (c as unknown as { addStatus: (...a: unknown[]) => void }).addStatus.bind(c);
    add(c.player, 'player', 'confusion', 2);
    expect(c.player.statuses.confusion ?? 0).toBe(0);
    add(c.player, 'player', 'confusion', 2);
    expect(c.player.statuses.confusion).toBe(2);
  });
});

describe('Élan', () => {
  it('donne de la Protection au tour suivant, puis se divise par deux', () => {
    const c = new Combat({ character: 'caninos', deck: [], enemies: ['onix'], seed: 'EL', relics: [] } as never);
    c.player.statuses.elan = 6;
    const e = c.enemies[0];
    e.intent = { id: 'x', name: 'x', weight: 1, intent: 'boost' } as never;
    c.endPlayerTurn(); c.enemyAct(e.uid); c.endEnemyTurn();
    expect(c.player.statuses.elan).toBe(3);
    expect(c.player.block).toBeGreaterThanOrEqual(6);
  });
});
