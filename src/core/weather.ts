// Météo et terrains : ils changent le combat pendant quelques tours pour TOUS les Pokémon (toi comme les ennemis).
import type { PokeType } from './types';

export type WeatherId = 'zenith' | 'pluie' | 'tempete-sable' | 'grele';
export type TerrainId = 'champ-herbu' | 'champ-electrifie' | 'champ-psychique' | 'champ-brumeux';

export const WEATHER: Record<WeatherId, { name: string; icon: string; text: string; mult: Partial<Record<PokeType, number>>; chip?: { dmg: number; immune: PokeType[] } }> = {
  zenith: { name: 'Zénith', icon: '☀️', text: 'Attaques Feu ×1,5, attaques Eau ×0,5.', mult: { feu: 1.5, eau: 0.5 } },
  pluie: { name: 'Pluie', icon: '🌧️', text: 'Attaques Eau ×1,5, attaques Feu ×0,5.', mult: { eau: 1.5, feu: 0.5 } },
  'tempete-sable': { name: 'Tempête de Sable', icon: '🌪️', text: 'À la fin du tour, les Pokémon qui ne sont pas Roche, Sol ou Acier perdent 3 PV. Attaques Roche ×1,3.',
    mult: { roche: 1.3 }, chip: { dmg: 3, immune: ['roche', 'sol', 'acier'] } },
  grele: { name: 'Grêle', icon: '🌨️', text: 'À la fin du tour, les Pokémon qui ne sont pas Glace perdent 3 PV. Attaques Glace ×1,3.',
    mult: { glace: 1.3 }, chip: { dmg: 3, immune: ['glace'] } },
};

export const TERRAINS: Record<TerrainId, { name: string; icon: string; text: string; mult: Partial<Record<PokeType, number>> }> = {
  'champ-herbu': { name: 'Champ Herbu', icon: '🌿', text: 'À la fin du tour, tous les Pokémon récupèrent 3 PV. Attaques Plante ×1,3.', mult: { plante: 1.3 } },
  'champ-electrifie': { name: 'Champ Électrifié', icon: '⚡', text: 'Attaques Électrik ×1,3. Personne ne peut s’endormir.', mult: { electrik: 1.3 } },
  'champ-psychique': { name: 'Champ Psychique', icon: '🔮', text: 'Attaques Psy ×1,3.', mult: { psy: 1.3 } },
  'champ-brumeux': { name: 'Champ Brumeux', icon: '🌫️', text: 'Attaques Dragon ×0,5. Personne ne peut subir de statut négatif.', mult: { dragon: 0.5 } },
};

export const isWeather = (id: string): id is WeatherId => id in WEATHER;
