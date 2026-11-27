// Vérification large de toutes les mécaniques : chaque carte jouée (normale, améliorée, enchantée),
// chaque ennemi affronté, chaque baie mangée, chaque événement résolu, et des runs complètes simulées.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { Run } from '../src/core/run';
import type { CharacterId } from '../src/core/model';
import { CARD_DEFS, ENCHANTS, cardDef, enchantId, fusionId, canFuse } from '../src/data/cards';
const CARDS = Object.values(CARD_DEFS);
import { ENEMY_DEFS } from '../src/data/enemies';
import { BERRIES } from '../src/data/berries';
import { EVENTS } from '../src/data/events';
import { TAROT_EVENTS } from '../src/data/events-tarot';
import { CHARACTERS } from '../src/data/characters';
import { SKINS, skinDef } from '../src/data/skins';
import { RELIC_DEFS } from '../src/data/relics';
const RELICS = Object.values(RELIC_DEFS);
import { ZONES } from '../src/data/zones';

const CHARS: CharacterId[] = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew', 'duo'];

function sane(c: Combat, where: string): void {
  const all = [c.player, ...c.enemies];
  for (const f of all) {
    expect(Number.isFinite(f.hp), `${where} : PV non numériques (${f.name})`).toBe(true);
    expect(Number.isFinite(f.block), `${where} : protection non numérique (${f.name})`).toBe(true);
    expect(f.hp <= f.maxHp + 0.001, `${where} : PV > PV max (${f.name} ${f.hp}/${f.maxHp})`).toBe(true);
    for (const [k, v] of Object.entries(f.statuses ?? {})) expect(Number.isFinite(v as number), `${where} : statut ${k} = ${v}`).toBe(true);
  }
  expect(Number.isFinite(c.player.energy), `${where} : énergie = ${c.player.energy}`).toBe(true);
}

/** Termine le tour : ennemis puis nouveau tour du joueur. */
function cycle(c: Combat): void {
  if (c.phase !== 'joueur') return;
  c.endPlayerTurn();
  for (const e of c.aliveEnemies()) { if ((c.phase as string) !== 'ennemi') break; c.enemyAct(e.uid); }
  if ((c.phase as string) === 'ennemi') c.endEnemyTurn();
  c.drainEvents();
}

function bot(c: Combat, maxTurns = 40): void {
  for (let t = 0; t < maxTurns && c.phase === 'joueur'; t++) {
    for (let k = 0; k < 15 && c.phase === 'joueur'; k++) {
      if (c.pendingChoice) { c.chooseCard(c.pendingChoice.ids[0]); c.drainEvents(); continue; }
      const card = c.hand.find((x) => c.canPlay(x));
      if (!card) break;
      const target = c.aliveEnemies()[0];
      if (!c.play(card.uid, c.needsTarget(card) ? target?.uid : undefined)) break;
      c.drainEvents();
      sane(c, `bot ${c.def(card).id}`);
    }
    cycle(c);
    let guard = 0;
    while (c.skipTurn && c.phase === 'joueur' && guard++ < 10) cycle(c);
  }
}

export const STATS = { played: 0, skipped: [] as string[] };
function playOne(character: CharacterId, defId: string, upgraded: boolean, enemies = ['rattata', 'roucool']): void {
  const deck = makeDeck([...CHARACTERS[character].starterDeck]);
  const c = new Combat({ character, deck, enemies, seed: `SMOKE-${defId}`, act: 2, form: undefined, relics: [] });
  c.drainEvents();
  const card = { uid: 9999, defId, upgraded };
  c.hand.push(card);
  c.player.energy = 99;
  const d = c.def(card);
  if (!c.canPlay(card)) {
    // cartes conditionnelles (sommeil, injouables…) : on vérifie seulement que la définition est cohérente
    expect(d.name, defId).toBeTruthy();
    if (d.requires?.asleep) { c.player.statuses.sommeil = 3; if (!c.canPlay(card)) { STATS.skipped.push(defId); return; } } else { STATS.skipped.push(defId); return; }
  }
  const target = c.aliveEnemies()[0];
  expect(c.play(card.uid, c.needsTarget(card) ? target.uid : undefined), `${defId} refusée`).toBe(true);
  STATS.played++;
  c.drainEvents();
  if (c.pendingChoice) { c.chooseCard(c.pendingChoice.ids[0]); c.drainEvents(); }
  sane(c, `carte ${defId}${upgraded ? '+' : ''}`);
  for (let i = 0; i < 3; i++) { cycle(c); sane(c, `carte ${defId} tour ${i}`); }
}

