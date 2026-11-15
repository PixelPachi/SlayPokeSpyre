// Moteur de combat (section 4 du GDD). Aucune dépendance à l'affichage : l'interface lit l'état
// et les événements produits, et appelle les actions (jouer une carte, finir le tour…).
import type { Card, CardDef, CharacterId, EnemyMove, Effect, PowerId, StatusId, Statuses } from './model';
import { Rng } from './rng';
import {
  type Effectiveness, type PokeType, SAME_TYPE_BONUS, effectivenessOf, hasImmunity, typeMultiplier,
} from './types';
import { CARD_DEFS, cardDef } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { ENEMY_DEFS } from '../data/enemies';

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
}

export interface EnemyState extends Fighter {
  uid: number;
  defId: string;
  intent: EnemyMove;
  history: string[];
  shiny: boolean;
}

/** Cible d'un événement : le joueur, ou l'uid d'un ennemi. */
export type Who = 'player' | number;

export type CombatEvent =
  | { type: 'damage'; target: Who; amount: number; blocked: number; effectiveness: Effectiveness }
  | { type: 'hp-loss'; target: Who; amount: number; source: StatusId | 'carte' }
  | { type: 'block'; target: Who; amount: number }
  | { type: 'heal'; target: Who; amount: number }
  | { type: 'status'; target: Who; status: StatusId; stacks: number }
  | { type: 'aura'; amount: number }
  | { type: 'enemy-move'; uid: number; name: string }
  | { type: 'player-move'; name: string }
  | { type: 'break'; target: Who }
  | { type: 'power'; power: PowerId; amount: number }
  | { type: 'ko'; target: Who };

export type Phase = 'joueur' | 'ennemi' | 'victoire' | 'defaite';

