// Moteur de combat (section 4 du GDD). Aucune dépendance à l'affichage : l'interface lit l'état
// et les événements produits, et appelle les actions (jouer une carte, finir le tour…).
import type { Card, CardDef, CharacterId, EnemyMove, Effect, PowerId, StatusId, Statuses, Form } from './model';
import { copyId, isCopy } from '../data/copies';
import { Rng } from './rng';
import {
  type Effectiveness, type PokeType, SAME_TYPE_BONUS, effectivenessOf, hasImmunity, typeMultiplier,
} from './types';
import { CARD_DEFS, cardDef, ENCHANTS, enchantId, rollEnchant } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { primordialTypes, skinDef } from '../data/skins';
import { ENEMY_DEFS } from '../data/enemies';
import '../data/boss-gimmicks';
import '../data/enemy-fixes';
import '../data/balance';
import '../data/weather-moves';
import { FIELD_TURNS, TERRAINS, WEATHER, isWeather, type TerrainId, type WeatherId } from './weather';
import { BAD_STATUSES, type BerryFx } from '../data/berries';

export const HAND_SIZE = 5;
export const MAX_HAND = 10;
export const BASE_ENERGY = 3;
export const SHINY_CHANCE = 1 / 50;

export interface Fighter {
  name: string;
  dex: number;
  types: PokeType[];
  hp: number;
  maxHp: number;
  block: number;
  statuses: Statuses;
  /** Ligoté : tours restants de chaque cumul. */
  binds?: number[];
}

export interface PlayerState extends Fighter {
  character: CharacterId;
  energy: number;
  maxEnergy: number;
  aura: number;
  powers: Partial<Record<PowerId, number>>;
  /** Lire-Esprit : les cartes coûtent 0 PA ce tour. */
  freeTurn: boolean;
  /** PV perdus pendant le dernier tour ennemi (pour Représailles). */
  hpLostEnemyTurn: number;
  /** Bébé Kangourex (familier), seulement pour Kangourex. */
  familiar?: Familiar;
  /** Méga-évolué pour ce combat. */
  isMega?: boolean;
}

export interface Familiar {
  hp: number;
  maxHp: number;
  power: number;
  block: number;
  /** Méga-Kangourex : le Bébé attaque 2 fois. */
  mega: boolean;
}

export interface EnemyState extends Fighter {
  uid: number;
  defId: string;
  intent: EnemyMove;
  history: string[];
  shiny: boolean;
  /** Phase du combat (gardiens à deux phases) et position dans leur ordre d'actions. */
  phase: 1 | 2;
  step: number;
  /** Compteurs propres (talents de gardien). */
  flags: Record<string, number>;
  /** Forme affichée (Arceus : la plaque du type de sa dernière carte copiée). */
  form?: string;
}

/** Cible d'un événement : le joueur, ou l'uid d'un ennemi. */
export type Who = 'player' | 'bebe' | number;

export type CombatEvent =
  | { type: 'damage'; target: Who; amount: number; blocked: number; effectiveness: Effectiveness }
  | { type: 'hp-loss'; target: Who; amount: number; source: StatusId | 'carte' }
  | { type: 'block'; target: Who; amount: number }
  | { type: 'heal'; target: Who; amount: number }
  | { type: 'status'; target: Who; status: StatusId; stacks: number }
  | { type: 'aura'; amount: number }
  | { type: 'enemy-move'; uid: number; name: string; move?: EnemyMove; damage?: number }
  | { type: 'player-move'; name: string }
  | { type: 'meteo'; id: string; name: string; ended?: boolean }
  | { type: 'energy'; delta: number; reason: string }
  | { type: 'break'; target: Who }
  | { type: 'relic'; id: string }
  | { type: 'power'; power: PowerId; amount: number }
  | { type: 'ko'; target: Who };

export type Phase = 'joueur' | 'ennemi' | 'victoire' | 'defaite';

export interface CombatOptions {
  character: CharacterId;
  deck: Card[];
  enemies: string[];
  seed: string;
  hp?: number;
  maxHp?: number;
  /** Objets tenus (ids de data/relics.ts). */
  relics?: string[];
  /** PV max en plus pour le Bébé Kangourex (il grandit à chaque acte). */
  familiarBonus?: number;
  mega?: boolean;
  /** Multiplie les PV des ennemis et leur donne de l'Attaque (duels des arcanes selon l'acte). */
  enemyPower?: number;
  /** Stade d'évolution du Pokémon joué (sinon sa forme de base). */
  form?: Form;
  /** Acte en cours (la Méga-Évolution de Lucario demande l'acte 2). */
  act?: number;
  /** Combat contre un gardien (Hurlement ne fait pas fuir, le Gel ne fait pas passer le tour). */
  boss?: boolean;
  /** Pokédollars au début du combat (Roulette du Flambeur). */
  money?: number;
  /** Skin équipé (le skin primordial ajoute le type Dragon). */
  skin?: string;
  /** Encens Zen : les ennemis commencent à 1 PV. */
  oneHp?: boolean;
}

const TYPE_NAMES: Record<string, string> = { normal: 'Normal', feu: 'Feu', eau: 'Eau', plante: 'Plante', electrik: 'Électrik', glace: 'Glace', combat: 'Combat', poison: 'Poison', sol: 'Sol', vol: 'Vol', psy: 'Psy', insecte: 'Insecte', roche: 'Roche', spectre: 'Spectre', dragon: 'Dragon', tenebres: 'Ténèbres', acier: 'Acier', fee: 'Fée' };

/** Gemmes : la première attaque de ce type à chaque tour inflige 5 dégâts de plus. */
const GEMS: Partial<Record<PokeType, string>> = { combat: 'gemme-combat', plante: 'gemme-plante', normal: 'gemme-normal', feu: 'gemme-feu', psy: 'gemme-psy' };

const DOTS: StatusId[] = ['poison', 'brulure', 'vampigraine'];
const DURATIONS: StatusId[] = ['paralysie', 'peur', 'confusion'];

/** Dégâts d'un coup : base + Attaque → bonus de type → table des types → Paralysie/Brûlure/Peur → arrondi. */
export function computeDamage(base: number, attacker: Fighter, defender: Fighter, type: PokeType) {
  let dmg = Math.max(0, base + (attacker.statuses.attaque ?? 0));
  if (attacker.types.includes(type)) dmg *= SAME_TYPE_BONUS;
  const mult = typeMultiplier(type, defender.types);
  dmg *= mult;
  if ((attacker.statuses.paralysie ?? 0) > 0) dmg *= 0.75;
  if ((attacker.statuses.brulure ?? 0) > 0) dmg *= 0.75;
  if ((defender.statuses.peur ?? 0) > 0) dmg *= 1.5;
  return {
    amount: base > 0 ? Math.max(1, Math.floor(dmg + 1e-9)) : Math.floor(dmg + 1e-9), // au moins 1 dégât
    effectiveness: effectivenessOf(mult, hasImmunity(type, defender.types)),
  };
}

/** Plaques d'Arceus ajoutées comme objets communs : +3 dégâts à leur type. */
const PLATES: [string, PokeType][] = [['plaque-hydro', 'eau'], ['plaque-volt', 'electrik'], ['plaque-glace', 'glace'], ['plaque-terre', 'sol'], ['plaque-ciel', 'vol'], ['plaque-insecte', 'insecte'], ['plaque-roc', 'roche'], ['plaque-fantome', 'spectre'], ['plaque-draco', 'dragon'], ['plaque-ombre', 'tenebres'], ['plaque-pixie', 'fee']];

export class Combat {
  readonly rng: Rng;
  player: PlayerState;
  enemies: EnemyState[];
  drawPile: Card[];
  hand: Card[] = [];
  discardPile: Card[] = [];
  exhaustPile: Card[] = [];
  turn = 0;
  phase: Phase = 'joueur';
  private events: CombatEvent[] = [];
  private nextEnemyUid = 1;
  private cardAuraUsed = false;
  private nextTempUid = 100000;
  /** Objets tenus consommés pendant ce combat (à retirer de la run). */
  consumedRelics: string[] = [];
  /** Cartes copiées par Gribouille : elles rejoignent le deck de la run. */
  copiedCards: string[] = [];
  private enemyPower?: number;
  private lastPlayed: CardDef | null = null;
  readonly relics: Set<string>;
  private used = new Set<string>(); // objets « une fois par combat » déjà déclenchés
  private attacksThisTurn = 0;
  /** Ennemi qui a posé la Vampigraine sur le joueur (c'est lui qui en profite). */
  private seedSource: number | null = null;
  /** Objets « une fois par tour » : gemmes déjà utilisées, techniques jouées, Spray Gorge, Encens Bizarre. */
  private gemsUsed = new Set<string>();
  private techsThisTurn = 0;
  private sprayUsed = false;
  private oddUsed = false;
  private cardsThisTurn = 0;
  private firstAttackDone = false;
  private boss = false;
  /** Photocopie : nombre de prochaines cartes jouées deux fois. */
  doubleNext = 0;
  /** Close Combat : le tour du joueur doit se terminer (l'interface enchaîne). */
  endTurnRequested = false;
  /** Étourdi : ce tour est perdu (l'interface le passe). */
  skipTurn = false;
  /** Hurlement : les ennemis ont fui (victoire sans récompense). */
  fled = false;
  /** Ball'Ombre : dégâts gagnés par nom de carte pour ce combat. */
  private cumul: Record<string, number> = {};
  /** Mitra-Poing : carte et cible de la frappe concentrée. */
  private focus: { d: CardDef; uid: number } | null = null;

