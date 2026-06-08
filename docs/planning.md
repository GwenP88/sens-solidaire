# Planning de développement — Sens Solidaire
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*
*Mise à jour : 8 juin 2026 · Tient compte du retard accumulé en S2*

**Légende** : ✅ Terminé · ⚠️ En retard · 🔵 À faire · 🔴 Bloqué
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
| 08 | Gwen | Page Accueil assemblée dans Figma — toutes les sections (Hero, Missions, Témoignages, Actions terrain, Partenaires, Footer) | 4-6 juin | ✅ Terminé |

#### Dev frontend

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 09 | Gwen | Configurer Tailwind avec le design system (palette, typographie) | À faire S2/S3 | ✅ Terminé |
| 10 | Gwen | Composants de base : Button (Primary + Secondary), Badge ODD | À faire S2/S3 | ✅ Terminé |
| 11 | Gwen | Layout global : Navbar + Footer + structure `<Outlet />` React Router | À faire S2/S3 | ✅ Terminé |
| 12 | Gwen | Page Accueil statique : Hero + StatsBar + sections (contenu en dur) | À faire S2/S3 | ⚠️ En retard |
| 13 | Gwen | Page Login admin (formulaire + appel API POST /auth/login) | À faire S2/S3 | ⚠️ En retard |

#### Dev backend

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 14 | Alison | Auth JWT : login / logout / refresh token | À faire S2/S3 | ✅ Terminé |
| 15 | Alison | Middleware authMiddleware — protection des routes admin | À faire S2/S3 | ✅ Terminé |
| 16 | Alison | Route POST /api/auth/login + bcrypt | À faire S2/S3 | ✅ Terminé |
| 17 | Alison | Seed BDD — données de test (missions, témoignages, admin) | À faire S2/S3 | ⚠️ En retard |
| 18 | Ensemble | Test connexion front ↔ back (CORS) + docker compose up avec données | À faire S2/S3 | ⚠️ En retard |

> ⚠️ **S2 — FIGMA COMPLÈTE · DEV FRONTEND EN RETARD · Tâches 10 à 13, 17, 18 à rattraper en S3**

---

### S3 — 9 › 13 juin · Rattrapage S2 + Début Missions [Front] [Back] [Admin]
*Objectif : Rattraper S2. /missions connecté aux données. CRUD missions opérationnel.*

#### Priorité 1 — Rattraper S2 (9-11 juin)

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 19 | Gwen | Composants de base : Button (Primary + Secondary) | 9 juin | 🔵 À faire |
| 20 | Gwen | Layout global : Navbar + Footer + React Router Outlet | 9-10 juin | 🔵 À faire |
| 21 | Gwen | Page Accueil statique (Hero, StatsBar, sections) | 10-11 juin | 🔵 À faire |
| 22 | Gwen | Page Login admin (form + appel API) | 11 juin | 🔵 À faire |
| 23 | Alison | Seed BDD — données de test réalistes | 10 juin | 🔵 À faire |
| 24 | Ensemble | Test connexion front ↔ back (CORS) + Docker fonctionnel avec données | 11 juin | 🔵 À faire |

#### Priorité 2 — Missions (si S2 rattrapée avant jeudi)

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 25 | Gwen | Page /missions : liste + FilterChips + MissionCard | 12-13 juin | 🔵 À faire |
| 26 | Gwen | Page /missions/:slug : détail + AnchorNav | 12-13 juin | 🔵 À faire |
| 27 | Alison | GET /api/missions (liste + filtres) | 12 juin | 🔵 À faire |
| 28 | Alison | GET /api/missions/:slug + pricing | 12-13 juin | 🔵 À faire |
| 29 | Alison | Service + Controller missions | 12-13 juin | 🔵 À faire |

> 📅 RDV cliente à planifier — logo blanc, logos partenaires, validation types missions

---

