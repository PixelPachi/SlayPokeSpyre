// Rendu HTML d'une carte, partagé par le combat, les récompenses, la boutique et le deck.
import type { CardDef } from '../core/model';
import { TYPE_LABELS } from '../core/types';
import { CATEGORY_LABELS, TYPE_COLORS, cardText } from './labels';
import { esc } from './util';

export interface CardRenderOptions {
  uid?: number;
  /** Texte d'effet déjà calculé (sinon le texte de base). */
  text?: string;
  classes?: string;
  style?: string;
  key?: string;
  stab?: boolean;
  costTooHigh?: boolean;
}

export function renderCard(d: CardDef, o: CardRenderOptions = {}): string {
  const base = d.effects.find((e) => e.kind === 'degats');
  const text = o.text ?? cardText(d, null, null);
  return `
    <div class="card rarity-${d.rarity} ${o.classes ?? ''}" ${o.uid !== undefined ? `data-uid="${o.uid}"` : ''}
         style="--tc:${TYPE_COLORS[d.pokeType]};${o.style ?? ''}">
      <div class="card-inner">
        <div class="card-cost ${o.costTooHigh ? 'too-much' : ''}">${d.cost}</div>
        <div class="card-type">${TYPE_LABELS[d.pokeType]}</div>
        <div class="card-name">${esc(d.name)}</div>
        <div class="card-art">${CATEGORY_ART[d.category]}</div>
        <div class="card-cat">${CATEGORY_LABELS[d.category]}${o.stab && base ? ' <span class="stab" data-tip="Même type que ton Pokémon : dégâts ×1,25">★</span>' : ''}</div>
        <div class="card-text"><span>${text}</span></div>
        ${o.key ? `<div class="card-key">${o.key}</div>` : ''}
      </div>
    </div>`;
}

const CATEGORY_ART: Record<string, string> = {
  attaque: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(255,255,255,.18)"/><path d="M18 40l18-18 6 6-18 18z" fill="#fff" opacity=".9"/><path d="M38 14l12 12-4 4-12-12z" fill="#fff"/><path d="M14 44l6 6-4 2-4-4z" fill="#fff"/></svg>',
  technique: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(255,255,255,.18)"/><path d="M32 12l16 6v11c0 10-7 18-16 22-9-4-16-12-16-22V18z" fill="#fff" opacity=".9"/></svg>',
  talent: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(255,255,255,.18)"/><path d="M32 12l5 13h14l-11 8 4 14-12-9-12 9 4-14-11-8h14z" fill="#fff" opacity=".9"/></svg>',
  statut: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="rgba(0,0,0,.25)"/></svg>',
};
