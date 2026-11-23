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
| `riolu.png` | Riolu | Bordure **bleu roi** profond, petits motifs de flamme d'aura bleue gravés dans la bordure, médaillon bleu et noir. | ☑ |
| `vipelierre.png` | Vipélierre | Bordure **vert feuille**, motifs de lianes et de feuilles gravés dans la bordure, médaillon vert et or. | ☑ |
| `kangourex.png` | Kangourex | Bordure **brun chaud** façon cuir, motifs de petites empreintes gravés dans la bordure, médaillon brun et crème. | ☑ |
| `caninos.png` | Caninos | Bordure **rouge vif**, motifs de flammes gravés dans la bordure, médaillon rouge et orange. | ☑ |
| `mew.png` | Mew | Bordure **rose pastel**, motifs de bulles et d'hélices d'ADN gravés dans la bordure, médaillon rose et violet. | ☑ |
| `neutre.png` | Cartes neutres | Bordure **gris acier**, motifs géométriques sobres gravés dans la bordure, médaillon gris et argent. | ☑ |

Quand les cadres seront faits, envoie-les-moi : j'ajusterai la position du nom, du coût et de la description pour qu'ils tombent pile dans les zones du cadre.

## 2. Les illustrations des capacités (332 images)

Dossier : `src/assets/cartes/illustrations/`, format paysage **800 × 600** (4:3), PNG. Une seule image par capacité : elle sert pour tous les Pokémon qui l'apprennent (par exemple, Façade est la même pour Riolu, Vipélierre et Kangourex).

Prompt commun :

> Illustration pour une carte de jeu vidéo, format paysage 4:3, style illustration anime peinte façon artwork officiel Pokémon, couleurs vives, cadrage serré et dynamique. Aucun texte, aucun logo. Fond sombre et flou qui fait ressortir l'action.

Puis, selon la colonne « Pokémon dans l'image » :

- **Capacité exclusive (185 images)** — un seul personnage l'apprend, il apparaît dans l'image : *« Le Pokémon <nom> lance la capacité <capacité> : <ambiance visuelle>. Le Pokémon est fidèle à son apparence officielle, en pleine action, l'effet de la capacité occupe une grande partie de l'image. »*
- **Capacité partagée (147 images)** — plusieurs Pokémon l'apprennent, l'image sert pour tous : *« Capacité <capacité> : <ambiance visuelle>. Aucun Pokémon ni personnage : on montre la capacité elle-même (énergie, élément, impact, geste). »*

Mew utilise les cartes de tous les personnages : une capacité que seuls Riolu et Mew apprennent (comme Aurasphère) montre Riolu, et Mew n'apparaît que sur ses propres capacités (Morphing, Métronome…).