### S4 — 16 › 20 juin · Missions complètes + Témoignages [Front] [Back] [Admin]
*Objectif : CRUD missions dashboard. Soumission et modération témoignages fonctionnelles.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 30 | Gwen | CRUD /api/admin/missions — DashboardTable + DashboardForm missions | 16-17 juin | 🔵 À faire |
| 31 | Alison | CRUD /api/admin/missions (back) | 16-17 juin | 🔵 À faire |
| 32 | Gwen | Page Témoignages + TestimonialCard + TestimonialForm (RGPD) | 18-19 juin | 🔵 À faire |
| 33 | Alison | GET /api/testimonials (validés) + POST /api/testimonials + PATCH admin | 18-19 juin | 🔵 À faire |
| 34 | Alison | ModerationCard témoignages — dashboard | 19-20 juin | 🔵 À faire |
| 35 | Ensemble | Flux complet : soumission → modération → affichage | 20 juin | 🔵 À faire |

---

### S5 — 23 › 27 juin · Contact + Upload + Responsive [Front] [Back] [Admin]
*Objectif : Email de contact envoyé. Upload fichiers. Responsive mobile-first.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 36 | Gwen | Page Contact + ContactForm | 23-24 juin | 🔵 À faire |
| 37 | Gwen | Mentions légales + bannière cookies CNIL | 24 juin | 🔵 À faire |
| 38 | Gwen | Responsive mobile-first — toutes pages MVP (375px / 768px) | 24-26 juin | 🔵 À faire |
| 39 | Alison | POST /api/contact + Resend / Nodemailer | 23-24 juin | 🔵 À faire |
| 40 | Alison | Dashboard : Sidebar + layout desktop + paramètres routage email | 24-25 juin | 🔵 À faire |
| 41 | Alison | Upload fichiers Multer (images + PDFs) | 25-26 juin | 🔵 À faire |
| 42 | Ensemble | Email de contact envoyé et reçu — test complet | 27 juin | 🔵 À faire |

---

### S6 — 30 juin › 3 juillet · Recette MVP + Dashboard [Setup]
*Objectif : MVP + dashboard testés, validés, prêts pour la démo du 3 juillet.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 43 | Ensemble | Tests complets des 5 pages publiques en conditions réelles | 30 juin | 🔵 À faire |
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
*Objectif : Toutes les entités gérables depuis le dashboard. Upload opérationnel.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 50 | Gwen | Dashboard : gestion médias + équipe + rapports d'activité | 3-7 juillet | 🔵 À faire |
| 51 | Gwen | Responsive dashboard (mobile : modération uniquement) | 7-8 juillet | 🔵 À faire |
| 52 | Alison | APIs : médias, équipe, rapports | 3-7 juillet | 🔵 À faire |
| 53 | Alison | CRUD actions terrain + tags | 7-8 juillet | 🔵 À faire |
| 54 | Alison | Tests d'intégration : auth, missions, témoignages, contact | 8-10 juillet | 🔵 À faire |

---

### S8 — 10 › 17 juillet · Pages secondaires front [Front] [Back]
*Objectif : Pages éditoriales développées. Code freezé avant pause estivale.*

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 55 | Gwen | Page /lieux/:slug (LocationDetail.jsx) — hero + retour mission + galerie | 10-12 juillet | 🔵 À faire |
| 56 | Gwen | Page /equipe — TeamMemberCardLarge + TeamMemberCardSmall + DelegationCard | 12-14 juillet | 🔵 À faire |
| 57 | Gwen | Pages statiques : Rapports d'activité, Soutenir | 14-15 juillet | 🔵 À faire |
| 58 | Alison | APIs restantes : locations, équipe, rapports | 10-14 juillet | 🔵 À faire |
| 59 | Alison | Corrections bugs post-recette | 14-17 juillet | 🔵 À faire |
| 60 | Ensemble | 🧊 Code freezé sur branche dev propre — pause estivale | 17 juillet | 🔵 À faire |

---

## Phase 3 — Septembre 2026 : Finalisation & Déploiement
*Objectif : Site complet, optimisé, en production. Livraison officielle à l'association.*

---

