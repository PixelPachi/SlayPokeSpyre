import { CARD_DEFS as CARD_DEFS_ALL } from '../src/data/cards';
import { describe, expect, it } from 'vitest';
import { Combat, computeDamage, makeDeck, type Fighter } from '../src/core/combat';
import { typeMultiplier } from '../src/core/types';
import { CHARACTERS } from '../src/data/characters';

const fighter = (types: Fighter['types'], statuses: Fighter['statuses'] = {}): Fighter => ({
  name: 'test', dex: 1, types, hp: 50, maxHp: 50, block: 0, statuses,
});

describe('table des types', () => {
  it('applique super efficace, résistance, immunité réduite et double faiblesse', () => {
    expect(typeMultiplier('feu', ['plante'])).toBe(1.5);
    expect(typeMultiplier('feu', ['eau'])).toBe(0.5);
    expect(typeMultiplier('normal', ['spectre'])).toBe(0.5);
    expect(typeMultiplier('combat', ['spectre', 'poison'])).toBe(0.5); // immunité + résistance : jamais moins de la moitié
    expect(typeMultiplier('glace', ['sol', 'vol'])).toBe(2.25);
    expect(typeMultiplier('combat', ['insecte', 'poison'])).toBe(0.25);
  });
});

describe('calcul des dégâts', () => {
  it('suit l’ordre : base + Attaque, bonus de type, types, statuts, arrondi', () => {
    // 6 + 1 Attaque = 7, ×1,25 (Combat sur Combat) = 8,75, ×1,5 (contre Normal) = 13,125
    const r = computeDamage(6, fighter(['combat'], { attaque: 1 }), fighter(['normal']), 'combat');
    expect(r.amount).toBe(13);
    expect(r.effectiveness).toBe('super');
  });
  it('Paralysie de l’attaquant et Peur du défenseur', () => {
    const r = computeDamage(10, fighter(['normal'], { paralysie: 1 }), fighter(['eau'], { peur: 1 }), 'feu');
    // 10 ×0,5 ×0,75 ×1,5 = 5,625
    expect(r.amount).toBe(5);
    expect(r.effectiveness).toBe('faible');
  });
});

describe('combat', () => {
  const start = (enemies = ['rattata'], seed = 'TEST') =>
    new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies, seed });

  it('démarre avec 5 cartes, 3 PA et l’Aura de Justicier', () => {
    const c = start();
    expect(c.hand).toHaveLength(5);
    expect(c.drawPile).toHaveLength(5);
    expect(c.player.energy).toBe(3);
    expect(c.player.aura).toBe(3);
  });

  it('consomme l’Aura sur la prochaine attaque', () => {
    const c = start();
    // Forcer une main connue
    c.hand = makeDeck(['poing-karate', 'abri']).map((x, i) => ({ ...x, uid: 100 + i }));
    const rat = c.enemies[0];
    rat.hp = rat.maxHp = 99;
    c.play(100, rat.uid);
    // (8 + 3 Aura) ×1,25 ×1,5 = 20,6
    expect(rat.hp).toBe(99 - 20);
    expect(c.player.aura).toBe(0);
  });

  it('Aurasphère inflige Aura × 2 dégâts', () => {
    const c = start();
    c.player.aura = 10;
    c.hand = makeDeck(['aurasphere']).map((x) => ({ ...x, uid: 300 }));
    const rat = c.enemies[0];
    rat.hp = rat.maxHp = 99;
    expect(c.previewCardDamage(c.hand[0], rat.uid)).toBe(37);
    c.play(300, rat.uid);
    // 10 × 2 = 20, ×1,25 ×1,5 = 37,5
    expect(rat.hp).toBe(99 - 37);
    expect(c.player.aura).toBe(0);
    expect(c.player.energy).toBe(0);
  });

  it('les PV perdus donnent de l’Aura, pas les dégâts bloqués', () => {
    const c = start();
    c.player.aura = 0;
    c.hand = makeDeck(['abri']).map((x) => ({ ...x, uid: 200 }));
    c.play(200); // 5 Protection
    c.endPlayerTurn();
    const rat = c.enemies[0];
    rat.intent = { id: 'test', name: 'Test', weight: 1, intent: 'attaque', pokeType: 'normal', damage: 8 };
    c.enemyAct(rat.uid);
    // 8 ×1,25 (Rattata est Normal) = 10, dont 5 bloqués
    expect(c.player.hp).toBe(75 - 5);
    expect(c.player.aura).toBe(5);
  });

  it('remélange la défausse quand la pioche est vide', () => {
    const c = start();
    c.endPlayerTurn();
    for (const e of c.aliveEnemies()) c.enemyAct(e.uid);
    c.endEnemyTurn();
    expect(c.hand).toHaveLength(5);
    expect(c.drawPile).toHaveLength(0);
    c.endPlayerTurn();
    for (const e of c.aliveEnemies()) c.enemyAct(e.uid);
    c.endEnemyTurn();
    expect(c.hand).toHaveLength(5);
    expect(c.drawPile.length + c.discardPile.length).toBe(5);
  });

  it('un ennemi ne répète jamais la même action 3 fois de suite', () => {
    const c = start(['chenipan'], 'REPEAT');
    const e = c.enemies[0];
    e.hp = e.maxHp = 9999;
    c.player.hp = c.player.maxHp = 9999;
    for (let t = 0; t < 200; t++) {
      c.endPlayerTurn();
      c.enemyAct(e.uid);
      c.endEnemyTurn();
    }
    const h = e.history;
    for (let i = 2; i < h.length; i++) expect(h[i] === h[i - 1] && h[i] === h[i - 2]).toBe(false);
  });

  it('victoire quand tous les ennemis sont K.O.', () => {
    const c = start();
    c.enemies[0].hp = 1;
    const attack = c.hand.find((x) => ['ruse', 'poing-karate'].includes(x.defId));
    if (!attack) return; // main sans attaque avec cette graine
    c.play(attack.uid);
    expect(c.phase).toBe('victoire');
  });
});

describe('carte de l’acte', async () => {
  const { generateMap, Run, MAP_ROWS } = await import('../src/core/run');
  const { Rng } = await import('../src/core/rng');

  it('respecte les règles de génération sur 50 cartes', () => {
    for (let s = 0; s < 50; s++) {
      const map = generateMap(new Rng(`MAP${s}`));
      expect(map).toHaveLength(MAP_ROWS);
      expect(new Set(map[0].map((n) => n.col)).size).toBeGreaterThanOrEqual(2);
      for (const row of map) {
        for (const n of row) {
          if (n.row === 0) expect(n.type).toBe('combat');
          if (n.row === 8) expect(n.type).toBe('tresor');
          if (n.row === MAP_ROWS - 1) expect(n.type).toBe('centre');
          if (n.row < 5) expect(['elite', 'centre']).not.toContain(n.type);
          if (n.row < MAP_ROWS - 1) {
            expect(n.next.length).toBeGreaterThan(0);
            for (const c of n.next) {
              const child = map[n.row + 1].find((x) => x.col === c);
              expect(child).toBeDefined();
              if (['centre', 'boutique', 'elite'].includes(n.type) && n.row + 1 < MAP_ROWS - 1) expect(child!.type).not.toBe(n.type);
            }
          }
          // chaque nœud (sauf l'étage 1) a un parent
          if (n.row > 0) expect(map[n.row - 1].some((p) => p.next.includes(n.col))).toBe(true);
        }
        // aucun chemin ne se croise
        for (const a of row) for (const b of row) for (const x of a.next) for (const y of b.next) {
          if (a.col < b.col) expect(x <= y).toBe(true);
        }
      }
    }
  });

  it('propose 3 cartes différentes en récompense', () => {
    const run = new Run('REWARD', 'riolu');
    for (let i = 0; i < 20; i++) {
      const c = run.cardChoices('combat');
      expect(new Set(c).size).toBe(3);
    }
  });
});

