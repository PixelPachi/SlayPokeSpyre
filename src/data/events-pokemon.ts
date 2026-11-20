// Événements mystères « Pokémon » : des rencontres variées dans la Tour du Temps, en plus des arcanes du tarot.
import type { Run } from '../core/run';
import { cardDef } from './cards';
import { relicDef } from './relics';
import { BERRY_DEFS } from './berries';
import type { GameEvent } from './events';

const poke = (dex: number) => `sprites/pokemon/front/${dex}.png`;
const item = (id: string) => `sprites/items/${id}.png`;
const hurt = (r: Run, n: number) => { r.hp = Math.max(1, r.hp - n); };
const gainMax = (r: Run, n: number) => { r.maxHp += n; r.hp += n; };
const loseMax = (r: Run, n: number) => { r.maxHp = Math.max(1, r.maxHp - n); r.hp = Math.min(r.hp, r.maxHp); };
const pct = (r: Run, p: number) => Math.max(1, Math.round(r.maxHp * p));
const giveRelic = (r: Run): string => {
  const id = r.rollRelics(1)[0];
  if (!id) { r.money += 75; return 'aucun objet… mais 75 ₽'; }
  r.addRelic(id);
  return relicDef(id).name;
};
const giveBerry = (r: Run): string => {
  const id = r.rollBerry();
  if (r.addBerry(id)) return BERRY_DEFS[id].name;
  r.heal(6);
  return `${BERRY_DEFS[id].name} (sac plein : tu la manges, +6 PV)`;
};
const giveCard = (r: Run, kind: 'combat' | 'elite' | 'boss'): string => {
  const id = r.cardChoices(kind, 1)[0];
  r.addCard(id);
  return cardDef(id).name;
};
const upgradeRandom = (r: Run, n: number): string => {
  const pool = r.deck.filter((c) => !c.upgraded);
  const names: string[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    const c = pool.splice(r.rng.int(0, pool.length - 1), 1)[0];
    r.upgradeCard(c.uid);
    names.push(cardDef(c.defId).name);
  }
  return names.length ? names.join(', ') : 'aucune carte';
};
const canUpgrade = (r: Run) => r.deck.some((c) => !c.upgraded);

