// Skins des personnages : à débloquer avec des objectifs qui se cumulent sur plusieurs runs.
import type { CharacterId } from '../core/model';
import type { PokeType } from '../core/types';

export type SkinStat = 'shinies' | 'elites' | 'bosses' | 'combats' | 'wins' | 'maxMoney' | `ko-${PokeType}`;

export interface SkinDef {
  /** Cartes propres au skin (rangées sous ce skin dans le Glossaire). */
  cards?: string[];
  id: string;
  name: string;
  /** Statistique cumulée (avec ce personnage) et objectif à atteindre. */
  stat: SkinStat;
  goal: number;
  goalText: string;
  /** Gardiens à vaincre avec ce personnage (ids d'ennemis) : remplace la statistique. */
  bosses?: string[];
  /** Formes qui ont un sprite pour ce skin (n° du Pokédex). */
  dex?: number[];
  /** Skin primordial : le Pokémon gagne le type Dragon (Acier devient Dragon). */
  addDragon?: boolean;
  /** Le Bébé de Kangourex a son propre sprite pour ce skin (skins/<id>/bebe.png). */
  baby?: boolean;
  /** Prévu pour plus tard : le skin remplace le deck de départ et/ou l'objet tenu de départ. */
  deck?: string[];
  relic?: string;
  /** Remplace la première carte du deck de départ par celle-ci. */
  firstCard?: string;
  /** Condition en plus : mettre K.O. N Pokémon d'un type (toutes runs confondues). */
  kills?: { type: PokeType; goal: number };
  /** Types du Pokémon avec ce skin (remplacent les siens). */
  types?: PokeType[];
  /** Objectif : avoir eu au moins N Pokédollars en réserve pendant une run. */
  maxMoney?: number;
  /** Peut obtenir les cartes de ces types, de tous les Pokémon. */
  typeCards?: PokeType[];
  /** … seulement celles débloquées (par l'EXP de leur Pokémon). */
  typeCardsUnlocked?: boolean;
  /** Le Pokémon perd son talent (ex. Contestation). */
  noTalent?: boolean;
  /** Cartes ajoutées au deck de départ. */
  extraCards?: string[];
  /** Le skin remplace la lignée d'évolution (ex. Arcanâme, évolution inventée du Chien de la Lanterne). */
  evolutions?: { act: number; dex: number; name: string; types: PokeType[]; hp: number }[];
  /** Talent affiché sur la fiche de sélection quand le skin change le talent. */
  talent?: { name: string; text: string };
  /** Autres changements affichés sur la fiche de sélection. */
  perks?: string[];
}

const shiny = (stat: SkinStat, goal: number, goalText: string): SkinDef => ({ id: 'shiny', name: 'Chromatique', stat, goal, goalText });

// Même objectif pour tous : vaincre 5 Pokémon chromatiques en jouant ce Pokémon (cumulé sur toutes ses runs).
const SHINY_GOAL = shiny('shinies', 5, 'Vaincre 5 Pokémon chromatiques en jouant ce Pokémon');
// Bonus communs des chromatiques : Étincelles (à 5, la prochaine carte est chromatique : valeurs doublées)
const SHINY_COMMON = ['Étincelles : +1 par tour, +1 par carte à 0 PA, +2 par ennemi vaincu. À 5, la prochaine carte est chromatique (valeurs doublées).', 'Chromatiques ennemis 3× plus fréquents ; en vaincre un améliore une carte. Boutiques −10 %.', 'Le Charme Chroma remplace l’objet de départ : cartes chromatiques 2× plus fréquentes.'];
/** Le talent chromatique remplace le talent de base (« Nom : texte »). */
const shinyPassive = (passive: string): SkinDef => {
  const [name, ...rest] = passive.split(' : ');
  return { ...SHINY_GOAL, talent: { name, text: rest.join(' : ') }, relic: 'charme-chroma', perks: SHINY_COMMON };
};

