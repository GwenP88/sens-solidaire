# Planning de développement — Sens Solidaire
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*
*Mise à jour : 16 juin 2026*

**Légende** : ✅ Terminé · ⚠️ Partiel · 🔵 À faire · 🔴 Bloqué
**Devs** : Dev 1 = Gwen (frontend + design) · Dev 2 = Alison (backend + BDD) · Ensemble = tâches communes

---

## Phase 1 — 28 mai › 3 juillet 2026 : MVP + Dashboard admin
*Périmètre : Home · Missions · Témoignages · Contact — site public + dashboard admin correspondant*

---

### S1 — 28 › 30 mai · Initialisation [Setup] [BDD] [Docker]
*Objectif : Environnement de développement opérationnel, monorepo structuré, BDD initialisée.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 01 | Gwen | Repo GitHub + monorepo /frontend /backend /docs + branches | 28 mai | ✅ Terminé |
| 02 | Gwen | React + Tailwind CSS + Vite + React Router installés et fonctionnels | 28 mai | ✅ Terminé |
| 03 | Alison | Node.js + Express + route /api/health + dépendances backend | 28 mai | ✅ Terminé |
| 04 | Alison | PostgreSQL + Prisma v7 + 6 tables MVP (Mission, MissionPricing, Location, Testimonial, Media, Admin) | 28-29 mai | ✅ Terminé |
| 05 | Ensemble | Docker Compose (frontend + backend + postgres) + Dockerfiles dev | 29 mai | ✅ Terminé |
| 06 | Ensemble | .env + .gitignore + test docker compose up complet | 29 mai | ✅ Terminé |

> ✅ **S1 — COMPLÈTE**

---

### S2 — 2 › 6 juin · Fondations frontend + Auth backend [Front] [Back]
*Objectif : Layout global en place. Auth JWT fonctionnelle. Première connexion front ↔ back.*

#### Figma (hors planning initial — temps investi en S2)

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 07 | Gwen | Système de composants Figma complet : Navbar, Hero, StatsBar, Footer, Cards, Carousels, Badges ODD, Tags, Boutons, Formulaires | 2-4 juin | ✅ Terminé |
| 08 | Gwen | Page Accueil assemblée dans Figma — toutes les sections | 4-6 juin | ✅ Terminé |

#### Dev frontend

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 09 | Gwen | Configurer Tailwind avec le design system (palette, typographie) | S2/S3 | ✅ Terminé |
| 10 | Gwen | Composants de base : Button (Primary + Secondary), Badge ODD | S2/S3 | ✅ Terminé |
| 11 | Gwen | Layout global : Navbar + Footer + structure `<Outlet />` React Router | S2/S3 | ✅ Terminé |
| 12 | Gwen | Page Accueil statique : Hero + StatsBar + sections | S2/S3 | ✅ Terminé |
| 13 | Gwen | Page Login admin (formulaire + appel API POST /auth/login) | S2/S3 | ✅ Terminé |

#### Dev backend

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 14 | Alison | Auth JWT : login / logout / refresh token | S2/S3 | ✅ Terminé |
| 15 | Alison | Middleware authMiddleware — protection des routes admin | S2/S3 | ✅ Terminé |
| 16 | Alison | Route POST /api/auth/login + bcrypt | S2/S3 | ✅ Terminé |
| 17 | Alison | Seed BDD — données de test (missions, témoignages, admin) | S2/S3 | ✅ Terminé |
| 18 | Ensemble | Test connexion front ↔ back (CORS) + docker compose up avec données | S2/S3 | ✅ Terminé |

> ✅ **S2 — COMPLÈTE (Figma + rattrapage dev effectué en S3)**

---

### S3 — 9 › 13 juin · Rattrapage S2 + Missions [Front] [Back]
*Objectif : Rattraper S2. /missions connecté aux données. CRUD missions opérationnel.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 19 | Gwen | Composants de base : Button (Primary + Secondary) | 9 juin | ✅ Terminé |
| 20 | Gwen | Layout global : Navbar + Footer + React Router Outlet | 9-10 juin | ✅ Terminé |
| 21 | Gwen | Page Accueil connectée API | 10-11 juin | ✅ Terminé |
| 22 | Gwen | Page Login admin (form + appel API) | 11 juin | ✅ Terminé |
| 23 | Alison | Seed BDD — données de test réalistes | 10 juin | ✅ Terminé |
| 24 | Ensemble | Test connexion front ↔ back (CORS) + Docker fonctionnel | 11 juin | ✅ Terminé |
| 25 | Gwen | Page /missions — toutes sections + filtres + FilterChips | 10-11 juin | ✅ Terminé |
| 26 | Gwen | Page /missions/:slug — détail mission complet | 11 juin | ✅ Terminé |
| 27 | Alison | GET /api/missions (liste + filtres) | 12 juin | ✅ Terminé |
| 28 | Alison | GET /api/missions/:slug + pricing + locations + testimonials | 12-13 juin | ✅ Terminé |
| 29 | Alison | Service + Controller missions | 12-13 juin | ✅ Terminé |

