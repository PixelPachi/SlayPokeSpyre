// Écrans des nœuds hors combat : récompenses, Centre Pokémon, Marché Kecleon, événement, trésor, fin de run.
import type { Run } from '../core/run';
import { cardPrice } from '../core/run';
import { cardDef } from '../data/cards';
import { LEVEL_EXP, MAX_LEVEL } from '../data/unlocks';
import { CHARACTERS } from '../data/characters';
import { EVENTS, type GameEvent } from '../data/events';
import { renderCard } from './card';
import { SHINY_CHANCE } from '../core/combat';
import { CHARACTER_COLORS } from './labels';
import { openDeckOverlay, relicCard, topbar } from './run-ui';
import { relicPrice } from '../data/relics';
import { asset, esc } from './util';

type Done = () => void;

function shell(run: Run, label: string, body: string, cls = ''): string {
  return `<div class="node-screen ${cls}">${topbar(run, label)}<div class="node-body">${body}</div></div>`;
}

function bindDeck(root: HTMLElement, run: Run): void {
  root.querySelector('.tb-deck')?.addEventListener('click', () => openDeckOverlay(root, { title: 'Ton deck' }, run));
}

/** Récompenses après un combat : Pokédollars puis 1 carte parmi 3 (ou passer). */
export function renderReward(
  root: HTMLElement, run: Run, o: { money: number; cards: string[]; title: string; label: string; relic?: string }, done: Done,
): void {
  run.money += o.money;
  if (o.relic) run.addRelic(o.relic);
  root.innerHTML = shell(run, o.label, `
    <h1 class="node-title">${esc(o.title)}</h1>
    <div class="reward-line">
      <div class="reward-money">+${o.money} ₽</div>
      ${o.relic ? relicCard(o.relic, '<em>Objet tenu obtenu !</em>') : ''}
    </div>
    <p class="node-sub">Choisis une capacité à apprendre :</p>
    <div class="card-row">${o.cards.map((id) => renderCard(cardDef(id), { classes: 'pickable' }).replace('class="card', `data-id="${id}" class="card`)).join('')}</div>
    <div class="reward-actions">
      <button class="btn primary take" disabled>Choisis une carte</button>
      <button class="btn skip">Passer</button>
    </div>`, 'reward');
  bindDeck(root, run);
  // Un clic choisit la carte, « Apprendre » confirme
  let picked: string | null = null;
  const take = root.querySelector<HTMLButtonElement>('.take')!;
  root.querySelector('.card-row')!.addEventListener('click', (ev) => {
    const c = (ev.target as HTMLElement).closest<HTMLElement>('.card');
    if (!c) return;
    picked = c.dataset.id!;
    root.querySelectorAll('.card-row .card').forEach((x) => x.classList.toggle('picked', x === c));
    take.disabled = false;
    take.textContent = `Apprendre ${cardDef(picked).name}`;
  });
  take.addEventListener('click', () => {
    if (!picked) return;
    run.addCard(picked);
    done();
  });
  root.querySelector('.skip')!.addEventListener('click', done);
}

/** Centre Pokémon : soigner 30 % des PV max OU améliorer une carte. */
export function renderCentre(root: HTMLElement, run: Run, done: Done): void {
  const heal = Math.floor(run.maxHp * 0.3);
  const upgradable = run.deck.filter((c) => !c.upgraded);
  root.innerHTML = shell(run, 'Centre Pokémon', `
    <h1 class="node-title">Centre Pokémon</h1>
    <p class="node-sub">« Bonjour ! Bienvenue au Centre Pokémon de la Tour du Temps. »</p>
    <div class="choice-row">
      <button class="choice heal"><b>Se soigner</b><span>Récupère ${Math.min(heal, run.maxHp - run.hp)} PV (30 % des PV max)</span></button>
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
export function renderShop(root: HTMLElement, run: Run, done: Done): void {
  const shiny = run.rng.next() < SHINY_CHANCE;
  const price = (p: number) => (shiny ? Math.floor(p / 2) : p);
  const offers = run.cardChoices('boutique', 5).map((id) => ({ id, price: price(cardPrice(id)), sold: false }));
  const items = run.rollRelics(2).map((id) => ({ id, price: price(relicPrice(id)), sold: false }));
  let pickedItem: number | null = null;
  const sale = run.rng.int(0, offers.length - 1);
  offers[sale].price = Math.floor(offers[sale].price / 2);
  let removed = false;
  let picked: number | null = null;

  const draw = () => {
    const removeCost = price(75 + 25 * run.removals);
    root.innerHTML = shell(run, 'Marché Kecleon', `
      <div class="kecleon-head ${shiny ? 'shiny' : ''}">
        <img class="kecleon" src="${asset(`sprites/pokemon/${shiny ? 'shiny' : 'front'}/352.png`)}" alt="Kecleon">
        <div>
          <h1 class="node-title">Marché Kecleon</h1>
          <p class="node-sub">${shiny
            ? '<b class="shiny-note">★ Kecleon chromatique ! Tous les prix sont divisés par deux.</b>'
            : '« Bienvenue ! Des capacités et des objets venus de toutes les régions ! »'}</p>
        </div>
      </div>
      <div class="card-row shop">
        ${offers.map((o, i) => `
          <div class="shop-item ${o.sold ? 'sold' : ''} ${run.money < o.price ? 'poor' : ''} ${picked === i ? 'picked' : ''}" data-i="${i}">
            ${renderCard(cardDef(o.id))}
            <div class="price">${o.sold ? 'Vendu' : `${o.price} ₽`}${i === sale && !o.sold ? ' <span class="sale">-50 %</span>' : ''}</div>
            ${picked === i && !o.sold ? `<button class="btn primary buy" ${run.money < o.price ? 'disabled' : ''}>${run.money < o.price ? 'Pas assez de ₽' : 'Acheter'}</button>` : ''}
          </div>`).join('')}
      </div>
      ${items.length ? `<div class="shop-relics">${items.map((o, i) => `
        <div class="shop-relic ${o.sold ? 'sold' : ''} ${pickedItem === i ? 'picked' : ''}" data-i="${i}">
          ${relicCard(o.id, `<span class="price">${o.sold ? 'Vendu' : `${o.price} ₽`}</span>`)}
          ${pickedItem === i && !o.sold ? `<button class="btn primary buy-relic" ${run.money < o.price ? 'disabled' : ''}>${run.money < o.price ? 'Pas assez de ₽' : 'Acheter'}</button>` : ''}
        </div>`).join('')}</div>` : ''}
      <div class="shop-actions">
        <button class="choice remove" ${removed || run.money < removeCost ? 'disabled' : ''}>
          <b>Oublier une capacité</b><span>${removed ? 'Déjà fait ici' : `${removeCost} ₽ — retire une carte du deck`}</span>
        </button>
        <button class="btn leave">Quitter le marché</button>
      </div>`, 'shop-screen');
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
    root.querySelectorAll<HTMLElement>('.shop-relic').forEach((el) =>
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
    root.querySelector('.remove')!.addEventListener('click', () =>
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
    root.querySelector('.leave')!.addEventListener('click', done);
  };
  draw();
}

/** Événement mystère. */
export function renderEvent(root: HTMLElement, run: Run, done: Done): void {
  const ev: GameEvent = run.rng.pick(EVENTS);
  const showResult = (text: string) => {
    root.querySelector('.event-choices')!.innerHTML = `<p class="event-result">${esc(text)}</p><button class="btn primary leave">Continuer</button>`;
    root.querySelector('.leave')!.addEventListener('click', done);
    root.querySelector('.tb-hp')!.textContent = `PV ${run.hp}/${run.maxHp}`;
    root.querySelector('.tb-money')!.textContent = `${run.money} ₽`;
    root.querySelector('.tb-deck')!.textContent = `Deck ${run.deck.length}`;
  };
  root.innerHTML = shell(run, 'Événement', `
    <div class="event-panel">
      <img class="event-img" src="${asset(ev.image)}" alt="">
      <h1 class="node-title">${esc(ev.title)}</h1>
      <p class="event-text">${esc(ev.text)}</p>
      <div class="event-choices">
        ${ev.choices.map((c, i) => {
          const ok = c.available?.(run) ?? true;
          return `<button class="choice" data-i="${i}" ${ok ? '' : 'disabled'}><b>${esc(c.label)}</b><span>${esc(c.detail)}</span></button>`;
        }).join('')}
      </div>
    </div>`, 'event');
  bindDeck(root, run);
  root.querySelectorAll<HTMLElement>('.event-choices .choice').forEach((b) =>
    b.addEventListener('click', () => {
      const r = ev.choices[Number(b.dataset.i)].apply(run);
      if (typeof r === 'string') return showResult(r);
      const cards = r.pick === 'ameliorer' ? run.deck.filter((c) => !c.upgraded) : run.deck;
      openDeckOverlay(root, {
        title: r.text, cards, upgradePreview: r.pick === 'ameliorer', cancelLabel: 'Annuler',
        onPick: (uid) => {
          const name = cardDef(run.deck.find((c) => c.uid === uid)!.defId).name;
          if (r.pick === 'ameliorer') run.upgradeCard(uid);
          else run.removeCard(uid);
          showResult(r.pick === 'ameliorer' ? `${name} est améliorée !` : `Tu as oublié ${name}.`);
        },
        onCancel: () => showResult('Tu renonces et reprends ta route.'),
      }, run);
    }));
}

/** Trésor : une Poké Ball qui contient un objet tenu et quelques Pokédollars. */
export function renderTreasure(root: HTMLElement, run: Run, done: Done): void {
  const relic = run.rollRelics(1)[0];
  const money = run.rng.int(20, 40);
  run.money += money;
  if (relic) run.addRelic(relic);
  root.innerHTML = shell(run, 'Trésor', `
    <img class="treasure-ball" src="${asset('sprites/items/poke-ball.png')}" alt="">
    <h1 class="node-title">Une Poké Ball scintillante !</h1>
    <div class="reward-line">
      <div class="reward-money">+${money} ₽</div>
      ${relic ? relicCard(relic, '<em>Objet tenu obtenu !</em>') : '<p class="node-sub">Elle ne contenait que des Pokédollars.</p>'}
    </div>
    <button class="btn primary leave">Continuer</button>`, 'reward');
  bindDeck(root, run);
  root.querySelector('.leave')!.addEventListener('click', done);
}

/** Fin de run : défaite ou gardien vaincu, avec l'EXP gagnée et les cartes débloquées. */
export function renderRunEnd(
  root: HTMLElement, run: Run, victory: boolean,
  xp: { exp: number; before: number; after: number; newCards: string[]; newRelics: string[]; total: number },
  onMenu: Done, onRetry: Done,
): void {
  const name = CHARACTERS[run.character].name;
  const lvl = xp.after;
  const cur = LEVEL_EXP[lvl - 1];
  const next = lvl < MAX_LEVEL ? LEVEL_EXP[lvl] : null;
  const pct = next ? Math.round(((xp.total - cur) / (next - cur)) * 100) : 100;
  root.innerHTML = `
    <div class="run-end ${victory ? 'win' : 'lose'}">
      <h1>${victory ? 'Acte 1 terminé !' : 'Fin de la run'}</h1>
      <p>${victory
        ? `${esc(name)} a vaincu le gardien de la zone ${esc(run.zone.name)}. La suite de la Tour du Temps arrive dans une prochaine version.`
        : `${esc(name)} est tombé à l'étage ${run.floor} de la Tour du Temps.`}</p>
      <div class="run-stats">
        <div><b>${run.floor}</b><span>étage atteint</span></div>
        <div><b>${run.elitesDefeated}</b><span>dominants vaincus</span></div>
        <div><b>${run.deck.length}</b><span>cartes dans le deck</span></div>
      </div>
      <div class="exp-box">
        <div class="exp-line"><b>+${xp.exp} EXP</b> pour ${esc(name)} · niveau ${lvl}${xp.after > xp.before ? ' <span class="lvl-up">Niveau supérieur !</span>' : ''}</div>
        <div class="exp-bar"><div style="width:${pct}%"></div></div>
        <div class="exp-next">${next ? `${xp.total - cur} / ${next - cur} EXP avant le niveau ${lvl + 1}` : 'Niveau maximum atteint'}</div>
      </div>
      ${xp.newCards.length ? `
        <p class="unlock-title">Nouvelles capacités débloquées :</p>
        ${xp.newCards.length <= 6
          ? `<div class="unlock-row">${xp.newCards.map((id) => renderCard(cardDef(id))).join('')}</div>`
          : `<div class="unlock-chips">${xp.newCards.map((id) => `<span class="chip" style="--c:${CHARACTER_COLORS[cardDef(id).character]}">${esc(cardDef(id).name)}</span>`).join('')}</div>`}` : ''}
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
}
