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
  // CONSTANTES PARTAGÉES
  // ============================================================
  // Placeholders de galerie — réutilisés pour les field actions, et tout ce
  // qui a besoin de photos factices sans avoir de vrais fichiers uploadés.
  const GALLERY_PLACEHOLDERS = [
    '/images/placeholders/placeholder-galerie-1.webp',
    '/images/placeholders/placeholder-galerie-2.webp',
    '/images/placeholders/placeholder-galerie-3.webp',
    '/images/placeholders/placeholder-galerie-4.webp',
  ]

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
  // 2 — ACTIONS SUR LE TERRAIN (Kenya + Sénégal uniquement)
  // ============================================================

  const FIELD_ACTIONS = [
    // ── KENYA ──
    {
      slug: 'patrouilles-rangers-lumo',
      title: 'Patrouilles avec les rangers du sanctuaire LUMO',
      description: 'Depuis plus de 10 ans, l\'association soutient les rangers du sanctuaire LUMO dans leur mission de lutte contre le braconnage.',
      content: `Depuis plus de 10 ans, l'association investit ses efforts au sanctuaire de LUMO, frontalier du Parc Tsavo, pour soutenir les rangers dans leur mission de lutte contre le braconnage.\n\nSoutien aux patrouilles, relevés de données sur la faune, entretien du matériel et du camp de base, nos volontaires ont régulièrement contribué à la vie du sanctuaire et à la protection de la vie animale.`,
      countries: ['Kenya'],
      image_url: '/images/placeholders/placeholder-galerie-3.webp',
      tags: ['Environnement', 'Biodiversité'],
      odds: [15, 16],
      gallery: GALLERY_PLACEHOLDERS,
    },
    {
      slug: 'potager-agro-ecologique-ttnp',
      title: 'Potager agro-écologique face à la sécheresse',
      description: 'Projet mené avec les élèves du TTNP de Voi pour améliorer la production durable et diffuser les connaissances sur l\'agroécologie.',
      content: `Ce projet mené conjointement avec les élèves du TTNP de Voi vise à améliorer la production durable de cultures et de produits d'origine animale. Les objectifs spécifiques sont : utiliser la ferme pour diffuser les connaissances sur l'agriculture transformatrice en adoptant l'agroécologie, créer un environnement microclimatique pour atténuer les impacts climatiques, et adopter la diversification de la production.`,
      countries: ['Kenya'],
      image_url: '/images/placeholders/placeholder-galerie-2.webp',
      tags: ['Agriculture', 'Éducation'],
      odds: [2, 13, 15],
      gallery: GALLERY_PLACEHOLDERS,
    },
    {
      slug: 'reboisement-ttnp-kenya',
      title: 'Action de reboisement au TTNP — 186 arbres plantés',
      description: 'Lors de la journée nationale du "Tree Planting Day", les lycéens ont planté plus de 186 arbres au TTNP aux côtés des étudiants kényans.',
      content: `Grâce à l'aide de notre volontaire ethnobotaniste et des rangers, les élèves ont planté 70 arbres à LUMO dont des Neem, Flamboyants, Jacarandas, Lauriers roses, Acacias niloticas et Cassia siema.\n\nAu TTNP, lors de la journée nationale du "Tree Planting Day", les élèves ont planté plus de 186 arbres, dont East Africa Yellow Wood, Sycamore Fig, Brachylaena huillensis, Croton megalicarpus et African Cherry.\n\nCe reboisement contribue directement à la restauration des écosystèmes locaux et à la lutte contre la sécheresse qui frappe sévèrement la région.`,
      countries: ['Kenya'],
      image_url: '/images/placeholders/placeholder-galerie-1.webp',
      tags: ['Environnement', 'Biodiversité', 'Groupe jeunes'],
      odds: [13, 15, 17],
      gallery: GALLERY_PLACEHOLDERS,
    },

    // ── SÉNÉGAL ──
    {
      slug: 'jardins-potagers-senegal',
      title: 'Jardins potagers et consommation responsable',
      description: 'En partenariat avec l\'association AGADA, installation de potagers dans les établissements scolaires de Casamance.',
      content: `Avec ce projet nous avons développé des échanges entre deux écoles primaires, quatre collèges et deux lycées de la Métropole de Nice et des établissements de la Casamance au Sénégal sur le thème de la consommation responsable. Nous avons installé, en partenariat avec l'association sénégalaise AGADA, des potagers dans les établissements dans le but de former les élèves à la production et à la consommation responsable. Les élèves de CEM Kénia ont mis en place un projet de jardin potager de 150m² dont la production abondante a permis d'ouvrir une boutique. Cette boutique est un moyen privilégié pour initier les élèves au monde de l'entrepreneuriat.`,
      countries: ['Sénégal'],
      image_url: '/images/placeholders/placeholder-galerie-4.webp',
      tags: ['Agriculture', 'Éducation'],
      odds: [3, 12, 15],
      gallery: GALLERY_PLACEHOLDERS,
    },
    {
      slug: 'reboisement-mangrove-senegal',
      title: 'Reboisement de la mangrove en Casamance',
      description: 'Chaque saison des pluies, Sens Solidaires et AGADA s\'engagent dans des campagnes de reboisement de la mangrove pour protéger les côtes et préserver la biodiversité.',
      content: `La mangrove joue un rôle clé dans la protection des côtes. Elle agit comme un rempart naturel contre la montée des eaux, offre un habitat à une grande diversité d'espèces, limite l'érosion côtière et la salinisation des sols. Sa préservation est donc essentielle.\n\nDepuis plusieurs années, Sens Solidaires et AGADA s'engagent chaque saison des pluies dans des campagnes de reboisement. Ce processus est relativement simple : il suffit de planter des propagules, les graines rigides et allongées du palétuvier.\n\nUne sensibilisation accrue de la population est également indispensable. La mangrove est souvent détruite pour la production de bois de chauffe ou la fabrication de meubles. Il est crucial de réguler ces pratiques en limitant la coupe aux arbres âgés et en mettant en place des solutions durables alternatives. Les élèves du CEM Kénia participent activement au reboisement dans le village de Niambalang.`,
      countries: ['Sénégal'],
      image_url: '/images/placeholders/placeholder-galerie-1.webp',
      tags: ['Environnement', 'Biodiversité'],
      odds: [13, 14, 15],
      gallery: GALLERY_PLACEHOLDERS,
    },
    {
      slug: 'filtres-eau-ecole-djibelor',
      title: 'Installation de filtres à eau — école Djibélor',
      description: 'Installation de kits de filtration dans l\'école Djibélor de Ziguinchor pour garantir un accès à l\'eau potable à 1 700 élèves.',
      content: `Au Sénégal, seulement 40% des écoles environ ont accès à l'eau potable. L'école Djibélor est un établissement qui accueille 1 700 élèves de niveau maternelle et primaire. Les enfants en bas âge représentent l'une des populations les plus fragiles et sensibles aux maladies liées à l'eau.\n\nL'installation de filtres à eau permet aux enfants mais aussi au personnel de boire en toute sécurité l'eau de l'école. Les kits ORISA, fournis par Fonte de Vivo, sont très faciles à installer et purifient l'eau grâce à une série de filtres.\n\nL'acquisition de ces kits permet à l'école de Djibélor de prévenir les maladies transmises par l'eau pour l'ensemble des personnes présentes dans l'établissement.`,
      countries: ['Sénégal'],
      image_url: '/images/placeholders/placeholder-galerie-2.webp',
      tags: ['Accès à l\'eau', 'Éducation'],
      odds: [3, 4, 6],
      gallery: GALLERY_PLACEHOLDERS,
    },
  ]

  // ── Suppression dans l'ordre des contraintes FK ────────────
  await prisma.fieldActionTag.deleteMany({})
  await prisma.fieldActionODD.deleteMany({})
  await prisma.fieldActionCountry.deleteMany({})
  await prisma.fieldAction.deleteMany({})

  for (const action of FIELD_ACTIONS) {
    const { tags, odds, countries, gallery, ...actionData } = action
    const created = await prisma.fieldAction.create({
      data: {
        ...actionData,
        tags:      { create: tags.map(tag => ({ tag })) },
        odds:      { create: odds.map(n => ({ odd_number: n })) },
        countries: { create: countries.map(c => ({ country: c })) },
      },
    })
    await prisma.media.deleteMany({ where: { entity_type: 'field_action', entity_id: created.id } })
    await prisma.media.createMany({
      data: gallery.map((url, i) => ({
        entity_type: 'field_action',
        entity_id: created.id,
        file_url: url,
        file_type: 'image',
        display_order: i,
      }))
    })
  }

  console.log(`FieldActions créées (${FIELD_ACTIONS.length})`)

  // ============================================================
  // 3 — RAPPORTS DE MISSION
  // ============================================================

  const MISSION_REPORTS = [
    { auteur: "Joelle", destination: "kenya", type: "individuel", annee: 2025, pdf_url: "/pdfs/rapports/joelle-kenya-2025.pdf" },
    { auteur: "Armand", destination: "kenya", type: "individuel", annee: 2024, pdf_url: "/pdfs/rapports/armand-kenya-2024.pdf" },
    { auteur: "Amna", destination: "senegal", type: "individuel", annee: 2025, pdf_url: "/pdfs/rapports/amna-senegal-2025.pdf" },
    { auteur: "Tilla", destination: "senegal", type: "individuel", annee: 2024, pdf_url: "/pdfs/rapports/tilla-senegal-2024.pdf" },
    { auteur: "Kimberley", destination: null, type: "service_civique", annee: 2025, pdf_url: "/pdfs/rapports/kimberley-service-civique-2025.pdf" },
    { auteur: "Cyril", destination: null, type: "service_civique", annee: 2024, pdf_url: "/pdfs/rapports/cyril-service-civique-2024.pdf" },
    { auteur: "École Internationale de Fuveau", destination: null, type: "groupe_jeune", annee: 2018, pdf_url: "/pdfs/rapports/ecole-fuveau-srilanka-2018.pdf" },
    { auteur: "École Internationale de Nice", destination: null, type: "groupe_jeune", annee: 2017, pdf_url: "/pdfs/rapports/ecole-nice-srilanka-2017.pdf" },
    { auteur: "Jean-Yves, Loïc & Christian", destination: null, type: "conge_solidaire", annee: 2016, pdf_url: "/pdfs/rapports/jeanyves-loic-christian-perou-2016.pdf" },
    { auteur: "Équipe Décathlon Nice", destination: null, type: "conge_solidaire", annee: 2023, pdf_url: "/pdfs/rapports/decathlon-nice-conge-solidaire-2023.pdf" },
  ]

  await prisma.missionReport.deleteMany({})
  await prisma.missionReport.createMany({ data: MISSION_REPORTS })
  console.log(`MissionReports créés (${MISSION_REPORTS.length})`)


  // ============================================================
  // 4 — LOGOS PARTENAIRES
  // ============================================================

  const PARTNERS = [
    { name: "Ville de Nice", logo_url: "/images/logo-partners/ville-nice.png", display_order: 1 },
    { name: "Alpes-Maritimes", logo_url: "/images/logo-partners/alpes-maritimes.png", display_order: 2 },
    { name: "Annemasse", logo_url: "/images/logo-partners/annemasse.png", display_order: 3 },
    { name: "Eco-Ecole", logo_url: "/images/logo-partners/eco-ecole.png", display_order: 4 },
    { name: "Festival des Solidarités", logo_url: "/images/logo-partners/festival-solidarites.png", display_order: 5 },
    { name: "Fonds Jacques Martel", logo_url: "/images/logo-partners/fonds-jacques-martel.png", display_order: 6 },
    { name: "FONJEP", logo_url: "/images/logo-partners/fonjep.png", display_order: 7 },
    { name: "France Volontaires", logo_url: "/images/logo-partners/france-volontaires.png", display_order: 8 },
    { name: "Haute-Savoie", logo_url: "/images/logo-partners/haute-savoie.png", display_order: 9 },
    { name: "IUCN", logo_url: "/images/logo-partners/iucn.png", display_order: 10 },
    { name: "Jeunesse et Sport", logo_url: "/images/logo-partners/jeunesse-sport.jpg", display_order: 11 },
    { name: "Métropole Nice Côte d'Azur", logo_url: "/images/logo-partners/metropole-nice.png", display_order: 12 },
    { name: "Ministère des Affaires Étrangères", logo_url: "/images/logo-partners/ministere-affaires-etrangeres.png", display_order: 13 },
    { name: "Ministère de l'Éducation", logo_url: "/images/logo-partners/ministere-education.png", display_order: 14 },
    { name: "PNUE", logo_url: "/images/logo-partners/pnue.png", display_order: 15 },
    { name: "Service Civique", logo_url: "/images/logo-partners/service-civique.png", display_order: 16 },
    { name: "Territoires Solidaires", logo_url: "/images/logo-partners/territoires-solidaires.png", display_order: 17 },
    { name: "AFD", logo_url: "/images/logo-partners/afd.png", display_order: 18 },
    { name: "Ambassade de France au Kenya", logo_url: "/images/logo-partners/ambassade-france-kenya.png", display_order: 19 },
    { name: "TTNP", logo_url: "/images/logo-partners/ttnp.jpeg", display_order: 20 },
    { name: "AGADA", logo_url: "/images/logo-partners/agada.jpeg", display_order: 21 },
    { name: "Ecole Rudolf Steiner Genève", logo_url: "/images/logo-partners/ecole-steiner-geneve.jpeg", display_order: 22 },
  ]

  await prisma.partner.deleteMany({})
  await prisma.partner.createMany({ data: PARTNERS })
  console.log(`Partners créés (${PARTNERS.length})`)

  // ============================================================
  // 5 — ARTICLES : MÉDIAS ET ACTUALITÉS
  // ============================================================

  const MEDIA_POSTS = [
    {
      slug: 'newsletter-juin-2026',
      title: 'Newsletter Juin 2026',
      content: 'Découvrez les dernières nouvelles de Sens Solidaires : nos missions en cours, les témoignages de volontaires et les actions menées sur le terrain au Kenya et au Sénégal.',
      theme: 'Newsletter',
      date: new Date('2026-05-01'),
      image_url: null,
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2026/05/NEWSLETTER-Juin-26-3.pdf',
    },
    {
      slug: 'interview-france-bleu-personnalites-remarquables',
      title: 'Personnalités remarquables — France Bleu',
      content: 'Intervention de Delphine Thibaut au micro de Ségolène Alunni dans son émission Personnalités remarquables sur France Bleu, afin de promouvoir les départs en congé de solidarité et les projets de l\'association au Kenya.',
      theme: 'Interview & radio',
      date: new Date('2022-01-01'),
      image_url: '/images/placeholders/placeholder-photo.webp',
      external_url: 'https://www.francebleu.fr/emissions/18-19-personnalites-remarquables',
    },
    {
      slug: 'post-instagram-willy-rovelli',
      title: 'Willy Rovelli parle de Sens Solidaires',
      content: 'Willy Rovelli a partagé son expérience de congé solidaire au Kenya avec Sens Solidaires.',
      theme: 'Ils parlent de nous',
      date: new Date('2024-06-01'),
      image_url: null,
      external_url: 'https://www.instagram.com/stories/highlights/18049986517744153/',
      is_active: true,
      show_homepage: true,
    },
    {
      slug: 'article-nice-matin-festival-solidarites-2020',
      title: 'Festival des solidarités — Nice Matin 2020',
      content: 'Article de Nice-matin du 28 novembre 2020 sur le festival des solidarités et les interventions de Sens Solidaires dans les écoles élémentaires niçoises.',
      theme: 'Revue de presse',
      date: new Date('2020-11-28'),
      image_url: '/images/placeholders/placeholder-photo.webp',
      external_url: null,
    },
    {
      slug: 'exposition-linogravures-felix-richard-2016',
      title: 'Exposition — Linogravures de Felix Richard',
      content: 'Novembre 2016 : Exposition des linogravures de Felix Richard sur le papier en bouse d\'éléphant du Sri Lanka. 25 euros le tableau encadré, l\'argent retourne directement à la Fabrique du papier pour maintenir son développement.',
      theme: 'Vie de l\'association',
      date: new Date('2016-11-01'),
      image_url: '/images/placeholders/placeholder-photo.webp',
      external_url: null,
    },
    {
      slug: 'evenement-forum-partir-etranger-thonon',
      title: 'Forum partir à l\'étranger — Thonon agglomération',
      content: 'Stand d\'informations pour les jeunes désireux de s\'engager en mission de service civique à l\'international avec nous, au Sénégal ou au Kenya.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.webp',
      external_url: null,
    },
  ]

  await prisma.mediaPost.deleteMany({})
  await prisma.mediaPost.createMany({ data: MEDIA_POSTS })
  console.log(`MediaPosts créés (${MEDIA_POSTS.length})`)

  // ============================================================
  // 6 — ÉDUCATION ET SENSIBILISATION
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
  console.log(`FieldActions       : ${FIELD_ACTIONS.length}`)
  console.log(`MissionReports     : ${MISSION_REPORTS.length}`)
  console.log(`Partners           : ${PARTNERS.length}`)
  console.log(`MediaPosts         : ${MEDIA_POSTS.length}`)
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