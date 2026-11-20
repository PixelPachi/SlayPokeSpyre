import './ui/style.css';
import type { CharacterId } from './core/model';
import { randomSeed } from './core/rng';
import { BOSS_ROW, LAST_ACT, Run, SUMMIT_STEPS } from './core/run';
import { CombatView } from './ui/combat-view';
import { renderMap } from './ui/map-view';
import { renderActIntro, renderSummit, renderCentre, renderEvent, renderReward, renderRunEnd, renderShop, renderTreasure } from './ui/node-views';
import { renderSelect } from './ui/select-view';
import { fitStage, installTooltips, toast } from './ui/util';
import { CHARACTERS } from './data/characters';
import { characterRelics, characterUnlocks, grantExp, loadSave, unlockCharacters } from './core/save';
import { runExp } from './data/unlocks';
import { BERRY_DEFS } from './data/berries';
import type { EventFight } from './data/events';
import { berrySlots } from './ui/run-ui';

const stage = document.getElementById('stage')!;
const screen = document.getElementById('screen')!;
fitStage(stage);
installTooltips(stage);

let view: CombatView | null = null;
/** Run en cours (pour le menu des baies). */
let activeRun: Run | null = null;

// Baies : cliquer une baie de la barre du haut ouvre un petit menu (effet à venir, jeter)
stage.addEventListener('click', (ev) => {
  const slot = (ev.target as HTMLElement).closest<HTMLElement>('.berry-slot[data-berry-index]');
  document.querySelector('.berry-menu')?.remove();
  if (!slot || !activeRun) return;
  const run = activeRun;
  const i = Number(slot.dataset.berryIndex);
  const b = BERRY_DEFS[run.berries[i]];
  const menu = document.createElement('div');
  menu.className = 'berry-menu';
  const r = slot.getBoundingClientRect(), s = stage.getBoundingClientRect(), k = s.width / 1280;
  menu.style.left = `${(r.left - s.left) / k - 40}px`;
  menu.style.top = `${(r.bottom - s.top) / k + 6}px`;
  menu.innerHTML = `<b>${b.name}</b><span>${b.text || 'Effet à venir : les baies ne s’utilisent pas encore.'}</span><button class="btn small toss">Jeter la baie</button>`;
  menu.querySelector('.toss')!.addEventListener('click', (e) => {
    e.stopPropagation();
    run.berries.splice(i, 1);
    menu.remove();
    document.querySelectorAll('.tb-berries').forEach((el) => (el.innerHTML = berrySlots(run)));
  });
  menu.addEventListener('click', (e) => e.stopPropagation());
  stage.appendChild(menu);
});
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
  const run = new Run(params.get('seed') ?? randomSeed(), character, characterUnlocks(save, character), characterRelics(save, character));
  activeRun = run;
  // Pour tester : ?acte=2 commence directement à l'acte 2
  const startAct = Math.min(LAST_ACT, Number(params.get('acte') ?? 1));
  while (run.act < startAct) run.nextAct();
  if (run.act >= LAST_ACT) run.summitStep = Math.min(3, Number(params.get('etape') ?? 0)); // ?acte=4&etape=3 : Dialga direct
  // Pour tester : ?evenement=tarot-diable ouvre directement cet événement
  if (params.has('boutique')) { clear(); return renderShop(screen, run, () => showMap(run), (onWin) => kecleonFight(run, onWin)); }
  if (params.get('evenement')) { clear(); return renderEvent(screen, run, () => showMap(run), params.get('evenement')!, (f) => duel(run, f)); }
  showMap(run);
}

