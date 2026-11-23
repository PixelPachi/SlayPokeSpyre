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
// Nombre d'étages de la carte affichée (l'acte secret en a moins)
let ROWS = MAP_ROWS;
let HEIGHT = BOTTOM + (ROWS - 1) * ROW_H + BOSS_GAP + 150;

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
let BOSS_POS = { x: LEFT + ((MAP_COLS - 1) / 2) * COL_W, y: HEIGHT - BOTTOM - (ROWS - 1) * ROW_H - BOSS_GAP };

export function nodeIcon(type: NodeType, bossDex = 15): string {
  // Icônes peintes (Gemini) pour tous les lieux ; le gardien garde son sprite
  if (type !== 'boss') return `<img class="node-art" src="${asset(`ui/carte/${type}.png`)}" alt="">`;
  return `<img src="${asset(`sprites/pokemon/front/${bossDex}.png`)}" alt="">`;
}

export function renderMap(root: HTMLElement, run: Run, onPick: (row: number, col: number) => void): void {
  ROWS = run.map.length || MAP_ROWS;
  HEIGHT = BOTTOM + (ROWS - 1) * ROW_H + BOSS_GAP + 150;
  BOSS_POS = { x: LEFT + ((MAP_COLS - 1) / 2) * COL_W, y: HEIGHT - BOTTOM - (ROWS - 1) * ROW_H - BOSS_GAP };
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
      const targets = n.row === ROWS - 1 ? [BOSS_POS] : n.next.map((c) => pos(run.nodeAt(n.row + 1, c)!));
      const nextCols = n.row === ROWS - 1 ? [-1] : n.next;
      targets.forEach((b, i) => {
        const walked = visited(n.row, n.col) && (n.row === ROWS - 1 ? visited(BOSS_ROW, 0) : visited(n.row + 1, nextCols[i]));
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
      ${topbar(run, `${zone.name} · ${run.act > 4 ? "acte secret" : `acte ${run.act}`}`)}
      <div class="map-scroll">
        <div class="map-canvas" style="height:${HEIGHT}px;background-image:linear-gradient(#0a0e1899, #0a0e18b3), url('${asset(`illustrations/cartes/${zone.id}.webp`)}')">
          <div class="map-title" style="top:${BOSS_POS.y - 130}px">Gardien : ${boss.name}</div>
          <svg class="map-lines" width="1280" height="${HEIGHT}">${lines.join('')}</svg>
          ${nodes.join('')}
        </div>
      </div>
      <div class="map-legend">
        <h3>${run.act > 4 ? 'Au-delà du temps' : 'Tour du Temps'}</h3>
        <p>${run.act > 4 ? 'Acte secret' : `Acte ${run.act}`} · ${zone.name}<br><small>${run.act > 4 ? 'L’escalier qui monte vers Arceus' : `Une faille venue de ${zone.region}`}</small></p>
        ${(['combat', 'evenement', 'centre', 'boutique', 'elite', 'tresor', 'coffre', 'pension', 'ct'] as NodeType[])
          .map((t) => `<div class="legend-row"><span class="legend-icon node-${t}">${nodeIcon(t)}</span>${NODE_INFO[t].label}</div>`).join('')}
        <p class="legend-hint">Clique sur un nœud qui brille pour avancer.</p>
      </div>
    </div>`;

  // Défilement : montrer l'étage actuel
  const scroll = root.querySelector<HTMLElement>('.map-scroll')!;
  const focusY = current ? pos({ row: Math.min(current.row, ROWS - 1), col: 0 }).y : HEIGHT;
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
