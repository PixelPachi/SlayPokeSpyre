// Cartes de Vipélierre : capacités de Vipélierre, Lianaja et Majaspic (niveau, CT, reproduction, tuteurs).
// Identité : Vampigraine et statuts, soins et drain, et Contestation (ses baisses de stats deviennent des hausses :
// les cartes « Attaque −2 (soi) » lui donnent donc Attaque +2).
import type { CardDef } from '../core/model';
import { cardMaker, dmg, draw, heal, hpLoss, multi, pa, power, prot, smult, st } from './card-kit';

const c = cardMaker('vipelierre', 'vip');

export const VIPELIERRE_CARDS: CardDef[] = [
  // ——— Communes (28) ———
  c('garde-florale', 'Garde Florale', 'fee', 'technique', 'commune', 1, 'soi', [prot(6), heal(2)], { effects: [prot(8), heal(3)] }),
  c('cotogarde', 'Cotogarde', 'plante', 'technique', 'peu-commune', 1, 'soi', [prot(8), st('defense', -1, 'soi')], { effects: [prot(11), st('defense', -1, 'soi')] }),
  c('pico-defense', 'Pico-Défense', 'plante', 'technique', 'peu-commune', 2, 'soi', [prot(10), st('epine', 3, 'soi')], { effects: [prot(14), st('epine', 5, 'soi')] }),
  c('fouet-lianes', 'Fouet Lianes', 'plante', 'attaque', 'commune', 1, 'ennemi', [dmg(7)], { effects: [dmg(10)] }),
  c('ligotage', 'Ligotage', 'normal', 'technique', 'commune', 1, 'ennemi', [st('ligote', 1)], { cost: 0 }),
  c('groz-yeux', "Groz'Yeux", 'normal', 'technique', 'commune', 0, 'ennemi', [st('defense', -1), draw(1)], { effects: [st('defense', -2), draw(1)], keywords: [] }, ['epuisee']),
  c('croissance', 'Croissance', 'normal', 'technique', 'commune', 1, 'soi', [st('attaque', -1, 'soi'), prot(3)], { effects: [st('attaque', -1, 'soi'), prot(6)] }),
  c('feuille-magik', 'Feuille Magik', 'plante', 'attaque', 'commune', 1, 'ennemi', [dmg(6)], { effects: [dmg(9)] }, ['conservee']),
  c('mega-sangsue', 'Méga-Sangsue', 'plante', 'attaque', 'commune', 1, 'ennemi', [dmg(6, { drain: true })], { effects: [dmg(9, { drain: true })] }),
  c('souplesse', 'Souplesse', 'normal', 'attaque', 'commune', 2, 'ennemi', [dmg(13)], { effects: [dmg(17)] }),
  c('balle-graine', 'Balle Graine', 'plante', 'attaque', 'commune', 1, 'ennemi', [dmg(2, { hits: 2, hitsMax: 5 })], { effects: [dmg(3, { hits: 2, hitsMax: 5 })] }),
  c('aeropique', 'Aéropique', 'vol', 'attaque', 'commune', 1, 'ennemi', [dmg(6)], { effects: [dmg(9)] }, ['conservee']),
  c('plaquage', 'Plaquage', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('paralysie', 1)], { effects: [dmg(8), st('paralysie', 2)] }),
  c('meteores', 'Météores', 'normal', 'attaque', 'commune', 1, 'tous', [dmg(4)], { effects: [dmg(6)] }),
  c('grimace', 'Grimace', 'normal', 'technique', 'commune', 1, 'ennemi', [st('paralysie', 2)], { effects: [st('paralysie', 3)] }),
  c('facade', 'Façade', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(7, { facade: true })], { effects: [dmg(10, { facade: true })] }),
  c('coup-main', "Coup d'Main", 'normal', 'technique', 'commune', 0, 'soi', [draw(2)], { effects: [draw(2), prot(3)] }, ['epuisee']),
  c('gliss-herbe', "Gliss'Herbe", 'plante', 'attaque', 'commune', 0, 'ennemi', [dmg(4, { champ: 'champ-herbu' })], { effects: [dmg(6, { champ: 'champ-herbu' })] }),
  c('abattage', 'Abattage', 'plante', 'attaque', 'commune', 1, 'ennemi', [dmg(6), { kind: 'affaiblit', amount: 1 }], { effects: [dmg(8), { kind: 'affaiblit', amount: 1 }] }),
  c('doux-parfum', 'Doux Parfum', 'normal', 'technique', 'commune', 1, 'tous', [st('defense', -2, 'tous'), prot(4)], { effects: [st('defense', -2, 'tous'), prot(7)] }, ['epuisee']),
  c('siffl-herbe', "Siffl'Herbe", 'plante', 'technique', 'commune', 1, 'ennemi', [st('sommeil', 1)], { cost: 0 }),
  c('poursuite', 'Poursuite', 'tenebres', 'attaque', 'commune', 1, 'ennemi', [dmg(5, { contreStatut: true })], { effects: [dmg(7, { contreStatut: true })] }),
  c('ouragan', 'Ouragan', 'dragon', 'attaque', 'commune', 1, 'tous', [dmg(4), st('peur', 1, 'tous')], { effects: [dmg(6), st('peur', 1, 'tous')] }),
  c('coupe', 'Coupe', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(8)], { effects: [dmg(11)] }),
  c('retour', 'Retour', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(5), heal(2)], { effects: [dmg(7), heal(3)] }),
  c('frustration', 'Frustration', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(6, { revanche: true })], { effects: [dmg(9, { revanche: true })] }),
  c('vengeance', 'Vengeance', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(5, { revanche: true }), prot(3)], { effects: [dmg(7, { revanche: true }), prot(4)] }),
  c('chant-canon', 'Chant Canon', 'normal', 'attaque', 'commune', 1, 'tous', [dmg(3), draw(1)], { effects: [dmg(5), draw(1)] }),
  c('ronflement', 'Ronflement', 'normal', 'attaque', 'commune', 1, 'tous', [dmg(8), st('peur', 1, 'tous')], { effects: [dmg(12), st('peur', 1, 'tous')] }),
  c('rune-protect', 'Rune Protect', 'normal', 'technique', 'commune', 1, 'soi', [prot(7)], { effects: [prot(10)] }),
  c('reflet', 'Reflet', 'normal', 'technique', 'commune', 1, 'soi', [prot(4), draw(1)], { effects: [prot(6), draw(1)] }),

  // ——— Peu communes (34) ———
  c('lame-feuille', 'Lame Feuille', 'plante', 'attaque', 'peu-commune', 2, 'tous', [dmg(11)], { effects: [dmg(15)] }),
  c('enroulement', 'Enroulement', 'poison', 'technique', 'peu-commune', 1, 'soi', [st('attaque', -1, 'soi'), st('defense', -1, 'soi')], { cost: 0 }, ['epuisee']),
  c('giga-sangsue', 'Giga-Sangsue', 'plante', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(12, { drain: true })], { effects: [dmg(16, { drain: true })] }),
  c('suc-digestif', 'Suc Digestif', 'poison', 'technique', 'peu-commune', 1, 'ennemi', [smult('vampigraine', 2)], { cost: 0, keywords: [] }, ['epuisee']),
  c('danse-lames', 'Danse Lames', 'normal', 'technique', 'peu-commune', 1, 'soi', [st('attaque', -2, 'soi')], { cost: 0 }, ['epuisee']),
  c('belier', 'Bélier', 'normal', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(0, { parProtection: true }), hpLoss(3)], { effects: [dmg(4, { parProtection: true }), hpLoss(3)] }),
  c('damocles', 'Damoclès', 'normal', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(20), hpLoss(5)], { effects: [dmg(26), hpLoss(5)] }),
  c('mur-lumiere', 'Mur Lumière', 'psy', 'talent', 'peu-commune', 2, 'soi', [power('racines', 3)], { effects: [power('racines', 4)] }),
  c('protection', 'Protection', 'normal', 'technique', 'peu-commune', 2, 'soi', [prot(13)], { effects: [prot(17)] }),
  c('repos', 'Repos', 'psy', 'technique', 'peu-commune', 2, 'soi', [{ kind: 'repos', turns: 3 }], { cost: 1 }, ['epuisee']),
  c('clonage', 'Clonage', 'normal', 'technique', 'peu-commune', 1, 'soi', [hpLoss(5), { kind: 'clone', amount: 15 }], { effects: [hpLoss(4), { kind: 'clone', amount: 18 }] }),
  c('colere', 'Colère', 'dragon', 'attaque', 'peu-commune', 2, 'aleatoire', [multi(7, 3), st('confusion', 2, 'soi')], { effects: [multi(7, 4), st('confusion', 2, 'soi')] }),
  c('tenacite', 'Ténacité', 'normal', 'technique', 'peu-commune', 1, 'soi', [prot(8), st('defense', -1, 'soi'), st('tenace', 1, 'soi')], { effects: [prot(11), st('defense', -1, 'soi'), st('tenace', 1, 'soi')] }, ['epuisee']),
  c('provoc', 'Provoc', 'tenebres', 'technique', 'peu-commune', 1, 'ennemi', [st('attaque', -1), draw(1)], { effects: [st('attaque', -2), draw(1)], keywords: [] }, ['epuisee']),
  c('canon-graine', 'Canon Graine', 'plante', 'attaque', 'peu-commune', 1, 'ennemi', [multi(3, 2, 5)], { effects: [multi(4, 2, 5)] }),
  c('draco-choc', 'Draco-Choc', 'dragon', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(15)], { effects: [dmg(20)] }),
  c('eco-sphere', 'Éco-Sphère', 'plante', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(11), st('defense', -1)], { effects: [dmg(15), st('defense', -1)] }),
  c('noeud-herbe', 'Nœud Herbe', 'plante', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(5, { parStatut: 'vampigraine', parStatutX: 2 })], { effects: [dmg(7, { parStatut: 'vampigraine', parStatutX: 2 })] }),
  c('aire-d-herbe', "Aire d'Herbe", 'plante', 'attaque', 'peu-commune', 2, 'tous', [dmg(6), st('vampigraine', 1, 'tous')], { effects: [dmg(8), st('vampigraine', 2, 'tous')] }),
  c('draco-queue', 'Draco-Queue', 'dragon', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(8), st('peur', 1)], { effects: [dmg(11), st('peur', 1)] }),
  c('rafale-ecailles', 'Rafale Écailles', 'dragon', 'attaque', 'peu-commune', 2, 'ennemi', [multi(3, 2, 5), st('defense', -1, 'soi')], { effects: [multi(4, 2, 5), st('defense', -1, 'soi')] }),
  c('desherbaffe', 'Désherbaffe', 'plante', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(5), pa(1)], { effects: [dmg(8), pa(1)] }),
  c('phytomixeur', 'Phytomixeur', 'plante', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(7), st('confusion', 1)], { effects: [dmg(10), st('confusion', 1)] }),
  c('regard-medusant', 'Regard Médusant', 'normal', 'technique', 'peu-commune', 1, 'ennemi', [st('paralysie', 3)], { effects: [st('paralysie', 4)] }),
  c('regard-noir', 'Regard Noir', 'normal', 'technique', 'peu-commune', 1, 'tous', [st('peur', 2, 'tous')], { effects: [st('peur', 3, 'tous')] }, ['epuisee']),
  c('voile-miroir', 'Voile Miroir', 'psy', 'attaque', 'peu-commune', 1, 'ennemi', [{ kind: 'degats-pv-perdus', amount: 3, per: 3 }], { effects: [{ kind: 'degats-pv-perdus', amount: 3, per: 2 }] }),
  c('aromatherapie', 'Aromathérapie', 'plante', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'decouverte', pool: 'aromates', count: 3 }], { effects: [{ kind: 'decouverte', pool: 'aromates', count: 3, upgraded: true }] }, ['epuisee']),
  c('attraction', 'Attraction', 'normal', 'technique', 'peu-commune', 1, 'ennemi', [st('confusion', 2)], { effects: [st('confusion', 3)] }),
  c('seduction', 'Séduction', 'normal', 'technique', 'peu-commune', 1, 'tous', [st('attaque', -1, 'tous')], { effects: [st('attaque', -2, 'tous')] }, ['epuisee']),
  c('vantardise', 'Vantardise', 'normal', 'technique', 'peu-commune', 0, 'ennemi', [st('confusion', 3), st('attaque', 1)], { effects: [st('confusion', 4), st('attaque', 1)] }),
  c('don-naturel', 'Don Naturel', 'normal', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'baie-aleatoire', count: 1 }], { cost: 0 }, ['epuisee']),
  c('hydroqueue', 'Hydroqueue', 'eau', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(14)], { effects: [dmg(19)] }),
  c('queue-de-fer', 'Queue de Fer', 'acier', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(12), st('defense', -1)], { effects: [dmg(16), st('defense', -2)] }),
  c('soucigraine', 'Soucigraine', 'plante', 'technique', 'peu-commune', 1, 'ennemi', [st('vampigraine', 3), st('confusion', 1)], { effects: [st('vampigraine', 4), st('confusion', 2)] }),

  // ——— Rares (13) ———
  c('vege-attaque', 'Végé-Attaque', 'plante', 'attaque', 'rare', 3, 'ennemi', [dmg(28), st('attaque', -2, 'soi')], { effects: [dmg(36), st('attaque', -2, 'soi')] }),
  c('lance-soleil', 'Lance-Soleil', 'plante', 'attaque', 'rare', 2, 'tous', [{ kind: 'lance-soleil', amount: 23 }], { effects: [{ kind: 'lance-soleil', amount: 30 }] }),
  c('giga-impact', 'Giga Impact', 'normal', 'attaque', 'rare', 3, 'ennemi', [dmg(30), { kind: 'recharge', amount: 2 }], { effects: [dmg(38), { kind: 'recharge', amount: 2 }] }),
  c('ultralaser', 'Ultralaser', 'normal', 'attaque', 'rare', 3, 'ennemi', [dmg(34)], { effects: [dmg(44)] }, ['ephemere']),
  c('champ-herbu', 'Champ Herbu', 'plante', 'technique', 'rare', 1, 'soi', [{ kind: 'meteo', id: 'champ-herbu', turns: 5 }], { effects: [{ kind: 'meteo', id: 'champ-herbu', turns: 5 }, { kind: 'protection', amount: 6 }] }),
  c('zenith', 'Zénith', 'feu', 'talent', 'rare', 2, 'soi', [{ kind: 'meteo', id: 'zenith', turns: 5 }, power('zenith-plante', 2)], { effects: [{ kind: 'meteo', id: 'zenith', turns: 5 }, power('zenith-plante', 3)] }),
  c('tempete-florale', 'Tempête Florale', 'plante', 'attaque', 'rare', 2, 'tous', [dmg(10), st('defense', -1, 'soi')], { effects: [dmg(14), st('defense', -1, 'soi')] }),
  c('synthese', 'Synthèse', 'plante', 'technique', 'rare', 1, 'soi', [heal(10)], { effects: [heal(15)] }, ['epuisee']),
  c('essorage', 'Essorage', 'normal', 'technique', 'rare', 2, 'ennemi', [st('ligote', 1), st('vampigraine', 3)], { cost: 1 }),
  c('permucoeur', 'Permucœur', 'psy', 'technique', 'depart', 1, 'soi', [{ kind: 'permucoeur' }], { cost: 0 }, ['epuisee']),
  c('catalyse', 'Catalyse', 'poison', 'technique', 'depart', 1, 'ennemi', [{ kind: 'multiplie-statut', status: 'poison', mult: 2 }], { cost: 0 }, ['epuisee']),
  c('peau-dure', 'Peau Dure', 'plante', 'talent', 'peu-commune', 1, 'soi', [power('peau-dure', 2)], { effects: [power('peau-dure', 3)] }),
  c('plenitude', 'Plénitude', 'psy', 'technique', 'rare', 1, 'soi', [st('attaque', -2, 'soi'), st('defense', -2, 'soi')], { cost: 0 }, ['epuisee']),
  c('puissance-cachee', 'Puissance Cachée', 'normal', 'attaque', 'rare', 1, 'ennemi', [dmg(6), { kind: 'metronome' }], { cost: 0 }),
  c('blabla-dodo', 'Blabla Dodo', 'normal', 'technique', 'rare', 0, 'soi', [{ kind: 'blabla' }], { effects: [{ kind: 'blabla' }, { kind: 'blabla' }] }),
  c('force', 'Force', 'normal', 'attaque', 'rare', 2, 'ennemi', [dmg(16), st('attaque', -1, 'soi')], { effects: [dmg(21), st('attaque', -1, 'soi')] }),
  // ——— Aromates (créés par Aromathérapie, seulement pour le combat en cours) ———
  // Aromates officiels (menthes de nature) : chacun suit la statistique qu'il renforce dans les jeux
  c('arom-rouge', 'Aromate Rigide', 'feu', 'attaque', 'depart', 0, 'ennemi', [dmg(6)], { effects: [dmg(9)] }), // Attaque
  c('arom-bleu', 'Aromate Assuré', 'eau', 'technique', 'depart', 0, 'soi', [prot(6)], { effects: [prot(9)] }), // Défense
  c('arom-rose', 'Aromate Calme', 'fee', 'technique', 'depart', 0, 'soi', [heal(4)], { effects: [heal(6)] }), // Défense Spéciale
  c('arom-vert', 'Aromate Jovial', 'plante', 'technique', 'depart', 0, 'soi', [{ kind: 'pa', amount: 1 }], { effects: [{ kind: 'pa', amount: 1 }, draw(1)] }), // Vitesse
  c('arom-jaune', 'Aromate Sérieux', 'normal', 'technique', 'depart', 0, 'soi', [draw(2)], { effects: [draw(3)] }), // neutre
  c('arom-dore', 'Aromate Modeste', 'glace', 'technique', 'depart', 0, 'ennemi', [st('vampigraine', 3)], { effects: [st('vampigraine', 5)] }), // Attaque Spéciale
];
