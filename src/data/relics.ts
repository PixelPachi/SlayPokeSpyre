// Objets tenus (reliques) : effets permanents pendant toute la run.
// Les effets sont appliqués par le moteur (core/combat.ts) et la run (main.ts) d'après l'id de l'objet.
import type { CharacterId } from '../core/model';

export type RelicRarity = 'depart' | 'commun' | 'peu-commun' | 'rare' | 'gardien' | 'quete';

export interface RelicDef {
  id: string;
  name: string;
  /** Nom du sprite dans sprites/items de PokeAPI. */
  sprite: string;
  rarity: RelicRarity;
  /** Pokémon qui peut l'obtenir ; 'commun' = tous ; 'evenement' = seulement par un événement. */
  owner: CharacterId | 'commun' | 'evenement';
  text: string;
  /** Objet exclusif disponible tout de suite (sans déblocage par niveau). */
  free?: boolean;
}

const RELICS: RelicDef[] = [
  // ——— Reliques de gardien : +1 PA, avec une contrepartie (récompense des gardiens) ———
  { id: 'orbe-adamant', name: 'Orbe Adamant', sprite: 'adamant-orb', rarity: 'gardien', owner: 'commun',
    text: '+1 PA par tour. Les ennemis commencent chaque combat avec +1 Attaque.' },
  { id: 'orbe-platine', name: 'Orbe Platiné', sprite: 'griseous-orb', rarity: 'gardien', owner: 'commun',
    text: '+1 PA par tour. Tu pioches 1 carte de moins à chaque tour.' },
  { id: 'orbe-perle', name: 'Orbe Perlé', sprite: 'lustrous-orb', rarity: 'gardien', owner: 'commun',
    text: '+1 PA par tour. Les ennemis ont 20 % de PV en plus.' },
  { id: 'orbe-toxique', name: 'Orbe Toxique', sprite: 'toxic-orb', rarity: 'gardien', owner: 'commun',
    text: '+1 PA par tour. Tu commences chaque combat avec 4 Poison.' },
  { id: 'orbe-flamme', name: 'Orbe Flamme', sprite: 'flame-orb', rarity: 'gardien', owner: 'commun',
    text: '+1 PA par tour. Tu commences chaque combat avec 2 Brûlure.' },
  { id: 'cendre-sacree', name: 'Cendre Sacrée', sprite: 'sacred-ash', rarity: 'gardien', owner: 'commun',
    text: '+1 PA par tour. Tu ne peux plus te soigner au Centre Pokémon.' },

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

  // ——— Objets exclusifs (disponibles dès le début, seulement pour ce Pokémon) ———
  { id: 'lunettes-sages', name: 'Lunettes Sages', sprite: 'wise-glasses', rarity: 'commun', owner: 'riolu', free: true,
    text: 'Commence chaque combat avec 5 Aura de plus.' },
  { id: 'plaque-herbe', name: 'Plaque Herbe', sprite: 'meadow-plate', rarity: 'commun', owner: 'vipelierre', free: true,
    text: 'Tes attaques de type Plante infligent 2 dégâts de plus.' },
  { id: 'herbe-blanche', name: 'Herbe Blanche', sprite: 'white-herb', rarity: 'peu-commun', owner: 'vipelierre', free: true,
    text: 'Commence chaque combat avec Attaque −1 et Défense −1… que Contestation transforme en +1 et +1.' },
  { id: 'pierre-plante', name: 'Pierre Plante', sprite: 'leaf-stone', rarity: 'rare', owner: 'vipelierre', free: true,
    text: 'Au début de chaque combat, inflige 2 Vampigraine à tous les ennemis.' },
  { id: 'mouchoir-soie', name: 'Mouchoir Soie', sprite: 'silk-scarf', rarity: 'commun', owner: 'kangourex', free: true,
    text: 'Tes attaques de type Normal infligent 2 dégâts de plus.' },
  { id: 'grelot-zen', name: 'Grelot Zen', sprite: 'soothe-bell', rarity: 'peu-commun', owner: 'kangourex', free: true,
    text: 'Le Bébé Kangourex commence chaque combat avec 2 Puissance de plus.' },
  { id: 'plaque-flamme', name: 'Plaque Flamme', sprite: 'flame-plate', rarity: 'commun', owner: 'caninos', free: true,
    text: 'Tes attaques de type Feu infligent 2 dégâts de plus.' },
  { id: 'pierre-feu', name: 'Pierre Feu', sprite: 'fire-stone', rarity: 'rare', owner: 'caninos', free: true,
    text: 'Au début de chaque combat, inflige 2 Brûlure à tous les ennemis.' },
  { id: 'plaque-esprit', name: 'Plaque Esprit', sprite: 'mind-plate', rarity: 'commun', owner: 'mew', free: true,
    text: 'Tes attaques de type Psy infligent 2 dégâts de plus.' },
  { id: 'cuillere-tordue', name: 'Cuillère Tordue', sprite: 'twisted-spoon', rarity: 'peu-commun', owner: 'mew', free: true,
    text: 'Au premier tour de chaque combat, +1 PA.' },

  // ——— Nouveaux objets exclusifs ———
  { id: 'gemme-combat', name: 'Gemme Combat', sprite: 'fighting-gem', rarity: 'peu-commun', owner: 'riolu', free: true,
    text: 'Ta première attaque de type Combat à chaque tour inflige 5 dégâts de plus.' },
  { id: 'encens-pur', name: 'Encens Pur', sprite: 'pure-incense', rarity: 'commun', owner: 'riolu', free: true,
    text: 'Gagne 2 Aura chaque fois que tu joues une Technique.' },
  { id: 'gemme-plante', name: 'Gemme Plante', sprite: 'grass-gem', rarity: 'peu-commun', owner: 'vipelierre', free: true,
    text: 'Ta première attaque de type Plante à chaque tour inflige 5 dégâts de plus.' },
  { id: 'encens-fleur', name: 'Encens Fleur', sprite: 'rose-incense', rarity: 'peu-commun', owner: 'vipelierre', free: true,
    text: 'Chaque fois que tu te soignes, gagne autant de Protection (5 au maximum).' },
  { id: 'gemme-normal', name: 'Gemme Normal', sprite: 'normal-gem', rarity: 'peu-commun', owner: 'kangourex', free: true,
    text: 'Ta première attaque de type Normal à chaque tour inflige 5 dégâts de plus.' },
  { id: 'encens-doux', name: 'Encens Doux', sprite: 'lax-incense', rarity: 'commun', owner: 'kangourex', free: true,
    text: 'Au début de chaque tour, le Bébé Kangourex récupère 2 PV.' },
  { id: 'gemme-feu', name: 'Gemme Feu', sprite: 'fire-gem', rarity: 'peu-commun', owner: 'caninos', free: true,
    text: 'Ta première attaque de type Feu à chaque tour inflige 5 dégâts de plus.' },
  { id: 'grosses-bottes', name: 'Grosses Bottes', sprite: 'heavy-duty-boots', rarity: 'commun', owner: 'caninos', free: true,
    text: 'Tu es immunisé à la Brûlure.' },
  { id: 'gemme-psy', name: 'Gemme Psy', sprite: 'psychic-gem', rarity: 'peu-commun', owner: 'mew', free: true,
    text: 'Ta première attaque de type Psy à chaque tour inflige 5 dégâts de plus.' },
  { id: 'encens-bizarre', name: 'Encens Bizarre', sprite: 'odd-incense', rarity: 'peu-commun', owner: 'mew', free: true,
    text: 'La première capacité d’un autre Pokémon que tu joues à chaque tour coûte 1 PA de moins.' },

  // ——— Objets de quête (après avoir apaisé Dialga avec 3 Pokémon différents) ———
  { id: 'rouage-temps', name: 'Rouage du Temps', sprite: 'rouage-temps', rarity: 'quete', owner: 'commun',
    text: 'Un rouage venu du futur. Aucun effet… mais avec le Rouage de l’Espace, un passage s’ouvre après Dialga Primal.' },
  { id: 'rouage-espace', name: 'Rouage de l’Espace', sprite: 'rouage-espace', rarity: 'quete', owner: 'commun',
    text: 'Un rouage nacré qui déforme l’espace. Aucun effet… mais avec le Rouage du Temps, un passage s’ouvre après Dialga Primal.' },

  { id: 'encens-zen', name: 'Encens Zen', sprite: 'sea-incense', rarity: 'quete', owner: 'commun',
    text: 'Cadeau de Grodoudou : les ennemis de tes 3 prochains combats n’ont qu’1 PV. Disparaît ensuite.' },

  // ——— Communs à tous ———
  { id: 'metronome', name: 'Métronome', sprite: 'metronome', rarity: 'commun', owner: 'commun',
    text: 'Chaque attaque inflige 1 dégât de plus par attaque déjà jouée ce tour.' },
  { id: 'loupe', name: 'Loupe', sprite: 'wide-lens', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques qui touchent tous les ennemis infligent 2 dégâts de plus.' },
  { id: 'carapace-mue', name: 'Carapace Mue', sprite: 'shed-shell', rarity: 'commun', owner: 'commun',
    text: 'Tu es immunisé à la Peur et à la Paralysie.' },
  { id: 'bande-etreinte', name: 'Bande Étreinte', sprite: 'binding-band', rarity: 'commun', owner: 'commun',
    text: 'Le Poison et la Vampigraine sur les ennemis infligent 1 dégât de plus par tour.' },
  { id: 'boue-noire', name: 'Boue Noire', sprite: 'black-sludge', rarity: 'peu-commun', owner: 'commun',
    text: 'Le Poison que tu subis te soigne au lieu de te faire perdre des PV.' },
  { id: 'roche-royale', name: 'Roche Royale', sprite: 'kings-rock', rarity: 'peu-commun', owner: 'commun',
    text: 'Tes attaques ont 20 % de chances d’infliger 1 Peur à chaque ennemi touché.' },
  { id: 'herbe-pouvoir', name: 'Herbe Pouvoir', sprite: 'power-herb', rarity: 'peu-commun', owner: 'commun',
    text: 'Une fois par combat, la première capacité qui coûte 2 PA ou plus est gratuite.' },
  { id: 'evoluroc', name: 'Évoluroc', sprite: 'eviolite', rarity: 'peu-commun', owner: 'commun',
    text: 'Tant que ton Pokémon n’a pas évolué, gagne 3 Protection au début de chaque tour.' },
  { id: 'spray-gorge', name: 'Spray Gorge', sprite: 'throat-spray', rarity: 'peu-commun', owner: 'commun',
    text: 'Quand tu joues ta 3e Technique d’un tour, gagne 1 PA (une fois par tour).' },
  { id: 'lumargile', name: 'Lumargile', sprite: 'light-clay', rarity: 'rare', owner: 'commun',
    text: 'Au début de ton tour, ta Protection est divisée par deux au lieu de disparaître.' },
  { id: 'restes', name: 'Restes', sprite: 'leftovers', rarity: 'commun', owner: 'commun',
    text: 'À la fin de chaque combat gagné, récupère 3 PV.' },
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
