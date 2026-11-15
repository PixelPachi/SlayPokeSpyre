// Textes et couleurs affichés à l'écran.
import type { CardDef, Effect, PowerId, StatusId } from '../core/model';
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

export const POWER_INFO: Record<PowerId, { label: string; text: (n: number) => string }> = {
  plenitude: { label: 'Plénitude', text: (n) => `Au début de chaque tour, gagne ${n} Aura.` },
  'lire-esprit': { label: 'Lire-Esprit', text: () => 'Si ton tour commence avec 30 Aura ou plus, tes cartes coûtent 0 PA pendant ce tour.' },
  'champ-herbu': { label: 'Champ Herbu', text: (n) => `Au début de chaque tour, récupère ${n} PV.` },
  racines: { label: 'Racines', text: (n) => `Au début de chaque tour, gagne ${n} Protection.` },
  'zenith-plante': { label: 'Zénith', text: (n) => `Tes attaques Plante infligent ${n} dégâts de plus.` },
  'amour-filial': { label: 'Amour Filial', text: (n) => `Le Bébé attaque ${n} fois de plus à la fin de chaque tour.` },
  eveil: { label: 'Éveil', text: (n) => `Au début de chaque tour, le Bébé gagne ${n} Puissance.` },
  zenith: { label: 'Zénith', text: (n) => `Tes attaques Feu infligent ${n} dégâts de plus.` },
  braises: { label: 'Braises', text: (n) => `Au début de chaque tour, applique ${n} Brûlure à tous les ennemis.` },
  souvenir: { label: 'Souvenir', text: (n) => `Au début de chaque tour, ajoute ${n} carte${n > 1 ? 's' : ''} de n'importe quel Pokémon au hasard dans ta main.` },
  telekinesie: { label: 'Télékinésie', text: (n) => `Au début de chaque tour, pioche ${n} carte${n > 1 ? 's' : ''} de plus.` },
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
        const times = e.hitsMax ? ` ${e.hits ?? 1} à ${e.hitsMax} fois` : e.hits && e.hits > 1 ? ` ${e.hits} fois` : '';
        parts.push(`Inflige ${hl(v, base ?? e.amount)} dégâts${who}${times}.`);
        if (e.facade) parts.push('Double si tu as Brûlure, Poison ou Paralysie.');
        if (e.revanche) parts.push('Double si tu as perdu des PV au dernier tour ennemi.');
        if (e.drain) parts.push('Récupère la moitié des dégâts infligés.');
        if (e.contreStatut) parts.push('Double si la cible a un statut.');
        if (e.parStatut) parts.push(`+${e.parStatutX ?? 1} par ${STATUS_INFO[e.parStatut].label} sur la cible.`);
        break;
      }
      case 'degats-aura':
        parts.push(`Inflige ${dmg !== null ? `${hl(dmg, 0)} dégâts (` : ''}Aura × ${e.mult}${dmg !== null ? ')' : ' dégâts'}.`);
        parts.push(e.consume === false ? "<b>Ne consomme pas</b> l'Aura." : "L'Aura retombe à 0.");
        break;
      case 'degats-pv-perdus':
        parts.push(`Inflige ${dmg !== null ? hl(dmg, e.amount) : e.amount} dégâts, +1 par ${e.per} PV perdus.`);
        break;
      case 'tout-ou-rien':
        parts.push(`Inflige ${dmg !== null ? `<b>${dmg}</b>` : 'autant de'} dégâts que tes PV, puis tombe à 1 PV.`);
        break;
      case 'aura-protection':
        parts.push(e.mult === 1 ? "Convertit toute ton Aura en Protection." : `Convertit ton Aura en Protection (× ${e.mult}).`);
        break;
      case 'casse-protection': parts.push(d.target === 'tous' ? 'Retire la Protection de tous les ennemis.' : 'Retire la Protection de la cible.'); break;
      case 'soin': parts.push(`Récupère <b>${e.amount}</b> PV.`); break;
      case 'copie': parts.push('Rejoue la dernière carte jouée.'); break;
      case 'metronome': parts.push('Joue l’effet d’une de tes cartes au hasard.'); break;
      case 'pouvoir': parts.push(POWER_INFO[e.power].text(e.amount)); break;
      case 'statut-mult': parts.push(`${e.mult === 2 ? 'Double' : `Multiplie par ${e.mult}`} la ${STATUS_INFO[e.status].label} ${e.on === 'tous' ? 'de tous les ennemis' : 'de la cible'}.`); break;
      case 'ajoute-carte': parts.push(`Ajoute ${e.count} carte${e.count > 1 ? 's' : ''} ${e.from === 'neutre' ? 'neutre' : 'de n’importe quel Pokémon'}${e.count > 1 ? 's' : ''} au hasard dans ta main.`); break;
      case 'bebe-attaque': parts.push(e.times > 1 ? `Le Bébé attaque ${e.times} fois.` : 'Le Bébé attaque.'); break;
      case 'bebe-puissance': parts.push(`Le Bébé gagne <b>${e.amount}</b> Puissance.`); break;
      case 'bebe-soin': parts.push(`Soigne le Bébé de <b>${e.amount}</b> PV.`); break;
      case 'bebe-pvmax': parts.push(`Le Bébé gagne <b>${e.amount}</b> PV max.`); break;
      case 'bebe-protection': parts.push(`Le Bébé gagne <b>${e.amount}</b> Protection.`); break;
      case 'protection': parts.push(`Gagne <b>${e.amount}</b> Protection.`); break;
      case 'statut': {
        const s = STATUS_INFO[e.status].label;
        if (e.on === 'soi' && (e.status === 'attaque' || e.status === 'defense')) {
          // Contestation : les baisses de stats de Vipélierre deviennent des hausses
          parts.push(d.character === 'vipelierre' && e.stacks < 0 ? `${s} ${signed(-e.stacks)} <i>(Contestation)</i>.` : `${s} ${signed(e.stacks)}.`);
        } else if (e.on === 'soi') parts.push(`Gagne ${e.stacks} ${s}.`);
        else parts.push(`Applique <b>${e.stacks}</b> ${s}${e.on === 'tous' ? ' à tous les ennemis' : ''}.`);
        break;
      }
      case 'pioche': parts.push(`Pioche <b>${e.amount}</b> carte${e.amount > 1 ? 's' : ''}.`); break;
      case 'pa': parts.push(`Gagne <b>${e.amount}</b> PA.`); break;
      case 'perte-pv': parts.push(d.character === 'riolu' ? `Perd <b>${e.amount}</b> PV <span class="aura-note">(+${e.amount} Aura)</span>.` : `Perd <b>${e.amount}</b> PV.`); break;
      case 'aura': parts.push(`Gagne <b>${e.amount}</b> Aura.`); break;
      case 'aura-mult': parts.push(e.amount === 2 ? 'Double ton Aura.' : `Multiplie ton Aura par ${e.amount}.`); break;
    }
  }
  for (const k of d.keywords ?? []) parts.push(`<i>${KEYWORD_LABELS[k]}.</i>`);
  return parts.join(' ');
}
