// Historique du combat : fenêtre ouverte par le bouton 📜 de la barre du haut.
import type { Combat, CombatEvent, LogMark, Who } from '../core/combat';
import { relicDef } from '../data/relics';
import { POWER_INFO, STATUS_INFO } from './labels';
import { esc } from './util';

const relicName = (id: string): string => { try { return relicDef(id).name; } catch { return id; } };

function whoName(c: Combat, w: Who): string {
  if (w === 'player') return c.player.name;
  if (w === 'bebe') return 'le Bébé';
  return c.enemy(w)?.name ?? 'un ennemi';
}

const EFF: Record<string, string> = { super: ' <em class="lg-super">super efficace</em>', faible: ' <em class="lg-weak">pas très efficace</em>', immunite: ' <em class="lg-weak">peu d’effet</em>' };

/** Une ligne d'historique (null = rien à afficher). */
function line(c: Combat, e: CombatEvent | LogMark): { cls: string; html: string } | null {
  const n = (w: Who) => `<b>${esc(whoName(c, w))}</b>`;
  switch (e.type) {
    case 'turn': return { cls: 'lg-turn', html: e.who === 'joueur' ? 'Ton tour' : 'Tour des ennemis' };
    case 'play': return { cls: 'lg-play', html: `Tu joues <b>${esc(e.name)}</b>${e.target ? ` sur ${esc(e.target)}` : ''}` };
    case 'damage': return { cls: e.target === 'player' || e.target === 'bebe' ? 'lg-hurt' : 'lg-dmg', html: `${n(e.target)} subit <b>${e.amount}</b> dégât${e.amount > 1 ? 's' : ''}${e.blocked ? ` (${e.blocked} absorbé${e.blocked > 1 ? 's' : ''} par la Protection)` : ''}${EFF[e.effectiveness] ?? ''}` };
    case 'hp-loss': return { cls: 'lg-hurt', html: `${n(e.target)} perd <b>${e.amount}</b> PV${e.source !== 'carte' ? ` (${esc(STATUS_INFO[e.source]?.label ?? e.source)})` : ''}` };
    case 'block': return e.amount > 0 ? { cls: 'lg-block', html: `${n(e.target)} gagne <b>${e.amount}</b> Protection` } : null;
    case 'heal': return e.amount > 0 ? { cls: 'lg-heal', html: `${n(e.target)} récupère <b>${e.amount}</b> PV` } : null;
    case 'status': {
      const info = STATUS_INFO[e.status];
      if (!info || !e.stacks) return null;
      return { cls: 'lg-status', html: `${n(e.target)} : <span style="color:${info.color}">${esc(info.label)}</span> ${e.stacks > 0 ? '+' : '−'}${Math.abs(e.stacks)}` };
    }
    case 'aura': return e.amount ? { cls: 'lg-status', html: `Aura ${e.amount > 0 ? '+' : '−'}${Math.abs(e.amount)}` } : null;
    case 'enemy-move': return { cls: 'lg-enemy', html: `<b>${esc(c.enemy(e.uid)?.name ?? 'Ennemi')}</b> utilise <b>${esc(e.name)}</b>` };
    case 'player-move': return { cls: 'lg-note', html: esc(e.name) };
    case 'show-card': return { cls: 'lg-note', html: `${esc(e.label)} : <b>${esc(e.def.name)}</b>${e.failed ? ' (échec)' : ''}` };
    case 'card-added': return { cls: 'lg-note', html: `<b>${esc(e.def.name)}</b>${e.count && e.count > 1 ? ` × ${e.count}` : ''} rejoint ${({ pioche: 'la pioche', defausse: 'la défausse', main: 'ta main', deck: 'ton deck' })[e.to]}` };
    case 'duo-swap': return { cls: 'lg-note', html: `${e.front === 'posipi' ? 'Posipi' : 'Négapi'} passe en première ligne${e.ko ? ' (partenaire K.O.)' : ''}` };
    case 'energy': return e.delta ? { cls: 'lg-note', html: `${e.delta > 0 ? '+' : '−'}${Math.abs(e.delta)} PA (${esc(e.reason)})` } : null;
    case 'meteo': return { cls: 'lg-note', html: e.ended ? `${esc(e.name)} se dissipe` : `${esc(e.name)} !` };
    case 'break': return { cls: 'lg-note', html: `La Protection de ${n(e.target)} est brisée` };
    case 'power': return { cls: 'lg-play', html: `Talent : <b>${esc(POWER_INFO[e.power]?.label ?? e.power)}</b>` };
    case 'relic': return { cls: 'lg-note', html: `Objet : <b>${esc(relicName(e.id))}</b>` };
    case 'ko': return { cls: 'lg-ko', html: `${n(e.target)} est K.O. !` };
    default: return null;
  }
}

export function openCombatLog(root: HTMLElement, c: Combat): void {
  root.querySelector('.combat-log')?.remove();
  let turn = -1;
  const rows: string[] = [];
  for (const { turn: t, entry } of c.log) {
    const l = line(c, entry);
    if (!l) continue;
    if (l.cls === 'lg-turn') { if (t !== turn) { turn = t; rows.push(`<div class="lg-turn-head">Tour ${t}</div>`); } }
    rows.push(`<div class="lg-row ${l.cls}">${l.html}</div>`);
  }
  const box = document.createElement('div');
  box.className = 'combat-log';
  box.innerHTML = `<div class="cl-panel">
      <div class="cl-head"><b>Historique du combat</b><button class="btn cl-close">Fermer</button></div>
      <div class="cl-body">${rows.join('') || '<div class="lg-row lg-note">Rien pour l’instant.</div>'}</div>
    </div>`;
  box.addEventListener('click', (ev) => {
    const t = ev.target as HTMLElement;
    if (t.closest('.cl-close') || t === box) box.remove();
  });
  root.appendChild(box);
  const body = box.querySelector('.cl-body')!;
  body.scrollTop = body.scrollHeight;
}