describe('toutes les cartes', () => {
  it('chaque carte se joue sans erreur (normale et améliorée)', () => {
    for (const d of CARDS) {
      const ch: CharacterId = d.character === 'normal' ? 'riolu' : (d.character as CharacterId);
      for (const up of [false, true]) {
        try { playOne(ch, d.id, up); } catch (e) { throw new Error(`Carte ${d.id}${up ? '+' : ''} : ${(e as Error).message}`); }
      }
    }
  });
  it('chaque enchantement s’applique et se joue', () => {
    let n = 0;
    for (const k of Object.keys(ENCHANTS)) {
      for (const d of CARDS.filter((x) => ENCHANTS[k].ok(x)).slice(0, 6)) {
        const id = enchantId(k, d.id);
        const def = cardDef(id);
        expect(def.name, id).toBeTruthy();
        const ch: CharacterId = d.character === 'normal' ? 'riolu' : (d.character as CharacterId);
        try { playOne(ch, id, false); } catch (e) { throw new Error(`Enchantement ${id} : ${(e as Error).message}`); }
        n++;
      }
    }
    expect(n).toBeGreaterThan(20);
  });
  it('les fusions de la Pension se jouent', () => {
    const pool = CARDS.filter((d) => d.character === 'riolu');
    let n = 0;
    for (let i = 0; i < pool.length && n < 30; i++) for (let j = i + 1; j < pool.length && n < 30; j += 7) {
      if (!canFuse(pool[i], pool[j])) continue;
      const id = fusionId(pool[i].id, false, pool[j].id, true);
      try { playOne('riolu', id, false); } catch (e) { throw new Error(`Fusion ${id} : ${(e as Error).message}`); }
      n++;
    }
    expect(n).toBeGreaterThan(5);
  });
  it('les coûts sont cohérents (jamais négatifs)', () => {
    for (const d of CARDS) for (const up of [false, true]) {
      const def = cardDef(d.id, up);
      expect(def.cost === undefined || def.cost >= -1, `${d.id} coût ${def.cost}`).toBe(true);
    }
  });
});

describe('tous les ennemis', () => {
  it('chaque ennemi (dont gardiens et Dialga) combat sans erreur contre chaque personnage', () => {
    for (const id of Object.keys(ENEMY_DEFS)) {
      for (const ch of CHARS) {
        const run = new Run(`E-${id}-${ch}`, ch);
        for (let i = 0; i < 6; i++) run.addCard(run.cardChoices('combat', 1)[0]);
        const c = new Combat({ character: ch, deck: run.deck, enemies: [id], seed: `E${id}${ch}`, hp: run.maxHp, maxHp: run.maxHp, relics: run.relics, form: run.form, act: 2, familiarBonus: 3, boss: /gardien|dialga/.test(id) });
        c.drainEvents();
        try { bot(c, 25); } catch (e) { throw new Error(`Ennemi ${id} vs ${ch} : ${(e as Error).message}`); }
        sane(c, `ennemi ${id} vs ${ch}`);
      }
    }
  });
});

describe('baies, objets et skins', () => {
  it('chaque baie se mange en combat', () => {
    for (const b of BERRIES) {
      const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: `B${b.id}`, relics: [] });
      c.drainEvents();
      c.player.hp = 20; c.player.statuses.poison = 3; c.player.statuses.brulure = 2;
      try { c.useBerry(b.name, b.fx); } catch (e) { throw new Error(`Baie ${b.id} : ${(e as Error).message}`); }
      c.drainEvents(); sane(c, `baie ${b.id}`);
      cycle(c); sane(c, `baie ${b.id} après tour`);
    }
  });
  it('chaque objet tenu fonctionne pendant un combat complet', () => {
    for (const r of RELICS) {
      const ch: CharacterId = (CHARS.find((c) => (r as { owner?: string }).owner === c) ?? 'riolu');
      const c = new Combat({ character: ch, deck: makeDeck(CHARACTERS[ch].starterDeck), enemies: ['rattata', 'chenipan'], seed: `R${r.id}`, relics: [r.id], act: 1 });
      c.drainEvents();
      try { bot(c, 20); } catch (e) { throw new Error(`Objet ${r.id} : ${(e as Error).message}`); }
      sane(c, `objet ${r.id}`);
    }
  });
  it('chaque skin a ses sprites et les évolutions de skin sont appliquées', () => {
    for (const ch of CHARS) for (const k of SKINS[ch] ?? []) {
      const run = new Run('SK', ch);
      run.applySkin(k.id, skinDef(ch, k.id));
      for (let a = 1; a <= 3; a++) { expect(run.form.dex, `${ch}/${k.id} acte ${a}`).toBeGreaterThan(0); if (run.act < 3) run.nextAct(); }
    }
    const run = new Run('LAN', 'caninos');
    run.applySkin('lanterne', skinDef('caninos', 'lanterne'));
    run.nextAct(); expect(run.form.name).toBe('Arcanin');
    run.nextAct(); expect(run.form.name).toBe('Arcanâme');
    expect(run.form.types).toContain('spectre');
  });
});

