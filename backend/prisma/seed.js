// prisma/seed.js
// Script d'initialisation des données en base
// Crée le compte administrateur initial avec mot de passe hashé
// Exécution : node prisma/seed.js

// Import de bcrypt pour hasher le mot de passe avant insertion
import bcrypt from "bcrypt"

// Import de l'instance Prisma pour interagir avec la base
import prisma from "../src/config/db.js"

const seed = async () => {
  console.log("🌱 Démarrage du seed...")

  // Mot de passe temporaire pour le développement
  // À changer immédiatement en production
  const plainPassword = "Admin1234!"

  // Hash du mot de passe avec bcrypt — facteur de coût 10
  // Le hash sera différent à chaque exécution (bcrypt ajoute un sel automatiquement)
  const password_hash = await bcrypt.hash(plainPassword, 10)

  // Crée l'admin en base
  // upsert = update si existe déjà, insert sinon
  // → permet de relancer le seed sans erreur de doublon
  const admin = await prisma.admin.upsert({
    where: { email: "admin@sensolidaire.org" },
    update: {}, // si l'admin existe déjà → ne rien modifier
    create: {
      email: "admin@sensolidaire.org",
      password_hash,
      role: "admin"
    }
  })

  console.log(`✅ Admin créé : ${admin.email}`)
  console.log(`🔑 Mot de passe temporaire : ${plainPassword}`)
  console.log(`⚠️  Changez ce mot de passe en production !`)
}

// Exécute le seed et ferme la connexion Prisma proprement
seed()
  .catch((error) => {
    console.error("❌ Erreur seed :", error)
    process.exit(1)
  })
  .finally(async () => {
    // Ferme la connexion Prisma après le seed
    // Sans ça le script ne se terminerait jamais
    await prisma.$disconnect()
  })
  