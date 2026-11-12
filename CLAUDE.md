# CLAUDE.md — Sens Solidaires

Ce fichier est lu automatiquement par Claude au début de chaque session dans ce dépôt.
Il décrit le projet, la façon de travailler attendue, ce qui a été fait, pourquoi, et ce qui reste à faire.

Dernière mise à jour : 12 novembre 2026 (état du dépôt : branche `dev-front` — Bloc C livré : page Éducation entièrement gérée depuis le dashboard (172, 172A, 172C), « Pays concerné » France / Suisse sur les sections Éducation, actions terrain et articles (172D) ; journal de bord par jour).

---

## 1. Règles de travail avec Gwen (à lire en premier)

Ces règles sont **fermes**. Elles priment sur les habitudes par défaut de Claude.

### Communication

- **Tout en français** : réponses, commentaires de code, messages de commit, documentation.
- Gwen a un **TDAH** : messages **courts, aérés, structurés**. **Une seule chose par message.** Pas de bloc « au passage, voici 3 autres trucs ».
- Pas d'emojis dans les documents professionnels (docs, dossiers, README).
- Gwen est **étudiante** (titre DWWM, Holberton School) : **expliquer ce qui est fait et pourquoi** à chaque morceau de code. Privilégier la pédagogie, pas le « clé en main ».

### Rythme

- **Une étape à la fois.** Proposer l'étape, l'expliquer, **attendre la validation** avant de passer à la suivante.
- **Validation à chaque commande terminal** : proposer la commande, attendre le OK, puis l'exécuter (ou la laisser l'exécuter).
- **Ne jamais supposer** qu'une étape précédente a été faite sans confirmation explicite. Vérifier (lire le fichier, `git status`, requête SQL) plutôt que présumer.
- Gwen travaille par **petites sessions d'environ 30 minutes**. En fin de journée : **entrée du jour dans le journal de bord** (`docs/journal-de-bord/AAAA-MM-JJ.md`, modèle dans le `README.md` du dossier, ligne ajoutée à son index) + commandes de commit à donner à Gwen (c'est elle qui commit et push).

### Modifications de fichiers

- Toujours donner le **chemin depuis la racine du repo** du fichier concerné, avec la commande prête à copier : `code frontend/src/pages/Home.jsx`.
- Avant de modifier un fichier : dire **ce qui va changer et pourquoi**, attendre le OK.
- Penser **responsive** (mobile 375 / tablette 768 / desktop 1024-1440) pour chaque bloc UI livré.
- Chaque fichier commence par **un commentaire d'en-tête de 1 à 2 lignes** qui dit ce qu'il fait (convention du projet, voir les fichiers existants).
- **Réutiliser les composants existants** avant d'en créer un nouveau (voir section 8).
- Pas de « quick fix » non maintenable.

### Ce que Claude ne fait PAS

- **Ne jamais écrire ni modifier les dossiers de formation** (dossier DWWM, dossier professionnel, diaporama de soutenance) : dire quoi mettre et où, c'est Gwen qui rédige.
- **Ne jamais lancer `npx prisma migrate dev`** (voir section 10).
- **Ne jamais lancer `npm run dev` hors Docker** : tout tourne dans Docker Compose.
- **Ne jamais `docker compose down -v`** sans l'avoir explicitement signalé : ça **supprime la base de données** (volume `postgres_data`), y compris les contenus réels saisis via le dashboard.
- **Ne pas commit / push sans accord explicite.**
- Ne pas relancer le seed sans vérifier qu'il ne contient plus de bloc qui écraserait des données saisies via le dashboard (voir section 11).

### Textes du dashboard

Le dashboard est utilisé par la **cliente, qui n'est pas développeuse**. Tous les libellés, aides et messages d'erreur doivent :

- utiliser un **vocabulaire non technique** (jamais « slug », « hero », « payload »… → « Adresse de la page », « Photo principale »…) ;
- **vouvoyer** ;
- dire **quoi faire**, avec ses mots à elle (ex. « Impossible de contacter le serveur. Vérifiez votre connexion et réessayez. »).

---

## 2. Contexte du projet

- **Projet** : refonte complète du site de **Sens Solidaires**, association humanitaire et environnementale (missions de volontariat international, Service Civique, groupes jeunes, congés solidaires, éducation à la citoyenneté mondiale, actions terrain).
- **Nom** : anciennement « Sens Solidaire », désormais **« Sens Solidaires »** (avec un s). Le code et certains docs contiennent encore les deux formes ; le domaine reste `sensolidaire.org`.
- **Cliente** : Delphine Thibaut, fondatrice de l'association.
- **Cadre** : projet de fin de formation **DWWM (titre RNCP niveau 5)**, Holberton School Thonon-les-Bains.
- **Équipe** : réalisé en binôme avec **Alison Amblard** (backend + dashboard) jusqu'à fin août 2026. **Gwen (Gwenaëlle Pichot) travaille seule depuis le 18/09/2026.**
- **Ancien site** : WordPress (Elementor / WPBakery) sur `sensolidaire.org`, hébergé chez OVH. Ses fichiers `wp-content` disparaîtront avec lui : tout média encore référencé par une URL WordPress doit être re-téléchargé puis renvoyé via le dashboard.

### Périmètre

