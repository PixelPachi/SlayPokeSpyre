// Zones de la Tour du Temps (section 3 et 7 du GDD). À chaque acte, une zone est tirée au hasard.
import type { PokeType } from '../core/types';

export interface ZoneDef {
  id: string;
  name: string;
  region: string;
  act: number;
  /** Combats normaux possibles (ids d'ennemis). */
  encounters: string[][];
  elites: string[][];
  boss: string;
  /** Fond de combat (public/backgrounds) ; tant que l'image n'existe pas, le dégradé de secours s'affiche. */
  background: string;
  /** Couleurs du fond de secours : ciel, sol, ombres. */
  palette: [string, string, string];
  /** Type dominant, pour l'ambiance de la carte. */
  mood: PokeType;
  /** Saison ou ambiance du décor, pour que les zones ne se ressemblent pas. */
  season: string;
  /** Particules animées par-dessus le fond. */
  weather: 'pollen' | 'petales' | 'feuilles-rouges' | 'feuilles-or' | 'neige';
}

export const ZONES: ZoneDef[] = [
  {
    id: 'foret-de-jade', name: 'Forêt de Jade', region: 'Kanto', act: 1,
    encounters: [['chenipan', 'aspicot'], ['roucool'], ['rattata', 'rattata'], ['chenipan', 'rattata'], ['aspicot', 'aspicot']],
    elites: [['rattatac']], boss: 'dardargnan',
    background: 'backgrounds/foret-de-jade.png', palette: ['#bfe6a3', '#4f8a2c', '#163322'], mood: 'insecte',
    season: 'Été lumineux', weather: 'pollen',
  },
  {
    id: 'bois-aux-chenes', name: 'Bois aux Chênes', region: 'Johto', act: 1,
    encounters: [['hoothoot'], ['coxy', 'mimigal'], ['hoothoot', 'coxy'], ['mimigal', 'mimigal'], ['coxy', 'coxy']],
    elites: [['migalos']], boss: 'scarhino',
    background: 'backgrounds/bois-aux-chenes.png', palette: ['#e0a96a', '#7a5528', '#2a1a10'], mood: 'insecte',
    season: 'Automne au crépuscule', weather: 'feuilles-or',
  },
  {
    id: 'bois-clematis', name: 'Bois Clématis', region: 'Hoenn', act: 1,
    encounters: [['zigzaton'], ['chenipotte', 'balignon'], ['zigzaton', 'chenipotte'], ['balignon', 'balignon'], ['chenipotte', 'chenipotte', 'zigzaton']],
    elites: [['chapignon']], boss: 'charmillon',
    background: 'backgrounds/bois-clematis.png', palette: ['#ffd6e8', '#6fa63c', '#2c4a22'], mood: 'plante',
    season: 'Printemps en fleurs', weather: 'petales',
  },
  {
    id: 'foret-de-vestigion', name: 'Forêt de Vestigion', region: 'Sinnoh', act: 1,
    encounters: [['cheniti', 'apitrini'], ['ceribou'], ['apitrini', 'apitrini'], ['cheniti', 'ceribou'], ['cheniti', 'cheniti', 'apitrini']],
    elites: [['cerifleur']], boss: 'apireine',
    background: 'backgrounds/foret-de-vestigion.png', palette: ['#dfeaf2', '#b9c9d4', '#1d2a36'], mood: 'plante',
    season: 'Hiver enneigé', weather: 'neige',
  },
  {
    id: 'foret-d-empoigne', name: "Forêt d'Empoigne", region: 'Unys', act: 1,
    encounters: [['larveyette', 'venipatte'], ['chlorobule'], ['venipatte', 'venipatte'], ['larveyette', 'chlorobule'], ['larveyette', 'larveyette', 'venipatte']],
    elites: [['couverdure']], boss: 'brutapode',
    background: 'backgrounds/foret-d-empoigne.png', palette: ['#ff9a5a', '#a1471f', '#3a1508'], mood: 'insecte',
    season: 'Automne flamboyant', weather: 'feuilles-rouges',
  },
];

export function zonesOfAct(act: number): ZoneDef[] {
  return ZONES.filter((z) => z.act === act);
}

export function zoneDef(id: string): ZoneDef {
  const z = ZONES.find((x) => x.id === id);
  if (!z) throw new Error(`Zone inconnue : ${id}`);
  return z;
}
