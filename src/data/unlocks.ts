// Déblocage des cartes avec l'EXP gagnée en fin de run (par Pokémon).
import type { CharacterId } from '../core/model';

/** EXP totale nécessaire pour atteindre chaque niveau (index 0 = niveau 1). */
/** EXP totale pour chaque niveau. Une run complète (sommet + Dialga) rapporte environ 900 EXP :
 *  on gagne 1 à 3 niveaux par run, il faut une vingtaine de runs pour atteindre le niveau 10. */
export const LEVEL_EXP = [0, 250, 600, 1050, 1600, 2250, 3000, 3850, 4800, 5850];
export const MAX_LEVEL = LEVEL_EXP.length;

/** Cartes débloquées à chaque niveau. Le niveau 1 = cartes disponibles dès la première run. */
export const UNLOCKS: Partial<Record<CharacterId, Record<number, string[]>>> = {
  riolu: {
    1: ['garde-aura', 'garde-large', 'protection', 'bouclier-royal', 'mach-punch', 'vive-attaque', 'riposte', 'balayette', 'tenacite', 'forte-paume', 'pisto-poing', 'onde-vide',
      'eclate-roc', 'prevention', 'vibrobscur', 'coup-croix', 'gonflette', 'vitesse-extreme'],
    2: ['griffe-acier', 'riolu-morsure', 'grincement', 'coup-main', 'casse-brique', 'balayage', 'contre', 'close-combat', 'plenitude'],
    3: ['tomberoche', 'pietisol', 'meteores', 'facade', 'affilage', 'poing-boost', 'vampi-poing', 'lire-esprit'],
    4: ['grimace', 'poing-eclair', 'poing-glace', 'represailles', 'rengorgement', 'charge-os', 'hate', 'machination'],
    5: ['vibraqua', 'aeropique', 'griffe-ombre', 'force', 'mur-de-fer', 'clonage', 'machouille', 'hurlement'],
    6: ['direct-toxik', 'poing-meteore', 'draco-choc', 'projection', 'pied-bruleur', 'vibra-soin', 'strido-son', 'megapoing'],
    7: ['queue-de-fer', 'plaquage', 'belier', 'seisme', 'lame-de-roc', 'photocopie', 'danse-lames'],
    8: ['eboulement', 'psyko', 'ball-ombre', 'luminocanon', 'metronome', 'ultimawashi', 'psykoudboul'],
    9: ['pied-voltige', 'tout-ou-rien', 'exploforce', 'mitra-poing'],
    10: ['metalaser', 'ultralaser'],
  },
  vipelierre: {
    1: ['vip-garde-florale', 'vip-cotogarde', 'vip-pico-defense', 'vip-peau-dure', 'vip-vege-attaque', 'vip-lame-feuille', 'vip-enroulement', 'vip-giga-sangsue', 'vip-suc-digestif', 'vip-fouet-lianes', 'vip-ligotage', 'vip-groz-yeux', 'vip-croissance', 'vip-feuille-magik', 'vip-mega-sangsue', 'vip-souplesse', 'vip-balle-graine', 'vip-aeropique'],
    2: ['vip-danse-lames', 'vip-belier', 'vip-damocles', 'vip-mur-lumiere', 'vip-plaquage', 'vip-meteores', 'vip-grimace', 'vip-facade', 'vip-coup-main'],
    3: ['vip-lance-soleil', 'vip-protection', 'vip-repos', 'vip-clonage', 'vip-colere', 'vip-gliss-herbe', 'vip-abattage', 'vip-doux-parfum'],
    4: ['vip-giga-impact', 'vip-tenacite', 'vip-provoc', 'vip-canon-graine', 'vip-draco-choc', 'vip-siffl-herbe', 'vip-poursuite', 'vip-ouragan'],
    5: ['vip-ultralaser', 'vip-eco-sphere', 'vip-noeud-herbe', 'vip-aire-d-herbe', 'vip-draco-queue', 'vip-coupe', 'vip-retour', 'vip-frustration'],
    6: ['vip-champ-herbu', 'vip-rafale-ecailles', 'vip-desherbaffe', 'vip-phytomixeur', 'vip-regard-medusant', 'vip-vengeance', 'vip-chant-canon', 'vip-ronflement'],
    7: ['vip-zenith', 'vip-tempete-florale', 'vip-regard-noir', 'vip-voile-miroir', 'vip-aromatherapie', 'vip-rune-protect', 'vip-reflet'],
    8: ['vip-synthese', 'vip-essorage', 'vip-attraction', 'vip-seduction', 'vip-vantardise', 'vip-don-naturel', 'vip-hydroqueue'],
    9: ['vip-plenitude', 'vip-puissance-cachee', 'vip-queue-de-fer', 'vip-soucigraine'],
    10: ['vip-blabla-dodo', 'vip-force'],
  },
  kangourex: {
    1: ['kan-garde-large', 'kan-boul-armure', 'kan-protection', 'kan-mur-de-fer', 'kan-mega-evolution', 'kan-puissance', 'kan-machouille', 'kan-tenacite', 'kan-contre', 'kan-mimi-queue', 'kan-rugissement', 'kan-bluff', 'kan-morsure', 'kan-ecrasement', 'kan-coup-d-boule', 'kan-tomberoche', 'kan-aeropique', 'kan-facade'],
    2: ['kan-colere', 'kan-hurlement', 'kan-queue-de-fer', 'kan-tunnel', 'kan-coupe', 'kan-eclate-roc', 'kan-pietisol', 'kan-calinerie', 'kan-vibraqua'],
    3: ['kan-dynamo-poing', 'kan-ball-ombre', 'kan-casse-brique', 'kan-lance-flammes', 'kan-repos', 'kan-griffe-ombre', 'kan-poing-comete', 'kan-uppercut'],
    4: ['kan-dernier-recours', 'kan-larcin', 'kan-degommage', 'kan-vampi-poing', 'kan-avalanche', 'kan-frenesie', 'kan-plaquage', 'kan-balayage'],
    5: ['kan-giga-impact', 'kan-eboulement', 'kan-clonage', 'kan-souvenir', 'kan-escalade', 'kan-poing-eclair', 'kan-furie', 'kan-vengeance'],
    6: ['kan-second-souffle', 'kan-projection', 'kan-riposte', 'kan-entrave', 'kan-marto-poing', 'kan-groz-yeux', 'kan-clairvoyance', 'kan-chant-canon'],
    7: ['kan-exploforce', 'kan-mitra-poing', 'kan-eclate-griffe', 'kan-brouhaha', 'kan-poing-de-feu', 'kan-retour', 'kan-rune-protect'],
    8: ['kan-croissance', 'kan-seisme', 'kan-poing-boost', 'kan-ultimapoing', 'kan-frappe-atlas', 'kan-sacrifice', 'kan-double-baffe'],
    9: ['kan-effort', 'kan-rengorgement', 'kan-trepignement', 'kan-lance-soleil'],
    10: ['kan-ultimawashi', 'kan-damocles'],
  },
  caninos: {
    1: ['can-garde-large', 'can-detection', 'can-rempart-brulant', 'can-vitesse-extreme', 'can-grondement', 'can-machouille', 'can-contre', 'can-hate', 'can-rugissement', 'can-groz-yeux', 'can-flair', 'can-coup-main', 'can-roue-de-feu', 'can-crocs-feu', 'can-crocs-eclair', 'can-plaquage', 'can-meteores'],
    2: ['can-hurlement', 'can-belier', 'can-lance-flammes', 'can-damocles', 'can-grimace', 'can-facade', 'can-aeropique', 'can-pietisol', 'can-nitrocharge'],
    3: ['can-boutefeu', 'can-tunnel', 'can-repos', 'can-clonage', 'can-larcin', 'can-double-pied', 'can-vengeance', 'can-retour'],
    4: ['can-surchauffe', 'can-colere', 'can-tenacite', 'can-canicule', 'can-feu-follet', 'can-frustration', 'can-reflet', 'can-ronflement'],
    5: ['can-deflagration', 'can-megaphone', 'can-draco-choc', 'can-eclair-fou', 'can-tacle-feu', 'can-force-cachee', 'can-chant-canon', 'can-echo'],
    6: ['can-zenith', 'can-psycho-croc', 'can-sable-ardent', 'can-tera-explosion', 'can-indignition', 'can-eclate-roc', 'can-rune-protect', 'can-aboiement'],
    7: ['can-danse-flammes', 'can-giga-impact', 'can-mania', 'can-aurore', 'can-implore', 'can-calinerie', 'can-attraction'],
    8: ['can-ultralaser', 'can-close-combat', 'can-queue-de-fer', 'can-puissance-cachee', 'can-vantardise', 'can-force', 'can-eboulement'],
    9: ['can-fracass-tete', 'can-grand-courroux', 'can-lame-de-roc', 'can-blabla-dodo'],
    10: ['can-lance-soleil', 'can-malediction'],
  },
  quelorior: { 1: ['quel-atout'] },
  mew: {
    1: ['mew-metronome', 'mew-psyko', 'mew-ultimapoing', 'mew-moi-d-abord', 'mew-mur-lumiere', 'mew-copietype', 'mew-relais', 'mew-bouclier', 'mew-amnesie', 'mew-protection', 'mew-meteores', 'mew-choc-psy', 'mew-vibraqua', 'mew-rayon-charge'],
    2: ['mew-hate', 'mew-repos', 'mew-clonage', 'mew-ball-ombre', 'mew-boule-elek', 'mew-feu-ensorcele', 'mew-poing-de-feu', 'mew-poing-eclair', 'mew-poing-glace'],
    3: ['mew-tour-de-magie', 'mew-eco-sphere', 'mew-lance-flammes', 'mew-vibrobscur', 'mew-draco-choc', 'mew-plaquage', 'mew-facade', 'mew-coup-main'],
    4: ['mew-telekinesie', 'mew-luminocanon', 'mew-feu-follet', 'mew-danse-lames', 'mew-gonflette', 'mew-provoc', 'mew-encore', 'mew-interversion'],
    5: ['mew-aurasphere', 'mew-mur-de-fer', 'mew-change-eclair', 'mew-ebullition', 'mew-canicule', 'mew-possessif', 'mew-tenacite', 'mew-vol'],
    6: ['mew-prescience', 'mew-vampi-poing', 'mew-direct-toxik', 'mew-eboulement', 'mew-lame-de-roc', 'mew-psykoudboul', 'mew-casse-brique', 'mew-pietisol'],
    7: ['mew-machination', 'mew-champ-psychique', 'mew-tunnel', 'mew-aboiement', 'mew-echange', 'mew-mimique', 'mew-degommage'],
    8: ['mew-distorsion', 'mew-ultralaser', 'mew-ultimawashi', 'mew-damocles', 'mew-tera-explosion', 'mew-force-ajoutee', 'mew-vaste-pouvoir'],
    9: ['mew-giga-impact', 'mew-exploforce', 'mew-plenitude', 'mew-deflagration'],
    10: ['mew-lance-soleil', 'mew-seisme'],
  },
};

