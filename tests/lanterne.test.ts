// Caninos, Chien de la Lanterne : Lanterne Bleue (3 Âmes), Feu des Âmes, Léchouilles et cartes Spectre.
import { describe, expect, it } from 'vitest';
import { Combat, makeDeck } from '../src/core/combat';
import { Run } from '../src/core/run';
import { skinDef } from '../src/data/skins';
import { cardDef } from '../src/data/cards';

const skinRun = () => { const r = new Run('LANT', 'caninos'); r.applySkin('lanterne', skinDef('caninos', 'lanterne')); return r; };

describe('Chien de la Lanterne', () => {
  it('deck et objet de départ', () => {
    const r = skinRun();
    expect(r.relics).toContain('lanterne-bleue');
    expect(r.relics).not.toContain('charbon');
    expect(r.deck.filter((c) => c.defId === 'can-lechouille-ame')).toHaveLength(4);
    expect(r.deck.some((c) => c.defId === 'griffe')).toBe(false);
  });
  it('3 Âmes dans la pioche, pas d’Intimidation, Feu des Âmes sur les pioches du tour', () => {
    const r = skinRun();
    const c = new Combat({ character: 'caninos', deck: r.deck, enemies: ['onix', 'onix'], seed: 'LANT', relics: r.relics, skin: 'lanterne', hp: 200, maxHp: 200 });
    c.drainEvents();
    const all = [...c.drawPile, ...c.hand];
    expect(all.filter((x) => x.defId === 'can-ame')).toHaveLength(3);
    for (const e of c.aliveEnemies()) expect(e.statuses.attaque ?? 0).toBe(0);
    const hp = c.aliveEnemies().map((e) => e.hp + e.block);
    c.player.energy = 9;
    c.hand.push({ uid: 9999, defId: 'can-ame', upgraded: false });
    c.drawPile.push(...makeDeck(['abri', 'abri']));
    c.play(9999);
    c.aliveEnemies().forEach((e, i) => expect(hp[i] - (e.hp + e.block)).toBe(12));
  });
  it('peut obtenir les cartes Spectre des autres Pokémon (sans celles du Bébé ou de l’Aura)', () => {
    const r = skinRun();
    const seen = new Set<string>();
    for (let i = 0; i < 400; i++) for (const id of r.cardChoices('elite')) seen.add(id);
    expect([...seen].some((id) => cardDef(id).pokeType === 'spectre' && cardDef(id).character !== 'caninos')).toBe(true);
    expect(seen.has('kan-souvenir')).toBe(false);
  });
});
