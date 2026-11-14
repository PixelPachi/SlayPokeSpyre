# Carte du code

| Où | Quoi |
| --- | --- |
| `src/core/types.ts` | Les 18 types, la table des faiblesses (×1,5 / ×0,5 / ×0,25) et le bonus de même type (×1,25) |
| `src/core/model.ts` | Modèle de données : cartes, effets, statuts, personnages, ennemis |
| `src/core/combat.ts` | Moteur de combat sans affichage : tours, pioche, PA, Protection, statuts, Aura, IA ennemie |
| `src/core/rng.ts` | Hasard avec graine |
| `src/data/cards.ts` | **Toutes les cartes** (ajouter une carte = ajouter une entrée) |
| `src/data/characters.ts` | Les 5 personnages : PV, talent, deck de départ |
| `src/data/enemies.ts` | **Tous les ennemis** et les rencontres par zone |
| `src/ui/select-view.ts` | Écran de sélection du personnage |
| `src/ui/combat-view.ts` | Écran de combat : rendu, glisser-déposer, chiffres flottants |
| `src/ui/labels.ts` | Textes des statuts, couleurs des types, texte des cartes |
| `src/ui/style.css` | Tout le style |
| `src/main.ts` | Enchaînement des écrans |
| `public/sprites/` | Sprites PokeAPI fixes, téléchargés par `npm run sprites` |
| `public/illustrations/` | Illustrations des écrans de sélection |
| `tests/` | Tests des règles (Vitest) |

## Règles déjà en place (jalon 1)

- Tour : Protection remise à 0, 3 PA, statuts de début de tour, pioche de 5 ; défausse de la main en fin de tour ; la défausse est mélangée quand la pioche est vide.
- Dégâts : base + Attaque → ×1,25 si même type → table des types → Paralysie / Brûlure de l'attaquant (×0,75) → Peur du défenseur (×1,5) → arrondi à l'inférieur. Ça vaut aussi pour les ennemis.
- Aura (Riolu) : chaque PV perdu donne 1 Aura (pas les dégâts bloqués) ; la prochaine attaque ajoute l'Aura au premier coup puis la remet à 0. Justicier : 3 Aura au début du combat.
- Ennemis : action tirée au hasard selon les poids, jamais 3 fois la même de suite ; intention affichée à l'avance ; 1 chance sur 50 d'être chromatique.
- Déjà prévus dans le moteur : Contestation (Vipélierre), Intimidation (Caninos), Vampigraine, mots-clés Épuisée / Conservée / Éphémère / Innée / Injouable.

## Ajouter un sprite

1. Ajouter le numéro Pokédex dans `scripts/sprites.json` (front, back, shiny, artwork) ou le nom d'objet (items).
2. `npm run sprites`.
3. Uniquement des PNG fixes : jamais les dossiers `animated` ou `showdown`.
