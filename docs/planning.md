# Planning de développement — Sens Solidaires
*Pichot Gwen & Amblard Alison (jusqu'à fin août) · Pichot Gwen seule à partir du 18/09/2026*
*Holberton School — Thonon-les-Bains*

**Légende** : ✅ Fait · 🔵 Partiel · ❌ Pas fait

---

## Phase 1 — MVP (28 mai › 3 juillet 2026)

### S1 — 28 › 30 mai · Initialisation

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 1 | Gwen | Repo GitHub + monorepo + branches | ✅ |
| 2 | Gwen | React + Tailwind CSS v4 + Vite + React Router | ✅ |
| 3 | Alison | Node.js + Express + route /api/health | ✅ |
| 4 | Alison | PostgreSQL + Prisma v7 + tables MVP | ✅ |
| 5 | Ensemble | Docker Compose + Dockerfiles dev | ✅ |
| 6 | Ensemble | .env + .gitignore + test docker compose up | ✅ |

### S2 — 2 › 6 juin · Fondations frontend + Auth backend

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 7 | Gwen | Système de composants Figma complet | ✅ |
| 8 | Gwen | Page Accueil assemblée dans Figma | ✅ |
| 9 | Gwen | Tailwind — design system | ✅ |
| 10 | Gwen | Composants de base : Button, Badge, Modal | ✅ |
| 11 | Gwen | Layout global : Navbar + Footer + Outlet | ✅ |
| 12 | Gwen | Page Accueil statique | ✅ |
| 13 | Gwen | Page Login admin | ✅ |
| 14 | Alison | Auth JWT : login / logout / refresh token | ✅ |
| 15 | Alison | Middleware authMiddleware | ✅ |
| 16 | Alison | Route POST /api/auth/login + bcrypt | ✅ |
| 17 | Alison | Seed BDD — données de test | ✅ |
| 18 | Ensemble | Test connexion front ↔ back + Docker | ✅ |

### S3 — 9 › 13 juin · Missions

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 19 | Gwen | Page Accueil connectée API | ✅ |
| 20 | Gwen | Page /missions — 4 sections + filtres + AnchorNav | ✅ |
| 21 | Gwen | Page /missions/:slug — détail mission | ✅ |
| 22 | Alison | Seed BDD — données réalistes | ✅ |
| 23 | Alison | GET /api/missions | ✅ |
| 24 | Alison | GET /api/missions/:slug complet | ✅ |
| 25 | Alison | Service + Controller missions | ✅ |

### S4 — 16 › 20 juin · Témoignages + Contact + Pages secondaires

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 26 | Gwen | Page /temoignages | ✅ |
| 27 | Gwen | GET + POST /api/testimonials | ✅ |
| 28 | Gwen | Page /contact + ContactForm + RGPD | ✅ |
| 29 | Gwen | POST /api/contact + Resend | ✅ |
| 30 | Gwen | Pages légales | ✅ |
| 31 | Gwen | Page /soutenir | ✅ |
| 32 | Gwen | Page /rapports-activite | ✅ |
| 33 | Gwen | Page /a-propos | ✅ |
| 34 | Gwen | Page /equipe | ✅ |
| 35 | Alison | CRUD /api/admin/missions (back) | ✅ |
| 36 | Alison | Dashboard admin — sidebar + layout + routes protégées | ✅ |
| 37 | Alison | PATCH modération témoignages | ✅ |
| 38 | Ensemble | Flux soumission → modération → affichage | ✅ |

### S5 — 23 › 27 juin · Dashboard + Responsive

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 39 | Alison | Dashboard : CRUD missions front | ✅ |
| 40 | Alison | Dashboard : modération témoignages | ✅ |
| 41 | Alison | Dashboard : routage email contact | ✅ |
| 42 | Gwen | Responsive mobile-first toutes pages MVP | ✅ |
| 43 | Gwen | Harmonisation CSS | ✅ |

### S6 — 30 juin › 3 juillet · Sprint final MVP

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 44 | Gwen | Migration pages restantes | ✅ |
| 45 | Gwen | LocationDetail enrichi | ✅ |
| 46 | Gwen | BDD — 5 migrations | ✅ |
| 47 | Gwen | Seed refacto | ✅ |
| 48 | Gwen | FooterCta dynamique par route | ✅ |
| 49 | Gwen | Education.jsx refonte | ✅ |
| 50 | Gwen | Renommage "Sens Solidaire" → "Sens Solidaires" | ✅ |
| 51 | Gwen | Home — CTA + actualités + logos partenaires | ✅ |
| 52 | Ensemble | Merge dev-front → dev | ✅ |
| 53 | Ensemble | 🎯 LIVRAISON MVP | ✅ |
| 54 | Gwen | Navbar dropdown missions dynamique | ✅ |
| 55 | Gwen | MissionFormPage complet (9 blocs) | ✅ |
| 56 | Gwen | pricingService + mediaService + routes | ✅ |
| 57 | Gwen | MissionDetail refonte complète | ✅ |
| 58 | Gwen | Seed reformaté (texte brut + JSON) | ✅ |

---

## Phase 2 — Dashboard complet + finitions (7 juillet › 1er août 2026)

### S7 — 7 › 11 juillet · Dashboard étendu

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 59 | Alison | Dashboard : gestion médias | 🔵 |
| 60 | Alison | Dashboard : gestion équipe (CRUD) | ❌ |
| 61 | Alison | Dashboard : gestion rapports d'activité | ❌ |
| 62 | Alison | Dashboard : CRUD actions terrain + pays + tags | ❌ |
| 63 | Alison | Dashboard : responsive | ❌ |
| 64 | Alison | APIs restantes : locations, équipe | ❌ |
| 65 | Gwen | Upload Multer | ✅ |
| 66 | Alison | Tests d'intégration dashboard | 🔵 |

### S7 (suite) — 5 juillet · Documentation, qualité & dette technique

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 67 | Gwen & Alison | README.md complet | ✅ |
| 68 | Alison | FK mission_id sur MissionReport | ✅ |
| 69 | Gwen | Extraction LignesToPuces réutilisable | ✅ |
| 70 | Gwen | Setup Vitest + React Testing Library | ✅ |
| 71 | Gwen | Tests unitaires frontend | ✅ |
| 72 | Gwen | Résolution vulnérabilité npm audit | ✅ |

### S8 — 14 › 18 juillet · Finitions front + freeze

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 73 | Gwen | Accessibilité basique | ❌ |
| 74 | Gwen | SEO basique (SEOHead) | ❌ |
| 75 | Gwen | Lazy loading | ❌ |
| 76 | Gwen | maxLength 280 textarea témoignage | 🔵 |
| 77 | Gwen | Buffer API (V2) | ❌ |
| 78 | Gwen | PageLayout — factorisation | ❌ |
| 79 | Ensemble | Corrections bugs post-recette | ❌ |
| 80 | Ensemble | Code freeze — pause estivale (18 juillet) | ✅ |

### S9 — 1er août · Reprise post-pause

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 81 | Gwen | Hard delete missions (transaction) | ✅ |
| 82 | Gwen | Location ↔ Mission many-to-many | ✅ |
| 83 | Gwen | ServiceCiviqueFormPage + ServiceCiviquePage | ✅ |
| 84 | Gwen | ServiceCiviqueDetail.jsx (page publique) | ✅ |
| 85 | Gwen | country_preposition éditable | ✅ |
| 86 | Gwen | Champs competences + info_service_civique_url | ✅ |
| 87 | Gwen | Garde-fou type Mission/ServiceCiviqueDetail | ✅ |
| 88 | Gwen | FormElements.jsx — composants formulaire partagés | ✅ |

### Pause estivale — Août 2026

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 89 | Alison | Audit sécurité 26/08 (7 failles, droits BDD séparés) | ✅ |

---

## Phase 3 — Développement solo (à partir du 18/09/2026)

### Bloc A — UX dashboard

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 90 | Gwen | Modal dashboard réutilisable | ✅ |
| 91 | Gwen | Bouton pause/reprise → modale perso | ✅ |
| 92 | Gwen | Retirer bouton "Voir toutes les actions" (Impact) | ✅ |
| 93 | Gwen | Corriger doublon "Réserver le vol" | ✅ |
| 94 | Gwen | Revoir mise en page MissionDetail (inclus/tarifs) | ✅ |
| 95 | Gwen | Upload dashboard — redimensionnement + WebP | ✅ |
| 96 | Gwen | Saisir contenu des 5 missions existantes | ✅ |
| 97 | Gwen | Optimiser tous les placeholders | ✅ |
| 98 | Gwen | Description courte auto (marqueur `---`) | ✅ |
| 99 | Gwen | ~~Drag & drop galerie (annulé, absorbé ailleurs)~~ | ✅ |
| 100 | Gwen | ~~Gras/souligné dashboard (annulé, remplacé par TipTap)~~ | ✅ |
| 101 | Gwen | Lien formulaire contact — étape "Comment partir" | ✅ |
| 102 | Gwen | ~~Retirer légende upload hero (annulé, utile si inversion des deux images uploadée entre hero et illustration section mission)~~ | ✅ |
| 103 | Gwen | Bug alternance couleurs MissionDetail | ✅ |
| 104 | Gwen | Palette de couleurs dédiée au dashboard | ✅ |
| 105 | Gwen | Navigation par ancre MissionFormPage | ✅ |
| 106 | Gwen | Refonte galerie — migration BDD | ✅ |
| 107 | Gwen | Refonte galerie — MissionFormPage simplifié | ✅ |
| 108 | Gwen | Refonte galerie — nouvelle page Galerie dashboard | ✅ |
| 109 | Gwen | ~~Passer de 10 à 15-20 photos galerie publique (à voir avec la cliente)~~ | 🔵 |
| 110 | Gwen | Fusionner Service Civique dans Missions (sidebar) | ✅ |
| 111 | Gwen | Supprimer MissionForm.jsx (code mort) | ✅ |
| 112 | Gwen | Pré-remplir tarifs/inclus standards | ✅ |
| 113 | Gwen | formulaire témoigange avec pays service civique et ancres demo à supprimer | ✅ |
| 115 | Gwen | Galerie Groupe jeunes / Congé solidaire | ✅ |

### Bloc B — Dashboard CRUD manquant

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 116 | Gwen | CRUD Location (admin) | ✅ |
| 117 | Gwen | CRUD Delegation (admin) | ✅ |
| 118 | Gwen | CRUD TeamMember (admin) | ❌ |
| 119 | Gwen | CRUD FieldAction + pays + tags (admin) | ❌ |
| 120 | Gwen | CRUD ActivityReport (admin) | ❌ |
| 121 | Gwen | CRUD MediaPost / articles (admin) | ❌ |
| 122 | Gwen | Dashboard responsive mobile | ❌ |
| 123 | Gwen | Tests d'intégration (au fil de chaque CRUD) | ❌ |
| 114 | Gwen | Contenu générique page Missions éditable | ❌ |

A voir : congé solidaire doit devenir congé de solidarité dnas le site visible, les modales pour la suppression de photos dans la galerie, revoir le fichier app.js, app.jsx et api.js (ordre, commentaire....), ajouter un menu + ancre pour la page notre équipe +/- notre association? + ajout de video! (dans le carrousel, reconnaissable avec un symbole play devant la video, pas de démarrage automatique, si le user clic sur le play, ouverture de la video apr dessus type modal, pas de modification de format, si la video est en portrait elle reste, idem en paysage)

faire en sorte que le bloc info pratique prenne toute la hauteur en focntion des deux bloc de gauche pour éviter les trous en bas de page, avec contenu espacé et reparti sur toute la heur du bloc info pratiques

migrer les vraies donnée du site pour mission et délégation : supprimer les donnés inutile en seed? 

### Bloc C — Page Éducation & sensibilisation

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 124 | Gwen | Refonte contenu dynamique + gestion dashboard | ❌ |

### Bloc D — Finitions front

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 125 | Gwen | Accessibilité basique | ❌ |
| 126 | Gwen | SEO basique (SEOHead) | ❌ |
| 127 | Gwen | Lazy loading | ❌ |
| 109 | Gwen | Passer de 10 à 15-20 photos galerie publique (à voir avec la cliente) | 🔵 |
| 128 | Gwen | maxLength 280 textarea témoignage | 🔵 |
| 129 | Gwen | PageLayout — factorisation | ❌ |

### Bloc E — Polishing + SEO avancé

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 130 | Gwen | Audit Lighthouse (objectif > 90) | ❌ |
| 131 | Gwen | Optimisations WebP + images production | ❌ |
| 132 | Gwen | Bilingue FR/EN (react-i18next, si décision cliente) | ❌ |
| 133 | Gwen | Accessibilité WCAG 2.1 AA — audit complet | ❌ |
| 134 | Gwen | Seed BDD — contenus réels finaux | ❌ |
| 135 | Gwen | Relecture complète des textes avec la cliente | ❌ |

### Bloc F — Déploiement & livraison

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 136 | Gwen | Dockerfile production (multi-stage) | ❌ |
| 137 | Gwen | VPS + Docker + Nginx + SSL | ❌ |
| 138 | Gwen | Variables d'env production + secrets | ❌ |
| 139 | Gwen | Migration BDD production | ❌ |
| 140 | Gwen | UptimeRobot monitoring + tests HTTPS | ❌ |
| 141 | Gwen | Tests complets en production | ❌ |
| 142 | Gwen | Guide utilisateur dashboard (PDF) | ❌ |
| 143 | Gwen | Remise des accès à la cliente | ❌ |
| 144 | Gwen | Corrections finales | ❌ |
| 145 | Gwen | 🎉 LIVRAISON OFFICIELLE | ❌ |

---

## Backlog V2 — Post-livraison

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 146 | Gwen | CRUD dashboard Location/Delegation/TeamMember/FieldAction | ❌ |
| 147 | Gwen | Buffer API — auto-draft réseaux sociaux | ❌ |
| 148 | Gwen | Instagram oEmbed | ❌ |
| 149 | Gwen | latitude/longitude sur Location | ❌ |
| 150 | Gwen | location_id FK sur Delegation | ❌ |
| 151 | Gwen | Sélection manuelle actions terrain home | ❌ |
| 152 | Gwen | TipTap — éditeur riche | ❌ |
| 153 | Gwen | Compteurs StatsBar depuis dashboard | ❌ |
| 154 | Gwen | Suisse vs France éducation (filtrage zone) | ❌ |
| 155 | Gwen | Congé solidaire Sumatra | ❌ |
| 156 | Gwen | MissionFieldAction (many-to-many) | ❌ |
| 157 | Gwen | mission_id sur MediaPost | ❌ |
| 158 | Gwen | Seed non autonome (dépendance création manuelle) | ❌ |
| 159 | Gwen | Recadrage d'image côté dashboard | ❌ |
| 160 | Gwen | Récupérer tous les PDF de l'ancien site | ❌ |
| 161 | Gwen | HEIC non supporté par Sharp | ❌ |
| 162 | Gwen | Compte admin + compte invité (rôles) | ❌ |