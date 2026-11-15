# Cartes — images à générer avec Gemini

Les cartes reprennent la disposition des cartes de Slay the Spire : **coût en haut à gauche, nom de la capacité dans un bandeau en haut, illustration au milieu, catégorie (Attaque / Technique / Talent) sur une plaque à la pointe de l'illustration, description en dessous.**
Le jeu écrit lui-même le coût, le nom, la catégorie, le type et la description : les images ne doivent contenir **aucun texte ni chiffre**.

Dépose les images dans le dépôt, dans les dossiers indiqués (ou envoie-les dans la conversation) : le jeu les utilise automatiquement. Tant qu'une image manque, la carte garde son cadre dessiné et l'icône de sa catégorie.

## 1. Les cadres (6 images)

Dossier : `src/assets/cartes/cadres/`, format portrait **750 × 1050** (5:7), PNG.

Prompt commun :

> Cadre de carte à jouer vide pour un jeu vidéo deckbuilder, vue de face, format portrait 5:7, style peint à la main, bords légèrement biseautés. Aucun texte, aucun chiffre, aucun personnage. Disposition exacte : une bordure épaisse de la couleur indiquée tout autour ; en haut, un large bandeau-parchemin gris argenté horizontal qui dépasse un peu des deux côtés de la carte, avec deux petites pointes recourbées vers le bas à ses extrémités (le bandeau occupe la hauteur entre 4 % et 17 % de la carte) ; en haut à gauche, un médaillon rond vide qui chevauche le coin de la carte (environ 22 % de la largeur) ; au centre, une fenêtre d'illustration vide et unie gris foncé, encadrée d'argent, qui va de 15 % à 58 % de la hauteur et de 9 % à 91 % de la largeur, dont le bas forme une pointe vers le centre ; à la pointe, une petite plaque argentée vide horizontale ; sous la fenêtre, jusqu'en bas, un grand panneau uni brun-violet très foncé pour le texte. Fond blanc uni autour de la carte.

Puis préciser la couleur :

| Fichier | Cartes | Couleur à ajouter au prompt | Fait |
| --- | --- | --- | --- |
| `riolu.png` | Riolu | Bordure **bleu roi** profond, petits motifs de flamme d'aura bleue gravés dans la bordure, médaillon bleu et noir. | ☐ |
| `vipelierre.png` | Vipélierre | Bordure **vert feuille**, motifs de lianes et de feuilles gravés dans la bordure, médaillon vert et or. | ☐ |
| `kangourex.png` | Kangourex | Bordure **brun chaud** façon cuir, motifs de petites empreintes gravés dans la bordure, médaillon brun et crème. | ☐ |
| `caninos.png` | Caninos | Bordure **rouge vif**, motifs de flammes gravés dans la bordure, médaillon rouge et orange. | ☐ |
| `mew.png` | Mew | Bordure **rose pastel**, motifs de bulles et d'hélices d'ADN gravés dans la bordure, médaillon rose et violet. | ☐ |
| `neutre.png` | Cartes neutres | Bordure **gris acier**, motifs géométriques sobres gravés dans la bordure, médaillon gris et argent. | ☐ |

Quand les cadres seront faits, envoie-les-moi : j'ajusterai la position du nom, du coût et de la description pour qu'ils tombent pile dans les zones du cadre.

## 2. Les illustrations des capacités (286 images)

Dossier : `src/assets/cartes/illustrations/`, format paysage **800 × 600** (4:3), PNG. Une seule image par capacité : elle sert pour tous les Pokémon qui l'apprennent (par exemple, Façade est la même pour Riolu, Vipélierre et Kangourex).

Prompt commun :

> Illustration pour une carte de jeu vidéo, format paysage 4:3, style illustration anime peinte, couleurs vives, cadrage serré et dynamique centré sur l'effet. Aucun texte, aucun logo, aucun Pokémon reconnaissable ni personnage : on montre la capacité elle-même (énergie, élément, impact, geste). Fond sombre et flou qui fait ressortir l'effet.

