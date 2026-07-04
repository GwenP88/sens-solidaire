// ============================================================
// prisma/seed.js
// ============================================================
// Rôle : peupler la base de données avec des données de test
//        réalistes issues du vrai site Sens Solidaire
//
// Données insérées :
//   - 1  admin           (compte de connexion au dashboard)
//   - 9  missions        (Kenya, Sénégal, Pérou, Sri Lanka, Sumatra,
//                         SC Kenya, SC Sénégal, Groupe jeunes, Congé solidaire)
//   - 20 lignes pricing  (durées et tarifs par mission)
//   - 13 locations       (lieux partenaires par mission)
//   - 7  témoignages     (6 approuvés, 1 en attente de modération)
//
// Exécution (depuis la racine du projet) :
//   docker-compose exec backend node prisma/seed.js
//
// Comportement si relancé :
//   - Admin, missions, locations → upsert (update: data = tout est mis à jour)
//   - Pricing, témoignages       → deleteMany + recreate (pas de @unique)
// ============================================================

import "dotenv/config"
import bcrypt from "bcrypt"
import prisma from "../src/config/db.js"

// ── Placeholders galerie (4 emplacements visuels pour le carrousel) ──
const GALLERY_PLACEHOLDERS = [
  '/images/placeholders/placeholder-galerie-1.png',
  '/images/placeholders/placeholder-galerie-2.png',
  '/images/placeholders/placeholder-galerie-3.png',
  '/images/placeholders/placeholder-galerie-4.png',
]

