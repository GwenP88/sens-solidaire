// ============================================================
// prisma/seed.js
// ============================================================
// Rôle : créer (ou resynchroniser) le compte admin. Rien d'autre.
//
// Tous les contenus (missions, lieux, délégations, témoignages, équipe,
// partenaires, rapports, actions terrain, articles, éducation) sont gérés
// via le dashboard ou le flux de soumission : un reseed n'y touche jamais.
//
// Exécution (depuis la racine du projet) :
//   docker-compose exec backend node prisma/seed.js
// ============================================================

import "dotenv/config"
import bcrypt from "bcrypt"
import prisma from "../src/config/db.js"

const seed = async () => {
  console.log("Démarrage du seed...")

  // ============================================================
  // ADMIN
  // ============================================================

  const password_hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

  const admin = await prisma.admin.upsert({
    where: { email: "admin@sensolidaire.org" },
    update: { password_hash },   // ← synchronise le hash à chaque relance du seed
    create: {
      email: "admin@sensolidaire.org",
      password_hash,
      role: "admin"
    }
  })
  console.log(`Admin : ${admin.email}`)

  // ============================================================
  // RÉCAP FINAL
  // ============================================================
  console.log("")
  console.log("Seed terminé avec succès !")
  console.log("─────────────────────────────────────────")
  console.log(`Admin              : admin@sensolidaire.org`)
  console.log(`Password           : ${process.env.ADMIN_PASSWORD}`)
  console.log("─────────────────────────────────────────")
  console.log("Tous les contenus sont gérés via le dashboard / le flux de soumission, jamais par ce seed.")
  console.log("⚠️  Changer le mot de passe admin AVANT la mise en production !")
}

seed()
  .catch((error) => {
    console.error("Erreur seed :", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })