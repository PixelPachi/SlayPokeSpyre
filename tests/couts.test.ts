import { expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { CARD_DEFS } from '../src/data/cards';
import { CHARACTERS } from '../src/data/characters';

it('chaque carte coûte exactement le nombre de PA affiché', () => {
  const bad: string[] = [];
  for (const d of Object.values(CARD_DEFS)) {
    if (d.keywords?.includes('injouable')) continue;
    for (const up of [false, true]) {
      const ch = (d.character === 'normal' ? 'riolu' : d.character) as keyof typeof CHARACTERS;
      if (!CHARACTERS[ch]) continue;
      const c = new Combat({ character: ch, deck: makeDeck(CHARACTERS[ch].starterDeck), enemies: ['chenipan', 'chenipan'], seed: 'x' });
      c.drainEvents();
      for (const e of c.enemies) { e.hp = 999; e.maxHp = 999; }
      const card = { uid: 9999, defId: d.id, upgraded: up };
      c.hand.push(card as never);
      c.player.energy = 6; c.player.block = 50; c.player.aura = 30;
      const shown = c.costOf(card as never);
      const def = c.def(card as never);
      const before = c.player.energy;
      const ok = c.play(9999, c.enemies[0].uid);
      if (!ok) continue;
      const gained = def.effects.some((e) => e.kind === 'pa' || (e as { kind: string }).kind.includes('pa'));
      const spent = before - c.player.energy;
      if (spent !== shown && !gained) bad.push(`${d.id}${up ? '+' : ''}: affiché ${shown}, dépensé ${spent}`);
    }
  }
  expect(bad).toEqual([]);
});