const seed = async () => {
  console.log("Démarrage du seed...")

  // ============================================================
  // 1 — ADMIN
  // ============================================================

const password_hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

  const admin = await prisma.admin.upsert({
    where: { email: "admin@sensolidaire.org" },
    update: {},
    create: {
      email: "admin@sensolidaire.org",
      password_hash,
      role: "admin"
    }
  })
  console.log(`Admin : ${admin.email}`)

  // ============================================================
  // 2 — MISSIONS
  // ============================================================

  // ── Mission 1 : Kenya ──────────────────────────────────────
  const kenyaData = {
    type: "volontariat_individuel",
    title: "Mission de volontariat au Kenya",
    country: "Kenya",
    image_url: "/images/missions/kenya.jpg",
    short_description: "Patrouilles avec les rangers, suivi de la faune et échanges avec des élèves kényans.",
    description: "Partez au Kenya pour contribuer à la préservation de la biodiversité aux côtés des communautés locales, des étudiants et des rangers. Entre réserves naturelles, projets éducatifs et initiatives de développement durable, vivez une expérience immersive, utile et profondément humaine.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Patrouilles avec les rangers et participation aux actions de conservation de la biodiversité.</li><li>Recensement de la faune sauvage et des espèces d'oiseaux.</li><li>Entretien des équipements et appui aux projets environnementaux.</li><li>Mise en place et suivi des correspondances scolaires entre la France et le Kenya.</li><li>Accompagnement des élèves et étudiants dans leurs projets éducatifs et interculturels.</li><li>Partage de compétences selon votre expérience : informatique, gestion de projet, tourisme solidaire, hôtellerie, restauration, communication, etc.</li><li>Soutien aux initiatives locales de développement durable, d'agroécologie et d'entrepreneuriat.</li></ul>",
    programme: "Jour 1 : Transfert depuis l'aéroport, déjeuner, installation, briefing et orientation avant le dîner.\nJour 2 : Formation sur l'observation de la faune, recommandations sécurité, rencontre avec le référent rangers et le chargé des projets biodiversité, présentation de la communauté locale.\nJours 3-6 : Programme des volontaires : 4 jours enrichissants en participant aux projets de développement.\nWeek-end : Quartier libre — visite des Sanctuaires, Parc Tsavo, Hell's Gate, Lac Naivasha, Parc Amboseli ou côte océanienne de Mombasa.\nJours 9-13 : Finalisation du programme de développement avec les communautés.\nJour 14 : Séparation avec la communauté et transfert vers l'aéroport.",
    included: "Les frais de mission comprennent l'hébergement, la restauration, les déplacements sur place ainsi que l'encadrement par nos équipes et partenaires locaux.",
    not_include: "Les frais de mission ne comprennent pas l'adhésion à l'association (25 €), les billets d'avion (~700 €, avec option annulation fortement recommandée), l'assurance voyage, les frais de visa (32 €), ainsi que les éventuels vaccins et frais de pharmacie et les activités du week-end et les déplacements personnels hors programme.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Mombasa ou Paris › Nairobi",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et ous les envoyer",
      "Payer les frais de mission, adhérer à l'association (25€)",
      "Signer les termes d'engagement",
      "Recevoir les conseils pratiques de préparation",
      "Recevoir votre fiche mission à remplir à votre retour"
    ]),
    admin_info: "<ul><li>Évitez les périodes de fortes pluies, généralement entre mars-mai et novembre-décembre.</li><li>Un passeport valide au moins 6 mois après votre date de retour est requis.</li><li>L'obtention d'un visa est obligatoire pour entrer sur le territoire kenyan (32 €).</li><li>Comparez les offres de plusieurs compagnies : Kenya Airways, KLM, Ethiopian Airlines, Air France.</li></ul>",
    health_info: "<ul><li>Une bonne condition physique est recommandée pour participer à cette mission.</li><li>Un certificat médical d'aptitude délivré par votre médecin vous sera demandé avant le départ.</li><li>Les vaccinations obligatoires doivent être à jour. La vaccination contre la fièvre jaune est requise.</li><li>Un traitement antipaludéen devra être prescrit par votre médecin en fonction de votre situation et des recommandations sanitaires en vigueur.</li></ul>",
    helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
    ministry_url: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/kenya/",
    is_active: true,
  }

  const missionKenya = await prisma.mission.upsert({
    where: { slug: "volontariat-kenya-environnement-biodiversite" },
    update: kenyaData,
    create: { slug: "volontariat-kenya-environnement-biodiversite", ...kenyaData },
  })

  // ── Mission 2 : Sénégal ────────────────────────────────────
  const senegalData = {
    type: "volontariat_individuel",
    title: "Mission de volontariat au Sénégal",
    country: "Sénégal",
    image_url: "/images/missions/senegal.jpg",
    short_description: "Correspondances scolaires, reboisement de la mangrove, potager, soutien des femmes.",
    description: "Partez à la découverte de la Casamance et engagez-vous aux côtés de nos partenaires locaux à Ziguinchor. Entre échanges avec les écoles, soutien aux jardins potagers, projets d'accès à l'eau et rencontres avec les communautés, vous contribuerez à des actions concrètes tout en vivant une expérience humaine authentique au cœur du Sénégal.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Correspondance scolaire et échanges interculturels avec les élèves locaux.</li><li>Visites terrain et suivi des projets en cours.</li><li>Appui aux projets jardin potager, filtres à eau et puits.</li><li>Sensibilisation communautaire au développement durable.</li><li>Soutien aux groupements de femmes maraîchères.</li><li>Reboisement de la mangrove et actions environnementales.</li><li>Coordination des visioconférences collèges entre Nice et le Sénégal.</li><li>Contribution au chantier de digue sur l'île d'Effrane.</li></ul>",
    programme: "8h : Petit déjeuner.\n9h à 12h : Activités de la matinée — correspondance scolaire, visites terrain.\n12h : Déjeuner.\n14h à 17h : Visite de l'avancement des projets sur place — jardin potager, utilisation des filtres à eau et puits.\n19h : Dîner.",
    included: "Hébergement chez l'habitant ou en gîte local, repas, encadrement sur place, transport local.",
    not_include: "Billet d'avion (~800€, avec option annulation fortement recommandée), assurance voyage, vaccins, visa (ressortissants hors CEDEAO), dépenses personnelles.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Cap Skirring (la navette jusqu'à Ziguinchor).",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et ous les envoyer",
      "Payer les frais de mission, adhérer à l'association (25€)",
      "Signer les termes d'engagement",
      "Recevoir les conseils pratiques de préparation",
      "Recevoir votre fiche mission à remplir à votre retour"
    ]),
    admin_info: "<ul><li>La nature exacte du travail dépendra des priorités sur place.</li><li>En tant que volontaire, il est important de rester flexible.</li><li>Aucun visa requis pour les ressortissants de l'espace CEDEAO.</li><li>Compagnies recommandées : Cap Portugal, Air France, Royal Air Maroc.</li><li>Meilleure période : novembre à mai (saison sèche).</li></ul>",
    health_info: "<ul><li>Vaccins obligatoires: fièvre jaune.</li><li>Traitement antipaludéen obligatoire.</li><li>Un certificat médical d'aptitude sera demandé avant le départ.</li></ul>",
    helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
    ministry_url: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/senegal/",
    is_active: true,
  }

  const missionSenegal = await prisma.mission.upsert({
    where: { slug: "volontariat-senegal-casamance-agroecologie-mangrove" },
    update: senegalData,
    create: { slug: "volontariat-senegal-casamance-agroecologie-mangrove", ...senegalData },
  })

  // ── Mission 3 : Pérou ──────────────────────────────────────
  const perouData = {
    type: "volontariat_individuel",
    title: "Mission de volontariat au Pérou",
    country: "Pérou",
    image_url: "/images/missions/perou.jpg",
    short_description: "Soins aux animaux sauvages et sensibilisation des communautés à la protection de l'Amazonie.",
    description: "Rejoignez nos partenaires à Puerto Maldonado, au cœur de l'Amazonie péruvienne, et participez à des actions concrètes en faveur de la biodiversité. Aux côtés des équipes locales, vous contribuerez au soin des animaux du sanctuaire et aux actions de conservation menées sur le terrain. Une connaissance élémentaire de l'espagnol ou de l'anglais vous permettra de profiter pleinement de cette immersion et de faciliter les échanges avec les équipes locales.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Préparation des régimes alimentaires adaptés à chaque espèce.</li><li>Nourrissage des animaux, dont les singes hurleurs.</li><li>Cueillette de feuilles sauvages pour les animaux du sanctuaire.</li><li>Entretien et réparation des structures et enclos.</li><li>Nettoyage des espaces de vie des animaux.</li><li>Sensibilisation des communautés locales à la protection de l'Amazonie.</li><li>Soins aux perroquets, toucans, tapir.</li><li>Repérage des singes hurleurs en forêt primaire.</li><li>Sorties nocturnes pour recensement des douroucoulis.</li><li>Observation des singes laineux et atèles en réhabilitation.</li><li>Sorties dans les communautés indigènes.</li></ul>",
    programme: "7h30 : Petit déjeuner pour les volontaires.\n8h00 : Préparation des régimes alimentaires pour les animaux.\n8h30 à 9h30 : Nourrir les animaux.\n10h00 : Cueillette de feuilles sauvages pour les singes hurleurs.\n11h00 à 13h00 : Projets spécifiques — entretien et réparation.\n13h00 : Déjeuner des volontaires.\n14h00 : Régime alimentaire de l'après-midi et alimentation des animaux.\n16h00 : Nettoyage des enclos et vaisselle.\n17h00 : Préparation de la soirée — couvertures et lait.\n18h00 : Temps de repos des bénévoles.\n19h00 : Dîner des bénévoles. \n20h00 : Activités bénévoles du soir ou repos.",
    included: "Hébergement sur site, repas, encadrement par les coordinateurs locaux, formation à l'arrivée.",
    not_include: "Vols internationaux (~900€, avec option annulation fortement recommandée), assurance, visa, vaccins, équipement personnel.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Puerto Maldonado",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et ous les envoyer",
      "Payer les frais de mission, adhérer à l'association (25€)",
      "Signer les termes d'engagement",
      "Recevoir les conseils pratiques de préparation",
      "Recevoir votre fiche mission à remplir à votre retour"
    ]),
    admin_info: "<ul><li>Les activités varient selon les besoins du sanctuaire — flexibilité indispensable.</li><li>Un passeport valide est requis. Pas de visa pour les ressortissants français (séjour < 90 jours).</li><li>Prévoir des vêtements légers et imperméables adaptés au climat amazonien.</li><li>Compagnies recommandées : Iberia, LATAM, Air Europa, Air France, Delta, KLM.</li></ul>",
    health_info: "<ul><li>Les volontaires évoluent dans un environnement chaud et humide et participent à des activités physiques quotidiennes ; une bonne condition physique est donc recommandée.</li><li>Vaccins recommandés : fièvre jaune (obligatoire), hépatite A et B, typhoïde, rage.</li><li>Traitement antipaludéen obligatoire pour la région amazonienne.</li><li>Un certificat médical d'aptitude sera demandé avant le départ.</li></ul>",
    helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
    ministry_url: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/perou/",
    is_active: true,
  }

  const missionPerou = await prisma.mission.upsert({
    where: { slug: "volontariat-perou-amazonie-biodiversite" },
    update: perouData,
    create: { slug: "volontariat-perou-amazonie-biodiversite", ...perouData },
  })

  // ── Mission 4 : Sri Lanka ──────────────────────────────────
  const sriLankaData = {
    type: "volontariat_individuel",
    title: "Mission de volontariat au Sri Lanka",
    country: "Sri Lanka",
    image_url: "/images/missions/sri-lanka.jpg",
    short_description: "Soins aux éléphants du sanctuaire MEF et protection de la biodiversité sri-lankaise.",
    description: "Partez à la rencontre des éléphants d'Asie et contribuez à leur protection au sein du sanctuaire de Kegalle. Entre soins aux animaux, découverte de la faune locale et immersion dans les traditions sri-lankaises, vivez une expérience humaine et enrichissante au cœur du Sri Lanka. Une connaissance élémentaire de l'anglais est recommandée pour faciliter les échanges avec les équipes locales et profiter pleinement de cette immersion culturelle.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Préparation des médicaments et vitamines pour les éléphants.</li><li>Nourrissage et examen vétérinaire quotidien.</li><li>Baignade des éléphants.</li><li>Nettoyage des enclos et litières.</li><li>Travaux de jardinage, peinture et recyclage dans le sanctuaire.</li><li>Gestion des soins avec le Mahout attitré</li><li>Entretien du jardin biologique, plantation d'arbres fruitiers et plantes médicinales.</li><li>Initiation à la médecine Ayurveda et aux plantes locales.</li><li>Apprendre à reconnaître les sons, mouvements, humeurs de l'éléphant</li></ul>",
    programme: "7h30 : Préparation des médicaments et vitamines des éléphants.\n8h00 : Nourrissage des éléphants et examen vétérinaire.\n8h30 : Nettoyage des enclos.\n9h00 : Petit déjeuner à la Colonial House.\n10h00 : Baignade des éléphants.\n11h00 : Nettoyage des litières.\n12h00 à 14h00 : Pause du midi.\n14h00 : Visite de la fabrique de papier Ecomaximus ou du jardin, apprentissage de la médecine Ayurveda.\n15h00 à 17h00 : Travaux dans le sanctuaire (jardinage, peinture, recyclage).\n17h00 à 18h00 : Temps libre.\n18h00 : Dîner.",
    included: "Hébergement à la Colonial House, repas, encadrement vétérinaire, initiation à la médecine Ayurveda.",
    not_include: "Vols internationaux  (~800€, avec option annulation fortement recommandée), assurance, visa Sri Lanka (52€), vaccins, dépenses personnelles.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Colombo",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et ous les envoyer",
      "Payer les frais de mission, adhérer à l'association (25€)",
      "Signer les termes d'engagement",
      "Recevoir les conseils pratiques de préparation",
      "Recevoir votre fiche mission à remplir à votre retour"
    ]),
    admin_info: "<ul><li>Le programme peut varier selon les besoins des éléphants et du sanctuaire.</li><li>Un visa électronique (ETA) est obligatoire avant le départ. Les conditions et frais éventuels peuvent évoluer ; nous vous recommandons de consulter le site officiel des autorités sri-lankaises avant votre voyage</li><li>Prévoir des vêtements légers et confortables adaptés au climat tropical.</li><li>Compagnies recommandées : Air India, Emirates, Qatar Airways .</li></ul>",
    health_info: "<ul><li>Vaccins obligatoires à jour : hépatite A et B, typhoïde, rage.</li><li>Pas de risque paludéen majeur à Kegalle. Prévoir protection contre les moustiques.</li><li>Bonne condition physique recommandée : Un certificat médical d'aptitude sera demandé avant le départ.</li></ul>",
    helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
    ministry_url: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/sri-lanka/",
    is_active: true,
  }

  const missionSriLanka = await prisma.mission.upsert({
    where: { slug: "volontariat-sri-lanka-elephant-environnement" },
    update: sriLankaData,
    create: { slug: "volontariat-sri-lanka-elephant-environnement", ...sriLankaData },
  })

  // ── Mission 5 : Sumatra ────────────────────────────────────
  const sumatraData = {
    type: "volontariat_individuel",
    title: "Mission de volontariat à Sumatra",
    country: "Sumatra",
    image_url: "/images/missions/sumatra.jpg",
    short_description: "Cartographie et protection des orangs-outans, restauration des corridors forestiers.",
    description: "Partez au cœur de la forêt tropicale de Sumatra et engagez-vous aux côtés de nos partenaires locaux pour protéger les orangs-outans et préserver l'un des écosystèmes les plus riches au monde. Entre observation de la faune, reboisement, projets d'éco-construction et échanges avec l'école du village, vivez une expérience humaine unique au plus près de la nature. Des bases en anglais sont recommandées pour faciliter les échanges avec les équipes locales et profiter pleinement de cette immersion.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Observation de la faune (GPS, photos, notes de terrain).</li><li>Activités de conservation : surveillance, enquête et création de corridors pour la faune.</li><li>Projets plastique Eco-Brick et gestion des déchets.</li><li>Pépinières et reboisement de la forêt tropicale.</li><li>Entretien du jardin potager.</li><li>Soutien à l'école Selang Pangeran Jungle School (aide aux cours d'anglais, sensibilisation environnementale).</li><li>Cartographies GPS des habitats orang-outans et primates.</li><li>Développer un programme de reconstitution des espèces vulnérables.</li><li>Créer des corridors entre parcs nationaux et zone tampon.</li><li>Développer meilleures pratiques agriculture et écotourisme.</li></ul>",
    programme: "6h30 : Observation de la faune — GPS, photos et notes d'observations.\n8h00 : Aide à la préparation du petit déjeuner.\n9h00 : Début des activités de conservation (surveillance, enquête et création de corridors pour la faune).\n12h00 : Aide à la préparation du déjeuner.\n13h00 à 17h00 : Selon les besoins du site — programme de conservation, projets plastique (Eco-Brick), pépinières et reboisement, entretien du jardin potager, projet école.\n17h30 : Aide à la préparation du dîner.\n18h30 : Dîner.\n19h30 à 22h30 : Promenade nocturne (repérage de mycticèbes, civettes, léopards, porcs-épics), détente, feu de camp et guitare.",
    included: "Hébergement en lodge dans la forêt, repas, encadrement par les coordinateurs locaux, équipement d'observation.",
    not_include: "Vols internationaux (~800€, avec option annulation fortement recommandée), assurance, visa Indonésie (32€), vaccins, équipement personnel de randonnée.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Medan (Sumatra Nord)",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et ous les envoyer",
      "Payer les frais de mission, adhérer à l'association (25€)",
      "Signer les termes d'engagement",
      "Recevoir les conseils pratiques de préparation",
      "Recevoir votre fiche mission à remplir à votre retour"
    ]),
    admin_info: "<ul><li>La nature exacte du travail dépendra des priorités du sanctuaire — flexibilité indispensable.</li><li>Un visa à l'arrivée (Visa on Arrival) est disponible pour les ressortissants français.</li><li>Prévoir un équipement de randonnée adapté à la forêt tropicale humide.</li><li>Compagnies recommandées : Silkair, Lufthansa, Emirates, Swiss, Singapore Airlines, Malaysia Airlines.</li></ul>",
    health_info: "<ul><li>Aucune vaccination n'est obligatoire mais certaines sont recommandées : antituberculeuse, typhoïde, rage, encéphalite japonaise et les hépatites A et B.</li><li>Traitement antipaludéen recommandé. Prévoir répulsifs puissants.</li><li>Bonne condition physique recommandée : Un certificat médical d'aptitude sera demandé avant le départ.</li></ul>",
    helloasso_url: "https://www.helloasso.com/associations/sens-solidaires",
    ministry_url: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/indonesie/",
    is_active: true,
  }

  const missionSumatra = await prisma.mission.upsert({
    where: { slug: "volontariat-sumatra-biodiversite-orang-outan" },
    update: sumatraData,
    create: { slug: "volontariat-sumatra-biodiversite-orang-outan", ...sumatraData },
  })

  // ── Mission 6 : Service civique Kenya ──────────────────────
  const scKenyaData = {
    type: "service_civique",
    title: "Service civique au Kenya",
    country: "Kenya",
    image_url: "/images/missions/service-civique-1.jpeg",
    short_description: "Auprès de l'école polytechnique de Taita Taveta, appui aux étudiants en tourisme, potager agroécologique et correspondances scolaires.",
    is_active: true,
  }

  const missionScKenya = await prisma.mission.upsert({
    where: { slug: "service-civique-kenya" },
    update: scKenyaData,
    create: { slug: "service-civique-kenya", ...scKenyaData },
  })

  // ── Mission 7 : Service civique Sénégal ────────────────────
  const scSenegalData = {
    type: "service_civique",
    title: "Service civique au Sénégal",
    country: "Sénégal",
    image_url: "/images/missions/service-civique-2.jpg",
    short_description: "Auprès de l'association AGADA en Casamance, reboisement de la mangrove, agriculture durable et suivi des projets d'eau potable.",
    is_active: true,
  }

  const missionScSenegal = await prisma.mission.upsert({
    where: { slug: "service-civique-senegal" },
    update: scSenegalData,
    create: { slug: "service-civique-senegal", ...scSenegalData },
  })

 // ── Mission 9 : Service civique Cote d'Ivoire ───────────────

  const scCotedIvoireData = {
    type: "service_civique",
    title: "Service civique en Côte d'Ivoire",
    country: "Côte d'Ivoire",
    image_url: "/images/missions/service-civique-1.jpeg",
    short_description:
      "À Abidjan, participation aux actions de lutte contre la pollution plastique, aux ateliers d'éducation au développement durable et au suivi des projets environnementaux menés avec les partenaires locaux.",
    is_active: true,
  }

    const missionScCotedIvoire = await prisma.mission.upsert({
    where: { slug: "service-civique-cote-d-ivoire" },
    update: scCotedIvoireData,
    create: { slug: "service-civique-cote-d-ivoire", ...scCotedIvoireData },
  })

  // ── Mission 9 : Groupe jeunes ──────────────────────────────
  const groupeJeunesData = {
    type: "groupe_jeunes",
    title: "Mission de groupe jeunes",
    country: "Kenya & Sénégal",
    image_url: "/images/missions/groupe-jeune.jpg",
    short_description: "Partez en groupe au Kenya ou au Sénégal pour des missions interculturelles et environnementales. Ouvert aux lycées, MJC et structures jeunesse.",
    is_active: true,
  }

  const missionGroupeJeunes = await prisma.mission.upsert({
    where: { slug: "groupe-jeunes" },
    update: groupeJeunesData,
    create: { slug: "groupe-jeunes", ...groupeJeunesData },
  })

  // ── Mission 10 : Congé solidaire ────────────────────────────
  const congeSolidaireData = {
    type: "conge_solidaire",
    title: "Congé solidaire",
    country: "Kenya & Sénégal",
    image_url: "/images/missions/conge-solidaire.jpg",
    short_description: "Partez en mission individuelle ou en groupe avec votre entreprise au Kenya ou au Sénégal. Mécénat de compétence déductible des impôts.",
    is_active: true,
  }

  const missionCongeSolidaire = await prisma.mission.upsert({
    where: { slug: "conge-solidaire" },
    update: congeSolidaireData,
    create: { slug: "conge-solidaire", ...congeSolidaireData },
  })

  console.log("Missions créées : Kenya, Sénégal, Pérou, Sri Lanka, Sumatra, SC Kenya, SC Sénégal, Groupe jeunes, Congé solidaire")

  // ============================================================
  // 3 — MISSION PRICING
  // ============================================================

  const missionIds = [
    missionKenya.id,
    missionSenegal.id,
    missionPerou.id,
    missionSriLanka.id,
    missionSumatra.id,
    missionScKenya.id,
    missionScSenegal.id,
    missionScCotedIvoire.id,
    missionGroupeJeunes.id,
    missionCongeSolidaire.id
  ]

  await prisma.missionPricing.deleteMany({
    where: { mission_id: { in: missionIds } }
  })

  await prisma.missionPricing.createMany({
    data: [
      // ── Kenya : 4 durées ──
      { mission_id: missionKenya.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionKenya.id, duration_label: "2 semaines", price: 1500, display_order: 2 },
      { mission_id: missionKenya.id, duration_label: "3 semaines", price: 2000, display_order: 3 },
      { mission_id: missionKenya.id, duration_label: "4 semaines", price: 2500, display_order: 4 },

      // ── Sénégal : 3 durées ──
      { mission_id: missionSenegal.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionSenegal.id, duration_label: "2 semaines", price: 1500, display_order: 2 },
      { mission_id: missionSenegal.id, duration_label: "3 semaines", price: 2000, display_order: 3 },

      // ── Pérou : 2 durées ──
      { mission_id: missionPerou.id, duration_label: "2 semaines", price: 1500, display_order: 1 },
      { mission_id: missionPerou.id, duration_label: "3 semaines", price: 2000, display_order: 2 },

      // ── Sri Lanka : 2 durées ──
      { mission_id: missionSriLanka.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionSriLanka.id, duration_label: "2 semaines", price: 1500, display_order: 2 },

      // ── Sumatra : 3 durées ──
      { mission_id: missionSumatra.id, duration_label: "10 jours",   price: 1175, display_order: 1 },
      { mission_id: missionSumatra.id, duration_label: "2 semaines", price: 1500, display_order: 2 },
      { mission_id: missionSumatra.id, duration_label: "3 semaines", price: 2000, display_order: 3 },

      // ── Service civique Kenya ──
      { mission_id: missionScKenya.id, duration_label: "3 à 12 mois",  price: 0, display_order: 1 },

      // ── Service civique Sénégal ──
      { mission_id: missionScSenegal.id, duration_label: "3 mois à 12 mois",  price: 0, display_order: 1 },

      // ── Service civique Cote d'Ivoire ──
      { mission_id: missionScCotedIvoire.id, duration_label: "3 mois à 12 mois",  price: 0, display_order: 1 },

      // ── Groupe jeunes ──
      { mission_id: missionGroupeJeunes.id, duration_label: "10 jours à 3 semaines", price: 0, display_order: 1 },

      // ── Congé solidaire ──
      { mission_id: missionCongeSolidaire.id, duration_label: "10 jours à 4 semaines", price: 0, display_order: 1 },
    ]
  })

  console.log("Pricing créé (20 lignes)")

  // ============================================================
  // 4 — DELEGATIONS (avant les locations pour récupérer les IDs)
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
  const delegMef = await prisma.delegation.create({
    data: { pays: "Sri Lanka", flag_code: "lk", image_url: "/images/lieux-missions/mef-sri-lanka.jpg", lieu: "Millenium Elephant Foundation", contacts: "Nalaka — Chargé des volontaires, Sara — Coordinatrice des missions", display_order: 6 },
  })
  const delegAmazon = await prisma.delegation.create({
    data: { pays: "Pérou amazonien", flag_code: "pe", image_url: "/images/lieux-missions/amazon-shelter-perou.jpg", lieu: "Amazon Shelter", contacts: "Magali, Kim et Latam", display_order: 7 },
  })
  const delegBatu = await prisma.delegation.create({
    data: { pays: "Sumatra", flag_code: "id", image_url: "/images/lieux-missions/batu-kapal-sumatra.jpg", lieu: "Batu Kapal Conservation", contacts: "L'équipe Batu Kapal Conservation", display_order: 8 },
  })

  console.log('Délégations créées (8)')

  // ============================================================
  // 5 — LIEUX DE MISSION (avec delegation_id si disponible)
  // ============================================================

  // ── Voi — pas de délégation directe ───────────────────────
  const voiData = {
    name: "Voi",
    country: "Kenya",
    description: "Voi est une ville située dans le comté de Taita-Taveta, aux portes du Parc national de Tsavo Est. C'est le point de départ de nos missions de protection de la faune sauvage au Kenya.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15931.2071768332!2d38.54641188963989!3d-3.3984885449885964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18392955840748c1%3A0x612879b76e474c69!2sVoi%2C%20Kenya!5e0!3m2!1sen!2sfr!4v1783003244824!5m2!1sen!2sfr",
    website_url: null,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "voi-kenya" },
    update: voiData,
    create: { slug: "voi-kenya", mission_id: missionKenya.id, ...voiData },
  })

  // ── LUMO Community Wildlife Conservancy ────────────────────
  const lumoData = {
    name: "LUMO Community Wildlife Conservancy",
    country: "Kenya",
    description: "LUMO a vu le jour en 1997, d'un protocole d'entente entre trois ranchs de la zone des Taita Hills afin de lutter contre le braconnage et de protéger la diversité biologique kényane. Lumo fait partie du corridor historique de migration des éléphants reliant l'écosystème Tsavo aux collines de Shimba.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.506650684568!2d38.1950834105512!3d-3.4692507964905737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1838e44717c2d29d%3A0x94b99ab36036edac!2sLumo%20Community%20Wildlife%20Conservancy!5e0!3m2!1sen!2sfr!4v1783003373372!5m2!1sen!2sfr",
    website_url: "https://lumoconservancy.com/",
    delegation_id: delegLumo.id,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "lumo-kenya" },
    update: lumoData,
    create: { slug: "lumo-kenya", mission_id: missionKenya.id, ...lumoData },
  })

  const lumoLocation = await prisma.location.findUnique({ where: { slug: 'lumo-kenya' } })
  await prisma.media.deleteMany({ where: { entity_type: 'location', entity_id: lumoLocation.id } })
  await prisma.media.createMany({
    data: [
      { entity_type: 'location', entity_id: lumoLocation.id, file_url: '/images/placeholders/placeholder-galerie-1.png', file_type: 'image', display_order: 1 },
      { entity_type: 'location', entity_id: lumoLocation.id, file_url: '/images/placeholders/placeholder-galerie-2.png', file_type: 'image', display_order: 2 },
      { entity_type: 'location', entity_id: lumoLocation.id, file_url: '/images/placeholders/placeholder-galerie-3.png', file_type: 'image', display_order: 3 },
      { entity_type: 'location', entity_id: lumoLocation.id, file_url: '/images/placeholders/placeholder-galerie-4.png', file_type: 'image', display_order: 4 },
    ]
  })

  // ── Taita Taveta National Polytechnic ──────────────────────
  const ttnpData = {
    name: "Taita Taveta National Polytechnic",
    country: "Kenya",
    description: "Établissement d'enseignement supérieur de la ville de Voi, aux portes du Parc Tsavo. Cette université possède un pôle dédié au tourisme avec lequel nous travaillons particulièrement. Le campus est très engagé pour la biodiversité et possède sa propre pépinière.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.8655631167626!2d38.57651901055072!3d-3.3830053965774107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18392bfa98bf3af3%3A0xdbb9428c85b95a3c!2sTaita%20Taveta%20National%20Polytechnic%2C%20Voi!5e0!3m2!1sen!2sfr!4v1783003480686!5m2!1sen!2sfr",
    website_url: null,
    delegation_id: delegTtnp.id,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "ttnp-kenya" },
    update: ttnpData,
    create: { slug: "ttnp-kenya", mission_id: missionKenya.id, ...ttnpData },
  })

  // ── Elsa Conservation Trust ────────────────────────────────
  const ectData = {
    name: "Elsa Conservation Trust",
    country: "Kenya",
    description: "La Elsa Conservation Trust a fait don de millions de dollars à des projets de conservation de la vie sauvage, aidant à créer les parcs kenyans de Meru, Samburu, Shaba, Kora et Hells Gate. Le centre offre un environnement propice à la recherche ornithologique avec 450 espèces d'oiseaux recensées.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3086.1469911782483!2d36.31317642592106!3d-0.814968236091608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182938fec8ba611d%3A0x9c93221648e498ad!2sElsamere%20Conservation%20Centre!5e0!3m2!1sen!2sfr!4v1783003508532!5m2!1sen!2sfr",
    website_url: null,
    delegation_id: delegElsa.id,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "elsa-conservation-trust-kenya" },
    update: ectData,
    create: { slug: "elsa-conservation-trust-kenya", mission_id: missionKenya.id, ...ectData },
  })

  // ── Diani Turtle Watch — pas de délégation ─────────────────
  const dtwData = {
    name: "Diani Turtle Watch",
    country: "Kenya",
    description: "Diani Turtle Watch, créé en 2012, travaille avec une équipe de 14 observateurs couvrant 50 km sur la côte sud du Kenya. Les principales espèces suivies sont les tortues vertes et les tortues imbriquées. Il sensibilise les communautés locales, les écoles et les touristes aux espèces menacées.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.445318644362!2d39.569509510555534!3d-4.327148895628687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18404953574d39e9%3A0x76f7b649b72d4c05!2sDiani%20Turtle%20Watch!5e0!3m2!1sen!2sfr!4v1783003553259!5m2!1sen!2sfr",
    website_url: null,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "diani-turtle-watch-kenya" },
    update: dtwData,
    create: { slug: "diani-turtle-watch-kenya", mission_id: missionKenya.id, ...dtwData },
  })

  // ── Ziguinchor — pas de délégation directe ─────────────────
  const ziguinchorData = {
    name: "Ziguinchor",
    country: "Sénégal",
    description: "Ziguinchor est la capitale de la Casamance, région au sud du Sénégal connue pour sa verdure exceptionnelle et sa culture riche. Nos missions de développement communautaire s'y déroulent dans un cadre chaleureux, au contact direct des familles locales.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31154.710103122015!2d-16.294826054807107!3d12.559899910713627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee793dbd0cbdc17%3A0x25b90fb2e17e99df!2sZiguinchor%2C%20Senegal!5e0!3m2!1sen!2sfr!4v1783003576053!5m2!1sen!2sfr",
    website_url: null,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "ziguinchor-senegal" },
    update: ziguinchorData,
    create: { slug: "ziguinchor-senegal", mission_id: missionSenegal.id, ...ziguinchorData },
  })

  // ── ONG AGADA ──────────────────────────────────────────────
  const agadaData = {
    name: "ONG AGADA",
    country: "Sénégal",
    description: "AGADA (Agir Autrement pour le Développement en Afrique), basée à Ziguinchor en Casamance, œuvre pour le développement d'activités économiques locales. Investie depuis plus de 30 ans, elle soutient le reboisement de la mangrove, l'agriculture durable et la protection d'espèces patrimoniales comme le lamantin.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3894.3059138975273!2d-16.269258789351788!3d12.562068987665677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee791db8464e97b%3A0xa482f94cddde02ca!2sAgir%20Autrement%20pour%20le%20D%C3%A9veloppement%20de%20l&#39;Afrique%20(AGADA)!5e0!3m2!1sen!2sfr!4v1783003612281!5m2!1sen!2sfr",
    website_url: null,
    delegation_id: delegAgada.id,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "agada-senegal" },
    update: agadaData,
    create: { slug: "agada-senegal", mission_id: missionSenegal.id, ...agadaData },
  })

  // ── Puerto Maldonado — pas de délégation directe ───────────
  const puertoData = {
    name: "Puerto Maldonado",
    country: "Pérou",
    description: "Puerto Maldonado est la capitale de la région de Madre de Dios, aux portes de la Réserve nationale de Tambopata en Amazonie péruvienne. C'est l'un des points d'entrée les plus importants pour la biodiversité amazonienne.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62298.00533978558!2d-69.23876695942893!3d-12.606926281720266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x917b4beea5e653b1%3A0xe6c855b71f8fb54f!2sPuerto%20Maldonado%2C%20Peru!5e0!3m2!1sen!2sfr!4v1783003639436!5m2!1sen!2sfr",
    website_url: null,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "puerto-maldonado-perou" },
    update: puertoData,
    create: { slug: "puerto-maldonado-perou", mission_id: missionPerou.id, ...puertoData },
  })

  // ── Amazon Shelter ─────────────────────────────────────────
  const amazonData = {
    name: "Amazon Shelter",
    country: "Pérou",
    description: "Le centre de réhabilitation Amazon Shelter, proche de Puerto Maldonado, est axé sur la conservation des singes laineux et d'atèles. Amazon Shelter poursuit un travail de plantation d'espèces sauvages menacées sur 90 hectares : cèdres blancs, acajous, fruitiers sauvages et palmiers.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.0502139918294!2d-69.19734378935038!3d-12.644710587589872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x917b4b804f0f8d55%3A0xed30946df67f6bd2!2sAmazon%20Shelter!5e0!3m2!1sen!2sfr!4v1783003667486!5m2!1sen!2sfr",
    website_url: null,
    delegation_id: delegAmazon.id,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "amazon-shelter-perou" },
    update: amazonData,
    create: { slug: "amazon-shelter-perou", mission_id: missionPerou.id, ...amazonData },
  })

  // ── Kegalle — pas de délégation directe ───────────────────
  const kegalleData = {
    name: "Kegalle",
    country: "Sri Lanka",
    description: "Kegalle est une ville de la province de Sabaragamuwa, dans les collines verdoyantes du centre du Sri Lanka. Notre sanctuaire d'éléphants y accueille des éléphants blessés ou orphelins dans un cadre naturel préservé, loin du tourisme de masse.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15831.55592355434!2d80.33539999007992!3d7.253474533565451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae316b5affca98d%3A0xec4aece6bdbb55b1!2sKegalle%2C%20Sri%20Lanka!5e0!3m2!1sen!2sfr!4v1783003694518!5m2!1sen!2sfr",
    website_url: null,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "kegalle-sri-lanka" },
    update: kegalleData,
    create: { slug: "kegalle-sri-lanka", mission_id: missionSriLanka.id, ...kegalleData },
  })

  // ── Millenium Elephant Foundation ─────────────────────────
  const mefData = {
    name: "Millenium Elephant Foundation",
    country: "Sri Lanka",
    description: "La Millenium Elephant Foundation (MEF) créée en 1999 à Kegalle a pour objectif la protection des éléphants sauvages et domestiques du Sri Lanka. Les éléphants malades et maltraités y sont accueillis. Plus de 60 éléphants ont pu y être hébergés.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6985117037166!2d80.3810469105785!3d7.275106092701699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3143ebe9f66e9%3A0x51d428851f9df151!2sMillennium%20Elephant%20Foundation!5e0!3m2!1sen!2sfr!4v1783003735878!5m2!1sen!2sfr",
    website_url: null,
    delegation_id: delegMef.id,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "mef-sri-lanka" },
    update: mefData,
    create: { slug: "mef-sri-lanka", mission_id: missionSriLanka.id, ...mefData },
  })

  // ── Bohorok — pas de délégation directe ───────────────────
  const bohorokData = {
    name: "Bohorok",
    country: "Indonésie",
    description: "Bohorok est un village situé à l'orée du Parc national de Gunung Leuser, à Sumatra Nord. Ce parc est l'un des derniers endroits au monde où cohabitent orang-outans, tigres de Sumatra, rhinocéros et éléphants.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15929.235224148893!2d98.1430297896486!3d3.515888843097633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3030c7979b829cad%3A0x68ae15ff22e32241!2sBohorok%2C%20Timbang%20Lawan%2C%20Bohorok%2C%20Langkat%20Regency%2C%20North%20Sumatra%2C%20Indonesia!5e0!3m2!1sen!2sfr!4v1783003766296!5m2!1sen!2sfr",
    website_url: null,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "bohorok-sumatra" },
    update: bohorokData,
    create: { slug: "bohorok-sumatra", mission_id: missionSumatra.id, ...bohorokData },
  })

  // ── Batu Kapal Conservation ────────────────────────────────
  const batuKapalData = {
    name: "Batu Kapal Conservation",
    country: "Indonésie",
    description: "Le sanctuaire de Batu Kapal se trouve au cœur de la forêt qui surplombe le parc national Gunung Leuser, classé au patrimoine mondial de l'UNESCO. Il accueille des visites fréquentes d'orangs-outans, espèce en danger critique dont la population a diminué de 86% en 100 ans.",
    image_url: null,
    map_url : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.2984708366107!2d98.1213742105514!3d3.518308196441196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3030b99d565bdb21%3A0x190b2c3beaad7a36!2sBatu%20Kapal%20Conservation!5e0!3m2!1sen!2sfr!4v1783003793658!5m2!1sen!2sfr",
    website_url: null,
    delegation_id: delegBatu.id,
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "batu-kapal-sumatra" },
    update: batuKapalData,
    create: { slug: "batu-kapal-sumatra", mission_id: missionSumatra.id, ...batuKapalData },
  })

  console.log("Locations créées (13)")

  // ============================================================
  // 6 — TÉMOIGNAGES
  // ============================================================

  await prisma.testimonial.deleteMany({
    where: { mission_id: { in: missionIds } }
  })
  await prisma.testimonial.deleteMany({
    where: { mission_id: null }
  })

  await prisma.testimonial.createMany({
    data: [
      {
        mission_id: missionKenya.id,
        author_name: "Sophie M.",
        content: "Travailler aux côtés des rangers du sanctuaire LUMO, observer la faune à l'aube et échanger avec les communautés locales m'a profondément changé. Chaque journée apportait son lot de découvertes inoubliables. Je repars avec des souvenirs plein le cœur et l'envie de repartir !",
        status: "approved",
        show_homepage: true,
        consent_given: true,
      },
      {
        mission_id: missionKenya.id,
        author_name: "Thomas R.",
        content: "Partir seul en Afrique pour la première fois, j'avais des appréhensions. L'équipe sur place a été incroyable. L'organisation était au top et je me suis senti utile dès le premier jour.",
        status: "approved",
        show_homepage: false,
        consent_given: true,
      },
      {
        mission_id: missionSriLanka.id,
        author_name: "Léa D.",
        content: "Donner le bain aux éléphants le matin, apprendre l'Ayurveda l'après-midi... Le Sri Lanka m'a offert une richesse humaine et culturelle que je n'attendais pas. Deux semaines trop courtes.",
        status: "approved",
        show_homepage: true,
        consent_given: true,
      },
      {
        mission_id: missionSumatra.id,
        author_name: "Jules P.",
        content: "La nuit dans la forêt de Sumatra, à guetter les orang-outans avec une lampe frontale... Cette mission m'a réconcilié avec l'engagement écologique concret. Du vrai terrain, pas du greenwashing.",
        status: "approved",
        show_homepage: true,
        consent_given: true,
      },
      {
        mission_id: missionPerou.id,
        author_name: "Camille V.",
        content: "Je m'occupais des singes hurleurs en Amazonie péruvienne. Une mission intense, physique, parfois difficile. Mais voir un animal se remettre grâce à notre travail quotidien, c'est une émotion incomparable.",
        status: "approved",
        show_homepage: true,
        consent_given: true,
      },
      {
        mission_id: missionSenegal.id,
        author_name: "Antoine B.",
        content: "La Casamance est une région magnifique et les projets sur place ont du sens. Filtre à eau, jardin potager, école... On voit vraiment l'impact de ce qu'on fait. Merci à toute l'équipe Sens Solidaire.",
        status: "approved",
        show_homepage: false,
        consent_given: true,
      },
      {
        mission_id: missionSenegal.id,
        author_name: "Marie C.",
        content: "Je reviens d'une mission de 2 semaines et je voulais partager mon expérience. L'organisation était très professionnelle et les familles d'accueil formidables. Je recommande à 100%.",
        status: "pending",
        show_homepage: false,
        consent_given: true,
      },
    ]
  })

  console.log("Témoignages créés (7 : 6 approved, 1 pending)")

