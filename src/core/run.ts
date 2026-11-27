import type { PokeType } from './types';
import { primordialTypes, skinDef } from '../data/skins';
// État d'une run : carte de l'acte, deck, PV, Pokédollars (sections 3 et 6 du GDD).
import type { Form, Card, CardDef, CharacterId, DuoSide } from './model';

/** Rappels vers l'interface (Duo : choisir qui tient un nouvel objet). */
export const runHooks: { relicPicked?: (run: Run, id: string) => void } = {};
import { Rng } from './rng';
import { BERRIES, MAX_BERRIES } from '../data/berries';
import { allCards, CARD_DEFS, cardDef, enchantId, neutralPool, rewardPool, rollEnchant } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { type ZoneDef, ZONES, zonesOfAct } from '../data/zones';
import { allRelics, type RelicRarity } from '../data/relics';

export type NodeType = 'combat' | 'evenement' | 'centre' | 'boutique' | 'elite' | 'tresor' | 'coffre' | 'pension' | 'ct' | 'boss';

export interface MapNode {
  row: number;
  col: number;
  type: NodeType;
  /** Colonnes des nœuds reliés à l'étage du dessus. */
  next: number[];
  /** Petit décalage visuel pour un tracé moins rigide. */
  dx: number;
  dy: number;
}

export const MAP_ROWS = 15;
export const MAP_COLS = 7;
const PATHS = 6;
export const BOSS_ROW = MAP_ROWS;
/** Dernier acte : le sommet de la Tour du Temps (acte 4), avec Dialga Primal. */
export const LAST_ACT = 4;
/** PA de départ et maximum (les reliques de gardien donnent +1 PA chacune). */
export const BASE_PA = 3;
export const MAX_PA = 5;
/** Acte secret après Dialga (Rouage du Temps + Rouage de l'Espace) : la Salle Originelle, avec Arceus. */
export const SECRET_ACT = 5;
/** Étages de la carte de l'acte secret (plus courte que les autres). */
export const SECRET_ROWS = 8;
/** Le sommet n'a pas de carte : Noctunoir, un Centre Pokémon, le Marché Kecleon, puis Dialga Primal. */
export const SUMMIT_STEPS = ['elite', 'centre', 'boutique', 'boss'] as const;

/** Parts du GDD (le trésor et le Centre Pokémon d'avant-boss sont placés à part). */
const WEIGHTS: [NodeType, number][] = [
  ['combat', 40], ['evenement', 20], ['centre', 11], ['boutique', 5], ['elite', 8], ['coffre', 6], ['pension', 4], ['ct', 4],
];

/** Carte à embranchements façon Slay the Spire : chemins qui montent sans se croiser. */
export function generateMap(rng: Rng, ROWS = MAP_ROWS): MapNode[][] {
  const grid: (MapNode | null)[][] = Array.from({ length: ROWS }, () => Array(MAP_COLS).fill(null));
  const edges: [number, number, number][] = []; // [rang, colonne de départ, colonne d'arrivée]
  const node = (r: number, c: number) =>
    (grid[r][c] ??= { row: r, col: c, type: 'combat', next: [], dx: rng.int(-16, 16), dy: rng.int(-10, 10) });

  let firstStart = -1;
  for (let p = 0; p < PATHS; p++) {
    let c = rng.int(0, MAP_COLS - 1);
    if (p === 1) while (c === firstStart) c = rng.int(0, MAP_COLS - 1); // au moins 2 départs différents
    if (p === 0) firstStart = c;
    node(0, c);
    for (let r = 0; r < ROWS - 1; r++) {
      const options = [c - 1, c, c + 1].filter((n) => n >= 0 && n < MAP_COLS).filter(
        (n) => !edges.some(([er, a, b]) => er === r && ((a < c && b > n) || (a > c && b < n))),
      );
      const n = options.length ? rng.pick(options) : c;
      if (!edges.some(([er, a, b]) => er === r && a === c && b === n)) edges.push([r, c, n]);
      const from = node(r, c);
      if (!from.next.includes(n)) from.next.push(n);
      node(r + 1, n);
      c = n;
    }
  }

  const rows = grid.map((row) => row.filter((n): n is MapNode => n !== null));
  const parents = (n: MapNode) => (n.row === 0 ? [] : rows[n.row - 1].filter((p) => p.next.includes(n.col)));

  let chests = 0;
  for (const row of rows) {
    for (const n of row) {
      if (n.row === 0) n.type = 'combat';
      else if (n.row === (ROWS === MAP_ROWS ? 8 : Math.floor(ROWS / 2))) n.type = 'tresor';
      else if (n.row === ROWS - 1) n.type = 'centre';
      else {
        for (let tries = 0; tries < 30; tries++) {
          const t = rng.weighted(WEIGHTS.map(([type, weight]) => ({ type, weight }))).type;
          if ((t === 'elite' || t === 'centre') && n.row < (ROWS === MAP_ROWS ? 5 : 2)) continue; // pas avant le 6e étage
          if ((t === 'pension' || t === 'ct') && n.row < 3) continue;
          if (t === 'coffre' && chests >= 2) continue; // 2 coffres au plus par acte
          if (t === 'centre' && n.row === ROWS - 2) continue; // le 15e est déjà un Centre
          if ((t === 'centre' || t === 'boutique' || t === 'elite' || t === 'coffre' || t === 'pension' || t === 'ct') && parents(n).some((p) => p.type === t)) continue;
          n.type = t;
          if (t === 'coffre') chests++;
          break;
        }
      }
    }
  }
  for (const row of rows) row.sort((a, b) => a.col - b.col);
  return rows;
}

