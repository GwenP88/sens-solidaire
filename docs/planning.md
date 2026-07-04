# Planning de développement — Sens Solidaires
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*
*Mise à jour : 3 juillet 2026*

**Légende** : ✅ Terminé · ⚠️ Partiel · 🔵 À faire · 🔴 Bloqué
**Devs** : Gwen (frontend + design) · Alison (backend + BDD) · Ensemble = tâches communes

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
| 42 | Alison | Upload fichiers Multer (images + PDFs) | ⚠️ Partiel |
| 43 | Gwen | Responsive mobile-first toutes pages MVP (375 / 768 / 1024 / 1440) | ✅ |
| 43bis | Gwen | Harmonisation CSS — gap scale, utilities, Section/CTASection | ✅ |

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
| 53 | Ensemble | 🎯 LIVRAISON MVP — 3 juillet 2026 | ✅ |

---

## Phase 2 — 7 › 18 juillet 2026 : Dashboard complet + Finitions front

---

### S7 — 7 › 11 juillet · Dashboard étendu

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 54 | Alison | Dashboard : gestion médias (upload image, show_homepage) | 🔵 |
| 55 | Alison | Dashboard : gestion équipe (CRUD membres) | 🔵 |
| 56 | Alison | Dashboard : gestion rapports d'activité | 🔵 |
| 57 | Alison | Dashboard : CRUD actions terrain + pays + tags | 🔵 |
| 58 | Alison | Dashboard : responsive | 🔵 |
| 59 | Alison | APIs restantes : locations, équipe | 🔵 |
| 60 | Alison | Upload Multer — finalisation images + PDFs | 🔵 |
| 61 | Alison | Tests d'intégration dashboard | 🔵 |

---

### S8 — 14 › 18 juillet · Finitions front + freeze

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 62 | Gwen | Accessibilité basique — alt, aria-label, focus-visible | 🔵 |
| 63 | Gwen | SEO basique — SEOHead (title, meta, Open Graph) par page | 🔵 |
| 64 | Gwen | Lazy loading — `loading="lazy"` sur toutes les images cards/grilles | 🔵 |
| 65 | Gwen | `maxLength={280}` sur textarea témoignage dashboard | 🔵 |
| 66 | Gwen | Buffer API — auto-draft réseaux sociaux à la publication (V2) | 🔵 |
| 67 | Gwen | `PageLayout` — factoriser bg-surface + ScrollToTop + HeroPage | 🔵 |
| 68 | Ensemble | Corrections bugs post-recette | 🔵 |
| 69 | Ensemble | 🧊 Code freezé — pause estivale (18 juillet) | 🔵 |

---

## Pause estivale — Août 2026 🧊

Code freezé. Aucune modification.

---

## Phase 3 — Septembre 2026 : Finalisation & Déploiement

---

### Sept. S1 — Polishing + SEO avancé

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 70 | Gwen | Audit Lighthouse — objectif > 90 | 🔵 |
| 71 | Gwen | Optimisations WebP + images production | 🔵 |
| 72 | Alison | Upload Sharp — redimensionnement auto WebP | 🔵 |
| 73 | Gwen | Bilingue FR/EN — react-i18next (si décision cliente) | 🔵 |
| 74 | Gwen | Accessibilité WCAG 2.1 AA — audit complet | 🔵 |
| 75 | Ensemble | Seed BDD — contenus réels finaux fournis par la cliente | 🔵 |
| 76 | Ensemble | Relecture complète tous les textes avec la cliente | 🔵 |

---

### Sept. S2 — Déploiement

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 77 | Gwen | Dockerfile production (multi-stage build) | 🔵 |
| 78 | Gwen | VPS + Docker + Nginx + SSL (Let's Encrypt) | 🔵 |
| 79 | Alison | Variables d'env production + secrets | 🔵 |
| 80 | Alison | Migration BDD production | 🔵 |
| 81 | Ensemble | UptimeRobot monitoring + tests HTTPS | 🔵 |

---

### Sept. S3 — Livraison

| # | Dev | Tâche | Statut |
|---|---|---|---|
| 82 | Ensemble | Tests complets en production | 🔵 |
| 83 | Ensemble | Guide utilisateur dashboard (PDF) | 🔵 |
| 84 | Ensemble | Remise des accès à la cliente | 🔵 |
| 85 | Ensemble | Corrections finales | 🔵 |
| 86 | Ensemble | 🎉 LIVRAISON OFFICIELLE | 🔵 |

---

## Backlog V2 — Post-livraison

| Fonctionnalité | Description |
|---|---|
| Buffer API | Auto-draft réseaux sociaux à la publication d'un article |
| Instagram oEmbed | Embed posts du feed Instagram (nécessite app Meta) |
| `latitude` / `longitude` sur Location | Embed Google Maps propre (remplace iframe URL) |
| `location_id` FK sur Delegation | Architecture bidirectionnelle Delegation ↔ Location |
| Sélection manuelle actions terrain home | Dashboard + champ BDD (avec Alison) |
| TipTap — éditeur riche | HTML riche pour MissionDetail, LocationDetail, EducationDetail |
| Compteurs StatsBar depuis dashboard | La cliente peut modifier les chiffres clés |
| Suisse vs France éducation | Filtrage des ateliers par zone géographique |
| Congé solidaire Sumatra | Ajouter destination dans la section congé solidaire |

---

## Récapitulatif

| Phase | Période | Livrable | Statut |
|---|---|---|---|
| Phase 1 — MVP | 28 mai › 3 juillet | MVP + dashboard fonctionnels | ✅ Livré |
| Phase 2 — Dashboard complet | 7 › 18 juillet | Site quasi-complet | 🔵 En cours |
| Pause estivale | Août 2026 | Code freezé | 🧊 |
| Phase 3 — Finalisation | Septembre 2026 | Site en production | 🔵 À faire |