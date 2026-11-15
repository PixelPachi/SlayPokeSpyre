// Textes et couleurs affichés à l'écran.
import type { CardDef, Effect, StatusId } from '../core/model';
import type { PokeType } from '../core/types';

export const TYPE_COLORS: Record<PokeType, string> = {
  normal: '#A8A77A', feu: '#EE8130', eau: '#6390F0', electrik: '#F7D02C', plante: '#7AC74C',
  glace: '#96D9D6', combat: '#C22E28', poison: '#A33EA1', sol: '#E2BF65', vol: '#A98FF3',
  psy: '#F95587', insecte: '#A6B91A', roche: '#B6A136', spectre: '#735797', dragon: '#6F35FC',
  tenebres: '#705746', acier: '#B7B7CE', fee: '#D685AD',
};

/** Code couleur des cartes de chaque personnage (les cartes communes restent grises). */
export const CHARACTER_COLORS: Record<string, string> = {
  riolu: '#3a7bd5', vipelierre: '#3f9f45', kangourex: '#8b6343', caninos: '#d6402b', mew: '#e57bb8', normal: '#8f8f8f',
};

export const STATUS_INFO: Record<StatusId, { label: string; color: string; text: (n: number) => string }> = {
  brulure: { label: 'Brûlure', color: '#ff7a2f', text: (n) => `Perd ${n} PV au début du tour et inflige 25 % de dégâts en moins. Baisse de 1 chaque tour.` },
  poison: { label: 'Poison', color: '#b45cd6', text: (n) => `Perd ${n} PV au début du tour. Baisse de 1 chaque tour.` },
  vampigraine: { label: 'Vampigraine', color: '#5fbf4a', text: (n) => `Perd ${n} PV au début du tour ; celui qui l'a posée récupère la moitié. Baisse de 1 chaque tour.` },
  paralysie: { label: 'Paralysie', color: '#f2cf2c', text: (n) => `Inflige 25 % de dégâts en moins pendant ${n} tour${n > 1 ? 's' : ''}.` },
  peur: { label: 'Peur', color: '#d94b4b', text: (n) => `Subit 50 % de dégâts en plus pendant ${n} tour${n > 1 ? 's' : ''}.` },
  confusion: { label: 'Confusion', color: '#c78bd9', text: (n) => `Gagne 25 % de Protection en moins pendant ${n} tour${n > 1 ? 's' : ''}.` },
  sommeil: { label: 'Sommeil', color: '#8fa7d9', text: () => 'Saute son prochain tour.' },
  attaque: { label: 'Attaque', color: '#ff9b4a', text: (n) => `${n > 0 ? '+' : ''}${n} dégâts par coup.` },
  defense: { label: 'Défense', color: '#5aa5ff', text: (n) => `${n > 0 ? '+' : ''}${n} Protection par carte.` },
};

export const CATEGORY_LABELS: Record<CardDef['category'], string> = {
  attaque: 'Attaque', technique: 'Technique', talent: 'Talent', statut: 'Statut',
};

const KEYWORD_LABELS: Record<NonNullable<CardDef['keywords']>[number], string> = {
  epuisee: 'Épuisée', conservee: 'Conservée', ephemere: 'Éphémère', innee: 'Innée', injouable: 'Injouable',
};

const signed = (n: number) => (n > 0 ? `+${n}` : `−${-n}`);

/** Texte d'effet d'une carte. `dmg` = dégâts réels à afficher à la place de la valeur de base. */
export function cardText(d: CardDef, dmg: number | null, base: number | null): string {
  const parts: string[] = [];
  const hl = (v: number, b: number) => `<b class="${v > b ? 'up' : v < b ? 'down' : ''}">${v}</b>`;
  for (const e of d.effects as Effect[]) {
    switch (e.kind) {
      case 'degats': {
        const v = dmg ?? e.amount;
        const who = d.target === 'tous' ? ' à tous les ennemis' : d.target === 'aleatoire' ? ' à un ennemi au hasard' : '';
        parts.push(`Inflige ${hl(v, base ?? e.amount)} dégâts${who}${e.hits && e.hits > 1 ? ` ${e.hits} fois` : ''}.`);
        break;
      }
      case 'protection': parts.push(`Gagne <b>${e.amount}</b> Protection.`); break;
      case 'statut': {
        const s = STATUS_INFO[e.status].label;
        if (e.on === 'soi') parts.push(e.status === 'attaque' || e.status === 'defense' ? `${s} ${signed(e.stacks)}.` : `Gagne ${e.stacks} ${s}.`);
        else parts.push(`Applique <b>${e.stacks}</b> ${s}${e.on === 'tous' ? ' à tous les ennemis' : ''}.`);
        break;
      }
      case 'pioche': parts.push(`Pioche <b>${e.amount}</b> carte${e.amount > 1 ? 's' : ''}.`); break;
      case 'pa': parts.push(`Gagne <b>${e.amount}</b> PA.`); break;
      case 'perte-pv': parts.push(`Perd <b>${e.amount}</b> PV.`); break;
      case 'aura': parts.push(`Gagne <b>${e.amount}</b> Aura.`); break;
      case 'degats-aura': parts.push(dmg !== null ? `Inflige ${hl(dmg, 0)} dégâts (Aura × ${e.mult}). L'Aura retombe à 0.` : `Inflige Aura × ${e.mult} dégâts. L'Aura retombe à 0.`); break;
      case 'aura-mult': parts.push(e.amount === 2 ? 'Double ton Aura.' : `Multiplie ton Aura par ${e.amount}.`); break;
    }
  }
  for (const k of d.keywords ?? []) parts.push(`<i>${KEYWORD_LABELS[k]}.</i>`);
  return parts.join(' ');
}
