// Cartes neutres : tous les Pokémon peuvent les apprendre (cartes grises).
// Leurs types sont ceux qu'aucun personnage n'a (pas de Combat, Plante, Normal, Feu ni Psy),
// et aucune ne reprend une capacité déjà présente dans le deck d'un personnage.
import type { CardDef, Effect, Keyword, Rarity, Target } from '../core/model';
import type { PokeType } from '../core/types';

const dmg = (amount: number, extra: Partial<Extract<Effect, { kind: 'degats' }>> = {}): Effect => ({ kind: 'degats', amount, ...extra });
const st = (status: Extract<Effect, { kind: 'statut' }>['status'], stacks: number, on: 'cible' | 'soi' | 'tous' = 'cible'): Effect =>
  ({ kind: 'statut', status, stacks, on });
const prot = (amount: number): Effect => ({ kind: 'protection', amount });
const draw = (amount: number): Effect => ({ kind: 'pioche', amount });

function n(
  id: string, name: string, pokeType: PokeType, category: CardDef['category'], rarity: Rarity, cost: number,
  target: Target, effects: Effect[], upgrade: CardDef['upgrade'], keywords?: Keyword[],
): CardDef {
  return { id: `n-${id}`, name, character: 'normal', pokeType, category, rarity, cost, target, effects, upgrade, keywords };
}