  constructor(opts: CombatOptions) {
    this.rng = new Rng(opts.seed);
    const ch = CHARACTERS[opts.character];
    const form = opts.form ?? { dex: ch.dex[0], name: ch.name, types: ch.types };
    this.player = {
      character: ch.id, name: form.name, dex: form.dex, types: [...form.types],
      hp: opts.hp ?? ch.maxHp, maxHp: opts.maxHp ?? ch.maxHp, block: 0, statuses: {},
      energy: BASE_ENERGY, maxEnergy: BASE_ENERGY, aura: 0,
      powers: {}, freeTurn: false, hpLostEnemyTurn: 0,
    };
    this.relics = new Set(opts.relics ?? []);
    this.boss = !!opts.boss;
    // Méga-Évolution : la Méga-Gemme tenue (et le bon stade) transforme le Pokémon pour tout le combat
    // Kangourex ne méga-évolue pas avec un skin (sauf chromatique)
    const megaLocked = ch.id === 'kangourex' && !!opts.skin && opts.skin !== 'shiny';
    const mega = !megaLocked && ch.mega && this.relics.has(ch.mega.stone) && (opts.act ?? 1) >= ch.mega.fromAct ? ch.mega : null;
    if (ch.id === 'kangourex') {
      const hp = 8 + (this.relics.has('lait-meumeu') ? 4 : 0) + (opts.familiarBonus ?? 0);
      this.player.familiar = { hp, maxHp: hp, power: 3 + (this.relics.has('grelot-zen') ? 2 : 0), block: 0, mega: (!!opts.mega && !megaLocked) || !!mega };
    }
    if (mega) {
      this.player.name = mega.name;
      this.player.dex = mega.dex;
      this.player.types = [...mega.types];
      this.player.isMega = true;
    }
    // Skin primordial : gagne le type Dragon (remplace Acier)
    if (skinDef(ch.id, opts.skin)?.addDragon) this.player.types = primordialTypes(this.player.types);
    // Skins qui changent le type (Tisserand, Gardien Océanique) : y compris en Méga-Évolution
    const skinTypes = skinDef(ch.id, opts.skin)?.types;
    if (skinTypes) this.player.types = [...skinTypes];
    this.crimson = ch.id === 'riolu' && opts.skin === 'magma';
    this.alchemist = ch.id === 'vipelierre' && opts.skin === 'alchimiste';
    this.enemyPower = opts.enemyPower;
    this.enemies = opts.enemies.map((id) => this.spawnEnemy(id));
    // Encens Zen (offert par Grodoudou) : les ennemis n'ont qu'1 PV
    if (opts.oneHp) for (const e of this.enemies) e.hp = 1;
    if (opts.enemyPower && opts.enemyPower > 1) {
      for (const e of this.enemies) e.statuses.attaque = Math.round((opts.enemyPower - 1) * 4);
    }
    // Ballon : résistance aux attaques Sol
    if (this.relics.has('ballon')) this.resists.add('sol');
    // Lanterne Bleue (Caninos des âmes) : 3 Âmes rejoignent la pioche à chaque combat
    const souls = this.relics.has('lanterne-bleue') ? [0, 1, 2].map(() => ({ uid: this.nextTempUid++, defId: 'can-ame', upgraded: false })) : [];
    this.drawPile = this.rng.shuffle([...opts.deck, ...souls]);
    // Cartes Innées en haut de la pioche
    this.drawPile.sort((a, b) => Number(this.hasKw(a, 'innee')) - Number(this.hasKw(b, 'innee')));

    // Talents de départ
    if (ch.id === 'riolu') this.gainAura(3);
    this.soulDog = ch.id === 'caninos' && opts.skin === 'lanterne';
    this.weaver = ch.id === 'vipelierre' && opts.skin === 'tisserand';
    this.moneyStart = opts.money ?? 0;
    // Intimidation (Caninos) ; le Chien de la Lanterne a Feu des Âmes à la place
    if (ch.id === 'caninos' && !this.soulDog) for (const e of this.enemies) this.addStatus(e, e.uid, 'attaque', -1);

    // Reliques de gardien : +1 PA par tour chacune, avec leur contrepartie
    const bossRelics = ['orbe-adamant', 'orbe-platine', 'orbe-perle', 'orbe-toxique', 'orbe-flamme', 'cendre-sacree'].filter((id) => this.has(id));
    this.player.maxEnergy = Math.min(5, this.player.maxEnergy + bossRelics.length); // 5 PA au maximum
    this.player.energy = this.player.maxEnergy;
    if (this.has('orbe-adamant')) for (const e of this.enemies) this.addStatus(e, e.uid, 'attaque', 1);
    if (this.has('orbe-toxique')) this.addStatus(this.player, 'player', 'poison', 4);
    if (this.has('orbe-flamme')) this.addStatus(this.player, 'player', 'brulure', 2);
    if (this.has('lunettes-sages')) this.relicFired('lunettes-sages', () => this.gainAura(5, true));
    if (this.has('herbe-blanche')) this.relicFired('herbe-blanche', () => {
      this.addStatus(this.player, 'player', 'attaque', -1);
      this.addStatus(this.player, 'player', 'defense', -1);
    });
    if (this.has('pierre-plante')) this.relicFired('pierre-plante', () => { for (const e of this.enemies) this.addStatus(e, e.uid, 'vampigraine', 2); });
    if (this.has('pierre-feu')) this.relicFired('pierre-feu', () => { for (const e of this.enemies) this.addStatus(e, e.uid, 'brulure', 2); });
    if (this.has('bandeau-muscle')) this.relicFired('bandeau-muscle', () => this.addStatus(this.player, 'player', 'attaque', 1));
    if (mega) this.relicFired(mega.stone, () => {
      this.events.push({ type: 'player-move', name: `${ch.name} méga-évolue !` });
      if (ch.id === 'riolu') { this.addStatus(this.player, 'player', 'attaque', 2); this.gainAura(10); }
    });

    for (const e of this.enemies) if (this.gimmickOf(e) === 'mur-roc') this.gainBlock(e, e.uid, 12);
    if (this.enemies.some((e) => this.gimmickOf(e) === 'tempete-sable')) this.setField('tempete-sable');
    for (const e of this.enemies) this.rollIntent(e);
    this.startPlayerTurn();
    if (this.has('veste-combat')) this.relicFired('veste-combat', () => this.gainBlock(this.player, 'player', 10));
    if (this.has('vive-griffe')) { this.handDraw = true; this.relicFired('vive-griffe', () => this.draw(2)); this.handDraw = false; }
    if (this.has('cuillere-tordue')) this.relicFired('cuillere-tordue', () => this.changeEnergy(1, 'Cuillère Tordue'));
  }

  // ——— Objets tenus ———

  has(relic: string): boolean {
    return this.relics.has(relic);
  }

  private relicFired(id: string, effect?: () => void): void {
    this.events.push({ type: 'relic', id });
    effect?.();
  }

  /** Bonus fixes des objets sur une attaque. */
  private relicFlat(d: CardDef): number {
    let b = 0;
    if (this.player.powers.zenith && d.pokeType === 'feu') b += this.player.powers.zenith;
    if (this.player.powers['zenith-plante'] && d.pokeType === 'plante') b += this.player.powers['zenith-plante'];
    if (this.has('plaque-poing') && d.pokeType === 'combat') b += 2;
    if (this.has('plaque-fer') && d.pokeType === 'acier') b += 3;
    if (this.has('plaque-herbe') && d.pokeType === 'plante') b += 2;
    if (this.has('mouchoir-soie') && d.pokeType === 'normal') b += 2;
    if (this.has('plaque-flamme') && d.pokeType === 'feu') b += 2;
    if (this.has('plaque-esprit') && d.pokeType === 'psy') b += 2;
    // Plaques d'Arceus (objets communs) : +3 au type de la plaque
    for (const [id, t] of PLATES) if (t === d.pokeType && this.has(id)) b += 3;
    if (this.has('gant-punch') && /poing|punch/i.test(d.name)) b += 3;
    if (this.has('griffe-rasoir') && d.cost === 0) b += 3;
    if (this.has('metronome')) b += this.attacksThisTurn;
    // Roulette : +2 dégâts par tranche de 100 Pokédollars
    if (this.has('roulette')) b += 2 * Math.floor((this.moneyStart + this.moneyGained) / 100);
    b += this.player.statuses.elan ?? 0; // Élan (Caninos)
    if (this.has('loupe') && d.target === 'tous') b += 2;
    const gem = GEMS[d.pokeType];
    if (gem && this.has(gem) && !this.gemsUsed.has(d.pokeType)) b += 5;
    return b;
  }

  /** Multiplicateurs des objets sur une attaque. */
  private relicMult(super_: boolean): number {
    let m = 1;
    if (this.has('orbe-vie')) m *= 1.3;
    if (this.has('bandeau-choix')) m *= 1.5;
    if (this.has('lentilscope') && !this.firstAttackDone) m *= 2;
    if (this.has('ceinture-pro') && super_) m *= 1.25;
    return m;
  }

  /** Dégâts d'une attaque du joueur, objets compris. */
  private playerDamage(base: number, d: CardDef, t: Fighter) {
    const r = computeDamage(base + this.relicFlat(d), this.player, t, d.pokeType);
    // Technicien (Quelorior) : les attaques copiées frappent 25 % plus fort
    const tech = this.player.character === 'quelorior' && isCopy(d.id) ? 1.25 : 1;
    return { amount: Math.floor(r.amount * tech * this.relicMult(r.effectiveness === 'super') * this.fieldMult(d.pokeType, this.has('lunettes-filtre')) + 1e-9), effectiveness: r.effectiveness };
  }

  // ——— Lecture ———

  def(card: Card): CardDef {
    return cardDef(card.defId, card.upgraded);
  }

  aliveEnemies(): EnemyState[] {
    return this.enemies.filter((e) => e.hp > 0);
  }

  enemy(uid: number): EnemyState | undefined {
    return this.enemies.find((e) => e.uid === uid);
  }

