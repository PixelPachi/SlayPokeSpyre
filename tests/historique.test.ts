// Historique du combat et statistiques de la run.
import { expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';

it('l’historique note les cartes jouées, les dégâts et les tours ; les statistiques comptent les dégâts par carte', () => {
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: 'griffe', upgraded: false }));
  const c = new Combat({ character: 'caninos', deck, enemies: ['rattata'], seed: 'LOG', relics: [] } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999;
  c.play(c.hand[0].uid, c.enemies[0].uid);
  c.drainEvents();
  c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); c.endEnemyTurn();
  c.drainEvents();
  const kinds = c.log.map((l) => l.entry.type);
  expect(kinds).toContain('turn');
  expect(kinds).toContain('play');
  expect(kinds).toContain('damage');
  expect(kinds).toContain('enemy-move');
  const g = Object.entries(c.stats.cards).find(([k]) => k.startsWith('Griffe'))![1];
  expect(g.n).toBe(1);
  expect(g.dmg).toBeGreaterThan(0);
  expect(c.stats.dealt).toBe(g.dmg);
  const run = new Run('LOG', 'caninos');
  run.addFightStats(c.stats, c.turn);
  run.addFightStats(c.stats, c.turn);
  expect(run.fightStats.fights).toBe(2);
  expect(run.fightStats.dealt).toBe(2 * c.stats.dealt);
});

it('Repaire Rocket : Jackpot du Persian inflige 3 dégâts par tranche de 10 ₽, Pression renforce Mewtwo à la 3e carte', async () => {
  const { ZONES } = await import('../src/data/zones');
  const z = ZONES.find((x) => x.id === 'repaire-rocket')!;
  expect(z.act).toBe(3);
  expect(z.boss).toBe('mewtwo');
  const deck = Array.from({ length: 8 }, (_, i) => ({ uid: i + 1, defId: 'griffe', upgraded: false }));
  const c = new Combat({ character: 'caninos', deck, enemies: ['persian-rocket'], seed: 'JP', relics: [], money: 120 } as never);
  const e = c.enemies[0];
  const { ENEMY_DEFS } = await import('../src/data/enemies');
  const jp = ENEMY_DEFS[e.defId].moves.find((m) => m.id === 'jackpot-persian')!;
  expect(c.moveBonus(e, jp)).toBe(36);
  const m = new Combat({ character: 'caninos', deck, enemies: ['mewtwo'], seed: 'MT', relics: [] } as never);
  m.player.energy = 10;
  const mw = m.enemies[0];
  const atk0 = mw.statuses.attaque ?? 0; // (Intimidation de Caninos : −1 au départ)
  for (let i = 0; i < 3; i++) m.play(m.hand[0].uid, mw.uid);
  expect((mw.statuses.attaque ?? 0) - atk0).toBe(1);
});

it('Ruines Alpha : les 28 formes de Zarbi n’ont que Puissance Cachée, d’un type tiré au hasard', async () => {
  const { ENEMY_DEFS } = await import('../src/data/enemies');
  const forms = Object.values(ENEMY_DEFS).filter((d) => d.id.startsWith('zarbi-'));
  expect(forms).toHaveLength(28);
  for (const f of forms) expect(f.moves.map((m) => m.id)).toEqual(['puissance-cachee']);
  const types = new Set<string>();
  for (let i = 0; i < 12; i++) {
    const c = new Combat({ character: 'riolu', deck: [{ uid: 1, defId: 'ruse', upgraded: false }], enemies: ['zarbi-a', 'zarbi-question'], seed: `Z${i}`, relics: [] } as never);
    for (const e of c.enemies) { expect(e.intent.damage).toBe(8); types.add(e.intent.pokeType!); }
  }
  expect(types.size).toBeGreaterThan(5);
});

it('Détonation Arcanine : Brûlure égale à l’Élan, puis la détonation consomme la Brûlure (×2 dégâts)', () => {
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: 'can-detonation-arcanine', upgraded: false }));
  const c = new Combat({ character: 'caninos', deck, enemies: ['rattata'], seed: 'DA', relics: [] } as never);
  const e = c.enemies[0]; e.hp = e.maxHp = 999; e.statuses = { brulure: 1 }; e.block = 0;
  c.player.statuses.elan = 5; c.player.energy = 5;
  c.play(c.hand[0].uid, e.uid);
  expect(e.statuses.brulure ?? 0).toBe(0);
  expect(999 - e.hp).toBeGreaterThanOrEqual(12);
});

