import { ENCHANTS } from '../data/cards';
import { TERRAINS, WEATHER } from '../core/weather';
// Rendu HTML d'une carte, partagé par le combat, les récompenses, la boutique et le deck.
import type { CardDef } from '../core/model';
import { TYPE_LABELS } from '../core/types';
import { CATEGORY_LABELS, CHARACTER_COLORS, STATUS_INFO, TYPE_COLORS, cardText } from './labels';
import { esc } from './util';
import { artNoPokemon, artUrl, orbUrl, frameUrl } from './card-assets';

export interface CardRenderOptions {
  uid?: number;
  /** Texte d'effet déjà calculé (sinon le texte de base). */
  text?: string;
  classes?: string;
  style?: string;
  key?: string;
  stab?: boolean;
  /** Coût affiché s'il diffère du coût de base (tour gratuit). */
  cost?: number;
  costTooHigh?: boolean;
}

export function renderCard(d: CardDef, o: CardRenderOptions = {}): string {
  const base = d.effects.find((e) => e.kind === 'degats');
  const text = o.text ?? cardText(d, null, null);
  const enemy = d.id.startsWith('ennemi-') || d.id.includes('copie:');
  // Duo : même cadre que les autres, recoloré (bordeaux / turquoise / bicolore, liserés dorés)
  const frame = enemy ? frameUrl('ennemi') : frameUrl(d.character === 'duo' ? `duo-${d.duoFusion ? 'fusion' : d.duoSide ?? 'both'}` : d.character);
  // Duo : d'abord l'illustration Gemini avec Posipi / Négapi (au nom de la carte), sinon l'attaque d'origine
  const art = enemy ? artNoPokemon(d.name) : d.character === 'duo'
    ? artUrl(d.name, 'duo') ?? artUrl(d.artName ?? d.name, 'duo') ?? artNoPokemon(d.artName ?? d.name)
    : artUrl(d.artName ?? d.name, d.character);
  const orb = orbUrl(d.character);
  return `
    <div class="card ${d.character === 'duo' ? `duo-card duo-${d.duoFusion ? 'fusion' : d.duoSide ?? 'both'}` : ''} ${d.enchant ? `enchanted ench-${ENCHANTS[d.enchant]?.rarity ?? 'commun'}` : ''} rarity-${d.rarity} ${frame ? 'has-frame' : ''} ${enemy ? 'enemy-move-card' : ''} ${o.classes ?? ''}" ${o.uid !== undefined ? `data-uid="${o.uid}"` : ''}
         style="--tc:${CHARACTER_COLORS[d.character]};--type:${TYPE_COLORS[d.pokeType]};${frame ? `--frame:url('${frame}');` : ''}${o.style ?? ''}">
      <div class="card-inner">
        <div class="card-window">
          <div class="card-art">${art ? `<img src="${art}" alt="" draggable="false" onerror="if(!this.dataset.retry){this.dataset.retry=1;this.src=this.src.split('?')[0]+'?r='+Date.now()}">` : CATEGORY_ART[d.category]}</div>
          <div class="card-type">${TYPE_LABELS[d.pokeType]}</div>
        </div>
        ${frame ? '<div class="card-tint"></div>' : ''}
        <div class="card-banner"><div class="card-name" style="font-size:${nameSize(d.name)}px">${esc(d.name)}</div></div>
        <div class="card-cat">${CATEGORY_LABELS[d.category]}${o.stab && base ? ' <span class="stab" data-tip="Même type que ton Pokémon : dégâts ×1,25">★</span>' : ''}</div>
        <div class="card-text ${textLen(text) > 115 ? 'xlong' : textLen(text) > 80 ? 'long' : ''}"><span>${withStatusTips(text)}</span></div>
        ${o.key ? `<div class="card-key">${o.key}</div>` : ''}
        ${d.rarity === 'legendaire' || (d.enchants ?? []).some((k) => ENCHANTS[k]?.rarity === 'legendaire') ? LEGEND_DECO : ''}
        ${d.enchants?.length ? `<div class="card-ench" data-tip="<b>Enchantement${d.enchants.length > 1 ? 's' : ''}</b>${d.enchants.map((k) => ENCHANTS[k] ? `<br>• <b>${ENCHANTS[k].name}</b> : ${ENCHANTS[k].text}` : '').join('')}">✦${d.enchants.length > 1 ? d.enchants.length : ''}</div>` : ''}
      </div>
      <div class="card-cost ${orb ? 'has-orb' : ''} ${o.costTooHigh ? 'too-much' : ''} ${o.cost !== undefined && o.cost < d.cost ? 'free' : ''}" ${orb ? `style="--orb:url('${orb}')"` : ''}>${d.xCost ? 'X' : o.cost ?? d.cost}</div>
    </div>`;
}

const CATEGORY_ART: Record<string, string> = {
  attaque: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(255,255,255,.18)"/><path d="M18 40l18-18 6 6-18 18z" fill="#fff" opacity=".9"/><path d="M38 14l12 12-4 4-12-12z" fill="#fff"/><path d="M14 44l6 6-4 2-4-4z" fill="#fff"/></svg>',
  technique: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(255,255,255,.18)"/><path d="M32 12l16 6v11c0 10-7 18-16 22-9-4-16-12-16-22V18z" fill="#fff" opacity=".9"/></svg>',
  talent: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(255,255,255,.18)"/><path d="M32 12l5 13h14l-11 8 4 14-12-9-12 9 4-14-11-8h14z" fill="#fff" opacity=".9"/></svg>',
  statut: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(0,0,0,.25)"/></svg>',
};

