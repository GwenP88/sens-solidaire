# Bug Tracker — Sens Solidaires

Suivi des bugs rencontrés et résolus au cours du développement, extrait du Journal de bord (`JDB.md`).

**Légende priorité** : 🔴 Haute (bloquant) · 🟠 Moyenne · 🟡 Basse (cosmétique/mineur)

---

## Environnement & Docker

| ID | Bug | Cause | Solution | Priorité | Statut |
|---|---|---|---|---|---|
| BUG-01 | `npx prisma init` — dossier déjà existant | Le dossier `/prisma` existait déjà | Création manuelle de `prisma.config.ts` et `schema.prisma` | 🟠 | ✅ Résolu |
| BUG-02 | Prisma v7 — `url` dans `schema.prisma` non supportée | Changement de syntaxe entre Prisma v6 et v7 | Déplacement de la config dans `prisma.config.ts` avec `defineConfig` | 🟠 | ✅ Résolu |
| BUG-03 | `npx prisma db push` — erreur P1000 authentication failed | Mot de passe PostgreSQL incorrect | `ALTER USER postgres WITH PASSWORD 'postgres'` dans `psql` | 🔴 | ✅ Résolu |
| BUG-04 | Fichiers `Zone.Identifier` dans `/docs` | Métadonnées Windows créées au téléchargement | `find . -name '*Zone*' -delete` + règle ajoutée au `.gitignore` | 🟡 | ✅ Résolu |
| BUG-05 | Docker crash au démarrage (backend) | Prisma Client non généré dans le conteneur | `RUN npx prisma generate` ajouté au `Dockerfile` | 🔴 | ✅ Résolu |
| BUG-06 | `secretOrPrivateKey must have a value` | `JWT_REFRESH_SECRET` manquant dans `docker-compose.yml` | Variable ajoutée à l'environnement du service backend | 🔴 | ✅ Résolu |
| BUG-07 | `package.json` pointait vers le mauvais `server.js` | `main` et scripts pointaient vers la racine au lieu de `src/server.js` | Chemins corrigés dans `package.json` | 🟠 | ✅ Résolu |
| BUG-08 | Prisma Studio — "Could not load schema metadata" | Bug connu de Prisma Studio v7 dans un environnement Docker | Contournement : `docker compose exec postgres psql -U postgres -d sensolidaire` | 🟠 | ✅ Résolu (contournement) |
| BUG-09 | `Failed to resolve import "react-icons/fa"` | Volume anonyme `node_modules` périmé après rebuild | `docker-compose down -v` + rebuild complet | 🟠 | ✅ Résolu |
| BUG-10 | Port frontend sur `:5174` au lieu de `:5173` | Un `npm run dev` manuel tournait en parallèle du conteneur Docker | Arrêt du process manuel — une seule instance à la fois | 🟡 | ✅ Résolu |
| BUG-11 | Port `3000` déjà occupé | Ancien process backend encore actif | `lsof -i :3000` puis `kill <PID>` | 🟡 | ✅ Résolu |
| BUG-12 | `resend` disparaît après rebuild Docker | Package installé sans `--save`, non persisté dans `package.json` | Réinstallation avec `--save` | 🟠 | ✅ Résolu |
| BUG-13 | Vulnérabilité `npm audit` (high) sur `vite` | Failles connues sur `vite` 8.0.0–8.0.15 (spécifiques Windows) | `npm audit fix` — 0 vulnérabilité restante | 🟠 | ✅ Résolu |

---

## Backend & Prisma

