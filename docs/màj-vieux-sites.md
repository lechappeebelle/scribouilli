# Mettre à jour un ancien site

Un jour, on fera ça automatiquement en arrière-plan dans l'atelier, mais c'est
un peu compliqué alors pour le moment il faut faire une PR à la main.

## Mettre les nouveaux fichiers pour compiler le site

Il faut copier/coller ces fichiers depuis [le modèle de
site](https://github.com/scribouilli/site-template) :

- .gitlab-ci.yml
- Gemfile
- _config.yml
- .ruby-version
- .github/workflows/build-and-deploy.yml

## Désactiver la compilation faite par GitHub

Sur GitHub, si jamais quand on clique sur la petite coche/croix/bulle jaune ici : 

![Image](https://github.com/user-attachments/assets/8e5c1cb9-d47c-4788-af28-91074caa1678)

On voit plusieurs trucs dont, certains dont le nom commence par "pages build and
deployment" : 

![Image](https://github.com/user-attachments/assets/8d1898f9-9071-4fb6-af79-d07b7e9908c7)

Ça veut dire que GitHub compile le site de son côté parce que dans les
paramètres du projet on lui demande de le faire. Il faut demander à la personne
d'ouvrir l'onglet "Settings", d'aller dans la section "Pages" à gauche et
changer "Source" de "Deploy from a branch" pour "GitHub Actions" (comme ça il
n'y a plus que notre fichier GitHub action qui compile le site, GitHub fait pas
son truc de son côté en plus).