// Les 18 types Pokémon et la table des faiblesses / résistances.

export const POKE_TYPES = [
  'normal', 'feu', 'eau', 'plante', 'electrik', 'glace', 'combat', 'poison', 'sol',
  'vol', 'psy', 'insecte', 'roche', 'spectre', 'dragon', 'tenebres', 'acier', 'fee',
] as const;

export type PokeType = (typeof POKE_TYPES)[number];

export const TYPE_LABELS: Record<PokeType, string> = {
  normal: 'Normal', feu: 'Feu', eau: 'Eau', plante: 'Plante', electrik: 'Électrik',
  glace: 'Glace', combat: 'Combat', poison: 'Poison', sol: 'Sol', vol: 'Vol', psy: 'Psy',
  insecte: 'Insecte', roche: 'Roche', spectre: 'Spectre', dragon: 'Dragon',
  tenebres: 'Ténèbres', acier: 'Acier', fee: 'Fée',
};

/** Multiplicateurs de la section 4 du GDD. */
export const SUPER_EFFECTIVE = 1.5;
export const NOT_VERY_EFFECTIVE = 0.5;
export const IMMUNE = 0.5; // jamais 0 : une « immunité » divise seulement les dégâts par deux
export const SAME_TYPE_BONUS = 1.25;

type Row = { se?: PokeType[]; nve?: PokeType[]; imm?: PokeType[] };

/** Type de l'attaque -> types défenseurs touchés. */
const CHART: Record<PokeType, Row> = {
  normal: { nve: ['roche', 'acier'], imm: ['spectre'] },
  feu: { se: ['plante', 'glace', 'insecte', 'acier'], nve: ['feu', 'eau', 'roche', 'dragon'] },
  eau: { se: ['feu', 'sol', 'roche'], nve: ['eau', 'plante', 'dragon'] },
  plante: { se: ['eau', 'sol', 'roche'], nve: ['feu', 'plante', 'poison', 'vol', 'insecte', 'dragon', 'acier'] },
  electrik: { se: ['eau', 'vol'], nve: ['electrik', 'plante', 'dragon'], imm: ['sol'] },
  glace: { se: ['plante', 'sol', 'vol', 'dragon'], nve: ['feu', 'eau', 'glace', 'acier'] },
  combat: { se: ['normal', 'glace', 'roche', 'tenebres', 'acier'], nve: ['poison', 'vol', 'psy', 'insecte', 'fee'], imm: ['spectre'] },
  poison: { se: ['plante', 'fee'], nve: ['poison', 'sol', 'roche', 'spectre'], imm: ['acier'] },
  sol: { se: ['feu', 'electrik', 'poison', 'roche', 'acier'], nve: ['plante', 'insecte'], imm: ['vol'] },
  vol: { se: ['plante', 'combat', 'insecte'], nve: ['electrik', 'roche', 'acier'] },
  psy: { se: ['combat', 'poison'], nve: ['psy', 'acier'], imm: ['tenebres'] },
  insecte: { se: ['plante', 'psy', 'tenebres'], nve: ['feu', 'combat', 'poison', 'vol', 'spectre', 'acier', 'fee'] },
  roche: { se: ['feu', 'glace', 'vol', 'insecte'], nve: ['combat', 'sol', 'acier'] },
  spectre: { se: ['psy', 'spectre'], nve: ['tenebres'], imm: ['normal'] },
  dragon: { se: ['dragon'], nve: ['acier'], imm: ['fee'] },
  tenebres: { se: ['psy', 'spectre'], nve: ['combat', 'tenebres', 'fee'] },
  acier: { se: ['glace', 'roche', 'fee'], nve: ['feu', 'eau', 'electrik', 'acier'] },
  fee: { se: ['combat', 'dragon', 'tenebres'], nve: ['feu', 'poison', 'acier'] },
};

/** Multiplicateur d'une attaque de type `attack` contre un Pokémon de types `defender`. */
export function typeMultiplier(attack: PokeType, defender: readonly PokeType[]): number {
  const row = CHART[attack];
  // Comme dans les jeux, une faiblesse et une résistance s'annulent (×2 × ½ = ×1) :
  // on compte les faiblesses (+1) et les résistances (−1), puis on applique le bilan.
  let net = 0;
  let immune = false;
  for (const t of defender) {
    if (row.imm?.includes(t)) immune = true;
    else if (row.se?.includes(t)) net++;
    else if (row.nve?.includes(t)) net--;
  }
  let m = net > 0 ? SUPER_EFFECTIVE ** net : net < 0 ? NOT_VERY_EFFECTIVE ** -net : 1;
  // Avec une immunité, on garde toujours au moins la moitié des dégâts (pas de combat bloqué)
  if (immune) m = Math.max(IMMUNE, m * IMMUNE);
  return m;
}

export type Effectiveness = 'super' | 'normal' | 'faible' | 'immunite';

export function effectivenessOf(multiplier: number, hasImmunity: boolean): Effectiveness {
  if (hasImmunity) return 'immunite';
  if (multiplier > 1) return 'super';
  if (multiplier < 1) return 'faible';
  return 'normal';
}

export function hasImmunity(attack: PokeType, defender: readonly PokeType[]): boolean {
  return defender.some((t) => CHART[attack].imm?.includes(t));
}
