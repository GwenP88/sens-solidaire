# Planning de développement — Sens Solidaires
*Pichot Gwen & Amblard Alison (jusqu'à fin août) · Pichot Gwen seule à partir du 18/09/2026*
*Holberton School — Thonon-les-Bains*
*Mise à jour : 18 septembre 2026 — reprise post-pause, Alison en alternance, audit complet du repo effectué avant réécriture de ce planning*

**Légende** : ✅ Terminé · ⚠️ Partiel · 🔵 À faire · 🔴 Bloqué
**Devs (historique)** : Gwen (frontend + design) · Alison (backend + BDD) · Ensemble = tâches communes

---

## Phase 1 — 28 mai › 3 juillet 2026 : MVP ✅ LIVRÉ

---

### S1 — 28 › 30 mai · Initialisation ✅

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 01 | Gwen | Repo GitHub + monorepo + branches | ✅ |
| 02 | Gwen | React + Tailwind CSS v4 + Vite + React Router | ✅ |
| 03 | Alison | Node.js + Express + route /api/health | ✅ |
| 04 | Alison | PostgreSQL + Prisma v7 + tables MVP | ✅ |
| 05 | Ensemble | Docker Compose + Dockerfiles dev | ✅ |
| 06 | Ensemble | .env + .gitignore + test docker compose up | ✅ |

---

### S2 — 2 › 6 juin · Fondations frontend + Auth backend ✅

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 07 | Gwen | Système de composants Figma complet | ✅ |
| 08 | Gwen | Page Accueil assemblée dans Figma | ✅ |
| 09 | Gwen | Tailwind — design system (palette, typographie, utilities) | ✅ |
| 10 | Gwen | Composants de base : Button, Badge, Modal | ✅ |
| 11 | Gwen | Layout global : Navbar + Footer + Outlet | ✅ |
| 12 | Gwen | Page Accueil statique | ✅ |
| 13 | Gwen | Page Login admin | ✅ |
| 14 | Alison | Auth JWT : login / logout / refresh token | ✅ |
| 15 | Alison | Middleware authMiddleware | ✅ |
| 16 | Alison | Route POST /api/auth/login + bcrypt | ✅ |
| 17 | Alison | Seed BDD — données de test | ✅ |
| 18 | Ensemble | Test connexion front ↔ back + Docker | ✅ |

---

### S3 — 9 › 13 juin · Missions ✅

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 19 | Gwen | Page Accueil connectée API | ✅ |
| 20 | Gwen | Page /missions — 4 sections + filtres + AnchorNav | ✅ |
| 21 | Gwen | Page /missions/:slug — détail mission complet | ✅ |
| 22 | Alison | Seed BDD — données réalistes | ✅ |
| 23 | Alison | GET /api/missions (liste + filtres) | ✅ |
| 24 | Alison | GET /api/missions/:slug + pricing + locations + testimonials | ✅ |
| 25 | Alison | Service + Controller missions | ✅ |

---

### S4 — 16 › 20 juin · Témoignages + Contact + Pages secondaires ✅

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 26 | Gwen | Page /temoignages — filtres, grille, modale soumission | ✅ |
| 27 | Gwen | GET + POST /api/testimonials | ✅ |
| 28 | Gwen | Page /contact + ContactForm + RGPD | ✅ |
| 29 | Gwen | POST /api/contact + Resend | ✅ |
| 30 | Gwen | Pages légales : mentions, confidentialité, cookies | ✅ |
| 31 | Gwen | Page /soutenir — refonte narrative + section émotionnelle | ✅ |
| 32 | Gwen | Page /rapports-activite — grille PDFs | ✅ |
| 33 | Gwen | Page /a-propos | ✅ |
| 34 | Gwen | Page /equipe | ✅ |
| 35 | Alison | CRUD /api/admin/missions (back) | ✅ |
| 36 | Alison | Dashboard admin — sidebar + layout + routes protégées | ✅ |
| 37 | Alison | PATCH /api/admin/testimonials/:id — modération | ✅ |
| 38 | Ensemble | Flux complet : soumission → modération → affichage | ✅ |

---

### S5 — 23 › 27 juin · Dashboard + Responsive ✅

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 39 | Alison | Dashboard : CRUD missions front | ✅ |
| 40 | Alison | Dashboard : modération témoignages | ✅ |
| 41 | Alison | Dashboard : routage email contact | ✅ |
| 42 | Gwen | Responsive mobile-first toutes pages MVP (375 / 768 / 1024 / 1440) | ✅ |
| 43 | Gwen | Harmonisation CSS — gap scale, utilities, Section/CTASection | ✅ |

---

### S6 — 30 juin › 3 juillet · Sprint final MVP ✅

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 44 | Gwen | Migration pages restantes : LocationDetail, MediaDetail, MediaEtActualites, MissionDetail, Missions, Soutenir | ✅ |
| 45 | Gwen | LocationDetail enrichi — contacts délégation FK, iframe Google Maps, galerie | ✅ |
| 46 | Gwen | BDD — 5 migrations : delegation_id, map_url, website_url, show_homepage, FieldActionCountry | ✅ |
| 47 | Gwen | Seed refacto — délégations avant locations, pays multi-valeurs, show_homepage | ✅ |
| 48 | Gwen | FooterCta dynamique par route — suppression CTASection sur toutes les pages | ✅ |
| 49 | Gwen | Education.jsx refonte — ODD + AnchorNav + sections Éco-École/Correspondances/Ateliers | ✅ |
| 50 | Gwen | Renommage "Sens Solidaire" → "Sens Solidaires" (grep + sed, 23 occurrences) | ✅ |
| 51 | Gwen | Home — CTA témoignage + section Actualités show_homepage + logos partenaires | ✅ |
| 52 | Ensemble | Merge dev-front → dev | ✅ |
| 62 | Gwen | Navbar dropdown missions dynamique — 2 colonnes (destinations API + S'engager autrement statique) | ✅ |
| 63 | Gwen | `MissionFormPage` — page formulaire CRUD complet (9 blocs, création + édition) | ✅ |
| 64 | Gwen | Back — `pricingService` + `mediaService` + routes `PUT /:id/pricing` et `PUT /:id/media` | ✅ |
| 65 | Gwen | `MissionDetail` refonte complète — puces `LignesToPuces`, programme JSON, AnchorNav dynamique, galerie BDD | ✅ |
| 66 | Gwen | Seed reformaté — `volunteer_role`, `health_info`, `admin_info`, `included`, `not_include` en texte brut `\n`, `programme` en JSON | ✅ |
| 53 | Ensemble | 🎯 LIVRAISON MVP — 3 juillet 2026 | ✅ |

---

## Phase 2 — 7 juillet › 1er août 2026 : Dashboard complet + Finitions front

---

### S7 — 7 › 11 juillet · Dashboard étendu

| # | Dev | Tâche | Statut d'origine | **Statut vérifié 18/09 (audit repo)** |
|---|---|---|---|---|
| 54 | Alison | Dashboard : gestion médias (upload image, show_homepage) | ⚠️ Partiel | ⚠️ **Confirmé partiel** — `PUT /api/admin/missions/:id/media` fonctionne pour les médias **d'une mission**. Aucun CRUD pour les articles (`MediaPost`) en tant qu'entité autonome |
| 55 | Alison | Dashboard : gestion équipe (CRUD membres) | 🔵 | 🔵 **Confirmé non fait** — `teamMemberRoutes.js` en lecture seule (GET uniquement), aucune route admin |
| 56 | Alison | Dashboard : gestion rapports d'activité | 🔵 | 🔵 **Confirmé non fait** — même constat, lecture seule |
| 57 | Alison | Dashboard : CRUD actions terrain + pays + tags | 🔵 | 🔵 **Confirmé non fait** — même constat |
| 58 | Alison | Dashboard : responsive | 🔵 | 🔵 **Confirmé non fait** — `DashboardSidebar.jsx` : sidebar explicitement masquée en mobile (commentaire dans le code) |
| 59 | Alison | APIs restantes : locations, équipe | 🔵 | 🔵 **Confirmé non fait** — `locationRoutes.js`, `delegationRoutes.js`, etc. : GET public uniquement, aucune route POST/PATCH/DELETE protégée |
| 60 | Gwen | Upload Multer | 🔵 | ✅ **Fait** (non marqué à l'époque) — `adminUploadRoutes.js` + `uploadController.js` + `AdminFileUpload.jsx`, validation stricte du type de fichier (héritée de l'audit sécurité) |
| 61 | Alison | Tests d'intégration dashboard | 🔵 | ⚠️ **Partiel** — missions + témoignages + upload couverts (20 tests Jest/Supertest dans `backend/tests/`). Rien pour les futurs CRUD équipe/locations/etc. (normal, ils n'existent pas encore) |
| 62 | Gwen | Navbar dropdown missions dynamique — 2 colonnes (destinations API + S'engager autrement statique) | ✅ | ✅ Confirmé |
| 63 | Gwen | `MissionFormPage` — page formulaire CRUD complet (9 blocs, création + édition) | ✅ | ✅ Confirmé |
| 64 | Gwen | Back — `pricingService` + `mediaService` + routes `PUT /:id/pricing` et `PUT /:id/media` | ✅ | ✅ Confirmé |
| 65 | Gwen | `MissionDetail` refonte complète — puces `LignesToPuces`, programme JSON, AnchorNav dynamique, galerie BDD | ✅ | ✅ Confirmé |
| 66 | Gwen | Seed reformaté — `volunteer_role`, `health_info`, `admin_info`, `included`, `not_include` en texte brut `\n`, `programme` en JSON | ✅ | ✅ Confirmé |

---

### S7 (suite) — 5 juillet · Documentation, qualité & dette technique

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 92 | Gwen & Alison | README.md complet — architecture, BDD (5 domaines), fonctionnalités, installation, tests, équipe | ✅ |
| 93 | Alison | Ajout FK `mission_id` sur `MissionReport` (relation vers `Mission`, optionnelle) + migration Prisma | ✅ |
| 94 | Gwen | Extraction `LignesToPuces` en composant réutilisable (`components/ui/`) | ✅ |
| 95 | Gwen | Setup Vitest + React Testing Library (config `vite.config.js`, `setupTests.js`) | ✅ |
| 96 | Gwen | Tests unitaires frontend : `LignesToPuces`, `Button`, `TestimonialForm`, `LoginAdmin` (avec mock API) | ✅ |
| 97 | Gwen | Résolution vulnérabilité `npm audit` (vite) — frontend, 0 vulnérabilité restante | ✅ |

---

### S8 — 14 › 18 juillet · Finitions front + freeze

| # | Dev | Tâche | Statut d'origine | **Statut vérifié 18/09 (audit repo)** |
|---|---|---|---|---|
| 67 | Gwen | Accessibilité basique — alt, aria-label, focus-visible | 🔵 | 🔵 **Confirmé non fait** — plusieurs pages sans aucun `alt` (Équipe, Rapports d'activité, Témoignages, pages légales, Médias et actualités...) |
| 68 | Gwen | SEO basique — SEOHead (title, meta, Open Graph) par page | 🔵 | 🔵 **Confirmé non fait** — composant `SEOHead` inexistant dans le repo |
| 69 | Gwen | Lazy loading — `loading="lazy"` sur toutes les images cards/grilles | 🔵 | 🔵 **Confirmé quasi pas fait** — 1 seule occurrence sur tout le site |
| 70 | Gwen | `maxLength={280}` sur textarea témoignage dashboard | 🔵 | 🔵 À vérifier/faire |
| 71 | Gwen | Buffer API — auto-draft réseaux sociaux à la publication (V2) | 🔵 | 🔵 Toujours V2, non prioritaire |
| 72 | Gwen | `PageLayout` — factoriser bg-surface + ScrollToTop + HeroPage | 🔵 | 🔵 **Confirmé non fait** — composant inexistant |
| 73 | Ensemble | Corrections bugs post-recette | 🔵 | — |
| 74 | Ensemble | 🧊 Code freezé — pause estivale (18 juillet) | 🔵 | ✅ (fait, historique) |

---

### S9 — 1er août · Reprise post-pause — Hard delete + Lieux partagés + Service Civique dashboard

| # | Dev | Tâche | Statut d'origine | **Statut vérifié 18/09 (audit repo)** |
|---|---|---|---|---|
| 98 | Gwen | Hard delete missions — transaction + dashboard (pause/suppression définitive) | ✅ | ✅ **Confirmé** — `hardDelete()` dans `missionService.js`, transaction Prisma (pricing + media + mission supprimés ensemble) |
| 99 | Gwen | Location ↔ Mission — migration many-to-many | ✅ | ✅ Confirmé |
| 100 | Gwen | ServiceCiviqueFormPage + ServiceCiviquePage (dashboard complet) | ✅ | ✅ Confirmé — fichiers présents et fonctionnels |
| 101 | Gwen | ServiceCiviqueDetail.jsx — page publique complète | ✅ | ✅ Confirmé |
| 102 | Gwen | country_preposition — champ éditable (Mission + Service Civique) | ✅ | ✅ Confirmé (non re-vérifié champ par champ) |
| 103 | Gwen | Champs competences + info_service_civique_url | ✅ | ✅ Confirmé (idem) |
| 104 | Gwen | Garde-fou type sur MissionDetail/ServiceCiviqueDetail | ✅ | ✅ Confirmé (idem) |
| 105 | Gwen | FormElements.jsx — extraction composants formulaire partagés | ✅ | ✅ Confirmé — fichier présent |

---

## Pause estivale — Août 2026 🧊

Code freezé côté développement produit. En parallèle : **Alison a mené un audit de sécurité complet sur `dev`** (26 août), mergé dans `dev-front` le 18 septembre sans conflit.

### Sécurité — Audit du 26 août (Alison) — résumé

7 failles corrigées : upload/path traversal, XSS stocké via upload, durée JWT (7j → 15min), injection HTML dans les emails de contact, consentement RGPD codé en dur, code mort dupliqué (`authController.js`), robustesse upload (400/413 au lieu de 500). Plus : séparation des droits PostgreSQL (2 comptes — `sensolidaire_owner` migrations / `sensolidaire_app` runtime), 20 tests (vs 12 avant), documentation complète (schéma physique, procédure sauvegarde/restauration, diagrammes de séquence, veille technologique).

**4 dettes techniques assumées et documentées** (non bloquantes en V1) :
- `authMiddleware` vérifie l'authentification mais pas l'autorisation fine par rôle (un seul rôle existe aujourd'hui) → **directement lié au point "compte admin + compte invité" du 18/09, voir Bloc A ci-dessous**
- Pas de rate limiting sur le login ni l'upload public
- Timing attack théorique sur le login (non exploitable : un seul compte admin)
- Type de fichier upload basé sur le MIME déclaré, pas le contenu réel (le vecteur dangereux est déjà fermé par ailleurs)

Détail complet dans `docs/bugTracker.md`.

---

## Phase 3 — Développement solo (à partir du 18 septembre 2026)

*Alison a débuté son alternance — développement produit repris en solo par Gwen. Réorganisé par blocs de priorité plutôt que par semaines calendaires fixes, avec la soutenance DWWM (23-27 novembre) comme horizon. Contient les points UX relevés le 18/09 en parcourant le site.*

### Bloc A — UX dashboard (petits points relevés le 18/09 — rapides, à faire en premier)

| # | Tâche | Détail |
|---|---|---|
| 112 | Upload dashboard — redimensionnement auto + conversion WebP à l'import | Reprend et priorise l'ex-tâche 77 (Sharp), déplacée du Bloc E ici : pré-requis pour saisir proprement les visuels des missions ci-dessous, sans avoir à tout refaire plus tard |
| 113 | Saisir le contenu complet de toutes les missions existantes via le dashboard | Contenu figé une fois saisi (plus de changement après). Pré-requis pour pouvoir associer actions terrain, délégations, lieux et témoignages aux bonnes missions |
| 106 | Composant `Modal` dashboard réutilisable | Généraliser `ConfirmModal.jsx` (déjà utilisé pour la suppression/hard delete) pour qu'il serve aussi à la mise en pause |
| 107 | Bouton pause/reprise mission → modale perso | ⚠️ En cours : le texte de confirmation a été corrigé ("Mettre en pause" au lieu de "Supprimer") mais c'est toujours `window.confirm()` natif dans `MissionsPage.jsx`, pas la modale perso. Le bouton doit aussi changer d'icône (pause ↔ play) selon `is_active` |
| 108 | Retirer le bouton "Voir toutes les actions" — page Impact | — |
| 109 | Corriger le doublon "Réserver le vol" | Confirmé dans le code : dans `MissionFormPage.jsx`, l'étape 1 du bloc "Comment partir" dit "Réserver votre vol", et l'étape 3 (fixe, `HOW_TO_GO_FIXED`) dit "Réserver vos billets d'avion et nous les envoyer" — redondant |
| 110 | Prévoir compte admin + compte invité/service civique | Lié à la dette technique documentée dans `authMiddleware.js` (vérifie l'authentification, pas le rôle) — à concevoir avant d'introduire un 2ᵉ rôle, comme le précise déjà le commentaire du code |
| 111 | Revoir mise en page `MissionDetail` — section inclus/non inclus + tableau durée/prix | Trop de blancs, visuellement pas satisfaisant selon toi — idée de mise en page à détailler ensemble |

### Bloc B — Dashboard CRUD manquant (le plus gros morceau)

| # | Tâche | Origine |
|---|---|---|
| 59 | CRUD Location (admin) — routes + service + front dashboard | Ex-tâche 59 ("APIs restantes : locations, équipe") |
| — | CRUD Delegation (admin) | Nouveau — pas de # d'origine, identifié dans le Backlog V2 (01/08), jamais entré dans une semaine numérotée |
| 55 | CRUD TeamMember (admin) | Ex-tâche 55 |
| 57 | CRUD FieldAction + pays + tags (admin) | Ex-tâche 57 |
| 56 | CRUD ActivityReport (admin) | Ex-tâche 56 |
| 54 | CRUD MediaPost / articles (admin) | Partie non faite de l'ex-tâche 54 (le média d'**une mission**, lui, est déjà fait) |
| 58 | Dashboard responsive mobile | Ex-tâche 58 |
| 61 | Tests d'intégration | Ex-tâche 61 — **règle : chaque CRUD ci-dessus s'accompagne de son test au moment où il est codé**, pas d'un rattrapage global à la fin |

### Bloc C — Page Éducation & sensibilisation

| # | Tâche |
|---|---|
| 119 | Refonte contenu dynamique (actuellement en dur) + gestion dashboard |

### Bloc D — Finitions front (S8, reportées)

| # | Tâche |
|---|---|
| 67 | Accessibilité basique — alt, aria-label, focus-visible |
| 68 | SEO basique — `SEOHead` |
| 69 | Lazy loading |
| 70 | `maxLength={280}` textarea témoignage |
| 72 | `PageLayout` — factorisation |

### Bloc E — Polishing + SEO avancé (ex-Sept. S1 du planning initial)

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 75 | Gwen | Audit Lighthouse — objectif > 90 | 🔵 |
| 76 | Gwen | Optimisations WebP + images production | 🔵 |
| 77 | ~~Alison → à reprendre seule~~ | ~~Upload Sharp — redimensionnement auto WebP~~ | ➡️ Déplacé et priorisé en Bloc A #112 |
| 78 | Gwen | Bilingue FR/EN — react-i18next (si décision cliente) | 🔵 |
| 79 | Gwen | Accessibilité WCAG 2.1 AA — audit complet | 🔵 |
| 80 | Ensemble → seule | Seed BDD — contenus réels finaux fournis par la cliente | 🔵 |
| 81 | Ensemble → seule | Relecture complète tous les textes avec la cliente | 🔵 |

### Bloc F — Déploiement & livraison (ex-Sept. S2/S3 du planning initial)

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 82 | Gwen | Dockerfile production (multi-stage build) | 🔵 |
| 83 | Gwen | VPS + Docker + Nginx + SSL (Let's Encrypt) | 🔵 |
| 84 | Alison → à reprendre seule | Variables d'env production + secrets | 🔵 |
| 85 | Alison → à reprendre seule | Migration BDD production | 🔵 |
| 86 | Ensemble → seule | UptimeRobot monitoring + tests HTTPS | 🔵 |
| 87 | Ensemble → seule | Tests complets en production | 🔵 |
| 88 | Ensemble → seule | Guide utilisateur dashboard (PDF) | 🔵 |
| 89 | Ensemble → seule | Remise des accès à la cliente | 🔵 |
| 90 | Ensemble → seule | Corrections finales | 🔵 |
| 91 | Ensemble → seule | 🎉 LIVRAISON OFFICIELLE | 🔵 |

---

## Backlog V2 — Post-livraison

| Fonctionnalité | Description |
|---|---|
| CRUD dashboard Location/Delegation/TeamMember/FieldAction | Briques de base actuellement seed-only, utilisées par Mission — priorité identifiée le 01/08, **détaillé en Bloc B ci-dessus** |
| Buffer API | Auto-draft réseaux sociaux à la publication d'un article |
| Instagram oEmbed | Embed posts du feed Instagram (nécessite app Meta) |
| `latitude` / `longitude` sur Location | Embed Google Maps propre (remplace iframe URL) |
| `location_id` FK sur Delegation | Architecture bidirectionnelle Delegation ↔ Location |
| Sélection manuelle actions terrain home | Dashboard + champ BDD |
| TipTap — éditeur riche | HTML riche pour MissionDetail, LocationDetail, EducationDetail |
| Compteurs StatsBar depuis dashboard | La cliente peut modifier les chiffres clés |
| Suisse vs France éducation | Filtrage des ateliers par zone géographique |
| Congé solidaire Sumatra | Ajouter destination dans la section congé solidaire |
| `MissionFieldAction` (many-to-many) | Relation explicite mission ↔ actions terrain, indépendante du filtre pays |
| `mission_id` sur `MediaPost` | Publier un article directement rattaché à une mission |
| **Seed non autonome (ajout 18/09)** | Les missions Kenya/Sénégal doivent être créées manuellement via le dashboard avant de pouvoir lancer le seed — limitation connue et documentée dans `seed.js`, jamais bloquante à ce jour mais à lever si le seed doit un jour tourner sans étape manuelle (ex. CI) |

---

## Récapitulatif

| Phase | Période | Livrable | Statut |
|---|---|---|---|
| Phase 1 — MVP | 28 mai › 3 juillet | MVP + dashboard fonctionnels | ✅ Livré |
| Phase 2 — Dashboard complet | 7 juillet › 1er août | Site quasi-complet | ⚠️ Partiel — sécurité et S9 faits, dashboard CRUD (Bloc B) et finitions (Bloc D) restants |
| Sécurité — audit Alison | 26 août, mergé 18/09 | Failles corrigées, droits BDD séparés | ✅ Fait |
| Phase 3 — Solo (Blocs A à F) | À partir du 18/09 | Site en production | 🔵 À faire |