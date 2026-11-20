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

export type PickKind = 'retirer' | 'ameliorer' | 'dupliquer' | 'transformer' | 'monde';
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
      { label: 'Manger les baies', detail: 'Récupère 15 PV', apply: (r) => `Tu récupères ${r.heal(15)} PV.` },
      {
        label: 'Les cueillir pour les vendre', detail: 'Gagne 45 ₽',
        apply: (r) => {
          r.money += 45;
          return 'Un marchand de passage t’en donne 45 ₽.';
        },
      },
    ],
  },
  {
    id: 'faille',
    title: 'Une faille temporelle',
    image: 'sprites/items/poke-ball.png',
    text: 'L’air se déchire en crépitant. À travers la faille, tu aperçois une version de toi plus forte… ou plus fatiguée.',
    choices: [
      {
        label: 'Toucher la faille', detail: 'Perd 7 PV, améliore une carte de ton choix',
        available: (r) => r.hp > 7 && r.deck.some((c) => !c.upgraded),
        apply: (r) => {
          r.hp -= 7;
          return { pick: 'ameliorer', text: 'La faille te traverse. Choisis la carte qu’elle renforce.' };
        },
      },
      { label: 'S’éloigner', detail: 'Rien ne se passe', apply: () => 'Tu continues ta route, prudemment.' },
    ],
  },
  {
    id: 'dresseur',
    title: 'Le jeune Dresseur égaré',
    image: 'sprites/items/poke-ball.png',
    text: 'Un jeune Dresseur s’est perdu dans la tour. Il veut apprendre à se battre comme toi.',
    choices: [
      {
        label: 'Lui montrer une technique', detail: 'Retire une carte de ton deck',
        available: (r) => r.deck.length > 5,
        apply: () => ({ pick: 'retirer', text: 'Quelle technique lui apprends-tu ? Tu l’oublieras en échange.' }),
      },
      {
        label: 'Le raccompagner', detail: 'Perd 4 PV, gagne 60 ₽',
        available: (r) => r.hp > 4,
        apply: (r) => {
          r.hp -= 4;
          r.money += 60;
          return 'Le chemin est rude, mais ses parents te remercient avec 60 ₽.';
        },
      },
    ],
  },
  {
    id: 'meditation',
    title: 'La salle silencieuse',
    image: 'sprites/items/poke-ball.png',
    text: 'Une salle où le tic-tac de la tour s’arrête. L’endroit idéal pour méditer et écouter son Aura.',
    choices: [
      {
        label: 'Méditer', detail: '+4 PV max et récupère 4 PV',
        apply: (r) => {
          r.maxHp += 4;
          r.heal(4);
          return 'Ton esprit s’apaise. Tu te sens plus solide.';
        },
      },
      { label: 'Repartir', detail: 'Rien ne se passe', apply: () => 'Tu reprends l’ascension.' },
    ],
  },
  ...POKEMON_EVENTS,
];