export interface CombatOptions {
  character: CharacterId;
  deck: Card[];
  enemies: string[];
  seed: string;
  hp?: number;
}

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
    amount: Math.floor(dmg + 1e-9),
    effectiveness: effectivenessOf(mult, hasImmunity(type, defender.types)),
  };
}

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
  private lastPlayed: CardDef | null = null;

  constructor(opts: CombatOptions) {
    this.rng = new Rng(opts.seed);
    const ch = CHARACTERS[opts.character];
    this.player = {
      character: ch.id, name: ch.name, dex: ch.dex[0], types: [...ch.types],
      hp: opts.hp ?? ch.maxHp, maxHp: ch.maxHp, block: 0, statuses: {},
      energy: BASE_ENERGY, maxEnergy: BASE_ENERGY, aura: 0,
      powers: {}, freeTurn: false, hpLostEnemyTurn: 0,
    };
    this.enemies = opts.enemies.map((id) => this.spawnEnemy(id));
    this.drawPile = this.rng.shuffle([...opts.deck]);
    // Cartes Innées en haut de la pioche
    this.drawPile.sort((a, b) => Number(this.has(a, 'innee')) - Number(this.has(b, 'innee')));

    // Talents de départ
    if (ch.id === 'riolu') this.gainAura(3);
    if (ch.id === 'caninos') for (const e of this.enemies) this.addStatus(e, e.uid, 'attaque', -1);

    for (const e of this.enemies) this.rollIntent(e);
    this.startPlayerTurn();
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
    return this.player.freeTurn ? 0 : this.def(card).cost;
  }

  canPlay(card: Card): boolean {
    if (this.phase !== 'joueur') return false;
    const d = this.def(card);
    if (d.keywords?.includes('injouable')) return false;
    return this.costOf(card) <= this.player.energy;
  }

  /** Dégâts de base d'une carte avant types et statuts (Aura comprise), ou null si elle n'attaque pas. */
  private baseDamage(d: CardDef): number | null {
    const p = this.player;
    for (const e of d.effects) {
      switch (e.kind) {
        case 'degats': {
          const mult = d.effects.find((x): x is Extract<Effect, { kind: 'aura-mult' }> => x.kind === 'aura-mult');
          let base = e.amount;
          if (e.facade && this.hasBadStatus()) base *= 2;
          if (e.revanche && p.hpLostEnemyTurn > 0) base *= 2;
          return base + p.aura * (mult ? mult.amount : 1);
        }
        case 'degats-aura':
          return p.aura * e.mult;
        case 'degats-pv-perdus':
          return e.amount + Math.floor((p.maxHp - p.hp) / e.per) + p.aura;
        case 'tout-ou-rien':
          return p.hp - 1;
      }
    }
    return null;
  }

  /** Dégâts affichés sur une carte (contre la cible si elle est donnée). */
  previewCardDamage(card: Card, targetUid?: number): number | null {
    const d = this.def(card);
    const base = this.baseDamage(d);
    if (base === null) return null;
    const target = targetUid !== undefined ? this.enemy(targetUid) : undefined;
    if (!target) {
      // Sans cible : bonus de type et statuts du joueur seulement
      let dmg = Math.max(0, base + (this.player.statuses.attaque ?? 0));
      if (this.player.types.includes(d.pokeType)) dmg *= SAME_TYPE_BONUS;
      if ((this.player.statuses.paralysie ?? 0) > 0) dmg *= 0.75;
      if ((this.player.statuses.brulure ?? 0) > 0) dmg *= 0.75;
      return Math.floor(dmg + 1e-9);
    }
    return computeDamage(base, this.player, target, d.pokeType).amount;
  }

  private hasBadStatus(): boolean {
    const s = this.player.statuses;
    return (s.brulure ?? 0) > 0 || (s.poison ?? 0) > 0 || (s.paralysie ?? 0) > 0;
  }

  /** Dégâts par coup annoncés par l'intention d'un ennemi. */
  previewIntentDamage(e: EnemyState): number | null {
    if (e.intent.damage === undefined) return null;
    return computeDamage(e.intent.damage, e, this.player, e.intent.pokeType ?? 'normal').amount;
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

    this.player.energy -= this.costOf(card);
    this.hand.splice(idx, 1);

    this.cardAuraUsed = false;
    for (const eff of d.effects) {
      if (this.phase !== 'joueur') break;
      this.resolve(eff, d, target);
    }
    if (!d.effects.some((e) => e.kind === 'copie')) this.lastPlayed = d;

    // Talents et cartes Épuisées quittent le combat
    if (d.category === 'talent' || d.keywords?.includes('epuisee')) this.exhaustPile.push(card);
    else this.discardPile.push(card);

    this.checkEnd();
    return true;
  }

  endPlayerTurn(): void {
    if (this.phase !== 'joueur') return;
    for (const c of this.hand) {
      const d = this.def(c);
      if (d.keywords?.includes('conservee')) continue;
      if (d.keywords?.includes('ephemere')) this.exhaustPile.push(c);
      else this.discardPile.push(c);
    }
    this.hand = this.hand.filter((c) => this.def(c).keywords?.includes('conservee'));
    this.tickDurations(this.player);
    this.phase = 'ennemi';
    this.player.freeTurn = false;
    this.player.hpLostEnemyTurn = 0;
    for (const e of this.aliveEnemies()) e.block = 0;
  }

  /** Fait agir un ennemi (appelé un par un par l'interface, pour animer). */
  enemyAct(uid: number): void {
    const e = this.enemy(uid);
    if (this.phase !== 'ennemi' || !e || e.hp <= 0) return;
    this.tickDots(e, uid);
    if (e.hp <= 0) return this.checkEnd();

    if ((e.statuses.sommeil ?? 0) > 0) {
      e.statuses.sommeil! -= 1;
      this.events.push({ type: 'enemy-move', uid, name: 'Dort…' });
    } else {
      const m = e.intent;
      this.events.push({ type: 'enemy-move', uid, name: m.name });
      if (m.block) this.gainBlock(e, uid, m.block);
      if (m.damage !== undefined) {
        for (let i = 0; i < (m.hits ?? 1) && this.phase === 'ennemi'; i++) {
          const { amount, effectiveness } = computeDamage(m.damage, e, this.player, m.pokeType ?? 'normal');
          this.dealDamage(this.player, 'player', amount, effectiveness);
        }
      }
      if (m.playerStatus && this.phase === 'ennemi') this.addStatus(this.player, 'player', m.playerStatus.status, m.playerStatus.stacks);
      if (m.selfStatus) this.addStatus(e, uid, m.selfStatus.status, m.selfStatus.stacks);
      e.history.push(m.id);
    }
    this.tickDurations(e);
    this.rollIntent(e);
  }

  endEnemyTurn(): void {
    if (this.phase !== 'ennemi') return;
    this.startPlayerTurn();
  }

  // ——— Interne ———

  private spawnEnemy(id: string): EnemyState {
    const d = ENEMY_DEFS[id];
    if (!d) throw new Error(`Ennemi inconnu : ${id}`);
    const hp = this.rng.int(d.hp[0], d.hp[1]);
    return {
      uid: this.nextEnemyUid++, defId: id, name: d.name, dex: d.dex, types: [...d.types],
      hp, maxHp: hp, block: 0, statuses: {}, intent: d.moves[0], history: [],
      shiny: this.rng.next() < SHINY_CHANCE,
    };
  }

  /** Choix pondéré, sans jamais répéter la même action 3 fois de suite. */
  private rollIntent(e: EnemyState): void {
    const moves = ENEMY_DEFS[e.defId].moves;
    const [a, b] = e.history.slice(-2);
    const allowed = a !== undefined && a === b ? moves.filter((m) => m.id !== a) : moves;
    e.intent = this.rng.weighted(allowed.length ? allowed : moves);
  }

  private startPlayerTurn(): void {
    this.turn++;
    this.phase = 'joueur';
    this.player.block = 0;
    this.player.energy = this.player.maxEnergy;
    this.tickDots(this.player, 'player');
    if (this.player.hp <= 0) return this.checkEnd();
    const pw = this.player.powers;
    if (pw.plenitude) this.gainAura(pw.plenitude);
    if (pw['lire-esprit'] && this.player.aura >= 30) {
      this.player.freeTurn = true;
      this.events.push({ type: 'player-move', name: 'Énergie illimitée !' });
    }
    this.draw(HAND_SIZE);
  }

  draw(n: number): void {
    for (let i = 0; i < n; i++) {
      if (this.hand.length >= MAX_HAND) return;
      if (this.drawPile.length === 0) {
        if (this.discardPile.length === 0) return;
        this.drawPile = this.rng.shuffle(this.discardPile);
        this.discardPile = [];
      }
      this.hand.push(this.drawPile.pop()!);
    }
  }

  private has(card: Card, kw: NonNullable<CardDef['keywords']>[number]): boolean {
    return this.def(card).keywords?.includes(kw) ?? false;
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
  private strike(t: EnemyState, base: number, type: PokeType): number {
    const before = t.hp;
    const { amount, effectiveness } = computeDamage(base, this.player, t, type);
    this.dealDamage(t, t.uid, amount, effectiveness);
    return before - t.hp;
  }

  /** Applique un effet de carte. */
  private resolve(eff: Effect, d: CardDef, target: EnemyState | undefined): void {
    const p = this.player;
    switch (eff.kind) {
      case 'degats': {
        const hits = eff.hitsMax ? this.rng.int(eff.hits ?? 1, eff.hitsMax) : (eff.hits ?? 1);
        let base = eff.amount;
        if (eff.facade && this.hasBadStatus()) base *= 2;
        if (eff.revanche && p.hpLostEnemyTurn > 0) base *= 2;
        let dealt = 0;
        for (let i = 0; i < hits && this.phase === 'joueur'; i++) {
          const targets = this.targetsFor(d, target);
          if (!targets.length) break;
          const bonus = this.takeAura();
          for (const t of targets) dealt += this.strike(t, base + bonus, d.pokeType);
        }
        if (eff.drain) this.healPlayer(Math.floor(dealt / 2));
        return;
      }
      case 'degats-aura': {
        const t = this.targetsFor(d, target)[0];
        const aura = p.aura;
        if (eff.consume !== false) this.takeAura();
        else this.cardAuraUsed = true; // ne consomme pas, mais ne s'ajoute pas une deuxième fois
        if (t) this.strike(t, aura * eff.mult, d.pokeType);
        return;
      }
      case 'degats-pv-perdus': {
        const t = this.targetsFor(d, target)[0];
        const base = eff.amount + Math.floor((p.maxHp - p.hp) / eff.per) + this.takeAura();
        if (t) this.strike(t, base, d.pokeType);
        return;
      }
      case 'tout-ou-rien': {
        const t = this.targetsFor(d, target)[0];
        const base = p.hp - 1;
        if (t) this.strike(t, base, d.pokeType);
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
        for (const [f, who] of list) this.addStatus(f, who, eff.status, eff.stacks);
        return;
      }
      case 'casse-protection':
        if (target && target.block > 0) {
          target.block = 0;
          this.events.push({ type: 'break', target: target.uid });
        }
        return;
      case 'pioche':
        this.draw(eff.amount);
        return;
      case 'pa':
        p.energy += eff.amount;
        return;
      case 'perte-pv':
        this.loseHp(p, 'player', eff.amount, 'carte');
        return;
      case 'aura':
        this.gainAura(eff.amount);
        return;
      case 'aura-mult':
        this.gainAura(p.aura * (eff.amount - 1));
        return;
      case 'soin':
        this.healPlayer(eff.amount);
        return;
      case 'pouvoir':
        p.powers[eff.power] = (p.powers[eff.power] ?? 0) + eff.amount;
        this.events.push({ type: 'power', power: eff.power, amount: p.powers[eff.power]! });
        return;
      case 'copie': {
        const last = this.lastPlayed;
        if (!last) return;
        this.events.push({ type: 'player-move', name: `Photocopie : ${last.name}` });
        for (const e of last.effects) if (this.phase === 'joueur') this.resolve(e, last, target ?? this.aliveEnemies()[0]);
        return;
      }
      case 'metronome': {
        const pool = Object.values(CARD_DEFS).filter((c) =>
          c.character === p.character && c.category !== 'talent' && !c.effects.some((e) => e.kind === 'metronome' || e.kind === 'copie'));
        const pick = this.rng.pick(pool);
        this.events.push({ type: 'player-move', name: `Métronome : ${pick.name}` });
        const t = this.aliveEnemies().length ? this.rng.pick(this.aliveEnemies()) : undefined;
        for (const e of pick.effects) if (this.phase === 'joueur') this.resolve(e, pick, t);
        return;
      }
    }
  }

  private healPlayer(n: number): void {
    const heal = Math.min(n, this.player.maxHp - this.player.hp);
    if (heal <= 0) return;
    this.player.hp += heal;
    this.events.push({ type: 'heal', target: 'player', amount: heal });
  }

  private gainAura(n: number): void {
    if (this.player.character !== 'riolu' && this.player.character !== 'mew') return;
    this.player.aura += n;
    this.events.push({ type: 'aura', amount: this.player.aura });
  }

  private gainBlock(f: Fighter, who: Who, amount: number): void {
    let n = amount;
    if ((f.statuses.confusion ?? 0) > 0) n *= 0.75;
    n = Math.max(0, Math.floor(n));
    f.block += n;
    this.events.push({ type: 'block', target: who, amount: n });
  }

  private dealDamage(f: Fighter, who: Who, amount: number, effectiveness: Effectiveness): void {
    const blocked = Math.min(f.block, amount);
    f.block -= blocked;
    const rest = amount - blocked;
    this.events.push({ type: 'damage', target: who, amount: rest, blocked, effectiveness });
    if (rest > 0) this.applyHpLoss(f, who, rest);
  }

  /** Perte de PV qui ignore la Protection (statuts, cartes à contrecoup). */
  private loseHp(f: Fighter, who: Who, amount: number, source: StatusId | 'carte'): void {
    if (amount <= 0) return;
    this.events.push({ type: 'hp-loss', target: who, amount, source });
    this.applyHpLoss(f, who, amount);
  }

  private applyHpLoss(f: Fighter, who: Who, amount: number): void {
    const lost = Math.min(f.hp, amount);
    f.hp -= lost;
    if (who === 'player' && lost > 0) {
      this.gainAura(lost); // Aura : les PV perdus renforcent la prochaine attaque
      if (this.phase === 'ennemi') this.player.hpLostEnemyTurn += lost;
    }
    if (f.hp <= 0) {
      f.hp = 0;
      this.events.push({ type: 'ko', target: who });
      this.checkEnd();
    }
  }

  private addStatus(f: Fighter, who: Who, status: StatusId, stacks: number): void {
    let s = stacks;
    // Contestation (Vipélierre) : ses baisses de stats deviennent des hausses, et inversement
    if (who === 'player' && this.player.character === 'vipelierre' && (status === 'attaque' || status === 'defense')) s = -s;
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
      this.loseHp(f, who, n, s);
      if (s === 'vampigraine' && who !== 'player') {
        this.healPlayer(Math.floor(n / 2));
      }
      if (n - 1 <= 0) delete f.statuses[s];
      else f.statuses[s] = n - 1;
    }
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
    else if (this.aliveEnemies().length === 0) this.phase = 'victoire';
  }
}

/** Crée les cartes d'un deck de départ. */
export function makeDeck(defIds: string[]): Card[] {
  return defIds.map((defId, i) => ({ uid: i + 1, defId, upgraded: false }));
}
