// Accueil de chaque run : Grodoudou et Pijako (la Guilde de Donjon Mystère) préviennent que Dialga
// devient fou et que le temps va s'arrêter, puis proposent leur aide : 3 options parmi 6, au hasard.
import type { Run } from '../core/run';
import { CHARACTERS } from './characters';
import { allCards, cardDef } from './cards';
import { relicDef } from './relics';
import type { EventChoice, GameEvent } from './events';

type Option = EventChoice & { weight: number };

/** La carte de Protection de base du Pokémon (Détection pour Riolu, Abri pour les autres). */
function baseProtection(run: Run): string {
  const ch = CHARACTERS[run.character];
  return ch.starterDeck.find((id) => { const d = cardDef(id); return d.category === 'technique' && d.effects.some((e) => e.kind === 'protection'); }) ?? 'abri';
}

const OPTIONS: Option[] = [
  {
    weight: 1, label: 'Échanger ton objet', detail: 'Remplace ton objet de départ par un objet tenu au hasard',
    apply: (r) => {
      const start = CHARACTERS[r.character].starterRelic;
      const id = r.rollRelics(1)[0];
      if (start) r.relics = r.relics.filter((x) => x !== start);
      if (id) r.addRelic(id);
      return id ? `Pijako fouille dans le trésor de la Guilde et échange ${start ? relicDef(start).name : 'ton objet'} contre : ${relicDef(id).name} ! (${relicDef(id).text})` : 'Pijako ne trouve rien de mieux… tu gardes ton objet.';
    },
  },
  {
    weight: 1, label: 'Entraînement de la Guilde', detail: 'Perds 7 PV max · Transforme 2 cartes en cartes d’autres Pokémon',
    apply: (r) => { r.maxHp -= 7; r.hp = Math.min(r.hp, r.maxHp); return { pick: 'monde', text: 'Choisis 2 cartes à transformer en capacités d’autres Pokémon.', count: 2 }; },
  },
  {
    weight: 1, label: 'Encens Zen', detail: 'Les ennemis de tes 3 prochains combats n’ont qu’1 PV',
    apply: (r) => { r.addRelic('encens-zen'); r.zenFights = 3; return '« Respire ce parfum, et tes adversaires seront tout ramollis ! » Grodoudou te confie un Encens Zen.'; },
  },
  {
    weight: 1, label: 'Leçon secrète', detail: 'Perds 10 PV · Ajoute une carte rare au hasard à ton deck',
    available: (r) => r.hp > 10,
    apply: (r) => {
      r.hp -= 10;
      const pool = allCards().filter((c) => c.rarity === 'rare' && (c.character === r.character || (r.character === 'mew' && c.character !== 'normal')));
      const id = r.rng.pick(pool).id;
      r.addCard(id);
      return `Grodoudou t'apprend une technique secrète : ${cardDef(id).name} !`;
    },
  },
  {
    weight: 1, label: 'Chant de Grodoudou', detail: 'Enchante une carte de ton deck',
    apply: () => ({ pick: 'enchanter', text: 'Grodoudou chante… quelle carte veux-tu enchanter ?' }),
  },
  {
    // Très rare : 1 % de chances d'apparaître parmi les 3 choix
    weight: 0.013, label: '★ Le deck Rondoudou', detail: 'Remplace ton deck de départ par le deck Rondoudou',
    apply: (r) => {
      r.deck = [];
      const prot = baseProtection(r);
      for (const [id, n] of [['rdd-torgnoles', 4], ['rdd-abri', 2], [prot, 2], ['rdd-berceuse', 2], ['rdd-metronome', 2]] as [string, number][]) {
        for (let i = 0; i < n; i++) r.addCard(id);
      }
      return '« Rondoudou, Rondoudou… » Grodoudou te transmet le style de combat de sa famille !';
    },
  },
];

/** L'événement d'accueil, avec 3 aides tirées au hasard (le deck Rondoudou n'a qu'1 % de chances). */
export function welcomeEvent(run: Run): GameEvent {
  const pool = [...OPTIONS];
  const picks: EventChoice[] = [];
  while (picks.length < 3 && pool.length) {
    const o = run.rng.weighted(pool);
    picks.push(o);
    pool.splice(pool.indexOf(o), 1);
  }
  return {
    id: 'accueil',
    title: 'La Guilde de Grodoudou',
    image: 'sprites/pokemon/front/40.png',
    images: ['sprites/pokemon/front/40.png', 'sprites/pokemon/front/441.png'],
    text: '« Youpi, un visiteur ! » Grodoudou t’accueille avec un grand sourire, Pijako perché à ses côtés. « Écoute bien ! » piaille Pijako. « Dialga, le maître du temps, est devenu fou au sommet de la Tour du Temps. Si personne ne le calme, le temps s’arrêtera pour toujours ! » Grodoudou hoche la tête : « Pour t’aider, la Guilde t’offre un cadeau. Choisis bien ! »',
    choices: picks,
  };
}
