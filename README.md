# SlayPokeSpyre

Fan-game Pokémon rogue-like deckbuilder qui reprend les mécaniques de Slay the Spire. On incarne un Pokémon qui escalade la Tour du Temps pour apaiser Dialga Primal.

Projet de fan gratuit et non commercial. Pokémon appartient à Nintendo, Game Freak et The Pokémon Company. Les sprites viennent du dépôt [PokeAPI/sprites](https://github.com/PokeAPI/sprites).

## Jouer

Le jeu est publié sur GitHub Pages à chaque mise à jour de la branche `main`.

Contrôles (PC) :

- glisser une carte sur un ennemi, ou cliquer la carte puis l'ennemi ;
- touches 1 à 0 pour choisir une carte, E pour finir le tour, Échap ou clic droit pour annuler ;
- survoler un statut, une intention ou un compteur affiche son explication.

Ajouter `?seed=MAGRAINE` à l'adresse rejoue exactement la même suite de combats.

## Développer

```bash
npm install
npm run dev      # serveur local
npm test         # tests des règles
npm run build    # version publiable dans dist/
npm run sprites  # télécharge les sprites listés dans scripts/sprites.json
```

La carte du code est dans [DEV.md](DEV.md).
