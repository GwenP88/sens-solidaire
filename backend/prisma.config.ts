// prisma.config.ts
// Fichier de configuration Prisma v7
// Gère la connexion à PostgreSQL et charge les variables d'environnement

import { defineConfig, env } from "prisma/config"  // Helpers officiels Prisma v7

export default defineConfig({
  // Chemin vers le schéma Prisma
  schema: "prisma/schema.prisma",

  // Dossier où seront stockées les migrations
  migrations: {
    path: "prisma/migrations",
    seed: "node ./prisma/seed.js",
  },

// Connexion utilisée par les commandes prisma migrate / studio.
  // Compte PROPRIÉTAIRE : lui seul peut créer et modifier des tables.
  // L'application, elle, passe par src/config/db.js avec DATABASE_URL.
  //
  // On lit process.env directement plutôt que le helper env() de Prisma :
  // env() lève une erreur si la variable est absente, ce qui casse le
  // `npx prisma generate` du Dockerfile — cette commande ne se connecte à
  // rien, elle ne fait que générer le client à partir du schéma, et aucune
  // variable d'environnement n'existe au moment du build de l'image.
  datasource: {
    url: process.env.MIGRATE_DATABASE_URL ?? process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
})
