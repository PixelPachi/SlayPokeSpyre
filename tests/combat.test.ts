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
    c.hand = makeDeck(['mach-punch', 'abri']).map((x, i) => ({ ...x, uid: 100 + i }));
    const rat = c.enemies[0];
    rat.hp = rat.maxHp = 99;
    c.play(100, rat.uid);
    // (6 + 3 Aura) ×1,25 ×1,5 = 16,875
    expect(rat.hp).toBe(99 - 16);
    expect(c.player.aura).toBe(0);
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
    const attack = c.hand.find((x) => x.defId !== 'abri');
    if (!attack) return; // main sans attaque avec cette graine
    c.play(attack.uid);
    expect(c.phase).toBe('victoire');
  });
});
