// Audio du jeu, entièrement synthétisé avec la Web Audio API (aucun fichier son) :
// un thème musical par zone (petit séquenceur façon chiptune) et un bruitage par type d'attaque.

import type { PokeType } from '../core/types';

/** Musiques enregistrées (fichiers MP3) qui remplacent la musique générée pour certains combats. */
const FILE_TRACKS: Record<string, string> = {
  titre: 'music/titre.mp3', // écran titre (joué doucement, en fond)
  dialga: 'music/dialga.mp3',
  'foret-de-jade': 'music/foret-de-jade.mp3', // Viridian Forest (version 2)
  'salle-originelle': 'music/salle-originelle.mp3', // One Last Time : acte secret
  arceus: 'music/arceus.mp3', // combat contre Arceus
  'tour-lavanville': 'music/tour-lavanville.mp3', // Lavender Town
  'puits-ramoloss': 'music/puits-ramoloss.mp3', // Slowpoke Well
  'bois-aux-chenes': 'music/bois-aux-chenes.mp3', // Ilex Forest
  'bois-clematis': 'music/bois-clematis.mp3', // Bois Clémenti (Hoenn)
  'foret-de-vestigion': 'music/foret-de-vestigion.mp3', // Eterna Forest
  'mont-selenite': 'music/mont-selenite.mp3', // Mt. Moon
  'mont-chimnee': 'music/mont-chimnee.mp3', // Mt. Chimney
  'mont-couronne': 'music/mont-couronne.mp3', // Mt. Coronet
  'grotte-electrolithe': 'music/grotte-electrolithe.mp3', // Chargestone Cave
  'route-victoire': 'music/route-victoire.mp3', // Victory Road
  'mont-argente': 'music/mont-argente.mp3', // Silver Cave
  'pilier-celeste': 'music/pilier-celeste.mp3', // Sky Pillar
  'mont-abrupt': 'music/mont-abrupt.mp3', // Stark Mountain
  'tour-dragospire': 'music/tour-dragospire.mp3', // Dragonspiral Tower
  'foret-d-empoigne': 'music/foret-d-empoigne.mp3', // Pinwheel Forest
};
/** Vrai si une musique enregistrée existe pour cet identifiant. */
export function hasTrack(id: string): boolean { return !!FILE_TRACKS[id]; }
let fileAudio: HTMLAudioElement | null = null;
let fileTrack: string | null = null;
/** Volume propre à certaines musiques (l'écran titre reste discret). */
const TRACK_VOLUME: Record<string, number> = { titre: 0.18 };
const fileVolume = () => (mode === 'tout' ? (TRACK_VOLUME[fileTrack ?? ''] ?? 0.5) * levels.musique : 0);
function stopFile(): void {
  if (fileAudio) { fileAudio.pause(); fileAudio = null; }
  fileTrack = null;
}

type Wave = OscillatorType;

interface Theme {
  bpm: number;
  root: number; // note MIDI de la tonique
  mode: number[]; // intervalles de la gamme
  prog: number[]; // degrés des accords (un par mesure, 8 mesures)
  lead: Wave;
  bass: Wave;
  drums: 'aucun' | 'doux' | 'marche' | 'rapide' | 'epique';
  pad?: boolean;
  arp?: boolean;
  density: number; // 0..1 : quantité de notes de la mélodie
  seed: string;
  leadOct?: number;
  echo?: boolean;
}

const MAJ = [0, 2, 4, 5, 7, 9, 11];
const MIN = [0, 2, 3, 5, 7, 8, 10];
const DOR = [0, 2, 3, 5, 7, 9, 10];
const LYD = [0, 2, 4, 6, 7, 9, 11];
const MIX = [0, 2, 4, 5, 7, 9, 10];
const PHR = [0, 1, 3, 5, 7, 8, 10];
const HARM = [0, 2, 3, 5, 7, 8, 11];

const T = (seed: string, bpm: number, root: number, mode: number[], prog: number[], o: Partial<Theme> = {}): Theme =>
  ({ seed, bpm, root, mode, prog, lead: 'square', bass: 'triangle', drums: 'doux', density: 0.55, ...o });

/** Un thème par zone (+ écran titre, gardiens et sommet). */
export const THEMES: Record<string, Theme> = {
  titre: T('titre', 84, 62, LYD, [0, 4, 5, 3, 0, 4, 1, 4], { lead: 'triangle', drums: 'aucun', pad: true, arp: true, density: 0.4, echo: true }),
  // Acte 1 : forêts
  'foret-de-jade': T('jade', 104, 67, MAJ, [0, 3, 4, 0, 5, 3, 1, 4], { lead: 'square', arp: true }),
  'bois-aux-chenes': T('chenes', 96, 65, MIX, [0, 6, 3, 0, 0, 6, 4, 0], { lead: 'triangle', pad: true, echo: true }),
  'bois-clematis': T('clematis', 100, 64, LYD, [0, 1, 0, 4, 5, 1, 3, 4], { arp: true, pad: true, echo: true, density: 0.45 }),
  'foret-de-vestigion': T('vestigion', 88, 62, DOR, [0, 3, 0, 6, 5, 3, 6, 4], { lead: 'triangle', pad: true, density: 0.4, echo: true }),
  'foret-d-empoigne': T('empoigne', 112, 69, MAJ, [0, 4, 5, 3, 0, 4, 3, 4], { drums: 'marche', arp: true }),
  'tour-lavanville': T('lavanville', 76, 64, PHR, [0, 1, 0, 6, 5, 1, 3, 0], { lead: 'triangle', drums: 'aucun', pad: true, arp: true, echo: true, density: 0.35, leadOct: 1 }),
  // Acte 2 : grottes et montagnes
  'mont-selenite': T('selenite', 92, 57, DOR, [0, 6, 5, 6, 0, 3, 6, 4], { lead: 'triangle', pad: true, echo: true, drums: 'doux', density: 0.4 }),
  'puits-ramoloss': T('ramoloss', 80, 60, MIX, [0, 3, 0, 4, 0, 3, 6, 0], { lead: 'sine', drums: 'doux', echo: true, density: 0.35, pad: true }),
  'mont-chimnee': T('chimnee', 118, 59, PHR, [0, 1, 0, 6, 5, 1, 6, 0], { lead: 'sawtooth', bass: 'square', drums: 'marche', density: 0.6 }),
  'mont-couronne': T('couronne', 98, 55, MIN, [0, 5, 2, 6, 0, 5, 3, 4], { lead: 'square', pad: true, drums: 'marche', echo: true }),
  'grotte-electrolithe': T('electrolithe', 124, 61, DOR, [0, 6, 3, 4, 0, 6, 5, 4], { lead: 'square', bass: 'sawtooth', drums: 'rapide', arp: true, density: 0.65 }),
  // Acte 3 : sommets
  'route-victoire': T('victoire', 128, 62, MIX, [0, 6, 3, 0, 5, 6, 4, 4], { drums: 'epique', density: 0.6, bass: 'square' }),
  'mont-argente': T('argente', 108, 57, MIN, [0, 5, 6, 4, 0, 5, 3, 4], { lead: 'triangle', pad: true, drums: 'marche', echo: true }),
  'pilier-celeste': T('celeste', 132, 64, LYD, [0, 1, 4, 0, 5, 1, 3, 4], { drums: 'rapide', arp: true, echo: true, leadOct: 1 }),
  'mont-abrupt': T('abrupt', 116, 58, HARM, [0, 5, 3, 4, 0, 5, 6, 4], { lead: 'sawtooth', drums: 'epique', pad: true }),
  'tour-dragospire': T('dragospire', 126, 60, PHR, [0, 1, 6, 0, 5, 1, 6, 4], { lead: 'square', bass: 'sawtooth', drums: 'epique', density: 0.65 }),
  // Sommet et gardiens
  'sommet-tour-du-temps': T('sommet', 120, 56, HARM, [0, 5, 1, 4, 0, 5, 6, 4], { lead: 'sawtooth', bass: 'square', drums: 'epique', pad: true, echo: true, density: 0.6 }),
  'gardien-1': T('boss1', 144, 57, HARM, [0, 0, 5, 4, 0, 0, 6, 4], { lead: 'square', bass: 'sawtooth', drums: 'rapide', density: 0.7 }),
  'gardien-2': T('boss2', 150, 55, PHR, [0, 1, 0, 6, 0, 1, 5, 4], { lead: 'sawtooth', bass: 'square', drums: 'rapide', density: 0.7 }),
  'gardien-3': T('boss3', 156, 58, HARM, [0, 5, 3, 4, 0, 6, 1, 4], { lead: 'square', bass: 'sawtooth', drums: 'epique', density: 0.75, pad: true }),
  dialga: T('dialga', 160, 54, PHR, [0, 1, 6, 1, 0, 5, 1, 4], { lead: 'sawtooth', bass: 'sawtooth', drums: 'epique', density: 0.75, pad: true, echo: true }),
};

