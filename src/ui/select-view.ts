// Écran de sélection du personnage (section 9 du GDD : illustration plein écran + fiche à gauche).
import type { CharacterId } from '../core/model';
import { TYPE_LABELS } from '../core/types';
import { cardDef } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { TYPE_COLORS } from './labels';
import { asset, esc } from './util';

const ORDER: CharacterId[] = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew'];
const UNLOCKED: CharacterId[] = ['riolu'];
const ILLUSTRATIONS: Partial<Record<CharacterId, string>> = {
  riolu: 'illustrations/riolu.png',
  vipelierre: 'illustrations/vipelierre.png',
  kangourex: 'illustrations/kangourex.png',
  caninos: 'illustrations/caninos.png',
};
const UNLOCK_TEXT: Record<CharacterId, string> = {
  riolu: '',
  vipelierre: "Battre le gardien de l'acte 1",
  kangourex: "Battre le gardien de l'acte 2",
  caninos: 'Atteindre le sommet de la tour',
  mew: '???',
};

export function renderSelect(root: HTMLElement, onStart: (c: CharacterId) => void): void {
  let current: CharacterId = 'riolu';

  const draw = () => {
    const ch = CHARACTERS[current];
    const locked = !UNLOCKED.includes(current);
    const ill = ILLUSTRATIONS[current];
    const deck = countDeck(ch.starterDeck);
    root.innerHTML = `
      <div class="select ${locked ? 'locked' : ''}">
        ${ill ? `<img class="select-bg" src="${asset(ill)}" alt="">` : '<div class="select-bg secret"></div>'}
        <div class="select-shade"></div>
        <h1 class="logo">SlayPoke<span>Spyre</span></h1>
        <div class="select-sheet">
          <div class="sheet-name">${locked && current === 'mew' ? '???' : esc(ch.name)}</div>
          <div class="sheet-types">${ch.types.map((t) => `<span class="type-badge" style="background:${TYPE_COLORS[t]}">${TYPE_LABELS[t]}</span>`).join('')}</div>
          ${locked ? `<p class="sheet-locked">Verrouillé<br><small>${esc(UNLOCK_TEXT[current])}</small></p>` : `
            <div class="sheet-row"><b>PV</b> ${ch.maxHp}</div>
            <div class="sheet-row"><b>Talent — ${esc(ch.talent.name)}</b><br>${esc(ch.talent.text)}</div>
            <div class="sheet-row"><b>Deck de départ</b><br>${deck}</div>
            <button class="btn primary start">Grimper la Tour du Temps</button>`}
        </div>
        <div class="select-roster">
          ${ORDER.map((id) => {
            const lockedId = !UNLOCKED.includes(id);
            return `<button class="roster ${id === current ? 'on' : ''} ${lockedId ? 'locked' : ''}" data-id="${id}" data-tip="${lockedId ? 'Verrouillé' : esc(CHARACTERS[id].name)}">
              <img src="${asset(`sprites/pokemon/artwork/${CHARACTERS[id].dex[0]}.png`)}" alt="">
            </button>`;
          }).join('')}
        </div>
        <div class="version">Prototype — acte 1 : Forêt de Jade</div>
      </div>`;
  };

  root.onclick = (ev) => {
    const t = ev.target as HTMLElement;
    const r = t.closest<HTMLElement>('.roster');
    if (r) {
      current = r.dataset.id as CharacterId;
      return draw();
    }
    if (t.closest('.start')) {
      root.onclick = null;
      onStart(current);
    }
  };
  draw();
}

function countDeck(ids: string[]): string {
  const counts = new Map<string, number>();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts].map(([id, n]) => `${n} × ${esc(cardDef(id).name)}`).join(', ');
}
