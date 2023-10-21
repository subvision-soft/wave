[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/DayUx/calypso/blob/master/LICENCE)

# WIP

# Calypso - Application de calcul des points pour le tir sur cible subaquatique

calypso est une application mobile conçue pour faciliter le calcul des points pour le tir sur cible subaquatique à partir
d'une photo de la cible. L'application utilise les technologies TypeScript ,Angular ainsi que Opencv compilé en wasm.

[Projet figma en cours](https://www.figma.com/file/zgSt1eqy80DLdMJD3P1b6O/subapp?type=design&node-id=0%3A1&mode=design&t=2yJoNjEJBKzxWvpx-1)

## Fonctionnalités

- Prendre en photo la cible
- Analyse de la photo pour détecter les impacts
- Calcul des points en fonction de la position des impacts
- Affichage des résultats de manière claire et concise
- Possibilité de sauvegarder les résultats pour référence ultérieure

## Aperçu

### Détection d'un plastron

<img src="./github/preview1.gif" width=300>

### Saisie d'un temps à l'aide d'un composant personnalisé

<img src="./github/preview2.gif" width=300>

## Installation

Pour installer et exécuter l'application subapp sur votre appareil, suivez les étapes ci-dessous :

1. Clonez ce dépôt sur votre machine locale.

2. Assurez-vous d'avoir Node.js et npm installés sur votre machine.

3. Accédez au répertoire racine du projet et exécutez la commande suivante pour installer les dépendances :

```bash
npm install
```

4. Ensuite, exécutez la commande suivante pour démarrer l'application en mode de développement :

```bash
npm start
```

Cela lancera l'application dans votre navigateur par défaut.

5. Pour générer une version de production de l'application, utilisez la commande suivante :

```bash
npm build
```

Les fichiers de build seront générés dans le répertoire **dist/**.

## Configuration

Aucune configuration supplémentaire n'est requise pour exécuter l'application subapp. Cependant, assurez-vous d'avoir
correctement configuré l'environnement de développement pour Angular et Capacitor.

## Contributions

Les contributions à subapp sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes
ci-dessous :

1. Fork ce dépôt et clonez-le localement.

2. Créez une branche pour vos modifications :

```bash
git checkout -b feature/nouvelle-fonctionnalite
```

3. Effectuez les modifications nécessaires et committez vos changements :

```bash
git commit -m "Ajouter une nouvelle fonctionnalité"
```

4. Poussez les modifications vers votre dépôt forké :

```bash
git push origin feature/nouvelle-fonctionnalite
```

5. Ouvrez une pull request sur ce dépôt en fournissant une description détaillée des modifications apportées.
