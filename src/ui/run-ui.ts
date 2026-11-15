// Éléments communs aux écrans d'une run : barre du haut et fenêtre du deck.
import type { Card } from '../core/model';
import type { Run } from '../core/run';
import { cardDef } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { renderCard } from './card';
import { esc } from './util';

export function topbar(run: Run, label: string, hp = run.hp): string {
  return `
    <div class="topbar">
      <span class="tb-name">${esc(CHARACTERS[run.character].name)}</span>
      <span class="tb-hp" data-tip="Points de vie">PV ${hp}/${run.maxHp}</span>
      <span class="tb-money" data-tip="Pokédollars : à dépenser au Poké Mart">${run.money} ₽</span>
      <span class="tb-zone">${esc(label)}</span>
      <span class="tb-floor" data-tip="Étage de la Tour du Temps">Étage ${run.floor}</span>
      <button class="tb-deck" data-tip="Voir ton deck">Deck ${run.deck.length}</button>
      <span class="tb-seed" data-tip="Même graine = même run">Graine ${esc(run.seed)}</span>
    </div>`;
}

export interface DeckPickOptions {
  title: string;
  /** Cartes proposées (par défaut tout le deck). */
  cards?: Card[];
  /** Affiche la version améliorée (Centre Pokémon). */
  upgradePreview?: boolean;
  /** Sans `onPick`, la fenêtre sert juste à regarder. */
  onPick?: (uid: number) => void;
  cancelLabel?: string;
  onCancel?: () => void;
}

/** Fenêtre qui montre des cartes du deck ; un clic sur une carte la choisit. */
export function openDeckOverlay(host: HTMLElement, o: DeckPickOptions, run: Run): void {
  const cards = [...(o.cards ?? run.deck)].sort((a, b) => cardDef(a.defId).name.localeCompare(cardDef(b.defId).name));
  const el = document.createElement('div');
  el.className = 'overlay deck-overlay';
  el.innerHTML = `
    <div class="deck-panel">
      <h2>${esc(o.title)}</h2>
      <div class="deck-grid">
        ${cards.map((c) => renderCard(cardDef(c.defId, c.upgraded || !!o.upgradePreview), { uid: c.uid, classes: o.onPick ? 'pickable' : '' })).join('')}
      </div>
      <button class="btn close">${esc(o.cancelLabel ?? 'Fermer')}</button>
    </div>`;
  host.appendChild(el);
  el.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    const card = t.closest<HTMLElement>('.card');
    if (card && o.onPick) {
      el.remove();
      return o.onPick(Number(card.dataset.uid));
    }
    if (t.closest('.close') || t === el) {
      el.remove();
      o.onCancel?.();
    }
  });
}
