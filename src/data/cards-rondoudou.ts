// Deck Rondoudou : offert (très rarement, 1 % de chances) par Grodoudou au début de la run.
import type { CardDef } from '../core/model';
import { cardMaker, multi, st } from './card-kit';

const c = cardMaker('normal' as never, 'rdd');

export const RONDOUDOU_CARDS: CardDef[] = [
  c('torgnoles', 'Torgnoles', 'normal', 'attaque', 'depart', 1, 'ennemi', [multi(5, 2)], { effects: [multi(7, 2)] }),
  c('abri', 'Abri', 'normal', 'technique', 'depart', 1, 'soi', [st('abri', 1, 'soi')], { cost: 0 }, ['epuisee']),
  c('berceuse', 'Berceuse', 'normal', 'technique', 'depart', 1, 'ennemi', [st('sommeil', 2)], { cost: 0 }, ['epuisee']),
  c('metronome', 'Métronome', 'normal', 'technique', 'depart', 1, 'ennemi', [{ kind: 'metronome' }], { cost: 0 }),
];
// Illustrations dessinées avec Grodoudou (illustrations/rondoudou-<carte>.webp)
for (const card of RONDOUDOU_CARDS) card.artName = `rondoudou-${card.id.slice(4)}`;
