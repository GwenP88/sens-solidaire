# Backend — Sens Solidaires

API REST du site Sens Solidaires. Gère l'authentification admin, les missions, les témoignages, les actions terrain et l'ensemble des contenus consommés par le frontend.

## Stack

| Élément        | Technologie                                 |
| ---------------- | ------------------------------------------- |
| Runtime          | Node.js (ESM —`"type": "module"`)        |
| Framework        | Express 5                                   |
| ORM              | Prisma 7 (adaptateur`@prisma/adapter-pg`) |
| Base de données | PostgreSQL                                  |
| Authentification | JWT (`jsonwebtoken`) + `bcrypt`         |
| Sécurité HTTP  | `helmet`, `cors`, `cookie-parser`     |
| Emails           | `resend`                                  |
| Tests            | Jest + Supertest                            |

## Scripts disponibles

| Commande         | Rôle                                                           |
| ---------------- | --------------------------------------------------------------- |
| `npm run dev`  | Démarre le serveur avec rechargement automatique (`nodemon`) |
| `npm start`    | Démarre le serveur en mode production (sans rechargement)      |
| `npm test`     | Lance les tests Jest + Supertest                                |
| `npm run seed` | Remplit la base avec les données de test (`prisma/seed.js`)  |

> En développement, ces commandes s'exécutent **dans le conteneur Docker** (`docker exec sensolidaire_backend npm run dev`), jamais directement sur la machine hôte.

## Structure des dossiers

```
backend/
├── src/
│   ├── routes/          # Définition des endpoints (un fichier par ressource)
│   ├── controllers/     # Validation des entrées + formatage des réponses
│   ├── services/        # Logique métier + requêtes Prisma
│   ├── middlewares/     # authMiddleware (vérification JWT)
│   ├── utils/           # Fonctions JWT (generate/verify tokens)
│   ├── config/          # Connexion Prisma (instance unique)
│   ├── app.js           # Configuration Express (middlewares globaux, montage des routes)
│   └── server.js        # Point d'entrée — démarre le serveur HTTP
├── prisma/
│   ├── schema.prisma     # Schéma de base de données
│   ├── migrations/       # Historique des migrations SQL
│   └── seed.js           # Données de test
├── tests/                # Tests Jest + Supertest
├── prisma.config.ts      # Configuration Prisma v7 (connexion, chemin migrations)
└── Dockerfile
```

## Convention d'architecture — séparation des couches

Chaque ressource suit strictement ce découpage, dans cet ordre de responsabilité :

1. **Route** — associe une URL + un verbe HTTP à une fonction du controller
2. **Controller** — extrait et valide les données de la requête, appelle le service, formate la réponse JSON. **Aucune logique métier ici.**
3. **Service** — contient la vraie logique métier et les appels Prisma

## Endpoints principaux

### Routes publiques (sans authentification)

| Méthode | Route                     | Rôle                                                                   |
| -------- | ------------------------- | ----------------------------------------------------------------------- |
| GET      | `/api/health`           | Vérifie que le serveur répond                                         |
| GET      | `/api/missions`         | Liste des missions (filtres`?type=` et `?country=`)                 |
| GET      | `/api/missions/:slug`   | Détail d'une mission (tarifs, lieux, témoignages, médias)            |
| GET      | `/api/locations/:slug`  | Détail d'un lieu partenaire                                            |
| GET      | `/api/testimonials`     | Témoignages validés                                                   |
| POST     | `/api/testimonials`     | Soumission d'un témoignage (statut`pending`, RGPD requis)            |
| GET      | `/api/team-members`     | Membres de l'équipe (filtre`?category=`)                             |
| GET      | `/api/delegations`      | Délégations internationales                                           |
| GET      | `/api/activity-reports` | Rapports d'activité annuels                                            |
| GET      | `/api/mission-reports`  | Rapports de mission (filtres`?type=`, `?destination=`, `?annee=`) |
| GET      | `/api/partners`         | Partenaires (logos)                                                     |
| POST     | `/api/contact`          | Envoi du formulaire de contact (Resend)                                 |
| POST     | `/api/auth/login`       | Connexion admin — retourne un access token                             |
| POST     | `/api/auth/refresh`     | Renouvelle l'access token via le cookie refresh                         |

