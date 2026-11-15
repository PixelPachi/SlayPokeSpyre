// Écran de combat : affichage, glisser-déposer des cartes, animations des chiffres.
import { Combat, type CombatEvent, type EnemyState, type Fighter, type Who } from '../core/combat';
import type { Card, StatusId } from '../core/model';
import { TYPE_LABELS, type PokeType } from '../core/types';
import type { Run } from '../core/run';
import { renderCard } from './card';
import { STATUS_INFO, TYPE_COLORS, cardText } from './labels';
import { openDeckOverlay, topbar } from './run-ui';
import { asset, esc, sleep } from './util';

const ENEMY_STEP_MS = 700;

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
  private drag: { uid: number; startX: number; startY: number; moved: boolean; ghost?: HTMLElement } | null = null;

  constructor(
    private root: HTMLElement,
    private run: Run,
    private opts: { seed: string; enemies: string[]; label: string },
    private onEnd: (r: CombatResult) => void,
  ) {
    this.combat = new Combat({ character: run.character, deck: run.deck, enemies: opts.enemies, seed: opts.seed, hp: run.hp });
    this.combat.player.maxHp = run.maxHp;
    this.combat.drainEvents();
    root.innerHTML = '<div class="combat"></div><div class="fx-layer"></div>';
    this.el = root.querySelector('.combat')!;
    this.fx = root.querySelector('.fx-layer')!;
    this.bind();
    this.render();
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
    const selCard = this.selected !== null ? c.hand.find((x) => x.uid === this.selected) : undefined;
    const targeting = !!selCard && c.needsTarget(selCard);

    this.el.innerHTML = `
      ${topbar(this.run, `${this.opts.label} · tour ${c.turn}`, p.hp)}
      <div class="field">
        <div class="trees"></div>
        <div class="fighter player" data-who="player">
          ${this.statusRow(p, true)}
          <div class="platform"></div>
          <img class="sprite player-sprite" src="${asset(`sprites/pokemon/front/${p.dex}.png`)}" alt="${esc(p.name)}">
          ${this.hpBar(p)}
        </div>
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
      ${targeting ? '<div class="hint">Choisis une cible — clic droit ou Échap pour annuler</div>' : ''}
      ${c.phase === 'victoire' || c.phase === 'defaite' ? this.endOverlay() : ''}
    `;
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
    const target = this.selected === card.uid && this.hoverEnemy !== null ? this.hoverEnemy
      : c.aliveEnemies().length === 1 ? c.aliveEnemies()[0].uid : undefined;
    const dmg = c.previewCardDamage(card, target);
    const mid = (n - 1) / 2;
    return renderCard(d, {
      uid: card.uid,
      classes: `${playable ? 'playable' : 'unplayable'} ${this.selected === card.uid ? 'selected' : ''}`,
      style: `--rot:${(i - mid) * 4}deg;--lift:${Math.abs(i - mid) * 6}px`,
      text: cardText(d, dmg, base && base.kind === 'degats' ? base.amount : null),
      key: i < 9 ? String(i + 1) : i === 9 ? '0' : '',
      stab: c.player.types.includes(d.pokeType),
      costTooHigh: d.cost > c.player.energy,
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

  private select(uid: number): void {
    const c = this.combat;
    const card = c.hand.find((x) => x.uid === uid);
    if (!card) return;
    if (!c.canPlay(card)) return this.flashEnergy();
    if (this.selected === uid) {
      // Deuxième clic : jouer si aucune cible n'est nécessaire
      if (!c.needsTarget(card)) return this.tryPlay(uid);
      return;
    }
    this.selected = uid;
    if (!c.needsTarget(card) && c.def(card).target !== 'ennemi') {
      // Carte sans cible : un clic suffit
      return this.tryPlay(uid);
    }
    if (!c.needsTarget(card)) return this.tryPlay(uid, c.aliveEnemies()[0]?.uid);
    this.render();
  }

  /** Met à jour la cible survolée sans tout redessiner (garde les clics fiables). */
  private updateHover(): void {
    this.el.querySelectorAll<HTMLElement>('.enemy').forEach((e) =>
      e.classList.toggle('hovered', Number(e.dataset.who) === this.hoverEnemy && e.classList.contains('targetable')));
    const card = this.combat.hand.find((x) => x.uid === this.selected);
    const txt = this.el.querySelector(`.card[data-uid="${this.selected}"] .card-text > span`);
    if (!card || !txt) return;
    const d = this.combat.def(card);
    const base = d.effects.find((e) => e.kind === 'degats');
    const target = this.hoverEnemy ?? (this.combat.aliveEnemies().length === 1 ? this.combat.aliveEnemies()[0].uid : undefined);
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

  // ——— Entrées ———

  private onKey = (ev: KeyboardEvent): void => {
    if (this.combat.phase === 'victoire' || this.combat.phase === 'defaite') return;
    if (ev.key === 'e' || ev.key === 'E') return void this.endTurn();
    if (ev.key === 'Escape') {
      this.selected = null;
      return this.render();
    }
    const n = ev.key === '0' ? 10 : Number(ev.key);
    if (n >= 1 && n <= 10) {
      const card = this.combat.hand[n - 1];
      if (card) this.select(card.uid);
      return;
    }
    // Avec une carte ciblée choisie, les flèches ou Entrée visent le premier ennemi
    if (ev.key === 'Enter' && this.selected !== null) {
      const t = this.combat.aliveEnemies()[0];
      if (t) this.tryPlay(this.selected, t.uid);
    }
  };

  private stagePoint(ev: PointerEvent): { x: number; y: number } {
    const r = this.root.getBoundingClientRect();
    const scale = r.width / this.root.offsetWidth;
    return { x: (ev.clientX - r.left) / scale, y: (ev.clientY - r.top) / scale };
  }

  private onPointerMove = (ev: PointerEvent): void => {
    if (!this.drag) return;
    const d = this.drag;
    if (!d.moved && Math.hypot(ev.clientX - d.startX, ev.clientY - d.startY) > 12) {
      const cardEl = this.el.querySelector<HTMLElement>(`.card[data-uid="${d.uid}"]`);
      const card = this.combat.hand.find((x) => x.uid === d.uid);
      if (!cardEl || !card || !this.combat.canPlay(card)) {
        this.drag = null;
        if (card && !this.combat.canPlay(card)) this.flashEnergy();
        return;
      }
      d.moved = true;
      d.ghost = cardEl.cloneNode(true) as HTMLElement;
      d.ghost.classList.add('ghost');
      this.fx.appendChild(d.ghost);
      cardEl.classList.add('dragging');
      this.selected = d.uid;
    }
    if (d.moved && d.ghost) {
      const p = this.stagePoint(ev);
      d.ghost.style.left = `${p.x - 75}px`;
      d.ghost.style.top = `${p.y - 105}px`;
      const over = this.enemyAt(ev);
      this.el.querySelectorAll('.enemy').forEach((e) => e.classList.toggle('hovered', e === over));
      const uid = over ? Number(over.dataset.who) : null;
      if (uid !== this.hoverEnemy) {
        this.hoverEnemy = uid;
        const card = this.combat.hand.find((x) => x.uid === d.uid);
        if (card) {
          const dmg = this.combat.previewCardDamage(card, uid ?? undefined);
          const base = this.combat.def(card).effects.find((e) => e.kind === 'degats');
          const txt = d.ghost.querySelector('.card-text > span');
          if (txt) txt.innerHTML = cardText(this.combat.def(card), dmg, base && base.kind === 'degats' ? base.amount : null);
        }
      }
    }
  };

  private enemyAt(ev: PointerEvent): HTMLElement | null {
    const hit = document.elementsFromPoint(ev.clientX, ev.clientY);
    for (const h of hit) {
      const f = (h as HTMLElement).closest?.('.enemy:not(.dead)') as HTMLElement | null;
      if (f) return f;
    }
    return null;
  }

  private onPointerUp = (ev: PointerEvent): void => {
    const d = this.drag;
    this.drag = null;
    if (!d) return;
    if (!d.moved) return; // simple clic : géré par le clic
    d.ghost?.remove();
    const card = this.combat.hand.find((x) => x.uid === d.uid);
    if (!card) return this.render();
    const def = this.combat.def(card);
    const over = this.enemyAt(ev);
    const p = this.stagePoint(ev);
    if (def.target === 'ennemi') {
      if (over) return this.tryPlay(d.uid, Number(over.dataset.who));
      if (!this.combat.needsTarget(card) && p.y < 470) return this.tryPlay(d.uid, this.combat.aliveEnemies()[0]?.uid);
    } else if (p.y < 470) {
      return this.tryPlay(d.uid);
    }
    this.selected = null;
    this.hoverEnemy = null;
    this.render();
  };

  private bind(): void {
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);

    this.el.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0 || this.busy) return;
      const cardEl = (ev.target as HTMLElement).closest<HTMLElement>('.card');
      if (cardEl) this.drag = { uid: Number(cardEl.dataset.uid), startX: ev.clientX, startY: ev.clientY, moved: false };
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
      if (this.busy) return;
      const cardEl = t.closest<HTMLElement>('.card');
      if (cardEl && !cardEl.classList.contains('dragging')) return this.select(Number(cardEl.dataset.uid));
      const enemyEl = t.closest<HTMLElement>('.enemy:not(.dead)');
      if (enemyEl && this.selected !== null) return this.tryPlay(this.selected, Number(enemyEl.dataset.who));
      if (this.selected !== null) {
        this.selected = null;
        this.render();
      }
    });

    this.el.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      this.selected = null;
      this.hoverEnemy = null;
      this.render();
    });

    this.el.addEventListener('mouseover', (ev) => {
      if (this.selected === null || this.drag) return;
      const enemyEl = (ev.target as HTMLElement).closest<HTMLElement>('.enemy:not(.dead)');
      const uid = enemyEl ? Number(enemyEl.dataset.who) : null;
      if (uid !== this.hoverEnemy) {
        this.hoverEnemy = uid;
        this.updateHover();
      }
    });
  }
}

const INTENT_ICONS: Record<string, string> = {
  attaque: '<svg viewBox="0 0 24 24"><path d="M14.5 2.5l7 7-9.5 9.5-2-2-3.5 3.5-2.5-.5-.5-2.5L7 14l-2-2z" fill="var(--tc)" stroke="#1b1b1b" stroke-width="1.5"/></svg>',
  defense: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="#4c8dff" stroke="#1b1b1b" stroke-width="1.5"/></svg>',
  handicap: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#9b59d0" stroke="#1b1b1b" stroke-width="1.5"/><path d="M12 7a5 5 0 1 1-5 5 3 3 0 1 1 3 3" fill="none" stroke="#fff" stroke-width="2"/></svg>',
  boost: '<svg viewBox="0 0 24 24"><path d="M12 3l8 9h-5v9H9v-9H4z" fill="#ff9b4a" stroke="#1b1b1b" stroke-width="1.5"/></svg>',
  inconnu: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#777" stroke="#1b1b1b" stroke-width="1.5"/><text x="12" y="17" font-size="13" text-anchor="middle" fill="#fff">?</text></svg>',
};