| ID | Bug | Cause | Solution | Priorité | Statut |
|---|---|---|---|---|---|
| BUG-14 | `Cannot find module 'dotenv/config'` | Prisma v7 ne charge plus le `.env` automatiquement | `npm install dotenv` + import explicite dans `server.js`/`seed.js` | 🔴 | ✅ Résolu |
| BUG-15 | `SASL: client password must be a string` | `dotenv/config` manquant dans `server.js` et `seed.js` | Ajout de l'import `dotenv/config` | 🔴 | ✅ Résolu |
| BUG-16 | CORS bloqué | Frontend accédé via `127.0.0.1:5173` au lieu de `localhost:5173` | Toujours utiliser `localhost` pour matcher la config CORS backend | 🟠 | ✅ Résolu |
| BUG-17 | `Mission.type` — colonne inexistante | Migration non appliquée après ajout du champ au schéma | `npx prisma db push` pour resynchroniser | 🔴 | ✅ Résolu |
| BUG-18 | Migration `P3018` bloquée (`short_description` NOT NULL) | Lignes existantes avec valeur `null`, backfill manquant | `UPDATE` de backfill + `prisma migrate resolve --rolled-back` + `migrate deploy` | 🔴 | ✅ Résolu |
| BUG-19 | Doublons de missions en base (id 1-5 vs 6-14) | `upsert` cherchait par `slug`, anciens slugs différents → branche `create` au lieu de `update` | Suppression ordonnée enfants → parents (pricing, location, testimonial puis mission) | 🟠 | ✅ Résolu |
| BUG-20 | `SyntaxError: Identifier 'findAll' has already been declared` | Double ligne d'import dans `missionController.js` | Suppression du doublon d'import | 🟡 | ✅ Résolu |
| BUG-21 | `ReferenceError: updateMission is not defined` | Route ajoutée sans import de la fonction correspondante | Ajout de l'import manquant | 🟡 | ✅ Résolu |
| BUG-22 | `does not provide an export named 'deleteMisson'` | Faute de frappe (`Misson` au lieu de `Mission`) | Correction orthographique | 🟡 | ✅ Résolu |
| BUG-23 | `socket hang up` / `connection reset` (Postman + curl) | Serveur crashé au démarrage suite à une erreur de code non détectée | Réflexe : lire `docker-compose logs backend` en premier | 🔴 | ✅ Résolu |
| BUG-24 | 401 sur l'API alors que connectée | Typo `accesToken` (1 seul "s") dans le code → `localStorage` stockait `"undefined"` | Correction du nom de variable | 🟠 | ✅ Résolu |
| BUG-25 | `Cannot read properties of null (reading 'title')` | Témoignage sans mission liée (`mission = null`), relation nullable non gérée | Optional chaining `?.` ajouté | 🟠 | ✅ Résolu |
| BUG-26 | Route GET admin câblée sur le controller public | Mauvais controller importé dans le routeur admin | Correction de l'import (`getAdminTestimonials` au lieu de `getTestimonials`) | 🟠 | ✅ Résolu |
| BUG-27 | Seed `PrismaClientValidationError` sur `countries` | Syntaxe tableau de strings utilisée au lieu d'une relation Prisma | `countries: { create: [{ country: 'Kenya' }] }` | 🟠 | ✅ Résolu |
| BUG-28 | Seed `FieldAction` — erreur de contrainte FK au `deleteMany` | Ordre de suppression incorrect (parent supprimé avant les enfants) | Ordre corrigé : `tags` → `odds` → `media` → `fieldAction` | 🟠 | ✅ Résolu |
| BUG-29 | Erreur de validation Prisma — relation `MissionReport` manquante | FK `mission_id` ajoutée côté `MissionReport` sans relation inverse `missionReports[]` sur `Mission` | Ajout du champ inverse sur le modèle `Mission` | 🟠 | ✅ Résolu |

---

## Frontend & React