export class Run {
  readonly rng: Rng;
  readonly character: CharacterId;
  hp: number;
  maxHp: number;
  money = 99;
  deck: Card[] = [];
  map: MapNode[][];
  act = 1;
  /** Zone de l'acte en cours, tirée au hasard. */
  zone: ZoneDef;
  /** Nœud actuel (null avant le premier étage ; row = BOSS_ROW pour le gardien). */
  pos: { row: number; col: number } | null = null;
  visited: string[] = [];
  removals = 0; // nombre de cartes oubliées au Marché Kecleon (le prix monte)
  elitesDefeated = 0;
  bossesDefeated = 0;
  /** Pour le détail de l'EXP en fin de run. */
  combatsWon = 0;
  /** Skin du personnage (ex. « shiny »). */
  skin?: string;
  duelsWon = 0;
  bossNames: string[] = [];
  bossIds: string[] = [];
  /** Chances qu'un « ? » cache autre chose qu'un événement (augmentent à chaque fois que ça n'arrive pas). */
  qFight = 0.1;
  qTreasure = 0.02;
  qShop = 0.03;
  /** Ennemis du dernier combat (pour l'historique). */
  lastEnemies: string[] = [];
  /** Dominants déjà affrontés : on évite de retomber sur le même. */
  elitesMet: string[] = [];
  /** Objets de départ des skins débloqués, trouvables par tous les Pokémon. */
  sharedRelics?: string[];
  /** Plus grosse réserve de Pokédollars de la run (objectif du skin Flambeur). */
  maxMoney = 0;
  /** Cartes débloquées par tous les Pokémon (skins qui ouvrent des cartes d'autres types). */
  extraUnlocked?: string[];
  /** Pokémon mis K.O. par type pendant la run (objectifs de skins). */
  typeKills: Partial<Record<PokeType, number>> = {};
  eventsSeen = 0;
  shiniesMet = 0;
  /** Objets tenus (le premier est l'objet de départ). */
  relics: string[] = [];
  private nextUid = 1;
  private rareBonus = 0; // la chance de rare monte à chaque récompense sans rare

  /** Applique le skin équipé : sprite, et (plus tard) deck / objet tenu de départ propres au skin. */
  applySkin(skin: string | undefined, def?: { deck?: string[]; relic?: string; firstCard?: string; extraCards?: string[] }): void {
    this.skin = skin;
    const ch = CHARACTERS[this.character];
    if (def?.deck?.length) { this.deck = []; for (const id of def.deck) this.addCard(id); }
    if (def?.relic) this.relics = [def.relic, ...this.relics.filter((r) => r !== ch.starterRelic)];
    if (def?.firstCard && this.deck.length) this.deck[0] = { ...this.deck[0], defId: def.firstCard, upgraded: false };
    for (const id of def?.extraCards ?? []) this.addCard(id);
  }

