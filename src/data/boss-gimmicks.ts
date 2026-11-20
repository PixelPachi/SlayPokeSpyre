// Gardiens : un talent propre (gimmick) et une capacité exclusive chacun, ajoutés aux définitions des ennemis.
import type { EnemyDef, EnemyMove } from '../core/model';
import { ENEMY_DEFS } from './enemies';

type Spec = { gimmick: NonNullable<EnemyDef['gimmick']>; moves: EnemyMove[] };

const SPECS: Record<string, Spec> = {
  dardargnan: {
    gimmick: { id: 'venin-tenace', name: 'Venin Tenace', text: 'Tant qu\'il est en vie, ton Poison ne diminue plus.' },
    moves: [{ id: 'assaut-venimeux', name: 'Assaut Venimeux', weight: 30, intent: 'attaque', pokeType: 'poison', damage: 8, signature: true,
      addCards: { id: 'g-dard-venimeux', count: 2, to: 'pioche' } }],
  },
  scarhino: {
    gimmick: { id: 'cuirasse', name: 'Cuirasse', text: 'Le premier coup qu\'il reçoit à chacun de tes tours ne lui inflige que la moitié des dégâts.' },
    moves: [{ id: 'corne-titanesque', name: 'Corne Titanesque', weight: 25, intent: 'attaque', pokeType: 'insecte', damage: 22, pierce: true, signature: true }],
  },
  charmillon: {
    gimmick: { id: 'ailes', name: 'Ailes Envoûtantes', text: 'Si tu joues 4 cartes ou plus dans un tour, tu subis 1 Confusion.' },
    moves: [{ id: 'poudre-ecailles', name: 'Poudre d\'Écailles', weight: 30, intent: 'handicap', pokeType: 'insecte', signature: true,
      addCards: { id: 'g-ecaille-poudreuse', count: 2, to: 'main' }, playerStatus: { status: 'paralysie', stacks: 1 } }],
  },
  apireine: {
    gimmick: { id: 'reine', name: 'Reine de la Ruche', text: 'Tant qu\'une Apitrini la protège, elle subit 50 % de dégâts en moins.' },
    moves: [{ id: 'appel-ouvrieres', name: 'Appel Ouvrières', weight: 35, intent: 'boost', block: 8, signature: true, summon: { id: 'apitrini', max: 2 } }],
  },
  brutapode: {
    gimmick: { id: 'boule-de-neige', name: 'Boule de Neige', text: 'Chaque Roulade Folle frappe plus fort que la précédente (+4 dégâts par coup).' },
    moves: [{ id: 'roulade-folle', name: 'Roulade Folle', weight: 35, intent: 'attaque', pokeType: 'roche', damage: 4, hits: 3, escalate: 4, signature: true }],
  },
  melodelfe: {
    gimmick: { id: 'clair-de-lune', name: 'Clair de Lune', text: 'Au début de chacun de ses tours, elle récupère 6 PV.' },
    moves: [{ id: 'berceuse-lunaire', name: 'Berceuse Lunaire', weight: 30, intent: 'handicap', pokeType: 'fee', heal: 12, signature: true,
      addCards: { id: 'g-reve-lourd', count: 2, to: 'pioche' } }],
  },
  roigada: {
    gimmick: { id: 'regard-royal', name: 'Regard Royal', text: 'Chaque fois que tu joues une Technique, il gagne 3 Protection.' },
    moves: [{ id: 'prescience-royale', name: 'Prescience Royale', weight: 30, intent: 'attaque', pokeType: 'psy', damage: 10, discard: 2, signature: true }],
  },
  camerupt: {
    gimmick: { id: 'sol-brulant', name: 'Sol Brûlant', text: 'À la fin de ton tour, tu subis 1 Brûlure par PA non dépensé.' },
    moves: [{ id: 'rupture-volcanique', name: 'Rupture Volcanique', weight: 30, intent: 'attaque', pokeType: 'feu', damage: 14, signature: true,
      playerStatus: { status: 'brulure', stacks: 3 }, addCards: { id: 'g-cendres', count: 1, to: 'defausse' } }],
  },
  charkos: {
    gimmick: { id: 'mur-roc', name: 'Mur de Roc', text: 'Commence avec 20 Protection, et sa Protection ne disparaît pas d\'un tour à l\'autre.' },
    moves: [{ id: 'forteresse', name: 'Forteresse', weight: 30, intent: 'defense', block: 25, selfStatus: { status: 'defense', stacks: 2 }, signature: true }],
  },
  ohmassacre: {
    gimmick: { id: 'decharge', name: 'Décharge', text: 'À partir de ta 4e carte jouée dans un tour, chaque carte te fait perdre 2 PV.' },
    moves: [{ id: 'machoire-electrique', name: 'Mâchoire Électrique', weight: 30, intent: 'attaque', pokeType: 'electrik', damage: 12, signature: true,
      playerStatus: { status: 'paralysie', stacks: 2 }, addCards: { id: 'g-electrocution', count: 2, to: 'pioche' } }],
  },
  dracolosse: {
    gimmick: { id: 'multiecaille', name: 'Multiécaille', text: 'Tant qu\'il a tous ses PV, il ne subit que la moitié des dégâts.' },
    moves: [{ id: 'plongeon-draconique', name: 'Plongeon Draconique', weight: 25, intent: 'attaque', pokeType: 'dragon', damage: 30, signature: true }],
  },
  tyranocif: {
    gimmick: { id: 'tempete-sable', name: 'Tempête de Sable', text: 'Au début de chacun de tes tours, tu perds 3 PV.' },
    moves: [{ id: 'avalanche-pierres', name: 'Avalanche de Pierres', weight: 30, intent: 'attaque', pokeType: 'roche', damage: 7, hits: 3, signature: true,
      playerStatus: { status: 'peur', stacks: 1 } }],
  },
  rayquaza: {
    gimmick: { id: 'air-lock', name: 'Air Lock', text: 'Tant qu\'il est en vie, tes hausses d\'Attaque et de Défense n\'ont aucun effet.' },
    moves: [{ id: 'draco-meteore-celeste', name: 'Draco-Météore Céleste', weight: 25, intent: 'attaque', pokeType: 'dragon', damage: 34, signature: true,
      selfStatus: { status: 'attaque', stacks: -2 } }],
  },
  heatran: {
    gimmick: { id: 'torche', name: 'Torche', text: 'Les attaques Feu ne lui infligent que la moitié des dégâts, et chacune lui donne +1 Attaque.' },
    moves: [{ id: 'fournaise', name: 'Fournaise', weight: 30, intent: 'attaque', pokeType: 'feu', damage: 16, signature: true,
      addCards: { id: 'g-cendres', count: 2, to: 'pioche' } }],
  },
  zekrom: {
    gimmick: { id: 'teravolt', name: 'Téra-Voltage', text: 'Ses attaques ignorent la moitié de ta Protection.' },
    moves: [{ id: 'foudre-fusion', name: 'Foudre Fusion', weight: 25, intent: 'attaque', pokeType: 'electrik', damage: 26, pierce: true, signature: true }],
  },
  'dialga-primal': {
    gimmick: { id: 'distorsion', name: 'Distorsion du Temps', text: 'Tous les 3 tours, le temps se fige : tu as 1 PA de moins.' },
    moves: [],
  },
};

for (const [id, spec] of Object.entries(SPECS)) {
  const d = ENEMY_DEFS[id];
  if (!d) continue;
  d.gimmick = spec.gimmick;
  for (const m of spec.moves) if (!d.moves.some((x) => x.id === m.id)) d.moves.push(m);
}
// Dialga Primal : Distorsion glisse des Fêlures Temporelles dans ta pioche ; Hurle-Temps devient sa capacité exclusive
const dialga = ENEMY_DEFS['dialga-primal'];
if (dialga) {
  const dist = dialga.moves.find((m) => m.id === 'distorsion');
  if (dist) dist.addCards = { id: 'g-felure-temporelle', count: 2, to: 'pioche' };
  const ht = dialga.moves.find((m) => m.id === 'hurle-temps');
  if (ht) ht.signature = true;
}
