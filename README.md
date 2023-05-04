[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/DayUx/subapp/blob/master/LICENCE)


# WIP
# Subapp - Application de calcul des points pour le tir sur cible subaquatique
subapp est une application mobile conçue pour faciliter le calcul des points pour le tir sur cible subaquatique à partir d'une photo de la cible. L'application utilise les technologies React, Capacitor et Rust (compilé en WebAssembly) pour offrir une expérience utilisateur fluide et des calculs précis.

## Fonctionnalités
- Prendre en photo la cible
- Analyse de la photo pour détecter les impacts
- Calcul des points en fonction de la position des impacts
- Affichage des résultats de manière claire et concise
- Possibilité de sauvegarder les résultats pour référence ultérieure
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
npm run start
```
Cela lancera l'application dans votre navigateur par défaut.

5. Pour générer une version de production de l'application, utilisez la commande suivante :

```bash
npm run build
```

Les fichiers de build seront générés dans le répertoire **dist/**.

## Configuration
Aucune configuration supplémentaire n'est requise pour exécuter l'application subapp. Cependant, assurez-vous d'avoir correctement configuré l'environnement de développement pour React et Capacitor.

## Contributions
Les contributions à subapp sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes ci-dessous :

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
