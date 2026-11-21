import { expect, it } from 'vitest';
import { typeMultiplier } from '../src/core/types';
it('faiblesse et résistance s’annulent (Lucario neutre au Psy)', () => {
  expect(typeMultiplier('psy', ['combat', 'acier'])).toBe(1);
  expect(typeMultiplier('feu', ['combat', 'acier'])).toBe(1.5);
  expect(typeMultiplier('sol', ['combat', 'acier'])).toBe(1.5);
  expect(typeMultiplier('combat', ['combat', 'acier'])).toBe(1.5);
  expect(typeMultiplier('insecte', ['combat', 'acier'])).toBe(0.25);
  expect(typeMultiplier('glace', ['plante', 'vol'])).toBe(2.25);
  expect(typeMultiplier('normal', ['spectre'])).toBe(0.5);
  expect(typeMultiplier('eau', ['feu', 'eau'])).toBe(1);
});
