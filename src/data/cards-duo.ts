// Cartes du Duo Posipi & Négapi.
// Posipi (bordeaux et jaune) : attaques Électrik. Négapi (turquoise et jaune) : défense.
// Jouer une carte de celui qui est en retrait le fait passer devant (Relais).
// PLUS : chaque carte Posipi donne +2 dégâts à la prochaine carte Négapi.
// MOINS : chaque carte Négapi donne +2 Protection et −1 PA à la prochaine carte Posipi à 2 PA ou plus.
import type { CardDef, DuoSide } from '../core/model';
import { breakBlock, cardMaker, dmg, draw, heal, multi, pa, power, prot, st } from './card-kit';
import type { CardMaker } from './card-kit';

const c = cardMaker('duo', 'duo');
const side = (s: DuoSide): CardMaker => (...a) => ({ ...c(...a), duoSide: s });
const P = side('posipi');
const N = side('negapi');

export const DUO_CARDS: CardDef[] = [
  // ——— Carte signature full art (bénédiction de Célébi) ———
  { ...c('frotte-frimousse', 'Frotte-Frimousse', 'electrik', 'talent', 'rare', 2, 'soi', [power('frotte-frimousse', 4)], { cost: 1 }), fullArt: true, special: true },
  // ——— Départ ———
  { ...P('eclair', 'Éclair Plus', 'electrik', 'attaque', 'depart', 1, 'ennemi', [dmg(6)], { effects: [dmg(9)] }), artName: 'Éclair' },
  N('bouclier', 'Bouclier', 'electrik', 'technique', 'depart', 1, 'soi', [prot(5)], { effects: [prot(8)] }),
  P('coup-main', "Coup d'Main", 'normal', 'technique', 'commune', 0, 'soi', [draw(1)], { effects: [draw(2)] }),
  N('etincelle', 'Étincelle', 'electrik', 'attaque', 'commune', 1, 'ennemi', [dmg(0, { parProtection: true })], { effects: [dmg(3, { parProtection: true })] }),
  // Surcharge : créée quand on alterne Posipi → Négapi → Posipi → Négapi dans le même tour
  c('decharge-synchro', 'Décharge Synchro', 'electrik', 'attaque', 'depart', 0, 'tous', [dmg(15), st('etourdi', 1, 'tous')], {}, ['epuisee']),

  // ——— Posipi : communes ———
  P('etincelle-relais', 'Étincelle Relais', 'electrik', 'attaque', 'commune', 1, 'ennemi', [dmg(6), { kind: 'si-relais', fx: [draw(1), pa(1)] }], { effects: [dmg(9), { kind: 'si-relais', fx: [draw(1), pa(1)] }] }),
  P('vive-attaque', 'Vive-Attaque', 'normal', 'attaque', 'commune', 0, 'ennemi', [dmg(4)], { effects: [dmg(6)] }),
  P('feinte', 'Feinte', 'normal', 'attaque', 'commune', 1, 'ennemi', [breakBlock, dmg(5)], { effects: [breakBlock, dmg(8)] }),
  P('rayon-signal', 'Rayon Signal', 'insecte', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('confusion', 1)], { effects: [dmg(8), st('confusion', 2)] }),
  P('torgnoles', 'Torgnoles', 'normal', 'attaque', 'commune', 1, 'ennemi', [multi(2, 2, 5)], { effects: [multi(3, 2, 5)] }),
  P('toile-elek', 'Toile Élek', 'electrik', 'attaque', 'commune', 1, 'tous', [dmg(4), st('paralysie', 1, 'tous')], { effects: [dmg(6), st('paralysie', 1, 'tous')] }),
  { ...P('charme', 'Charme Câlin', 'fee', 'technique', 'commune', 0, 'ennemi', [st('attaque', -2)], { effects: [st('attaque', -3)] }, ['epuisee']), artName: 'Charme' },
  // ——— Posipi : peu communes ———
  { ...P('tonnerre', 'Tonnerre Plus', 'electrik', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(14), st('paralysie', 1)], { effects: [dmg(18), st('paralysie', 1)] }), artName: 'Tonnerre' },
  P('charge-foudre', 'Charge Foudre', 'electrik', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(19), { kind: 'perte-pv', amount: 3 }], { effects: [dmg(24), { kind: 'perte-pv', amount: 3 }] }),
  { ...P('cage-eclair', 'Prison Électrique', 'electrik', 'technique', 'peu-commune', 1, 'ennemi', [st('paralysie', 3)], { effects: [st('paralysie', 4)] }), artName: 'Cage-Éclair' },
  { ...P('eclat-magique', 'Éclat Pétillant', 'fee', 'attaque', 'peu-commune', 2, 'tous', [dmg(9)], { effects: [dmg(12)] }), artName: 'Éclat Magique' },
  P('machination', 'Machination', 'tenebres', 'technique', 'peu-commune', 1, 'soi', [st('attaque', 2, 'soi')], { effects: [st('attaque', 3, 'soi')] }, ['epuisee']),
  P('electrocution', 'Électrocution', 'electrik', 'attaque', 'peu-commune', 1, 'ennemi', [multi(4, 2)], { effects: [multi(5, 2)] }),
  // ——— Posipi : rares ———
  { ...P('fatal-foudre', 'Foudre Synchro', 'electrik', 'attaque', 'rare', 3, 'ennemi', [dmg(27), st('paralysie', 2)], { effects: [dmg(34), st('paralysie', 2)] }), artName: 'Fatal-Foudre' },
  P('luminocanon', 'Luminocanon', 'acier', 'attaque', 'rare', 2, 'ennemi', [dmg(16), st('defense', -2)], { effects: [dmg(21), st('defense', -2)] }),
  P('plus-synchro', 'Plus Synchro', 'electrik', 'talent', 'rare', 1, 'soi', [power('plus-synchro', 2)], { effects: [power('plus-synchro', 3)] }),

  // ——— Négapi : communes ———
  N('cage-magnetique', 'Cage Magnétique', 'electrik', 'technique', 'commune', 1, 'soi', [prot(7), { kind: 'epine-tour', amount: 3 }], { effects: [prot(10), { kind: 'epine-tour', amount: 4 }] }),
  N('ecran-lumiere', 'Écran Lumière', 'psy', 'technique', 'commune', 1, 'soi', [prot(6), draw(1)], { effects: [prot(9), draw(1)] }),
  N('chargeur', 'Chargeur', 'electrik', 'technique', 'commune', 1, 'soi', [prot(5), st('attaque', 1, 'soi')], { effects: [prot(8), st('attaque', 1, 'soi')] }),
  N('machoire-electrique', 'Mâchoire Électrique', 'electrik', 'attaque', 'commune', 1, 'ennemi', [dmg(5), prot(4)], { effects: [dmg(7), prot(6)] }),
  { ...N('onde-folie', 'Onde Moins', 'spectre', 'technique', 'commune', 1, 'ennemi', [st('confusion', 2), prot(3)], { effects: [st('confusion', 3), prot(4)] }), artName: 'Onde Folie' },
  N('entrave', 'Entrave', 'normal', 'technique', 'commune', 1, 'ennemi', [st('attaque', -2), prot(3)], { effects: [st('attaque', -2), prot(6)] }),
  // ——— Négapi : peu communes ———
  N('mur-lumiere', 'Mur Lumière', 'psy', 'technique', 'peu-commune', 2, 'soi', [prot(13)], { effects: [prot(17)] }),
  N('armure', 'Armure', 'normal', 'technique', 'peu-commune', 1, 'soi', [prot(5), st('defense', 1, 'soi')], { effects: [prot(7), st('defense', 1, 'soi')] }),
  { ...N('gyroballe', 'Gyro-Moins', 'acier', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(4, { parProtection: true })], { effects: [dmg(8, { parProtection: true })] }), artName: 'Gyroballe' },
  N('recharge', 'Recharge', 'electrik', 'technique', 'peu-commune', 0, 'soi', [prot(3), pa(1)], { effects: [prot(5), pa(1)] }, ['epuisee']),
  N('electacle', 'Électacle', 'electrik', 'attaque', 'peu-commune', 1, 'tous', [dmg(5), prot(5)], { effects: [dmg(7), prot(7)] }),
  N('soin', 'Soin', 'normal', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'duo-soin', amount: 8 }], { effects: [{ kind: 'duo-soin', amount: 12 }] }, ['epuisee']),
  // ——— Négapi : rares ———
  N('forteresse', 'Forteresse', 'acier', 'technique', 'rare', 2, 'soi', [prot(20), st('epine', 2, 'soi')], { effects: [prot(26), st('epine', 2, 'soi')] }),
  N('recuperation', 'Récupération', 'normal', 'technique', 'rare', 1, 'soi', [heal(8)], { effects: [heal(12)] }, ['epuisee']),
  N('moins-synchro', 'Moins Synchro', 'electrik', 'talent', 'rare', 1, 'soi', [power('moins-synchro', 2)], { effects: [power('moins-synchro', 3)] }),
  // ——— Négapi : légendaire ———
  // Ouragan : frappe tous les ennemis une fois par carte Posipi jouée ce tour
  N('ouragan', 'Ouragan', 'electrik', 'attaque', 'legendaire', 2, 'tous', [dmg(6, { parPosipi: true })], { effects: [dmg(9, { parPosipi: true })] }),

  // ——— Multipi (fusion par le Pointeau ADN) : cartes violettes ———
  // Les attaques et défenses de départ fusionnent
  { ...c('fusion-eclair', 'Éclair Pôle X', 'electrik', 'attaque', 'depart', 1, 'ennemi', [dmg(6), prot(5)], { effects: [dmg(9), prot(8)] }), duoFusion: true, artName: 'Éclair' },
  // Cartes à coût X (proposées seulement une fois fusionné)
  ...([
    c('decharge-x', 'Décharge X', 'electrik', 'attaque', 'commune', 0, 'ennemi', [multi(7, 1)], { effects: [multi(9, 1)] }),
    c('rempart-x', 'Rempart X', 'electrik', 'technique', 'commune', 0, 'soi', [prot(7)], { effects: [prot(9)] }),
    c('orage-x', 'Orage X', 'electrik', 'attaque', 'peu-commune', 0, 'tous', [dmg(5)], { effects: [dmg(7)] }),
    c('surtension-x', 'Surtension X', 'electrik', 'technique', 'peu-commune', 0, 'soi', [draw(1), prot(3)], { effects: [draw(1), prot(5)] }),
    c('champ-magnetique-x', 'Champ Magnétique X', 'electrik', 'technique', 'rare', 0, 'tous', [st('paralysie', 1, 'tous'), prot(4)], { effects: [st('paralysie', 1, 'tous'), prot(6)] }),
    c('pole-x', 'Pôle X', 'electrik', 'attaque', 'rare', 0, 'ennemi', [dmg(6), prot(6)], { effects: [dmg(8), prot(8)] }),
  ] as CardDef[]).map((d) => ({ ...d, duoFusion: true, xCost: true })),

  // ——— Duo (bicolores) ———
  c('inversion-poles', 'Inversion de Pôles', 'electrik', 'technique', 'commune', 1, 'soi', [{ kind: 'duo-inversion' }, draw(1)], { cost: 0 }),
  c('relais', 'Relais', 'normal', 'technique', 'commune', 0, 'soi', [{ kind: 'duo-relais' }, draw(1)], { effects: [{ kind: 'duo-relais' }, draw(2)] }),
  c('synchrobruit', 'Synchrobruit', 'electrik', 'attaque', 'peu-commune', 2, 'tous', [dmg(8), { kind: 'si-relais', fx: [dmg(8)] }], { effects: [dmg(11), { kind: 'si-relais', fx: [dmg(11)] }] }),
  c('coup-double', 'Coup Double', 'normal', 'attaque', 'peu-commune', 1, 'ennemi', [multi(5, 2), prot(4)], { effects: [multi(7, 2), prot(5)] }),
  c('champ-synchro', 'Champ Synchro', 'electrik', 'technique', 'rare', 1, 'soi', [{ kind: 'meteo', id: 'champ-electrifie', turns: 5 }, prot(6), draw(1)], { effects: [{ kind: 'meteo', id: 'champ-electrifie', turns: 5 }, prot(9), draw(2)] }, ['epuisee']),
];
