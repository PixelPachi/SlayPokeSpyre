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

import { Run } from '../src/core/run';
import { allCards } from '../src/data/cards';
it('cartes de skin : 4 communes + 1 talent légendaire par skin, proposées seulement avec ce skin', () => {
  for (const sk of ['magma', 'feerique', 'alchimiste', 'tisserand', 'oceanique', 'lanterne', 'hisui']) {
    const cs = allCards().filter((d) => d.skin === sk);
    expect(cs.filter((d) => d.rarity === 'commune' && d.category !== 'talent'), sk).toHaveLength(4);
    expect(cs.filter((d) => d.rarity === 'legendaire' && d.category === 'talent'), sk).toHaveLength(1);
  }
  const r = new Run('S', 'caninos');
  const pool = allCards().filter((d) => d.skin === 'hisui');
  expect(r.offerable(pool)).toHaveLength(0);
  r.skin = 'hisui';
  expect(r.offerable(pool)).toHaveLength(5);
});

it('Combo Griffe : +4 dégâts par exemplaire dans le deck', () => {
  const deck = ['kan-combo-griffe', 'kan-combo-griffe', 'kan-combo-griffe', 'abri', 'abri'].map((defId, i) => ({ uid: i + 1, defId, upgraded: false }));
  const c = new Combat({ character: 'kangourex', deck, enemies: ['rattata'], seed: 'CG', relics: [] } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999; c.player.energy = 10; c.player.statuses = {};
  const hp = c.enemies[0].hp;
  c.play(c.hand.find((x) => x.defId === 'kan-combo-griffe')!.uid, c.enemies[0].uid);
  expect(hp - c.enemies[0].hp).toBeGreaterThanOrEqual(4 + 3 * 4);
});
