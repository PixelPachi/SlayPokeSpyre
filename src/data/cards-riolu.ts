// Cartes de Riolu : une carte par capacité que Riolu ou Lucario peut apprendre (niveau, CT, reproduction).
// Le niveau de déblocage (EXP de fin de run) de chaque carte est dans data/unlocks.ts.
import type { CardDef, Effect, Keyword, Rarity, Target } from '../core/model';
import type { PokeType } from '../core/types';

const dmg = (amount: number, extra: Partial<Extract<Effect, { kind: 'degats' }>> = {}): Effect => ({ kind: 'degats', amount, ...extra });
const st = (status: Extract<Effect, { kind: 'statut' }>['status'], stacks: number, on: 'cible' | 'soi' | 'tous' = 'cible'): Effect =>
  ({ kind: 'statut', status, stacks, on });
const aura = (amount: number): Effect => ({ kind: 'aura', amount });
const prot = (amount: number): Effect => ({ kind: 'protection', amount });
const draw = (amount: number): Effect => ({ kind: 'pioche', amount });
const hpLoss = (amount: number): Effect => ({ kind: 'perte-pv', amount });

function c(
  id: string, name: string, pokeType: PokeType, category: CardDef['category'], rarity: Rarity, cost: number,
  target: Target, effects: Effect[], upgrade: CardDef['upgrade'], keywords?: Keyword[], requires?: CardDef['requires'],
): CardDef {
  return { id, name, character: 'riolu', pokeType, category, rarity, cost, target, effects, upgrade, keywords, requires };
}
const eff = <K extends Effect['kind']>(kind: K, extra: Omit<Extract<Effect, { kind: K }>, 'kind'>): Effect => ({ kind, ...extra } as Effect);

