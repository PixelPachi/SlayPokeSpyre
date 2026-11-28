// Cartes de Caninos : capacités de Caninos et d'Arcanin (niveau, évolution, CT, reproduction, tuteurs).
// Identité : Brûlure (le Charbon l'aggrave), crocs, Intimidation (baisse l'Attaque des ennemis),
// Deux archétypes : Brûlure (on l'empile puis on la consomme) et Élan (on l'accumule puis on frappe avec).
// l'Élan : chaque point donne +1 dégât à toutes les attaques, divisé par deux à la fin du tour
// (Aéropique, Reflet, Double Pied, Hâte, Vitesse Extrême, Turbo le créent ; Implore et Coup Victoire le dépensent).
import type { CardDef } from '../core/model';
import { breakBlock, cardMaker, dmg, draw, heal, hpLoss, multi, pa, power, prot, smult, st } from './card-kit';

const c = cardMaker('caninos', 'can');

export const CANINOS_CARDS: CardDef[] = [
  // ——— Communes (28) ———
  c('garde-large', 'Garde Large', 'normal', 'technique', 'commune', 1, 'soi', [prot(6), st('elan', 1, 'soi')], { effects: [prot(9), st('elan', 2, 'soi')] }),
  c('detection', 'Détection', 'combat', 'technique', 'commune', 1, 'soi', [prot(5), draw(1), st('elan', 1, 'soi')], { effects: [prot(8), draw(1), st('elan', 1, 'soi')] }),
  c('rempart-brulant', 'Rempart Brûlant', 'feu', 'technique', 'rare', 2, 'soi', [prot(13), st('brulure', 2, 'tous')], { effects: [prot(17), st('brulure', 3, 'tous')] }),
  c('rugissement', 'Rugissement', 'normal', 'technique', 'commune', 0, 'tous', [st('attaque', -1, 'tous'), st('brulure', 1, 'tous')], { effects: [st('attaque', -1, 'tous'), st('brulure', 2, 'tous')] }, ['epuisee']),
  c('groz-yeux', "Groz'Yeux", 'normal', 'technique', 'commune', 0, 'ennemi', [st('defense', -1), { kind: 'pioche-si-statut', status: 'brulure', amount: 1 }], { effects: [st('defense', -2), { kind: 'pioche-si-statut', status: 'brulure', amount: 2 }], keywords: [] }, ['epuisee']),
  c('flair', 'Flair', 'normal', 'technique', 'commune', 1, 'ennemi', [st('defense', -2), { kind: 'protection-par-statut', status: 'brulure', mult: 1 }], { effects: [st('defense', -3), { kind: 'protection-par-statut', status: 'brulure', mult: 2 }] }),
  c('coup-main', "Coup d'Main", 'normal', 'technique', 'commune', 0, 'soi', [st('attaque', 1, 'soi')], { effects: [st('attaque', 1, 'soi'), draw(1)] }, ['epuisee']),
  c('roue-de-feu', 'Roue de Feu', 'feu', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('brulure', 2)], { effects: [dmg(7), st('brulure', 3)] }),
  c('crocs-feu', 'Crocs Feu', 'feu', 'attaque', 'commune', 1, 'ennemi', [dmg(2), st('brulure', 2), { kind: 'protection-par-statut', status: 'brulure', mult: 1 }], { effects: [dmg(4), st('brulure', 3), { kind: 'protection-par-statut', status: 'brulure', mult: 1 }] }),
  c('crocs-eclair', 'Crocs Éclair', 'electrik', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('paralysie', 1), st('peur', 1)], { effects: [dmg(7), st('paralysie', 1), st('peur', 1)] }),
  c('plaquage', 'Plaquage', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('elan', 1, 'soi')], { effects: [dmg(9), st('elan', 2, 'soi')] }),
  c('meteores', 'Météores', 'normal', 'attaque', 'commune', 1, 'tous', [dmg(4, { parStatut: 'brulure' })], { effects: [dmg(6, { parStatut: 'brulure' })] }),
  c('grimace', 'Grimace', 'normal', 'technique', 'commune', 1, 'ennemi', [st('paralysie', 2)], { effects: [st('paralysie', 3)] }),
  c('facade', 'Façade', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(7, { facade: true })], { effects: [dmg(10, { facade: true })] }),
  c('aeropique', 'Aéropique', 'vol', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('elan', 1, 'soi')], { effects: [dmg(7), st('elan', 2, 'soi')] }, ['conservee']),
  c('pietisol', 'Piétisol', 'sol', 'attaque', 'commune', 1, 'tous', [dmg(4), st('brulure', 1, 'tous')], { effects: [dmg(6), st('brulure', 2, 'tous')] }),
  c('nitrocharge', 'Nitrocharge', 'feu', 'attaque', 'commune', 1, 'ennemi', [dmg(4, { parStatut: 'brulure' }), draw(1)], { effects: [dmg(6, { parStatut: 'brulure' }), draw(1)] }),
  c('double-pied', 'Double Pied', 'combat', 'attaque', 'commune', 1, 'ennemi', [multi(3, 2), st('elan', 1, 'soi')], { effects: [multi(4, 2), st('elan', 2, 'soi')] }),
  c('vengeance', 'Vengeance', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(5, { parSoi: 'elan' })], { effects: [dmg(7, { parSoi: 'elan' })] }),
  c('retour', 'Retour', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(5), { kind: 'soin-par-statut', status: 'brulure', mult: 1 }], { effects: [dmg(7), { kind: 'soin-par-statut', status: 'brulure', mult: 1 }, heal(2)] }),
  c('frustration', 'Frustration', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(4), st('elan', 2, 'soi')], { effects: [dmg(6), st('elan', 3, 'soi')] }),
  c('reflet', 'Reflet', 'normal', 'technique', 'commune', 1, 'soi', [prot(4), st('elan', 2, 'soi')], { effects: [prot(6), st('elan', 3, 'soi')] }),
  c('ronflement', 'Ronflement', 'normal', 'attaque', 'commune', 1, 'tous', [dmg(8), st('peur', 1, 'tous')], { effects: [dmg(12), st('peur', 1, 'tous')] }),
  c('force-cachee', 'Force Cachée', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(6), { kind: 'pioche-si-statut', status: 'brulure', amount: 1 }], { effects: [dmg(9), { kind: 'pioche-si-statut', status: 'brulure', amount: 1 }] }),
  c('chant-canon', 'Chant Canon', 'normal', 'attaque', 'commune', 1, 'tous', [dmg(3), st('brulure', 1, 'tous')], { effects: [dmg(5), st('brulure', 1, 'tous'), draw(1)] }),
  c('echo', 'Écho', 'normal', 'attaque', 'commune', 0, 'ennemi', [dmg(2, { parStatut: 'brulure' })], { effects: [dmg(4, { parStatut: 'brulure' })] }, ['conservee']),
  c('eclate-roc', 'Éclate-Roc', 'combat', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('defense', -1), st('elan', 1, 'soi')], { effects: [dmg(7), st('defense', -2), st('elan', 1, 'soi')] }),
  c('rune-protect', 'Rune Protect', 'normal', 'technique', 'commune', 1, 'soi', [prot(5), st('elan', 1, 'soi')], { effects: [prot(8), st('elan', 1, 'soi')] }),
  // Chien de la Lanterne : attaque de départ spectrale et Âmes de la Lanterne Bleue
  c('lechouille-ame', 'Léchouille des Âmes', 'spectre', 'attaque', 'depart', 1, 'ennemi', [dmg(2), draw(1)], { effects: [dmg(4), draw(1)] }),
  c('ame', 'Âme', 'spectre', 'technique', 'depart', 0, 'soi', [draw(2)], { effects: [draw(3)] }, ['epuisee']),
  c('aboiement', 'Aboiement', 'tenebres', 'attaque', 'commune', 1, 'tous', [dmg(3), st('attaque', -1, 'tous')], { effects: [dmg(5), st('attaque', -1, 'tous')] }, ['epuisee']),
  c('calinerie', 'Câlinerie', 'fee', 'attaque', 'commune', 2, 'ennemi', [dmg(11), st('attaque', -1)], { effects: [dmg(15), st('attaque', -1)] }),
  c('attraction', 'Attraction', 'normal', 'technique', 'commune', 1, 'ennemi', [st('confusion', 2)], { effects: [st('confusion', 3)] }),

  // Élan : Vive-Attaque (0 PA) et Poursuite
  c('vive-attaque', 'Vive-Attaque', 'normal', 'attaque', 'commune', 0, 'ennemi', [dmg(3), st('elan', 1, 'soi')], { effects: [dmg(4), st('elan', 2, 'soi')] }),
  c('poursuite', 'Poursuite', 'tenebres', 'attaque', 'commune', 1, 'ennemi', [dmg(4, { parSoi: 'elan' })], { effects: [dmg(6, { parSoi: 'elan' })] }),
  // Brûlure : Ébullition des braises
  c('braises', 'Braises Vives', 'feu', 'attaque', 'commune', 1, 'aleatoire', [multi(2, 3), st('brulure', 1)], { effects: [multi(3, 3), st('brulure', 1)] }),

  // ——— Peu communes (34) ———
  c('grondement', 'Grondement', 'normal', 'technique', 'peu-commune', 1, 'soi', [st('attaque', 1, 'soi'), prot(4)], { effects: [st('attaque', 1, 'soi'), prot(7)] }, ['epuisee']),
  c('machouille', 'Mâchouille', 'tenebres', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(12), st('defense', -1)], { effects: [dmg(16), st('defense', -1)] }),
  c('contre', 'Contre', 'combat', 'attaque', 'peu-commune', 1, 'ennemi', [{ kind: 'degats-pv-perdus', amount: 4, per: 3 }], { effects: [{ kind: 'degats-pv-perdus', amount: 4, per: 2 }] }),
  c('hate', 'Hâte', 'psy', 'technique', 'peu-commune', 0, 'soi', [st('elan', 3, 'soi'), draw(1)], { effects: [st('elan', 4, 'soi'), draw(2)] }, ['epuisee']),
  c('hurlement', 'Hurlement', 'normal', 'technique', 'peu-commune', 1, 'tous', [st('peur', 2, 'tous')], { effects: [st('peur', 3, 'tous')] }, ['epuisee']),
  c('belier', 'Bélier', 'normal', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(0, { parProtection: true }), hpLoss(3)], { effects: [dmg(4, { parProtection: true }), hpLoss(3)] }),
  c('lance-flammes', 'Lance-Flammes', 'feu', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(9), st('brulure', 3), smult('brulure', 2)], { effects: [dmg(12), st('brulure', 4), smult('brulure', 2)] }),
  c('damocles', 'Damoclès', 'normal', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(20), hpLoss(5)], { effects: [dmg(26), hpLoss(5)] }),
  c('tunnel', 'Tunnel', 'sol', 'attaque', 'peu-commune', 2, 'ennemi', [prot(6), dmg(10)], { effects: [prot(8), dmg(13)] }),
  c('repos', 'Repos', 'psy', 'technique', 'peu-commune', 2, 'soi', [{ kind: 'repos', turns: 3 }], { cost: 1 }, ['epuisee']),
  c('clonage', 'Clonage', 'normal', 'technique', 'peu-commune', 1, 'soi', [hpLoss(5), { kind: 'clone', amount: 15 }], { effects: [hpLoss(4), { kind: 'clone', amount: 18 }] }),
  c('larcin', 'Larcin', 'tenebres', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(6), draw(1), pa(1)], { effects: [dmg(9), draw(1), pa(1)] }, ['epuisee']),
  c('colere', 'Colère', 'dragon', 'attaque', 'peu-commune', 2, 'aleatoire', [multi(7, 3), st('confusion', 2, 'soi')], { effects: [multi(7, 4), st('confusion', 2, 'soi')] }),
  c('tenacite', 'Ténacité', 'normal', 'technique', 'peu-commune', 1, 'ennemi', [prot(4), { kind: 'protection-par-statut', status: 'brulure', mult: 2 }, st('tenace', 1, 'soi')], { effects: [prot(6), { kind: 'protection-par-statut', status: 'brulure', mult: 3 }, st('tenace', 1, 'soi')] }, ['conservee']),
  c('canicule', 'Canicule', 'feu', 'attaque', 'peu-commune', 2, 'tous', [dmg(7), st('brulure', 2, 'tous')], { effects: [dmg(9), st('brulure', 3, 'tous')] }),
  c('feu-follet', 'Feu Follet', 'feu', 'technique', 'peu-commune', 1, 'ennemi', [st('brulure', 3), { kind: 'propage-statut', status: 'brulure' }], { effects: [st('brulure', 5), { kind: 'propage-statut', status: 'brulure' }] }),
  c('megaphone', 'Mégaphone', 'normal', 'attaque', 'peu-commune', 2, 'tous', [dmg(6, { parSoi: 'elan' })], { effects: [dmg(9, { parSoi: 'elan' })] }),
  c('draco-choc', 'Draco-Choc', 'dragon', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(10, { parSoi: 'elan', parSoiX: 2 })], { effects: [dmg(14, { parSoi: 'elan', parSoiX: 2 })] }),
  c('eclair-fou', 'Éclair Fou', 'electrik', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(9), hpLoss(2), st('elan', 2, 'soi')], { effects: [dmg(12), hpLoss(2), st('elan', 2, 'soi')] }),
  c('tacle-feu', 'Tacle Feu', 'feu', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(8, { parStatut: 'brulure', parStatutX: 2 })], { effects: [dmg(11, { parStatut: 'brulure', parStatutX: 2 })] }),
  c('psycho-croc', 'Psycho-Croc', 'psy', 'attaque', 'peu-commune', 1, 'ennemi', [breakBlock, dmg(8)], { effects: [breakBlock, dmg(11)] }),
  c('sable-ardent', 'Sable Ardent', 'sol', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(4), st('brulure', 2), { kind: 'protection-par-statut', status: 'brulure', mult: 2 }], { effects: [dmg(6), st('brulure', 3), { kind: 'protection-par-statut', status: 'brulure', mult: 2 }] }),
  c('tera-explosion', 'Téra Explosion', 'normal', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(10, { contreStatut: true })], { effects: [dmg(13, { contreStatut: true })] }),
  c('indignition', 'Indignition', 'feu', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(6, { revanche: true }), st('brulure', 2)], { effects: [dmg(8, { revanche: true }), st('brulure', 3)] }),
  c('mania', 'Mania', 'normal', 'attaque', 'peu-commune', 2, 'aleatoire', [multi(4, 3, 4)], { effects: [multi(5, 3, 4)] }),
  c('aurore', 'Aurore', 'normal', 'technique', 'peu-commune', 1, 'tous', [st('brulure', 2, 'tous'), heal(3)], { effects: [st('brulure', 3, 'tous'), heal(5)] }, ['epuisee']),
  c('implore', 'Implore', 'normal', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(5), { kind: 'pioche-par-soi', status: 'elan', per: 3 }], { effects: [dmg(7), { kind: 'pioche-par-soi', status: 'elan', per: 2 }] }),
  c('queue-de-fer', 'Queue de Fer', 'acier', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(9, { parSoi: 'elan' }), st('defense', -1)], { effects: [dmg(12, { parSoi: 'elan' }), st('defense', -2)] }),
  c('puissance-cachee', 'Puissance Cachée', 'normal', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(6), { kind: 'metronome' }], { cost: 0 }),
  c('vantardise', 'Vantardise', 'normal', 'technique', 'peu-commune', 0, 'ennemi', [st('confusion', 3), st('attaque', 1)], { effects: [st('confusion', 4), st('attaque', 1)] }),
  c('force', 'Coup Victoire', 'feu', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(8, { parSoi: 'elan', parSoiX: 2 }), { kind: 'perd-statut', status: 'elan' }], { effects: [dmg(11, { parSoi: 'elan', parSoiX: 2 }), { kind: 'perd-statut', status: 'elan' }] }),
  c('eboulement', 'Éboulement', 'roche', 'attaque', 'peu-commune', 2, 'tous', [dmg(8), st('peur', 1, 'tous')], { effects: [dmg(11), st('peur', 1, 'tous')] }),
  c('lame-de-roc', 'Lame de Roc', 'roche', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(16)], { effects: [dmg(21)] }),
  c('blabla-dodo', 'Blabla Dodo', 'normal', 'technique', 'peu-commune', 0, 'soi', [{ kind: 'blabla' }], { effects: [{ kind: 'blabla' }, { kind: 'blabla' }] }),

  c('agilite', 'Agilité', 'psy', 'technique', 'peu-commune', 1, 'soi', [st('elan', 3, 'soi'), prot(3)], { effects: [st('elan', 4, 'soi'), prot(5)] }),
  c('feu-sacre', 'Feu Sacré', 'feu', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(10), st('brulure', 4)], { effects: [dmg(13), st('brulure', 6)] }),

  // ——— Rares (13) ———
  c('vitesse-extreme', 'Vitesse Extrême', 'normal', 'attaque', 'rare', 0, 'ennemi', [dmg(6), st('elan', 2, 'soi'), draw(1)], { effects: [dmg(8), st('elan', 3, 'soi'), draw(1)] }, ['innee']),
  c('boutefeu', 'Boutefeu', 'feu', 'attaque', 'rare', 2, 'ennemi', [dmg(16), smult('brulure', 2), hpLoss(4)], { effects: [dmg(20), smult('brulure', 3), hpLoss(4)] }),
  c('surchauffe', 'Surchauffe', 'feu', 'attaque', 'rare', 2, 'ennemi', [dmg(16, { parStatut: 'brulure', parStatutX: 2 }), st('attaque', -2, 'soi')], { effects: [dmg(20, { parStatut: 'brulure', parStatutX: 3 }), st('attaque', -2, 'soi')] }),
  // ——— Carte signature full art (bénédiction de Célébi) ———
  { ...c('detonation-arcanine', 'Détonation Arcanine', 'feu', 'attaque', 'rare', 2, 'ennemi', [{ kind: 'statut-par-soi', status: 'brulure', from: 'elan' }, { kind: 'detonation', status: 'brulure', per: 2 }], { cost: 1 }), fullArt: true, special: true },
  c('deflagration', 'Déflagration', 'feu', 'attaque', 'rare', 3, 'tous', [dmg(10), { kind: 'detonation', status: 'brulure', per: 3 }], { effects: [dmg(14), { kind: 'detonation', status: 'brulure', per: 4 }] }),
  c('zenith', 'Zénith', 'feu', 'talent', 'rare', 2, 'soi', [{ kind: 'meteo', id: 'zenith', turns: 5 }, power('zenith', 2)], { effects: [{ kind: 'meteo', id: 'zenith', turns: 5 }, power('zenith', 3)] }),
  // Soleil Intense : l'Eau s'évapore, le Feu ×1,5 pendant 5 tours
  c('soleil-intense', 'Soleil Intense', 'feu', 'technique', 'rare', 2, 'soi', [{ kind: 'meteo', id: 'soleil-intense', turns: 5 }], { cost: 1 }),
  c('danse-flammes', 'Danse Flammes', 'feu', 'talent', 'rare', 2, 'soi', [power('braises', 2)], { effects: [power('braises', 3)] }),
  c('giga-impact', 'Giga Impact', 'normal', 'attaque', 'rare', 3, 'ennemi', [dmg(30), { kind: 'recharge', amount: 2 }], { effects: [dmg(38), { kind: 'recharge', amount: 2 }] }),
  c('ultralaser', 'Ultralaser', 'normal', 'attaque', 'rare', 3, 'ennemi', [dmg(34)], { effects: [dmg(44)] }, ['ephemere']),
  c('close-combat', 'Close Combat', 'combat', 'attaque', 'rare', 2, 'ennemi', [dmg(16), st('elan', 4, 'soi'), st('defense', -1, 'soi')], { effects: [dmg(21), st('elan', 5, 'soi'), st('defense', -1, 'soi')] }),
  c('fracass-tete', "Fracass'Tête", 'roche', 'attaque', 'rare', 2, 'ennemi', [dmg(30), hpLoss(8)], { effects: [dmg(38), hpLoss(8)] }),
  c('grand-courroux', 'Grand Courroux', 'feu', 'attaque', 'rare', 2, 'ennemi', [multi(5, 3), st('brulure', 2), { kind: 'propage-statut', status: 'brulure' }], { effects: [multi(6, 3), st('brulure', 3), { kind: 'propage-statut', status: 'brulure' }] }),
  c('lance-soleil', 'Lance-Soleil', 'plante', 'attaque', 'rare', 2, 'tous', [{ kind: 'lance-soleil', amount: 23 }], { effects: [{ kind: 'lance-soleil', amount: 30 }] }),
  c('malediction', 'Turbo', 'feu', 'talent', 'rare', 1, 'soi', [power('turbo', 1)], { cost: 0 }),

  // ——— Légendaires ———
  // Vitesse Éternelle : l'Élan ne se divise plus par deux
  c('vitesse-eternelle', 'Vitesse Éternelle', 'normal', 'talent', 'legendaire', 3, 'soi', [power('elan-persistant', 1)], { cost: 2 }),
  // Brasier Éternel : la Brûlure des ennemis ne diminue plus
  c('brasier-eternel', 'Brasier Éternel', 'feu', 'talent', 'legendaire', 3, 'soi', [power('brasier-eternel', 1)], { cost: 2 }),
];
