# Sprint Reviews — Sens Solidaires

Revue de chaque sprint : objectif, livré, démonstration. Basé sur `docs/planning.md` et `docs/JDB.md`.

---

## Sprint 1 — 28 au 30 mai 2026 : Initialisation

**Objectif** : mettre en place l'environnement de développement complet (repo, stack, Docker, BDD de base).

**Livré**
- Repo GitHub + structure monorepo (`frontend` / `backend` / `docs`) + 4 branches
- React + Tailwind CSS v4 + Vite + React Router installés et fonctionnels
- Node.js + Express avec route `/api/health`
- PostgreSQL + Prisma v7 configurés, 3 premières tables créées (Mission, MissionPricing, Location)
- Docker Compose opérationnel (3 conteneurs)

**Démonstration**

[Capture à insérer — `docker compose up` + `localhost:5173` + `localhost:3000/api/health`]

---

## Sprint 2 — 2 au 6 juin 2026 : Fondations frontend + Auth backend

**Objectif** : poser le design system et l'authentification admin.

**Livré**
- Design system Tailwind (palette, typographie) + composants Figma
- Layout global (Navbar, Footer), page Accueil statique, page Login admin
- Authentification JWT complète (login, logout, refresh token, middleware)
- Seed BDD avec données de test

**Démonstration**

[Capture à insérer — page Login admin + page Accueil statique]

---

## Sprint 3 — 9 au 13 juin 2026 : Missions

**Objectif** : connecter la page Missions et le détail mission à l'API.

**Livré**
- Page Accueil connectée à l'API
- Page `/missions` — 4 sections par type, filtres, navigation par ancres
- Page `/missions/:slug` — détail mission complet
- Routes API missions (liste, filtres, détail avec relations)

**Démonstration**

