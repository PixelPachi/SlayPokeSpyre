// Skins chromatiques : Étincelles, cartes chromatiques et passifs propres à chaque Pokémon.
import { describe, expect, it } from 'vitest';
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

describe('cartes chromatiques (rareté arc-en-ciel)', () => {
  it('toute carte peut être chromatique : valeurs doublées, même améliorée', async () => {
    const { cardDef, chromaId } = await import('../src/data/cards');
    const base = cardDef('vive-attaque');
    const ch = cardDef(chromaId('vive-attaque'));
    expect(ch.chroma).toBe(true);
    const dmg = (d: typeof base) => (d.effects.find((e) => e.kind === 'degats') as { amount: number }).amount;
    expect(dmg(ch)).toBe(dmg(base) * 2);
    expect(dmg(cardDef(chromaId('vive-attaque'), true))).toBe(dmg(cardDef('vive-attaque', true)) * 2);
  });
  it('apparaissent environ 1 fois sur 100, 2 avec le Charme Chroma qui remplace l’objet de départ', async () => {
    const { Run } = await import('../src/core/run');
    const count = (r: InstanceType<typeof Run>) => { let n = 0; for (let i = 0; i < 2000; i++) n += r.cardChoices('combat').filter((id) => id.startsWith('chroma:')).length; return n; };
    const plain = new Run('CHROMA', 'riolu');
    const shiny = new Run('CHROMA', 'riolu'); shiny.applySkin('shiny');
    expect(shiny.relics[0]).toBe('charme-chroma');
    expect(shiny.relics).not.toContain('ceinture-noire');
    const a = count(plain), b = count(shiny);
    expect(a).toBeGreaterThan(25); expect(a).toBeLessThan(110);
    expect(b).toBeGreaterThan(a);
  });
});
