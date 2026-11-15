// Objets tenus (reliques) : effets permanents pendant toute la run.
// Les effets sont appliqués par le moteur (core/combat.ts) et la run (main.ts) d'après l'id de l'objet.
import type { CharacterId } from '../core/model';

export type RelicRarity = 'depart' | 'commun' | 'peu-commun' | 'rare';

export interface RelicDef {
  id: string;
  name: string;
  /** Nom du sprite dans sprites/items de PokeAPI. */
  sprite: string;
  rarity: RelicRarity;
  /** Pokémon qui peut l'obtenir ; 'commun' = tous ; 'evenement' = seulement par un événement. */
  owner: CharacterId | 'commun' | 'evenement';
  text: string;
}

const RELICS: RelicDef[] = [
  // ——— Objets de départ ———
  { id: 'ceinture-noire', name: 'Ceinture Noire', sprite: 'black-belt', rarity: 'depart', owner: 'riolu',
    text: 'Chaque fois que tu perds des PV, gagne 1 Aura de plus.' },
  { id: 'grain-miracle', name: 'Grain Miracle', sprite: 'miracle-seed', rarity: 'depart', owner: 'vipelierre',
    text: 'Tes Vampigraines appliquent 2 de plus.' },
  { id: 'lait-meumeu', name: 'Lait Meumeu', sprite: 'moomoo-milk', rarity: 'depart', owner: 'kangourex',
    text: 'Le Bébé Kangourex commence chaque combat avec 4 PV de plus.' },
  { id: 'charbon', name: 'Charbon', sprite: 'charcoal', rarity: 'depart', owner: 'caninos',
    text: 'La Brûlure que tu poses inflige 1 dégât de plus par tour.' },

  // ——— Riolu (débloqués par niveau) ———
  { id: 'plaque-poing', name: 'Plaque Poing', sprite: 'fist-plate', rarity: 'commun', owner: 'riolu',
    text: 'Tes attaques de type Combat infligent 2 dégâts de plus.' },
  { id: 'gant-punch', name: 'Gant Punch', sprite: 'punching-glove', rarity: 'peu-commun', owner: 'riolu',
    text: 'Tes capacités « Poing » (Mach Punch, Pisto-Poing, Poing Boost…) infligent 3 dégâts de plus.' },
  { id: 'bandeau', name: 'Bandeau', sprite: 'focus-band', rarity: 'peu-commun', owner: 'riolu',
    text: 'Une fois par combat, quand tes PV passent sous la moitié, gagne 10 Aura.' },
  { id: 'griffe-rasoir', name: 'Griffe Rasoir', sprite: 'razor-claw', rarity: 'commun', owner: 'riolu',
    text: 'Tes attaques à 0 PA infligent 3 dégâts de plus.' },
  { id: 'plaque-fer', name: 'Plaque Fer', sprite: 'iron-plate', rarity: 'commun', owner: 'riolu',
    text: 'Tes attaques de type Acier infligent 3 dégâts de plus.' },
  { id: 'lucarite', name: 'Lucarite', sprite: 'lucarionite', rarity: 'rare', owner: 'riolu',
    text: 'Méga-Gemme. À partir de l’acte 2, Lucario devient Méga-Lucario au début de chaque combat : Attaque +2 et 10 Aura. Une fois par combat, quand ton Aura atteint 25, pioche 2 cartes et gagne 1 PA.' },
  { id: 'kangourexite', name: 'Kangourexite', sprite: 'kangaskhanite', rarity: 'rare', owner: 'kangourex',
    text: 'Méga-Gemme. Kangourex devient Méga-Kangourex au début de chaque combat : le Bébé attaque 2 fois à la fin de chaque tour.' },

  // ——— Communs à tous ———
  { id: 'restes', name: 'Restes', sprite: 'leftovers', rarity: 'commun', owner: 'commun',
    text: 'À la fin de ton tour, récupère 2 PV.' },
  { id: 'vive-griffe', name: 'Vive Griffe', sprite: 'quick-claw', rarity: 'commun', owner: 'commun',
    text: 'Au premier tour de chaque combat, pioche 2 cartes de plus.' },
  { id: 'bandeau-muscle', name: 'Bandeau Muscle', sprite: 'muscle-band', rarity: 'commun', owner: 'commun',
    text: 'Commence chaque combat avec Attaque +1.' },
  { id: 'grelot-coque', name: 'Grelot Coque', sprite: 'shell-bell', rarity: 'commun', owner: 'commun',
    text: 'À la fin de chaque combat, récupère 6 PV.' },
  { id: 'piece-rune', name: 'Pièce Rune', sprite: 'amulet-coin', rarity: 'commun', owner: 'commun',
    text: 'Tu gagnes 50 % de Pokédollars en plus après les combats.' },
  { id: 'casque-brut', name: 'Casque Brut', sprite: 'rocky-helmet', rarity: 'peu-commun', owner: 'commun',
    text: 'Quand un ennemi t’attaque, il subit 3 dégâts.' },
  { id: 'grosse-racine', name: 'Grosse Racine', sprite: 'big-root', rarity: 'peu-commun', owner: 'commun',
    text: 'Tes soins sont augmentés de 50 %.' },
  { id: 'veste-combat', name: 'Veste de Combat', sprite: 'assault-vest', rarity: 'peu-commun', owner: 'commun',
    text: 'Commence chaque combat avec 10 Protection.' },
  { id: 'oeuf-chance', name: 'Œuf Chance', sprite: 'lucky-egg', rarity: 'peu-commun', owner: 'commun',
    text: 'Gagne 50 % d’EXP en plus à la fin de la run.' },
  { id: 'ceinture-pro', name: 'Ceinture Pro', sprite: 'expert-belt', rarity: 'peu-commun', owner: 'commun',
    text: 'Tes attaques super efficaces infligent 25 % de dégâts en plus.' },
  { id: 'ceinture-force', name: 'Ceinture Force', sprite: 'focus-sash', rarity: 'rare', owner: 'commun',
    text: 'Une fois par combat, survit à un coup fatal avec 1 PV.' },
  { id: 'orbe-vie', name: 'Orbe Vie', sprite: 'life-orb', rarity: 'rare', owner: 'commun',
    text: 'Tes attaques infligent 30 % de dégâts en plus, mais chaque attaque jouée te coûte 1 PV.' },
  { id: 'bandeau-choix', name: 'Bandeau Choix', sprite: 'choice-band', rarity: 'rare', owner: 'commun',
    text: 'Tes attaques infligent 50 % de dégâts en plus, mais tu ne peux jouer qu’une attaque par tour.' },
  { id: 'lentilscope', name: 'Lentilscope', sprite: 'scope-lens', rarity: 'commun', owner: 'commun',
    text: 'Ta première attaque de chaque combat inflige le double de dégâts.' },
  { id: 'rappel-max', name: 'Rappel Max', sprite: 'max-revive', rarity: 'rare', owner: 'evenement',
    text: 'Vœu exaucé par Jirachi. Si ton Pokémon tombe K.O., il revient avec 33 % de ses PV max. L’objet disparaît ensuite.' },
];

export const RELIC_DEFS: Record<string, RelicDef> = Object.fromEntries(RELICS.map((r) => [r.id, r]));

export function allRelics(): RelicDef[] {
  return RELICS;
}

export function relicDef(id: string): RelicDef {
  const r = RELIC_DEFS[id];
  if (!r) throw new Error(`Objet inconnu : ${id}`);
  return r;
}

/** Prix au Marché Kecleon. */
export function relicPrice(id: string): number {
  const r = RELIC_DEFS[id].rarity;
  return r === 'rare' ? 300 : r === 'peu-commun' ? 250 : 150;
}
