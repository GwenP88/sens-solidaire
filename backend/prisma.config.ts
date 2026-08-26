// prisma.config.ts
// Fichier de configuration Prisma v7
// Gère la connexion à PostgreSQL et charge les variables d'environnement

import "dotenv/config"                        // Charge automatiquement le fichier .env
import { defineConfig, env } from "prisma/config"  // Helpers officiels Prisma v7

export default defineConfig({
  // Chemin vers le schéma Prisma
  schema: "prisma/schema.prisma",

  // Dossier où seront stockées les migrations
  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/seed.js",
  },

  // Connexion à la base de données pour les MIGRATIONS uniquement.
  // Séparation des droits (voir prisma/roles.sql) :
  //   - prisma.config.ts (ici)  → migrations → compte propriétaire (sensolidaire_owner)
  //   - src/config/db.js        → runtime API → compte applicatif  (sensolidaire_app, DATABASE_URL)
  datasource: {
    url: env("MIGRATE_DATABASE_URL"),
  },
})