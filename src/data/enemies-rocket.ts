// Repaire Rocket (acte 3, faille de Kanto et Johto) : Pokémon Poison et Ténèbres de la Team Rocket.
// Dominants : Rhinoféros et le Persian du Boss (Jackpot : 3 dégâts par tranche de 10 ₽ que tu as). Gardien : Mewtwo.
import type { EnemyDef } from '../core/model';

export const ROCKET_ENEMIES: EnemyDef[] = [
  {
    id: 'arbok', name: 'Arbok', dex: 24, types: ['poison'], hp: [47, 52],
    moves: [
      { id: 'crochet-venin', name: 'Crochet Venin', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 11, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'ligotage', name: 'Ligotage', weight: 30, intent: 'attaque', pokeType: 'normal', damage: 6, playerStatus: { status: 'ligote', stacks: 1 } },
      { id: 'regard-medusant', name: 'Regard Médusant', weight: 35, intent: 'handicap', playerStatus: { status: 'paralysie', stacks: 2 } },
    ],
  },
  {
    id: 'grotadmorv', name: 'Grotadmorv', dex: 89, types: ['poison'], hp: [52, 57],
    moves: [
      { id: 'detritus', name: 'Détritus', weight: 40, intent: 'attaque', pokeType: 'poison', damage: 13, playerStatus: { status: 'poison', stacks: 2 } },
      { id: 'acidarmure', name: 'Acidarmure', weight: 30, intent: 'defense', block: 16, selfStatus: { status: 'defense', stacks: 1 } },
      { id: 'poing-ombre-gm', name: 'Poing Ombre', weight: 30, intent: 'attaque', pokeType: 'spectre', damage: 12 },
    ],
  },
  {
    id: 'nostenfer', name: 'Nostenfer', dex: 169, types: ['poison', 'vol'], hp: [44, 49],
    moves: [
      { id: 'tranch-air', name: "Tranch'Air", weight: 35, intent: 'attaque', pokeType: 'vol', damage: 5, hits: 3 },
      { id: 'vampirisme', name: 'Vampirisme', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 11, drain: true },
      { id: 'toxik', name: 'Toxik', weight: 30, intent: 'handicap', playerStatus: { status: 'poison', stacks: 5 } },
    ],
  },
  {
    id: 'cornebre', name: 'Cornèbre', dex: 198, types: ['tenebres', 'vol'], hp: [42, 47],
    moves: [
      { id: 'coup-bas', name: 'Coup Bas', weight: 40, intent: 'attaque', pokeType: 'tenebres', damage: 13 },
      { id: 'picpic', name: 'Picpic', weight: 30, intent: 'attaque', pokeType: 'vol', damage: 4, hits: 3 },
      { id: 'regard-noir', name: 'Regard Noir', weight: 30, intent: 'handicap', playerStatus: { status: 'peur', stacks: 2 } },
    ],
  },
  {
    id: 'nidoking', name: 'Nidoking', dex: 34, types: ['poison', 'sol'], hp: [50, 55],
    moves: [
      { id: 'megacorne', name: 'Mégacorne', weight: 35, intent: 'attaque', pokeType: 'insecte', damage: 14 },
      { id: 'telluriforce', name: 'Telluriforce', weight: 35, intent: 'attaque', pokeType: 'sol', damage: 11, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'dard-venin-nk', name: 'Dard-Venin', weight: 30, intent: 'attaque', pokeType: 'poison', damage: 5, hits: 2, playerStatus: { status: 'poison', stacks: 2 } },
    ],
  },
  {
    id: 'nidoqueen', name: 'Nidoqueen', dex: 31, types: ['poison', 'sol'], hp: [54, 58],
    moves: [
      { id: 'plaquage', name: 'Plaquage', weight: 35, intent: 'attaque', pokeType: 'normal', damage: 12, playerStatus: { status: 'paralysie', stacks: 1 } },
      { id: 'bomb-beurk-nq', name: 'Bomb-Beurk', weight: 35, intent: 'attaque', pokeType: 'poison', damage: 10, playerStatus: { status: 'poison', stacks: 3 } },
      { id: 'protection-maternelle', name: 'Abri Royal', weight: 30, intent: 'defense', block: 15, ally: true },
    ],
  },

  // ——— Dominants ———
  {
    id: 'rhinoferos', name: 'Rhinoféros', dex: 112, types: ['sol', 'roche'], hp: [126, 132],
    moves: [
      { id: 'cogne-roc', name: 'Fracass’Roc', weight: 30, intent: 'attaque', pokeType: 'roche', damage: 20 },
      { id: 'seisme', name: 'Séisme', weight: 25, intent: 'attaque', pokeType: 'sol', damage: 15, playerStatus: { status: 'peur', stacks: 1 } },
      { id: 'corne-perce', name: 'Koud’Korne', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 6, hits: 3 },
      { id: 'armure-rhino', name: 'Armure', weight: 20, intent: 'defense', block: 20, selfStatus: { status: 'attaque', stacks: 2 } },
    ],
  },
  {
    id: 'persian-rocket', name: 'Persian (du Boss)', dex: 53, types: ['normal'], hp: [112, 118],
    moves: [
      { id: 'jackpot-persian', name: 'Jackpot', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 0, perMoney: 3, signature: true },
      { id: 'tranche-persian', name: 'Tranche', weight: 25, intent: 'attaque', pokeType: 'normal', damage: 17 },
      { id: 'feinte-persian', name: 'Feinte', weight: 25, intent: 'attaque', pokeType: 'tenebres', damage: 6, hits: 3 },
      { id: 'machination-persian', name: 'Machination', weight: 25, intent: 'boost', selfStatus: { status: 'attaque', stacks: 3 }, block: 12 },
    ],
  },

  // ——— Gardien ———
  {
    id: 'mewtwo', name: 'Mewtwo', dex: 150, types: ['psy'], hp: [208, 208],
    moves: [
      { id: 'psyko', name: 'Psyko', weight: 25, intent: 'attaque', pokeType: 'psy', damage: 14, playerStatus: { status: 'confusion', stacks: 2 } },
      { id: 'aurasphere-mewtwo', name: 'Aurasphère', weight: 20, intent: 'attaque', pokeType: 'combat', damage: 16 },
      { id: 'ball-ombre-mewtwo', name: "Ball'Ombre", weight: 20, intent: 'attaque', pokeType: 'spectre', damage: 7, hits: 2, playerStatus: { status: 'defense', stacks: -1 } },
      { id: 'barriere', name: 'Barrière', weight: 20, intent: 'defense', block: 22, selfStatus: { status: 'defense', stacks: 2 } },
      { id: 'soin-mewtwo', name: 'Soin', weight: 15, intent: 'boost', heal: 20 },
    ],
  },
];