Puis ajouter : **« Capacité : <nom> »** et l'ambiance visuelle de la ligne.

| Fichier | Capacité | Type · catégorie | Utilisée par | Ambiance visuelle | Fait |
| --- | --- | --- | --- | --- | --- |
| `abattage.png` | Abattage | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `abime.png` | Abîme | Sol · Attaque | Neutre | terre, sable, roches qui jaillissent du sol | ☐ |
| `aboiement.png` | Aboiement | Ténèbres · Attaque | Caninos, Mew | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `abri.png` | Abri | Normal · Technique | Neutre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `acidarmure.png` | Acidarmure | Poison · Technique | Neutre | liquide et fumée violets, bulles toxiques | ☐ |
| `acide.png` | Acide | Poison · Attaque | Neutre | liquide et fumée violets, bulles toxiques | ☐ |
| `aeropique.png` | Aéropique | Vol · Attaque | Riolu, Vipélierre, Kangourex, Caninos | bourrasques, plumes, courants d’air | ☐ |
| `affilage.png` | Affilage | Normal · Technique | Riolu | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `aile-d-acier.png` | Aile d'Acier | Acier · Attaque | Neutre | métal brillant, reflets argentés, étincelles | ☐ |
| `aire-d-herbe.png` | Aire d'Herbe | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `amnesie.png` | Amnésie | Psy · Technique | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `aqua-jet.png` | Aqua-Jet | Eau · Attaque | Neutre | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `aromatherapie.png` | Aromathérapie | Plante · Technique | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `atterrissage.png` | Atterrissage | Vol · Technique | Neutre | bourrasques, plumes, courants d’air | ☐ |
| `attraction.png` | Attraction | Normal · Technique | Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `aurasphere.png` | Aurasphère | Combat · Attaque | Riolu, Mew | poings et coups, aura bleue, impact martial | ☐ |
| `aurore.png` | Aurore | Normal · Technique | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `avalanche.png` | Avalanche | Glace · Attaque | Kangourex | cristaux de glace, givre, brume froide bleutée | ☐ |
| `balayage.png` | Balayage | Combat · Attaque | Riolu, Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `balayette.png` | Balayette | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `ball-ombre.png` | Ball'Ombre | Spectre · Attaque | Riolu, Kangourex, Mew | ombres violettes, flammes fantomatiques | ☐ |
| `balle-graine.png` | Balle Graine | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `belier.png` | Bélier | Normal · Attaque | Riolu, Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `blabla-dodo.png` | Blabla Dodo | Normal · Technique | Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `blizzard.png` | Blizzard | Glace · Attaque | Neutre | cristaux de glace, givre, brume froide bleutée | ☐ |
| `bluff.png` | Bluff | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `bomb-beurk.png` | Bomb-Beurk | Poison · Attaque | Neutre | liquide et fumée violets, bulles toxiques | ☐ |
| `bouclier.png` | Bouclier | Psy · Technique | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `boule-elek.png` | Boule Élek | Électrik · Attaque | Mew | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `bourdon.png` | Bourdon | Insecte · Attaque | Neutre | élytres, fils de soie, nuée verte | ☐ |
| `boutefeu.png` | Boutefeu | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `brouhaha.png` | Brouhaha | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `bulles-d-o.png` | Bulles d'O | Eau · Attaque | Neutre | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `cage-eclair.png` | Cage-Éclair | Électrik · Technique | Neutre | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `calinerie.png` | Câlinerie | Fée · Attaque | Caninos | lumière rose et blanche, étoiles, paillettes | ☐ |
| `canicule.png` | Canicule | Feu · Attaque | Caninos, Mew | flammes orange et rouges, braises, chaleur | ☐ |
| `canon-graine.png` | Canon Graine | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `cascade.png` | Cascade | Eau · Attaque | Neutre | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `casse-brique.png` | Casse-Brique | Combat · Attaque | Riolu, Kangourex, Mew | poings et coups, aura bleue, impact martial | ☐ |
| `champ-herbu.png` | Champ Herbu | Plante · Talent | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `champ-psychique.png` | Champ Psychique | Psy · Talent | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `change-eclair.png` | Change Éclair | Électrik · Attaque | Mew | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `chant-canon.png` | Chant Canon | Normal · Attaque | Vipélierre, Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `charge.png` | Charge | Normal · Attaque | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `charge-os.png` | Charge Os | Sol · Attaque | Riolu | terre, sable, roches qui jaillissent du sol | ☐ |
| `charme.png` | Charme | Fée · Technique | Neutre | lumière rose et blanche, étoiles, paillettes | ☐ |
| `chatiment.png` | Châtiment | Spectre · Attaque | Neutre | ombres violettes, flammes fantomatiques | ☐ |
| `choc-mental.png` | Choc Mental | Psy · Attaque | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `choc-psy.png` | Choc Psy | Psy · Attaque | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `clairvoyance.png` | Clairvoyance | Normal · Technique | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `clonage.png` | Clonage | Normal · Technique | Riolu, Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `close-combat.png` | Close Combat | Combat · Attaque | Riolu, Caninos | poings et coups, aura bleue, impact martial | ☐ |
| `colere.png` | Colère | Dragon · Attaque | Vipélierre, Kangourex, Caninos | énergie draconique bleue et violette, écailles | ☐ |
| `contre.png` | Contre | Combat · Attaque | Riolu, Kangourex, Caninos | poings et coups, aura bleue, impact martial | ☐ |
| `copietype.png` | Copietype | Normal · Technique | Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `coud-boue.png` | Coud'Boue | Sol · Attaque | Neutre | terre, sable, roches qui jaillissent du sol | ☐ |
| `coup-bas.png` | Coup Bas | Ténèbres · Attaque | Neutre | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `coup-croix.png` | Coup Croix | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `coup-d-boule.png` | Coup d'Boule | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `coup-d-main.png` | Coup d'Main | Normal · Technique | Riolu, Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `coup-double.png` | Coup Double | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `coupe.png` | Coupe | Normal · Attaque | Vipélierre, Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `crocs-eclair.png` | Crocs Éclair | Électrik · Attaque | Caninos | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `crocs-feu.png` | Crocs Feu | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `croissance.png` | Croissance | Normal · Technique | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `cru-ailes.png` | Cru-Ailes | Vol · Attaque | Neutre | bourrasques, plumes, courants d’air | ☐ |
| `damocles.png` | Damoclès | Normal · Attaque | Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `danse-draco.png` | Danse Draco | Dragon · Technique | Neutre | énergie draconique bleue et violette, écailles | ☐ |
| `danse-flammes.png` | Danse Flammes | Feu · Talent | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `danse-lames.png` | Danse Lames | Normal · Technique | Riolu, Vipélierre, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `dard-nuee.png` | Dard-Nuée | Insecte · Attaque | Neutre | élytres, fils de soie, nuée verte | ☐ |
| `deflagration.png` | Déflagration | Feu · Attaque | Kangourex, Caninos, Mew | flammes orange et rouges, braises, chaleur | ☐ |
| `degommage.png` | Dégommage | Ténèbres · Attaque | Kangourex, Mew | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `demi-tour.png` | Demi-Tour | Insecte · Attaque | Neutre | élytres, fils de soie, nuée verte | ☐ |
| `dernier-recours.png` | Dernier Recours | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `desherbaffe.png` | Désherbaffe | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `detection.png` | Détection | Combat · Technique | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `detritus.png` | Détritus | Poison · Attaque | Neutre | liquide et fumée violets, bulles toxiques | ☐ |
| `direct-toxik.png` | Direct Toxik | Poison · Attaque | Riolu, Mew | liquide et fumée violets, bulles toxiques | ☐ |
| `distorsion.png` | Distorsion | Psy · Technique | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `don-naturel.png` | Don Naturel | Normal · Attaque | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `double-pied.png` | Double Pied | Combat · Attaque | Caninos | poings et coups, aura bleue, impact martial | ☐ |
| `doux-parfum.png` | Doux Parfum | Normal · Technique | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `draco-choc.png` | Draco-Choc | Dragon · Attaque | Riolu, Vipélierre, Caninos, Mew | énergie draconique bleue et violette, écailles | ☐ |
| `draco-meteore.png` | Draco-Météore | Dragon · Attaque | Neutre | énergie draconique bleue et violette, écailles | ☐ |
| `draco-queue.png` | Draco-Queue | Dragon · Attaque | Vipélierre | énergie draconique bleue et violette, écailles | ☐ |
| `dracogriffe.png` | Dracogriffe | Dragon · Attaque | Neutre | énergie draconique bleue et violette, écailles | ☐ |
| `dracosouffle.png` | Dracosouffle | Dragon · Attaque | Neutre | énergie draconique bleue et violette, écailles | ☐ |
| `dynamo-poing.png` | Dynamo-Poing | Combat · Attaque | Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `eboulement.png` | Éboulement | Roche · Attaque | Riolu, Kangourex, Caninos, Mew | blocs de pierre, éclats de roche, poussière | ☐ |
| `ebullition.png` | Ébullition | Eau · Attaque | Mew | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `echange.png` | Échange | Psy · Technique | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `echo.png` | Écho | Normal · Attaque | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `eclair.png` | Éclair | Électrik · Attaque | Neutre | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `eclair-fou.png` | Éclair Fou | Électrik · Attaque | Caninos | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `eclat-magique.png` | Éclat Magique | Fée · Attaque | Neutre | lumière rose et blanche, étoiles, paillettes | ☐ |
| `eclate-griffe.png` | Éclate Griffe | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `eclate-roc.png` | Éclate-Roc | Combat · Attaque | Riolu, Kangourex, Caninos | poings et coups, aura bleue, impact martial | ☐ |
| `eco-sphere.png` | Éco-Sphère | Plante · Attaque | Vipélierre, Mew | lianes, feuilles, graines et lumière verte | ☐ |
| `ecras-face.png` | Écras'Face | Normal · Attaque | Kangourex, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ecrasement.png` | Écrasement | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `effort.png` | Effort | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `encore.png` | Encore | Normal · Technique | Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `enroulement.png` | Enroulement | Poison · Technique | Vipélierre | liquide et fumée violets, bulles toxiques | ☐ |
| `entrave.png` | Entrave | Normal · Technique | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `escalade.png` | Escalade | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `essorage.png` | Essorage | Normal · Attaque | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `exploforce.png` | Exploforce | Combat · Attaque | Riolu, Kangourex, Mew | poings et coups, aura bleue, impact martial | ☐ |
| `facade.png` | Façade | Normal · Attaque | Riolu, Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `fatal-foudre.png` | Fatal-Foudre | Électrik · Attaque | Neutre | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `feu-ensorcele.png` | Feu Ensorcelé | Feu · Attaque | Mew | flammes orange et rouges, braises, chaleur | ☐ |
| `feu-follet.png` | Feu Follet | Feu · Technique | Caninos, Mew | flammes orange et rouges, braises, chaleur | ☐ |
| `feuille-magik.png` | Feuille Magik | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `flair.png` | Flair | Normal · Technique | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `flammeche.png` | Flammèche | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `force.png` | Force | Normal · Attaque | Riolu, Vipélierre, Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `force-ajoutee.png` | Force Ajoutée | Psy · Attaque | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `force-cachee.png` | Force Cachée | Normal · Attaque | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `forte-paume.png` | Forte-Paume | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `fouet-lianes.png` | Fouet Lianes | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `fracass-tete.png` | Fracass'Tête | Roche · Attaque | Caninos | blocs de pierre, éclats de roche, poussière | ☐ |
| `frappe-atlas.png` | Frappe Atlas | Combat · Attaque | Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `frenesie.png` | Frénésie | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `frustration.png` | Frustration | Normal · Attaque | Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `giga-impact.png` | Giga Impact | Normal · Attaque | Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `giga-sangsue.png` | Giga-Sangsue | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `gliss-herbe.png` | Gliss'Herbe | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `gonflette.png` | Gonflette | Combat · Technique | Riolu, Mew | poings et coups, aura bleue, impact martial | ☐ |
| `grand-courroux.png` | Grand Courroux | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `griffe.png` | Griffe | Normal · Attaque | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `griffe-acier.png` | Griffe Acier | Acier · Attaque | Riolu | métal brillant, reflets argentés, étincelles | ☐ |
| `griffe-ombre.png` | Griffe Ombre | Spectre · Attaque | Riolu, Kangourex | ombres violettes, flammes fantomatiques | ☐ |
| `grimace.png` | Grimace | Normal · Technique | Riolu, Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `grincement.png` | Grincement | Normal · Technique | Riolu | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `grondement.png` | Grondement | Normal · Technique | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `groz-yeux.png` | Groz'Yeux | Normal · Technique | Vipélierre, Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `gyroballe.png` | Gyroballe | Acier · Attaque | Neutre | métal brillant, reflets argentés, étincelles | ☐ |
| `hate.png` | Hâte | Psy · Technique | Riolu, Caninos, Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `hurlement.png` | Hurlement | Normal · Technique | Riolu, Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `hydrocanon.png` | Hydrocanon | Eau · Attaque | Neutre | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `hydroqueue.png` | Hydroqueue | Eau · Attaque | Vipélierre | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `implore.png` | Implore | Normal · Attaque | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `indignition.png` | Indignition | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `interversion.png` | Interversion | Psy · Technique | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `jet-pierres.png` | Jet-Pierres | Roche · Attaque | Neutre | blocs de pierre, éclats de roche, poussière | ☐ |
| `lame-d-air.png` | Lame d'Air | Vol · Attaque | Neutre | bourrasques, plumes, courants d’air | ☐ |
| `lame-de-roc.png` | Lame de Roc | Roche · Attaque | Riolu, Caninos, Mew | blocs de pierre, éclats de roche, poussière | ☐ |
| `lame-feuille.png` | Lame Feuille | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `lance-flammes.png` | Lance-Flammes | Feu · Attaque | Kangourex, Caninos, Mew | flammes orange et rouges, braises, chaleur | ☐ |
| `lance-soleil.png` | Lance-Soleil | Plante · Attaque | Vipélierre, Kangourex, Caninos, Mew | lianes, feuilles, graines et lumière verte | ☐ |
| `larcin.png` | Larcin | Ténèbres · Attaque | Kangourex, Caninos | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `laser-glace.png` | Laser Glace | Glace · Attaque | Neutre | cristaux de glace, givre, brume froide bleutée | ☐ |
| `lechouille.png` | Léchouille | Spectre · Attaque | Neutre | ombres violettes, flammes fantomatiques | ☐ |
| `ligotage.png` | Ligotage | Normal · Attaque | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `lire-esprit.png` | Lire-Esprit | Normal · Talent | Riolu | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `luminocanon.png` | Luminocanon | Acier · Attaque | Riolu, Mew | métal brillant, reflets argentés, étincelles | ☐ |
| `mach-punch.png` | Mach Punch | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `machination.png` | Machination | Ténèbres · Technique | Riolu, Mew | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `machouille.png` | Mâchouille | Ténèbres · Attaque | Riolu, Kangourex, Caninos | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `malediction.png` | Malédiction | Spectre · Technique | Caninos | ombres violettes, flammes fantomatiques | ☐ |
| `mania.png` | Mania | Normal · Attaque | Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `marto-poing.png` | Marto-Poing | Combat · Attaque | Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `mega-evolution.png` | Méga-Évolution | Normal · Talent | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mega-sangsue.png` | Méga-Sangsue | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `megaphone.png` | Mégaphone | Normal · Attaque | Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `megapoing.png` | Mégapoing | Normal · Attaque | Riolu | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `metalaser.png` | Métalaser | Acier · Attaque | Riolu | métal brillant, reflets argentés, étincelles | ☐ |
| `meteores.png` | Météores | Normal · Attaque | Riolu, Vipélierre, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `metronome.png` | Métronome | Normal · Technique | Riolu, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mimi-queue.png` | Mimi-Queue | Normal · Technique | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mimique.png` | Mimique | Normal · Technique | Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mitra-poing.png` | Mitra-Poing | Combat · Attaque | Riolu, Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `moi-d-abord.png` | Moi d'Abord | Normal · Attaque | Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `morphing.png` | Morphing | Normal · Technique | Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `morsure.png` | Morsure | Ténèbres · Attaque | Caninos, Riolu, Kangourex | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `mur-de-fer.png` | Mur de Fer | Acier · Technique | Riolu, Mew | métal brillant, reflets argentés, étincelles | ☐ |
| `mur-lumiere.png` | Mur Lumière | Psy · Talent | Vipélierre, Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `nitrocharge.png` | Nitrocharge | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `n-ud-herbe.png` | Nœud Herbe | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `ombre-portee.png` | Ombre Portée | Spectre · Attaque | Neutre | ombres violettes, flammes fantomatiques | ☐ |
| `onde-de-choc.png` | Onde de Choc | Électrik · Attaque | Kangourex | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `onde-folie.png` | Onde Folie | Spectre · Technique | Neutre | ombres violettes, flammes fantomatiques | ☐ |
| `onde-vide.png` | Onde Vide | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `ouragan.png` | Ouragan | Dragon · Attaque | Vipélierre | énergie draconique bleue et violette, écailles | ☐ |
| `photocopie.png` | Photocopie | Normal · Technique | Riolu | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `phytomixeur.png` | Phytomixeur | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `pied-bruleur.png` | Pied Brûleur | Feu · Attaque | Riolu | flammes orange et rouges, braises, chaleur | ☐ |
| `pied-voltige.png` | Pied Voltige | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `pietisol.png` | Piétisol | Sol · Attaque | Riolu, Kangourex, Caninos, Mew | terre, sable, roches qui jaillissent du sol | ☐ |
| `pisto-poing.png` | Pisto-Poing | Acier · Attaque | Riolu | métal brillant, reflets argentés, étincelles | ☐ |
| `pistolet-a-o.png` | Pistolet à O | Eau · Attaque | Neutre | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `plaie-croix.png` | Plaie-Croix | Insecte · Attaque | Neutre | élytres, fils de soie, nuée verte | ☐ |
| `plaquage.png` | Plaquage | Normal · Attaque | Riolu, Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `plenitude.png` | Plénitude | Psy · Talent | Riolu, Vipélierre, Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `poing-boost.png` | Poing Boost | Combat · Attaque | Riolu, Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `poing-comete.png` | Poing Comète | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `poing-de-feu.png` | Poing de Feu | Feu · Attaque | Kangourex, Mew | flammes orange et rouges, braises, chaleur | ☐ |
| `poing-eclair.png` | Poing Éclair | Électrik · Attaque | Riolu, Kangourex, Mew | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `poing-glace.png` | Poing Glace | Glace · Attaque | Riolu, Kangourex, Mew | cristaux de glace, givre, brume froide bleutée | ☐ |
| `poing-meteore.png` | Poing Météore | Acier · Attaque | Riolu | métal brillant, reflets argentés, étincelles | ☐ |
| `poing-karate.png` | Poing-Karaté | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `possessif.png` | Possessif | Psy · Technique | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `poudreuse.png` | Poudreuse | Glace · Attaque | Neutre | cristaux de glace, givre, brume froide bleutée | ☐ |
| `poursuite.png` | Poursuite | Ténèbres · Attaque | Vipélierre | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `pouvoir-antique.png` | Pouvoir Antique | Roche · Attaque | Neutre | blocs de pierre, éclats de roche, poussière | ☐ |
| `pouvoir-lunaire.png` | Pouvoir Lunaire | Fée · Attaque | Neutre | lumière rose et blanche, étoiles, paillettes | ☐ |
| `prescience.png` | Prescience | Psy · Attaque | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `prevention.png` | Prévention | Combat · Technique | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `projection.png` | Projection | Combat · Attaque | Riolu, Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `protection.png` | Protection | Normal · Technique | Vipélierre, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `provoc.png` | Provoc | Ténèbres · Technique | Vipélierre, Mew | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `psycho-croc.png` | Psycho-Croc | Psy · Attaque | Caninos | ondes psychiques roses et violettes, distorsion | ☐ |
| `psyko.png` | Psyko | Psy · Attaque | Riolu, Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `psykoud-boul.png` | Psykoud'Boul | Psy · Attaque | Riolu, Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `puissance.png` | Puissance | Normal · Technique | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `puissance-cachee.png` | Puissance Cachée | Normal · Attaque | Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `queue-de-fer.png` | Queue de Fer | Acier · Attaque | Riolu, Vipélierre, Kangourex, Caninos | métal brillant, reflets argentés, étincelles | ☐ |
| `rafale-ecailles.png` | Rafale Écailles | Dragon · Attaque | Vipélierre | énergie draconique bleue et violette, écailles | ☐ |
| `rapace.png` | Rapace | Vol · Attaque | Neutre | bourrasques, plumes, courants d’air | ☐ |
| `rayon-charge.png` | Rayon Chargé | Électrik · Attaque | Mew | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `reflet.png` | Reflet | Normal · Technique | Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `regard-medusant.png` | Regard Médusant | Normal · Technique | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `regard-noir.png` | Regard Noir | Normal · Technique | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `relais.png` | Relais | Normal · Technique | Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `rengorgement.png` | Rengorgement | Normal · Technique | Riolu, Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `repos.png` | Repos | Psy · Technique | Vipélierre, Kangourex, Caninos, Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `represailles.png` | Représailles | Ténèbres · Attaque | Riolu | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `retour.png` | Retour | Normal · Attaque | Vipélierre, Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `riposte.png` | Riposte | Combat · Technique | Riolu, Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `ronflement.png` | Ronflement | Normal · Attaque | Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `roue-de-feu.png` | Roue de Feu | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `rugissement.png` | Rugissement | Normal · Technique | Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `rune-protect.png` | Rune Protect | Normal · Technique | Vipélierre, Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ruse.png` | Ruse | Normal · Attaque | Riolu | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `sable-ardent.png` | Sable Ardent | Sol · Attaque | Caninos | terre, sable, roches qui jaillissent du sol | ☐ |
| `sabotage.png` | Sabotage | Ténèbres · Attaque | Neutre | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `sacrifice.png` | Sacrifice | Combat · Attaque | Kangourex | poings et coups, aura bleue, impact martial | ☐ |
| `seduction.png` | Séduction | Normal · Technique | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `seisme.png` | Séisme | Sol · Attaque | Riolu, Kangourex, Mew | terre, sable, roches qui jaillissent du sol | ☐ |
| `siffl-herbe.png` | Siffl'Herbe | Plante · Technique | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `soucigraine.png` | Soucigraine | Plante · Technique | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `souplesse.png` | Souplesse | Normal · Attaque | Vipélierre | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `strido-son.png` | Strido-Son | Acier · Technique | Riolu | métal brillant, reflets argentés, étincelles | ☐ |
| `suc-digestif.png` | Suc Digestif | Poison · Technique | Vipélierre | liquide et fumée violets, bulles toxiques | ☐ |
| `surchauffe.png` | Surchauffe | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `surf.png` | Surf | Eau · Attaque | Neutre | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `synthese.png` | Synthèse | Plante · Technique | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `tacle-feu.png` | Tacle Feu | Feu · Attaque | Caninos | flammes orange et rouges, braises, chaleur | ☐ |
| `telekinesie.png` | Télékinésie | Psy · Talent | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `telluriforce.png` | Telluriforce | Sol · Attaque | Neutre | terre, sable, roches qui jaillissent du sol | ☐ |
| `tempete-florale.png` | Tempête Florale | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `tempete-verte.png` | Tempête Verte | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `tenacite.png` | Ténacité | Normal · Technique | Riolu, Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `tera-explosion.png` | Téra Explosion | Normal · Attaque | Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `tete-de-fer.png` | Tête de Fer | Acier · Attaque | Neutre | métal brillant, reflets argentés, étincelles | ☐ |
| `tomberoche.png` | Tomberoche | Roche · Attaque | Riolu, Kangourex | blocs de pierre, éclats de roche, poussière | ☐ |
| `tonnerre.png` | Tonnerre | Électrik · Attaque | Neutre | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `tornade.png` | Tornade | Vol · Attaque | Neutre | bourrasques, plumes, courants d’air | ☐ |
| `tour-de-magie.png` | Tour de Magie | Psy · Talent | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `tout-ou-rien.png` | Tout ou Rien | Combat · Attaque | Riolu | poings et coups, aura bleue, impact martial | ☐ |
| `toxik.png` | Toxik | Poison · Technique | Neutre | liquide et fumée violets, bulles toxiques | ☐ |
| `tranche-nuit.png` | Tranche-Nuit | Ténèbres · Attaque | Neutre | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `trepignement.png` | Trépignement | Sol · Attaque | Kangourex | terre, sable, roches qui jaillissent du sol | ☐ |
| `tunnel.png` | Tunnel | Sol · Attaque | Kangourex, Caninos, Mew | terre, sable, roches qui jaillissent du sol | ☐ |
| `ultimapoing.png` | Ultimapoing | Normal · Attaque | Kangourex, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ultimawashi.png` | Ultimawashi | Normal · Attaque | Riolu, Kangourex, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ultralaser.png` | Ultralaser | Normal · Attaque | Riolu, Vipélierre, Kangourex, Caninos, Mew | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `uppercut.png` | Uppercut | Normal · Attaque | Kangourex | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vampi-poing.png` | Vampi-Poing | Combat · Attaque | Riolu, Kangourex, Mew | poings et coups, aura bleue, impact martial | ☐ |
| `vampigraine.png` | Vampigraine | Plante · Technique | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `vampirisme.png` | Vampirisme | Insecte · Attaque | Neutre | élytres, fils de soie, nuée verte | ☐ |
| `vantardise.png` | Vantardise | Normal · Technique | Vipélierre, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vaste-pouvoir.png` | Vaste Pouvoir | Psy · Attaque | Mew | ondes psychiques roses et violettes, distorsion | ☐ |
| `vege-attaque.png` | Végé-Attaque | Plante · Attaque | Vipélierre | lianes, feuilles, graines et lumière verte | ☐ |
| `vengeance.png` | Vengeance | Normal · Attaque | Vipélierre, Kangourex, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vent-feerique.png` | Vent Féérique | Fée · Attaque | Neutre | lumière rose et blanche, étoiles, paillettes | ☐ |
| `vent-glace.png` | Vent Glace | Glace · Attaque | Neutre | cristaux de glace, givre, brume froide bleutée | ☐ |
| `vibra-soin.png` | Vibra Soin | Psy · Technique | Riolu | ondes psychiques roses et violettes, distorsion | ☐ |
| `vibraqua.png` | Vibraqua | Eau · Attaque | Riolu, Kangourex, Mew | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `vibrobscur.png` | Vibrobscur | Ténèbres · Attaque | Riolu, Mew | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `vitesse-extreme.png` | Vitesse Extrême | Normal · Attaque | Riolu, Caninos | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vive-attaque.png` | Vive-Attaque | Normal · Attaque | Riolu | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `voile-miroir.png` | Voile Miroir | Psy · Attaque | Vipélierre | ondes psychiques roses et violettes, distorsion | ☐ |
| `voix-enjoleuse.png` | Voix Enjôleuse | Fée · Attaque | Neutre | lumière rose et blanche, étoiles, paillettes | ☐ |
| `vol.png` | Vol | Vol · Attaque | Mew | bourrasques, plumes, courants d’air | ☐ |
| `zenith.png` | Zénith | Feu · Talent | Vipélierre, Caninos | flammes orange et rouges, braises, chaleur | ☐ |
