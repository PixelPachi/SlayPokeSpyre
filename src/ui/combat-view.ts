// Écran de combat : affichage, glisser-déposer des cartes, animations des chiffres.
import { Combat, type CombatEvent, type EnemyState, type Fighter, type Who } from '../core/combat';
import type { Card, PowerId, StatusId } from '../core/model';
import { TYPE_LABELS, type PokeType } from '../core/types';
import type { Run } from '../core/run';
import { renderCard } from './card';
import { POWER_INFO, STATUS_INFO, TYPE_COLORS, cardText } from './labels';
import { openDeckOverlay, topbar } from './run-ui';
import { relicDef } from '../data/relics';
import { asset, esc, sleep } from './util';

const ENEMY_STEP_MS = 700;
/** Fonds de zone déjà testés (vrai = l'image existe). */
const BG_LOADED = new Map<string, boolean>();

export interface CombatResult {
  victory: boolean;
  hp: number;
  /** Ennemis chromatiques vaincus (Pokédollars doublés). */
  shinies: number;
}

export class CombatView {
  private combat: Combat;
  private selected: number | null = null; // uid de la carte choisie
  private hoverEnemy: number | null = null;
  private busy = false;
  private el: HTMLElement;
  private fx: HTMLElement;
  private drag: { uid: number; startX: number; startY: number; mode: 'pending' | 'aim' | 'carry'; ghost?: HTMLElement; arrow?: SVGSVGElement } | null = null;

  constructor(
    private root: HTMLElement,
    private run: Run,
    private opts: { seed: string; enemies: string[]; label: string },
    private onEnd: (r: CombatResult) => void,
  ) {
    this.combat = new Combat({
      character: run.character, deck: run.deck, enemies: opts.enemies, seed: opts.seed,
      hp: run.hp, maxHp: run.maxHp, relics: run.relics,
    });
    this.combat.drainEvents();
    // Le décor (fond + particules) reste en place pendant tout le combat : les animations ne redémarrent pas
    const z = run.zone;
    root.style.setProperty('--ground', z.palette[1]);
    root.innerHTML = `
      <div class="scene ${z.act >= 2 ? 'cave' : ''} ${BG_LOADED.get(z.background) ? 'has-bg' : ''}"
           style="--sky:${z.palette[0]};--ground:${z.palette[1]};--shade:${z.palette[2]};--bg:url('${asset(z.background)}')">
        <div class="trees"></div>
        <div class="weather weather-${z.weather}">${weatherParticles(z.weather)}</div>
      </div>
      <div class="combat"></div><div class="fx-layer"></div>`;
    this.el = root.querySelector('.combat')!;
    this.fx = root.querySelector('.fx-layer')!;
    this.bind();
    this.render();
    // Le fond Gemini de la zone remplace le décor de secours dès qu'il existe
    const bg = this.run.zone.background;
    if (!BG_LOADED.has(bg)) {
      const img = new Image();
      img.onload = () => {
        BG_LOADED.set(bg, true);
        this.root.querySelector('.scene')?.classList.add('has-bg');
      };
      img.onerror = () => BG_LOADED.set(bg, false);
      img.src = asset(bg);
    }
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
  }

  // ——— Rendu ———