export const RIOLU_CARDS: CardDef[] = [
  // ——— Départ ———
  c('ruse', 'Ruse', 'normal', 'attaque', 'depart', 1, 'ennemi', [dmg(6)], { effects: [dmg(9)] }),
  c('detection', 'Détection', 'combat', 'technique', 'depart', 1, 'soi', [prot(5)], { effects: [prot(8)] }),
  c('poing-karate', 'Poing-Karaté', 'combat', 'attaque', 'depart', 1, 'ennemi', [dmg(8)], { effects: [dmg(11)] }),
  c('aurasphere', 'Aurasphère', 'combat', 'attaque', 'depart', 3, 'ennemi', [{ kind: 'degats-aura', mult: 2 }], { cost: 2 }),

  // ——— Communes ———
  c('garde-aura', 'Garde Aura', 'combat', 'technique', 'commune', 1, 'soi', [prot(5), eff('protection-aura', { per: 3 })], { effects: [prot(7), eff('protection-aura', { per: 2 })] }),
  c('garde-large', 'Garde Large', 'normal', 'technique', 'commune', 1, 'soi', [prot(6), aura(2)], { effects: [prot(9), aura(3)] }),
  c('protection', 'Protection', 'normal', 'technique', 'peu-commune', 1, 'soi', [prot(9), draw(1)], { effects: [prot(12), draw(1)] }),
  c('bouclier-royal', 'Bouclier Royal', 'acier', 'technique', 'rare', 2, 'soi', [prot(13), st('attaque', -1, 'tous')], { effects: [prot(17), st('attaque', -1, 'tous')] }),
  c('mach-punch', 'Mach Punch', 'combat', 'attaque', 'commune', 0, 'ennemi', [dmg(3), draw(1)], { effects: [dmg(5), draw(1)] }),
  c('vive-attaque', 'Vive-Attaque', 'normal', 'attaque', 'commune', 0, 'ennemi', [dmg(6)], { effects: [dmg(6), draw(1)] }),
  c('riposte', 'Riposte', 'combat', 'technique', 'commune', 1, 'soi', [prot(4), aura(4)], { effects: [prot(6), aura(6)] }),
  c('balayette', 'Balayette', 'combat', 'attaque', 'commune', 1, 'tous', [dmg(4), st('peur', 1, 'tous')], { effects: [dmg(6), st('peur', 1, 'tous')] }),
  c('tenacite', 'Ténacité', 'normal', 'technique', 'commune', 0, 'soi', [st('tenace', 1, 'soi')], { effects: [st('tenace', 1, 'soi'), draw(1)] }),
  c('forte-paume', 'Forte-Paume', 'combat', 'attaque', 'commune', 2, 'ennemi', [dmg(9), st('paralysie', 1)], { effects: [dmg(12), st('paralysie', 2)] }),
  c('pisto-poing', 'Pisto-Poing', 'acier', 'attaque', 'commune', 0, 'ennemi', [dmg(4), prot(2)], { effects: [dmg(5), prot(4)] }),
  c('onde-vide', 'Onde Vide', 'combat', 'attaque', 'commune', 0, 'ennemi', [dmg(3), aura(2)], { effects: [dmg(4), aura(3)] }),
  c('eclate-roc', 'Éclate-Roc', 'combat', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('peur', 1)], { effects: [dmg(7), st('peur', 1)] }),
  c('griffe-acier', 'Griffe Acier', 'acier', 'attaque', 'commune', 2, 'ennemi', [prot(6), dmg(6)], { effects: [prot(8), dmg(8)] }),
  c('riolu-morsure', 'Morsure', 'tenebres', 'attaque', 'commune', 1, 'ennemi', [dmg(7), st('peur', 1)], { effects: [dmg(9), st('peur', 2)] }),
  c('grincement', 'Grincement', 'normal', 'technique', 'commune', 1, 'tous', [st('peur', 2, 'tous')], { effects: [st('peur', 3, 'tous')] }),
  c('coup-main', "Coup d'Main", 'normal', 'technique', 'commune', 0, 'soi', [aura(4), draw(1)], { effects: [aura(4), draw(2)] }),
  c('casse-brique', 'Casse-Brique', 'combat', 'attaque', 'commune', 2, 'ennemi', [{ kind: 'casse-protection' }, dmg(8)], { cost: 1 }),
  c('balayage', 'Balayage', 'combat', 'attaque', 'commune', 1, 'tous', [dmg(9)], { effects: [dmg(12)] }),
  c('tomberoche', 'Tomberoche', 'roche', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('paralysie', 1)], { effects: [dmg(9), st('paralysie', 1)] }),
  c('pietisol', 'Piétisol', 'sol', 'attaque', 'commune', 1, 'tous', [dmg(5)], { effects: [dmg(7)] }),
  c('meteores', 'Météores', 'normal', 'attaque', 'commune', 1, 'tous', [dmg(5)], { effects: [dmg(7)] }),
  c('facade', 'Façade', 'normal', 'attaque', 'commune', 1, 'ennemi', [dmg(7, { facade: true })], { effects: [dmg(10, { facade: true })] }),
  c('affilage', 'Affilage', 'normal', 'technique', 'commune', 1, 'soi', [st('attaque', 1, 'soi'), draw(1)], { cost: 0 }, ['epuisee']),
  c('grimace', 'Grimace', 'normal', 'technique', 'commune', 1, 'ennemi', [st('paralysie', 2)], { effects: [st('paralysie', 3)] }),
  c('poing-eclair', 'Poing Éclair', 'electrik', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('paralysie', 1)], { effects: [dmg(9), st('paralysie', 1)] }),
  c('poing-glace', 'Poing Glace', 'glace', 'attaque', 'commune', 1, 'ennemi', [dmg(8), st('gel', 1)], { effects: [dmg(11), st('gel', 1)] }),
  c('represailles', 'Représailles', 'tenebres', 'attaque', 'commune', 1, 'ennemi', [dmg(7, { revanche: true })], { effects: [dmg(10, { revanche: true })] }),
  c('vibraqua', 'Vibraqua', 'eau', 'attaque', 'commune', 1, 'ennemi', [dmg(7), st('confusion', 1)], { effects: [dmg(10), st('confusion', 1)] }),
  c('aeropique', 'Aéropique', 'vol', 'attaque', 'commune', 1, 'ennemi', [dmg(7)], { effects: [dmg(10)] }, ['conservee']),
  c('griffe-ombre', 'Griffe Ombre', 'spectre', 'attaque', 'commune', 1, 'ennemi', [dmg(6), draw(1)], { effects: [dmg(9), draw(1)] }),
  c('direct-toxik', 'Direct Toxik', 'poison', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('poison', 2)], { effects: [dmg(8), st('poison', 3)] }),

  // ——— Peu communes ———
  c('prevention', 'Prévention', 'combat', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'aura-protection', mult: 1 }], { effects: [{ kind: 'aura-protection', mult: 1.5 }] }),
  c('vibrobscur', 'Vibrobscur', 'tenebres', 'attaque', 'peu-commune', 2, 'ennemi', [{ kind: 'degats-aura', mult: 1, consume: false }], { cost: 1 }),
  c('contre', 'Contre', 'combat', 'attaque', 'peu-commune', 1, 'ennemi', [{ kind: 'degats-pv-perdus', amount: 4, per: 3 }], { effects: [{ kind: 'degats-pv-perdus', amount: 4, per: 2 }] }),
  c('coup-croix', 'Coup Croix', 'combat', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(14), hpLoss(2)], { effects: [dmg(19), hpLoss(2)] }),
  c('close-combat', 'Close Combat', 'combat', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(18), st('defense', -1, 'soi'), eff('fin-tour', {})], { effects: [dmg(24), st('defense', -1, 'soi'), eff('fin-tour', {})] }),
  c('gonflette', 'Gonflette', 'combat', 'technique', 'peu-commune', 1, 'soi', [st('attaque', 1, 'soi'), st('defense', 1, 'soi')], { keywords: ['epuisee', 'innee'] }, ['epuisee']),
  c('poing-boost', 'Poing Boost', 'combat', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(5), st('attaque', 1, 'soi')], { effects: [dmg(7), st('attaque', 1, 'soi')] }),
  c('rengorgement', 'Rengorgement', 'normal', 'technique', 'peu-commune', 1, 'soi', [st('attaque', 1, 'soi'), aura(3)], { effects: [st('attaque', 1, 'soi'), aura(6)] }, ['epuisee']),
  c('charge-os', 'Charge Os', 'sol', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(3, { hits: 2, hitsMax: 4 })], { effects: [dmg(4, { hits: 3, hitsMax: 4 })] }),
  c('vampi-poing', 'Vampi-Poing', 'combat', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(10, { drain: true })], { effects: [dmg(14, { drain: true })] }),
  c('force', 'Force', 'normal', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(15)], { effects: [dmg(20)] }),
  c('hate', 'Hâte', 'psy', 'technique', 'peu-commune', 0, 'soi', [{ kind: 'pa', amount: 2 }], { effects: [{ kind: 'pa', amount: 2 }, draw(1)] }, ['epuisee']),
  c('mur-de-fer', 'Mur de Fer', 'acier', 'technique', 'peu-commune', 2, 'soi', [prot(10), st('defense', 1, 'soi')], { effects: [prot(14), st('defense', 1, 'soi')] }),
  c('clonage', 'Clonage', 'normal', 'technique', 'peu-commune', 1, 'soi', [hpLoss(6), prot(14)], { effects: [hpLoss(6), prot(18)] }),
  c('machouille', 'Mâchouille', 'tenebres', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(12), st('peur', 1)], { effects: [dmg(16), st('peur', 1)] }),
  c('poing-meteore', 'Poing Météore', 'acier', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(0, { parProtection: true })], { effects: [dmg(0, { parProtection: true }), st('defense', 1, 'soi')] }),
  c('draco-choc', 'Draco-Choc', 'dragon', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(15)], { effects: [dmg(20)] }),
  c('projection', 'Projection', 'combat', 'attaque', 'peu-commune', 2, 'ennemi', [eff('protection-cible', {}), dmg(11)], { effects: [eff('protection-cible', {}), dmg(15)] }),
  c('pied-bruleur', 'Pied Brûleur', 'feu', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(11), st('brulure', 2)], { effects: [dmg(14), st('brulure', 3)] }),
  c('vibra-soin', 'Vibra Soin', 'psy', 'technique', 'peu-commune', 1, 'ennemi', [{ kind: 'soin', amount: 10 }, eff('soin-cible', { amount: 10 })], { effects: [{ kind: 'soin', amount: 15 }, eff('soin-cible', { amount: 10 })] }, ['epuisee']),
  c('strido-son', 'Strido-Son', 'acier', 'technique', 'peu-commune', 1, 'tous', [st('peur', 1, 'tous')], { effects: [st('peur', 2, 'tous')] }),
  c('queue-de-fer', 'Queue de Fer', 'acier', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(4, { parProtection: true })], { cost: 1 }),
  c('plaquage', 'Plaquage', 'normal', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(12), st('paralysie', 1)], { effects: [dmg(16), st('paralysie', 1)] }),
  c('belier', 'Bélier', 'normal', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(16), hpLoss(3)], { effects: [dmg(21), hpLoss(3)] }),
  c('seisme', 'Séisme', 'sol', 'attaque', 'peu-commune', 2, 'tous', [dmg(9)], { effects: [dmg(12)] }),
  c('eboulement', 'Éboulement', 'roche', 'attaque', 'peu-commune', 2, 'tous', [dmg(8, { peurChance: 0.3 })], { effects: [dmg(11, { peurChance: 0.3 })] }),
  c('psyko', 'Psyko', 'psy', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(14), st('confusion', 1)], { effects: [dmg(18), st('confusion', 1)] }),
  c('ball-ombre', "Ball'Ombre", 'spectre', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(13, { cumul: 5 }), st('peur', 1)], { effects: [dmg(17, { cumul: 5 }), st('peur', 1)] }),
  c('luminocanon', 'Luminocanon', 'acier', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(15)], { effects: [dmg(19)] }, undefined, { block: 1 }),
  c('lame-de-roc', 'Lame de Roc', 'roche', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(18)], { effects: [dmg(24)] }),
  c('photocopie', 'Photocopie', 'normal', 'technique', 'peu-commune', 1, 'soi', [eff('double-jeu', { amount: 1 })], { effects: [eff('double-jeu', { amount: 2 })] }),
  c('hurlement', 'Hurlement', 'normal', 'technique', 'peu-commune', 1, 'tous', [eff('fuite', {})], { cost: 0 }, undefined, { notBoss: true }),
  c('psykoudboul', "Psykoud'Boul", 'psy', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(13), st('peur', 1)], { effects: [dmg(17), st('peur', 2)] }),
  c('pied-voltige', 'Pied Voltige', 'combat', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(20, { recul: 10 })], { effects: [dmg(26, { recul: 10 })] }),

  // ——— Rares ———
  c('vitesse-extreme', 'Vitesse Extrême', 'normal', 'attaque', 'rare', 1, 'aleatoire', [dmg(6, { hits: 2 }), draw(1)], { effects: [dmg(8, { hits: 2 }), draw(1)] }),
  c('plenitude', 'Plénitude', 'psy', 'talent', 'rare', 1, 'soi', [{ kind: 'pouvoir', power: 'plenitude', amount: 3 }], { effects: [{ kind: 'pouvoir', power: 'plenitude', amount: 4 }] }),
  c('lire-esprit', 'Lire-Esprit', 'normal', 'talent', 'rare', 2, 'soi', [{ kind: 'pouvoir', power: 'lire-esprit', amount: 1 }], { cost: 1 }),
  c('machination', 'Machination', 'tenebres', 'technique', 'rare', 1, 'soi', [aura(10), { kind: 'pa', amount: 1 }], { effects: [aura(15), { kind: 'pa', amount: 1 }] }, ['epuisee']),
  c('megapoing', 'Mégapoing', 'normal', 'attaque', 'rare', 4, 'ennemi', [dmg(35)], { effects: [dmg(47)] }),
  c('danse-lames', 'Danse Lames', 'normal', 'technique', 'rare', 1, 'soi', [st('attaque', 2, 'soi')], { effects: [st('attaque', 3, 'soi')] }, ['epuisee']),
  c('metronome', 'Métronome', 'normal', 'technique', 'rare', 1, 'soi', [{ kind: 'metronome' }], { cost: 0 }),
  c('ultimawashi', 'Ultimawashi', 'normal', 'attaque', 'rare', 3, 'ennemi', [dmg(30)], { effects: [dmg(38)] }),
  c('tout-ou-rien', 'Tout ou Rien', 'combat', 'attaque', 'rare', 1, 'ennemi', [{ kind: 'tout-ou-rien' }], { cost: 0 }, ['epuisee']),
  c('exploforce', 'Exploforce', 'combat', 'attaque', 'rare', 0, 'ennemi', [eff('consomme-aura', { amount: 20 }), dmg(15, { noAura: true }), st('peur', 2)], { effects: [eff('consomme-aura', { amount: 20 }), dmg(20, { noAura: true }), st('peur', 2)] }, undefined, { aura: 20 }),
  c('mitra-poing', 'Mitra-Poing', 'combat', 'attaque', 'rare', 3, 'ennemi', [eff('concentration', { amount: 30 })], { effects: [eff('concentration', { amount: 40 })] }),
  c('metalaser', 'Métalaser', 'acier', 'attaque', 'rare', 0, 'ennemi', [dmg(36), eff('auto-degats', { amount: 36 })], { effects: [dmg(46), eff('auto-degats', { amount: 36 })] }),
  c('ultralaser', 'Ultralaser', 'normal', 'attaque', 'rare', 3, 'tous', [dmg(38, { noAura: true }), st('etourdi', 1, 'soi')], { effects: [dmg(48, { noAura: true }), st('etourdi', 1, 'soi')] }, ['epuisee']),
];
