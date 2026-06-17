# Planning de développement — Sens Solidaire
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*
*Mise à jour : 17 juin 2026*

**Légende** : ✅ Terminé · ⚠️ Partiel · 🔵 À faire · 🔴 Bloqué
**Devs** : Gwen (frontend + design) · Alison (backend + BDD) · Ensemble = tâches communes

---

## Phase 1 — 28 mai › 3 juillet 2026 : MVP + Dashboard admin

---

### S1 — 28 › 30 mai · Initialisation

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 01 | Gwen | Repo GitHub + monorepo /frontend /backend /docs + branches | 28 mai | ✅ Terminé |
| 02 | Gwen | React + Tailwind CSS + Vite + React Router | 28 mai | ✅ Terminé |
| 03 | Alison | Node.js + Express + route /api/health | 28 mai | ✅ Terminé |
| 04 | Alison | PostgreSQL + Prisma v7 + 6 tables MVP | 28-29 mai | ✅ Terminé |
| 05 | Ensemble | Docker Compose + Dockerfiles dev | 29 mai | ✅ Terminé |
| 06 | Ensemble | .env + .gitignore + test docker compose up | 29 mai | ✅ Terminé |

> ✅ **S1 — COMPLÈTE**

---

### S2 — 2 › 6 juin · Fondations frontend + Auth backend

#### Figma (hors planning initial)

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 07 | Gwen | Système de composants Figma complet | 2-4 juin | ✅ Terminé |
| 08 | Gwen | Page Accueil assemblée dans Figma | 4-6 juin | ✅ Terminé |

#### Dev

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 09 | Gwen | Tailwind avec design system (palette, typographie) | S2/S3 | ✅ Terminé |
| 10 | Gwen | Composants de base : Button, Badge | S2/S3 | ✅ Terminé |
| 11 | Gwen | Layout global : Navbar + Footer + Outlet | S2/S3 | ✅ Terminé |
| 12 | Gwen | Page Accueil statique | S2/S3 | ✅ Terminé |
| 13 | Gwen | Page Login admin | S2/S3 | ✅ Terminé |
| 14 | Alison | Auth JWT : login / logout / refresh token | S2/S3 | ✅ Terminé |
| 15 | Alison | Middleware authMiddleware | S2/S3 | ✅ Terminé |
| 16 | Alison | Route POST /api/auth/login + bcrypt | S2/S3 | ✅ Terminé |
| 17 | Alison | Seed BDD — données de test | S2/S3 | ✅ Terminé |
| 18 | Ensemble | Test connexion front ↔ back + Docker | S2/S3 | ✅ Terminé |

> ✅ **S2 — COMPLÈTE**

---

### S3 — 9 › 13 juin · Missions

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 19 | Gwen | Page Accueil connectée API | 9-10 juin | ✅ Terminé |
| 20 | Gwen | Page /missions — toutes sections + filtres | 10-11 juin | ✅ Terminé |
| 21 | Gwen | Page /missions/:slug — détail mission complet | 11 juin | ✅ Terminé |
| 22 | Alison | Seed BDD — données réalistes | 10 juin | ✅ Terminé |
| 23 | Alison | GET /api/missions (liste + filtres) | 12 juin | ✅ Terminé |
| 24 | Alison | GET /api/missions/:slug + pricing + locations + testimonials | 12-13 juin | ✅ Terminé |
| 25 | Alison | Service + Controller missions | 12-13 juin | ✅ Terminé |

> ✅ **S3 — COMPLÈTE**

---

### S4 — 16 › 20 juin · Témoignages + Contact + Pages secondaires

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 26 | Gwen | Page Témoignages — onglets, filtres, grille, modale | 16 juin | ✅ Terminé |
| 27 | Gwen | GET /api/testimonials + POST /api/testimonials | 16 juin | ✅ Terminé |
| 28 | Gwen | Page Contact + ContactForm + RGPD | 16 juin | ✅ Terminé |
| 29 | Gwen | POST /api/contact + Resend — test complet | 16 juin | ✅ Terminé |
| 30 | Gwen | Page Mentions légales + Confidentialité + bannière cookies | 17 juin | ✅ Terminé |
| 31 | Gwen | Page Soutenir — don, adhésion, transparence, AnchorNav | 17 juin | ✅ Terminé |
| 32 | Gwen | Page Rapports d'activité — grille PDFs | 17 juin | ✅ Terminé |
| 33 | Gwen | Page À propos — histoire, valeurs, activités, équipe | 17 juin | ✅ Terminé |
| 34 | Gwen | Page Équipe — direction, bureau, CA, délégations | 17 juin | ✅ Terminé |
| 35 | Alison | CRUD /api/admin/missions (back) | 13 juin | ✅ Terminé |
| 36 | Alison | Dashboard admin — Sidebar + layout + routes protégées | 16-20 juin | 🔵 À faire |
| 37 | Alison | PATCH /api/admin/testimonials/:id — modération | 19-20 juin | 🔵 À faire |
| 38 | Ensemble | Flux complet : soumission → modération → affichage | 20 juin | 🔵 À faire |

---