### Sept. S1 · Pages éditoriales complètes [Front] [Back]

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 61 | Gwen | Page Actions terrain + détail (badges ODD) | Sept. S1 | 🔵 À faire |
| 62 | Gwen | Page Actions éducatives | Sept. S1 | 🔵 À faire |
| 63 | Gwen | Page Médias & Actualités (filtres) | Sept. S1 | 🔵 À faire |
| 64 | Alison | APIs : actions terrain, actions éducatives, médias | Sept. S1 | 🔵 À faire |
| 65 | Alison | Seed BDD avec contenus réels de l'association | Sept. S1 | 🔵 À faire |

---

### Sept. S2 · Polishing + SEO + Bilingue [Front] [Back]

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 66 | Gwen | Compteurs d'impact animés (Accueil) | Sept. S2 | 🔵 À faire |
| 67 | Gwen | Bilingue FR/EN — react-i18next + traductions complètes | Sept. S2 | 🔵 À faire |
| 68 | Gwen | Accessibilité WCAG 2.1 AA — audit complet | Sept. S2 | 🔵 À faire |
| 69 | Alison | SEO : méta, Open Graph, sitemap XML, robots.txt | Sept. S2 | 🔵 À faire |
| 70 | Alison | Audit Lighthouse final — objectif > 90 sur toutes les pages | Sept. S2 | 🔵 À faire |
| 71 | Gwen | Optimisations : WebP, lazy loading images | Sept. S2 | 🔵 À faire |

---

### Sept. S3 · Déploiement [Docker] [Setup]

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 72 | Gwen | Dockerfile production (multi-stage build) | Sept. S3 | 🔵 À faire |
| 73 | Gwen | VPS + Docker + Nginx + SSL (Let's Encrypt) | Sept. S3 | 🔵 À faire |
| 74 | Alison | Migration contenus réels (photos, textes) | Sept. S3 | 🔵 À faire |
| 75 | Alison | Variables d'env production + secrets | Sept. S3 | 🔵 À faire |
| 76 | Ensemble | UptimeRobot monitoring + tests production HTTPS | Sept. S3 | 🔵 À faire |

---

### Sept. S4 · Livraison finale [Setup]

| # | Dev | Tâche | Période | Statut |
|---|---|---|---|---|
| 77 | Ensemble | Tests en conditions de production (parcours utilisateur complets) | Sept. S4 | 🔵 À faire |
| 78 | Ensemble | Guide utilisateur dashboard (PDF) | Sept. S4 | 🔵 À faire |
| 79 | Ensemble | Remise des accès : GitHub, VPS, admin, UptimeRobot | Sept. S4 | 🔵 À faire |
| 80 | Ensemble | Corrections finales post-tests | Sept. S4 | 🔵 À faire |
| 81 | Ensemble | 🎉 LIVRAISON OFFICIELLE à l'association | Fin sept. 2026 | 🔵 À faire |

---

## Récapitulatif des phases

| Phase | Période | Périmètre | Livrable |
|---|---|---|---|
| Phase 1 — MVP + Dashboard | 28 mai › 3 juillet | 5 pages publiques + dashboard admin — retard S2 à rattraper en S3 | MVP + dashboard fonctionnels |
| Phase 2 — Dashboard complet | 3 › 17 juillet | Dashboard étendu + pages secondaires + composants équipe/délégations | Site quasi-complet |
| Pause estivale | Août 2026 | Code freezé sur branche dev propre | — |
| Phase 3 — Finalisation | Septembre 2026 | Pages éditoriales + SEO + bilingue + déploiement + livraison | Site en production ✅ |

---

> ⚠️ **Point de vigilance — Retard S2**
> La S2 (2-6 juin) a été consacrée à finaliser les maquettes Figma. Le design system est complet et validé — c'est un actif majeur.
> Les tâches dev de la S2 (composants de base, layout, seed BDD) sont à rattraper impérativement en S3 (9-11 juin) avant d'attaquer les missions.
> **Le livrable MVP du 3 juillet reste atteignable si le rattrapage est effectué cette semaine.**