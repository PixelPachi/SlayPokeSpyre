// Événements mystères (nœuds « ? » de la carte).
import type { Run } from '../core/run';
import { POKEMON_EVENTS } from './events-pokemon';

export interface EventChoice {
  label: string;
  /** Texte gris sous le choix (coût ou gain). */
  detail: string;
  /** Applique le choix ; renvoie le texte du résultat, ou ouvre le choix d'une carte du deck
   *  (retirer, améliorer, dupliquer, transformer ; count = combien de fois ; then = un second choix ensuite). */
  apply: (run: Run) => string | EventPick | EventFight;
  available?: (run: Run) => boolean;
}

export type PickKind = 'retirer' | 'ameliorer' | 'dupliquer' | 'transformer' | 'monde' | 'enchanter';
export interface EventPick { pick: PickKind; text: string; count?: number; then?: PickKind }
/** Duel : lance un combat contre ce Pokémon ; victoire = une carte rare au choix et des ₽. */
export interface EventFight { fight: string; text: string; /** PV et Attaque de l'adversaire multipliés en plus. */ power?: number; /** La victoire rapporte aussi un objet tenu. */ relic?: boolean }

export interface GameEvent {
  id: string;
  title: string;
  /** Image à afficher : sprite PokeAPI, ou carte de tarot (public/tarot) si tarot est vrai. */
  image: string;
  /** Arcane majeur : la carte s'affiche en grand à gauche, les choix à droite. */
  tarot?: boolean;
  /** Sprite de secours quand l'arcane n'a pas encore d'illustration. */
  sprite?: string;
  /** Arcane inversé : la carte est retournée, avec des effets extrêmes. */
  reversed?: { text: string; choices: EventChoice[] };
  text: string;
  choices: EventChoice[];
}

export const EVENTS: GameEvent[] = [
  {
    id: 'baies',
    title: 'Le buisson de Baies Oran',
    image: 'sprites/items/oran-berry.png',
    text: 'Au détour d’un sentier, un buisson ploie sous les Baies Oran. Elles brillent étrangement, comme si le temps s’était arrêté autour d’elles.',
    choices: [
      {
        label: 'Cueillir les baies', detail: 'Gagne 3 Baies Oran (si ton sac est plein, tu choisis lesquelles jeter)',
        apply: (r) => {
          for (let i = 0; i < 3; i++) r.giveBerry('oran');
          return 'Tu cueilles 3 Baies Oran !';
        },
      },
    ],
  },
  ...POKEMON_EVENTS,
];
