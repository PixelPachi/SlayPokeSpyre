import { sfx } from '../audio/audio';
// Écrans des nœuds hors combat : récompenses, Centre Pokémon, Marché Kecleon, événement, trésor, fin de run.
import type { Run } from '../core/run';
import { cardPrice } from '../core/run';
import { cardDef } from '../data/cards';
import { LEVEL_EXP, MAX_LEVEL, levelFor, type ExpLine, RELIC_UNLOCKS, UNLOCKS } from '../data/unlocks';
import type { CharacterId } from '../core/model';
import { CHARACTERS } from '../data/characters';
import { EVENTS, type EventFight, type EventPick, type GameEvent } from '../data/events';
import { TAROT_EVENTS } from '../data/events-tarot';
import { renderCard } from './card';
import { ENCHANTS } from '../data/cards';
import { MAX_BERRIES, berryPrice } from '../data/berries';
import { TYPE_LABELS } from '../core/types';
import { SHINY_CHANCE } from '../core/combat';
import { CHARACTER_COLORS } from './labels';
import { openDeckOverlay, relicCard, relicIcon, topbar, berryCard, berryIcon } from './run-ui';
import { relicDef } from '../data/relics';
import { BERRY_DEFS } from '../data/berries';
import { relicPrice } from '../data/relics';
import { asset, esc } from './util';
import { weatherParticles } from './combat-view';

type Done = () => void;

export function shell(run: Run, label: string, body: string, cls = ''): string {
  return `<div class="node-screen ${cls}">${topbar(run, label)}<div class="node-body">${body}</div></div>`;
}

export function bindDeck(root: HTMLElement, run: Run): void {
  root.querySelector('.tb-deck')?.addEventListener('click', () => openDeckOverlay(root, { title: 'Ton deck' }, run));
}

