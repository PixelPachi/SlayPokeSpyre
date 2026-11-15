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
    | 'cristaux' | 'gouttes' | 'cendres' | 'poussiere' | 'etincelles'
    | 'braises' | 'blizzard' | 'vent' | 'orage' | 'temps';
}

export const ZONES: ZoneDef[] = [
  {
    id: 'foret-de-jade', name: 'Forêt de Jade', region: 'Kanto', act: 1,
    encounters: [['chenipan', 'aspicot'], ['roucool'], ['rattata', 'rattata'], ['chenipan', 'rattata'], ['aspicot', 'aspicot']],
    elites: [['rattatac']], boss: 'dardargnan',
    background: 'backgrounds/foret-de-jade.jpg', palette: ['#bfe6a3', '#4f8a2c', '#163322'], mood: 'insecte',
    season: 'Été lumineux', weather: 'pollen',
  },
  {
    id: 'bois-aux-chenes', name: 'Bois aux Chênes', region: 'Johto', act: 1,
    encounters: [['hoothoot'], ['coxy', 'mimigal'], ['hoothoot', 'coxy'], ['mimigal', 'mimigal'], ['coxy', 'coxy']],
    elites: [['migalos']], boss: 'scarhino',
    background: 'backgrounds/bois-aux-chenes.jpg', palette: ['#e0a96a', '#7a5528', '#2a1a10'], mood: 'insecte',
    season: 'Automne au crépuscule', weather: 'feuilles-or',
  },
  {
    id: 'bois-clematis', name: 'Bois Clématis', region: 'Hoenn', act: 1,
    encounters: [['zigzaton'], ['chenipotte', 'balignon'], ['zigzaton', 'chenipotte'], ['balignon', 'balignon'], ['chenipotte', 'chenipotte', 'zigzaton']],
    elites: [['chapignon']], boss: 'charmillon',
    background: 'backgrounds/bois-clematis.jpg', palette: ['#ffd6e8', '#6fa63c', '#2c4a22'], mood: 'plante',
    season: 'Printemps en fleurs', weather: 'petales',
  },
  {
    id: 'foret-de-vestigion', name: 'Forêt de Vestigion', region: 'Sinnoh', act: 1,
    encounters: [['cheniti', 'apitrini'], ['ceribou'], ['apitrini', 'apitrini'], ['cheniti', 'ceribou'], ['cheniti', 'cheniti', 'apitrini']],
    elites: [['cerifleur']], boss: 'apireine',
    background: 'backgrounds/foret-de-vestigion.jpg', palette: ['#dfeaf2', '#b9c9d4', '#1d2a36'], mood: 'plante',
    season: 'Hiver enneigé', weather: 'neige',
  },
  {
    id: 'foret-d-empoigne', name: "Forêt d'Empoigne", region: 'Unys', act: 1,
    encounters: [['larveyette', 'venipatte'], ['chlorobule'], ['venipatte', 'venipatte'], ['larveyette', 'chlorobule'], ['larveyette', 'larveyette', 'venipatte']],
    elites: [['couverdure']], boss: 'brutapode',
    background: 'backgrounds/foret-d-empoigne.jpg', palette: ['#ff9a5a', '#a1471f', '#3a1508'], mood: 'insecte',
    season: 'Automne flamboyant', weather: 'feuilles-rouges',
  },

  // ——— Acte 2 : le cœur de la tour (grottes et montagnes) ———
  {
    id: 'mont-selenite', name: 'Mont Sélénite', region: 'Kanto', act: 2,
    encounters: [['nosferapti', 'nosferapti'], ['racaillou', 'paras'], ['melofee'], ['nosferapti', 'racaillou'], ['paras', 'paras', 'nosferapti']],
    elites: [['nosferalto']], boss: 'melodelfe',
    background: 'backgrounds/mont-selenite.jpg', palette: ['#3b3570', '#6b6a8a', '#120f26'], mood: 'fee',
    season: 'Nuit de pleine lune', weather: 'cristaux',
  },
  {
    id: 'puits-ramoloss', name: 'Puits Ramoloss', region: 'Johto', act: 2,
    encounters: [['ramoloss'], ['ptitard', 'smogo'], ['ptitard', 'ptitard'], ['smogo', 'ramoloss'], ['ptitard', 'smogo', 'ptitard']],
    elites: [['flagadoss']], boss: 'roigada',
    background: 'backgrounds/puits-ramoloss.jpg', palette: ['#5d7f86', '#3d5157', '#11201f'], mood: 'eau',
    season: 'Saison des pluies', weather: 'gouttes',
  },
  {
    id: 'mont-chimnee', name: 'Mont Chimnée', region: 'Hoenn', act: 2,
    encounters: [['chamallot'], ['spoink', 'spinda'], ['chamallot', 'spoink'], ['spinda', 'spinda'], ['spoink', 'spoink', 'chamallot']],
    elites: [['chartor']], boss: 'camerupt',
    background: 'backgrounds/mont-chimnee.jpg', palette: ['#ff8a4a', '#4a2a22', '#1a0805'], mood: 'feu',
    season: 'Été caniculaire', weather: 'cendres',
  },
  {
    id: 'mont-couronne', name: 'Mont Couronné', region: 'Sinnoh', act: 2,
    encounters: [['machoc', 'moufouette'], ['kranidos'], ['dinoclier', 'machoc'], ['moufouette', 'kranidos'], ['machoc', 'machoc', 'moufouette']],
    elites: [['bastiodon']], boss: 'charkos',
    background: 'backgrounds/mont-couronne.jpg', palette: ['#9fb0c4', '#5c6675', '#1a2029'], mood: 'roche',
    season: "Brume d'altitude", weather: 'poussiere',
  },
  {
    id: 'grotte-electrolithe', name: 'Grotte Électrolithe', region: 'Unys', act: 2,
    encounters: [['statitik', 'statitik'], ['anchwatt', 'grindur'], ['rototaupe'], ['statitik', 'anchwatt'], ['statitik', 'statitik', 'anchwatt']],
    elites: [['mygavolt']], boss: 'ohmassacre',
    background: 'backgrounds/grotte-electrolithe.jpg', palette: ['#2a3a6a', '#2b2b3d', '#0b0d1a'], mood: 'electrik',
    season: "Nuit d'orage", weather: 'etincelles',
  },

  // ——— Acte 3 : les hauteurs (sommets et lieux légendaires) ———
  {
    id: 'route-victoire', name: 'Route Victoire', region: 'Kanto', act: 3,
    encounters: [['onix'], ['machopeur', 'ossatueur'], ['gravalanch', 'gravalanch'], ['machopeur', 'gravalanch'], ['ossatueur', 'onix']],
    elites: [['mackogneur']], boss: 'dracolosse',
    background: 'backgrounds/route-victoire.jpg', palette: ['#a8743a', '#5a4030', '#1c120c'], mood: 'combat',
    season: 'Nuit aux flambeaux', weather: 'braises',
  },
  {
    id: 'mont-argente', name: 'Mont Argenté', region: 'Johto', act: 3,
    encounters: [['donphan'], ['farfuret', 'feuforeve'], ['ursaring'], ['farfuret', 'farfuret'], ['feuforeve', 'donphan']],
    elites: [['ymphect']], boss: 'tyranocif',
    background: 'backgrounds/mont-argente.jpg', palette: ['#e8eef4', '#aab6c2', '#2a3340'], mood: 'glace',
    season: 'Hiver éternel', weather: 'blizzard',
  },
  {
    id: 'pilier-celeste', name: 'Pilier Céleste', region: 'Hoenn', act: 3,
    encounters: [['kaorine'], ['altaria', 'draby'], ['branette', 'branette'], ['kaorine', 'branette'], ['draby', 'draby', 'altaria']],
    elites: [['drattak']], boss: 'rayquaza',
    background: 'backgrounds/pilier-celeste.jpg', palette: ['#ffd9a8', '#8a8f9a', '#26304a'], mood: 'dragon',
    season: 'Aube au-dessus des nuages', weather: 'vent',
  },
  {
    id: 'mont-abrupt', name: 'Mont Abrupt', region: 'Sinnoh', act: 3,
    encounters: [['magmar'], ['grolem'], ['rhinocorne', 'smogogo'], ['magmar', 'smogogo'], ['rhinocorne', 'magmar']],
    elites: [['maganon']], boss: 'heatran',
    background: 'backgrounds/mont-abrupt.jpg', palette: ['#c2412a', '#4a2620', '#160806'], mood: 'feu',
    season: 'Crépuscule de magma', weather: 'cendres',
  },
  {
    id: 'tour-dragospire', name: 'Tour Dragospire', region: 'Unys', act: 3,
    encounters: [['gringolem'], ['drakkarmin'], ['incisache', 'polarhume'], ['polarhume', 'polarhume'], ['gringolem', 'incisache']],
    elites: [['tranchodon']], boss: 'zekrom',
    background: 'backgrounds/tour-dragospire.jpg', palette: ['#5a6a8a', '#7d8494', '#141a28'], mood: 'dragon',
    season: "Tempête de neige et d'éclairs", weather: 'orage',
  },

  // ——— Sommet : le combat final ———
  {
    id: 'sommet-tour-du-temps', name: 'Sommet de la Tour du Temps', region: 'Tour du Temps', act: 4,
    encounters: [['noctunoir']], elites: [['noctunoir']], boss: 'dialga-primal',
    background: 'backgrounds/sommet-tour-du-temps.jpg', palette: ['#4a3a8a', '#4a4560', '#0a0618'], mood: 'dragon',
    season: 'Le temps se désagrège', weather: 'temps',
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