  /** Cartes débloquées par l'EXP du Pokémon (undefined = toutes). */
  constructor(
    readonly seed: string, character: CharacterId, readonly unlocked?: string[],
    /** Objets débloqués par le niveau du Pokémon (les objets communs sont toujours disponibles). */
    readonly unlockedRelics: string[] = [],
  ) {
    this.rng = new Rng(seed);
    this.character = character;
    const ch = CHARACTERS[character];
    this.hp = this.maxHp = ch.maxHp;
    for (const id of ch.starterDeck) this.addCard(id);
    if (ch.starterRelic) this.relics.push(ch.starterRelic);
    if (character === 'duo') this.duoHp = { posipi: ch.maxHp / 2, negapi: ch.maxHp / 2 };
    this.zone = this.rng.pick(zonesOfAct(this.act));
    this.map = generateMap(this.rng);
  }

  /** Gardien de la zone pour cette run : le gardien habituel ou un autre possible (Reshiram à la Tour Dragospire…). */
  get bossId(): string {
    const z = this.zone;
    const all = [z.boss, ...(z.altBosses ?? [])];
    if (all.length === 1) return z.boss;
    let h = 0;
    for (const ch of `${this.seed}:${z.id}`) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return all[Math.abs(h) % all.length];
  }

  /** Étage de la tour, compté depuis la base (16 étages par acte, gardien compris). */
  get floor(): number {
    if (this.act === LAST_ACT) return (this.act - 1) * (MAP_ROWS + 1) + this.summitStep;
    if (this.act > LAST_ACT) return (LAST_ACT - 1) * (MAP_ROWS + 1) + SUMMIT_STEPS.length + (this.pos ? this.pos.row + 1 : 0);
    return (this.act - 1) * (MAP_ROWS + 1) + (this.pos ? this.pos.row + 1 : 0);
  }

  /** Lignée d'évolution (un skin peut la remplacer, ex. Arcanâme). */
  get evolutions() {
    return skinDef(this.character, this.skin)?.evolutions ?? CHARACTERS[this.character].evolutions ?? [];
  }

  /** Stade d'évolution actuel (le Pokémon évolue au début de certains actes). */
  /** Tisserand de Soie Astrale : plusieurs enchantements par carte. */
  /** Flambeur (Quelorior) : -50 % au Marché Kecleon. */
  get gambler(): boolean { return this.character === 'quelorior' && this.skin === 'flambeur'; }

  get weaver(): boolean { return this.character === 'vipelierre' && this.skin === 'tisserand'; }

  get form(): Form {
    if (this.duoFused) return { dex: 9311, name: 'Multipi', types: ['electrik'] };
    const ch = CHARACTERS[this.character];
    const evo = this.evolutions.filter((e) => e.act <= this.act).pop();
    const f = evo ? { dex: evo.dex, name: evo.name, types: evo.types } : { dex: ch.dex[0], name: ch.name, types: ch.types };
    const sk = skinDef(this.character, this.skin);
    if (sk?.types) return { ...f, types: [...sk.types] };
    return sk?.addDragon ? { ...f, types: primordialTypes(f.types) } : f;
  }

  /** Évolution qui vient d'avoir lieu en entrant dans cet acte. */
  get justEvolved(): { from: Form; to: Form } | null {
    const ch = CHARACTERS[this.character];
    const evos = this.evolutions;
    const i = evos.findIndex((e) => e.act === this.act);
    if (i < 0) return null;
    const prev = i > 0 ? evos[i - 1] : null;
    return {
      from: prev ? { dex: prev.dex, name: prev.name, types: prev.types } : { dex: ch.dex[0], name: ch.name, types: ch.types },
      to: { dex: evos[i].dex, name: evos[i].name, types: evos[i].types },
    };
  }

