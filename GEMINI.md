# Images à générer avec Gemini

Liste des images du jeu à créer avec Gemini. Quand une image est prête, envoie-la dans la conversation (ou dépose-la dans le dossier indiqué) : le jeu l'utilise automatiquement, sans autre changement. Tant qu'elle n'existe pas, un décor de secours aux couleurs de la zone s'affiche.

## Règles communes à tous les fonds de combat

À coller au début de chaque prompt :

> Illustration de fond pour un jeu vidéo, format paysage 16:9 (1920 × 1080). Style illustration anime peinte, couleurs vives et douces, lumière atmosphérique, comme une illustration officielle Pokémon. Aucun personnage, aucun Pokémon, aucun texte, aucun logo. Composition : un sol dégagé qui occupe le tiers inférieur, avec une petite clairière plate à gauche et une autre à droite (les combattants y seront posés), le centre de l'image reste dégagé. Le bas de l'image est un peu plus sombre (des cartes s'afficheront par-dessus). Détail récurrent : ce lieu a été arraché à sa région par une faille temporelle et flotte dans la Tour du Temps ; on devine quelques engrenages dorés lumineux et des éclats de lumière bleue dans le ciel ou au loin.

Puis ajouter la description de la zone ci-dessous. Chaque forêt a sa propre saison pour que les décors ne se ressemblent pas ; le jeu ajoute aussi des particules animées assorties (pollen, pétales, feuilles, neige).

## Acte 1 — la base de la tour

| Fichier | Zone (région) | Description à ajouter au prompt | Fait |
| --- | --- | --- | --- |
| `public/backgrounds/foret-de-jade.jpg` | Forêt de Jade (Kanto) | **Été lumineux.** Une forêt dense aux grands arbres d'un vert éclatant, rayons de soleil entre les feuilles, pollen doré qui flotte dans l'air, hautes herbes, petit sentier de terre. | ☑ |
| `public/backgrounds/bois-aux-chenes.jpg` | Bois aux Chênes (Johto) | **Automne au crépuscule.** Un bois de vieux chênes aux troncs épais, feuilles dorées et brunes qui tombent, tapis de feuilles au sol, brume légère, lumière orangée et basse de fin de journée, petit autel de bois au loin. | ☑ |
| `public/backgrounds/bois-clematis.jpg` | Bois Clématis (Hoenn) | **Printemps en fleurs.** Un bois clair aux arbres couverts de fleurs roses, pétales qui volent dans l'air, grands champignons, herbe tendre, lumière douce du matin. | ☐ |
| `public/backgrounds/foret-de-vestigion.jpg` | Forêt de Vestigion (Sinnoh) | **Hiver enneigé.** Une forêt ancienne et immense sous la neige, branches chargées de neige, flocons qui tombent, sol blanc, lumière froide et bleutée, vieux manoir à peine visible au loin. | ☑ |
| `public/backgrounds/foret-d-empoigne.jpg` | Forêt d'Empoigne (Unys) | **Automne flamboyant.** Une forêt aux feuillages rouges et orange vifs traversée par une rivière, feuilles rouges qui tombent et flottent sur l'eau, rochers moussus, petit pont de bois, lumière chaude de l'après-midi. | ☑ |

## Acte 2 — le cœur de la tour

Ambiances (le jeu ajoute les particules assorties) : Mont Sélénite **nuit de pleine lune** (cristaux), Puits Ramoloss **saison des pluies** (gouttes), Mont Chimnée **été caniculaire** (cendres), Mont Couronné **brume d'altitude** (poussière), Grotte Électrolithe **nuit d'orage** (étincelles).

| Fichier | Zone (région) | Description à ajouter au prompt | Fait |
| --- | --- | --- | --- |
| `public/backgrounds/mont-selenite.jpg` | Mont Sélénite (Kanto) | L'intérieur d'une grotte aux parois rocheuses, petits cristaux lunaires qui brillent, fragments de météorite, lumière bleue et violette. | ☑ |
| `public/backgrounds/puits-ramoloss.jpg` | Puits Ramoloss (Johto) | Le fond d'un vieux puits humide en pierre, flaques d'eau qui reflètent la lumière, échelle de bois, ambiance calme et fraîche. | ☑ |
| `public/backgrounds/mont-chimnee.jpg` | Mont Chimnée (Hoenn) | Le sommet d'un volcan, sol de roche sombre, coulées de lave lumineuses, cendres qui tombent comme de la neige, ciel orangé. | ☑ |
| `public/backgrounds/mont-couronne.jpg` | Mont Couronné (Sinnoh) | Une grande caverne de montagne aux colonnes de pierre naturelles, lumière froide qui tombe d'une ouverture, roche grise et bleutée. | ☑ |
| `public/backgrounds/grotte-electrolithe.jpg` | Grotte Électrolithe (Unys) | Une grotte remplie de pierres électriques flottantes qui crépitent de bleu, petits arcs électriques, sol rocheux sombre. | ☑ |

## Acte 3 — les hauteurs

Ambiances (le jeu ajoute les particules assorties) : Route Victoire **nuit aux flambeaux** (braises), Mont Argenté **hiver éternel** (blizzard), Pilier Céleste **aube au-dessus des nuages** (vent), Mont Abrupt **crépuscule de magma** (cendres), Tour Dragospire **tempête de neige et d'éclairs** (neige et éclairs).

| Fichier | Zone (région) | Description à ajouter au prompt | Fait |
| --- | --- | --- | --- |
| `public/backgrounds/route-victoire.jpg` | Route Victoire (Kanto) | Une immense caverne de la Ligue, rochers massifs, torches, passages escarpés, ambiance épique avant le sommet. | ☑ |
| `public/backgrounds/mont-argente.jpg` | Mont Argenté (Johto) | Un sommet enneigé dans le blizzard, roche argentée, ciel gris et blanc, sensation de froid et de solitude. | ☑ |
| `public/backgrounds/pilier-celeste.jpg` | Pilier Céleste (Hoenn) | Le toit d'une tour antique au-dessus des nuages, dalles de pierre fissurées, ciel immense, dragon céleste à peine deviné dans les nuages (silhouette lointaine, pas de Pokémon net). | ☑ |
| `public/backgrounds/mont-abrupt.jpg` | Mont Abrupt (Sinnoh) | Une montagne volcanique aux falaises rouges, magma visible dans les fissures, fumée, ciel sombre et rougeoyant. | ☑ |
| `public/backgrounds/tour-dragospire.jpg` | Tour Dragospire (Unys) | Le sommet d'une tour antique en ruines dans la neige, piliers brisés, ciel d'orage avec éclairs et flammes au loin. | ☑ |

## Sommet

| Fichier | Zone | Description à ajouter au prompt | Fait |
| --- | --- | --- | --- |
| `public/backgrounds/sommet-tour-du-temps.jpg` | Sommet de la Tour du Temps | Le sommet de la Tour du Temps de Pokémon Donjon Mystère : plateforme de pierre antique flottant dans un ciel déchiré, énormes engrenages dorés figés, fissures de lumière bleue et violette, temps qui se désagrège. Ambiance de combat final. | ☑ |

## Cartes

Les cadres de cartes (un par personnage + neutre) et les illustrations des capacités sont listés dans **[GEMINI-CARTES.md](GEMINI-CARTES.md)**.

## Autres images

| Fichier | Image | Fait |
| --- | --- | --- |
| `public/illustrations/mew.png` | Illustration de l'écran de sélection de Mew, même style que Riolu, Vipélierre, Kangourex et Caninos : Mew à droite, fond rose et violet, aura psychique. | ☐ |
