// Nouveaux nœuds de la carte : Coffre mystère, Pension Pokémon (fusion de cartes), Marchand de CT.
import type { Run } from '../core/run';
import { cardPrice } from '../core/run';
import { ENCHANTS, canFuse, cardDef, enchantId, fusionId, rollEnchant } from '../data/cards';
import { CHARACTERS } from '../data/characters';
import { renderCard } from './card';
import { bindDeck, renderReward, shell, shopScene } from './node-views';
import { openDeckOverlay, topbar } from './run-ui';
import { asset, esc } from './util';
import { sfx } from '../audio/audio';

type Done = () => void;

const refreshBar = (root: HTMLElement, run: Run, label: string) => {
  const bar = root.querySelector('.topbar');
  if (bar) bar.outerHTML = topbar(run, label);
  bindDeck(root, run);
};

/** Coffre mystère : Pokédollars + objet tenu ou baie (parfois un gros trésor). */
export function renderChest(root: HTMLElement, run: Run, done: Done): void {
  const big = run.rng.next() < 0.25;
  root.innerHTML = shell(run, 'Coffre mystère', `
    <div class="chest">${chestSvg()}</div>
    <h1 class="node-title">Un coffre mystère</h1>
    <p class="node-sub">Il a l’air ancien. Quelque chose tinte à l’intérieur…</p>
    <div class="choice-row">
      <button class="choice open"><b>Ouvrir le coffre</b><span>Que peut-il bien contenir ?</span></button>
      <button class="choice leave-chest"><b>Le laisser</b><span>Prudence est mère de sûreté</span></button>
    </div>`, 'reward');
  bindDeck(root, run);
  root.querySelector('.leave-chest')!.addEventListener('click', done);
  root.querySelector('.open')!.addEventListener('click', () => {
    const money = run.rng.int(big ? 60 : 25, big ? 110 : 55);
    const withRelic = big || run.rng.next() < 0.5;
    renderReward(root, run, {
      money, cards: [], relic: withRelic ? run.rollRelics(1)[0] : undefined, berry: withRelic ? undefined : run.rollBerry(),
      title: big ? 'Un gros trésor !' : 'Le coffre s’ouvre…', label: 'Coffre mystère',
    }, done);
    sfx('victoire');
  });
}

function chestSvg(open = false): string {
  return `<svg viewBox="0 0 120 100">
    <rect x="14" y="44" width="92" height="48" rx="6" fill="#8a5426" stroke="#2d1806" stroke-width="5"/>
    <rect x="14" y="50" width="92" height="8" fill="#f5c84c" stroke="#2d1806" stroke-width="3"/>
    <rect x="52" y="52" width="16" height="20" rx="3" fill="#f5c84c" stroke="#2d1806" stroke-width="3"/>
    <g class="lid" ${open ? 'transform="rotate(-28 14 46)"' : ''}><path d="M14 48c0-26 20-36 46-36s46 10 46 36z" fill="#b06c30" stroke="#2d1806" stroke-width="5"/>
    <rect x="14" y="42" width="92" height="7" fill="#f5c84c" stroke="#2d1806" stroke-width="3"/></g>
  </svg>`;
}

/** Pension Pokémon : choisis deux cartes, elles fusionnent en une seule (effets cumulés, coût réduit d'1). */
export function renderPension(root: HTMLElement, run: Run, done: Done): void {
  const label = 'Pension Pokémon';
  const eligible = () => run.deck.filter((c) => {
    const d = cardDef(c.defId, c.upgraded);
    return run.deck.some((o) => o.uid !== c.uid && canFuse(d, cardDef(o.defId, o.upgraded)));
  });
  root.innerHTML = shell(run, label, `
    <img class="pension-egg" src="${asset('sprites/items/lucky-egg.png')}" alt="">
    <h1 class="node-title">Pension Pokémon</h1>
    <p class="node-sub">« On s’occupe de tes capacités ! Confie-m’en deux, elles n’en feront plus qu’une. »<br>
      <small>La carte fusionnée a les effets des deux cartes et coûte la somme des deux moins 1 (au moins le coût de la plus chère).
      Pas de talent ni de malédiction, et pas une attaque « tous les ennemis » avec une attaque « un ennemi ».</small></p>
    <div class="choice-row">
      <button class="choice fuse" ${eligible().length >= 2 ? '' : 'disabled'}><b>Fusionner deux cartes</b><span>Ton deck perd une carte, mais elle devient plus forte</span></button>
      <button class="choice leave-p"><b>Repartir</b><span>Pas aujourd’hui</span></button>
    </div>`, 'centre');
  bindDeck(root, run);
  root.querySelector('.leave-p')!.addEventListener('click', done);
  root.querySelector('.fuse')!.addEventListener('click', () => {
    openDeckOverlay(root, {
      title: 'Choisis la première carte', cards: eligible(), cancelLabel: 'Retour',
      onPick: (uidA) => {
        const a = run.deck.find((c) => c.uid === uidA)!;
        const da = cardDef(a.defId, a.upgraded);
        const partners = run.deck.filter((o) => o.uid !== uidA && canFuse(da, cardDef(o.defId, o.upgraded)));
        openDeckOverlay(root, {
          title: `${da.name} + … ? Choisis la deuxième carte`, cards: partners, cancelLabel: 'Retour',
          onPick: (uidB) => {
            const b = run.deck.find((c) => c.uid === uidB)!;
            const id = fusionId(a.defId, a.upgraded, b.defId, b.upgraded);
            run.removeCard(uidA);
            run.removeCard(uidB);
            run.addCard(id);
            sfx('soin');
            root.querySelector('.node-body')!.innerHTML = `
              <h1 class="node-title">Fusion réussie !</h1>
              <div class="card-row fusion-result">${renderCard(cardDef(id))}</div>
              <button class="btn primary leave">Continuer</button>`;
            refreshBar(root, run, label);
            root.querySelector('.leave')!.addEventListener('click', done);
          },
        }, run);
      },
    }, run);
  });
}