describe('événements', () => {
  it('chaque choix de chaque événement (y compris tarot inversé) se résout', () => {
    const all = [...EVENTS, ...TAROT_EVENTS];
    for (const ev of all) {
      const sets = [ev.choices, ...(ev.reversed ? [ev.reversed.choices] : [])];
      for (const choices of sets) choices.forEach((ch, i) => {
        for (const c of CHARS) {
          const run = new Run(`EV-${ev.id}-${i}-${c}`, c);
          run.money = 500;
          if (ch.available && !ch.available(run)) continue;
          let r: unknown;
          try { r = ch.apply(run); } catch (e) { throw new Error(`Événement ${ev.id} choix ${i} (${c}) : ${(e as Error).message}`); }
          expect(r, `${ev.id} choix ${i}`).toBeTruthy();
          if (typeof r === 'object' && r && 'fight' in r) expect(ENEMY_DEFS[(r as { fight: string }).fight], `${ev.id} : duel inconnu`).toBeTruthy();
          expect(Number.isFinite(run.hp) && run.hp <= run.maxHp, `${ev.id} choix ${i} PV ${run.hp}/${run.maxHp}`).toBe(true);
          expect(run.money >= 0, `${ev.id} argent négatif`).toBe(true);
        }
      });
    }
  });
});

describe('runs complètes', () => {
  it('runs simulées de bout en bout pour chaque personnage (carte, nœuds, actes, évolutions)', () => {
    for (const ch of CHARS) for (let s = 0; s < 4; s++) {
      const run = new Run(`RUN${s}${ch}`, ch); run.welcomeDone = true;
      let steps = 0;
      while (run.act <= 3 && steps++ < 200) {
        const av = run.available();
        if (av === 'boss') { run.nextAct(); continue; }
        const node = av[s % av.length];
        run.moveTo(node.row, node.col);
        if (node.type === 'evenement') run.rollMystery();
        if (node.type === 'combat' || node.type === 'elite') {
          const ids = run.encounter(node.type);
          for (const id of ids) expect(ENEMY_DEFS[id], `ennemi inconnu ${id} (${run.zone.id})`).toBeTruthy();
          run.addCard(run.cardChoices(node.type)[0]);
          run.money += run.moneyReward(node.type, 0);
        }
        if (node.type === 'coffre') run.addRelic(run.rollRelics(1)[0]);
        if (node.type === 'centre') { run.heal(20); if (run.deck[0]) run.upgradeCard(run.deck[0].uid); }
        if (node.type === 'pension') { const d = run.deck.slice(0, 2); if (d.length === 2) run.enchantCard(d[0].uid); }
        if (run.berries.length < 3) run.addBerry(run.rollBerry());
        expect(run.zone.boss && ENEMY_DEFS[run.zone.boss], `gardien de ${run.zone.id}`).toBeTruthy();
      }
      expect(run.act, `${ch} seed ${s} n'a pas fini les 3 actes`).toBeGreaterThanOrEqual(3);
      expect(run.form.dex).toBeGreaterThan(0);
    }
  });
  it('chaque zone a des rencontres valides', () => {
    for (const z of ZONES) {
      for (const g of [...z.encounters, ...z.elites, [z.boss]]) for (const id of g) expect(ENEMY_DEFS[id], `${z.id} : ${id}`).toBeTruthy();
    }
  });
});
