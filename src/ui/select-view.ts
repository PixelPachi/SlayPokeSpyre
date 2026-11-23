import { SKINS, skinSprite } from '../data/skins';
import { equipSkin, equippedSkin, skinDetail, skinProgress, skinUnlocked } from '../core/save';
// Écran de sélection du personnage (section 9 du GDD : illustration plein écran + fiche à gauche).
import type { CharacterId } from '../core/model';
import { TYPE_LABELS } from '../core/types';
import { allCards, cardDef, neutralPool } from '../data/cards';
import type { SaveData } from '../core/save';
import { characterLevel, playableCharacters } from '../core/save';
import { LEVEL_EXP, MAX_LEVEL, RELIC_UNLOCKS, UNLOCKS } from '../data/unlocks';
import { renderCard } from './card';
import { relicCard, relicIcon } from './run-ui';
import { allRelics, relicDef } from '../data/relics';
import { CHARACTERS } from '../data/characters';
import { TYPE_COLORS } from './labels';
import { asset, esc } from './util';

// Petites icônes Gemini du carré de sélection
const ICON_FILES = import.meta.glob<string>('../assets/ui/icones/*.png', { eager: true, query: '?url', import: 'default' });
const ICONS: Partial<Record<string, string>> = Object.fromEntries(Object.entries(ICON_FILES).map(([p, u]) => [p.split('/').pop()!.replace('.png', ''), u]));

const ORDER: CharacterId[] = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew', 'quelorior'];
const ILLUSTRATIONS: Partial<Record<CharacterId, string>> = {
  riolu: 'illustrations/riolu.webp',
  vipelierre: 'illustrations/vipelierre.webp',
  kangourex: 'illustrations/kangourex.webp',
  caninos: 'illustrations/caninos.webp',
  mew: 'illustrations/mew.webp',
  quelorior: 'illustrations/quelorior.webp',
};
const UNLOCK_TEXT: Record<CharacterId, string> = {
  riolu: '',
  vipelierre: "Battre le gardien de l'acte 1",
  kangourex: "Battre le gardien de l'acte 2",
  caninos: 'Atteindre le sommet de la tour',
  mew: '???',
  quelorior: '???',
};