// ——— Réglages (sauvegardés) ———

type Mode = 'tout' | 'effets' | 'muet';
const KEY = 'slaypokespyre-son';
let mode: Mode = (() => { try { return (localStorage.getItem(KEY) as Mode) || 'tout'; } catch { return 'tout'; } })();

// Volumes réglables (0 à 1) : musique et effets
const VKEY = 'slaypokespyre-volumes';
const levels: { musique: number; effets: number } = (() => {
  try { return { musique: 1, effets: 1, ...JSON.parse(localStorage.getItem(VKEY) ?? '{}') }; } catch { return { musique: 1, effets: 1 }; }
})();
export function volumes(): { musique: number; effets: number } { return { ...levels }; }
export function setVolume(kind: 'musique' | 'effets', v: number): void {
  levels[kind] = Math.max(0, Math.min(1, v));
  try { localStorage.setItem(VKEY, JSON.stringify(levels)); } catch { /* ignore */ }
  applyVolumes();
}
export function setSoundMode(m: Mode): void {
  mode = m;
  try { localStorage.setItem(KEY, mode); } catch { /* ignore */ }
  applyVolumes();
}

export function soundMode(): Mode { return mode; }
export function cycleSound(): Mode {
  mode = mode === 'tout' ? 'effets' : mode === 'effets' ? 'muet' : 'tout';
  try { localStorage.setItem(KEY, mode); } catch { /* ignore */ }
  applyVolumes();
  return mode;
}
export function soundIcon(): string {
  if (mode === 'muet' || (levels.musique === 0 && levels.effets === 0)) return '🔇';
  return mode === 'tout' ? '🔊' : '🔉';
}
export function soundLabel(): string {
  return mode === 'tout' ? 'Son : musique + effets' : mode === 'effets' ? 'Son : effets seulement' : 'Son coupé';
}

// ——— Moteur ———

let ctx: AudioContext | null = null;
let master: GainNode, musicBus: GainNode, sfxBus: GainNode, echoIn: GainNode;
let noiseBuf: AudioBuffer;

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4;
  master = ctx.createGain(); master.gain.value = 0.9;
  master.connect(comp).connect(ctx.destination);
  musicBus = ctx.createGain(); musicBus.connect(master);
  sfxBus = ctx.createGain(); sfxBus.connect(master);
  // Écho léger pour les thèmes « aériens »
  echoIn = ctx.createGain(); echoIn.gain.value = 0.28;
  const delay = ctx.createDelay(1); delay.delayTime.value = 0.33;
  const fb = ctx.createGain(); fb.gain.value = 0.32;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
  echoIn.connect(delay); delay.connect(lp).connect(fb).connect(delay); lp.connect(musicBus);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  applyVolumes();
  return ctx;
}

function applyVolumes(): void {
  if (fileAudio) fileAudio.volume = fileVolume();
  if (!ctx) return;
  musicBus.gain.setTargetAtTime(mode === 'tout' ? 0.16 * fade * levels.musique : 0, ctx.currentTime, 0.05);
  sfxBus.gain.setTargetAtTime(mode === 'muet' ? 0 : 0.42 * levels.effets, ctx.currentTime, 0.05);
}