### S5 — 23 › 27 juin · Dashboard + Upload + Responsive

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 39 | Alison | Dashboard : CRUD missions front | 23-24 juin | 🔵 À faire |
| 40 | Alison | Dashboard : modération témoignages | 23-24 juin | 🔵 À faire |
| 41 | Alison | Dashboard : routage email contact | 24-25 juin | 🔵 À faire |
| 42 | Alison | Upload fichiers Multer (images + PDFs) | 25-26 juin | 🔵 À faire |
| 43 | Gwen | Responsive mobile-first — toutes pages MVP (375px / 768px) | 23-26 juin | 🔵 À faire |
| 43bis | Gwen | Responsive mobile-first — toutes pages MVP (375px / 768px) | 23-26 juin | 🔵 À faire |

---

### S6 — 30 juin › 3 juillet · Recette MVP

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 44 | Ensemble | Tests complets pages publiques | 30 juin | 🔵 À faire |
| 45 | Ensemble | Tests dashboard : CRUD, modération, contact | 1 juillet | 🔵 À faire |
| 46 | Ensemble | Seed BDD avec données proches du réel | 1 juillet | 🔵 À faire |
| 47 | Ensemble | Audit Lighthouse — corrections prioritaires | 2 juillet | 🔵 À faire |
| 48 | Ensemble | Accessibilité de base : labels, alt, focus | 2 juillet | 🔵 À faire |
| 49 | Ensemble | Préparation soutenance / démo MVP | 2-3 juillet | 🔵 À faire |
| 50 | Ensemble | 🎯 LIVRAISON MVP — 3 juillet 2026 | 3 juillet | 🔵 À faire |

---

## Phase 2 — 3 › 17 juillet 2026 : Dashboard complet + Pages secondaires

### S7 — 3 › 10 juillet · Dashboard étendu

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 51 | Alison | Dashboard : gestion médias + équipe + rapports d'activité | 3-7 juillet | 🔵 À faire |
| 52 | Gwen | Responsive dashboard | 7-8 juillet | 🔵 À faire |
| 53 | Alison | APIs : médias, équipe, rapports | 3-7 juillet | 🔵 À faire |
| 54 | Alison | CRUD actions terrain + tags | 7-8 juillet | 🔵 À faire |
| 55 | Alison | Tests d'intégration | 8-10 juillet | 🔵 À faire |

### S8 — 10 › 17 juillet · Pages secondaires

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 56 | Gwen | Page /lieux/:slug (LocationDetail.jsx) | 10-12 juillet | 🔵 À faire |
| 57 | Alison | APIs restantes : locations, équipe, rapports | 10-14 juillet | 🔵 À faire |
| 58 | Alison | Corrections bugs post-recette | 14-17 juillet | 🔵 À faire |
| 59 | Ensemble | 🧊 Code freezé — pause estivale | 17 juillet | 🔵 À faire |

---

## Phase 3 — Septembre 2026 : Finalisation & Déploiement

### Sept. S1 · Pages éditoriales

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 60 | Gwen | Page Actions terrain + détail (badges ODD) | Sept. S1 | 🔵 À faire |
| 61 | Gwen | Page Actions éducatives | Sept. S1 | 🔵 À faire |
| 62 | Gwen | Page Médias & Actualités (filtres) | Sept. S1 | 🔵 À faire |
| 63 | Alison | APIs : actions terrain, actions éducatives, médias | Sept. S1 | 🔵 À faire |
| 64 | Alison | Seed BDD avec contenus réels | Sept. S1 | 🔵 À faire |

### Sept. S2 · Polishing + SEO + Bilingue

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 65 | Gwen | Compteurs d'impact animés | Sept. S2 | 🔵 À faire |
| 66 | Gwen | Bilingue FR/EN — react-i18next | Sept. S2 | 🔵 À faire |
| 67 | Gwen | Accessibilité WCAG 2.1 AA | Sept. S2 | 🔵 À faire |
| 68 | Alison | SEO : méta, Open Graph, sitemap, robots.txt | Sept. S2 | 🔵 À faire |
| 69 | Alison | Audit Lighthouse final — objectif > 90 | Sept. S2 | 🔵 À faire |
| 70 | Gwen | Optimisations : WebP, lazy loading | Sept. S2 | 🔵 À faire |

### Sept. S3 · Déploiement

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 71 | Gwen | Dockerfile production (multi-stage build) | Sept. S3 | 🔵 À faire |
| 72 | Gwen | VPS + Docker + Nginx + SSL | Sept. S3 | 🔵 À faire |
| 73 | Alison | Migration contenus réels | Sept. S3 | 🔵 À faire |
| 74 | Alison | Variables d'env production + secrets | Sept. S3 | 🔵 À faire |
| 75 | Ensemble | UptimeRobot monitoring + tests HTTPS | Sept. S3 | 🔵 À faire |

### Sept. S4 · Livraison finale

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 76 | Ensemble | Tests en conditions de production | Sept. S4 | 🔵 À faire |
| 77 | Ensemble | Guide utilisateur dashboard (PDF) | Sept. S4 | 🔵 À faire |
| 78 | Ensemble | Remise des accès | Sept. S4 | 🔵 À faire |
| 79 | Ensemble | Corrections finales | Sept. S4 | 🔵 À faire |
| 80 | Ensemble | 🎉 LIVRAISON OFFICIELLE | Fin sept. 2026 | 🔵 À faire |

---

## Récapitulatif

| Phase | Période | Livrable |
|---|---|---|
| Phase 1 — MVP | 28 mai › 3 juillet | MVP + dashboard fonctionnels |
| Phase 2 — Dashboard complet | 3 › 17 juillet | Site quasi-complet |
| Pause estivale | Août 2026 | Code freezé |
| Phase 3 — Finalisation | Septembre 2026 | Site en production ✅ |