describe('cartes de Riolu et déblocages', async () => {
  const { CARD_DEFS, rewardPool } = await import('../src/data/cards');
  const { UNLOCKS, levelFor, unlockedCards, LEVEL_EXP } = await import('../src/data/unlocks');

  it('chaque carte de récompense se débloque à exactement un niveau', () => {
    const table = UNLOCKS.riolu!;
    const all = Object.values(table).flat();
    for (const id of all) expect(CARD_DEFS[id], id).toBeDefined();
    expect(new Set(all).size).toBe(all.length);
    const pool = rewardPool('riolu').map((c) => c.id).sort();
    expect([...all].sort()).toEqual(pool);
  });

  it('les niveaux suivent l’EXP', () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(LEVEL_EXP[1])).toBe(2);
    expect(levelFor(999999)).toBe(LEVEL_EXP.length);
    expect(unlockedCards('riolu', 1).length).toBeLessThan(unlockedCards('riolu', 3).length);
  });

  it('le niveau 1 propose des cartes de chaque rareté', () => {
    const l1 = unlockedCards('riolu', 1).map((id) => CARD_DEFS[id].rarity);
    expect(l1).toContain('commune');
    expect(l1).toContain('peu-commune');
    expect(l1).toContain('rare');
  });
});

describe('effets d’Aura', () => {
  const setup = () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'AURA' });
    const rat = c.enemies[0];
    rat.hp = rat.maxHp = 500;
    c.player.energy = 10;
    return { c, rat };
  };
  const hand = (c: Combat, ids: string[]) => { c.hand = makeDeck(ids).map((x, i) => ({ ...x, uid: 900 + i })); };

  it('Prévention convertit l’Aura en Protection', () => {
    const { c } = setup();
    c.player.aura = 12;
    hand(c, ['prevention']);
    c.play(900);
    expect(c.player.block).toBe(12);
    expect(c.player.aura).toBe(0);
  });

  it('Vibrobscur frappe avec l’Aura sans la consommer', () => {
    const { c, rat } = setup();
    c.player.aura = 10;
    hand(c, ['vibrobscur']);
    c.play(900, rat.uid);
    // Ténèbres contre Normal ×1, pas de bonus de type : 10
    expect(rat.hp).toBe(490);
    expect(c.player.aura).toBe(10);
  });

  it('Éclate-Roc frappe (en consommant l’Aura) puis rend la cible vulnérable (Peur)', () => {
    const { c, rat } = setup();
    c.player.aura = 4;
    hand(c, ['eclate-roc']);
    c.play(900, rat.uid);
    // (5 + 4) ×1,25 ×1,5 = 16,875
    expect(rat.hp).toBe(500 - 16);
    expect(c.player.aura).toBe(0);
    expect(rat.statuses.peur).toBe(1);
  });

  it('Lire-Esprit : cartes à 0 PA si le tour commence avec 30 Aura', () => {
    const { c, rat } = setup();
    hand(c, ['lire-esprit']);
    c.play(900);
    c.player.aura = 30;
    rat.intent = { id: 'x', name: 'x', weight: 1, intent: 'defense', block: 1 };
    c.endPlayerTurn();
    c.enemyAct(rat.uid);
    c.endEnemyTurn();
    expect(c.player.freeTurn).toBe(true);
    expect(c.costOf(c.hand[0])).toBe(0);
  });

  it('Tout ou Rien inflige les PV et laisse à 1 PV (avec l’Aura gagnée)', () => {
    const { c, rat } = setup();
    c.player.aura = 0;
    hand(c, ['tout-ou-rien']);
    c.play(900, rat.uid);
    // 74 ×1,25 ×1,5 = 138,75
    expect(rat.hp).toBe(500 - 138);
    expect(c.player.hp).toBe(1);
    expect(c.player.aura).toBe(74);
  });
});

describe('objets tenus', async () => {
  const { allRelics, RELIC_DEFS } = await import('../src/data/relics');
  const { rewardPool } = await import('../src/data/cards');
  const { Run } = await import('../src/core/run');
  const mk = (relics: string[]) => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'REL', relics });
    c.enemies[0].hp = c.enemies[0].maxHp = 500;
    return c;
  };

  it('Riolu a 79 cartes possibles en récompense', () => {
    expect(rewardPool('riolu')).toHaveLength(79);
  });

  it('chaque objet a un sprite et un texte', () => {
    for (const r of allRelics()) {
      expect(r.sprite).toBeTruthy();
      expect(r.text.length).toBeGreaterThan(10);
    }
    expect(RELIC_DEFS[CHARACTERS.riolu.starterRelic!]).toBeDefined();
  });

  it('Ceinture Noire : 1 Aura de plus à chaque perte de PV', () => {
    const c = mk(['ceinture-noire']);
    c.player.aura = 0;
    c.hand = makeDeck(['clonage']).map((x) => ({ ...x, uid: 700 }));
    c.play(700); // perd 6 PV
    expect(c.player.aura).toBe(7);
  });

  it('Ceinture Force : survit une fois à un coup fatal', () => {
    const c = mk(['ceinture-force']);
    c.player.hp = 5;
    c.endPlayerTurn();
    const e = c.enemies[0];
    e.intent = { id: 'x', name: 'x', weight: 1, intent: 'attaque', pokeType: 'normal', damage: 50 };
    c.enemyAct(e.uid);
    expect(c.player.hp).toBe(1);
    expect(c.phase).toBe('ennemi');
  });

  it('Plaque Poing et Bandeau Muscle augmentent les dégâts', () => {
    const c = mk(['plaque-poing', 'bandeau-muscle']);
    c.player.aura = 0;
    c.hand = makeDeck(['poing-karate']).map((x) => ({ ...x, uid: 701 }));
    c.play(701, c.enemies[0].uid);
    // (8 + 2 plaque + 1 attaque) ×1,25 ×1,5 = 20,6
    expect(c.enemies[0].hp).toBe(500 - 20);
  });

  it('Bandeau Choix : une seule attaque par tour', () => {
    const c = mk(['bandeau-choix']);
    c.hand = makeDeck(['ruse', 'ruse']).map((x, i) => ({ ...x, uid: 710 + i }));
    c.play(710, c.enemies[0].uid);
    expect(c.canPlay(c.hand[0])).toBe(false);
  });

  it('la run commence avec l’objet de départ et propose des objets non tenus', () => {
    const run = new Run('RELRUN', 'riolu', undefined, []);
    expect(run.relics).toEqual(['ceinture-noire']);
    const pool = run.relicPool();
    expect(pool).not.toContain('ceinture-noire');
    expect(pool).not.toContain('plaque-poing'); // pas encore débloqué
    expect(pool).toContain('restes');
    const two = run.rollRelics(2);
    expect(new Set(two).size).toBe(2);
  });
});

