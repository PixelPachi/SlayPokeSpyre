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
  weather: 'pollen' | 'petales' | 'feuilles-rouges' | 'feuilles-or' | 'neige'
    | 'cristaux' | 'gouttes' | 'cendres' | 'poussiere' | 'etincelles';
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

  // ——— Acte 2 : le cœur de la tour (grottes et montagnes) ———
  {
    id: 'mont-selenite', name: 'Mont Sélénite', region: 'Kanto', act: 2,
    encounters: [['nosferapti', 'nosferapti'], ['racaillou', 'paras'], ['melofee'], ['nosferapti', 'racaillou'], ['paras', 'paras', 'nosferapti']],
    elites: [['nosferalto']], boss: 'melodelfe',
    background: 'backgrounds/mont-selenite.png', palette: ['#3b3570', '#6b6a8a', '#120f26'], mood: 'fee',
    season: 'Nuit de pleine lune', weather: 'cristaux',
  },
  {
    id: 'puits-ramoloss', name: 'Puits Ramoloss', region: 'Johto', act: 2,
    encounters: [['ramoloss'], ['ptitard', 'smogo'], ['ptitard', 'ptitard'], ['smogo', 'ramoloss'], ['ptitard', 'smogo', 'ptitard']],
    elites: [['flagadoss']], boss: 'roigada',
    background: 'backgrounds/puits-ramoloss.png', palette: ['#5d7f86', '#3d5157', '#11201f'], mood: 'eau',
    season: 'Saison des pluies', weather: 'gouttes',
  },
  {
    id: 'mont-chimnee', name: 'Mont Chimnée', region: 'Hoenn', act: 2,
    encounters: [['chamallot'], ['spoink', 'spinda'], ['chamallot', 'spoink'], ['spinda', 'spinda'], ['spoink', 'spoink', 'chamallot']],
    elites: [['chartor']], boss: 'camerupt',
    background: 'backgrounds/mont-chimnee.png', palette: ['#ff8a4a', '#4a2a22', '#1a0805'], mood: 'feu',
    season: 'Été caniculaire', weather: 'cendres',
  },
  {
    id: 'mont-couronne', name: 'Mont Couronné', region: 'Sinnoh', act: 2,
    encounters: [['machoc', 'moufouette'], ['kranidos'], ['dinoclier', 'machoc'], ['moufouette', 'kranidos'], ['machoc', 'machoc', 'moufouette']],
    elites: [['bastiodon']], boss: 'charkos',
    background: 'backgrounds/mont-couronne.png', palette: ['#9fb0c4', '#5c6675', '#1a2029'], mood: 'roche',
    season: "Brume d'altitude", weather: 'poussiere',
  },
  {
    id: 'grotte-electrolithe', name: 'Grotte Électrolithe', region: 'Unys', act: 2,
    encounters: [['statitik', 'statitik'], ['anchwatt', 'grindur'], ['rototaupe'], ['statitik', 'anchwatt'], ['statitik', 'statitik', 'anchwatt']],
    elites: [['mygavolt']], boss: 'ohmassacre',
    background: 'backgrounds/grotte-electrolithe.png', palette: ['#2a3a6a', '#2b2b3d', '#0b0d1a'], mood: 'electrik',
    season: "Nuit d'orage", weather: 'etincelles',
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
