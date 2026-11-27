// Caninos : archétypes Brûlure / Élan et les deux talents légendaires.
import { expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { cardDef } from '../src/data/cards';

const mk = () => {
  const deck = Array.from({ length: 12 }, (_, i) => ({ uid: i + 1, defId: 'can-rune-protect', upgraded: false }));
  const c = new Combat({ character: 'caninos', deck, enemies: ['onix'], seed: 'CAN', relics: [] } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999;
  return c;
};

it('Vitesse Éternelle et Brasier Éternel sont légendaires (3 PA, 2 une fois améliorés)', () => {
  for (const id of ['can-vitesse-eternelle', 'can-brasier-eternel']) {
    expect(cardDef(id).rarity).toBe('legendaire');
    expect(cardDef(id).cost).toBe(3);
    expect(cardDef(id, true).cost).toBe(2);
  }
});

it('Vitesse Éternelle : l’Élan ne se divise plus par deux', () => {
  const c = mk();
  c.player.statuses.elan = 6;
  c.player.powers['elan-persistant'] = 1;
  c.endPlayerTurn();
  expect(c.player.statuses.elan).toBe(6);
});

it('Brasier Éternel : la Brûlure des ennemis ne diminue plus', () => {
  const c = mk();
  c.enemies[0].statuses.brulure = 4;
  c.player.powers['brasier-eternel'] = 1;
  c.endPlayerTurn();
  expect(c.enemies[0].statuses.brulure).toBe(4);
});