/** Longueur visible d'un texte de carte (sans les balises). */
function textLen(html: string): number {
  return html.replace(/<[^>]+>/g, '').length;
}

/** Taille du nom pour qu'il tienne sur une ligne dans le ruban (mesuré une fois par nom). */
const NAME_MAX = 15;
const NAME_WIDTH = 96;
const nameCache = new Map<string, number>();
// Mesures refaites une fois la police du titre chargée
if (typeof document !== 'undefined') void document.fonts?.ready.then(() => nameCache.clear());
let measureCtx: CanvasRenderingContext2D | null = null;
function nameSize(name: string): number {
  const hit = nameCache.get(name);
  if (hit) return hit;
  if (!measureCtx && typeof document !== 'undefined') measureCtx = document.createElement('canvas').getContext('2d');
  if (!measureCtx) return NAME_MAX;
  const font = getComputedStyle(document.documentElement).getPropertyValue('--font-title').trim() || 'sans-serif';
  measureCtx.font = `900 ${NAME_MAX}px ${font}`;
  const w = measureCtx.measureText(name).width + 3; // + contour du texte
  const size = Math.max(9, Math.min(NAME_MAX, Math.floor((NAME_MAX * NAME_WIDTH / w) * 10) / 10));
  nameCache.set(name, size);
  return size;
}

/** Infobulle sur les noms de statuts dans le texte d'une carte (Brûlure, Poison, Peur…). */
const kw = (label: string, color: string, text: string) => ({ label, color, text: () => text });
const EXTRA_KW = [
  kw('Invocation', '#e8b04a', 'Le Bébé gagne autant de PV max et de PV. S’il est K.O., il revient avec autant de PV.'),
  kw('Aura', '#4aa8ff', 'Chaque point d’Aura ajoute 1 dégât à ta prochaine attaque, puis l’Aura retombe à 0. Chaque PV perdu donne 1 Aura.'),
  // météos et terrains
  ...Object.values(WEATHER).map((w) => kw(w.name, '#7cc6ff', `Météo : ${w.text}`)),
  ...Object.values(TERRAINS).map((t) => kw(t.name, '#8fd16a', `Terrain : ${t.text}`)),
  // mots-clés des cartes
  kw('Épuisée', '#c9a0ff', 'Une fois jouée, la carte est retirée pour le reste du combat.'),
  kw('Conservée', '#c9a0ff', 'La carte reste dans ta main à la fin du tour au lieu d’être défaussée.'),
  kw('Éphémère', '#c9a0ff', 'Si la carte est encore dans ta main à la fin du tour, elle est épuisée.'),
  kw('Innée', '#c9a0ff', 'La carte est toujours dans ta main au début du combat.'),
  kw('Injouable', '#c9a0ff', 'Cette carte ne peut pas être jouée.'),
  kw('Écho', '#ffd76a', 'La première fois que la carte est jouée dans un combat, elle se joue deux fois.'),
];
const KW_INFOS = [...Object.values(STATUS_INFO), ...EXTRA_KW];
const KW = KW_INFOS.map((i) => i.label).sort((a, b) => b.length - a.length);
const KW_RE = new RegExp(`(^|[^\\p{L}])(${KW.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\p{L}])`, 'gu');
const KW_TIP = new Map(KW_INFOS.map((i) => [i.label, i]));
function withStatusTips(html: string): string {
  // on ne touche qu'au texte, jamais à l'intérieur des balises
  return html.split(/(<[^>]+>)/).map((part) => part.startsWith('<') ? part : part.replace(KW_RE, (_m, pre: string, w: string) => {
    const info = KW_TIP.get(w)!;
    const tip = `<b>${info.label}</b><br>${info.text(1).replace(/"/g, '&quot;')}`;
    return `${pre}<span class="kw" style="--c:${info.color}" data-tip="${tip}">${w}</span>`;
  })).join('');
}

/** Cartes légendaires : coins dorés en filigrane, gemme au sommet et reflet qui passe. */
const LEGEND_CORNER = '<svg viewBox="0 0 40 40"><path d="M2 38V14C2 7 7 2 14 2h24" fill="none" stroke="#fff3b0" stroke-width="2.4"/><path d="M6 38V16c0-6 4-10 10-10h22" fill="none" stroke="#c98a1a" stroke-width="1.6"/><path d="M2 14c6 0 10 2 12 6M14 2c0 6 2 10 6 12" fill="none" stroke="#ffd76a" stroke-width="1.4"/><circle cx="12" cy="12" r="3.4" fill="#ff5d8f" stroke="#fff3b0" stroke-width="1.2"/></svg>';
const LEGEND_DECO = `<div class="legend-deco"><i class="tl">${LEGEND_CORNER}</i><i class="tr">${LEGEND_CORNER}</i><i class="bl">${LEGEND_CORNER}</i><i class="br">${LEGEND_CORNER}</i><b class="gem"></b><span class="shine"></span></div>`;