  /** Une carte d'un autre Pokémon ou neutre (Le Monde). Les cartes de Vipélierre restent possibles : sans sa
   *  Contestation, leurs baisses de stats te pénalisent (c'est le risque). Seules celles du Bébé sont exclues. */
  foreignCard(): string {
    const pool = this.offerable(allCards().filter((c) => c.rarity !== 'depart' && c.character !== this.character
      && !c.effects.some((e) => e.kind.startsWith('bebe-') && this.character !== 'kangourex')));
    return this.rng.pick(pool).id;
  }

  /** Baies portées (3 emplacements au plus). */
  berries: string[] = [];
  /** Kecleon a été attaqué : les Marchés Kecleon suivants sont vides. */
  kecleonHostile = false;
  /** Dialga apaisé avec au moins 3 Pokémon : les Rouages du Temps et de l'Espace peuvent apparaître. */
  cogsUnlocked = false;
  /** Acte dont la cinématique d'ouverture (fondu au noir) a déjà été jouée. */
  introAct = 0;
  /** Première case de l'acte 1 : l'accueil de la Guilde (Grodoudou et Pijako), d'où partent tous les chemins. */
  welcomeDone = false;
  /** L'accueil reste à faire (vieilles sauvegardes : déjà fait si la run a avancé). */
  get needsWelcome(): boolean { return this.act === 1 && !this.welcomeDone && !this.pos && this.visited.length === 0; }
  /** Combats restants avec l'Encens Zen (ennemis à 1 PV). */
  zenFights = 0;
  /** Vrai si le joueur possède les deux Rouages (l'acte secret s'ouvre après Dialga). */
  get hasCogs(): boolean { return this.relics.includes('rouage-temps') && this.relics.includes('rouage-espace'); }

  /** Ajoute une baie si un emplacement est libre ; renvoie false sinon. */
  addBerry(id: string): boolean {
    if (this.berries.length >= MAX_BERRIES) return false;
    this.berries.push(id);
    return true;
  }

  /** Baies trouvées alors que le sac est plein : le joueur choisira laquelle jeter (comme les potions de Slay the Spire). */
  pendingBerries: string[] = [];

  /** Donne une baie : dans le sac, ou en attente de choix si le sac est plein. Renvoie true si elle est déjà rangée. */
  giveBerry(id: string): boolean {
    if (this.addBerry(id)) return true;
    this.pendingBerries.push(id);
    return false;
  }

  /** Tire une baie (65 % commune, 30 % peu commune, 5 % rare). */
  rollBerry(): string {
    const r = this.rng.next();
    const want = r < 0.65 ? 'commune' : r < 0.95 ? 'peu-commune' : 'rare';
    const mine = BERRIES.filter((x) => x.character === this.character && !x.noDrop);
    if (mine.length && this.rng.next() < 0.2) return this.rng.pick(mine).id;
    return this.rng.pick(BERRIES.filter((x) => x.rarity === want && !x.character && !x.noDrop)).id;
  }

  /** Événements déjà vus pendant cette run (on ne retombe pas deux fois sur le même arcane). */
  seenEvents: string[] = [];

  /** Étape atteinte au sommet (0 = pas encore commencé). */
  summitStep = 0;

  /** Le joueur est entré dans le nœud actuel sans l'avoir terminé (on le rouvre à la reprise). */
  inNode = false;

  /** Sauvegarde : tout l'état de la run en données simples. */
  toJSON(): Record<string, unknown> {
    const { rng, zone, ...rest } = this as unknown as Record<string, unknown> & { rng: Rng; zone: ZoneDef };
    return { ...rest, zoneId: zone.id, rngState: rng.snapshot, version: 1 };
  }

  /** Reprend une run sauvegardée. */
  static fromJSON(data: Record<string, unknown>): Run {
    const { zoneId, rngState, version: _v, ...rest } = data as Record<string, unknown> & { zoneId: string; rngState: number; version: number };
    const run = new Run(String(rest.seed), rest.character as CharacterId, rest.unlocked as string[] | undefined, rest.unlockedRelics as string[]);
    Object.assign(run, rest);
    run.zone = ZONES.find((z) => z.id === zoneId) ?? run.zone;
    run.rng.snapshot = rngState;
    return run;
  }

