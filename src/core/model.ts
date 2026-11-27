// Modèle de données du jeu (section 10 du GDD).
import type { PokeType } from './types';

export type CharacterId = 'riolu' | 'vipelierre' | 'kangourex' | 'caninos' | 'mew' | 'quelorior' | 'duo';
/** Duo Posipi & Négapi : côté d'une carte (aucun = carte Duo bicolore). */
export type DuoSide = 'posipi' | 'negapi';

export type StatusId =
  | 'brulure' // perd X PV en début de tour, inflige 25 % de dégâts en moins, -1 par tour
  | 'poison' // perd X PV en début de tour, -1 par tour
  | 'vampigraine' // perd X PV en début de tour, le poseur récupère la moitié, -1 par tour
  | 'paralysie' // inflige 25 % de dégâts en moins, X tours
  | 'peur' // subit 50 % de dégâts en plus, X tours
  | 'confusion' // gagne 25 % de Protection en moins, X tours
  | 'sommeil' // saute son prochain tour
  | 'attaque' // +X dégâts par coup (peut être négatif)
  | 'defense' // +X Protection par carte (peut être négatif)
  | 'tenace' // ne peut pas tomber K.O. jusqu'à son prochain tour
  | 'gel' // à 3 Gel : passe son tour (un gardien inflige seulement la moitié de ses dégâts)
  | 'concentration' // Mitra-Poing : frappe au début du prochain tour si aucun dégât n'est subi d'ici là
  | 'etourdi' // passe son prochain tour
  | 'rage' // Kangourex : gagnée en perdant des PV, renforce les cartes de Rage
  | 'abri' // annule entièrement le prochain coup subi
  | 'ligote' // perd 6 PV par cumul au début du tour ; chaque cumul disparaît au bout de 3 tours
  | 'epine' // inflige X dégâts à l'ennemi qui l'attaque (chaque coup), dure tout le combat
  | 'attraction' // sous le charme : 1 chance sur 3 de rater son action
  | 'clone' // Clonage : Protection persistante, ne disparaît que si elle est cassée
  | 'elan'; // Caninos : +1 dégât par point à toutes ses attaques, divisé par deux à la fin du tour

export type Statuses = Partial<Record<StatusId, number>>;

export type Target = 'ennemi' | 'tous' | 'aleatoire' | 'soi';

/** Talents (pouvoirs) : effets permanents pour tout le combat. */
export type PowerId =
  | 'plenitude' | 'lire-esprit' // Riolu
  | 'champ-herbu' | 'racines' | 'zenith-plante' | 'peau-dure' // Vipélierre
  | 'amour-filial' | 'eveil' | 'rancune' | 'croissance' // Kangourex
  | 'zenith' | 'braises' | 'turbo' | 'elan-persistant' | 'brasier-eternel' // Caninos
  | 'plus-synchro' | 'moins-synchro' // Duo
  | 'pioche-visible' | 'creation-reduite'
  | 'coeur-magma' | 'charme-celeste' | 'pierre-philosophale' | 'trame-destin' | 'maree-protectrice' | 'bucher-ames' | 'avalanche' // talents légendaires de skin
  | 'souvenir' | 'telekinesie'; // Mew

