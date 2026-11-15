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
}

export const ZONES: ZoneDef[] = [
  {
    id: 'foret-de-jade', name: 'Forêt de Jade', region: 'Kanto', act: 1,
    encounters: [['chenipan', 'aspicot'], ['roucool'], ['rattata', 'rattata'], ['chenipan', 'rattata'], ['aspicot', 'aspicot']],
    elites: [['rattatac']], boss: 'dardargnan',
    background: 'backgrounds/foret-de-jade.png', palette: ['#a9dcaa', '#4a7a2f', '#163322'], mood: 'insecte',
  },
  {
    id: 'bois-aux-chenes', name: 'Bois aux Chênes', region: 'Johto', act: 1,
    encounters: [['hoothoot'], ['coxy', 'mimigal'], ['hoothoot', 'coxy'], ['mimigal', 'mimigal'], ['coxy', 'coxy']],
    elites: [['migalos']], boss: 'scarhino',
    background: 'backgrounds/bois-aux-chenes.png', palette: ['#6f8f6a', '#3d5a2a', '#0f1f14'], mood: 'insecte',
  },
  {
    id: 'bois-clematis', name: 'Bois Clématis', region: 'Hoenn', act: 1,
    encounters: [['zigzaton'], ['chenipotte', 'balignon'], ['zigzaton', 'chenipotte'], ['balignon', 'balignon'], ['chenipotte', 'chenipotte', 'zigzaton']],
    elites: [['chapignon']], boss: 'charmillon',
    background: 'backgrounds/bois-clematis.png', palette: ['#c9e8a0', '#5c8f32', '#25401a'], mood: 'plante',
  },
  {
    id: 'foret-de-vestigion', name: 'Forêt de Vestigion', region: 'Sinnoh', act: 1,
    encounters: [['cheniti', 'apitrini'], ['ceribou'], ['apitrini', 'apitrini'], ['cheniti', 'ceribou'], ['cheniti', 'cheniti', 'apitrini']],
    elites: [['cerifleur']], boss: 'apireine',
    background: 'backgrounds/foret-de-vestigion.png', palette: ['#9fc4b8', '#3f6a4a', '#13281d'], mood: 'plante',
  },
  {
    id: 'foret-d-empoigne', name: "Forêt d'Empoigne", region: 'Unys', act: 1,
    encounters: [['larveyette', 'venipatte'], ['chlorobule'], ['venipatte', 'venipatte'], ['larveyette', 'chlorobule'], ['larveyette', 'larveyette', 'venipatte']],
    elites: [['couverdure']], boss: 'brutapode',
    background: 'backgrounds/foret-d-empoigne.png', palette: ['#b4d98a', '#557a2c', '#1e3412'], mood: 'insecte',
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
