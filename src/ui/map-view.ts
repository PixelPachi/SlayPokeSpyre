// Carte de l'acte, façon Slay the Spire : on monte de nœud en nœud jusqu'au gardien.
import { BOSS_ROW, MAP_COLS, MAP_ROWS, type MapNode, type NodeType, type Run } from '../core/run';
import { ENEMY_DEFS } from '../data/enemies';
import { openDeckOverlay, topbar } from './run-ui';
import { asset } from './util';

const ROW_H = 92;
const COL_W = 104;
const LEFT = 330; // marge à gauche (légende)
const BOTTOM = 90;
const BOSS_GAP = 170;
const HEIGHT = BOTTOM + (MAP_ROWS - 1) * ROW_H + BOSS_GAP + 150;

export const NODE_INFO: Record<NodeType, { label: string; text: string }> = {
  combat: { label: 'Combat', text: 'Des Pokémon sauvages de la zone.' },
  evenement: { label: 'Événement', text: 'Une rencontre mystère, avec des choix.' },
  centre: { label: 'Centre Pokémon', text: 'Soigner 30 % des PV max, ou améliorer une carte.' },
  boutique: { label: 'Marché Kecleon', text: 'Acheter des cartes et des objets, oublier une carte. Si Kecleon est chromatique, tout est à moitié prix !' },
  elite: { label: 'Pokémon dominant', text: 'Un ennemi très fort, de meilleures récompenses.' },
  tresor: { label: 'Trésor', text: 'Une Poké Ball pleine de surprises.' },
  coffre: { label: 'Coffre mystère', text: 'Un coffre au trésor : Pokédollars et un objet tenu ou une baie. 2 au plus par acte.' },
  pension: { label: 'Pension Pokémon', text: 'Fusionne deux cartes de ton deck en une seule.' },
  ct: { label: 'Marchand de CT', text: 'Achète des capacités apprises par d’autres Pokémon.' },
  boss: { label: 'Gardien', text: 'Le boss de la zone.' },
};

const pos = (n: { row: number; col: number; dx?: number; dy?: number }) => ({
  x: LEFT + n.col * COL_W + (n.dx ?? 0),
  y: HEIGHT - BOTTOM - n.row * ROW_H + (n.dy ?? 0),
});
const BOSS_POS = { x: LEFT + ((MAP_COLS - 1) / 2) * COL_W, y: HEIGHT - BOTTOM - (MAP_ROWS - 1) * ROW_H - BOSS_GAP };

export function nodeIcon(type: NodeType, bossDex = 15): string {
  switch (type) {
    case 'combat':
      return '<svg viewBox="0 0 40 40"><path d="M8 34c2-10 2-16 0-24 4 6 6 14 6 24zM16 34c1-12 3-20 8-28-2 9-3 18-2 28zM24 34c2-8 5-14 10-18-4 6-6 12-5 18z" fill="#7ad04e" stroke="#1d3b12" stroke-width="2" stroke-linejoin="round"/></svg>';
    case 'evenement':
      return '<svg viewBox="0 0 40 40"><text x="20" y="31" text-anchor="middle" font-size="30" font-weight="900" fill="#f5d36b" stroke="#3b2a05" stroke-width="2" font-family="Nunito, sans-serif">?</text></svg>';
    case 'centre':
      return '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="#fff" stroke="#3a0d0d" stroke-width="2.5"/><path d="M5 20a15 15 0 0 1 30 0z" fill="#e8483f" stroke="#3a0d0d" stroke-width="2.5"/><path d="M17 11h6v6h6v6h-6v6h-6v-6h-6v-6h6z" fill="#fff" stroke="#3a0d0d" stroke-width="2"/></svg>';
    case 'boutique':
      return `<img class="kecleon-icon" src="${asset('sprites/pokemon/front/352.png')}" alt="">`;
    case 'elite':
      return '<svg viewBox="0 0 40 40"><path d="M6 10l7 6 7-10 7 10 7-6-3 22H9z" fill="#e8483f" stroke="#3a0d0d" stroke-width="2.5" stroke-linejoin="round"/><circle cx="15" cy="23" r="2.5" fill="#fff"/><circle cx="25" cy="23" r="2.5" fill="#fff"/></svg>';
    case 'tresor':
      return `<img src="${asset('sprites/items/poke-ball.png')}" alt="">`;
    case 'coffre':
      return '<svg viewBox="0 0 40 40"><rect x="6" y="16" width="28" height="18" rx="2" fill="#a0642c" stroke="#3b2208" stroke-width="2.5"/><path d="M6 18c0-8 6-11 14-11s14 3 14 11z" fill="#c07a36" stroke="#3b2208" stroke-width="2.5"/><rect x="6" y="17" width="28" height="4" fill="#f5c84c" stroke="#3b2208" stroke-width="1.5"/><rect x="17" y="18" width="6" height="8" rx="1" fill="#f5c84c" stroke="#3b2208" stroke-width="1.5"/></svg>';
    case 'pension':
      return `<img src="${asset('sprites/items/lucky-egg.png')}" alt="">`;
    case 'ct':
      return '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="#7a8fd8" stroke="#16204a" stroke-width="2.5"/><circle cx="20" cy="20" r="9" fill="#b9c6ff" stroke="#16204a" stroke-width="1.5"/><circle cx="20" cy="20" r="3" fill="#16204a"/><text x="20" y="13" text-anchor="middle" font-size="7" font-weight="900" fill="#16204a" font-family="Nunito, sans-serif">CT</text></svg>';
    case 'boss':
      return `<img src="${asset(`sprites/pokemon/front/${bossDex}.png`)}" alt="">`;
  }
}

export function renderMap(root: HTMLElement, run: Run, onPick: (row: number, col: number) => void): void {
  const zone = run.zone;
  const boss = ENEMY_DEFS[zone.boss];
  const avail = run.available();
  const isAvail = (n: MapNode) => avail !== 'boss' && avail.some((a) => a.row === n.row && a.col === n.col);
  const visited = (r: number, c: number) => run.visited.includes(`${r}-${c}`);
  const current = run.pos;

  // Chemins
  const lines: string[] = [];
  for (const row of run.map) {
    for (const n of row) {
      const a = pos(n);
      const targets = n.row === MAP_ROWS - 1 ? [BOSS_POS] : n.next.map((c) => pos(run.nodeAt(n.row + 1, c)!));
      const nextCols = n.row === MAP_ROWS - 1 ? [-1] : n.next;
      targets.forEach((b, i) => {
        const walked = visited(n.row, n.col) && (n.row === MAP_ROWS - 1 ? visited(BOSS_ROW, 0) : visited(n.row + 1, nextCols[i]));
        const fromHere = current && current.row === n.row && current.col === n.col;
        lines.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="path ${walked ? 'walked' : ''} ${fromHere ? 'open' : ''}"/>`);
      });
    }
  }

  const nodes = run.map.flat().map((n) => {
    const p = pos(n);
    const cls = [
      'map-node', `node-${n.type}`,
      isAvail(n) ? 'available' : '',
      visited(n.row, n.col) ? 'visited' : '',
      current && current.row === n.row && current.col === n.col ? 'current' : '',
    ].join(' ');
    return `<button class="${cls}" style="left:${p.x}px;top:${p.y}px" data-row="${n.row}" data-col="${n.col}"
              data-tip="<b>${NODE_INFO[n.type].label}</b><br>${NODE_INFO[n.type].text}">${nodeIcon(n.type)}</button>`;
  });
  const bossAvail = avail === 'boss';
  nodes.push(`<button class="map-node node-boss ${bossAvail ? 'available' : ''}" style="left:${BOSS_POS.x}px;top:${BOSS_POS.y}px"
      data-row="${BOSS_ROW}" data-col="0" data-tip="<b>Gardien : ${boss.name}</b><br>Le boss de la zone ${zone.name}.">${nodeIcon('boss', boss.dex)}</button>`);

  root.innerHTML = `
    <div class="map-screen">
      ${topbar(run, `${zone.name} · acte ${run.act}`)}
      <div class="map-scroll">
        <div class="map-canvas" style="height:${HEIGHT}px">
          <div class="map-title" style="top:${BOSS_POS.y - 130}px">Gardien : ${boss.name}</div>
          <svg class="map-lines" width="1280" height="${HEIGHT}">${lines.join('')}</svg>
          ${nodes.join('')}
        </div>
      </div>
      <div class="map-legend">
        <h3>Tour du Temps</h3>
        <p>Acte ${run.act} · ${zone.name}<br><small>Une faille venue de ${zone.region}</small></p>
        ${(['combat', 'evenement', 'centre', 'boutique', 'elite', 'tresor', 'coffre', 'pension', 'ct'] as NodeType[])
          .map((t) => `<div class="legend-row"><span class="legend-icon node-${t}">${nodeIcon(t)}</span>${NODE_INFO[t].label}</div>`).join('')}
        <p class="legend-hint">Clique sur un nœud qui brille pour avancer.</p>
      </div>
    </div>`;

  // Défilement : montrer l'étage actuel
  const scroll = root.querySelector<HTMLElement>('.map-scroll')!;
  const focusY = current ? pos({ row: Math.min(current.row, MAP_ROWS - 1), col: 0 }).y : HEIGHT;
  scroll.scrollTop = Math.max(0, focusY - scroll.clientHeight + 160);

  root.onclick = (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('.tb-deck')) return openDeckOverlay(root, { title: 'Ton deck' }, run);
    const b = t.closest<HTMLElement>('.map-node.available');
    if (!b) return;
    root.onclick = null;
    onPick(Number(b.dataset.row), Number(b.dataset.col));
  };
}