  /** Passe à l'acte suivant : nouvelle zone, nouvelle carte, PV restaurés. */
  nextAct(): void {
    this.act++;
    const evo = this.evolutions.find((e) => e.act === this.act);
    if (evo) this.maxHp += evo.hp;
    this.zone = this.rng.pick(zonesOfAct(this.act));
    // Acte secret (Salle Originelle) : une carte plus courte
    this.map = generateMap(this.rng, this.act > LAST_ACT ? SECRET_ROWS : MAP_ROWS);
    this.pos = null;
    this.visited = [];
    // Duo : Posipi et Négapi gagnent chacun 3 PV max par acte, et un partenaire K.O. se relève
    if (this.duoHp) { this.maxHp += 6; this.duoHp = { posipi: this.duoMax, negapi: this.duoMax }; }
    else if (this.duoFused) this.maxHp += 6;
    this.hp = this.maxHp;
  }

  nodeAt(row: number, col: number): MapNode | undefined {
    return this.map[row]?.find((n) => n.col === col);
  }

  /** Nœuds où l'on peut aller maintenant. */
  available(): MapNode[] | 'boss' {
    if (this.needsWelcome) return [];
    if (!this.pos) return this.map[0];
    if (this.pos.row === this.map.length - 1) return 'boss';
    if (this.pos.row === BOSS_ROW) return [];
    const here = this.nodeAt(this.pos.row, this.pos.col)!;
    return this.map[this.pos.row + 1].filter((n) => here.next.includes(n.col));
  }

  moveTo(row: number, col: number): void {
    this.pos = { row, col };
    this.visited.push(`${row}-${col}`);
  }

  /** Ce que cache un nœud « ? » : un combat surprise, un trésor, le Marché noir… ou un vrai événement. */
  rollMystery(): 'combat' | 'tresor' | 'marche-noir' | 'evenement' {
    const x = this.rng.next();
    let out: 'combat' | 'tresor' | 'marche-noir' | 'evenement' = 'evenement';
    if (x < this.qFight) out = 'combat';
    else if (x < this.qFight + this.qTreasure) out = 'tresor';
    else if (x < this.qFight + this.qTreasure + this.qShop) out = 'marche-noir';
    this.qFight = out === 'combat' ? 0.1 : Math.min(0.6, this.qFight + 0.1);
    this.qTreasure = out === 'tresor' ? 0.02 : Math.min(0.2, this.qTreasure + 0.02);
    this.qShop = out === 'marche-noir' ? 0.03 : Math.min(0.2, this.qShop + 0.03);
    return out;
  }

  /** Enchante une carte du deck (enchantement au hasard parmi ceux qui lui conviennent). Renvoie l'enchantement. */
  enchantCard(uid: number): string | null {
    const c = this.deck.find((x) => x.uid === uid);
    if (!c || (c.defId.startsWith('ench:') && !this.weaver)) return null;
    const d = cardDef(c.defId, c.upgraded);
    const k = rollEnchant(d, () => this.rng.next(), d.enchants ?? []);
    if (!k) return null;
    c.defId = enchantId(k, c.defId);
    return k;
  }

  addCard(defId: string, upgraded = false): Card {
    const c = { uid: this.nextUid++, defId, upgraded };
    this.deck.push(c);
    return c;
  }

  removeCard(uid: number): void {
    this.deck = this.deck.filter((c) => c.uid !== uid);
  }

  upgradeCard(uid: number): void {
    const c = this.deck.find((x) => x.uid === uid);
    if (c) c.upgraded = true;
  }

  heal(n: number): number {
    if (this.duoHp) return this.duoHeal(n);
    const h = Math.min(n, this.maxHp - this.hp);
    this.hp += h;
    return h;
  }

  /** Duo fusionné (Pointeau ADN) : Multipi. */
  duoFused = false;

  /** Fusion au Centre Pokémon : PV réunis, objets regroupés, cartes de départ fusionnées. */
  fuseDuo(): void {
    if (!this.duoHp || this.duoFused) return;
    this.syncDuo();
    this.hp = Math.max(1, this.duoHp.posipi + this.duoHp.negapi);
    this.duoHp = null;
    this.relicOwner = {};
    this.duoFused = true;
    // Éclair Plus et Bouclier deviennent des Éclair Pôle X (cartes violettes : attaque + défense)
    for (const c of this.deck) if (c.defId === 'duo-eclair' || c.defId === 'duo-bouclier') c.defId = 'duo-fusion-eclair';
  }