/** Marchand de CT : 3 capacités d'autres Pokémon, à acheter. */
export function renderTmShop(root: HTMLElement, run: Run, done: Done): void {
  const label = 'Marchand de CT';
  const ids = new Set<string>();
  for (let i = 0; i < 60 && ids.size < 3; i++) { const id = run.foreignCard(); if (cardDef(id).character !== 'normal') ids.add(id); }
  const offers = [...ids].map((id) => ({ id, price: Math.round(cardPrice(id) * 1.3), sold: false }));
  const draw = () => {
    root.innerHTML = shell(run, label, `
      <div class="kecleon-head">
        <img class="kecleon" src="${asset('sprites/pokemon/front/137.png')}" onerror="this.style.display='none'" alt="">
        <div>
          <h1 class="node-title">Marchand de CT</h1>
          <p class="node-sub">« Des Capsules Techniques venues de partout ! Des capacités que ton Pokémon n’apprendrait jamais seul… »</p>
        </div>
      </div>
      <div class="card-row shop">${offers.map((o, i) => {
        const d = cardDef(o.id);
        const who = CHARACTERS[d.character as keyof typeof CHARACTERS]?.name;
        return `<div class="shop-item ${o.sold ? 'sold' : ''} ${!o.sold && run.money < o.price ? 'poor' : ''}" data-i="${i}">
          ${renderCard(d)}
          <div class="price">${o.sold ? 'Vendu' : `${o.price} ₽`}</div>
          ${who ? `<small class="tm-from">CT de ${esc(who)}</small>` : ''}
        </div>`;
      }).join('')}</div>
      <div class="shop-actions"><button class="btn leave">Repartir</button></div>`, 'shop-screen');
    bindDeck(root, run);
    root.querySelector('.leave')!.addEventListener('click', done);
    root.querySelectorAll<HTMLElement>('.shop-item').forEach((el) => el.addEventListener('click', () => {
      const o = offers[Number(el.dataset.i)];
      if (o.sold || run.money < o.price) return;
      run.money -= o.price;
      run.addCard(o.id);
      o.sold = true;
      sfx('baie');
      draw();
    }));
  };
  draw();
}

/** Annonce d'un « ? » qui cache un combat, un trésor ou le Marché noir. */
export function mysteryScreen(root: HTMLElement, run: Run, title: string, text: string, go: Done): void {
  root.innerHTML = shell(run, 'Événement', `
    <div class="mystery-q">?</div>
    <h1 class="node-title">${esc(title)}</h1>
    <p class="node-sub">${esc(text)}</p>
    <button class="btn primary go">Continuer</button>`, 'event');
  bindDeck(root, run);
  root.querySelector('.go')!.addEventListener('click', go);
}

/** Marché noir (dans les « ? ») : un Kecleon violet vend 3 cartes enchantées, plus chères. */
export function renderBlackMarket(root: HTMLElement, run: Run, done: Done): void {
  const label = 'Marché noir';
  const offers = run.cardChoices('boutique', 3).map((id) => {
    const base = cardDef(id);
    const k = rollEnchant(base, () => run.rng.next()) ?? 'garde';
    return { id: enchantId(k, id), k, price: Math.round(cardPrice(id) * 1.6), sold: false };
  });
  let open = false;
  const draw = () => {
    const carpet = `
      <div class="carpet-head"><h2>Capacités enchantées</h2><button class="btn close-carpet">← Retour à l’échoppe</button></div>
      <div class="card-row shop">${offers.map((o, i) => `
        <div class="shop-item ${o.sold ? 'sold' : ''} ${!o.sold && run.money < o.price ? 'poor' : ''}" data-i="${i}">
          ${renderCard(cardDef(o.id))}
          <div class="price">${o.sold ? 'Vendu' : `${o.price} ₽`}</div>
          <small class="ench-tag ${ENCHANTS[o.k].rarity ?? 'commun'}">${ENCHANTS[o.k].rarity === 'legendaire' ? '★ Légendaire — ' : ENCHANTS[o.k].rarity === 'rare' ? '◆ Rare — ' : ''}✦ ${esc(ENCHANTS[o.k].name)} : ${esc(ENCHANTS[o.k].text)}</small>
        </div>`).join('')}</div>`;
    root.innerHTML = shell(run, label, shopScene({
      keeper: asset('sprites/pokemon/kecleon-violet.png'), keeperCls: 'hd', theme: 'dark', title: 'Marché noir', bg: 'backgrounds/marche-noir.jpg',
      bubble: 'Psst… Des capacités enchantées, introuvables ailleurs. Clique sur moi…',
      actions: '<button class="btn primary leave">Repartir</button>', carpet: open ? carpet : '',
    }), 'shop-screen shop-place');
    bindDeck(root, run);
    root.querySelector('.leave')?.addEventListener('click', done);
    root.querySelector('.shop-keeper')?.addEventListener('click', () => { open = true; draw(); });
    root.querySelector('.shop-stall')?.addEventListener('click', () => { open = true; draw(); });
    root.querySelector('.close-carpet')?.addEventListener('click', () => { open = false; draw(); });
    root.querySelectorAll<HTMLElement>('.shop-item').forEach((el) => el.addEventListener('click', () => {
      const o = offers[Number(el.dataset.i)];
      if (o.sold || run.money < o.price) return;
      run.money -= o.price;
      run.addCard(o.id);
      o.sold = true;
      sfx('baie');
      draw();
    }));
  };
  draw();
}