> ✅ **S3 — COMPLÈTE**

---

### S4 — 16 › 20 juin · Témoignages + Contact + Dashboard [Front] [Back] [Admin]
*Objectif : Témoignages et contact fonctionnels. Dashboard admin démarré.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 30 | Alison | Dashboard admin — Sidebar + layout + routes protégées | 16-17 juin | 🔵 À faire |
| 31 | Alison | CRUD /api/admin/missions (back) | 16-17 juin | ✅ Terminé  |
| 32 | Gwen | Page Témoignages — onglets, filtres FilterSelect, grille, modale soumission | 16 juin | ✅ Terminé |
| 33 | Gwen | GET /api/testimonials + POST /api/testimonials | 16 juin | ✅ Terminé |
| 33bis | Alison | PATCH /api/admin/testimonials/:id — modération dashboard | À faire S4/S5 | 🔵 À faire |
| 34 | Alison | PATCH /api/admin/testimonials/:id — modération dashboard | 19-20 juin | 🔵 À faire |
| 35 | Ensemble | Flux complet : soumission → modération → affichage | 20 juin | 🔵 À faire |
| 36 | Gwen | Page Contact + ContactForm — layout maquette + RGPD | 16 juin | ✅ Terminé en avance |
| 39 | Gwen | POST /api/contact + Resend | 16 juin | ✅ Terminé en avance |
| 42 | Ensemble | Email de contact envoyé et reçu — test complet | 16 juin | ✅ Terminé en avance |

---

### S5 — 23 › 27 juin · Upload + Responsive + Mentions légales [Front] [Back]
*Objectif : Upload fichiers. Responsive mobile-first. Pages légales.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 37 | Gwen | Mentions légales + bannière cookies CNIL | 23-24 juin | 🔵 À faire |
| 38 | Gwen | Responsive mobile-first — toutes pages MVP (375px / 768px) | 24-26 juin | 🔵 À faire |
| 40 | Alison | Dashboard : paramètres routage email contact | 23-24 juin | 🔵 À faire |
| 41 | Alison | Upload fichiers Multer (images + PDFs) | 24-25 juin | 🔵 À faire |

---

### S6 — 30 juin › 3 juillet · Recette MVP [Setup]
*Objectif : MVP + dashboard testés, validés, prêts pour la démo du 3 juillet.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 43 | Ensemble | Tests complets des pages publiques en conditions réelles | 30 juin | 🔵 À faire |
| 44 | Ensemble | Tests dashboard : CRUD missions, modération témoignages, routage contact | 1 juillet | 🔵 À faire |
| 45 | Ensemble | Seed BDD avec données proches du réel | 1 juillet | 🔵 À faire |
| 46 | Ensemble | Audit Lighthouse — corrections prioritaires | 2 juillet | 🔵 À faire |
| 47 | Ensemble | Accessibilité de base : labels, alt, focus | 2 juillet | 🔵 À faire |
| 48 | Ensemble | Préparation soutenance / démo MVP | 2-3 juillet | 🔵 À faire |
| 49 | Ensemble | 🎯 LIVRAISON MVP — 3 juillet 2026 | 3 juillet | 🔵 À faire |

---

## Phase 2 — 3 › 17 juillet 2026 : Dashboard complet + Pages secondaires
*Objectif : Dashboard étendu à toutes les entités. Pages secondaires développées.*

---

### S7 — 3 › 10 juillet · Dashboard étendu [Admin] [Back]

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 50 | Gwen | Dashboard : gestion médias + équipe + rapports d'activité | 3-7 juillet | 🔵 À faire |
| 51 | Gwen | Responsive dashboard (mobile : modération uniquement) | 7-8 juillet | 🔵 À faire |
| 52 | Alison | APIs : médias, équipe, rapports | 3-7 juillet | 🔵 À faire |
| 53 | Alison | CRUD actions terrain + tags | 7-8 juillet | 🔵 À faire |
| 54 | Alison | Tests d'intégration : auth, missions, témoignages, contact | 8-10 juillet | 🔵 À faire |

