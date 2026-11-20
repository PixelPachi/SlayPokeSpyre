// Les baies : l'équivalent des potions de Slay the Spire. 3 emplacements par run.
// Pour l'instant ce sont des emplacements réservés : nom, icône et rareté ; les effets viendront ensuite.

export type BerryRarity = 'commune' | 'peu-commune' | 'rare';

export interface BerryDef {
  id: string;
  name: string;
  /** Sprite dans sprites/items de PokeAPI (ex. oran-berry). */
  sprite: string;
  rarity: BerryRarity;
  /** Effet en jeu ; vide tant qu'il n'est pas décidé. */
  text: string;
}

const b = (id: string, name: string, rarity: BerryRarity): BerryDef =>
  ({ id, name: `Baie ${name}`, sprite: `${id}-berry`, rarity, text: '' });

export const BERRIES: BerryDef[] = [
  // Baies de soin et de statut
  b('cheri', 'Ceriz', 'commune'), b('chesto', 'Maron', 'commune'), b('pecha', 'Pêcha', 'commune'),
  b('rawst', 'Fraive', 'commune'), b('aspear', 'Willia', 'commune'), b('leppa', 'Mepo', 'commune'),
  b('oran', 'Oran', 'commune'), b('persim', 'Kika', 'commune'), b('lum', 'Prine', 'peu-commune'),
  b('sitrus', 'Sitrus', 'peu-commune'),
  // Baies de confusion (gros soin, goût)
  b('figy', 'Figuy', 'peu-commune'), b('wiki', 'Wiki', 'peu-commune'), b('mago', 'Mago', 'peu-commune'),
  b('aguav', 'Gowav', 'peu-commune'), b('iapapa', 'Papaya', 'peu-commune'),
  // Baies d'amitié
  b('razz', 'Framby', 'commune'), b('pomeg', 'Grena', 'commune'), b('kelpsy', 'Alga', 'commune'),
  b('qualot', 'Qualot', 'commune'), b('hondew', 'Lonme', 'commune'), b('grepa', 'Résin', 'commune'),
  b('tamato', 'Tamato', 'commune'),
  // Baies de résistance aux types
  b('occa', 'Chocco', 'peu-commune'), b('passho', 'Pocpoc', 'peu-commune'), b('wacan', 'Parma', 'peu-commune'),
  b('rindo', 'Ratam', 'peu-commune'), b('yache', 'Nanone', 'peu-commune'), b('chople', 'Pomroz', 'peu-commune'),
  b('kebia', 'Kébia', 'peu-commune'), b('shuca', 'Jouca', 'peu-commune'), b('coba', 'Cobaba', 'peu-commune'),
  b('payapa', 'Yapap', 'peu-commune'), b('tanga', 'Panga', 'peu-commune'), b('charti', 'Charti', 'peu-commune'),
  b('kasib', 'Sédra', 'peu-commune'), b('haban', 'Fraigo', 'peu-commune'), b('colbur', 'Lampou', 'peu-commune'),
  b('babiri', 'Babiri', 'peu-commune'),
  // Baies de pincement (rares)
  b('liechi', 'Lichii', 'rare'), b('ganlon', 'Lingan', 'rare'), b('salac', 'Sailak', 'rare'), b('petaya', 'Pitaye', 'rare'),
];

export const BERRY_DEFS: Record<string, BerryDef> = Object.fromEntries(BERRIES.map((x) => [x.id, x]));
export const MAX_BERRIES = 3;

export function berryPrice(id: string): number {
  return { commune: 45, 'peu-commune': 65, rare: 90 }[BERRY_DEFS[id].rarity];
}
