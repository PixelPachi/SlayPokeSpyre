// Animations d'attaque par type, dessinées en code (particules CSS) : flammes, éclaboussures, feuilles, éclairs…
import type { PokeType } from '../core/types';

interface Recipe {
  colors: string[];
  shape: 'dot' | 'drop' | 'leaf' | 'shard' | 'rock' | 'star' | 'bubble' | 'wisp' | 'slash' | 'spark';
  count: number;
  /** Direction des particules : explosion, montée, chute depuis le haut, tourbillon. */
  motion: 'burst' | 'rise' | 'fall' | 'swirl';
  spread: number;
  size: [number, number];
  ring?: string;
  bolt?: boolean;
  slashes?: string;
  flash?: string;
  shake?: boolean;
}

const R: Record<PokeType, Recipe> = {
  normal: { colors: ['#ffffff', '#ffe9b0'], shape: 'star', count: 12, motion: 'burst', spread: 90, size: [12, 22], ring: '#ffffff', flash: '#ffffff' },
  feu: { colors: ['#ffd23f', '#ff8c1a', '#ff4d1a', '#fff1a8'], shape: 'drop', count: 26, motion: 'rise', spread: 70, size: [14, 30], flash: '#ff8c1a', ring: '#ffb347' },
  eau: { colors: ['#9fe0ff', '#3fa9ff', '#e8f8ff'], shape: 'drop', count: 22, motion: 'burst', spread: 110, size: [8, 18], ring: '#7fd0ff' },
  plante: { colors: ['#7ad04e', '#3f9b2c', '#c8f08a'], shape: 'leaf', count: 16, motion: 'swirl', spread: 100, size: [12, 20] },
  electrik: { colors: ['#fff27a', '#ffd23f', '#ffffff'], shape: 'spark', count: 16, motion: 'burst', spread: 100, size: [6, 14], bolt: true, flash: '#fff27a' },
  glace: { colors: ['#e8faff', '#9fe6ff', '#ffffff'], shape: 'shard', count: 18, motion: 'burst', spread: 110, size: [10, 22], ring: '#bff0ff', flash: '#d8f6ff' },
  combat: { colors: ['#ffffff', '#ffb347', '#ff6b3d'], shape: 'star', count: 12, motion: 'burst', spread: 100, size: [10, 22], ring: '#ffd27a', shake: true },
  poison: { colors: ['#c06bff', '#8a3ad6', '#e3b8ff'], shape: 'bubble', count: 18, motion: 'rise', spread: 80, size: [8, 20] },
  sol: { colors: ['#c99a5e', '#8a5f2e', '#f0d09a'], shape: 'rock', count: 24, motion: 'rise', spread: 120, size: [12, 24], ring: '#c99a5e', shake: true },
  vol: { colors: ['#ffffff', '#dff1ff'], shape: 'slash', count: 0, motion: 'burst', spread: 0, size: [0, 0], slashes: '#e8f6ff' },
  psy: { colors: ['#ff8ad8', '#ffc4ef', '#c86bff'], shape: 'dot', count: 14, motion: 'swirl', spread: 90, size: [6, 12], ring: '#ff8ad8', flash: '#ffb3e6' },
  insecte: { colors: ['#b5e04a', '#7ab82c', '#e8ff9a'], shape: 'leaf', count: 22, motion: 'swirl', spread: 80, size: [8, 14], ring: '#b5e04a' },
  roche: { colors: ['#b8aa96', '#7c6f5e', '#e2d6c0'], shape: 'rock', count: 14, motion: 'fall', spread: 70, size: [18, 34], ring: '#d2c6b0', shake: true },
  spectre: { colors: ['#8a5cd6', '#3d2a66', '#c9a8ff'], shape: 'wisp', count: 12, motion: 'swirl', spread: 100, size: [16, 30] },
  dragon: { colors: ['#7a5cff', '#4fa8ff', '#c86bff'], shape: 'drop', count: 22, motion: 'burst', spread: 120, size: [12, 26], ring: '#8a6bff', flash: '#7a5cff', shake: true },
  tenebres: { colors: ['#2a1f3d', '#6b4a9a'], shape: 'wisp', count: 8, motion: 'burst', spread: 70, size: [14, 24], slashes: '#1a1026' },
  acier: { colors: ['#e8eef7', '#aab8cc', '#ffffff'], shape: 'spark', count: 22, motion: 'burst', spread: 110, size: [7, 14], ring: '#dfe8f5', flash: '#ffffff' },
  fee: { colors: ['#ff8fd8', '#ffffff', '#ffc4ec'], shape: 'star', count: 22, motion: 'swirl', spread: 100, size: [10, 20], flash: '#ffb3e6', ring: '#ffb3e6' },
};

let seed = 1;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

/** Joue l'animation d'une attaque de ce type au point (x, y) du calque d'effets. */
export function playVfx(layer: HTMLElement, x: number, y: number, type: PokeType, strength = 1): void {
  const r = R[type] ?? R.normal;
  const box = document.createElement('div');
  box.className = `vfx vfx-${type}`;
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
  let html = '';
  if (r.flash) html += `<i class="vfx-flash" style="--c:${r.flash}"></i>`;
  if (r.ring) html += `<i class="vfx-ring" style="--c:${r.ring}"></i>`;
  if (r.bolt) html += `<svg class="vfx-bolt" viewBox="0 0 60 220"><path d="M34 0 L14 92 L32 92 L8 220 L52 74 L32 74 L48 0z" fill="#fff27a" stroke="#fff" stroke-width="3"/></svg>`;
  if (r.slashes) for (let i = 0; i < 3; i++) html += `<i class="vfx-slash" style="--c:${r.slashes};--a:${-30 + i * 22}deg;--d:${i * 70}ms"></i>`;
  const n = Math.round(r.count * 1.5 * Math.min(1.6, strength));
  for (let i = 0; i < n; i++) {
    const ang = rnd() * Math.PI * 2;
    const dist = r.spread * 1.5 * (0.4 + rnd() * 0.8);
    let dx = Math.cos(ang) * dist;
    let dy = Math.sin(ang) * dist;
    let sx = 0;
    let sy = 0;
    if (r.motion === 'rise') { dx *= 0.6; dy = -Math.abs(dy) - 70 - rnd() * 90; sy = 40 * rnd(); }
    if (r.motion === 'fall') { sx = (rnd() - 0.5) * 140; sy = -260 - rnd() * 100; dx = sx * 0.3; dy = 10 + rnd() * 30; }
    const size = (r.size[0] + rnd() * (r.size[1] - r.size[0])) * 1.8;
    const color = r.colors[Math.floor(rnd() * r.colors.length)];
    const delay = Math.round(rnd() * (r.motion === 'fall' ? 260 : 140));
    const dur = 750 + Math.round(rnd() * 450);
    html += `<i class="vfx-p ${r.shape} ${r.motion}" style="--sx:${sx.toFixed(0)}px;--sy:${sy.toFixed(0)}px;--dx:${dx.toFixed(0)}px;--dy:${dy.toFixed(0)}px;--s:${size.toFixed(0)}px;--c:${color};--rot:${Math.round(rnd() * 360)}deg;animation-delay:${delay}ms;animation-duration:${dur}ms"></i>`;
  }
  box.innerHTML = html;
  layer.appendChild(box);
  if (r.shake) {
    const stage = layer.parentElement;
    stage?.classList.remove('vfx-shake');
    void stage?.offsetWidth;
    stage?.classList.add('vfx-shake');
  }
  setTimeout(() => box.remove(), 1700);
}

/** Bouclier qui apparaît sur un Pokémon quand il gagne de la Protection. */
export function playShield(layer: HTMLElement, x: number, y: number, size: number): void {
  const box = document.createElement('div');
  box.className = 'vfx vfx-shield';
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
  box.style.setProperty('--size', `${size}px`);
  box.innerHTML = `<svg class="shield-hex" viewBox="0 0 100 110"><path d="M50 4 L92 22 L92 58 C92 82 72 98 50 106 C28 98 8 82 8 58 L8 22 Z"
      fill="url(#shg)" stroke="#bfe6ff" stroke-width="4"/><defs><radialGradient id="shg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#e8f6ff" stop-opacity="0.45"/>
      <stop offset="0.6" stop-color="#5bb8ff" stop-opacity="0.35"/><stop offset="1" stop-color="#2a6fd6" stop-opacity="0.15"/></radialGradient></defs></svg>
    <i class="shield-ring"></i>`;
  layer.appendChild(box);
  setTimeout(() => box.remove(), 1100);
}

/** Activation d'un talent : cercle runique et lumière qui monte, à la couleur du type. */
export function playTalent(layer: HTMLElement, x: number, y: number, color: string): void {
  const box = document.createElement('div');
  box.className = 'vfx vfx-talent';
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;
  box.style.setProperty('--c', color);
  let sparks = '';
  for (let i = 0; i < 16; i++) {
    sparks += `<i class="talent-spark" style="--x:${Math.round(Math.cos((i / 16) * Math.PI * 2) * 70)}px;--d:${i * 30}ms"></i>`;
  }
  box.innerHTML = `<svg class="talent-circle" viewBox="0 0 200 200"><circle cx="100" cy="100" r="88" fill="none" stroke="var(--c)" stroke-width="4"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--c)" stroke-width="2" stroke-dasharray="6 10"/>
      <path d="M100 18 L171 141 L29 141 Z M100 182 L29 59 L171 59 Z" fill="none" stroke="var(--c)" stroke-width="2.5" opacity="0.8"/></svg>
    <i class="talent-pillar"></i>${sparks}`;
  layer.appendChild(box);
  setTimeout(() => box.remove(), 1500);
}
