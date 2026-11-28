import { soundIcon } from '../audio/audio';
// Écran titre et Glossaire (objets tenus, baies, Pokémon croisés et leur version chromatique).
import type { SaveData } from '../core/save';
import { allRelics } from '../data/relics';
import { BERRIES } from '../data/berries';
import { ENEMY_DEFS } from '../data/enemies';
import { berryCard, berryIcon, relicCard, relicIcon } from './run-ui';
import { CHARACTERS } from '../data/characters';
import { skinSprite } from '../data/skins';
import { renderCard } from './card';
import { allCards, cardDef, CURSES, neutralPool } from '../data/cards';
import { SKINS } from '../data/skins';
import { characterLevel, playableCharacters } from '../core/save';
import { UNLOCKS } from '../data/unlocks';
import { copyDef, copyId } from '../data/copies';
import type { CardDef, CharacterId } from '../core/model';
import { TYPE_LABELS } from '../core/types';
import { asset, esc } from './util';

export interface TitleActions {
  /** Résumé de la run sauvegardée, ou null. */
  resume: string | null;
  onContinue: () => void;
  onPlay: () => void;
  onGlossary: () => void;
  onSave: () => void;
}

export function renderTitle(root: HTMLElement, a: TitleActions): void {
  const items: { cls: string; label: string; sub?: string }[] = [
    ...(a.resume ? [{ cls: 't-continue', label: 'Continuer', sub: a.resume }] : []),
    { cls: 't-play', label: a.resume ? 'Nouvelle partie' : 'Jouer' },
    { cls: 't-glossary', label: 'Glossaire' },
    { cls: 't-save', label: 'Sauvegarde' },
  ];
  // Poussières de temps qui montent doucement
  const motes = Array.from({ length: 34 }, (_, i) => {
    const x = (i * 37) % 100, d = 9 + ((i * 7) % 9), delay = -((i * 13) % 17), size = 2 + (i % 4);
    return `<i style="left:${x}%;width:${size}px;height:${size}px;animation-duration:${d}s;animation-delay:${delay}s"></i>`;
  }).join('');
  root.innerHTML = `
    <div class="title-screen">
      <img class="title-bg" src="${asset('title/ecran-titre.jpg')}" alt="" onerror="this.src='${asset('backgrounds/sommet-tour-du-temps.jpg')}'">
      <div class="title-shade"></div>
      <div class="title-motes">${motes}</div>
      <div class="title-logo">
        <h1>SlayPoke<span>Spyre</span></h1>
        <p>L'ascension de la Tour du Temps</p>
      </div>
      <nav class="title-menu">
        ${items.map((it, i) => `<button class="t-item ${it.cls}" style="animation-delay:${0.25 + i * 0.09}s"><span>${esc(it.label)}</span>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</button>`).join('')}
      </nav>
      <div class="title-foot">Fan-game Pokémon non officiel</div>
      <button class="tb-sound title-sound" data-tip="Régler le son">${soundIcon()}</button>
    </div>`;
  root.onclick = (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('.t-continue')) return a.onContinue();
    if (t.closest('.t-play')) {
      if (a.resume) return confirmBox(root, 'Commencer une nouvelle partie ?', 'La run en cours sera perdue (ta progression et tes niveaux sont gardés).', 'Nouvelle partie', a.onPlay);
      return a.onPlay();
    }
    if (t.closest('.t-glossary')) return a.onGlossary();
    if (t.closest('.t-save')) return a.onSave();
  };
}

/** Petite fenêtre de confirmation par-dessus l'écran. */
export function confirmBox(root: HTMLElement, title: string, text: string, ok: string, onOk: () => void, cancel = 'Annuler'): void {
  const box = document.createElement('div');
  box.className = 'overlay confirm-box';
  box.innerHTML = `<div class="panel"><h2>${esc(title)}</h2><p>${esc(text)}</p>
    <div class="row"><button class="btn primary ok">${esc(ok)}</button><button class="btn no">${esc(cancel)}</button></div></div>`;
  box.querySelector('.ok')!.addEventListener('click', (e) => { e.stopPropagation(); box.remove(); onOk(); });
  box.querySelector('.no')!.addEventListener('click', (e) => { e.stopPropagation(); box.remove(); });
  root.appendChild(box);
}

type Tab = 'cartes' | 'objets' | 'baies' | 'pokemon' | 'historique';

