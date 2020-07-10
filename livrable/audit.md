# Audit de performance du site
## http://todolistme.net/

### 1- Résumé du fonctionnement de l’ application

Notre concurrent propose une application de todo-list perfectible.
Cette application permet de faire plusieurs choses :
1. créer des catégories de liste de tâches à effectuer
2. créer des liste de tâches à effectuer, les enregistrer, éditer, effacer
3. donner une temporalité

Via Wappalyzer nous voyons la présence des éléments suivants sur le site :

![img](audit_wappalyzer.png)


### 2- Utilisation des outils du navigateur Chrome
L’ audit à été réalisé avec les outils fournis par la console de notre navigateur, dans ce cas Chrome Version 64.0.3282.119 de Google.

#### 2-1- Outil « network »

![img](audit_network.png)

L’ affichage complet de la page prend 6,49 secs.
Les différentes image prennent un peu de temps à charger, amélioration possible ici.

##### 1,88 secondes pour ce visuel :

![img](audit_network_1.88ms.png)

1,88 secondes pour afficher le squelette de l’ application. Pas extrêmement rapide pour des éléments de base. 

La console montre que c’est vraiment les PNG qui posent le plus problème.

##### 5,91 secondes pour ce visuel:

![img](audit_network_5.91ms.png)

5,91 secondes pour l’affichage de l’ entête et du footer : grosse marge d’ amélioration en optimisant les images (formatSVG à la place de PNG).

##### 6,31 secondes pour ce visuel :

![img](audit_network_6.31ms.png)

0,4 secondes pour l’ affichage des éléments todo, c’est plutôt rapide.

On peut optimiser le temps de chargement en utilisant le cache pour les images.

Les 2 fichiers les plus longs à chargés sont  le background (texture.png) et jQuery (jquery-ui.js).

Le background peut-être optimisé (background repeat + fichier en SVG), jQuery intégré uniquement les fonctions utiles.

![img](audit_network_texture.png)

![img](audit_network_jquery.png)

Avec l’ outil coverage on se rend compte par exemple que 75 % Jquery est non utilisés.

![img](audit_network_coverage.png)

#### 2-2- Outil « audit »
4 catégories :
* Progressive Web App
* Performance
* Accessibilité
* Bonnes pratiques

##### 2-2-1- Progressive Web App

![img](audit_pwa.png)

9 % de réussite, 10 tests ratés sur 11.

Le site de notre concurrent n’est pas du tout orienté PWA, un point sur lequel nous avons une énorme marge de manœuvre.

##### 2-2-2- Performance

![img](audit_perf.png)

42 % de test validé, application trop lente.

Les PNG peuvent être amélioré (SVG, background repeat) tout comme certains fichier JS (utilisation de jquery).

##### 2-2-3- Accessibilité

![img](audit_accessibilite.png)

83 % de réussite, quelques points d’ amélioration comme :
* ajouter un attribut alt pour les images
* accentuer plus les contrastes
* ajouter un attribut lang dans le HTML

##### 2-2-4- Bonnes pratiques

![img](audit_practice.png)

Recommandations pour améliorer les performances et moderniser l’ application.

56 %, grosse marge de progression ici également.
* pas de HTTPS
* 2 failles de sécurités dans les librairies front utilisés
* présences de deux erreurs dans la console

### 3- Comparaison avec notre application

![img](audit_notre_app.png)

#### 3-1. Amélioration possible du PWA
* simple comme `meta name= «theme-color »`
* gestion du offline avec un splashscreen...

#### 3-2. Performance 
OK

#### 3-3. Bonnes pratiques 
4 tests ratés sur 12. A vérifier.

#### 3-4. Accessibilité
* label : `input class="new-todo" placeholder="What needs to be done?" autofocus`
* amélioration du contraste entre le 1er plan et le fond d’ écran

### 4- Scalling :
Fonctionnalité que l’on pourrait éventuellement intégré à notre application :
* temporalité
* catégories de liste

### 5- Résumé
##### Application de notre concurrent :
1. Lente, pas optimisé
2. pas orienté PWA
3. Accessibilité correcte
4. Design discutable, quelques fonctionnalités intéressantes

##### Notre application :
1. Rapide, optimisé et performante
2. PWA améliorable, axe d’ amélioration évident
3. Bonne accessibilité, amélioration via `label` et contrastes pour que ce soit parfait
4. La temporalité et les catégories de listes pourraient être intégrés ?


