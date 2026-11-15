// Génère GEMINI-CARTES.md (liste des illustrations de capacités à faire avec Gemini) : npm run gemini-cartes
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { allCards } from '../src/data/cards';
import { TYPE_LABELS } from '../src/core/types';
import { artSlug } from '../src/ui/card-assets';
import { CHARACTERS } from '../src/data/characters';

const HINTS: Record<string, string> = {
  normal: 'impact puissant, traînées de vitesse, onde de choc blanche',
  feu: 'flammes orange et rouges, braises, chaleur',
  eau: 'jets et vagues d’eau bleue, éclaboussures',
  plante: 'lianes, feuilles, graines et lumière verte',
  electrik: 'éclairs jaunes, étincelles, arcs électriques',
  glace: 'cristaux de glace, givre, brume froide bleutée',
  combat: 'poings et coups, aura bleue, impact martial',
  poison: 'liquide et fumée violets, bulles toxiques',
  sol: 'terre, sable, roches qui jaillissent du sol',
  vol: 'bourrasques, plumes, courants d’air',
  psy: 'ondes psychiques roses et violettes, distorsion',
  insecte: 'élytres, fils de soie, nuée verte',
  roche: 'blocs de pierre, éclats de roche, poussière',
  spectre: 'ombres violettes, flammes fantomatiques',
  dragon: 'énergie draconique bleue et violette, écailles',
  tenebres: 'ténèbres, griffes d’ombre, lueurs rouges',
  acier: 'métal brillant, reflets argentés, étincelles',
  fee: 'lumière rose et blanche, étoiles, paillettes',
};
const CAT: Record<string, string> = { attaque: 'Attaque', technique: 'Technique', talent: 'Talent', statut: 'Statut' };

it('GEMINI-CARTES.md', () => {
  const moves = new Map<string, { name: string; type: string; cat: string; who: Set<string> }>();
  for (const c of allCards()) {
    const k = artSlug(c.name);
    const m = moves.get(k) ?? { name: c.name, type: c.pokeType, cat: c.category, who: new Set<string>() };
    m.who.add(c.character === 'normal' ? 'Neutre' : CHARACTERS[c.character as keyof typeof CHARACTERS].name);
    moves.set(k, m);
  }
  const rows = [...moves].sort((a, b) => a[1].name.localeCompare(b[1].name, 'fr')).map(([k, m]) =>
    `| \`${k}.png\` | ${m.name} | ${TYPE_LABELS[m.type as keyof typeof TYPE_LABELS]} · ${CAT[m.cat]} | ${[...m.who].join(', ')} | ${HINTS[m.type]} | ☐ |`);
  const md = `# Cartes — images à générer avec Gemini

Les cartes reprennent la disposition des cartes de Slay the Spire : **coût en haut à gauche, nom de la capacité dans un bandeau en haut, illustration au milieu, catégorie (Attaque / Technique / Talent) sur une plaque à la pointe de l'illustration, description en dessous.**
Le jeu écrit lui-même le coût, le nom, la catégorie, le type et la description : les images ne doivent contenir **aucun texte ni chiffre**.

Dépose les images dans le dépôt, dans les dossiers indiqués (ou envoie-les dans la conversation) : le jeu les utilise automatiquement. Tant qu'une image manque, la carte garde son cadre dessiné et l'icône de sa catégorie.

## 1. Les cadres (6 images)

Dossier : \`src/assets/cartes/cadres/\`, format portrait **750 × 1050** (5:7), PNG.

Prompt commun :

> Cadre de carte à jouer vide pour un jeu vidéo deckbuilder, vue de face, format portrait 5:7, style peint à la main, bords légèrement biseautés. Aucun texte, aucun chiffre, aucun personnage. Disposition exacte : une bordure épaisse de la couleur indiquée tout autour ; en haut, un large bandeau-parchemin gris argenté horizontal qui dépasse un peu des deux côtés de la carte, avec deux petites pointes recourbées vers le bas à ses extrémités (le bandeau occupe la hauteur entre 4 % et 17 % de la carte) ; en haut à gauche, un médaillon rond vide qui chevauche le coin de la carte (environ 22 % de la largeur) ; au centre, une fenêtre d'illustration vide et unie gris foncé, encadrée d'argent, qui va de 15 % à 58 % de la hauteur et de 9 % à 91 % de la largeur, dont le bas forme une pointe vers le centre ; à la pointe, une petite plaque argentée vide horizontale ; sous la fenêtre, jusqu'en bas, un grand panneau uni brun-violet très foncé pour le texte. Fond blanc uni autour de la carte.

Puis préciser la couleur :

| Fichier | Cartes | Couleur à ajouter au prompt | Fait |
| --- | --- | --- | --- |
| \`riolu.png\` | Riolu | Bordure **bleu roi** profond, petits motifs de flamme d'aura bleue gravés dans la bordure, médaillon bleu et noir. | ☐ |
| \`vipelierre.png\` | Vipélierre | Bordure **vert feuille**, motifs de lianes et de feuilles gravés dans la bordure, médaillon vert et or. | ☐ |
| \`kangourex.png\` | Kangourex | Bordure **brun chaud** façon cuir, motifs de petites empreintes gravés dans la bordure, médaillon brun et crème. | ☐ |
| \`caninos.png\` | Caninos | Bordure **rouge vif**, motifs de flammes gravés dans la bordure, médaillon rouge et orange. | ☐ |
| \`mew.png\` | Mew | Bordure **rose pastel**, motifs de bulles et d'hélices d'ADN gravés dans la bordure, médaillon rose et violet. | ☐ |
| \`neutre.png\` | Cartes neutres | Bordure **gris acier**, motifs géométriques sobres gravés dans la bordure, médaillon gris et argent. | ☐ |

Quand les cadres seront faits, envoie-les-moi : j'ajusterai la position du nom, du coût et de la description pour qu'ils tombent pile dans les zones du cadre.

## 2. Les illustrations des capacités (${moves.size} images)

Dossier : \`src/assets/cartes/illustrations/\`, format paysage **800 × 600** (4:3), PNG. Une seule image par capacité : elle sert pour tous les Pokémon qui l'apprennent (par exemple, Façade est la même pour Riolu, Vipélierre et Kangourex).

Prompt commun :

> Illustration pour une carte de jeu vidéo, format paysage 4:3, style illustration anime peinte, couleurs vives, cadrage serré et dynamique centré sur l'effet. Aucun texte, aucun logo, aucun Pokémon reconnaissable ni personnage : on montre la capacité elle-même (énergie, élément, impact, geste). Fond sombre et flou qui fait ressortir l'effet.

Puis ajouter : **« Capacité : <nom> »** et l'ambiance visuelle de la ligne.

| Fichier | Capacité | Type · catégorie | Utilisée par | Ambiance visuelle | Fait |
| --- | --- | --- | --- | --- | --- |
${rows.join('\n')}
`;
  writeFileSync('GEMINI-CARTES.md', md);
});
