import { mysteryScreen, renderBlackMarket, renderChest, renderPension, renderTmShop } from './ui/nodes-extra';
import { ZONES } from './data/zones';
import { cycleSound, installAudioUnlock, playTheme, sfx, soundIcon, soundLabel } from './audio/audio';
import '@fontsource/lilita-one/400.css';
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
import { addHistory, equippedSkin, recordRunStats, characterRelics, characterUnlocks, clearRun, exportAll, grantExp, importAll, loadRunData, loadSave, recordEncounter, saveHooks, saveRun, unlockCharacters } from './core/save';
import { confirmBox, renderGlossary, renderSaveScreen, renderTitle } from './ui/title-view';
import { expBreakdown } from './data/unlocks';
import { ENEMY_DEFS } from './data/enemies';
import { BERRY_DEFS } from './data/berries';
import type { EventFight } from './data/events';
import { berrySlots } from './ui/run-ui';

const stage = document.getElementById('stage')!;
const screen = document.getElementById('screen')!;
fitStage(stage);
installTooltips(stage);
installAudioUnlock();

// Bouton son (barre du haut, écran titre) : musique + effets → effets seuls → muet
stage.addEventListener('click', (ev) => {
  const b = (ev.target as HTMLElement).closest('.tb-sound');
  if (!b) return;
  ev.stopPropagation();
  cycleSound();
  document.querySelectorAll<HTMLElement>('.tb-sound').forEach((el) => { el.textContent = soundIcon(); el.dataset.tip = `${soundLabel()} (cliquer pour changer)`; });
}, true);

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
  const inCombat = !!view && document.contains(stage.querySelector('.combat'));
  const canEat = inCombat || !b.combatOnly;
  menu.innerHTML = `<b>${b.name}</b><span>${b.text}</span>
    <button class="btn small primary eat" ${canEat ? '' : 'disabled'}>${canEat ? 'Manger' : 'Seulement en combat'}</button>
    <button class="btn small toss">Jeter la baie</button>`;
  menu.querySelector('.eat')!.addEventListener('click', (e) => {
    e.stopPropagation();
    if (inCombat) {
      if (!view!.eatBerry(b.name, b.fx)) return;
    } else {
      sfx('baie');
      if (b.fx.maxHp) run.maxHp += b.fx.maxHp;
      if (b.fx.heal) run.hp = Math.min(run.maxHp, run.hp + b.fx.heal);
      document.querySelectorAll('.tb-hp').forEach((el) => (el.textContent = `PV ${run.hp}/${run.maxHp}`));
    }
    run.berries.splice(i, 1);
    menu.remove();
    document.querySelectorAll('.tb-berries').forEach((el) => (el.innerHTML = berrySlots(run)));
    persist(run, run.inNode);
  });
  menu.querySelector('.toss')!.addEventListener('click', (e) => {
    e.stopPropagation();
    run.berries.splice(i, 1);
    menu.remove();
    document.querySelectorAll('.tb-berries').forEach((el) => (el.innerHTML = berrySlots(run)));
    // Une place s'est libérée : les baies du butin redeviennent ramassables
    document.querySelectorAll<HTMLElement>('.loot-row.full').forEach((el) => {
      el.classList.remove('full');
      const small = el.querySelector('small');
      if (small) small.textContent = 'Clique pour la ranger dans ton sac';
    });
    persist(run, run.inNode);
  });
  menu.addEventListener('click', (e) => e.stopPropagation());
  stage.appendChild(menu);
});
const save = loadSave();
saveHooks.encounter = (list) => recordEncounter(save, list);

/** Sauvegarde automatique : à chaque étape de la run (inNode = le nœud est commencé mais pas fini). */
function persist(run: Run, inNode: boolean): void {
  run.inNode = inNode;
  saveRun(run.toJSON());
}

/** Résumé de la run sauvegardée (écran titre). */
function savedRunSummary(): string | null {
  const data = loadRunData();
  if (!data) return null;
  try {
    const run = Run.fromJSON(data);
    return `${run.form.name} · acte ${Math.min(run.act, LAST_ACT)} · étage ${run.floor} · ${run.hp}/${run.maxHp} PV`;
  } catch {
    return null;
  }
}

