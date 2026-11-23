// Les 22 arcanes majeurs du tarot : des événements mystères avec la carte à gauche et les choix à droite.
// Chaque arcane a son thème (le Diable : pactes contre des PV max, la Roue : le hasard, la Mort : oublier…).
import type { Run } from '../core/run';
import { cardDef, CURSES } from './cards';
import { relicDef } from './relics';
import type { GameEvent } from './events';
import { CHARACTERS } from './characters';

const loseMax = (r: Run, n: number) => {
  r.maxHp = Math.max(1, r.maxHp - n);
  r.hp = Math.min(r.hp, r.maxHp);
};
const gainMax = (r: Run, n: number) => {
  r.maxHp += n;
  r.hp += n;
};
const hurt = (r: Run, n: number) => {
  r.hp = Math.max(1, r.hp - n);
};
/** Améliore des cartes au hasard ; renvoie leurs noms. */
const upgradeRandom = (r: Run, n: number): string => {
  const pool = r.deck.filter((c) => !c.upgraded && !CURSES.includes(c.defId));
  const names: string[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    const c = pool.splice(r.rng.int(0, pool.length - 1), 1)[0];
    r.upgradeCard(c.uid);
    names.push(cardDef(c.defId).name);
  }
  return names.length ? names.join(', ') : 'aucune carte';
};
/** Ajoute une carte tirée comme une récompense (rare pour 'boss'). */
const addRandomCard = (r: Run, kind: 'combat' | 'elite' | 'boss'): string => {
  const id = r.cardChoices(kind, 1)[0];
  r.addCard(id);
  return cardDef(id).name;
};
/** Donne un objet tenu ; s'il n'en reste plus, 75 ₽ à la place. */
const giveRelic = (r: Run): string => {
  const id = r.rollRelics(1)[0];
  if (!id) {
    r.money += 75;
    return 'aucun objet ne répond… tu trouves 75 ₽ à la place';
  }
  r.addRelic(id);
  return relicDef(id).name;
};
const hasUpgradable = (r: Run) => r.deck.some((c) => !c.upgraded);

