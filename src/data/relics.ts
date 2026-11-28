// Objets tenus (reliques) : effets permanents pendant toute la run.
// Les effets sont appliqués par le moteur (core/combat.ts) et la run (main.ts) d'après l'id de l'objet.
import type { CharacterId } from '../core/model';

export type RelicRarity = 'depart' | 'commun' | 'peu-commun' | 'rare' | 'gardien' | 'quete';

export interface RelicDef {
  id: string;
  name: string;
  /** Nom du sprite dans sprites/items de PokeAPI. */
  sprite: string;
  /** Objet de départ d'un skin : une fois le skin débloqué, tous les Pokémon peuvent le trouver. */
  shared?: boolean;
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
  { id: 'pointeau-adn', name: 'Pointeau ADN', sprite: 'dna-splicers', rarity: 'rare', owner: 'duo', free: true,
    text: 'Débloque la fusion au Centre Pokémon : Posipi et Négapi deviennent Multipi (PV réunis, +1 PA par tour, Plus et Moins actifs sur toutes les cartes, cartes de départ fusionnées).' },
  { id: 'charme-chroma', name: 'Charme Chroma', sprite: 'shiny-charm', rarity: 'depart', owner: 'commun', free: true,
    text: 'Objet de départ des skins chromatiques. Étincelles : +1 par tour, +1 par carte à 0 PA, +2 par ennemi vaincu ; à 5, ta prochaine carte devient chromatique (valeurs doublées). Cartes chromatiques 2× plus fréquentes en récompense et en boutique. Pokémon chromatiques 3× plus fréquents ; en vaincre un améliore une carte de ton deck. Boutiques −10 %.' },
  { id: 'pile-synchro', name: 'Pile Synchro', sprite: 'cell-battery', rarity: 'depart', owner: 'duo',
    text: 'Chaque combat commence sur un Champ Électrifié.' },
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
  { id: 'roulette', name: 'Roulette', sprite: 'roulette', rarity: 'quete', owner: 'quelorior', free: true, shared: true,
    text: 'Tes attaques infligent 2 dégâts de plus par tranche de 100 Pokédollars que tu possèdes.' },
  { id: 'corail', name: 'Corail', sprite: 'corail', rarity: 'quete', owner: 'kangourex', free: true,
    text: 'Gardien Océanique : le Bébé Kangourex gagne 3 Protection au début de chaque tour.' },
  { id: 'noeud-destin-plus', name: 'Nœud Destin +', sprite: 'noeud-destin-plus', rarity: 'quete', owner: 'commun',
    text: 'Au Centre Pokémon, tu peux tisser un talent : une condition (début de tour, chaque Attaque…) qui déclenche deux effets.' },
  { id: 'noeud-destin', name: 'Nœud Destin', sprite: 'destiny-knot', rarity: 'quete', owner: 'vipelierre', free: true,
    text: 'Au Centre Pokémon, tu peux tisser une nouvelle carte en choisissant deux effets (trois propositions pour chacun).', shared: true },
  { id: 'lanterne-bleue', name: 'Lanterne Bleue', sprite: 'lanterne-bleue', rarity: 'quete', owner: 'caninos', free: true,
    text: '3 cartes Âme (0 PA, pioche 2, Épuisée) rejoignent ta pioche au début de chaque combat.', shared: true },
  { id: 'foulard-rose', name: 'Foulard Rose', sprite: 'foulard-rose', rarity: 'quete', owner: 'riolu', free: true,
    text: 'Quand tu attaques deux fois le même Pokémon dans un tour, il subit 2 Attraction (1 chance sur 3 de ne pas agir).', shared: true },
  { id: 'pierre-dure', name: 'Pierre Dure', sprite: 'pierre-dure', rarity: 'quete', owner: 'caninos', free: true,
    text: 'Tes attaques de type Normal deviennent de type Roche.', shared: true },
  { id: 'plaque-toxik', name: 'Plaque Toxik', sprite: 'toxic-plate', rarity: 'quete', owner: 'vipelierre', free: true,
    text: 'Tu peux transformer une baie en baie empoisonnée (clique sur la baie). Plus la baie est rare, plus le poison est fort et plus il inflige d’effets.', shared: true },
  { id: 'pic-venin', name: 'Pic Venin', sprite: 'poison-barb', rarity: 'rare', owner: 'vipelierre', free: true,
    text: 'Chaque statut que tu infliges à un ennemi en inflige 1 de plus.' },
  // Plaques d'Arceus : +3 dégâts aux attaques de leur type
  { id: 'plaque-hydro', name: 'Plaque Hydro', sprite: 'splash-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Eau infligent 3 dégâts de plus.' },
  { id: 'plaque-volt', name: 'Plaque Volt', sprite: 'zap-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Électrik infligent 3 dégâts de plus.' },
  { id: 'plaque-glace', name: 'Plaque Glace', sprite: 'icicle-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Glace infligent 3 dégâts de plus.' },
  { id: 'plaque-terre', name: 'Plaque Terre', sprite: 'earth-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Sol infligent 3 dégâts de plus.' },
  { id: 'plaque-ciel', name: 'Plaque Ciel', sprite: 'sky-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Vol infligent 3 dégâts de plus.' },
  { id: 'plaque-insecte', name: 'Plaque Insecte', sprite: 'insect-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Insecte infligent 3 dégâts de plus.' },
  { id: 'plaque-roc', name: 'Plaque Roc', sprite: 'stone-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Roche infligent 3 dégâts de plus.' },
  { id: 'plaque-fantome', name: 'Plaque Fantôme', sprite: 'spooky-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Spectre infligent 3 dégâts de plus.' },
  { id: 'plaque-draco', name: 'Plaque Draco', sprite: 'draco-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Dragon infligent 3 dégâts de plus.' },
  { id: 'plaque-ombre', name: 'Plaque Ombre', sprite: 'dread-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Ténèbres infligent 3 dégâts de plus.' },
  { id: 'plaque-pixie', name: 'Plaque Pixie', sprite: 'pixie-plate', rarity: 'commun', owner: 'commun',
    text: 'Tes attaques Fée infligent 3 dégâts de plus.' },
  { id: 'ballon', name: 'Ballon', sprite: 'air-balloon', rarity: 'peu-commun', owner: 'commun',
    text: 'Tu flottes : les attaques Sol ennemies ne t’infligent que la moitié de leurs dégâts.' },
  { id: 'bulbe', name: 'Bulbe', sprite: 'absorb-bulb', rarity: 'peu-commun', owner: 'commun',
    text: 'Quand tu subis une attaque Eau, gagne Attaque +1 et Défense +1.' },
  { id: 'lunettes-filtre', name: 'Lunettes Filtre', sprite: 'safety-goggles', rarity: 'peu-commun', owner: 'commun',
    text: 'La météo n’a aucun effet sur toi : ni sur tes attaques, ni sur celles que tu subis, ni ses dégâts de fin de tour.' },
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
    text: 'Un étrange rouage venu du futur. Il semble attendre quelque chose…' },
  { id: 'rouage-espace', name: 'Rouage de l’Espace', sprite: 'rouage-espace', rarity: 'quete', owner: 'commun',
    text: 'Un rouage nacré qui déforme l’espace. Il semble attendre quelque chose…' },

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
  // Objets communs (novembre)
  { id: 'bracelet-macho', name: 'Bracelet Macho', sprite: 'bracelet-macho', rarity: 'commun', owner: 'commun',
    text: 'Commence chaque combat avec Attaque +2, mais Défense −1.' },
  { id: 'herbe-mental', name: 'Herbe Mental', sprite: 'herbe-mental', rarity: 'commun', owner: 'commun',
    text: 'Le premier statut négatif qu’on t’inflige dans chaque combat est annulé.' },
  { id: 'pierre-ovale', name: 'Pierre Ovale', sprite: 'pierre-ovale', rarity: 'commun', owner: 'commun',
    text: 'Au premier tour de chaque combat, pioche 1 carte de plus.' },
  { id: 'poke-poupee', name: 'Poké Poupée', sprite: 'poke-poupee', rarity: 'commun', owner: 'commun',
    text: 'Commence chaque combat avec 5 Clone (Protection persistante, elle ne disparaît que cassée).' },
  { id: 'lunettes-noires', name: 'Lunettes Noires', sprite: 'lunettes-noires', rarity: 'commun', owner: 'commun',
    text: 'Au début de chaque combat, tous les ennemis ont Défense −1.' },
  { id: 'restes', name: 'Restes', sprite: 'leftovers', rarity: 'commun', owner: 'commun',
    text: 'À la fin de chaque combat gagné, récupère 3 PV.' },
  { id: 'vive-griffe', name: 'Vive Griffe', sprite: 'quick-claw', rarity: 'commun', owner: 'commun',
    text: 'Au premier tour de chaque combat, pioche 2 cartes de plus.' },
  { id: 'bandeau-muscle', name: 'Bandeau Muscle', sprite: 'muscle-band', rarity: 'commun', owner: 'commun',
    text: 'Commence chaque combat avec Attaque +1.' },
  { id: 'grelot-coque', name: 'Grelot Coque', sprite: 'shell-bell', rarity: 'commun', owner: 'commun',
    text: 'Chaque fois que tu joues une carte Attaque, récupère 1 PV.' },
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
  return r === 'rare' || r === 'quete' ? 300 : r === 'peu-commun' ? 250 : 150;
}