// Skin primordial : se débloque en apaisant Dialga Primal (victoire finale) avec ce Pokémon.
const primordial = (name: string, dex: number[], extra: Partial<SkinDef> = {}): SkinDef => ({
  id: 'primordial', name: 'Primordial', stat: 'bosses', goal: 1, bosses: ['dialga-primal'], dex,
  goalText: `Vaincre Dialga Primal en jouant ${name}. Le Pokémon gagne le type Dragon, et Hurle-Temps remplace une carte de son deck de départ.`, addDragon: true, perks: ['Gagne le type Dragon.'], firstCard: 'n-hurle-temps', ...extra,
});

export const SKINS: Record<CharacterId, SkinDef[]> = {
  riolu: [shinyPassive('Aura Dorée : 1 Étincelle par tranche de 3 Aura gagnée ; une Aurasphère chromatique transperce la Protection.'), {
    id: 'magma', name: 'Cramoisi', stat: 'bosses', goal: 2, bosses: ['camerupt', 'heatran'], dex: [447, 448, 10059],
    talent: { name: 'Justicier Cramoisi', text: 'Commence chaque combat avec 3 Aura. L’Aura ne renforce plus les attaques : elle inflige autant de Brûlure à la cible (sauf Aurasphère et les cartes d’Aura).' },
    goalText: 'Vaincre le gardien du Mont Chimnée (Camérupt) et celui du Mont Abrupt (Heatran) en jouant Riolu. L’Aura ne renforce plus les attaques : elle inflige autant de Brûlure à la cible (sauf Aurasphère et les cartes d’Aura).',
  }, primordial('Riolu', [447, 448, 10059]), {
    id: 'feerique', name: 'Lucario Féerique', stat: 'bosses', goal: 1, bosses: [], kills: { type: 'dragon', goal: 15 }, dex: [447, 448, 10059],
    goalText: 'Mettre K.O. 15 Pokémon de type Dragon en jouant Riolu. Il devient Fée, Peau Féerique remplace Justicier (ses attaques Normal deviennent Fée) et le Foulard Rose remplace la Ceinture Noire (attaquer deux fois le même Pokémon dans un tour lui inflige Attraction).',
    talent: { name: 'Peau Féerique', text: 'Ses attaques de type Normal deviennent de type Fée. Il ne commence plus les combats avec de l’Aura.' },
    types: ['fee'], relic: 'foulard-rose',
  }],
  vipelierre: [shinyPassive('Vampigraine Scintillante : +1 Étincelle quand Vampigraine te soigne ; tes cartes chromatiques infligent 2 Vampigraine à tous les ennemis.'), primordial('Vipélierre', [495, 496, 497]), {
    id: 'alchimiste', name: 'Alchimiste', stat: 'bosses', goal: 1, bosses: ['brutapode'], dex: [495, 496, 497],
    goalText: 'Vaincre le gardien de la Forêt d’Empoigne (Brutapode) et mettre K.O. 15 Pokémon de type Poison en jouant Vipélierre. Ses Vampigraines deviennent du Poison, il commence avec Catalyse (double le Poison de la cible) et la Plaque Toxik à la place du Grain Miracle (elle transforme les baies en baies empoisonnées).',
    kills: { type: 'poison', goal: 15 }, extraCards: ['vip-catalyse'], relic: 'plaque-toxik',
    talent: { name: 'Contestation · Alchimie', text: 'Ses baisses d’Attaque et de Défense deviennent des hausses, et inversement. Toutes ses Vampigraines deviennent du Poison.' },
  }, {
    id: 'tisserand', name: 'Tisserand de Soie Astrale', stat: 'bosses', goal: 1, bosses: [], kills: { type: 'psy', goal: 15 }, dex: [495, 496, 497],
    goalText: 'Mettre K.O. 15 Pokémon de type Psy en jouant Vipélierre. Il devient Psy/Ténèbres et perd Contestation, il peut apprendre toutes les cartes Psy et Ténèbres débloquées, ses cartes peuvent porter plusieurs enchantements, il commence avec Permucœur (enchante une carte de ta main pour la run) et le Nœud Destin à la place du Grain Miracle (tisse une carte au Centre Pokémon).',
    types: ['psy', 'tenebres'], extraCards: ['vip-permucoeur'], relic: 'noeud-destin', noTalent: true, typeCards: ['psy', 'tenebres'], typeCardsUnlocked: true,
    talent: { name: 'Soie Astrale', text: 'Perd Contestation. Ses cartes peuvent porter plusieurs enchantements.' },
    perks: ['Peut apprendre toutes les cartes Psy et Ténèbres débloquées.'],
  }],
  kangourex: [shinyPassive('Bébé Porte-Bonheur : le Bébé reste à tes côtés (et Kangourex gagne toujours de la Rage) ; +3 ₽ à chaque attaque du Bébé ; une carte chromatique fait frapper le Bébé deux fois plus.'), primordial('Kangourex', [115], { baby: true }), {
    id: 'oceanique', name: 'Gardien Océanique', stat: 'bosses', goal: 1, bosses: ['roigada'], dex: [115], baby: true,
    goalText: 'Vaincre le gardien du Puits Ramoloss (Roigada) en jouant Kangourex. Il devient de type Eau, le Corail remplace le Lait Meumeu (le Bébé gagne 3 Protection chaque tour), ses attaques de départ deviennent des Écumes (4 dégâts à tous les ennemis) et il peut obtenir toutes les cartes Eau du jeu. Pas de Méga-Évolution avec ce skin.',
    types: ['eau'], relic: 'corail', typeCards: ['eau'],
    perks: ['Peut obtenir toutes les cartes Eau du jeu.', 'Pas de Méga-Évolution avec ce skin.'],
    deck: ['kan-ecume', 'kan-ecume', 'kan-ecume', 'kan-ecume', 'abri', 'abri', 'abri', 'abri', 'kan-coup-main', 'kan-coup-double'],
  }],
  caninos: [shinyPassive('Flamme Dorée : +1 Étincelle par Brûlure infligée ; une carte chromatique fait exploser la Brûlure de sa cible (2 dégâts par cumul, la Brûlure est consommée).'), primordial('Caninos', [58, 59]), {
    id: 'lanterne', name: 'Chien de la Lanterne', stat: 'bosses', goal: 1, bosses: ['ossatueur-gardien'], dex: [58, 59, 9059],
    goalText: 'Vaincre le gardien de la Tour Pokémon de Lavanville (Ossatueur) en jouant Caninos. Feu des Âmes remplace Intimidation (chaque pioche pendant ton tour inflige 2 dégâts à tous les ennemis), la Lanterne Bleue remplace le Charbon (3 Âmes par combat), ses attaques de départ deviennent des Léchouilles des Âmes (Spectre, 2 dégâts, pioche 1) et il peut obtenir toutes les cartes Spectre du jeu.',
    talent: { name: 'Feu des Âmes', text: 'Chaque fois qu’il pioche pendant son tour (pas la main de départ), inflige 2 dégâts à tous les ennemis.' },
    perks: ['Peut obtenir toutes les cartes Spectre du jeu.', 'Évolue en Arcanin puis en Arcanâme (Feu/Spectre).'],
    cards: ['can-lechouille-ame', 'can-ame'],
    relic: 'lanterne-bleue', deck: ['can-lechouille-ame', 'can-lechouille-ame', 'can-lechouille-ame', 'can-lechouille-ame', 'abri', 'abri', 'abri', 'abri', 'flammeche', 'morsure'], typeCards: ['spectre'],
    evolutions: [
      { act: 2, dex: 59, name: 'Arcanin', types: ['feu'], hp: 12 },
      { act: 3, dex: 9059, name: 'Arcanâme', types: ['feu', 'spectre'], hp: 8 },
    ],
  }, {
    id: 'hisui', name: 'Caninos d’Hisui', stat: 'bosses', goal: 1, bosses: [], kills: { type: 'roche', goal: 15 }, dex: [58, 59],
    goalText: 'Mettre K.O. 15 Pokémon de type Roche en jouant Caninos. Il devient Feu/Roche, Tête de Roc remplace Intimidation (aucun contrecoup de ses attaques), la Pierre Dure remplace son objet de départ (ses attaques Normal deviennent Roche) et il peut apprendre toutes les cartes Roche du jeu.',
    talent: { name: 'Tête de Roc', text: 'Il ne perd aucun PV à cause de ses propres attaques (Bélier, Fracass’Tête…). Remplace Intimidation.' },
    perks: ['Peut obtenir toutes les cartes Roche du jeu.', 'Évolue en Arcanin d’Hisui (Feu/Roche).'],
    types: ['feu', 'roche'], relic: 'pierre-dure', typeCards: ['roche'],
    evolutions: [{ act: 2, dex: 59, name: 'Arcanin d’Hisui', types: ['feu', 'roche'], hp: 12 }],
  }],
  mew: [shinyPassive('Mirage : garde l’accès aux cartes de tous les personnages ; les cartes créées pendant le combat ont 1 chance sur 4 d’arriver déjà chromatiques.'), primordial('Mew', [151])],
  duo: [shinyPassive('Pôles Inversés : Posipi donne la Protection et le coût réduit, Négapi les dégâts bonus ; une Surcharge donne 5 Étincelles.')],
  quelorior: [shinyPassive('Chef-d’œuvre : +2 Étincelles par copie de Gribouille ; une copie faite par une carte chromatique est améliorée pour la run.'), primordial('Quelorior', [235]), {
    id: 'flambeur', name: 'Flambeur', stat: 'maxMoney', goal: 500, maxMoney: 500, dex: [235],
    goalText: 'Avoir 500 Pokédollars en réserve pendant une run avec Quelorior. Son deck de départ devient 4 Jackpot (3 dégâts, +5 ₽), 4 Abri, ses Gribouilles et Atout, la Roulette remplace son objet de départ (+2 dégâts par tranche de 100 ₽) et il a −50 % au Marché Kecleon.',
    perks: ['−50 % sur tous les prix du Marché Kecleon.'],
    relic: 'roulette', deck: ['quel-jackpot', 'quel-jackpot', 'quel-jackpot', 'quel-jackpot', 'abri', 'abri', 'abri', 'abri', 'quel-gribouille', 'quel-gribouille', 'quel-atout'],
  }],
} as Record<CharacterId, SkinDef[]>;

