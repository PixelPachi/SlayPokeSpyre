// Météo et terrains : ils changent le combat pendant quelques tours pour TOUS les Pokémon (toi comme les ennemis).
import type { PokeType } from './types';

export type WeatherId = 'zenith' | 'pluie' | 'tempete-sable' | 'grele' | 'neige' | 'brouillard' | 'soleil-intense' | 'deluge' | 'turbulence';
export type TerrainId = 'champ-herbu' | 'champ-electrifie' | 'champ-psychique' | 'champ-brumeux';

export const WEATHER: Record<WeatherId, { name: string; icon: string; text: string; mult: Partial<Record<PokeType, number>>; chip?: { dmg: number; immune: PokeType[] }; guard?: { types: PokeType[]; block: number } }> = {
  zenith: { name: 'Zénith', icon: '☀️', text: 'Attaques Feu ×1,5, attaques Eau ×0,5.', mult: { feu: 1.5, eau: 0.5 } },
  pluie: { name: 'Pluie', icon: '🌧️', text: 'Attaques Eau ×1,5, attaques Feu ×0,5.', mult: { eau: 1.5, feu: 0.5 } },
  'tempete-sable': { name: 'Tempête de Sable', icon: '🌪️', text: 'À la fin du tour, les Pokémon qui ne sont pas Roche, Sol ou Acier perdent 3 PV. Attaques Roche ×1,3.',
    mult: { roche: 1.3 }, chip: { dmg: 3, immune: ['roche', 'sol', 'acier'] } },
  grele: { name: 'Grêle', icon: '🌨️', text: 'À la fin du tour, les Pokémon qui ne sont pas Glace perdent 3 PV. Attaques Glace ×1,3.',
    mult: { glace: 1.3 }, chip: { dmg: 3, immune: ['glace'] } },
  neige: { name: 'Neige', icon: '❄️', text: 'Attaques Glace ×1,3. À la fin du tour, les Pokémon Glace gagnent 5 Protection.',
    mult: { glace: 1.3 }, guard: { types: ['glace'], block: 5 } },
  brouillard: { name: 'Brouillard', icon: '🌁', text: 'Attaques Spectre et Ténèbres ×1,3, attaques Normal et Combat ×0,7.', mult: { spectre: 1.3, tenebres: 1.3, normal: 0.7, combat: 0.7 } },
  'soleil-intense': { name: 'Soleil Intense', icon: '🔆', text: 'Attaques Feu ×1,5. Les attaques Eau s’évaporent : elles n’infligent aucun dégât.', mult: { feu: 1.5, eau: 0 } },
  deluge: { name: 'Déluge', icon: '⛈️', text: 'Attaques Eau ×1,5. Les attaques Feu s’éteignent : elles n’infligent aucun dégât.', mult: { eau: 1.5, feu: 0 } },
  turbulence: { name: 'Turbulence', icon: '🌀', text: 'Attaques Vol ×1,5. Les attaques Glace, Électrik et Roche sont déviées : ×0,7.', mult: { vol: 1.5, glace: 0.7, electrik: 0.7, roche: 0.7 } },
};

export const TERRAINS: Record<TerrainId, { name: string; icon: string; text: string; mult: Partial<Record<PokeType, number>> }> = {
  'champ-herbu': { name: 'Champ Herbu', icon: '🌿', text: 'À la fin du tour, tous les Pokémon récupèrent 3 PV. Attaques Plante ×1,3.', mult: { plante: 1.3 } },
  'champ-electrifie': { name: 'Champ Électrifié', icon: '⚡', text: 'Attaques Électrik ×1,3. Personne ne peut s’endormir.', mult: { electrik: 1.3 } },
  'champ-psychique': { name: 'Champ Psychique', icon: '🔮', text: 'Attaques Psy ×1,3. Personne ne peut être Confus.', mult: { psy: 1.3 } },
  'champ-brumeux': { name: 'Champ Brumeux', icon: '🌫️', text: 'Attaques Dragon ×0,5. Personne ne peut subir de statut négatif.', mult: { dragon: 0.5 } },
};

export const isWeather = (id: string): id is WeatherId => id in WEATHER;

/** Durée fixe de toutes les météos et de tous les champs. */
export const FIELD_TURNS = 5;
/** Type joué au moment où la météo / le champ apparaît (son). */
export const FIELD_TYPE: Record<WeatherId | TerrainId, PokeType> = {
  zenith: 'feu', pluie: 'eau', 'tempete-sable': 'roche', grele: 'glace', neige: 'glace', brouillard: 'spectre',
  'soleil-intense': 'feu', deluge: 'eau', turbulence: 'vol',
  'champ-herbu': 'plante', 'champ-electrifie': 'electrik', 'champ-psychique': 'psy', 'champ-brumeux': 'fee',
};