// ============================================================
// 7 — ACTIONS SUR LE TERRAIN
// ============================================================

const FIELD_ACTIONS = [

  // ══════════════════════════════════════════════════════════
  // ── KENYA ─────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════

  {
    slug: 'fabrique-papier-maktau-kenya',
    title: 'Fabrique de papier écologique de Maktau',
    description: 'Développement de la fabrique de papier écologique de Maktau',
    content: `Afin de permettre aux populations locales de développer une activité génératrice de revenus tout en préservant leur environnement, Sens Solidaires a accompagné le développement de la fabrique de papier écologique de Maktau, au Kenya. Ce projet repose sur la fabrication artisanale de papier recyclé à partir des fibres végétales naturellement présentes dans les déjections d'éléphant, une ressource locale abondante et renouvelable.\n\nLa fabrication du papier suit un procédé artisanal respectueux de l'environnement. Les déjections sont d'abord soigneusement lavées afin d'éliminer les impuretés, puis bouillies pendant plusieurs heures pour les stériliser et assouplir les fibres végétales. En parallèle, du papier recyclé est préparé avant d'être mélangé aux fibres dans des proportions équivalentes.\n\nLe mélange obtenu est ensuite broyé afin de former une pâte homogène. Un liant composé d'eau et d'une faible quantité de colle à bois est ajouté pour assurer la cohésion des fibres. La pâte est ensuite répartie sur des cadres grillagés qui permettent l'écoulement de l'eau. Après avoir retiré l'excédent d'humidité à l'aide d'une éponge, chaque feuille est laissée à sécher naturellement grâce à l'énergie du soleil et du vent, sans recours à des procédés industriels énergivores.\n\nUne fois le papier sec, les artisans fabriquent différents objets du quotidien et articles de papeterie : feuilles A4, cahiers, albums photos, cadres, cartes postales, enveloppes ou encore marque-pages. Certains produits sont décorés à la main ou réalisés sur commande selon les besoins. Une partie de cette production est utilisée dans les écoles françaises dans le cadre d'activités pédagogiques et artistiques, favorisant les échanges interculturels et la sensibilisation au développement durable.\n\nAu-delà de son caractère innovant, cette initiative contribue à la création d'emplois et de revenus pour les communautés locales, valorise une ressource naturelle disponible sur place, limite l'utilisation de bois dans la fabrication du papier et participe à la protection des éléphants ainsi qu'à la préservation de leur habitat naturel.\n\nEn soutenant cette filière artisanale ou en achetant les produits fabriqués à Maktau, chacun contribue au développement économique local tout en participant à la protection de la biodiversité et des ressources naturelles.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Biodiversité'],
    odds: [8, 12, 15],
    gallery: GALLERY_PLACEHOLDERS,
  },
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
    slug: 'fresque-camp-rangers-lumo',
    title: 'Réalisation d\'une fresque au camp des rangers',
    description: 'Les lycéens de l\'école Steiner ont embelli le camp de base des rangers de LUMO par la réalisation d\'une fresque mettant en avant les animaux emblématiques du sanctuaire.',
    content: `Les élèves ont mis à contribution leur talent artistique afin d'embellir le camp de base des rangers et des volontaires à LUMO Conservancy par la réalisation d'une fresque mettant en avant des animaux emblématiques du sanctuaire.\n\nLa fresque permet également de sensibiliser le public à la diversité de la faune locale et à l'importance de sa préservation. Elle a immédiatement attiré l'attention des visiteurs et des résidents locaux.\n\nAu total 7 demi-journées de travail ! Les élèves Steiner ont également pris de nouveau leurs pinceaux au CIT afin d'embellir la salle de français.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Biodiversité', 'Groupe jeunes'],
    odds: [15, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'rehabilitation-camp-base-lumo',
    title: 'Réhabilitation du camp de base — mobilier de récupération',
    description: 'Les lycéens de l\'école Steiner ont construit une table avec du matériel de récupération pour créer un espace convivial pour les rangers et les volontaires.',
    content: `Les élèves ont construit une table avec du matériel de récupération trouvé sur le camp de base : quelques rondins de bois éparpillés, un peu de fil de fer, et quelques heures de travail pour rendre plus confortable la vie au camp.\n\nCette table servira aux volontaires et aux rangers pour créer un espace convivial pour les repas en plein air. Un beau travail d'équipe qui illustre parfaitement les valeurs de débrouillardise et de solidarité de nos missions.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Groupe jeunes'],
    odds: [15, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'peinture-signaletique-lumo',
    title: 'Peinture de la signalétique du sanctuaire LUMO',
    description: 'Sur deux demi-journées, les élèves et les rangers ont rafraîchi la signalétique de l\'entrée du sanctuaire, améliorant l\'accueil des visiteurs.',
    content: `Sur deux demi-journées, les élèves et les rangers ont donné un coup de frais à la signalétique de l'entrée du sanctuaire, améliorant ainsi l'accueil des visiteurs et en évitant qu'ils ne s'aventurent dans des zones sensibles.\n\nLa signalétique repeinte donne une image positive du sanctuaire, reflétant son engagement envers la qualité et la sécurité. Un projet concret à fort impact visuel, réalisé en collaboration directe avec les équipes locales.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Groupe jeunes'],
    odds: [15, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'renovation-route-lumo',
    title: 'Rénovation de la route du sanctuaire LUMO',
    description: 'Pendant trois jours, les lycéens de l\'école Steiner ont rénové 2 km de route en terre pour faciliter les déplacements des habitants et des visiteurs.',
    content: `En discutant avec les rangers, l'équipe du LUMO mentionna la nécessité de réparer la route en terre depuis la "main gate" jusqu'à la route goudronnée, sur 2 km. Lorsqu'il pleut, cette route est très glissante et presque impraticable.\n\nPendant trois jours sur des créneaux de 2h30, le groupe s'est armé d'outils pour remplir des remorques entières de terre afin de l'étaler sur la route, comblant les nids de poule et remettant la surface à niveau.\n\nCe projet illustre comment la force collective des jeunes peut avoir un impact direct et durable sur les conditions de vie des communautés locales.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Groupe jeunes'],
    odds: [11, 15, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'sentier-botanique-lumo',
    title: 'Création d\'un sentier botanique au sanctuaire LUMO',
    description: '44 espèces de plantes identifiées, 80 recettes créées — les lycéens ont conçu un sentier botanique pour enrichir la connaissance de la biodiversité locale.',
    content: `Les élèves ont accompagné un de nos volontaires ethnobotaniste français afin de créer un sentier botanique pour le sanctuaire. Sur place, les rangers spécialistes de la flore, le groupe d'élèves et notre volontaire ont identifié 44 espèces de plantes et créé 80 recettes à partir de celles-ci.\n\nLe projet visait à enrichir la connaissance de la biodiversité locale et à faire découvrir la flore autant que la faune aux visiteurs. Des pancartes réalisées par les élèves répertorient les plantes identifiées et fournissent des informations éducatives sur les espèces.\n\nUne seconde mission est prévue pour poursuivre les recherches et renforcer l'impact positif sur la biodiversité locale.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Biodiversité', 'Éducation', 'Groupe jeunes'],
    odds: [4, 15, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'distribution-fournitures-scolaires-kenya',
    title: 'Distribution de fournitures scolaires dans les écoles primaires',
    description: 'Les lycéens de l\'école Steiner ont distribué des fournitures scolaires dans les écoles primaires du Kenya et échangé avec les élèves locaux.',
    content: `Le groupe est intervenu deux après-midis dans les écoles primaires du Kenya pour réaliser le projet de correspondance entre les écoliers français et kényans et faire don de fournitures scolaires.\n\nCes échanges ont permis aux enfants de découvrir à travers les lettres reçues et la rencontre avec les lycéens d'autres traditions et modes de vie, développant la tolérance et l'ouverture d'esprit.\n\nLes échanges permettent également aux élèves de discuter des impacts locaux du changement climatique et de partager des idées et des solutions en mettant la coopération internationale au cœur du défi.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Éducation', 'Échanges culturels', 'Groupe jeunes'],
    odds: [4, 17],
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
  {
    slug: 'construction-serre-ttnp',
    title: 'Construction d\'une serre en bouteilles plastiques recyclées',
    description: 'Les lycéens et les étudiants du TTNP ont construit ensemble une serre avec des bouteilles en plastique ramassées et nettoyées par une association locale.',
    content: `Pendant trois matinées, les élèves et les étudiants du TTNP ont construit une serre avec des bouteilles en plastique ramassées et nettoyées par une association locale.\n\nLa construction de cette serre sensibilise la communauté aux problèmes environnementaux liés aux déchets plastiques et à l'importance du recyclage, une problématique importante dans la région dont le TTNP se saisit ces dernières années.\n\nCe projet présente de nombreux intérêts : réduction des déchets plastiques, promotion de l'agriculture durable et engagement communautaire. La serre servira au stockage des plans de pépinières de l'établissement dans l'attente de leur plantation.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Agriculture', 'Groupe jeunes'],
    odds: [12, 13, 15, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'ferme-agro-ecologique-ttnp',
    title: 'Développement d\'une ferme agro-écologique au TTNP',
    description: 'En collaboration avec les étudiants kényans du Biodiversity Club, lancement d\'un projet de ferme agro-écologique sur 3 hectares au sein du campus universitaire.',
    content: `En collaboration avec les étudiants kényans du "Biodiversity Club", les prémices d'un projet de ferme agro-écologique ont été lancées. Fort de son expérience et de ses compétences, nos volontaires ont contribué à la mise en place de ce projet ambitieux visant à cultiver des fruits et légumes sur une parcelle de 3 hectares au sein du campus universitaire.\n\nLe projet se déroule en trois étapes : la première, déjà commencée par les élèves Steiner, couvre un demi-hectare. La deuxième étape verra une extension d'un hectare, suivie d'un agrandissement de 1,5 hectare pour atteindre la taille finale de 3 hectares.\n\nUn lombricompost sera installé pour produire un engrais naturel, garantissant l'utilisation exclusive de procédés naturels. L'élevage de poules et poulets sera également intégré à la parcelle pour compléter l'écosystème agro-écologique.`,
    countries: ['Kenya'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Agriculture', 'Environnement', 'Groupe jeunes'],
    odds: [2, 13, 15, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'correspondances-scolaires-france-kenya',
    title: 'Correspondances scolaires France — Kenya',
    description: 'Échanges épistolaires et rencontres interculturelles entre des écoles primaires françaises et kényanes sur les thèmes de la biodiversité et du développement durable.',
    content: `Depuis plusieurs années, Sens Solidaires organise des correspondances entre des écoles primaires françaises et kényanes. Ces échanges permettent aux enfants de découvrir d'autres traditions et modes de vie, développant la tolérance et l'ouverture d'esprit.\n\nLes élèves échangent sur leurs cultures, habitudes scolaires, alimentaires, musicales et sportives, mais aussi sur les impacts locaux du changement climatique et les solutions possibles à leur échelle.\n\nLe partenariat avec le TTNP a également permis de lancer des visioconférences entre étudiants français et kényans en tourisme, avec des échanges sur la biodiversité, la cuisine traditionnelle et la culture de chaque pays.`,
    countries: ['Kenya', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Éducation', 'Échanges culturels'],
    odds: [4, 10, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'partenariat-etudiants-ttnp',
    title: 'Partenariat étudiants français — TTNP (tourisme durable)',
    description: 'Dans le cadre du dispositif ISI du FONJEP, mise en lien d\'étudiants en tourisme avec leurs homologues kényans du TTNP de Voi via visioconférences et voyages.',
    content: `Dans le cadre du dispositif Initiative pour la Solidarité Internationale (ISI) du FONJEP, Sens Solidaires travaille à la mise en place d'un projet de mobilité internationale en partenariat avec le ministère des affaires étrangères et l'ambassade de France à Nairobi.\n\nCe projet met en lien des étudiants dans le secteur du tourisme avec leurs homologues kényans du Taita Taveta National Polytechnic (TTNP) de Voi. Débuté en janvier 2023 par des échanges interculturels par visioconférence, il porte sur la solidarité internationale, l'interculturalité, la culture et le patrimoine naturel de chaque pays.\n\nLes étudiants travaillent ensemble à un projet mêlant tourisme et protection de la biodiversité, dans l'objectif de promouvoir le sanctuaire de LUMO et d'y développer un tourisme durable, apportant ainsi les fonds nécessaires aux rangers pour la sauvegarde du sanctuaire.`,
    countries: ['Kenya', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Éducation', 'Échanges culturels'],
    odds: [4, 8, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },

  // ══════════════════════════════════════════════════════════
  // ── SÉNÉGAL ───────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════

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
    slug: 'correspondances-scolaires-senegal',
    title: 'Correspondances scolaires France — Sénégal',
    description: 'Échanges entre écoles de la Métropole de Nice et des établissements de Casamance sur le thème de la consommation responsable.',
    content: `En parallèle des projets de jardins potagers, les élèves de France et du Sénégal ont pu se rencontrer et échanger grâce au don d'un ordinateur portable au collège de Ziguinchor. Les élèves ont ainsi pu discuter de leurs cultures, habitudes scolaires, alimentaires, musicales, sportives, de leurs traditions et de production et consommation responsable. Une correspondance épistolaire a également été réalisée entre les élèves de Nice et de Ziguinchor dans le but de promouvoir la solidarité internationale.`,
    countries: ['Sénégal', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Éducation', 'Échanges culturels'],
    odds: [4, 10, 17],
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
  {
    slug: 'refection-puits-cem-kenia',
    title: 'Réfection du puits et forage électrique — CEM Kénia',
    description: 'Curage du puits, installation d\'un forage électrique et d\'une cuve de 1000L pour améliorer l\'accès à l\'eau de 2 000 élèves au CEM Kénia de Ziguinchor.',
    content: `Le CEM Kénia est un collège d'enseignement moyen situé à Ziguinchor en Casamance. Cet établissement accueille environ 2 000 élèves et ne possédait que trois robinets à débit très faible, quasi inexistant à partir de midi, ainsi qu'un puits hors d'usage.\n\nDans le cadre du projet CONCERTO 3, plusieurs actions ont été menées : curage du puits pour augmenter la profondeur et toucher la nappe, mise en place d'un forage électrique pour pomper l'eau, et installation d'une cuve de 1000L pour réguler le débit de sortie.\n\nCes travaux ont permis de faciliter l'accès à l'eau des élèves pendant la période la plus chaude de l'année, améliorant directement les conditions de scolarisation et de santé de l'ensemble de la communauté scolaire.`,
    countries: ['Sénégal'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Accès à l\'eau', 'Éducation'],
    odds: [3, 4, 6],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'digue-ile-efrane',
    title: 'Construction d\'une digue sur l\'île d\'Éfrane',
    description: 'Face à la montée des eaux due au dérèglement climatique, construction d\'une digue sur l\'île d\'Éfrane avec reboisement de cocotiers et de mangroves.',
    content: `Sur l'île d'Éfrane, le dérèglement climatique et la montée des eaux mettent en danger ce campement villageois. Avec notre partenaire sur place Mamadou Ndiaye, une digue a été mise en place, accompagnée d'un reboisement de cocotiers et de mangroves.\n\nLa réhabilitation des maisons sur pilotis est également primordiale : ce système de "maisons hors d'eau" permet, en cas d'inondation, de protéger les habitants. Ce projet permet également de créer de l'emploi pour les jeunes du village.\n\nLa MJC AGORA de Nice Est a organisé un voyage solidaire au Sénégal et les jeunes ont apporté leur main d'œuvre nécessaire à ce projet. À venir : installation d'épis maltais Savard pour lutter contre l'érosion du littoral de la Casamance.`,
    countries: ['Sénégal'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Accès à l\'eau'],
    odds: [11, 13, 14, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'projet-concerto-eau-senegal',
    title: 'Projet CONCERTO 3 — Eau et solidarité internationale',
    description: 'Projet de sensibilisation à la préservation de l\'eau entre trois établissements niçois et des écoles de Casamance, avec animations pédagogiques et échanges interculturels.',
    content: `Dans le cadre du projet CONCERTO 3, trois établissements niçois — le collège Raoul Dufy, le collège Roland Garros et le lycée les Palmiers — ont travaillé sur la préservation de la ressource en eau à travers différentes thématiques : pollution des eaux marines, risques naturels, et accès à l'eau et assainissement.\n\nDes animations pédagogiques ont été organisées : jeu "Habiter la terre en 2030" au lycée les Palmiers, jeu de rôle "Gare à l'eau !" au collège Raoul Dufy, et "Ma bouteille d'eau est vide" au collège Roland Garros. Des professionnels de la Régie Eau d'Azur et un hydrogéologue sont intervenus auprès des élèves.\n\nEn parallèle, des actions concrètes ont été menées au Sénégal : installation de filtres à eau à l'école Djibélor et réfection du puits du CEM Kénia. Les élèves des deux pays ont pu échanger sur les différences d'accès à l'eau dans leurs pays respectifs.`,
    countries: ['Sénégal', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Accès à l\'eau', 'Éducation', 'Échanges culturels'],
    odds: [3, 4, 6, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'exposition-casamance-annemasse',
    title: 'Exposition "De la Haute-Savoie à la Casamance"',
    description: 'Exposition itinérante présentant le travail de 60 éco-délégués sur la montée des eaux et le changement climatique, ayant sensibilisé 3 400 élèves.',
    content: `Dans le cadre du programme Éco-École, les éco-délégués du collège Michel Servet d'Annemasse ont travaillé sur la fonte des glaces et la montée des eaux. Ils ont réalisé des exposés et une exposition sur le sujet afin de sensibiliser leurs camarades à ces thématiques.\n\nLes éco-délégués se sont rendus à la Mer de Glace de Chamonix et ont constaté les conséquences du réchauffement climatique sur le glacier. En parallèle, les élèves de Ziguinchor ont mis en place un jardin potager et participé à la replantation de la mangrove avec AGADA.\n\nL'exposition a fait le tour de la ville : collège Michel Servet, mairie d'Annemasse, Cité de la solidarité internationale et bibliothèque de la ville. Au total, 3 400 élèves ont été sensibilisés au développement durable par les divers projets menés sur l'année scolaire 2021-2022.`,
    countries: ['Sénégal', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Éducation', 'Échanges culturels', 'Environnement'],
    odds: [4, 13, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },

  // ══════════════════════════════════════════════════════════
  // ── PÉROU ─────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════

  {
    slug: 'correspondances-amazonie',
    title: 'Correspondances avec les écoles d\'Amazonie',
    description: 'Suite à la rencontre avec le Chef Raoni, mise en place d\'une correspondance entre des écoles françaises et le peuple Kukama kukamiria.',
    content: `Notre organisation a reçu les 5ᵉ trophées de l'Environnement de la ville de Nice par le Cacique Raoni Metuktire, Chef du peuple Kayapo (Brésil) le 6 juin 2014. Lors de cet échange, nous avons promis au Grand Chef Raoni de présenter la culture du peuple Kayapo aux scolaires français et de mettre en place une correspondance avec une école d'Amazonie. Nous avons choisi le thème "Un jardin au cœur de la forêt". Dans la forêt tropicale vivent les Indiens qui savent tirer parti de leur environnement sans le détruire.`,
    countries: ['Pérou', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Éducation', 'Échanges culturels'],
    odds: [4, 10, 15],
    gallery: GALLERY_PLACEHOLDERS,
  },

  // ══════════════════════════════════════════════════════════
  // ── SRI LANKA ─────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════

  {
    slug: 'projet-puits-sri-lanka',
    title: 'Accès à l\'eau potable dans les écoles',
    description: 'Financement de forages dans les écoles du Sri Lanka pour garantir un accès durable à l\'eau potable.',
    content: `Nous finançons des forages dans les écoles du Sri Lanka pour garantir un accès durable à l'eau potable aux élèves et aux communautés locales. Ce projet contribue directement à l'amélioration des conditions de vie et de scolarisation des enfants, tout en renforçant la résilience des communautés face aux enjeux climatiques.`,
    countries: ['Sri Lanka'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Accès à l\'eau', 'Éducation'],
    odds: [3, 6, 4],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'fabrique-eco-maximus',
    title: 'Fabrique de papier Eco Maximus',
    description: 'Soutien à la fabrique Eco Maximus qui produit des objets artisanaux issus de bouse d\'éléphant au Sri Lanka.',
    content: `Sens Solidaires soutient la fabrique Eco Maximus en promouvant ses objets artisanaux issus de bouse d'éléphant, contribuant à la protection de la biodiversité et à l'économie locale au Sri Lanka. Cette initiative permet aux artisans locaux de valoriser des ressources naturelles tout en sensibilisant les visiteurs à la protection des éléphants et de leur habitat.`,
    countries: ['Sri Lanka'],
    image_url: '/images/actions-terrain/fabrique-eco-maximus-sri-lanka.jpg',
    tags: ['Environnement', 'Biodiversité'],
    odds: [8, 12, 15],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'barrieres-vegetales-sri-lanka',
    title: 'Barrières végétales — réduction des conflits Hommes/Éléphants',
    description: 'Mise en place de barrières végétales dans la région d\'Habarana pour protéger les cultures des fermiers des incursions d\'éléphants sauvages.',
    content: `Dans la région d'Habarana, les villages sont situés entre quatre parcs nationaux, entièrement entourés par la jungle, en plein milieu d'un corridor de migration des éléphants. Les éléphants sauvages traversent la région à la recherche de nourriture et d'eau, détruisant en quelques heures les seuls moyens de subsistance des fermiers démunis.\n\nPour répondre à cette problématique, nous avons mis en place des barrières végétales permettant aux familles cultivatrices d'obtenir un meilleur rendement tout en préservant la cohabitation avec les éléphants sauvages.\n\nCette approche naturelle et non invasive protège à la fois les moyens de subsistance des communautés locales et les corridors de migration essentiels à la survie des éléphants d'Asie.`,
    countries: ['Sri Lanka'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Biodiversité', 'Agriculture'],
    odds: [1, 2, 15],
    gallery: GALLERY_PLACEHOLDERS,
  },

  // ══════════════════════════════════════════════════════════
  // ── FRANCE / CÔTE D'IVOIRE ────────────────────────────────
  // ══════════════════════════════════════════════════════════

  {
    slug: 'nettoyage-plages-nice-abidjan',
    title: 'Nettoyage des plages Nice & lagune d\'Abidjan',
    description: 'Dans le cadre du jumelage Nice-Abidjan, les élèves ont nettoyé le front de mer niçois et la lagune Ébrié d\'Abidjan pour sensibiliser à la pollution des littoraux.',
    content: `Dans le cadre du jumelage entre Nice et Abidjan, les élèves de primaires de Nice et de l'Institut International George Aristide (IIGA) ont mené un projet commun sur l'ODD 11 "Villes et communautés durables" en mettant l'accent sur la pollution des littoraux.\n\nEn France, les élèves ont participé au nettoyage du front de mer niçois, avec un atelier de tri sélectif et une sensibilisation à la pollution aux mégots et ses conséquences pour les écosystèmes. À Abidjan, le nettoyage de la lagune Ébrié dans le village de Niangon-Lokoua a permis d'aménager une aire de jeux pour les enfants.\n\nCe nettoyage effectué en février 2024 a permis d'éduquer au développement durable à travers des animations sur les ODD, en particulier à la protection de la biodiversité (ODD 14) et à l'importance d'un environnement sain (ODD 11). L'objectif a également été d'impliquer les riverains à adopter un comportement responsable.`,
    countries: ['Côte d\'Ivoire', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Environnement', 'Éducation', 'Échanges culturels'],
    odds: [4, 11, 14, 17],
    gallery: GALLERY_PLACEHOLDERS,
  },
  {
    slug: 'correspondances-nice-abidjan',
    title: 'Correspondances scolaires Nice — Abidjan',
    description: 'Dans le cadre du jumelage Nice-Abidjan, échanges épistolaires entre élèves de primaire sur les thèmes de la santé par le sport et la pollution des littoraux.',
    content: `Dans le cadre du jumelage entre Nice et Abidjan, les élèves de primaires de Nice et de l'Institut International George Aristide (IIGA) ont débuté leur projet par une correspondance écrite apportée directement d'Abidjan par Gisèle Folarin, directrice de l'IIGA, avec le soutien de la ville de Nice.\n\nDans leurs lettres, les élèves ont abordé le sujet des sources de pollution dans la ville de Nice et de la Mer Méditerranée, ainsi que des actions éco-responsables qu'ils réalisent au quotidien : usage des transports doux, ramassage et tri des déchets.\n\nCes échanges ont permis aux enfants de découvrir d'autres cultures et traditions, de partager leurs expériences autour du thème de la santé par le sport et l'environnement propre, et de développer leur sens de la solidarité internationale.`,
    countries: ['Côte d\'Ivoire', 'France'],
    image_url: '/images/placeholders/placeholder-galerie-1.png',
    tags: ['Éducation', 'Échanges culturels'],
    odds: [4, 11, 17],
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
  // 8 — ARTICLES - MEDIAS ET ACTUALITES
  // ============================================================

  const MEDIA_POSTS = [
    // ── Newsletters ──
    {
      slug: 'newsletter-juin-2026',
      title: 'Newsletter Juin 2026',
      content: 'Découvrez les dernières nouvelles de Sens Solidaire : nos missions en cours, les témoignages de volontaires et les actions menées sur le terrain au Kenya, Sénégal, Sri Lanka, Pérou et Sumatra.',
      theme: 'Newsletter',
      date: new Date('2026-05-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2026/05/NEWSLETTER-Juin-26-3.pdf',
    },
    {
      slug: 'newsletter-juin-2025',
      title: 'Newsletter Juin 2025',
      content: 'Au sommaire : retour sur nos missions de printemps, portrait de volontaires et actualités de l\'association.',
      theme: 'Newsletter',
      date: new Date('2025-06-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/05/NEWSLETTER-JUIN-2025.pdf',
    },
    {
      slug: 'newsletter-mars-2025',
      title: 'Newsletter Mars 2025',
      content: 'Actualités de l\'association, nouvelles des missions et agenda des prochains événements.',
      theme: 'Newsletter',
      date: new Date('2025-03-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/03/NEWSLETTER-MARS-2025.pdf',
    },
    {
      slug: 'newsletter-decembre-2024',
      title: 'Newsletter Décembre 2024',
      content: 'Bilan de l\'année 2024 : missions, actions éducatives, témoignages et perspectives pour 2025.',
      theme: 'Newsletter',
      date: new Date('2024-12-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2024/12/NEWSLETTER-DECEMBRE-2024.pdf',
    },
    {
      slug: 'newsletter-juin-2024',
      title: 'Newsletter Juin 2024',
      content: 'Retour sur le printemps solidaire : missions au Kenya et au Sénégal, ateliers scolaires et nouvelles de nos partenaires.',
      theme: 'Newsletter',
      date: new Date('2024-06-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2024/07/NEWSLETTER-JUIN-2024.pdf',
    },
    {
      slug: 'newsletter-mars-2024',
      title: 'Newsletter Mars 2024',
      content: 'Ouverture de la saison des missions 2024, nouveaux partenariats et agenda des événements à venir.',
      theme: 'Newsletter',
      date: new Date('2024-03-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2024/03/NEWSLETTER-MARS-2024.pdf',
    },
    {
      slug: 'newsletter-decembre-2023',
      title: 'Newsletter Décembre 2023',
      content: 'Bilan 2023 : une année riche en missions, en rencontres et en projets solidaires sur tous nos terrains d\'action.',
      theme: 'Newsletter',
      date: new Date('2023-12-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/12/Newsletter-decembre-2023.pdf',
    },
    {
      slug: 'newsletter-juin-2023',
      title: 'Newsletter Juin 2023',
      content: 'Spécial été : missions, témoignages et actions éducatives menées dans les écoles partenaires.',
      theme: 'Newsletter',
      date: new Date('2023-06-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/06/Newsletter-Sens-Solidaires-JUIN-2023.pdf',
    },
    {
      slug: 'newsletter-mars-2023',
      title: 'Newsletter Mars 2023',
      content: 'Rentrée solidaire : nouvelles missions, nouveaux partenaires et retours d\'expérience de nos volontaires.',
      theme: 'Newsletter',
      date: new Date('2023-03-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/03/Newsletter-MARS-2023.pdf',
    },
    {
      slug: 'newsletter-janvier-2023',
      title: 'Newsletter Janvier 2023',
      content: 'Bonne année 2023 ! Découvrez nos projets pour cette nouvelle année et les missions déjà planifiées.',
      theme: 'Newsletter',
      date: new Date('2023-01-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/01/Newsletter-Janvier-2023.pdf',
    },
    {
      slug: 'newsletter-novembre-2022',
      title: 'Newsletter Novembre 2022',
      content: 'Actualités de fin d\'année : bilan des missions, exposition "De la Haute Savoie à la Casamance" et agenda de décembre.',
      theme: 'Newsletter',
      date: new Date('2022-11-01'),
      image_url: '/images/media/placeholder-newsletter.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2022/12/Newsletter-NOVEMBRE-2022.pdf',
    },

    // ── Revue de presse ──
    {
      slug: 'article-papier-bouse-elephant-francophonie-2013',
      title: 'Le papier en bouse d\'éléphant — Jeux de la Francophonie 2013',
      content: 'Article sur le papier en bouse d\'éléphant issu de la lettre d\'information des jeux de la francophonie 2013. Sens Solidaire nommé pour représenter la France dans la discipline du développement durable.',
      theme: 'Revue de presse',
      date: new Date('2013-06-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/06/lettre_nice_francophonie-_2013.pdf',
    },
    {
      slug: 'article-conge-solidarite-club-rh-genevois',
      title: 'Congé de solidarité à l\'international — Club RH Genevois',
      content: 'Article du Club RH Genevois Français : Congé de solidarité à l\'international, être au cœur des actions d\'une ONG et augmenter votre impact social.',
      theme: 'Revue de presse',
      date: new Date('2022-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: 'https://www.clubrh.click/ressources-rh/conge-de-solidarite-a-linternational-y-aviez-vous-deja-pense/',
    },
    {
      slug: 'article-nice-matin-festival-solidarites-2020',
      title: 'Festival des solidarités — Nice Matin 2020',
      content: 'Article de Nice-matin du 28 novembre 2020 sur le festival des solidarités et les interventions de Sens Solidaires dans les écoles élémentaires niçoises.',
      theme: 'Revue de presse',
      date: new Date('2020-11-28'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'article-nice-matin-journee-environnement-2016',
      title: '1ère journée de l\'Environnement — Nice Matin 2016',
      content: 'Article Nice Matin du 3 juin 2016 sur la 1ère journée de l\'Environnement organisée avec Sens Solidaire à Nice.',
      theme: 'Revue de presse',
      date: new Date('2016-06-03'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },

    // ── Interviews & Radio ──
    {
      slug: 'interview-quoi-dneuf-radio-magny-2024',
      title: 'Interview Radio — Quoi D\'Neuf (Radio Magny)',
      content: 'Présentation des activités de l\'association sur Annemasse (74). Découvrez en audio les missions et projets de Sens Solidaire sur le territoire du Grand Genève.',
      theme: 'Interview & radio',
      date: new Date('2024-01-12'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: 'https://soundcloud.com/user-534695513/quoi-dneuf-41-sens-solidaire-2024-01-12',
    },
    {
      slug: 'interview-france-bleu-personnalites-remarquables',
      title: 'Personnalités remarquables — France Bleu',
      content: 'Intervention de Delphine Thibaut au micro de Ségolène Alunni dans son émission Personnalités remarquables sur France Bleu, afin de promouvoir les départs en congé de solidarité et les projets de l\'association au Kenya.',
      theme: 'Interview & radio',
      date: new Date('2022-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: 'https://www.francebleu.fr/emissions/18-19-personnalites-remarquables',
    },
    {
      slug: 'emission-planete-bleu-donner-du-sens',
      title: 'Planète Bleu — "Donner du sens" (France Bleu)',
      content: 'Lors de l\'émission de Radio Planète Bleu de Benoît Prospero, Delphine Thibaut, fondatrice de l\'association explique ce qu\'est un congé de solidarité et Willy Rovelli partage son expérience au Kenya.',
      theme: 'Interview & radio',
      date: new Date('2022-06-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: 'https://www.francebleu.fr/emissions/planete-bleu-le-mag-planete-bleu-s-engage/donner-du-sens-3695876',
    },
    {
      slug: 'interview-france-bleu-carnaval-nice-2023',
      title: 'Carnaval de Nice 2023 — France Bleu',
      content: 'À l\'occasion du Carnaval de Nice 2023, Delphine Thibaut était au micro de Willy Rovelli afin de présenter les congés de solidarité de Sens Solidaires à l\'international, notamment au Kenya.',
      theme: 'Interview & radio',
      date: new Date('2023-02-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: 'https://www.francebleu.fr/emissions/on-n-est-pas-a-l-abri-d-faire-une-bonne-emission/en-direct-du-carnaval-de-nice-6228875#MainContent',
    },
    {
      slug: 'interview-france-bleu-pays-savoie-2022',
      title: 'Interview France Bleu Pays de Savoie — Exposition Casamance',
      content: 'Interview réalisé par Laurent Pascal de France Bleu Pays de Savoie dans sa chronique Plus vertes mes savoie, afin de promouvoir l\'exposition "De la Haute Savoie à la Casamance : comprendre la crise climatique".',
      theme: 'Interview & radio',
      date: new Date('2022-11-11'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },

    // ── Vie de l'association ──
    {
      slug: 'exposition-linogravures-felix-richard-2016',
      title: 'Exposition — Linogravures de Felix Richard',
      content: 'Novembre 2016 : Exposition des linogravures de Felix Richard sur le papier en bouse d\'éléphant du Sri Lanka. 25 euros le tableau encadré, l\'argent retourne directement à la Fabrique du papier pour maintenir son développement.',
      theme: 'Vie de l\'association',
      date: new Date('2016-11-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'exposition-correspondances-maison-environnement-2017',
      title: 'Exposition des correspondances scolaires — Maison de l\'Environnement',
      content: 'Du 24 mai au 27 juin 2017, exposition des travaux des correspondances des élèves sur le développement durable à la Maison de l\'Environnement de Nice.',
      theme: 'Vie de l\'association',
      date: new Date('2017-05-24'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'jardiniere-college-roland-garros-2021',
      title: 'Installation d\'une jardinière au collège Roland-Garros',
      content: '2021 : Installation d\'une jardinière au collège Roland-Garros de Nice dans le cadre de notre programme d\'éducation au développement durable.',
      theme: 'Éducation & sensibilisation',
      date: new Date('2021-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'reprise-activites-grand-geneve-2020',
      title: 'Reprise des activités sur l\'antenne du Grand Genève',
      content: '2020 : Reprise des activités sur l\'antenne du Grand Genève après la crise sanitaire. Nouvelles animations et projets éducatifs pour les établissements scolaires de la région.',
      theme: 'Vie de l\'association',
      date: new Date('2020-09-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },

    // ── Événements ──
    {
      slug: 'evenement-soliway-forum-humanitaire',
      title: 'Soliway — Forum des métiers de l\'humanitaire',
      content: 'Stand d\'information sur les métiers d\'administrateur, chef de projet et logisticien à Annemasse, Grand Genève.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'evenement-ville-est-a-vous-geneve',
      title: 'La ville est à vous — Genève',
      content: 'Stand aux pieds de l\'ONU, au quartier des Genêts. Depuis deux ans nous proposons nos activités aux enfants pour contribuer à la sauvegarde des derniers éléphants.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'evenement-salon-solidaire-monde',
      title: 'Salon Solidaire du monde',
      content: 'Sensibilisation du public à l\'urgence de la protection de la biodiversité africaine.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'evenement-forum-partir-etranger-thonon',
      title: 'Forum partir à l\'étranger — Thonon agglomération',
      content: 'Stand d\'informations pour les jeunes désireux de s\'engager en mission de service civique à l\'international avec nous, au Sénégal ou au Kenya.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'evenement-festival-monacology',
      title: 'Festival Monacology',
      content: 'Sensibilisation des scolaires monégasques sur l\'urgence à protéger la biodiversité et en particulier l\'éléphant à travers des ateliers ludiques.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'evenement-forum-associations-nice',
      title: 'Forum des Associations — Ville de Nice',
      content: 'Sensibilisation du tout public sur nos actions en soutien de la protection de la biodiversité et nos actions d\'éducation sur Nice.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'evenement-journee-eco-citoyenne-maison-environnement',
      title: 'Journée Éco-citoyenne — Maison de l\'Environnement',
      content: 'Sensibilisation du public aux urgences sur la protection de la biodiversité.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'evenement-rencontres-ecsi-paca',
      title: 'Rencontres de l\'ECSI en Provence-Alpes-Côte d\'Azur',
      content: 'Partage de l\'expérience de l\'association lors d\'une table ronde sur la gestion de projets multi acteurs éducatifs.',
      theme: 'Événement',
      date: new Date('2023-01-01'),
      image_url: '/images/placeholders/placeholder-photo.png',
      external_url: null,
    },
    {
      slug: 'post-instagram-willy-rovelli',
      title: 'Willy Rovelli parle de Sens Solidaires',
      content: 'Willy Rovelli a partagé son expérience de congé solidaire au Kenya avec Sens Solidaires.',
      theme: 'Ils parlent de nous',
      date: new Date('2024-06-01'),
      image_url: '/images/Willy_Rovelli.png',
      external_url: 'https://www.instagram.com/stories/highlights/18049986517744153/',
      is_active: true,
      show_homepage: true,
    },
  ]

  await prisma.mediaPost.deleteMany({})
  await prisma.mediaPost.createMany({ data: MEDIA_POSTS })
  console.log(`MediaPosts créés (${MEDIA_POSTS.length})`)

  // ============================================================
  // 9 — EDUCATION ET SENSIBILISATION
  // ============================================================

  const EDUCATION_ITEMS = [
    // ── Ateliers ──
    {
      slug: 'atelier-elephant',
      title: 'Explorer le monde animal : l\'éléphant',
      description: 'Le plus grand mammifère terrestre est menacé d\'extinction (plus de 25 000 individus tués en 2019). Pourtant cet animal joue un rôle clé dans l\'écosystème.',
      content: `Le savais-tu ? Le plus grand mammifère terrestre est menacé d'extinction avec plus de 25 000 individus tués en 2019. Pourtant cet animal joue un rôle clé dans l'écosystème. Cet atelier permet aux élèves de découvrir le monde fascinant des éléphants, leur rôle dans la biodiversité et les menaces qui pèsent sur leur survie. À travers des jeux pédagogiques et des supports visuels, les élèves développent leur sens de la solidarité et leur conscience environnementale.`,
      type: 'Atelier',
      public: 'primaire',
      image_url: '/images/placeholders/placeholder-educ-1.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/Plaquette-atelier-marque-page-elephant.pdf',
    },
    {
      slug: 'atelier-jeu-7-familles-mediterranee',
      title: 'Jeu de 7 familles : les écosystèmes de la mer Méditerranée',
      description: 'On estime qu\'environ 10% de la vie océanique est identifiée à ce jour. Avec le dérèglement climatique, des espèces que nous ne connaissons pas encore ont sûrement déjà disparu.',
      content: `Le savais-tu ? On estime qu'environ 10% de la vie océanique est identifiée à ce jour. Avec le dérèglement climatique des espèces que nous ne connaissons pas encore ont sûrement déjà disparues. Ce jeu de 7 familles pédagogique permet aux élèves de découvrir les différents écosystèmes de la mer Méditerranée, leurs habitants et les menaces qui pèsent sur eux. Un outil ludique pour sensibiliser à la protection des océans.`,
      type: 'Atelier',
      public: 'primaire',
      image_url: '/images/placeholders/placeholder-educ-1.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/plaquette-ATELIERS-jeu-de-7-familles.pdf',
    },
    {
      slug: 'atelier-forets-primaires',
      title: 'À la découverte des forêts primaires',
      description: 'Les forêts tropicales primaires abritent l\'essentiel de la biodiversité terrestre : 70% des espèces végétales et 80% des espèces vertébrées.',
      content: `Le savais-tu ? Les forêts tropicales primaires abritent l'essentiel de la biodiversité terrestre : 70% des espèces végétales et 80% des espèces vertébrées. Cet atelier invite les élèves à explorer les forêts primaires du monde, comprendre leur importance pour la planète et découvrir les menaces qui pèsent sur ces écosystèmes uniques. Un voyage au cœur de la biodiversité.`,
      type: 'Atelier',
      public: 'primaire',
      image_url: '/images/placeholders/placeholder-educ-1.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/Plaquette-atelier-forets-primaires.pdf',
    },
    {
      slug: 'atelier-ecsi-odd',
      title: 'Atelier d\'éducation à la citoyenneté et à la solidarité internationale (ECSI)',
      description: 'Découvrez les 17 ODD pour un monde plus juste, plus durable et plus solidaire. Grâce à des jeux pédagogiques, abordez les notions de vivre ensemble et de solidarité internationale.',
      content: `Découvrez avec nous les 17 ODD pour un monde plus juste, plus durable et plus solidaire. Grâce à différents jeux pédagogiques nous aborderons les notions de vivre ensemble, de stéréotypes, mais aussi différents types d'inégalités à travers le monde. Nous intervenons dans vos locaux (avec notre matériel) ou nous pouvons vous réserver une salle appropriée dans nos bureaux.`,
      type: 'Atelier',
      public: 'college_lycee,adultes',
      image_url: '/images/placeholders/placeholder-educ-1.png',
      external_url: 'https://www.sensolidaire.org/wp-content/uploads/2018/06/sengagerdanslasolidarit%C3%A9.pdf',
    },

    // ── Correspondances scolaires ──
    {
      slug: 'correspondances-scolaires',
      title: 'Correspondances scolaires internationales',
      description: 'Depuis 10 ans, nous organisons des échanges de lettres entre des écoles niçoises et celles de pays en développement sur le thème des 17 ODD.',
      content: `Nous organisons depuis 10 ans des échanges de lettres entre des écoles niçoises et celles de pays en développement sur le thème des 17 objectifs du développement durable (ODD). À travers nos outils pédagogiques, les élèves pourront comprendre l'importance d'adapter nos comportements afin de préserver et de partager de manière plus équitable les ressources naturelles avec les pays en développement. Le saviez-vous ? Un rapport scientifique constate que les pays développés sont à la cause de plus de 30% de la perte de la biodiversité dans les pays du Sud. Apports éducatifs : favoriser l'expression à l'écrit, enrichissement du vocabulaire, favoriser la compréhension et l'expression en anglais, acculturation, développement des connaissances sur le développement durable ici et à l'international. Projet transversal au programme pédagogique de l'année : français, anglais, géographie, sciences. Tarif pour l'ensemble du projet : 500€`,
      type: 'Correspondance',
      public: 'primaire,college_lycee',
      image_url: '/images/placeholders/placeholder-educ-1.png',
      external_url: null,
    },

    // ── Éco-École ──
    {
      slug: 'programme-eco-ecole',
      title: 'Relais local Éco-École',
      description: 'Nous sommes Relais local du label Éco-École pour les établissements scolaires de l\'agglomération d\'Annemasse. Un programme international présent dans 73 pays.',
      content: `Nous sommes dorénavant Relais local du label Éco-École pour les établissements scolaires de l'agglomération d'Annemasse. Si vous souhaitez mettre en place un projet d'éducation au développement durable dans votre établissement scolaire, inscrivez-vous au programme Éco-École. Présent dans 73 pays, c'est un programme international d'éducation au développement durable, développé en France depuis 2005 par l'association Teragir. Il est ouvert à tous les établissements scolaires, publics et privés, de la maternelle au lycée et la participation au programme est gratuite. Notre rôle en tant que Relais local Éco-École est d'accompagner les Éco-Écoles, Éco-Collèges et Éco-Lycées inscrits au programme sur notre périmètre, les renseigner sur les ressources du territoire utiles pour la mise en œuvre de leur démarche de développement durable. Le programme Éco-École propose une méthodologie en sept points, simple et participative, pour guider les établissements scolaires dans leur projet d'éducation au développement durable en s'appuyant sur 8 thématiques : alimentation, biodiversité, climat, déchets, eau, énergie, santé ou solidarités.`,
      type: 'Éco-École',
      public: 'primaire,college_lycee',
      image_url: '/images/placeholders/placeholder-educ-1.png',
      external_url: null,
    },
  ]

  await prisma.educationItem.deleteMany({})
  await prisma.educationItem.createMany({ data: EDUCATION_ITEMS })
  console.log(`EducationItems créés (${EDUCATION_ITEMS.length})`)

// ── Médias — correspondances scolaires ────────────────────
  const correspondances = await prisma.educationItem.findUnique({ where: { slug: 'correspondances-scolaires' } })
  await prisma.media.deleteMany({ where: { entity_type: 'education_item', entity_id: correspondances.id } })
  await prisma.media.createMany({
    data: [
      { entity_type: 'education_item', entity_id: correspondances.id, file_url: 'https://webmedias.ac-nice.fr/africa2020/', file_type: 'link', label: 'Plateforme du Rectorat de Nice', display_order: 0 },
      ...GALLERY_PLACEHOLDERS.map((url, i) => ({
        entity_type: 'education_item', entity_id: correspondances.id, file_url: url, file_type: 'image', display_order: i + 1,
      })),
    ]
  })

// ── Médias — éco-école ─────────────────────────────────────
  const ecoEcole = await prisma.educationItem.findUnique({ where: { slug: 'programme-eco-ecole' } })
  await prisma.media.deleteMany({ where: { entity_type: 'education_item', entity_id: ecoEcole.id } })
  await prisma.media.createMany({
    data: [
      { entity_type: 'education_item', entity_id: ecoEcole.id, file_url: 'https://www.eco-ecole.org/', file_type: 'link', label: 'Site officiel Éco-École', display_order: 0 },
      { entity_type: 'education_item', entity_id: ecoEcole.id, file_url: 'http://espace-etablissement.eco-ecole.org/signup', file_type: 'link', label: 'S\'inscrire au programme', display_order: 1 },
      ...GALLERY_PLACEHOLDERS.map((url, i) => ({
        entity_type: 'education_item', entity_id: ecoEcole.id, file_url: url, file_type: 'image', display_order: i + 2,
      })),
    ]
  })

  console.log('Médias EducationItems créés')

  // ============================================================
  // 10 — ACTIVITY REPORTS
  // ============================================================

  await prisma.activityReport.deleteMany({})
  await prisma.activityReport.createMany({
    data: [
      { annee: 2024, url: "https://www.sensolidaire.org/wp-content/uploads/2025/06/Rapport-dactivites-2024-1.pdf" },
      { annee: 2023, url: "https://www.sensolidaire.org/wp-content/uploads/2024/07/Rapport-des-activites-2023.pdf" },
      { annee: 2022, url: "https://www.sensolidaire.org/wp-content/uploads/2023/11/Rapport-dactivites-2022.pdf" },
      { annee: 2021, url: "https://www.sensolidaire.org/wp-content/uploads/2023/04/rapport-annuel-2021.pdf" },
      { annee: 2020, url: "https://www.sensolidaire.org/wp-content/uploads/2021/05/rapportmoral-2020.pdf" },
      { annee: 2019, url: "https://www.sensolidaire.org/wp-content/uploads/2020/05/rapportannuel19-compress%C3%A9-1.pdf" },
      { annee: 2018, url: "https://www.sensolidaire.org/wp-content/uploads/2020/02/rapportactivit%C3%A9s18.pdf" },
      { annee: 2017, url: "https://www.sensolidaire.org/wp-content/uploads/2019/10/rapportactivit%C3%A9s17.pdf" },
      { annee: 2016, url: "https://www.sensolidaire.org/wp-content/uploads/2025/01/rapportannuel16.pdf" },
      { annee: 2015, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportdactivit%C3%A92015.pdf" },
      { annee: 2014, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportactivit%C3%A914.pdf" },
      { annee: 2013, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportannuel13.pdf" },
      { annee: 2012, url: "https://www.sensolidaire.org/wp-content/uploads/2018/07/rapportmoral2012.pdf" },
    ]
  })
  console.log('ActivityReports créés (13)')

  // ============================================================
  // 11 — RAPPORT DE MISSION
  // ============================================================

  await prisma.missionReport.deleteMany({})
  await prisma.missionReport.createMany({
    data: [
      { auteur: "Joelle", destination: "kenya", type: "individuel", annee: 2025, pdf_url: "/pdfs/rapports/joelle-kenya-2025.pdf" },
      { auteur: "Armand", destination: "kenya", type: "individuel", annee: 2024, pdf_url: "/pdfs/rapports/armand-kenya-2024.pdf" },
      { auteur: "Amna", destination: "senegal", type: "individuel", annee: 2025, pdf_url: "/pdfs/rapports/amna-senegal-2025.pdf" },
      { auteur: "Tilla", destination: "senegal", type: "individuel", annee: 2024, pdf_url: "/pdfs/rapports/tilla-senegal-2024.pdf" },
      { auteur: "Bérénice & Frédéric", destination: "sri-lanka", type: "individuel", annee: 2024, pdf_url: "/pdfs/rapports/berenice-frederic-srilanka-2024.pdf" },
      { auteur: "Clélia", destination: "sri-lanka", type: "individuel", annee: 2023, pdf_url: "/pdfs/rapports/clelia-srilanka-2023.pdf" },
      { auteur: "Andréa & Tristan", destination: "perou", type: "individuel", annee: 2023, pdf_url: "/pdfs/rapports/andrea-tristan-perou-2023.pdf" },
      { auteur: "Christine & Adèle", destination: "perou", type: "individuel", annee: 2022, pdf_url: "/pdfs/rapports/christine-adele-perou-2022.pdf" },
      { auteur: "Lucile", destination: "sumatra", type: "individuel", annee: 2026, pdf_url: "/pdfs/rapports/lucile-sumatra-2026.pdf" },
      { auteur: "Cathy & Laurent", destination: "sumatra", type: "individuel", annee: 2024, pdf_url: "/pdfs/rapports/cathy-laurent-sumatra-2024.pdf" },
      { auteur: "Kimberley", destination: null, type: "service_civique", annee: 2025, pdf_url: "/pdfs/rapports/kimberley-service-civique-2025.pdf" },
      { auteur: "Cyril", destination: null, type: "service_civique", annee: 2024, pdf_url: "/pdfs/rapports/cyril-service-civique-2024.pdf" },
      { auteur: "École Internationale de Fuveau", destination: null, type: "groupe_jeune", annee: 2018, pdf_url: "/pdfs/rapports/ecole-fuveau-srilanka-2018.pdf" },
      { auteur: "École Internationale de Nice", destination: null, type: "groupe_jeune", annee: 2017, pdf_url: "/pdfs/rapports/ecole-nice-srilanka-2017.pdf" },
      { auteur: "Jean-Yves, Loïc & Christian", destination: null, type: "conge_solidaire", annee: 2016, pdf_url: "/pdfs/rapports/jeanyves-loic-christian-perou-2016.pdf" },
      { auteur: "Édith & Thierry", destination: null, type: "conge_solidaire", annee: 2020, pdf_url: "/pdfs/rapports/edith-thierry-sumatra-2020.pdf" },
      { auteur: "Équipe Décathlon Nice", destination: null, type: "conge_solidaire", annee: 2023, pdf_url: "/pdfs/rapports/decathlon-nice-conge-solidaire-2023.pdf" },
    ]
  })
  console.log('MissionReports créés (17)')

  // ============================================================
  // 12 — MEMBRES DE L'EQUIPE
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
      { nom: "Bertrand D.", role: "Infographiste", avatar_url: "/images/placeholders/avatar-men.png", category: "egalement", display_order: 1 },
      { nom: "Thierry Montalban", role: "Agence de communication", avatar_url: "/images/placeholders/avatar-men.png", category: "egalement", display_order: 2 },
      { nom: "Sabine Jerome", role: "Comptabilité", avatar_url: "/images/placeholders/avatar-women.png", category: "egalement", display_order: 3 },
    ]
  })
  console.log('TeamMembers créés (23)')

  // ============================================================
  // 13 — LOGOS PARTENAIRES
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
  console.log("Seed terminé avec succès !")
  console.log("─────────────────────────────────────────")
  console.log(`Admin         : admin@sensolidaire.org`)
  console.log(`Password      : Admin1234!`)
  console.log(`Missions      : 9`)
  console.log(`Pricing       : 20 lignes`)
  console.log(`Délégations   : 8`)
  console.log(`Locations     : 13`)
  console.log(`Témoignages   : 7 (6 approved, 1 pending)`)
  console.log(`FieldActions  : ${FIELD_ACTIONS.length}`)
  console.log(`MediaPosts    : ${MEDIA_POSTS.length}`)
  console.log(`EducationItems: ${EDUCATION_ITEMS.length}`)
  console.log(`ActivityReports: 13`)
  console.log(`MissionReports: 17`)
  console.log(`TeamMembers   : 23`)
  console.log(`Partners      : 18`)
  console.log("─────────────────────────────────────────")
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