/** Récompenses après un combat : Pokédollars puis 1 carte parmi 3 (ou passer). */
export function renderReward(
  root: HTMLElement, run: Run, o: { money: number; cards: string[]; title: string; label: string; relic?: string; berry?: string }, done: Done,
): void {
  // Butin façon Slay the Spire : une liste de récompenses, on clique sur chacune pour la prendre
  const loot: { kind: 'money' | 'relic' | 'berry' | 'cards'; taken: boolean }[] = [];
  if (o.money > 0) loot.push({ kind: 'money', taken: false });
  if (o.relic) loot.push({ kind: 'relic', taken: false });
  if (o.berry) loot.push({ kind: 'berry', taken: false });
  if (o.cards.length) loot.push({ kind: 'cards', taken: false });
  const row = (k: typeof loot[number]['kind']): string => {
    switch (k) {
      case 'money':
        return `<span class="loot-icon money">₽</span><span><b>${o.money} Pokédollars</b></span>`;
      case 'relic':
        return `${relicIcon(o.relic!, 'loot-icon')}<span><b>${esc(relicDef(o.relic!).name)}</b><small>${esc(relicDef(o.relic!).text)}</small></span>`;
      case 'berry': {
        const b = BERRY_DEFS[o.berry!];
        const full = run.berries.length >= MAX_BERRIES;
        return `${berryIcon(o.berry!, 'loot-icon')}<span><b>${esc(b.name)}</b><small>${full ? 'Sac plein : mange ou jette une baie pour la prendre' : esc(b.text)}</small></span>`;
      }
      case 'cards':
        return `<span class="loot-icon cards">🂠</span><span><b>Apprendre une capacité</b><small>Choisis 1 carte parmi ${o.cards.length}</small></span>`;
    }
  };
  const draw = () => {
    root.innerHTML = shell(run, o.label, `
      <div class="loot-panel">
        <h1 class="node-title">${esc(o.title)}</h1>
        <div class="loot-list">${loot.map((l, i) => l.taken ? '' : `<button class="loot-row" data-i="${i}">${row(l.kind)}</button>`).join('') || '<p class="node-sub">Tout est ramassé !</p>'}</div>
        <button class="btn primary proceed">Continuer ›</button>
      </div>`, 'reward');
    bindDeck(root, run);
    root.querySelectorAll<HTMLElement>('.loot-row').forEach((b) => b.addEventListener('click', () => {
      const l = loot[Number(b.dataset.i)];
      if (l.kind === 'money') { run.money += o.money; l.taken = true; sfx('baie'); }
      if (l.kind === 'relic') { run.addRelic(o.relic!); l.taken = true; sfx('soin'); }
      if (l.kind === 'berry') { if (!run.addBerry(o.berry!)) return; l.taken = true; sfx('baie'); }
      if (l.kind === 'cards') return openCards(l);
      draw();
    }));
    root.querySelector('.proceed')!.addEventListener('click', done);
  };
  const openCards = (l: typeof loot[number]) => {
    const box = document.createElement('div');
    box.className = 'card-choice';
    box.innerHTML = `<div class="card-choice-title">Choisis une capacité</div>
      <div class="card-row card-choice-row">${o.cards.map((id) => renderCard(cardDef(id), { classes: 'pickable' }).replace('<div class="card', `<div data-pick="${id}" class="card`)).join('')}</div>
      <button class="btn skip-cards">Passer</button>`;
    box.addEventListener('click', (ev) => {
      const t = ev.target as HTMLElement;
      const c = t.closest<HTMLElement>('[data-pick]');
      if (c) { run.addCard(c.dataset.pick!); l.taken = true; sfx('carte'); box.remove(); return draw(); }
      if (t.closest('.skip-cards')) box.remove();
    });
    root.querySelector('.node-screen')!.appendChild(box);
  };
  draw();
}

/** Centre Pokémon : soigner 30 % des PV max OU améliorer une carte. */
export function renderCentre(root: HTMLElement, run: Run, done: Done): void {
  const heal = Math.floor(run.maxHp * 0.3);
  const upgradable = run.deck.filter((c) => !c.upgraded);
  root.innerHTML = shell(run, 'Centre Pokémon', `
    <h1 class="node-title">Centre Pokémon</h1>
    <p class="node-sub">« Bonjour ! Bienvenue au Centre Pokémon de la Tour du Temps. »</p>
    <div class="choice-row">
      <button class="choice heal" ${run.relics.includes('cendre-sacree') ? 'disabled' : ''}><b>Se soigner</b><span>${run.relics.includes('cendre-sacree') ? 'Impossible : la Cendre Sacrée t’en empêche' : `Récupère ${Math.min(heal, run.maxHp - run.hp)} PV (30 % des PV max)`}</span></button>
      <button class="choice upgrade" ${upgradable.length ? '' : 'disabled'}><b>S'entraîner</b><span>Améliore une carte de ton deck</span></button>
    </div>`, 'centre');
  bindDeck(root, run);
  root.querySelector('.heal')!.addEventListener('click', () => {
    run.heal(heal);
    done();
  });
  root.querySelector('.upgrade')!.addEventListener('click', () =>
    openDeckOverlay(root, {
      title: 'Choisis la carte à améliorer', cards: upgradable, upgradePreview: true, cancelLabel: 'Retour',
      onPick: (uid) => {
        run.upgradeCard(uid);
        done();
      },
    }, run));
}

/** Marché Kecleon : 5 cartes du personnage, 2 objets tenus, oublier une carte.
 *  Kecleon peut être chromatique (même chance que les ennemis) : tous les prix sont alors divisés par deux. */
export function renderShop(root: HTMLElement, run: Run, done: Done, onAttack?: (onWin: () => void) => void): void {
  // Kecleon n'a pas oublié : après une attaque, les marchés suivants sont vides
  if (run.kecleonHostile) {
    root.innerHTML = shell(run, 'Marché Kecleon', `
      <div class="kecleon-head">
        <div class="kecleon-gone">?</div>
        <div>
          <h1 class="node-title">Marché Kecleon… fermé</h1>
          <p class="node-sub">Les étals sont vides. Un panneau griffonné : « Interdit aux voleurs. » Kecleon se souvient de toi.</p>
        </div>
      </div>
      <div class="shop-actions"><button class="btn leave">Repartir</button></div>`, 'shop-screen');
    bindDeck(root, run);
    root.querySelector('.leave')!.addEventListener('click', done);
    return;
  }
  const shiny = run.rng.next() < SHINY_CHANCE;
  const price = (p: number) => (shiny ? Math.floor(p / 2) : p);
  const offers = [...run.cardChoices('boutique', 5), ...run.neutralChoices(2)].map((id) => ({ id, price: price(cardPrice(id)), sold: false }));
  const items = run.rollRelics(2).map((id) => ({ id, price: price(relicPrice(id)), sold: false }));
  const berries = Array.from({ length: 3 }, () => run.rollBerry()).map((id) => ({ id, price: price(berryPrice(id)), sold: false }));
  let pickedItem: number | null = null;
  let pickedBerry: number | null = null;
  let looted = false;
  const sale = run.rng.int(0, 4);
  offers[sale].price = Math.floor(offers[sale].price / 2);
  let removed = false;
  let picked: number | null = null;

  let carpetOpen = false;
  const draw = () => {
    const removeCost = looted ? 0 : price(75 + 25 * run.removals);
    const carpet = `
      <div class="carpet-head">
        <h2>${looted ? 'Sers-toi : tout est gratuit !' : shiny ? '★ Tout est à moitié prix !' : 'Les articles de Kecleon'}</h2>
        <button class="btn close-carpet">← Retour à l’échoppe</button>
      </div>
      <div class="card-row shop">
        ${offers.map((o, i) => `
          <div class="shop-item ${o.sold ? 'sold' : ''} ${run.money < o.price ? 'poor' : ''} ${picked === i ? 'picked' : ''}" data-i="${i}">
            ${renderCard(cardDef(o.id))}
            <div class="price">${o.sold ? 'Vendu' : `${o.price} ₽`}${i === sale && !o.sold ? ' <span class="sale">-50 %</span>' : ''}</div>
            ${picked === i && !o.sold ? `<button class="btn primary buy" ${run.money < o.price ? 'disabled' : ''}>${run.money < o.price ? 'Pas assez de ₽' : 'Acheter'}</button>` : ''}
          </div>`).join('')}
      </div>
      <div class="carpet-bottom">
      ${items.length ? `<div class="shop-relics">${items.map((o, i) => `
        <div class="shop-relic ${o.sold ? 'sold' : ''} ${pickedItem === i ? 'picked' : ''}" data-i="${i}">
          ${relicCard(o.id, `<span class="price">${o.sold ? 'Vendu' : `${o.price} ₽`}</span>`)}
          ${pickedItem === i && !o.sold ? `<button class="btn primary buy-relic" ${run.money < o.price ? 'disabled' : ''}>${run.money < o.price ? 'Pas assez de ₽' : 'Acheter'}</button>` : ''}
        </div>`).join('')}</div>` : ''}
      <div class="shop-berries">${berries.map((o, i) => `
        <div class="shop-relic shop-berry ${o.sold ? 'sold' : ''} ${pickedBerry === i ? 'picked' : ''}" data-i="${i}">
          ${berryCard(o.id, `<span class="price">${o.sold ? 'Vendu' : `${o.price} ₽`}</span>`)}
          ${pickedBerry === i && !o.sold ? `<button class="btn primary buy-berry" ${run.money < o.price || run.berries.length >= MAX_BERRIES ? 'disabled' : ''}>${run.berries.length >= MAX_BERRIES ? 'Sac plein' : run.money < o.price ? 'Pas assez de ₽' : 'Acheter'}</button>` : ''}
        </div>`).join('')}</div>
        <button class="choice remove" ${removed || run.money < removeCost ? 'disabled' : ''}>
          <b>Oublier une capacité</b><span>${removed ? 'Déjà fait ici' : `${removeCost} ₽ — retire une carte du deck`}</span>
        </button>
      </div>`;
    root.innerHTML = shell(run, 'Marché Kecleon', shopScene({
      keeper: looted ? '' : asset(`sprites/pokemon/${shiny ? 'shiny' : 'front'}/352.png`),
      bubble: looted ? 'Kecleon a pris la fuite… Les étals sont à toi (clique dessus).' : shiny ? '★ Kecleon chromatique ! Tout est à moitié prix. Clique sur moi !' : 'Bienvenue ! Clique sur moi pour voir mes articles !',
      title: looted ? 'Marché Kecleon… pillé !' : 'Marché Kecleon',
      actions: `${onAttack && !looted ? '<button class="btn danger attack-kecleon">Attaquer Kecleon</button>' : ''}<button class="btn primary leave">Quitter le marché</button>`,
      carpet: carpetOpen ? carpet : '',
    }), 'shop-screen shop-place');
    root.querySelector('.shop-keeper')?.addEventListener('click', () => { carpetOpen = true; draw(); });
    root.querySelector('.shop-stall')?.addEventListener('click', () => { carpetOpen = true; draw(); });
    root.querySelector('.close-carpet')?.addEventListener('click', () => { carpetOpen = false; picked = pickedItem = pickedBerry = null; draw(); });
    root.querySelectorAll<HTMLElement>('.shop-berry').forEach((el) =>
      el.addEventListener('click', (ev) => {
        const i = Number(el.dataset.i);
        const o = berries[i];
        if (o.sold) return;
        if ((ev.target as HTMLElement).closest('.buy-berry')) {
          if (run.money < o.price || run.berries.length >= MAX_BERRIES) return;
          run.money -= o.price;
          run.addBerry(o.id);
          o.sold = true;
          pickedBerry = null;
        } else {
          pickedBerry = pickedBerry === i ? null : i;
        }
        draw();
      }));
    root.querySelector('.attack-kecleon')?.addEventListener('click', (ev) => {
      const b = ev.currentTarget as HTMLButtonElement;
      // Deux clics : on ne déclenche pas un combat difficile par erreur
      if (!b.classList.contains('confirm')) {
        b.classList.add('confirm');
        b.textContent = 'Vraiment ? Combat très dur, et plus aucun marché ensuite';
        return;
      }
      onAttack!(() => {
        looted = true;
        for (const o of [...offers, ...items, ...berries]) o.price = 0;
        draw();
      });
    });
    bindDeck(root, run);
    // Un premier clic choisit la carte, le bouton « Acheter » confirme (pas d'achat par erreur)
    root.querySelectorAll<HTMLElement>('.shop-item').forEach((el) =>
      el.addEventListener('click', (ev) => {
        const i = Number(el.dataset.i);
        const o = offers[i];
        if (o.sold) return;
        if ((ev.target as HTMLElement).closest('.buy')) {
          if (run.money < o.price) return;
          run.money -= o.price;
          run.addCard(o.id);
          o.sold = true;
          picked = null;
        } else {
          picked = picked === i ? null : i;
        }
        draw();
      }));
    root.querySelectorAll<HTMLElement>('.shop-relic:not(.shop-berry)').forEach((el) =>
      el.addEventListener('click', (ev) => {
        const i = Number(el.dataset.i);
        const o = items[i];
        if (o.sold) return;
        if ((ev.target as HTMLElement).closest('.buy-relic')) {
          if (run.money < o.price) return;
          run.money -= o.price;
          run.addRelic(o.id);
          o.sold = true;
          pickedItem = null;
        } else {
          pickedItem = pickedItem === i ? null : i;
        }
        draw();
      }));
    root.querySelector('.remove')?.addEventListener('click', () =>
      openDeckOverlay(root, {
        title: 'Quelle capacité oublier ?', cancelLabel: 'Retour',
        onPick: (uid) => {
          run.money -= removeCost;
          run.removals++;
          run.removeCard(uid);
          removed = true;
          draw();
        },
      }, run));
    root.querySelector('.leave')?.addEventListener('click', done);
  };
  draw();
}

/** Place du marché : décor d'échoppe, le marchand à droite (on clique dessus pour ouvrir le tapis d'articles). */
export function shopScene(o: { keeper: string; keeperCls?: string; bubble: string; title: string; actions: string; carpet: string; theme?: string }): string {
  return `
    <div class="shop-scene ${o.theme ?? ''}">
      <svg class="shop-decor" viewBox="0 0 1280 640" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--wood1)"/><stop offset="1" stop-color="var(--wood2)"/></linearGradient>
          <pattern id="stripes" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="40" height="80" fill="var(--awn1)"/><rect x="40" width="40" height="80" fill="var(--awn2)"/></pattern>
        </defs>
        <rect y="470" width="1280" height="170" fill="var(--ground)"/>
        <ellipse cx="640" cy="560" rx="560" ry="40" fill="#0005"/>
        <!-- Échoppe -->
        <rect x="160" y="150" width="20" height="340" fill="url(#wood)"/><rect x="1100" y="150" width="20" height="340" fill="url(#wood)"/>
        <path d="M120 150 L1160 150 L1120 250 L160 250 Z" fill="url(#stripes)" stroke="#2a1606" stroke-width="6"/>
        <path d="M160 250 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0 q32 30 64 0" fill="var(--awn1)" stroke="#2a1606" stroke-width="5"/>
        <rect x="200" y="300" width="880" height="34" rx="6" fill="url(#wood)" stroke="#2a1606" stroke-width="5"/>
        <rect x="220" y="334" width="840" height="150" fill="var(--wood2)" stroke="#2a1606" stroke-width="5"/>
        <g stroke="#2a1606" stroke-width="3" opacity="0.5"><line x1="220" y1="384" x2="1060" y2="384"/><line x1="220" y1="434" x2="1060" y2="434"/></g>
        <!-- Marchandises sur le comptoir -->
        <g stroke="#2a1606" stroke-width="4">
          <circle cx="290" cy="280" r="22" fill="#e8483f"/><path d="M268 280h44" /><circle cx="290" cy="280" r="7" fill="#fff"/>
          <rect x="340" y="250" width="56" height="50" rx="6" fill="#c9a061"/><rect x="420" y="262" width="40" height="38" rx="5" fill="#7ab8e8"/>
          <circle cx="510" cy="284" r="16" fill="#5b9bff"/><circle cx="545" cy="286" r="14" fill="#f5c84c"/><circle cx="578" cy="284" r="15" fill="#ff7aa8"/>
          <rect x="620" y="240" width="30" height="60" rx="8" fill="#9de0c8"/><rect x="664" y="252" width="30" height="48" rx="8" fill="#ffd27a"/>
        </g>
        <!-- Lanternes -->
        <g class="lanterns"><line x1="300" y1="250" x2="300" y2="290" stroke="#2a1606" stroke-width="3"/><circle cx="300" cy="300" r="0" fill="none"/>
          <ellipse class="lantern" cx="230" cy="290" rx="16" ry="22" fill="var(--lamp)" stroke="#2a1606" stroke-width="4"/>
          <ellipse class="lantern" cx="1050" cy="290" rx="16" ry="22" fill="var(--lamp)" stroke="#2a1606" stroke-width="4"/></g>
        <!-- Caisses -->
        <g stroke="#2a1606" stroke-width="5"><rect x="60" y="420" width="110" height="90" fill="url(#wood)"/><path d="M60 420l110 90M170 420l-110 90" stroke-width="3"/>
          <rect x="1150" y="440" width="90" height="72" fill="url(#wood)"/></g>
      </svg>
      <div class="shop-title"><h1 class="node-title">${o.title}</h1></div>
      <div class="shop-stall" title="Voir les articles"></div>
      ${o.keeper ? `<button class="shop-keeper ${o.keeperCls ?? ''}"><img src="${o.keeper}" alt=""><span class="shop-bubble">${o.bubble}</span></button>` : `<p class="shop-bubble alone">${o.bubble}</p>`}
      <div class="shop-scene-actions">${o.actions}</div>
      ${o.carpet ? `<div class="carpet-wrap"><div class="carpet">${o.carpet}</div></div>` : ''}
    </div>`;
}

/** Événement mystère. */
export function renderEvent(root: HTMLElement, run: Run, done: Done, forcedId?: string, onFight?: (f: EventFight) => void): void {
  // Environ 4 événements sur 10 sont des arcanes majeurs, les autres des rencontres Pokémon ; jamais deux fois le même dans une run
  const fresh = (list: GameEvent[]) => list.filter((e) => !run.seenEvents.includes(e.id));
  const tarot = fresh(TAROT_EVENTS), classic = fresh(EVENTS);
  const pool = tarot.length && (run.rng.next() < 0.4 || !classic.length) ? tarot : classic.length ? classic : EVENTS;
  const forced = forcedId?.replace(/-inverse$/, '');
  const ev: GameEvent = [...TAROT_EVENTS, ...EVENTS].find((e) => e.id === forced) ?? run.rng.pick(pool);
  run.seenEvents.push(ev.id);
  // Arcane inversé (1 chance sur 4) : la carte est retournée, avec des effets extrêmes
  const reversed = !!ev.reversed && (forcedId ? forcedId.endsWith('-inverse') : run.rng.next() < 0.25);
  const text = reversed ? ev.reversed!.text : ev.text;
  const choices = reversed ? ev.reversed!.choices : ev.choices;
  const title = reversed ? `${ev.title} (inversé)` : ev.title;
  const refreshBar = () => {
    root.querySelector('.tb-hp')!.textContent = `PV ${run.hp}/${run.maxHp}`;
    root.querySelector('.tb-money')!.textContent = `${run.money} ₽`;
    root.querySelector('.tb-deck')!.textContent = `Deck ${run.deck.length}`;
  };
  const showResult = (text: string) => {
    root.querySelector('.event-choices')!.innerHTML = `<p class="event-result">${esc(text)}</p><button class="btn primary leave">Continuer</button>`;
    root.querySelector('.leave')!.addEventListener('click', done);
    refreshBar();
  };
  const art = ev.tarot
    ? (ev.image
      ? `<img class="tarot-card ${reversed ? 'reversed' : ''}" src="${asset(ev.image)}" alt="${esc(ev.title)}">`
      : `<div class="tarot-card tarot-blank"><span>${esc(ev.title.split(' — ')[0])}</span><img src="${asset(ev.sprite ?? '')}" alt=""><b>${esc(ev.title.split(' — ')[1] ?? '')}</b></div>`)
    : `<img class="event-img ${ev.image.includes('sprites/pokemon') ? 'poke' : ''}" src="${asset(ev.image)}" alt="">`;
  root.innerHTML = shell(run, 'Événement', `
    <div class="event-panel ${ev.tarot ? 'tarot' : ''} ${reversed ? 'is-reversed' : ''}">
      ${art}
      <div class="event-side">
        <h1 class="node-title">${esc(title)}</h1>
        <p class="event-text">${esc(text)}</p>
        <div class="event-choices">
          ${choices.map((c, i) => {
            const ok = c.available?.(run) ?? true;
            return `<button class="choice" data-i="${i}" ${ok ? '' : 'disabled'}><b>${esc(c.label)}</b><span>${esc(c.detail)}</span></button>`;
          }).join('')}
        </div>
      </div>
    </div>`, 'event');
  bindDeck(root, run);
  const results: string[] = [];
  const doPick = (p: EventPick, left: number) => {
    const cards = p.pick === 'ameliorer' ? run.deck.filter((c) => !c.upgraded && c.defId !== 'voeu-brise')
      : p.pick === 'enchanter' ? run.deck.filter((c) => { const d = cardDef(c.defId, c.upgraded); return !d.enchant && d.category !== 'statut' && !d.keywords?.includes('injouable'); })
      : run.deck;
    if (!cards.length) return showResult([...results, 'Aucune carte ne convient.'].join(' '));
    openDeckOverlay(root, {
      title: p.text, cards, upgradePreview: p.pick === 'ameliorer', cancelLabel: results.length || p.pick === 'monde' ? 'Terminer' : 'Annuler',
      onPick: (uid) => {
        const card = run.deck.find((c) => c.uid === uid)!;
        const name = cardDef(card.defId).name;
        if (p.pick === 'ameliorer') { run.upgradeCard(uid); results.push(`${name} est améliorée !`); }
        else if (p.pick === 'retirer') { run.removeCard(uid); results.push(`Tu as oublié ${name}.`); }
        else if (p.pick === 'dupliquer') { run.addCard(card.defId, card.upgraded); results.push(`${name} est dupliquée.`); }
        else if (p.pick === 'enchanter') {
          const k = run.enchantCard(uid);
          const tier = k ? (ENCHANTS[k].rarity === 'legendaire' ? ' ★ LÉGENDAIRE !' : ENCHANTS[k].rarity === 'rare' ? ' ◆ Rare !' : '') : '';
          results.push(k ? `${name} est enchantée : ✦ ${ENCHANTS[k].name} (${ENCHANTS[k].text})${tier}` : `${name} ne peut pas être enchantée.`);
        }
        else if (p.pick === 'monde') {
          run.removeCard(uid);
          const id = run.foreignCard();
          run.addCard(id, card.upgraded);
          results.push(`${name} → ${cardDef(id).name}.`);
        }
        else {
          run.removeCard(uid);
          const id = run.cardChoices('combat', 1)[0];
          run.addCard(id);
          results.push(`${name} devient ${cardDef(id).name} !`);
        }
        refreshBar();
        if (left > 1 && run.deck.length > 1) return doPick({ ...p, text: p.pick === 'monde' ? `Encore ${left - 1} au maximum. ${results.join(' ')}` : `Encore ${left - 1} carte${left - 1 > 1 ? 's' : ''} : ${p.text}` }, left - 1);
        if (p.then) return doPick({ pick: p.then, text: p.then === 'ameliorer' ? 'Puis, quelle carte renaît plus forte ?' : 'Choisis une carte.' }, 1);
        showResult(results.join(' '));
      },
      onCancel: () => showResult(results.length ? results.join(' ') : 'Tu renonces et reprends ta route.'),
    }, run);
  };
  root.querySelectorAll<HTMLElement>('.event-choices .choice').forEach((b) =>
    b.addEventListener('click', () => {
      const r = choices[Number(b.dataset.i)].apply(run);
      refreshBar();
      if (typeof r === 'string') return showResult(r);
      if ('fight' in r) {
        root.querySelector('.event-choices')!.innerHTML = `<p class="event-result">${esc(r.text)}</p><button class="btn primary leave">Combattre !</button>`;
        root.querySelector('.leave')!.addEventListener('click', () => (onFight ? onFight(r) : done()));
        return;
      }
      doPick(r, r.count ?? 1);
    }));
}

/** Trésor : une Poké Ball qui contient un objet tenu et quelques Pokédollars. */
export function renderTreasure(root: HTMLElement, run: Run, done: Done): void {
  const relic = run.rollRelics(1)[0];
  renderReward(root, run, { money: run.rng.int(20, 40), cards: [], relic, title: 'Une Poké Ball scintillante !', label: 'Trésor' }, done);
}

/** Fin de run : défaite ou gardien vaincu, avec l'EXP gagnée et les cartes débloquées. */
export function renderRunEnd(
  root: HTMLElement, run: Run, victory: boolean,
  xp: { exp: number; lines: ExpLine[]; before: number; after: number; newCards: string[]; newRelics: string[]; total: number },
  onMenu: Done, onRetry: Done,
): void {
  const name = CHARACTERS[run.character].name;
  const startTotal = xp.total - xp.exp;
  const startLvl = xp.before;
  root.innerHTML = `
    <div class="run-end ${victory ? 'win' : 'lose'}">
      <h1>${victory ? 'Dialga Primal est apaisé !' : 'Fin de la run'}</h1>
      <p>${victory
        ? `${esc(name)} a atteint le sommet de la Tour du Temps et rendu au temps son cours. Les engrenages se remettent à tourner… Merci d'avoir joué !`
        : `${esc(name)} est tombé à l'étage ${run.floor} de la Tour du Temps.`}</p>
      <div class="run-stats">
        <div><b>${run.floor}</b><span>étage atteint</span></div>
        <div><b>${run.elitesDefeated}</b><span>dominants vaincus</span></div>
        <div><b>${run.deck.length}</b><span>cartes dans le deck</span></div>
      </div>
      <div class="exp-box">
        <div class="exp-detail">${xp.lines.map((l, i) => `
          <div class="exp-row" style="--d:${i}">
            <span>${esc(l.label)}${l.count !== undefined ? ` <em>× ${l.count}</em>` : ''}</span>
            <b>+${l.amount}</b>
          </div>`).join('') || '<div class="exp-row" style="--d:0"><span>Aucune EXP cette fois…</span><b>+0</b></div>'}
        </div>
        <div class="exp-line"><b class="exp-total">+0 EXP</b> pour ${esc(name)} · <span class="exp-lvl">niveau ${startLvl}</span> <span class="lvl-up" hidden>Niveau supérieur !</span></div>
        <div class="exp-bar"><div class="exp-fill"></div></div>
        <div class="exp-next"></div>
      </div>
      ${xp.newCards.length ? `
        <p class="unlock-title">Nouvelles capacités débloquées :</p>
        <div class="unlock-row">${xp.newCards.map((id) => renderCard(cardDef(id))).join('')}</div>` : ''}
      ${xp.newRelics.length ? `
        <p class="unlock-title">Nouveaux objets tenus débloqués :</p>
        <div class="reward-line">${xp.newRelics.map((id) => relicCard(id)).join('')}</div>` : ''}
      <div class="end-buttons">
        <button class="btn primary retry">Nouvelle run</button>
        <button class="btn menu">Menu principal</button>
      </div>
    </div>`;
  root.querySelector('.retry')!.addEventListener('click', onRetry);
  root.querySelector('.menu')!.addEventListener('click', onMenu);
  animateExp(root, xp.lines.length, startTotal, xp.total, () => { if (xp.after > xp.before) showLevelUp(root, run.character, xp); });
}

/** Barre d'EXP animée : les lignes apparaissent une à une, le total compte, puis la barre se remplit (niveau par niveau). */
function animateExp(root: HTMLElement, nLines: number, from: number, to: number, done: () => void): void {
  const fill = root.querySelector<HTMLElement>('.exp-fill')!;
  const totalEl = root.querySelector<HTMLElement>('.exp-total')!;
  const lvlEl = root.querySelector<HTMLElement>('.exp-lvl')!;
  const upEl = root.querySelector<HTMLElement>('.lvl-up')!;
  const nextEl = root.querySelector<HTMLElement>('.exp-next')!;
  const show = (v: number) => {
    const lvl = levelFor(v);
    const cur = LEVEL_EXP[lvl - 1];
    const next = lvl < MAX_LEVEL ? LEVEL_EXP[lvl] : null;
    fill.style.width = `${next ? ((v - cur) / (next - cur)) * 100 : 100}%`;
    lvlEl.textContent = `niveau ${lvl}`;
    nextEl.textContent = next ? `${v - cur} / ${next - cur} EXP avant le niveau ${lvl + 1}` : 'Niveau maximum atteint';
    return lvl;
  };
  let lvl = show(from);
  const startDelay = 350 * Math.max(1, nLines) + 300;
  const gain = to - from;
  const dur = Math.min(3200, 900 + gain * 4);
  setTimeout(() => {
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 2);
      const v = Math.round(from + gain * e);
      totalEl.textContent = `+${v - from} EXP`;
      const l = show(v);
      if (l > lvl) {
        lvl = l;
        upEl.hidden = false;
        upEl.classList.remove('pop'); void upEl.offsetWidth; upEl.classList.add('pop');
        fill.parentElement!.classList.remove('flash'); void fill.offsetWidth; fill.parentElement!.classList.add('flash');
        sfx('soin');
      }
      if (k < 1) requestAnimationFrame(step);
      else setTimeout(done, 600);
    };
    requestAnimationFrame(step);
  }, startDelay);
}

/** Écran « Niveau supérieur ! » : les capacités et objets débloqués, niveau par niveau, avec le design des cartes. */
function showLevelUp(
  root: HTMLElement, character: CharacterId,
  xp: { before: number; after: number; newCards: string[]; newRelics: string[] },
): void {
  const table = UNLOCKS[character];
  const relicTable = RELIC_UNLOCKS[character] ?? {};
  const levels: { lvl: number; cards: string[]; relics: string[] }[] = [];
  for (let l = xp.before + 1; l <= xp.after; l++) {
    levels.push({
      lvl: l,
      cards: table && character !== 'mew' ? (table[l] ?? []).filter((id) => xp.newCards.includes(id)) : [],
      relics: (relicTable[l] ?? []).filter((id) => xp.newRelics.includes(id)),
    });
  }
  // Mew : ses déblocages mêlent ceux des autres personnages, on les montre en un seul groupe
  if (character === 'mew' || !table) levels[levels.length - 1].cards = xp.newCards;
  const name = CHARACTERS[character].name;
  const el = document.createElement('div');
  el.className = 'levelup';
  el.innerHTML = `
    <div class="levelup-inner">
      <img class="levelup-sprite" src="${asset(`sprites/pokemon/front/${CHARACTERS[character].dex[0]}.png`)}" alt="">
      <h1>Niveau ${xp.after} !</h1>
      <p>${esc(name)} ${xp.after - xp.before > 1 ? `gagne ${xp.after - xp.before} niveaux` : 'monte de niveau'} et peut apprendre de nouvelles capacités.</p>
      ${levels.map((g) => `
        <div class="levelup-group">
          ${levels.length > 1 ? `<h2>Niveau ${g.lvl}</h2>` : ''}
          <div class="levelup-cards">
            ${g.cards.map((id, i) => `<div class="levelup-card" style="--d:${i * 90}ms">${renderCard(cardDef(id))}</div>`).join('')}
            ${g.relics.map((id) => `<div class="levelup-relic">${relicCard(id)}</div>`).join('')}
          </div>
        </div>`).join('')}
      <button class="btn primary levelup-ok">Continuer</button>
    </div>`;
  root.appendChild(el);
  el.querySelector('.levelup-ok')!.addEventListener('click', () => el.remove());
}

/** Évolution entre deux actes : « Riolu évolue en Lucario ! » avec les deux sprites. */
function evolutionHtml(run: Run): string {
  const evo = run.justEvolved;
  if (run.character === 'kangourex' && run.act <= 4) {
    return `<div class="act-evo"><img src="${asset('sprites/pokemon/bebe-kangourex-v2.png')}" alt=""><p>Le Bébé grandit : <b>+3 PV max</b> pour lui à chaque combat.</p></div>`;
  }
  if (!evo) return '';
  const gain = CHARACTERS[run.character].evolutions!.find((e) => e.act === run.act)!.hp;
  return `
    <div class="act-evo">
      <img class="evo-from" src="${asset(`sprites/pokemon/front/${evo.from.dex}.png`)}" alt="">
      <span class="evo-arrow">➜</span>
      <img class="evo-to" src="${asset(`sprites/pokemon/front/${evo.to.dex}.png`)}" alt="">
      <p><b>${esc(evo.from.name)} évolue en ${esc(evo.to.name)} !</b><br>PV max +${gain}${evo.to.types.length > evo.from.types.length ? ` · nouveau type : ${evo.to.types.slice(evo.from.types.length).map((t) => TYPE_LABELS[t]).join(', ')}` : ''}</p>
    </div>`;
}

const ACT_TITLES: Record<number, string> = { 1: 'La base de la tour', 2: 'Le cœur de la tour', 3: 'Les hauteurs', 4: 'Le sommet' };

/** Écran de passage d'un acte à l'autre. */
export function renderActIntro(root: HTMLElement, run: Run, done: Done): void {
  const z = run.zone;
  root.innerHTML = `
    <div class="act-intro" style="--sky:${z.palette[0]};--ground:${z.palette[1]};--shade:${z.palette[2]}">
      <p class="act-num">${run.act >= 4 ? 'Dernière étape' : `Acte ${run.act}`}</p>
      <h1>${esc(ACT_TITLES[run.act] ?? '')}</h1>
      <p class="act-zone">Une faille temporelle mène à <b>${esc(z.name)}</b><br><small>${esc(z.region)} · ${esc(z.season)}</small></p>
      ${evolutionHtml(run)}
      <p class="act-heal">${esc(run.form.name)} reprend son souffle : PV restaurés (${run.hp}/${run.maxHp}).</p>
      <button class="btn primary go">Continuer l'ascension</button>
    </div>`;
  root.querySelector('.go')!.addEventListener('click', done);
}

const SUMMIT_INFO: Record<string, { label: string; text: string; icon: string }> = {
  centre: { label: 'Centre Pokémon', text: 'Un dernier repos avant Dialga.', icon: 'centre' },
  boutique: { label: 'Marché Kecleon', text: 'Kecleon a suivi jusqu’ici. Dernières emplettes.', icon: 'boutique' },
  elite: { label: 'Noctunoir', text: 'Le gardien des ombres barre le passage.', icon: 'elite' },
  boss: { label: 'Dialga Primal', text: 'Le maître du temps, devenu fou. Apaise-le.', icon: 'boss' },
};

/** Le sommet : un escalier de quatre étapes. */
export function renderSummit(root: HTMLElement, run: Run, onNext: Done): void {
  const steps = ['elite', 'centre', 'boutique', 'boss'];
  const z = run.zone;
  root.innerHTML = `
    <div class="summit" style="--sky:${z.palette[0]};--ground:${z.palette[1]};--shade:${z.palette[2]}">
      ${topbar(run, `${z.name}`)}
      <div class="weather weather-temps">${weatherParticles('temps')}</div>
      <h1 class="summit-title">Sommet de la Tour du Temps</h1>
      <div class="summit-steps">
        ${steps.map((s, i) => {
          const info = SUMMIT_INFO[s];
          const state = i < run.summitStep ? 'done' : i === run.summitStep ? 'next' : 'later';
          const img = s === 'boss' ? `<img class="summit-boss primal" src="${asset('sprites/pokemon/front/483.png')}" alt="">`
            : s === 'elite' ? `<img src="${asset('sprites/pokemon/front/477.png')}" alt="">`
            : s === 'boutique' ? `<img src="${asset('sprites/pokemon/front/352.png')}" alt="">`
            : '<span class="summit-cross">✚</span>';
          return `<button class="summit-step ${state} step-${s}" ${state === 'next' ? '' : 'disabled'}>
              <div class="summit-icon">${img}</div>
              <div class="summit-label"><b>${esc(info.label)}</b><small>${state === 'done' ? 'Terminé' : esc(info.text)}</small></div>
            </button>`;
        }).join('<div class="summit-link"></div>')}
      </div>
    </div>`;
  root.querySelector('.summit-step.next')?.addEventListener('click', onNext);
  bindDeck(root, run);
}
