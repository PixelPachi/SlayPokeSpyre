import { it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';
import { ZONES } from '../src/data/zones';
import type { CharacterId } from '../src/core/model';

function bot(c: Combat): void {
  for (let turn = 0; turn < 40 && (c.phase === 'joueur'); turn++) {
    for (let k = 0; k < 15 && c.phase === 'joueur'; k++) {
      const incoming = c.aliveEnemies().reduce((s, e) => s + (c.previewIntentDamage(e) ?? 0), 0);
      const playable = c.hand.filter((x) => c.canPlay(x));
      if (!playable.length) break;
      const needBlock = incoming > c.player.block;
      const score = (card: typeof playable[0]) => {
        const d = c.def(card);
        const dmg = c.previewCardDamage(card) ?? 0;
        const blk = d.effects.filter((e) => e.kind === 'protection').reduce((s, e) => s + (e as { amount: number }).amount, 0);
        let v = dmg + (needBlock ? Math.min(blk, incoming - c.player.block) * 1.2 : blk * 0.2);
        if (d.category === 'talent') v += 8;
        if (!dmg && !blk) v += 3;
        return v / Math.max(1, c.costOf(card) || 0.7);
      };
      playable.sort((a, b) => score(b) - score(a));
      const card = playable[0];
      const target = c.aliveEnemies().sort((a, b) => a.hp - b.hp)[0];
      const ok = c.play(card.uid, c.needsTarget(card) ? target?.uid : undefined);
      c.drainEvents();
      if (!ok) break;
    }
    if (c.phase !== 'joueur') break;
    c.endPlayerTurn();
    for (const e of c.aliveEnemies()) { if ((c.phase as string) !== 'ennemi') break; c.enemyAct(e.uid); }
    if ((c.phase as string) === 'ennemi') c.endEnemyTurn();
    c.drainEvents();
    while (c.skipTurn && c.phase === 'joueur') { c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); if ((c.phase as string) === 'ennemi') c.endEnemyTurn(); }
  }
}

it('équilibrage', () => {
  const chars: CharacterId[] = ['riolu', 'caninos', 'vipelierre', 'kangourex'];
  const rows: string[] = [];
  const per: Record<string, { lost: number[]; wins: number; n: number; turns: number[] }> = {};
  for (const act of [1, 2, 3]) {
    for (const z of ZONES.filter((x) => x.act === act)) {
      const groups: [string, string[]][] = [
        ...z.encounters.map((g) => ['combat', g] as [string, string[]]),
        ...z.elites.map((g) => ['elite', g] as [string, string[]]),
        ['boss', [z.boss]],
      ];
      for (const [kind, g] of groups) {
        const key = `${act} ${z.id} ${kind} ${g.join('+')}`;
        per[key] = { lost: [], wins: 0, n: 0, turns: [] };
        for (const ch of chars) for (let s = 0; s < 6; s++) {
          const run = new Run(`S${s}${ch}`, ch);
          while (run.act < act) run.nextAct();
          const extra = 3 + (act - 1) * 5;
          for (let i = 0; i < extra; i++) run.addCard(run.cardChoices('combat', 1)[0]);
          for (const card of run.deck.slice(0, (act - 1) * 3)) run.upgradeCard(card.uid);
          const hp = run.maxHp;
          const c = new Combat({ character: ch, deck: run.deck, enemies: g, seed: `${key}${s}${ch}`, hp, maxHp: run.maxHp, relics: run.relics, form: run.form, act, familiarBonus: (act - 1) * 3, boss: kind === 'boss' });
          c.drainEvents();
          bot(c);
          const r = per[key];
          r.n++; if (c.phase === 'victoire') r.wins++;
          r.lost.push(hp - Math.max(0, c.player.hp)); r.turns.push(c.turn);
        }
      }
    }
  }
  for (const [k, r] of Object.entries(per)) {
    const avg = (a: number[]) => (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1);
    rows.push(`${k.padEnd(62)} win ${(100 * r.wins / r.n).toFixed(0).padStart(3)}%  perte ${avg(r.lost).padStart(5)}  tours ${avg(r.turns)}`);
  }
  console.log(rows.join('\n'));
}, 300000);