/** Objets tenus débloqués à chaque niveau (les objets communs sont toujours disponibles). */
export const RELIC_UNLOCKS: Partial<Record<CharacterId, Record<number, string[]>>> = {
  riolu: { 2: ['plaque-poing'], 3: ['griffe-rasoir'], 4: ['gant-punch'], 6: ['bandeau'], 7: ['plaque-fer'], 9: ['lucarite'] },
  kangourex: { 6: ['kangourexite'] },
};

export function unlockedRelics(character: CharacterId, level: number): string[] {
  const table = RELIC_UNLOCKS[character] ?? {};
  return Object.entries(table).filter(([l]) => Number(l) <= level).flatMap(([, ids]) => ids);
}

export function levelFor(exp: number): number {
  let lvl = 1;
  for (let i = 0; i < LEVEL_EXP.length; i++) if (exp >= LEVEL_EXP[i]) lvl = i + 1;
  return lvl;
}

export function unlockedCards(character: CharacterId, level: number): string[] {
  const table = UNLOCKS[character] ?? {};
  return Object.entries(table).filter(([l]) => Number(l) <= level).flatMap(([, ids]) => ids);
}

/** Barème de l'EXP gagnée pendant une run. */
export const EXP_TABLE = { etage: 10, combat: 5, dominant: 25, duel: 25, gardien: 60, dialga: 150, evenement: 5, shiny: 20, victoire: 200 };

