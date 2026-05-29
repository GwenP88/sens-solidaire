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
  },

  // Connexion à la base de données — lit DATABASE_URL dans le .env
  datasource: {
    url: env("DATABASE_URL"),
  },
})