  private render(): void {
    const c = this.combat;
    const p = c.player;
    const targeting = false;

    this.el.innerHTML = `
      ${topbar(this.run, `${this.opts.label} · tour ${c.turn}`, p.hp)}
      <div class="field">
        <div class="fighter player" data-who="player">
          ${this.statusRow(p, true)}
          <div class="platform"></div>
          <img class="sprite player-sprite" src="${asset(`sprites/pokemon/front/${p.dex}.png`)}" alt="${esc(p.name)}">
          ${this.hpBar(p)}
        </div>
        ${p.familiar ? this.babyHtml(p.familiar) : ''}
        <div class="enemies">
          ${c.enemies.map((e) => this.enemyHtml(e, targeting)).join('')}
        </div>
      </div>
      <div class="hud">
        <div class="energy ${p.energy === 0 ? 'empty' : ''}" data-tip="Points d'Action (PA) : chaque carte coûte des PA. Rechargés à chaque tour.">
          <span>${p.energy}/${p.maxEnergy}</span><small>PA</small>
        </div>
        <div class="pile draw" data-tip="Pioche : ${c.drawPile.length} carte(s). Quand elle est vide, la défausse est mélangée.">
          <span>${c.drawPile.length}</span><small>Pioche</small>
        </div>
        <div class="hand">${c.hand.map((card, i) => this.cardHtml(card, i, c.hand.length)).join('')}</div>
        <div class="pile discard" data-tip="Défausse : ${c.discardPile.length} carte(s).">
          <span>${c.discardPile.length}</span><small>Défausse</small>
        </div>
        <button class="end-turn" ${c.phase !== 'joueur' || this.busy ? 'disabled' : ''}>${c.phase === 'ennemi' ? 'Tour ennemi…' : 'Fin du tour <kbd>E</kbd>'}</button>
      </div>
      ${c.phase === 'victoire' || c.phase === 'defaite' ? this.endOverlay() : ''}
    `;
  }

  /** Le Bébé Kangourex, à côté de sa mère. */
  private babyHtml(f: import('../core/combat').Familiar): string {
    if (f.hp <= 0) return '<div class="fighter bebe dead" data-who="bebe"><span class="bebe-ko">Bébé K.O.</span></div>';
    const pct = (f.hp / f.maxHp) * 100;
    return `
      <div class="fighter bebe" data-who="bebe" data-tip="<b>Bébé Kangourex</b><br>Attaque à la fin de ton tour (Puissance ${f.power}). Les ennemis peuvent le viser. S'il est K.O., Kangourex gagne Attaque +2.">
        <div class="bebe-power">Puissance ${f.power}</div>
        <img class="sprite bebe-sprite" src="${asset('sprites/pokemon/bebe-kangourex-v2.png')}" alt="Bébé">
        <div class="hpbar small">
          ${f.block > 0 ? `<div class="block-badge">${f.block}</div>` : ''}
          <div class="hp-track"><div class="hp-fill" style="width:${pct}%;background:var(--hp-green)"></div></div>
          <div class="hp-text">${f.hp}/${f.maxHp}</div>
        </div>
      </div>`;
  }

  private hpBar(f: Fighter): string {
    const pct = Math.max(0, (f.hp / f.maxHp) * 100);
    const color = pct > 50 ? 'var(--hp-green)' : pct > 20 ? 'var(--hp-yellow)' : 'var(--hp-red)';
    return `
      <div class="hpbar">
        ${f.block > 0 ? `<div class="block-badge" data-tip="Protection : absorbe les dégâts avant les PV. Disparaît au début de ton tour.">${f.block}</div>` : ''}
        <div class="hp-track ${f.block > 0 ? 'shielded' : ''}"><div class="hp-fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="hp-text">${f.hp}/${f.maxHp}</div>
      </div>`;
  }

  private typeBadges(types: PokeType[]): string {
    return types.map((t) => `<span class="type-badge" style="background:${TYPE_COLORS[t]}">${TYPE_LABELS[t]}</span>`).join('');
  }