export function renderGlossary(root: HTMLElement, save: SaveData, onBack: () => void): void {
  let tab: Tab = 'cartes';
  let openDeck = -1;
  // Onglet Cartes : un Pokémon (ou « neutres » / « ennemis ») et un skin
  let who: CharacterId | 'neutres' | 'ennemis' = 'riolu';
  let skinSel = '';
  const upSet = new Set<string>();
  const seen = new Set(save.seen ?? []);
  const shiny = new Set(save.seenShiny ?? []);
  // Un Pokémon par n° (les variantes de duel partagent le même Pokémon)
  const mons = [...new Map(Object.values(ENEMY_DEFS).map((e) => [e.dex, e.name.replace(/ \(.*\)$/, '')])).entries()].sort((a, b) => a[0] - b[0]);
  const relics = allRelics();
  const order = ['depart', 'commun', 'peu-commun', 'rare', 'gardien', 'quete'];
  const label: Record<string, string> = { depart: 'Objets de départ', commun: 'Communs', 'peu-commun': 'Peu communs', rare: 'Rares', gardien: 'Reliques de gardien', quete: 'Objets spéciaux et de quête' };

  const body = (): string => {
    if (tab === 'cartes') return cardsHtml(save, who, skinSel, seen, upSet);
    if (tab === 'objets') {
      return order.map((r) => {
        const list = relics.filter((x) => x.rarity === r);
        return list.length ? `<h3>${label[r]} · ${list.length}</h3><div class="gl-grid">${list.map((x) => relicCard(x.id)).join('')}</div>` : '';
      }).join('');
    }
    if (tab === 'historique') return historyHtml(save, openDeck);
    if (tab === 'baies') {
      return `<p class="gl-note">Clique une baie dans la barre du haut pour la manger. Certaines baies sont exclusives à un personnage.</p><div class="gl-grid">${BERRIES.map((b) => berryCard(b.id)).join('')}</div>`;
    }
    return `<p class="gl-note">${[...seen].filter((d) => mons.some(([m]) => m === d)).length} / ${mons.length} Pokémon croisés · ${shiny.size} chromatique${shiny.size > 1 ? 's' : ''}</p>
      <div class="gl-mons">${mons.map(([dex, name]) => {
        const known = seen.has(dex);
        const gim = Object.values(ENEMY_DEFS).find((e) => e.dex === dex && e.gimmick)?.gimmick;
        const tip = known ? `<b>${esc(name)}</b>${gim ? `<br>★ <b>${esc(gim.name)}</b> : ${esc(gim.text)}` : ''}` : 'Pas encore croisé';
        return `<div class="gl-mon ${known ? '' : 'unknown'} ${gim ? 'boss' : ''}" data-tip="${tip}">
          <div class="gl-sprites">
            <img src="${asset(`sprites/pokemon/front/${dex}.png`)}" alt="">
            ${shiny.has(dex) ? `<img class="shiny" src="${asset(`sprites/pokemon/shiny/${dex}.png`)}" alt="" data-tip="${esc(name)} chromatique">` : ''}
          </div>
          <span>${known ? esc(name) : '???'}${shiny.has(dex) ? ' <b class="star">★</b>' : ''}</span>
          ${gim && known ? `<em class="gl-gim">${esc(gim.name)}</em>` : gim ? '<em class="gl-gim">Gardien</em>' : ''}
          <small>n° ${String(dex).padStart(3, '0')}</small>
        </div>`;
      }).join('')}</div>`;
  };

  const draw = () => {
    root.innerHTML = `
      <div class="glossary">
        <div class="gl-head">
          <button class="btn gl-back">← Retour</button>
          <h1>Glossaire</h1>
          <div class="gl-tabs">
            ${(['cartes', 'objets', 'baies', 'pokemon', 'historique'] as Tab[]).map((t) => `<button class="gl-tab ${t === tab ? 'on' : ''}" data-tab="${t}">${({ cartes: 'Cartes', objets: 'Objets tenus', baies: 'Baies', pokemon: 'Pokémon', historique: 'Historique' })[t]}</button>`).join('')}
          </div>
        </div>
        <div class="gl-body">${body()}</div>
      </div>`;
  };
  root.onclick = (ev) => {
    const t = ev.target as HTMLElement;
    const b = t.closest<HTMLElement>('.gl-tab');
    if (b) { tab = b.dataset.tab as Tab; return draw(); }
    const w = t.closest<HTMLElement>('[data-who]');
    if (w) { who = w.dataset.who as typeof who; skinSel = ''; return draw(); }
    const fl = t.closest<HTMLElement>('[data-flip]');
    if (fl) { const id = fl.dataset.flip!; if (upSet.has(id)) upSet.delete(id); else upSet.add(id); const y = root.querySelector('.gl-body')?.scrollTop ?? 0; draw(); const b2 = root.querySelector('.gl-body'); if (b2) b2.scrollTop = y; return; }
    const sk = t.closest<HTMLElement>('[data-skinsel]');
    if (sk) { skinSel = sk.dataset.skinsel!; return draw(); }
    const hd = t.closest<HTMLElement>('.hist-deck-btn');
    if (hd) { const i = Number(hd.dataset.i); openDeck = openDeck === i ? -1 : i; return draw(); }
    if (t.closest('.gl-back')) { root.onclick = null; onBack(); }
  };
  draw();
}

