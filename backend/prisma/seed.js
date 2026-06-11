// ============================================================
// prisma/seed.js
// ============================================================
// Rôle : peupler la base de données avec des données de test
//        réalistes issues du vrai site Sens Solidaire
//
// Données insérées :
//   - 1  admin           (compte de connexion au dashboard)
//   - 5  missions        (Kenya, Sénégal, Pérou, Sri Lanka, Sumatra)
//   - 14 lignes pricing  (durées et tarifs par mission)
//   - 5  locations       (villes de départ des missions)
//   - 7  témoignages     (6 approuvés, 1 en attente de modération)
//
// Exécution (depuis la racine du projet) :
//   docker-compose exec backend node prisma/seed.js
//
// Comportement si relancé :
//   - Admin, missions, locations → upsert (pas de doublon)
//   - Pricing, témoignages       → deleteMany + recreate (pas de @unique)
// ============================================================

// Charge les variables d'environnement depuis .env — nécessaire pour DATABASE_URL
import "dotenv/config"

// bcrypt : librairie de hachage de mots de passe
// On ne stocke JAMAIS un mot de passe en clair en base
import bcrypt from "bcrypt"

// prisma : notre instance Prisma configurée dans src/config/db.js
// C'est via cet objet qu'on fait toutes les requêtes en base
import prisma from "../src/config/db.js"

