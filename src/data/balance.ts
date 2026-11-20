// Équilibrage des ennemis : multiplicateurs de PV et de dégâts, réglés d'après des simulations de combats
// (un robot joue des centaines de combats par acte ; on vise une difficulté régulière dans chaque acte).
import { ENEMY_DEFS } from './enemies';

const TUNE: Record<string, { hp?: number; dmg?: number; st?: number }> = {
  // Acte 1 : les Pokémon seuls trop faciles se renforcent, les gardiens s'alignent
  hoothoot: { hp: 1.2, dmg: 1.25 }, zigzaton: { hp: 1.2, dmg: 1.25 }, ceribou: { hp: 1.2, dmg: 1.25 }, chlorobule: { hp: 1.2, dmg: 1.25 },
  roucool: { hp: 1.1, dmg: 1.1 }, aspicot: { dmg: 0.85 },
  charmillon: { hp: 1.25, dmg: 1.3 }, rattatac: { hp: 1.2, dmg: 1.25 }, chapignon: { hp: 1.2, dmg: 1.25 },
  cerifleur: { hp: 1.2, dmg: 1.25 }, couverdure: { hp: 1.2, dmg: 1.25 }, scarhino: { hp: 0.9, dmg: 0.88 }, migalos: { dmg: 0.9 },
  // Acte 2
  melofee: { hp: 1.15, dmg: 1.15 }, ramoloss: { hp: 1.15, dmg: 1.15 }, kranidos: { hp: 1.1, dmg: 1.15 },
  rototaupe: { hp: 1.15, dmg: 1.15 }, chamallot: { hp: 1.1, dmg: 1.1 },
  spoink: { dmg: 0.8 }, machoc: { dmg: 0.85 }, moufouette: { dmg: 0.85 }, smogo: { dmg: 0.9 },
  bastiodon: { hp: 0.85 }, chartor: { dmg: 0.9 },
  camerupt: { hp: 0.75, dmg: 0.78, st: 0.6 }, melodelfe: { hp: 0.82, dmg: 0.9 }, charkos: { hp: 0.9, dmg: 0.95 }, ohmassacre: { dmg: 0.9 },
  // Acte 3
  onix: { hp: 1.1 }, donphan: { hp: 1.1 }, ursaring: { hp: 1.05 }, kaorine: { hp: 1.1 }, magmar: { hp: 1.05 }, drakkarmin: { hp: 1.1 },
  branette: { hp: 0.75, dmg: 0.7, st: 0.65 }, gravalanch: { dmg: 0.85 }, smogogo: { dmg: 0.85 }, feuforeve: { dmg: 0.85 }, machopeur: { dmg: 0.9 },
  rhinocorne: { dmg: 0.9 },
  mackogneur: { dmg: 0.9 }, tranchodon: { dmg: 0.9 }, maganon: { hp: 0.85, dmg: 0.85 }, drattak: { hp: 0.85, dmg: 0.85 },
  dracolosse: { hp: 0.9, dmg: 0.85 }, tyranocif: { hp: 0.7, dmg: 0.76 },
  rayquaza: { hp: 0.8, dmg: 0.75 }, heatran: { hp: 0.6, dmg: 0.62, st: 0.5 }, zekrom: { hp: 0.75, dmg: 0.75 },
};

for (const [id, t] of Object.entries(TUNE)) {
  const e = ENEMY_DEFS[id];
  if (!e) continue;
  if (t.hp) e.hp = [Math.round(e.hp[0] * t.hp), Math.round(e.hp[1] * t.hp)];
  if (t.st) for (const m of e.moves) if (m.playerStatus && m.playerStatus.stacks > 0) m.playerStatus = { ...m.playerStatus, stacks: Math.max(1, Math.round(m.playerStatus.stacks * t.st)) };
  if (t.dmg) for (const m of e.moves) if (m.damage !== undefined) m.damage = Math.max(1, Math.round(m.damage * t.dmg));
}
