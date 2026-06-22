# Journal de bord
## Sens Solidaire — Refonte du site web
*Pichot Gwen & Amblard Alison · Holberton School — Thonon-les-Bains*
*Document de suivi quotidien — à compléter chaque jour*

---

## Jour 1 · 28 mai 2026
### S1 — Initialisation + Schéma Prisma (partiel)

#### Statut général

| Élément | Statut |
|---|---|
| Repo GitHub | ✅ Créé et pushé — 4 branches actives |
| Structure monorepo | ✅ Créée — frontend / backend / docs |
| React + Tailwind | ✅ Installés et fonctionnels via Vite |
| React Router | ✅ Installé et configuré dans App.jsx |
| Node.js + Express | ✅ Serveur démarré — /api/health répond |
| Prisma v7 | ✅ Configuré avec prisma.config.ts |
| PostgreSQL | ✅ Installé, BDD sensolidaire créée |
| Connexion Prisma ↔ BDD | ✅ Synchronisée — db push OK |
| Table Mission | ✅ Créée et vérifiée dans Prisma Studio |
| Table MissionPricing | ✅ Créée avec relation → Mission |
| Table Location | ✅ Créée avec relation → Mission |
| Table Testimonial | ⏳ Non créée — assignée à Alison |
| Table Media | ⏳ Non créée — assignée à Alison |
| Table Admin | ⏳ Non créée — assignée à Alison |
| Docker | ℹ️ Non démarré — prévu S1 fin |

#### Ce qui a été fait

**Git & structure**
- Repo GitHub créé : github.com/GwenP88/sens-solidaire
- 4 branches créées et pushées : main, dev, dev-front, dev-back
- Structure monorepo initialisée : /frontend /backend /docs
- Fichiers .gitkeep ajoutés pour tracker les dossiers vides
- .gitignore créé à la racine et dans /backend (+ règle *.Zone.Identifier)
- Documentation complète ajoutée dans /docs

**Frontend**
- Vite + React installé dans /frontend
- Tailwind CSS installé et configuré via @tailwindcss/vite
- React Router DOM installé et configuré dans App.jsx
- Fichiers commentés en français : vite.config.js, index.css, App.jsx, main.jsx, index.html

**Backend**
- Node.js + Express initialisé dans /backend
- Dépendances installées : express, cors, dotenv, helmet, bcrypt, jsonwebtoken, nodemon
- server.js créé et commenté — route /api/health fonctionnelle
- package.json configuré : type module, scripts start/dev

**Base de données**
- PostgreSQL installé dans WSL
- Base de données sensolidaire créée
- Prisma v7 installé : prisma + @prisma/client + @prisma/adapter-pg
- prisma.config.ts créé avec defineConfig + env(DATABASE_URL)
- .env créé avec DATABASE_URL, PORT, JWT_SECRET, JWT_EXPIRES_IN (1d)
- Table Mission créée — 16 champs, brouillon autorisé (champs optionnels)
- Table MissionPricing créée — relation 1→N avec Mission
- Table Location créée — relation 1→N avec Mission
- Relations inverses ajoutées dans Mission : pricing[], locations[]
- Toutes les tables vérifiées dans Prisma Studio

#### Tests de lancement

**Frontend — npm run dev**

| Test | Résultat observé | Statut |
|---|---|---|
| Tailwind CSS | Fond vert foncé + texte blanc centré visible à localhost:5173 | ✅ OK |
| React Router | Route / affiche 'Accueil' — pas d'erreur console | ✅ OK |
| Vite HMR | Modifications en temps réel sans rechargement manuel | ✅ OK |

**Backend — npm run dev**

| Test | Résultat observé | Statut |
|---|---|---|
| Démarrage Express | Terminal affiche : Serveur démarré sur le port 3000 | ✅ OK |
| Route /api/health | localhost:3000/api/health retourne {status: ok, message: Serveur opérationnel} | ✅ OK |
| Route / inexistante | localhost:3000 retourne Cannot GET / — comportement attendu | ✅ OK |
| Nodemon | Redémarrage automatique à chaque modification de fichier | ✅ OK |

**Base de données — Prisma**

| Test | Résultat observé | Statut |
|---|---|---|
| npx prisma db push (initial) | The database is already in sync with the Prisma schema | ✅ OK |
| npx prisma db push (Mission) | Your database is now in sync with your Prisma schema | ✅ OK |
| npx prisma db push (MissionPricing) | Your database is now in sync with your Prisma schema | ✅ OK |
| npx prisma db push (Location) | Your database is now in sync with your Prisma schema | ✅ OK |
| Prisma Studio | Tables Mission, MissionPricing, Location visibles à localhost:5555 | ✅ OK |

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| npx prisma init — dossier déjà existant | Le dossier /prisma existait déjà — solution : créer prisma.config.ts et schema.prisma manuellement |
| Prisma v7 — url dans schema.prisma non supportée | Prisma v7 n'accepte plus url dans datasource — solution : déplacer la config dans prisma.config.ts avec defineConfig |
| prisma db push — erreur P1000 authentication failed | Mot de passe PostgreSQL incorrect — solution : ALTER USER postgres WITH PASSWORD 'postgres' dans psql |
| Fichiers Zone.Identifier dans /docs | Métadonnées Windows créées lors du téléchargement — solution : find . -name '*Zone*' -delete + règle ajoutée au .gitignore |

#### Tables assignées à Alison — Jour 2

| Table | Description | Assignée à |
|---|---|---|
| Testimonial | Témoignages soumis par les bénévoles — modération admin + RGPD | Alison |
| Media | Fichiers liés aux entités (photos, PDFs) — stockage chemin relatif | Alison |
| Admin | Utilisateurs admin — auth JWT, bcrypt, refresh token | Alison |

#### Notes & observations
- Prisma v7 est sorti récemment — syntaxe différente des tutos en ligne (attention aux ressources datées)
- PostgreSQL doit être démarré manuellement à chaque session WSL : `sudo service postgresql start`
- JWT_EXPIRES_IN mis à `1d` pour le développement — remettre à `15m` avant la mise en production
- Les tables enfants (MissionPricing, Location) n'ont pas de champs NULL — elles ne sont créées que quand la donnée est complète
- Docker sera finalisé une fois les 6 tables MVP créées

---

## Jour 2 · 29 mai 2026 — Matin
### S1 — Docker + Schéma Prisma complet + Maquettes

#### Statut général — fin de matinée

| Élément | Statut |
|---|---|
| Docker — PostgreSQL | ✅ Conteneur healthy, BDD initialisée automatiquement |
| Docker — Backend | ✅ Serveur démarré sur le port 3000 dans le conteneur |
| Docker — Frontend | ✅ Vite prêt sur le port 5173 dans le conteneur |
| Schéma Prisma — 6 tables | ✅ Mission, MissionPricing, Location, Testimonial, Media, Admin |
| Prisma Studio | ✅ Tables vérifiées — 6 tables visibles sur localhost:5555 |
| Maquettes Home page | ✅ 4 versions générées avec vraies photos + palette V2 |
| S1 — Initialisation | ✅ COMPLÈTE |

#### Ce qui a été fait

**Schéma Prisma — Alison**
- Table Testimonial créée — relation → Mission, champs RGPD, statut modération
- Table Media créée — système polymorphique (entity_type + entity_id)
- Table Admin créée — auth JWT, bcrypt, refresh token
- npx prisma db push — 6 tables synchronisées avec la BDD
- Vérification Prisma Studio — toutes les tables visibles

**Docker — Gwen**
- Dockerfile backend créé — node:20-alpine, port 3000, nodemon
- Dockerfile frontend créé — node:20-alpine, port 5173, vite --host
- docker-compose.yml créé — orchestre postgres + backend + frontend
- Volumes configurés — persistance BDD + hot reload code source
- Healthcheck postgres — backend attend que la BDD soit ready
- docker compose up --build — premier lancement réussi en 139s

#### Tests de lancement — Docker compose up --build

| Test | Résultat observé | Statut |
|---|---|---|
| Build frontend | Image sens-solidaire-frontend built en 136s | ✅ OK |
| Build backend | Image sens-solidaire-backend built en 136s | ✅ OK |
| PostgreSQL healthcheck | Container sensolidaire_db Healthy | ✅ OK |
| Backend dans Docker | Serveur démarré sur le port 3000 | ✅ OK |
| Frontend dans Docker | VITE v8.0.14 ready in 414ms | ✅ OK |
| localhost:5173 | Page React 'Accueil' affichée | ✅ OK |
| localhost:3000/api/health | { status: ok, message: Serveur Sens Solidaire opérationnel } | ✅ OK |