### Routes admin (protégées par `authMiddleware`)

| Méthode | Route                                   | Rôle                                           |
| -------- | --------------------------------------- | ----------------------------------------------- |
| POST     | `/api/auth/logout`                    | Déconnexion — révoque la session             |
| GET      | `/api/auth/verify`                    | Vérifie la validité du token courant          |
| GET      | `/api/admin/missions`                 | Liste toutes les missions (actives + inactives) |
| POST     | `/api/admin/missions`                 | Création d'une mission                         |
| PATCH    | `/api/admin/missions/:id`             | Modification partielle d'une mission            |
| DELETE   | `/api/admin/missions/:id`             | Suppression (soft delete)                       |
| PUT      | `/api/admin/missions/:id/pricing`     | Remplace les tarifs d'une mission               |
| PUT      | `/api/admin/missions/:id/media`       | Remplace la galerie/le PDF d'une mission        |
| GET      | `/api/admin/testimonials`             | Liste des témoignages (filtre`?status=`)     |
| PATCH    | `/api/admin/testimonials/:id/approve` | Valide un témoignage                           |
| PATCH    | `/api/admin/testimonials/:id/reject`  | Refuse un témoignage (retire de la home)       |
| DELETE   | `/api/admin/testimonials/:id`         | Suppression définitive (droit à l'oubli RGPD) |

## Authentification

- **Access token** : courte durée, transmis dans le header `Authorization: Bearer`
- **Refresh token** : longue durée, stocké en cookie **HTTP-only** (inaccessible en JavaScript, protection anti-XSS)
- Le refresh token est **hashé** avant stockage en base — jamais conservé en clair
- Toute route `/api/admin/*` passe par `authMiddleware`, qui vérifie le token avant d'exécuter le controller

## Gestion des erreurs

Toutes les routes suivent la même convention de réponse :

| Statut HTTP | Signification                                        | Exemple de code métier                          |
| ----------- | ---------------------------------------------------- | ------------------------------------------------ |
| 400         | Requête invalide (champ manquant, format incorrect) | —                                               |
| 401         | Token absent ou invalide                             | —                                               |
| 404         | Ressource introuvable                                | `MISSION_NOT_FOUND`, `TESTIMONIAL_NOT_FOUND` |
| 409         | Conflit (ex : slug déjà utilisé)                  | `SLUG_TAKEN`                                   |

Le `errorHandler` global transmet le `code` métier au frontend (`{ error: true, message, code }`) — permet au frontend de réagir différemment selon le type d'erreur plutôt que de parser un message texte.

## Base de données — commandes Prisma

```bash
# Créer une nouvelle migration après modification du schema.prisma
docker exec sensolidaire_backend npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations existantes (déploiement, autre machine)
docker exec sensolidaire_backend npx prisma migrate deploy

# Régénérer le client Prisma (obligatoire après chaque migration)
docker exec sensolidaire_backend npx prisma generate

# Peupler la base avec les données de test
docker exec sensolidaire_backend npm run seed
```

> **Prisma Studio non fonctionnel dans ce projet Docker** (bug connu Prisma v7). Pour consulter les données directement :
>
> ```bash
> docker compose exec postgres psql -U postgres -d sensolidaire
> ```

## Variables d'environnement

Voir [`.env.example`](./.env.example) à la racine du dossier `backend/`. Copier vers `.env` et adapter les valeurs avant de lancer le projet.

## Tests

```bash
docker exec sensolidaire_backend npm test
```

Couvre le CRUD admin missions et la modération des témoignages (voir le [README racine](../README.md#tests) pour le détail complet).