export const NEUTRAL_CARDS: CardDef[] = [
  // ——— Skins primordiaux : le cri de Dialga Primal remplace une carte de départ ———
  n('hurle-temps', 'Hurle-Temps', 'dragon', 'attaque', 'depart', 2, 'ennemi', [dmg(30), { kind: 'recharge', amount: 2 }], { effects: [dmg(40), { kind: 'recharge', amount: 2 }] }),

  // ——— Sommeil ———
  n('paresse', 'Paresse', 'normal', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'repos', turns: 3, healPct: 0.5 }, { kind: 'ajoute-sommeil' }], { cost: 0 }, ['epuisee']),
  // Jouables seulement endormi
  n('devoreve', 'Dévorêve', 'psy', 'attaque', 'peu-commune', 1, 'ennemi', [dmg(10, { drain: true })], { effects: [dmg(14, { drain: true })] }),
  n('cauchemar', 'Cauchemar', 'spectre', 'attaque', 'peu-commune', 1, 'tous', [dmg(4), st('confusion', 2, 'tous')], { effects: [dmg(6), st('confusion', 2, 'tous'), st('peur', 1, 'tous')] }),
  n('baillement', 'Bâillement', 'normal', 'technique', 'commune', 1, 'ennemi', [st('sommeil', 2)], { effects: [st('sommeil', 2), draw(1)] }),

  // ——— Météo et terrains (5 tours, pour tous les Pokémon) ———
  n('danse-pluie', 'Danse Pluie', 'eau', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'meteo', id: 'pluie', turns: 5 }], { effects: [{ kind: 'meteo', id: 'pluie', turns: 5 }, draw(1)] }),
  n('tempete-sable', 'Tempête de Sable', 'roche', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'meteo', id: 'tempete-sable', turns: 5 }], { effects: [{ kind: 'meteo', id: 'tempete-sable', turns: 5 }, prot(6)] }),
  n('grele', 'Grêle', 'glace', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'meteo', id: 'grele', turns: 5 }], { effects: [{ kind: 'meteo', id: 'grele', turns: 5 }, prot(6)] }),
  n('champ-electrifie', 'Champ Électrifié', 'electrik', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'meteo', id: 'champ-electrifie', turns: 5 }], { effects: [{ kind: 'meteo', id: 'champ-electrifie', turns: 5 }, draw(1)] }),
  n('champ-brumeux', 'Champ Brumeux', 'fee', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'meteo', id: 'champ-brumeux', turns: 5 }], { effects: [{ kind: 'meteo', id: 'champ-brumeux', turns: 5 }, prot(6)] }),

  // ——— Eau ———
  n('pistolet-a-o', 'Pistolet à O', 'eau', 'attaque', 'commune', 1, 'ennemi', [dmg(6)], { effects: [dmg(9)] }),
  n('aqua-jet', 'Aqua-Jet', 'eau', 'attaque', 'commune', 0, 'ennemi', [dmg(4)], { effects: [dmg(6)] }),
  n('bulles-d-o', "Bulles d'O", 'eau', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('paralysie', 1)], { effects: [dmg(7), st('paralysie', 1)] }),
  n('cascade', 'Cascade', 'eau', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(13), st('peur', 1)], { effects: [dmg(17), st('peur', 1)] }),
  n('surf', 'Surf', 'eau', 'attaque', 'peu-commune', 2, 'tous', [dmg(9)], { effects: [dmg(12)] }),
  n('hydrocanon', 'Hydrocanon', 'eau', 'attaque', 'rare', 3, 'ennemi', [dmg(30)], { effects: [dmg(39)] }),

  // ——— Électrik ———
  n('eclair', 'Éclair', 'electrik', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('paralysie', 1)], { effects: [dmg(7), st('paralysie', 2)] }),
  n('cage-eclair', 'Cage-Éclair', 'electrik', 'technique', 'commune', 1, 'ennemi', [st('paralysie', 3)], { effects: [st('paralysie', 4)] }),
  n('tonnerre', 'Tonnerre', 'electrik', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(13), st('paralysie', 1)], { effects: [dmg(17), st('paralysie', 1)] }),
  n('fatal-foudre', 'Fatal-Foudre', 'electrik', 'attaque', 'rare', 3, 'ennemi', [dmg(26), st('paralysie', 2)], { effects: [dmg(33), st('paralysie', 2)] }),

  // ——— Glace ———
  n('poudreuse', 'Poudreuse', 'glace', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('confusion', 1)], { effects: [dmg(7), st('confusion', 2)] }),
  n('vent-glace', 'Vent Glace', 'glace', 'attaque', 'peu-commune', 1, 'tous', [dmg(4), st('paralysie', 1, 'tous')], { effects: [dmg(6), st('paralysie', 1, 'tous')] }),
  n('laser-glace', 'Laser Glace', 'glace', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(14), st('confusion', 1)], { effects: [dmg(18), st('confusion', 1)] }),
  n('blizzard', 'Blizzard', 'glace', 'attaque', 'rare', 3, 'tous', [dmg(14), st('paralysie', 1, 'tous')], { effects: [dmg(18), st('paralysie', 1, 'tous')] }),

  // ——— Poison ———
  n('acide', 'Acide', 'poison', 'attaque', 'commune', 1, 'tous', [dmg(4), st('poison', 1, 'tous')], { effects: [dmg(5), st('poison', 2, 'tous')] }),
  n('detritus', 'Détritus', 'poison', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('poison', 2)], { effects: [dmg(8), st('poison', 3)] }),
  n('toxik', 'Toxik', 'poison', 'technique', 'peu-commune', 1, 'ennemi', [st('poison', 6)], { effects: [st('poison', 9)] }),
  n('acidarmure', 'Acidarmure', 'poison', 'technique', 'peu-commune', 1, 'soi', [st('defense', 2, 'soi')], { cost: 0 }, ['epuisee']),
  n('bomb-beurk', 'Bomb-Beurk', 'poison', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(11), st('poison', 3)], { effects: [dmg(14), st('poison', 4)] }),

  // ——— Sol ———
  n('coud-boue', "Coud'Boue", 'sol', 'attaque', 'commune', 1, 'ennemi', [dmg(4), st('confusion', 1)], { effects: [dmg(6), st('confusion', 2)] }),
  n('telluriforce', 'Telluriforce', 'sol', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(15)], { effects: [dmg(20)] }),
  n('abime', 'Abîme', 'sol', 'attaque', 'rare', 3, 'ennemi', [dmg(40)], { cost: 2 }, ['epuisee']),

  // ——— Vol ———
  n('cru-ailes', 'Cru-Ailes', 'vol', 'attaque', 'commune', 1, 'ennemi', [dmg(7)], { effects: [dmg(10)] }),
  n('tornade', 'Tornade', 'vol', 'attaque', 'commune', 1, 'tous', [dmg(4)], { effects: [dmg(6)] }),
  n('lame-d-air', "Lame d'Air", 'vol', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(12), st('peur', 1)], { effects: [dmg(16), st('peur', 1)] }),
  n('atterrissage', 'Atterrissage', 'vol', 'technique', 'peu-commune', 1, 'soi', [{ kind: 'soin', amount: 8 }], { effects: [{ kind: 'soin', amount: 12 }] }, ['epuisee']),
  n('rapace', 'Rapace', 'vol', 'attaque', 'rare', 2, 'ennemi', [dmg(22), { kind: 'perte-pv', amount: 5 }], { effects: [dmg(28), { kind: 'perte-pv', amount: 5 }] }),

  // ——— Insecte ———
  n('vampirisme', 'Vampirisme', 'insecte', 'attaque', 'commune', 1, 'ennemi', [dmg(6, { drain: true })], { effects: [dmg(8, { drain: true })] }),
  n('dard-nuee', 'Dard-Nuée', 'insecte', 'attaque', 'commune', 1, 'ennemi', [dmg(2, { hits: 3, hitsMax: 5 })], { effects: [dmg(3, { hits: 3, hitsMax: 5 })] }),
  n('demi-tour', 'Demi-Tour', 'insecte', 'attaque', 'commune', 1, 'ennemi', [dmg(6), draw(1)], { effects: [dmg(9), draw(1)] }),
  n('plaie-croix', 'Plaie-Croix', 'insecte', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(15)], { effects: [dmg(20)] }),
  n('bourdon', 'Bourdon', 'insecte', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(12), st('peur', 1)], { effects: [dmg(16), st('peur', 1)] }),

  // ——— Roche ———
  n('jet-pierres', 'Jet-Pierres', 'roche', 'attaque', 'commune', 1, 'ennemi', [dmg(8)], { effects: [dmg(11)] }),
  n('pouvoir-antique', 'Pouvoir Antique', 'roche', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(10), st('attaque', 1, 'soi'), st('defense', 1, 'soi')], { effects: [dmg(14), st('attaque', 1, 'soi'), st('defense', 1, 'soi')] }),

  // ——— Spectre ———
  n('lechouille', 'Léchouille', 'spectre', 'attaque', 'commune', 1, 'ennemi', [dmg(5), st('peur', 1)], { effects: [dmg(7), st('peur', 2)] }),
  n('ombre-portee', 'Ombre Portée', 'spectre', 'attaque', 'commune', 0, 'ennemi', [dmg(3), draw(1)], { effects: [dmg(5), draw(1)] }),
  n('onde-folie', 'Onde Folie', 'spectre', 'technique', 'peu-commune', 1, 'ennemi', [st('confusion', 2), st('peur', 1)], { effects: [st('confusion', 3), st('peur', 2)] }),
  n('chatiment', 'Châtiment', 'spectre', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(9, { contreStatut: true })], { effects: [dmg(12, { contreStatut: true })] }),

  // ——— Dragon ———
  n('dracosouffle', 'Dracosouffle', 'dragon', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('paralysie', 1)], { effects: [dmg(8), st('paralysie', 1)] }),
  n('dracogriffe', 'Dracogriffe', 'dragon', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(14)], { effects: [dmg(19)] }),
  n('danse-draco', 'Danse Draco', 'dragon', 'technique', 'rare', 1, 'soi', [st('attaque', 1, 'soi'), { kind: 'pa', amount: 1 }, draw(1)], { cost: 0 }, ['epuisee']),
  n('draco-meteore', 'Draco-Météore', 'dragon', 'attaque', 'rare', 3, 'ennemi', [dmg(34), st('attaque', -2, 'soi')], { effects: [dmg(44), st('attaque', -2, 'soi')] }),

  // ——— Ténèbres ———
  n('coup-bas', 'Coup Bas', 'tenebres', 'attaque', 'commune', 0, 'ennemi', [dmg(5)], { effects: [dmg(7)] }),
  n('sabotage', 'Sabotage', 'tenebres', 'attaque', 'commune', 1, 'ennemi', [{ kind: 'casse-protection' }, dmg(6)], { effects: [{ kind: 'casse-protection' }, dmg(9)] }),
  n('tranche-nuit', 'Tranche-Nuit', 'tenebres', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(13), draw(1)], { effects: [dmg(17), draw(1)] }),

  // ——— Acier ———
  n('aile-d-acier', "Aile d'Acier", 'acier', 'attaque', 'commune', 1, 'ennemi', [dmg(6), st('defense', 1, 'soi')], { effects: [dmg(8), st('defense', 1, 'soi')] }),
  n('tete-de-fer', 'Tête de Fer', 'acier', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(13), st('peur', 1)], { effects: [dmg(17), st('peur', 1)] }),
  n('gyroballe', 'Gyroballe', 'acier', 'attaque', 'peu-commune', 2, 'ennemi', [dmg(10), prot(6)], { effects: [dmg(13), prot(8)] }),

  // ——— Fée ———
  n('vent-feerique', 'Vent Féérique', 'fee', 'attaque', 'commune', 1, 'ennemi', [dmg(6)], { effects: [dmg(9)] }),
  n('voix-enjoleuse', 'Voix Enjôleuse', 'fee', 'attaque', 'commune', 1, 'tous', [dmg(4)], { effects: [dmg(6)] }),
  n('charme', 'Charme', 'fee', 'technique', 'commune', 1, 'ennemi', [st('attaque', -2)], { effects: [st('attaque', -3)] }, ['epuisee']),
  n('eclat-magique', 'Éclat Magique', 'fee', 'attaque', 'peu-commune', 2, 'tous', [dmg(9)], { effects: [dmg(12)] }),
  n('pouvoir-lunaire', 'Pouvoir Lunaire', 'fee', 'attaque', 'rare', 2, 'ennemi', [dmg(18), st('peur', 1)], { effects: [dmg(24), st('peur', 1)] }),
];