  private statusRow(f: Fighter, isPlayer: boolean): string {
    const items: string[] = [];
    if (isPlayer && this.combat.player.aura > 0) {
      const a = this.combat.player.aura;
      items.push(`<span class="status aura" data-tip="Aura : ta prochaine attaque inflige +${a} dégâts, puis l'Aura retombe à 0. Chaque PV perdu donne 1 Aura.">Aura ${a}</span>`);
    }
    if (isPlayer) {
      for (const [k, v] of Object.entries(this.combat.player.powers) as [PowerId, number][]) {
        const info = POWER_INFO[k];
        items.push(`<span class="status power" data-tip="<b>Talent — ${esc(info.label)}</b><br>${esc(info.text(v))}">${info.label}</span>`);
      }
      if (this.combat.player.freeTurn) items.push('<span class="status free" data-tip="Lire-Esprit : tes cartes coûtent 0 PA ce tour.">0 PA !</span>');
    }
    for (const [k, v] of Object.entries(f.statuses) as [StatusId, number][]) {
      if (!v) continue;
      const info = STATUS_INFO[k];
      const n = k === 'attaque' || k === 'defense' ? (v > 0 ? `+${v}` : `−${-v}`) : `${v}`;
      items.push(`<span class="status" style="--c:${info.color}" data-tip="${esc(info.label)} : ${esc(info.text(v))}">${info.label} ${n}</span>`);
    }
    return `
      <div class="nameplate">
        <span class="fname">${esc(f.name)}</span>${this.typeBadges(f.types)}
      </div>
      <div class="statuses">${items.join('')}</div>`;
  }

  private enemyHtml(e: EnemyState, targeting: boolean): string {
    if (e.hp <= 0) return `<div class="fighter enemy dead" data-who="${e.uid}"></div>`;
    const sprite = e.shiny ? `sprites/pokemon/shiny/${e.dex}.png` : `sprites/pokemon/front/${e.dex}.png`;
    return `
      <div class="fighter enemy ${targeting ? 'targetable' : ''} ${this.hoverEnemy === e.uid && targeting ? 'hovered' : ''}" data-who="${e.uid}">
        ${this.intentHtml(e)}
        ${this.statusRow(e, false)}
        <div class="platform"></div>
        <img class="sprite front" src="${asset(sprite)}" alt="${esc(e.name)}">
        ${e.shiny ? '<span class="shiny-star" data-tip="Chromatique ! Rapportera le double de Pokédollars.">★</span>' : ''}
        ${this.hpBar(e)}
      </div>`;
  }

  private intentHtml(e: EnemyState): string {
    const m = e.intent;
    const dmg = this.combat.previewIntentDamage(e);
    let label = '';
    let tip = esc(m.name);
    if (m.intent === 'attaque') {
      label = `${dmg}${m.hits && m.hits > 1 ? `×${m.hits}` : ''}`;
      tip += ` : attaque ${m.pokeType ? TYPE_LABELS[m.pokeType] : ''} de ${label} dégâts`;
      if (m.playerStatus) tip += ` et ${m.playerStatus.stacks} ${STATUS_INFO[m.playerStatus.status].label}`;
    } else if (m.intent === 'defense') {
      label = `${m.block}`;
      tip += ` : gagne ${m.block} Protection`;
    } else if (m.intent === 'handicap' && m.playerStatus) {
      tip += ` : t'applique ${m.playerStatus.stacks} ${STATUS_INFO[m.playerStatus.status].label}`;
    } else if (m.intent === 'boost') {
      const parts = [m.selfStatus ? `${STATUS_INFO[m.selfStatus.status].label} +${m.selfStatus.stacks}` : '', m.block ? `${m.block} Protection` : ''].filter(Boolean);
      tip += ` : se renforce (${parts.join(', ')})`;
    }
    const color = m.pokeType ? TYPE_COLORS[m.pokeType] : '#888';
    return `
      <div class="intent intent-${m.intent}" data-tip="${tip}" style="--tc:${color}">
        ${INTENT_ICONS[m.intent]}<span>${label}</span>
      </div>`;
  }

  private cardHtml(card: Card, i: number, n: number): string {
    const c = this.combat;
    const d = c.def(card);
    const playable = c.canPlay(card);
    const base = d.effects.find((e) => e.kind === 'degats');
    const target = this.selected === card.uid && this.hoverEnemy !== null ? this.hoverEnemy : undefined;
    const dmg = c.previewCardDamage(card, target);
    const mid = (n - 1) / 2;
    return renderCard(d, {
      uid: card.uid,
      classes: `${playable ? 'playable' : 'unplayable'} ${this.selected === card.uid ? 'selected' : ''}`,
      style: `--rot:${(i - mid) * 4}deg;--lift:${Math.abs(i - mid) * 6}px`,
      text: cardText(d, dmg, base && base.kind === 'degats' ? base.amount : null),
      stab: c.player.types.includes(d.pokeType),
      cost: c.costOf(card),
      costTooHigh: c.costOf(card) > c.player.energy,
    });
  }