export const TAROT_EVENTS: GameEvent[] = [
  {
    id: 'tarot-fou', title: '0 — Le Fou', image: 'tarot/le-fou.webp', tarot: true,
    text: 'Togepi, baluchon sur l’épaule, s’avance gaiement vers le vide. Le Fou ne regarde jamais où il met les pieds… et c’est pour ça qu’il trouve ce que les autres ratent.',
    choices: [
      {
        label: 'Sauter avec lui', detail: '1 chance sur 2 : un objet tenu… ou −12 PV',
        apply: (r) => (r.rng.next() < 0.5 ? `Tu atterris sur un trésor : ${giveRelic(r)} !` : (hurt(r, 12), 'La chute est rude : tu perds 12 PV.')),
      },
      { label: 'Le retenir', detail: 'Récupère 10 PV', apply: (r) => `Togepi te remercie d’un sourire. Tu récupères ${r.heal(10)} PV.` },
    ],
  },
  {
    id: 'tarot-bateleur', title: 'I — Le Bateleur', image: 'tarot/le-bateleur.webp', tarot: true,
    text: 'Alakazam fait danser coupes et cuillères sur sa table. « Donne-moi une technique, je t’en rendrai une autre. Le tour est toujours meilleur que l’original… presque. »',
    choices: [
      {
        label: 'Lui confier une carte', detail: 'Transforme une carte en une autre au hasard',
        apply: () => ({ pick: 'transformer', text: 'Quelle carte Alakazam doit-il transformer ?' }),
      },
      {
        label: 'Payer pour un tour', detail: 'Perd 60 ₽, améliore 2 cartes au hasard',
        available: (r) => r.money >= 60 && hasUpgradable(r),
        apply: (r) => {
          r.money -= 60;
          return `Abracadabra ! Améliorées : ${upgradeRandom(r, 2)}.`;
        },
      },
      {
        label: 'Demander un tour enchanté', detail: 'Perd 40 ₽, enchante une carte de ton choix',
        available: (r) => r.money >= 40,
        apply: (r) => { r.money -= 40; return { pick: 'enchanter', text: 'Alakazam agite ses cuillères… Quelle carte doit-il enchanter ?' }; },
      },
      { label: 'Passer ton chemin', detail: 'Rien ne se passe', apply: () => 'Alakazam hausse les épaules et reprend son numéro.' },
    ],
  },
  {
    id: 'tarot-papesse', title: 'II — La Papesse', image: 'tarot/la-papesse.webp', tarot: true,
    text: 'Gothitelle lit un parchemin couvert de techniques oubliées. Le savoir se partage… à qui sait écouter.',
    choices: [
      {
        label: 'Étudier le parchemin', detail: 'Améliore une carte de ton choix',
        available: hasUpgradable,
        apply: () => ({ pick: 'ameliorer', text: 'Quelle technique veux-tu perfectionner ?' }),
      },
      { label: 'Recopier une page', detail: 'Gagne une carte peu commune ou rare', apply: (r) => `Tu apprends ${addRandomCard(r, 'elite')}.` },
      { label: 'Déchiffrer les runes', detail: 'Enchante une carte de ton choix', apply: () => ({ pick: 'enchanter', text: 'Les runes s’illuminent. Sur quelle carte les graves-tu ?' }) },
    ],
  },
  {
    id: 'tarot-imperatrice', title: 'III — L’Impératrice', image: 'tarot/l-imperatrice.webp', tarot: true,
    text: 'Nidoqueen veille sur la forêt depuis son trône de bois. Elle protège ceux qui la respectent comme ses propres petits.',
    choices: [
      { label: 'Accepter sa protection', detail: '+7 PV max', apply: (r) => (gainMax(r, 7), 'Tu te sens plus robuste : +7 PV max.') },
      { label: 'Recevoir ses soins', detail: 'Récupère 40 % de tes PV max', apply: (r) => `Ses soins te remettent sur pied : +${r.heal(Math.round(r.maxHp * 0.4))} PV.` },
    ],
  },
  {
    id: 'tarot-empereur', title: 'IV — L’Empereur', image: 'tarot/l-empereur.webp', tarot: true,
    text: 'Nidoking siège, sceptre en main. Ici, tout se paie : en Pokédollars ou en sueur.',
    choices: [
      {
        label: 'Payer le tribut', detail: 'Perd 80 ₽, gagne un objet tenu',
        available: (r) => r.money >= 80,
        apply: (r) => {
          r.money -= 80;
          return `L’Empereur te tend un présent : ${giveRelic(r)}.`;
        },
      },
      {
        label: 'Le défier en duel', detail: 'Combat contre Nidoking. Victoire : une carte rare au choix et des ₽',
        apply: () => ({ fight: 'nidoking-duel', text: 'Nidoking se lève de son trône. Le duel commence !' }),
      },
      { label: 'S’incliner', detail: 'Rien ne se passe', apply: () => 'Nidoking te laisse passer d’un grognement.' },
    ],
  },
  {
    id: 'tarot-pape', title: 'V — Le Pape', image: 'tarot/le-pape.webp', tarot: true,
    text: 'Roigada bénit les voyageurs de la tour. « Laisse derrière toi ce qui t’alourdit, et repars plus léger. »',
    choices: [
      {
        label: 'Recevoir sa bénédiction', detail: 'Retire une carte de ton deck',
        available: (r) => r.deck.length > 5,
        apply: () => ({ pick: 'retirer', text: 'De quelle technique veux-tu te défaire ?' }),
      },
      {
        label: 'Faire une offrande', detail: 'Perd 40 ₽, +5 PV max',
        available: (r) => r.money >= 40,
        apply: (r) => {
          r.money -= 40;
          gainMax(r, 5);
          return 'Roigada sourit : +5 PV max.';
        },
      },
    ],
  },
  {
    id: 'tarot-amoureux', title: 'VI — L’Amoureux', image: 'tarot/l-amoureux.webp', tarot: true,
    text: 'Gardevoir et Gallame te tendent chacun la main, sous le regard de Togekiss. Le cœur ou la raison : il faut choisir.',
    choices: [
      { label: 'Suivre le cœur (Gardevoir)', detail: 'Récupère 25 PV', apply: (r) => `Une douce chaleur t’envahit : +${r.heal(25)} PV.` },
      {
        label: 'Suivre la raison (Gallame)', detail: 'Améliore une carte de ton choix',
        available: hasUpgradable,
        apply: () => ({ pick: 'ameliorer', text: 'Gallame t’aide à affûter une technique.' }),
      },
    ],
  },
  {
    id: 'tarot-chariot', title: 'VII — Le Chariot', image: 'tarot/le-chariot.webp', tarot: true,
    text: 'Lucario, en armure, mène un chariot tiré par deux Tauros à travers les étages. « Monte ! On va vite… et haut. »',
    choices: [
      {
        label: 'Sauter à bord', detail: 'Perd 8 PV, améliore 2 cartes au hasard',
        available: (r) => r.hp > 8 && hasUpgradable(r),
        apply: (r) => (hurt(r, 8), `Secoué mais grandi par le voyage. Améliorées : ${upgradeRandom(r, 2)}.`),
      },
      { label: 'S’écarter', detail: 'Gagne 30 ₽ tombés du chariot', apply: (r) => ((r.money += 30), 'Le chariot passe en trombe et laisse tomber 30 ₽.') },
    ],
  },
  {
    id: 'tarot-justice', title: 'VIII — La Justice', image: 'tarot/la-justice.webp', tarot: true,
    text: 'Tranchodon siège sur son trône, l’épée dans une main, la balance dans l’autre. Chaque faute a son prix, chaque prix sa récompense.',
    choices: [
      {
        label: 'Avouer tes fautes', detail: 'Perd 8 PV, retire une carte',
        available: (r) => r.hp > 8 && r.deck.length > 5,
        apply: (r) => (hurt(r, 8), { pick: 'retirer', text: 'Quelle faute effaces-tu de ton deck ?' }),
      },
      {
        label: 'Payer l’amende', detail: 'Perd 75 ₽, retire une carte',
        available: (r) => r.money >= 75 && r.deck.length > 5,
        apply: (r) => ((r.money -= 75), { pick: 'retirer', text: 'Quelle carte veux-tu racheter ?' }),
      },
      { label: 'Plaider non coupable', detail: 'Rien ne se passe', apply: () => 'Les juges te relâchent, faute de preuves.' },
    ],
  },
  {
    id: 'tarot-ermite', title: 'IX — L’Ermite', image: 'tarot/l-ermite.webp', tarot: true,
    text: 'Noarfang, perché sur une branche sous les étoiles, tend sa lanterne vers toi. Sa lumière n’éclaire qu’un pas à la fois.',
    choices: [
      {
        label: 'Suivre sa lanterne', detail: 'Améliore une carte de ton choix',
        available: hasUpgradable,
        apply: () => ({ pick: 'ameliorer', text: 'Sa lumière révèle une technique à perfectionner.' }),
      },
      { label: 'Méditer à ses côtés', detail: 'Récupère 18 PV', apply: (r) => `Le silence te repose : +${r.heal(18)} PV.` },
      { label: 'Approcher la flamme de la lanterne', detail: '−6 PV, enchante une carte de ton choix', available: (r) => r.hp > 6, apply: (r) => (hurt(r, 6), { pick: 'enchanter', text: 'La flamme bleue danse. Quelle carte lui présentes-tu ?' }) },
    ],
  },
  {
    id: 'tarot-roue', title: 'X — La Roue de Fortune', image: 'tarot/la-roue-de-fortune.webp', tarot: true,
    text: 'Archéodong tourne au centre d’une grande roue pendant que des Spinda titubent autour. Tout peut arriver.',
    choices: [
      {
        label: 'Faire tourner la roue', detail: 'Au hasard : ₽, objet, carte rare… ou malchance',
        apply: (r) => {
          const roll = r.rng.int(0, 5);
          if (roll === 0) return ((r.money += 120), 'Jackpot ! Tu gagnes 120 ₽.');
          if (roll === 1) return `La roue s’arrête sur un trésor : ${giveRelic(r)}.`;
          if (roll === 2) return `Une technique rare : ${addRandomCard(r, 'boss')} !`;
          if (roll === 3) return `Coup de chance : améliorées ${upgradeRandom(r, 2)}.`;
          if (roll === 4) return (hurt(r, 10), 'Un Spinda te percute en titubant : −10 PV.');
          const lost = Math.min(r.money, 50);
          r.money -= lost;
          return `Ta bourse s’ouvre en route : −${lost} ₽.`;
        },
      },
      { label: 'Ne pas tenter le sort', detail: 'Rien ne se passe', apply: () => 'La roue continue de tourner sans toi.' },
    ],
  },
  {
    id: 'tarot-force', title: 'XI — La Force', image: 'tarot/la-force.webp', tarot: true,
    text: 'Une jeune fille apaise un Machopeur assis en tailleur, d’une simple main sur la tête. La vraie force, c’est la douceur.',
    choices: [
      {
        label: 'Défier Machopeur', detail: 'Combat contre Machopeur. Victoire : une carte rare au choix et des ₽',
        apply: () => ({ fight: 'machopeur-duel', text: 'Machopeur se relève et fait craquer ses poings. En garde !' }),
      },
      { label: 'Méditer avec lui', detail: '+4 PV max, récupère 10 PV', apply: (r) => (gainMax(r, 4), `Le calme vous gagne tous les deux. +4 PV max et +${r.heal(10)} PV.`) },
    ],
  },
  {
    id: 'tarot-pendu', title: 'XII — Le Pendu', image: 'tarot/le-pendu.webp', tarot: true,
    text: 'Migalos pend la tête en bas à une branche. Vu à l’envers, le monde révèle ce qu’on ne voyait pas.',
    choices: [
      {
        label: 'Se suspendre avec lui', detail: '−6 PV max, améliore 3 cartes au hasard',
        available: hasUpgradable,
        apply: (r) => (loseMax(r, 6), `Le sang te monte à la tête… mais tout s’éclaire. Améliorées : ${upgradeRandom(r, 3)}.`),
      },
      { label: 'Le détacher', detail: 'Gagne 35 ₽', apply: (r) => ((r.money += 35), 'Migalos te remercie avec quelques pièces trouvées dans sa toile : +35 ₽.') },
    ],
  },
  {
    id: 'tarot-mort', title: 'XIII — La Mort', image: 'tarot/la-mort.webp', tarot: true,
    text: 'Absol avance sous un drapeau noir, suivi d’une grande ombre. La Mort n’est pas une fin : seulement une transformation.',
    choices: [
      {
        label: 'Laisser partir le passé', detail: 'Perd 6 PV, retire 2 cartes',
        available: (r) => r.hp > 6 && r.deck.length > 6,
        apply: (r) => (hurt(r, 6), { pick: 'retirer', count: 2, text: 'Choisis ce qui doit disparaître (2 cartes).' }),
      },
      {
        label: 'Se transformer', detail: 'Transforme une carte au hasard en une autre',
        apply: () => ({ pick: 'transformer', text: 'Quelle carte renaît sous une autre forme ?' }),
      },
      { label: 'Fuir', detail: 'Perd 4 PV', apply: (r) => (hurt(r, 4), 'Tu t’échappes de justesse : −4 PV.') },
    ],
  },
  {
    id: 'tarot-temperance', title: 'XIV — La Tempérance', image: 'tarot/la-temperance.webp', tarot: true,
    text: 'Milobellus verse l’eau d’une coupe dans l’autre, sans jamais en perdre une goutte. Tout est question d’équilibre.',
    choices: [
      { label: 'Boire à la coupe', detail: 'Récupère 30 % de tes PV max et +3 PV max', apply: (r) => (gainMax(r, 3), `L’eau est pure : +3 PV max et +${r.heal(Math.round(r.maxHp * 0.3))} PV.`) },
      {
        label: 'Rééquilibrer ton deck', detail: 'Duplique une carte de ton choix',
        apply: () => ({ pick: 'dupliquer', text: 'Quelle carte veux-tu verser dans une seconde coupe ?' }),
      },
    ],
  },
  {
    id: 'tarot-diable', title: 'XV — Le Diable', image: 'tarot/le-diable.webp', tarot: true,
    text: 'Darkrai plane au-dessus d’un autel où Malosse et un petit Pokémon sont enchaînés. « Tout est à vendre… il suffit de me donner un peu de toi-même. »',
    choices: [
      { label: 'Vendre ta vigueur', detail: '−6 PV max, gagne une carte rare', apply: (r) => (loseMax(r, 6), `Le pacte est scellé : tu apprends ${addRandomCard(r, 'boss')}.`) },
      {
        label: 'Vendre ton souffle', detail: '−5 PV max, améliore 2 cartes au hasard',
        available: hasUpgradable,
        apply: (r) => (loseMax(r, 5), `Une énergie sombre te traverse. Améliorées : ${upgradeRandom(r, 2)}.`),
      },
      { label: 'Vendre ton âme', detail: '−10 PV max, gagne un objet tenu', apply: (r) => (loseMax(r, 10), `Le Diable ricane et te tend ${giveRelic(r)}.`) },
      { label: 'Refuser le pacte', detail: 'Rien ne se passe', apply: () => 'Tu tournes les talons. Les chaînes cliquettent derrière toi.' },
    ],
  },
  {
    id: 'tarot-maison-dieu', title: 'XVI — La Maison Dieu', image: 'tarot/la-maison-dieu.webp', tarot: true,
    text: 'La foudre frappe une tour et des Pokémon sont projetés dans le vide. Ce qui s’effondre laisse parfois tomber des trésors.',
    choices: [
      {
        label: 'Courir sous l’orage', detail: 'Perd 15 PV, gagne un objet tenu et 50 ₽',
        available: (r) => r.hp > 15,
        apply: (r) => {
          hurt(r, 15);
          r.money += 50;
          return `La foudre te frôle. Dans les décombres : ${giveRelic(r)} et 50 ₽.`;
        },
      },
      { label: 'S’abriter', detail: 'Rien ne se passe', apply: () => 'Tu attends que l’orage passe, à l’abri.' },
    ],
  },
  {
    id: 'tarot-etoile', title: 'XVII — L’Étoile', image: 'tarot/l-etoile.webp', tarot: true,
    text: 'Jirachi s’éveille au-dessus d’une source de lumière. Il exauce un vœu, un seul, tous les mille ans… mais les vœux ne se réalisent pas toujours comme on l’espère.',
    choices: [
      {
        label: 'Faire un vœu', detail: '1 chance sur 2 : le Rappel Max… ou une malédiction',
        available: (r) => !r.relics.includes('rappel-max'),
        apply: (r) => {
          if (r.rng.next() < 0.5) {
            r.addRelic('rappel-max');
            return 'Ton vœu est exaucé ! Jirachi te confie un Rappel Max : si tu tombes K.O., tu te relèveras une fois.';
          }
          r.addCard('voeu-brise');
          return 'Le vœu se brise en mille éclats… Une malédiction, Vœu Brisé, rejoint ton deck.';
        },
      },
      { label: 'Contempler les étoiles', detail: 'Récupère 12 PV', apply: (r) => `Tu laisses passer ta chance, apaisé : +${r.heal(12)} PV.` },
    ],
  },
  {
    id: 'tarot-lune', title: 'XVIII — La Lune', image: 'tarot/la-lune.webp', tarot: true,
    text: 'Noctali hurle à la pleine lune pendant que Lokhlass glisse sur l’eau. Les reflets mentent… parfois.',
    choices: [
      {
        label: 'Suivre le reflet', detail: '1 chance sur 2 : une carte rare… ou −12 PV',
        apply: (r) => (r.rng.next() < 0.5 ? `Le reflet était vrai : tu apprends ${addRandomCard(r, 'boss')}.` : (hurt(r, 12), 'Une illusion ! Tu tombes dans l’eau glacée : −12 PV.')),
      },
      { label: 'Attendre l’aube', detail: 'Récupère 10 PV', apply: (r) => `La nuit passe, paisible : +${r.heal(10)} PV.` },
    ],
  },
  {
    id: 'tarot-soleil', title: 'XIX — Le Soleil', image: 'tarot/le-soleil.webp', tarot: true,
    text: 'Pikachu, Pichu, Héliatronc et Pyrax dansent sous un grand soleil. Une journée parfaite pour reprendre des forces.',
    choices: [
      { label: 'Profiter du soleil', detail: 'Récupère 20 PV et gagne 40 ₽', apply: (r) => ((r.money += 40), `+${r.heal(20)} PV et 40 ₽ trouvés dans l’herbe.`) },
      {
        label: 'S’entraîner avec eux', detail: 'Améliore une carte de ton choix',
        available: hasUpgradable,
        apply: () => ({ pick: 'ameliorer', text: 'Quelle technique travailles-tu au soleil ?' }),
      },
    ],
  },
  {
    id: 'tarot-jugement', title: 'XX — Le Jugement', image: 'tarot/le-jugement.webp', tarot: true,
    text: 'Lugia sonne la trompette et les âmes se relèvent. L’heure est venue de renaître.',
    choices: [
      {
        label: 'Répondre à l’appel', detail: 'Retire une carte, puis améliore-en une',
        available: (r) => r.deck.length > 5,
        apply: () => ({ pick: 'retirer', then: 'ameliorer', text: 'D’abord, quelle carte laisses-tu derrière toi ?' }),
      },
      { label: 'Ignorer l’appel', detail: 'Rien ne se passe', apply: () => 'La trompette se tait. Tu poursuis ta route.' },
    ],
  },
  {
    id: 'tarot-monde', title: 'XXI — Le Monde', image: 'tarot/le-monde.webp', tarot: true,
    text: 'Mew flotte au centre d’une couronne de lauriers, entouré des quatre vents. Il connaît les techniques du monde entier… et propose d’échanger les tiennes.',
    choices: [
      {
        label: 'Confier tes techniques à Mew', detail: 'Jusqu’à 5 cartes deviennent des cartes d’autres Pokémon ou neutres',
        available: (r) => r.deck.length > 1,
        apply: () => ({ pick: 'monde', count: 5, text: 'Donne une carte à Mew (5 au maximum, « Terminer » pour arrêter).' }),
      },
      { label: 'Embrasser le monde', detail: 'Récupère 25 PV', apply: (r) => `La couronne de lauriers t’apaise : +${r.heal(25)} PV.` },
    ],
  },
];