| ID | Bug | Cause | Solution | Priorité | Statut |
|---|---|---|---|---|---|
| BUG-30 | Boutons trop grands dans le test `App.jsx` | Absence de `items-start` sur le conteneur flex parent | Ajout de `items-start` | 🟡 | ✅ Résolu |
| BUG-31 | Tous les liens navbar affichés comme "actifs" (soulignés) | Condition `location.pathname === '/'` copiée sur tous les liens sans ajuster le chemin | Condition corrigée pour chaque lien | 🟡 | ✅ Résolu |
| BUG-32 | `No routes matched location "/missions"` | Route non déclarée dans `App.jsx`, page `Missions.jsx` inexistante | Création de la page + déclaration de la route | 🔴 | ✅ Résolu |
| BUG-33 | Page blanche après ajout de la route `/missions` | Commentaire `/* */` non fermé dans `App.jsx` | Remplacement par des commentaires `//` | 🔴 | ✅ Résolu |
| BUG-34 | Page toujours blanche malgré la correction | `App.jsx` non sauvegardé (`Ctrl+S` oublié) | Sauvegarde du fichier | 🟡 | ✅ Résolu |
| BUG-35 | Dégradé `MissionInfoBar` passait devant la navbar | `z-index` trop élevé + mauvais conteneur parent | Dégradé sorti du `flex overflow-x-auto`, `overflow-hidden` sur le parent | 🟠 | ✅ Résolu |
| BUG-36 | Boutons `MissionCTA` prenaient toute la largeur | Combinaison `flex-1` + `fullWidth` mal utilisée | Suppression de `flex-1`/`fullWidth`, conteneur `flex-col` mobile / `flex-row` desktop | 🟡 | ✅ Résolu |
| BUG-37 | `react-scroll` incompatible React 19 | Librairie non maintenue pour cette version de React | Remplacé par `smoothScrollTo` custom (`window.scrollTo` avec `behavior: 'smooth'`) | 🟠 | ✅ Résolu |
| BUG-38 | Module `Navigation` de Swiper v12 cassé en React | Bug connu de Swiper v12 avec React | Navigation custom via `useRef` + boutons externes (`slidePrev`/`slideNext`) | 🟠 | ✅ Résolu |

---

## Tests (Vitest)

| ID | Bug | Cause | Solution | Priorité | Statut |
|---|---|---|---|---|---|
| BUG-39 | `ReferenceError: expect is not defined` (setupTests.js) | `@testing-library/jest-dom` importé en version Jest, incompatible avec Vitest | Import changé pour `@testing-library/jest-dom/vitest` | 🔴 | ✅ Résolu |
| BUG-40 | `Found multiple elements with the role "checkbox"` | Le DOM n'était pas nettoyé entre les tests (`cleanup()` non configuré) | Ajout de `afterEach(() => cleanup())` dans `setupTests.js` | 🔴 | ✅ Résolu |

---

## Git & Environnement

| ID | Bug | Cause | Solution | Priorité | Statut |
|---|---|---|---|---|---|
| BUG-41 | `git checkout` refusé — fichiers de migration non trackés en conflit | Fichier de migration Prisma présent sur le disque mais non reconnu comme identique par Git | Déplacement temporaire (`mv`), vérification par `diff`, suppression après confirmation d'identité | 🟠 | ✅ Résolu |
| BUG-42 | `rm` refusé — Permission denied sur un fichier de migration | Fichier créé depuis l'intérieur du conteneur Docker, propriétaire `root` | `sudo rm -rf` | 🟡 | ✅ Résolu |
| BUG-43 | Conflit de merge sur `backend/.env` / `.env.example` | Détrackage du `.env` par un membre de l'équipe pendant que l'autre avait un commit le référençant encore | Résolution manuelle : suppression de `.env.backup`, fusion des variables dans `.env.example` | 🟠 | ✅ Résolu |
| BUG-44 | `backend/.env` supprimé du disque après un `git pull` | Le fichier n'étant plus suivi par Git, le pull a appliqué sa suppression physique | Récupération du contenu via `git show <commit>:backend/.env`, recréation manuelle + mise à jour de la clé Resend | 🔴 | ✅ Résolu |

---

## Récapitulatif

| Catégorie | Nombre de bugs | Tous résolus ? |
|---|---|---|
| Environnement & Docker | 13 | ✅ |
| Backend & Prisma | 16 | ✅ |
| Frontend & React | 9 | ✅ |
| Tests (Vitest) | 2 | ✅ |
| Git & Environnement | 4 | ✅ |
| **Total** | **44** | ✅ |

**Aucun bug bloquant non résolu** à ce jour dans le périmètre MVP.