| Fichier | Capacité | Type · catégorie | Utilisée par | Pokémon dans l'image | Ambiance visuelle | Fait |
| --- | --- | --- | --- | --- | --- | --- |
| `abattage.png` | Abattage | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `abime.png` | Abîme | Sol · Attaque | Neutre | Aucun (capacité seule) | terre, sable, roches qui jaillissent du sol | ☐ |
| `aboiement.png` | Aboiement | Ténèbres · Attaque | Caninos, Mew | **Caninos** lance la capacité | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `abri.png` | Abri | Normal · Technique | Neutre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `acidarmure.png` | Acidarmure | Poison · Technique | Neutre | Aucun (capacité seule) | liquide et fumée violets, bulles toxiques | ☐ |
| `acide.png` | Acide | Poison · Attaque | Neutre | Aucun (capacité seule) | liquide et fumée violets, bulles toxiques | ☐ |
| `aeropique.png` | Aéropique | Vol · Attaque | Riolu, Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | bourrasques, plumes, courants d’air | ☐ |
| `affilage.png` | Affilage | Normal · Technique | Riolu | **Riolu** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `aile-d-acier.png` | Aile d'Acier | Acier · Attaque | Neutre | Aucun (capacité seule) | métal brillant, reflets argentés, étincelles | ☐ |
| `aire-d-herbe.png` | Aire d'Herbe | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `ame.png` | Âme | Spectre · Technique | Caninos | **Caninos** lance la capacité | ombres violettes, flammes fantomatiques | ☐ |
| `amnesie.png` | Amnésie | Psy · Technique | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `aqua-jet.png` | Aqua-Jet | Eau · Attaque | Neutre | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `aromate-bleu.png` | Aromate Bleu | Eau · Technique | Vipélierre | **Vipélierre** lance la capacité | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `aromate-dore.png` | Aromate Doré | Normal · Technique | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `aromate-jaune.png` | Aromate Jaune | Électrik · Technique | Vipélierre | **Vipélierre** lance la capacité | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `aromate-rose.png` | Aromate Rose | Fée · Technique | Vipélierre | **Vipélierre** lance la capacité | lumière rose et blanche, étoiles, paillettes | ☐ |
| `aromate-rouge.png` | Aromate Rouge | Feu · Attaque | Vipélierre | **Vipélierre** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `aromate-vert.png` | Aromate Vert | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `aromatherapie.png` | Aromathérapie | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `atterrissage.png` | Atterrissage | Vol · Technique | Neutre | Aucun (capacité seule) | bourrasques, plumes, courants d’air | ☐ |
| `attraction.png` | Attraction | Normal · Technique | Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `aurasphere.png` | Aurasphère | Combat · Attaque | Riolu, Mew | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `aurore.png` | Aurore | Normal · Technique | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `avalanche.png` | Avalanche | Glace · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | cristaux de glace, givre, brume froide bleutée | ☐ |
| `baillement.png` | Bâillement | Normal · Technique | Neutre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `balayage.png` | Balayage | Combat · Attaque | Riolu, Kangourex | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `balayette.png` | Balayette | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `ball-ombre.png` | Ball'Ombre | Spectre · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `balle-graine.png` | Balle Graine | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `belier.png` | Bélier | Normal · Attaque | Riolu, Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `berceuse.png` | Berceuse | Normal · Technique | Neutre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `blabla-dodo.png` | Blabla Dodo | Normal · Technique | Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `blizzard.png` | Blizzard | Glace · Attaque | Neutre | Aucun (capacité seule) | cristaux de glace, givre, brume froide bleutée | ☐ |
| `bluff.png` | Bluff | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `bomb-beurk.png` | Bomb-Beurk | Poison · Attaque | Neutre | Aucun (capacité seule) | liquide et fumée violets, bulles toxiques | ☐ |
| `bouclier.png` | Bouclier | Psy · Technique | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `bouclier-royal.png` | Bouclier Royal | Acier · Technique | Riolu | **Riolu** lance la capacité | métal brillant, reflets argentés, étincelles | ☐ |
| `boul-armure.png` | Boul'Armure | Normal · Technique | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `boule-elek.png` | Boule Élek | Électrik · Attaque | Mew | **Mew** lance la capacité | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `bourdon.png` | Bourdon | Insecte · Attaque | Neutre | Aucun (capacité seule) | élytres, fils de soie, nuée verte | ☐ |
| `boutefeu.png` | Boutefeu | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `brouhaha.png` | Brouhaha | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `bulles-d-o.png` | Bulles d'O | Eau · Attaque | Neutre | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `cage-eclair.png` | Cage-Éclair | Électrik · Technique | Neutre | Aucun (capacité seule) | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `calinerie.png` | Câlinerie | Fée · Attaque | Kangourex, Caninos | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `canicule.png` | Canicule | Feu · Attaque | Caninos, Mew | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `canon-graine.png` | Canon Graine | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `cascade.png` | Cascade | Eau · Attaque | Neutre | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `casse-brique.png` | Casse-Brique | Combat · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `catalyse.png` | Catalyse | Poison · Technique | Vipélierre | **Vipélierre** lance la capacité | liquide et fumée violets, bulles toxiques | ☐ |
| `cauchemar.png` | Cauchemar | Spectre · Statut | Neutre | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `cendres.png` | Cendres | Feu · Statut | Neutre | Aucun (capacité seule) | flammes orange et rouges, braises, chaleur | ☐ |
| `champ-brumeux.png` | Champ Brumeux | Fée · Technique | Neutre | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `champ-electrifie.png` | Champ Électrifié | Électrik · Technique | Neutre | Aucun (capacité seule) | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `champ-herbu.png` | Champ Herbu | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `champ-psychique.png` | Champ Psychique | Psy · Talent | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `change-eclair.png` | Change Éclair | Électrik · Attaque | Mew | **Mew** lance la capacité | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `chant-canon.png` | Chant Canon | Normal · Attaque | Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `charge.png` | Charge | Normal · Attaque | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `charge-os.png` | Charge Os | Sol · Attaque | Riolu | **Riolu** lance la capacité | terre, sable, roches qui jaillissent du sol | ☐ |
| `charme.png` | Charme | Fée · Technique | Neutre | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `chatiment.png` | Châtiment | Spectre · Attaque | Neutre | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `choc-mental.png` | Choc Mental | Psy · Attaque | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `choc-psy.png` | Choc Psy | Psy · Attaque | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `clairvoyance.png` | Clairvoyance | Normal · Technique | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `clonage.png` | Clonage | Normal · Technique | Riolu, Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `close-combat.png` | Close Combat | Combat · Attaque | Riolu, Caninos | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `colere.png` | Colère | Dragon · Attaque | Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `contre.png` | Contre | Combat · Attaque | Riolu, Kangourex, Caninos | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `copietype.png` | Copietype | Normal · Technique | Mew | **Mew** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `cotogarde.png` | Cotogarde | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `coud-boue.png` | Coud'Boue | Sol · Attaque | Neutre | Aucun (capacité seule) | terre, sable, roches qui jaillissent du sol | ☐ |
| `coup-bas.png` | Coup Bas | Ténèbres · Attaque | Neutre | Aucun (capacité seule) | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `coup-croix.png` | Coup Croix | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `coup-d-boule.png` | Coup d'Boule | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `coup-d-main.png` | Coup d'Main | Normal · Technique | Riolu, Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `coup-double.png` | Coup Double | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `coup-victoire.png` | Coup Victoire | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `coupe.png` | Coupe | Normal · Attaque | Vipélierre, Kangourex | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `crocs-eclair.png` | Crocs Éclair | Électrik · Attaque | Caninos | **Caninos** lance la capacité | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `crocs-feu.png` | Crocs Feu | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `croissance.png` | Croissance | Normal · Technique | Vipélierre, Kangourex | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `cru-ailes.png` | Cru-Ailes | Vol · Attaque | Neutre | Aucun (capacité seule) | bourrasques, plumes, courants d’air | ☐ |
| `damocles.png` | Damoclès | Normal · Attaque | Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `danse-draco.png` | Danse Draco | Dragon · Technique | Neutre | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `danse-flammes.png` | Danse Flammes | Feu · Talent | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `danse-lames.png` | Danse Lames | Normal · Technique | Riolu, Vipélierre, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `danse-pluie.png` | Danse Pluie | Eau · Technique | Neutre | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `dard-venimeux.png` | Dard Venimeux | Poison · Statut | Neutre | Aucun (capacité seule) | liquide et fumée violets, bulles toxiques | ☐ |
| `dard-nuee.png` | Dard-Nuée | Insecte · Attaque | Neutre | Aucun (capacité seule) | élytres, fils de soie, nuée verte | ☐ |
| `deflagration.png` | Déflagration | Feu · Attaque | Caninos, Mew | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `degommage.png` | Dégommage | Ténèbres · Attaque | Kangourex, Mew | **Kangourex** (avec son Bébé dans la poche) lance la capacité | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `demi-tour.png` | Demi-Tour | Insecte · Attaque | Neutre | Aucun (capacité seule) | élytres, fils de soie, nuée verte | ☐ |
| `dernier-recours.png` | Dernier Recours | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `desherbaffe.png` | Désherbaffe | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `detection.png` | Détection | Combat · Technique | Riolu, Caninos | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `detritus.png` | Détritus | Poison · Attaque | Neutre | Aucun (capacité seule) | liquide et fumée violets, bulles toxiques | ☐ |
| `devoreve.png` | Dévorêve | Psy · Attaque | Neutre | Aucun (capacité seule) | ondes psychiques roses et violettes, distorsion | ☐ |
| `direct-toxik.png` | Direct Toxik | Poison · Attaque | Riolu, Mew | **Riolu** lance la capacité | liquide et fumée violets, bulles toxiques | ☐ |
| `distorsion.png` | Distorsion | Psy · Technique | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `don-naturel.png` | Don Naturel | Normal · Technique | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `double-baffe.png` | Double Baffe | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `double-pied.png` | Double Pied | Combat · Attaque | Caninos | **Caninos** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `doux-parfum.png` | Doux Parfum | Normal · Technique | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `draco-choc.png` | Draco-Choc | Dragon · Attaque | Riolu, Vipélierre, Caninos, Mew | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `draco-meteore.png` | Draco-Météore | Dragon · Attaque | Neutre | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `draco-queue.png` | Draco-Queue | Dragon · Attaque | Vipélierre | **Vipélierre** lance la capacité | énergie draconique bleue et violette, écailles | ☐ |
| `dracogriffe.png` | Dracogriffe | Dragon · Attaque | Neutre | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `dracosouffle.png` | Dracosouffle | Dragon · Attaque | Neutre | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `dynamo-poing.png` | Dynamo-Poing | Combat · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `eboulement.png` | Éboulement | Roche · Attaque | Riolu, Kangourex, Caninos, Mew | Aucun (capacité seule) | blocs de pierre, éclats de roche, poussière | ☐ |
| `ebullition.png` | Ébullition | Eau · Attaque | Mew | **Mew** lance la capacité | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `ecaille-poudreuse.png` | Écaille Poudreuse | Insecte · Statut | Neutre | Aucun (capacité seule) | élytres, fils de soie, nuée verte | ☐ |
| `echange.png` | Échange | Psy · Technique | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `echo.png` | Écho | Normal · Attaque | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `eclair.png` | Éclair | Électrik · Attaque | Neutre | Aucun (capacité seule) | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `eclair-fou.png` | Éclair Fou | Électrik · Attaque | Caninos | **Caninos** lance la capacité | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `eclat-magique.png` | Éclat Magique | Fée · Attaque | Neutre | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `eclate-griffe.png` | Éclate Griffe | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `eclate-roc.png` | Éclate-Roc | Combat · Attaque | Riolu, Kangourex, Caninos | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `eco-sphere.png` | Éco-Sphère | Plante · Attaque | Vipélierre, Mew | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `ecras-face.png` | Écras'Face | Normal · Attaque | Kangourex, Mew | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ecrasement.png` | Écrasement | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `effort.png` | Effort | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `electrocution.png` | Électrocution | Électrik · Statut | Neutre | Aucun (capacité seule) | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `encore.png` | Encore | Normal · Technique | Mew | **Mew** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `enroulement.png` | Enroulement | Poison · Technique | Vipélierre | **Vipélierre** lance la capacité | liquide et fumée violets, bulles toxiques | ☐ |
| `entrave.png` | Entrave | Normal · Technique | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `escalade.png` | Escalade | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `essorage.png` | Essorage | Normal · Technique | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `exploforce.png` | Exploforce | Combat · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `facade.png` | Façade | Normal · Attaque | Riolu, Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `fatal-foudre.png` | Fatal-Foudre | Électrik · Attaque | Neutre | Aucun (capacité seule) | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `felure-temporelle.png` | Fêlure Temporelle | Dragon · Statut | Neutre | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `feu-ensorcele.png` | Feu Ensorcelé | Feu · Attaque | Mew | **Mew** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `feu-follet.png` | Feu Follet | Feu · Technique | Caninos, Mew | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `feuille-magik.png` | Feuille Magik | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `flair.png` | Flair | Normal · Technique | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `flammeche.png` | Flammèche | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `force.png` | Force | Normal · Attaque | Riolu, Vipélierre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `force-ajoutee.png` | Force Ajoutée | Psy · Attaque | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `force-cachee.png` | Force Cachée | Normal · Attaque | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `forte-paume.png` | Forte-Paume | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `fouet-lianes.png` | Fouet Lianes | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `fracass-tete.png` | Fracass'Tête | Roche · Attaque | Caninos | **Caninos** lance la capacité | blocs de pierre, éclats de roche, poussière | ☐ |
| `frappe-atlas.png` | Frappe Atlas | Combat · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `frenesie.png` | Frénésie | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `frustration.png` | Frustration | Normal · Attaque | Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `furie.png` | Furie | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `garde-aura.png` | Garde Aura | Combat · Technique | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `garde-florale.png` | Garde Florale | Fée · Technique | Vipélierre | **Vipélierre** lance la capacité | lumière rose et blanche, étoiles, paillettes | ☐ |
| `garde-large.png` | Garde Large | Normal · Technique | Riolu, Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `giga-impact.png` | Giga Impact | Normal · Attaque | Vipélierre, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `giga-sangsue.png` | Giga-Sangsue | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `gliss-herbe.png` | Gliss'Herbe | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `gonflette.png` | Gonflette | Combat · Technique | Riolu, Mew | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `grand-courroux.png` | Grand Courroux | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `grele.png` | Grêle | Glace · Technique | Neutre | Aucun (capacité seule) | cristaux de glace, givre, brume froide bleutée | ☐ |
| `gribouille.png` | Gribouille | Normal · Technique | Quelorior | **Quelorior** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `griffe.png` | Griffe | Normal · Attaque | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `griffe-acier.png` | Griffe Acier | Acier · Attaque | Riolu | **Riolu** lance la capacité | métal brillant, reflets argentés, étincelles | ☐ |
| `griffe-ombre.png` | Griffe Ombre | Spectre · Attaque | Riolu, Kangourex | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `grimace.png` | Grimace | Normal · Technique | Riolu, Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `grincement.png` | Grincement | Normal · Technique | Riolu | **Riolu** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `grondement.png` | Grondement | Normal · Technique | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `groz-yeux.png` | Groz'Yeux | Normal · Technique | Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `gyroballe.png` | Gyroballe | Acier · Attaque | Neutre | Aucun (capacité seule) | métal brillant, reflets argentés, étincelles | ☐ |
| `hate.png` | Hâte | Psy · Technique | Riolu, Caninos, Mew | Aucun (capacité seule) | ondes psychiques roses et violettes, distorsion | ☐ |
| `hurle-temps.png` | Hurle-Temps | Dragon · Attaque | Neutre | Aucun (capacité seule) | énergie draconique bleue et violette, écailles | ☐ |
| `hurlement.png` | Hurlement | Normal · Technique | Riolu, Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `hydrocanon.png` | Hydrocanon | Eau · Attaque | Neutre | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `hydroqueue.png` | Hydroqueue | Eau · Attaque | Vipélierre | **Vipélierre** lance la capacité | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `implore.png` | Implore | Normal · Attaque | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `indignition.png` | Indignition | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `interversion.png` | Interversion | Psy · Technique | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `jet-pierres.png` | Jet-Pierres | Roche · Attaque | Neutre | Aucun (capacité seule) | blocs de pierre, éclats de roche, poussière | ☐ |
| `lame-d-air.png` | Lame d'Air | Vol · Attaque | Neutre | Aucun (capacité seule) | bourrasques, plumes, courants d’air | ☐ |
| `lame-de-roc.png` | Lame de Roc | Roche · Attaque | Riolu, Caninos, Mew | Aucun (capacité seule) | blocs de pierre, éclats de roche, poussière | ☐ |
| `lame-feuille.png` | Lame Feuille | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `lance-flammes.png` | Lance-Flammes | Feu · Attaque | Kangourex, Caninos, Mew | Aucun (capacité seule) | flammes orange et rouges, braises, chaleur | ☐ |
| `lance-soleil.png` | Lance-Soleil | Plante · Attaque | Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | lianes, feuilles, graines et lumière verte | ☐ |
| `larcin.png` | Larcin | Ténèbres · Attaque | Kangourex, Caninos | Aucun (capacité seule) | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `laser-glace.png` | Laser Glace | Glace · Attaque | Neutre | Aucun (capacité seule) | cristaux de glace, givre, brume froide bleutée | ☐ |
| `lechouille.png` | Léchouille | Spectre · Attaque | Neutre | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `lechouille-des-ames.png` | Léchouille des Âmes | Spectre · Attaque | Caninos | **Caninos** lance la capacité | ombres violettes, flammes fantomatiques | ☐ |
| `ligotage.png` | Ligotage | Normal · Attaque | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `lire-esprit.png` | Lire-Esprit | Normal · Talent | Riolu | **Riolu** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `luminocanon.png` | Luminocanon | Acier · Attaque | Riolu, Mew | **Riolu** lance la capacité | métal brillant, reflets argentés, étincelles | ☐ |
| `mach-punch.png` | Mach Punch | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `machination.png` | Machination | Ténèbres · Technique | Riolu, Mew | **Riolu** lance la capacité | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `machouille.png` | Mâchouille | Ténèbres · Attaque | Riolu, Kangourex, Caninos | Aucun (capacité seule) | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `mania.png` | Mania | Normal · Attaque | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `marto-poing.png` | Marto-Poing | Combat · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `mega-evolution.png` | Méga-Évolution | Normal · Talent | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mega-sangsue.png` | Méga-Sangsue | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `megaphone.png` | Mégaphone | Normal · Attaque | Caninos | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `megapoing.png` | Mégapoing | Normal · Attaque | Riolu | **Riolu** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `metalaser.png` | Métalaser | Acier · Attaque | Riolu | **Riolu** lance la capacité | métal brillant, reflets argentés, étincelles | ☐ |
| `meteores.png` | Météores | Normal · Attaque | Riolu, Vipélierre, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `metronome.png` | Métronome | Normal · Technique | Riolu, Mew, Neutre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mimi-queue.png` | Mimi-Queue | Normal · Technique | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mimique.png` | Mimique | Normal · Technique | Mew | **Mew** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `mitra-poing.png` | Mitra-Poing | Combat · Attaque | Riolu, Kangourex | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `moi-d-abord.png` | Moi d'Abord | Normal · Attaque | Mew | **Mew** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `morphing.png` | Morphing | Normal · Technique | Mew | **Mew** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `morsure.png` | Morsure | Ténèbres · Attaque | Caninos, Riolu, Kangourex | Aucun (capacité seule) | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `mur-de-fer.png` | Mur de Fer | Acier · Technique | Riolu, Kangourex, Mew | Aucun (capacité seule) | métal brillant, reflets argentés, étincelles | ☐ |
| `mur-lumiere.png` | Mur Lumière | Psy · Talent | Vipélierre, Mew | **Vipélierre** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `nitrocharge.png` | Nitrocharge | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `n-ud-herbe.png` | Nœud Herbe | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `ombre-portee.png` | Ombre Portée | Spectre · Attaque | Neutre | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `onde-folie.png` | Onde Folie | Spectre · Technique | Neutre | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `onde-vide.png` | Onde Vide | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `ouragan.png` | Ouragan | Dragon · Attaque | Vipélierre | **Vipélierre** lance la capacité | énergie draconique bleue et violette, écailles | ☐ |
| `paresse.png` | Paresse | Normal · Technique | Neutre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `peau-dure.png` | Peau Dure | Plante · Talent | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `permuc-ur.png` | Permucœur | Psy · Technique | Vipélierre | **Vipélierre** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `photocopie.png` | Photocopie | Normal · Technique | Riolu | **Riolu** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `phytomixeur.png` | Phytomixeur | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `pico-defense.png` | Pico-Défense | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `pied-bruleur.png` | Pied Brûleur | Feu · Attaque | Riolu | **Riolu** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `pied-voltige.png` | Pied Voltige | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `pietisol.png` | Piétisol | Sol · Attaque | Riolu, Kangourex, Caninos, Mew | Aucun (capacité seule) | terre, sable, roches qui jaillissent du sol | ☐ |
| `pisto-poing.png` | Pisto-Poing | Acier · Attaque | Riolu | **Riolu** lance la capacité | métal brillant, reflets argentés, étincelles | ☐ |
| `pistolet-a-o.png` | Pistolet à O | Eau · Attaque | Neutre | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `plaie-croix.png` | Plaie-Croix | Insecte · Attaque | Neutre | Aucun (capacité seule) | élytres, fils de soie, nuée verte | ☐ |
| `plaquage.png` | Plaquage | Normal · Attaque | Riolu, Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `plenitude.png` | Plénitude | Psy · Talent | Riolu, Vipélierre, Mew | Aucun (capacité seule) | ondes psychiques roses et violettes, distorsion | ☐ |
| `poing-boost.png` | Poing Boost | Combat · Attaque | Riolu, Kangourex | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `poing-comete.png` | Poing Comète | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `poing-de-feu.png` | Poing de Feu | Feu · Attaque | Kangourex, Mew | **Kangourex** (avec son Bébé dans la poche) lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `poing-eclair.png` | Poing Éclair | Électrik · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `poing-glace.png` | Poing Glace | Glace · Attaque | Riolu, Mew | **Riolu** lance la capacité | cristaux de glace, givre, brume froide bleutée | ☐ |
| `poing-meteore.png` | Poing Météore | Acier · Attaque | Riolu | **Riolu** lance la capacité | métal brillant, reflets argentés, étincelles | ☐ |
| `poing-karate.png` | Poing-Karaté | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `poisse.png` | Poisse | Ténèbres · Statut | Neutre | Aucun (capacité seule) | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `possessif.png` | Possessif | Psy · Technique | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `poudreuse.png` | Poudreuse | Glace · Attaque | Neutre | Aucun (capacité seule) | cristaux de glace, givre, brume froide bleutée | ☐ |
| `poursuite.png` | Poursuite | Ténèbres · Attaque | Vipélierre | **Vipélierre** lance la capacité | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `pouvoir-antique.png` | Pouvoir Antique | Roche · Attaque | Neutre | Aucun (capacité seule) | blocs de pierre, éclats de roche, poussière | ☐ |
| `pouvoir-lunaire.png` | Pouvoir Lunaire | Fée · Attaque | Neutre | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `prescience.png` | Prescience | Psy · Attaque | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `prevention.png` | Prévention | Combat · Technique | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `projection.png` | Projection | Combat · Attaque | Riolu, Kangourex | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `protection.png` | Protection | Normal · Technique | Riolu, Vipélierre, Kangourex, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `provoc.png` | Provoc | Ténèbres · Technique | Vipélierre, Mew | **Vipélierre** lance la capacité | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `psycho-croc.png` | Psycho-Croc | Psy · Attaque | Caninos | **Caninos** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `psyko.png` | Psyko | Psy · Attaque | Riolu, Mew | **Riolu** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `psykoud-boul.png` | Psykoud'Boul | Psy · Attaque | Riolu, Mew | **Riolu** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `puissance.png` | Puissance | Normal · Technique | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `puissance-cachee.png` | Puissance Cachée | Normal · Attaque | Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `queue-de-fer.png` | Queue de Fer | Acier · Attaque | Riolu, Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | métal brillant, reflets argentés, étincelles | ☐ |
| `rafale-ecailles.png` | Rafale Écailles | Dragon · Attaque | Vipélierre | **Vipélierre** lance la capacité | énergie draconique bleue et violette, écailles | ☐ |
| `rancune.png` | Rancune | Spectre · Talent | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | ombres violettes, flammes fantomatiques | ☐ |
| `rapace.png` | Rapace | Vol · Attaque | Neutre | Aucun (capacité seule) | bourrasques, plumes, courants d’air | ☐ |
| `rayon-charge.png` | Rayon Chargé | Électrik · Attaque | Mew | **Mew** lance la capacité | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `reflet.png` | Reflet | Normal · Technique | Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `regard-medusant.png` | Regard Médusant | Normal · Technique | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `regard-noir.png` | Regard Noir | Normal · Technique | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `relais.png` | Relais | Normal · Technique | Mew | **Mew** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `rempart-brulant.png` | Rempart Brûlant | Feu · Technique | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `rengorgement.png` | Rengorgement | Normal · Technique | Riolu, Kangourex | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `repos.png` | Repos | Psy · Technique | Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | ondes psychiques roses et violettes, distorsion | ☐ |
| `represailles.png` | Représailles | Ténèbres · Attaque | Riolu | **Riolu** lance la capacité | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `retour.png` | Retour | Normal · Attaque | Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `reve-lourd.png` | Rêve Lourd | Fée · Statut | Neutre | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `riposte.png` | Riposte | Combat · Technique | Riolu, Kangourex | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `ronflement.png` | Ronflement | Normal · Attaque | Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `roue-de-feu.png` | Roue de Feu | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `rugissement.png` | Rugissement | Normal · Technique | Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `rune-protect.png` | Rune Protect | Normal · Technique | Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ruse.png` | Ruse | Normal · Attaque | Riolu | **Riolu** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `sable-ardent.png` | Sable Ardent | Sol · Attaque | Caninos | **Caninos** lance la capacité | terre, sable, roches qui jaillissent du sol | ☐ |
| `sabotage.png` | Sabotage | Ténèbres · Attaque | Neutre | Aucun (capacité seule) | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `sacrifice.png` | Sacrifice | Combat · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `second-souffle.png` | Second Souffle | Normal · Technique | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `seduction.png` | Séduction | Normal · Technique | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `seisme.png` | Séisme | Sol · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | terre, sable, roches qui jaillissent du sol | ☐ |
| `siffl-herbe.png` | Siffl'Herbe | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `soin.png` | Soin | Normal · Technique | Neutre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `soucigraine.png` | Soucigraine | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `souplesse.png` | Souplesse | Normal · Attaque | Vipélierre | **Vipélierre** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `souvenir.png` | Souvenir | Spectre · Technique | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | ombres violettes, flammes fantomatiques | ☐ |
| `strido-son.png` | Strido-Son | Acier · Technique | Riolu | **Riolu** lance la capacité | métal brillant, reflets argentés, étincelles | ☐ |
| `suc-digestif.png` | Suc Digestif | Poison · Technique | Vipélierre | **Vipélierre** lance la capacité | liquide et fumée violets, bulles toxiques | ☐ |
| `surchauffe.png` | Surchauffe | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `surf.png` | Surf | Eau · Attaque | Neutre | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `synthese.png` | Synthèse | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `tacle-feu.png` | Tacle Feu | Feu · Attaque | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `telekinesie.png` | Télékinésie | Psy · Talent | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `telluriforce.png` | Telluriforce | Sol · Attaque | Neutre | Aucun (capacité seule) | terre, sable, roches qui jaillissent du sol | ☐ |
| `tempete-de-sable.png` | Tempête de Sable | Roche · Technique | Neutre | Aucun (capacité seule) | blocs de pierre, éclats de roche, poussière | ☐ |
| `tempete-florale.png` | Tempête Florale | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `tempete-verte.png` | Tempête Verte | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `tenacite.png` | Ténacité | Normal · Technique | Riolu, Vipélierre, Kangourex, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `tera-explosion.png` | Téra Explosion | Normal · Attaque | Caninos, Mew | **Caninos** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `tete-de-fer.png` | Tête de Fer | Acier · Attaque | Neutre | Aucun (capacité seule) | métal brillant, reflets argentés, étincelles | ☐ |
| `tomberoche.png` | Tomberoche | Roche · Attaque | Riolu, Kangourex | Aucun (capacité seule) | blocs de pierre, éclats de roche, poussière | ☐ |
| `tonnerre.png` | Tonnerre | Électrik · Attaque | Neutre | Aucun (capacité seule) | éclairs jaunes, étincelles, arcs électriques | ☐ |
| `torgnoles.png` | Torgnoles | Normal · Attaque | Neutre | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `tornade.png` | Tornade | Vol · Attaque | Neutre | Aucun (capacité seule) | bourrasques, plumes, courants d’air | ☐ |
| `tour-de-magie.png` | Tour de Magie | Psy · Talent | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `tout-ou-rien.png` | Tout ou Rien | Combat · Attaque | Riolu | **Riolu** lance la capacité | poings et coups, aura bleue, impact martial | ☐ |
| `toxik.png` | Toxik | Poison · Technique | Neutre | Aucun (capacité seule) | liquide et fumée violets, bulles toxiques | ☐ |
| `tranche-nuit.png` | Tranche-Nuit | Ténèbres · Attaque | Neutre | Aucun (capacité seule) | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `trepignement.png` | Trépignement | Sol · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | terre, sable, roches qui jaillissent du sol | ☐ |
| `tunnel.png` | Tunnel | Sol · Attaque | Kangourex, Caninos, Mew | Aucun (capacité seule) | terre, sable, roches qui jaillissent du sol | ☐ |
| `turbo.png` | Turbo | Feu · Talent | Caninos | **Caninos** lance la capacité | flammes orange et rouges, braises, chaleur | ☐ |
| `ultimapoing.png` | Ultimapoing | Normal · Attaque | Kangourex, Mew | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ultimawashi.png` | Ultimawashi | Normal · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `ultralaser.png` | Ultralaser | Normal · Attaque | Riolu, Vipélierre, Caninos, Mew | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `uppercut.png` | Uppercut | Normal · Attaque | Kangourex | **Kangourex** (avec son Bébé dans la poche) lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vampi-poing.png` | Vampi-Poing | Combat · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | poings et coups, aura bleue, impact martial | ☐ |
| `vampigraine.png` | Vampigraine | Plante · Technique | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `vampirisme.png` | Vampirisme | Insecte · Attaque | Neutre | Aucun (capacité seule) | élytres, fils de soie, nuée verte | ☐ |
| `vantardise.png` | Vantardise | Normal · Technique | Vipélierre, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vaste-pouvoir.png` | Vaste Pouvoir | Psy · Attaque | Mew | **Mew** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `vege-attaque.png` | Végé-Attaque | Plante · Attaque | Vipélierre | **Vipélierre** lance la capacité | lianes, feuilles, graines et lumière verte | ☐ |
| `vengeance.png` | Vengeance | Normal · Attaque | Vipélierre, Kangourex, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vent-feerique.png` | Vent Féérique | Fée · Attaque | Neutre | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `vent-glace.png` | Vent Glace | Glace · Attaque | Neutre | Aucun (capacité seule) | cristaux de glace, givre, brume froide bleutée | ☐ |
| `vibra-soin.png` | Vibra Soin | Psy · Technique | Riolu | **Riolu** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `vibraqua.png` | Vibraqua | Eau · Attaque | Riolu, Kangourex, Mew | Aucun (capacité seule) | jets et vagues d’eau bleue, éclaboussures | ☐ |
| `vibrobscur.png` | Vibrobscur | Ténèbres · Attaque | Riolu, Mew | **Riolu** lance la capacité | ténèbres, griffes d’ombre, lueurs rouges | ☐ |
| `vitesse-extreme.png` | Vitesse Extrême | Normal · Attaque | Riolu, Caninos | Aucun (capacité seule) | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `vive-attaque.png` | Vive-Attaque | Normal · Attaque | Riolu | **Riolu** lance la capacité | impact puissant, traînées de vitesse, onde de choc blanche | ☐ |
| `v-u-brise.png` | Vœu Brisé | Spectre · Statut | Neutre | Aucun (capacité seule) | ombres violettes, flammes fantomatiques | ☐ |
| `voile-miroir.png` | Voile Miroir | Psy · Attaque | Vipélierre | **Vipélierre** lance la capacité | ondes psychiques roses et violettes, distorsion | ☐ |
| `voix-enjoleuse.png` | Voix Enjôleuse | Fée · Attaque | Neutre | Aucun (capacité seule) | lumière rose et blanche, étoiles, paillettes | ☐ |
| `vol.png` | Vol | Vol · Attaque | Mew | **Mew** lance la capacité | bourrasques, plumes, courants d’air | ☐ |
| `zenith.png` | Zénith | Feu · Talent | Vipélierre, Caninos | Aucun (capacité seule) | flammes orange et rouges, braises, chaleur | ☐ |