  /** Vide et renvoie les événements produits depuis le dernier appel (pour les animations). */
  drainEvents(): CombatEvent[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  needsTarget(card: Card): boolean {
    return this.def(card).target === 'ennemi' && this.aliveEnemies().length > 1;
  }

  /** Coût réel d'une carte (0 pendant un tour de Lire-Esprit). */
  costOf(card: Card): number {
    if (this.player.freeTurn) return 0;
    const d = this.def(card);
    let cost = d.cost;
    // Herbe Pouvoir : une fois par combat, la première carte à 2 PA ou plus est gratuite
    if (cost >= 2 && this.has('herbe-pouvoir') && !this.used.has('herbe-pouvoir')) return 0;
    // Encens Bizarre (Mew) : la première capacité d'un autre Pokémon de chaque tour coûte 1 PA de moins
    if (cost > 0 && this.has('encens-bizarre') && !this.oddUsed && d.character !== 'mew' && d.character !== 'normal') cost -= 1;
    return Math.max(0, cost);
  }

  canPlay(card: Card): boolean {
    if (this.phase !== 'joueur') return false;
    const d = this.def(card);
    if (d.keywords?.includes('injouable') || this.skipTurn || this.pendingChoice) return false;
    if (d.requires?.block && this.player.block < d.requires.block) return false;
    if (d.requires?.aura && this.player.aura < d.requires.aura) return false;
    if (d.requires?.notBoss && this.boss) return false;
    // Endormi : seules les cartes qui le permettent (Ronflement, Blabla Dodo) sont jouables
    const asleep = (this.player.statuses.sommeil ?? 0) > 0;
    if (d.requires?.asleep && !asleep) return false;
    if (asleep && !d.requires?.asleep && !this.sleepBypass) return false;
    if (this.has('bandeau-choix') && d.category === 'attaque' && this.attacksThisTurn >= 1) return false;
    return this.costOf(card) <= this.player.energy;
  }

  /** Dégâts de base d'une carte avant types et statuts (Aura comprise), ou null si elle n'attaque pas. */
  private baseDamage(d: CardDef): number | null {
    const p = this.player;
    for (const e of d.effects) {
      switch (e.kind) {
        case 'degats': {
          const mult = d.effects.find((x): x is Extract<Effect, { kind: 'aura-mult' }> => x.kind === 'aura-mult');
          let base = e.amount + (e.parProtection ? p.block : 0) + (e.cumul ? this.cumul[baseName(d.name)] ?? 0 : 0);
          if (e.facade && this.hasBadStatus()) base *= 2;
          if (e.revanche && p.hpLostEnemyTurn > 0) base *= 2;
          if (e.parSoi) base += (p.statuses[e.parSoi] ?? 0) * (e.parSoiX ?? 1);
          return base + (e.noAura || (this.crimson && !mult) ? 0 : p.aura * (mult ? mult.amount : 1));
        }
        case 'degats-aura':
          return p.aura * e.mult;
        case 'degats-pv-perdus':
          return e.amount + Math.floor((p.maxHp - p.hp) / e.per) + (this.crimson ? 0 : p.aura);
        case 'tout-ou-rien':
          return p.hp - 1;
        case 'concentration':
          return e.amount + (this.crimson ? 0 : p.aura);
      }
    }
    return null;
  }

  /** Dégâts affichés sur une carte (contre la cible si elle est donnée). */
  previewCardDamage(card: Card, targetUid?: number): number | null {
    const d = this.def(card);
    let base = this.baseDamage(d);
    if (base === null) return null;
    const target = targetUid !== undefined ? this.enemy(targetUid) : undefined;
    const hit = d.effects.find((e): e is Extract<Effect, { kind: 'degats' }> => e.kind === 'degats');
    if (hit?.contreStatut && target && hasAnyStatus(target)) base += hit.amount;
    if (hit?.parStatut && target) base += (target.statuses[hit.parStatut] ?? 0) * (hit.parStatutX ?? 1);
    if (hit) base += this.babyBonus(hit);
    if (!target) {
      // Sans cible : bonus de type et statuts du joueur seulement
      let dmg = Math.max(0, base + this.relicFlat(d) + (this.player.statuses.attaque ?? 0));
      if (this.player.types.includes(d.pokeType)) dmg *= SAME_TYPE_BONUS;
      if ((this.player.statuses.paralysie ?? 0) > 0) dmg *= 0.75;
      if ((this.player.statuses.brulure ?? 0) > 0) dmg *= 0.75;
      return Math.floor(Math.floor(dmg + 1e-9) * this.relicMult(false) + 1e-9);
    }
    let amount = this.playerDamage(base, d, target).amount;
    // Talents de gardien qui réduisent les dégâts (aperçu, sans effet de bord)
    const g = this.gimmickOf(target);
    if (g === 'cuirasse' && target.flags.cuirasse !== this.turn) amount = Math.floor(amount / 2);
    if (g === 'fantome-inconnu' && (target.flags.touches ?? 0) < 3) amount = Math.floor(amount / 2);
    if (g === 'reine' && this.aliveEnemies().some((x) => x !== target)) amount = Math.floor(amount / 2);
    if (g === 'multiecaille' && target.hp >= target.maxHp) amount = Math.floor(amount / 2);
    if (g === 'torche' && d.pokeType === 'feu') amount = Math.floor(amount / 2);
    return amount;
  }

  /** Aperçu complet sur une cible : dégâts par coup, nombre de coups, efficacité, et Protection qui absorbera. */
  previewOn(card: Card, targetUid: number): { perHit: number; hits: string; total: number; eff: 'super' | 'normal' | 'faible' | 'immunite'; blocked: number } | null {
    const per = this.previewCardDamage(card, targetUid);
    const t = this.enemy(targetUid);
    if (per === null || !t) return null;
    const d = this.def(card);
    const hit = d.effects.find((e): e is Extract<Effect, { kind: 'degats' }> => e.kind === 'degats');
    const n = hit?.hits ?? 1;
    const hits = hit?.hitsMax && hit.hitsMax !== n ? `${n}-${hit.hitsMax}` : String(n);
    const mult = typeMultiplier(d.pokeType, t.types);
    const eff = effectivenessOf(mult, hasImmunity(d.pokeType, t.types));
    const total = per * n;
    return { perHit: per, hits, total, eff, blocked: Math.min(t.block, total) };
  }

  /** Bonus de dégâts liés au Bébé Kangourex (s'il est debout). */
  private babyBonus(e: Extract<Effect, { kind: 'degats' }>): number {
    const f = this.player.familiar;
    if (!f || f.hp <= 0) return 0;
    return (e.siBebe ?? 0) + (e.parBebe ? f.power * e.parBebe : 0);
  }

  /** Blabla Dodo joue une carte même si on dort. */
  private sleepBypass = false;

  /** Le Bébé attire toutes les attaques ennemies ce tour-ci (Garde Maternelle…). */
  babyTaunt = false;
  /** Attaques du Bébé faites ce tour (Furie). */
  babyHits = 0;
  /** Dialga a lancé Hurle-Temps : 2 PA de moins au prochain tour du joueur. */
  timeRoar = false;
  /** Recharge (Hurle-Temps du joueur) : PA en moins au prochain tour. */
  rechargePa = 0;
  /** Skin Cramoisi (Riolu) : l'Aura brûle la cible au lieu d'ajouter des dégâts (sauf cartes d'Aura comme Aurasphère). */
  crimson = false;
  /** Skin Alchimiste (Vipélierre) : ses Vampigraines deviennent du Poison. */
  alchemist = false;
  /** Skin Chien de la Lanterne (Caninos) : chaque pioche pendant son tour inflige 12 dégâts à tous les ennemis. */
  soulDog = false;
  /** Skin Tisserand de Soie Astrale (Vipélierre) : une carte peut porter plusieurs enchantements. */
  weaver = false;
  /** Pokédollars gagnés pendant le combat (Jackpot). */
  moneyGained = 0;
  private moneyStart = 0;
  /** Enchantements faits en combat (Permucœur), à reporter dans le deck de la run. */
  enchantedCards: { uid: number; defId: string }[] = [];
  /** Pioche de la main du tour en cours (ne déclenche pas Feu des Âmes). */
  private handDraw = false;
  /** Le Bébé n'enrage sa mère qu'une fois par combat. */
  private babyEnraged = false;

  /** Façade : un statut néfaste ou une baisse de stat. */
  private hasBadStatus(): boolean {
    const s = this.player.statuses;
    return hasAnyStatus(this.player) || (s.attaque ?? 0) < 0 || (s.defense ?? 0) < 0 || (s.gel ?? 0) > 0;
  }

  /** Dégâts par coup annoncés par l'intention d'un ennemi. */
  previewIntentDamage(e: EnemyState): number | null {
    if (e.intent.damage === undefined) return null;
    const extra = e.intent.escalate ? (e.flags[e.intent.id] ?? 0) * e.intent.escalate : 0;
    return computeDamage(e.intent.damage + extra, e, this.player, e.intent.pokeType ?? 'normal').amount;
  }

  // ——— Actions du joueur ———

  play(cardUid: number, targetUid?: number): boolean {
    const idx = this.hand.findIndex((c) => c.uid === cardUid);
    if (idx < 0) return false;
    const card = this.hand[idx];
    if (!this.canPlay(card)) return false;
    const d = this.def(card);

    let target: EnemyState | undefined;
    if (d.target === 'ennemi') {
      target = targetUid !== undefined ? this.enemy(targetUid) : this.aliveEnemies()[0];
      if (!target || target.hp <= 0) return false;
    }

    const paid = this.costOf(card);
    if (d.cost >= 2 && paid === 0 && !this.player.freeTurn && this.has('herbe-pouvoir') && !this.used.has('herbe-pouvoir')) {
      this.used.add('herbe-pouvoir'); this.relicFired('herbe-pouvoir');
    }
    if (paid < d.cost && this.has('encens-bizarre') && !this.oddUsed && d.character !== 'mew' && d.character !== 'normal' && !this.player.freeTurn) {
      this.oddUsed = true; this.relicFired('encens-bizarre');
    }
    this.player.energy -= paid;
    this.hand.splice(idx, 1);

    // Photocopie : la prochaine carte est jouée deux fois
    const reps = this.doubleNext > 0 && !d.effects.some((e) => e.kind === 'double-jeu') ? 2 : 1;
    if (reps === 2) {
      this.doubleNext--;
      this.events.push({ type: 'player-move', name: `Photocopie : ${d.name} × 2` });
    }
    for (let r = 0; r < reps; r++) {
      this.cardAuraUsed = false;
      const t = target && target.hp > 0 ? target : d.target === 'ennemi' ? this.aliveEnemies()[0] : undefined;
      for (const eff of d.effects) {
        if (this.phase !== 'joueur') break;
        this.resolve(eff, d, t);
      }
      const hit = d.effects.find((e): e is Extract<Effect, { kind: 'degats' }> => e.kind === 'degats');
      if (hit?.cumul) this.cumul[baseName(d.name)] = (this.cumul[baseName(d.name)] ?? 0) + hit.cumul;
    }
    if (!d.effects.some((e) => e.kind === 'copie')) this.lastPlayed = d;
    this.cardsThisTurn++;
    if (this.phase === 'joueur' && this.cardsThisTurn >= 5 && this.bossAlive('decharge')) {
      this.events.push({ type: 'player-move', name: 'Décharge !' });
      this.loseHp(this.player, 'player', 2, 'carte');
    }
    if (d.category === 'technique') for (const e of this.aliveEnemies()) if (this.gimmickOf(e) === 'regard-royal') this.gainBlock(e, e.uid, 3);
    if (d.category === 'technique') {
      this.techsThisTurn++;
      if (this.has('encens-pur') && this.phase === 'joueur') this.relicFired('encens-pur', () => this.gainAura(2, true));
      if (this.techsThisTurn >= 3 && this.has('spray-gorge') && !this.sprayUsed && this.phase === 'joueur') {
        this.sprayUsed = true;
        this.relicFired('spray-gorge', () => this.changeEnergy(1, 'Spray Gorge'));
      }
    }
    if (d.category === 'attaque') {
      if (GEMS[d.pokeType] && this.has(GEMS[d.pokeType]!)) this.gemsUsed.add(d.pokeType);
      if (this.has('roche-royale') && this.phase === 'joueur') {
        const victims = d.target === 'tous' ? this.aliveEnemies() : target && target.hp > 0 ? [target] : [];
        for (const v of victims) if (this.rng.next() < 0.2) this.relicFired('roche-royale', () => this.addStatus(v, v.uid, 'peur', 1));
      }
      this.attacksThisTurn++;
      this.firstAttackDone = true;
      if (this.has('orbe-vie') && this.phase === 'joueur') this.relicFired('orbe-vie', () => this.loseHp(this.player, 'player', 1, 'carte'));
    }

    // Talents et cartes Épuisées quittent le combat
    if (d.category === 'talent' || d.keywords?.includes('epuisee')) this.exhaustPile.push(card);
    else this.discardPile.push(card);

    this.checkEnd();
    return true;
  }

  endPlayerTurn(): void {
    if (this.phase !== 'joueur') return;
    this.endTurnRequested = false;
    this.skipTurn = false;
    for (const c of this.hand) {
      const d = this.def(c);
      if (d.keywords?.includes('conservee')) continue;
      if (d.keywords?.includes('ephemere')) this.exhaustPile.push(c);
      else this.discardPile.push(c);
    }
    this.hand = this.hand.filter((c) => this.def(c).keywords?.includes('conservee'));
    // Vœu Brisé (malédiction) : 2 PV perdus par carte restée en main
    for (const c of this.hand) if (c.defId === 'voeu-brise' && this.player.hp > 0) {
      this.events.push({ type: 'hp-loss', target: 'player', amount: Math.min(2, this.player.hp), source: 'carte' });
      this.applyHpLoss(this.player, 'player', 2);
    }
    const fam = this.player.familiar;
    if (fam && fam.hp > 0) this.familiarAttack((fam.mega ? 2 : 1) + (this.player.powers['amour-filial'] ?? 0));
    if ((this.phase as string) === 'victoire') return; // le Bébé a gagné le combat
    if (this.cardsThisTurn >= 5 && this.bossAlive('ailes')) this.addStatus(this.player, 'player', 'confusion', 1);
    if (this.player.energy > 0 && this.bossAlive('sol-brulant')) this.addStatus(this.player, 'player', 'brulure', this.player.energy);
    if ((this.player.statuses.elan ?? 0) > 0) {
      const half = Math.floor(this.player.statuses.elan! / 2);
      this.addStatus(this.player, 'player', 'elan', half - this.player.statuses.elan!);
    }
    this.tickDurations(this.player);
    if ((this.player.statuses.sommeil ?? 0) > 0) {
      this.player.statuses.sommeil! -= 1;
      if (this.player.statuses.sommeil! <= 0) { delete this.player.statuses.sommeil; this.events.push({ type: 'player-move', name: 'Tu te réveilles !' }); }
    }
    this.phase = 'ennemi';
    this.player.freeTurn = false;
    this.player.hpLostEnemyTurn = 0;
    for (const e of this.aliveEnemies()) e.block = this.gimmickOf(e) === 'mur-roc' ? Math.floor(e.block / 2) : 0;
  }

  /** Fait agir un ennemi (appelé un par un par l'interface, pour animer). */
  enemyAct(uid: number): void {
    const e = this.enemy(uid);
    if (this.phase !== 'ennemi' || !e || e.hp <= 0) return;
    this.tickDots(e, uid);
    if (e.hp <= 0) return this.checkEnd();
    if (this.gimmickOf(e) === 'clair-de-lune' && e.hp < e.maxHp) this.healEnemy(e, 4);

    // Gel : à 3, l'ennemi passe son tour (un gardien inflige seulement la moitié de ses dégâts)
    const frozen = (e.statuses.gel ?? 0) >= 3;
    if (frozen) {
      delete e.statuses.gel;
      this.events.push({ type: 'status', target: uid, status: 'gel', stacks: -3 });
    }
    if (frozen && !this.boss) {
      this.events.push({ type: 'enemy-move', uid, name: 'Gelé !' });
    } else if ((e.statuses.sommeil ?? 0) > 0 && !ENEMY_DEFS[e.defId]?.actsAsleep) {
      e.statuses.sommeil! -= 1;
      this.events.push({ type: 'enemy-move', uid, name: 'Dort…' });
    } else {
      const m = frozen && this.boss && m0(e.intent).damage ? { ...e.intent, damage: Math.floor(e.intent.damage! / 2) } : e.intent;
      if (m.id === 'hurle-temps') this.timeRoar = true;
      this.events.push({ type: 'enemy-move', uid, name: m.name, move: m, damage: m.damage !== undefined ? Math.floor(computeDamage(m.damage + (m.escalate ? (e.flags[m.id] ?? 0) * m.escalate : 0), e, this.player, m.pokeType ?? 'normal').amount * this.fieldMult(m.pokeType ?? 'normal', this.has('lunettes-filtre'))) : undefined });
      if (m.meteo) this.setField(m.meteo);
      // Miroir Originel : Arceus prend le type de la carte qu'il vient d'utiliser (et la plaque qui va avec)
      if (this.gimmickOf(e) === 'miroir-originel' && m.pokeType && e.types[0] !== m.pokeType) {
        e.types = [m.pokeType];
        e.form = m.pokeType;
        this.events.push({ type: 'enemy-move', uid, name: `Arceus devient de type ${TYPE_NAMES[m.pokeType] ?? m.pokeType} !` });
      }
      if (m.block) this.gainBlock(e, uid, m.block);
      if (m.heal) this.healEnemy(e, m.heal);
      const extra = m.escalate ? (e.flags[m.id] ?? 0) * m.escalate : 0;
      if (m.escalate) e.flags[m.id] = (e.flags[m.id] ?? 0) + 1;
      if (m.damage !== undefined) {
        // Le Bébé Kangourex peut être visé (3 chances sur 10)
        const fam = this.player.familiar;
        let dealt = 0;
        for (let i = 0; i < (m.hits ?? 1) && this.phase === 'ennemi'; i++) {
          // Le Bébé fait bouclier : tant qu'il est debout, il encaisse les coups ; le surplus touche Kangourex
          if (fam && fam.hp > 0) {
            const { amount, effectiveness } = computeDamage(m.damage + extra, e, BABY_FIGHTER, m.pokeType ?? 'normal');
            const left = this.hitFamiliar(Math.floor(amount * this.fieldMult(m.pokeType ?? 'normal', this.has('lunettes-filtre'))), effectiveness);
            dealt += amount;
            if (left > 0) this.dealDamage(this.player, 'player', left, effectiveness);
            const thornsB = this.player.statuses.epine ?? 0;
            if (thornsB > 0 && e.hp > 0) this.dealDamage(e, uid, thornsB, 'normal');
            continue;
          }
          let { amount, effectiveness } = computeDamage(m.damage + extra, e, this.player, m.pokeType ?? 'normal');
          amount = Math.floor(amount * this.fieldMult(m.pokeType ?? 'normal', this.has('lunettes-filtre')));
          if (this.resists.has(m.pokeType ?? 'normal')) amount = Math.floor(amount / 2);
          // Perce-Protection (capacité) ou Téra-Voltage (moitié de la Protection ignorée)
          const hidden = m.pierce ? this.player.block : this.gimmickOf(e) === 'teravolt' ? Math.ceil(this.player.block / 2) : 0;
          this.player.block -= hidden;
          this.dealDamage(this.player, 'player', amount, effectiveness);
          this.player.block += hidden;
          dealt += amount;
          // Épine : l'attaquant se pique à chaque coup
          const thorns = this.player.statuses.epine ?? 0;
          if (thorns > 0 && e.hp > 0) this.dealDamage(e, uid, thorns, 'normal');
        }
        // Drain : récupère la moitié des dégâts ; Contrecoup : se blesse
        if (m.drain && e.hp > 0 && dealt > 0) this.healEnemy(e, Math.floor(dealt / 2));
        // Bulbe : une attaque Eau te renforce
        if (m.pokeType === 'eau' && m.damage !== undefined && this.has('bulbe') && this.player.hp > 0) {
          this.relicFired('bulbe', () => { this.addStatus(this.player, 'player', 'attaque', 1); this.addStatus(this.player, 'player', 'defense', 1); });
        }
        if (m.recoil && e.hp > 0) this.dealDamage(e, uid, m.recoil, 'normal');
        if (this.has('casque-brut') && this.phase === 'ennemi' && e.hp > 0) {
          this.relicFired('casque-brut', () => this.dealDamage(e, uid, 3, 'normal'));
        }
      }
      if (m.playerStatus && this.phase === 'ennemi') {
        if (m.playerStatus.status === 'vampigraine') this.seedSource = uid; // c'est lui qui se soignera
        this.addStatus(this.player, 'player', m.playerStatus.status, m.playerStatus.stacks);
      }
      if (m.selfStatus) this.addStatus(e, uid, m.selfStatus.status, m.selfStatus.stacks);
      if (m.addCards && this.phase === 'ennemi') this.addBossCards(m.addCards.id, m.addCards.count, m.addCards.to);
      if (m.discard && this.phase === 'ennemi') this.discardRandom(m.discard);
      if (m.summon) this.summon(m.summon.id, m.summon.max);
      e.history.push(m.id);
    }
    this.tickDurations(e);
    this.rollIntent(e);
  }

  endEnemyTurn(): void {
    if (this.phase !== 'ennemi') return;
    this.babyTaunt = false;
    this.tickField();
    if ((this.phase as string) !== 'ennemi') return;
    this.startPlayerTurn();
  }

  // ——— Interne ———

  private spawnEnemy(id: string): EnemyState {
    const d = ENEMY_DEFS[id];
    if (!d) throw new Error(`Ennemi inconnu : ${id}`);
    const hp = Math.round(this.rng.int(d.hp[0], d.hp[1]) * (this.enemyPower ?? 1) * (this.relics?.has('orbe-perle') ? 1.2 : 1));
    return {
      uid: this.nextEnemyUid++, defId: id, name: d.name, dex: d.dex, types: [...d.types],
      hp, maxHp: hp, block: 0, statuses: {}, intent: d.moves[0], history: [], flags: {},
      shiny: this.rng.next() < SHINY_CHANCE, phase: 1, step: 0,
    };
  }

  /** Choix pondéré, sans jamais répéter la même action 3 fois de suite. */
  /** Arceus (Miroir Originel) : il copie une carte du deck du joueur, en plus fort ; Jugement tous les 4 tours. */
  private mirrorMove(e: EnemyState): EnemyMove {
    const def = ENEMY_DEFS[e.defId];
    e.step++;
    // Jugement prend le type de la plaque actuelle d'Arceus
    if (e.step % 4 === 0) return { ...def.moves.find((m) => m.id === 'jugement')!, pokeType: e.types[0] ?? 'normal' };
    const pool = [...this.hand, ...this.drawPile, ...this.discardPile, ...this.exhaustPile];
    const card = pool.length ? this.rng.pick(pool) : null;
    if (!card) return def.moves[0];
    const d = this.def(card);
    let damage = 0, hits = 1, block = 0;
    let playerStatus: EnemyMove['playerStatus'];
    let selfStatus: EnemyMove['selfStatus'];
    for (const eff of d.effects) {
      if (eff.kind === 'degats') { damage += eff.amount; hits = Math.max(hits, eff.hits ?? 1); }
      else if (eff.kind === 'degats-aura' || eff.kind === 'degats-pv-perdus' || eff.kind === 'concentration') damage += 12;
      else if (eff.kind === 'protection') block += eff.amount;
      else if (eff.kind === 'statut' && eff.on !== 'soi' && eff.stacks > 0 && !playerStatus) playerStatus = { status: eff.status, stacks: eff.stacks };
      else if (eff.kind === 'statut' && eff.on === 'soi' && eff.stacks > 0 && !selfStatus && (eff.status === 'attaque' || eff.status === 'defense')) selfStatus = { status: eff.status, stacks: eff.stacks };
    }
    const name = `${d.name} (copie)`;
    // Plus fort que la carte d'origine : ×1,6 sur les dégâts, ×2 sur la Protection
    if (damage > 0) return { id: `miroir-${d.id}`, name, weight: 0, intent: 'attaque', pokeType: d.pokeType, damage: Math.max(8, Math.round(damage * 1.6 / hits)), hits, playerStatus, selfStatus, block: block ? block * 2 : undefined, signature: true };
    if (playerStatus) return { id: `miroir-${d.id}`, name, weight: 0, intent: 'handicap', pokeType: d.pokeType, playerStatus: { status: playerStatus.status, stacks: playerStatus.stacks + 1 }, signature: true };
    return { id: `miroir-${d.id}`, name, weight: 0, intent: 'boost', block: Math.max(16, block * 2), selfStatus: selfStatus ?? { status: 'attaque', stacks: 1 }, signature: true };
  }

  private rollIntent(e: EnemyState): void {
    const def = ENEMY_DEFS[e.defId];
    if (def.gimmick?.id === 'miroir-originel') { e.intent = this.mirrorMove(e); return; }
    const order = e.phase === 2 && def.phase2 ? def.phase2.pattern : def.pattern;
    if (order) {
      const id = order[e.step % order.length];
      e.step++;
      e.intent = def.moves.find((m) => m.id === id) ?? def.moves[0];
      return;
    }
    const moves = def.moves;
    const [a, b] = e.history.slice(-2);
    const allowed = a !== undefined && a === b ? moves.filter((m) => m.id !== a) : moves;
    e.intent = this.rng.weighted(allowed.length ? allowed : moves);
  }

  private startPlayerTurn(): void {
    this.turn++;
    this.phase = 'joueur';
    this.attacksThisTurn = 0;
    this.cardsThisTurn = 0;
    this.techsThisTurn = 0;
    this.sprayUsed = false;
    this.oddUsed = false;
    this.gemsUsed.clear();
    if (this.player.familiar) this.player.familiar.block = 0;
    // Corail (Gardien Océanique) : le Bébé se protège à chaque tour
    if (this.has('corail') && this.player.familiar && this.player.familiar.hp > 0) this.player.familiar.block += 3;
    this.babyHits = 0;
    // Lumargile : la Protection n'est que divisée par deux au lieu de disparaître
    this.player.block = this.has('lumargile') ? Math.floor(this.player.block / 2) : 0;
    // Évoluroc : tant que le Pokémon n'a pas évolué, 3 Protection à chaque tour
    const chDef = CHARACTERS[this.player.character];
    if (this.has('evoluroc') && (chDef.evolutions?.length ?? 0) > 0 && this.player.dex === chDef.dex[0]) this.relicFired('evoluroc', () => this.gainBlock(this.player, 'player', 3));
    // Encens Doux (Kangourex) : le Bébé récupère 2 PV
    const fam0 = this.player.familiar;
    if (this.has('encens-doux') && fam0 && fam0.hp > 0 && fam0.hp < fam0.maxHp) { fam0.hp = Math.min(fam0.maxHp, fam0.hp + 2); this.relicFired('encens-doux'); }
    this.player.energy = this.player.maxEnergy;
    if (this.player.statuses.tenace) {
      delete this.player.statuses.tenace;
      this.events.push({ type: 'status', target: 'player', status: 'tenace', stacks: -1 });
    }
    this.tickDots(this.player, 'player');
    if (this.player.hp <= 0) return this.checkEnd();
    // Mitra-Poing : la frappe concentrée part si aucun dégât n'a été subi
    const focus = this.player.statuses.concentration;
    if (focus && this.focus) {
      delete this.player.statuses.concentration;
      const f = this.focus;
      this.focus = null;
      const t = this.enemy(f.uid)?.hp ? this.enemy(f.uid)! : this.aliveEnemies()[0];
      if (t) {
        this.events.push({ type: 'player-move', name: `${f.d.name} : frappe concentrée !` });
        this.strike(t, focus, f.d);
        this.checkEnd();
        if (this.phase !== 'joueur') return;
      }
    }
    // Distorsion du Temps (Dialga) : à partir du 3e tour, 1 PA de moins jusqu'à la fin du combat
    if (this.bossAlive('distorsion') && this.turn >= 3) this.changeEnergy(-1, 'Distorsion du Temps');
    // Hurle-Temps : le tour suivant, 2 PA de moins
    if (this.timeRoar) { this.timeRoar = false; this.changeEnergy(-2, 'Hurle-Temps'); }
    if (this.rechargePa) { const n = this.rechargePa; this.rechargePa = 0; this.changeEnergy(-n, 'Recharge'); }
    if (this.player.statuses.etourdi) {
      delete this.player.statuses.etourdi;
      this.skipTurn = true;
      this.player.energy = 0;
      this.events.push({ type: 'player-move', name: 'Étourdi : tu passes ce tour…' });
    }
    const pw = this.player.powers;
    if (pw.plenitude) this.gainAura(pw.plenitude);
    if (pw['champ-herbu']) this.healPlayer(pw['champ-herbu']);
    if (pw.racines) this.gainBlock(this.player, 'player', pw.racines);
    if (pw['peau-dure']) this.addStatus(this.player, 'player', 'epine', pw['peau-dure']);
    if (pw.eveil && this.player.familiar) this.player.familiar.power += pw.eveil;
    if (pw.croissance) this.invoke(pw.croissance);
    if (pw.turbo) this.addStatus(this.player, 'player', 'elan', pw.turbo);
    if (pw.braises) for (const e of this.aliveEnemies()) this.addStatus(e, e.uid, 'brulure', pw.braises);
    if (pw.souvenir) this.resolve({ kind: 'ajoute-carte', from: 'tous', count: pw.souvenir }, cardDef('abri'), undefined);
    if (pw.telekinesie) this.draw(pw.telekinesie);
    if (pw['lire-esprit'] && this.player.aura >= 30) {
      this.player.freeTurn = true;
      this.player.aura -= 15;
      this.events.push({ type: 'aura', amount: this.player.aura });
      this.events.push({ type: 'player-move', name: 'Énergie illimitée !' });
    }
    this.handDraw = true;
    this.draw(HAND_SIZE - (this.has('orbe-platine') ? 1 : 0));
    this.handDraw = false;
    this.checkLucarite();
  }

  draw(n: number): void {
    const before = this.hand.length;
    this.drawCards(n);
    // Feu des Âmes (Chien de la Lanterne) : chaque pioche pendant le tour brûle tous les ennemis
    if (this.soulDog && !this.handDraw && this.phase === 'joueur' && this.hand.length > before) {
      this.events.push({ type: 'player-move', name: 'Feu des Âmes !' });
      for (const e of this.aliveEnemies()) this.dealDamage(e, e.uid, 12, 'normal');
      this.checkEnd();
    }
  }

  private drawCards(n: number): void {
    for (let i = 0; i < n; i++) {
      if (this.hand.length >= MAX_HAND) return;
      if (this.drawPile.length === 0) {
        if (this.discardPile.length === 0) return;
        this.drawPile = this.rng.shuffle(this.discardPile);
        this.discardPile = [];
      }
      const card = this.drawPile.pop()!;
      this.hand.push(card);
      const od = this.def(card).onDraw;
      if (od?.length && this.phase === 'joueur') {
        this.events.push({ type: 'player-move', name: `${this.def(card).name} !` });
        for (const eff of od) this.resolve(eff, this.def(card), undefined);
        if (this.player.energy < 0) this.player.energy = 0;
      }
    }
  }

  private hasKw(card: Card, kw: NonNullable<CardDef['keywords']>[number]): boolean {
    return this.def(card).keywords?.includes(kw) ?? false;
  }

  /** Cartes dont les dégâts dépendent de l'Aura (Aurasphère, Vibrobscur, cartes qui multiplient l'Aura). */
  private auraScaling(d: CardDef): boolean {
    return d.effects.some((e) => e.kind === 'degats-aura' || e.kind === 'aura-mult');
  }

  /** Bonus d'Aura d'une carte. Skin Cramoisi : l'Aura est consommée et inflige autant de Brûlure aux cibles. */
  private auraFor(d: CardDef, targets: EnemyState[]): number {
    if (!this.crimson || this.auraScaling(d)) return this.takeAura();
    const a = this.takeAura();
    if (a > 0) for (const t of targets) if (t.hp > 0) this.addStatus(t, t.uid, 'brulure', a);
    return 0;
  }

  /** L'Aura s'ajoute au premier coup d'une carte, puis retombe à 0 (une seule fois par carte). */
  private takeAura(): number {
    if (this.cardAuraUsed) return 0;
    this.cardAuraUsed = true;
    const a = this.player.aura;
    if (a > 0) {
      this.player.aura = 0;
      this.events.push({ type: 'aura', amount: 0 });
    }
    return a;
  }

  private targetsFor(d: CardDef, target: EnemyState | undefined): EnemyState[] {
    if (d.target === 'tous') return this.aliveEnemies();
    if (d.target === 'aleatoire') return [this.rng.pick(this.aliveEnemies())].filter(Boolean);
    if (target && target.hp > 0) return [target];
    const alive = this.aliveEnemies();
    return alive.length ? [this.rng.pick(alive)] : [];
  }

  /** Inflige un coup ; renvoie les PV réellement retirés. */
  private strike(t: EnemyState, base: number, d: CardDef): number {
    const before = t.hp;
    let { amount, effectiveness } = this.playerDamage(base, d, t);
    const g = this.gimmickOf(t);
    if (g === 'cuirasse' && t.flags.cuirasse !== this.turn) { t.flags.cuirasse = this.turn; amount = Math.floor(amount / 2); }
    if (g === 'fantome-inconnu') {
      const hits = (t.flags.touches ?? 0) + 1;
      t.flags.touches = hits;
      if (hits <= 3) amount = Math.floor(amount / 2);
      if (hits === 3) this.events.push({ type: 'enemy-move', uid: t.uid, name: 'Le spectre est révélé !' });
    }
    if (g === 'reine' && this.aliveEnemies().some((x) => x !== t)) amount = Math.floor(amount / 2);
    if (g === 'multiecaille' && t.hp >= t.maxHp) amount = Math.floor(amount / 2);
    if (g === 'torche' && d.pokeType === 'feu') { amount = Math.floor(amount / 2); this.addStatus(t, t.uid, 'attaque', 1); }
    this.dealDamage(t, t.uid, amount, effectiveness);
    return before - t.hp;
  }

  /** Applique un effet de carte. */
  private resolve(eff: Effect, d: CardDef, target: EnemyState | undefined): void {
    const p = this.player;
    switch (eff.kind) {
      case 'degats': {
        const hits = eff.hitsMax ? this.rng.int(eff.hits ?? 1, eff.hitsMax) : (eff.hits ?? 1);
        let base = eff.amount + (eff.parProtection ? p.block : 0) + (eff.cumul ? this.cumul[baseName(d.name)] ?? 0 : 0);
        if (eff.facade && this.hasBadStatus()) base *= 2;
        if (eff.revanche && p.hpLostEnemyTurn > 0) base *= 2;
        if (eff.parSoi) base += (p.statuses[eff.parSoi] ?? 0) * (eff.parSoiX ?? 1);
        let dealt = 0;
        let recoil = false;
        for (let i = 0; i < hits && this.phase === 'joueur'; i++) {
          const targets = this.targetsFor(d, target);
          if (!targets.length) break;
          let bonus = 0;
          if (eff.noAura) this.cardAuraUsed = true;
          else bonus = this.auraFor(d, targets);
          for (const t of targets) {
            let b = eff.contreStatut && hasAnyStatus(t) ? base * 2 : base;
            if (eff.parStatut) b += (t.statuses[eff.parStatut] ?? 0) * (eff.parStatutX ?? 1);
            b += this.babyBonus(eff);
            if (eff.recul && t.block > 0) recoil = true;
            dealt += this.strike(t, b + bonus, d);
            if (eff.peurChance && t.hp > 0 && this.rng.next() < eff.peurChance) this.addStatus(t, t.uid, 'peur', 1);
          }
        }
        if (eff.drain) this.healPlayer(Math.floor(dealt / 2));
        if (recoil && this.phase === 'joueur') this.loseHp(p, 'player', eff.recul!, 'carte');
        return;
      }
      case 'degats-aura': {
        const t = this.targetsFor(d, target)[0];
        const aura = p.aura;
        if (eff.consume !== false) this.takeAura();
        else this.cardAuraUsed = true; // ne consomme pas, mais ne s'ajoute pas une deuxième fois
        if (t) this.strike(t, aura * eff.mult, d);
        return;
      }
      case 'degats-pv-perdus': {
        const t = this.targetsFor(d, target)[0];
        const base = eff.amount + Math.floor((p.maxHp - p.hp) / eff.per) + (t ? this.auraFor(d, [t]) : this.takeAura());
        if (t) this.strike(t, base, d);
        return;
      }
      case 'tout-ou-rien': {
        const t = this.targetsFor(d, target)[0];
        const base = p.hp - 1;
        if (t) this.strike(t, base, d);
        if (this.phase === 'joueur') this.loseHp(p, 'player', p.hp - 1, 'carte');
        return;
      }
      case 'aura-protection': {
        const a = p.aura;
        p.aura = 0;
        this.events.push({ type: 'aura', amount: 0 });
        this.gainBlock(p, 'player', Math.floor(a * eff.mult));
        return;
      }
      case 'protection':
        this.gainBlock(p, 'player', eff.amount + (p.statuses.defense ?? 0));
        return;
      case 'statut': {
        const list: [Fighter, Who][] =
          eff.on === 'soi' ? [[p, 'player']]
          : eff.on === 'tous' ? this.aliveEnemies().map((e) => [e, e.uid] as [Fighter, Who])
          : target ? [[target, target.uid]] : [];
        for (const [f, who] of list) {
          let n = eff.stacks;
          // Pic Venin (Vipélierre) : chaque statut infligé à un ennemi en inflige 1 de plus
          if (who !== 'player' && this.has('pic-venin')) n += n > 0 ? 1 : -1;
          this.addStatus(f, who, eff.status, n);
        }
        return;
      }
      case 'casse-protection':
        for (const t of d.target === 'tous' ? this.aliveEnemies() : target ? [target] : []) {
          if (t.block <= 0) continue;
          t.block = 0;
          this.events.push({ type: 'break', target: t.uid });
        }
        return;
      case 'pioche':
        this.draw(eff.amount);
        return;
      case 'pa':
        this.changeEnergy(eff.amount, d.name);
        return;
      case 'perte-pv':
        this.loseHp(p, 'player', eff.amount, 'carte');
        return;
      case 'aura':
        this.gainAura(eff.amount, true);
        return;
      case 'meteo':
        this.setField(eff.id, eff.turns);
        return;
      case 'baie-aleatoire':
        this.berryGifts += eff.count;
        return;
      case 'decouverte': {
        const pool = Object.values(CARD_DEFS).filter((x) => x.id.startsWith('vip-arom-')).map((x) => x.id);
        this.pendingChoice = { ids: this.rng.shuffle(pool).slice(0, eff.count), upgraded: !!eff.upgraded };
        return;
      }
      case 'aura-mult':
        this.gainAura(p.aura * (eff.amount - 1), true);
        return;
      case 'soin':
        this.healPlayer(eff.amount);
        return;
      case 'pouvoir':
        p.powers[eff.power] = (p.powers[eff.power] ?? 0) + eff.amount;
        this.events.push({ type: 'power', power: eff.power, amount: p.powers[eff.power]! });
        return;
      case 'protection-aura': {
        const n = Math.floor(p.aura / eff.per);
        if (n > 0) this.gainBlock(p, 'player', n);
        return;
      }
      case 'protection-par-soi': {
        const n = (p.statuses[eff.status] ?? 0) * eff.mult;
        if (n > 0) this.gainBlock(p, 'player', n);
        return;
      }
      case 'perd-statut': {
        const v = p.statuses[eff.status] ?? 0;
        if (v) { delete p.statuses[eff.status]; this.events.push({ type: 'status', target: 'player', status: eff.status, stacks: -v }); }
        return;
      }
      case 'pioche-par-soi': {
        const n = Math.floor((p.statuses[eff.status] ?? 0) / eff.per);
        if (n > 0) this.draw(n);
        return;
      }
      case 'protection-par-statut': {
        const n = target ? (target.statuses[eff.status] ?? 0) * eff.mult : 0;
        if (n > 0) this.gainBlock(p, 'player', n);
        return;
      }
      case 'soin-par-statut': {
        const n = target ? (target.statuses[eff.status] ?? 0) * eff.mult : 0;
        if (n > 0) this.healPlayer(n);
        return;
      }
      case 'detonation': {
        for (const t of d.target === 'tous' ? this.aliveEnemies() : target ? [target] : []) {
          const v = t.statuses[eff.status] ?? 0;
          if (v <= 0) continue;
          delete t.statuses[eff.status];
          this.strike(t, v * eff.per, d);
        }
        this.checkEnd();
        return;
      }
      case 'propage-statut': {
        const v = target ? target.statuses[eff.status] ?? 0 : 0;
        if (v > 0) for (const e of this.aliveEnemies()) if (e !== target) this.addStatus(e, e.uid, eff.status, v);
        return;
      }
      case 'pioche-si-statut':
        if (target && (target.statuses[eff.status] ?? 0) > 0) this.draw(eff.amount);
        return;
      case 'protection-par-bebe': {
        const f = p.familiar;
        if (f && f.hp > 0) this.gainBlock(p, 'player', f.power * eff.mult);
        return;
      }
      case 'bebe-garde':
        if (p.familiar && p.familiar.hp > 0) { this.babyTaunt = true; this.events.push({ type: 'player-move', name: 'Le Bébé protège sa maman !' }); }
        return;
      case 'bebe-vers-joueur':
        if (p.familiar && p.familiar.block > 0) this.gainBlock(p, 'player', p.familiar.block);
        return;
      case 'statut-mult': {
        for (const t of eff.on === 'tous' ? this.aliveEnemies() : target ? [target] : []) {
          const v = t.statuses[eff.status] ?? 0;
          if (v > 0) this.addStatus(t, t.uid, eff.status, v * (eff.mult - 1));
        }
        return;
      }
      case 'ajoute-carte': {
        const pool = Object.values(CARD_DEFS).filter((c) => c.rarity !== 'depart'
          && (eff.from === 'neutre' ? c.character === 'normal' : true)
          && !c.effects.some((e) => e.kind === 'ajoute-carte'));
        for (let i = 0; i < eff.count && this.hand.length < MAX_HAND; i++) {
          const pick = this.rng.pick(pool);
          this.hand.push({ uid: this.nextTempUid++, defId: pick.id, upgraded: false });
          this.events.push({ type: 'player-move', name: `Nouvelle carte : ${pick.name}` });
        }
        return;
      }
      case 'bebe-attaque':
        this.familiarAttack(eff.times, target, eff.status, eff.stacks);
        return;
      case 'invocation':
        this.invoke(eff.amount);
        return;
      case 'joue-pioche': {
        for (let i = 0; i < eff.count && this.phase === 'joueur'; i++) {
          if (!this.drawPile.length) {
            if (!this.discardPile.length) break;
            this.drawPile = this.rng.shuffle(this.discardPile); this.discardPile = [];
          }
          const card = this.drawPile.pop()!;
          const cd = this.def(card);
          const playable = cd.category !== 'statut' && !cd.keywords?.includes('injouable') && !cd.effects.some((e) => e.kind === 'joue-pioche');
          this.events.push({ type: 'player-move', name: playable ? `Atout : ${cd.name} !` : `Atout : ${cd.name} ne peut pas être jouée` });
          if (playable) {
            this.cardAuraUsed = false;
            const t = cd.target === 'ennemi' && this.aliveEnemies().length ? this.rng.pick(this.aliveEnemies()) : undefined;
            for (const e of cd.effects) if (this.phase === 'joueur') this.resolve(e, cd, t);
          }
          (cd.category === 'talent' || cd.keywords?.includes('epuisee') ? this.exhaustPile : this.discardPile).push(card);
        }
        this.checkEnd();
        return;
      }
      case 'argent':
        this.moneyGained += eff.amount;
        this.events.push({ type: 'player-move', name: `+${eff.amount} ₽ !` });
        return;
      case 'permucoeur': {
        // une autre carte de la main, enchantable (déjà enchantée seulement pour le Tisserand)
        const options = this.hand.filter((c) => {
          const cd = this.def(c);
          if (c.defId === d.id || cd.category === 'statut' || cd.keywords?.includes('injouable')) return false;
          if (cd.enchant && !this.weaver) return false;
          return !!rollEnchant(cd, () => 0.5, cd.enchants ?? []);
        });
        if (!options.length) return;
        const card = this.rng.pick(options);
        const cd = this.def(card);
        const k = rollEnchant(cd, () => this.rng.next(), cd.enchants ?? []);
        if (!k) return;
        card.defId = enchantId(k, card.defId);
        this.enchantedCards.push({ uid: card.uid, defId: card.defId });
        this.events.push({ type: 'player-move', name: `Permucœur : ${cd.name} devient ${ENCHANTS[k].name} !` });
        return;
      }
      case 'multiplie-statut': {
        const t = target;
        const n = t?.statuses[eff.status] ?? 0;
        if (t && n > 0) this.addStatus(t, t.uid, eff.status, n * (eff.mult - 1));
        return;
      }
      case 'recharge':
        this.rechargePa += eff.amount;
        return;
      case 'gribouille': {
        if (!target) return;
        const def = ENEMY_DEFS[target.defId];
        if (!def) return;
        // la capacité qu'il prépare, sinon une de ses capacités au hasard
        const move = def.moves.find((m) => m.id === target.intent?.id) ?? this.rng.pick(def.moves);
        let id = copyId(target.defId, move.id);
        if (eff.enchant) { const k = rollEnchant(cardDef(id), () => this.rng.next()); if (k) id = enchantId(k, id); }
        this.copiedCards.push(id);
        this.discardPile.push({ uid: this.nextTempUid++, defId: id, upgraded: false });
        this.events.push({ type: 'player-move', name: `Gribouille copie ${cardDef(id).name} !` });
        return;
      }
      case 'bebe-furie':
        this.familiarAttack(1 + eff.bonus + this.babyHits, target);
        return;
      case 'protection-pv-bebe': {
        const f = p.familiar;
        if (f && f.hp > 0) this.gainBlock(p, 'player', f.hp * eff.mult);
        return;
      }
      case 'souvenir': {
        const f = p.familiar;
        if (!f || f.hp <= 0) return;
        const n = f.hp;
        f.hp = 0;
        this.events.push({ type: 'player-move', name: 'Souvenir ! Le Bébé se sacrifie !' });
        this.events.push({ type: 'ko', target: 'bebe' });
        for (const t of this.aliveEnemies()) this.dealDamage(t, t.uid, n, 'normal');
        this.gainBlock(p, 'player', n);
        this.checkEnd();
        return;
      }
      case 'bebe-puissance':
        if (p.familiar) {
          p.familiar.power += eff.amount;
          this.events.push({ type: 'status', target: 'bebe', status: 'attaque', stacks: eff.amount });
        }
        return;
      case 'bebe-soin':
        if (p.familiar) {
          const f = p.familiar;
          const heal = Math.min(eff.amount, f.maxHp - f.hp);
          if (heal > 0) {
            f.hp += heal;
            this.events.push({ type: 'heal', target: 'bebe', amount: heal });
          }
        }
        return;
      case 'bebe-pvmax':
        if (p.familiar) {
          p.familiar.maxHp += eff.amount;
          p.familiar.hp += eff.amount;
          this.events.push({ type: 'heal', target: 'bebe', amount: eff.amount });
        }
        return;
      case 'bebe-protection':
        if (p.familiar && p.familiar.hp > 0) {
          p.familiar.block += eff.amount;
          this.events.push({ type: 'block', target: 'bebe', amount: eff.amount });
        }
        return;
      case 'protection-cible':
        if (target && target.block > 0) this.gainBlock(p, 'player', target.block);
        return;
      case 'soin-cible':
        if (target && target.hp > 0) {
          const h = Math.min(eff.amount, target.maxHp - target.hp);
          if (h > 0) {
            target.hp += h;
            this.events.push({ type: 'heal', target: target.uid, amount: h });
          }
        }
        return;
      case 'double-jeu':
        this.doubleNext += eff.amount;
        this.events.push({ type: 'player-move', name: eff.amount > 1 ? `Les ${eff.amount} prochaines cartes seront jouées 2 fois` : 'La prochaine carte sera jouée 2 fois' });
        return;
      case 'fuite':
        if (this.boss) return;
        for (const e of this.aliveEnemies()) this.events.push({ type: 'enemy-move', uid: e.uid, name: "S'enfuit !" });
        this.fled = true;
        this.phase = 'victoire';
        return;
      case 'fin-tour':
        this.endTurnRequested = true;
        return;
      case 'concentration': {
        const t = target ?? this.aliveEnemies()[0];
        if (!t) return;
        const bonus = this.auraFor(d, [t]);
        this.focus = { d, uid: t.uid };
        this.player.statuses.concentration = eff.amount + bonus;
        this.events.push({ type: 'status', target: 'player', status: 'concentration', stacks: eff.amount + bonus });
        return;
      }
      case 'auto-degats':
        this.dealDamage(p, 'player', eff.amount, 'normal');
        return;
      case 'consomme-aura':
        p.aura = Math.max(0, p.aura - eff.amount);
        this.events.push({ type: 'aura', amount: p.aura });
        return;
      case 'repos':
        this.healPlayer(Math.ceil(p.maxHp * (eff.healPct ?? 1)));
        this.addStatus(p, 'player', 'sommeil', eff.turns);
        if ((p.statuses.sommeil ?? 0) > 0) this.events.push({ type: 'player-move', name: 'Tu t’endors… Zzz' });
        return;
      case 'ajoute-sommeil': {
        const pool = Object.values(CARD_DEFS).filter((x) => x.requires?.asleep);
        if (!pool.length || this.hand.length >= MAX_HAND) return;
        const pick = this.rng.pick(pool);
        this.hand.push({ uid: this.nextTempUid++, defId: pick.id, upgraded: false });
        this.events.push({ type: 'player-move', name: `Nouvelle carte : ${pick.name}` });
        return;
      }
      case 'blabla': {
        const pool = this.hand.filter((c) => { const x = this.def(c); return !x.keywords?.includes('injouable') && !x.effects.some((e) => e.kind === 'blabla'); });
        if (!pool.length) return;
        const pick = this.rng.pick(pool);
        const pd = this.def(pick);
        this.events.push({ type: 'player-move', name: `Blabla Dodo : ${pd.name} !` });
        const wasFree = p.freeTurn;
        this.sleepBypass = true;
        p.freeTurn = true;
        const alive = this.aliveEnemies();
        this.play(pick.uid, pd.target === 'ennemi' && alive.length ? this.rng.pick(alive).uid : undefined);
        p.freeTurn = wasFree;
        this.sleepBypass = false;
        return;
      }
      case 'copie': {
        const last = this.lastPlayed;
        if (!last) return;
        this.events.push({ type: 'player-move', name: `Photocopie : ${last.name}` });
        for (const e of last.effects) if (this.phase === 'joueur') this.resolve(e, last, target ?? this.aliveEnemies()[0]);
        return;
      }
      case 'metronome': {
        const pool = Object.values(CARD_DEFS).filter((c) =>
          c.character === p.character && c.category !== 'talent' && !c.requires && !c.effects.some((e) => ['metronome', 'copie', 'fuite', 'fin-tour', 'concentration', 'double-jeu'].includes(e.kind)));
        const pick = this.rng.pick(pool);
        this.events.push({ type: 'player-move', name: `Métronome : ${pick.name}` });
        const t = this.aliveEnemies().length ? this.rng.pick(this.aliveEnemies()) : undefined;
        for (const e of pick.effects) if (this.phase === 'joueur') this.resolve(e, pick, t);
        return;
      }
    }
  }

  /** Le Bébé Kangourex attaque (Puissance + Attaque de sa mère, type Normal). */
  private familiarAttack(times: number, target?: EnemyState, status?: StatusId, stacks?: number): void {
    const f = this.player.familiar;
    if (!f || f.hp <= 0) return;
    for (let i = 0; i < times; i++) {
      const alive = this.aliveEnemies();
      if (!alive.length) return;
      const t = target && target.hp > 0 ? target : this.rng.pick(alive);
      const baby = { ...BABY_FIGHTER, statuses: { attaque: this.player.statuses.attaque ?? 0 } };
      const { amount, effectiveness } = computeDamage(f.power, baby, t, 'normal');
      this.events.push({ type: 'player-move', name: 'Le Bébé attaque !' });
      this.babyHits++;
      this.dealDamage(t, t.uid, amount, effectiveness);
      if (status && stacks && t.hp > 0) this.addStatus(t, t.uid, status, stacks);
      this.checkEnd();
    }
  }

  /** Le Bébé encaisse un coup ; renvoie les dégâts qu'il n'a pas pu absorber. */
  private hitFamiliar(amount: number, effectiveness: Effectiveness): number {
    const f = this.player.familiar!;
    const blocked = Math.min(f.block, amount);
    f.block -= blocked;
    const rest = Math.min(f.hp, amount - blocked);
    f.hp -= rest;
    this.events.push({ type: 'damage', target: 'bebe', amount: rest, blocked, effectiveness });
    // Instinct maternel : voir son Bébé blessé donne aussi de la Rage
    if (rest > 0 && this.player.character === 'kangourex') this.addStatus(this.player, 'player', 'rage', 1 + (this.player.powers.rancune ?? 0));
    if (f.hp <= 0) {
      this.events.push({ type: 'ko', target: 'bebe' });
      // Kangourex enrage (une fois par combat) : Attaque +2 pour le combat
      if (!this.babyEnraged) { this.babyEnraged = true; this.addStatus(this.player, 'player', 'attaque', 2); }
    }
    return amount - blocked - rest;
  }

  /** Invocation : le Bébé gagne X PV max et X PV ; s'il est K.O., il revient avec X PV. */
  private invoke(n: number): void {
    const f = this.player.familiar;
    if (!f || n <= 0) return;
    if (f.hp <= 0) {
      f.maxHp = n; f.hp = n; f.block = 0;
      this.events.push({ type: 'player-move', name: `Invocation ${n} : le Bébé revient !` });
    } else {
      f.maxHp += n; f.hp += n;
    }
    this.events.push({ type: 'heal', target: 'bebe', amount: n });
  }

  /** Gardien à deux phases : sous le seuil de PV, il change d'ordre d'actions et se renforce. */
  private checkPhase(e: EnemyState): void {
    const p2 = ENEMY_DEFS[e.defId]?.phase2;
    if (!p2 || e.phase === 2 || e.hp > e.maxHp * p2.below) return;
    e.phase = 2;
    e.step = 0;
    this.events.push({ type: 'enemy-move', uid: e.uid, name: p2.name });
    if (p2.block) this.gainBlock(e, e.uid, p2.block);
    if (p2.selfStatus) this.addStatus(e, e.uid, p2.selfStatus.status, p2.selfStatus.stacks);
    this.rollIntent(e);
  }

  private healPlayer(n: number): void {
    const boosted = this.has('grosse-racine') ? Math.floor(n * 1.5) : n;
    const heal = Math.min(boosted, this.player.maxHp - this.player.hp);
    if (heal <= 0) return;
    this.player.hp += heal;
    this.events.push({ type: 'heal', target: 'player', amount: heal });
    // Encens Fleur (Vipélierre) : chaque soin donne aussi de la Protection (5 max)
    if (this.has('encens-fleur')) this.relicFired('encens-fleur', () => this.gainBlock(this.player, 'player', Math.min(5, heal)));
  }

  /** Météo et terrain en cours (tours restants). */
  weather: { id: WeatherId; turns: number } | null = null;
  terrain: { id: TerrainId; turns: number } | null = null;

  /** Air Lock (Rayquaza) annule les effets de la météo. */
  weatherActive(): WeatherId | null {
    return this.weather && !this.bossAlive('air-lock') ? this.weather.id : null;
  }

  /** Multiplicateur de dégâts dû à la météo et au terrain. */
  fieldMult(type: PokeType, goggles = false): number {
    const w = goggles ? null : this.weatherActive();
    return (w ? WEATHER[w].mult[type] ?? 1 : 1) * (this.terrain ? TERRAINS[this.terrain.id].mult[type] ?? 1 : 1);
  }

  setField(id: WeatherId | TerrainId, _turns?: number): void {
    // Toutes les météos et tous les champs durent 5 tours (relancer remet le compteur à 5)
    const turns = FIELD_TURNS;
    if (isWeather(id)) {
      this.weather = { id, turns };
      this.events.push({ type: 'meteo', id, name: `${WEATHER[id].icon} ${WEATHER[id].name} !` });
    } else {
      this.terrain = { id, turns };
      this.events.push({ type: 'meteo', id, name: `${TERRAINS[id].icon} ${TERRAINS[id].name} !` });
    }
  }

  /** Fin d'un tour complet : dégâts de météo, soin du Champ Herbu, puis les tours restants diminuent. */
  private tickField(): void {
    const w = this.weatherActive();
    const chip = w ? WEATHER[w].chip : undefined;
    const fighters: [Fighter, Who][] = [[this.player, 'player'], ...this.aliveEnemies().map((e) => [e, e.uid] as [Fighter, Who])];
    if (chip) for (const [f, who] of fighters) {
      if (f.hp <= 0 || f.types.some((t) => chip.immune.includes(t))) continue;
      if (who === 'player' && this.has('lunettes-filtre')) continue;
      const n = Math.min(chip.dmg, f.hp);
      this.events.push({ type: 'hp-loss', target: who, amount: n, source: 'carte' });
      this.applyHpLoss(f, who, chip.dmg);
    }
    this.checkEnd();
    if (this.phase === 'victoire' || this.phase === 'defaite') return;
    const guard = w ? WEATHER[w].guard : undefined;
    if (guard) for (const [f, who] of fighters) if (f.hp > 0 && f.types.some((t) => guard.types.includes(t))) this.gainBlock(f, who, guard.block);
    if (this.terrain?.id === 'champ-herbu') {
      this.healPlayer(3);
      for (const e of this.aliveEnemies()) this.healEnemy(e, 3);
      const fam = this.player.familiar;
      if (fam && fam.hp > 0) fam.hp = Math.min(fam.maxHp, fam.hp + 3);
    }
    if (this.weather && --this.weather.turns <= 0) {
      this.events.push({ type: 'meteo', id: this.weather.id, name: `${WEATHER[this.weather.id].name} se dissipe.`, ended: true });
      this.weather = null;
    }
    if (this.terrain && --this.terrain.turns <= 0) {
      this.events.push({ type: 'meteo', id: this.terrain.id, name: `${TERRAINS[this.terrain.id].name} disparaît.`, ended: true });
      this.terrain = null;
    }
  }

  /** Baies gagnées pendant le combat (l'interface les ajoute au sac). */
  berryGifts = 0;
  /** Choix de carte en attente (Aromathérapie) : on ne peut rien jouer tant qu'on n'a pas choisi. */
  pendingChoice: { ids: string[]; upgraded: boolean } | null = null;

  /** Message affiché au-dessus de ton Pokémon (utilisé par l'interface). */
  announce(name: string): void {
    this.events.push({ type: 'player-move', name });
  }

  chooseCard(defId: string): void {
    if (!this.pendingChoice) return;
    const up = this.pendingChoice.upgraded;
    this.pendingChoice = null;
    if (this.hand.length < MAX_HAND) this.hand.push({ uid: this.nextTempUid++, defId, upgraded: up });
    else this.discardPile.push({ uid: this.nextTempUid++, defId, upgraded: up });
    this.events.push({ type: 'player-move', name: `${cardDef(defId, up).name} !` });
  }

  /** Gagne ou perd des PA en dehors du coût d'une carte (affiché à côté de l'orbe d'énergie). */
  private changeEnergy(delta: number, reason: string): void {
    const before = this.player.energy;
    this.player.energy = Math.max(0, before + delta);
    const real = this.player.energy - before;
    if (real) this.events.push({ type: 'energy', delta: real, reason });
  }

  /** Types d'attaques ennemies réduits de moitié (baies de résistance). */
  resists = new Set<string>();

  /** Manger une baie pendant ton tour. */
  useBerry(name: string, fx: BerryFx, targetUid?: number): boolean {
    if (this.phase !== 'joueur') return false;
    const p = this.player;
    this.events.push({ type: 'player-move', name: `${name} !` });
    if (fx.maxHp) { p.maxHp += fx.maxHp; }
    if (fx.heal) this.healPlayer(fx.heal);
    if (fx.cure) for (const s of fx.cure === 'tous' ? BAD_STATUSES : fx.cure) delete p.statuses[s];
    if (fx.cure === 'tous' && (p.statuses.attaque ?? 0) < 0) delete p.statuses.attaque;
    if (fx.cure === 'tous' && (p.statuses.defense ?? 0) < 0) delete p.statuses.defense;
    if (fx.energy) this.changeEnergy(fx.energy, name);
    if (fx.block) this.gainBlock(p, 'player', fx.block);
    for (const x of fx.self ?? []) this.addStatus(p, 'player', x.status, x.stacks);
    if (fx.resist) this.resists.add(fx.resist);
    if (fx.effects) {
      const card = { id: 'baie', name, character: p.character, pokeType: 'normal', category: 'technique', rarity: 'commune', cost: 0, target: 'ennemi', effects: fx.effects, upgrade: {} } as CardDef;
      const t = this.aliveEnemies().find((x) => x.uid === targetUid) ?? this.aliveEnemies()[0];
      for (const e of fx.effects) if (this.phase === 'joueur') this.resolve(e, card, t);
      this.checkEnd();
    }
    if (fx.draw) this.draw(fx.draw);
    if (fx.damageAll) {
      for (const e of this.aliveEnemies()) { this.dealDamage(e, e.uid, fx.damageAll, 'normal'); this.checkPhase(e); }
      this.checkEnd();
    }
    return true;
  }

  private ceintureBonus = false; // vrai pendant un gain d'Aura venant d'une perte de PV

  private checkLucarite(): void {
    if (!this.has('lucarite') || this.used.has('lucarite') || this.phase !== 'joueur' || this.player.aura < 25) return;
    this.used.add('lucarite');
    this.relicFired('lucarite', () => {
      this.draw(2);
      this.changeEnergy(1, 'Lucarite');
    });
  }

  /** `fromCard` : une carte (ou un objet) qui donne de l'Aura en donne à tous les Pokémon, pas seulement à Riolu et Mew. */
  private gainAura(n: number, fromCard = false): void {
    if (!fromCard && this.player.character !== 'riolu' && this.player.character !== 'mew') return;
    this.player.aura += n;
    if (this.has('ceinture-noire') && n > 0 && this.ceintureBonus) {
      this.player.aura += 1;
    }
    this.events.push({ type: 'aura', amount: this.player.aura });
    this.checkLucarite();
  }

  private gainBlock(f: Fighter, who: Who, amount: number): void {
    let n = amount;
    if ((f.statuses.confusion ?? 0) > 0) n *= 0.75;
    n = Math.max(0, Math.floor(n));
    f.block += n;
    this.events.push({ type: 'block', target: who, amount: n });
  }

  private dealDamage(f: Fighter, who: Who, amount: number, effectiveness: Effectiveness): void {
    // Abri : le prochain coup subi est entièrement annulé
    if (amount > 0 && (f.statuses.abri ?? 0) > 0) {
      f.statuses.abri! -= 1;
      if (!f.statuses.abri) delete f.statuses.abri;
      this.events.push(who === 'player' ? { type: 'player-move', name: 'Abri !' } : { type: 'enemy-move', uid: who as number, name: 'Abri !' });
      return;
    }
    const blocked = Math.min(f.block, amount);
    f.block -= blocked;
    const rest = amount - blocked;
    this.events.push({ type: 'damage', target: who, amount: rest, blocked, effectiveness });
    if (rest > 0 && who === 'player' && this.player.statuses.concentration) {
      delete this.player.statuses.concentration;
      this.focus = null;
      this.events.push({ type: 'player-move', name: 'Concentration perdue !' });
    }
    if (rest > 0) this.applyHpLoss(f, who, rest);
    // Un Pokémon endormi se réveille dès qu'il subit des dégâts
    if (rest > 0 && (f.statuses.sommeil ?? 0) > 0 && f.hp > 0) {
      delete f.statuses.sommeil;
      this.events.push(who === 'player' ? { type: 'player-move', name: 'Tu te réveilles !' } : { type: 'enemy-move', uid: who as number, name: 'Se réveille !' });
    }
  }

  /** Perte de PV qui ignore la Protection (statuts, cartes à contrecoup). */
  private loseHp(f: Fighter, who: Who, amount: number, source: StatusId | 'carte'): void {
    if (amount <= 0) return;
    this.events.push({ type: 'hp-loss', target: who, amount, source });
    this.applyHpLoss(f, who, amount);
  }

  private applyHpLoss(f: Fighter, who: Who, amount: number): void {
    let amt = amount;
    // Ceinture Force : une fois par combat, survit à un coup fatal avec 1 PV
    if (who === 'player' && amt >= f.hp && f.hp > 1 && this.has('ceinture-force') && !this.used.has('ceinture-force')) {
      this.used.add('ceinture-force');
      this.relicFired('ceinture-force');
      amt = f.hp - 1;
    }
    // Tenace : ne peut pas tomber K.O. avant son prochain tour
    if (who === 'player' && (f.statuses.tenace ?? 0) > 0 && amt >= f.hp) amt = Math.max(0, f.hp - 1);
    const lost = Math.min(f.hp, amt);
    const wasAboveHalf = f.hp >= f.maxHp / 2;
    f.hp -= lost;
    // Rappel Max : le Pokémon revient avec 33 % de ses PV max, puis l'objet disparaît
    if (who === 'player' && f.hp <= 0 && this.relics.has('rappel-max')) {
      this.relics.delete('rappel-max');
      this.consumedRelics.push('rappel-max');
      f.hp = Math.max(1, Math.round(f.maxHp * 0.33));
      this.events.push({ type: 'relic', id: 'rappel-max' } as CombatEvent);
      this.events.push({ type: 'heal', target: 'player', amount: f.hp });
      this.events.push({ type: 'player-move', name: 'Rappel Max ! Ton Pokémon se relève !' });
    }
    if (who === 'player' && lost > 0 && this.player.character === 'kangourex' && f.hp > 0) {
      // Rage (Kangourex) : chaque perte de PV donne 1 Rage (Rancune en ajoute)
      this.addStatus(this.player, 'player', 'rage', 1 + (this.player.powers.rancune ?? 0));
    }
    if (who === 'player' && lost > 0) {
      this.ceintureBonus = true;
      this.gainAura(lost); // Aura : les PV perdus renforcent la prochaine attaque
      this.ceintureBonus = false;
      if (this.phase === 'ennemi') this.player.hpLostEnemyTurn += lost;
      if (wasAboveHalf && f.hp < f.maxHp / 2 && f.hp > 0 && this.has('bandeau') && !this.used.has('bandeau')) {
        this.used.add('bandeau');
        this.relicFired('bandeau', () => this.gainAura(10));
      }
    }
    if (f.hp <= 0) {
      f.hp = 0;
      this.events.push({ type: 'ko', target: who });
      this.checkEnd();
    } else if (typeof who === 'number') this.checkPhase(f as EnemyState);
  }

  private addStatus(f: Fighter, who: Who, status: StatusId, stacks: number): void {
    let s = stacks;
    // Contestation (Vipélierre) : ses baisses de stats deviennent des hausses, et inversement
    if (who === 'player' && this.player.character === 'vipelierre' && !this.weaver && (status === 'attaque' || status === 'defense')) s = -s;
    if (who !== 'player' && status === 'vampigraine' && s > 0 && this.has('grain-miracle')) s += 2;
    if (s > 0 && this.terrain?.id === 'champ-brumeux' && BAD_STATUSES.includes(status)) return;
    if (who === 'player' && s > 0 && this.has('carapace-mue') && (status === 'peur' || status === 'paralysie')) return void this.relicFired('carapace-mue');
    if (who === 'player' && s > 0 && this.has('grosses-bottes') && status === 'brulure') return void this.relicFired('grosses-bottes');
    if (s > 0 && this.terrain?.id === 'champ-electrifie' && status === 'sommeil') return;
    if (s > 0 && this.terrain?.id === 'champ-psychique' && status === 'confusion') return;
    if (who === 'player' && s > 0 && (status === 'attaque' || status === 'defense') && this.bossAlive('air-lock')) {
      this.events.push({ type: 'player-move', name: 'Air Lock bloque la hausse !' });
      return;
    }
    // Alchimiste : la Vampigraine qu'il inflige devient du Poison
    if (this.alchemist && who !== 'player' && status === 'vampigraine') status = 'poison';
    if (status === 'ligote' && s > 0) (f.binds ??= []).push(...Array(s).fill(3));
    const v = (f.statuses[status] ?? 0) + s;
    if (v === 0) delete f.statuses[status];
    else f.statuses[status] = v;
    this.events.push({ type: 'status', target: who, status, stacks: s });
  }

  /** Début du tour : Poison, Brûlure, Vampigraine. */
  private tickDots(f: Fighter, who: Who): void {
    for (const s of DOTS) {
      const n = f.statuses[s] ?? 0;
      if (n <= 0 || f.hp <= 0) continue;
      // Boue Noire : le Poison que tu subis te soigne au lieu de te blesser
      if (s === 'poison' && who === 'player' && this.has('boue-noire')) {
        this.relicFired('boue-noire', () => this.healPlayer(n));
        if (this.bossAlive('venin-tenace')) continue;
        if (n - 1 <= 0) delete f.statuses[s]; else f.statuses[s] = n - 1;
        continue;
      }
      this.loseHp(f, who, n + (s === 'brulure' && who !== 'player' && this.has('charbon') ? 1 : 0) + ((s === 'poison' || s === 'vampigraine') && who !== 'player' && this.has('bande-etreinte') ? 1 : 0), s);
      if (s === 'vampigraine' && who !== 'player') {
        this.healPlayer(Math.floor(n / 2));
      }
      // Vampigraine posée par un ennemi : c'est lui qui récupère la moitié des PV drainés
      if (s === 'vampigraine' && who === 'player') {
        const src = this.enemies.find((e) => e.uid === this.seedSource && e.hp > 0) ?? this.aliveEnemies()[0];
        if (src) this.healEnemy(src, Math.floor(n / 2));
      }
      if (s === 'poison' && who === 'player' && this.bossAlive('venin-tenace')) continue; // Venin Tenace
      if (n - 1 <= 0) delete f.statuses[s];
      else f.statuses[s] = n - 1;
    }
    // Ligoté : 6 PV par cumul, chaque cumul tient 3 tours
    const nb = f.statuses.ligote ?? 0;
    if (nb <= 0) { f.binds = undefined; return; }
    const binds = (f.binds ?? []).slice(0, nb);
    while (binds.length < nb) binds.push(3);
    if (f.hp > 0) this.loseHp(f, who, 6 * nb, 'ligote');
    f.binds = binds.map((t) => t - 1).filter((t) => t > 0);
    if (f.binds.length) f.statuses.ligote = f.binds.length;
    else { delete f.statuses.ligote; f.binds = undefined; }
  }

  // ——— Gardiens ———

  gimmickOf(e: EnemyState): string | undefined {
    return ENEMY_DEFS[e.defId]?.gimmick?.id;
  }

  private bossAlive(id: string): boolean {
    return this.aliveEnemies().some((e) => this.gimmickOf(e) === id);
  }

  private healEnemy(e: EnemyState, n: number): void {
    const h = Math.min(n, e.maxHp - e.hp);
    if (h <= 0) return;
    e.hp += h;
    this.events.push({ type: 'heal', target: e.uid, amount: h });
  }

  /** Cartes de gardien glissées dans le deck pour ce combat. */
  private addBossCards(id: string, count: number, to: 'pioche' | 'defausse' | 'main'): void {
    for (let i = 0; i < count; i++) {
      const card: Card = { uid: this.nextTempUid++, defId: id, upgraded: false };
      if (to === 'main' && this.hand.length < MAX_HAND) this.hand.push(card);
      else if (to === 'defausse') this.discardPile.push(card);
      else this.drawPile.splice(this.rng.int(0, this.drawPile.length), 0, card);
    }
    const where = to === 'main' ? 'ta main' : to === 'defausse' ? 'ta défausse' : 'ta pioche';
    this.events.push({ type: 'player-move', name: `${count} ${cardDef(id).name} dans ${where}` });
  }

  private discardRandom(n: number): void {
    for (let i = 0; i < n && this.hand.length; i++) {
      const [c] = this.hand.splice(this.rng.int(0, this.hand.length - 1), 1);
      this.discardPile.push(c);
      this.events.push({ type: 'player-move', name: `${this.def(c).name} est défaussée` });
    }
  }

  private summon(id: string, max: number): void {
    if (this.aliveEnemies().filter((e) => e.defId === id).length >= max || this.aliveEnemies().length >= 4) return;
    const e = this.spawnEnemy(id);
    this.enemies.push(e);
    this.rollIntent(e);
    this.events.push({ type: 'enemy-move', uid: e.uid, name: 'Arrive en renfort !' });
  }

  /** Fin du tour du porteur : Paralysie, Peur, Confusion baissent de 1. */
  private tickDurations(f: Fighter): void {
    for (const s of DURATIONS) {
      const n = f.statuses[s] ?? 0;
      if (n <= 0) continue;
      if (n - 1 <= 0) delete f.statuses[s];
      else f.statuses[s] = n - 1;
    }
  }

  private checkEnd(): void {
    if (this.phase === 'victoire' || this.phase === 'defaite') return;
    if (this.player.hp <= 0) this.phase = 'defaite';
    else if (this.aliveEnemies().length === 0) {
      this.phase = 'victoire';
      if (this.has('restes') && this.player.hp < this.player.maxHp) this.relicFired('restes', () => this.healPlayer(3));
    }
  }
}

/** Le Bébé Kangourex comme combattant (type Normal), pour le calcul des dégâts. */
const BABY_FIGHTER: Fighter = { name: 'Bébé', dex: 115, types: ['normal'], hp: 1, maxHp: 1, block: 0, statuses: {} };

/** Nom d'une carte sans le « + » de l'amélioration. */
function baseName(name: string): string {
  return name.replace(/\+$/, '');
}

function m0(m: EnemyMove): EnemyMove {
  return m;
}

function hasAnyStatus(f: Fighter): boolean {
  const s = f.statuses;
  return ['poison', 'brulure', 'vampigraine', 'paralysie', 'peur', 'confusion', 'sommeil', 'ligote'].some((k) => (s[k as StatusId] ?? 0) > 0);
}

/** Crée les cartes d'un deck de départ. */
export function makeDeck(defIds: string[]): Card[] {
  return defIds.map((defId, i) => ({ uid: i + 1, defId, upgraded: false }));
}
