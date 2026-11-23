// Capacités de météo et de terrain apprises par certains ennemis.
import type { EnemyMove } from '../core/model';
import { ENEMY_DEFS } from './enemies';

const MOVES: Record<string, EnemyMove> = {
  ceribou: { id: 'zenith', name: 'Zénith', weight: 25, intent: 'boost', meteo: 'zenith' },
  chlorobule: { id: 'champ-herbu', name: 'Champ Herbu', weight: 20, intent: 'boost', meteo: 'champ-herbu' },
  ptitard: { id: 'danse-pluie', name: 'Danse Pluie', weight: 20, intent: 'boost', meteo: 'pluie' },
  spoink: { id: 'champ-psychique', name: 'Champ Psychique', weight: 15, intent: 'boost', meteo: 'champ-psychique' },
  kaorine: { id: 'champ-psychique', name: 'Champ Psychique', weight: 15, intent: 'boost', meteo: 'champ-psychique' },
  onix: { id: 'tempete-sable', name: 'Tempête de Sable', weight: 15, intent: 'boost', meteo: 'tempete-sable' },
  camerupt: { id: 'zenith', name: 'Zénith', weight: 15, intent: 'boost', meteo: 'zenith', block: 10 },
  ohmassacre: { id: 'champ-electrifie', name: 'Champ Électrifié', weight: 15, intent: 'boost', meteo: 'champ-electrifie', block: 10 },
  melodelfe: { id: 'champ-brumeux', name: 'Champ Brumeux', weight: 15, intent: 'boost', meteo: 'champ-brumeux', block: 8 },
  // Nouvelles météos
  blizzi: { id: 'neige', name: 'Neige', weight: 20, intent: 'boost', meteo: 'neige', block: 6 },
  lokhlass: { id: 'neige', name: 'Neige', weight: 15, intent: 'boost', meteo: 'neige', block: 8 },
  spectrum: { id: 'brouillard', name: 'Brouillard', weight: 20, intent: 'boost', meteo: 'brouillard' },
  feuforeve: { id: 'brouillard', name: 'Brouillard', weight: 15, intent: 'boost', meteo: 'brouillard', block: 6 },
  heatran: { id: 'soleil-intense', name: 'Soleil Intense', weight: 15, intent: 'boost', meteo: 'soleil-intense', block: 14 },
  tritosor: { id: 'deluge', name: 'Déluge', weight: 15, intent: 'boost', meteo: 'deluge', block: 8 },
  corayon: { id: 'deluge', name: 'Déluge', weight: 15, intent: 'boost', meteo: 'deluge', block: 8 },
  drattak: { id: 'turbulence', name: 'Turbulence', weight: 15, intent: 'boost', meteo: 'turbulence', block: 12 },
  altaria: { id: 'turbulence', name: 'Turbulence', weight: 15, intent: 'boost', meteo: 'turbulence', block: 10 },
  // Champs aussi chez d'autres Pokémon
  tropius: { id: 'champ-herbu', name: 'Champ Herbu', weight: 15, intent: 'boost', meteo: 'champ-herbu', block: 8 },
  natu: { id: 'champ-psychique', name: 'Champ Psychique', weight: 15, intent: 'boost', meteo: 'champ-psychique' },
};

for (const [id, m] of Object.entries(MOVES)) {
  const e = ENEMY_DEFS[id];
  if (e && !e.moves.some((x) => x.id === m.id)) e.moves.push(m);
}