  private endOverlay(): string {
    const win = this.combat.phase === 'victoire';
    return `
      <div class="overlay">
        <div class="panel">
          <h2>${win ? 'Victoire !' : 'K.O.…'}</h2>
          <p>${win ? `${esc(this.combat.player.name)} remporte le combat avec ${this.combat.player.hp} PV.` : `${esc(this.combat.player.name)} est tombé au combat. La run est terminée.`}</p>
          <button class="btn primary next">${win ? 'Continuer' : 'Voir le bilan'}</button>
        </div>
      </div>`;
  }

  // ——— Événements visuels ———

  private whoEl(who: Who): HTMLElement | null {
    return this.el.querySelector(`.fighter[data-who="${who}"]`);
  }

  private showEvents(events: CombatEvent[]): void {
    const offsets = new Map<string, number>();
    const at = (who: Who) => {
      const k = String(who);
      const o = offsets.get(k) ?? 0;
      offsets.set(k, o + 1);
      return o;
    };
    for (const ev of events) {
      switch (ev.type) {
        case 'damage': {
          const o = at(ev.target);
          if (ev.blocked > 0) this.float(ev.target, `${ev.blocked}`, 'blocked', o);
          if (ev.amount > 0 || ev.blocked === 0) this.float(ev.target, `-${ev.amount}`, 'dmg', o);
          if (ev.effectiveness === 'super') this.float(ev.target, 'Super efficace !', 'eff super', o);
          if (ev.effectiveness === 'faible') this.float(ev.target, 'Pas très efficace…', 'eff weak', o);
          if (ev.effectiveness === 'immunite') this.float(ev.target, "Peu d'effet…", 'eff weak', o);
          if (ev.amount > 0) this.shake(ev.target);
          break;
        }
        case 'hp-loss':
          this.float(ev.target, `-${ev.amount}`, `dmg ${ev.source}`, at(ev.target));
          this.shake(ev.target);
          break;
        case 'block':
          this.float(ev.target, `+${ev.amount}`, 'block', at(ev.target));
          break;
        case 'heal':
          this.float(ev.target, `+${ev.amount}`, 'heal', at(ev.target));
          break;
        case 'status': {
          const info = STATUS_INFO[ev.status];
          const n = ev.status === 'attaque' || ev.status === 'defense' ? (ev.stacks > 0 ? ` +${ev.stacks}` : ` −${-ev.stacks}`) : '';
          this.float(ev.target, `${info.label}${n}`, 'status', at(ev.target), info.color);
          break;
        }
        case 'enemy-move': {
          const el = this.whoEl(ev.uid);
          el?.classList.add('lunge');
          this.float(ev.uid, ev.name, 'move', 0);
          break;
        }
        case 'ko':
          this.whoEl(ev.target)?.classList.add('fainting');
          break;
        case 'player-move':
          this.float('player', ev.name, 'move', 0);
          break;
        case 'break':
          this.float(ev.target, 'Protection brisée !', 'eff weak', at(ev.target));
          break;
        case 'power':
          this.float('player', POWER_INFO[ev.power].label, 'status', at('player'), '#c9a6ff');
          break;
        case 'relic': {
          this.float('player', relicDef(ev.id).name, 'status', at('player'), '#ffe08a');
          const icon = this.el.querySelector(`.tb-relics [data-relic="${ev.id}"]`);
          icon?.classList.remove('pulse');
          void (icon as HTMLElement | null)?.offsetWidth;
          icon?.classList.add('pulse');
          break;
        }
        case 'aura':
          break;
      }
    }
  }