/** Les navigateurs exigent un geste : on démarre l'audio au premier clic / touche. */
export function installAudioUnlock(): void {
  const go = () => {
    const c = ensure();
    void c?.resume();
    if (pending) { const p = pending; pending = null; playTheme(p); }
  };
  window.addEventListener('pointerdown', go, { capture: true });
  window.addEventListener('keydown', go, { capture: true });
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

function tone(dest: AudioNode, t: number, freq: number, dur: number, wave: Wave, vol: number, o: { attack?: number; glide?: number; detune?: number } = {}): void {
  const c = ctx!;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, t);
  if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * o.glide), t + dur);
  if (o.detune) osc.detune.value = o.detune;
  const a = o.attack ?? 0.005;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(dest: AudioNode, t: number, dur: number, vol: number, filter: BiquadFilterType, freq: number, o: { q?: number; sweep?: number } = {}): void {
  const c = ctx!;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = filter; f.frequency.setValueAtTime(freq, t); f.Q.value = o.q ?? 1;
  if (o.sweep) f.frequency.exponentialRampToValueAtTime(Math.max(30, freq * o.sweep), t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(dest);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.02);
}

// ——— Séquenceur musical ———

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}

interface Song { theme: Theme; lead: (number | null)[]; leadLen: number[]; }

/** Compose une mélodie de 8 mesures (A A' B A'') à partir du thème. */
function compose(th: Theme): Song {
  const r = rng(th.seed);
  const steps = 128;
  const lead: (number | null)[] = Array(steps).fill(null);
  const leadLen: number[] = Array(steps).fill(0);
  const degreeNote = (deg: number, oct = 0) => {
    const n = th.mode.length;
    const o = Math.floor(deg / n);
    return th.root + 12 + 12 * ((th.leadOct ?? 0) + oct) + 12 * o + th.mode[((deg % n) + n) % n];
  };
  // Rythmes possibles d'une mesure (positions de doubles-croches)
  const rhythms = [[0, 4, 8, 12], [0, 3, 6, 8, 12], [0, 2, 4, 8, 10, 12], [0, 6, 8, 14], [0, 4, 6, 8, 12, 14], [0, 8, 12], [0, 2, 4, 6, 8, 12]];
  const makeBar = (bar: number, ending: boolean): [number, number][] => {
    const chord = th.prog[bar];
    const pool = rhythms.filter((x) => (x.length / 7 < th.density + 0.35));
    const rh = pool[Math.floor(r() * pool.length)] ?? rhythms[0];
    let deg = chord + [0, 2, 4][Math.floor(r() * 3)];
    const out: [number, number][] = [];
    rh.forEach((pos, i) => {
      if (i > 0) {
        const strong = pos % 4 === 0;
        if (strong) {
          // Temps fort : une note de l'accord proche de la précédente
          const opts = [chord, chord + 2, chord + 4, chord + 7].sort((a, b) => Math.abs(a - deg) - Math.abs(b - deg));
          deg = opts[Math.floor(r() * 2)];
        } else deg += [-1, 1, 1, -1, 2, -2][Math.floor(r() * 6)];
      }
      deg = Math.max(-2, Math.min(9, deg));
      const next = rh[i + 1] ?? 16;
      out.push([pos, ending && i === rh.length - 1 ? 0 : deg]);
      void next;
    });
    if (ending) out[out.length - 1][1] = 0;
    return out;
  };
  const A = [makeBar(0, false), makeBar(1, false)];
  const B = [makeBar(4, false), makeBar(5, false)];
  const bars = [A[0], A[1], A[0].map(([p, d]) => [p, d + (th.prog[2] - th.prog[0])] as [number, number]), makeBar(3, false),
    B[0], B[1], A[0], makeBar(7, true)];
  bars.forEach((bar, b) => bar.forEach(([pos, deg], i) => {
    const step = b * 16 + pos;
    const nextPos = bar[i + 1]?.[0] ?? 16;
    lead[step] = degreeNote(deg);
    leadLen[step] = Math.min(nextPos - pos, 8);
  }));
  return { theme: th, lead, leadLen };
}

let song: Song | null = null;
let current: string | null = null;
let pending: string | null = null;
let step = 0;
let nextTime = 0;
let timer: number | null = null;
let fade = 1;

function chordNotes(th: Theme, bar: number, base: number): number[] {
  const deg = th.prog[bar % 8];
  const n = th.mode.length;
  return [0, 2, 4].map((k) => {
    const d = deg + k;
    return base + 12 * Math.floor(d / n) + th.mode[d % n];
  });
}