export type Effect =
  | {
      kind: 'degats'; amount: number;
      hits?: number; hitsMax?: number; // nombre de coups (au hasard entre hits et hitsMax)
      drain?: boolean; // soigne de la moitié des dégâts infligés
      facade?: boolean; // dégâts doublés si le lanceur a Brûlure, Poison ou Paralysie
      revanche?: boolean; // dégâts doublés si le lanceur a perdu des PV au dernier tour ennemi
      contreStatut?: boolean; // dégâts doublés si la cible a un statut (Poison, Brûlure, Paralysie, Peur, Confusion…)
      parStatut?: StatusId; // + parStatutX dégâts par point de ce statut sur la cible
      parStatutX?: number;
      noAura?: boolean; // l'Aura ne s'ajoute pas (et n'est pas consommée)
      parProtection?: boolean; // + la Protection actuelle du lanceur
      champ?: string; // dégâts doublés si ce champ est actif
      cumul?: number; // chaque utilisation donne +cumul dégâts à toutes les cartes du même nom (pour le combat)
      peurChance?: number; // chance d'appliquer 1 Peur à chaque cible touchée
      recul?: number; // le lanceur perd ce nombre de PV si la cible avait de la Protection
      siBebe?: number; // + ces dégâts si le Bébé Kangourex est debout
      parBebe?: number; // + Puissance du Bébé × ce nombre
      parSoi?: StatusId; // + parSoiX dégâts par point de ce statut sur le lanceur (Rage, Élan)
      parPosipi?: boolean; // Duo : frappe une fois par carte Posipi jouée ce tour
      parSoiX?: number;
    }
  | { kind: 'protection'; amount: number }
  | { kind: 'statut'; status: StatusId; stacks: number; on: 'cible' | 'soi' | 'tous' }
  | { kind: 'pioche'; amount: number }
  | { kind: 'pa'; amount: number }
  | { kind: 'perte-pv'; amount: number } // se blesse soi-même (donne de l'Aura à Riolu)
  | { kind: 'aura'; amount: number }
  | { kind: 'repos'; turns: number; healPct?: number } // récupère ses PV (tous, ou une fraction) et s'endort
  | { kind: 'ajoute-sommeil' } // ajoute à la main une carte jouable endormi (pour ce combat)
  | { kind: 'blabla' } // joue gratuitement une carte de la main au hasard
  | { kind: 'baie-aleatoire'; count: number } // gagne une baie au hasard (mangée tout de suite si le sac est plein)
  | { kind: 'decouverte'; pool: 'aromates'; count: number; upgraded?: boolean } // choisis 1 carte parmi N, ajoutée pour ce combat
  | { kind: 'meteo'; id: import('./weather').WeatherId | import('./weather').TerrainId; turns: number } // météo ou terrain pour N tours
  | { kind: 'aura-mult'; amount: number } // multiplie l'Aura actuelle
  | { kind: 'degats-aura'; mult: number; consume?: boolean } // inflige Aura × mult dégâts (consomme l'Aura sauf consume: false)
  | { kind: 'aura-protection'; mult: number } // convertit l'Aura en Protection
  | { kind: 'degats-pv-perdus'; amount: number; per: number } // + 1 dégât par tranche de `per` PV perdus
  | { kind: 'tout-ou-rien' } // inflige des dégâts égaux à ses PV, puis tombe à 1 PV
  | { kind: 'copie' } // rejoue la dernière carte jouée
  | { kind: 'soin'; amount: number }
  | { kind: 'casse-protection' } // retire la Protection de la cible
  | { kind: 'metronome' } // joue l'effet d'une carte du personnage au hasard
  | { kind: 'pouvoir'; power: PowerId; amount: number }
  | { kind: 'statut-mult'; status: StatusId; mult: number; on: 'cible' | 'tous' } // multiplie un statut déjà posé
  | { kind: 'ajoute-carte'; from: 'tous' | 'neutre'; count: number; free?: boolean } // ajoute des cartes au hasard dans la main (pour ce combat)
  | { kind: 'bebe-attaque'; times: number; status?: StatusId; stacks?: number } // le Bébé Kangourex attaque tout de suite (et peut infliger un statut)
  | { kind: 'protection-par-statut'; status: StatusId; mult: number } // Protection = statut de la cible × mult
  | { kind: 'protection-aura'; per: number } // Protection +1 par tranche de « per » Aura (l'Aura n'est pas consommée)
  | { kind: 'protection-par-soi'; status: StatusId; mult: number } // Protection = ton propre statut × mult (Rage)
  | { kind: 'perd-statut'; status: StatusId } // le lanceur perd tout ce statut (consomme la Rage / l'Élan)
  | { kind: 'pioche-par-soi'; status: StatusId; per: number } // pioche 1 carte par tranche de « per » points de ton statut
  | { kind: 'soin-par-statut'; status: StatusId; mult: number } // soin = statut de la cible × mult
  | { kind: 'detonation'; status: StatusId; per: number } // consomme le statut de la cible : dégâts = statut × per
  | { kind: 'propage-statut'; status: StatusId } // copie le statut de la cible sur tous les autres ennemis
  | { kind: 'pioche-si-statut'; status: StatusId; amount: number } // pioche si la cible a ce statut
  | { kind: 'protection-par-bebe'; mult: number } // Protection = Puissance du Bébé × mult
  | { kind: 'bebe-garde' } // le Bébé attire toutes les attaques ennemies ce tour-ci
  | { kind: 'bebe-vers-joueur' } // tu gagnes autant de Protection que le Bébé en a
  | { kind: 'bebe-puissance'; amount: number }
  | { kind: 'bebe-soin'; amount: number } // soigne le Bébé (le ramène s'il est K.O.)
  | { kind: 'bebe-pvmax'; amount: number }
  | { kind: 'bebe-protection'; amount: number }
  | { kind: 'joue-pioche'; count: number } // joue gratuitement les N cartes du dessus de la pioche (Atout)
  | { kind: 'argent'; amount: number } // gagne des Pokédollars (Jackpot)
  | { kind: 'permucoeur' } // enchante au hasard une carte de la main, pour le reste de la run
  | { kind: 'multiplie-statut'; status: StatusId; mult: number } // multiplie le statut de la cible (Catalyse)
  | { kind: 'recharge'; amount: number } // au prochain tour, X PA de moins
  | { kind: 'trame'; trigger: string; fx: string[] } // Nœud Destin + : talent qui déclenche deux effets
  | { kind: 'pioche-ame'; count: number; dmg: number } // pioche ; si une Âme arrive, dégâts à tous les ennemis
  | { kind: 'choix-dessus' } // choisis une carte de ta pioche à mettre au-dessus
  | { kind: 'degats-differes'; amount: number } // Prescience : dégâts au début de ton prochain tour
  | { kind: 'double-tisse' } // Fil Astral : la prochaine carte tissée a ses valeurs doublées
  | { kind: 'double-enchant' } // Toile Onirique : la prochaine carte enchantée a ses valeurs doublées
  | { kind: 'epuise-main'; perCard: number } // Lame du Néant : épuise la main, dégâts par carte épuisée
  | { kind: 'si-relais'; fx: Effect[] } // Duo : effets bonus si la carte a déclenché un Relais
  | { kind: 'duo-inversion' } // Duo : échange les PV de Posipi et Négapi
  | { kind: 'duo-relais' } // Duo : fait passer le partenaire en première ligne
  | { kind: 'duo-soin'; amount: number } // Duo : soigne le partenaire en retrait
  | { kind: 'epine-tour'; amount: number } // Épine pour ce tour seulement
  | { kind: 'clone'; amount: number } // Protection persistante (ne se dissipe pas en début de tour)
  | { kind: 'lance-soleil'; amount: number } // X dégâts à tous les ennemis au début du prochain tour (tout de suite au soleil)
  | { kind: 'affaiblit'; amount: number } // la cible a X Attaque de moins pour ce tour
  | { kind: 'gribouille'; enchant: boolean } // copie la capacité de l'ennemi ciblé : elle rejoint le deck (enchantée si amélioré)
  | { kind: 'invocation'; amount: number } // le Bébé gagne X PV max et X PV ; s'il est K.O., il revient avec X PV
  | { kind: 'bebe-furie'; bonus: number } // le Bébé attaque 1 fois + 1 fois par attaque du Bébé déjà faite ce tour (+ bonus)
  | { kind: 'souvenir' } // le Bébé tombe K.O. : ses PV sont infligés à tous les ennemis et donnés en Protection
  | { kind: 'protection-pv-bebe'; mult: number } // Protection = PV actuels du Bébé × mult
  | { kind: 'protection-cible' } // gagne autant de Protection que la cible en a
  | { kind: 'soin-cible'; amount: number } // soigne aussi la cible
  | { kind: 'double-jeu'; amount: number } // les N prochaines cartes jouées le sont 2 fois
  | { kind: 'fuite' } // les ennemis s'enfuient : fin du combat sans récompense (pas contre un gardien)
  | { kind: 'fin-tour' } // termine le tour du joueur
  | { kind: 'concentration'; amount: number } // Mitra-Poing
  | { kind: 'auto-degats'; amount: number } // le lanceur subit ces dégâts (la Protection compte)
  | { kind: 'consomme-aura'; amount: number };