  private float(who: Who, text: string, cls: string, offset: number, color?: string): void {
    const target = this.whoEl(who)?.querySelector('.sprite') ?? this.whoEl(who);
    if (!target) return;
    const stage = this.root.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    const scale = stage.width / this.root.offsetWidth;
    const div = document.createElement('div');
    div.className = `float ${cls}`;
    div.textContent = text;
    if (color) div.style.color = color;
    div.style.left = `${(r.left + r.width / 2 - stage.left) / scale + (offset % 2 ? 26 : -10) * Math.min(offset, 2)}px`;
    div.style.top = `${(r.top + r.height * 0.3 - stage.top) / scale - offset * 26}px`;
    this.fx.appendChild(div);
    setTimeout(() => div.remove(), 1300);
  }

  private shake(who: Who): void {
    const s = this.whoEl(who)?.querySelector('.sprite');
    if (!s) return;
    s.classList.remove('hit');
    void (s as HTMLElement).offsetWidth;
    s.classList.add('hit');
  }

  // ——— Actions ———

  private refresh(): void {
    const events = this.combat.drainEvents();
    this.render();
    this.showEvents(events);
  }

  private tryPlay(uid: number, targetUid?: number): void {
    if (this.busy) return;
    const card = this.combat.hand.find((x) => x.uid === uid);
    if (!card || !this.combat.canPlay(card)) {
      this.flashEnergy();
      return;
    }
    this.selected = null;
    this.hoverEnemy = null;
    const isAttack = this.combat.def(card).category === 'attaque';
    this.combat.play(uid, targetUid);
    this.refresh();
    if (isAttack) this.whoEl('player')?.classList.add('lunge'); // petit pas en avant vers les ennemis
  }

  /** Met à jour la cible survolée sans tout redessiner (garde le glisser fluide). */
  private updateHover(): void {
    this.el.querySelectorAll<HTMLElement>('.enemy').forEach((e) =>
      e.classList.toggle('hovered', Number(e.dataset.who) === this.hoverEnemy));
    const card = this.combat.hand.find((x) => x.uid === this.selected);
    const txt = this.el.querySelector(`.card[data-uid="${this.selected}"] .card-text > span`);
    if (!card || !txt) return;
    const d = this.combat.def(card);
    const base = d.effects.find((e) => e.kind === 'degats');
    const target = this.hoverEnemy ?? undefined;
    txt.innerHTML = cardText(d, this.combat.previewCardDamage(card, target), base && base.kind === 'degats' ? base.amount : null);
  }

  private flashEnergy(): void {
    const e = this.el.querySelector('.energy');
    e?.classList.remove('flash');
    void (e as HTMLElement | null)?.offsetWidth;
    e?.classList.add('flash');
  }

  private async endTurn(): Promise<void> {
    const c = this.combat;
    if (this.busy || c.phase !== 'joueur') return;
    this.cancelDrag();
    this.busy = true;
    this.selected = null;
    c.endPlayerTurn();
    this.refresh();
    for (const e of c.aliveEnemies()) {
      await sleep(ENEMY_STEP_MS);
      if ((c.phase as string) !== 'ennemi') break;
      c.enemyAct(e.uid);
      this.refresh();
    }
    await sleep(ENEMY_STEP_MS * 0.6);
    c.endEnemyTurn();
    this.busy = false;
    this.refresh();
  }

  // ——— Entrées : les cartes se jouent uniquement en les tirant ———
  // Carte qui vise un ennemi : une flèche part de la carte, on relâche sur la cible.
  // Autres cartes (protections, techniques, talents) : on tire la carte vers le haut, dans le terrain.

  private onKey = (ev: KeyboardEvent): void => {
    if (this.combat.phase === 'victoire' || this.combat.phase === 'defaite') return;
    if (ev.key === 'e' || ev.key === 'E') return void this.endTurn();
    if (ev.key === 'Escape') this.cancelDrag();
  };

  private stagePoint(ev: PointerEvent): { x: number; y: number } {
    const r = this.root.getBoundingClientRect();
    const scale = r.width / this.root.offsetWidth;
    return { x: (ev.clientX - r.left) / scale, y: (ev.clientY - r.top) / scale };
  }

