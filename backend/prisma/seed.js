// ============================================================
// prisma/seed.js
// ============================================================
// Rôle : peupler la base de données avec le contenu fixe (non géré par le
//        dashboard) : admin, actions terrain, rapports, équipe, partenaires,
//        articles, éducation.
//
// Missions, Locations, Délégations et Témoignages ne sont PLUS gérés par ce
// seed — tout passe par le dashboard (CRUD) ou le vrai flux de soumission
// (témoignages visiteurs). Un reseed ne touche donc jamais à ces données.
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
  // ÉDUCATION ET SENSIBILISATION
  // ============================================================

  const EDUCATION_ITEMS = [
    {
      slug: 'atelier-elephant',
      title: 'Explorer le monde animal : l\'éléphant',
      description: 'Le plus grand mammifère terrestre est menacé d\'extinction (plus de 25 000 individus tués en 2019). Pourtant cet animal joue un rôle clé dans l\'écosystème.',
      content: `Le savais-tu ? Le plus grand mammifère terrestre est menacé d'extinction avec plus de 25 000 individus tués en 2019. Pourtant cet animal joue un rôle clé dans l'écosystème. Cet atelier permet aux élèves de découvrir le monde fascinant des éléphants, leur rôle dans la biodiversité et les menaces qui pèsent sur leur survie. À travers des jeux pédagogiques et des supports visuels, les élèves développent leur sens de la solidarité et leur conscience environnementale.`,
      type: 'Atelier',
      public: 'primaire',
      image_url: '/images/placeholders/placeholder-educ-1.webp',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/Plaquette-atelier-marque-page-elephant.pdf',
    },
    {
      slug: 'atelier-jeu-7-familles-mediterranee',
      title: 'Jeu de 7 familles : les écosystèmes de la mer Méditerranée',
      description: 'On estime qu\'environ 10% de la vie océanique est identifiée à ce jour. Avec le dérèglement climatique, des espèces que nous ne connaissons pas encore ont sûrement déjà disparu.',
      content: `Le savais-tu ? On estime qu'environ 10% de la vie océanique est identifiée à ce jour. Avec le dérèglement climatique des espèces que nous ne connaissons pas encore ont sûrement déjà disparues. Ce jeu de 7 familles pédagogique permet aux élèves de découvrir les différents écosystèmes de la mer Méditerranée, leurs habitants et les menaces qui pèsent sur eux. Un outil ludique pour sensibiliser à la protection des océans.`,
      type: 'Atelier',
      public: 'primaire',
      image_url: '/images/placeholders/placeholder-educ-1.webp',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/plaquette-ATELIERS-jeu-de-7-familles.pdf',
    },
    {
      slug: 'atelier-forets-primaires',
      title: 'À la découverte des forêts primaires',
      description: 'Les forêts tropicales primaires abritent l\'essentiel de la biodiversité terrestre : 70% des espèces végétales et 80% des espèces vertébrées.',
      content: `Le savais-tu ? Les forêts tropicales primaires abritent l'essentiel de la biodiversité terrestre : 70% des espèces végétales et 80% des espèces vertébrées. Cet atelier invite les élèves à explorer les forêts primaires du monde, comprendre leur importance pour la planète et découvrir les menaces qui pèsent sur ces écosystèmes uniques. Un voyage au cœur de la biodiversité.`,
      type: 'Atelier',
      public: 'primaire',
      image_url: '/images/placeholders/placeholder-educ-1.webp',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/Plaquette-atelier-forets-primaires.pdf',
    },
    {
      slug: 'atelier-ecsi-odd',
      title: 'Atelier d\'éducation à la citoyenneté et à la solidarité internationale (ECSI)',
      description: 'Découvrez les 17 ODD pour un monde plus juste, plus durable et plus solidaire. Grâce à des jeux pédagogiques, abordez les notions de vivre ensemble et de solidarité internationale.',
      content: `Découvrez avec nous les 17 ODD pour un monde plus juste, plus durable et plus solidaire. Grâce à différents jeux pédagogiques nous aborderons les notions de vivre ensemble, de stéréotypes, mais aussi différents types d'inégalités à travers le monde. Nous intervenons dans vos locaux (avec notre matériel) ou nous pouvons vous réserver une salle appropriée dans nos bureaux.`,
      type: 'Atelier',
      public: 'college_lycee,adultes',
      image_url: '/images/placeholders/placeholder-educ-1.webp',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2018/06/sengagerdanslasolidarit%C3%A9.pdf',
    },
  ]

  await prisma.educationItem.deleteMany({})
  await prisma.educationItem.createMany({ data: EDUCATION_ITEMS })
  console.log(`EducationItems créés (${EDUCATION_ITEMS.length})`)

  // ============================================================
  // RÉCAP FINAL
  // ============================================================
  console.log("")
  console.log("Seed terminé avec succès !")
  console.log("─────────────────────────────────────────")
  console.log(`Admin              : admin@sensolidaire.org`)
  console.log(`Password           : ${process.env.ADMIN_PASSWORD}`)
  console.log("─────────────────────────────────────────")
  console.log(`EducationItems     : ${EDUCATION_ITEMS.length}`)
  console.log("─────────────────────────────────────────")
  console.log("Missions, Locations, Délégations et Témoignages : gérés via le dashboard / le flux de soumission, jamais par ce seed.")
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