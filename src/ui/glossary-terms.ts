// Glossaire › Mots-clés : tous les mots-clés, statuts, pouvoirs, météos, terrains, enchantements et mécaniques du jeu.
import { ENCHANTS } from '../data/cards';
import { TERRAINS, WEATHER, FIELD_TURNS } from '../core/weather';
import { NOT_VERY_EFFECTIVE, SUPER_EFFECTIVE } from '../core/types';
import { POWER_INFO, STATUS_INFO } from './labels';
import { esc } from './util';

interface Term { name: string; text: string; color?: string }

/** Texte d'un statut ou pouvoir avec « X » à la place du nombre de cumuls. */
const generic = (f: (n: number) => string): string => f(2).replace(/\b2\b/g, 'X').replace(/<\/?b>/g, '');

const pct = (m: number) => `${Math.round((m - 1) * 100)} %`;

export function glossaryTermSections(): { title: string; note?: string; terms: Term[] }[] {
  return [
    {
      title: 'Bases du combat',
      terms: [
        { name: 'PA (points d’action)', text: 'Chaque carte coûte des PA (l’orbe en haut à gauche). Tu en as 3 au début de chaque tour, sauf bonus.' },
        { name: 'Protection', text: 'Absorbe les dégâts à la place de tes PV. Elle disparaît au début de ton tour suivant (sauf Clone).' },
        { name: 'Pioche, défausse, épuisées', text: 'Tu pioches 5 cartes par tour. Les cartes jouées vont dans la défausse, qui est mélangée dans la pioche quand celle-ci est vide. Les cartes épuisées ne reviennent pas de tout le combat.' },
        { name: 'Intention', text: 'L’icône au-dessus d’un ennemi annonce ce qu’il fera à son prochain tour (attaque, défense, statut…).' },
        { name: 'Même type ★', text: 'Une attaque du même type que ton Pokémon inflige 25 % de dégâts en plus.' },
        { name: 'Super efficace', text: `Le type de l’attaque est fort contre le Pokémon ciblé : +${pct(SUPER_EFFECTIVE)} de dégâts.` },
        { name: 'Pas très efficace', text: `Le type de l’attaque est faible contre le Pokémon ciblé : ${Math.round(NOT_VERY_EFFECTIVE * 100)} % des dégâts.` },
        { name: 'Immunité', text: 'Le Pokémon ciblé devrait être immunisé : les dégâts sont divisés par deux (jamais annulés).' },
        { name: 'Attaque / Défense', text: 'Hausses et baisses de stats : chaque point ajoute (ou retire) 1 dégât par coup ou 1 Protection par carte.' },
      ],
    },
    {
      title: 'Catégories et raretés de cartes',
      terms: [
        { name: 'Attaque', text: 'Carte qui inflige des dégâts.' },
        { name: 'Technique', text: 'Carte de soutien : Protection, pioche, statuts, soins…' },
        { name: 'Talent', text: 'Carte qui donne un effet durable pour tout le combat (un pouvoir). Elle ne revient pas une fois jouée.' },
        { name: 'Statut', text: 'Carte parasite ajoutée par un ennemi, souvent injouable.' },
        { name: 'Commune', color: '#3fbf4f', text: 'Bandeau vert.' },
        { name: 'Peu commune', color: '#2f8cff', text: 'Bandeau bleu.' },
        { name: 'Rare / Légendaire', color: '#ffb300', text: 'Bandeau doré, coins ornés et halo lumineux.' },
        { name: 'Chromatique', color: '#ff7ae0', text: 'Contour arc-en-ciel : n’importe quelle carte peut l’être, et toutes ses valeurs sont doublées. 1 chance sur 100 par carte en récompense et en boutique (2 avec le Charme Chroma).' },
        { name: 'Améliorée (+)', text: 'Version renforcée d’une carte (Centre Pokémon, événements, récompense après un Pokémon chromatique vaincu).' },
        { name: 'Enchantée ✦', text: 'Carte qui porte un ou plusieurs enchantements (voir plus bas).' },
      ],
    },
    {
      title: 'Mots-clés des cartes',
      terms: [
        { name: 'Épuisée', text: 'Une fois jouée, la carte est retirée pour le reste du combat.' },
        { name: 'Conservée', text: 'La carte reste dans ta main à la fin du tour au lieu d’être défaussée.' },
        { name: 'Éphémère', text: 'Si la carte est encore dans ta main à la fin du tour, elle est épuisée.' },
        { name: 'Innée', text: 'La carte est toujours dans ta main au début du combat.' },
        { name: 'Injouable', text: 'Cette carte ne peut pas être jouée.' },
        { name: 'Écho', text: 'La première fois que la carte est jouée dans un combat, elle se joue deux fois.' },
        { name: 'Coût X', text: 'Dépense tous tes PA restants : les valeurs de la carte sont multipliées par le nombre de PA dépensés.' },
      ],
    },
    {
      title: 'Statuts',
      note: 'X = nombre de cumuls.',
      terms: Object.values(STATUS_INFO).map((s) => ({ name: s.label, color: s.color, text: generic(s.text) })),
    },
    {
      title: 'Mécaniques des Pokémon',
      terms: [
        { name: 'Aura (Riolu)', color: '#4aa8ff', text: 'Chaque point d’Aura ajoute 1 dégât à ta prochaine attaque, puis l’Aura retombe à 0. Chaque PV perdu donne 1 Aura.' },
        { name: 'Bébé Kangourex', color: '#e8b04a', text: 'Il encaisse les attaques à la place de Kangourex tant qu’il est debout, et attaque à la fin de chaque tour.' },
        { name: 'Invocation', color: '#e8b04a', text: 'Le Bébé gagne autant de PV max et de PV. S’il est K.O., il revient avec autant de PV.' },
        { name: 'Puissance', color: '#e8b04a', text: 'Dégâts supplémentaires du Bébé à chacune de ses attaques.' },
        { name: 'Rage (Kangourex)', color: '#e5484d', text: 'Gagnée à chaque perte de PV ; les cartes de Rage s’en servent.' },
        { name: 'Élan (Caninos)', color: '#ffb84d', text: 'Protection gagnée au début du tour suivant, puis divisée par deux à la fin du tour.' },
        { name: 'Âme (Chien de la Lanterne)', text: 'Carte Spectre (0 PA, pioche 2, Épuisée) : la Lanterne Bleue en ajoute 3 à ta pioche au début de chaque combat, et certaines cartes réagissent quand tu en pioches une.' },
        { name: 'Copie (Quelorior)', text: 'Gribouille copie la capacité que prépare l’ennemi : elle rejoint ton deck pour la run.' },
        { name: 'Relais (Posipi & Négapi)', text: 'Jouer une carte du partenaire en retrait le fait passer en première ligne, où il encaisse les coups.' },
        { name: 'Décharge Synchro', text: 'Alterner Posipi → Négapi → Posipi → Négapi dans un même tour déclenche une Décharge Synchro.' },
        { name: 'Fusion Multipi', text: 'Avec le Pointeau ADN, Posipi et Négapi fusionnent au Centre Pokémon : PV et objets réunis, +1 PA par tour, Plus et Moins actifs sur toutes les cartes.' },
        { name: 'Tissage', text: 'Tisserand de Soie Astrale : au Centre Pokémon, crée une carte à partir de deux effets.' },
        { name: 'Méga-Évolution', text: 'Kangourex méga-évolue en cours de run (sauf avec certains skins).' },
        { name: 'Évolution', text: 'Ton Pokémon évolue au fil des actes : plus de PV et une nouvelle apparence.' },
      ],
    },
    {
      title: 'Chromatiques',
      terms: [
        { name: 'Pokémon chromatique', color: '#ffe066', text: 'Ennemi rare aux couleurs différentes : il rapporte plus de Pokédollars, et une des capacités proposées en récompense est déjà améliorée.' },
        { name: 'Étincelles', color: '#ffe066', text: 'Avec le Charme Chroma : +1 par tour, +1 par carte à 0 PA, +2 par ennemi vaincu. À 5, ta prochaine carte devient chromatique pour ce coup-ci (valeurs doublées).' },
        { name: 'Charme Chroma', color: '#ffe066', text: 'Objet tenu rare (objet de départ des skins chromatiques) : Étincelles, cartes chromatiques 2× plus fréquentes, Pokémon chromatiques 3× plus fréquents.' },
      ],
    },
    {
      title: 'Pouvoirs (effets des talents)',
      note: 'X = nombre de fois où le talent a été joué.',
      terms: Object.values(POWER_INFO).map((p) => ({ name: p.label, text: generic(p.text) })),
    },
    {
      title: `Météos (${FIELD_TURNS} tours)`,
      terms: Object.values(WEATHER).map((w) => ({ name: `${w.icon} ${w.name}`, color: '#7cc6ff', text: w.text })),
    },
    {
      title: `Terrains (${FIELD_TURNS} tours)`,
      terms: Object.values(TERRAINS).map((t) => ({ name: `${t.icon} ${t.name}`, color: '#8fd16a', text: t.text })),
    },
    {
      title: 'Enchantements',
      terms: Object.values(ENCHANTS).map((e) => ({ name: e.name, color: e.rarity === 'legendaire' ? '#ffb300' : e.rarity === 'epique' ? '#b46bff' : e.rarity === 'rare' ? '#4aa8ff' : undefined, text: e.text.charAt(0).toUpperCase() + e.text.slice(1) + '.' })),
    },
  ];
}

export function termsHtml(filter = ''): string {
  const q = filter.trim().toLowerCase();
  return glossaryTermSections().map((s) => {
    const terms = s.terms.filter((t) => !q || t.name.toLowerCase().includes(q) || t.text.toLowerCase().includes(q));
    if (!terms.length) return '';
    return `<h3>${esc(s.title)} · ${terms.length}</h3>${s.note ? `<p class="gl-note">${esc(s.note)}</p>` : ''}
      <div class="gl-terms">${terms.map((t) => `<div class="gl-term" ${t.color ? `style="--c:${t.color}"` : ''}><b>${esc(t.name)}</b><span>${esc(t.text)}</span></div>`).join('')}</div>`;
  }).join('') || '<p class="gl-note">Aucun mot-clé ne correspond.</p>';
}
