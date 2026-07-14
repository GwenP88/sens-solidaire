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
// CONSTANTES PARTAGÉES
// ============================================================
  // Placeholders de galerie — réutilisés pour les locations, field actions,
  // et tout ce qui a besoin de photos factices sans avoir de vrais fichiers
  // uploadés. Permet de montrer l'emplacement des galeries en démo sans
  // avoir à télécharger des dizaines d'images fictives.
  const GALLERY_PLACEHOLDERS = [
    '/images/placeholders/placeholder-galerie-1.png',
    '/images/placeholders/placeholder-galerie-2.png',
    '/images/placeholders/placeholder-galerie-3.png',
    '/images/placeholders/placeholder-galerie-4.png',
  ]

  const seed = async () => {
    console.log("Démarrage du seed (version admin seul)...")}

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
  // 2 — MISSIONS ANCRES (service civique, groupe jeunes, congé solidaire)
  // ============================================================
  // ⚠️ Ces 3 missions ne sont PAS gérables via le dashboard (type masqué dans
  // MissionFormPage). Elles servent uniquement d'ancrage pour rattacher des
  // témoignages par type sur la page Missions (sections codées en dur).

  const missionScAncre = await prisma.mission.upsert({
    where: { slug: "ancre-service-civique" },
    update: {},
    create: {
      slug: "ancre-service-civique",
      type: "service_civique",
      title: "Service civique — ancre démo",
      country: "Kenya",
      short_description: "Mission ancre pour rattacher les témoignages service civique.",
      is_active: false, // jamais affichée seule, ni dans les listes publiques filtrées
    },
  })

  const missionGjAncre = await prisma.mission.upsert({
    where: { slug: "ancre-groupe-jeunes" },
    update: {},
    create: {
      slug: "ancre-groupe-jeunes",
      type: "groupe_jeunes",
      title: "Groupe jeunes — ancre démo",
      country: "Kenya & Sénégal",
      short_description: "Mission ancre pour rattacher les témoignages groupe jeunes.",
      is_active: false,
    },
  })

  const missionCsAncre = await prisma.mission.upsert({
    where: { slug: "ancre-conge-solidaire" },
    update: {},
    create: {
      slug: "ancre-conge-solidaire",
      type: "conge_solidaire",
      title: "Congé solidaire — ancre démo",
      country: "Kenya & Sénégal",
      short_description: "Mission ancre pour rattacher les témoignages congé solidaire.",
      is_active: false,
    },
  })

  console.log("Missions ancres créées (service civique, groupe jeunes, congé solidaire)")

  // ============================================================
  // 3 — DELEGATIONS (avant les locations pour récupérer les IDs)
  // ============================================================

  await prisma.delegation.deleteMany({})

  const delegLumo = await prisma.delegation.create({
    data: { pays: "Kenya", flag_code: "ke", image_url: "/images/lieux-missions/lumo-kenya.jpeg", lieu: "LUMO Community Wildlife Conservancy", contacts: "Denis (coordinateur), Ernest (chargé des projets biodiversité) et les 22 Rangers", display_order: 1 },
  })
  const delegTtnp = await prisma.delegation.create({
    data: { pays: "Kenya", flag_code: "ke", image_url: "/images/lieux-missions/ttnp-kenya.jpeg", lieu: "Taita Taveta National Polytechnic", contacts: "Kefa Okari (Coordinateur des missions, professeur de français), Madeline Nabwire (directrice du département de tourisme)", display_order: 2 },
  })
  const delegElsa = await prisma.delegation.create({
    data: { pays: "Kenya", flag_code: "ke", image_url: "/images/lieux-missions/etc-kenya.jpeg", lieu: "Elsa Conservation Trust", contacts: "Antony — Coordinateur des missions", display_order: 3 },
  })
  const delegAgada = await prisma.delegation.create({
    data: { pays: "Sénégal", flag_code: "sn", image_url: "/images/lieux-missions/agada-senegal.jpg", lieu: "ONG AGADA", contacts: "François Bassene et Penda Diémé", display_order: 4 },
  })
  const delegCampement = await prisma.delegation.create({
    data: { pays: "Sénégal", flag_code: "sn", image_url: "/images/lieux-missions/campement-senegal.jpg", lieu: "Campement de l'Ile d'Effrane", contacts: "Mamadou Ndiaye", display_order: 5 },
  })

  console.log('Délégations créées (5)')

  // ============================================================
  // 4 — LOCATIONS (Kenya + Sénégal)
  // ============================================================

    // Petit helper — ajoute une galerie photo placeholder à une location
    const addLocationGallery = async (locationId) => {
      await prisma.media.deleteMany({ where: { entity_type: 'location', entity_id: locationId } })
      await prisma.media.createMany({
        data: [
          { entity_type: 'location', entity_id: locationId, file_url: '/images/placeholders/placeholder-galerie-1.png', file_type: 'image', display_order: 1 },
          { entity_type: 'location', entity_id: locationId, file_url: '/images/placeholders/placeholder-galerie-2.png', file_type: 'image', display_order: 2 },
          { entity_type: 'location', entity_id: locationId, file_url: '/images/placeholders/placeholder-galerie-3.png', file_type: 'image', display_order: 3 },
        ]
      })
    }

    // ── Voi — pas de délégation directe ───────────────────────
    const voiData = {
      name: "Voi",
      country: "Kenya",
      description: "Voi est une ville située dans le comté de Taita-Taveta, aux portes du Parc national de Tsavo Est. C'est le point de départ de nos missions de protection de la faune sauvage au Kenya.",
      image_url: "/images/placeholders/placeholder-galerie-1.png",
      map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15931.2071768332!2d38.54641188963989!3d-3.3984885449885964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18392955840748c1%3A0x612879b76e474c69!2sVoi%2C%20Kenya!5e0!3m2!1sen!2sfr!4v1783003244824!5m2!1sen!2sfr",
      website_url: null,
      is_active: true,
    }
    const voiLocation = await prisma.location.upsert({
      where: { slug: "voi-kenya" },
      update: voiData,
      create: { slug: "voi-kenya", mission_id: 1, ...voiData },
    })
    await addLocationGallery(voiLocation.id)

    // ── LUMO Community Wildlife Conservancy ────────────────────
    const lumoData = {
      name: "LUMO Community Wildlife Conservancy",
      country: "Kenya",
      description: "LUMO a vu le jour en 1997, d'un protocole d'entente entre trois ranchs de la zone des Taita Hills afin de lutter contre le braconnage et de protéger la diversité biologique kényane. Lumo fait partie du corridor historique de migration des éléphants reliant l'écosystème Tsavo aux collines de Shimba.",
      image_url: "/images/placeholders/placeholder-galerie-2.png",
      map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.506650684568!2d38.1950834105512!3d-3.4692507964905737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1838e44717c2d29d%3A0x94b99ab36036edac!2sLumo%20Community%20Wildlife%20Conservancy!5e0!3m2!1sen!2sfr!4v1783003373372!5m2!1sen!2sfr",
      website_url: "https://lumoconservancy.com/",
      delegation_id: delegLumo.id,
      is_active: true,
    }
    const lumoLocation = await prisma.location.upsert({
      where: { slug: "lumo-kenya" },
      update: lumoData,
      create: { slug: "lumo-kenya", mission_id: 1, ...lumoData },
    })
    await addLocationGallery(lumoLocation.id)

    // ── Taita Taveta National Polytechnic ──────────────────────
    const ttnpData = {
      name: "Taita Taveta National Polytechnic",
      country: "Kenya",
      description: "Établissement d'enseignement supérieur de la ville de Voi, aux portes du Parc Tsavo. Cette université possède un pôle dédié au tourisme avec lequel nous travaillons particulièrement. Le campus est très engagé pour la biodiversité et possède sa propre pépinière.",
      image_url: "/images/placeholders/placeholder-galerie-3.png",
      map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.8655631167626!2d38.57651901055072!3d-3.3830053965774107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18392bfa98bf3af3%3A0xdbb9428c85b95a3c!2sTaita%20Taveta%20National%20Polytechnic%2C%20Voi!5e0!3m2!1sen!2sfr!4v1783003480686!5m2!1sen!2sfr",
      website_url: null,
      delegation_id: delegTtnp.id,
      is_active: true,
    }
    const ttnpLocation = await prisma.location.upsert({
      where: { slug: "ttnp-kenya" },
      update: ttnpData,
      create: { slug: "ttnp-kenya", mission_id: 1, ...ttnpData },
    })
    await addLocationGallery(ttnpLocation.id)

    // ── Elsa Conservation Trust ────────────────────────────────
    const ectData = {
      name: "Elsa Conservation Trust",
      country: "Kenya",
      description: "La Elsa Conservation Trust a fait don de millions de dollars à des projets de conservation de la vie sauvage, aidant à créer les parcs kenyans de Meru, Samburu, Shaba, Kora et Hells Gate. Le centre offre un environnement propice à la recherche ornithologique avec 450 espèces d'oiseaux recensées.",
      image_url: "/images/placeholders/placeholder-galerie-4.png",
      map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3086.1469911782483!2d36.31317642592106!3d-0.814968236091608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182938fec8ba611d%3A0x9c93221648e498ad!2sElsamere%20Conservation%20Centre!5e0!3m2!1sen!2sfr!4v1783003508532!5m2!1sen!2sfr",
      website_url: null,
      delegation_id: delegElsa.id,
      is_active: true,
    }
    const ectLocation = await prisma.location.upsert({
      where: { slug: "elsa-conservation-trust-kenya" },
      update: ectData,
      create: { slug: "elsa-conservation-trust-kenya", mission_id: 1, ...ectData },
    })
    await addLocationGallery(ectLocation.id)

    // ── Diani Turtle Watch — pas de délégation ─────────────────
    const dtwData = {
      name: "Diani Turtle Watch",
      country: "Kenya",
      description: "Diani Turtle Watch, créé en 2012, travaille avec une équipe de 14 observateurs couvrant 50 km sur la côte sud du Kenya. Les principales espèces suivies sont les tortues vertes et les tortues imbriquées. Il sensibilise les communautés locales, les écoles et les touristes aux espèces menacées.",
      image_url: "/images/placeholders/placeholder-galerie-1.png",
      map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.445318644362!2d39.569509510555534!3d-4.327148895628687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18404953574d39e9%3A0x76f7b649b72d4c05!2sDiani%20Turtle%20Watch!5e0!3m2!1sen!2sfr!4v1783003553259!5m2!1sen!2sfr",
      website_url: null,
      is_active: true,
    }
    const dtwLocation = await prisma.location.upsert({
      where: { slug: "diani-turtle-watch-kenya" },
      update: dtwData,
      create: { slug: "diani-turtle-watch-kenya", mission_id: 1, ...dtwData },
    })
    await addLocationGallery(dtwLocation.id)

    // ── Ziguinchor — pas de délégation directe ─────────────────
    const ziguinchorData = {
      name: "Ziguinchor",
      country: "Sénégal",
      description: "Ziguinchor est la capitale de la Casamance, région au sud du Sénégal connue pour sa verdure exceptionnelle et sa culture riche. Nos missions de développement communautaire s'y déroulent dans un cadre chaleureux, au contact direct des familles locales.",
      image_url: "/images/placeholders/placeholder-galerie-2.png",
      map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31154.710103122015!2d-16.294826054807107!3d12.559899910713627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee793dbd0cbdc17%3A0x25b90fb2e17e99df!2sZiguinchor%2C%20Senegal!5e0!3m2!1sen!2sfr!4v1783003576053!5m2!1sen!2sfr",
      website_url: null,
      is_active: true,
    }
    const ziguinchorLocation = await prisma.location.upsert({
      where: { slug: "ziguinchor-senegal" },
      update: ziguinchorData,
      create: { slug: "ziguinchor-senegal", mission_id: 2, ...ziguinchorData },
    })
    await addLocationGallery(ziguinchorLocation.id)

    // ── ONG AGADA ──────────────────────────────────────────────
    const agadaData = {
      name: "ONG AGADA",
      country: "Sénégal",
      description: "AGADA (Agir Autrement pour le Développement en Afrique), basée à Ziguinchor en Casamance, œuvre pour le développement d'activités économiques locales. Investie depuis plus de 30 ans, elle soutient le reboisement de la mangrove, l'agriculture durable et la protection d'espèces patrimoniales comme le lamantin.",
      image_url: "/images/placeholders/placeholder-galerie-3.png",
      map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3894.3059138975273!2d-16.269258789351788!3d12.562068987665677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee791db8464e97b%3A0xa482f94cddde02ca!2sAgir%20Autrement%20pour%20le%20D%C3%A9veloppement%20de%20l&#39;Afrique%20(AGADA)!5e0!3m2!1sen!2sfr!4v1783003612281!5m2!1sen!2sfr",
      website_url: null,
      delegation_id: delegAgada.id,
      is_active: true,
    }
    const agadaLocation = await prisma.location.upsert({
      where: { slug: "agada-senegal" },
      update: agadaData,
      create: { slug: "agada-senegal", mission_id: 2, ...agadaData },
    })
    await addLocationGallery(agadaLocation.id)

    console.log("Locations créées (7) avec galerie photo")

    // ============================================================
  // 5 — TÉMOIGNAGES (3 par mission — contenu fictif, tailles variées)
  // ============================================================

  await prisma.testimonial.deleteMany({})

  await prisma.testimonial.createMany({
    data: [
      // ── Kenya (mission_id: 1) ──
      {
        mission_id: 1, author_name: "Claire M.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laboris nisi ut aliquip ex ea commodo consequat!",
        annee: 2025, status: "approved", show_homepage: true, consent_given: true,
      },
      {
        mission_id: 1, author_name: "Julien D.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, une aventure humaine forte.",
        annee: 2025, status: "approved", show_homepage: false, consent_given: true,
      },
      {
        mission_id: 1, author_name: "Amandine R.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        annee: 2024, status: "pending", show_homepage: false, consent_given: true,
      },

      // ── Sénégal (mission_id: 2) ──
      {
        mission_id: 2, author_name: "Thomas B.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit!",
        annee: 2025, status: "approved", show_homepage: true, consent_given: true,
      },
      {
        mission_id: 2, author_name: "Léa F.",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, une immersion totale dans la culture locale.",
        annee: 2024, status: "approved", show_homepage: false, consent_given: true,
      },
      {
        mission_id: 2, author_name: "Nicolas P.",
        content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
        annee: 2026, status: "pending", show_homepage: false, consent_given: true,
      },

      // ── Service civique — ancre (mission_id: 3) ──
      {
        mission_id: 3, author_name: "Manon T.",
        content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        annee: 2025, status: "approved", show_homepage: true, consent_given: true,
      },
      {
        mission_id: 3, author_name: "Hugo V.",
        content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur, une expérience à la fois exigeante et gratifiante sur le terrain.",
        annee: 2025, status: "approved", show_homepage: false, consent_given: true,
      },
      {
        mission_id: 3, author_name: "Sarah K.",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
        annee: 2024, status: "approved", show_homepage: false, consent_given: true,
      },

      // ── Groupe jeunes — ancre (mission_id: 4) ──
      {
        mission_id: 4, author_name: "Lycée International de Nice",
        content: "Un projet fédérateur pour toute la classe.",
        annee: 2025, status: "approved", show_homepage: true, consent_given: true,
      },
      {
        mission_id: 4, author_name: "MJC Annemasse",
        content: "Et harum quidem rerum facilis est et expedita distinctio, une organisation impeccable du départ jusqu'au retour du groupe.",
        annee: 2024, status: "approved", show_homepage: false, consent_given: true,
      },
      {
        mission_id: 4, author_name: "Collège des Alpes",
        content: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est omnis dolor repellendus.",
        annee: 2023, status: "pending", show_homepage: false, consent_given: true,
      },

      // ── Congé solidaire — ancre (mission_id: 5) ──
      {
        mission_id: 5, author_name: "Équipe Decathlon Nice",
        content: "Une belle façon de donner du sens à nos congés.",
        annee: 2025, status: "approved", show_homepage: true, consent_given: true,
      },
      {
        mission_id: 5, author_name: "Marc L.",
        content: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, un vrai temps de partage avec les équipes locales.",
        annee: 2024, status: "approved", show_homepage: false, consent_given: true,
      },
      {
        mission_id: 5, author_name: "Isabelle G.",
        content: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat, une mission qui restera gravée.",
        annee: 2026, status: "approved", show_homepage: false, consent_given: true,
      },
    ]
  })
  console.log("Témoignages créés (15 — 3 par mission)")

  // ============================================================
  // 7 — ACTIONS SUR LE TERRAIN (Kenya + Sénégal uniquement)
  // ============================================================

  const FIELD_ACTIONS = [

    // ── KENYA ──
    {
      slug: 'patrouilles-rangers-lumo',
      title: 'Patrouilles avec les rangers du sanctuaire LUMO',
      description: 'Depuis plus de 10 ans, l\'association soutient les rangers du sanctuaire LUMO dans leur mission de lutte contre le braconnage.',
      content: `Depuis plus de 10 ans, l'association investit ses efforts au sanctuaire de LUMO, frontalier du Parc Tsavo, pour soutenir les rangers dans leur mission de lutte contre le braconnage.\n\nSoutien aux patrouilles, relevés de données sur la faune, entretien du matériel et du camp de base, nos volontaires ont régulièrement contribué à la vie du sanctuaire et à la protection de la vie animale.`,
      countries: ['Kenya'],
      image_url: '/images/lieux-missions/lumo-kenya.jpeg',
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
      image_url: '/images/actions-terrain/jardin-potager-kenya.jpg',
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
      image_url: '/images/placeholders/placeholder-galerie-1.png',
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
      image_url: '/images/actions-terrain/jardin-potager-senegal.jpg',
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
      image_url: '/images/placeholders/placeholder-galerie-1.png',
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
      image_url: '/images/placeholders/placeholder-galerie-1.png',
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
  //  6 — ACTIVITY REPORTS
  // ============================================================

  await prisma.activityReport.deleteMany({})
  await prisma.activityReport.createMany({
    data: [
      { annee: 2024, url: "https://www.sensolidaire.org/wp-content/uploads/2025/06/Rapport-dactivites-2024-1.pdf" },
      { annee: 2023, url: "https://www.sensolidaire.org/wp-content/uploads/2024/07/Rapport-des-activites-2023.pdf" },
      { annee: 2022, url: "https://www.sensolidaire.org/wp-content/uploads/2023/11/Rapport-dactivites-2022.pdf" },
      { annee: 2021, url: "https://www.sensolidaire.org/wp-content/uploads/2023/04/rapport-annuel-2021.pdf" },
      { annee: 2020, url: "https://www.sensolidaire.org/wp-content/uploads/2021/05/rapportmoral-2020.pdf" },
    ]
  })
  console.log('ActivityReports créés (5)')

  // ============================================================
  //  7 — RAPPORT DE MISSION
  // ============================================================

  await prisma.missionReport.deleteMany({})
  await prisma.missionReport.createMany({
    data: [
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
  })
  console.log('MissionReports créés (10)')

  // ============================================================
  //  8 — MEMBRES DE L'EQUIPE
  // ============================================================

  await prisma.teamMember.deleteMany({})
  await prisma.teamMember.createMany({
    data: [
      // ── Direction ──
      { nom: "Delphine Thibaut", role: "Fondatrice et Chargée des Programmes", description: "Master administratrice S.I. Institut Bioforce — Ancienne guide spécialisée Afrique", avatar_url: "/images/placeholders/avatar-women.png", category: "direction", display_order: 1 },
      { nom: "Arya Monchauzou", role: "Chargée des projets des Alpes-Maritimes", description: "Master Risques et Environnement", avatar_url: "/images/placeholders/avatar-women.png", category: "direction", display_order: 2 },
      { nom: "Amna Labidi", role: "Chargée de mission Service Civique", description: "Licence Sciences de la vie — Master biologie (en cours)", avatar_url: "/images/placeholders/avatar-women.png", category: "direction", display_order: 3 },
      { nom: "Emile Augsburger", role: "Chargé de mission Service Civique", description: "Ingénieur écologue HES-SO", avatar_url: "/images/placeholders/avatar-men.png", category: "direction", display_order: 4 },
      { nom: "Clémence Armanet", role: "Chargée de mission Service Civique", description: "Master Ecologie de l'anthropocène", avatar_url: "/images/placeholders/avatar-women.png", category: "direction", display_order: 5 },
      { nom: "Eymeric Coffi", role: "Chargé de mission Service Civique", description: "Master en science de Gestion et Marketing", avatar_url: "/images/placeholders/avatar-men.png", category: "direction", display_order: 6 },
      // ── Bureau ──
      { nom: "Elodie Tisserand", role: "Présidente", description: "Management de projets culturels et innovation — Chargée des projets d'éducation populaire.", avatar_url: "/images/placeholders/avatar-women.png", category: "bureau", display_order: 1 },
      { nom: "Hervé Caffin", role: "Trésorier", description: "Responsable affaires transition énergétique Paris — Ancien chargé de mission pour Energie Solidaire au Burkina Faso.", avatar_url: "/images/placeholders/avatar-men.png", category: "bureau", display_order: 2 },
      { nom: "Lynda Tabet", role: "Secrétaire", description: "Coach professionnel — Professeur de Yoga — Coordinatrice projets Transition Bien-être.", avatar_url: "/images/placeholders/avatar-women.png", category: "bureau", display_order: 3 },
      // ── CA ──
      { nom: "Ingrid von Anthoni", role: "Chargée des plaidoyers sur le massacre des éléphants", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 1 },
      { nom: "Virginie Blumet", role: "Manager International Business Finance WWF", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 2 },
      { nom: "Emilie della-guardia", role: "Professeure de Science et Vie de la Terre", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 3 },
      { nom: "Crystel Cantariti", role: "Professeure des écoles", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 4 },
      { nom: "Marc Olivier", role: "Consultant, professeur en ethnobotanique", avatar_url: "/images/placeholders/avatar-men.png", category: "ca", display_order: 5 },
      { nom: "Coralie Pinchart", role: "Master 2 économie de développement à l'International", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 6 },
      { nom: "John Rebmann", role: "Ancien directeur financier de Parcs Hôteliers", avatar_url: "/images/placeholders/avatar-men.png", category: "ca", display_order: 7 },
      { nom: "Brigitte Schwarz", role: "Chargée de communication", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 8 },
      { nom: "Patricia Valensi", role: "Docteur en Préhistoire, paléontologue", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 9 },
      { nom: "Eduardo Widakowich", role: "Consultant en gestion de projet développement durable", avatar_url: "/images/placeholders/avatar-men.png", category: "ca", display_order: 10 },
      { nom: "Johanna Zerbib", role: "Responsable Opérations Thompson Africa", avatar_url: "/images/placeholders/avatar-women.png", category: "ca", display_order: 11 },
      // ── Également à nos côtés ──
      { nom: "Gwen Pichot", role: "Développeuse Web - Projet étudiant - Holberton School", description: "Thonon-les-Bains", avatar_url: "/images/placeholders/avatar-women.png", category: "egalement", display_order: 1 },
      { nom: "Alison Amblard", role: "Développeuse Web - Projet étudiant - Holberton School", description: "Thonon-les-Bains", avatar_url: "/images/placeholders/avatar-women.png", category: "egalement", display_order: 2 },
      { nom: "Thierry Montalban", role: "Agence de communication", avatar_url: "/images/placeholders/avatar-men.png", category: "egalement", display_order: 3 },
      { nom: "Sabine Jerome", role: "Comptabilité", avatar_url: "/images/placeholders/avatar-women.png", category: "egalement", display_order: 4 },
    ]
  })
  console.log('TeamMembers créés (23)')

  // ============================================================
  // 9 — LOGOS PARTENAIRES
  // ============================================================

  await prisma.partner.deleteMany({})
  await prisma.partner.createMany({
    data: [
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
  })
  console.log('Partners créés (18)')

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