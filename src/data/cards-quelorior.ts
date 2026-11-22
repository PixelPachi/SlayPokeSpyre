// Quelorior : il n'a qu'une seule carte à lui, Gribouille. Le reste de son deck vient de ce qu'il copie et des cartes neutres.
import type { CardDef } from '../core/model';
import { cardMaker } from './card-kit';

const c = cardMaker('quelorior', 'quel');

export const QUELORIOR_CARDS: CardDef[] = [
  c('gribouille', 'Gribouille', 'normal', 'technique', 'depart', 0, 'ennemi', [{ kind: 'gribouille', enchant: false }], { effects: [{ kind: 'gribouille', enchant: true }] }, ['epuisee']),
];
