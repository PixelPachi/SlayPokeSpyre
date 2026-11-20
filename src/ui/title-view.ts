// Écran titre et Glossaire (objets tenus, baies, Pokémon croisés et leur version chromatique).
import type { SaveData } from '../core/save';
import { allRelics } from '../data/relics';
import { BERRIES } from '../data/berries';
import { ENEMY_DEFS } from '../data/enemies';
import { berryCard, relicCard } from './run-ui';
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

type Tab = 'objets' | 'baies' | 'pokemon';

export function renderGlossary(root: HTMLElement, save: SaveData, onBack: () => void): void {
  let tab: Tab = 'objets';
  const seen = new Set(save.seen ?? []);
  const shiny = new Set(save.seenShiny ?? []);
  // Un Pokémon par n° (les variantes de duel partagent le même Pokémon)
  const mons = [...new Map(Object.values(ENEMY_DEFS).map((e) => [e.dex, e.name.replace(/ \(.*\)$/, '')])).entries()].sort((a, b) => a[0] - b[0]);
  const relics = allRelics();
  const order = ['depart', 'commun', 'peu-commun', 'rare', 'gardien'];
  const label: Record<string, string> = { depart: 'Objets de départ', commun: 'Communs', 'peu-commun': 'Peu communs', rare: 'Rares', gardien: 'Reliques de gardien' };

  const body = (): string => {
    if (tab === 'objets') {
      return order.map((r) => {
        const list = relics.filter((x) => x.rarity === r);
        return list.length ? `<h3>${label[r]} · ${list.length}</h3><div class="gl-grid">${list.map((x) => relicCard(x.id)).join('')}</div>` : '';
      }).join('');
    }
    if (tab === 'baies') {
      return `<p class="gl-note">Les effets des baies arriveront bientôt.</p><div class="gl-grid">${BERRIES.map((b) => berryCard(b.id)).join('')}</div>`;
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
            ${(['objets', 'baies', 'pokemon'] as Tab[]).map((t) => `<button class="gl-tab ${t === tab ? 'on' : ''}" data-tab="${t}">${t === 'objets' ? 'Objets tenus' : t === 'baies' ? 'Baies' : 'Pokémon'}</button>`).join('')}
          </div>
        </div>
        <div class="gl-body">${body()}</div>
      </div>`;
  };
  root.onclick = (ev) => {
    const t = ev.target as HTMLElement;
    const b = t.closest<HTMLElement>('.gl-tab');
    if (b) { tab = b.dataset.tab as Tab; return draw(); }
    if (t.closest('.gl-back')) { root.onclick = null; onBack(); }
  };
  draw();
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