function scheduleStep(s: number, t: number): void {
  if (!song) return;
  const th = song.theme;
  const sixteenth = 60 / th.bpm / 4;
  const bar = Math.floor(s / 16);
  const pos = s % 16;
  const leadDest = th.echo ? echoIn : musicBus;
  // Mélodie
  const n = song.lead[s];
  if (n !== null) {
    const dur = song.leadLen[s] * sixteenth * 0.9;
    tone(musicBus, t, midi(n), dur, th.lead, th.lead === 'sawtooth' ? 0.22 : th.lead === 'square' ? 0.26 : 0.5);
    if (th.echo) tone(leadDest, t, midi(n), dur, th.lead, 0.2);
  }
  // Basse
  const root = th.root - 12 + th.mode[th.prog[bar % 8] % th.mode.length];
  const fast = th.drums === 'rapide' || th.drums === 'epique';
  if (fast ? pos % 2 === 0 : pos % 4 === 0 || (th.drums === 'marche' && pos === 10)) {
    const oct = fast && pos % 4 === 2 ? 12 : 0;
    tone(musicBus, t, midi(root + oct), sixteenth * (fast ? 1.6 : 3.5), th.bass, th.bass === 'triangle' ? 0.6 : 0.2);
  }
  // Nappe
  if (th.pad && pos === 0) {
    for (const cn of chordNotes(th, bar, th.root)) tone(musicBus, t, midi(cn), sixteenth * 15, 'triangle', 0.09, { attack: 0.3 });
  }
  // Arpège
  if (th.arp && pos % 2 === 1) {
    const ch = chordNotes(th, bar, th.root + 12);
    tone(musicBus, t, midi(ch[(pos >> 1) % 3] + 12), sixteenth * 0.9, 'triangle', 0.12);
  }
  // Percussions
  switch (th.drums) {
    case 'doux':
      if (pos === 0) kick(t, 0.5);
      if (pos % 4 === 2) hat(t, 0.05);
      break;
    case 'marche':
      if (pos === 0 || pos === 8) kick(t, 0.7);
      if (pos === 4 || pos === 12) snare(t, 0.25);
      if (pos % 2 === 0) hat(t, 0.05);
      break;
    case 'rapide':
      if (pos % 4 === 0) kick(t, 0.75);
      if (pos === 4 || pos === 12) snare(t, 0.3);
      hat(t, pos % 2 ? 0.035 : 0.06);
      break;
    case 'epique':
      if (pos === 0 || pos === 3 || pos === 8 || pos === 11) kick(t, 0.85);
      if (pos === 4 || pos === 12) snare(t, 0.35);
      if (pos % 2 === 0) hat(t, 0.06);
      if (pos === 0 && bar % 4 === 0) noise(musicBus, t, 1.2, 0.18, 'highpass', 5000);
      break;
  }
}

function kick(t: number, v: number) { tone(musicBus, t, 140, 0.22, 'sine', v, { glide: 0.3 }); }
function snare(t: number, v: number) { noise(musicBus, t, 0.14, v, 'bandpass', 1800, { q: 0.7 }); tone(musicBus, t, 220, 0.08, 'triangle', v * 0.6, { glide: 0.6 }); }
function hat(t: number, v: number) { noise(musicBus, t, 0.04, v, 'highpass', 7000); }

function tick(): void {
  if (!ctx || !song) return;
  const sixteenth = 60 / song.theme.bpm / 4;
  while (nextTime < ctx.currentTime + 0.15) {
    scheduleStep(step, nextTime);
    nextTime += sixteenth;
    step = (step + 1) % 128;
  }
}

/** Joue le thème (ne recommence pas s'il est déjà en cours). */
export function playTheme(id: string): void {
  if (FILE_TRACKS[id]) {
    // Musique enregistrée (ex. combat final contre Dialga) : la musique générée s'arrête
    if (fileTrack === id && fileAudio) return;
    stopFile();
    if (song) { fade = 0; applyVolumes(); song = null; }
    current = id;
    fileTrack = id;
    fileAudio = new Audio(`${import.meta.env.BASE_URL}${FILE_TRACKS[id]}`);
    fileAudio.loop = true;
    fileAudio.volume = fileVolume();
    fileAudio.play().catch(() => { pending = id; current = null; fileTrack = null; fileAudio = null; });
    return;
  }
  stopFile();
  if (!THEMES[id]) id = 'titre';
  if (id === current && song) return;
  const c = ensure();
  if (!c || c.state !== 'running') { pending = id; current = null; return; }
  current = id;
  const start = () => {
    song = compose(THEMES[id]);
    step = 0;
    nextTime = c.currentTime + 0.08;
    fade = 1;
    applyVolumes();
    if (timer === null) timer = window.setInterval(tick, 25);
  };
  if (song) {
    fade = 0;
    applyVolumes();
    song = null;
    setTimeout(start, 350);
  } else start();
}

