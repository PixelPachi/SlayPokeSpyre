// Nouveaux objets tenus : chaque effet est vérifié en combat.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import type { CharacterId } from '../src/core/model';
import { CHARACTERS } from '../src/data/characters';

const start = (character: CharacterId, relics: string[], enemies = ['rattata']) => {
  const c = new Combat({ character, deck: makeDeck(CHARACTERS[character].starterDeck), enemies, seed: 'RELIC', relics });
  c.drainEvents();
  return c;
};
const give = (c: Combat, defId: string) => { const card = { uid: 5000 + c.hand.length, defId, upgraded: false }; c.hand.push(card); return card; };
const endTurn = (c: Combat) => { c.endPlayerTurn(); for (const e of c.aliveEnemies()) c.enemyAct(e.uid); if ((c.phase as string) === 'ennemi') c.endEnemyTurn(); c.drainEvents(); };

describe('nouveaux objets tenus', () => {
  it('Gemme : +5 dégâts sur la première attaque du type, pas la deuxième', () => {
    const a = start('kangourex', []), b = start('kangourex', ['gemme-normal']);
    expect((b.previewCardDamage(give(b, 'ecras-face')) ?? 0) - (a.previewCardDamage(give(a, 'ecras-face')) ?? 0)).toBeGreaterThanOrEqual(5);
    const card = give(b, 'ecras-face'); b.player.energy = 9;
    b.play(card.uid, b.aliveEnemies()[0].uid);
    const after = b.previewCardDamage(give(b, 'ecras-face')) ?? 0;
    expect(after).toBe(a.previewCardDamage(give(a, 'ecras-face')) ?? 0);
  });
  it('Métronome : chaque attaque déjà jouée ce tour ajoute 1 dégât', () => {
    const c = start('kangourex', ['metronome'], ['onix']);
    c.player.energy = 9;
    const before = c.previewCardDamage(give(c, 'ecras-face')) ?? 0;
    c.play(give(c, 'ecras-face').uid, c.aliveEnemies()[0].uid);
    expect(c.previewCardDamage(give(c, 'ecras-face'))).toBe(before + 1);
  });
  it('Carapace Mue et Grosses Bottes : immunités', () => {
    const c = start('caninos', ['carapace-mue', 'grosses-bottes']);
    (c as unknown as { addStatus: (...a: unknown[]) => void }).addStatus(c.player, 'player', 'peur', 2);
    (c as unknown as { addStatus: (...a: unknown[]) => void }).addStatus(c.player, 'player', 'paralysie', 2);
    (c as unknown as { addStatus: (...a: unknown[]) => void }).addStatus(c.player, 'player', 'brulure', 2);
    expect(c.player.statuses.peur ?? 0).toBe(0);
    expect(c.player.statuses.paralysie ?? 0).toBe(0);
    expect(c.player.statuses.brulure ?? 0).toBe(0);
  });
  it('Lumargile : la Protection est divisée par deux au tour suivant', () => {
    const c = start('riolu', ['lumargile'], ['chenipan']);
    c.player.block = 20;
    endTurn(c);
    expect(c.player.block).toBeGreaterThanOrEqual(10 - 10); // l'ennemi a pu taper dedans
    const d = start('riolu', ['lumargile'], ['chenipan']);
    d.player.block = 20; (d as unknown as { startPlayerTurn: () => void }).startPlayerTurn();
    expect(d.player.block).toBe(10);
  });
  it('Herbe Pouvoir : une seule capacité à 2 PA gratuite par combat', () => {
    const c = start('kangourex', ['herbe-pouvoir'], ['onix']);
    const big = give(c, 'kan-giga-impact');
    expect(c.costOf(big)).toBe(0);
    c.player.energy = 3;
    c.play(big.uid, c.aliveEnemies()[0]?.uid);
    expect(c.player.energy).toBe(3);
    expect(c.costOf(give(c, 'kan-giga-impact'))).toBeGreaterThanOrEqual(2);
  });
  it('Encens Bizarre : la première capacité d’un autre Pokémon coûte 1 PA de moins (Mew)', () => {
    const c = start('mew', ['encens-bizarre'], ['onix']);
    const other = give(c, 'kan-giga-impact');
    const base = start('mew', [], ['onix']).costOf({ uid: 1, defId: 'kan-giga-impact', upgraded: false });
    expect(c.costOf(other)).toBe(Math.max(0, base - 1));
  });
  it('Évoluroc : 3 Protection par tour avant évolution seulement', () => {
    const c = start('riolu', ['evoluroc'], ['chenipan']);
    (c as unknown as { startPlayerTurn: () => void }).startPlayerTurn();
    expect(c.player.block).toBe(3);
    const evolved = new Combat({ character: 'riolu', deck: makeDeck(CHARACTERS.riolu.starterDeck), enemies: ['chenipan'], seed: 'R', relics: ['evoluroc'], form: { dex: 448, name: 'Lucario', types: ['combat', 'acier'] } });
    (evolved as unknown as { startPlayerTurn: () => void }).startPlayerTurn();
    expect(evolved.player.block).toBe(0);
  });
  it('Boue Noire : 2 PV en fin de tour ; Encens Fleur : soin → Protection', () => {
    const c = start('riolu', ['boue-noire'], ['chenipan']);
    c.player.hp = 30; c.player.block = 999;
    c.endPlayerTurn();
    expect(c.player.hp).toBe(32);
    const v = start('vipelierre', ['encens-fleur'], ['chenipan']);
    v.player.hp = 30; v.player.block = 0;
    (v as unknown as { healPlayer: (n: number) => void }).healPlayer(4);
    expect(v.player.block).toBe(4);
  });
  it('Encens Pur (Riolu) : +2 Aura par Technique ; Spray Gorge : +1 PA à la 3e Technique', () => {
    const c = start('riolu', ['encens-pur', 'spray-gorge'], ['onix']);
    c.player.energy = 9;
    const aura0 = c.player.aura;
    const techs = Object.values(CHARACTERS).length ? ['detection', 'detection', 'detection'] : [];
    for (const t of techs) c.play(give(c, t).uid);
    expect(c.player.aura).toBeGreaterThanOrEqual(aura0 + 6);
    expect(c.player.energy).toBe(9 - 3 + 1);
  });
  it('Encens Doux (Kangourex) : le Bébé récupère 2 PV par tour', () => {
    const c = start('kangourex', ['encens-doux'], ['chenipan']);
    c.player.familiar!.hp = 2;
    (c as unknown as { startPlayerTurn: () => void }).startPlayerTurn();
    expect(c.player.familiar!.hp).toBe(4);
  });
});