  /** Duo : PV de Posipi et Négapi (0 = K.O.), et qui porte chaque objet tenu. */
  duoHp: Record<DuoSide, number> | null = null;
  relicOwner: Record<string, DuoSide> = {};
  get duoMax(): number { return Math.floor(this.maxHp / 2); }

  /** Remet d'accord les PV du Duo avec `hp` (soins ou dégâts appliqués ailleurs) : un K.O. ne se relève pas ici. */
  syncDuo(): void {
    const d = this.duoHp;
    if (!d) return;
    const max = this.duoMax;
    let delta = this.hp - (d.posipi + d.negapi);
    const sides: DuoSide[] = ['posipi', 'negapi'];
    if (delta > 0) {
      for (const s of [...sides].sort((a, b) => d[a] - d[b])) {
        if (d[s] <= 0) continue;
        const g = Math.min(delta, max - d[s]);
        d[s] += g; delta -= g;
      }
    } else if (delta < 0) {
      for (const s of sides) { const l = Math.min(-delta, Math.max(0, d[s] - 1)); d[s] -= l; delta += l; }
    }
    for (const s of sides) d[s] = Math.min(max, Math.max(0, d[s]));
    this.hp = d.posipi + d.negapi;
  }

  /** Soin du Duo (Centre Pokémon, événements) : partagé entre les deux, relève un partenaire K.O. */
  private duoHeal(n: number): number {
    this.syncDuo();
    const d = this.duoHp!, max = this.duoMax;
    let left = n;
    const order: DuoSide[] = (['posipi', 'negapi'] as DuoSide[]).sort((a, b) => d[a] - d[b]);
    const half = Math.ceil(n / 2);
    for (const s of order) { const g = Math.min(half, max - d[s], left); d[s] += g; left -= g; }
    for (const s of order) { const g = Math.min(max - d[s], left); d[s] += g; left -= g; }
    this.hp = d.posipi + d.negapi;
    return n - left;
  }

  /** Une rareté tirée comme dans Slay the Spire (chances qui montent sans rare). */
  rollRarity(kind: 'combat' | 'elite' | 'boss' | 'boutique'): CardDef['rarity'] {
    // Cartes légendaires : surtout chez les gardiens (15 %), parfois chez les dominants (3 %)
    if (kind === 'boss') return this.rng.next() < 0.15 ? 'legendaire' : 'rare';
    if (kind === 'elite' && this.rng.next() < 0.03) return 'legendaire';
    // Chance fixe de carte rare : 3 % en combat, 25 % sur un Pokémon dominant (les gardiens donnent toujours des rares)
    const rare = kind === 'elite' ? 25 : kind === 'boutique' ? 6 : 3;
    const unc = kind === 'elite' ? 45 : 37;
    const r = this.rng.next() * 100;
    if (r < rare) return 'rare';
    return r < rare + unc ? 'peu-commune' : 'commune';
  }