  private enemyAt(ev: PointerEvent): HTMLElement | null {
    for (const h of document.elementsFromPoint(ev.clientX, ev.clientY)) {
      const f = (h as HTMLElement).closest?.('.enemy:not(.dead)') as HTMLElement | null;
      if (f) return f;
    }
    return null;
  }

  private startDrag(uid: number, ev: PointerEvent): void {
    const card = this.combat.hand.find((x) => x.uid === uid);
    const cardEl = this.el.querySelector<HTMLElement>(`.card[data-uid="${uid}"]`);
    if (!card || !cardEl || !this.drag) return;
    if (!this.combat.canPlay(card)) {
      this.flashEnergy();
      this.drag = null;
      return;
    }
    this.selected = uid;
    const d = this.combat.def(card);
    if (d.target === 'ennemi') {
      this.drag.mode = 'aim';
      cardEl.classList.add('aiming');
      this.el.querySelectorAll('.enemy:not(.dead)').forEach((e) => e.classList.add('targetable'));
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'aim-arrow');
      svg.setAttribute('width', '1280');
      svg.setAttribute('height', '720');
      svg.innerHTML = '<path class="aim-shadow"/><path class="aim-line"/><polygon class="aim-head"/>';
      this.fx.appendChild(svg);
      this.drag.arrow = svg;
    } else {
      this.drag.mode = 'carry';
      const ghost = cardEl.cloneNode(true) as HTMLElement;
      ghost.classList.add('ghost');
      ghost.classList.remove('selected');
      this.fx.appendChild(ghost);
      cardEl.classList.add('dragging');
      this.drag.ghost = ghost;
      this.el.querySelector('.field')?.classList.add('drop-zone');
    }
    this.onPointerMove(ev);
  }

  private drawArrow(ev: PointerEvent): void {
    const d = this.drag;
    if (!d?.arrow) return;
    const cardEl = this.el.querySelector<HTMLElement>(`.card[data-uid="${d.uid}"]`);
    if (!cardEl) return;
    const r = this.root.getBoundingClientRect();
    const scale = r.width / this.root.offsetWidth;
    const cr = cardEl.getBoundingClientRect();
    const sx = (cr.left + cr.width / 2 - r.left) / scale;
    const sy = (cr.top - r.top) / scale + 10;
    const { x: ex, y: ey } = this.stagePoint(ev);
    const cx = (sx + ex) / 2;
    const cy = Math.min(sy, ey) - 110;
    const path = `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`;
    d.arrow.querySelector('.aim-line')!.setAttribute('d', path);
    d.arrow.querySelector('.aim-shadow')!.setAttribute('d', path);
    const ang = Math.atan2(ey - cy, ex - cx);
    const pt = (a: number, len: number) => `${ex + Math.cos(a) * len},${ey + Math.sin(a) * len}`;
    d.arrow.querySelector('.aim-head')!.setAttribute('points', `${pt(ang, 14)} ${pt(ang + 2.5, 22)} ${pt(ang - 2.5, 22)}`);
  }

  private onPointerMove = (ev: PointerEvent): void => {
    const d = this.drag;
    if (!d) return;
    if (d.mode === 'pending') {
      if (Math.hypot(ev.clientX - d.startX, ev.clientY - d.startY) > 10) this.startDrag(d.uid, ev);
      return;
    }
    if (d.mode === 'carry' && d.ghost) {
      const p = this.stagePoint(ev);
      d.ghost.style.left = `${p.x - 75}px`;
      d.ghost.style.top = `${p.y - 105}px`;
      d.ghost.classList.toggle('will-play', p.y < PLAY_LINE);
    }
    if (d.mode === 'aim') {
      this.drawArrow(ev);
      const over = this.enemyAt(ev);
      const uid = over ? Number(over.dataset.who) : null;
      d.arrow?.classList.toggle('locked', uid !== null);
      if (uid !== this.hoverEnemy) {
        this.hoverEnemy = uid;
        this.updateHover();
      }
    }
  };

  private onPointerUp = (ev: PointerEvent): void => {
    const d = this.drag;
    if (!d) return;
    if (d.mode === 'pending') {
      this.drag = null;
      return;
    }
    const uid = d.uid;
    const over = d.mode === 'aim' ? this.enemyAt(ev) : null;
    const y = this.stagePoint(ev).y;
    this.cancelDrag(false);
    if (d.mode === 'aim' && over) return this.tryPlay(uid, Number(over.dataset.who));
    if (d.mode === 'carry' && y < PLAY_LINE) return this.tryPlay(uid);
    this.render();
  };

  /** Annule le glisser en cours (la carte revient dans la main). */
  private cancelDrag(redraw = true): void {
    if (!this.drag) return;
    this.drag.ghost?.remove();
    this.drag.arrow?.remove();
    this.drag = null;
    this.selected = null;
    this.hoverEnemy = null;
    if (redraw) this.render();
  }

  private bind(): void {
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);

    this.el.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0 || this.busy || this.combat.phase !== 'joueur') return;
      const cardEl = (ev.target as HTMLElement).closest<HTMLElement>('.hand .card');
      if (!cardEl) return;
      ev.preventDefault();
      this.drag = { uid: Number(cardEl.dataset.uid), startX: ev.clientX, startY: ev.clientY, mode: 'pending' };
    });

    this.el.addEventListener('click', (ev) => {
      const t = ev.target as HTMLElement;
      if (t.closest('.end-turn')) return void this.endTurn();
      if (t.closest('.next')) {
        return this.onEnd({
          victory: this.combat.phase === 'victoire',
          hp: this.combat.player.hp,
          shinies: this.combat.enemies.filter((e) => e.shiny).length,
        });
      }
      if (t.closest('.tb-deck')) return openDeckOverlay(this.root, { title: 'Ton deck' }, this.run);
    });

    this.el.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      this.cancelDrag();
    });
  }
}

