// Quelorior : il n'a qu'une seule carte à lui, Gribouille. Le reste de son deck vient de ce qu'il copie et des cartes neutres.
import type { CardDef } from '../core/model';
import { cardMaker } from './card-kit';

const c = cardMaker('quelorior', 'quel');

export const QUELORIOR_CARDS: CardDef[] = [
  // Flambeur : attaque de départ qui rapporte des Pokédollars
  c('jackpot', 'Jackpot', 'normal', 'attaque', 'depart', 1, 'ennemi', [{ kind: 'degats', amount: 3 }, { kind: 'argent', amount: 5 }], { effects: [{ kind: 'degats', amount: 5 }, { kind: 'argent', amount: 8 }] }),
  // Atout : joue les 2 cartes du dessus de la pioche (deck de départ du Flambeur, trouvable sans skin)
  { ...c('atout', 'Atout', 'normal', 'technique', 'rare', 2, 'soi', [{ kind: 'joue-pioche', count: 2 }], { cost: 1 }, ['epuisee']), artName: 'Métronome' },
  c('gribouille', 'Gribouille', 'normal', 'technique', 'depart', 0, 'ennemi', [{ kind: 'gribouille', enchant: false }], { effects: [{ kind: 'gribouille', enchant: true }] }, ['epuisee']),
];
