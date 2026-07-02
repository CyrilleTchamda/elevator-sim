# Simulateur d'Ascenseur

Ce projet est un simulateur d'ascenseur basé sur l'algorithme SCAN (ou "algorithme de l'ascenseur"), conçu dans le cadre d'un test technique. L'application est développée en React et présente une interface interactive permettant de tester et suivre le comportement de la cabine en temps réel.

## Installation et Lancement

Pour installer et lancer l'application en local :

1. Naviguer dans le dossier du simulateur :
   ```bash
   cd elevator-sim
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
   L'application sera accessible par défaut à l'adresse http://localhost:5173.

4. Pour générer les fichiers de production :
   ```bash
   npm run build
   ```

## Choix Techniques

* **Séparation des responsabilités** : La logique métier pure (`elevatorLogic.js`) est isolée de la couche de présentation React. Cela rend l'algorithme d'ascenseur indépendant de l'interface graphique et facilement testable de façon unitaire.
* **Hook Personnalisé** : Le hook `useElevator.js` orchestre la simulation temporelle (boucle de tick) et synchronise l'état avec l'UI de React.
* **Algorithme SCAN (Elevator Algorithm)** : Implémentation du comportement standard de l'ascenseur qui continue à desservir toutes les demandes dans sa direction actuelle avant de changer de sens.
* **Design sobre et cohérent** : Intégration d'une feuille de style personnalisée (couleurs sombres, orange et bleu) reposant sur Bootstrap 5 pour la réactivité de la mise en page (grille et alignements) sans fioritures excessives.

## Modèle de Données et Logique Métier

La logique de l'ascenseur repose sur un état modélisé comme un objet de données immuable et des fonctions de transition d'état pures.

### Variables d'État (State)

* `currentFloor` (nombre de 0 à 9) : Représente l'étage actuel où se situe la cabine.
* `direction` (chaîne : `"up"` | `"down"` | `"idle"`) : Sens de déplacement actuel ou état d'arrêt.
* `doorState` (chaîne : `"open"` | `"closed"`) : Indique si les portes de la cabine sont ouvertes ou fermées.
* `isMoving` (booléen) : Indique si l'ascenseur est en train de se déplacer entre les étages.
* `queueUp` (tableau de nombres) : Liste triée par ordre croissant des étages demandés situés au-dessus de la cabine.
* `queueDown` (tableau de nombres) : Liste triée par ordre décroissant des étages demandés situés en dessous de la cabine.
* `history` (tableau de nombres) : Historique ordonné de tous les étages visités par la cabine depuis le début de la simulation.

### Fonctions Clés (API Métier)

* `createInitialElevatorState()` : Initialise l'ascenseur au RDC (étage 0), à l'arrêt (`"idle"`), portes fermées et files d'attente vides.
* `addRequest(state, floor)` : Analyse l'étage demandé et l'ajoute dans la file d'attente correspondante (`queueUp` ou `queueDown`). Si l'étage cible correspond à l'étage actuel de la cabine à l'arrêt, déclenche l'ouverture immédiate des portes.
* `nextDirection(state)` : Détermine la prochaine direction à prendre selon l'algorithme SCAN. Conserve la direction en cours s'il y a des demandes restantes sur le trajet, bascule vers la file opposée s'il y en a, ou retourne `"idle"`.
* `openDoors(state)` : Met à jour l'état pour ouvrir les portes et stopper tout mouvement.
* `closeDoors(state)` : Ferme les portes, détermine le sens du trajet avec `nextDirection(state)` et active le mouvement `isMoving` s'il reste des appels en attente.
* `tick(state)` : Applique le pas de temps de la simulation. Gère le déplacement physique de la cabine d'un étage par tick, détecte l'arrivée sur un étage demandé, l'arrêt, l'ouverture des portes et le retrait de la requête de la file d'attente active.


## Architecture du Projet

```
elevator-sim/
├── index.html                  # Point d'entrée HTML avec inclusion de Bootstrap 5 CDN
├── src/
│   ├── main.jsx                # Initialisation React et import du style global
│   ├── App.jsx                 # Layout principal du tableau de bord (3 colonnes)
│   ├── assets/
│   │   └── styles/
│   │       └── style.css       # Charte graphique personnalisée
│   ├── components/
│   │   ├── Building.jsx        # Vue de l'immeuble (étages, cabine, appels externes)
│   │   ├── ElevatorCabin.jsx   # Commandes à l'intérieur de la cabine
│   │   └── StatusPanel.jsx     # Données techniques de suivi (pauses, files, historique)
│   ├── domain/
│   │   └── elevatorLogic.js    # Logique de calcul de l'algorithme SCAN (états et transitions)
│   └── hooks/
│       └── useElevator.js      # Hook React gérant le timer et la gestion temporelle
```

## Fonctionnalités Implémentées

* **Simulation interactive** : Appels externes depuis chaque étage (0 à 9) et sélection d'étages cibles depuis l'intérieur de la cabine.
* **Algorithme SCAN fonctionnel** : Tri intelligent des demandes au-dessus et en-dessous de l'étage actuel avec gestion des priorités et prévention des doublons.
* **Gestion automatique des portes** : Arrêt temporisé de 1,5 seconde à chaque étage desservi avec ouverture et fermeture automatique des portes avant de repartir.
* **Contrôle de la simulation** : Options de pause et de reprise à tout moment pour analyser les états intermédiaires de l'algorithme.
* **Historique de parcours amélioré** : Visualisation sous forme de badges du chemin parcouru par l'ascenseur avec des indicateurs de sens (montée/descente) et défilement automatique vers les dernières étapes.

## Limites et Pistes d'Amélioration

* **Ascenseur unique** : La logique actuelle est développée pour une seule cabine. Une évolution intéressante serait de gérer plusieurs cabines en parallèle avec un répartiteur de requêtes intelligent.
* **Physique simplifiée** : Le déplacement de l'ascenseur est immédiat d'un étage à un autre à chaque pas de temps (800 ms). L'ajout d'une animation fluide de transition de la cabine le long des étages améliorerait le rendu visuel.
* **Tests** : Ajouter des tests unitaires avec Jest ou Vitest directement sur `elevatorLogic.js` pour couvrir automatiquement l'ensemble des scénarios de déplacement limites.