/** Au-dessus de cette ligne, une carte tirée est jouée. */
const PLAY_LINE = 470;
const INTENT_ICONS: Record<string, string> = {
  attaque: '<svg viewBox="0 0 24 24"><path d="M14.5 2.5l7 7-9.5 9.5-2-2-3.5 3.5-2.5-.5-.5-2.5L7 14l-2-2z" fill="var(--tc)" stroke="#1b1b1b" stroke-width="1.5"/></svg>',
  defense: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="#4c8dff" stroke="#1b1b1b" stroke-width="1.5"/></svg>',
  handicap: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#9b59d0" stroke="#1b1b1b" stroke-width="1.5"/><path d="M12 7a5 5 0 1 1-5 5 3 3 0 1 1 3 3" fill="none" stroke="#fff" stroke-width="2"/></svg>',
  boost: '<svg viewBox="0 0 24 24"><path d="M12 3l8 9h-5v9H9v-9H4z" fill="#ff9b4a" stroke="#1b1b1b" stroke-width="1.5"/></svg>',
  inconnu: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#777" stroke="#1b1b1b" stroke-width="1.5"/><text x="12" y="17" font-size="13" text-anchor="middle" fill="#fff">?</text></svg>',
};

/** Particules de saison : pollen, pétales, feuilles d'automne ou neige. Positions fixes (même rendu à chaque fois). */
function weatherParticles(kind: string): string {
  const count = kind === 'neige' || kind === 'cendres' ? 46 : kind === 'gouttes' ? 40 : kind === 'pollen' || kind === 'poussiere' ? 26 : 22;
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = (i * 37 + 11) % 100;
    const delay = -((i * 1.7) % 14);
    const dur = 9 + ((i * 2.3) % 7);
    const size = 0.6 + ((i * 7) % 10) / 10;
    out += `<i style="left:${x}%;animation-delay:${delay.toFixed(1)}s;animation-duration:${dur.toFixed(1)}s;--s:${size.toFixed(2)}"></i>`;
  }
  return out;
}
