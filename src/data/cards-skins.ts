// Cartes de skin : 4 communes liées à la mécanique du skin + 1 talent légendaire.
// Proposées uniquement quand on joue avec ce skin (champ `skin`).
import type { CardDef, CharacterId, Effect } from '../core/model';
import { bebeAtk, bebeProt, cardMaker, dmg, draw, multi, power, prot, smult, st } from './card-kit';

const aura = (amount: number): Effect => ({ kind: 'aura', amount });

function skin(character: CharacterId, prefix: string, id: string, cards: CardDef[]): CardDef[] {
  void character; void prefix;
  return cards.map((d) => ({ ...d, skin: id }));
}

const rio = cardMaker('riolu', 'rio');
const vip = cardMaker('vipelierre', 'vip');
const kan = cardMaker('kangourex', 'kan');
const can = cardMaker('caninos', 'can');

export const SKIN_CARDS: CardDef[] = [
  // ——— Riolu Cramoisi : l'Aura devient de la Brûlure ———
  ...skin('riolu', 'rio', 'magma', [
    rio('poing-braise', 'Poing Braise', 'feu', 'attaque', 'commune', 1, 'ennemi', [dmg(5), aura(2)], { effects: [dmg(7), aura(3)] }),
    rio('aura-ardente', 'Aura Ardente', 'feu', 'technique', 'commune', 1, 'soi', [prot(5), aura(3)], { effects: [prot(7), aura(4)] }),
    rio('nitrocharge', 'Nitrocharge', 'feu', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('brulure', 2)], { effects: [dmg(8), st('brulure', 3)] }),
    rio('roue-de-feu', 'Roue de Feu', 'feu', 'attaque', 'commune', 1, 'tous', [dmg(3), st('brulure', 1, 'tous')], { effects: [dmg(5), st('brulure', 2, 'tous')] }),
    rio('coeur-de-magma', 'Cœur de Magma', 'feu', 'talent', 'legendaire', 3, 'soi', [power('coeur-magma', 1)], { cost: 2 }),
  ]),
  // ——— Lucario Féerique : attaques Fée et Attraction ———
  ...skin('riolu', 'rio', 'feerique', [
    rio('vent-feerique', 'Vent Féerique', 'fee', 'attaque', 'commune', 1, 'ennemi', [dmg(7)], { effects: [dmg(10)] }),
    rio('bisou', 'Bisou', 'fee', 'technique', 'commune', 1, 'ennemi', [st('attraction', 2), prot(3)], { effects: [st('attraction', 3), prot(5)] }),
    rio('doux-baiser', 'Doux Baiser', 'fee', 'attaque', 'commune', 1, 'ennemi', [multi(3, 2)], { effects: [multi(4, 2)] }),
    rio('voile-rose', 'Voile Rose', 'fee', 'technique', 'commune', 1, 'soi', [prot(7), aura(1)], { effects: [prot(10), aura(1)] }),
    rio('charme-celeste', 'Charme Céleste', 'fee', 'talent', 'legendaire', 3, 'soi', [power('charme-celeste', 1)], { cost: 2 }),
  ]),
  // ——— Vipélierre Alchimiste : Poison et stats inversées ———
  ...skin('vipelierre', 'vip', 'alchimiste', [
    vip('fiole-toxique', 'Fiole Toxique', 'poison', 'attaque', 'commune', 1, 'ennemi', [dmg(4), st('poison', 3)], { effects: [dmg(5), st('poison', 5)] }),
    vip('transmutation', 'Transmutation', 'poison', 'technique', 'commune', 1, 'ennemi', [st('attaque', -2), st('defense', -1)], { effects: [st('attaque', -3), st('defense', -2)] }),
    vip('brume-acide', 'Brume Acide', 'poison', 'technique', 'commune', 1, 'tous', [st('poison', 2, 'tous')], { effects: [st('poison', 3, 'tous')] }),
    vip('distillation', 'Distillation', 'poison', 'technique', 'commune', 1, 'ennemi', [smult('poison', 2)], { effects: [smult('poison', 2), prot(4)] }, ['epuisee']),
    vip('pierre-philosophale', 'Pierre Philosophale', 'poison', 'talent', 'legendaire', 3, 'soi', [power('pierre-philosophale', 1)], { cost: 2 }),
  ]),
  // ——— Tisserand de Soie Astrale : Psy / Ténèbres, cartes tissées ———
  ...skin('vipelierre', 'vip', 'tisserand', [
    vip('fil-astral', 'Fil Astral', 'psy', 'technique', 'commune', 0, 'soi', [{ kind: 'double-tisse' }], { effects: [{ kind: 'double-tisse' }, draw(1)] }),
    vip('toile-onirique', 'Toile Onirique', 'psy', 'technique', 'commune', 0, 'soi', [{ kind: 'double-enchant' }], { effects: [{ kind: 'double-enchant' }, draw(1)] }),
    vip('lame-du-neant', 'Lame du Néant', 'tenebres', 'attaque', 'commune', 1, 'ennemi', [{ kind: 'epuise-main', perCard: 7 }, st('peur', 1)], { effects: [{ kind: 'epuise-main', perCard: 9 }, st('peur', 1)] }),
    vip('cocon-stellaire', 'Cocon Stellaire', 'psy', 'technique', 'commune', 1, 'soi', [prot(6), draw(1)], { effects: [prot(9), draw(1)] }),
    vip('trame-du-destin', 'Trame du Destin', 'psy', 'talent', 'legendaire', 3, 'soi', [power('trame-destin', 1)], { cost: 2 }),
  ]),
  // ——— Kangourex Gardien Océanique : Eau et Protection du Bébé ———
  ...skin('kangourex', 'kan', 'oceanique', [
    kan('bulles-marines', 'Bulles Marines', 'eau', 'attaque', 'commune', 1, 'tous', [dmg(4), bebeProt(2)], { effects: [dmg(6), bebeProt(3)] }),
    kan('aqua-queue', 'Aqua-Queue', 'eau', 'attaque', 'commune', 0, 'ennemi', [dmg(3), bebeAtk(1)], { effects: [dmg(5), bebeAtk(1)] }),
    kan('vague-protectrice', 'Vague Protectrice', 'eau', 'technique', 'commune', 1, 'soi', [prot(5), bebeProt(5)], { effects: [prot(7), bebeProt(7)] }),
    kan('deferlante', 'Déferlante', 'eau', 'attaque', 'commune', 1, 'ennemi', [multi(2, 3), bebeProt(2)], { effects: [multi(3, 3), bebeProt(3)] }),
    kan('maree-protectrice', 'Marée Protectrice', 'eau', 'talent', 'legendaire', 3, 'soi', [power('maree-protectrice', 1)], { cost: 2 }),
  ]),
  // ——— Caninos Chien de la Lanterne : la pioche brûle les ennemis ———
  ...skin('caninos', 'can', 'lanterne', [
    can('feu-follet-ame', 'Feu Follet Ardent', 'spectre', 'attaque', 'commune', 1, 'ennemi', [dmg(4), st('brulure', 2), draw(1)], { effects: [dmg(6), st('brulure', 2), draw(1)] }),
    can('appel-des-ames', 'Appel des Âmes', 'spectre', 'technique', 'commune', 1, 'soi', [draw(3)], { effects: [draw(4)] }),
    can('ombre-errante', 'Ombre Errante', 'spectre', 'attaque', 'commune', 1, 'ennemi', [dmg(5), draw(1)], { effects: [dmg(7), draw(1)] }),
    can('voile-spectral', 'Voile Spectral', 'spectre', 'technique', 'commune', 1, 'soi', [prot(5), draw(1)], { effects: [prot(8), draw(1)] }),
    can('bucher-des-ames', 'Bûcher des Âmes', 'spectre', 'talent', 'legendaire', 3, 'soi', [power('bucher-ames', 2)], { cost: 2 }),
  ]),
  // ——— Caninos d'Hisui : Roche et contrecoup sans danger (Tête de Roc) ———
  ...skin('caninos', 'can', 'hisui', [
    can('fracass-roc', 'Fracass’Roc', 'roche', 'attaque', 'commune', 1, 'ennemi', [dmg(9, { recul: 3 })], { effects: [dmg(12, { recul: 3 })] }),
    can('eboulis', 'Éboulis', 'roche', 'attaque', 'commune', 1, 'ennemi', [multi(3, 3)], { effects: [multi(4, 3)] }),
    can('roc-boulet', 'Roc-Boulet', 'roche', 'attaque', 'commune', 2, 'tous', [dmg(9, { recul: 4 })], { effects: [dmg(12, { recul: 4 })] }),
    can('carapace-roc', 'Carapace de Roc', 'roche', 'technique', 'commune', 1, 'soi', [prot(6), st('defense', 1, 'soi')], { effects: [prot(9), st('defense', 1, 'soi')] }),
    can('avalanche', 'Avalanche', 'roche', 'talent', 'legendaire', 3, 'soi', [power('avalanche', 3)], { cost: 2 }),
  ]),
];