  /** 3 cartes différentes à choisir. Chaque emplacement a 12 % de chances d'être une carte neutre. */
  cardChoices(kind: 'combat' | 'elite' | 'boss' | 'boutique', count = 3, neutralChance = kind === 'boutique' ? 0 : 0.12): string[] {
    let own = this.character === 'mew' ? mewPool(this.unlocked) : rewardPool(this.character, this.unlocked);
    // Skins qui ouvrent des cartes d'autres types : Chien de la Lanterne (toutes les cartes Spectre),
    // Tisserand de Soie Astrale (les cartes Psy et Ténèbres débloquées)
    const sk = skinDef(this.character, this.skin);
    if (sk?.typeCards?.length) {
      // (sans les cartes qui dépendent d'une mécanique d'un autre Pokémon : Bébé, Rage, Aura)
      const foreign = (c: CardDef) => c.effects.some((e) => e.kind.startsWith('bebe') || ['souvenir', 'invocation', 'aura', 'aura-mult', 'degats-aura', 'aura-protection', 'consomme-aura'].includes(e.kind)
        || ['protection-par-soi', 'perd-statut', 'pioche-par-soi', 'protection-aura'].includes(e.kind)
        || (e.kind === 'degats' && !!e.parSoi) || (e.kind === 'pouvoir' && ['rancune', 'turbo'].includes(e.power))
        || (e.kind === 'statut' && ['rage', 'elan'].includes((e as { status?: string }).status ?? '')));
      const names = new Set(own.map((c) => c.name));
      for (const c of allCards()) {
        if (!sk.typeCards.includes(c.pokeType) || c.rarity === 'depart' || c.character === this.character || foreign(c) || names.has(c.name)) continue;
        if (sk.typeCardsUnlocked && c.character !== 'normal' && !(this.extraUnlocked ?? []).includes(c.id)) continue;
        names.add(c.name); own = [...own, c];
      }
    }
    const out: string[] = [];
    for (let i = 0; i < count * 10 && out.length < count; i++) {
      const rarity = this.rollRarity(kind);
      const pool = this.offerable(this.character === 'mew' || this.character === 'quelorior' ? [...own, ...neutralPool()] : !own.length || this.rng.next() < neutralChance ? neutralPool() : own);
      let options = pool.filter((c) => c.rarity === rarity && !out.includes(c.id));
      // pas de légendaire disponible : on retombe sur une rare
      if (!options.length && rarity === 'legendaire') options = pool.filter((c) => c.rarity === 'rare' && !out.includes(c.id));
      const pick = options.length ? this.rng.pick(options) : this.rng.pick(pool.filter((c) => !out.includes(c.id) && c.rarity !== 'rare' && c.rarity !== 'legendaire'));
      if (pick) out.push(pick.id);
    }
    return out;
  }

  /** Cartes neutres vendues au Marché Kecleon. */
  /** Quelorior n'apprend aucune attaque : ses attaques viennent de Gribouille (et de Jackpot pour le Flambeur). */
  offerable<T extends { category: string; duoFusion?: boolean; duoSide?: string }>(pool: T[]): T[] {
    // Duo : les cartes de Multipi n'arrivent qu'après la fusion
    if (this.character === 'duo') return pool.filter((c) => !c.duoFusion || this.duoFused);
    return this.character === 'quelorior' ? pool.filter((c) => c.category !== 'attaque') : pool;
  }

  neutralChoices(count: number): string[] {
    const pool = this.offerable(neutralPool());
    const out: string[] = [];
    for (let i = 0; i < count * 10 && out.length < count; i++) {
      const rarity = this.rollRarity('boutique');
      const options = pool.filter((c) => c.rarity === rarity && !out.includes(c.id));
      const pick = options.length ? this.rng.pick(options) : this.rng.pick(pool.filter((c) => !out.includes(c.id)));
      if (pick) out.push(pick.id);
    }
    return out;
  }

  encounter(type: 'combat' | 'elite' | 'boss'): string[] {
    if (type === 'boss') return this.bossId.split('+');
    if (type === 'elite') {
      const met = this.elitesMet ?? (this.elitesMet = []);
      const fresh = this.zone.elites.filter((g) => !met.includes(g.join('+')));
      const last = met[met.length - 1];
      const pool = fresh.length ? fresh : this.zone.elites.filter((g) => g.join('+') !== last);
      const pick = this.rng.pick(pool.length ? pool : this.zone.elites);
      met.push(pick.join('+'));
      return [...pick];
    }
    return [...this.rng.pick(this.zone.encounters)];
  }

  moneyReward(type: 'combat' | 'elite' | 'boss', shinies: number): number {
    const [a, b] = type === 'boss' ? [95, 105] : type === 'elite' ? [25, 35] : [10, 20];
    const base = this.rng.int(a, b) * (shinies > 0 ? 2 : 1);
    return this.relics.includes('piece-rune') ? Math.floor(base * 1.5) : base;
  }

