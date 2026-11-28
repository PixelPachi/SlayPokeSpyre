// Rencontre obligatoire au début de l'acte 2 : Célébi traverse le temps pour t'aider à calmer Dialga.
import type { Run } from '../core/run';
import type { CharacterId } from '../core/model';
import { cardDef } from './cards';
import type { GameEvent } from './events';

/** Carte full art « signature » donnée par la bénédiction de Célébi (les autres Pokémon viendront plus tard). */
export const SIGNATURE_CARDS: Partial<Record<CharacterId, string>> = { kangourex: 'kan-assaut-du-petit', caninos: 'can-detonation-arcanine', riolu: 'coeur-d-aura', mew: 'mew-don-ancestral', quelorior: 'quel-inspiration', duo: 'duo-frotte-frimousse', vipelierre: 'vip-tempete-majestueuse' };

export function celebiEvent(run: Run): GameEvent {
  const sig = SIGNATURE_CARDS[run.character];
  return {
    id: 'celebi',
    title: 'Célébi, la voix de la forêt',
    image: 'illustrations/evenements/celebi.webp',
    text: 'Une lueur verte traverse la brume. Célébi apparaît, venu d’un autre temps : « Dialga souffre, et le temps se brise avec lui… Je ne peux pas le calmer seul. Laisse-moi t’aider à grimper jusqu’à lui. »',
    choices: [
      {
        label: 'Recevoir sa bénédiction', detail: sig ? `Ajoute ta carte signature full art à ton deck : ${cardDef(sig).name}` : 'Ajoute ta carte signature full art (pas encore disponible pour ce Pokémon)',
        available: () => !!sig,
        apply: (r) => { r.addCard(sig!); return `Célébi pose son front contre le tien. Une force nouvelle t’envahit : ${cardDef(sig!).name} rejoint ton deck !`; },
      },
      {
        label: 'Renforcer ta vitalité', detail: '+10 PV max',
        apply: (r) => { r.maxHp += 10; r.hp += 10; return 'Une pluie de lumière verte t’enveloppe : +10 PV max !'; },
      },
      {
        label: 'Alléger ton fardeau', detail: 'Retire 3 cartes de ton deck',
        available: (r) => r.deck.length > 3,
        apply: () => ({ pick: 'retirer', count: 3, text: 'Célébi remonte le temps de tes souvenirs. Quelles capacités veux-tu oublier ?' }),
      },
    ],
  };
}
