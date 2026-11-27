// Duo Posipi & Négapi : Relais, Plus / Moins, Surcharge, Court-Circuit, objets par porteur.
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';

const mk = (ids: string[], o: Record<string, unknown> = {}) => {
  const deck = ids.map((defId, i) => ({ uid: i + 1, defId, upgraded: false }));
  const c = new Combat({ character: 'duo', deck, enemies: ['rattata'], seed: 'DUO', relics: [], ...o } as never);
  c.enemies[0].hp = c.enemies[0].maxHp = 999;
  c.player.energy = 10;
  return c;
};
const play = (c: Combat, id: string) => {
  const card = c.hand.find((x) => x.defId === id)!;
  expect(card, id).toBeTruthy();
  expect(c.play(card.uid)).toBe(true);
};

describe('Duo Posipi & Négapi', () => {
  it('deux combattants de 40 PV, Posipi devant', () => {
    const c = mk(Array(10).fill('duo-eclair'));
    expect(c.duo!.front).toBe('posipi');
    expect(c.player.hp).toBe(40);
    expect(c.player.maxHp).toBe(40);
  });

  it('Relais : une carte de Négapi le fait passer devant, avec +3 Protection en entrant (+2 de Moins)', () => {
    const c = mk(Array(10).fill('duo-bouclier'));
    play(c, 'duo-bouclier');
    expect(c.duo!.front).toBe('negapi');
    expect(c.player.block).toBe(3 + 5 + 2);
  });

  it('Plus : une carte Posipi donne +2 dégâts à la prochaine carte Négapi', () => {
    const c = mk(['duo-eclair', 'duo-machoire-electrique', 'duo-eclair', 'duo-eclair', 'duo-eclair']);
    play(c, 'duo-eclair');
    expect(c.duo!.plus).toBe(2);
    const hp = c.enemies[0].hp;
    play(c, 'duo-machoire-electrique');
    expect(hp - c.enemies[0].hp).toBeGreaterThanOrEqual(7); // 5 + 2 (types en plus)
    expect(c.duo!.plus).toBe(0);
  });

  it('Moins : −1 PA sur la prochaine carte Posipi à 2 PA ou plus', () => {
    const c = mk(['duo-bouclier', 'duo-tonnerre', 'duo-eclair', 'duo-eclair', 'duo-eclair']);
    play(c, 'duo-bouclier');
    const t = c.hand.find((x) => x.defId === 'duo-tonnerre')!;
    expect(c.costOf(t)).toBe(1);
  });

  it('Surcharge : Posipi → Négapi → Posipi → Négapi crée une Décharge Synchro', () => {
    const c = mk(['duo-eclair', 'duo-bouclier', 'duo-eclair', 'duo-bouclier', 'duo-eclair']);
    play(c, 'duo-eclair'); play(c, 'duo-bouclier'); play(c, 'duo-eclair'); play(c, 'duo-bouclier');
    expect(c.hand.some((x) => x.defId === 'duo-decharge-synchro')).toBe(true);
  });

  it('Court-Circuit : si le premier tombe, l’autre prend la place ; ses cartes deviennent injouables', () => {
    const c = mk(['duo-eclair', 'duo-bouclier', 'duo-eclair', 'duo-bouclier', 'duo-eclair']);
    (c as unknown as { applyHpLoss: (f: unknown, w: string, n: number) => void }).applyHpLoss(c.player, 'player', 99);
    expect(c.phase).toBe('joueur');
    expect(c.duo!.front).toBe('negapi');
    expect(c.duoBoth()).toBe(false);
    const e = c.hand.find((x) => x.defId === 'duo-eclair')!;
    expect(c.canPlay(e)).toBe(false);
  });

  it('les objets n’agissent que si leur porteur est devant', () => {
    const c = mk(Array(10).fill('duo-eclair'), { relics: ['bracelet-macho'], relicOwner: { 'bracelet-macho': 'negapi' } });
    expect(c.has('bracelet-macho')).toBe(false);
  });

  it('Run : le soin relève un partenaire K.O., la remise à niveau non', () => {
    const r = new Run('D', 'duo');
    r.duoHp = { posipi: 0, negapi: 20 };
    r.hp = 80; r.syncDuo();
    expect(r.duoHp).toEqual({ posipi: 0, negapi: 40 });
    r.heal(20);
    expect(r.duoHp.posipi).toBe(20);
  });
});

it('Duo : +3 PV max chacun à chaque acte, et un partenaire K.O. se relève', () => {
  const r = new Run('D2', 'duo');
  r.duoHp = { posipi: 0, negapi: 12 };
  r.hp = 12;
  r.nextAct();
  expect(r.maxHp).toBe(86);
  expect(r.duoHp).toEqual({ posipi: 43, negapi: 43 });
});

describe('Pointeau ADN : fusion en Multipi', () => {
  it('PV réunis, cartes de départ fusionnées, cartes X proposées seulement après', () => {
    const r = new Run('F', 'duo');
    r.duoHp = { posipi: 30, negapi: 20 }; r.hp = 50;
    r.fuseDuo();
    expect(r.duoFused).toBe(true);
    expect(r.hp).toBe(50);
    expect(r.form.name).toBe('Multipi');
    expect(r.deck.filter((c) => c.defId === 'duo-fusion-eclair')).toHaveLength(4);
    expect(r.deck).toHaveLength(6);
    expect(r.offerable([{ category: 'attaque', duoFusion: true }])).toHaveLength(1);
    const r2 = new Run('G', 'duo');
    expect(r2.offerable([{ category: 'attaque', duoFusion: true }])).toHaveLength(0);
  });
  it('+1 PA, Plus et Moins sur toutes les cartes, coût X', () => {
    const deck = ['duo-fusion-eclair', 'duo-fusion-eclair', 'duo-decharge-x', 'duo-fusion-eclair', 'duo-fusion-eclair'].map((defId, i) => ({ uid: i + 1, defId, upgraded: false }));
    const c = new Combat({ character: 'duo', deck, enemies: ['rattata'], seed: 'X', relics: [], duoFused: true, hp: 70, maxHp: 80 } as never);
    c.enemies[0].hp = c.enemies[0].maxHp = 999;
    expect(c.player.maxEnergy).toBe(4);
    expect(c.duo).toBeNull();
    const e = c.hand.find((x) => x.defId === 'duo-fusion-eclair')!;
    c.play(e.uid);
    expect(c.player.block).toBe(5 + 2);
    expect(c.fusedPlus).toBe(2);
    const x = c.hand.find((k) => k.defId === 'duo-decharge-x')!;
    expect(c.costOf(x)).toBe(3);
    const hp = c.enemies[0].hp;
    c.play(x.uid);
    expect(c.player.energy).toBe(0);
    expect(hp - c.enemies[0].hp).toBeGreaterThanOrEqual(3 * 9);
  });
});