export type Keyword = 'epuisee' | 'conservee' | 'ephemere' | 'innee' | 'injouable' | 'echo';

export type CardCategory = 'attaque' | 'technique' | 'talent' | 'statut';
export type Rarity = 'depart' | 'commune' | 'peu-commune' | 'rare' | 'legendaire';

export interface CardDef {
  id: string;
  name: string;
  character: CharacterId | 'normal';
  pokeType: PokeType;
  category: CardCategory;
  /** Enchantements empilés (Tisserand de Soie Astrale), du plus ancien au plus récent. */
  enchants?: string[];
  /** Carte copiée par Gribouille : nom du Pokémon d'origine. */
  copiedFrom?: string;
  rarity: Rarity;
  cost: number;
  target: Target;
  effects: Effect[];
  keywords?: Keyword[];
  /** Conditions pour jouer la carte. */
  requires?: { block?: number; aura?: number; notBoss?: boolean; asleep?: boolean };
  /** Cartes de gardien : effet subi quand on la pioche. */
  onDraw?: Effect[];
  /** Illustration d'une autre carte (cartes fusionnées à la Pension). */
  artName?: string;
  /** Carte fusionnée : les deux cartes d'origine. */
  fusion?: [string, string];
  /** Enchantement du Marché noir (id). */
  enchant?: string;
  /** Duo : carte de Posipi ou de Négapi (aucune = carte Duo). */
  duoSide?: DuoSide;
  /** Carte réservée à un skin (proposée seulement quand on le porte). */
  skin?: string;
  /** Carte de Multipi (Duo fusionné par le Pointeau ADN) : cadre violet, proposée seulement après la fusion. */
  duoFusion?: boolean;
  /** Coût X : dépense tous les PA restants ; les valeurs des effets sont multipliées par X (le nombre de coups si la carte frappe plusieurs fois). */
  xCost?: boolean;
  /** Version améliorée (Centre Pokémon). */
  upgrade: Partial<Pick<CardDef, 'cost' | 'effects' | 'keywords'>>;
}

