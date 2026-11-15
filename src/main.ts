import './ui/style.css';
import type { CharacterId } from './core/model';
import { randomSeed } from './core/rng';
import { BOSS_ROW, Run } from './core/run';
import { CombatView } from './ui/combat-view';
import { renderMap } from './ui/map-view';
import { renderCentre, renderEvent, renderReward, renderRunEnd, renderShop, renderTreasure } from './ui/node-views';
import { renderSelect } from './ui/select-view';
import { fitStage, installTooltips } from './ui/util';
import { characterUnlocks, grantExp, loadSave } from './core/save';
import { runExp } from './data/unlocks';

const stage = document.getElementById('stage')!;
const screen = document.getElementById('screen')!;
fitStage(stage);
installTooltips(stage);

let view: CombatView | null = null;
const save = loadSave();

// Garde anti-clic : juste après un changement d'écran, un clic (double clic, clic trop rapide)
// ne doit pas choisir une carte ou acheter quelque chose sans le vouloir.
let screenShownAt = 0;
screen.addEventListener('click', (ev) => {
  if (performance.now() - screenShownAt < 450) {
    ev.stopPropagation();
    ev.preventDefault();
  }
}, true);

function clear(): void {
  view?.destroy();
  view = null;
  screen.onclick = null;
  screenShownAt = performance.now();
}

function menu(): void {
  clear();
  renderSelect(screen, save, (id) => startRun(id));
}

function startRun(character: CharacterId): void {
  const params = new URLSearchParams(location.search);
  const run = new Run(params.get('seed') ?? randomSeed(), character, characterUnlocks(save, character));
  showMap(run);
}

function showMap(run: Run): void {
  clear();
  renderMap(screen, run, (row, col) => {
    run.moveTo(row, col);
    if (row === BOSS_ROW) return fight(run, 'boss');
    const node = run.nodeAt(row, col)!;
    const back = () => showMap(run);
    clear();
    switch (node.type) {
      case 'combat':
      case 'elite':
        return fight(run, node.type);
      case 'centre':
        return renderCentre(screen, run, back);
      case 'boutique':
        return renderShop(screen, run, back);
      case 'evenement':
        return renderEvent(screen, run, back);
      case 'tresor':
        return renderTreasure(screen, run, back);
      case 'boss':
        return fight(run, 'boss');
    }
  });
}

function fight(run: Run, type: 'combat' | 'elite' | 'boss'): void {
  clear();
  const labels = { combat: 'Combat', elite: 'Pokémon dominant', boss: 'Gardien' };
  view = new CombatView(
    screen,
    run,
    { seed: `${run.seed}-${run.floor}`, enemies: run.encounter(type), label: labels[type] },
    (r) => {
      clear();
      run.hp = r.hp;
      if (!r.victory) return endRun(run, false);
      if (type === 'elite') run.elitesDefeated++;
      if (type === 'boss') {
        run.bossesDefeated++;
        run.money += run.moneyReward('boss', r.shinies);
        return endRun(run, true);
      }
      renderReward(
        screen, run,
        { money: run.moneyReward(type, r.shinies), cards: run.cardChoices(type), title: type === 'elite' ? 'Pokémon dominant vaincu !' : 'Victoire !', label: labels[type] },
        () => showMap(run),
      );
    },
  );
}

/** Fin de run : EXP pour le Pokémon, niveaux et cartes débloquées. */
function endRun(run: Run, victory: boolean): void {
  const exp = runExp(run.floor, run.elitesDefeated, run.bossesDefeated);
  const result = grantExp(save, run.character, exp);
  renderRunEnd(screen, run, victory, { exp, ...result, total: save.exp[run.character] ?? 0 }, menu, () => startRun(run.character));
}

menu();