[Capture à insérer — page `/missions` avec filtres + page détail d'une mission]

---

## Sprint 4 — 16 au 20 juin 2026 : Témoignages + Contact + Pages secondaires

**Objectif** : ouvrir le site aux contributions publiques (témoignages, contact) et enrichir les pages institutionnelles.

**Livré**
- Page témoignages (soumission + affichage) avec RGPD
- Formulaire de contact + envoi d'email (Resend)
- Pages légales (mentions, confidentialité, cookies)
- Pages À propos, Équipe, Soutenir, Rapports d'activité
- CRUD admin missions (backend) + dashboard sidebar/layout/routes protégées
- Modération des témoignages (backend)

**Démonstration**

[Capture à insérer — formulaire de soumission témoignage + dashboard modération]

---

## Sprint 5 — 23 au 27 juin 2026 : Dashboard + Responsive

**Objectif** : connecter le dashboard front et rendre tout le site responsive.

**Livré**
- Dashboard : CRUD missions front, modération témoignages, routage email contact
- Responsive mobile-first sur toutes les pages MVP (375 / 768 / 1024 / 1440)
- Harmonisation CSS (gap scale, utilities)

**Démonstration**

[Capture à insérer — dashboard sur desktop + une page publique en version mobile]

---

## Sprint 6 — 30 juin au 3 juillet 2026 : Sprint final MVP

**Objectif** : finaliser toutes les pages restantes et livrer le MVP.

**Livré**
- Migration des pages restantes (LocationDetail, MediaDetail, Education, Missions, Soutenir)
- 5 migrations BDD (delegation_id, map_url, website_url, show_homepage, FieldActionCountry)
- FooterCta dynamique par route
- Navbar dropdown missions dynamique
- CRUD missions dashboard complet (9 blocs — informations, tarifs, programme, galerie, PDF)
- Renommage officiel "Sens Solidaire" → "Sens Solidaires"

**Démonstration**

[Capture à insérer — parcours complet : navbar dynamique → page mission → dashboard CRUD complet]

**🎯 LIVRAISON MVP — 3 juillet 2026**

---

## Sprint 7 — 7 juillet 2026 → en cours : Dashboard complet + Documentation

**Objectif** : étendre le dashboard (médias, équipe, rapports, actions terrain) et consolider la documentation/qualité.

**Livré à ce jour**
- README complet (racine, backend, frontend, docs) — architecture, BDD, installation, tests
- Migration BDD : FK `mission_id` sur `MissionReport`
- Setup Vitest + 4 tests unitaires frontend
- Résolution de la vulnérabilité `npm audit` (vite)
- Correction `LoginAdmin.jsx` (fetch direct → `services/api.js`)

**En cours / à venir**
- Dashboard : gestion médias, équipe, rapports d'activité, actions terrain
- Upload Multer

**Démonstration**

[Capture à insérer — une fois le sprint terminé]

> Ce sprint n'est pas encore clôturé — la revue sera complétée à la fin du Sprint 7.# Sprint Reviews — Sens Solidaires

Revue de chaque sprint : objectif, livré, démonstration. Basé sur `docs/planning.md` et `docs/JDB.md`.

---

## Sprint 1 — 28 au 30 mai 2026 : Initialisation

**Objectif** : mettre en place l'environnement de développement complet (repo, stack, Docker, BDD de base).

**Livré**
- Repo GitHub + structure monorepo (`frontend` / `backend` / `docs`) + 4 branches
- React + Tailwind CSS v4 + Vite + React Router installés et fonctionnels
- Node.js + Express avec route `/api/health`
- PostgreSQL + Prisma v7 configurés, 3 premières tables créées (Mission, MissionPricing, Location)
- Docker Compose opérationnel (3 conteneurs)

**Démonstration**

[Capture à insérer — `docker compose up` + `localhost:5173` + `localhost:3000/api/health`]

---

## Sprint 2 — 2 au 6 juin 2026 : Fondations frontend + Auth backend

**Objectif** : poser le design system et l'authentification admin.

**Livré**
- Design system Tailwind (palette, typographie) + composants Figma
- Layout global (Navbar, Footer), page Accueil statique, page Login admin
- Authentification JWT complète (login, logout, refresh token, middleware)
- Seed BDD avec données de test

**Démonstration**

[Capture à insérer — page Login admin + page Accueil statique]

---

## Sprint 3 — 9 au 13 juin 2026 : Missions

**Objectif** : connecter la page Missions et le détail mission à l'API.

**Livré**
- Page Accueil connectée à l'API
- Page `/missions` — 4 sections par type, filtres, navigation par ancres
- Page `/missions/:slug` — détail mission complet
- Routes API missions (liste, filtres, détail avec relations)

**Démonstration**

[Capture à insérer — page `/missions` avec filtres + page détail d'une mission]

---

## Sprint 4 — 16 au 20 juin 2026 : Témoignages + Contact + Pages secondaires

**Objectif** : ouvrir le site aux contributions publiques (témoignages, contact) et enrichir les pages institutionnelles.

**Livré**
- Page témoignages (soumission + affichage) avec RGPD
- Formulaire de contact + envoi d'email (Resend)
- Pages légales (mentions, confidentialité, cookies)
- Pages À propos, Équipe, Soutenir, Rapports d'activité
- CRUD admin missions (backend) + dashboard sidebar/layout/routes protégées
- Modération des témoignages (backend)

**Démonstration**

[Capture à insérer — formulaire de soumission témoignage + dashboard modération]

---

## Sprint 5 — 23 au 27 juin 2026 : Dashboard + Responsive

**Objectif** : connecter le dashboard front et rendre tout le site responsive.

**Livré**
- Dashboard : CRUD missions front, modération témoignages, routage email contact
- Responsive mobile-first sur toutes les pages MVP (375 / 768 / 1024 / 1440)
- Harmonisation CSS (gap scale, utilities)

**Démonstration**

[Capture à insérer — dashboard sur desktop + une page publique en version mobile]

---

## Sprint 6 — 30 juin au 3 juillet 2026 : Sprint final MVP

**Objectif** : finaliser toutes les pages restantes et livrer le MVP.

**Livré**
- Migration des pages restantes (LocationDetail, MediaDetail, Education, Missions, Soutenir)
- 5 migrations BDD (delegation_id, map_url, website_url, show_homepage, FieldActionCountry)
- FooterCta dynamique par route
- Navbar dropdown missions dynamique
- CRUD missions dashboard complet (9 blocs — informations, tarifs, programme, galerie, PDF)
- Renommage officiel "Sens Solidaire" → "Sens Solidaires"

**Démonstration**

[Capture à insérer — parcours complet : navbar dynamique → page mission → dashboard CRUD complet]

**🎯 LIVRAISON MVP — 3 juillet 2026**

---

## Sprint 7 — 7 juillet 2026 → en cours : Dashboard complet + Documentation

**Objectif** : étendre le dashboard (médias, équipe, rapports, actions terrain) et consolider la documentation/qualité.

**Livré à ce jour**
- README complet (racine, backend, frontend, docs) — architecture, BDD, installation, tests
- Migration BDD : FK `mission_id` sur `MissionReport`
- Setup Vitest + 4 tests unitaires frontend
- Résolution de la vulnérabilité `npm audit` (vite)
- Correction `LoginAdmin.jsx` (fetch direct → `services/api.js`)

**En cours / à venir**
- Dashboard : gestion médias, équipe, rapports d'activité, actions terrain
- Upload Multer

**Démonstration**

[Capture à insérer — une fois le sprint terminé]

> Ce sprint n'est pas encore clôturé — la revue sera complétée à la fin du Sprint 7.