// Menu pendant une run : bouton ☰ de la barre du haut
stage.addEventListener('click', (ev) => {
  if (!(ev.target as HTMLElement).closest('.tb-menu') || !activeRun) return;
  ev.stopPropagation();
  confirmBox(screen, 'Pause', 'Ta run est sauvegardée automatiquement. En quittant pendant un combat ou un événement, tu le reprendras depuis son début.', 'Sauvegarder et quitter', () => {
    activeRun = null;
    title();
  }, 'Reprendre');
}, true);

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

function title(): void {
  clear();
  playTheme('titre');
  activeRun = null;
  const resume = savedRunSummary();
  renderTitle(screen, {
    resume,
    onContinue: continueRun,
    onPlay: () => {
      clearRun();
      menu();
    },
    onGlossary: () => {
      clear();
      renderGlossary(screen, save, title);
    },
    onSave: saveScreen,
  });
}

function saveScreen(): void {
  clear();
  renderSaveScreen(screen, {
    hasRun: savedRunSummary(),
    onBack: title,
    onExport: () => {
      const blob = new Blob([exportAll(save)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `slaypokespyre-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast('Sauvegarde exportée !');
    },
    onImport: (text) => {
      if (!importAll(text)) return toast('Ce fichier n’est pas une sauvegarde de SlayPokeSpyre.');
      toast('Sauvegarde importée !');
      setTimeout(() => location.reload(), 600);
    },
  });
}

function continueRun(): void {
  const data = loadRunData();
  if (!data) return title();
  let run: Run;
  try {
    run = Run.fromJSON(data);
  } catch {
    clearRun();
    toast('La sauvegarde de la run est illisible.');
    return title();
  }
  activeRun = run;
  if (run.act >= LAST_ACT) return run.inNode ? summitStep(run) : showSummit(run);
  if (run.inNode && run.pos) return enterNode(run, run.pos.row, run.pos.col);
  showMap(run);
}

function menu(): void {
  clear();
  playTheme('titre');
  renderSelect(screen, save, (id) => startRun(id), title);
}

function startRun(character: CharacterId): void {
  const params = new URLSearchParams(location.search);
  const run = new Run(params.get('seed') ?? randomSeed(), character, characterUnlocks(save, character), characterRelics(save, character));
  run.skin = equippedSkin(save, character);
  activeRun = run;
  // Pour tester : ?acte=2 commence directement à l'acte 2
  const startAct = Math.min(LAST_ACT, Number(params.get('acte') ?? 1));
  while (run.act < startAct) run.nextAct();
  if (run.act >= LAST_ACT) run.summitStep = Math.min(3, Number(params.get('etape') ?? 0)); // ?acte=4&etape=3 : Dialga direct
  // Pour tester : ?zone=tour-lavanville choisit la zone de l'acte en cours
  if (params.get('zone')) { const z = ZONES.find((x) => x.id === params.get('zone')); if (z) run.zone = z; }
  // Pour tester : ?cartes=vip-aromatherapie,vip-don-naturel ajoute des cartes au deck
  for (const id of (params.get('cartes') ?? '').split(',').filter(Boolean)) run.addCard(id);
  // Pour tester : ?baies=oran,sitrus remplit le sac de baies
  for (const id of (params.get('baies') ?? '').split(',').filter(Boolean)) run.addBerry(id);
  // Pour tester : ?evenement=tarot-diable ouvre directement cet événement
  // Pour tester : ?combat=apireine lance directement un combat contre ce gardien
  if (params.get('combat')) {
    clear();
    playTheme(params.get('combat')!.startsWith('dialga') ? 'dialga' : `gardien-${Math.min(3, run.act)}`);
    (window as unknown as { __vfx: (t: string, p?: boolean) => void }).__vfx = (t, p) => (t === 'bouclier' ? view?.demoShield() : t === 'talent' ? view?.demoTalent() : view?.demoVfx(t as never, p));
    view = new CombatView(screen, run, { seed: `${run.seed}-test`, enemies: params.get('combat')!.split(','), label: 'Test', boss: true }, () => showMap(run));
    return;
  }
  if (params.has('boutique')) { clear(); return renderShop(screen, run, () => showMap(run), (onWin) => kecleonFight(run, onWin)); }
  // Pour tester l'écran de fin : ?fin=victoire ou ?fin=defaite (avec des statistiques d'exemple)
  if (params.get('fin')) {
    run.act = 3; Object.assign(run, { combatsWon: 14, elitesDefeated: 3, duelsWon: 1, eventsSeen: 6, shiniesMet: 1, bossesDefeated: 3, bossNames: ['Dardargnan', 'Camérupt', 'Rayquaza'], lastEnemies: ['heatran'] });
    return endRun(run, params.get('fin') === 'victoire');
  }
  // Pour tester : ?noeud=coffre | pension | ct
  if (params.get('noeud') === 'coffre') { clear(); return renderChest(screen, run, () => showMap(run)); }
  if (params.get('noeud') === 'pension') { clear(); return renderPension(screen, run, () => showMap(run)); }
  if (params.get('noeud') === 'marche-noir') { clear(); return renderBlackMarket(screen, run, () => showMap(run)); }
  if (params.get('noeud') === 'ct') { clear(); return renderTmShop(screen, run, () => showMap(run)); }
  if (params.get('evenement')) { clear(); return renderEvent(screen, run, () => showMap(run), params.get('evenement')!, (f) => duel(run, f)); }
  if (run.act >= LAST_ACT) return showSummit(run);
  showMap(run);
}

function showMap(run: Run): void {
  clear();
  playTheme(run.act >= LAST_ACT ? 'sommet-tour-du-temps' : run.zone.id);
  if (run.act >= LAST_ACT) return showSummit(run);
  persist(run, false);
  renderMap(screen, run, (row, col) => {
    run.moveTo(row, col);
    persist(run, true);
    enterNode(run, row, col);
  });
}

/** Ouvre le nœud de la carte où se trouve le joueur. */
function enterNode(run: Run, row: number, col: number): void {
  {
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
      case 'evenement': {
        const q = run.rollMystery();
        if (q === 'combat') return mysteryIntro(run, 'Une embuscade !', 'Des Pokémon sauvages surgissent des fourrés !', () => fight(run, 'combat'));
        if (q === 'tresor') return mysteryIntro(run, 'Une trouvaille !', 'Quelque chose brille derrière un rocher…', () => renderTreasure(screen, run, back));
        if (q === 'marche-noir') return mysteryIntro(run, 'Une échoppe dans l’ombre…', 'Un Kecleon violet te fait signe depuis une ruelle.', () => renderBlackMarket(screen, run, back));
        run.eventsSeen++;
        return renderEvent(screen, run, back, undefined, (f) => duel(run, f));
      }
      case 'tresor':
        return renderTreasure(screen, run, back);
      case 'coffre':
        return renderChest(screen, run, back);
      case 'pension':
        return renderPension(screen, run, back);
      case 'ct':
        return renderTmShop(screen, run, back);
      case 'boss':
        return fight(run, 'boss');
    }
  }
}

/** Petit écran d'annonce quand un « ? » cache autre chose qu'un événement. */
function mysteryIntro(run: Run, title: string, text: string, go: () => void): void {
  clear();
  mysteryScreen(screen, run, title, text, go);
}

function fight(run: Run, type: 'combat' | 'elite' | 'boss'): void {
  clear();
  const labels = { combat: 'Combat', elite: 'Pokémon dominant', boss: 'Gardien' };
  const enemies = run.encounter(type);
  if (type === 'boss') playTheme(enemies.some((id) => id.startsWith('dialga')) ? 'dialga' : `gardien-${Math.min(3, run.act)}`);
  else playTheme(run.act >= LAST_ACT ? 'sommet-tour-du-temps' : run.zone.id);
  run.lastEnemies = enemies;
  view = new CombatView(
    screen,
    run,
    { seed: `${run.seed}-${run.floor}`, enemies, label: labels[type], boss: type === 'boss' },
    (r) => {
      clear();
      run.hp = r.hp;
      if (r.consumed?.length) run.relics = run.relics.filter((id) => !r.consumed!.includes(id));
      if (!r.victory) return endRun(run, false);
      if (r.fled) return showMap(run); // Hurlement : les ennemis ont fui, pas de récompense
      if (run.relics.includes('grelot-coque')) run.heal(6);
      run.shiniesMet += r.shinies;
      if (type === 'elite') run.elitesDefeated++;
      if (type === 'combat') run.combatsWon++;
      if (type === 'boss') {
        run.bossesDefeated++;
        run.bossNames.push(ENEMY_DEFS[enemies[0]]?.name ?? 'Gardien');
        run.bossIds.push(...enemies);
        if (run.act >= LAST_ACT) return endRun(run, true); // Dialga Primal est apaisé
        const last = run.act >= LAST_ACT;
        return renderReward(
          screen, run,
          {
            money: run.moneyReward('boss', r.shinies), cards: run.cardChoices('boss'), label: labels.boss,
            title: `Gardien de ${run.zone.name} vaincu !`, relic: run.rollBossRelic(), berry: run.rollBerry(),
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
      if (r.fled) return showMap(run);
      onWin();
    },
  );
}

/** Duel lancé par un arcane (« Défier ») : le Pokémon de la carte, plus fort à chaque acte. */
function duel(run: Run, f: EventFight): void {
  clear();
  const power = ([1, 1, 1.7, 2.3, 2.6][run.act] ?? 2.6) * (f.power ?? 1);
  run.lastEnemies = [f.fight];
  view = new CombatView(
    screen, run,
    { seed: `${run.seed}-${run.floor}-duel`, enemies: [f.fight], label: 'Duel', enemyPower: power },
    (r) => {
      clear();
      run.hp = r.hp;
      if (r.consumed?.length) run.relics = run.relics.filter((id) => !r.consumed!.includes(id));
      if (!r.victory) return endRun(run, false);
      if (r.fled) return showMap(run);
      run.duelsWon++;
      run.shiniesMet += r.shinies;
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
  clear();
  persist(run, false);
  renderSummit(screen, run, () => summitStep(run));
}

/** Étape suivante du sommet (sauvegardée avant d'y entrer, pour la reprendre). */
function summitStep(run: Run): void {
  const step = SUMMIT_STEPS[run.summitStep];
  persist(run, true);
  run.summitStep++;
  const back = () => showMap(run);
  clear();
  if (step === 'centre') return renderCentre(screen, run, back);
  if (step === 'boutique') return renderShop(screen, run, back);
  return fight(run, step);
}

/** Fin de run : EXP pour le Pokémon, niveaux et cartes débloquées. */
function endRun(run: Run, victory: boolean): void {
  clearRun();
  activeRun = null;
  const { lines, total: exp } = expBreakdown(run, victory);
  addHistory(save, {
    date: Date.now(), character: run.character, form: run.form?.name ?? CHARACTERS[run.character].name, skin: run.skin, victory,
    floor: run.floor, act: run.act, zone: run.zone.name,
    killedBy: run.lastEnemies.map((id) => ({ name: ENEMY_DEFS[id]?.name ?? id, dex: ENEMY_DEFS[id]?.dex ?? 0 })),
    deck: run.deck.map((c) => ({ id: c.defId, up: c.upgraded })), relics: [...run.relics], berries: [...run.berries],
    exp, seed: run.seed, maxHp: run.maxHp,
  });
  const result = grantExp(save, run.character, exp);
  const newSkins = recordRunStats(save, run.character, {
    shinies: run.shiniesMet, elites: run.elitesDefeated, bosses: run.bossesDefeated, combats: run.combatsWon, wins: victory ? 1 : 0,
  }, run.bossIds);
  for (const k of newSkins) setTimeout(() => toast(`Skin débloqué : ${CHARACTERS[run.character].name} ${k.name.toLowerCase()} ! Choisis-le sur l'écran de sélection.`), 1200);
  const fresh = unlockCharacters(save, run.bossesDefeated, victory);
  if (fresh.length) toast(`Nouveau Pokémon jouable : ${fresh.map((c) => CHARACTERS[c].name).join(', ')} !`);
  renderRunEnd(screen, run, victory, { exp, lines, ...result, total: save.exp[run.character] ?? 0 }, title, () => startRun(run.character));
}

// Les paramètres de test (?tous, ?seed, ?acte, ?evenement, ?boutique) mènent directement au choix du Pokémon
const dev = new URLSearchParams(location.search);
if (['tous', 'seed', 'acte', 'evenement', 'boutique', 'combat'].some((k) => dev.has(k))) menu();
else title();
