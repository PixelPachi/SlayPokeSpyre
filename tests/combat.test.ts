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
    expect(typeMultiplier('normal', ['spectre'])).toBe(0.25);
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

  it('Éclate-Roc frappe (en consommant l’Aura) puis remet de l’Aura', () => {
    const { c, rat } = setup();
    c.player.aura = 4;
    hand(c, ['eclate-roc']);
    c.play(900, rat.uid);
    // (5 + 4) ×1,25 ×1,5 = 16,875
    expect(rat.hp).toBe(500 - 16);
    expect(c.player.aura).toBe(3);
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

  it('Riolu a 75 cartes possibles en récompense', () => {
    expect(rewardPool('riolu')).toHaveLength(75);
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
    c.hand = makeDeck(['tenacite']).map((x) => ({ ...x, uid: 700 }));
    c.play(700); // perd 3 PV
    expect(c.player.aura).toBe(4);
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

  it('l’acte 1 a 5 zones et la zone change selon la run', () => {
    expect(zonesOfAct(1)).toHaveLength(5);
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) seen.add(new Run(`Z${i}`, 'riolu').zone.id);
    expect(seen.size).toBe(5);
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

  it('53 cartes neutres, avec des types qu’aucun personnage n’a et sans doublon de nom', () => {
    const neutral = neutralPool();
    expect(neutral).toHaveLength(53);
    const charTypes = new Set(Object.values(CHARACTERS).flatMap((c) => c.types));
    const otherNames = new Set(Object.values(CARD_DEFS).filter((c) => c.character !== 'normal').map((c) => c.name));
    for (const c of neutral) {
      expect(charTypes.has(c.pokeType), c.name).toBe(false);
      expect(otherNames.has(c.name), c.name).toBe(false);
    }
    expect(new Set(neutral.map((c) => c.name)).size).toBe(53);
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
    c.play(800, rat.uid); // 9 ×0,25 (Spectre contre Normal) = 2
    expect(rat.hp).toBe(298);
    rat.statuses.poison = 2;
    c.play(801, rat.uid); // 18 ×0,25 = 4
    expect(rat.hp).toBe(294);
  });
});

describe('cartes de tous les personnages', async () => {
  const { rewardPool, CARD_DEFS, cardDef } = await import('../src/data/cards');
  const { UNLOCKS } = await import('../src/data/unlocks');
  const { Run } = await import('../src/core/run');
  const chars = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew'] as const;

  it('75 cartes de récompense par personnage, toutes débloquables et sans doublon de nom', () => {
    for (const ch of chars) {
      const pool = rewardPool(ch);
      expect(pool, ch).toHaveLength(75);
      const unlockIds = Object.values(UNLOCKS[ch]!).flat();
      expect(new Set(unlockIds).size, ch).toBe(75);
      for (const c of pool) expect(unlockIds, `${ch} ${c.id}`).toContain(c.id);
      expect(new Set(pool.map((c) => c.name)).size, ch).toBe(75);
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

  it('apparaît avec 10 PV grâce au Lait Meumeu et attaque à la fin du tour', () => {
    const c = mk();
    expect(c.player.familiar).toMatchObject({ hp: 10, maxHp: 10, power: 3 });
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
    expect(run.encounter('elite')).toEqual(['noctunoir']);
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
