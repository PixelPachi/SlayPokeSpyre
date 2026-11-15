// Modèle de données du jeu (section 10 du GDD).
import type { PokeType } from './types';

export type CharacterId = 'riolu' | 'vipelierre' | 'kangourex' | 'caninos' | 'mew';

export type StatusId =
  | 'brulure' // perd X PV en début de tour, inflige 25 % de dégâts en moins, -1 par tour
  | 'poison' // perd X PV en début de tour, -1 par tour
  | 'vampigraine' // perd X PV en début de tour, le poseur récupère la moitié, -1 par tour
  | 'paralysie' // inflige 25 % de dégâts en moins, X tours
  | 'peur' // subit 50 % de dégâts en plus, X tours
  | 'confusion' // gagne 25 % de Protection en moins, X tours
  | 'sommeil' // saute son prochain tour
  | 'attaque' // +X dégâts par coup (peut être négatif)
  | 'defense'; // +X Protection par carte (peut être négatif)

export type Statuses = Partial<Record<StatusId, number>>;

export type Target = 'ennemi' | 'tous' | 'aleatoire' | 'soi';

/** Talents (pouvoirs) : effets permanents pour tout le combat. */
export type PowerId = 'plenitude' | 'lire-esprit';

export type Effect =
  | {
      kind: 'degats'; amount: number;
      hits?: number; hitsMax?: number; // nombre de coups (au hasard entre hits et hitsMax)
      drain?: boolean; // soigne de la moitié des dégâts infligés
      facade?: boolean; // dégâts doublés si le lanceur a Brûlure, Poison ou Paralysie
      revanche?: boolean; // dégâts doublés si le lanceur a perdu des PV au dernier tour ennemi
    }
  | { kind: 'protection'; amount: number }
  | { kind: 'statut'; status: StatusId; stacks: number; on: 'cible' | 'soi' | 'tous' }
  | { kind: 'pioche'; amount: number }
  | { kind: 'pa'; amount: number }
  | { kind: 'perte-pv'; amount: number } // se blesse soi-même (donne de l'Aura à Riolu)
  | { kind: 'aura'; amount: number }
  | { kind: 'aura-mult'; amount: number } // multiplie l'Aura actuelle
  | { kind: 'degats-aura'; mult: number; consume?: boolean } // inflige Aura × mult dégâts (consomme l'Aura sauf consume: false)
  | { kind: 'aura-protection'; mult: number } // convertit l'Aura en Protection
  | { kind: 'degats-pv-perdus'; amount: number; per: number } // + 1 dégât par tranche de `per` PV perdus
  | { kind: 'tout-ou-rien' } // inflige des dégâts égaux à ses PV, puis tombe à 1 PV
  | { kind: 'copie' } // rejoue la dernière carte jouée
  | { kind: 'soin'; amount: number }
  | { kind: 'casse-protection' } // retire la Protection de la cible
  | { kind: 'metronome' } // joue l'effet d'une carte du personnage au hasard
  | { kind: 'pouvoir'; power: PowerId; amount: number };

export type Keyword = 'epuisee' | 'conservee' | 'ephemere' | 'innee' | 'injouable';

export type CardCategory = 'attaque' | 'technique' | 'talent' | 'statut';
export type Rarity = 'depart' | 'commune' | 'peu-commune' | 'rare';

export interface CardDef {
  id: string;
  name: string;
  character: CharacterId | 'normal';
  pokeType: PokeType;
  category: CardCategory;
  rarity: Rarity;
  cost: number;
  target: Target;
  effects: Effect[];
  keywords?: Keyword[];
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
}

export type IntentKind = 'attaque' | 'defense' | 'boost' | 'handicap' | 'inconnu';

export interface EnemyMove {
  id: string;
  name: string;
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
}

export interface EnemyDef {
  id: string;
  name: string;
  dex: number;
  types: PokeType[];
  hp: [number, number];
  moves: EnemyMove[];
}