it('Cœur d’Aura : l’Aura consommée ne retombe qu’à moitié (30 → 15)', () => {
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: i === 0 ? 'coeur-d-aura' : 'ruse', upgraded: false }));
  const c = new Combat({ character: 'riolu', deck, enemies: ['rattata'], seed: 'CA', relics: [] } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999; c.player.energy = 10;
  c.play(c.hand.find((x) => x.defId === 'coeur-d-aura')!.uid);
  c.player.aura = 30;
  c.play(c.hand.find((x) => x.defId === 'ruse')!.uid, c.enemies[0].uid);
  expect(c.player.aura).toBe(15);
});

it('objets d’archétype débloqués par niveau pour chaque Pokémon', async () => {
  const { unlockedRelics } = await import('../src/data/unlocks');
  for (const ch of ['vipelierre', 'kangourex', 'caninos', 'mew', 'quelorior', 'duo'] as const) {
    expect(unlockedRelics(ch, 1)).toHaveLength(0);
    expect(unlockedRelics(ch, 9).length).toBeGreaterThanOrEqual(3);
  }
  const run = new Run('REL', 'caninos', undefined, unlockedRelics('caninos', 9));
  expect(run.relicPool()).toContain('croc-rasoir');
  expect(new Run('REL', 'caninos').relicPool()).not.toContain('croc-rasoir');
  // Roche Chaude : +1 Brûlure ; Croc Rasoir : Peur avec la Brûlure
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: 'can-detonation-arcanine', upgraded: false }));
  const c = new Combat({ character: 'caninos', deck, enemies: ['rattata'], seed: 'RC', relics: ['roche-chaude', 'croc-rasoir'] } as never);
  const e = c.enemies[0]; e.hp = e.maxHp = 999; e.block = 0; e.statuses = {};
  c.player.statuses.elan = 4; c.player.energy = 5;
  c.play(c.hand[0].uid, e.uid);
  expect(999 - e.hp).toBeGreaterThanOrEqual(10); // (4 + 1) Brûlure × 2
  expect(e.statuses.peur ?? 0).toBeGreaterThan(0); // Croc Rasoir : la Brûlure inflige aussi Peur
});

it('Graine Herbe propage la Vampigraine à tous les ennemis, Piquants donne 2 Épine', () => {
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: 'vampigraine', upgraded: false }));
  const c = new Combat({ character: 'vipelierre', deck, enemies: ['rattata', 'rattata', 'rattata'], seed: 'GH', relics: ['graine-herbe', 'piquants'] } as never);
  c.player.energy = 5;
  const card = c.hand.find((x) => c.def(x).effects.some((e) => e.kind === 'statut' && (e as { status: string }).status === 'vampigraine'));
  if (!card) return;
  c.play(card.uid, c.enemies[0].uid);
  for (const e of c.enemies) expect(e.statuses.vampigraine ?? 0).toBeGreaterThan(0);
  expect(c.player.statuses.epine ?? 0).toBeGreaterThanOrEqual(2);
});

it('Îles Écume : Artikodin (Glaciation) installe la Grêle, qui revient tant qu’il est en vie', async () => {
  const { ZONES } = await import('../src/data/zones');
  expect(ZONES.find((z) => z.id === 'iles-ecume')?.boss).toBe('artikodin');
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: 'griffe', upgraded: false }));
  const c = new Combat({ character: 'caninos', deck, enemies: ['artikodin'], seed: 'AK', relics: [] } as never);
  expect(c.weather?.id).toBe('grele');
  for (let t = 0; t < 7; t++) { c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); c.endEnemyTurn(); if (c.phase !== 'joueur') break; }
  if (c.phase === 'joueur') expect(c.weather?.id).toBe('grele');
});

it('Don Ancestral : choisir un type crée des cartes de ce type, gratuites ce tour (2 si améliorée)', () => {
  const deck = Array.from({ length: 6 }, (_, i) => ({ uid: i + 1, defId: 'mew-don-ancestral', upgraded: true }));
  const c = new Combat({ character: 'mew', deck, enemies: ['rattata'], seed: 'DA2', relics: [] } as never);
  c.player.energy = 3;
  const n = c.hand.length;
  c.play(c.hand[0].uid);
  expect(c.pendingType?.count).toBe(2);
  expect(c.canPlay(c.hand[0])).toBe(false);
  c.chooseType('feu');
  const added = c.hand.slice(n - 1);
  expect(added).toHaveLength(2);
  for (const x of added) { expect(c.def(x).pokeType).toBe('feu'); expect(c.costOf(x)).toBe(0); }
});