#### Notes & observations
- Docker ralentit le PC — utiliser `docker compose up -d` (mode détaché) ou stopper quand inutile
- En développement pur (code sans test intégration), lancer `npm run dev` directement sans Docker
- La S1 est officiellement terminée — tout l'environnement de développement est opérationnel

---

## Jour 2 · 29 mai 2026 — Après-midi
### S1/S2 — Auth JWT + Charte graphique + Maquettes Figma

#### Statut général — fin de journée

| Élément | Statut |
|---|---|
| Auth JWT complète | ✅ Login / Logout / Refresh / Verify — testés Postman |
| Structure backend src/ | ✅ config, utils, services, controllers, middlewares, routes |
| Prisma — migration init | ✅ npx prisma migrate dev --name init — 6 tables créées |
| Seed admin | ✅ Compte admin initial créé avec bcrypt — upsert |
| Docker — Prisma generate | ✅ RUN npx prisma generate ajouté au Dockerfile |
| Cookie HTTP-Only | ✅ Refresh token en cookie — inaccessible JS (anti-XSS) |
| Charte graphique | ✅ Palette + typo + boutons + espacements validés |
| Figma — Composants | ✅ Navbar + 4 variantes Button créés comme composants |

#### Ce qui a été fait

**Alison — Backend Auth JWT**
- Table Admin — password_hash (jamais en clair), refresh_token_hash nullable
- src/config/db.js — connexion Prisma avec adaptateur pg (instance unique partagée)
- src/utils/jwt.js — 4 fonctions : generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken
- src/services/authService.js — login, logout, refresh avec rotation des tokens
- src/controllers/authController.js — loginAdmin, logoutAdmin, refreshToken, verifyToken
- src/middlewares/authMiddleware.js — vérifie JWT, attache req.user = { id, role }
- src/routes/auth.js — 4 endpoints : login, refresh (publics), logout, verify (protégés)
- prisma/seed.js — admin initial avec bcrypt + upsert (idempotent)

**Sécurité mise en place**
- Deux secrets JWT différents (JWT_SECRET + JWT_REFRESH_SECRET)
- Refresh token hashé en BDD — inutilisable si la BDD est compromise
- Rotation détectée — révocation de toutes les sessions si token réutilisé
- Message d'erreur identique si email inconnu OU password faux — anti-énumération
- Cookie HTTP-Only pour le refresh token — JavaScript ne peut jamais le lire

**Gwen — Charte graphique + Maquettes Figma**
- Palette V2 définitive — 6 couleurs : Forest Green #2F8A3A / Dark Forest #143601 / Terracotta #A44A2F / Bone #E8DFD1 / Pale Oak #D9CBB8 / Parchment #F8F6F1
- Typographie : Lora Bold/SemiBold (titres) + Source Sans 3 Regular (corps)
- H1 64px/110% — H2 48px/120% — H3 32px/130% — Body 18px — Small 16px
- Fichier Figma Desktop créé — 3 pages : Mockup / Composants / Assets
- Composants Figma : Button/Primary, Button/Secondary, NavBar `<nav>`

#### Tests Postman — Backend

| Test | Résultat observé | Statut |
|---|---|---|
| GET /api/health | 200 OK — Serveur Sens Solidaire opérationnel | ✅ OK |
| POST /api/auth/login | 200 + accessToken retourné dans le body | ✅ OK |
| POST /api/auth/logout | 200 — cookie supprimé | ✅ OK |
| GET /api/auth/verify | 200 + { id: 1, role: 'admin' } | ✅ OK |
| POST /api/auth/refresh | 200 + nouveau accessToken | ✅ OK |

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| Prisma v7 — client engine | Prisma v7 nécessite obligatoirement un adaptateur pg |
| Docker crash au démarrage | Prisma Client non généré dans le conteneur — solution : RUN npx prisma generate dans le Dockerfile |
| secretOrPrivateKey must have a value | JWT_REFRESH_SECRET manquant dans docker-compose.yml |
| package.json pointait vers mauvais server.js | main et scripts pointaient vers server.js racine au lieu de src/server.js |

#### Notes & observations
- Nommer les calques Figma selon les balises HTML facilite énormément le passage au code
- Deux secrets JWT séparés est une bonne pratique de sécurité — ne pas les fusionner
- `npx prisma migrate dev` crée des fichiers de migration versionnés — préférable à db push pour la production

---

## Jour 3 · 30 mai 2026
### S1 — Composants Figma : Footer (Zones 1, 2 & 3)

#### Statut général

| Élément | Statut |
|---|---|
| Footer/CTA `<section>` Zone 1 | ✅ Finalisé — structure, boutons, overlay |
| Footer/Nav `<section>` Zone 2 | ✅ Finalisé — Col1, Col2, Col3, Col4 |
| Footer/Nav `<section>` Zone 3 | ✅ Finalisé — barre légale |
| Footer `<footer>` assemblé | ✅ Les 3 zones assemblées |
| Palette couleurs | ✅ Révisée — #143601 remplace #1E4D2B |
| Boutons Primary / Secondary | ✅ Redéfinis — terracotta / vert foncé |
| Tests accessibilité Stark | ✅ Effectués sur tous les composants |

#### Ce qui a été fait

**Footer — Zone 1 (CTA immersif)**
- Frame parent Footer/CTA `<section>` — 1440 × 500px, fond immersif placeholder
- Contenu : titre h1, sous-titre, 2 boutons côte à côte (Primary terracotta + Secondary vert foncé)
- Alignement contenu en haut à gauche — cohérent avec les Hero

**Footer — Zone 2 (Navigation 4 colonnes)**
- Frame parent Footer/Nav `<section>` — 1440px, fond #143601, padding 60px haut/bas 120px gauche/droite
- Col1 : Logo (80px) + Tagline `<p>` + Socials `<div>` (icônes 32-40px) — largeur 320px
- Col2 : DÉCOUVRIR — 5 liens navigation | Col3 : S'ENGAGER — 3 liens | Col4 : NOUS CONTACTER — 3 items
- Spacer rectangle utilisé pour gérer les gaps inégaux en auto layout

**Footer — Zone 3 (Barre légale)**
- Frame Footer/Legal `<div>` — fond #143601, border top blanc 15%
- Copyright à gauche — liens (Mentions légales, Confidentialité, Cookies) à droite
- Texte blanc 50% opacité, 12-14px

**Palette couleurs — Révision**
- Couleur #1E4D2B remplacée par #143601 dans toute la palette
- Ratio contraste vérifié : #143601 + #F8F6F1 = 12.48:1 — WCAG AAA ✅
- Règle établie : #2F8A3A = accents/icônes uniquement — #143601 = fonds sombres

**Boutons — Refonte**
- Button/Primary : fond #A44A2F (terracotta) + texte #F8F6F1 — ratio 5.4:1 ✅ AA
- Button/Secondary : fond #143601 (vert foncé) + texte #F8F6F1 — ratio >7:1 ✅ AAA
- Suppression Button/Dark et Button/Ghost — redondants
- Hover : inversion fond/texte sur les deux boutons

#### Résultats tests Stark

| Élément | Combinaison couleurs | Résultat |
|---|---|---|
| Button/Primary static | #A44A2F + #F8F6F1 | 5.4:1 ✅ AA |
| Button/Primary hover | #F0EDE8 + #A44A2F | 5.1:1 ✅ AA |
| Fond footer + texte | #143601 + #F8F6F1 | 12.48:1 ✅ AAA |
| StatsBar chiffres | #E8DFD1 + #A44A2F | 5.4:1 ✅ AA |
| Ancien bouton vert | #73AD77 + #F0EDE8 | 2.26:1 ❌ Échec |
| #2F8A3A + texte blanc | #2F8A3A + #F8F6F1 | 3.73:1 ❌ Texte normal |

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| Opacité 65% sur les anciens boutons | Origine inconnue — opacité remise à 100% sur tous les boutons |
| Tagline Col1 débordait à 280px | Largeur Col1 portée à 320px |
| 2 boutons identiques Footer/CTA | Bouton 2 remplacé par Button/Secondary |

#### Notes & observations
- Plugin Stark indispensable — à utiliser sur chaque nouveau composant
- Contenu éditorial (taglines) non modifiable sans validation cliente
- Logo navbar — version blanche à demander à la cliente (navbar transparente sur Hero)

---

