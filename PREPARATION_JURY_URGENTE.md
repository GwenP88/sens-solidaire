# Préparation jury RNCP DWWM — Sens Solidaires

*Audit du dépôt réalisé le 22/11/2026, sans modification du code.*

**Sources lues :** code front et back, `schema.prisma`, migrations, `roles.sql`, `seed.js`, tests (liste et intitulés), `docker-compose.yml`, Dockerfiles, `ci.yml`, `README.md`, `docs/planning.md`, `docs/modif-en-cours-de-dev.md`, journal de bord.

**Non accessible :** le diaporama de présentation n'est pas dans le dépôt. Les « affirmations à vérifier » ci-dessous viennent donc du README et de la documentation, plus de ce que tu m'as indiqué (Lighthouse 70, objectif > 90).

**Non vérifié en direct :** Docker était arrêté. Je n'ai pas relancé les tests ni interrogé la base. Les chiffres de tests sont ceux du README.

Légende : 🔴 CRITIQUE · 🟠 PROBABLE · 🔵 COMPLÉMENTAIRE
Statut : ✅ implémenté · 🟡 partiel · ❌ absent · 📋 prévu

---

## PARTIE 1 — Les 15 questions les plus dangereuses

### 1. 🔴 « Votre objectif Lighthouse était supérieur à 90, vous êtes à 70. Pourquoi ? »
**Réponse orale :** « L'objectif n'est pas atteint, je le dis franchement. Après un premier audit, j'ai fait des corrections : images converties en WebP, libellés reliés aux champs du formulaire de contact, contraste des textes, décalage de mise en page au chargement supprimé. Il faut aussi savoir que Lighthouse sur le serveur de développement Vite donne des chiffres faussés, car le code n'y est ni minifié ni découpé. C'est pour ça que j'ai ouvert le port 4173 pour mesurer la version construite avec `vite preview`. Les causes probables qui restent : le rendu côté client d'une SPA (le contenu n'arrive qu'après le JavaScript et l'appel API), les polices Google chargées depuis un serveur externe, et des images servies sans serveur de production optimisé (pas de compression gzip/brotli, pas de cache). »
**Preuves :** `docs/journal-de-bord/2026-11-10.md` ; `docker-compose.yml` (port 4173) ; `docs/planning.md` tâche 134 « nouvelle mesure à faire » 🔵 ; `frontend/src/App.jsx` (`lazy`) ; `frontend/index.html` (Google Fonts).
**Limite :** aucun rapport Lighthouse chiffré n'est versionné dans le dépôt. Précise sur quelle page, en mobile ou en desktop, et sur quelle version (dev ou `preview`) tu as mesuré 70. Le score de performance n'est pas le même que les scores accessibilité, SEO ou bonnes pratiques.

### 2. 🔴 « Que se passe-t-il quand l'admin clique sur "Déconnexion" ? »
**Réponse orale :** « Côté front, `handleLogout` supprime l'access token du localStorage et redirige vers la page de connexion. Côté back, j'ai une route `POST /api/auth/logout` qui efface le hash du refresh token en base et supprime le cookie. Mais je dois reconnaître que le front n'appelle pas encore cette route. Le cookie refresh reste donc valable jusqu'à 7 jours dans ce navigateur. C'est la première correction que je ferais : une ligne d'appel dans `handleLogout`. »
**Preuves :** `frontend/src/components/admin/DashboardLayout.jsx:24-27` ; `backend/src/routes/auth.js:47` ; `backend/src/services/authService.js` (`logout`) ; test `Auth.integration.test.js` « déconnexion → 200, puis le refresh token n'est plus accepté ».
**Limite :** la route backend est testée, mais elle n'est pas branchée côté front.

### 3. 🔴 « Pourquoi stocker le JWT dans le localStorage ? C'est vulnérable au XSS. »
**Réponse orale :** « Oui, un script injecté pourrait lire le localStorage. J'ai limité le risque de trois façons. L'access token ne dure que 15 minutes. Le refresh token, qui dure 7 jours, est dans un cookie HttpOnly que le JavaScript ne peut pas lire. Et React échappe par défaut tout ce qu'il affiche : je n'utilise pas de `dangerouslySetInnerHTML` pour les contenus saisis. L'alternative plus sûre serait de garder l'access token uniquement en mémoire, dans une variable ou un contexte React, et de le récupérer par refresh à chaque rechargement de page. »
**Preuves :** `frontend/src/pages/admin/LoginAdmin.jsx:35` ; `backend/src/utils/jwt.js` ; `backend/src/controllers/authController.js:36-41`.
**Limite :** c'est un compromis assumé, pas la solution la plus sûre.

### 4. 🔴 « Comment empêchez-vous une attaque par force brute sur la connexion ? »
**Réponse orale :** « Aujourd'hui, il n'y a pas de limitation du nombre de tentatives : c'est une limite connue. Ce qui est en place : bcrypt est volontairement lent, ce qui ralentit chaque essai, et le message d'erreur est identique que l'email soit inconnu ou que le mot de passe soit faux, donc on ne peut pas deviner les comptes. Pour la production, j'ajouterais `express-rate-limit` sur `/api/auth/login`, par exemple 5 essais par quart d'heure et par IP. J'ajouterais aussi une limite sur les formulaires publics de contact et de témoignage. »
**Preuves :** `backend/package.json` (aucun paquet de limitation de débit) ; `authService.login` (message unique).
**Limite :** ❌ non implémenté. Ne dis surtout pas que c'est protégé.

### 5. 🔴 « Votre application est-elle en production ? »
**Réponse orale :** « Non, elle n'est pas encore déployée. La mise en production est prévue sur un VPS OVH, avec Nginx en reverse proxy, un certificat SSL et un Dockerfile de production multi-étapes. Ce sont les tâches 138 à 143 de mon planning. Aujourd'hui, l'environnement Docker est un environnement de développement : `npm run dev`, code monté en volume pour le rechargement à chaud. La CI, elle, vérifie déjà que les migrations reconstruisent la base de zéro, comme il faudra le faire en production. »
**Preuves :** `README.md` (« non déployé à ce stade ») ; `docs/planning.md` bloc G (tâches 138 à 147 ❌) ; `backend/Dockerfile` et `frontend/Dockerfile` (`CMD npm run dev`).
**Limite :** ne présente pas la démo comme « la prod ».

### 6. 🔴 « Votre SPA React est-elle bien référencée par Google ? »
**Réponse orale :** « C'est une SPA rendue côté client, donc le HTML initial est presque vide. Pour compenser, j'ai mis des métadonnées par défaut dans `index.html`. J'ai aussi écrit un hook `useSEO` qui met à jour, page par page, le titre, la description, l'URL canonique, la balise `robots` et les balises Open Graph. Google exécute le JavaScript, il voit donc ces valeurs. Les robots des réseaux sociaux, eux, n'exécutent pas le JavaScript : ils ne voient que les valeurs par défaut. Le dashboard est en `noindex` et exclu dans `robots.txt`. Pour aller plus loin, il faudrait du pré-rendu, du rendu serveur (Next.js, par exemple) et un `sitemap.xml`. »
**Preuves :** `frontend/src/hooks/useSEO.js` ; `frontend/index.html` ; `frontend/public/robots.txt`.
**Limite :** ❌ pas de sitemap, ❌ pas de SSR ni de pré-rendu, aperçu de partage identique pour toutes les pages.

### 7. 🔴 « Pourquoi une suppression logique pour les missions ? Que deviennent les données liées ? »
**Réponse orale :** « Par défaut, "supprimer" une mission la met en pause : `is_active` passe à `false`. Elle disparaît du site public, mais reste en base et peut être réactivée. Ça évite de casser les témoignages et les rapports qui pointent vers elle. J'ai aussi une suppression définitive, en transaction Prisma, dans cet ordre : détacher les témoignages (`mission_id` à `null`), supprimer les tarifs, supprimer les médias, puis la mission. Le lien avec les lieux est supprimé automatiquement par la cascade de la table de jointure. Les témoignages, eux, ont une vraie suppression, pour respecter le droit à l'effacement du RGPD. »
**Preuves :** `backend/src/services/missionService.js` (`softDelete`, `hardDelete` avec `$transaction`) ; filtres `is_active: true` dans `findAll` et `findBySlug` ; `docs/modif-en-cours-de-dev.md` n° 47, 48, 50 ; `adminTestimonialRoutes.js:41-42`.
**Limite :** la transaction est indispensable, car `MissionPricing` est en `ON DELETE RESTRICT` et `Media` n'a pas de clé étrangère.

