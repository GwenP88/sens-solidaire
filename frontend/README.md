# Frontend — Sens Solidaires

Application React du site vitrine public et du dashboard d'administration de Sens Solidaires.

## Stack

| Élément | Technologie |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Style | Tailwind CSS v4 |
| Routing | React Router v7 |
| Carousel | Swiper v12 |
| Tests | Vitest + React Testing Library |

## Scripts disponibles

| Commande | Rôle |
|---|---|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm test` | Lance les tests Vitest |

> En développement, ces commandes s'exécutent **dans le conteneur Docker** (`docker exec sensolidaire_frontend npm run dev`), jamais directement sur la machine hôte.

## Structure des dossiers

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/        # Navbar, Footer, Layout, HeroPage
│   │   ├── ui/             # Composants réutilisables (Button, Carousel, LignesToPuces...)
│   │   ├── admin/          # Composants spécifiques au dashboard
│   │   ├── missions/        # Composants métier missions
│   │   ├── testimonials/    # Composants métier témoignages
│   │   ├── navigation/       # AnchorNav, FilterChips, Filters, ProtectedRoute
│   │   └── forms/             # ContactForm
│   ├── pages/               # Une page par route
│   │   └── admin/             # Pages du dashboard
│   ├── services/               # api.js — tous les appels HTTP centralisés
│   ├── hooks/                    # Hooks custom (useCountUp...)
│   └── utils/                      # Constantes partagées (filtres, icônes, footerCta, missions)
├── tests/                            # Tests Vitest + React Testing Library
└── public/images/                      # Images statiques, classées par contexte métier
```

## Routes

### Routes publiques (avec Navbar + Footer)

| Route | Page |
|---|---|
| `/` | Accueil |
| `/missions` | Liste des missions |
| `/missions/:slug` | Détail d'une mission |
| `/lieux/:slug` | Détail d'un lieu partenaire |
| `/temoignages` | Témoignages & rapports de mission |
| `/contact` | Formulaire de contact |
| `/soutenir` | Soutenir l'association |
| `/rapports-activite` | Rapports d'activité annuels |
| `/a-propos` | À propos de l'association |
| `/equipe` | Équipe & délégations |
| `/notre-impact` | Actions terrain (liste) |
| `/notre-impact/:slug` | Détail d'une action terrain |
| `/medias-et-actualites` | Actualités (liste) |
| `/medias/:slug` | Détail d'un article |
| `/education-sensibilisation` | Éducation & sensibilisation (liste) |
| `/education-sensibilisation/:slug` | Détail d'un atelier |
| `/mentions-legales`, `/confidentialite`, `/cookies` | Pages légales |

### Routes admin (sans Navbar/Footer, protégées)

| Route | Page | Protection |
|---|---|---|
| `/admin/login` | Connexion admin | Publique |
| `/admin` | Vue d'ensemble dashboard | `ProtectedRoute` (JWT requis) |
| `/admin/temoignages` | Modération des témoignages | `ProtectedRoute` |
| `/admin/missions` | Liste des missions (CRUD) | `ProtectedRoute` |
| `/admin/missions/new` | Création d'une mission | `ProtectedRoute` |
| `/admin/missions/:id/edit` | Édition d'une mission | `ProtectedRoute` |

## Conventions du projet

### Tailwind CSS v4

Pas de `tailwind.config.js` — configuration via le bloc `@theme` dans `index.css` (palette, typographie).

**Couleurs dynamiques** : Tailwind ne génère pas de classes à la volée. Toute couleur calculée à l'exécution (ex : badge ODD selon un numéro) passe par `style={{}}` inline, jamais par une classe Tailwind construite dynamiquement.

### Imports

Groupés par catégorie, dans cet ordre : React → Router → API → Composants layout → Composants UI → Composants métier → Utils.

### Commentaires

En français, sur tous les fichiers `.jsx`/`.js`. Jamais de commentaire redondant avec un nom de variable déjà explicite.

### Appels API

Centralisés dans `services/api.js` — aucun composant ne fait de `fetch()` directement vers une route métier.

**Exception connue** : `LoginAdmin.jsx` fait un `fetch()` direct au lieu de passer par `services/api.js` (qui possède pourtant sa propre fonction `loginAdmin`). C'est une incohérence identifiée, pas un choix délibéré — dette technique à corriger.

## Design system

Référence complète (palette, typographie, composants, règles d'espacement) : [`docs/guide-de-style.md`](../docs/guide-de-style.md).

## Tests

```bash
docker exec sensolidaire_frontend npm test
```

Couvre une fonction utilitaire pure, un composant présentationnel, une règle métier UI et un composant avec appel API mocké (voir le [README racine](../README.md#tests) pour le détail).