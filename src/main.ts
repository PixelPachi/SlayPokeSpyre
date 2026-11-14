import './ui/style.css';
import { makeDeck } from './core/combat';
import { Rng, randomSeed } from './core/rng';
import { CHARACTERS } from './data/characters';
import { ENCOUNTERS_FORET_DE_JADE } from './data/enemies';
import { CombatView } from './ui/combat-view';
import { renderSelect } from './ui/select-view';
import { fitStage, installTooltips } from './ui/util';

const stage = document.getElementById('stage')!;
const screen = document.getElementById('screen')!;
fitStage(stage);
installTooltips(stage);

let view: CombatView | null = null;

function menu(): void {
  view?.destroy();
  view = null;
  renderSelect(screen, (id) => startRun(id === 'riolu' ? id : 'riolu'));
}

/** Prototype du jalon 1 : une suite de combats dans la Forêt de Jade, PV conservés. */
function startRun(character: 'riolu'): void {
  const seed = new URLSearchParams(location.search).get('seed') ?? randomSeed();
  const rng = new Rng(seed);
  const deck = makeDeck(CHARACTERS[character].starterDeck);
  let fight = 0;
  let hp: number | undefined;

  const next = () => {
    view?.destroy();
    fight++;
    view = new CombatView(
      screen,
      { seed: `${seed}-${fight}`, enemies: rng.pick(ENCOUNTERS_FORET_DE_JADE), deck, hp, label: `Forêt de Jade · combat ${fight}` },
      (r) => {
        if (r.hp < 0) return menu();
        if (r.victory) {
          hp = r.hp;
          next();
        } else {
          startRun(character);
        }
      },
    );
  };
  next();
}

menu();
