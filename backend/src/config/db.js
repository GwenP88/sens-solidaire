// src/config/db.js
// Instance unique de Prisma Client partagée dans toute l'application
// Importé dans tous les services qui ont besoin d'accéder à la base de données

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default prisma
