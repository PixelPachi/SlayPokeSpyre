// Déblocage des cartes avec l'EXP gagnée en fin de run (par Pokémon).
import type { CharacterId } from '../core/model';

/** EXP totale nécessaire pour atteindre chaque niveau (index 0 = niveau 1). */
export const LEVEL_EXP = [0, 80, 180, 300, 450, 630, 840, 1080, 1350, 1650];
export const MAX_LEVEL = LEVEL_EXP.length;

/** Cartes débloquées à chaque niveau. Le niveau 1 = cartes disponibles dès la première run. */
export const UNLOCKS: Partial<Record<CharacterId, Record<number, string[]>>> = {
  riolu: {
    1: ['mach-punch', 'vive-attaque', 'riposte', 'balayette', 'tenacite', 'forte-paume', 'pisto-poing', 'onde-vide',
      'eclate-roc', 'prevention', 'vibrobscur', 'coup-croix', 'gonflette', 'vitesse-extreme'],
    2: ['griffe-acier', 'riolu-morsure', 'grincement', 'coup-main', 'casse-brique', 'balayage', 'contre', 'close-combat', 'plenitude'],
    3: ['tomberoche', 'pietisol', 'meteores', 'facade', 'affilage', 'poing-boost', 'vampi-poing', 'lire-esprit'],
    4: ['grimace', 'poing-eclair', 'poing-glace', 'represailles', 'rengorgement', 'charge-os', 'hate', 'machination'],
    5: ['vibraqua', 'aeropique', 'griffe-ombre', 'force', 'mur-de-fer', 'clonage', 'machouille'],
    6: ['direct-toxik', 'poing-meteore', 'draco-choc', 'projection', 'pied-bruleur', 'vibra-soin', 'strido-son', 'megapoing'],
    7: ['queue-de-fer', 'plaquage', 'belier', 'seisme', 'lame-de-roc', 'photocopie', 'danse-lames'],
    8: ['eboulement', 'psyko', 'ball-ombre', 'luminocanon', 'metronome', 'ultimawashi'],
    9: ['pied-voltige', 'tout-ou-rien', 'exploforce', 'mitra-poing'],
    10: ['metalaser', 'ultralaser'],
  },
};

export function levelFor(exp: number): number {
  let lvl = 1;
  for (let i = 0; i < LEVEL_EXP.length; i++) if (exp >= LEVEL_EXP[i]) lvl = i + 1;
  return lvl;
}

export function unlockedCards(character: CharacterId, level: number): string[] {
  const table = UNLOCKS[character] ?? {};
  return Object.entries(table).filter(([l]) => Number(l) <= level).flatMap(([, ids]) => ids);
}

/** EXP d'une run : 10 par étage atteint, 25 par Pokémon dominant, 60 par gardien vaincu. */
export function runExp(floor: number, elites: number, bosses: number): number {
  return floor * 10 + elites * 25 + bosses * 60;
}
