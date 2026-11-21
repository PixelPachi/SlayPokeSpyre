import { expect, it } from 'vitest';
import { Run } from '../src/core/run';
import { welcomeEvent } from '../src/data/events-accueil';
import { Combat } from '../src/core/combat';

it('Grodoudou propose 3 aides différentes ; le deck Rondoudou est très rare', () => {
  let rdd = 0;
  for (let s = 0; s < 3000; s++) {
    const ev = welcomeEvent(new Run(`W${s}`, 'riolu'));
    expect(new Set(ev.choices.map((c) => c.label)).size).toBe(3);
    if (ev.choices.some((c) => c.label.includes('Rondoudou'))) rdd++;
  }
  expect(rdd / 3000).toBeLessThan(0.025);
  expect(rdd).toBeGreaterThan(0);
});

it('chaque aide fonctionne', () => {
  for (let s = 0; s < 200; s++) {
    const r = new Run(`X${s}`, 'kangourex');
    for (const c of welcomeEvent(r).choices) {
      const res = c.apply(r);
      expect(res).toBeTruthy();
    }
  }
  const r = new Run('RDD', 'riolu');
  const ev = welcomeEvent(r);
  const opt = ev.choices[0];
  expect(opt).toBeTruthy();
});

it('Encens Zen : ennemis à 1 PV ; Abri annule le prochain coup', () => {
  const r = new Run('Z', 'riolu');
  const c = new Combat({ character: 'riolu', deck: r.deck, enemies: ['onix', 'rattata'], seed: 'Z', relics: [], oneHp: true });
  expect(c.enemies.every((e) => e.hp === 1)).toBe(true);
  c.player.statuses.abri = 1;
  const hp = c.player.hp;
  (c as unknown as { dealDamage: (...a: unknown[]) => void }).dealDamage(c.player, 'player', 30, 'normal');
  expect(c.player.hp).toBe(hp);
  expect(c.player.statuses.abri ?? 0).toBe(0);
});
