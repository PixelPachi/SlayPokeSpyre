// Vipélierre Tisserand de Soie Astrale : Psy/Ténèbres, Permucœur, plusieurs enchantements, Nœud Destin (tissage).
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';
import { skinDef } from '../src/data/skins';
import { cardDef, enchantId } from '../src/data/cards';
import { weaveChoices, weaveId } from '../src/data/tissage';

const skinRun = () => { const r = new Run('TIS', 'vipelierre'); r.applySkin('tisserand', skinDef('vipelierre', 'tisserand')); return r; };

describe('Tisserand de Soie Astrale', () => {
  it('types, carte et objet de départ', () => {
    const r = skinRun();
    expect(r.form.types).toEqual(['psy', 'tenebres']);
    expect(r.deck.some((c) => c.defId === 'vip-permucoeur')).toBe(true);
    expect(r.relics).toContain('noeud-destin');
  });
  it('une carte peut porter plusieurs enchantements (seulement avec ce skin)', () => {
    const r = skinRun();
    const c = r.deck.find((x) => x.defId === 'charge')!;
    expect(r.enchantCard(c.uid)).toBeTruthy();
    expect(r.enchantCard(c.uid)).toBeTruthy();
    expect(cardDef(c.defId).enchants).toHaveLength(2);
    expect(new Set(cardDef(c.defId).enchants).size).toBe(2);
    const plain = new Run('TIS2', 'vipelierre');
    const p = plain.deck.find((x) => x.defId === 'charge')!;
    plain.enchantCard(p.uid);
    expect(plain.enchantCard(p.uid)).toBeNull();
  });
  it('Permucœur enchante une carte de la main', () => {
    const r = skinRun();
    const c = new Combat({ character: 'vipelierre', deck: r.deck, enemies: ['onix'], seed: 'PERM', relics: r.relics, skin: 'tisserand', form: r.form });
    c.drainEvents(); c.player.energy = 9;
    c.hand = [{ uid: 1, defId: 'vip-permucoeur', upgraded: false }, { uid: 2, defId: enchantId('garde', 'charge'), upgraded: false }];
    c.play(1);
    expect(c.enchantedCards).toHaveLength(1);
    expect(cardDef(c.hand.find((x) => x.uid === 2)!.defId).enchants!.length).toBe(2);
    expect(c.player.types).toEqual(['psy', 'tenebres']);
  });
  it('tissage : deux effets différents, une carte jouable', () => {
    const a = weaveChoices(() => 0.3);
    expect(a).toHaveLength(3);
    const b = weaveChoices(() => 0.3, [a[0]]);
    expect(b).not.toContain(a[0]);
    const d = cardDef(weaveId('lame', 'venin'));
    expect(d.effects).toHaveLength(2);
    expect(d.target).toBe('ennemi');
    expect(cardDef(weaveId('lame', 'venin'), true).effects[0]).toMatchObject({ amount: 10 });
  });
});

import { makeDeck } from '../src/core/combat';
import { CHARACTERS } from '../src/data/characters';
import { ENEMY_DEFS } from '../src/data/enemies';
import { cardText } from '../src/ui/labels';
describe('Contestation', () => {
  it('les cartes affichent −1, mais Vipélierre gagne +1 ; les baisses infligées par un ennemi deviennent des hausses', () => {
    expect(cardText(cardDef('vip-enroulement'), null, null)).toContain('Attaque −1');
    expect(cardText(cardDef('vip-enroulement'), null, null)).not.toContain('Contestation');
    const c = new Combat({ character: 'vipelierre', deck: makeDeck(CHARACTERS.vipelierre.starterDeck), enemies: ['hoothoot'], seed: 'CT', relics: [] });
    c.drainEvents(); c.player.energy = 9;
    c.hand = [{ uid: 1, defId: 'vip-enroulement', upgraded: false }];
    c.play(1);
    expect(c.player.statuses.attaque).toBe(1);
    const e = c.aliveEnemies()[0];
    e.intent = ENEMY_DEFS.hoothoot.moves.find((m) => m.id === 'rugissement')!;
    c.endPlayerTurn(); c.enemyAct(e.uid);
    expect(c.player.statuses.attaque).toBe(2);
  });
});