### 8. 🔴 « Expliquez la relation Mission–Location et la migration associée. »
**Réponse orale :** « Au départ, un lieu appartenait à une seule mission, avec un champ `mission_id`. Mais un même lieu partenaire peut accueillir plusieurs missions, et une mission se déroule dans plusieurs lieux : c'est du plusieurs-à-plusieurs. J'ai donc migré vers une relation N:N implicite de Prisma. Prisma crée la table de jointure `_LocationToMission`, avec deux colonnes A et B, une clé primaire composite et deux clés étrangères en `ON DELETE CASCADE`. Le point important : j'ai ajouté à la main un `INSERT ... SELECT` dans la migration pour recopier les liens existants avant de supprimer la colonne `mission_id`. Sinon, on perdait les données. »
**Preuves :** `backend/prisma/migrations/20260730140804_location_mission_many_to_many/migration.sql` ; `schema.prisma` (`locations Location[]` et `missions Mission[]`).
**Limite :** le diagramme du `README.md` montre encore `Location.mission_id FK`. Il est obsolète, prépare-toi à le dire.

### 9. 🔴 « Comment garantissez-vous l'intégrité référentielle ? »
**Réponse orale :** « Principalement par les clés étrangères PostgreSQL que génèrent les migrations Prisma, avec un comportement choisi pour chaque relation :
- `RESTRICT` pour les tarifs d'une mission et pour les tags, ODD et pays d'une action terrain ;
- `SET NULL` pour les témoignages, les rapports de mission, les délégations et les sections éducation, parce que ces données doivent survivre à la suppression de leur parent ;
- `CASCADE` sur la table de jointure Mission–Location.

La seule exception est la table `Media`, qui est polymorphe : `entity_type` + `entity_id`, sans clé étrangère. C'est un choix pour avoir une seule table de médias pour toutes les entités. En contrepartie, l'intégrité est gérée à la main dans les services. »
**Preuves :** migrations (`ON DELETE RESTRICT / SET NULL / CASCADE`) ; `schema.prisma` (`model Media`) ; `missionService.hardDelete` (`tx.media.deleteMany`).
**Limite :** une suppression qui oublie de nettoyer `Media` laisserait des lignes orphelines. Le lien Mission ↔ FieldAction se fait aussi par comparaison de texte sur le pays, sans clé étrangère.

### 10. 🔴 « Quels tests avez-vous réellement ? »
**Réponse orale :** « J'ai environ 415 tests automatisés.
- Côté backend : des tests unitaires Jest pour les fonctions pures, le JWT et le middleware d'authentification, et des tests d'intégration Supertest qui appellent les vraies routes HTTP : authentification, sécurité, CRUD, upload.
- Côté front : Vitest et React Testing Library.

