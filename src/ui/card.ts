// Rendu HTML d'une carte, partagé par le combat, les récompenses, la boutique et le deck.
import type { CardDef } from '../core/model';
import { TYPE_LABELS } from '../core/types';
import { CATEGORY_LABELS, CHARACTER_COLORS, TYPE_COLORS, cardText } from './labels';
import { esc } from './util';
import { artUrl, frameUrl } from './card-assets';

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
  const frame = frameUrl(d.character);
  const art = artUrl(d.name, d.character);
  return `
    <div class="card rarity-${d.rarity} ${frame ? 'has-frame' : ''} ${o.classes ?? ''}" ${o.uid !== undefined ? `data-uid="${o.uid}"` : ''}
         style="--tc:${CHARACTER_COLORS[d.character]};--type:${TYPE_COLORS[d.pokeType]};${frame ? `--frame:url('${frame}');` : ''}${o.style ?? ''}">
      <div class="card-inner">
        <div class="card-window">
          <div class="card-art">${art ? `<img src="${art}" alt="" draggable="false">` : CATEGORY_ART[d.category]}</div>
          <div class="card-type">${TYPE_LABELS[d.pokeType]}</div>
        </div>
        ${frame ? '<div class="card-tint"></div>' : ''}
        <div class="card-banner"><div class="card-name ${d.name.length > 13 ? 'long' : ''}">${esc(d.name)}</div></div>
        <div class="card-cat">${CATEGORY_LABELS[d.category]}${o.stab && base ? ' <span class="stab" data-tip="Même type que ton Pokémon : dégâts ×1,25">★</span>' : ''}</div>
        <div class="card-text ${textLen(text) > 115 ? 'xlong' : textLen(text) > 80 ? 'long' : ''}"><span>${text}</span></div>
        ${o.key ? `<div class="card-key">${o.key}</div>` : ''}
      </div>
      <div class="card-cost ${o.costTooHigh ? 'too-much' : ''} ${o.cost !== undefined && o.cost < d.cost ? 'free' : ''}">${o.cost ?? d.cost}</div>
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