/** Chemin du sprite de combat selon le skin. */
export function skinSprite(dex: number, skin?: string): string {
  if (skin === 'shiny') return `sprites/pokemon/shiny/${dex}.png`;
  // Une forme sans sprite pour ce skin (ex. Méga-Kangourex primordial) garde son sprite normal
  if (skin && Object.values(SKINS).flat().some((k) => k.id === skin && (!k.dex || k.dex.includes(dex)))) return `sprites/pokemon/skins/${skin}/${dex}.png`;
  return `sprites/pokemon/front/${dex}.png`;
}

/** Sprite du Bébé de Kangourex selon le skin. */
export function babySprite(skin?: string): string {
  return skin && SKINS.kangourex?.some((k) => k.id === skin && k.baby) ? `sprites/pokemon/skins/${skin}/bebe.png` : 'sprites/pokemon/bebe-kangourex-v2.png';
}

/** Skin d'un personnage (pour appliquer son deck / objet de départ). */
export function skinDef(c: CharacterId, skin?: string): SkinDef | undefined {
  return skin ? SKINS[c]?.find((k) => k.id === skin) : undefined;
}

/** Types d'un Pokémon primordial : Acier devient Dragon, sinon Dragon s'ajoute. */
export function primordialTypes(types: PokeType[]): PokeType[] {
  if (types.includes('dragon')) return [...types];
  if (types.includes('acier')) return ['dragon', ...types.filter((t) => t !== 'acier')];
  return [...types, 'dragon'];
}