  /** Objets qu'on peut encore obtenir : communs + ceux du Pokémon débloqués, sans ceux déjà tenus. */
  relicPool(): string[] {
    return allRelics()
      .filter((r) => !(r.id === 'kangourexite' && this.character === 'kangourex' && this.skin && this.skin !== 'shiny'))
      .filter((r) => (r.shared && (this.sharedRelics ?? []).includes(r.id)) || r.rarity !== 'depart' && r.rarity !== 'gardien' && r.rarity !== 'quete' && (r.owner === 'commun' || (r.owner === this.character && (r.free || this.unlockedRelics.includes(r.id)))))
      .filter((r) => !this.relics.includes(r.id))
      .map((r) => r.id);
  }

  /** Gardien : 3 objets tenus au choix, dont au plus un qui donne des PA (et aucun si tu as déjà 5 PA). */
  bossRelicChoices(): string[] {
    const paOwned = this.relics.filter((id) => allRelics().find((r) => r.id === id)?.rarity === 'gardien').length;
    const out: string[] = [];
    if (BASE_PA + paOwned < MAX_PA) {
      const pa = allRelics().filter((r) => r.rarity === 'gardien' && !this.relics.includes(r.id)).map((r) => r.id);
      if (pa.length) out.push(this.rng.pick(pa));
    }
    // Avec le Nœud Destin, le gardien propose aussi sa version + (tisser des talents)
    if (this.relics.includes('noeud-destin') && !this.relics.includes('noeud-destin-plus')) out.push('noeud-destin-plus');
    // Duo : le Pointeau ADN (objet légendaire) peut tomber chez les gardiens
    if (this.character === 'duo' && !this.duoFused && !this.relics.includes('pointeau-adn') && this.rng.next() < 0.5) out.push('pointeau-adn');
    for (const id of this.rollRelics(6)) if (out.length < 3 && !out.includes(id)) out.push(id);
    return this.rng.shuffle ? this.rng.shuffle(out) : out;
  }

  /** Relique de gardien (+1 PA avec contrepartie) pas encore possédée ; sinon un objet normal. */
  rollBossRelic(): string {
    const pool = allRelics().filter((r) => r.rarity === 'gardien' && !this.relics.includes(r.id)).map((r) => r.id);
    return pool.length ? this.rng.pick(pool) : this.rollRelics(1)[0];
  }

  /** Tire des objets différents (50 % commun, 33 % peu commun, 17 % rare). */
  rollRelics(count: number): string[] {
    const out: string[] = [];
    const defs = allRelics();
    for (let i = 0; i < count * 10 && out.length < count; i++) {
      const pool = this.relicPool().filter((id) => !out.includes(id));
      if (!pool.length) break;
      const r = this.rng.next();
      const want: RelicRarity = r < 0.5 ? 'commun' : r < 0.83 ? 'peu-commun' : 'rare';
      const ofRarity = pool.filter((id) => defs.find((d) => d.id === id)!.rarity === want);
      out.push(this.rng.pick(ofRarity.length ? ofRarity : pool));
    }
    return out;
  }

  addRelic(id: string): void {
    if (this.relics.includes(id)) return;
    this.relics.push(id);
    // Duo : chaque objet tenu a un porteur, choisi à la récupération (Posipi par défaut)
    // (les objets de quête comme les Rouages ne se portent pas)
    if (this.duoHp && allRelics().find((r) => r.id === id)?.rarity !== 'quete') { this.relicOwner[id] = 'posipi'; runHooks.relicPicked?.(this, id); }
  }
}

export function cardPrice(defId: string): number {
  const d = CARD_DEFS[defId];
  const base = d.rarity === 'legendaire' ? 260 : d.rarity === 'rare' ? 150 : d.rarity === 'peu-commune' ? 75 : 50;
  return d.character === 'normal' ? Math.round(base * 1.2) : base; // cartes neutres un peu plus chères
}

/** Gène ancestral : Mew pioche ses récompenses parmi les cartes de tous les personnages
 *  (sauf celles du Bébé Kangourex et les baisses de stats que seule la Contestation de Vipélierre rend utiles). */
function mewPool(unlocked?: string[]): CardDef[] {
  return allCards().filter((c) => c.character !== 'normal' && c.rarity !== 'depart'
    && (!unlocked || unlocked.includes(c.id))
    && !c.effects.some((e) => e.kind.startsWith('bebe-')
      || (c.character === 'vipelierre' && e.kind === 'statut' && e.on === 'soi' && e.stacks < 0)));
}