export function stopMusic(): void {
  stopFile();
  song = null;
  current = null;
}

// ——— Bruitages ———

function sfxReady(): AudioContext | null {
  if (mode === 'muet') return null;
  const c = ensure();
  return c && c.state === 'running' ? c : null;
}

/** Bruitage d'une attaque selon son type. */
export function sfxType(type: PokeType, power = 1): void {
  const c = sfxReady();
  if (!c) return;
  const t = c.currentTime + 0.01;
  const o = sfxBus;
  const v = Math.min(1.2, 0.7 + power * 0.3);
  switch (type) {
    case 'normal':
      tone(o, t, 520, 0.08, 'square', 0.3 * v, { glide: 0.5 });
      noise(o, t, 0.12, 0.5 * v, 'lowpass', 1200);
      break;
    case 'feu':
      noise(o, t, 0.5, 0.7 * v, 'lowpass', 600, { sweep: 6 });
      noise(o, t + 0.05, 0.4, 0.3 * v, 'bandpass', 3000, { q: 2, sweep: 0.4 });
      for (let i = 0; i < 5; i++) noise(o, t + 0.05 + Math.random() * 0.35, 0.03, 0.4, 'highpass', 4000);
      break;
    case 'eau':
      noise(o, t, 0.35, 0.5 * v, 'lowpass', 900, { sweep: 0.5 });
      for (let i = 0; i < 6; i++) tone(o, t + i * 0.045, 300 + Math.random() * 500, 0.06, 'sine', 0.35, { glide: 2.2 });
      break;
    case 'plante':
      noise(o, t, 0.3, 0.35 * v, 'bandpass', 5000, { q: 3, sweep: 0.6 });
      tone(o, t, 330, 0.25, 'triangle', 0.35, { glide: 1.8 });
      tone(o, t + 0.08, 494, 0.2, 'triangle', 0.25, { glide: 1.5 });
      break;
    case 'electrik':
      for (let i = 0; i < 7; i++) tone(o, t + i * 0.03, 200 + Math.random() * 1600, 0.04, 'sawtooth', 0.22 * v);
      noise(o, t, 0.25, 0.35 * v, 'highpass', 3000);
      break;
    case 'glace':
      [1760, 1568, 1319, 1175, 988].forEach((f, i) => tone(o, t + i * 0.05, f, 0.35, 'sine', 0.25 * v));
      noise(o, t, 0.3, 0.2, 'highpass', 8000);
      break;
    case 'combat':
      tone(o, t, 160, 0.18, 'sine', 0.9 * v, { glide: 0.35 });
      noise(o, t, 0.1, 0.7 * v, 'lowpass', 2500);
      break;
    case 'poison':
      for (let i = 0; i < 4; i++) tone(o, t + i * 0.07, 260 - i * 30, 0.12, 'sawtooth', 0.18 * v, { glide: 0.7 });
      noise(o, t, 0.35, 0.25, 'bandpass', 500, { q: 4 });
      break;
    case 'sol':
      noise(o, t, 0.6, 0.9 * v, 'lowpass', 300, { sweep: 0.4 });
      tone(o, t, 90, 0.5, 'sine', 0.8 * v, { glide: 0.4 });
      break;
    case 'vol':
      noise(o, t, 0.35, 0.6 * v, 'bandpass', 600, { q: 2, sweep: 6 });
      break;
    case 'psy':
      tone(o, t, 440, 0.45, 'sine', 0.3 * v, { glide: 2 });
      tone(o, t, 445, 0.45, 'sine', 0.3 * v, { glide: 2.05 });
      tone(o, t + 0.1, 660, 0.35, 'triangle', 0.15, { glide: 1.5 });
      break;
    case 'insecte':
      for (let i = 0; i < 10; i++) tone(o, t + i * 0.025, 180 + (i % 2) * 40, 0.025, 'square', 0.18 * v);
      noise(o, t, 0.12, 0.3, 'bandpass', 2000, { q: 3 });
      break;
    case 'roche':
      for (let i = 0; i < 3; i++) noise(o, t + i * 0.07, 0.12, 0.7 * v, 'lowpass', 900 - i * 150);
      tone(o, t, 120, 0.2, 'square', 0.25, { glide: 0.5 });
      break;
    case 'spectre':
      tone(o, t, 600, 0.6, 'sine', 0.3 * v, { glide: 0.4, detune: 0 });
      tone(o, t, 612, 0.6, 'sine', 0.25 * v, { glide: 0.38 });
      noise(o, t, 0.5, 0.12, 'bandpass', 900, { q: 8, sweep: 0.5 });
      break;
    case 'dragon':
      tone(o, t, 110, 0.55, 'sawtooth', 0.35 * v, { glide: 0.6 });
      tone(o, t, 116, 0.55, 'sawtooth', 0.3 * v, { glide: 0.55 });
      noise(o, t, 0.5, 0.45 * v, 'lowpass', 400, { sweep: 3 });
      break;
    case 'tenebres':
      tone(o, t, 233, 0.2, 'square', 0.22 * v, { glide: 0.5 });
      tone(o, t, 247, 0.2, 'square', 0.2 * v, { glide: 0.5 });
      noise(o, t, 0.15, 0.5 * v, 'highpass', 2500, { sweep: 0.3 });
      break;
    case 'acier':
      [523, 1397, 2093, 3136].forEach((f, i) => tone(o, t, f * (1 + i * 0.013), 0.5 - i * 0.08, 'sine', 0.22 * v));
      noise(o, t, 0.05, 0.6, 'highpass', 3000);
      break;
    case 'fee':
      [1047, 1319, 1568, 2093, 2637].forEach((f, i) => tone(o, t + i * 0.045, f, 0.3, 'sine', 0.2 * v));
      break;
  }
}

