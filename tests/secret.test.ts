// Acte secret : Salle Originelle (8 étages) et Arceus qui copie le deck du joueur.
import { expect, it } from 'vitest';
import { Run, SECRET_ROWS } from '../src/core/run';
import { Combat } from '../src/core/combat';

it('l’acte 5 est la Salle Originelle, avec une carte plus courte', () => {
  const run = new Run('S', 'riolu');
  while (run.act < 5) run.nextAct();
  expect(run.zone.id).toBe('salle-originelle');
  expect(run.map.length).toBe(SECRET_ROWS);
  const last = run.map[SECRET_ROWS - 1][0];
  run.moveTo(last.row, last.col);
  expect(run.available()).toBe('boss');
  run.relics.push('rouage-temps');
  expect(run.hasCogs).toBe(false);
  run.relics.push('rouage-espace');
  expect(run.hasCogs).toBe(true);
  expect(run.relicPool()).not.toContain('rouage-temps');
});

it('Arceus joue deux de tes cartes par tour (mêmes effets), et Jugement tous les 4 tours', () => {
  const run = new Run('A', 'caninos');
  const c = new Combat({ character: 'caninos', deck: run.deck, enemies: ['arceus'], seed: 'ARC', hp: 200, maxHp: 200, relics: [], act: 5, boss: true });
  c.drainEvents();
  const names: string[] = [];
  for (let t = 0; t < 8 && c.phase === 'joueur'; t++) {
    names.push(c.enemies[0].intent.name);
    const ex = c.enemies[0].extraIntents ?? [];
    if (c.enemies[0].intent.mirrorOf) expect(ex).toHaveLength(1);
    const used = (ex[ex.length - 1] ?? c.enemies[0].intent).pokeType;
    c.endPlayerTurn();
    for (const e of c.aliveEnemies()) c.enemyAct(e.uid);
    if (used) { expect(c.enemies[0].types).toEqual([used]); if (used !== 'normal') expect(c.enemies[0].form).toBe(used); }
    if ((c.phase as string) === 'ennemi') c.endEnemyTurn();
    c.drainEvents();
    c.player.hp = 200;
    continue;
    for (const e of c.aliveEnemies()) c.enemyAct(e.uid);
    if ((c.phase as string) === 'ennemi') c.endEnemyTurn();
    c.drainEvents();
    c.player.hp = 200;
  }
  expect(names.length).toBeGreaterThan(0);
  expect(names).toContain('Jugement');
});

it('Arceus : la copie a exactement les valeurs de ta carte, améliorée ou non', () => {
  const deck = [{ uid: 1, defId: 'griffe', upgraded: true }];
  const c = new Combat({ character: 'caninos', deck, enemies: ['arceus'], seed: 'ARC2', hp: 200, maxHp: 200, relics: [], act: 5, boss: true });
  const m = (c as unknown as { cardAsMove: (x: unknown) => { damage: number; mirrorUp: boolean } }).cardAsMove(deck[0]);
  const up = (c as unknown as { def: (x: unknown) => { effects: { kind: string; amount: number }[] } }).def(deck[0]);
  expect(m.damage).toBe(up.effects.find((e) => e.kind === 'degats')!.amount);
  expect(m.mirrorUp).toBe(true);
});
