// ============================================================
// prisma/seed.js
// ============================================================
// Rôle : peupler la base de données avec des données de test
//        pour la démo MR — version allégée
//
// VERSION TEMPORAIRE — seul l'admin est créé ici.
//    Missions Kenya + Sénégal à créer manuellement via le dashboard.
//    Les autres sections (délégations, témoignages, field actions...)
//    seront réintégrées une fois les IDs de missions récupérés.
//
// Exécution (depuis la racine du projet) :
//   docker-compose exec backend node prisma/seed.js
// ============================================================

import "dotenv/config"
import bcrypt from "bcrypt"
import prisma from "../src/config/db.js"

const seed = async () => {
  console.log("Démarrage du seed (version admin seul)...")

  // ============================================================
  // 1 — ADMIN
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
  console.log("Seed (admin seul) terminé avec succès !")
  console.log("─────────────────────────────────────────")
  console.log(`Admin         : admin@sensolidaire.org`)
  console.log(`Password      : ${process.env.ADMIN_PASSWORD}`)
  console.log("─────────────────────────────────────────")
  console.log("→ Prochaine étape : créer les missions Kenya + Sénégal via le dashboard")
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