/** Petits bruitages d'interface et de combat. */
export function sfx(name: 'coup' | 'protection' | 'soin' | 'ko' | 'statut' | 'baie' | 'clic' | 'victoire' | 'defaite' | 'carte'): void {
  const c = sfxReady();
  if (!c) return;
  const t = c.currentTime + 0.01;
  const o = sfxBus;
  switch (name) {
    case 'coup': tone(o, t, 180, 0.12, 'square', 0.25, { glide: 0.4 }); noise(o, t, 0.08, 0.35, 'lowpass', 1500); break;
    case 'protection': tone(o, t, 330, 0.15, 'triangle', 0.4, { glide: 1.3 }); tone(o, t, 990, 0.12, 'sine', 0.15); break;
    case 'soin': [523, 659, 784, 1047].forEach((f, i) => tone(o, t + i * 0.06, f, 0.2, 'triangle', 0.25)); break;
    case 'ko': tone(o, t, 400, 0.6, 'square', 0.25, { glide: 0.15 }); break;
    case 'statut': tone(o, t, 700, 0.1, 'triangle', 0.2, { glide: 0.6 }); break;
    case 'baie': tone(o, t, 600, 0.06, 'square', 0.2); tone(o, t + 0.07, 900, 0.1, 'square', 0.2); break;
    case 'clic': tone(o, t, 900, 0.03, 'square', 0.1); break;
    case 'carte': noise(o, t, 0.06, 0.15, 'bandpass', 3500, { q: 1.5 }); break;
    case 'victoire': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(o, t + i * 0.11, f, i === 5 ? 0.6 : 0.14, 'square', 0.2)); break;
    case 'defaite': [392, 349, 311, 262].forEach((f, i) => tone(o, t + i * 0.22, f, 0.3, 'triangle', 0.3)); break;
  }
}

/** État de l'audio (pour les tests). */
export function audioDebug(): { state: string; theme: string | null; step: number } {
  return { state: ctx?.state ?? 'aucun', theme: current, step };
}
(window as unknown as { __audio?: typeof audioDebug }).__audio = audioDebug;