describe('zones', async () => {
  const { ZONES, zonesOfAct } = await import('../src/data/zones');
  const { ENEMY_DEFS } = await import('../src/data/enemies');
  const { Run } = await import('../src/core/run');

  it('chaque ennemi des zones existe', () => {
    for (const z of ZONES) {
      for (const id of [...z.encounters.flat(), ...z.elites.flat(), z.boss]) expect(ENEMY_DEFS[id], `${z.id}: ${id}`).toBeDefined();
    }
  });

  it('l’acte 1 a 6 zones et la zone change selon la run', () => {
    expect(zonesOfAct(1)).toHaveLength(6);
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) seen.add(new Run(`Z${i}`, 'riolu').zone.id);
    expect(seen.size).toBe(6);
  });

  it('les rencontres viennent de la zone de la run', () => {
    const run = new Run('ZONE-ENC', 'riolu');
    const ids = new Set(run.zone.encounters.flat());
    for (let i = 0; i < 10; i++) for (const e of run.encounter('combat')) expect(ids.has(e)).toBe(true);
    expect(run.encounter('boss')).toEqual([run.zone.boss]);
  });
});

describe('cartes neutres', async () => {
  const { neutralPool, CARD_DEFS } = await import('../src/data/cards');
  const { CHARACTERS } = await import('../src/data/characters');
  const { Run } = await import('../src/core/run');

  it('66 cartes neutres, avec des types qu’aucun personnage n’a et sans doublon de nom', () => {
    const neutral = neutralPool();
    expect(neutral).toHaveLength(66);
    const charTypes = new Set(Object.values(CHARACTERS).flatMap((c) => c.types));
    const otherNames = new Set(Object.values(CARD_DEFS).filter((c) => c.character !== 'normal').map((c) => c.name));
    for (const c of neutral) {
      if (c.id !== 'n-paresse' && !c.requires?.asleep) expect(charTypes.has(c.pokeType), c.name).toBe(false); // les cartes de sommeil gardent leur vrai type
      expect(otherNames.has(c.name), c.name).toBe(false);
    }
    expect(new Set(neutral.map((c) => c.name)).size).toBe(66);
  });

  it('des cartes neutres apparaissent parfois dans les récompenses', () => {
    const run = new Run('NEUTRE', 'riolu');
    let neutrals = 0;
    for (let i = 0; i < 200; i++) neutrals += run.cardChoices('combat').filter((id) => CARD_DEFS[id].character === 'normal').length;
    expect(neutrals).toBeGreaterThan(20);
    expect(neutrals).toBeLessThan(150);
    expect(run.neutralChoices(2).every((id) => CARD_DEFS[id].character === 'normal')).toBe(true);
  });

  it('Châtiment double contre une cible qui a un statut', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'CHAT' });
    const rat = c.enemies[0];
    rat.hp = rat.maxHp = 300;
    c.player.aura = 0;
    c.player.energy = 9;
    c.hand = makeDeck(['n-chatiment', 'n-chatiment']).map((x, i) => ({ ...x, uid: 800 + i }));
    c.play(800, rat.uid); // 9 ×0,5 (Spectre contre Normal) = 4
    expect(rat.hp).toBe(296);
    rat.statuses.poison = 2;
    c.play(801, rat.uid); // 18 ×0,5 = 9
    expect(rat.hp).toBe(287);
  });
});

describe('cartes de tous les personnages', async () => {
  const { rewardPool, CARD_DEFS, cardDef } = await import('../src/data/cards');
  const { UNLOCKS } = await import('../src/data/unlocks');
  const { Run } = await import('../src/core/run');
  const chars = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew'] as const;

  it('toutes les cartes de récompense sont débloquables, sans doublon de nom (75 + cartes de Protection ajoutées)', () => {
    const extra: Record<string, number> = { riolu: 4, vipelierre: 4, kangourex: 4, caninos: 4, mew: 0 };
    for (const ch of chars) {
      const n = 75 + extra[ch];
      const pool = rewardPool(ch);
      expect(pool, ch).toHaveLength(n);
      const unlockIds = Object.values(UNLOCKS[ch]!).flat();
      expect(new Set(unlockIds).size, ch).toBe(n);
      for (const c of pool) expect(unlockIds, `${ch} ${c.id}`).toContain(c.id);
      expect(new Set(pool.map((c) => c.name)).size, ch).toBe(n);
    }
  });

  it('les decks de départ font 10 cartes qui existent', () => {
    for (const ch of chars) {
      expect(CHARACTERS[ch].starterDeck, ch).toHaveLength(10);
      for (const id of CHARACTERS[ch].starterDeck) expect(CARD_DEFS[id], id).toBeDefined();
    }
  });

  it('chaque carte se joue sans erreur (version normale et améliorée)', () => {
    for (const ch of chars) {
      for (const d of rewardPool(ch)) {
        for (const up of [false, true]) {
          const c = new Combat({ character: ch, deck: makeDeck(CHARACTERS[ch].starterDeck), enemies: ['rattata', 'rattata'], seed: d.id });
          for (const e of c.enemies) e.hp = e.maxHp = 999;
          c.player.energy = 9;
          c.hand = [{ uid: 900, defId: d.id, upgraded: up }];
          const def = cardDef(d.id, up);
          expect(() => c.play(900, def.target === 'ennemi' ? c.enemies[0].uid : undefined), d.id).not.toThrow();
        }
      }
    }
  });

  it('Mew pioche des cartes de tous les personnages', () => {
    const run = new Run('MEW', 'mew');
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) for (const id of run.cardChoices('combat')) seen.add(CARD_DEFS[id].character);
    expect(seen.size).toBeGreaterThanOrEqual(5);
  });
});

describe('Bébé Kangourex', () => {
  const mk = () => {
    const c = new Combat({ character: 'kangourex', deck: makeDeck(CHARACTERS.kangourex.starterDeck), enemies: ['rattata'], seed: 'BEBE', relics: ['lait-meumeu'] });
    c.enemies[0].hp = c.enemies[0].maxHp = 300;
    return c;
  };

  it('apparaît avec 12 PV grâce au Lait Meumeu et attaque à la fin du tour', () => {
    const c = mk();
    expect(c.player.familiar).toMatchObject({ hp: 12, maxHp: 12, power: 3 });
    const before = c.enemies[0].hp;
    c.endPlayerTurn();
    expect(c.enemies[0].hp).toBeLessThan(before);
  });

  it('s’il est K.O., Kangourex gagne Attaque +2', () => {
    const c = mk();
    c.endPlayerTurn();
    // force le coup sur le Bébé
    (c as unknown as { hitFamiliar: (n: number, e: string) => void }).hitFamiliar(50, 'normal');
    expect(c.player.familiar!.hp).toBe(0);
    expect(c.player.statuses.attaque).toBe(2);
  });

  it('Puissance augmente ses dégâts', () => {
    const c = mk();
    c.player.energy = 9;
    c.hand = makeDeck(['kan-puissance', 'kan-coup-d-boule']).map((x, i) => ({ ...x, uid: 950 + i }));
    c.play(950);
    expect(c.player.familiar!.power).toBe(5);
    const before = c.enemies[0].hp;
    c.play(951, c.enemies[0].uid);
    expect(before - c.enemies[0].hp).toBeGreaterThan(10);
  });
});

it('le Bébé peut finir le combat à la fin du tour', () => {
  const c = new Combat({ character: 'kangourex', deck: makeDeck(CHARACTERS.kangourex.starterDeck), enemies: ['rattata'], seed: 'FIN' });
  c.enemies[0].hp = 1;
  c.endPlayerTurn();
  expect(c.phase).toBe('victoire');
});

describe('acte 2', async () => {
  const { Run, LAST_ACT } = await import('../src/core/run');
  const { ZONES, zonesOfAct } = await import('../src/data/zones');
  const { ENEMY_DEFS } = await import('../src/data/enemies');

  it('5 zones, une par région, avec des ennemis qui existent', () => {
    const z2 = zonesOfAct(2);
    expect(z2).toHaveLength(5);
    expect(new Set(z2.map((z) => z.region)).size).toBe(5);
    for (const z of ZONES) {
      for (const id of [...z.encounters.flat(), ...z.elites.flat(), z.boss]) expect(ENEMY_DEFS[id], `${z.id} ${id}`).toBeDefined();
    }
  });

  it('après le gardien, on passe à l’acte 2 avec une nouvelle carte et les PV restaurés', () => {
    expect(LAST_ACT).toBeGreaterThanOrEqual(2);
    const run = new Run('ACTE2', 'riolu');
    run.moveTo(15, 0);
    run.hp = 10;
    expect(run.floor).toBe(16);
    run.nextAct();
    expect(run.act).toBe(2);
    expect(run.zone.act).toBe(2);
    expect(run.hp).toBe(run.maxHp);
    expect(run.pos).toBeNull();
    expect(run.floor).toBe(16);
    expect(run.available()).toEqual(run.map[0]);
    expect(run.encounter('boss')).toEqual([run.zone.boss]);
  });

  it('chaque gardien de l’acte 2 se combat sans erreur', () => {
    for (const z of zonesOfAct(2)) {
      const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: [z.boss], seed: z.id });
      for (let t = 0; t < 5 && c.phase !== 'defaite'; t++) {
        c.endPlayerTurn();
        for (const e of c.aliveEnemies()) c.enemyAct(e.uid);
        c.endEnemyTurn();
      }
      expect(['joueur', 'defaite']).toContain(c.phase);
    }
  });
});

describe('acte 3', async () => {
  const { Run, LAST_ACT } = await import('../src/core/run');
  const { zonesOfAct } = await import('../src/data/zones');
  it('5 zones, une par région, et on y arrive après l’acte 2', () => {
    expect(LAST_ACT).toBe(4);
    const z3 = zonesOfAct(3);
    expect(z3).toHaveLength(5);
    expect(new Set(z3.map((z) => z.region)).size).toBe(5);
    const run = new Run('ACTE3', 'caninos');
    run.nextAct();
    run.nextAct();
    expect(run.act).toBe(3);
    expect(run.zone.act).toBe(3);
    expect(run.floor).toBe(32);
  });
});

describe('sommet et Dialga Primal', async () => {
  const { Run, SUMMIT_STEPS } = await import('../src/core/run');
  it('le sommet suit l’acte 3 et finit par Dialga Primal', () => {
    const run = new Run('SOMMET', 'riolu');
    run.nextAct(); run.nextAct(); run.nextAct();
    expect(run.act).toBe(4);
    expect(run.zone.id).toBe('sommet-tour-du-temps');
    expect(SUMMIT_STEPS[SUMMIT_STEPS.length - 1]).toBe('boss');
    expect(run.encounter('boss')).toEqual(['dialga-primal']);
    const a = run.encounter('elite'), b = run.encounter('elite');
    expect([a[0], b[0]].sort()).toEqual(['massko', 'noctunoir']);
  });

  it('Dialga annonce Hurle-Temps puis se recharge, et passe en phase 2 sous 50 % de PV', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['dialga-primal'], seed: 'DIALGA', hp: 999, maxHp: 999 });
    const d = c.enemies[0];
    const seen: string[] = [];
    for (let t = 0; t < 6; t++) {
      seen.push(d.intent.id);
      c.endPlayerTurn();
      c.enemyAct(d.uid);
      c.endEnemyTurn();
    }
    expect(seen).toEqual(['distorsion', 'draco-choc', 'luminocanon', 'mur-de-fer', 'hurle-temps', 'recharge']);
    d.block = 0;
    c.player.energy = 9;
    c.hand = makeDeck(['ruse']).map((x) => ({ ...x, uid: 990 }));
    d.hp = Math.floor(d.maxHp / 2) + 3;
    c.play(990, d.uid);
    expect(d.phase).toBe(2);
    expect(d.intent.id).toBe('luminocanon');
    expect(d.statuses.attaque).toBeGreaterThanOrEqual(2);
  });
});

describe('évolutions et Méga-Évolution', async () => {
  const { Run } = await import('../src/core/run');
  it('Riolu évolue en Lucario à l’acte 2 (PV max +10, type Acier)', () => {
    const run = new Run('EVO', 'riolu');
    expect(run.form.name).toBe('Riolu');
    run.nextAct();
    expect(run.form).toMatchObject({ name: 'Lucario', dex: 448 });
    expect(run.form.types).toContain('acier');
    expect(run.maxHp).toBe(85);
    expect(run.justEvolved?.to.name).toBe('Lucario');
  });
  it('Vipélierre devient Lianaja puis Majaspic', () => {
    const run = new Run('EVO', 'vipelierre');
    run.nextAct(); expect(run.form.name).toBe('Lianaja');
    run.nextAct(); expect(run.form.name).toBe('Majaspic');
  });
  it('avec la Lucarite, Lucario méga-évolue en combat (pas Riolu à l’acte 1)', () => {
    const base = { character: 'riolu' as const, deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'MEGA', relics: ['lucarite'] };
    const a1 = new Combat({ ...base, act: 1 });
    expect(a1.player.isMega).toBeFalsy();
    const a2 = new Combat({ ...base, act: 2, form: { dex: 448, name: 'Lucario', types: ['combat', 'acier'] } });
    expect(a2.player).toMatchObject({ isMega: true, name: 'Méga-Lucario', dex: 10059 });
    expect(a2.player.statuses.attaque).toBe(2);
  });
  it('avec la Kangourexite, le Bébé attaque deux fois', () => {
    const c = new Combat({ character: 'kangourex', deck: makeDeck(CHARACTERS.kangourex.starterDeck), enemies: ['rattata'], seed: 'MK', relics: ['kangourexite'] });
    expect(c.player.isMega).toBe(true);
    expect(c.player.familiar!.mega).toBe(true);
  });
});

describe('arcanes majeurs', async () => {
  const { TAROT_EVENTS } = await import('../src/data/events-tarot');
  const { Run } = await import('../src/core/run');
  it('22 arcanes, chaque choix s’applique sans erreur', () => {
    expect(TAROT_EVENTS).toHaveLength(22);
    for (const ev of TAROT_EVENTS) {
      ev.choices.forEach((c, i) => {
        const run = new Run(`T-${ev.id}-${i}`, 'riolu');
        run.money = 200;
        const before = run.maxHp;
        const r = c.apply(run);
        expect(typeof r === 'string' || 'fight' in r || ['retirer', 'ameliorer', 'dupliquer', 'transformer', 'monde', 'enchanter'].includes(r.pick), `${ev.id} ${c.label}`).toBe(true);
        expect(run.hp, ev.id).toBeGreaterThan(0);
        expect(run.hp, ev.id).toBeLessThanOrEqual(run.maxHp);
        if (ev.id === 'tarot-diable' && i < 3) expect(run.maxHp).toBeLessThan(before);
      });
    }
  });
});

describe('Rappel Max et Vœu Brisé', () => {
  it('le Rappel Max relève le Pokémon à 33 % de ses PV, une seule fois', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'RM', relics: ['rappel-max'], hp: 3 });
    (c as unknown as { applyHpLoss: (f: unknown, w: string, n: number) => void }).applyHpLoss(c.player, 'player', 50);
    expect(c.player.hp).toBe(Math.round(c.player.maxHp * 0.33));
    expect(c.consumedRelics).toEqual(['rappel-max']);
    expect(c.phase).toBe('joueur');
    (c as unknown as { applyHpLoss: (f: unknown, w: string, n: number) => void }).applyHpLoss(c.player, 'player', 500);
    expect(c.phase).toBe('defaite');
  });
  it('Vœu Brisé est injouable et coûte 2 PV en fin de tour', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'VB' });
    c.hand = [{ uid: 777, defId: 'voeu-brise', upgraded: false }];
    expect(c.canPlay(c.hand[0])).toBe(false);
    const hp = c.player.hp;
    c.endPlayerTurn();
    expect(c.player.hp).toBe(hp - 2);
  });
});

it('les duels des arcanes : Nidoking et Machopeur se renforcent selon l’acte', () => {
  const base = { character: 'riolu' as const, deck: makeDeck(CHARACTERS.riolu.starterDeck), seed: 'DUEL' };
  const a1 = new Combat({ ...base, enemies: ['nidoking-duel'] });
  const a3 = new Combat({ ...base, enemies: ['nidoking-duel'], enemyPower: 2.3 });
  expect(a3.enemies[0].maxHp).toBeGreaterThan(a1.enemies[0].maxHp * 2);
  expect(a3.enemies[0].statuses.attaque).toBeGreaterThan(0);
  expect(new Combat({ ...base, enemies: ['machopeur-duel'] }).enemies[0].name).toBe('Machopeur');
});

describe('arcanes inversés, baies, Kecleon', async () => {
  const { TAROT_EVENTS } = await import('../src/data/events-tarot');
  const { BERRIES } = await import('../src/data/berries');
  const { Run } = await import('../src/core/run');
  it('22 arcanes inversés, chaque choix s’applique sans erreur', () => {
    for (const ev of TAROT_EVENTS) {
      expect(ev.reversed, ev.id).toBeDefined();
      ev.reversed!.choices.forEach((c, i) => {
        const run = new Run(`R-${ev.id}-${i}`, 'riolu');
        run.money = 300;
        if (c.available && !c.available(run)) return;
        c.apply(run);
        expect(run.hp, ev.id).toBeGreaterThan(0);
        expect(run.hp, ev.id).toBeLessThanOrEqual(run.maxHp);
        for (const card of run.deck) expect(CARD_DEFS_ALL[card.defId], `${ev.id} ${card.defId}`).toBeDefined();
      });
    }
  });
  it('Diable inversé : Vampirisme et Soin remplacent les cartes de départ', () => {
    const run = new Run('DIABLE', 'riolu');
    TAROT_EVENTS.find((e) => e.id === 'tarot-diable')!.reversed!.choices[0].apply(run);
    expect(run.deck.filter((c) => c.defId === 'diable-vampirisme')).toHaveLength(4);
    expect(run.deck.filter((c) => c.defId === 'diable-soin')).toHaveLength(4);
  });
  it('52 baies trouvables (+ 3 empoisonnées) et 3 emplacements', () => {
    expect(BERRIES.filter((b) => !b.noDrop)).toHaveLength(52);
    const run = new Run('BAIES', 'riolu');
    for (let i = 0; i < 3; i++) expect(run.addBerry(run.rollBerry())).toBe(true);
    expect(run.addBerry('oran')).toBe(false);
  });
  it('Kecleon existe comme adversaire', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['kecleon'], seed: 'K' });
    expect(c.enemies[0].name).toBe('Kecleon');
  });
});

describe('modifications des cartes de Riolu', () => {
  const mkc = (cards: string[], enemies = ['rattata'], boss = false) => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies, seed: 'MOD', boss });
    c.hand = cards.map((id, i) => ({ uid: 800 + i, defId: id, upgraded: false }));
    c.player.energy = 10;
    for (const e of c.enemies) { e.hp = 300; e.maxHp = 300; }
    return c;
  };
  it('Ténacité : impossible de tomber K.O. avant le prochain tour', () => {
    const c = mkc(['tenacite']);
    c.play(800);
    c.endPlayerTurn();
    const e = c.enemies[0];
    e.intent = { id: 'x', name: 'x', weight: 1, intent: 'attaque', pokeType: 'normal', damage: 999 };
    c.enemyAct(e.uid);
    expect(c.player.hp).toBe(1);
    expect(c.phase).toBe('ennemi');
  });
  it('Poing Glace : 3 Gel font passer le tour', () => {
    const c = mkc(['poing-glace', 'poing-glace', 'poing-glace']);
    const e = c.enemies[0];
    for (let i = 0; i < 3; i++) c.play(800 + i, e.uid);
    expect(e.statuses.gel).toBe(3);
    c.endPlayerTurn();
    const hp = c.player.hp;
    e.intent = { id: 'x', name: 'x', weight: 1, intent: 'attaque', pokeType: 'normal', damage: 20 };
    c.enemyAct(e.uid);
    expect(c.player.hp).toBe(hp);
    expect(e.statuses.gel).toBeUndefined();
  });
  it('Photocopie : la carte suivante est jouée 2 fois', () => {
    const c = mkc(['photocopie', 'grincement']);
    c.play(800);
    c.play(801);
    expect(c.enemies[0].statuses.peur).toBe(4);
  });
  it('Hurlement : fuite sans récompense, impossible contre un gardien', () => {
    const c = mkc(['hurlement']);
    c.play(800);
    expect(c.phase).toBe('victoire');
    expect(c.fled).toBe(true);
    const b = mkc(['hurlement'], ['rattata'], true);
    expect(b.canPlay(b.hand[0])).toBe(false);
  });
  it('Luminocanon demande de la Protection ; Poing Météore frappe avec la Protection', () => {
    const c = mkc(['luminocanon', 'poing-meteore']);
    expect(c.canPlay(c.hand[0])).toBe(false);
    c.player.block = 10;
    c.player.aura = 0;
    expect(c.canPlay(c.hand[0])).toBe(true);
    const e = c.enemies[0];
    c.play(801, e.uid);
    expect(e.hp).toBe(300 - 10); // 10 de Protection, Acier neutre contre Rattata
  });
  it('Ball’Ombre gagne 5 dégâts à chaque utilisation', () => {
    const c = mkc(['ball-ombre', 'ball-ombre']);
    c.player.aura = 0;
    const card = c.hand[1];
    const before = c.previewCardDamage(card);
    c.play(800, c.enemies[0].uid);
    c.player.aura = 0;
    expect(c.previewCardDamage(card)!).toBeGreaterThan(before!);
  });
  it('Mitra-Poing : frappe au tour suivant sans dégâts subis, sinon rien', () => {
    const c = mkc(['mitra-poing']);
    c.player.aura = 0;
    const e = c.enemies[0];
    c.play(800, e.uid);
    expect(c.player.statuses.concentration).toBe(30);
    c.endPlayerTurn();
    e.intent = { id: 'x', name: 'x', weight: 1, intent: 'defense', block: 0 };
    c.enemyAct(e.uid);
    c.endEnemyTurn();
    expect(e.hp).toBeLessThan(300);
    const d = mkc(['mitra-poing']);
    const f = d.enemies[0];
    d.play(800, f.uid);
    d.endPlayerTurn();
    f.intent = { id: 'x', name: 'x', weight: 1, intent: 'attaque', pokeType: 'normal', damage: 5 };
    d.enemyAct(f.uid);
    d.endEnemyTurn();
    expect(f.hp).toBe(300);
  });
  it('Ultralaser étourdit : tour suivant perdu', () => {
    const c = mkc(['ultralaser']);
    c.play(800);
    c.endPlayerTurn();
    for (const e of c.aliveEnemies()) { e.intent = { id: 'x', name: 'x', weight: 1, intent: 'defense', block: 0 }; c.enemyAct(e.uid); }
    c.endEnemyTurn();
    expect(c.skipTurn).toBe(true);
    expect(c.hand.every((x) => !c.canPlay(x))).toBe(true);
  });
  it('Close Combat demande la fin du tour ; Exploforce consomme 20 Aura', () => {
    const c = mkc(['close-combat', 'exploforce']);
    c.player.aura = 25;
    c.play(801, c.enemies[0].uid);
    expect(c.player.aura).toBe(5);
    c.play(800, c.enemies[0].uid);
    expect(c.endTurnRequested).toBe(true);
  });
});

describe('sauvegarde et reliques de gardien', async () => {
  const { Run } = await import('../src/core/run');
  it('une run sauvegardée reprend à l’identique (même hasard)', () => {
    const a = new Run('SAVE1', 'riolu');
    a.money = 321;
    a.addBerry('oran');
    a.moveTo(0, a.map[0][0].col);
    const b = Run.fromJSON(JSON.parse(JSON.stringify(a.toJSON())));
    expect(b.money).toBe(321);
    expect(b.berries).toEqual(['oran']);
    expect(b.zone.id).toBe(a.zone.id);
    expect(b.pos).toEqual(a.pos);
    expect(b.deck.length).toBe(a.deck.length);
    expect(b.rng.next()).toBe(a.rng.next());
    expect(b.cardChoices('combat')).toEqual(a.cardChoices('combat'));
  });
  it('relique de gardien : +1 PA et sa contrepartie', () => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['rattata'], seed: 'B', relics: ['orbe-adamant', 'orbe-platine'] });
    expect(c.player.maxEnergy).toBe(5);
    expect(c.player.energy).toBe(5);
    expect(c.enemies[0].statuses.attaque).toBe(1);
    expect(c.hand.length).toBe(4);
  });
});

describe('gardiens : talents et capacités exclusives', () => {
  const vs = (boss: string, cards: string[] = []) => {
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: [boss], seed: 'G', boss: true });
    c.hand = cards.map((id, i) => ({ uid: 900 + i, defId: id, upgraded: false }));
    c.player.energy = 10;
    c.player.aura = 0;
    return c;
  };
  it('chaque gardien a un talent', async () => {
    const { ZONES } = await import('../src/data/zones');
    const { ENEMY_DEFS } = await import('../src/data/enemies');
    for (const z of ZONES) expect(ENEMY_DEFS[z.boss].gimmick, z.boss).toBeDefined();
  });
  it('Charkos garde la moitié de sa Protection ; Dardargnan bloque le Poison', () => {
    const c = vs('charkos');
    expect(c.enemies[0].block).toBe(12);
    c.endPlayerTurn();
    expect(c.enemies[0].block).toBeGreaterThanOrEqual(6);
    const d = vs('dardargnan');
    d.player.statuses.poison = 3;
    d.endPlayerTurn();
    d.enemies[0].intent = { id: 'x', name: 'x', weight: 1, intent: 'defense', block: 0 };
    d.enemyAct(d.enemies[0].uid);
    d.endEnemyTurn();
    expect(d.player.statuses.poison).toBe(3);
  });
  it('Assaut Venimeux glisse des Dards Venimeux qui empoisonnent à la pioche', () => {
    const c = vs('dardargnan');
    c.endPlayerTurn();
    c.enemies[0].intent = c.enemies[0].intent = (c as any).constructor && { ...((c.enemies[0] as any).intent), ...{ id: 'assaut-venimeux', name: 'Assaut Venimeux', weight: 1, intent: 'attaque', pokeType: 'poison', damage: 8, addCards: { id: 'g-dard-venimeux', count: 2, to: 'pioche' } } };
    c.enemyAct(c.enemies[0].uid);
    expect(c.drawPile.filter((x) => x.defId === 'g-dard-venimeux').length + c.discardPile.filter((x) => x.defId === 'g-dard-venimeux').length).toBe(2);
  });
  it('Apireine appelle des ouvrières et encaisse moitié moins tant qu’elles sont là', () => {
    const c = vs('apireine', ['ruse']);
    c.endPlayerTurn();
    c.enemies[0].intent = { id: 'appel-ouvrieres', name: 'Appel', weight: 1, intent: 'boost', summon: { id: 'apitrini', max: 2 } };
    c.enemyAct(c.enemies[0].uid);
    expect(c.enemies.length).toBe(2);
    c.endEnemyTurn();
    const q = c.enemies[0];
    q.block = 0;
    const hp = q.hp;
    c.hand = [{ uid: 990, defId: 'ruse', upgraded: false }];
    c.player.aura = 0;
    c.play(990, q.uid);
    expect(hp - q.hp).toBeLessThanOrEqual(4);
  });
  it('Rayquaza bloque les hausses d’Attaque', () => {
    const c = vs('rayquaza', ['danse-lames']);
    c.play(900);
    expect(c.player.statuses.attaque ?? 0).toBe(0);
  });
});

describe('baies', () => {
  it('Oran soigne 10, Sitrus +5 PV max, Chocco réduit le Feu', async () => {
    const { BERRY_DEFS } = await import('../src/data/berries');
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['dardargnan'], seed: 'b', hp: 30, maxHp: 70 });
    c.useBerry('Oran', BERRY_DEFS.oran.fx);
    expect(c.player.hp).toBe(40);
    c.useBerry('Sitrus', BERRY_DEFS.sitrus.fx);
    expect(c.player.maxHp).toBe(75);
    expect(c.player.hp).toBe(45);
    expect(BERRY_DEFS.oran.combatOnly).toBe(false);
    expect(BERRY_DEFS.occa.combatOnly).toBe(true);
    c.useBerry('Chocco', BERRY_DEFS.occa.fx);
    expect(c.resists.has('feu')).toBe(true);
    expect(BERRY_DEFS.oran.text).toBe('Restaure 10 PV.');
  });
});

describe('baies exclusives', () => {
  it('Enigma donne 10 Aura à Riolu et ne sort que pour lui', async () => {
    const { BERRY_DEFS } = await import('../src/data/berries');
    const c = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['dardargnan'], seed: 'e' });
    const before = c.player.aura;
    c.useBerry('Enigma', BERRY_DEFS.enigma.fx);
    expect(c.player.aura).toBe(before + 10);
    expect(BERRY_DEFS.enigma.character).toBe('riolu');
    const v = new Combat({ character: 'vipelierre', deck: makeDeck(CHARACTERS.vipelierre.starterDeck), enemies: ['dardargnan'], seed: 'e' });
    v.useBerry('Rangma', BERRY_DEFS.maranga.fx);
    expect(v.player.statuses.attaque).toBe(2);
  });
});

describe('objets tenus exclusifs', () => {
  const mk = (ch: 'riolu' | 'vipelierre' | 'caninos' | 'mew' | 'kangourex', relics: string[]) =>
    new Combat({ character: ch, deck: makeDeck(CHARACTERS[ch].starterDeck), enemies: ['dardargnan'], seed: 'r', relics });
  it('chaque objet exclusif fait son effet', () => {
    expect(mk('riolu', ['lunettes-sages']).player.aura - mk('riolu', []).player.aura).toBe(5);
    const v = mk('vipelierre', ['herbe-blanche']);
    expect(v.player.statuses.attaque).toBe(1);
    expect(v.player.statuses.defense).toBe(1);
    expect(mk('vipelierre', ['pierre-plante']).enemies[0].statuses.vampigraine).toBe(2);
    expect(mk('caninos', ['pierre-feu']).enemies[0].statuses.brulure).toBeGreaterThanOrEqual(2);
    expect(mk('mew', ['cuillere-tordue']).player.energy).toBe(mk('mew', []).player.energy + 1);
    expect(mk('kangourex', ['grelot-zen']).player.familiar!.power).toBe(5);
  });
});

describe('événements Pokémon', () => {
  it('chaque choix de chaque événement fonctionne', async () => {
    const { POKEMON_EVENTS } = await import('../src/data/events-pokemon');
    const { Run } = await import('../src/core/run');
    expect(POKEMON_EVENTS.length).toBeGreaterThanOrEqual(20);
    for (const ev of POKEMON_EVENTS) for (const ch of ev.choices) {
      const r = new Run('EV', 'riolu');
      r.money = 200;
      r.addBerry('oran');
      if (ch.available && !ch.available(r)) continue;
      const out = ch.apply(r);
      expect(out).toBeTruthy();
      expect(r.hp).toBeGreaterThan(0);
    }
  });
});

describe('météo et terrains', () => {
  const mk = (enemies = ['dardargnan']) => new Combat({ character: 'caninos', deck: makeDeck(CHARACTERS.caninos.starterDeck), enemies, seed: 'm' });
  it('Zénith booste le Feu et affaiblit l’Eau, puis se dissipe après 5 tours', () => {
    const c = mk();
    c.setField('zenith', 5);
    expect(c.fieldMult('feu')).toBe(1.5);
    expect(c.fieldMult('eau')).toBe(0.5);
    for (let i = 0; i < 5; i++) { c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); c.endEnemyTurn(); if (c.phase !== 'joueur') break; }
    if (c.phase === 'joueur') expect(c.weather).toBeNull();
  });
  it('Champ Herbu soigne tout le monde de 3 PV en fin de tour', () => {
    const c = mk();
    c.setField('champ-herbu', 5);
    c.player.hp -= 20;
    const e = c.enemies[0]; e.hp -= 20;
    (c as unknown as { tickField(): void }).tickField();
    expect(c.player.hp).toBe(c.player.maxHp - 17);
    expect(e.hp).toBe(e.maxHp - 17);
  });
  it('Champ Brumeux bloque les statuts négatifs ; Restes soignent 3 PV en fin de combat', () => {
    const c = mk();
    c.setField('champ-brumeux', 5);
    (c as unknown as { addStatus(f: unknown, w: unknown, s: string, n: number): void }).addStatus(c.player, 'player', 'poison', 3);
    expect(c.player.statuses.poison ?? 0).toBe(0);
    const r = new Combat({ character: 'caninos', deck: makeDeck(CHARACTERS.caninos.starterDeck), enemies: ['chenipan'], seed: 'm', relics: ['restes'], hp: 30, maxHp: 70 });
    for (const e of r.enemies) e.hp = 1;
    (r as unknown as { dealDamage(f: unknown, w: unknown, n: number, e: string): void }).dealDamage(r.enemies[0], r.enemies[0].uid, 5, 'normal');
    (r as unknown as { checkEnd(): void }).checkEnd();
    expect(r.phase).toBe('victoire');
    expect(r.player.hp).toBe(33);
  });
});

describe('EXP de fin de run', () => {
  it('détaille chaque source et additionne', async () => {
    const { expBreakdown } = await import('../src/data/unlocks');
    const r = { floor: 20, combatsWon: 8, elitesDefeated: 2, duelsWon: 1, bossNames: ['Dardargnan', 'Camérupt'], eventsSeen: 4, shiniesMet: 1, relics: ['oeuf-chance'] };
    const { lines, total } = expBreakdown(r, false);
    expect(lines.find((l) => l.label === 'Étages montés')!.amount).toBe(200);
    expect(lines.filter((l) => l.label.startsWith('Gardien vaincu')).length).toBe(2);
    const raw = 200 + 40 + 50 + 25 + 120 + 20 + 20;
    expect(total).toBe(raw + Math.floor(raw / 2));
  });
});

describe('skins', () => {
  it('le skin chromatique de Riolu se débloque après 5 chromatiques vaincus, cumulés sur plusieurs runs', async () => {
    const { recordRunStats, skinUnlocked, equippedSkin, equipSkin } = await import('../src/core/save');
    const { SKINS } = await import('../src/data/skins');
    const s = { exp: {}, runs: 0 } as never;
    expect(recordRunStats(s, 'riolu', { shinies: 3 })).toEqual([]);
    expect(skinUnlocked(s, 'riolu', SKINS.riolu[0])).toBe(false);
    equipSkin(s, 'riolu', 'shiny');
    expect(equippedSkin(s, 'riolu')).toBeUndefined();
    expect(recordRunStats(s, 'riolu', { shinies: 2 }).map((k) => k.id)).toEqual(['shiny']);
    expect(equippedSkin(s, 'riolu')).toBe('shiny');
  });
});

describe('skin Magma', () => {
  it('se débloque après avoir vaincu Camérupt et Heatran avec Riolu (sur plusieurs runs)', async () => {
    const { recordRunStats, skinUnlocked } = await import('../src/core/save');
    const { SKINS } = await import('../src/data/skins');
    const magma = SKINS.riolu.find((k) => k.id === 'magma')!;
    const s = { exp: {}, runs: 0 } as never;
    recordRunStats(s, 'riolu', {}, ['dardargnan', 'camerupt']);
    expect(skinUnlocked(s, 'riolu', magma)).toBe(false);
    recordRunStats(s, 'caninos', {}, ['heatran']);
    expect(skinUnlocked(s, 'riolu', magma)).toBe(false);
    expect(recordRunStats(s, 'riolu', {}, ['heatran']).map((k) => k.id)).toEqual(['magma']);
  });
});

describe('pension et coffres', () => {
  it('une carte fusionnée cumule les effets et coûte la somme moins 1', async () => {
    const { cardDef, fusionId, canFuse } = await import('../src/data/cards');
    const a = cardDef('ruse'), b = cardDef('detection');
    expect(canFuse(a, b)).toBe(true);
    const f = cardDef(fusionId('ruse', false, 'detection', true));
    expect(f.effects.length).toBe(a.effects.length + cardDef('detection', true).effects.length);
    expect(f.cost).toBe(Math.max(a.cost, b.cost, a.cost + b.cost - 1));
    expect(f.category).toBe('attaque');
    const up = cardDef(f.id, true);
    expect(up.name.endsWith('+')).toBe(true);
  });
  it('les nouveaux nœuds apparaissent sur la carte', async () => {
    const { Run } = await import('../src/core/run');
    const types = new Set<string>();
    for (let i = 0; i < 20; i++) for (const row of new Run(`N${i}`, 'riolu').map) for (const n of row) types.add(n.type);
    for (const t of ['coffre', 'pension', 'ct']) expect(types.has(t), t).toBe(true);
    for (let i = 0; i < 30; i++) expect(new Run(`K${i}`, 'riolu').map.flat().filter((n) => n.type === 'coffre').length).toBeLessThanOrEqual(2);
  });
});

describe('« ? » surprises et Marché noir', () => {
  it('un « ? » peut cacher un combat, de plus en plus souvent', async () => {
    const { Run } = await import('../src/core/run');
    const r = new Run('Q', 'riolu');
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) seen.add(r.rollMystery());
    for (const k of ['combat', 'tresor', 'marche-noir', 'evenement']) expect(seen.has(k), k).toBe(true);
  });
  it('une carte enchantée garde son nom et gagne son bonus', async () => {
    const { cardDef, enchantId } = await import('../src/data/cards');
    const base = cardDef('ruse');
    const f = cardDef(enchantId('force', 'ruse'));
    expect(f.name).toBe(base.name);
    expect((f.effects[0] as { amount: number }).amount).toBe((base.effects[0] as { amount: number }).amount + 3);
    expect(cardDef(enchantId('vif', 'aurasphere')).cost).toBe(cardDef('aurasphere').cost - 1);
    expect(cardDef(enchantId('vif', 'aurasphere'), true).name.endsWith('+')).toBe(true);
  });
});

describe('enchantement par événement', () => {
  it('enchantCard ajoute un enchantement qui convient à la carte', async () => {
    const { Run } = await import('../src/core/run');
    const { cardDef } = await import('../src/data/cards');
    const r = new Run('ENC', 'riolu');
    const c = r.deck[0];
    const k = r.enchantCard(c.uid);
    expect(k).toBeTruthy();
    expect(cardDef(c.defId).enchant).toBe(k);
    expect(r.enchantCard(c.uid)).toBeNull();
  });
});

describe('enchantements rares et légendaires', () => {
  it('les légendaires sortent environ 2 fois sur 100, les rares 13 fois', async () => {
    const { rollEnchant, ENCHANTS, cardDef, enchantId } = await import('../src/data/cards');
    const d = cardDef('aurasphere');
    let rnd = 1;
    const rand = () => { rnd = (rnd * 16807) % 2147483647; return (rnd - 1) / 2147483646; };
    const n = { commun: 0, rare: 0, legendaire: 0 } as Record<string, number>;
    for (let i = 0; i < 10000; i++) n[ENCHANTS[rollEnchant(d, rand)!].rarity ?? 'commun']++;
    expect(n.legendaire).toBeGreaterThan(100);
    expect(n.legendaire).toBeLessThan(350);
    expect(n.rare).toBeGreaterThan(1000);
    expect(n.rare).toBeLessThan(1700);
    expect(cardDef(enchantId('echo', 'ruse')).keywords).toContain('echo');
    expect(cardDef(enchantId('gratuit', 'aurasphere')).cost).toBe(0);
  });
});

describe('nouvelles mécaniques Caninos et Kangourex', () => {
  const setup = (ch: 'caninos' | 'kangourex', ids: string[]) => {
    const c = new Combat({ character: ch, deck: makeDeck(CHARACTERS[ch].starterDeck), enemies: ['ossatueur'], seed: 'NM' });
    c.drainEvents();
    c.player.energy = 9;
    c.enemies[0].hp = c.enemies[0].maxHp = 200;
    c.hand = makeDeck(ids).map((x, i) => ({ ...x, uid: 900 + i }));
    return c;
  };
  it('Crocs Feu : 2 dégâts, puis la Brûlure de la cible en Protection', () => {
    const c = setup('caninos', ['can-crocs-feu']);
    c.enemies[0].statuses.brulure = 3;
    c.play(900, c.enemies[0].uid);
    expect(c.player.block).toBe(5);
  });
  it('Déflagration consomme les Brûlures en dégâts', () => {
    const c = setup('caninos', ['can-deflagration']);
    const e = c.enemies[0];
    e.statuses.brulure = 5;
    const before = e.hp;
    c.play(900);
    expect(e.statuses.brulure ?? 0).toBe(0);
    expect(before - e.hp).toBeGreaterThan(15);
  });
  it('Ténacité : Invocation 8 ; Rune Protect donne les PV du Bébé en Protection', () => {
    const c = setup('kangourex', ['kan-tenacite', 'kan-rune-protect']);
    const hp0 = c.player.familiar!.hp;
    c.play(900);
    expect(c.player.familiar!.hp).toBe(hp0 + 8);
    c.play(901);
    expect(c.player.block).toBe(c.player.familiar!.hp);
  });
});

describe('sommeil', () => {
  const setup = (ids: string[]) => {
    const c = new Combat({ character: 'vipelierre', deck: makeDeck(CHARACTERS.vipelierre.starterDeck), enemies: ['ossatueur'], seed: 'ZZ', hp: 20, maxHp: 70 });
    c.drainEvents();
    c.player.energy = 9;
    c.hand = makeDeck(ids).map((x, i) => ({ ...x, uid: 950 + i }));
    return c;
  };
  it('Repos soigne tout et endort ; endormi, seules Ronflement et Blabla Dodo se jouent', () => {
    const c = setup(['vip-repos', 'vip-ronflement', 'charge']);
    expect(c.canPlay(c.hand[1])).toBe(false);
    c.play(950);
    expect(c.player.hp).toBe(70);
    expect(c.player.statuses.sommeil).toBeGreaterThan(0);
    expect(c.canPlay(c.hand.find((x) => x.defId === 'charge')!)).toBe(false);
    expect(c.canPlay(c.hand.find((x) => x.defId === 'vip-ronflement')!)).toBe(true);
  });
  it('les premiers dégâts réveillent ; Paresse soigne la moitié et donne une carte de sommeil', () => {
    const c = setup(['n-paresse']);
    c.play(950);
    expect(c.player.hp).toBe(55);
    expect(c.hand.some((x) => /ronflement|blabla|devoreve|cauchemar|baillement/.test(x.defId))).toBe(true);
    (c as unknown as { dealDamage(f: unknown, w: unknown, n: number, e: string): void }).dealDamage(c.player, 'player', 5, 'normal');
    expect(c.player.statuses.sommeil ?? 0).toBe(0);
  });
});