/** Une carte dans un deck : une définition + son état. */
export interface Card {
  uid: number;
  defId: string;
  upgraded: boolean;
}

export interface CharacterDef {
  id: CharacterId;
  name: string;
  /** N° Pokédex de chaque stade d'évolution. */
  dex: number[];
  types: PokeType[];
  maxHp: number;
  talent: { name: string; text: string };
  starterDeck: string[];
  /** Objet tenu de départ (id dans data/relics.ts). */
  starterRelic?: string;
  /** Évolutions au début des actes : nouveau sprite, nom, types et PV max en plus. */
  evolutions?: { act: number; dex: number; name: string; types: PokeType[]; hp: number }[];
  /** Méga-Évolution : avec la Méga-Gemme tenue, au début de chaque combat. */
  mega?: { stone: string; dex: number; name: string; types: PokeType[]; fromAct: number };
}

/** Apparence du Pokémon joué à un moment de la run (stade d'évolution). */
export interface Form { dex: number; name: string; types: PokeType[] }

export type IntentKind = 'attaque' | 'defense' | 'boost' | 'handicap' | 'recharge' | 'inconnu';

export interface EnemyMove {
  id: string;
  name: string;
  /** Miroir Originel (Arceus) : la carte du joueur copiée (et si elle est améliorée). */
  mirrorOf?: string;
  mirrorUp?: boolean;
  weight: number;
  intent: IntentKind;
  /** Type de l'attaque (pour les dégâts). */
  pokeType?: PokeType;
  damage?: number;
  hits?: number;
  block?: number;
  /** Statut posé sur soi. */
  selfStatus?: { status: StatusId; stacks: number };
  /** Statut posé sur le joueur. */
  playerStatus?: { status: StatusId; stacks: number };
  /** Capacité exclusive d'un gardien (carte dorée). */
  signature?: boolean;
  /** Déclenche une météo ou un terrain (5 tours). */
  meteo?: import('./weather').WeatherId | import('./weather').TerrainId;
  /** Ajoute des cartes de gardien dans le deck du joueur pour ce combat. */
  addCards?: { id: string; count: number; to: 'pioche' | 'defausse' | 'main' };
  /** Ignore la Protection du joueur. */
  pierce?: boolean;
  /** Protection, soin et statut sur soi vont à un allié encore debout (Lumivole soutient Muciole). */
  ally?: boolean;
  /** Appelle un allié (id d'ennemi), au plus `max` en même temps. */
  summon?: { id: string; max: number };
  /** Défausse des cartes au hasard de la main du joueur. */
  discard?: number;
  /** Se soigne. */
  heal?: number;
  /** Draine : récupère la moitié des dégâts infligés (Méga-Sangsue, Vampirisme…). */
  drain?: boolean;
  /** Contrecoup : perd ces PV après l'attaque (Bélier, Fracass'Tête…). */
  recoil?: number;
  /** Dégâts en plus à chaque nouvelle utilisation pendant le combat. */
  escalate?: number;
}

export type GimmickId =
  | 'venin-tenace' | 'cuirasse' | 'ailes' | 'reine' | 'boule-de-neige' | 'clair-de-lune' | 'regard-royal' | 'sol-brulant'
  | 'mur-roc' | 'decharge' | 'multiecaille' | 'tempete-sable' | 'air-lock' | 'torche' | 'teravolt' | 'turbobrasier' | 'distorsion' | 'fantome-inconnu' | 'miroir-originel';

export interface EnemyDef {
  id: string;
  name: string;
  dex: number;
  types: PokeType[];
  hp: [number, number];
  moves: EnemyMove[];
  /** Ordre fixe des actions (ids de moves), répété en boucle : remplace le tirage au hasard. */
  pattern?: string[];
  /** Seconde phase quand les PV passent sous une fraction des PV max. */
  phase2?: { below: number; name: string; pattern: string[]; selfStatus?: { status: StatusId; stacks: number }; block?: number };
  /** Classe CSS du sprite (ex. « primal » pour Dialga Primal). */
  look?: string;
  /** Talent propre à un gardien. */
  /** Agit même endormi (un futur gardien Ronflex…). */
  actsAsleep?: boolean;
  gimmick?: { id: GimmickId; name: string; text: string };
}