---

### S8 — 10 › 17 juillet · Pages secondaires front [Front] [Back]

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 55 | Gwen | Page /lieux/:slug (LocationDetail.jsx) | 10-12 juillet | 🔵 À faire |
| 56 | Gwen | Page /equipe — TeamMemberCard + DelegationCard | 12-14 juillet | 🔵 À faire |
| 57 | Gwen | Pages statiques : Rapports d'activité, Soutenir | 14-15 juillet | 🔵 À faire |
| 58 | Alison | APIs restantes : locations, équipe, rapports | 10-14 juillet | 🔵 À faire |
| 59 | Alison | Corrections bugs post-recette | 14-17 juillet | 🔵 À faire |
| 60 | Ensemble | 🧊 Code freezé — pause estivale | 17 juillet | 🔵 À faire |

---

## Phase 3 — Septembre 2026 : Finalisation & Déploiement

### Sept. S1 · Pages éditoriales complètes

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 61 | Gwen | Page Actions terrain + détail (badges ODD) | Sept. S1 | 🔵 À faire |
| 62 | Gwen | Page Actions éducatives | Sept. S1 | 🔵 À faire |
| 63 | Gwen | Page Médias & Actualités (filtres) | Sept. S1 | 🔵 À faire |
| 64 | Alison | APIs : actions terrain, actions éducatives, médias | Sept. S1 | 🔵 À faire |
| 65 | Alison | Seed BDD avec contenus réels de l'association | Sept. S1 | 🔵 À faire |

### Sept. S2 · Polishing + SEO + Bilingue

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 66 | Gwen | Compteurs d'impact animés (Accueil) | Sept. S2 | 🔵 À faire |
| 67 | Gwen | Bilingue FR/EN — react-i18next | Sept. S2 | 🔵 À faire |
| 68 | Gwen | Accessibilité WCAG 2.1 AA — audit complet | Sept. S2 | 🔵 À faire |
| 69 | Alison | SEO : méta, Open Graph, sitemap XML, robots.txt | Sept. S2 | 🔵 À faire |
| 70 | Alison | Audit Lighthouse final — objectif > 90 | Sept. S2 | 🔵 À faire |
| 71 | Gwen | Optimisations : WebP, lazy loading images | Sept. S2 | 🔵 À faire |

### Sept. S3 · Déploiement

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 72 | Gwen | Dockerfile production (multi-stage build) | Sept. S3 | 🔵 À faire |
| 73 | Gwen | VPS + Docker + Nginx + SSL (Let's Encrypt) | Sept. S3 | 🔵 À faire |
| 74 | Alison | Migration contenus réels (photos, textes) | Sept. S3 | 🔵 À faire |
| 75 | Alison | Variables d'env production + secrets | Sept. S3 | 🔵 À faire |
| 76 | Ensemble | UptimeRobot monitoring + tests production HTTPS | Sept. S3 | 🔵 À faire |

### Sept. S4 · Livraison finale

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 77 | Ensemble | Tests en conditions de production | Sept. S4 | 🔵 À faire |
| 78 | Ensemble | Guide utilisateur dashboard (PDF) | Sept. S4 | 🔵 À faire |
| 79 | Ensemble | Remise des accès : GitHub, VPS, admin, UptimeRobot | Sept. S4 | 🔵 À faire |
| 80 | Ensemble | Corrections finales post-tests | Sept. S4 | 🔵 À faire |
| 81 | Ensemble | 🎉 LIVRAISON OFFICIELLE à l'association | Fin sept. 2026 | 🔵 À faire |

---

## Récapitulatif des phases

| Phase | Période | Périmètre | Livrable |
|---|---|---|---|
| Phase 1 — MVP + Dashboard | 28 mai › 3 juillet | Pages publiques + dashboard admin | MVP + dashboard fonctionnels |
| Phase 2 — Dashboard complet | 3 › 17 juillet | Dashboard étendu + pages secondaires | Site quasi-complet |
| Pause estivale | Août 2026 | Code freezé sur branche dev propre | — |
| Phase 3 — Finalisation | Septembre 2026 | Pages éditoriales + SEO + bilingue + déploiement | Site en production ✅ |