function showMap(run: Run): void {
  clear();
  if (run.act >= LAST_ACT) return showSummit(run);
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
        return renderShop(screen, run, back, (onWin) => kecleonFight(run, onWin));
      case 'evenement':
        return renderEvent(screen, run, back, undefined, (f) => duel(run, f));
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
      if (r.consumed?.length) run.relics = run.relics.filter((id) => !r.consumed!.includes(id));
      if (!r.victory) return endRun(run, false);
      if (run.relics.includes('grelot-coque')) run.heal(6);
      if (type === 'elite') run.elitesDefeated++;
      if (type === 'boss') {
        run.bossesDefeated++;
        if (run.act >= LAST_ACT) return endRun(run, true); // Dialga Primal est apaisé
        const last = run.act >= LAST_ACT;
        return renderReward(
          screen, run,
          {
            money: run.moneyReward('boss', r.shinies), cards: run.cardChoices('boss'), label: labels.boss,
            title: `Gardien de ${run.zone.name} vaincu !`, relic: run.rollRelics(1)[0], berry: run.rollBerry(),
          },
          () => {
            if (last) return endRun(run, true);
            run.nextAct();
            clear();
            renderActIntro(screen, run, () => showMap(run));
          },
        );
      }
      renderReward(
        screen, run,
        {
          money: run.moneyReward(type, r.shinies), cards: run.cardChoices(type), label: labels[type],
          title: type === 'elite' ? 'Pokémon dominant vaincu !' : 'Victoire !',
          relic: type === 'elite' ? run.rollRelics(1)[0] : undefined,
          berry: run.rng.next() < (type === 'elite' ? 0.6 : 0.35) ? run.rollBerry() : undefined,
        },
        () => showMap(run),
      );
    },
  );
}

/** Attaquer Kecleon pour piller son marché : combat difficile ; ensuite, plus aucun marché ne t'accueille. */
function kecleonFight(run: Run, onWin: () => void): void {
  clear();
  run.kecleonHostile = true;
  const power = [1, 1, 1.6, 2.2, 2.5][run.act] ?? 2.5;
  view = new CombatView(
    screen, run,
    { seed: `${run.seed}-${run.floor}-kecleon`, enemies: ['kecleon'], label: 'Kecleon furieux', enemyPower: power },
    (r) => {
      clear();
      run.hp = r.hp;
      if (r.consumed?.length) run.relics = run.relics.filter((id) => !r.consumed!.includes(id));
      if (!r.victory) return endRun(run, false);
      onWin();
    },
  );
}

/** Duel lancé par un arcane (« Défier ») : le Pokémon de la carte, plus fort à chaque acte. */
function duel(run: Run, f: EventFight): void {
  clear();
  const power = ([1, 1, 1.7, 2.3, 2.6][run.act] ?? 2.6) * (f.power ?? 1);
  view = new CombatView(
    screen, run,
    { seed: `${run.seed}-${run.floor}-duel`, enemies: [f.fight], label: 'Duel', enemyPower: power },
    (r) => {
      clear();
      run.hp = r.hp;
      if (r.consumed?.length) run.relics = run.relics.filter((id) => !r.consumed!.includes(id));
      if (!r.victory) return endRun(run, false);
      renderReward(
        screen, run,
        { money: run.moneyReward('elite', r.shinies), cards: run.cardChoices('boss'), label: 'Duel', title: 'Duel remporté !', relic: f.relic ? run.rollRelics(1)[0] : undefined },
        () => showMap(run),
      );
    },
  );
}

/** Le sommet : une étape après l'autre jusqu'à Dialga Primal. */
function showSummit(run: Run): void {
  renderSummit(screen, run, () => {
    const step = SUMMIT_STEPS[run.summitStep];
    run.summitStep++;
    const back = () => showMap(run);
    clear();
    if (step === 'centre') return renderCentre(screen, run, back);
    if (step === 'boutique') return renderShop(screen, run, back);
    return fight(run, step);
  });
}

/** Fin de run : EXP pour le Pokémon, niveaux et cartes débloquées. */
function endRun(run: Run, victory: boolean): void {
  const base = runExp(run.floor, run.elitesDefeated, run.bossesDefeated);
  const exp = run.relics.includes('oeuf-chance') ? Math.floor(base * 1.5) : base;
  const result = grantExp(save, run.character, exp);
  const fresh = unlockCharacters(save, run.bossesDefeated, victory);
  if (fresh.length) toast(`Nouveau Pokémon jouable : ${fresh.map((c) => CHARACTERS[c].name).join(', ')} !`);
  renderRunEnd(screen, run, victory, { exp, ...result, total: save.exp[run.character] ?? 0 }, menu, () => startRun(run.character));
}

menu();
