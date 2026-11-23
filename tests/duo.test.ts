// Gardiens en duo (Bois Clématis) : Lumivole soutient Muciole ; Reshiram, gardien possible de la Tour Dragospire.
import { describe, expect, it } from 'vitest';
import { Combat } from '../src/core/combat';
import { Run } from '../src/core/run';
import { ZONES } from '../src/data/zones';

describe('gardiens possibles', () => {
  it('Lumivole donne sa Protection à Muciole', () => {
    const c = new Combat({ character: 'riolu', deck: [], enemies: ['muciole', 'lumivole'], seed: 'DUO', relics: [] } as never);
    const [mu, lu] = c.enemies;
    lu.intent = { id: 'mur-lumiere', name: 'Mur Lumière', weight: 1, intent: 'defense', ally: true, block: 12 } as never;
    mu.intent = { id: 'lumiqueue', name: 'Lumiqueue', weight: 1, intent: 'boost' } as never;
    c.endPlayerTurn();
    c.enemyAct(lu.uid);
    expect(mu.block).toBeGreaterThan(0);
    expect(lu.block).toBe(0);
  });
  it('le gardien du Bois Clématis peut être le duo, celui de Dragospire Reshiram', () => {
    const seen = { duo: false, reshiram: false };
    for (let i = 0; i < 40; i++) {
      const r = new Run('s' + i, 'riolu');
      r.zone = ZONES.find((z) => z.id === 'bois-clematis')!;
      if (r.bossId === 'muciole+lumivole') seen.duo = true;
      r.zone = ZONES.find((z) => z.id === 'tour-dragospire')!;
      if (r.bossId === 'reshiram') seen.reshiram = true;
    }
    expect(seen).toEqual({ duo: true, reshiram: true });
  });
});
