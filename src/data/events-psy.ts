// Événements mystères Psy : des Pokémon Psy autour des enchantements (dont Pérenne, l'enchantement violet).
import type { Run } from '../core/run';
import { cardDef, ENCHANTS } from './cards';
import type { GameEvent } from './events';

const poke = (dex: number) => `sprites/pokemon/front/${dex}.png`;
const hurt = (r: Run, n: number) => { r.hp = Math.max(1, r.hp - n); };
const loseMax = (r: Run, n: number) => { r.maxHp = Math.max(1, r.maxHp - n); r.hp = Math.min(r.hp, r.maxHp); };
const heal = (r: Run, n: number) => { r.hp = Math.min(r.maxHp, r.hp + n); };
const def = (r: Run, i: number) => cardDef(r.deck[i].defId, r.deck[i].upgraded);
const hasExhaust = (r: Run) => r.deck.some((_, i) => ENCHANTS.perenne.ok(def(r, i)) && !def(r, i).enchants?.includes('perenne'));
const hasEnchanted = (r: Run) => r.deck.some((_, i) => !!def(r, i).enchants?.length);
const canEnchant = (r: Run) => r.deck.filter((c) => { const d = cardDef(c.defId, c.upgraded); return !d.enchant && d.category !== 'statut' && !d.keywords?.includes('injouable'); });

export const PSY_EVENTS: GameEvent[] = [
  {
    id: 'zarbi-mots', title: 'Le mur des Zarbi', image: poke(201),
    text: 'Des dizaines de Zarbi flottent devant une paroi gravée. Quand tu approches, ils s’alignent et attendent que tu choisisses un mot. Les lettres brillent d’une lueur psychique.',
    choices: [
      {
        label: 'Former le mot « PÉRENNE »', detail: 'Enchante une carte Épuisée avec Pérenne (elle n’est plus épuisée)', available: hasExhaust,
        apply: () => ({ pick: 'enchanter', enchant: 'perenne', text: 'Les Zarbi tourbillonnent. Quelle carte ne doit plus jamais s’épuiser ?' }),
      },
      {
        label: 'Former le mot « PUISSANCE »', detail: '−8 PV, enchantement rare ou mieux sur une carte', available: (r) => r.hp > 8 && canEnchant(r).length > 0,
        apply: (r) => { hurt(r, 8); return { pick: 'enchanter', minRarity: 'rare', text: 'Les lettres te brûlent les yeux. Sur quelle carte se gravent-elles ?' }; },
      },
      { label: 'Laisser les Zarbi tranquilles', detail: 'Rien ne se passe', apply: () => 'Les Zarbi se dispersent en silence, comme des feuilles emportées par le vent.' },
    ],
  },
  {
    id: 'gardevoir-fils', title: 'Les fils de Gardevoir', image: poke(282),
    text: 'Une Gardevoir t’observe, entourée de fils de lumière qui relient chacune de tes capacités. « Je peux les nouer plus solidement… mais cela te coûtera un peu de toi-même. »',
    choices: [
      {
        label: 'Accepter ses fils', detail: '−5 PV max, enchante 2 cartes de ton choix', available: (r) => r.maxHp > 10 && canEnchant(r).length > 0,
        apply: (r) => { loseMax(r, 5); return { pick: 'enchanter', count: 2, text: 'Les fils se tendent. Quelle carte Gardevoir doit-elle nouer ?' }; },
      },
      {
        label: 'Lui demander sa protection', detail: 'Récupère 30 % de tes PV max',
        apply: (r) => { const n = Math.round(r.maxHp * 0.3); heal(r, n); return `Une aura douce t’enveloppe. Tu récupères ${n} PV.`; },
      },
    ],
  },
  {
    id: 'xatu-oracle', title: 'L’oracle Xatu', image: poke(178),
    text: 'Immobile au sommet d’un totem, Xatu fixe le soleil. On dit qu’un de ses yeux voit le passé et l’autre l’avenir. Il tourne lentement la tête vers tes cartes enchantées.',
    choices: [
      {
        label: 'Lui montrer le passé', detail: '60 ₽ : duplique une carte enchantée (avec son enchantement)', available: (r) => r.money >= 60 && hasEnchanted(r),
        apply: (r) => { r.money -= 60; return { pick: 'dupliquer', filter: 'enchantee', text: 'Xatu ferme un œil. Quelle carte enchantée doit-il faire revenir du passé ?' }; },
      },
      {
        label: 'Lui montrer l’avenir', detail: '−6 PV : améliore une carte enchantée', available: (r) => r.hp > 6 && r.deck.some((c, i) => !c.upgraded && !!def(r, i).enchants?.length),
        apply: (r) => { hurt(r, 6); return { pick: 'ameliorer', filter: 'enchantee', text: 'Xatu ouvre l’autre œil. Quelle carte enchantée voit-il grandir ?' }; },
      },
      { label: 'Repartir', detail: 'Rien ne se passe', apply: () => 'Xatu reste immobile. Il savait déjà que tu partirais.' },
    ],
  },
  {
    id: 'mushana-reve', title: 'Le rêve de Mushana', image: poke(518),
    text: 'Une brume rose s’échappe du front d’un Mushana assoupi. Dedans, tes capacités apparaissent, transformées par le rêve.',
    choices: [
      {
        label: 'Lui offrir un cauchemar', detail: 'Oublie une carte, puis enchante une carte de ton choix', available: (r) => r.deck.length > 5,
        apply: () => ({ pick: 'retirer', then: 'enchanter', text: 'Mushana ouvre la bouche. Quel cauchemar lui donnes-tu ?' }),
      },
      {
        label: 'Rêver avec lui', detail: 'Récupère 12 PV, une carte au hasard est enchantée', available: (r) => canEnchant(r).length > 0,
        apply: (r) => {
          heal(r, 12);
          const c = r.rng.pick(canEnchant(r));
          const k = r.enchantCard(c.uid);
          return k ? `Tu t’endors dans la brume rose (+12 PV). Au réveil, ${cardDef(c.defId).name} porte l’enchantement ✦ ${ENCHANTS[k].name} (${ENCHANTS[k].text}).` : 'Tu t’endors dans la brume rose (+12 PV).';
        },
      },
    ],
  },
  {
    id: 'meditikka-zen', title: 'La méditation de Méditikka', image: poke(307),
    text: 'Un Méditikka lévite en tailleur au-dessus d’un rocher, les yeux clos. Sans un mot, il t’invite à t’asseoir près de lui.',
    choices: [
      {
        label: 'Méditer longuement', detail: '−10 PV max : enchantement épique ou légendaire sur une carte', available: (r) => r.maxHp > 20 && canEnchant(r).length > 0,
        apply: (r) => { loseMax(r, 10); return { pick: 'enchanter', minRarity: 'epique', text: 'Ton esprit s’éclaircit. Sur quelle carte se pose cette clarté ?' }; },
      },
      {
        label: 'Apprendre sa posture', detail: '−5 PV : améliore une carte', available: (r) => r.hp > 5,
        apply: (r) => { hurt(r, 5); return { pick: 'ameliorer', text: 'Méditikka corrige ta posture. Quelle capacité s’affine ?' }; },
      },
      { label: 'Le laisser méditer', detail: 'Récupère 6 PV', apply: (r) => { heal(r, 6); return 'Le calme du lieu te repose un peu (+6 PV).'; } },
    ],
  },
];