export interface ExpLine { label: string; count?: number; each?: number; amount: number }

/** Détail ligne par ligne de l'EXP d'une run (affiché à l'écran de fin). */
export function expBreakdown(r: {
  floor: number; combatsWon: number; elitesDefeated: number; duelsWon: number; bossNames: string[];
  eventsSeen: number; shiniesMet: number; relics: string[];
}, victory: boolean): { lines: ExpLine[]; total: number } {
  const T = EXP_TABLE;
  const lines: ExpLine[] = [];
  const add = (label: string, count: number, each: number) => { if (count > 0) lines.push({ label, count, each, amount: count * each }); };
  add('Étages montés', r.floor, T.etage);
  add('Combats gagnés', r.combatsWon, T.combat);
  add('Pokémon dominants vaincus', r.elitesDefeated, T.dominant);
  add('Duels gagnés', r.duelsWon, T.duel);
  for (const n of r.bossNames) lines.push({ label: `Gardien vaincu : ${n}`, amount: /dialga/i.test(n) ? T.dialga : T.gardien });
  add('Événements explorés', r.eventsSeen, T.evenement);
  add('Pokémon chromatiques croisés', r.shiniesMet, T.shiny);
  if (victory) lines.push({ label: 'Tour du Temps conquise !', amount: T.victoire });
  let total = lines.reduce((s, l) => s + l.amount, 0);
  if (r.relics.includes('oeuf-chance') && total > 0) {
    const bonus = Math.floor(total * 0.5);
    lines.push({ label: 'Œuf Chance (+50 %)', amount: bonus });
    total += bonus;
  }
  return { lines, total };
}
