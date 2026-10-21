# Mon métier se transforme — LaborIA

Outil interactif : arbre de décision pour évaluer l'impact de l'IA générative
sur ses tâches quotidiennes, avec suivi des tâches (localStorage) et page
d'exploration des pistes d'amélioration.

## Installation

```bash
npm install
```

## Développement local

```bash
npm run dev
```

Ouvre le lien affiché (en général <http://localhost:5173>).

## Build de production

```bash
npm run build
```

Génère le site statique dans `dist/`.

## Structure du projet

```sh
├── index.html              → page d'accueil / notice d'utilisation
├── taches.html              → liste des tâches enregistrées (localStorage)
├── arbre.html                → questionnaire / arbre de décision
├── exploration.html          → étape 3 : pistes d'amélioration par colonne
├── public/
│   ├── assets/logo/          → logos SVG (voir ci-dessous)
│   └── data/
│       └── arbre_decision.csv  → LE FICHIER À MODIFIER pour changer l'arbre
└── src/
    ├── css/style.css
    └── js/
        ├── storage.js       → gestion des tâches en localStorage
        ├── csv.js           → parsing du CSV (PapaParse)
        ├── taches.js
        ├── arbre.js
        └── exploration.js
```

## Modifier l'arbre de décision (pour les non-développeurs)

Toute la logique de l'arbre est dans **`public/data/arbre_decision.csv`**.
Ce fichier peut être édité directement dans GitHub (mode tableau) ou dans
Excel/Google Sheets puis ré-exporté en CSV.

Colonnes :

- `id` : identifiant unique de la case (ne pas dupliquer)
- `type` : `question` (avec des boutons) ou `resultat` (fin de parcours)
- `texte` : texte affiché
- `categorie` : uniquement pour les lignes `resultat`. Valeurs possibles :
  - `ia_utile` → suggère la colonne "IA utile"
  - `ia_insatisfaisante` → suggère la colonne "IA ne donne pas satisfaction"
  - `non_concernee` → sort du parcours sans classification
  - laisser vide pour les lignes `question`
- `boutonN_label` / `boutonN_suivant` (N de 1 à 4) : le texte du bouton et
  l'`id` de la case suivante. Laisser vide si moins de 4 boutons sont utilisés.

⚠️ Chaque `boutonN_suivant` doit correspondre à un `id` existant ailleurs
dans le fichier, sinon le parcours affichera une erreur à cette étape.

## Logos et charte graphique

Remplace les deux fichiers placeholders par les vrais SVG fournis par
LaborIA, en gardant exactement les mêmes noms de fichiers :

- `public/assets/logo/LaborIA_transparent.svg` (logo complet avec texte)
- `public/assets/logo/LaborIA_cerveau_transparent.svg` (icône seule, utilisée en favicon)

Les couleurs de la charte sont définies en variables CSS dans
`src/css/style.css` (section `:root`).

## Publier sur GitHub Pages

1. Vérifier que GitHub Pages est configuré dans **Settings → Pages** avec
   **Deploy from a branch**, branche `gh-pages` et dossier `/(root)`.
2. Pousser les changements sur GitHub.
3. Depuis la racine du projet, lancer :

   ```bash
   npm run deploy
   ```

   Cette commande construit le site dans `dist/`, puis publie ce dossier sur
   `gh-pages`. Chaque publication remplace le contenu de cette branche par le
   nouveau contenu de `dist/`.
4. Dans **Settings → Pages**, consulter l'état du dernier déploiement. Le site
   est publié automatiquement après la mise à jour de `gh-pages` ; aucun workflow
   GitHub Actions supplémentaire n'est requis avec cette source.

Le domaine personnalisé `laboria.datactivist.coop` est conservé par le fichier
`public/CNAME`, que Vite copie à la racine de `dist/` à chaque build. Ne placez
pas le seul fichier `CNAME` à la racine du dépôt : il ne serait pas inclus dans
la publication de `dist/`.

Le `base: './'` dans `vite.config.js` permet aux chemins des ressources de
fonctionner à la racine du domaine personnalisé comme dans un sous-dossier de
projet.
