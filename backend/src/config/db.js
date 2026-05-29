// src/config/db.js
// Instance unique de Prisma Client partagée dans toute l'application
// Prisma v7 utilise le nouveau "client engine" qui nécessite un adaptateur pg
// @prisma/adapter-pg fait le lien entre Prisma et PostgreSQL

// Import du package pg pour créer le pool de connexions
import pg from "pg"

// Import de l'adaptateur Prisma pour pg
import { PrismaPg } from "@prisma/adapter-pg"

// Import du package Prisma Client
import pkg from "@prisma/client"
const { PrismaClient } = pkg

// Création du pool de connexions PostgreSQL
// Le pool gère plusieurs connexions simultanées efficacement
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

// Création de l'adaptateur qui connecte Prisma au pool pg
const adapter = new PrismaPg(pool)

// Création de l'instance Prisma avec l'adaptateur
const prisma = new PrismaClient({ adapter })

export default prisma