Tout est relancé par GitHub Actions à chaque push, et les tests d'intégration tournent sur une base PostgreSQL jetable. Je n'ai pas de tests de bout en bout dans un vrai navigateur, comme Cypress ou Playwright, ni de seuil de couverture de code. »
**Preuves :** `README.md` § Tests ; `backend/tests/` (15 fichiers d'intégration et `unit/`) ; `frontend/tests/` ; `.github/workflows/ci.yml`.
**Limite :** le chiffre 415 vient du README ; relance les tests avant le jury pour l'annoncer avec certitude. En local, les tests d'intégration tournent sur la base de développement réelle, isolés par le marqueur `jest-test`.

### 11. 🔴 « Vous parlez de RGPD : avez-vous un bandeau cookies ? »
**Réponse orale :** « Il n'y a pas de bandeau. Le seul cookie que dépose l'application est le refresh token de l'administratrice : il est strictement nécessaire et n'exige pas de consentement. En revanche, je dois être honnête sur trois points :
- la page "Politique de cookies" mentionne un cookie de préférences de consentement qui n'existe pas encore ;
- la carte Google Maps des pages lieux est chargée directement, sans consentement préalable ;
- les polices Google sont chargées depuis les serveurs de Google, ce qui leur transmet l'IP du visiteur.

Pour corriger : héberger les polices sur le site, et charger la carte seulement après un clic, comme je l'ai déjà fait pour YouTube avec `youtube-nocookie` chargé à l'ouverture de la vidéo. »
**Preuves :** `frontend/src/pages/Cookies.jsx:43-44` et `:63` (`cookieConsent` n'est écrit nulle part) ; `frontend/src/pages/LocationDetail.jsx:244` (iframe Maps) ; `frontend/index.html` (fonts.googleapis.com) ; `frontend/src/components/media/YouTubeModal.jsx`.
**Limite :** 🔴 incohérence entre le texte légal et le code.

### 12. 🔴 « `ProtectedRoute` vérifie-t-il que le token est valide ? »
**Réponse orale :** « Non, seulement sa présence : c'est du confort d'interface, pas de la sécurité. La vraie barrière, c'est le backend. Les 15 routeurs admin commencent tous par `router.use(authMiddleware)`, qui vérifie la signature, l'expiration et le rôle. Si quelqu'un met un faux token dans son localStorage, il voit la coquille du dashboard, mais chaque appel API répond 401. `authFetch` tente un refresh, qui échoue, puis supprime le token et le renvoie vers la page de connexion. Aucune donnée n'est exposée. »
**Preuves :** `frontend/src/components/navigation/ProtectedRoute.jsx` ; `backend/src/middlewares/authMiddleware.js` ; `backend/src/routes/admin*Routes.js` ; `frontend/src/services/api/client.js` ; test `Security.integration.test.js` (« toutes les routes admin fermées sans jeton »).
**Limite :** le README dit que les routes admin « ne s'affichent que si un token JWT **valide** est présent ». C'est inexact : seule la présence est vérifiée côté front.

### 13. 🔴 « Quelle a été votre contribution personnelle, par rapport à votre binôme ? »
**Réponse orale :** « J'étais principalement en charge du frontend et de la conception UX/UI : personas, parcours, wireframes et maquettes Figma, design system, intégration React et branchement de l'API. Alison était principalement sur le backend. Nous n'étions pas cloisonnées : j'ai réalisé certains éléments backend, et Alison a intégré le front du dashboard. Nous travaillions sur des branches séparées, `dev-front` et `dev-back`, avec une relecture mutuelle avant de fusionner sur `dev`. »
**Preuves :** `README.md` § Équipe & rôles ; branches ; `docs/journal-de-bord/`.
**Limite :** prépare 2 ou 3 exemples précis de code backend que **tu** as écrit, pour pouvoir les montrer. Le jury évalue ta part individuelle.

### 14. 🔴 « Votre application est-elle multilingue ? »
**Réponse orale :** « Non, la V1 est en français uniquement. Le bilingue français/anglais était dans le périmètre initial, mais il a été reporté : la cliente n'a pas encore choisi entre une traduction rédigée et une traduction automatique. Le bouton FR/EN de la navbar est masqué tant que la traduction n'existe pas. La piste technique prévue est `react-i18next` pour l'interface, et une stratégie à définir pour les contenus en base. »
**Preuves :** `frontend/src/components/layout/Navbar.jsx:216` et `:326-327` (bouton commenté) ; `docs/planning.md` tâche 135 ❌ ; `index.html` (`lang="fr"`).
**Limite :** le README affirme que « la structure de la base anticipe les deux scénarios ». Je n'ai trouvé **aucun** champ de langue ni table de traduction dans `schema.prisma`. N'utilise pas cet argument.

### 15. 🔴 « Que montrez-vous en démonstration, et que faites-vous si ça plante ? »
**Réponse orale :** « Je montre le parcours visiteur (accueil, liste des missions, fiche mission, dépôt d'un témoignage), puis le parcours admin (connexion, modération du témoignage, modification d'une mission, vérification sur le site public). Si l'environnement ne répond pas, j'ai des captures d'écran en annexe, et je peux montrer le code et la CI verte sur GitHub. »
**Preuves :** `docs/annexes/*.png` ; `docs/diagramm_finaux/*.png`.
**Limite :** voir la checklist à la fin du document.

---

## PARTIE 2 — Banque de questions par sujet

### A. Architecture et choix techniques

**A1. 🟠 « Décrivez l'architecture de votre application. »**
« Deux applications indépendantes dans Docker Compose : un front React 19 avec Vite, et une API REST Express 5 reliée à PostgreSQL 16 par Prisma 7. Elles communiquent uniquement en JSON. Le backend est découpé en couches : routes → contrôleurs (validation et réponse) → services (logique métier et Prisma). Le site public et le dashboard sont dans la même application React. »
*Preuves :* `backend/src/{routes,controllers,services,middlewares}` ; `docker-compose.yml`.

**A2. 🟠 « Pourquoi React et pas un CMS comme WordPress ? »**
« La cliente devait pouvoir modifier tous les contenus, mais pas la structure, avec un dashboard sur mesure adapté à son métier : missions, tarifs, lieux, modération. Le projet devait aussi démontrer les compétences du titre : front, back, base de données. Un WordPress aurait été plus rapide pour un site vitrine, mais moins formateur et plus difficile à contraindre. »
*Limite :* argument de formation ; reconnais que WordPress est une alternative crédible.

**A3. 🟠 « Pourquoi Prisma plutôt que du SQL brut ou Sequelize ? »**
« Schéma déclaratif dans un seul fichier, migrations versionnées, requêtes paramétrées automatiquement (protection contre l'injection SQL), et autocomplétion. Prisma 7 se connecte à PostgreSQL par un adaptateur `pg`. »
*Preuves :* `backend/src/config/db.js` ; `backend/prisma/schema.prisma`.

**A4. 🔵 « Pourquoi PostgreSQL plutôt que MongoDB ? »**
« Mes données sont fortement relationnelles : missions, tarifs, lieux, témoignages. J'ai besoin de clés étrangères, de contraintes d'unicité et de transactions. Un modèle relationnel s'imposait. »

**A5. 🟠 « Qu'est-ce qu'un contrôleur et un service chez vous ? »**
« Le contrôleur lit `req`, valide les entrées, appelle le service et renvoie la réponse HTTP. Le service contient la logique métier et les appels Prisma, sans rien savoir d'Express. Par exemple, `getMissionBySlug` valide le slug, puis `findBySlug` interroge la base et trie les médias. »
*Preuves :* `missionController.js` ; `missionService.js`.

**A6. 🔵 « Pourquoi PATCH et pas PUT pour modifier une mission ? »**
« PATCH est une modification partielle : seuls les champs envoyés changent, on n'écrase pas un champ oublié. Le contrôleur construit l'objet à partir d'une liste blanche de champs. »
*Preuves :* `missionController.updateMission` ; `modif-en-cours-de-dev.md` n° 46.

**A7. 🔵 « Comment le front appelle-t-il l'API ? »**
« Un fichier par ressource dans `services/api/`, un `client.js` qui contient l'URL de base `/api` et `authFetch` pour les routes protégées, et un `index.js` qui réexporte tout. En développement, le proxy Vite redirige `/api` vers le conteneur backend. »
*Limite :* la variable `VITE_API_URL` est définie dans `docker-compose.yml` mais n'est pas utilisée (`API_URL = "/api"` est écrit en dur). En production, il faudra un reverse proxy Nginx.

**A8. 🟠 « Expliquez le parcours d'une requête GET de fiche mission. »**
« `MissionDetail` appelle `fetchMissionBySlug` → `GET /api/missions/:slug` → middlewares globaux (`helmet`, `cors`, `cookieParser`, `express.json`) → `routes/missions.js` → `getMissionBySlug` (validation du slug par regex) → `findBySlug` → `prisma.mission.findFirst` avec `include` des tarifs, lieux et témoignages approuvés, plus une requête sur `media` → réponse 200 `{ success, mission }`. En cas d'erreur, `next(error)` passe la main au gestionnaire d'erreurs global. »

**A9. 🔵 « Pourquoi `findFirst` et pas `findUnique` ? »**
« Je filtre sur `slug` **et** sur `is_active`, et seul `slug` est unique. `findUnique` n'accepte que des champs uniques. »
*Limite :* le commentaire à la ligne 96 de `missionService.js` dit encore « findUnique ».

**A10. 🔵 « Pourquoi un `/service-civique/gallery` déclaré avant `/:slug` ? »**
« Express teste les routes dans l'ordre : sinon, "service-civique" serait pris pour un slug. »

**A11. 🔵 « Gestion d'état : pourquoi pas Redux ? »**
« L'état est local à chaque page (`useState` et `useEffect`). Il n'y a pas de données partagées complexes qui le justifieraient. Une bibliothèque comme React Query apporterait du cache, ce serait une amélioration possible. »

**A12. 🔵 « Pourquoi Tailwind v4 ? »**
« Il permet de mettre en œuvre directement le design system, avec des couleurs nommées par leur rôle (`primary`, `accent`, `surface`) dans le bloc `@theme` de `index.css`. Pas de CSS mort, et une cohérence garantie avec la maquette. »
*Preuves :* `modif-en-cours-de-dev.md` n° 20.

### B. Base de données et Prisma

**B1. 🟠 « Combien de tables, et quelles relations principales ? »**
« Mission (1-N MissionPricing, N-N Location, 1-N Testimonial, 1-N MissionReport), Location (N-1 Delegation), FieldAction (1-N Tags, ODD, Countries), et des tables éditoriales indépendantes : MediaPost, Education, TeamMember, Partner, ActivityReport. Plus Admin et Media. »
*Preuves :* `schema.prisma` ; `docs/schema-physique.sql`.

**B2. 🟠 « Qu'est-ce qu'une migration ? Différence avec le seed ? »**
« Une migration modifie la **structure** de la base (tables, colonnes, contraintes) et est versionnée dans Git. Le seed insère des **données**. Ici, il crée le compte admin et les contenus de la page Éducation. Appliquer les migrations en production ne transfère pas les données : il faudra un export puis un import. »
*Preuves :* `prisma/migrations/` ; `prisma/seed.js` ; `planning.md` (point d'attention sur le déploiement).

**B3. 🟠 « Qu'est-ce qu'une table polymorphe ? Avantages et inconvénients ? »**
« `Media` relie un fichier à n'importe quelle entité grâce à `entity_type` + `entity_id`. Avantage : une seule table et un seul code d'upload. Inconvénient : pas de clé étrangère, donc pas de cascade ni de garantie d'existence de l'entité. C'est à moi de nettoyer dans les services. »

**B4. 🟠 « Qu'est-ce que `ON DELETE RESTRICT`, `SET NULL`, `CASCADE` ? »**
- `RESTRICT` : refuse la suppression du parent s'il a encore des enfants (tarifs d'une mission).
- `SET NULL` : garde l'enfant et vide le lien (un témoignage survit à sa mission).
- `CASCADE` : supprime l'enfant avec le parent (une ligne de la table de jointure).

**B5. 🔵 « Pourquoi `price` est-il un `Decimal` ? »**
« Pour éviter les erreurs d'arrondi des nombres à virgule flottante sur des montants d'argent. »
*Limite :* Prisma sérialise un `Decimal` en **chaîne** dans le JSON (`"1290"`). Le front le compare à 0 grâce à la conversion automatique de JavaScript.

**B6. 🔵 « Pourquoi `how_to_go` et `programme` sont-ils stockés en texte JSON ? »**
« Ce sont des listes ordonnées affichées d'un bloc, jamais filtrées. Les stocker en JSON évite une table supplémentaire. Le front fait un `JSON.parse` protégé par un `try/catch`. »
*Limite :* le type `Json` de PostgreSQL ou une table dédiée seraient plus stricts.

**B7. 🟠 « Comment une mission est-elle liée aux actions terrain ? »**
« Par correspondance de pays, sans clé étrangère : `fetchFieldActions(mission.country)` filtre avec un `contains` sur `FieldActionCountry`. C'est un choix de MVP. La V2 prévoit une table N:N explicite `MissionFieldAction`. »
*Preuves :* `fieldActionService.getAllFieldActions` ; README (note d'architecture).
*Limite :* fragile. Une faute de frappe dans un pays casse le lien, et `contains` peut faire correspondre des noms partiels.

**B8. 🔵 « Pourquoi le slug est-il `@unique` ? »**
« C'est l'adresse publique de la page. L'unicité est garantie par la base. Une collision provoque l'erreur Prisma P2002, traduite en 409 avec le code `SLUG_TAKEN`, et le formulaire encadre alors le champ en rouge. »
*Preuves :* `missionService.create` et `update` ; `utils/prismaErrors.js`.

**B9. 🔵 « Avez-vous des index ? »**
« Les clés primaires et les champs `@unique` (comme `slug` ou `email`) sont indexés automatiquement, ainsi que la table de jointure (`_LocationToMission_B_index`). Je n'ai pas ajouté d'index manuel : le volume de données est faible. »

**B10. 🟠 « Comment sauvegardez-vous la base ? »**
« Une procédure de sauvegarde et de restauration avec `pg_dump` est documentée et a été testée, voir l'annexe 05. Le volume Docker `postgres_data` conserve les données entre deux redémarrages. »
*Preuves :* `docs/sauvegarde-restauration.md` ; `docs/annexes/annexe-05-sauvegarde-restauration.png`.
*Limite :* pas de sauvegarde automatique planifiée (pas de déploiement).

**B11. 🟠 « Qu'est-ce que le principe du moindre privilège pour votre base ? »**
« Deux comptes PostgreSQL : `sensolidaire_owner` sert uniquement aux migrations ; `sensolidaire_app`, utilisé par l'API, ne peut que lire et écrire des lignes, sans droit de modifier la structure. Si l'API est compromise, l'attaquant ne peut pas supprimer de tables. »
*Preuves :* `backend/prisma/roles.sql` ; `docker-compose.yml` (`DATABASE_URL` / `MIGRATE_DATABASE_URL`) ; annexe 04.

**B12. 🔵 « Le README montre `Location.mission_id`. C'est à jour ? »**
« Non, ce diagramme date d'avant la migration N:N du 30/07. La relation réelle passe par la table `_LocationToMission`. »

**B13. 🔵 « Pourquoi `MissionReport` a-t-il `destination` et `type` alors qu'il a `mission_id` ? »**
« Redondance assumée : `mission_id` est optionnel, car un rapport peut exister sans mission en base. Les champs texte servent alors de solution de repli. »
*Preuves :* README (« Redondance assumée »).

### C. Authentification et autorisation

**C1. 🔴 « Comment fonctionne la connexion ? »**
« `POST /api/auth/login`. Le service cherche l'admin par email, compare le mot de passe avec `bcrypt.compare`, puis génère deux JWT :
- un access token de 15 minutes contenant l'id et le rôle, renvoyé dans le JSON ;
- un refresh token de 7 jours, signé avec un autre secret, placé dans un cookie HttpOnly / SameSite=Strict. Seul son hash bcrypt est stocké en base. »
*Preuves :* `authService.login` ; `authController.loginAdmin` ; `utils/jwt.js`.

**C2. 🔴 « Comment la session est-elle prolongée ? »**
« Quand une requête reçoit un 401, `authFetch` appelle `POST /api/auth/refresh`. Le serveur vérifie la signature, compare le token avec le hash en base, puis fait une **rotation** : il émet de nouveaux tokens et remplace le hash. Si un ancien refresh token est réutilisé, toutes les sessions sont révoquées. »
*Preuves :* `authService.refresh` ; `client.js` ; test « rotation : l'ancien cookie est refusé ».

**C3. 🟠 « Différence entre 401 et 403 ? »**
« 401 : je ne sais pas qui tu es (pas de token, token invalide ou expiré). 403 : je sais qui tu es, mais tu n'as pas le droit (rôle différent de `admin`). »
*Preuves :* `authMiddleware.js`.

**C4. 🟠 « Que contient un JWT ? Est-il chiffré ? »**
« Un en-tête, une charge utile et une signature, encodés en base64. Il est **signé, pas chiffré** : n'importe qui peut lire son contenu, mais pas le modifier sans le secret. C'est pour ça que je n'y mets que l'id et le rôle. »

**C5. 🟠 « Pourquoi deux secrets différents ? »**
« Pour qu'un refresh token ne puisse pas servir d'access token, et inversement. Le test `jwt.test.js` le vérifie. »

**C6. 🟠 « Pourquoi hacher le refresh token en base ? »**
« Si la base fuit, l'attaquant ne récupère pas de tokens utilisables, comme pour les mots de passe. »

**C7. 🟠 « Une seule session à la fois : pourquoi ? »**
« Chaque connexion écrase `refresh_token_hash`, donc une nouvelle connexion invalide l'ancienne. C'est simple et suffisant pour un seul compte admin. »
*Limite :* l'admin ne peut pas rester connectée sur deux appareils en même temps.

**C8. 🟠 « Un JWT révoqué reste-t-il valide ? »**
« L'access token reste valide jusqu'à son expiration, 15 minutes au maximum, car il est sans état : le serveur ne le revérifie pas en base. Le refresh token, lui, est vérifié en base, donc révocable immédiatement. »

**C9. 🟠 « Comment créez-vous le compte admin ? Peut-on s'inscrire ? »**
« Il n'y a pas d'inscription publique. Le compte est créé par le seed, avec le mot de passe lu dans la variable d'environnement `ADMIN_PASSWORD` et haché avec bcrypt. »
*Limite :* le seed affiche le mot de passe dans la console ; pas de « mot de passe oublié » (`href="#"`) ; la case « Se souvenir de moi » n'est reliée à rien.

**C10. 🔵 « Le rôle sert à quoi s'il n'y a qu'un admin ? »**
« Le middleware vérifie `role === "admin"`, ce qui prépare une gestion à plusieurs rôles (un modérateur, par exemple) sans changer le code de vérification. »

**C11. 🔵 « Pourquoi `/auth/verify` existe-t-il ? »**
« Pour vérifier côté serveur qu'un token est valide. Le front ne l'utilise pas encore : `ProtectedRoute` pourrait l'appeler au chargement du dashboard. »

**C12. 🔵 « Que voit l'admin en production avec un mauvais mot de passe ? »**
« Le gestionnaire d'erreurs remplace tous les messages par "Une erreur est survenue" quand `NODE_ENV=production`. Elle ne verrait donc pas "Identifiants invalides". C'est sûr, mais peu clair : il faudrait garder les messages des erreurs 4xx prévues. »
*Preuves :* `app.js:192-194`.

### D. Sécurité

**D1. 🔴 « Quelles protections OWASP avez-vous mises en place ? »**
- **Injection :** Prisma utilise des requêtes paramétrées, et les entrées sont validées par regex (slug, pays, email).
- **Authentification défaillante :** bcrypt, JWT courts, rotation du refresh token.
- **XSS :** échappement automatique de React, HTML échappé dans l'email de contact (`escapeHtml`).
- **Mass assignment :** listes blanches de champs.
- **Upload :** filtre de type MIME, taille maximale, réencodage en WebP, nom de fichier aléatoire.
- **Configuration :** Helmet, CORS, erreurs génériques en production, comptes de base séparés.
*Preuves :* `contactService.js` ; `missionController` ; `uploadMiddleware.js` ; `storageService.js` ; `app.js` ; `roles.sql`.

**D2. 🟠 « Qu'est-ce que le mass assignment et comment l'évitez-vous ? »**
« C'est le fait d'envoyer des champs non prévus, par exemple `is_active` ou `status: "approved"`, pour qu'ils soient enregistrés. Je ne passe jamais `req.body` brut à Prisma : je recopie champ par champ. Un témoignage public est toujours créé en `pending`, quoi qu'envoie le client. »
*Preuves :* `missionService.create` ; `testimonialService.submitTestimonial` (`status: "pending"`) ; test `Testimonials.admin.test.js`.

**D3. 🟠 « Comment sécurisez-vous l'upload de fichiers ? »**
« Multer stocke en mémoire, avec une liste blanche de types MIME et une taille maximale : 5 Mo en public, 20 Mo en admin. Les images sont réencodées en WebP par sharp, ce qui neutralise un SVG ou une image piégée. Le nom du fichier est reconstruit (slug + horodatage + UUID), ce qui empêche le *path traversal* (un nom de fichier qui tente de sortir du dossier prévu). »
*Preuves :* `uploadMiddleware.js` ; `storageService.js:60-90` ; `Upload.security.test.js` ; annexe 02.
*Limite :* le type MIME est déclaré par le client, mais le réencodage par sharp échoue si le fichier n'est pas une vraie image.

**D4. 🟠 « À quoi sert Helmet ? »**
« À ajouter des en-têtes HTTP de sécurité : `X-Content-Type-Options`, protection contre le *clickjacking* (affichage du site dans un cadre piégé), politique de sécurité du contenu (CSP) par défaut, etc. Il est placé en premier middleware. »
*Preuves :* `app.js:61` ; `Security.integration.test.js`.

**D5. 🟠 « CORS, c'est une protection ? »**
« C'est une règle appliquée par le **navigateur**, qui empêche un autre site de lire les réponses de mon API. Ce n'est pas une authentification : curl l'ignore. Mon CORS autorise le front, ngrok et le réseau local, et renvoie 403 sinon. »
*Limite :* la liste est large pour du développement (tout `192.168.*`, ngrok) et doit être restreinte en production.

**D6. 🟠 « Êtes-vous protégée contre le CSRF ? »**
« Oui, de deux façons. Le cookie refresh est en `SameSite=Strict`, donc il n'est jamais envoyé depuis un autre site. Et les routes admin exigent un en-tête `Authorization: Bearer`, qu'un site tiers ne peut pas ajouter. Je n'ai pas de jeton CSRF dédié : ce n'est pas nécessaire avec ce modèle. »

**D7. 🟠 « Où sont stockés les secrets ? »**
« Dans des fichiers `.env` non versionnés, avec des `.env.example` comme modèles. Les secrets JWT se génèrent avec `openssl rand -base64 48`. La CI utilise des valeurs factices. »
*Preuves :* `.env.example` ; `backend/.env.example` ; `ci.yml`.

**D8. 🟠 « Comment suivez-vous les vulnérabilités des dépendances ? »**
« `npm audit` avant chaque fusion sur `dev`. Dernier audit le 08/11/2026 : 1 vulnérabilité critique (`proxy-addr`) et 16 élevées corrigées sans `--force`. Il reste des vulnérabilités moyennes dans les outils de développement uniquement. »
*Preuves :* `README.md` ; `docs/veille.md`.

**D9. 🟠 « Que se passe-t-il si quelqu'un tape `/admin/missions` sans être connecté ? »**
« `ProtectedRoute` ne trouve pas de token et redirige vers `/admin/login` avec `replace`. Aucun appel API n'est fait. »

**D10. 🟠 « Et s'il appelle `GET /api/admin/missions` avec curl ? »**
« `authMiddleware` répond 401 "Token manquant". Avec un faux token : 401 "Token invalide ou expiré". Le contrôleur n'est jamais atteint. »

**D11. 🔵 « Quelles limites de taille sur les requêtes ? »**
« `express.json()` a une limite par défaut de 100 Ko. Les uploads sont limités par Multer, et les champs du contact et des témoignages sont limités en longueur (280 caractères pour un témoignage). »

**D12. 🟠 « Vos formulaires publics peuvent-ils être spammés ? »**
« Oui, il n'y a ni limitation de débit ni captcha. Les témoignages arrivent en `pending` et sont modérés, donc ils ne s'affichent jamais sans validation. Le contact envoie un email : c'est le point le plus exposé. »
*Limite :* ❌ pas de limitation, pas de champ piège anti-robot (*honeypot*), pas de captcha.

**D13. 🔵 « Le port PostgreSQL est-il exposé ? »**
« En développement, oui : le port 5432 est ouvert sur la machine hôte, ainsi que 5555 pour Prisma Studio. En production, la base ne doit être accessible que par le réseau Docker interne. »
*Preuves :* `docker-compose.yml`.

**D14. 🔵 « Les erreurs révèlent-elles des informations ? »**
« En production, non : un message générique avec le statut. En développement, le message réel est affiché pour déboguer. Les erreurs Prisma attendues sont traduites en 404 ou 409 au lieu de 500. »
*Preuves :* `app.js:160-202` ; `utils/prismaErrors.js`.

### E. RGPD et données personnelles

**E1. 🔴 « Quelles données personnelles collectez-vous ? »**
- **Témoignages :** nom, texte, photo facultative, mois et année.
- **Formulaire de contact :** nom, prénom, email, sujet, message. Il n'est **pas stocké en base** : il est envoyé par email via Resend.
- **Admin :** email et mot de passe haché.
*Preuves :* `schema.prisma` (`Testimonial`) ; `contactService.js` (aucun appel Prisma).

**E2. 🔴 « Comment recueillez-vous le consentement pour les témoignages ? »**
« Une case de consentement obligatoire, vérifiée **côté serveur** (400 si `consent_given` est absent) et stockée en base. Le témoignage n'est publié qu'après modération. Refuser un témoignage le retire automatiquement de la page d'accueil. »
*Preuves :* `testimonialController.js:49-50` ; `testimonialService.updateStatus` (`show_homepage = false`) ; annexe 12.

**E3. 🟠 « Comment exercer le droit à l'effacement ? »**
« Par demande à l'association. L'admin supprime alors réellement le témoignage (suppression définitive, pas logique). »
*Preuves :* `adminTestimonialRoutes.js:41-42` ; `modif-en-cours-de-dev.md` n° 48.
*Limite :* je n'ai pas vérifié que la photo associée est aussi supprimée du disque.

**E4. 🟠 « Vos données transitent-elles hors UE ? »**
« Les messages de contact passent par Resend, un service d'envoi d'emails. La page Confidentialité dit que les données ne sont accessibles qu'aux personnes habilitées de l'association : il faudrait mentionner Resend comme sous-traitant, ainsi que l'hébergeur. Les polices Google et la carte Google Maps transmettent aussi l'IP du visiteur à Google. »
*Limite :* 🟠 la politique de confidentialité est incomplète.

**E5. 🟠 « Combien de temps conservez-vous les données ? »**
« La page Confidentialité annonce 3 ans maximum après le dernier contact pour les messages, et une conservation jusqu'au retrait du consentement pour les témoignages. »
*Limite :* aucune purge automatique n'est codée.

**E6. 🔵 « Le localStorage est-il soumis au consentement ? »**
« Les règles de la CNIL couvrent tous les traceurs, y compris le localStorage. Mais le token admin est strictement nécessaire au service demandé par l'admin, donc il est exempté. »

### F. Accessibilité

**F1. 🔴 « Votre site est-il accessible ? Avez-vous fait un audit RGAA/WCAG ? »**
« J'ai fait de l'accessibilité de base :
- `lang="fr"`, un lien d'évitement pour aller directement au contenu ;
- des `aria-label` sur les boutons-icônes, des modales annoncées comme dialogues avec gestion du focus ;
- des libellés reliés aux champs du formulaire de contact, et une palette vérifiée en contraste (vert #143601, ratio 12,48:1) ;
- des tests automatisés sur plusieurs de ces points.

L'audit complet WCAG 2.1 AA n'est pas encore fait. »
*Preuves :* `components/layout/Layout.jsx` (`sr-only`) ; `frontend/tests/components/` ; `modif-en-cours-de-dev.md` n° 04 ; `planning.md` tâches 173 ✅ et 136 ❌.

**F2. 🟠 « Le formulaire de connexion est-il accessible ? »**
*Limite à connaître :* dans `LoginAdmin.jsx`, les `<label>` ne sont pas reliés aux champs (pas de `htmlFor` ni d'`id`). Le bouton n'est pas dans un `<form>`, donc la touche Entrée ne valide pas. À reconnaître si on te le demande.

**F3. 🟠 « Vos textes en opacité réduite respectent-ils le contraste ? »**
« J'ai corrigé les contrastes signalés par Lighthouse, en relevant l'opacité minimale sur fond clair. »
*Limite :* il reste beaucoup de `text-primary/60`, `/50` et `/40` (dans `MissionDetail.jsx`, par exemple) qui ne respectent peut-être pas le ratio de 4,5:1.

**F4. 🔵 « L'iframe Google Maps a-t-elle un titre ? »**
*Limite :* non (`LocationDetail.jsx:244`). Une iframe doit avoir un attribut `title` pour les lecteurs d'écran.

**F5. 🔵 « Les images ont-elles un texte alternatif ? »**
« Oui : les champs `*_alt` sont saisis par la cliente dans le dashboard (`photo_hero_alt`, `photo_section_alt`, `image_alt`), avec le titre comme valeur de repli. »

**F6. 🔵 « Le site est-il responsive ? »**
« Oui, conçu d'abord pour le mobile et testé en 375, 768, 1024 et 1440 px. Le dashboard a une navigation mobile pour les tâches prioritaires (témoignages, articles) et affiche un message "prévue pour un ordinateur" sur les autres pages. »
*Preuves :* annexes 07, 09, 11 ; `DashboardLayout.jsx`.

### G. Performance

**G1. 🟠 « Qu'avez-vous fait pour les performances ? »**
« Chargement à la demande des pages (`React.lazy` + `Suspense`), donc un fichier JavaScript par page. Images en WebP, redimensionnées par sharp à l'upload et par un script pour les images statiques. `loading="lazy"` sur les images, `width` et `height` sur le logo pour éviter les décalages de mise en page. Lecteur YouTube chargé seulement au clic. »
*Preuves :* `App.jsx` ; `storageService.js` ; `frontend/scripts/optimize-images.js` ; `journal 2026-11-10`.

**G2. 🟠 « Pourquoi Lighthouse est-il plus bas en développement ? »**
« Vite en développement sert des modules non regroupés, non minifiés, avec le rechargement à chaud. Seul `vite build` + `preview` représente la production. »

**G3. 🔵 « Mettez-vous des données en cache ? »**
« Non, il n'y a pas de cache HTTP configuré ni de cache côté client. Le hook `useRefreshOnFocus` recharge les données quand on revient sur l'onglet, pour afficher les modifications du dashboard. »

**G4. 🔵 « Faites-vous de la pagination ? »**
« Oui pour la modération des témoignages, paginée côté serveur (`limit` / `offset`). Non pour les missions publiques, qui sont peu nombreuses. »

**G5. 🔵 « Combien de requêtes pour une fiche mission ? »**
« Deux appels API : la mission, puis les actions terrain du pays, en non bloquant. Côté Prisma, `findFirst` avec `include` plus une requête sur les médias. Le reste, ce sont les fichiers statiques : images et morceaux de JavaScript. »

### H. Tests et qualité

**H1. 🟠 « Différence entre test unitaire et test d'intégration ? »**
« Un test unitaire teste une fonction isolée, sans base, comme `isValidSlug` ou `authMiddleware` avec des faux objets `req` et `res`. Un test d'intégration envoie une vraie requête HTTP avec Supertest et passe par toute la chaîne jusqu'à PostgreSQL. »

**H2. 🟠 « Montrez un test de sécurité. »**
« `Security.integration.test.js` vérifie les en-têtes Helmet, que CORS refuse une origine inconnue avec un 403, que toutes les routes admin sont fermées sans jeton, et qu'un jeton falsifié est refusé. »

**H3. 🟠 « Comment la CI fonctionne-t-elle ? »**
« GitHub Actions, à chaque push sur `dev-front`, `dev` et `main`, et à chaque pull request. Trois jobs en parallèle :
- front : lint, tests, build ;
- back : tests unitaires ;
- back : tests d'intégration sur un PostgreSQL 16 jetable, avec migrations, `roles.sql` et seed.

`main` n'accepte que des pull requests avec les trois jobs verts. »
*Limite :* la protection de `main` est un réglage GitHub, il n'est pas visible dans le dépôt. Sois prête à le montrer.

**H4. 🟠 « Pourquoi `--runInBand` ? »**
« Les tests partagent le compte admin, qui n'a qu'une session active à la fois. Les exécuter en parallèle ferait échouer les tests de refresh. »

**H5. 🔵 « Qu'est-ce que le test `duplicatedRules` ? »**
« Certaines règles sont dupliquées volontairement entre le front et le back : slug, année, YouTube, ODD, résumé. Ce test vérifie que les deux versions donnent les mêmes résultats. »

**H6. 🟠 « Testez-vous l'envoi d'email ? »**
« Non. Seuls les refus de validation du formulaire de contact sont testés, pour ne pas envoyer de vrais emails. On pourrait simuler Resend avec un *mock*. »

**H7. 🔵 « Avez-vous des tests E2E ? »**
« Non. Playwright ou Cypress seraient l'étape suivante, pour tester le parcours connexion → modération dans un vrai navigateur. »

**H8. 🔵 « Utilisez-vous Postman ? »**
« Oui, pour explorer les nouveaux endpoints avant de les automatiser. Un guide de tests manuels est dans `docs/test_postman_back.md`. »

**H9. 🔵 « Comment gérez-vous les bugs ? »**
« Un suivi dans `docs/bugTracker.md` et dans le journal de bord. Les bugs de sécurité donnent lieu à un test de non-régression, comme `Upload.security.test.js`. »

### I. Docker et déploiement

**I1. 🟠 « Que contient votre `docker-compose.yml` ? »**
« Trois services :
- `postgres:16-alpine`, avec un volume persistant et un contrôle de santé ;
- `backend` (Node 20), qui ne démarre qu'une fois la base prête ;
- `frontend` (Vite).

Le code est monté en volume pour le rechargement à chaud. »

**I2. 🟠 « Pourquoi `npm ci` et pas `npm install` ? »**
« `npm ci` installe exactement les versions du `package-lock.json`. Les builds sont reproductibles. »

**I3. 🔴 « Votre Docker est-il prêt pour la production ? »**
« Non. Les Dockerfiles lancent `npm run dev`, le code est monté en volume, `NODE_ENV` n'est pas en `production`, et les ports de la base et de Prisma Studio sont exposés. Il faut :
- un Dockerfile multi-étapes, qui construit le front puis le sert en fichiers statiques avec Nginx ;
- Node en mode production ;
- HTTPS ;
- la base sur le réseau interne uniquement. »
*Preuves :* Dockerfiles ; `planning.md` tâche 138 ❌.

**I4. 🟠 « Comment déploieriez-vous ? »**
« Sur un VPS OVH :
1. Docker Compose en version production ;
2. Nginx en reverse proxy, qui sert le build React et redirige `/api` vers Express ;
3. certificat Let's Encrypt ;
4. secrets en variables d'environnement ;
5. `prisma migrate deploy` ;
6. import des données exportées ;
7. surveillance avec UptimeRobot. »
*Statut :* 📋 prévu.

**I5. 🔵 « Pourquoi un contrôle de santé ? »**
« `depends_on: condition: service_healthy` fait attendre le backend jusqu'à ce que PostgreSQL accepte des connexions. La route `/api/health` sert à la surveillance. »

**I6. 🔵 « Pourquoi le port 3001 côté hôte ? »**
« L'API écoute sur 3000 dans le conteneur, exposé sur 3001 de la machine, pour éviter un conflit de port local. »

### J. Frontend React

**J1. 🟠 « Comment gérez-vous le chargement et les erreurs d'un appel API ? »**
« Trois états : `loading`, `error` et les données. Un `try / catch / finally` met `loading` à `false` dans tous les cas. On affiche "Chargement…", un message d'erreur, ou le contenu. »
*Preuves :* `MissionDetail.jsx:61-85`.

**J2. 🟠 « Pourquoi `useEffect` dépend-il de `[slug, refreshKey]` ? »**
« Pour recharger quand on passe d'une mission à une autre sans démonter la page, et quand on revient sur l'onglet après plus de 5 secondes. »

**J3. 🔵 « Pourquoi `<a href>` dans `MissionCard` et pas `<Link>` ? »**
*Limite :* `<a href>` recharge toute la page. `<Link>` serait plus fluide. La Navbar, elle, utilise `to=`.

**J4. 🔵 « Comment évitez-vous la duplication de composants ? »**
« Avec des composants réutilisables : `Carousel`, `Button`, `HeroPage`, `AnchorNav`, `LignesToPuces`, `MissionCard`, `LocationCard`, `Modal`. Il reste une factorisation `PageLayout` à faire. »
*Preuves :* `planning.md` tâche 133 ❌.

**J5. 🔵 « Qu'est-ce que `LignesToPuces` ? »**
« Il transforme un texte sur plusieurs lignes en liste à puces. La cliente écrit une ligne par élément, sans éditeur de texte enrichi. »

**J6. 🔵 « Qu'est-ce que `key` dans une liste React ? »**
« C'est un identifiant stable qui permet à React de savoir quel élément a changé. J'utilise l'`id` en base quand il existe. »

**J7. 🔵 « Pourquoi un bug de Swiper ? »**
« Le module Navigation de Swiper v12 fonctionnait mal avec React. J'ai fait une navigation sur mesure avec `useRef` et `slidePrev` / `slideNext`. »
*Preuves :* `modif-en-cours-de-dev.md` n° 44.

### K. Gestion de projet, binôme, cliente

**K1. 🟠 « Comment avez-vous organisé le travail ? »**
« Sprints d'une semaine, planning en tâches numérotées, journal de bord quotidien, rétrospectives et revues de sprint, branches par personne, fusion sur `dev` après relecture. »
*Preuves :* `docs/planning.md` ; `docs/sprintReviews.md` ; `docs/sprintRetrospectives.md` ; `docs/journal-de-bord/`.

**K2. 🟠 « Quelle a été votre plus grande difficulté ? »**
Exemples réels à choisir :
- la migration N:N sans perte de données ;
- le refresh silencieux et la boucle de redirection au login (d'où `loginAdmin` qui n'utilise pas `authFetch`) ;
- les incompatibilités Swiper et `react-scroll` avec React 19 ;
- la séparation des droits PostgreSQL (`REASSIGN OWNED` impossible sur `postgres`).
*Preuves :* `roles.sql` (commentaire) ; `auth.js` (front) ; `modif-en-cours-de-dev.md` n° 44 et 45.

**K3. 🟠 « Comment avez-vous recueilli les besoins de la cliente ? »**
« Entretiens et questions écrites, suivies dans `docs/questions-cliente.md`. Les décisions qui s'écartent des guides initiaux sont tracées dans `modif-en-cours-de-dev.md`. »

**K4. 🟠 « Quels arbitrages avez-vous faits ? »**
« Bilingue reporté, lien Mission–FieldAction par pays pour le MVP, suppression logique pour les missions mais définitive pour les témoignages, pas d'éditeur de texte enrichi (texte en puces), dashboard mobile limité aux tâches prioritaires, pays des filtres déduits des données déjà chargées plutôt qu'une nouvelle route. »

**K5. 🔵 « Comment gérez-vous les conflits Git ? »**
« Une seule personne à la fois sur un même périmètre, des branches séparées, et une fusion fréquente sur `dev`. »

**K6. 🔵 « La cliente peut-elle tout modifier ? »**
« Tout le **contenu** est en base et modifiable dans le dashboard. La **structure** (sections, mise en page) reste dans le code. »
*Limite :* les types Service Civique, Groupe jeunes et Congé solidaire restent en partie écrits en dur (README).

**K7. 🔵 « Que reste-t-il à faire ? »**
« Déploiement (138 à 147), nouvelle mesure Lighthouse (134), audit WCAG (136), bilingue (135), remplissage des contenus réels (bloc F), guide utilisateur PDF (144). »

### L. Questions pièges et scénarios « Que feriez-vous si… ? »

**L1. 🔴 « …l'admin oublie son mot de passe ? »**
« Aujourd'hui : relancer le seed avec un nouveau `ADMIN_PASSWORD`, ce qui met à jour le hash. À terme : un lien de réinitialisation par email, avec un jeton à usage unique et une expiration courte, envoyé via Resend. »

**L2. 🔴 « …le `JWT_SECRET` fuit ? »**
« Changer le secret immédiatement : tous les access tokens deviennent invalides. Changer aussi le secret du refresh token et vider `refresh_token_hash` en base. »

**L3. 🟠 « …la base est supprimée par erreur ? »**
« Restaurer la dernière sauvegarde `pg_dump` selon la procédure documentée. Attention, `docker compose down -v` supprime le volume. »

**L4. 🟠 « …un témoignage injurieux est publié ? »**
« Il ne peut pas être publié sans modération : il arrive en `pending`. Une fois approuvé, l'admin peut le refuser (il est alors retiré de l'accueil) ou le supprimer définitivement. »

**L5. 🟠 « …deux missions ont le même slug ? »**
« La contrainte `@unique` le refuse. L'erreur P2002 devient un 409 `SLUG_TAKEN`, et le formulaire encadre le champ en rouge. »

**L6. 🟠 « …un visiteur modifie l'URL en `/missions/../../etc` ? »**
« `isValidSlug` n'accepte que les minuscules, chiffres et tirets : réponse 400 "Format de slug invalide". »

**L7. 🟠 « …on envoie `status: "approved"` en créant un témoignage public ? »**
« Ignoré : le service impose `status: "pending"`. »

**L8. 🟠 « …on envoie un fichier `.php` renommé en `.jpg` ? »**
« Multer filtre sur le type MIME, et sharp tente de décoder l'image : si ce n'est pas une vraie image, il échoue. Le fichier n'est jamais exécuté, car le serveur le sert en fichier statique avec un nom reconstruit. »

**L9. 🟠 « …le trafic est multiplié par 100 ? »**
« Ajouter du cache HTTP et un CDN pour les images, servir le front en statique par Nginx, et ajouter une pagination publique. Le pool de connexions `pg` et des index ciblés aideraient la base. »

**L10. 🟠 « …la cliente veut un second administrateur, modérateur seulement ? »**
« Le champ `role` existe déjà. Il faudrait une inscription par l'admin, un middleware qui vérifie une liste de rôles autorisés, et passer à une session par appareil. »

**L11. 🔵 « …Resend est indisponible ? »**
« Le contrôleur renvoie un 500 "Erreur lors de l'envoi du message" et le front affiche l'erreur. Le message n'est pas stocké, donc il serait perdu. Une file d'attente ou un enregistrement en base de secours serait une amélioration. »

**L12. 🔵 « …on supprime une action terrain qui a des tags ? »**
« Les clés étrangères sont en `RESTRICT` : le service doit supprimer les tags, ODD et pays avant, ou la base refuse. »

**L13. 🔴 « Votre site est-il sécurisé ? » (question ouverte piège)**
« Aucun site n'est sécurisé à 100 %. J'ai mis en place les protections essentielles : authentification JWT avec rotation, bcrypt, routes admin protégées côté serveur, requêtes paramétrées, listes blanches de champs, upload filtré et réencodé, Helmet, CORS, erreurs génériques en production, comptes de base séparés. Je connais aussi les limites : pas de limitation de débit, déconnexion seulement côté front, token dans le localStorage. »

**L14. 🔵 « Pourquoi ne pas avoir utilisé une bibliothèque de validation (Zod, Joi) ? »**
« La validation est écrite à la main dans les contrôleurs, avec des fonctions partagées dans `utils/validation.js`. Zod rendrait les règles plus déclaratives et réutilisables. »

---

## PARTIE 3 — Les 10 faiblesses ou incohérences que le jury pourrait relever

| # | Faiblesse | Où | Comment la présenter |
|---|---|---|---|
| 1 | **Lighthouse 70 contre un objectif > 90**, sans rapport versionné | `planning.md` tâche 134 🔵 | « Objectif non atteint, corrections faites, mesure finale à faire sur `preview`. » |
| 2 | **La déconnexion n'appelle pas le backend** : le cookie refresh reste valide 7 jours | `DashboardLayout.jsx:24-27` | « Route backend existante et testée, une ligne à brancher. » |
| 3 | **Pas de limitation de débit** (login, contact, témoignages, upload) | `backend/package.json` | « Identifié, `express-rate-limit` prévu. » |
| 4 | **Page Cookies inexacte** : elle annonce un cookie de consentement inexistant ; Google Maps et Google Fonts chargés sans consentement | `Cookies.jsx:43-44`, `LocationDetail.jsx:244`, `index.html` | « Incohérence relevée : polices à héberger sur le site, carte à charger au clic. » |
| 5 | **README : diagramme `Location.mission_id` obsolète** | `README.md` (ER Domaine 1) | « Antérieur à la migration N:N. » |
| 6 | **README : « token JWT valide » côté front** : seule la présence est vérifiée | `README.md` § Architecture ; `ProtectedRoute.jsx` | « Le front fait du confort d'interface ; la validité est vérifiée par le back. » |
| 7 | **README : « la base anticipe le bilingue »** : aucun champ de langue dans le schéma | `README.md` ; `schema.prisma` | Ne pas reprendre cet argument. |
| 8 | **Pas de production** : Docker en mode développement, ports 5432 et 5555 exposés, pas de HTTPS ni de `NODE_ENV=production` | Dockerfiles, `docker-compose.yml` | « Environnement de développement ; plan de déploiement prêt. » |
| 9 | **Accessibilité partielle** : labels du login non reliés, Entrée inactive, iframe sans `title`, textes en opacité 40-60 %, audit WCAG non fait | `LoginAdmin.jsx`, `LocationDetail.jsx`, `MissionDetail.jsx` | « Accessibilité de base faite, audit complet prévu (136). » |
| 10 | **Intégrité partielle** : `Media` sans clé étrangère, lien Mission ↔ FieldAction par texte (`contains`) | `schema.prisma`, `fieldActionService.js` | « Choix de MVP documentés, V2 prévue (`MissionFieldAction`). » |

Également remarquables :
- en production, le message de login devient « Une erreur est survenue » ;
- « Mot de passe oublié » est un `href="#"` ;
- « Se souvenir de moi » n'est relié à rien ;
- `VITE_API_URL` est défini mais inutilisé ;
- la politique de confidentialité ne cite pas Resend ;
- le contrôleur `fieldActionController` n'utilise pas `next(error)`, contrairement aux autres.

---

## PARTIE 4 — Les 10 questions techniques les plus difficiles

1. **« Expliquez la rotation du refresh token et la détection de réutilisation. »** → `authService.refresh` : vérification de la signature → comparaison bcrypt avec le hash en base → si ça ne correspond pas, révocation totale → sinon, nouveaux tokens et nouveau hash.
2. **« Pourquoi un JWT ne peut-il pas être révoqué ? Comment le rendre révocable ? »** → Il est sans état : il faudrait une liste noire ou une version de token stockée en base et vérifiée à chaque requête, au prix d'un accès base supplémentaire.
3. **« Détaillez la migration N:N et le risque de perte de données. »** → Le `INSERT INTO "_LocationToMission" SELECT id, mission_id FROM "Location"` ajouté à la main **avant** `DROP COLUMN`.
4. **« Pourquoi la suppression définitive d'une mission est-elle en transaction ? Ordre des opérations ? »** → Tout ou rien. Ordre : témoignages à `null` → tarifs (`RESTRICT`) → médias (pas de clé étrangère) → mission (la table de jointure part en cascade).
5. **« Comment Prisma traduit-il `include` en SQL ? »** → Prisma génère une ou plusieurs requêtes SQL (une par relation, ou une jointure selon la stratégie) et assemble l'objet imbriqué. Ne pas affirmer une jointure unique.
6. **« Pourquoi CORS ne protège-t-il pas votre API ? »** → C'est le navigateur qui l'applique ; curl, Postman ou un serveur ne sont pas concernés. L'authentification est faite par `authMiddleware`.
7. **« Différence entre `SameSite=Strict` et `Lax`, et impact sur votre refresh ? »** → `Strict` : jamais envoyé depuis un autre site, même en suivant un lien. Comme le refresh est un appel `fetch` depuis le même site, `Strict` convient.
8. **« Comment fonctionne le gestionnaire d'erreurs d'Express ? »** → Une fonction à 4 paramètres `(err, req, res, next)` placée en dernier. `next(error)` y saute directement. Le statut est lu dans `err.status`, sinon 500. Les codes Prisma P2025 et P2002 sont traduits en 404 et 409.
9. **« Pourquoi deux comptes PostgreSQL, et pourquoi `ALTER DEFAULT PRIVILEGES` ? »** → Moindre privilège. Les `GRANT ... ON ALL TABLES` ne visent que les tables déjà existantes ; `ALTER DEFAULT PRIVILEGES` donne aussi les droits sur les tables des migrations futures.
10. **« Quelle stratégie SEO pour une SPA, et pourquoi les aperçus de partage sont-ils identiques ? »** → Les robots des réseaux sociaux n'exécutent pas JavaScript et ne lisent que `index.html`. Solutions : pré-rendu, rendu serveur, ou rendu dynamique côté Nginx.

---

## PARTIE 5 — Les 10 réponses courtes à mémoriser

1. **Architecture :** « React 19 + Vite, API REST Express 5, Prisma 7, PostgreSQL 16, dans Docker Compose. Back découpé en routes → contrôleurs → services. »
2. **Authentification :** « Access token JWT de 15 minutes dans l'en-tête ; refresh token de 7 jours dans un cookie HttpOnly SameSite Strict, haché en base, avec rotation. »
3. **Protection admin :** « `router.use(authMiddleware)` sur les 15 routeurs admin : 401 sans token valide, 403 sans rôle admin. `ProtectedRoute` n'est que du confort. »
4. **Mots de passe :** « Bcrypt, même message pour un email inconnu et un mauvais mot de passe. »
5. **Suppression :** « Mission : mise en pause (`is_active`) par défaut, suppression définitive en transaction. Témoignage : suppression réelle, pour le droit à l'effacement. »
6. **N:N :** « Table de jointure implicite `_LocationToMission`, en cascade, données recopiées à la main dans la migration. »
7. **Tests :** « Environ 415 tests : Jest + Supertest côté back, Vitest + RTL côté front. CI GitHub Actions avec une base jetable. Pas d'E2E. »
8. **Production :** « Pas encore déployé. Prévu sur un VPS OVH avec Nginx, SSL et un Dockerfile multi-étapes. »
9. **RGPD :** « Consentement vérifié côté serveur, modération, droit à l'effacement, contact non stocké. Limites : Google Fonts et Maps, page Cookies à corriger. »
10. **Limites :** « Pas de limitation de débit, déconnexion seulement côté front, token dans le localStorage, Lighthouse 70, audit WCAG à faire. »

---

## PARTIE 6 — Vérifications avant la démonstration

**Environnement**
- [ ] `docker compose up -d` : les 3 conteneurs sont `Up` (`docker ps`).
- [ ] `http://localhost:3001/api/health` répond `{"status":"ok"}`.
- [ ] `http://localhost:5173` s'affiche (accueil, puis missions, puis une fiche mission).
- [ ] La base contient au moins une mission **active** de type `volontariat_individuel`, avec tarifs, lieux et un témoignage approuvé. Note son slug.
- [ ] Connexion admin testée **avant** le jury (mot de passe `ADMIN_PASSWORD` sous la main).
- [ ] Ne pas lancer les tests d'intégration juste avant : ils se connectent avec le compte admin et ferment ta session du dashboard.

**Scénario conseillé**
1. Visiteur : accueil → missions → fiche mission → dépôt d'un témoignage (case de consentement).
2. Admin : `/admin/login` → modération → approuver → vérifier que le témoignage apparaît sur la fiche.
3. Admin : modifier une mission (PATCH) → vérifier sur le site public.
4. Sécurité : ouvrir `/admin/missions` en navigation privée → redirection vers le login.
5. Sécurité : outils de développement → onglet Réseau → montrer l'en-tête `Authorization: Bearer` et le cookie `refreshToken` HttpOnly (onglet Application).

**À éviter en démo**
- Cliquer sur « Déconnexion » puis prétendre que la session est révoquée côté serveur.
- Montrer la page Cookies ou parler de « bandeau de consentement ».
- Lancer Lighthouse en direct sur le port 5173 (score faussé).
- Tester la suppression définitive sur une vraie mission.

**Plan B**
- [ ] Captures `docs/annexes/` et diagrammes `docs/diagramm_finaux/` ouverts dans un onglet.
- [ ] Page GitHub Actions avec une CI verte ouverte.
- [ ] Fichiers clés ouverts dans VS Code : `authMiddleware.js`, `authService.js`, `missionService.js`, la migration N:N, `roles.sql`, `ProtectedRoute.jsx`, `client.js`.

**Si tu as 5 minutes de plus**
- [ ] `docker exec sensolidaire_backend npm run test:unit` → note le nombre exact de tests verts.
- [ ] `docker exec sensolidaire_frontend npm run test:run` → idem.
