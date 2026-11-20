// Éléments communs aux écrans d'une run : barre du haut et fenêtre du deck.
import { BERRY_DEFS, MAX_BERRIES } from '../data/berries';
import type { Card } from '../core/model';
import type { Run } from '../core/run';
import { cardDef } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { relicDef } from '../data/relics';
import { asset } from './util';
import { renderCard } from './card';
import { esc } from './util';

export function topbar(run: Run, label: string, hp = run.hp): string {
  return `
    <div class="topbar">
      <span class="tb-name">${esc(run.form.name)}</span>
      <span class="tb-hp" data-tip="Points de vie">PV ${hp}/${run.maxHp}</span>
      <span class="tb-money" data-tip="Pokédollars : à dépenser au Marché Kecleon">${run.money} ₽</span>
      <span class="tb-zone">${esc(label)}</span>
      <span class="tb-floor" data-tip="Étage de la Tour du Temps">Étage ${run.floor}</span>
      <button class="tb-deck" data-tip="Voir ton deck">Deck ${run.deck.length}</button>
      <span class="tb-berries">${berrySlots(run)}</span>
      <span class="tb-relics">${run.relics.map((id) => relicIcon(id)).join('')}</span>
      <span class="tb-seed" data-tip="Même graine = même run">Graine ${esc(run.seed)}</span>
      <button class="tb-menu" data-tip="Menu : sauvegarder et quitter">☰</button>
    </div>`;
}

/** Les 3 emplacements de baies (cliquer une baie : voir son effet ou la jeter). */
export function berrySlots(run: Run): string {
  return Array.from({ length: MAX_BERRIES }, (_, i) => {
    const id = run.berries[i];
    if (!id) return '<span class="berry-slot empty" data-tip="Emplacement de baie vide"></span>';
    return `<button class="berry-slot" data-berry-index="${i}">${berryIcon(id)}</button>`;
  }).join('');
}

export function berryIcon(id: string, cls = ''): string {
  const b = BERRY_DEFS[id];
  return `<img class="berry-icon ${cls}" src="${asset(`sprites/items/${b.sprite}.png`)}" alt="${esc(b.name)}"
    data-tip="<b>${esc(b.name)}</b><br>${b.text ? esc(b.text) : '<i>Effet à venir.</i>'}">`;
}

/** Grand affichage d'une baie (récompense, boutique). */
export function berryCard(id: string, extra = ''): string {
  const b = BERRY_DEFS[id];
  return `
    <div class="relic-card berry-card rarity-${b.rarity}">
      <img src="${asset(`sprites/items/${b.sprite}.png`)}" alt="">
      <div><b>${esc(b.name)}</b><span>${b.text ? esc(b.text) : 'Effet à venir.'}</span>${extra}</div>
    </div>`;
}

/** Icône d'un objet tenu avec son infobulle. */
export function relicIcon(id: string, cls = ''): string {
  const r = relicDef(id);
  return `<img class="relic-icon ${cls}" data-relic="${id}" src="${asset(`sprites/items/${r.sprite}.png`)}" alt="${esc(r.name)}"
    data-tip="<b>${esc(r.name)}</b>${r.rarity === 'depart' ? ' (objet de départ)' : ''}<br>${esc(r.text)}">`;
}

/** Grand affichage d'un objet tenu (récompense, boutique, fin de run). */
export function relicCard(id: string, extra = ''): string {
  const r = relicDef(id);
  return `
    <div class="relic-card rarity-${r.rarity}" data-relic="${id}">
      <img src="${asset(`sprites/items/${r.sprite}.png`)}" alt="">
      <div><b>${esc(r.name)}</b><span>${esc(r.text)}</span>${extra}</div>
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
