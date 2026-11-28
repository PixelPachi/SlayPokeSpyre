// Ruines Alpha (acte 1, Johto) : Natu, toutes les formes de Zarbi, Xatu et Mentali en dominants, Girafarig en gardien.
import type { EnemyDef } from '../core/model';

/** Les 28 formes de Zarbi (A à Z, ! et ?) : sprite PokeAPI « 201-b », « 201-exclamation »… */
export const UNOWN_FORMS = [...'abcdefghijklmnopqrstuvwxyz'.split(''), 'exclamation', 'question'];
const label = (f: string) => (f === 'exclamation' ? '!' : f === 'question' ? '?' : f.toUpperCase());

export const UNOWN_ENEMIES: EnemyDef[] = UNOWN_FORMS.map((f) => ({
  id: `zarbi-${f}`, name: `Zarbi ${label(f)}`, dex: 201, types: ['psy'], hp: [10, 13], sprite: f === 'a' ? undefined : `201-${f}`,
  // Zarbi ne connaît que Puissance Cachée : 8 dégâts d'un type tiré au hasard à chaque fois
  moves: [{ id: 'puissance-cachee', name: 'Puissance Cachée', weight: 100, intent: 'attaque', damage: 8, randomType: true }],
}));

export const ALPHA_ENEMIES: EnemyDef[] = [
  ...UNOWN_ENEMIES,
  // ——— Dominants ———
  {
    id: 'xatu', name: 'Xatu', dex: 178, types: ['psy', 'vol'], hp: [44, 48],
    moves: [
      { id: 'psyko-xatu', name: 'Psyko', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 11 },
      { id: 'aeropique', name: 'Aéropique', weight: 30, intent: 'attaque', pokeType: 'vol', damage: 4, hits: 3 },
      { id: 'teleport', name: 'Vœu Soin', weight: 15, intent: 'boost', heal: 10, block: 6 },
      { id: 'onde-folie', name: 'Onde Folie', weight: 20, intent: 'handicap', playerStatus: { status: 'confusion', stacks: 2 } },
    ],
  },
  {
    id: 'mentali', name: 'Mentali', dex: 196, types: ['psy'], hp: [46, 50],
    moves: [
      { id: 'choc-psy', name: 'Choc Psy', weight: 35, intent: 'attaque', pokeType: 'psy', damage: 12 },
      { id: 'vive-attaque-mentali', name: 'Vive-Attaque', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 3, hits: 4 },
      { id: 'reflet-mentali', name: 'Protection', weight: 20, intent: 'defense', block: 14 },
      { id: 'machination-mentali', name: 'Machination', weight: 15, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 6 },
    ],
  },
  // ——— Gardien ———
  {
    id: 'girafarig', name: 'Girafarig', dex: 203, types: ['normal', 'psy'], hp: [88, 88],
    moves: [
      { id: 'choc-mental-gira', name: 'Choc Mental', weight: 30, intent: 'attaque', pokeType: 'psy', damage: 9, playerStatus: { status: 'confusion', stacks: 1 } },
      { id: 'ecrasement', name: 'Écrasement', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 11, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'coup-double-gira', name: 'Coup Double', weight: 20, intent: 'attaque', pokeType: 'normal', damage: 4, hits: 3 },
      { id: 'plenitude-gira', name: 'Plénitude', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 2 }, block: 12 },
    ],
  },
];