const ROSTER: CharacterId[] = ['riolu', 'vipelierre', 'kangourex', 'caninos', 'mew', 'quelorior', 'duo'];

/** Glossaire › Cartes : par Pokémon (et skin), les cartes neutres, et les capacités des ennemis croisés. */
function cardsHtml(save: SaveData, who: CharacterId | 'neutres' | 'ennemis', skinSel: string, seen: Set<number>, up: Set<string>): string {
  // Clic sur une carte : elle se retourne sur sa version améliorée
  const fc = (d: CardDef): string => {
    const u = up.has(d.id) && !!Object.keys(d.upgrade ?? {}).length;
    return `<div class="gl-flip ${u ? 'up' : ''}" data-flip="${d.id}" data-tip="${u ? 'Version améliorée — clique pour revenir' : 'Clique pour voir la version améliorée'}">${renderCard(u ? cardDef(d.id, true) : d)}</div>`;
  };
  const playable = playableCharacters(save);
  const chips = `<div class="glc-chips">
    ${ROSTER.map((c) => {
      const locked = !playable.includes(c);
      return `<button class="glc-chip ${who === c ? 'on' : ''} ${locked ? 'locked' : ''}" data-who="${c}" data-tip="${locked ? 'Pas encore débloqué' : esc(CHARACTERS[c].name)}"><img src="${asset(skinSprite(CHARACTERS[c].dex[0]))}" alt=""><span>${locked ? '???' : esc(CHARACTERS[c].name)}</span></button>`;
    }).join('')}
    <button class="glc-chip ${who === 'neutres' ? 'on' : ''}" data-who="neutres"><span>Neutres</span></button>
    <button class="glc-chip ${who === 'ennemis' ? 'on' : ''}" data-who="ennemis"><span>Ennemis</span></button>
  </div>`;
  if (who === 'neutres') {
    return `${chips}<p class="gl-note">Tous les Pokémon peuvent les apprendre : elles apparaissent parfois en récompense et au Marché Kecleon.</p>
      <div class="deck-grid gl-cards">${neutralPool().filter((d) => !d.skin).map((d) => fc(d)).join('')}</div>`;
  }
  if (who === 'ennemis') {
    const enemies = Object.entries(ENEMY_DEFS).filter(([, e]) => seen.has(e.dex));
    const total = new Set(Object.values(ENEMY_DEFS).map((e) => e.dex)).size;
    return `${chips}<p class="gl-note">Les capacités des Pokémon que tu as croisés (${new Set(enemies.map(([, e]) => e.dex)).size} / ${total}). Gribouille peut les copier.</p>
      <h3>Malédictions et cartes de gardien</h3>
      <div class="deck-grid gl-cards">${CURSES.map((id) => fc(cardDef(id))).join('')}${allCards().filter((d) => d.onDraw && !CURSES.includes(d.id)).map((d) => fc(d)).join('')}</div>
      ${enemies.map(([id, e]) => `<h3 class="glc-enemy"><img src="${asset(`sprites/pokemon/front/${e.dex}.png`)}" alt="">${esc(e.name)}</h3>
        <div class="deck-grid gl-cards">${e.moves.map((m) => { const d = copyDef(copyId(id, m.id), false); return d ? renderCard(d) : ''; }).join('')}</div>`).join('')}`;
  }
  const c = who;
  if (!playable.includes(c)) return `${chips}<p class="gl-note">Débloque ce Pokémon pour voir ses cartes.</p>`;
  const skins = SKINS[c] ?? [];
  const skinChips = `<div class="glc-skins">
    <button class="glc-skin ${!skinSel ? 'on' : ''}" data-skinsel="">Normal</button>
    ${skins.map((k) => `<button class="glc-skin ${skinSel === k.id ? 'on' : ''}" data-skinsel="${k.id}"><img src="${asset(skinSprite(k.dex?.[0] ?? CHARACTERS[c].dex[0], k.id))}" alt="">${esc(k.name)}</button>`).join('')}
  </div>`;
  if (skinSel) {
    const k = skins.find((x) => x.id === skinSel)!;
    const base = new Set(CHARACTERS[c].starterDeck);
    const ids = [...new Set([...(k.cards ?? []), ...(k.deck ?? []), ...(k.firstCard ? [k.firstCard] : []), ...(k.extraCards ?? [])])].filter((id) => !base.has(id) && ((k.cards ?? []).includes(id) || !Object.values(UNLOCKS[c] ?? {}).flat().includes(id)));
    const typeCards = k.typeCards?.length ? allCards().filter((d) => d.character === 'normal' && k.typeCards!.includes(d.pokeType) && d.rarity !== 'depart') : [];
    return `${chips}${skinChips}
      <p class="gl-note"><b>${esc(k.name)}</b> — ${esc(k.goalText)}</p>
      ${ids.length ? `<h3>Cartes de départ du skin</h3><div class="deck-grid gl-cards">${ids.map((id) => fc(cardDef(id))).join('')}</div>` : ''}
      ${allCards().some((d) => d.skin === k.id) ? `<h3>Cartes obtenables seulement avec ce skin</h3><div class="deck-grid gl-cards">${allCards().filter((d) => d.skin === k.id).map((d) => fc(d)).join('')}</div>` : ''}
      ${typeCards.length ? `<h3>Cartes de type ${k.typeCards!.map((t) => TYPE_LABELS[t]).join(', ')} qu'il peut apprendre</h3><div class="deck-grid gl-cards">${typeCards.map((d) => fc(d)).join('')}</div>` : ''}
      ${!ids.length && !typeCards.length ? '<p class="gl-note">Ce skin garde les mêmes cartes que le Pokémon de base.</p>' : ''}
`;
  }
  const lvl = characterLevel(save, c);
  const levelOf = new Map<string, number>();
  for (const [l, ids] of Object.entries(UNLOCKS[c] ?? {})) for (const id of ids) levelOf.set(id, Number(l));
  const order = ['depart', 'commune', 'peu-commune', 'rare', 'legendaire'];
  // Les cartes propres à un skin sont rangées sous ce skin, pas avec le Pokémon de base
  const skinOnly = new Set((SKINS[c] ?? []).flatMap((k) => [...(k.cards ?? []), ...(k.deck ?? []), ...(k.firstCard ? [k.firstCard] : []), ...(k.extraCards ?? [])])
    .filter((id) => !CHARACTERS[c].starterDeck.includes(id) && !Object.values(UNLOCKS[c] ?? {}).flat().includes(id)));
  const cards = allCards().filter((d) => d.character === c && d.id !== 'duo-decharge-synchro' && !skinOnly.has(d.id) && !d.skin)
    .sort((a, b) => (levelOf.get(a.id) ?? 0) - (levelOf.get(b.id) ?? 0) || order.indexOf(a.rarity) - order.indexOf(b.rarity));
  const unlocked = cards.filter((d) => (levelOf.get(d.id) ?? 0) <= lvl).length;
  return `${chips}${skinChips}
    <p class="gl-note">${unlocked} / ${cards.length} cartes débloquées (niveau ${lvl}). Gagne de l'EXP en fin de run pour en débloquer de nouvelles dans les récompenses.</p>
    <div class="deck-grid gl-cards">${cards.map((d) => {
      const need = levelOf.get(d.id) ?? 0;
      const locked = need > lvl;
      return `<div class="collect ${locked ? 'locked' : ''}">${fc(d)}${locked ? `<span class="lock">Niveau ${need}</span>` : need === 0 ? '<span class="tag">Départ</span>' : ''}</div>`;
    }).join('')}</div>`;
}

/** Écran Sauvegarde : sauvegarde automatique, export / import d'un fichier. */
export function renderSaveScreen(root: HTMLElement, info: { hasRun: string | null; onExport: () => void; onImport: (text: string) => void; onBack: () => void }): void {
  root.innerHTML = `
    <div class="glossary save-screen">
      <div class="gl-head"><button class="btn gl-back">← Retour</button><h1>Sauvegarde</h1></div>
      <div class="gl-body save-body">
        <p><b>La sauvegarde est automatique.</b> Ta progression (niveaux, cartes débloquées, Pokémon jouables, Glossaire)
        et ta run en cours sont enregistrées à chaque étape. Ferme le jeu quand tu veux : tu reprendras là où tu t'étais arrêté.</p>
        <p class="save-run">${info.hasRun ? `Run en cours : <b>${esc(info.hasRun)}</b>` : 'Aucune run en cours.'}</p>
        <div class="row">
          <button class="btn primary s-export">Exporter un fichier de sauvegarde</button>
          <label class="btn s-import">Importer un fichier<input type="file" accept=".json,application/json" hidden></label>
        </div>
        <p class="gl-note">Le fichier sert de copie de secours, ou pour continuer sur un autre ordinateur ou un autre navigateur.</p>
      </div>
    </div>`;
  root.querySelector('.gl-back')!.addEventListener('click', info.onBack);
  root.querySelector('.s-export')!.addEventListener('click', info.onExport);
  root.querySelector<HTMLInputElement>('.s-import input')!.addEventListener('change', async (ev) => {
    const f = (ev.target as HTMLInputElement).files?.[0];
    if (f) info.onImport(await f.text());
  });
}

/** Historique : les 5 dernières parties, avec le résultat, les Pokémon du dernier combat et le deck. */
function historyHtml(save: SaveData, openDeck: number): string {
  const list = save.history ?? [];
  if (!list.length) return '<p class="gl-note">Aucune partie terminée pour l\'instant. Tes 5 dernières parties apparaîtront ici.</p>';
  return `<p class="gl-note">${list.length > 1 ? `Tes ${list.length} dernières parties (la plus récente en haut).` : 'Ta dernière partie.'} L'historique garde les 5 dernières.</p>
    <div class="hist-list">${list.map((r, i) => {
      const dex = CHARACTERS[r.character].dex[Math.min(r.act, CHARACTERS[r.character].dex.length) - 1] ?? CHARACTERS[r.character].dex[0];
      const date = new Date(r.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      const counts = new Map<string, { id: string; up: boolean; n: number }>();
      for (const c of r.deck) { const k = c.id + (c.up ? '+' : ''); const e = counts.get(k); if (e) e.n++; else counts.set(k, { ...c, n: 1 }); }
      return `<div class="hist-run ${r.victory ? 'win' : 'lose'}">
        <div class="hist-top">
          <img class="hist-sprite" src="${asset(skinSprite(dex, r.skin))}" alt="">
          <div class="hist-main">
            <div class="hist-title">${r.victory ? '🏆 Victoire' : '💀 Défaite'} · ${esc(r.form)}</div>
            <div class="hist-sub">${date} · étage ${r.floor} · ${esc(r.zone)} · ${r.deck.length} cartes · ${r.maxHp} PV max · +${r.exp} EXP</div>
            <div class="hist-killer">${r.victory ? 'Dernier adversaire :' : 'Mis K.O. par :'} ${r.killedBy.map((k) => `<span><img src="${asset(`sprites/pokemon/front/${k.dex}.png`)}" alt="">${esc(k.name)}</span>`).join('') || '—'}</div>
          </div>
          <button class="btn small hist-deck-btn" data-i="${i}">${openDeck === i ? 'Masquer le deck' : 'Voir le deck'}</button>
        </div>
        <div class="hist-items">${r.relics.map((id) => relicIcon(id)).join('')}${r.berries.map((id) => berryIcon(id)).join('')}</div>
        ${openDeck === i ? `<div class="hist-deck">${[...counts.values()].map((c) => `<div class="hist-card">${renderCard(cardDef(c.id, c.up))}${c.n > 1 ? `<b class="hist-n">×${c.n}</b>` : ''}</div>`).join('')}</div>` : ''}
      </div>`;
    }).join('')}</div>`;
}
