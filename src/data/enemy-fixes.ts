// Cohérence des capacités ennemies avec leur effet dans les jeux Pokémon.
// Appliqué une fois au chargement, par identifiant de capacité (et de Pokémon quand ça dépend de lui).
import type { EnemyMove } from '../core/model';
import { ENEMY_DEFS } from './enemies';

const each = (pred: (enemyId: string, m: EnemyMove) => boolean, fix: (m: EnemyMove) => void) => {
  for (const e of Object.values(ENEMY_DEFS)) for (const m of e.moves) if (pred(e.id, m)) fix(m);
};
const byName = (...names: string[]) => (_: string, m: EnemyMove) => names.includes(m.name);

// Capacités qui drainent : l'ennemi récupère la moitié des dégâts infligés
each(byName('Méga-Sangsue', 'Giga-Sangsue', 'Vampirisme', 'Vampipoing', 'Vampi-Poing', 'Vampibaiser', 'Dévorêve'), (m) => {
  m.drain = true;
  if (m.selfStatus?.status === 'defense') delete m.selfStatus; // Vampirisme de Paras : pas de Défense
  if (m.name === 'Vampipoing' || m.name === 'Vampibaiser') delete m.block;
});
// Contrecoup : l'ennemi se blesse
each(byName('Bélier'), (m) => { m.recoil = 4; delete m.selfStatus; });
each(byName("Fracass'Tête"), (m) => { m.recoil = 7; });
each(byName('Sacrifice'), (m) => { m.recoil = 3; });
// Colère et Mania : l'ennemi devient confus après sa furie
each(byName('Colère', 'Mania'), (m) => { m.selfStatus = { status: 'confusion', stacks: 2 }; });
// Soins : Appel Soins et Atterrissage soignent au lieu de renforcer
each(byName('Appel Soins'), (m) => { delete m.selfStatus; m.block = 6; m.heal = 12; m.intent = 'defense'; });
each(byName('Atterrissage'), (m) => { m.block = 8; m.heal = 16; });
// Hypnose et Berceuse endorment
each(byName('Hypnose', 'Berceuse'), (m) => { m.playerStatus = { status: 'sommeil', stacks: 1 }; });
// Grimace effraie (Peur), comme chez la plupart des Pokémon qui l'utilisent
each(byName('Grimace'), (m) => { m.playerStatus = { status: 'peur', stacks: 2 }; });
// Météo : Tempêtesable et Grêle déclenchent vraiment la météo
each(byName('Tempêtesable'), (m) => { delete m.playerStatus; m.meteo = 'tempete-sable'; m.block = m.block ?? 10; m.intent = 'boost'; });
each((id, m) => m.name === 'Grêle' && !m.meteo, (m) => { delete m.playerStatus; m.meteo = 'grele'; m.block = m.block ?? 10; m.intent = 'boost'; });
// Ligotage et Étreinte ligotent (6 PV par tour pendant 3 tours)
each(byName('Ligotage', 'Étreinte'), (m) => { m.damage = Math.max(4, Math.round((m.damage ?? 4) * 1.2)); delete m.hits; m.playerStatus = { status: 'ligote', stacks: 1 }; });
