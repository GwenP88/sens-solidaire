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
| BUG-53 | `multer` et 12 autres paquets absents du conteneur backend | Volume anonyme `node_modules` créé lors d'un build antérieur à l'ajout de la dépendance : le conteneur ne reflétait plus le `package.json` | `docker exec sensolidaire_backend npm install` pour resynchroniser le volume | 🟠 | ✅ Résolu |

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
| BUG-52 | `seed.js` cassé — erreur de validation Prisma sur `location.upsert` | La migration `location_mission_many_to_many` a remplacé la FK `mission_id` par une relation N-N, mais les sept blocs `location.upsert` du seed passaient encore `mission_id: 1` | Remplacement par la syntaxe de relation `connect: { id: kenyaMission.id }` (id résolu par slug, pas codé en dur) — aucune migration modifiée | 🔴 | ✅ Résolu |

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

## Sécurité — audit du 26 août 2026

Audit de sécurité mené sur la branche `dev` avant rédaction du dossier.
Cinq défauts identifiés et corrigés, trois dettes assumées et documentées.

| ID | Bug | Cause | Solution | Priorité | Statut |
|---|---|---|---|---|---|
| BUG-45 | Écriture de fichier arbitraire via l'upload public (`POST /api/upload`) | `file.originalname`, envoyé par le client, passé directement à `path.join` : les segments `../` sortaient de `public/uploads`. Route non authentifiée + volume Docker monté + nodemon → écrasement possible de `src/app.js`, donc exécution de code | Nom de fichier reconstruit : `path.basename` puis liste blanche `[a-z0-9-]`. Le nom client devient un libellé, jamais un chemin | 🔴 | ✅ Résolu |
| BUG-46 | XSS stocké possible via l'extension d'un fichier uploadé | `file.mimetype` est déclaré par le client et l'extension d'origine était conservée : un `.html` annoncé `image/png` était stocké tel quel et servi par `express.static` depuis notre propre origine | Extension dérivée d'une table `EXTENSION_BY_MIMETYPE` ; un type absent de la table est refusé en 400 | 🔴 | ✅ Résolu |
| BUG-47 | Rejet d'upload renvoyé en 500 au lieu de 400 | Les erreurs de `fileFilter` et de Multer (`LIMIT_FILE_SIZE`) ne portaient pas de `status` et tombaient dans le 500 par défaut | Helper `rejectFile` posant `status = 400` + mapping des codes Multer dans le middleware d'erreur (`LIMIT_FILE_SIZE` → 413) | 🟠 | ✅ Résolu |
| BUG-48 | Access token valide 7 jours au lieu de 15 minutes | `expiresIn: "7d"` codé en dur dans `generateAccessToken`, en contradiction avec le commentaire, le README et les diagrammes. La rotation du refresh token ne protégeait plus rien | `expiresIn: process.env.JWT_EXPIRES_IN \|\| "15m"` + `JWT_EXPIRES_IN: 15m` dans `docker-compose.yml` | 🔴 | ✅ Résolu |
| BUG-49 | Injection HTML dans les emails du formulaire de contact | Les cinq champs du formulaire étaient interpolés bruts dans le corps HTML de l'email : un visiteur pouvait y injecter un lien de phishing paraissant venir de l'association | Fonction `escapeHtml` appliquée à tous les champs avant interpolation ; retours à la ligne reconvertis en `<br />` **après** échappement | 🟠 | ✅ Résolu |
| BUG-50 | Consentement RGPD stocké en dur | `consent_given: true` codé en dur dans `submitTestimonial` : l'enregistrement affirmait un consentement au lieu d'enregistrer celui reçu | `consent_given: data.consent_given === true`, valeur transmise depuis le controller (RGPD art. 7.1 — l'enregistrement doit pouvoir prouver le consentement) | 🟠 | ✅ Résolu |
| BUG-51 | Code mort dupliqué dans `authController.js` | `approveTestimonial` et `rejectTestimonial` dupliqués depuis `testimonialController.js` ; seules les versions de ce dernier étaient routées | Suppression de l'import et des deux fonctions après vérification par `grep` qu'aucun routeur ne les importait | 🟡 | ✅ Résolu |
| BUG-52 | `seed.js` cassé — erreur de validation Prisma sur `location.upsert` | La migration `location_mission_many_to_many` a remplacé la FK `mission_id` par une relation N-N, mais les blocs `location.upsert` du seed passaient encore `mission_id: 1`. Les IDs codés en dur étaient de plus devenus faux après dérive de la base de dev | Missions résolues par `slug` au lieu d'IDs en dur, et connexion via `missions: { connect: { id } }` — aucune migration modifiée | 🔴 | ✅ Résolu |
| BUG-53 | `multer` et 12 autres paquets absents du conteneur backend | Volume anonyme `node_modules` créé lors d'un build antérieur à l'ajout de la dépendance : le conteneur ne reflétait plus le `package.json` | `docker-compose down` + `up -d --build` pour repartir des `node_modules` de l'image | 🟠 | ✅ Résolu |
| BUG-54 | Conteneur frontend en boucle de redémarrage — `Error: value "builtin:vite-wasm-fallback" does not match any variant of enum BindingBuiltinPluginName` | Versions incompatibles entre `vite` et son moteur `rolldown` : le `Dockerfile` utilisait `npm install`, qui ignore le `package-lock.json` et réinstalle les dernières versions autorisées par les `^`. Le lock fixait vite 8.1.3, un rebuild ultérieur a installé un vite plus récent avec un rolldown resté en arrière | `npm install` → `npm ci` dans les deux Dockerfiles : `npm ci` installe exactement les versions du lockfile, ce qui rend les builds reproductibles | 🔴 | ✅ Résolu |
| BUG-55 | `docker-compose build` échoue — `PrismaConfigEnvError: Cannot resolve environment variable: MIGRATE_DATABASE_URL` | Régression introduite par la séparation des droits PostgreSQL : `prisma.config.ts` lisait la variable avec le helper `env()`, qui lève une erreur si elle est absente. Or le `Dockerfile` lance `npx prisma generate` **pendant le build**, où aucune variable du `docker-compose.yml` n'existe encore — celles-ci ne sont injectées qu'à l'exécution. Le conteneur en cours fonctionnait car construit avant le changement : seul un build depuis zéro révélait le problème | Lecture directe de `process.env.MIGRATE_DATABASE_URL` avec repli sur `DATABASE_URL` puis sur une valeur factice. `prisma generate` ne se connecte à aucune base, il n'a besoin que du schéma | 🔴 | ✅ Résolu |
---

## Dettes techniques assumées

Défauts identifiés, **volontairement non corrigés** dans le périmètre V1. Chacun est
non exploitable en l'état actuel de l'application ; le correctif est planifié.

| ID | Constat | Pourquoi non corrigé en V1 | Condition de reprise |
|---|---|---|---|
| DETTE-01 | `authMiddleware` vérifie l'authentification, pas l'autorisation : il ne lit jamais `payload.role` | Un seul rôle existe en base — non exploitable. Modifier la couche d'authentification à 16 jours du rendu est un risque de régression pour un gain nul | Obligatoire avant l'introduction d'un second rôle |
| DETTE-02 | Aucune limitation de débit sur `POST /api/auth/login` ni sur l'upload public | Application non déployée, non exposée. Ajout d'une dépendance + configuration + tests hors budget | Avant toute mise en production |
| DETTE-03 | Timing attack théorique sur le login : `bcrypt.compare` n'est appelé que si l'admin existe, ce qui crée un écart de temps de réponse mesurable entre « email inconnu » et « mot de passe faux » | Non exploitable : un seul compte admin, dont l'email est connu d'avance. Le correctif (hash factice systématique) est subtil et touche le chemin critique de l'authentification | Avec l'ouverture des comptes à plusieurs utilisateurs |
| DETTE-04 | Le type des fichiers uploadés repose sur le MIME déclaré par le client, sans vérification du contenu réel | Le correctif BUG-46 ferme déjà le vecteur dangereux en imposant l'extension. La vérification par nombre magique est un durcissement, pas la faille | V2, avec le passage à un stockage externe |

---

## Récapitulatif

| Catégorie | Nombre de bugs | Tous résolus ? |
|---|---|---|
| Environnement & Docker | 14 | ✅ |
| Backend & Prisma | 17 | ✅ |
| Frontend & React | 9 | ✅ |
| Tests (Vitest) | 2 | ✅ |
| Git & Environnement | 4 | ✅ |
| Sécurité — audit du 26 août | 7 | ✅ |
| **Total** | **53** | ✅ |

**Aucun bug bloquant non résolu** dans le périmètre MVP.
Quatre dettes techniques sont identifiées, documentées et non exploitables en l'état
(voir section *Dettes techniques assumées*).