// ——— Arcanes inversés : la carte apparaît à l'envers, avec des effets extrêmes ———
const STARTER_ATTACKS = ['ruse', 'charge', 'ecras-face', 'griffe', 'mew-ecras-face'];
const STARTER_SHIELDS = ['abri', 'detection'];
const leave = (text: string) => ({ label: 'Remettre la carte à l’endroit', detail: 'Rien ne se passe', apply: () => text });
/** Remplace chaque carte du deck par une autre de ton Pokémon (l'amélioration est gardée). */
const transformAll = (r: Run): number => {
  const n = r.deck.length;
  for (const c of r.deck) c.defId = r.cardChoices('combat', 1)[0];
  return n;
};
/** Ajoute n malédictions au hasard (Vœu Brisé, Cauchemar, Poisse, Mauvais Œil, Entrave, Regard Noir, Torpeur, Gelure). */
const addCurses = (r: Run, n: number) => {
  for (let i = 0; i < n; i++) r.addCard(r.rng.pick(CURSES));
};

const REVERSED: Record<string, NonNullable<GameEvent['reversed']>> = {
  'tarot-fou': {
    text: 'La carte est à l’envers : Togepi saute dans le vide les yeux bandés… et t’entraîne avec lui.',
    choices: [
      { label: 'Sauter les yeux fermés', detail: 'Perd la moitié de tes PV, gagne 2 objets tenus', apply: (r) => (hurt(r, Math.floor(r.hp / 2)), `Atterrissage brutal… au milieu d’un trésor : ${giveRelic(r)} et ${giveRelic(r)}.`) },
      leave('Tu recules du bord. Togepi boude.'),
    ],
  },
  'tarot-bateleur': {
    text: 'À l’envers, le Bateleur devient l’escroc : Alakazam mélange ton deck entier sous tes yeux.',
    choices: [
      { label: 'Le laisser faire', detail: 'Transforme 5 cartes au hasard', apply: (r) => {
        const pool = [...r.deck];
        const out: string[] = [];
        for (let i = 0; i < 5 && pool.length; i++) {
          const c = pool.splice(r.rng.int(0, pool.length - 1), 1)[0];
          const before = cardDef(c.defId).name;
          c.defId = r.cardChoices('combat', 1)[0];
          out.push(`${before} → ${cardDef(c.defId).name}`);
        }
        return `Tour joué ! ${out.join(', ')}.`;
      } },
      leave('Tu gardes une main sur tes cartes.'),
    ],
  },
  'tarot-papesse': {
    text: 'Le parchemin de Gothitelle est à l’envers : un savoir interdit, qui coûte cher à qui le lit.',
    choices: [
      { label: 'Lire le savoir interdit', detail: 'Améliore TOUTES tes cartes, −15 PV max', available: hasUpgradable, apply: (r) => {
        loseMax(r, 15);
        let n = 0;
        for (const c of r.deck) if (!c.upgraded && !CURSES.includes(c.defId)) { r.upgradeCard(c.uid); n++; }
        return `Ta tête brûle… ${n} cartes améliorées, mais −15 PV max.`;
      } },
      leave('Tu refermes le parchemin sans le lire.'),
    ],
  },
  'tarot-imperatrice': {
    text: 'À l’envers, Nidoqueen devient étouffante : elle te protège… jusqu’à t’empêcher de bouger.',
    choices: [
      { label: 'Se laisser couver', detail: '+20 PV max et tous tes PV, mais 2 malédictions', apply: (r) => {
        gainMax(r, 20);
        r.heal(r.maxHp);
        addCurses(r, 2);
        return 'Tu te sens invincible… et lourd : +20 PV max, PV au maximum, 2 Vœu Brisé dans ton deck.';
      } },
      leave('Tu t’éclipses avant qu’elle ne te serre trop fort.'),
    ],
  },
  'tarot-empereur': {
    text: 'L’Empereur inversé est un tyran : Nidoking, fou de rage, exige un combat à mort.',
    choices: [
      { label: 'Affronter le tyran', detail: 'Duel contre un Nidoking enragé. Victoire : carte rare, objet tenu et ₽', apply: () => ({ fight: 'nidoking-duel', text: 'Nidoking écrase son trône d’un coup de queue !', power: 1.5, relic: true }) },
      leave('Tu t’enfuis avant qu’il ne te remarque.'),
    ],
  },
  'tarot-pape': {
    text: 'Le Pape inversé prêche l’hérésie : Roigada brûle les écritures… et tes techniques avec.',
    choices: [
      { label: 'Brûler tes écritures', detail: 'Retire jusqu’à 3 cartes, −8 PV max', available: (r) => r.deck.length > 6, apply: (r) => (loseMax(r, 8), { pick: 'retirer', count: 3, text: 'Jette au feu jusqu’à 3 cartes (« Terminer » pour arrêter).' }) },
      leave('Tu gardes tes écritures intactes.'),
    ],
  },
  'tarot-amoureux': {
    text: 'À l’envers, c’est la rupture : il faut abandonner ce qui t’est le plus cher.',
    choices: [
      { label: 'Abandonner ton objet de départ', detail: 'Perd ton objet de départ, gagne 2 objets tenus', available: (r) => r.relics.includes(CHARACTERS[r.character].starterRelic ?? '-'), apply: (r) => {
        const old = CHARACTERS[r.character].starterRelic!;
        r.relics = r.relics.filter((x) => x !== old);
        return `Adieu ${relicDef(old).name}… Tu trouves ${giveRelic(r)} et ${giveRelic(r)}.`;
      } },
      leave('Tu gardes ce qui t’est cher.'),
    ],
  },
  'tarot-chariot': {
    text: 'Le Chariot inversé s’emballe : les Tauros foncent sans contrôle à travers les étages.',
    choices: [
      { label: 'S’accrocher', detail: 'Perd 15 PV, gagne 3 cartes de ton Pokémon', available: (r) => r.hp > 15, apply: (r) => (hurt(r, 15), `Tu ramasses tout ce qui tombe du chariot : ${addRandomCard(r, 'combat')}, ${addRandomCard(r, 'combat')} et ${addRandomCard(r, 'elite')}.`) },
      leave('Tu plonges sur le côté et laisses passer le chariot fou.'),
    ],
  },
  'tarot-justice': {
    text: 'La Justice inversée est truquée : Tranchodon fait pencher la balance… contre toi.',
    choices: [
      { label: 'Accepter le verdict truqué', detail: 'Tombe à 1 PV, gagne 2 objets tenus', apply: (r) => {
        r.hp = 1;
        return `Verdict : coupable. Il ne te reste qu’1 PV… mais tu repars avec ${giveRelic(r)} et ${giveRelic(r)}.`;
      } },
      leave('Tu refuses ce procès.'),
    ],
  },
  'tarot-ermite': {
    text: 'L’Ermite inversé, c’est l’exil : Noarfang éteint sa lanterne, et tu dois avancer sans protection.',
    choices: [
      { label: 'Partir en exil', detail: 'Retire toutes tes protections de départ, +10 PV max', apply: (r) => {
        const shields = r.deck.filter((c) => STARTER_SHIELDS.includes(c.defId));
        for (const c of shields) r.removeCard(c.uid);
        gainMax(r, 10);
        return `${shields.length} protection${shields.length > 1 ? 's' : ''} de départ abandonnée${shields.length > 1 ? 's' : ''}. +10 PV max.`;
      } },
      leave('Tu restes près de la lumière.'),
    ],
  },
  'tarot-roue': {
    text: 'La Roue inversée tourne à l’envers : elle prend tout… et rend peut-être beaucoup.',
    choices: [
      { label: 'Tout miser', detail: 'Perd tout ton argent ; chaque carte a 1 chance sur 20 d’être améliorée', apply: (r) => {
        const lost = r.money;
        r.money = 0;
        const won: string[] = [];
        for (const c of r.deck) if (!c.upgraded && !CURSES.includes(c.defId) && r.rng.next() < 0.05) { r.upgradeCard(c.uid); won.push(cardDef(c.defId).name); }
        return `−${lost} ₽. ${won.length ? `La roue améliore : ${won.join(', ')} !` : 'La roue ne rend rien…'}`;
      } },
      leave('Tu gardes ta bourse bien fermée.'),
    ],
  },
  'tarot-force': {
    text: 'La Force inversée, c’est la rage : Machopeur a perdu son calme et frappe tout ce qui bouge.',
    choices: [
      { label: 'Affronter sa rage', detail: 'Duel contre un Machopeur enragé. Victoire : carte rare, objet tenu et ₽', apply: () => ({ fight: 'machopeur-duel', text: 'Machopeur hurle et se jette sur toi !', power: 1.5, relic: true }) },
      leave('Tu le laisses se calmer seul.'),
    ],
  },
  'tarot-pendu': {
    text: 'Le Pendu inversé coupe la corde : Migalos tombe, et sa toile pleine de trésors avec lui.',
    choices: [
      { label: 'Couper la corde', detail: '−10 PV max, gagne 200 ₽', apply: (r) => (loseMax(r, 10), (r.money += 200), 'La toile se déchire : 200 ₽ tombent à tes pieds. −10 PV max.') },
      leave('Tu laisses Migalos à sa méditation.'),
    ],
  },
  'tarot-mort': {
    text: 'La Mort inversée refuse de te prendre : Absol t’offre un sursis… contre une part de toi.',
    choices: [
      { label: 'Accepter le sursis', detail: '−30 % de tes PV max, gagne le Rappel Max', available: (r) => !r.relics.includes('rappel-max'), apply: (r) => {
        loseMax(r, Math.round(r.maxHp * 0.3));
        r.addRelic('rappel-max');
        return 'Tu te sens plus fragile… mais la Mort te laissera une seconde chance (Rappel Max).';
      } },
      leave('Tu détournes le regard.'),
    ],
  },
  'tarot-temperance': {
    text: 'La Tempérance inversée, c’est l’excès : Milobellus renverse les deux coupes sur ton deck.',
    choices: [
      { label: 'Tout boire', detail: 'Duplique TOUTES tes cartes, −10 PV max', apply: (r) => {
        const copy = [...r.deck];
        for (const c of copy) r.addCard(c.defId, c.upgraded);
        loseMax(r, 10);
        return `Ton deck double : ${r.deck.length} cartes ! −10 PV max.`;
      } },
      leave('Tu reposes les coupes.'),
    ],
  },
  'tarot-diable': {
    text: 'Le Diable inversé brise les chaînes… et les recolle autrement : tes techniques de base se changent en vampirisme et en soins.',
    choices: [
      { label: 'Briser les chaînes', detail: 'Attaques de départ → Vampirisme (4 dégâts, soin 2) ; protections de départ → Soin (5 PV)', apply: (r) => {
        let a = 0, d = 0;
        for (const c of r.deck) {
          if (STARTER_ATTACKS.includes(c.defId)) { c.defId = 'diable-vampirisme'; a++; }
          else if (STARTER_SHIELDS.includes(c.defId)) { c.defId = 'diable-soin'; d++; }
        }
        return `${a} attaque${a > 1 ? 's' : ''} devenue${a > 1 ? 's' : ''} Vampirisme, ${d} protection${d > 1 ? 's' : ''} devenue${d > 1 ? 's' : ''} Soin.`;
      } },
      leave('Tu ne touches pas aux chaînes.'),
    ],
  },
  'tarot-maison-dieu': {
    text: 'La Maison Dieu inversée : la tour s’effondre sur toi. Sous les gravats, des trésors oubliés.',
    choices: [
      { label: 'Rester sous l’effondrement', detail: '−20 PV max, gagne 3 objets tenus', apply: (r) => (loseMax(r, 20), `Écrasé… mais riche : ${giveRelic(r)}, ${giveRelic(r)} et ${giveRelic(r)}.`) },
      leave('Tu fuis avant que tout ne s’écroule.'),
    ],
  },
  'tarot-etoile': {
    text: 'L’Étoile inversée exauce les vœux… à l’envers : la chance tourne beaucoup plus fort.',
    choices: [
      { label: 'Faire un vœu inversé', detail: '1 chance sur 2 : 2 objets tenus… ou 3 malédictions', apply: (r) => (r.rng.next() < 0.5
        ? `Jirachi rit à l’envers : ${giveRelic(r)} et ${giveRelic(r)} !`
        : (addCurses(r, 3), 'Le vœu explose : 3 Vœu Brisé rejoignent ton deck.')) },
      leave('Tu ne fais aucun vœu.'),
    ],
  },
  'tarot-lune': {
    text: 'La Lune inversée : le reflet devient réel, et prend la place de tes techniques.',
    choices: [
      { label: 'Traverser le reflet', detail: 'Perd 15 PV, transforme 4 cartes au hasard en cartes rares', available: (r) => r.hp > 15, apply: (r) => {
        hurt(r, 15);
        const pool = [...r.deck];
        const out: string[] = [];
        for (let i = 0; i < 4 && pool.length; i++) {
          const c = pool.splice(r.rng.int(0, pool.length - 1), 1)[0];
          c.defId = r.cardChoices('boss', 1)[0];
          out.push(cardDef(c.defId).name);
        }
        return `De l’autre côté du miroir : ${out.join(', ')}.`;
      } },
      leave('Tu détournes les yeux du reflet.'),
    ],
  },
  'tarot-soleil': {
    text: 'Le Soleil inversé brûle : une canicule écrasante qui forge ceux qui la supportent.',
    choices: [
      { label: 'Supporter la canicule', detail: 'Perd 30 % de tes PV, améliore 4 cartes au hasard', available: hasUpgradable, apply: (r) => (hurt(r, Math.round(r.hp * 0.3)), `Brûlé mais aguerri. Améliorées : ${upgradeRandom(r, 4)}.`) },
      leave('Tu te mets à l’ombre.'),
    ],
  },
  'tarot-jugement': {
    text: 'Le Jugement inversé efface tout ce que tu as accompli… et te paie pour recommencer.',
    choices: [
      { label: 'Accepter le jugement', detail: 'Toutes tes cartes perdent leur amélioration ; gagne 250 ₽ et un objet tenu', apply: (r) => {
        let n = 0;
        for (const c of r.deck) if (c.upgraded) { c.upgraded = false; n++; }
        r.money += 250;
        return `${n} amélioration${n > 1 ? 's' : ''} effacée${n > 1 ? 's' : ''}. +250 ₽ et ${giveRelic(r)}.`;
      } },
      leave('Tu fais la sourde oreille.'),
    ],
  },
  'tarot-monde': {
    text: 'Le Monde inversé : Mew retourne la couronne, et ton deck entier change de forme.',
    choices: [
      { label: 'Tout transformer', detail: 'Perd 20 PV, transforme TOUTES les cartes de ton deck', available: (r) => r.hp > 20, apply: (r) => (hurt(r, 20), `Le monde bascule : tes ${transformAll(r)} cartes sont transformées.`) },
      leave('Tu reposes la couronne.'),
    ],
  },
};
for (const e of TAROT_EVENTS) e.reversed = REVERSED[e.id];