export function renderSelect(root: HTMLElement, save: SaveData, onStart: (c: CharacterId) => void, onBack?: () => void): void {
  let current: CharacterId = 'riolu';
  const UNLOCKED = playableCharacters(save);

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
        ${onBack ? '<button class="btn back-title">← Écran titre</button>' : ''}
        <div class="select-sheet">
          <div class="sheet-name">${locked && (current === 'mew' || current === 'quelorior') ? '???' : esc(ch.name)}</div>
          <div class="sheet-types">${ch.types.map((t) => `<span class="type-badge" style="background:${TYPE_COLORS[t]}">${TYPE_LABELS[t]}</span>`).join('')}</div>
          ${locked ? `<p class="sheet-locked">Verrouillé<br><small>${esc(UNLOCK_TEXT[current])}</small></p>` : `
            <div class="sheet-row"><b>PV</b> ${ch.maxHp}</div>
            <div class="sheet-row"><b>Talent — ${esc(ch.talent.name)}</b><br>${esc(ch.talent.text)}</div>
            ${ch.starterRelic ? `<div class="sheet-row sheet-relic">${relicIcon(ch.starterRelic)}<div><b>Objet — ${esc(relicDef(ch.starterRelic).name)}</b><br>${esc(relicDef(ch.starterRelic).text)}</div></div>` : ''}
            <div class="sheet-row"><b>Deck de départ</b><br>${deck}</div>
            ${expBlock(save, current)}
            ${skinBlock(save, current)}
            <div class="sheet-actions">
              <button class="btn primary start">Grimper la Tour du Temps</button>
              <button class="btn collection">Voir les capacités</button>
            </div>`}
        </div>
        <div class="select-roster">
          ${ORDER.map((id) => {
            const lockedId = !UNLOCKED.includes(id);
            return `<button class="roster ${id === current ? 'on' : ''} ${lockedId ? 'locked' : ''}" data-id="${id}" data-tip="${lockedId ? 'Verrouillé' : esc(CHARACTERS[id].name)}">
              <img class="${ICONS[id] ? 'icon' : ''}" src="${ICONS[id] ?? asset(`sprites/pokemon/artwork/${CHARACTERS[id].dex[0]}.png`)}" alt="">
            </button>`;
          }).join('')}
        </div>
      </div>`;
  };

  root.onclick = (ev) => {
    const t = ev.target as HTMLElement;
    const r = t.closest<HTMLElement>('.roster');
    if (r) {
      current = r.dataset.id as CharacterId;
      return draw();
    }
    const sk = t.closest<HTMLElement>('.skin-btn');
    if (sk) {
      if (sk.classList.contains('locked')) return;
      equipSkin(save, current, sk.dataset.skin || undefined);
      return draw();
    }
    if (t.closest('.collection')) return openCollection(root, save, current);
    if (t.closest('.back-title') && onBack) {
      root.onclick = null;
      return onBack();
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

function expBlock(save: SaveData, c: CharacterId): string {
  const exp = save.exp[c] ?? 0;
  const lvl = characterLevel(save, c);
  const cur = LEVEL_EXP[lvl - 1];
  const next = lvl < MAX_LEVEL ? LEVEL_EXP[lvl] : null;
  const pct = next ? Math.round(((exp - cur) / (next - cur)) * 100) : 100;
  return `
    <div class="sheet-row sheet-exp">
      <b>Niveau ${lvl}</b> <span>${next ? `${exp - cur} / ${next - cur} EXP` : 'niveau max'}</span>
      <div class="exp-bar"><div style="width:${pct}%"></div></div>
    </div>`;
}

/** Toutes les capacités du Pokémon : débloquées, ou verrouillées avec le niveau requis. */
function openCollection(host: HTMLElement, save: SaveData, c: CharacterId): void {
  const lvl = characterLevel(save, c);
  const levelOf = new Map<string, number>();
  for (const [l, ids] of Object.entries(UNLOCKS[c] ?? {})) for (const id of ids) levelOf.set(id, Number(l));
  const cards = allCards().filter((d) => d.character === c);
  const order = ['depart', 'commune', 'peu-commune', 'rare'];
  cards.sort((a, b) => (levelOf.get(a.id) ?? 0) - (levelOf.get(b.id) ?? 0) || order.indexOf(a.rarity) - order.indexOf(b.rarity));
  const unlocked = cards.filter((d) => (levelOf.get(d.id) ?? 0) <= lvl).length;
  const el = document.createElement('div');
  el.className = 'overlay deck-overlay';
  el.innerHTML = `
    <div class="deck-panel">
      <h2>Capacités de ${esc(CHARACTERS[c].name)} · ${unlocked}/${cards.length}</h2>
      <p class="collection-hint">Gagne de l'EXP en fin de run pour débloquer de nouvelles capacités dans les récompenses.</p>
      <div class="deck-grid">
        ${cards.map((d) => {
          const need = levelOf.get(d.id) ?? 0;
          const locked = need > lvl;
          return `<div class="collect ${locked ? 'locked' : ''}">${renderCard(d)}${locked ? `<span class="lock">Niveau ${need}</span>` : need === 0 ? '<span class="tag">Départ</span>' : ''}</div>`;
        }).join('')}
      </div>
      <h2>Cartes neutres · ${neutralPool().length}</h2>
      <p class="collection-hint">Tous les Pokémon peuvent les apprendre : elles apparaissent parfois en récompense et au Marché Kecleon.</p>
      <div class="deck-grid">${neutralPool().map((d) => renderCard(d)).join('')}</div>
      <h2>Objets tenus</h2>
      <div class="relic-grid">
        ${relicsFor(c, lvl)}
      </div>
      <button class="btn close">Fermer</button>
    </div>`;
  host.appendChild(el);
  el.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('.close') || t === el) el.remove();
  });
}

function relicsFor(c: CharacterId, lvl: number): string {
  const need = new Map<string, number>();
  for (const [l, ids] of Object.entries(RELIC_UNLOCKS[c] ?? {})) for (const id of ids) need.set(id, Number(l));
  const mine = allRelics().filter((r) => r.owner === c);
  const common = allRelics().filter((r) => r.owner === 'commun');
  return [...mine, ...common].map((r) => {
    const n = need.get(r.id) ?? 0;
    const tag = r.rarity === 'depart' ? 'Objet de départ' : r.owner === 'commun' ? 'Commun à tous' : n > lvl ? `Niveau ${n}` : `Débloqué (niveau ${n})`;
    return `<div class="collect-relic ${n > lvl ? 'locked' : ''}">${relicCard(r.id, `<em>${tag}</em>`)}</div>`;
  }).join('');
}

/** Skins du personnage : normal + skins à débloquer (objectifs cumulés sur toutes les runs). */
function skinBlock(save: SaveData, c: CharacterId): string {
  const skins = SKINS[c] ?? [];
  if (!skins.length) return '';
  const dex = CHARACTERS[c].dex[0];
  const cur = equippedSkin(save, c);
  return `<div class="sheet-row sheet-skins"><b>Skins</b><div class="skin-list">
    <button class="skin-btn ${!cur ? 'on' : ''}" data-skin=""><img src="${asset(skinSprite(dex))}" alt=""><span>Normal</span></button>
    ${skins.map((k) => {
      const ok = skinUnlocked(save, c, k);
      const [n, goal] = skinProgress(save, c, k);
      return `<button class="skin-btn ${cur === k.id ? 'on' : ''} ${ok ? '' : 'locked'}" data-skin="${k.id}" data-tip="<b>${esc(k.name)}</b><br>${esc(k.goalText)} (${skinDetail(save, c, k)})${ok ? '<br>Débloqué !' : '<br>Se cumule sur toutes tes runs.'}">
        <img src="${asset(skinSprite(dex, k.id))}" alt=""><span>${k.id === 'shiny' ? '★ ' : ''}${esc(k.name)}</span>
        ${ok ? '' : `<small>${n}/${goal}</small><i class="skin-bar" style="--p:${(n / goal) * 100}%"></i>`}
      </button>`;
    }).join('')}
  </div></div>`;
}