## Jour 4 · 2 juin 2026
### S2 — Composants Figma : Cards, Navigation, Formulaires

#### Statut général

| Élément | Statut |
|---|---|
| AnchorNav `<nav>` | ✅ Finalisé — liens + variantes Default/Active |
| FilterChips | ✅ Finalisé — variantes Default/Active, composant avec variants |
| MissionCard `<article>` | ✅ Finalisé — format paysage, contenu Kenya |
| LocationCard `<article>` | ✅ Finalisé — même base MissionCard, contenu TTNP |
| ActionCard `<article>` | ✅ Finalisé — badges ODD intégrés, contenu Sri Lanka |
| TestimonialCard `<article>` | ✅ Finalisé — style guillemets, fond beige |
| ContactForm `<section>` | ✅ Finalisé — split view image/formulaire |
| Hero Home — image réelle | ✅ Image du site actuel intégrée |
| Footer — image réelle | ✅ Image terrain intégrée |
| Gradient navbar | ✅ Ajouté — protection lisibilité liens |

#### Ce qui a été fait

**AnchorNav**
- Frame parent AnchorNav `<nav>` — 1440px, fond blanc, border bottom 1px #E8DFD1
- Variantes : State=Default (texte #143601 70%) / State=Active (texte #2F8A3A + underline visible)
- 8 liens : Présentation, Lieux, Programme, Coût & durée, Comment partir, Infos pratiques, Galerie, Témoignages

**FilterChips**
- Composant FilterChip — State=Default (fond transparent, bordure #143601 30%) / State=Active (fond #143601)
- Border radius 20px — forme pilule
- 5 chips : Toutes les missions, Missions volontariat, Service civique, Groupe jeunes, Congé solidaire

**Cards — Base commune**
- MissionCard `<article>` — format paysage 500 × 280px, overlay 50%, contenu aligné bas gauche
- Structure : Photo + Overlay + Content `<div>` (Badge + Title + Description + Actions `<div>`)
- LocationCard `<article>` — même base, sans Duration, contenu TTNP Kenya
- ActionCard `<article>` — même base, badges ODD (12, 15, 8) intégrés, contenu Sri Lanka

**TestimonialCard**
- Design distinct — fond #F8F6F1, bordure #E8DFD1
- Structure : QuoteBlock (guillemets 56px + citation Lora italic) + Divider + Author (Avatar 48px + Info)

**ContactForm**
- Split view desktop : Image `<div>` 720px gauche + Form `<div>` 720px droite
- Champs : NameRow (Prénom + Nom) + Email + Sujet select + Message textarea + RGPD checkbox + Bouton Submit pleine largeur

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| Content `<div>` débordait de la MissionCard | Largeur Fixed calculée (500-48=452px) + hauteur carte augmentée |
| Gradient navbar invisible sur image verte | Couleur gradient changée en noir #000000 |
| Logo illisible sur Hero | Cercle blanc semi-transparent derrière le logo |

#### Notes & observations
- Les cards MissionCard / LocationCard / ActionCard partagent la même base — bonne décision de réutilisation
- Logo blanc à demander à la cliente — priorité avant intégration finale
- Tester le contraste Stark sur chaque nouveau composant avant validation

---

## Jour 5 · 3 juin 2026
### S2 — Composants Figma (suite) + Début assemblage page Accueil

#### Statut général

| Élément | Statut |
|---|---|
| Badge ODD (17 variants) | ✅ Terminé — carrés colorés numérotés, couleurs officielles ONU |
| Tag (2 variants) | ✅ Terminé — light (fond beige) + dark (texte blanc italique) |
| ActionCard | ✅ Révisée — badges ODD simplifiés + tags dark |
| Carousel Cards | ✅ Terminé — flèches latérales + dots + 3 cards visibles |
| Carousel Gallery | ✅ Terminé — 3 images visibles, 4 dots (12 images max, 3 par 3) |
| Page Accueil | ⏳ En cours — Navbar + Hero + StatsBar + Section Missions assemblés |

#### Ce qui a été fait

**Composants terminés**
- Badge ODD — 17 variants (1 à 17). Couleur officielle ONU. Texte blanc centré, 11px bold, border radius 6px. Taille 28×28px.
- Tag — 2 variants. Light : fond #E8DFD1, texte #143601. Dark : sans fond, texte blanc italique bold.
- ActionCard — reconstruite. Badges ODD simplifiés (carrés colorés). Tags dark dans TagRow.
- Carousel Cards — flèches gauche/droite sur les côtés du Track. 3 TestimonialCards visibles. Dots centré en dessous. Fond #143601.
- Carousel Gallery — même structure. 3 ImageFrames (350×250, radius 8). 4 dots pour 12 images max affichées 3 par 3.

**Assemblage page Accueil**
- Frame page Home `<main>` créée — 1440px, auto layout vertical, gap 0.
- Navbar intégrée — transparente sur le Hero, fill horizontal.
- Hero Home intégré — image immersive pleine largeur, titre, accroche, CTA.
- StatsBar intégrée — 4 compteurs d'impact bien alignés.
- Section Missions créée — fond #F8F6F1, grille 3+2 avec 5 MissionCards.

#### Décisions techniques & design

**ActionCard — badges ODD simplifiés**
- Décision : abandonner les vraies icônes officielles ONU (trop chargées, peu lisibles en petit). Remplacement par petits carrés colorés avec numéro en blanc.

**Carousel Gallery — crop des images**
- Crop automatique au centre via `object-fit: cover` + `object-position: center`.
- V1 : photos avec sujet centré (consigne cliente).
- V2 : outil recadrage dashboard (coordonnées x/y en BDD).

#### Points à valider avec la cliente

| # | Sujet | Question / Décision attendue |
|---|---|---|
| 1 | Logo navbar version blanche | Nécessaire pour navbar transparente. Demander SVG ou PNG fond transparent. |
| 2 | Section Missions — affichage | 5 destinations ou 3 types de missions ? |
| 3 | Types de missions disponibles | Valider : Volontariat individuel / Groupe jeunes / Groupe entreprise / Service civique. |
| 4 | Crop images galerie | V1 : crop auto centre. V2 : outil recadrage dashboard. |

#### Bilan composants Figma

| Élément | Statut |
|---|---|
| Navbar | ✅ Terminé |
| Hero Home + Hero Page | ✅ Terminé |
| StatsBar | ✅ Terminé |
| Footer (Zone 1 + 2 + 3) | ✅ Terminé |
| AnchorNav | ✅ Terminé |
| FilterChips | ✅ Terminé |
| MissionCard | ✅ Terminé |
| LocationCard | ✅ Terminé |
| ActionCard | ✅ Terminé (révisé Jour 5) |
| TestimonialCard | ✅ Terminé |
| ContactForm | ✅ Terminé |
| TestimonialForm | ✅ Terminé |
| Button Primary + Secondary | ✅ Terminé |
| Badge ODD (17 variants) | ✅ Terminé Jour 5 |
| Tag (light + dark) | ✅ Terminé Jour 5 |
| Carousel Cards | ✅ Terminé Jour 5 |
| Carousel Gallery | ✅ Terminé Jour 5 |
| Sidebar admin | ⏳ À faire |
| DashboardTable | ⏳ À faire |
| DashboardForm | ⏳ À faire |
| ModerationCard | ⏳ À faire |

---

## Jour 6 · 4 juin 2026
### S2 — Assemblage page Accueil (complet)

#### Ce qui a été fait

**Correction et refonte ActionCard**
- Abandon du layout immersif au profit d'un layout horizontal : image paysage à gauche + content à droite.
- Badges ODD repositionnés sur l'image gauche en position absolue.
- Pays + icône pin ajoutés dans la zone Actions à gauche du bouton CTA.
- Composant reconstruit avec auto layout horizontal dès le départ.

**Carousel Cards — correction structure**
- Restructuration complète suite aux problèmes de débordement.
- Dimensions fixes : CarouselCards 1300px, Row 1300px, Track 1188px, cards 380px.

**Page Accueil — assemblage complet**
- Frame Home `<main>` 1440px — toutes sections assemblées dans l'ordre :
  1. Navbar transparente sur Hero immersif + StatsBar (4 compteurs)
  2. Section Missions — fond #F8F6F1 — grille 3+2+1 avec 6 MissionCards
  3. Section Témoignages — fond #143601 — Carousel Cards avec 3 témoignages
  4. Section Actions sur le terrain — fond #F8F6F1 — grille 2x2 avec 4 ActionCards
  5. Section Partenaires — fond #F8F6F1 — 18 logos placeholder + divider décoratif
  6. Footer complet

**Décisions prises**
- Navbar structure finale : Notre impact = lien direct + Actions éducatives = lien direct. Abandon du dropdown.
- Section Partenaires : fond #F8F6F1 retenu. Bouton 'En savoir plus →' vers page À propos.
- Pas de section CTA avant le Footer.
- Pas de section Actions éducatives sur l'Accueil.

#### Points à valider avec la cliente — RDV

| # | Sujet | Question / Décision attendue |
|---|---|---|
| 1 | Logo navbar version blanche | Fournir SVG ou PNG fond transparent — nécessaire pour navbar transparente. |
| 2 | Section Missions — affichage | 5 destinations ou 3 types de missions ? Recommandation : par destination. |
| 3 | Types de missions officiels | Valider : Volontariat individuel / Groupe jeunes / Groupe entreprise / Service civique. |
| 4 | Crop images galerie | V1 : crop auto centre. V2 : outil recadrage dashboard. |
| 5 | Couleur badge Service Civique | Distinguer visuellement du badge Volontariat. Suggestion : bleu #1D6FA4. |
| 6 | Logos partenaires | Fournir tous les logos SVG ou PNG fond transparent (18 logos). |

---


## Jour 7 · 8 juin 2026
### S3 — Début développement React — Composants de base + Layout global

#### Statut général

| Élément | Statut |
|---|---|
| Tailwind v4 — palette + typographie | ✅ Configuré via `@theme` dans `index.css` |
| Google Fonts — Lora + Source Sans 3 | ✅ Chargées dans `index.html` avec `preconnect` |
| Composant Button (Primary + Secondary) | ✅ Terminé — hover, majuscules, variants |
| Composant BadgeODD (17 variants) | ✅ Terminé — couleurs officielles ONU, style inline |
| Composant Navbar | ✅ Terminé — logo, liens, FR, chevrons, icône maison, underline actif |
| Composant Footer | ✅ Terminé — 3 zones, navigation 4 colonnes, barre légale |
| Composant Layout | ✅ Terminé — Navbar + Outlet + Footer via React Router |
| Composant Hero | ✅ Terminé — placeholder gris, titre, accroche, bouton CTA |
| Composant StatsBar | ✅ Terminé — 4 compteurs, fond primary, map() |
| Git — branche dev mise à jour | ✅ dev-front mergée dans dev + push |

#### Ce qui a été fait

**Configuration Tailwind v4**
- Palette complète ajoutée dans `@theme` de `index.css` : `primary`, `accent`, `accent-green`, `surface`, `surface-mid`, `surface-dark`
- Typographie ajoutée : `font-heading` (Lora), `font-body` (Source Sans 3)
- Google Fonts chargées dans `index.html` avec `preconnect`
- Noms sémantiques par rôle choisis — facilite les changements de palette si la cliente modifie la charte

**Composant Button**
- Deux variants : `primary` (terracotta #A44A2F) et `secondary` (vert foncé #143601)
- Objet `styles` pour les classes Tailwind par variant
- Hover : inversion fond/texte + bordure visible
- Classes fixes : `px-5 py-2.5 rounded font-body font-semibold uppercase tracking-wider transition-colors cursor-pointer`
- Leçon apprise : `className` pour les classes fixes, `style` inline pour les valeurs dynamiques

**Composant BadgeODD**
- 17 variants (1 à 17) — couleurs officielles ONU
- Prop `number` — valeur par défaut `1`
- Objet `colors` avec les 17 couleurs
- `style={{ backgroundColor: colors[number] }}` — couleur dynamique via style inline (Tailwind ne peut pas générer des classes dynamiques à la compilation)
- Taille `w-7 h-7`, texte `text-sm` blanc bold

**Composant Navbar**
- Logo avec cercle blanc semi-transparent (`bg-white/40 rounded-full`)
- Icône maison FaHome à la place du texte "Accueil"
- Liens navigation : `text-surface font-bold text-base` + `hover:text-accent`
- Chevrons FaChevronDown sur Nos missions, À propos et FR
- `useLocation` pour détecter la page active — underline + `underline-offset-4` sur le lien actif
- Fond `bg-transparent` — s'intègre sur le Hero immersif
- Bouton "FAIRE UN DON" — composant Button réutilisé
- react-icons installé : FaHome, FaChevronDown

**Composant Footer**
- Zone 1 — CTA immersif placeholder gris : titre h2, accroche, 2 boutons
- Zone 2 — Navigation 4 colonnes : logo + tagline + réseaux sociaux / Découvrir / S'engager / Nous contacter
- Zone 3 — Barre légale : copyright + liens légaux, fond #0F2108
- react-icons : FaYoutube, FaLinkedin, FaInstagram, FaFacebook, FaMapMarkerAlt, FaEnvelope
- Hover réseaux : `hover:text-accent-green`

**Composant Layout**
- `Outlet` React Router — injecte le contenu de chaque page entre Navbar et Footer
- Structure : `<Navbar />` + `<main><Outlet /></main>` + `<Footer />`
- App.jsx mis à jour — route `/` connectée à `<Home />`

**Composant Hero**
- Placeholder gris `bg-gray-400`, hauteur `h-screen`
- Surtitre, titre h1 (Lora bold text-6xl), accroche, bouton CTA
- Contenu aligné en bas à gauche : `items-end` + `px-16 pb-24`

**Composant StatsBar**
- 4 compteurs : 120+ Actions réalisées / 10 000+ Bénéficiaires / 20+ Ans d'expérience / 12 000+ Jeunes sensibilisés
- Données dans un tableau `stats[]` — rendu via `.map()`
- Fond `primary` (#143601) — chiffres et labels en `surface`
- `key` obligatoire sur chaque élément `.map()`

#### Décisions techniques & design

**Tailwind v4 — noms sémantiques**
- Noms par rôle (`primary`, `accent`) plutôt que noms de couleur (`vert-foret`, `terracotta`)
- Si la cliente change la palette, une seule ligne à modifier dans `index.css`

**BadgeODD — style inline pour couleurs dynamiques**
- Tailwind génère les classes à la compilation — impossible d'utiliser des classes dynamiques (`bg-[${color}]`)
- Solution : `style={{ backgroundColor: colors[number] }}` pour les valeurs qui changent selon les props

**StatsBar — fond primary**
- Déviation du Figma (prévu `surface-mid`) — fond `primary` retenu pour mieux séparer visuellement la StatsBar des sections adjacentes de même couleur beige

**react-icons**
- Librairie installée : `npm install react-icons`
- Préfixe `Fa` (Font Awesome) utilisé partout pour la cohérence

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| Boutons trop grands dans le test App.jsx | Ajouter `items-start` sur le conteneur flex parent |
| Tous les liens navbar soulignés | Condition `location.pathname === '/'` copiée sur tous les liens — corriger chaque pathname |

#### Structure fichiers créés aujourd'hui

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx      ✅
│   │   ├── Footer.jsx      ✅
│   │   ├── Layout.jsx      ✅
│   │   ├── Hero.jsx        ✅
│   │   └── StatsBar.jsx    ✅
│   └── ui/
│       ├── Button.jsx      ✅
│       └── BadgeODD.jsx    ✅
└── pages/
    └── Home.jsx            ✅
```

#### Notes & observations
- Tailwind v4 : pas de `tailwind.config.js` — configuration via `@theme` dans le CSS (différent des tutos en ligne qui montrent v3)
- `className` pour les classes fixes, `style` inline pour les valeurs dynamiques — règle à retenir
- `.map()` nécessite toujours une `key` unique sur chaque élément — React s'en sert pour optimiser le rendu
- `useLocation` de React Router — hook indispensable pour la navigation active
- react-icons : toujours utiliser le même préfixe (`Fa`) pour la cohérence visuelle

#### Prévu — Jour 8

- Section Missions (MissionCard + grille)
- Section Témoignages (TestimonialCard + Carousel)
- Section Actions terrain (ActionCard)
- Section Partenaires
- Mise à jour planning et documents de suivi

---

---

## Jour 8 · 9 juin 2026
### S3 — Page Accueil complète + Page Login admin

#### Statut général

| Élément | Statut |
|---|---|
| ActionCard.jsx | ✅ Créé — layout horizontal, badges ODD overlay, tags, CTA, pays |
| Section Actions terrain | ✅ Intégrée dans Home.jsx — grille 2 colonnes, 4 actions en dur |
| Section Partenaires | ✅ Intégrée dans Home.jsx — 18 logos, grille 6 colonnes, fond primary |
| Page Login admin | ✅ Créée — split layout image/formulaire, route /admin/login |
| Seed BDD (Alison) | ✅ Données de test insérées (missions, témoignages, admin) |
| Merge dev-front → dev | ✅ Effectué |

#### Ce qui a été fait

**Frontend — Gwen**

**Composants créés**
- `ActionCard.jsx` — layout horizontal image gauche + contenu droite. Badges ODD en overlay `absolute` sur l'image. Tags thématiques, bouton DÉCOUVRIR (terracotta), pays avec icône `FaMapMarkerAlt`. Hauteur fixe `h-[260px]`.
- Couleur badge `MissionCard` dynamique selon le type : `badgeColors` object, style inline. Service Civique → `#1D6FA4`, Volontariat individuel → `#2F8A3A`.

**Home.jsx — sections ajoutées**
- Section Actions terrain : 4 `ActionCard` en grille 2 colonnes, données réelles (Sri Lanka, Sénégal, Kenya).
- Section Partenaires : 18 logos dans `/images/partners/`, grille 6 colonnes, fond `primary`, texte `surface`. 

**Page Login admin**
- Fichier : `frontend/src/pages/admin/LoginAdmin.jsx`
- Layout split : image `hero_home.jpg` à gauche (50%), formulaire à droite (50%).
- Champs : Email + Mot de passe + Se souvenir de moi + bouton CTA + lien mot de passe oublié.
- Route `/admin/login` ajoutée dans `App.jsx` — hors `<Layout />` (pas de Navbar/Footer).
- Dossier `components/admin/` réservé aux composants du dashboard.

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| `LoginAdmin.jsx` introuvable — erreur Vite | Fichier créé dans `components/admin/` au lieu de `pages/admin/` — déplacé au bon endroit |
| Badge Service Civique même couleur que Volontariat | Ajout d'un objet `badgeColors` dans `MissionCard` — couleur dynamique via `style` inline |

#### Notes & observations
- `components/admin/` = composants réutilisables du dashboard (Sidebar, DashboardTable, etc.)
- `pages/admin/` = pages complètes admin (LoginAdmin, Dashboard, etc.)
- Les tableaux de données en dur (`missions`, `testimonials`, `actions`, `partners`) sont du mock data temporaire — à remplacer par des `fetch` API quand le seed BDD sera connecté
- Logos partenaires : tous en PNG fond dans `/images/partners/` — `jeunesse-sport.jpg` conservé en JPG (document officiel d'agrément, pas un logo)

**Backend — Alison**
- Seed BDD complet avec données réelles du site actuel
- 5 missions : Kenya, Sénégal, Pérou, Sri Lanka, Sumatra — avec tarifs réels (10j / 2sem / 3sem / 4sem)
- 5 villes : Voi, Ziguinchor, Puerto Maldonado, Kegalle, Bohorok
- 7 témoignages : 6 approuvés + 1 en attente de modération
- 1 compte admin fonctionnel (bcrypt + JWT)
- Nouveau champ `type` ajouté sur la table Mission — migration BDD effectuée
- Types disponibles : `faune_sauvage` · `developpement_communautaire` · `sante` · `education` · `environnement`
- API missions complète et testée :
  - `GET /api/missions` → liste avec pricing + lieu
  - `GET /api/missions?type=faune_sauvage` → filtre par type
  - `GET /api/missions?country=Kenya` → filtre par pays
  - `GET /api/missions/:slug` → détail complet (pricing + lieu + témoignages)
- CORS configuré pour `http://localhost:5173`

---

## Jour 9 · 10 juin 2026
### S3 — Connexion API + Page Missions

#### Statut général

| Élément | Statut |
|---|---|
| Connexion front ↔ back | ✅ Fonctionnelle |
| Page /missions — Volontariat individuel | ✅ Connectée à l'API |
| Page /missions — Service civique | ✅ Section custom avec destinations BDD |
| utils/missions.js | ✅ Créé — constantes partagées |
| Design tokens Tailwind | ✅ section-padding, section-header, section-title, section-subtitle |
| Migration BDD | ✅ short_description NOT NULL + description nullable |
| Seed BDD — missions service civique | ✅ 2 nouvelles missions ajoutées |
| Merge dev-front → dev | ⏳ À faire en fin de session |

#### Ce qui a été fait — Gwen

**Connexion front ↔ back**
- Création `frontend/src/services/api.js` — fonctions `fetchMissions()` et `fetchMissionBySlug()`
- Résolution erreur CORS — frontend doit tourner sur `localhost:5173` et non `127.0.0.1:5173`
- Résolution erreur Prisma — `dotenv/config` ajouté dans `server.js` et `seed.js`
- `npx prisma db push` pour synchroniser la BDD après migration manquante
- `npx prisma db seed` → `node prisma/seed.js` après ajout `dotenv/config`

**Page /missions**
- Création `HeroPage.jsx` — hero compact réutilisable pour toutes les pages intérieures
- Page `Missions.jsx` connectée à `GET /api/missions`
- 4 sections par type : Volontariat individuel (dynamique BDD) + Service civique (section custom) + Groupe jeune (à faire) + Congé solidaire (à faire)
- Section Service civique : layout custom avec infos, "Comment ça fonctionne ?" en 3 étapes, destinations dynamiques depuis BDD
- `COUNTRY_IMAGES` mapping pays → image locale (accents/espaces dans noms de pays)
- `getDuration()` — calcul fourchette de durée depuis le tableau pricing
- `TYPE_LABELS` — labels lisibles pour chaque type de mission

**BDD — migrations**
- `short_description` passé NOT NULL dans `schema.prisma`
- `description` passé nullable (`String?`)
- 2 nouvelles missions service civique seedées : `service-civique-kenya` + `service-civique-senegal`
- Pricing ajouté pour les 2 missions service civique (3 mois / 12 mois)

**Design system**
- Utilities Tailwind v4 ajoutées dans `index.css` : `section-padding`, `section-header`, `section-title`, `section-subtitle`
- Uniformisation des paddings et titres sur Home.jsx et Missions.jsx

**Composants modifiés**
- `MissionCard.jsx` — ajout props `ctaLabel` et `ctaUrl` pour CTA personnalisable (lien externe service civique)
- `Home.jsx` — connecté à l'API missions, suppression mock data missions

**Git**
- Commits du jour sur `dev-front` :
  - `fix: ajout dotenv/config dans server.js et seed.js + config seed dans prisma.config.ts`
  - `feat: connexion Home et Missions à l'API + utils/missions partagé + HeroPage + short_description BDD`
  - `style: uniformisation padding et titres de section Home et Missions`
  - `style: ajout utilities section-padding, section-header, section-title, section-subtitle dans index.css`
  - `feat: section service civique custom avec destinations BDD + MissionCard ctaLabel/ctaUrl`

#### Ce qui a été fait — Alison

- Test Docker complet : front sur `:5173`, back sur `:3000`
- Résolution bug `react-icons` manquant dans le conteneur Docker (`down -v` + rebuild)
- Re-seed BDD après vidage volume Docker
- Note : App.jsx modifié côté Alison avec placeholder route `/missions` — à vérifier au prochain pull

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| `SASL: client password must be a string` | `dotenv/config` manquant dans `server.js` et `seed.js` |
| CORS bloqué | Frontend sur `127.0.0.1:5173` au lieu de `localhost:5173` — toujours utiliser `localhost` |
| `Mission.type` colonne inexistante | `npx prisma db push` pour synchroniser après merge migration Alison |
| Port 3000 déjà occupé | `lsof -i :3000` + `kill PID` |
| `short_description` champ inconnu | Migration manquante — `npx prisma migrate dev` + `npx prisma generate` |
| Double section service civique | `service_civique` retiré du tableau `SECTIONS` — section gérée manuellement |

#### Notes & observations
- `npm run dev` frontend démarre sur `:5174` si Docker tourne déjà sur `:5173` — ne pas lancer les deux en même temps
- Routine quotidienne mise à jour : `routine-quotidienne.md` dans `/docs`
- `utils/missions.js` — pattern à reproduire pour d'autres entités (témoignages, actions...)
- Les sections Groupe jeune et Congé solidaire restent à construire demain

#### À faire demain
- Section Service civique : remplacer les emojis par des icônes React + redesign étapes + verif si les cards service civique sont sur la home (elle ne devrait pas)
- Sections Groupe jeune + Congé solidaire
- Vérifier App.jsx après pull Alison
- Page `/missions/:slug` (détail mission)

---

## Jour 9 — 11 juin 2026

### 🎯 Objectifs du jour
- Résoudre les problèmes d'infrastructure Docker
- Finaliser la page Missions (sections Groupe jeune, Congé solidaire)
- Connecter le login admin à l'API
- Démarrer la page détail mission `/missions/:slug`

---

### ✅ Réalisé

#### Infrastructure & Docker
- Résolution du problème Prisma Studio (port 5555 exposé dans docker-compose.yml)
- Suppression du volume `/app/node_modules` frontend pour corriger les dépendances manquantes (react-icons, swiper)
- Correction de la DATABASE_URL dans `.env` backend (`@postgres:5432`)
- Migration `add_how_to_go` appliquée avec succès
- Seed complet relancé — 9 missions, 20 pricings, 13 locations, 7 témoignages
- Ajout de `npx prisma generate` au démarrage dans le `package.json` backend
- Correction du port frontend fixé à 5173 dans `vite.config.js`
- Mise à jour de la routine quotidienne — suppression des `npm run dev` manuels

#### Composants UI
- `Carousel.jsx` → composant générique réutilisable (refacto de `TestimonialCarousel`)
- `SectionHero.jsx` → en-tête réutilisable avec prop `image` optionnelle (illustrations one-line)
- `SwiperCarousel` → renommé `Carousel`, centralisé dans `components/ui/`
- Illustrations one-line générées via Gemini (PNG fond transparent) — `one-line-1.png` et `one-line-2.png`

#### Page Missions (`/missions`)
- Section Volontariat individuel → carrousel Swiper 3 slides avec `Carousel`
- Section Service Civique → icônes et boutons centrés, liens lieux d'action
- Section Groupe jeune → layout 3 colonnes (texte / PDF mock / CTA), `SectionHero` avec illustration
- Section Congé solidaire → layout 2 colonnes (texte / CTA), lien france-volontaires.org
- `SectionHero` harmonisé sur toutes les sections avec illustrations alternées

#### Seed BDD
- Refacto du seed Kenya → pattern `kenyaData` (objet partagé update/create)
- Nouveau champ `how_to_go` ajouté au schéma Prisma (JSON stringifié, 7 étapes)
- Mise à jour complète des champs Kenya : `description`, `volunteer_role` (HTML riche), `programme`, `included`, `not_include`, `admin_info`, `health_info`
- 8 nouveaux lieux partenaires ajoutés : LUMO, TTNP, Elsa Conservation Trust, Diani Turtle Watch (Kenya), MEF (Sri Lanka), Amazon Shelter (Pérou), Batu Kapal (Sumatra), ONG AGADA (Sénégal)
- Slugs missions mis à jour : `volontariat-kenya` → `kenya`, etc.

#### Login Admin
- Connexion du formulaire à `POST /api/auth/login`
- Stockage du JWT en localStorage
- Redirection vers `/admin` après connexion réussie
- Page `Dashboard.jsx` temporaire créée

#### Page détail mission (`/missions/:slug`)
- Création de `MissionDetail.jsx` connectée à `GET /api/missions/:slug`
- Hero avec durée et prix
- Section accroche fixe
- Section description + accroche "De nombreux volontaires" + rôle (HTML riche)
- Section rôle + journée type côte à côte (1/2 chacun)
- Section coût & durée (tableau / inclus-non inclus / répartition frais) + CTA
- Section "Comment partir" (7 étapes avec icônes, données depuis `how_to_go`)
- Section infos pratiques (santé + à savoir + PDF placeholder)
- Section lieux partenaires (liste style Groupe jeune)
- Section témoignages (carrousel `Carousel` sur fond vert)
- `icons.js` enrichi avec les icônes "Comment partir"

#### Documentation
- `routine_quotidienne.md` mis à jour — suppression npm run dev, ajout avertissement Docker
- `Questions_Cliente.docx` — ajout questions témoignages (T1, T2) et congé solidaire (C6)

---

### 🔵 À faire demain
- Finaliser la mise en page de la page `/missions/kenya`
- Section "Comment partir" à afficher correctement
- Section lieux partenaires → vérifier le rendu
- Connecter les MissionCard de la home et de `/missions` vers `/missions/:slug`
- Page `/missions/:slug` pour les autres missions (Sénégal, Pérou, Sri Lanka, Sumatra)
- Dashboard admin (structure, Sidebar, routes protégées)

---

### ⚠️ Points d'attention
- Prisma Studio non fonctionnel dans Docker (bug v7) → utiliser `docker compose exec postgres psql -U postgres -d sensolidaire` pour accéder aux données directement
- Ne jamais lancer `npm run dev` manuellement quand Docker est en route
- Le champ `volunteer_role` est maintenant en HTML — prévoir un éditeur WYSIWYG dans le dashboard

--- 

### 🔍 Investigation — Prisma Studio
Prisma Studio affichait l'erreur "Could not load schema metadata" malgré son lancement sur le port 5555.
Après vérification :
- les conteneurs Docker fonctionnent correctement
- PostgreSQL démarre sans erreur
- les tables sont présentes dans la base
- les données sont accessibles via `psql`
- `npx prisma db pull` fonctionne et Prisma parvient à introspecter la base

Conclusion : le problème semble provenir de Prisma Studio lui-même et non de la base de données ou de Docker.

Solution retenue : utiliser directement PostgreSQL via :
```bash
docker compose exec postgres psql -U postgres -d sensolidaire
```
pour consulter et vérifier les données.

---

## Jour 10 — 12 juin 2026

### 🎯 Objectifs du jour
- Finaliser MissionDetail.jsx toutes sections
- Mettre à jour le seed de toutes les missions
- Harmoniser les styles sur toutes les pages
- Ajouter la navigation (AnchorNav, FilterChips, dropdown Navbar)

### ✅ Réalisé

#### MissionDetail.jsx
- Toutes les sections finalisées : Description, Rôle & Programme, Lieux, Impact, Coût & durée, Comment partir, Infos pratiques, Témoignages, Galerie
- AnchorNav intégrée avec variant dark
- Système de grille 3 colonnes pour Coût & durée
- Illustration one-line ajoutée sur section Lieux partenaires
- Harmonisation complète des styles (typographie, opacités, espacements)

#### Seed BDD
- Pattern xxxData appliqué sur toutes les missions
- Contenu supplémentaire du site actuel intégré : Sénégal, Pérou, Sri Lanka, Sumatra
- Champ image_url ajouté sur table Location (migration)
- Champ ministry_url ajouté sur toutes les missions volontariat

#### Nouveaux composants
- LocationCard.jsx — card lieu réutilisable (Missions + MissionDetail)
- FilterChips.jsx — puces filtrantes avec variant light/dark
- AnchorNav.jsx — barre d'ancrage sticky avec variant light/dark

#### Navigation
- Navbar — dropdown "Nos missions" au survol avec liens vers les 5 destinations
- Page Missions — FilterChips par type de mission (variant dark)
- MissionDetail — AnchorNav sticky sous le Hero

#### Carousel
- Navigation conditionnelle — chevrons et dots masqués si items ≤ slidesPerView

#### Guide de style
- guide-style.md créé dans /docs — référence complète du design system

### 🔵 À faire
- Dashboard admin (Sidebar, routes protégées, DashboardTable)
- Page /lieux/:slug
- Responsive mobile

### ⚠️ Points d'attention
- react-scroll incompatible React 19 — utiliser smoothScrollTo custom ou window.scrollTo behavior smooth
- Couleurs dynamiques → toujours style={{}} inline en Tailwind v4

---

---

## Jour 9 · 10 juin 2026
### S3/S4 — Intégration & débogage de la stack complète (front + back + Docker)

#### Statut général

| Élément | Statut |
|---|---|
| Backend — `npx prisma generate` | ✅ Débloqué — Prisma Client v7.8.0 généré |
| Backend — API missions | ✅ `GET /api/missions` retourne les 5 missions (JSON vérifié) |
| Frontend — route `/missions` | ✅ Créée et branchée dans `App.jsx` (sous `<Layout />`) |
| Frontend — placeholder `Missions.jsx` | ✅ Créé temporairement (en attente du travail front de Gwen) |
| Docker — 3 conteneurs | ✅ postgres healthy + backend + frontend relancés |
| Docker — dépendance `react-icons` | ✅ Réinstallée dans le conteneur après purge du volume |
| BDD — migrations + seed | ✅ Régénérées après `down -v` (2 migrations + seed complet) |
| Stack complète | ✅ Front (`:5173`) affiche correctement, back (`:3000`) répond |

#### Ce qui a été fait

**Backend — Alison**

**Déblocage `npx prisma generate`**
- Erreur au lancement : `Cannot find module 'dotenv/config'` chargé par `prisma.config.ts`
- Cause : Prisma v7 ne charge plus le `.env` automatiquement — le package `dotenv` est requis explicitement mais n'était pas installé
- Solution : `npm install dotenv` — Prisma Client v7.8.0 généré ensuite sans erreur
- `prisma.config.ts` validé : structure correcte (`import "dotenv/config"` + `env("DATABASE_URL")`)

**Vérification API**
- `GET http://localhost:3000/api/missions` → JSON avec les 5 missions confirmé
- `Cannot GET /` sur la racine = comportement normal (l'API n'a pas de route `/`, seulement `/api/...`)

**Frontend — Alison (avec accord de Gwen sur le périmètre)**

**Route `/missions` manquante**
- Symptôme : page blanche sur `/missions`, console → `No routes matched location "/missions"`
- Cause : aucune `<Route path="/missions">` déclarée dans `App.jsx` ; le fichier `Missions.jsx` n'existait pas
- Coordination : message envoyé à Gwen avant toute modification — elle confirme ne pas avoir commencé la page → feu vert pour un placeholder temporaire
- Solution : création de `frontend/src/pages/Missions.jsx` (placeholder) + import + `<Route path="/missions">` ajoutée **à l'intérieur** du bloc `<Layout />` (page publique → hérite de Navbar + Footer)

**Docker — Alison**

**Conflit de ports front (5173 vs 5174)**
- Constat : `npm run dev` manuel basculait sur `:5174` car `:5173` déjà occupé
- Cause : le conteneur `sensolidaire_frontend` tournait déjà sur `:5173` (front Docker) — deux fronts tournaient en parallèle sans le savoir
- Solution : arrêt du `npm run dev` manuel, utilisation exclusive du front Docker sur `:5173` (aligné avec la config CORS du back qui autorise `:5173`)

**Dépendance `react-icons` absente du conteneur**
- Symptôme : `Failed to resolve import "react-icons/fa"` depuis `ActionCard.jsx`
- Vérifications : `react-icons` bien présent dans `package.json` ✅ mais absent de `node_modules` du conteneur (`ls node_modules/react-icons` → No such file)
- Cause : le volume anonyme `/app/node_modules` (créé 11 jours plus tôt) recouvrait le `node_modules` de l'image fraîche, même après `--build`
- Solution : `docker-compose down -v` (purge des volumes) + `docker-compose up -d --build` → `node_modules` recréé proprement, `react-icons` installé (dossier `fa` présent)

**BDD régénérée après purge**
- `down -v` ayant supprimé le volume `postgres_data`, la base a été reconstruite :
  - `docker-compose exec backend npx prisma migrate deploy` → 2 migrations appliquées (`init` + `add_mission_type`)
  - `docker-compose exec backend node prisma/seed.js` → admin + 5 missions + 14 pricing + 5 locations + 7 témoignages réinjectés

#### Erreurs rencontrées & solutions

| Erreur | Solution appliquée |
|---|---|
| `Cannot find module 'dotenv/config'` (prisma.config.ts) | `npm install dotenv` — Prisma v7 ne charge plus le `.env` automatiquement |
| `vite: not found` (frontend) | `npm install` — `node_modules` non versionné, absent après le merge |
| `No routes matched location "/missions"` | Création de `Missions.jsx` + déclaration de la route dans `App.jsx` |
| Page blanche après ajout de la route | Commentaire `/* */` non fermé dans `App.jsx` avalait tout le fichier — remplacé par `//` |
| Page toujours blanche / route non prise en compte | `App.jsx` non sauvegardé (`Ctrl+S` oublié) — Vite recharge sur le fichier sauvegardé |
| `Failed to resolve import "react-icons/fa"` | Volume anonyme `node_modules` périmé — `docker-compose down -v` + rebuild |
| Port front sur `:5174` au lieu de `:5173` | Front Docker occupait déjà `:5173` — arrêt du `npm run dev` manuel |

#### Notes & observations
- Prisma v7 ne charge plus le `.env` tout seul : `dotenv` doit être installé et déclaré dans `dependencies` (sinon erreur de chargement de `prisma.config.ts`)
- Après un `git merge`, réflexe systématique : `npm install` (front comme back) car `node_modules` n'est pas versionné
- L'API back n'est pas un site web : tester sur `/api/...`, jamais sur `/` (qui renvoie `Cannot GET /`)
- Le front du projet tourne **dans Docker sur `:5173`** — pas besoin de lancer `npm run dev` à la main (cela crée un doublon sur `:5174`)
- Piège Docker : `--build` reconstruit l'image mais **ne purge pas les volumes anonymes** — pour rafraîchir `node_modules` dans le conteneur, il faut `down -v` puis rebuild
- `down -v` supprime aussi le volume `postgres_data` (la BDD) → toujours re-`migrate deploy` + re-`seed` ensuite
- Dans un conteneur, utiliser `migrate deploy` (non interactif) plutôt que `migrate dev`
- Commentaires JS : préférer `//` pour une ligne — un `/*` non fermé casse tout le fichier
- Réflexe de debug : toujours **vérifier** (console F12, `ls`, `package.json`) avant de supposer la cause

#### Coordination équipe
- Le placeholder `Missions.jsx` est **temporaire** — la vraie page Missions (hero, filtres type/pays/durée, carte, MissionCards) reste dans le périmètre de Gwen
- La couche service front (`services/missionsService.js` + variable `VITE_API_URL`) n'existe pas encore → l'affichage réel des missions dans le front (test front↔API de bout en bout) est en attente de cette couche

#### Points à surveiller (dette technique)
- Conteneur back en `node:20-alpine` alors qu'un sous-package Prisma v7 (`@prisma/streams-local`) recommande Node ≥ 22 (warning `EBADENGINE`, non bloquant aujourd'hui)
- `3 moderate severity vulnerabilities` signalées par npm — à inspecter via `npm audit` (sans `--force`)
- Gestion de `node_modules` dans Docker avec hot-reload fragile (volume anonyme) — à revoir après la deadline

#### Prévu — Jour 10
- S4 — CRUD admin missions (routes protégées : create / update / delete)
- S4 — CRUD admin témoignages (modération : approuver / refuser / toggle homepage)

## Jour 13 · 14 juin 2026
### S4 — CRUD admin missions (Create / Update / Delete) + incident base de données

#### Statut général

| Élément | Statut |
|---|---|
| `POST /api/admin/missions` (create) | ✅ Écrit + testé (201 / 401 / 400 / 409) |
| `PATCH /api/admin/missions/:id` (update partiel) | ✅ Écrit + testé (200 / 404) |
| `DELETE /api/admin/missions/:id` (soft delete) | ✅ Écrit + testé (200 / 404) |
| `findBySlug` aligné sur `is_active` | ✅ Corrigé (`findUnique` → `findFirst`) |
| `errorHandler` transmet `err.code` | ✅ Corrigé |
| `VALID_TYPES` aligné sur la taxonomie réelle | ✅ (provisoire — à valider cliente) |
| Migration bloquée `make_short_description_required` | ✅ Réparée (backfill + resolve) |
| Doublons missions en base (anciens slugs) | ✅ Nettoyés (9 missions propres) |
| Tests automatisés Jest + Supertest | ✅ Fichier créé (`tests/missions.admin.test.js`) |

#### Ce qui a été fait

**Backend — Alison**

**CRUD admin missions complet**
- `create` (service) + `createMission` (controller) : whitelist explicite anti mass-assignment, validation type/slug/country réutilisant les constantes existantes, message d'erreur précisant le champ manquant, code `SLUG_TAKEN` sur slug dupliqué (409).
- `update` (service) + `updateMission` (controller) : choix **PATCH** (modification partielle) — seuls les champs fournis sont mis à jour, ciblage par `id`, 404 (`MISSION_NOT_FOUND`) si l'id n'existe pas.
- `softDelete` (service) + `deleteMission` (controller) : **soft delete** (`is_active = false`) plutôt que suppression réelle → réversible, traçable, évite la gestion en cascade des relations.
- Routeur admin : `router.post / patch / delete` montés derrière `authMiddleware` (porte gardée en amont).

**Corrections transverses**
- `errorHandler` : ajout de `...(err.code && { code: err.code })` pour transmettre le code métier au front.
- `findBySlug` : passé de `findUnique` à `findFirst` + `is_active: true` → une mission soft-deletée disparaît aussi du détail public (et plus seulement de la liste).
- `VALID_TYPES` : remplacé les anciens types périmés (`faune_sauvage`...) par la taxonomie réelle du seed (`volontariat_individuel`, `service_civique`, `groupe_jeunes`, `conge_solidaire`).
- Seed enrichi : 9 missions (ajout service civique Kenya/Sénégal, groupe jeunes, congé solidaire).

#### Erreurs rencontrées & solutions

| Erreur | Cause | Solution |
|---|---|---|
| `P3018` migration bloquée | `short_description` passée en NOT NULL alors que des lignes existantes étaient `null` (étape backfill manquante) | `UPDATE` de backfill + `prisma migrate resolve --rolled-back` + `migrate deploy` |
| Doublons de missions (id 1-5 vs 6-14) | `upsert` cherche par `slug` ; les anciens slugs différaient → branche `create` au lieu de `update` | Suppression ordonnée enfants → parents (pricing, location, testimonial puis mission) |
| `SyntaxError: Identifier 'findAll' has already been declared` | Double ligne d'`import` dans `missionController.js` | Garder un seul import |
| `ReferenceError: updateMission is not defined` | Route ajoutée mais fonction non importée dans le routeur | Ajouter l'import |
| `does not provide an export named 'deleteMisson'` | Typo : `deleteMisson` au lieu de `deleteMission` | Corriger l'orthographe |
| `socket hang up` / `connection reset` (Postman + curl) | Serveur crashé au démarrage (les erreurs ci-dessus) → rien n'écoute sur 3000 | Lire `docker-compose logs backend` → corriger → nodemon relance |

#### Notes & observations
- Réflexe clé acquis : devant un serveur qui « ne répond pas », **lire les logs Docker en premier** — ils donnent fichier + ligne + raison.
- Soft delete déjà à moitié en place : `findAll` filtrait déjà `is_active = true`. Restait à créer la route qui bascule le flag + corriger `findBySlug`.
- Sécurité : ne jamais partager un token JWT (clé d'accès temporaire). Un JWT est encodé, pas chiffré.

#### Décisions techniques
- **PATCH** retenu pour l'update (vs PUT) : plus adapté à un dashboard d'édition (modification champ par champ, pas de risque d'écraser un champ non renvoyé).
- **Soft delete** retenu pour les missions (vs hard delete) : réversibilité + traçabilité, coût de stockage négligeable à cette échelle. (Note : pour les **témoignages**, prévoir un vrai hard delete possible — données personnelles, RGPD.)

#### Dette technique notée (à traiter plus tard)
- `authMiddleware` valide le token mais ne vérifie **pas** `role === 'admin'` (OK aujourd'hui car système admin-only, à durcir si d'autres rôles arrivent → 403).
- `schema.prisma` : `type @default("faune_sauvage")` périmé → corriger par migration.
- `VALID_TYPES` à confirmer avec la cliente (question C2 du doc cliente).

#### Prochaines étapes
- `GET /api/admin/missions` (l'admin doit voir TOUTES les missions, actives + inactives, pour les rééditer/réactiver).
- CRUD admin témoignages (avec gestion RGPD du droit à l'oubli).
*Journal de bord — Sens Solidaire · Holberton School Thonon-les-Bains | À compléter chaque jour de développement.*

## Jour 14 · 22 juin 2026
### S4 — Modération des témoignages (back) : lecture + approve / reject

#### Statut général

| Élément | Statut |
|---|---|
| `GET /api/admin/testimonials` (+ filtre `?status=`) | ✅ Écrit + testé (200 / 400 / 401) |
| `PATCH /api/admin/testimonials/:id/approve` | ✅ Écrit + testé (200 / 404 / 400) |
| `PATCH /api/admin/testimonials/:id/reject` | ✅ Écrit + testé (200 / 404 / 400) |
| Règle métier RGPD : refus → `show_homepage = false` | ✅ Implémentée + vérifiée |
| Routeur témoignages monté derrière `authMiddleware` | ✅ (porte gardée en amont) |
| Branchement dans `app.js` (`/api/admin/testimonials`) | ✅ |
| Runbook de tests Postman autonome | ✅ Créé |
| Test 401 (sans token) sur route de modération | ⏳ À reconfirmer |

#### Ce qui a été fait

**Backend — Alison**

**Lecture admin des témoignages**
- `findAllForAdmin` (service) + `getTestimonials` (controller) : renvoie **tous** les statuts (l'admin doit voir pending/approved/rejected pour modérer), filtre `?status=` optionnel validé contre une **whitelist** (`pending` / `approved` / `rejected`), `include` de la mission (`id` + `title` uniquement), tri `created_at asc` (file FIFO).

**Modération (approve / reject)**
- `updateStatus(id, status)` (service) : fonction **générique** unique pour les deux actions ; catch du `P2025` → 404 `TESTIMONIAL_NOT_FOUND` (même pattern que `missionService`). Règle métier : si `status === "rejected"`, force `show_homepage = false`.
- `approveTestimonial` / `rejectTestimonial` (controller) : statut codé **EN DUR** (`"approved"` / `"rejected"`) — le client choisit la route, jamais la valeur. `req.body` n'est jamais lu. Validation d'id reprise de `updateMission` (`Number.isInteger`).
- Routeur `adminTestimonialRoutes.js` séparé (un fichier par ressource), `router.use(authMiddleware)`.

#### Erreurs rencontrées & solutions

| Erreur | Cause | Solution |
|---|---|---|
| `socket hang up` (Postman) | Serveur crashé au démarrage → rien n'écoute sur 3000 | Lire `docker-compose logs backend` en premier |
| `does not provide an export named 'approveTestimonial'` | Fonctions non collées dans le controller **+** import au pluriel (`approveTestimonialS`) dans le routeur | Coller les fonctions + aligner les noms au caractère près (singulier) |
| `Cannot GET /.../approve` (404) | Mauvais **verbe HTTP** dans Postman (GET au lieu de PATCH) | Lire le verbe dans le message d'erreur, le corriger |
| `updateStatus is not defined` (500) | Import du service incomplet dans le controller | Ajouter `updateStatus` à l'import |

#### Notes & observations
- Réflexe consolidé : `X is not defined` = import oublié **ou** faute de frappe sur le nom ; `Cannot GET/POST` = vérifier le **verbe** ou l'**URL** avant de douter du code.
- La file `?status=pending` qui se vide après un approve est la **preuve** que l'écriture en base a bien eu lieu (et non un simple succès de façade).
- Un témoignage peut avoir `mission_id = null` (cas valide) → `mission` revient `null` ; à gérer au front (« Mission non précisée »).

#### Décisions techniques
- **Statut en dur** côté controller (vs `req.body.status`) : verrouille la valeur, empêche l'injection d'un statut arbitraire en base.
- **`consent_given` jamais modifié** lors d'une modération : c'est le consentement RGPD de la personne, pas une décision admin.
- **`updateStatus` générique** (DRY) plutôt que deux fonctions de service dupliquées.
- **Catch `P2025`** plutôt que `findUnique` préalable : une seule requête, pas de race condition (cohérent avec `softDelete` des missions).
- **Un fichier de routes par ressource** (`adminTestimonialRoutes` distinct de `adminMissionRoutes`).

#### Dette technique notée (à traiter plus tard)
- `authMiddleware` ne vérifie toujours pas `role === 'admin'` (OK en admin-only, à durcir → 403 si d'autres rôles arrivent).
- `schema.prisma` : `type @default("faune_sauvage")` périmé → migration.
- `VALID_TYPES` à confirmer avec la cliente.
- Tests Jest + Supertest (témoignages compris) : setup ESM + vraie DB encore à faire.

#### Prochaines étapes
- `GET /api/admin/missions` (lister toutes les missions, actives + inactives, pour la table du dashboard).
- `POST /api/testimonials` **public** (formulaire visiteur) : création en `pending`, refus 400 si `consent_given` absent/false (RGPD).
- **Front du dashboard** minimaliste (route protégée, layout, page modération, page missions) — **à coordonner avec Gwen** (branche `dev-front`).
- Reconfirmer le test 401 sur une route de modération ; re-seed avant démo (état propre).

*Journal de bord — Sens Solidaire · Holberton School Thonon-les-Bains | À compléter chaque jour de développement.*