- **Site public** : accueil, missions (liste + détail), lieux, témoignages, notre impact (actions terrain), éducation & sensibilisation, médias & actualités, à propos, équipe, rapports d'activité, soutenir / dons, contact, pages légales.
- **Dashboard admin** : authentification JWT, CRUD des contenus (missions, Service Civique, lieux, délégations, équipe, partenaires, rapports, témoignages, actions terrain, médias/articles, galerie), modération des témoignages.
- **Interface en français uniquement en V1.** Le bilingue FR/EN est repoussé (la cliente n'a pas tranché entre traduction interne et automatique).

### Échéances

- **Soutenance DWWM** : semaine du **23 au 27 novembre 2026** (épreuve écrite + oral d'environ 2 h, diaporama de 26 diapositives / 35 min). Le dossier DWWM est terminé.
- **Livraison à la cliente** : souhaitée **avant fin 2026**.
- Le site **n'est pas encore en production**.

---

## 3. Stack technique

| Côté | Technologies |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v7, Swiper 12, react-icons, react-world-flags |
| Backend | Node.js (ES modules), Express 5, Prisma v7 (`@prisma/adapter-pg`), PostgreSQL 16 |
| Auth | JWT access token (15 min, header `Authorization`) + refresh token (7 j, cookie HTTP-only), bcrypt |
| Upload | Multer + Sharp (redimensionnement + conversion WebP) |
| Emails | Resend (formulaire de contact) |
| Sécurité | Helmet, CORS restreint, deux comptes PostgreSQL |
| Tests | Jest + Supertest (back), Vitest + React Testing Library (front), Postman (runbook manuel) |
| Infra | Docker Compose (3 services), ngrok pour les démos |
| Design | Figma (design system + maquettes) |

**Particularités à connaître :**

- **Tailwind v4** : pas de `tailwind.config.js`. Toute la config est dans `frontend/src/index.css` via `@theme` et `@utility`.
- **Prisma v7** : l'URL de connexion n'est plus dans `schema.prisma` mais dans `backend/prisma.config.ts` (`defineConfig`).
- **Express 5** (pas 4).

---

## 4. Environnement local

Gwen travaille sous **Windows + WSL (Ubuntu 24.04)**, repo dans `~/sens-solidaire`.

- **Docker est installé directement dans WSL** (Docker Engine + plugin Compose, depuis le 8 novembre) : **Docker Desktop n'est plus utilisé** (trop gourmand). Le service Docker démarre tout seul avec WSL ; `docker` fonctionne sans `sudo` (groupe `docker`). Site toujours sur `localhost:5173` depuis Windows.
- Docker Desktop est encore installé (base d'origine dans son propre volume, plus utilisée) : à désinstaller quand tout est validé. **Ne pas réactiver son intégration WSL** : les deux Docker se marcheraient dessus.
- Un **PostgreSQL natif** est installé dans WSL (projets Holberton) : **désactivé au démarrage** (`systemctl disable`) car il occupe le port 5432. Pour s'en servir : `docker compose stop` puis `sudo systemctl start postgresql`.

### Services Docker

| Service | Conteneur | Port hôte | Remarque |
|---|---|---|---|
| PostgreSQL 16 | `sensolidaire_db` | 5432 | volume `postgres_data` |
| Backend Express | `sensolidaire_backend` | **3001** → 3000 | hot reload (nodemon), code monté en volume |
| Frontend Vite | `sensolidaire_frontend` | 5173 | hot reload (polling) |

- Le frontend appelle l'API en **relatif** (`/api`, `/uploads`) : le **proxy Vite** (`frontend/vite.config.js`) redirige vers `http://backend:3000`. Pas d'URL backend codée en dur.
- **ngrok** : `ngrok http 5173` suffit (le proxy Vite évite un tunnel backend). Si l'URL ngrok change, mettre à jour `allowedHosts` dans `vite.config.js` puis redémarrer les conteneurs.

### Commandes courantes

```bash
# Démarrer / arrêter
docker compose up -d
docker compose down            # JAMAIS -v sans y penser à deux fois

# Logs (attention : horodatés en UTC)
docker compose logs -f backend

# Accès SQL direct (Prisma Studio ne fonctionne pas dans Docker avec Prisma v7)
docker compose exec postgres psql -U postgres -d sensolidaire

# Tests (détail : section 13)
docker exec sensolidaire_backend npm run test:unit
docker exec sensolidaire_frontend npm run test:run

# Après ajout d'une dépendance : resynchroniser le volume node_modules
docker exec sensolidaire_backend npm install

# Optimisation des images statiques (photos -> WebP, logos partenaires recompressés), dans Docker
docker compose exec --user "$(id -u):$(id -g)" frontend node scripts/optimize-images.js
```

### Variables d'environnement

- `.env` (racine, lu par Docker Compose) : `POSTGRES_PASSWORD`, `DB_APP_PASSWORD`, `DB_OWNER_PASSWORD`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.
- `backend/.env` : Resend, `ADMIN_PASSWORD`, e-mail de contact.
- Modèles : `.env.example` et `backend/.env.example`. **Ne jamais lire, afficher ni committer les vrais `.env`.**

Installation complète d'un poste : voir `README.md` (section Installation).

---

## 5. Architecture

### Structure du repo

```
sens-solidaire/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        Navbar, Footer*, Hero, HeroPage, Layout, StatsBar
│   │   │   ├── ui/            Button, Modal, Carousel, Section, CTASection, BaseContentCard,
│   │   │   │                  BaseOverlayCard, BadgeODD, SectionODD, BandeauODD, RapportCard, LignesToPuces, CookieBanner, PageLoader...
│   │   │   ├── admin/         DashboardLayout, DashboardSidebar, DashboardMobileNav, dashboardNav.js (liens partagés),
│   │   │   │                  DashboardTable, DashboardModal, ConfirmModal, ErrorModal, FormElements,
│   │   │   │                  AdminFileUpload, YouTubeLinksField, *EditModal, ModerationCard (non branché)
│   │   │   ├── missions/      MissionCard, MissionSection, MissionInfoBar, MissionSteps, MissionCTA...
│   │   │   ├── navigation/    AnchorNav, FilterChips, FilterSelect, Filters, ProtectedRoute, RouteScrollReset
│   │   │   ├── testimonials/  TestimonialCard, TestimonialForm
│   │   │   ├── media/         MediaCard, YouTubeSlide, YouTubeModal
│   │   │   ├── team/ locations/ education/ actions/ forms/
│   │   ├── pages/             une page par route publique
│   │   │   └── admin/         pages du dashboard
│   │   ├── services/api/      TOUS les appels HTTP : un fichier par ressource, client.js (API_URL + authFetch),
│   │   │                      index.js qui réexporte tout (on importe toujours `from '../services/api'`)
│   │   ├── utils/             constantes et fonctions partagées (filters, validation, shortDescription, odds,
│   │   │                      youtube, adminErrors...)
│   │   ├── hooks/             useCountUp, useSEO (titre / description / Open Graph par page)
│   │   └── index.css          design system Tailwind v4 (@theme + @utility)
│   ├── tests/                 Vitest + RTL : unit/, components/, pages/ (+ anciens tests à la racine)
│   ├── scripts/optimize-images.js   photos statiques → WebP, logos partenaires recompressés (tâche 131)
│   └── public/images/         images statiques, classées par contexte métier
├── backend/
│   ├── src/
│   │   ├── app.js             assemblage Express (ordre des middlewares critique)
│   │   ├── server.js
│   │   ├── routes/            xxxRoutes.js (public) / adminXxxRoutes.js (protégé)
│   │   ├── controllers/       validation des entrées + formatage de la réponse
│   │   ├── services/          logique métier + accès Prisma
│   │   ├── middlewares/       authMiddleware (JWT), uploadMiddleware (Multer)
│   │   ├── utils/             validation, slugify, shortDescription, countries, odds, jwt, youtube, prismaErrors
│   │   └── config/db.js       client Prisma (compte sensolidaire_app)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/        migrations versionnées (SQL)
│   │   ├── roles.sql          création des 2 comptes PostgreSQL
│   │   └── seed.js
│   ├── public/uploads/        fichiers envoyés (images, documents, videos, audios)
│   └── tests/                 Jest : unit/ (sans base) + intégration Supertest (*.admin.test.js,
│                              *.integration.test.js, helpers/adminCrud.js)
├── .github/workflows/ci.yml   intégration continue GitHub Actions (voir section 9)
├── docs/                      documentation de suivi et de conception (voir section 14)
└── docker-compose.yml
```

### Découpage backend : route → controller → service

- **Route** : déclare l'endpoint et applique `authMiddleware` pour les routes admin.
- **Controller** : valide les entrées (`utils/validation.js` : `isFilled`, `isValidYear`, `isValidSlug`), renvoie les bons codes HTTP (400, 401, 404, 409…).
- **Service** : logique métier + requêtes Prisma. Aucun accès Prisma ailleurs.
- Routes publiques sous `/api/...`, routes admin sous `/api/admin/...`.

### Frontend

- Une seule application React pour le site public **et** le dashboard (`/admin/...`, protégé par `ProtectedRoute`).
- `services/api/client.js` : `authFetch` ajoute le token, et au premier 401 tente un **refresh silencieux** via le cookie avant de déconnecter. Les erreurs réseau sont remplacées par un message compréhensible.
- **Liens internes** : `<Link>` (React Router). **Liens externes** : `<a target="_blank" rel="noopener noreferrer">`.
- **Lien qui ressemble à un bouton** : `<Button to="/contact" />` (interne) ou `<Button href="https://…" />` (externe, nouvel onglet). **Jamais** de `<Button>` à l'intérieur d'un `<a>` ou d'un `<Link>` (HTML invalide, double arrêt au clavier).
- **Référencement** : chaque page publique appelle `useSEO({ title, description, image })` (`hooks/useSEO.js`) **avant** ses `return` de chargement ; pages du dashboard : `noindex: true`. Les robots des réseaux sociaux n'exécutant pas JavaScript, `index.html` garde des valeurs Open Graph par défaut.
- **Lazy loading** : toutes les pages sauf `Home` sont chargées à la demande (`lazy()` dans `App.jsx`, `Suspense` + `PageLoader` dans `Layout` et `DashboardLayout`). Toute nouvelle page : `const X = lazy(() => import('./pages/X'))`. Images du site public : `loading="lazy"` (sauf logo de la Navbar).
- **Images statiques** (`public/images/design/`, logo) : toujours référencer la version **`.webp`** produite par `scripts/optimize-images.js` (nouvelle image : la déposer en JPG/PNG puis relancer le script). Exceptions : `logo-partners/` (adresses enregistrées en base dans `Partner.logo_url` → recompressés sur place, même nom) et `og-default.jpg` (aperçu réseaux sociaux, JPEG 1200 × 630).
- **Accessibilité** : lien d'évitement « Aller au contenu » (`Layout`, cible `#contenu`), contour `:focus-visible` global (`index.css`), modales en `role="dialog"` avec gestion du focus, `aria-label` sur toute icône seule (bouton ou lien).
- Règles **dupliquées volontairement** entre front et back (ils ne partagent pas de code) : `utils/validation.js`, `utils/youtube.js`, `utils/odds.js` (correspondance ODD → catégorie), `utils/shortDescription.js`. Toute modification doit être faite **des deux côtés** — le test `frontend/tests/unit/duplicatedRules.test.js` (lancé sur le poste) échoue si les deux copies divergent.
- `/admin` (accueil du dashboard) affiche volontairement « Vue d'ensemble — à construire » : la vue sera construite prochainement. `pages/admin/Dashboard.jsx` et `ModerationCard.jsx` ne sont pas branchés pour l'instant — **ne pas les supprimer**.

### Routes publiques

`/`, `/missions`, `/missions/:slug`, `/lieux/:slug`, `/temoignages`, `/contact`, `/soutenir`, `/rapports-activite`, `/a-propos`, `/equipe`, `/notre-impact`, `/notre-impact/:slug`, `/medias-et-actualites`, `/medias/:slug`, `/education-sensibilisation`, `/education-sensibilisation/:slug`, `/mentions-legales`, `/confidentialite`, `/cookies`.

### Routes dashboard

`/admin/login`, `/admin` (Dashboard), `temoignages-rapports`, `missions` (+ `new`, `:id/edit`), `service-civique/new|:id/edit`, `lieux` (+ formulaire), `medias` (+ formulaire), `equipe/...`, `a-propos` (équipe, délégations, partenaires, rapports d'activité), `galerie`, `actions-terrain` (+ formulaire), `education` (+ `education/sections/new|:id/edit`, `education/cartes/new|:id/edit`).

---

## 6. Base de données

Schéma : `backend/prisma/schema.prisma`. Diagrammes Mermaid à jour dans `README.md` (section Base de données).

| Domaine | Modèles |
|---|---|
| Missions | `Mission`, `MissionPricing`, `Location` (many-to-many avec Mission), `Delegation`, `Testimonial`, `MissionReport` |
| Contenu éditorial | `MediaPost`, `EducationSection`, `EducationItem` (carte, rattachée à une section), `ActivityReport` |
| Impact terrain | `FieldAction`, `FieldActionCountry`, `FieldActionTag`, `FieldActionODD` |
| Communauté | `TeamMember`, `Partner` |
| Admin / médias | `Admin`, `Media` (polymorphique) |

### Choix d'architecture et pourquoi

- **`Media` polymorphique** (`entity_type` + `entity_id`, sans FK) : une seule table pour rattacher des fichiers à n'importe quelle entité. Contrepartie : **pas d'intégrité référentielle en base**, gérée à la main dans `mediaService.js` (penser à supprimer les médias liés quand on supprime une entité).
- **Missions** : historiquement en soft delete (`is_active = false`) pour ne pas casser les témoignages liés ; un **hard delete en transaction** a été ajouté (tâche 81).
- **`FieldAction` ↔ `Mission`** : lien par **correspondance de pays** (`Mission.country` / `FieldActionCountry`), sans FK. Adapté au MVP. V2 prévue : table `MissionFieldAction` (many-to-many).
- **`MissionReport`** : `mission_id` optionnel, champs texte `destination` / `type` conservés en **redondance assumée** (un rapport peut exister sans mission en base).
- **`Mission.image_url` (photo principale) séparée de la galerie `Media`** : unification prévue en V2. En attendant, le formulaire admin simule l'UX côté front (envoi multiple, 1re photo → `image_url`, suivantes → `Media`).
- **Thèmes de `MediaPost`** : pas de table, simples suggestions (`normalizeTheme` limite les doublons, majuscule imposée sur la 1re lettre côté serveur). Limite connue : impossible de corriger la casse d'un thème depuis le formulaire si ce post est le seul à l'utiliser → correction en SQL.
- **Slug** : généré automatiquement, **jamais modifié** ensuite (un lien partagé reste valable). La cliente ne voit jamais le mot « slug » (« Adresse de la page »).
- **Vidéos YouTube des articles** : `Media` avec `file_type = 'youtube'` et le lien dans `file_url` (pas de migration, `file_type` est un texte libre ; `video` reste réservé aux fichiers vidéo). Max 5 par article, lien validé des deux côtés.
- **Page Éducation** : un seul type de section générique (`EducationSection`) que la cliente crée, ordonne (`display_order`) et masque. Photos et boutons d'une section dans `Media` (`entity_type 'education_section'`, `file_type 'image'` / `'link'`, `label` = texte du bouton). Tarif en texte libre, en euros **et** en francs suisses (`price_eur` / `price_chf`). Mise en page écrite dans le texte (ligne vide = paragraphe, « - » = puce) : `TexteMisEnForme`. Supprimer une section ne supprime pas ses cartes (`ON DELETE SET NULL`). Résumé d'une carte déduit du repère `---` (200 caractères max).
- **Rattachement France / Suisse** (`enum Rattachement { FRANCE SUISSE COMMUN }`) sur `EducationSection`, `FieldAction`, `MediaPost` : colonne **facultative en base** (contenus anciens = « À renseigner » dans le dashboard), **obligatoire dans les formulaires** (2 cases « France » / « Suisse », les deux = `COMMUN` : `RattachementField`, `RattachementBadge`). Dans le dashboard on dit « Pays concerné » ; pour les actions terrain, à ne pas confondre avec les pays où le projet a été réalisé.
- **Valeurs calculées à la lecture, non stockées** : résumé de carte (200 caractères pour les médias), temps de lecture (~200 mots/min).
- **Description courte** : marqueur `---` dans le texte long (`utils/shortDescription.js`, des deux côtés). Si le repère est trop loin, l'aperçu `ShortDescriptionPreview` avertit ; pour les actions terrain l'enregistrement est **bloqué** (sinon perte de texte).

### Deux comptes PostgreSQL (moindre privilège)

- `sensolidaire_owner` : migrations (crée / modifie les tables) → `MIGRATE_DATABASE_URL`.
- `sensolidaire_app` : utilisé par l'API (lecture / écriture des données uniquement) → `DATABASE_URL`.
- Créés une seule fois par `backend/prisma/roles.sql`.

---

## 7. Design system

Référence : `docs/guide-de-style.md` + `frontend/src/index.css`.

### Palette (tokens Tailwind)

Trois palettes existent dans `index.css` ; **seule la palette 2 (bleu-vert / terracotta) est active** : la cliente a choisi de remplacer le vert par du bleu au début du développement. Les palettes 1 et 3 sont commentées. **Toujours utiliser les tokens, jamais les hex en dur.**

| Token | Valeur active | Rôle |
|---|---|---|
| `primary` | `#2F5D62` | textes, titres, fonds sombres, boutons secondaires |
| `accent` | `#A44A2F` | terracotta — boutons primaires (CTA) |
| `accent-2` | `#1F4D3A` | accent secondaire |
| `dark` | `#0D2B30` | fond très sombre |
| `surface` / `surface-mid` / `surface-dark` | `#F8F6F1` / `#E8DFD1` / `#D9CBB8` | fonds beiges |

Le **dashboard a sa propre palette** : `dash-action`, `dash-editorial`, `dash-success`, `dash-warning`, `dash-danger`, `dash-title`, `dash-text`, `dash-legend`.

Le `guide-de-style.md` décrit encore l'ancienne palette verte pour les valeurs : se fier à `index.css`.

### Typographie

Lora (`font-heading`, titres) + Source Sans 3 (`font-body`, corps).

### Utilitaires CSS (`@utility` dans index.css)

`h1-style`, `h2-style`, `h3-style`, `text-body`, `text-lead`, `text-caption`, `text-eyebrow`, `text-label`, `text-mention`, `text-stat`, `text-badge`, `section-subtitle`, `section-header`, `link-nav`, `link-footer`, `link-inline`, `link-cta`, `btn-base`, `padding-x`, `padding-y`, `hero-py`, `hero-page-py`, `filter-py`, `scroll-pb`, `gap-xs/sm/md/lg`, `rich-text`.

**Règle** : les marges après les éléments de texte sont **intégrées dans les utilitaires** — ne pas ajouter de `mb-X` en dur.

### Règles UI

- **Contraste des textes (WCAG AA, 4,5 pour 1)** : sur fond clair, `text-primary/90` minimum (`/80` ne passe pas sur `surface`) ; sur fond `primary`, `text-surface/80` minimum. Logo et nouvelles images : attributs `width` / `height` (place réservée, pas de décalage de la page).
- Tailwind v4 ne génère pas de classes dynamiques : pour une couleur venant de la BDD, utiliser `style={{ ... }}`.
- Témoignages limités à **280 caractères** ; `TestimonialCard` à hauteur fixe `h-[270px]` + `line-clamp`.
- Carousel (Swiper) : navigation custom via `swiperRef.current?.slidePrev()/slideNext()` (le module Navigation officiel entre en conflit), `observer`/`observeParents`, `loop` seulement si `items.length >= 6`, contrôles masqués si peu d'éléments.
- `react-scroll` est incompatible avec React 19 : utiliser le `smoothScrollTo` custom (`requestAnimationFrame`).
- Composants de formulaire du dashboard : **toujours** passer par `components/admin/FormElements.jsx` (`FormSection`, `Field`, `TextareaField`, `FormActionBar` collante, `ShortDescriptionPreview`) et `AdminFileUpload` (prop `error`). Erreurs **par champ**, astérisques sur les champs obligatoires.
- Modales du dashboard : `DashboardModal` / `ConfirmModal` / `ErrorModal` (dialogue accessible : titre relié, focus géré) — **jamais** de `window.confirm` ni d'`alert`. Les messages d'erreur d'action viennent de `utils/adminErrors.js` (`ADMIN_ERRORS.toggle / delete / update / save`).
- Dashboard sur téléphone : seules la modération des témoignages et la publication d'articles sont prévues (`mobile: true` dans `dashboardNav.js`). Barre de navigation **en haut** (le bas est pris par `FormActionBar`). Colonne de tableau masquable sur mobile : `hideOnMobile: true` dans la config de colonnes de `DashboardTable`.
- Filtres pays du site : jamais de liste figée — `buildCountryOptions()` (`utils/filters.js`) à partir des données chargées.
- Section ODD : composant partagé `SectionODD` (Notre impact, Éducation : 17 icônes officielles de l'ONU sur 2 lignes, libellés français, bouton vers le site de l'ONU) et `BandeauODD` (accueil, version compacte). Libellés et adresse des icônes : `utils/odds.js`. Ne pas recopier le bloc dans une page.
- Vidéos : `YouTubeSlide` (miniature, aucun lecteur avant le clic) + `YouTubeModal` (lecteur `youtube-nocookie`, portrait conservé pour les Shorts).

---

## 8. Conventions de code

- Commentaires **en français**, en-tête de fichier de 1 à 2 lignes, sections séparées par des bandeaux `// ── TITRE ───`.
- Logs sans emoji.
- Plus aucun commentaire en anglais dans le code (ménage de la tâche 129) : ne pas en réintroduire.
- Un fichier qui dépasse 300-500 lignes est candidat au découpage.
- Uploads : types autorisés définis dans `uploadMiddleware.js` ; extensions + dossiers dans `storageService.js` ; choix du dossier dans `uploadController.js`. Limite **20 Mo**. Les vidéos longues vont sur YouTube (lien), pas sur le serveur.

---

## 9. Workflow Git

- Branches : `main` (production), `dev` (intégration), **`dev-front` (branche de travail de Gwen)**, `dev-back` (Alison, inactive depuis juillet), `fix/audit-securite-aout` (mergée).
- **Commits thématiques** : un commit par changement logique (pas un par session).
- Format des messages : `type(portée): description en français`, ex. `feat(admin): ...`, `fix(api): ...`, `docs: ...`, `chore(seed): ...`, `refactor(medias): ...`.
- Gwen utilise un alias personnel **`git acp "message"`** (add + commit + push).
- Merge `dev-front` → `dev` en fin de session ou par groupe logique (en local, puis `git push`) ; `npm audit` (front et back) avant chaque merge sur `dev`.
- **`main` est protégée** (ruleset GitHub « Protection main ») : pas de push direct ; `dev` → `main` **uniquement par pull request**, mergeable seulement si la CI est verte.
- **CI GitHub Actions** (`.github/workflows/ci.yml`) à chaque push sur `dev-front`, `dev`, `main` et à chaque PR vers `dev` / `main` — 3 blocs en parallèle : *Frontend* (lint, tests, build), *Backend (tests unitaires)*, *Backend (tests d'intégration)* sur une **base PostgreSQL jetable** (migrations `prisma migrate deploy` + `roles.sql` + seed, mots de passe factices). Le lint doit rester à **0 erreur** (les avertissements ne bloquent pas).
- Piège : `git checkout dev` peut échouer à cause de fichiers créés par Docker (propriétaire `root`) → `sudo chown -R $USER:$USER <dossier>` avant.

---

## 10. Migrations Prisma — procédure obligatoire (SQL brut)

`npx prisma migrate dev` est **bloqué** : le compte `sensolidaire_owner` n'a pas le droit `CREATEDB`, nécessaire à la « shadow database ». Toutes les migrations se font **à la main, en SQL** :

1. Modifier `backend/prisma/schema.prisma` (ajouter le champ / le modèle).
2. Créer le dossier de migration :
   ```bash
   mkdir backend/prisma/migrations/$(date +%Y%m%d%H%M%S)_nom_de_la_migration
   ls backend/prisma/migrations | grep nom_de_la_migration   # récupérer le nom exact
   ```
3. Écrire le SQL :
   ```bash
   cat > backend/prisma/migrations/<nom_exact>/migration.sql << 'EOF'
   ALTER TABLE "MediaPost" ADD COLUMN "author" TEXT;
   EOF
   ```
4. Appliquer le SQL :
   ```bash
   docker compose exec -T postgres psql -U sensolidaire_owner -d sensolidaire -c 'ALTER TABLE ...;'
   ```
5. Marquer la migration comme appliquée :
   ```bash
   docker compose exec backend npx prisma migrate resolve --applied <nom_exact>
   ```
6. Régénérer le client puis redémarrer :
   ```bash
   docker compose exec backend npx prisma generate
   docker compose restart backend
   ```
7. Si des fichiers apparaissent en propriétaire `root` : `sudo chown -R $USER:$USER backend/prisma/migrations/`.

Rappels :
- Attention aux **guillemets doubles** autour des noms de tables/colonnes Prisma (`"MediaPost"`).
- Sur une table déjà remplie, une colonne obligatoire doit avoir une valeur par défaut (ou être facultative).
- **Une migration recrée la structure, jamais les données.**

---

## 11. Seed

`backend/prisma/seed.js` ne crée plus que le compte **admin** (`admin@sensolidaire.org`, mot de passe = `ADMIN_PASSWORD`).

**Tous** les contenus (missions, lieux, délégations, témoignages, médias, équipe, partenaires, rapports, actions terrain, sections et cartes Éducation) sont **gérés via le dashboard** et ne doivent **jamais** revenir dans le seed.

**Règle** : dès qu'un CRUD dashboard existe pour une ressource, retirer son bloc du seed (et la ligne du récap final). Un `deleteMany({})` dans le seed effacerait les vraies données de la cliente.

Vérifier la syntaxe sans exécuter : `node --check prisma/seed.js`.

Sauvegarde / restauration de la base : `docs/sauvegarde-restauration.md` (`pg_dump`, restauration testée dans une base dédiée). Le volume Docker **n'est pas** une sauvegarde.

---

## 12. Sécurité

Audit réalisé par Alison le 26/08/2026 (branche `fix/audit-securite-aout`, mergée) — 7 failles corrigées :

- faille d'upload (path traversal via le nom de fichier) ;
- XSS stocké ;
- durée du JWT access token ramenée à **15 min** ;
- injection HTML dans les e-mails de contact ;
- consentement RGPD codé en dur corrigé ;
- séparation des droits PostgreSQL (2 comptes) ;
- mass assignment sur la modération (statut forcé côté serveur).

Gestion des erreurs HTTP (6 novembre) : les erreurs Prisma sont traduites dans le gestionnaire global de `app.js` (`utils/prismaErrors.js` : `P2025` → 404, `P2002` → 409), une origine CORS refusée renvoie 403. Ne plus rattraper `P2025` service par service.

À conserver : Helmet en premier dans `app.js`, CORS restreint (localhost, ngrok, 192.168.x), refresh token en cookie HTTP-only, aucune donnée de `req.body` utilisée pour un champ que le serveur doit imposer.

Dernier `npm audit` : 08/11/2026, `npm audit fix` front et back — plus aucune vulnérabilité critical ni high ; restent des moderate dans les outils de développement (`jest`, `nodemon`, `eslint`), corrigeables seulement avec `--force` (rétrogradations cassantes, à ne pas faire). Journal de veille : `docs/veille.md`.

**Avant la production** : changer le mot de passe admin.

---

## 13. Tests

Environ **415 tests**, tous verts dans la CI (détail complet : `README.md`, section Tests).

| Commande | Contenu | Base |
|---|---|---|
| `docker exec sensolidaire_backend npm run test:unit` | 90 tests unitaires backend (`tests/unit/` : utils, jwt, authMiddleware) | Non |
| `docker exec sensolidaire_backend npm run test:integration` | ~190 tests Supertest : CRUD des 7 ressources du dashboard (scénario commun `tests/helpers/adminCrud.js`), missions, témoignages, upload, auth, routes publiques, sécurité, contact | **Oui** |
| `docker exec sensolidaire_frontend npm run test:run` | ~135 tests Vitest : `unit/` (dont `useSEO`), `components/` (dont accessibilité), `pages/` (API simulée) | Non |

Règles :
- **Dans la CI**, les tests d'intégration tournent sur une base jetable (aucun risque). **En local**, ils tournent sur la vraie base (contenus de la cliente) : ils ne touchent qu'aux enregistrements marqués `jest-test`, nettoyés avant et après. Tout nouveau test doit respecter ce marqueur et ne **jamais** faire de suppression en masse. Faire un `pg_dump` avant le premier lancement.
- Ils se connectent avec le compte admin : la session du dashboard doit ensuite se reconnecter (un seul refresh token actif).
- Aucun test ne doit envoyer de vrai e-mail (contact testé uniquement sur ses refus).
- Nouveau CRUD dashboard → appeler `describeAdminCrud()` dans un nouveau `Xxx.admin.test.js`.
- `frontend/tests/unit/duplicatedRules.test.js` n'est exécuté que sur le poste (exclu automatiquement du conteneur, qui ne voit pas `backend/`).
- Manuel : `docs/test_postman_back.md`.

---

## 14. Documents importants à consulter

| Fichier | Quand le lire |
|---|---|
| `README.md` | Installation, architecture, diagrammes BDD à jour, tests |
| `docs/planning.md` | **Source de vérité de ce qui reste à faire** (numéros de tâches, statuts) |
| `docs/journal-de-bord/` | Journal de bord, **un fichier par jour** (`AAAA-MM-JJ.md`, index et modèle dans `README.md`) : décisions, bugs, justification de chaque choix. `docs/JDB.md` ne contient plus qu'un renvoi |
| `docs/modif-en-cours-de-dev.md` | Écarts par rapport aux guides de conception initiaux, avec justification |
| `docs/bugTracker.md` | Bugs déjà rencontrés et leur solution — **à consulter avant de déboguer** |
| `docs/guide-de-style.md` | Design system (attention : valeurs de palette anciennes, voir section 7) |
| `docs/questions-cliente.md` | Points en attente de réponse de la cliente |
| `docs/sauvegarde-restauration.md` | Procédure `pg_dump` / restauration |
| `docs/veille.md` | Journal de veille sécurité |
| `docs/sprintReviews.md`, `docs/sprintRetrospectives.md` | Bilans de sprint |
| `docs/routine_quotidienne.md` | Démarrage / arrêt de l'environnement, ngrok |
| `docs/test_postman_back.md` | Runbook des tests API manuels |
| `docs/schema-physique.sql` | Schéma physique SQL |
| `docs/guide1-*.docx`, `docs/guide2-*.docx`, `docs/guide3-*.docx` | Conception initiale (contexte, architecture, BDD/sécurité, API/séquences/responsive, livraison) |
| `docs/Diagram.pdf` | Diagramme d'architecture |

---

## 15. Ce qui a été fait

### Phase 1 — MVP (28 mai › 3 juillet 2026, en binôme)

- Initialisation : monorepo, Docker Compose, React + Tailwind v4 + Vite, Express, Prisma v7 + PostgreSQL.
- Design system Figma complet, maquette de l'accueil, composants de base (Button, Badge, Modal), Layout (Navbar + Footer).
- Auth JWT (access + refresh), middleware, bcrypt.
- Pages : accueil connectée à l'API, `/missions` (4 sections par type, filtres, ancres), détail mission, témoignages (soumission + RGPD), contact (Resend), pages légales, soutenir, rapports, à propos, équipe, lieu.
- Dashboard : CRUD missions (formulaire en 9 blocs), modération des témoignages.
- Responsive mobile-first, Navbar avec dropdown missions dynamique.
- **MVP validé par la cliente en démo.** Périmètre MVP : 5 missions de volontariat international (Pérou, Sénégal, Sri Lanka, Kenya, Sumatra).

### Phase 2 — Dashboard étendu + qualité (juillet › août 2026)

- Upload Multer, FK `mission_id` sur `MissionReport`, `LignesToPuces` réutilisable, Vitest + RTL, README complet.
- Reprise du 1er août : hard delete missions, Location ↔ Mission many-to-many, Service Civique (formulaire + champs dédiés), `FormElements.jsx`.
- Audit sécurité (voir section 12), tests passés de 12 à 20.

### Phase 3 — Développement solo (depuis le 18/09/2026)

- **Bloc A — UX dashboard (terminé)** : modale réutilisable, upload avec redimensionnement + WebP, description courte automatique (`---`), palette dédiée au dashboard, navigation par ancres dans les formulaires, refonte de la galerie (migration + page Galerie dédiée), Service Civique fusionné dans Missions, tarifs/inclus standards pré-remplis (la cliente a harmonisé les tarifs : mêmes prix par durée pour toutes les missions).
- **Bloc B — CRUD manquants (terminé)** : Location, Delegation, TeamMember, ActivityReport (envoi du PDF depuis l'ordinateur), Partner, Testimonial + MissionReport, FieldAction (+ pays, tags, ODD), MediaPost (formulaire unique lien/fichier/article, auteur, source, temps de lecture, photos unifiées, audio mp3/m4a). Seed nettoyé en conséquence.
- Harmonisation du vocabulaire du dashboard (vouvoiement, « Adresse de la page »), erreurs par champ, `FormActionBar` collante, `ShortDescriptionPreview` partagé (4 formulaires), liens internes en `<Link>`.
- Règle `isValidSlug` commune front/back.
- **6 novembre — priorité 1 avant soutenance** : modales d'erreur au lieu des `alert` (127), filtres pays dérivés des données (170), découpage de `api.js` (128), dashboard sur téléphone (125), vidéos YouTube dans les articles (123), ménage du code (129), erreurs Prisma → 404 / 409, suite de tests unitaires + intégration (126). Bugs corrigés au passage : BUG-56 à BUG-65 (`docs/bugTracker.md`).
- **8 novembre — outillage et finitions** : Docker installé dans WSL à la place de Docker Desktop (sauvegarde + restauration de la base), CI GitHub Actions (lint, tests, build, tests d'intégration sur base jetable) et protection de `main`, `npm audit fix`, accessibilité (173 : boutons-liens, lien d'évitement, focus visible, modales, icônes nommées), SEO (174 : `useSEO` sur les 19 pages publiques), lazy loading (130 : JavaScript initial divisé par 2). Bugs : BUG-67 à BUG-72.
- **10 novembre** : images statiques en WebP (131), corrections issues de Lighthouse (134 : libellés du formulaire de contact, contraste, décalage de page, port 4173 pour mesurer la version de production).
- **11-12 novembre — Bloc C** : page Éducation générée depuis le dashboard (sections, cartes, menu d'ancres automatique), « Pays concerné » France / Suisse (172D), seed réduit au compte admin, journal de bord découpé par jour, section ODD partagée (178).

---

## 16. Ce qui reste à faire

Référence : `docs/planning.md` (toujours vérifier les statuts là-bas, ils peuvent avoir évolué).

### Priorité 1 — avant la soutenance (23 novembre)

Tâches 123, 125, 126, 127, 128, 129 et 170 **terminées le 6 novembre** ; 130 (lazy loading), 173 (accessibilité), 174 (SEO), 175 (Docker dans WSL), 176 (CI), 177 (`npm audit fix`) **terminées le 8 novembre** (voir `docs/planning.md`). Tests d'intégration exécutés pour la 1re fois dans la CI : tous verts. BUG-66 (CV dans l'historique Git) : **décision de ne pas réécrire l'historique**. Reste :

| N° | Tâche |
|---|---|
| 134 | Audit Lighthouse (objectif > 90) — chiffres pour le diaporama |
| 129B | 20 avertissements lint `react-hooks` (`useEffect`) — après la soutenance |

### Bloc C — Page Éducation & sensibilisation

**Livré les 11 et 12 novembre** (172, 172A, 172C, 172D côté dashboard). Fixes (structure, non modifiables par la cliente) : hero, menu d'ancres (généré à partir des sections visibles), section ODD, appel à contacter final. Section ODD refaite en composant partagé (178, 12 novembre). Reste : 172B (contenu réel), pages `/france` et `/suisse` (voir ci-dessous).

#### Fonctionnalité à venir — Rattachement pays (France / Suisse)

> Besoin exprimé par Delphine au rdv du 04/11/2026.
> Statut : **conception validée**, développement **après la soutenance DWWM** (livraison visée avant fin 2026).

#### Besoin

- Les financeurs (subventions) demandent des **liens vers le site**.
- Les financeurs suisses doivent voir les actions liées à la Suisse, les français celles liées à la France.
- Delphine ne veut **pas mettre en avant** les actions d'un pays auprès des financeurs de l'autre.
- Un site public ne peut pas *cacher* un contenu : l'objectif est de **ne pas mettre en avant**, pas de masquer.

#### Décisions

- **Un seul champ** `enum` sur les contenus concernés : `FRANCE` | `SUISSE` | `COMMUN`
  - Obligatoire (sinon le contenu n'apparaît sur aucune page pays)
  - `COMMUN` = apparaît sur `/france` **et** `/suisse`
  - Pas de table de liaison : un contenu n'a qu'un seul rattachement (un financeur ne finance pas si l'autre l'a déjà fait — à faire confirmer par Delphine)
- **Le rattachement ≠ le lieu de l'action.** Ex : puits au Sénégal construit par des élèves suisses → lieu Sénégal, rattachement `SUISSE`.
- **Dans le dashboard** : un simple menu déroulant à la création / édition.

#### Contenus concernés (3 seulement)

| Contenu | Rubrique | Rattachement |
|---|---|---|
| Offres éducatives (ateliers, correspondance scolaire) | Éducation et sensibilisation | souvent `COMMUN` |
| Relais éco-école | Éducation et sensibilisation | `FRANCE` |
| Actions terrain (puits, potager…) | Actions terrain | selon qui porte l'action |
| Actualités / événements (plaidoyer Genève, ONU, La ville est à nous, salons…) | Actualités | `FRANCE` ou `SUISSE` |

**Non concernés** : missions, témoignages, rapports de mission, équipe, dons.

#### Logique « offre / réalisation »

- **Offre** = ce que l'asso *propose* → rubrique Éducation (ou Groupes jeunes), souvent `COMMUN`
- **Réalisation** = ce que l'asso *a fait* → Actualités (et/ou Actions terrain), toujours **un seul pays**
- Ex : « Atelier tri des déchets » = offre `COMMUN` ; « Atelier à l'école X, 30 élèves de CE2 » = actu `FRANCE`
- Un voyage de groupe jeune avec réalisation sur place = **2 contenus** : une actu (le récit) + une action terrain (le concret), même rattachement
  - Ex : école Steiner de Genève → `SUISSE`
  - V1 : lien manuel dans le texte de l'actu vers l'action terrain / V2 : relation en BDD

#### Pages

- `/suisse` et `/france` : une page par pays, alimentée **automatiquement** depuis la BDD, en 3 blocs (Éducation / Actions terrain / Actualités)
  - Hero avec texte de présentation + chiffres clés (contenu à demander à Delphine)
  - Navbar et footer normaux (page classique du site)
  - **Pas de lien vers l'autre pays** sur ces pages
- Pages générales (`/actions`, `/actualites`, `/education`) : **inchangées, mixtes et neutres**, pas de mise en avant d'un pays
- Les cards sont **réutilisées** : un même contenu existe une seule fois en BDD et s'affiche à plusieurs endroits
- Dashboard : encart « Liens financeurs » avec bouton **Copier le lien**

#### Découpage

1. Conception ✅
2. Inventaire des modèles ✅ (sections Éducation, actions terrain, articles)
3. BDD : enum + champ sur les modèles concernés ✅ (11 novembre)
4. API : rattachement enregistré et validé ✅ — **filtre par pays à faire**
5. Dashboard : cases « France » / « Suisse » + colonne « Pays concerné » ✅ — **encart « Liens financeurs » à faire**
6. Front : pages `/france` et `/suisse` (prix en euros sur `/france`, en francs suisses sur `/suisse`)
7. Validation avec Delphine

#### Questions ouvertes pour Delphine

- Une action peut-elle vraiment n'avoir qu'**un seul** pays de rattachement ?
- Pays **séparés partout** sur le site, ou juste **pas mis en avant** côte à côte ?
- Quel contenu en haut des pages pays (texte, chiffres clés) ?
- Lancement de la correspondance scolaire en Suisse confirmé ?

#### Idées en plus

- Bloc « Ils sont partis avec nous » sur la page Groupes jeunes (nécessite une catégorie sur les actualités)
- Relation BDD actu ↔ action terrain
- Encourager Delphine à publier une actu + photo après chaque atelier (preuve pour les financeurs + SEO)

### Bloc D / E — Finitions front et qualité

Faits le 8 novembre : accessibilité basique (173), SEO basique (174, hook `useSEO`), lazy loading des pages et des images (130). Restent : audit WCAG 2.1 AA (136), optimisation des images de production, `maxLength={280}` sur le textarea des témoignages (partiel), factorisation `PageLayout`, audit Lighthouse (objectif > 90).

### Bloc F — Remplir le site avec les vraies données

Équipe + rapports d'activité, rapports de mission + témoignages, actions terrain, blog/médias, éducation.

### Bloc G — Déploiement et livraison

- Cible : **VPS OVH** (la cliente est chez OVH, le domaine `sensolidaire.org` y reste).
- Dockerfiles de production (multi-stage), Nginx + SSL, variables d'environnement et secrets de prod, monitoring (UptimeRobot), tests en production, guide utilisateur du dashboard (PDF), remise des accès.
- **Migration des données** (plan retenu) : `pg_dump` de la base locale → création de la base de prod → `prisma migrate deploy` (structure) → import des données. **Étape par étape, jamais en une seule commande automatique.**
- Ne pas oublier : `VITE_API_URL` / proxy (le proxy Vite n'existe qu'en dev), `FRONTEND_URL` pour CORS, mot de passe admin, fichiers de `backend/public/uploads/` à transférer.

### Points ouverts à clarifier

- Bouton « Se souvenir de moi » sur `LoginAdmin.jsx` : comprendre ce qu'il fait réellement (stockage navigateur ? redondant avec l'auto-remplissage ?) puis décider de le garder, clarifier ou retirer.
- `docs/questions-cliente.md` : plusieurs réponses encore vides (logo blanc, SIRET, photos HD, droits à l'image…).

### Backlog V2 (après livraison)

Galerie 15-20 photos, contenu générique éditable, Buffer API (brouillon réseaux sociaux à la publication d'un article), Instagram oEmbed, latitude/longitude + embed Google Maps propre, `location_id` sur `Delegation`, sélection manuelle des actions terrain de l'accueil, éditeur riche TipTap, compteurs `StatsBar` éditables, congé solidaire Sumatra, `MissionFieldAction`, `mission_id` sur `MediaPost`, recadrage d'image, récupération des PDF de l'ancien site, support HEIC, rôles admin/invité, tooltips stylées, restauration du scroll après F5, fabrique `createResourceApi`, unification des images de mission dans `Media`, bilingue FR/EN.

---

## 17. Pièges connus (gain de temps)

- **Logs Docker en UTC** : vérifier l'heure d'une erreur avant de conclure que la correction n'a pas marché.
- **Dépendance absente dans le conteneur** après ajout : le volume anonyme `node_modules` est périmé → `docker exec <conteneur> npm install` (ou rebuild).
- **Port 5174 au lieu de 5173** : un `npm run dev` manuel tourne en parallèle.
- **Prisma Studio** : « Could not load schema metadata » dans Docker → utiliser `psql`.
- **`npx prisma generate` + `docker compose restart backend`** sont nécessaires après toute modification du schéma.
- **Fichiers en propriétaire root** créés par Docker (migrations, dossiers) → `chown`.
- `vite.config.js` : `allowedHosts` contient l'URL ngrok actuelle ; la changer si ngrok est relancé.
- Le `README.md` mentionne Prisma Studio sur `:5555` : il ne fonctionne pas (voir ci-dessus).
- **Tests backend hors Docker** : le client Prisma du poste (`backend/node_modules`) est périmé → `prisma.xxx` undefined. Les tests d'intégration se lancent dans le conteneur ; `npm run test:unit` fonctionne partout.
- **Vitest** refuse un import calculé (chemin dans une variable) hors de `frontend/` : écrire le chemin relatif en entier.
- `git acp` ajoute **tout** : pour des commits thématiques, `git add <fichiers>` puis `git commit`.
- **`ports are not available … 5432`** au démarrage de la base : le PostgreSQL natif de WSL tourne → `sudo systemctl stop postgresql` (BUG-67).
- **Build Vite hors Docker : `EACCES … frontend/dist`** : le dossier a été créé par Docker (propriétaire `root`) → `sudo chown -R $USER:$USER frontend/dist`. Sans effet sur la CI.
- **Restaurer un `pg_dump` dans une base neuve** : recréer d'abord les 2 comptes (`roles.sql`), qu'une sauvegarde ne contient pas (voir `docs/sauvegarde-restauration.md`).
- **Lien vers une ancre d'une autre page** (`/soutenir#don`) : `RouteScrollReset` remonte en haut de page, l'ancre n'est pas atteinte → lier la page seule.

---

## 18. Points d'attention relevés dans le dépôt (à traiter avec Gwen)

- Fichiers de test et CV retirés du suivi Git et du disque (6 novembre). Le CV reste dans l'**historique** du dépôt public (commit `d432efa`) : **décision du 8 novembre de ne pas réécrire l'historique** (BUG-66, risque accepté). Ne pas reproposer la purge.
- Avant la production : si Nginx ajoute une Content-Security-Policy, autoriser `i.ytimg.com` (images) et `www.youtube-nocookie.com` (iframe) ; mentionner YouTube sur la page Cookies.
- `docker-compose.yml` définit `VITE_API_URL: http://localhost:3000` alors que `api.js` utilise `/api` en relatif (variable inutilisée) et que le backend est exposé sur 3001.
- Numérotation du planning dédoublonnée le 8 novembre : 127, 128 et 129 désignent les tâches **terminées** (alert, `api.js`, ménage) ; Bloc C → 172 (172A/B/C), accessibilité → 173, SEO → 174.