// ============================================================
// Fonction principale du seed
// async car toutes les opérations Prisma sont asynchrones
// (elles attendent une réponse de PostgreSQL)
// ============================================================
const seed = async () => {
  console.log("Démarrage du seed...")

  // ============================================================
  // ÉTAPE 1 — ADMIN
  // ============================================================
  // But : créer le compte administrateur qui permettra de se
  //       connecter au dashboard de modération.
  //
  // Pourquoi bcrypt.hash() ?
  //   On ne stocke JAMAIS le mot de passe en clair.
  //   bcrypt transforme "Admin1234!" en une chaîne illisible.
  //   Le "10" est le "salt rounds" : plus c'est élevé, plus
  //   c'est lent à craquer (10 = bon équilibre sécurité/perf).
  //
  // Pourquoi upsert et pas create() ?
  //   upsert = "update or insert"
  //   Si l'admin existe déjà (seed relancé) → on ne fait rien (update: {})
  //   Si l'admin n'existe pas → on le crée
  //   Sans ça, relancer le seed planterait avec une erreur "email déjà utilisé"
  // ============================================================

  const password_hash = await bcrypt.hash("Admin1234!", 10)

  const admin = await prisma.admin.upsert({
    where: { email: "admin@sensolidaire.org" }, // cherche par email (champ @unique)
    update: {},                                  // s'il existe déjà → ne rien modifier
    create: {
      email: "admin@sensolidaire.org",
      password_hash,   // le hash bcrypt, jamais le mot de passe brut
      role: "admin"    // rôle stocké en base — utilisé dans authMiddleware
    }
  })
  console.log(`Admin : ${admin.email}`)

  // ============================================================
  // ÉTAPE 2 — MISSIONS
  // ============================================================
  // But : créer les 5 missions réelles de l'association.
  //
  // Structure d'une mission (cf. schema.prisma) :
  //   title          → nom affiché sur le site
  //   country        → pays (affiché sur la carte / filtre)
  //   slug           → identifiant URL unique ex: "volontariat-kenya-faune-sauvage"
  //                    → utilisé dans l'URL : /missions/volontariat-kenya-faune-sauvage
  //   description    → texte long affiché sur la page détail
  //   volunteer_role → ce que fait concrètement le bénévole
  //   programme      → déroulé journalier (\n = saut de ligne)
  //   included       → ce qui est compris dans le tarif
  //   not_include    → ce qui n'est PAS compris (important pour éviter les surprises)
  //   admin_info     → note interne / info pratique pour les candidats
  //   health_info    → vaccins et précautions sanitaires
  //   helloasso_url  → lien de paiement / inscription HelloAsso
  //   is_active      → true = visible sur le site / false = archivée
  //
  // Pourquoi upsert sur le slug ?
  //   Le slug est @unique dans le schéma.
  //   upsert évite les doublons si le seed est relancé.
  //   update: {} = si la mission existe déjà, on ne la modifie pas.
  //
  // Pourquoi récupérer le résultat dans une variable (missionKenya, etc.) ?
  //   Prisma retourne l'objet créé/trouvé avec son id généré automatiquement.
  //   On a besoin de cet id pour créer les pricing et locations liés.
  // ============================================================

  // ── Mission 1 : Kenya ──────────────────────────────────────
  const missionKenya = await prisma.mission.upsert({
    where: { slug: "volontariat-kenya" },
    update: { type: "volontariat_individuel", title: "Volontariat au Kenya", short_description: "Patrouilles avec les rangers, recensement de la faune et échanges interculturels avec les élèves kényans.", image_url: "/images/kenya.jpg" },
    create: {
      type: "volontariat_individuel",
      title: "Volontariat au Kenya",
      country: "Kenya",
      slug: "volontariat-kenya",
      image_url: "/images/kenya.jpg",
      short_description: "Patrouilles avec les rangers, recensement de la faune et échanges interculturels avec les élèves kényans.",
      description: "Participez à la protection de la faune sauvage dans la région de Voi, au pied du Kilimandjaro. Vous travaillerez au sein d'un sanctuaire animalier aux côtés de rangers locaux et de coordinateurs biodiversité pour contribuer aux projets de conservation et de développement communautaire.",
      volunteer_role: "Observation et suivi de la faune (GPS, photos, notes d'observation), participation aux projets de développement communautaire, soutien aux équipes locales sur les priorités du sanctuaire.",
      programme: "Jour 1 : Transfert depuis l'aéroport, déjeuner, installation, briefing et orientation avant le dîner.\nJour 2 : Formation sur l'observation de la faune, recommandations sécurité, rencontre avec le référent rangers et le chargé des projets biodiversité, présentation de la communauté locale.\nJours 3-6 : Programme des volontaires — 4 jours enrichissants en participant aux projets de développement.\nWeek-end : Quartier libre — visite des Sanctuaires, Parc Tsavo, Hell's Gate, Lac Naivasha, Parc Amboseli ou côte océanienne de Mombasa.\nJours 9-13 : Finalisation du programme de développement avec les communautés.\nJour 14 : Séparation avec la communauté et transfert vers l'aéroport.",
      included: "Hébergement sur place, repas, encadrement par le coordinateur local, formation pré-mission, transport depuis/vers l'aéroport de Nairobi.",
      not_include: "Billet d'avion international, assurance voyage, vaccins, visa Kenya, dépenses personnelles.",
      admin_info: "La nature exacte du travail dépendra des priorités du Sanctuaire. En tant que volontaire, il est important de rester flexible.",
      health_info: "Vaccins recommandés : fièvre jaune, hépatite A et B, typhoïde, méningite. Traitement antipaludéen obligatoire. Prévoir répulsifs et protection solaire.",
      helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
      is_active: true, // true = mission visible sur le site public
    }
  })

  // ── Mission 2 : Sénégal ────────────────────────────────────
  const missionSenegal = await prisma.mission.upsert({
    where: { slug: "volontariat-senegal" },
    update: { type: "volontariat_individuel", title: "Volontariat au Sénégal", short_description: "Correspondances scolaires, jardins potagers, reboisement de la mangrove et appui aux femmes maraîchères.", image_url: "/images/senegal.jpg" },
    create: {
      type: "volontariat_individuel",
      title: "Volontariat au Sénégal",
      country: "Sénégal",
      slug: "volontariat-senegal",
      image_url: "/images/senegal.jpg",
      short_description: "Correspondances scolaires, jardins potagers, reboisement de la mangrove et appui aux femmes maraîchères.",
      description: "Rejoignez nos projets de développement en Casamance, dans la région de Ziguinchor. Entre correspondance scolaire, jardins potagers, filtres à eau et visites terrain, vous contribuerez directement à l'amélioration des conditions de vie des communautés locales.",
      volunteer_role: "Correspondance scolaire, visites terrain, suivi des projets (jardin potager, filtres à eau, puits), sensibilisation communautaire.",
      programme: "8h : Petit déjeuner.\n9h à 12h : Activités de la matinée — correspondance scolaire, visites terrain.\n12h : Déjeuner.\n14h à 17h : Visite de l'avancement des projets sur place — jardin potager, utilisation des filtres à eau et puits.\n19h : Dîner.",
      included: "Hébergement chez l'habitant ou en gîte local, repas, encadrement sur place, transport local.",
      not_include: "Billet d'avion, assurance voyage, vaccins, visa (ressortissants hors CEDEAO), dépenses personnelles.",
      admin_info: "La nature exacte du travail dépendra des priorités sur place. En tant que volontaire, il est important de rester flexible.",
      health_info: "Vaccins recommandés : fièvre jaune (obligatoire pour certains pays de transit), hépatite A, typhoïde. Traitement antipaludéen conseillé.",
      helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
      is_active: true,
    }
  })

  // ── Mission 3 : Pérou ──────────────────────────────────────
  const missionPerou = await prisma.mission.upsert({
    where: { slug: "volontariat-perou" },
    update: { type: "volontariat_individuel", title: "Volontariat au Pérou", short_description: "Soins aux animaux sauvages en réhabilitation et sensibilisation des communautés indigènes à la protection de l'Amazonie.", image_url: "/images/perou.jpg" },
    create: {
      type: "volontariat_individuel",
      title: "Volontariat au Pérou",
      country: "Pérou",
      slug: "volontariat-perou",
      image_url: "/images/perou.jpg",
      short_description: "Soins aux animaux sauvages en réhabilitation et sensibilisation des communautés indigènes à la protection de l\'Amazonie.",
      description: "Partez au cœur de l'Amazonie péruvienne, à Puerto Maldonado, pour participer à la protection de la biodiversité. Aux côtés des soigneurs locaux, vous prendrez soin des animaux du sanctuaire et participerez aux projets d'entretien et de conservation.",
      volunteer_role: "Préparation des régimes alimentaires, nourrissage des animaux (dont singes hurleurs), cueillette de feuilles sauvages, entretien et réparation des structures, nettoyage des enclos.",
      programme: "7h30 : Petit déjeuner pour les volontaires.\n8h00 : Préparation des régimes alimentaires pour les animaux.\n8h30-9h30 : Nourrir les animaux.\n10h00 : Cueillette de feuilles sauvages pour les singes hurleurs.\n11h00-13h00 : Projets spécifiques — entretien et réparation.\n13h00 : Déjeuner des volontaires.\n14h00 : Régime alimentaire de l'après-midi et alimentation des animaux.\n16h00 : Nettoyage des enclos et vaisselle.\n17h00 : Préparation de la soirée — couvertures et lait.\n18h00 : Temps de repos des bénévoles.\n19h00 : Dîner des bénévoles.\n20h00 : Activités bénévoles.",
      included: "Hébergement sur site, repas, encadrement par les coordinateurs locaux, formation à l'arrivée.",
      not_include: "Vols internationaux, assurance, visa, vaccins, équipement personnel.",
      admin_info: "Les activités varient selon les besoins du sanctuaire. Flexibilité indispensable.",
      health_info: "Vaccins recommandés : fièvre jaune (obligatoire), hépatite A et B, typhoïde, rage. Traitement antipaludéen obligatoire pour la région amazonienne.",
      helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
      is_active: true,
    }
  })

  // ── Mission 4 : Sri Lanka ──────────────────────────────────
  const missionSriLanka = await prisma.mission.upsert({
    where: { slug: "volontariat-sri-lanka" },
    update: { type: "volontariat_individuel", title: "Volontariat au Sri Lanka", short_description: "Prenez soin des éléphants du sanctuaire MEF et participez à la préservation de la biodiversité sri lankaise.", image_url: "/images/srilanka.jpg" },
    create: {
      type: "volontariat_individuel",
      title: "Volontariat au Sri Lanka",
      country: "Sri Lanka",
      slug: "volontariat-sri-lanka",
      image_url: "/images/srilanka.jpg",
      short_description: "Prenez soin des éléphants du sanctuaire MEF et participez à la préservation de la biodiversité sri lankaise.",
      description: "Engagez-vous pour la protection des éléphants d'Asie dans le sanctuaire de Kegalle. Une expérience unique alliant soins vétérinaires, observation de la faune et découverte de la médecine Ayurveda au cœur du Sri Lanka.",
      volunteer_role: "Préparation des médicaments et vitamines, nourrissage et examen vétérinaire, baignade des éléphants, nettoyage des enclos et litières, travaux de jardinage, peinture et recyclage dans le sanctuaire.",
      programme: "7h30 : Préparation des médicaments et vitamines des éléphants.\n8h00 : Nourrissage des éléphants et examen vétérinaire.\n8h30 : Nettoyage des enclos.\n9h00 : Petit déjeuner à la Colonial House.\n10h00 : Baignade des éléphants.\n11h00 : Nettoyage des litières.\n12h00-14h00 : Pause du midi.\n14h00 : Visite de la fabrique de papier Ecomaximus ou du jardin, apprentissage de la médecine Ayurveda et des plantes.\n15h00-17h00 : Travaux dans le sanctuaire (jardinage, peinture, recyclage).\n17h00-18h00 : Temps libre.\n18h00 : Dîner.",
      included: "Hébergement à la Colonial House, repas, encadrement vétérinaire, initiation à la médecine Ayurveda.",
      not_include: "Vols internationaux, assurance, visa Sri Lanka, vaccins, dépenses personnelles.",
      admin_info: "Le programme peut varier selon les besoins des éléphants et du sanctuaire.",
      health_info: "Vaccins recommandés : hépatite A et B, typhoïde, rage. Pas de risque paludéen majeur à Kegalle. Prévoir protection contre les moustiques.",
      helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
      is_active: true,
    }
  })

  // ── Mission 5 : Sumatra ────────────────────────────────────
  const missionSumatra = await prisma.mission.upsert({
    where: { slug: "volontariat-sumatra" },
    update: { type: "volontariat_individuel", title: "Volontariat à Sumatra", country: "Sumatra", short_description: "Cartographie des habitats d'orang-outans et création de corridors forestiers pour protéger la biodiversité.", image_url: "/images/sumatra.jpg" },
    create: {
      type: "volontariat_individuel",
      title: "Volontariat à Sumatra",
      country: "Sumatra",
      slug: "volontariat-sumatra",
      image_url: "/images/sumatra.jpg",
      short_description: "Cartographie des habitats d\'orang-outans et création de corridors forestiers pour protéger la biodiversité.",
      description: "Partez à Bohorok, Sumatra, pour contribuer à la conservation des orang-outans et à la préservation de la forêt tropicale. Entre observation de la faune, reboisement, projets éco-construction et soutien à l'école locale, chaque journée est une immersion totale dans la conservation.",
      volunteer_role: "Observation de la faune (GPS, photos, notes), activités de conservation (surveillance, corridors faune), projets plastique (Eco-Brick), pépinières et reboisement, soutien à l'école Selang Pangeran Jungle School.",
      programme: "6h30 : Observation de la faune — GPS, photos et notes d'observations.\n8h : Aide à la préparation du petit déjeuner.\n9h : Début des activités de conservation (surveillance, enquête et création de corridors pour la faune).\n12h : Aide à la préparation du déjeuner.\n13h à 17h : Selon les besoins du site — programme de conservation, projets plastique (Eco-Brick), pépinières et reboisement, entretien du jardin potager, projet école (aide aux cours d'anglais, sensibilisation environnementale).\n17h30 : Aide à la préparation du dîner.\n18h30 : Dîner.\n19h30-22h30 : Promenade nocturne (repérage de civettes, léopards, porcs-épics), détente, jeux de cartes, feu de camp et guitare.",
      included: "Hébergement en lodge dans la forêt, repas, encadrement par les coordinateurs locaux, équipement d'observation.",
      not_include: "Vols internationaux, assurance, visa Indonésie, vaccins, équipement personnel de randonnée.",
      admin_info: "La nature exacte du travail dépendra des priorités du Sanctuaire. En tant que volontaire, il est important de rester flexible.",
      health_info: "Vaccins recommandés : hépatite A et B, typhoïde, rage, encéphalite japonaise. Traitement antipaludéen recommandé. Prévoir répulsifs puissants.",
      helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
      is_active: true,
    }
  })

  // ── Mission 6 : Service civique Kenya ──────────────────────
  // Mission spécifique service civique — champs détail non nécessaires (pas de page détail)
  const missionScKenya = await prisma.mission.upsert({
    where: { slug: "service-civique-kenya" },
    update: { type: "service_civique", title: "Service civique au Kenya", image_url: "/images/service-civique-1.jpeg", },
    create: {
      type: "service_civique",
      title: "Service civique au Kenya",
      country: "Kenya",
      slug: "service-civique-kenya",
      image_url: "/images/service-civique-1.jpeg",
      short_description: "Auprès de l'école polytechnique de Taita Taveta, appui aux étudiants en tourisme, potager agroécologique et correspondances scolaires.",
      is_active: true,
    }
  })

  // ── Mission 7 : Service civique Sénégal ────────────────────
  // Mission spécifique service civique — champs détail non nécessaires (pas de page détail)
  const missionScSenegal = await prisma.mission.upsert({
    where: { slug: "service-civique-senegal" },
    update: { type: "service_civique", title: "Service civique au Sénégal", image_url: "/images/service-civique-2.jpg" },
    create: {
      type: "service_civique",
      title: "Service civique au Sénégal",
      country: "Sénégal",
      slug: "service-civique-senegal",
      image_url: "/images/service-civique-2.jpg",
      short_description: "Auprès de l'association AGADA en Casamance, reboisement de la mangrove, agriculture durable et suivi des projets d\'eau potable.",
      is_active: true,
    }
  })

  // ── Mission 8 : Groupe jeunes ──────────────────────────────
  // Une seule card pour les deux destinations Kenya + Sénégal
  const missionGroupeJeunes = await prisma.mission.upsert({
    where: { slug: "mission-groupe-jeunes" },
    update: { type: "groupe_jeunes", title: "Mission de groupe jeunes", image_url: "/images/groupe-jeune.jpg" },
    create: {
      type: "groupe_jeunes",
      title: "Mission de groupe jeunes",
      country: "Kenya & Sénégal",
      slug: "mission-groupe-jeunes",
      image_url: "/images/groupe-jeune.jpg",
      short_description: "Partez en groupe au Kenya ou au Sénégal pour des missions interculturelles et environnementales. Ouvert aux lycées, MJC et structures jeunesse.",
      is_active: true,
    }
  })

  // ── Mission 9 : Congé solidaire ────────────────────────────
  const missionCongeSolidaire = await prisma.mission.upsert({
    where: { slug: "conge-solidaire" },
    update: { type: "conge_solidaire", title: "Congé solidaire", image_url: "/images/conge-solidaire.jpg" },
    create: {
      type: "conge_solidaire",
      title: "Congé solidaire",
      country: "Kenya & Sénégal",
      slug: "conge-solidaire",
      image_url: "/images/conge-solidaire.jpg",
      short_description: "Partez en mission individuelle ou en groupe avec votre entreprise au Kenya ou au Sénégal. Mécénat de compétence déductible des impôts.",
      is_active: true,
    }
  })

  console.log(`Missions créées : Kenya, Sénégal, Pérou, Sri Lanka, Sumatra`)

  // ============================================================
  // ÉTAPE 3 — MISSION PRICING (tarifs par durée)
  // ============================================================
  // But : créer les lignes de tarif pour chaque mission.
  //       Ex : Kenya → 10 jours = 1175€ / 2 semaines = 1500€ / etc.
  //
  // Structure d'un pricing (cf. schema.prisma) :
  //   mission_id     → clé étrangère → lie ce tarif à une mission
  //                    On utilise l'id retourné par upsert() ci-dessus
  //   duration_label → texte affiché ("10 jours", "2 semaines"...)
  //   price          → prix en euros (type Decimal dans Prisma)
  //   display_order  → ordre d'affichage dans le tableau des prix
  //                    1 = affiché en premier, 2 = deuxième, etc.
  //
  // Pourquoi deleteMany + createMany plutôt qu'upsert ?
  //   MissionPricing n'a PAS de champ @unique dans le schéma.
  //   upsert nécessite un champ unique pour savoir quoi mettre à jour.
  //   Sans @unique → on ne peut pas upsert.
  //   Solution : on supprime tous les pricing des missions concernées,
  //   puis on les recrée proprement.
  //   Ne jamais faire ça en production avec de vraies données client !
  //   En dev c'est safe car ce sont des données de test.
  //
  // missionIds : tableau des ids pour cibler uniquement NOS missions
  //   → évite de supprimer des pricing d'autres missions qui
  //     auraient pu être créées manuellement dans le dashboard
  // ============================================================

  // Tableau des ids de nos 5 missions — utilisé dans les deleteMany
  const missionIds = [
    missionKenya.id,
    missionSenegal.id,
    missionPerou.id,
    missionSriLanka.id,
    missionSumatra.id,
    missionScKenya.id,
    missionScSenegal.id,
    missionGroupeJeunes.id,
    missionCongeSolidaire.id
  ]

  // Supprime les anciens pricing pour ces missions (évite les doublons au re-seed)
  await prisma.missionPricing.deleteMany({
    where: { mission_id: { in: missionIds } } // "in" = supprime pour tous les ids du tableau
  })

  // Recrée tous les pricing en une seule requête (plus performant que plusieurs create())
  await prisma.missionPricing.createMany({
    data: [
      // ── Kenya : 4 durées (10j / 2sem / 3sem / 4sem) ──
      { mission_id: missionKenya.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionKenya.id, duration_label: "2 semaines", price: 1500, display_order: 2 },
      { mission_id: missionKenya.id, duration_label: "3 semaines", price: 2000, display_order: 3 },
      { mission_id: missionKenya.id, duration_label: "4 semaines", price: 2500, display_order: 4 },

      // ── Sénégal : 3 durées (10j / 2sem / 3sem) ──
      { mission_id: missionSenegal.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionSenegal.id, duration_label: "2 semaines", price: 1500, display_order: 2 },
      { mission_id: missionSenegal.id, duration_label: "3 semaines", price: 2000, display_order: 3 },

      // ── Pérou : 2 durées (2sem / 3sem) ──
      { mission_id: missionPerou.id, duration_label: "2 semaines", price: 1500, display_order: 1 },
      { mission_id: missionPerou.id, duration_label: "3 semaines", price: 2000, display_order: 2 },

      // ── Sri Lanka : 2 durées (10j / 2sem) ──
      { mission_id: missionSriLanka.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionSriLanka.id, duration_label: "2 semaines", price: 1500, display_order: 2 },

      // ── Sumatra : 3 durées (10j / 2sem / 3sem) ──
      { mission_id: missionSumatra.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionSumatra.id, duration_label: "2 semaines", price: 1500, display_order: 2 },
      { mission_id: missionSumatra.id, duration_label: "3 semaines", price: 2000, display_order: 3 },

      // ── Service civique Kenya ──
      { mission_id: missionScKenya.id, duration_label: "3 mois", price: 0, display_order: 1 },
      { mission_id: missionScKenya.id, duration_label: "12 mois", price: 0, display_order: 2 },

      // ── Service civique Sénégal ──
      { mission_id: missionScSenegal.id, duration_label: "3 mois", price: 0, display_order: 1 },
      { mission_id: missionScSenegal.id, duration_label: "12 mois", price: 0, display_order: 2 },

      // Groupe jeunes
      { mission_id: missionGroupeJeunes.id, duration_label: "10 jours", price: 0, display_order: 1 },

      // Congé solidaire
      { mission_id: missionCongeSolidaire.id, duration_label: "10 jours à 4 semaines", price: 0, display_order: 1 },
    ]
  })

  console.log("Pricing créé (14 lignes)")

  // ============================================================
  // ÉTAPE 4 — LOCATIONS (villes de départ des missions)
  // ============================================================
  // But : créer la ville associée à chaque mission.
  //       Affichée sur la page détail mission et sur la carte.
  //
  // Structure d'une location (cf. schema.prisma) :
  //   mission_id  → clé étrangère → une location appartient à UNE mission
  //   slug        → identifiant URL unique ex: "voi-kenya"
  //                 → utilisé dans l'URL : /lieux/voi-kenya
  //   name        → nom de la ville affiché sur le site
  //   country     → pays (peut être différent du pays de la mission si besoin)
  //   description → texte de présentation de la ville
  //   is_active   → true = lieu visible sur le site
  //
  // Pourquoi upsert sur le slug ?
  //   slug est @unique dans le schéma → upsert safe si seed relancé.
  //   update: {} = si la location existe déjà, on ne la modifie pas.
  // ============================================================

  // ── Location 1 : Voi (Kenya) ───────────────────────────────
  await prisma.location.upsert({
    where: { slug: "voi-kenya" },
    update: {},
    create: {
      mission_id: missionKenya.id, // liée à la mission Kenya créée juste au-dessus
      slug: "voi-kenya",
      name: "Voi",
      country: "Kenya",
      description: "Voi est une ville située dans le comté de Taita-Taveta, aux portes du Parc national de Tsavo Est. C'est le point de départ de nos missions de protection de la faune sauvage au Kenya. La région offre une biodiversité exceptionnelle avec lions, éléphants, girafes et une centaine d'espèces d'oiseaux.",
      is_active: true,
    }
  })

  // ── Location 2 : Ziguinchor (Sénégal) ─────────────────────
  await prisma.location.upsert({
    where: { slug: "ziguinchor-senegal" },
    update: {},
    create: {
      mission_id: missionSenegal.id,
      slug: "ziguinchor-senegal",
      name: "Ziguinchor",
      country: "Sénégal",
      description: "Ziguinchor est la capitale de la Casamance, région au sud du Sénégal connue pour sa verdure exceptionnelle et sa culture rica. Nos missions de développement communautaire s'y déroulent dans un cadre chaleureux, au contact direct des familles locales.",
      is_active: true,
    }
  })

  // ── Location 3 : Puerto Maldonado (Pérou) ─────────────────
  await prisma.location.upsert({
    where: { slug: "puerto-maldonado-perou" },
    update: {},
    create: {
      mission_id: missionPerou.id,
      slug: "puerto-maldonado-perou",
      name: "Puerto Maldonado",
      country: "Pérou",
      description: "Puerto Maldonado est la capitale de la région de Madre de Dios, aux portes de la Réserve nationale de Tambopata en Amazonie péruvienne. C'est l'un des points d'entrée les plus importants pour la biodiversité amazonienne. Nos missions de protection de la faune s'y déroulent dans un sanctuaire animalier.",
      is_active: true,
    }
  })

  // ── Location 4 : Kegalle (Sri Lanka) ──────────────────────
  await prisma.location.upsert({
    where: { slug: "kegalle-sri-lanka" },
    update: {},
    create: {
      mission_id: missionSriLanka.id,
      slug: "kegalle-sri-lanka",
      name: "Kegalle",
      country: "Sri Lanka",
      description: "Kegalle est une ville de la province de Sabaragamuwa, dans les collines verdoyantes du centre du Sri Lanka. Notre sanctuaire d'éléphants y accueille des éléphants blessés ou orphelins dans un cadre naturel préservé, loin du tourisme de masse.",
      is_active: true,
    }
  })

  // ── Location 5 : Bohorok (Sumatra) ────────────────────────
  await prisma.location.upsert({
    where: { slug: "bohorok-sumatra" },
    update: {},
    create: {
      mission_id: missionSumatra.id,
      slug: "bohorok-sumatra",
      name: "Bohorok",
      country: "Indonésie",
      description: "Bohorok est un village situé à l'orée du Parc national de Gunung Leuser, à Sumatra Nord. Ce parc est l'un des derniers endroits au monde où cohabitent orang-outans, tigres de Sumatra, rhinocéros et éléphants. Nos missions de conservation s'y déroulent en immersion totale dans la forêt tropicale.",
      is_active: true,
    }
  })

  console.log("Locations créées (5)")

  // ============================================================
  // ÉTAPE 5 — TÉMOIGNAGES
  // ============================================================
  // But : créer des témoignages réalistes pour tester :
  //   - l'affichage sur la page /temoignages (status = "approved")
  //   - le carousel de la page d'accueil (show_homepage = true)
  //   - la modération dans le dashboard admin (status = "pending")
  //
  // Structure d'un témoignage (cf. schema.prisma) :
  //   mission_id    → mission concernée (optionnel, peut être null)
  //   author_name   → prénom + initiale du nom (anonymisation partielle)
  //   content       → texte du témoignage
  //   status        → "pending" = en attente de modération
  //                   "approved" = validé, visible sur le site
  //                   "rejected" = refusé, non affiché
  //   show_homepage → true = apparaît dans le carousel de l'accueil
  //                   Règle métier : ne peut être true que si status = "approved"
  //   consent_given → true = le bénévole a coché la case RGPD
  //                   Ne jamais afficher un témoignage sans consent_given = true
  //
  // Pourquoi deleteMany + createMany ?
  //   Testimonial n'a pas de champ @unique → upsert impossible.
  //   On supprime d'abord les témoignages liés à nos missions,
  //   puis on les recrée. Safe en dev uniquement.
  // ============================================================

  // Supprime les témoignages liés à nos missions
  await prisma.testimonial.deleteMany({
    where: { mission_id: { in: missionIds } }
  })

  // Supprime aussi le témoignage sans mission (le "pending" de test)
  await prisma.testimonial.deleteMany({
    where: { mission_id: null }
  })

  await prisma.testimonial.createMany({
    data: [
      // ── Témoignage 1 : Kenya — approuvé, visible en accueil ──
      {
        mission_id: missionKenya.id,
        author_name: "Sophie M.",
        content: "Une expérience qui a changé ma façon de voir le monde. Travailler avec les rangers du Kenya, observer les animaux à l'aube, comprendre les enjeux de conservation... Je reviendrai sans hésiter.",
        status: "approved",       // validé par l'admin → visible sur /temoignages
        show_homepage: true,      // apparaît dans le carousel de l'accueil
        consent_given: true,      // RGPD : consentement donné
      },

      // ── Témoignage 2 : Kenya — approuvé, page témoignages seulement ──
      {
        mission_id: missionKenya.id,
        author_name: "Thomas R.",
        content: "Partir seul en Afrique pour la première fois, j'avais des appréhensions. L'équipe sur place a été incroyable. L'organisation était au top et je me suis senti utile dès le premier jour.",
        status: "approved",
        show_homepage: false,     // visible sur /temoignages mais PAS sur l'accueil
        consent_given: true,
      },

      // ── Témoignage 3 : Sri Lanka — approuvé, visible en accueil ──
      {
        mission_id: missionSriLanka.id,
        author_name: "Léa D.",
        content: "Donner le bain aux éléphants le matin, apprendre l'Ayurveda l'après-midi... Le Sri Lanka m'a offert une richesse humaine et culturelle que je n'attendais pas. Deux semaines trop courtes.",
        status: "approved",
        show_homepage: true,
        consent_given: true,
      },

      // ── Témoignage 4 : Sumatra — approuvé, visible en accueil ──
      {
        mission_id: missionSumatra.id,
        author_name: "Jules P.",
        content: "La nuit dans la forêt de Sumatra, à guetter les orang-outans avec une lampe frontale... Cette mission m'a réconcilié avec l'engagement écologique concret. Du vrai terrain, pas du greenwashing.",
        status: "approved",
        show_homepage: true,
        consent_given: true,
      },

      // ── Témoignage 5 : Pérou — approuvé, visible en accueil ──
      {
        mission_id: missionPerou.id,
        author_name: "Camille V.",
        content: "Je m'occupais des singes hurleurs en Amazonie péruvienne. Une mission intense, physique, parfois difficile. Mais voir un animal se remettre grâce à notre travail quotidien, c'est une émotion incomparable.",
        status: "approved",
        show_homepage: true,
        consent_given: true,
      },

      // ── Témoignage 6 : Sénégal — approuvé, page témoignages seulement ──
      {
        mission_id: missionSenegal.id,
        author_name: "Antoine B.",
        content: "La Casamance est une région magnifique et les projets sur place ont du sens. Filtre à eau, jardin potager, école... On voit vraiment l'impact de ce qu'on fait. Merci à toute l'équipe Sens Solidaire.",
        status: "approved",
        show_homepage: false,
        consent_given: true,
      },

      // ── Témoignage 7 : PENDING — pour tester la modération dashboard ──
      // mission_id: null → témoignage soumis sans préciser la mission
      // status: "pending" → apparaîtra dans la liste de modération du dashboard
      // show_homepage: false → jamais affiché publiquement tant que pas approuvé
      {
        mission_id: null,
        author_name: "Marie C.",
        content: "Je reviens d'une mission de 2 semaines et je voulais partager mon expérience. L'organisation était très professionnelle et les familles d'accueil formidables. Je recommande à 100%.",
        status: "pending",        // en attente → l'admin doit approuver ou rejeter
        show_homepage: false,
        consent_given: true,      // RGPD respecté même pour un pending
      },
    ]
  })

  console.log("Témoignages créés (7 : 6 approved, 1 pending)")

  // ============================================================
  // RÉCAP FINAL — affiché dans le terminal après le seed
  // ============================================================
  console.log("")
  console.log("Seed terminé avec succès !")
  console.log("─────────────────────────────────────────")
  console.log(`Admin      : admin@sensolidaire.org`)
  console.log(`Password   : Admin1234!`)
  console.log(`Missions   : 5 (Kenya, Sénégal, Pérou, Sri Lanka, Sumatra)`)
  console.log(`Pricing    : 14 lignes`)
  console.log(`Locations  : 5 (Voi, Ziguinchor, Puerto Maldonado, Kegalle, Bohorok)`)
  console.log(`Témoignages: 7 (6 approved, 1 pending)`)
  console.log("─────────────────────────────────────────")
  console.log("Changer le mot de passe admin AVANT la mise en production !")
}

// ============================================================
// EXÉCUTION DU SEED
// ============================================================
// On appelle seed() et on gère deux cas :
//
// .catch() → si une erreur Prisma survient (connexion échouée,
//            contrainte violée, etc.), on l'affiche et on quitte
//            avec le code 1 (= erreur) pour signaler l'échec
//            au terminal / CI/CD
//
// .finally() → s'exécute TOUJOURS, qu'il y ait eu erreur ou non
//              prisma.$disconnect() ferme la connexion à PostgreSQL
//              Sans ça, le process Node reste ouvert indéfiniment
// ============================================================
seed()
  .catch((error) => {
    console.error("Erreur seed :", error)
    process.exit(1) // code de sortie 1 = échec (0 = succès)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
