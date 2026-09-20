# Planning de développement — Sens Solidaires
*Pichot Gwen & Amblard Alison (jusqu'à fin août) · Pichot Gwen seule à partir du 18/09/2026*
*Holberton School — Thonon-les-Bains*
*Mise à jour : 19 septembre 2026 — session upload Sharp/WebP, réorganisation images, description courte auto, refonte galerie décidée

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
| 112 | ✅ Upload dashboard — redimensionnement auto + conversion WebP à l'import | **Fait.** Sharp branché (tiers hero/gallery/card/avatar), photo hero et galerie séparées en 2 champs indépendants dans `MissionFormPage.jsx` (plus de risque lié au réordonnancement). Bonus : bug corrigé au passage — l'image du bloc "La mission" pointait vers le hero au lieu de la galerie |
| 113 | ✅ Saisir le contenu complet de toutes les missions existantes via le dashboard | **Fait.** 5 missions volontariat individuel saisies (Kenya, Sénégal, Sumatra, Sri Lanka, Pérou), contenu et photos repris de l'ancien site sensolidaire.org |
| 106 | ✅ Composant `Modal` dashboard réutilisable | **Fait.** `ConfirmModal.jsx` généralisé avec un prop `variant` (`danger` rouge / `default` vert), défaut inchangé pour la suppression |
| 107 | ✅ Bouton pause/reprise mission → modale perso | **Fait.** Modale perso branchée (variant `default`), icône dynamique pause/play selon `is_active` dans `DashboardTable.jsx` |
| 108 | ✅ Retirer le bouton "Voir toutes les actions" — page Impact | **Fait** — il pointait vers sa propre page. Le même bouton sur la Home reste, lui, légitime (renvoie vers Impact) |
| 109 | ✅ Corriger le doublon "Réserver le vol" | **Fait.** Étape 1 relabellisée "Comparer et réserver vos vols", et la page publique affiche maintenant ce libellé + les villes (au lieu des villes seules, sans contexte) |
| 111 | ✅ Revoir mise en page `MissionDetail` — section inclus/non inclus + tableau durée/prix | **Fait.** Grille à 4 colonnes cassée séparée en 3 blocs indépendants (tarifs/inclus/non-inclus, CTA, répartition frais), fonds colorés vert/terracotta sur inclus/non-inclus |
| 114 | ✅ Repérer tous les placeholders du site et les optimiser (taille + format) | **Fait**, bien plus large que prévu : réorganisation complète de `public/images/` en 3 catégories (placeholders/logo-partners/design), suppression de ~3,3Mo de fichiers morts (`lieux-missions/`, restes `missions/` non utilisés, `Willy_Rovelli.png`), script `optimize-placeholders.js` réutilisable (filtré sur "placeholder" uniquement — les logos ne se compressent pas forcément bien en WebP), 14 placeholders convertis (jusqu'à -95%), et **tous les chemins codés en dur dans `seed.js` corrigés** (81 lignes touchées en base : Delegation, Media, FieldAction, TeamMember, EducationItem, MediaPost) |
| 115 | ✅ Description courte extraite automatiquement de la description longue | **Fait.** Marqueur `---` (au lieu de `[COUPURE]`), calculé côté backend à l'enregistrement, aperçu en direct dans le dashboard. Le marqueur reste en base (pas nettoyé) pour rester éditable, retiré uniquement à l'affichage public. Motif réutilisable pour TeamMember/EducationItem/MediaPost plus tard |
| 116 | ~~Drag & drop galerie~~ → **refonte plus large décidée le 19/09** (voir #124-127 ci-dessous) — le drag & drop devient inutile dans la nouvelle architecture |
| 117 | Gras / souligné dans les zones de texte du dashboard | Version light de l'éditeur riche (le TipTap complet reste au Backlog V2) — juste permettre à la cliente de mettre en forme localement dans les textarea existantes |
| 118 | Lien vers le formulaire de contact — étape 2 "Comment partir" | Reproduire le lien "ICI" de l'ancien site. ⚠️ Cette étape n'est pas éditable via le dashboard (texte fixe `HOW_TO_GO_FIXED`, identique pour toutes les missions) — le lien se fait en JSX dans `MissionDetail.jsx` (vrai lien React Router vers `/contact`), pas via une zone de texte |
| 120 | Retirer le champ légende/alt de l'upload hero dans le dashboard | Devenu inutile : le hero est passé en `aria-hidden="true"` (image décorative, le `<h1>` porte déjà l'info) — garder ce champ induirait la cliente en erreur en lui faisant croire qu'il sert à l'accessibilité |
| 121 | Bug alternance des couleurs de fond — `MissionDetail.jsx` (page publique) | Chaque section a une couleur fixe sans tenir compte des sections masquées (`show: ...`) — deux sections visibles adjacentes peuvent hériter de la même couleur et se retrouver collées sans séparation. Calculer la couleur selon l'ordre réel d'affichage parmi les sections visibles, pas une couleur figée par section |
| 122 | Palette de couleurs dédiée au dashboard | Distincte de celle du site public, code couleur cohérent par domaine (missions = vert, témoignages = terracotta, etc.) plutôt que choisi au fil de l'eau. Le prop `tone` de `FormSection` (ajouté aujourd'hui) est déjà prêt à l'accueillir une fois cette palette définie. **À revoir aussi à ce moment-là** : les 2 variantes de `ConfirmModal.jsx` (`danger` en rouge, `default` en `green-600` — posé provisoirement le temps de définir la vraie palette) |
| 123 | Navigation par ancre sur `MissionFormPage.jsx` | 8 blocs à scroller intégralement aujourd'hui même pour une petite modif ponctuelle. Réutiliser le composant `AnchorNav` déjà existant côté public (`MissionDetail.jsx`) plutôt que d'en refaire un — un lien par bloc (`FormSection`), qui scrolle jusqu'à la section |
| 124 | ✅ Refonte galerie — migration BDD | **Fait.** `image_url`/`image_alt` renommés en `photo_hero_url`/`photo_hero_alt` (migration manuelle en SQL brut — `prisma migrate dev` bloqué par les droits restreints de `sensolidaire_owner`, pas de shadow database possible, volontaire côté sécurité). Ajout de `photo_section_url`/`photo_section_alt` et `force_display` sur `Media` |
| 125 | ✅ Refonte galerie — `MissionFormPage.jsx` simplifié | **Fait.** Un seul champ photo, 2 images obligatoires (hero + section "La mission"), flèches existantes pour réordonner. Bloc galerie retiré entièrement |
| 126 | ✅ Refonte galerie — nouvelle page dashboard "Galerie" | **Fait.** `GaleriePage.jsx` — 3 sélecteurs (Domaine/Type/Pays, Service Civique/Groupe jeunes/Congé solidaire/Éducation visibles mais désactivés), upload en grille avec case "Toujours afficher", tri automatique par date. `AdminFileUpload.jsx` étendu (`layout`, `allowReorder`, `showForceDisplay`) sans casser les usages existants (Mission, PDF) |
| 127 | Passer de 10 à 15-20 photos par galerie publique | **Dépend de #69 (lazy loading, Bloc D)** — sans lui, les 10 photos actuelles se chargent déjà toutes au chargement de la page ; en ajouter plus sans lazy loading aggraverait le problème qu'on cherche justement à éviter,  Logique de sélection (forcées + récentes) déjà en place dans `findBySlug`, ne reste qu'à changer la limite |

### Bloc B — Dashboard CRUD manquant (le plus gros morceau)

| # | Tâche | Origine |
|---|---|---|
| 59 | CRUD Location (admin) — routes + service + front dashboard | Ex-tâche 59 ("APIs restantes : locations, équipe") |
| — | CRUD Delegation (admin) | Nouveau — pas de # d'origine, identifié dans le Backlog V2 (01/08), jamais entré dans une semaine numérotée |
| 55 | CRUD TeamMember (admin) | Ex-tâche 55 |
| 57 | CRUD FieldAction + pays + tags (admin) | Ex-tâche 57 |
| 56 | CRUD ActivityReport (admin) | Ex-tâche 56 |
| 54 | CRUD MediaPost / articles (admin) | Partie non faite de l'ex-tâche 54 (le média d'**une mission**, lui, est déjà fait). **Prévoir la possibilité d'antidater un post** (`date` éditable, pas juste la date de création) — nécessaire pour migrer les anciens articles de l'ancien site sensolidaire.org avec leur vraie date de publication |
| 58 | Dashboard responsive mobile | Ex-tâche 58. Prévu initialement pour la modération témoignages uniquement — **étendre aussi à la création d'un post média/actualité depuis le téléphone**, pour que la cliente puisse publier en direct sans devoir attendre d'être sur ordinateur |
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
| **Recadrage d'image côté dashboard (ajout 18/09)** | Permettre à la cliente de recadrer une photo après upload (ex: photo mal cadrée avec sujet coupé) — outil client-side avant l'upload, Sharp ne fait que redimensionner, pas de recadrage intelligent automatique |
| **Récupérer tous les PDF de l'ancien site (ajout 19/09)** | Guides du volontaire, rapports d'activité, rapports de mission... à réintégrer dans le nouveau site une fois le dashboard complet (Bloc B) — pas avant, pour ne pas re-uploader deux fois si l'organisation change entre-temps |
| **HEIC non supporté par Sharp (ajout 18/09)** | Le binaire Sharp installé ne supporte que l'AVIF côté HEIF, pas le HEIC des iPhones (codec sous licence, absent du build précompilé). 2 options à trancher avec la cliente : réglage iPhone "Le plus compatible" (JPEG natif, zéro code) ou lib `heic-convert` en amont de Sharp |
| **Compte admin + compte invité/service civique (déplacé du Bloc A)** | Nécessite de définir avec la cliente les permissions exactes du rôle invité avant tout développement — actuellement aucune interface n'existe pour créer un 2ᵉ compte, seul l'admin seedé existe. `authMiddleware.js` vérifie déjà le rôle (`role !== "admin"` → 403) mais figé sur une seule valeur, à faire évoluer une fois les permissions décidées |

---

## Récapitulatif

| Phase | Période | Livrable | Statut |
|---|---|---|---|
| Phase 1 — MVP | 28 mai › 3 juillet | MVP + dashboard fonctionnels | ✅ Livré |
| Phase 2 — Dashboard complet | 7 juillet › 1er août | Site quasi-complet | ⚠️ Partiel — sécurité et S9 faits, dashboard CRUD (Bloc B) et finitions (Bloc D) restants |
| Sécurité — audit Alison | 26 août, mergé 18/09 | Failles corrigées, droits BDD séparés | ✅ Fait |
| Phase 3 — Solo (Blocs A à F) | À partir du 18/09 | Site en production | 🔵 À faire |