# Carte du code

| Où | Quoi |
| --- | --- |
| `src/core/types.ts` | Les 18 types, la table des faiblesses (×1,5 / ×0,5 / ×0,25) et le bonus de même type (×1,25) |
| `src/core/model.ts` | Modèle de données : cartes, effets, statuts, personnages, ennemis |
| `src/core/combat.ts` | Moteur de combat sans affichage : tours, pioche, PA, Protection, statuts, Aura, IA ennemie |
| `src/core/rng.ts` | Hasard avec graine |
| `src/core/run.ts` | État d'une run (PV, ₽, deck) et **génération de la carte** à embranchements (15 étages, 7 colonnes) |
| `src/data/cards.ts` | Cartes communes et des autres starters (ajouter une carte = ajouter une entrée) |
| `src/data/cards-riolu.ts` | **Les 77 cartes de Riolu** (une par capacité que Riolu/Lucario peut apprendre) |
| `src/data/unlocks.ts` | **EXP et déblocage** : niveau requis pour chaque carte, EXP gagnée en fin de run |
| `src/core/save.ts` | Sauvegarde de la progression dans le navigateur |
| `src/data/characters.ts` | Les 5 personnages : PV, talent, deck de départ |
| `src/data/enemies.ts` | **Tous les ennemis** et les rencontres par zone (combats, élites, gardien) |
| `src/data/events.ts` | **Événements mystères** (nœuds « ? ») |
| `src/ui/map-view.ts` | Écran de la carte de l'acte |
| `src/ui/node-views.ts` | Récompenses, Centre Pokémon, Poké Mart, événement, trésor, fin de run |
| `src/ui/card.ts`, `src/ui/run-ui.ts` | Rendu d'une carte, barre du haut, fenêtre du deck |
| `src/ui/select-view.ts` | Écran de sélection du personnage |
| `src/ui/combat-view.ts` | Écran de combat : rendu, glisser-déposer, chiffres flottants |
| `src/ui/labels.ts` | Textes des statuts, couleurs des types, texte des cartes |
| `src/ui/style.css` | Tout le style |
| `src/main.ts` | Enchaînement des écrans |
| `public/sprites/` | Sprites PokeAPI fixes, téléchargés par `npm run sprites` (le Pokémon du joueur utilise son sprite de face, retourné vers les ennemis) |
| `public/illustrations/` | Illustrations des écrans de sélection |
| `tests/` | Tests des règles (Vitest) |

## Règles déjà en place

- Tour : Protection remise à 0, 3 PA, statuts de début de tour, pioche de 5 ; défausse de la main en fin de tour ; la défausse est mélangée quand la pioche est vide.
- Dégâts : base + Attaque → ×1,25 si même type → table des types → Paralysie / Brûlure de l'attaquant (×0,75) → Peur du défenseur (×1,5) → arrondi à l'inférieur. Ça vaut aussi pour les ennemis.
- Aura (Riolu) : chaque PV perdu donne 1 Aura (pas les dégâts bloqués) ; la prochaine attaque ajoute l'Aura au premier coup puis la remet à 0. Justicier : 3 Aura au début du combat.
- Ennemis : action tirée au hasard selon les poids, jamais 3 fois la même de suite ; intention affichée à l'avance ; 1 chance sur 50 d'être chromatique.
- Carte de l'acte : 6 chemins qui ne se croisent pas ; étage 1 = combats, étage 9 = trésor, étage 15 = Centre Pokémon ; pas d'élite ni de Centre avant l'étage 6 ; jamais deux Centres, Poké Mart ou élites à la suite ; le gardien au-dessus.
- Récompenses : ₽ (combat 10-20, élite 25-35, gardien 95-105, doublés si un ennemi était chromatique) et 1 carte parmi 3 (60 % commune, 37 % peu commune, 3 % rare qui monte à chaque récompense sans rare).
- Centre Pokémon : soigner 30 % des PV max ou améliorer une carte. Poké Mart : 5 cartes (une à -50 %), oublier une carte (75 ₽, +25 à chaque fois). Trésor : en attendant les objets tenus, des ₽ et une carte.
- Les cartes se jouent uniquement en les tirant : flèche de ciblage vers l'ennemi, ou glisser vers le haut pour les cartes sans cible.
- Talents (pouvoirs) : effets pour tout le combat (Plénitude : +Aura par tour ; Lire-Esprit : cartes à 0 PA si le tour commence avec 30 Aura).
- EXP de fin de run : 10 par étage, 25 par Pokémon dominant, 60 par gardien ; 10 niveaux par Pokémon, chaque niveau débloque des cartes dans les récompenses.
- Déjà prévus dans le moteur : Contestation (Vipélierre), Intimidation (Caninos), Vampigraine, mots-clés Épuisée / Conservée / Éphémère / Innée / Injouable.

## Ajouter un sprite

1. Ajouter le numéro Pokédex dans `scripts/sprites.json` (front, back, shiny, artwork) ou le nom d'objet (items).
2. `npm run sprites`.
3. Uniquement des PNG fixes : jamais les dossiers `animated` ou `showdown`.
