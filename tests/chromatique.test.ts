// Skins chromatiques : Étincelles, cartes chromatiques et passifs propres à chaque Pokémon.
import { expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';

const mk = (character: string, ids: string[], skin = 'shiny') => {
  const deck = ids.map((defId, i) => ({ uid: i + 1, defId, upgraded: false }));
  const c = new Combat({ character, deck, enemies: ['rattata'], seed: 'SH', relics: [], skin } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999; c.player.energy = 10;
  return c;
};

it('à 5 Étincelles, la prochaine carte est chromatique (dégâts doublés) et consomme les Étincelles', () => {
  const c = mk('caninos', Array(6).fill('griffe'));
  c.player.statuses = { etincelle: 5 };
  const hp = c.enemies[0].hp;
  c.play(c.hand[0].uid, c.enemies[0].uid);
  const chroma = hp - c.enemies[0].hp;
  const hp2 = c.enemies[0].hp;
  c.play(c.hand[0].uid, c.enemies[0].uid);
  const normal = hp2 - c.enemies[0].hp;
  expect(chroma).toBeGreaterThanOrEqual(normal * 2 - 1);
  expect(c.player.statuses.etincelle ?? 0).toBeLessThan(5);
});

it('Caninos chromatique : la carte chromatique fait exploser la Brûlure de sa cible et la consomme', () => {
  const c = mk('caninos', Array(6).fill('griffe'));
  c.player.statuses = { etincelle: 5 };
  c.enemies[0].statuses.brulure = 6;
  c.play(c.hand[0].uid, c.enemies[0].uid);
  expect(c.enemies[0].statuses.brulure).toBeUndefined();
});

it('sans skin chromatique, pas d’Étincelles', () => {
  const c = mk('caninos', Array(6).fill('griffe'), 'normal');
  c.player.statuses = { etincelle: 5 };
  const hp = c.enemies[0].hp;
  c.play(c.hand[0].uid, c.enemies[0].uid);
  const hp2 = c.enemies[0].hp;
  c.play(c.hand[0].uid, c.enemies[0].uid);
  expect(hp - hp2).toBe(hp2 - c.enemies[0].hp);
});

it('skin chromatique : Charme Chroma au départ', () => {
  const r = new Run('S', 'riolu');
  r.applySkin('shiny');
  expect(r.relics).toContain('charme-chroma');
});