export const POKEMON_EVENTS: GameEvent[] = [
  {
    id: 'ramoloss-sieste', title: 'Le Ramoloss endormi', image: poke(79),
    text: 'Un Ramoloss ronfle au milieu du couloir, la queue trempée dans une flaque. Il a l’air de dormir depuis des siècles.',
    choices: [
      { label: 'Faire la sieste avec lui', detail: 'Récupère 25 % de tes PV max', apply: (r) => `Tu dors comme un bébé. +${r.heal(pct(r, 0.25))} PV.` },
      { label: 'Fouiller autour de lui', detail: 'Gagne une baie', apply: (r) => `Tu trouves : ${giveBerry(r)}.` },
      {
        label: 'Le chatouiller', detail: '50 % : 90 ₽ — sinon −8 PV',
        apply: (r) => {
          if (r.rng.next() < 0.5) { r.money += 90; return 'Il éternue… et recrache 90 ₽ qu’il avait avalés !'; }
          hurt(r, 8);
          return 'Il se retourne dans son sommeil et t’écrase. −8 PV.';
        },
      },
    ],
  },
  {
    id: 'mew-joueur', title: 'Mew veut jouer', image: poke(151),
    text: 'Une petite silhouette rose virevolte autour de toi en riant. Mew te tire par le bras : il veut jouer !',
    choices: [
      { label: 'Jouer à cache-cache', detail: 'Transforme une carte de ton deck', apply: () => ({ pick: 'transformer', text: 'Mew se cache dans une de tes cartes… laquelle ?' }) },
      { label: 'Jouer à l’imitation', detail: 'Duplique une carte de ton deck', apply: () => ({ pick: 'dupliquer', text: 'Mew imite une de tes capacités. Laquelle ?' }) },
      { label: 'Le laisser filer', detail: '+3 PV max', apply: (r) => { gainMax(r, 3); return 'Mew te fait un câlin avant de disparaître. +3 PV max.'; } },
    ],
  },
  {
    id: 'spinda-marchand', title: 'Le marchand Spinda', image: poke(327),
    text: 'Un Spinda titubant a installé un étal bancal. « Objets… mystères… pas chers… », bafouille-t-il en tournant sur lui-même.',
    choices: [
      { label: 'Acheter un objet mystère', detail: '−90 ₽, gagne un objet tenu au hasard', available: (r) => r.money >= 90, apply: (r) => { r.money -= 90; return `Spinda te tend : ${giveRelic(r)}.`; } },
      { label: 'Acheter un sac de baies', detail: '−40 ₽, gagne une baie', available: (r) => r.money >= 40, apply: (r) => { r.money -= 40; return `Dans le sac : ${giveBerry(r)}.`; } },
      { label: 'Lui vendre une capacité', detail: 'Retire une carte, gagne 50 ₽', available: (r) => r.deck.length > 5, apply: (r) => { r.money += 50; return { pick: 'retirer', text: 'Quelle capacité vends-tu à Spinda ?' }; } },
    ],
  },
  {
    id: 'source-chaude', title: 'La source chaude', image: poke(322),
    text: 'Un Chamallot somnole près d’une source fumante. L’eau, chauffée par son dos, sent bon le soufre et les herbes.',
    choices: [
      { label: 'Se baigner', detail: '+5 PV max et récupère 10 PV', apply: (r) => { gainMax(r, 5); r.heal(10); return 'Tes muscles se détendent. +5 PV max.'; } },
      { label: 'Y tremper tes cartes', detail: 'Améliore une carte', available: canUpgrade, apply: () => ({ pick: 'ameliorer', text: 'La vapeur renforce une capacité. Laquelle ?' }) },
    ],
  },
  {
    id: 'nuee-nosferapti', title: 'La nuée de Nosferapti', image: poke(41),
    text: 'Des centaines d’ailes battent dans le noir. Une nuée de Nosferapti bloque le passage… et leur chef te fixe.',
    choices: [
      { label: 'Foncer à travers', detail: '−9 PV', apply: (r) => { hurt(r, 9); return 'Tu traverses la nuée en te protégeant le visage. −9 PV.'; } },
      { label: 'Défier le chef', detail: 'Duel : carte rare et ₽ si tu gagnes', apply: () => ({ fight: 'nosferapti', text: 'Le chef de la nuée fond sur toi !', power: 1.4 }) },
    ],
  },
  {
    id: 'autel-ancien', title: 'L’autel oublié', image: item('griseous-orb'),
    text: 'Un autel couvert de runes pulse d’une lumière violette. On y devine une offrande, et une inscription : « Le sang contre la force ».',
    choices: [
      { label: 'Offrir ta vitalité', detail: '−8 PV max, gagne un objet tenu', available: (r) => r.maxHp > 20, apply: (r) => { loseMax(r, 8); return `L’autel accepte. Tu reçois : ${giveRelic(r)}.`; } },
      { label: 'Prier', detail: 'Améliore 2 cartes au hasard', available: canUpgrade, apply: (r) => `Une douce chaleur t’envahit. Améliorées : ${upgradeRandom(r, 2)}.` },
      { label: 'Ne rien toucher', detail: 'Rien ne se passe', apply: () => 'Mieux vaut ne pas jouer avec ces choses-là.' },
    ],
  },
  {
    id: 'dojo-machopeur', title: 'Le dojo de Machopeur', image: poke(67),
    text: 'Un Machopeur soulève des rochers en rythme. « Tu veux t’entraîner ? Ici, on ne fait pas semblant ! »',
    choices: [
      { label: 'Entraînement intensif', detail: '−10 PV, améliore 2 cartes au choix', available: (r) => r.hp > 10 && canUpgrade(r), apply: (r) => { hurt(r, 10); return { pick: 'ameliorer', text: 'Quelles capacités travailles-tu ?', count: 2 }; } },
      { label: 'Combat amical', detail: 'Duel : carte rare, ₽ et objet tenu', apply: () => ({ fight: 'machopeur-duel', text: 'Machopeur serre les poings. « En garde ! »', relic: true }) },
      { label: 'Juste regarder', detail: 'Améliore 1 carte au hasard', available: canUpgrade, apply: (r) => `Tu observes attentivement… Améliorée : ${upgradeRandom(r, 1)}.` },
    ],
  },
  {
    id: 'chenipan-blesse', title: 'Un Chenipan blessé', image: poke(10),
    text: 'Un petit Chenipan tremble au bord du chemin, une patte coincée sous une pierre.',
    choices: [
      { label: 'Le libérer et le soigner', detail: '−6 PV, gagne une carte rare', available: (r) => r.hp > 6, apply: (r) => { hurt(r, 6); return `En le soignant, tu t’écorches. Pour te remercier, il t’apprend : ${giveCard(r, 'boss')}.`; } },
      { label: 'Lui donner une baie', detail: 'Perd ta première baie, +10 PV max', available: (r) => r.berries.length > 0, apply: (r) => { r.berries.shift(); gainMax(r, 10); return 'Il se régale et te fait un grand sourire. Ton cœur se réchauffe : +10 PV max.'; } },
      { label: 'Passer ton chemin', detail: 'Rien ne se passe', apply: () => 'Tu continues… un peu honteux.' },
    ],
  },
  {
    id: 'bibliotheque-spoink', title: 'La bibliothèque de Spoink', image: poke(325),
    text: 'Un Spoink rebondit entre des étagères de grimoires. Chaque livre décrit une capacité oubliée.',
    choices: [
      { label: 'Étudier en profondeur', detail: 'Retire une carte, puis améliore-en une', available: (r) => r.deck.length > 5, apply: () => ({ pick: 'retirer', text: 'D’abord, quelle capacité oublies-tu ?', then: 'ameliorer' }) },
      { label: 'Emprunter un livre', detail: 'Gagne une carte au hasard', apply: (r) => `Tu apprends : ${giveCard(r, 'elite')}.` },
    ],
  },
  {
    id: 'tempete-temporelle', title: 'La tempête temporelle', image: item('adamant-orb'),
    text: 'Les engrenages de la tour s’emballent. Une tempête de sable doré, où passé et futur se mélangent, souffle devant toi.',
    choices: [
      { label: 'Traverser la tempête', detail: '−12 PV, gagne 130 ₽', available: (r) => r.hp > 12, apply: (r) => { hurt(r, 12); r.money += 130; return 'Tu ressors couvert de sable… et de pièces anciennes. +130 ₽.'; } },
      { label: 'Attraper un éclat de temps', detail: '−5 PV max, améliore 3 cartes au hasard', available: (r) => r.maxHp > 20 && canUpgrade(r), apply: (r) => { loseMax(r, 5); return `L’éclat te brûle les doigts. Améliorées : ${upgradeRandom(r, 3)}.`; } },
      { label: 'Faire un détour', detail: 'Rien ne se passe', apply: () => 'Tu contournes la tempête. Prudence est mère de sûreté.' },
    ],
  },
  {
    id: 'kangourex-mere', title: 'Une maman inquiète', image: poke(115),
    text: 'Une Kangourex fouille frénétiquement les buissons : sa poche est vide. Son petit a disparu !',
    choices: [
      { label: 'L’aider à chercher', detail: '−7 PV, gagne un objet tenu', available: (r) => r.hp > 7, apply: (r) => { hurt(r, 7); return `Tu retrouves le petit coincé dans un terrier. La maman te confie : ${giveRelic(r)}.`; } },
      { label: 'La rassurer', detail: 'Récupère 12 PV', apply: (r) => `Elle te serre contre elle. +${r.heal(12)} PV.` },
    ],
  },
  {
    id: 'feu-de-camp', title: 'Le feu de camp', image: item('charcoal'),
    text: 'Des braises encore chaudes, des couvertures, une marmite : des Dresseurs ont campé ici il y a peu.',
    choices: [
      { label: 'Se reposer', detail: 'Récupère 20 PV', apply: (r) => `Tu te réchauffes. +${r.heal(20)} PV.` },
      { label: 'Aiguiser tes techniques', detail: 'Améliore une carte', available: canUpgrade, apply: () => ({ pick: 'ameliorer', text: 'Quelle capacité perfectionnes-tu au coin du feu ?' }) },
      { label: 'Fouiller les sacs', detail: 'Gagne 35 ₽ et une baie', apply: (r) => { r.money += 35; return `35 ₽ et ${giveBerry(r)}.`; } },
    ],
  },
  {
    id: 'rattata-tresor', title: 'Le trésor des Rattata', image: poke(19),
    text: 'Des Rattata entassent des objets brillants au fond d’un trou. Pièces, capsules… et des dents qui claquent.',
    choices: [
      {
        label: 'Plonger la main', detail: '60 % : 80 ₽ — sinon −7 PV',
        apply: (r) => {
          if (r.rng.next() < 0.6) { r.money += 80; return 'Tu ressors une poignée de pièces ! +80 ₽.'; }
          hurt(r, 7);
          return 'Aïe ! Un Rattata te mord. −7 PV.';
        },
      },
      { label: 'Défier le chef', detail: 'Duel : carte rare et ₽', apply: () => ({ fight: 'rattatac', text: 'Un énorme Rattatac sort du trou en sifflant !' }) },
      { label: 'Laisser tranquille', detail: 'Rien ne se passe', apply: () => 'Les Rattata te regardent partir, soulagés.' },
    ],
  },
  {
    id: 'danse-melofee', title: 'La danse des Mélofée', image: poke(35),
    text: 'Sous un rayon de lune qui perce la tour, des Mélofée dansent en cercle. Elles t’invitent à les rejoindre.',
    choices: [
      { label: 'Danser avec elles', detail: 'Duplique une carte', apply: () => ({ pick: 'dupliquer', text: 'La danse fait écho à une de tes capacités. Laquelle ?' }) },
      { label: 'Applaudir', detail: 'Récupère 15 PV', apply: (r) => `La lune te baigne de lumière. +${r.heal(15)} PV.` },
    ],
  },
  {
    id: 'nuage-smogo', title: 'Le nuage toxique', image: poke(109),
    text: 'Un Smogo gonflé à bloc flotte devant un coffre. Au moindre bruit, il risque d’exploser en nuage de gaz.',
    choices: [
      { label: 'Ouvrir le coffre en vitesse', detail: '−12 PV, gagne un objet tenu', available: (r) => r.hp > 12, apply: (r) => { hurt(r, 12); return `Boum ! Tu tousses, mais tu tiens : ${giveRelic(r)}.`; } },
      { label: 'Attendre qu’il s’endorme', detail: 'Oublie une carte au hasard, gagne 60 ₽', available: (r) => r.deck.length > 5,
        apply: (r) => { const c = r.deck[r.rng.int(0, r.deck.length - 1)]; r.removeCard(c.uid); r.money += 60; return `Pendant l’attente, tu oublies ${cardDef(c.defId).name}… mais le coffre contient 60 ₽.`; } },
      { label: 'Repartir sur la pointe des pieds', detail: 'Rien ne se passe', apply: () => 'Ni vu ni connu.' },
    ],
  },
  {
    id: 'enigme-hoothoot', title: 'L’énigme de Hoothoot', image: poke(163),
    text: 'Perché sur une horloge arrêtée, un Hoothoot penche la tête. « Hou hou ! Qu’est-ce qui avance toujours et ne revient jamais ? »',
    choices: [
      { label: '« Le temps. »', detail: 'Une réponse…', apply: (r) => `« Hou hou ! Bien répondu ! » Améliorées : ${upgradeRandom(r, 2)}.` },
      { label: '« Un Ramoloss. »', detail: 'Une réponse…', apply: (r) => { hurt(r, 5); return '« Un Ramoloss n’avance pas du tout ! » Il te picore la tête. −5 PV.'; } },
      { label: '« Un Rattata. »', detail: 'Une réponse…', apply: (r) => { hurt(r, 5); return '« Il revient toujours chercher du fromage ! » Coup de bec. −5 PV.'; } },
    ],
  },
  {
    id: 'oeuf-mysterieux', title: 'L’œuf mystérieux', image: item('lucky-egg'),
    text: 'Un œuf tacheté repose dans un nid de plumes, tout chaud. Il bouge légèrement.',
    choices: [
      { label: 'Le couver', detail: '+6 PV max', apply: (r) => { gainMax(r, 6); return 'L’œuf éclot : un petit Pokémon te fait un câlin avant de filer. +6 PV max.'; } },
      { label: 'Le vendre', detail: 'Gagne 70 ₽', apply: (r) => { r.money += 70; return 'Un collectionneur passait justement par là. +70 ₽.'; } },
    ],
  },
  {
    id: 'statue-dracolosse', title: 'La statue du gardien', image: poke(149),
    text: 'Une statue de Dracolosse veille sur un escalier. À ses pieds, une plaque : « Montre ta force, ou ton humilité. »',
    choices: [
      { label: 'Montrer ta force', detail: 'Gagne une carte rare, −6 PV max', available: (r) => r.maxHp > 20, apply: (r) => { loseMax(r, 6); return `Les yeux de la statue s’illuminent. Tu apprends : ${giveCard(r, 'boss')}.`; } },
      { label: 'Montrer ton humilité', detail: 'Retire une carte de ton deck', available: (r) => r.deck.length > 5, apply: () => ({ pick: 'retirer', text: 'Quelle capacité déposes-tu au pied de la statue ?' }) },
    ],
  },
  {
    id: 'potager-ceribou', title: 'Le verger des Ceribou', image: poke(420),
    text: 'Des Ceribou font pousser des baies dans un coin ensoleillé de la tour. Ils te proposent d’en prendre… avec modération.',
    choices: [
      { label: 'Cueillir une baie', detail: 'Gagne une baie', apply: (r) => `Tu cueilles ${giveBerry(r)}.` },
      { label: 'Tout ramasser', detail: 'Gagne 2 baies, −6 PV (ils se fâchent)', apply: (r) => { hurt(r, 6); const a = giveBerry(r), b = giveBerry(r); return `Les Ceribou te bombardent de graines (−6 PV), mais tu files avec ${a} et ${b}.`; } },
      { label: 'Les aider à arroser', detail: 'Récupère 10 PV', apply: (r) => `Le travail au soleil te fait du bien. +${r.heal(10)} PV.` },
    ],
  },
  {
    id: 'miroir-zarbi', title: 'Le miroir déformant', image: item('scope-lens'),
    text: 'Un grand miroir reflète une version de toi aux capacités étranges. Ton reflet tend la main à travers la vitre.',
    choices: [
      { label: 'Toucher le reflet', detail: 'Transforme 2 cartes de ton deck', apply: () => ({ pick: 'transformer', text: 'Le reflet échange une de tes capacités. Laquelle ?', count: 2 }) },
      { label: 'Briser le miroir', detail: '−4 PV, gagne 50 ₽', apply: (r) => { hurt(r, 4); r.money += 50; return 'Des éclats volent… et des pièces tombent du cadre. −4 PV, +50 ₽.'; } },
    ],
  },
];
