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

const seed = async () => {
  console.log("Démarrage du seed...")

  // ============================================================
  // 1 — ADMIN
  // ============================================================

  const password_hash = await bcrypt.hash("Admin1234!", 10)

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
    image_url: "/images/kenya.jpg",
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
    image_url: "/images/senegal.jpg",
    short_description: "Correspondances scolaires, reboisement de la mangrove, potager, soutien des femmes.",
    description: "Partez à la découverte de la Casamance et engagez-vous aux côtés de nos partenaires locaux à Ziguinchor. Entre échanges avec les écoles, soutien aux jardins potagers, projets d'accès à l'eau et rencontres avec les communautés, vous contribuerez à des actions concrètes tout en vivant une expérience humaine authentique au cœur du Sénégal.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Correspondance scolaire et échanges interculturels avec les élèves locaux.</li><li>Visites terrain et suivi des projets en cours.</li><li>Appui aux projets jardin potager, filtres à eau et puits.</li><li>Sensibilisation communautaire au développement durable.</li><li>Soutien aux groupements de femmes maraîchères.</li><li>Reboisement de la mangrove et actions environnementales.</li><li>Coordination des visioconférences collèges entre Nice et le Sénégal.</li><li>Contribution au chantier de digue sur l'île d'Effrane.</li></ul>",
    programme: "8h : Petit déjeuner.\n9h à 12h : Activités de la matinée — correspondance scolaire, visites terrain.\n12h : Déjeuner.\n14h à 17h : Visite de l'avancement des projets sur place — jardin potager, utilisation des filtres à eau et puits.\n19h : Dîner.",
    included: "Hébergement chez l'habitant ou en gîte local, repas, encadrement sur place, transport local.",
    not_include: "Billet d'avion (~800€, avec option annulation fortement recommandée), assurance voyage, vaccins, visa (ressortissants hors CEDEAO), dépenses personnelles.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Cap Skirring (la navette jusqu’à Ziguinchor).",
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
    image_url: "/images/perou.jpg",
    short_description: "Soins aux animaux sauvages et sensibilisation des communautés à la protection de l’Amazonie.",
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
    image_url: "/images/srilanka.jpg",
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
    image_url: "/images/sumatra.jpg",
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
    health_info: "<ul><li>Aucune vaccination n’est obligatoire mais certaines sont recommandées : antituberculeuse, typhoïde, rage, encéphalite japonaise et les hépatites A et B.</li><li>Traitement antipaludéen recommandé. Prévoir répulsifs puissants.</li><li>Bonne condition physique recommandée : Un certificat médical d'aptitude sera demandé avant le départ.</li></ul>",
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
    image_url: "/images/service-civique-1.jpeg",
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
    image_url: "/images/service-civique-2.jpg",
    short_description: "Auprès de l'association AGADA en Casamance, reboisement de la mangrove, agriculture durable et suivi des projets d'eau potable.",
    is_active: true,
  }

  const missionScSenegal = await prisma.mission.upsert({
    where: { slug: "service-civique-senegal" },
    update: scSenegalData,
    create: { slug: "service-civique-senegal", ...scSenegalData },
  })

  // ── Mission 8 : Groupe jeunes ──────────────────────────────
  const groupeJeunesData = {
    type: "groupe_jeunes",
    title: "Mission de groupe jeunes",
    country: "Kenya & Sénégal",
    image_url: "/images/groupe-jeune.jpg",
    short_description: "Partez en groupe au Kenya ou au Sénégal pour des missions interculturelles et environnementales. Ouvert aux lycées, MJC et structures jeunesse.",
    is_active: true,
  }

  const missionGroupeJeunes = await prisma.mission.upsert({
    where: { slug: "groupe-jeunes" },
    update: groupeJeunesData,
    create: { slug: "groupe-jeunes", ...groupeJeunesData },
  })

  // ── Mission 9 : Congé solidaire ────────────────────────────
  const congeSolidaireData = {
    type: "conge_solidaire",
    title: "Congé solidaire",
    country: "Kenya & Sénégal",
    image_url: "/images/conge-solidaire.jpg",
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
      { mission_id: missionScKenya.id, duration_label: "3 mois",  price: 0, display_order: 1 },
      { mission_id: missionScKenya.id, duration_label: "12 mois", price: 0, display_order: 2 },

      // ── Service civique Sénégal ──
      { mission_id: missionScSenegal.id, duration_label: "3 mois",  price: 0, display_order: 1 },
      { mission_id: missionScSenegal.id, duration_label: "12 mois", price: 0, display_order: 2 },

      // ── Groupe jeunes ──
      { mission_id: missionGroupeJeunes.id, duration_label: "10 jours", price: 0, display_order: 1 },

      // ── Congé solidaire ──
      { mission_id: missionCongeSolidaire.id, duration_label: "10 jours à 4 semaines", price: 0, display_order: 1 },
    ]
  })

  console.log("Pricing créé (20 lignes)")

// ============================================================
  // 4 — LIEUX DE MISSION
  // ============================================================

  // ── Voi (Kenya — ville principale) ─────────────────────────
  const voiData = {
    name: "Voi",
    country: "Kenya",
    description: "Voi est une ville située dans le comté de Taita-Taveta, aux portes du Parc national de Tsavo Est. C'est le point de départ de nos missions de protection de la faune sauvage au Kenya.",
    image_url: "/images/locations/voi-kenya.jpeg",
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
    image_url: "/images/locations/LUMO-kenya.jpeg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "lumo-kenya" },
    update: lumoData,
    create: { slug: "lumo-kenya", mission_id: missionKenya.id, ...lumoData },
  })

  // ── Taita Taveta National Polytechnic ──────────────────────
  const ttnpData = {
    name: "Taita Taveta National Polytechnic",
    country: "Kenya",
    description: "Établissement d'enseignement supérieur de la ville de Voi, aux portes du Parc Tsavo. Cette université possède un pôle dédié au tourisme avec lequel nous travaillons particulièrement. Le campus est très engagé pour la biodiversité et possède sa propre pépinière.",
    image_url: "/images/locations/TTNP-kenya.jpeg",
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
    image_url: "/images/locations/ECT-kenya.jpeg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "elsa-conservation-trust-kenya" },
    update: ectData,
    create: { slug: "elsa-conservation-trust-kenya", mission_id: missionKenya.id, ...ectData },
  })

  // ── Diani Turtle Watch ─────────────────────────────────────
  const dtwData = {
    name: "Diani Turtle Watch",
    country: "Kenya",
    description: "Diani Turtle Watch, créé en 2012, travaille avec une équipe de 14 observateurs couvrant 50 km sur la côte sud du Kenya. Les principales espèces suivies sont les tortues vertes et les tortues imbriquées. Il sensibilise les communautés locales, les écoles et les touristes aux espèces menacées.",
    image_url: "/images/locations/DTW-kenya.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "diani-turtle-watch-kenya" },
    update: dtwData,
    create: { slug: "diani-turtle-watch-kenya", mission_id: missionKenya.id, ...dtwData },
  })

  // ── Ziguinchor (Sénégal) ───────────────────────────────────
  const ziguinchorData = {
    name: "Ziguinchor",
    country: "Sénégal",
    description: "Ziguinchor est la capitale de la Casamance, région au sud du Sénégal connue pour sa verdure exceptionnelle et sa culture riche. Nos missions de développement communautaire s'y déroulent dans un cadre chaleureux, au contact direct des familles locales.",
    image_url: "/images/locations/ziguinchor-senegal.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "ziguinchor-senegal" },
    update: ziguinchorData,
    create: { slug: "ziguinchor-senegal", mission_id: missionSenegal.id, ...ziguinchorData },
  })

  // ── ONG AGADA (Sénégal) ────────────────────────────────────
  const agadaData = {
    name: "ONG AGADA",
    country: "Sénégal",
    description: "AGADA (Agir Autrement pour le Développement en Afrique), basée à Ziguinchor en Casamance, œuvre pour le développement d'activités économiques locales. Investie depuis plus de 30 ans, elle soutient le reboisement de la mangrove, l'agriculture durable et la protection d'espèces patrimoniales comme le lamantin.",
    image_url: "/images/locations/AGADA-senegal.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "agada-senegal" },
    update: agadaData,
    create: { slug: "agada-senegal", mission_id: missionSenegal.id, ...agadaData },
  })

  // ── Puerto Maldonado (Pérou) ───────────────────────────────
  const puertoData = {
    name: "Puerto Maldonado",
    country: "Pérou",
    description: "Puerto Maldonado est la capitale de la région de Madre de Dios, aux portes de la Réserve nationale de Tambopata en Amazonie péruvienne. C'est l'un des points d'entrée les plus importants pour la biodiversité amazonienne.",
    image_url: "/images/locations/puerto-maldonado-perou.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "puerto-maldonado-perou" },
    update: puertoData,
    create: { slug: "puerto-maldonado-perou", mission_id: missionPerou.id, ...puertoData },
  })

  // ── Amazon Shelter (Pérou) ─────────────────────────────────
  const amazonData = {
    name: "Amazon Shelter",
    country: "Pérou",
    description: "Le centre de réhabilitation Amazon Shelter, proche de Puerto Maldonado, est axé sur la conservation des singes laineux et d'atèles. Amazon Shelter poursuit un travail de plantation d'espèces sauvages menacées sur 90 hectares : cèdres blancs, acajous, fruitiers sauvages et palmiers.",
    image_url: "/images/locations/amazon-shelter-perou.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "amazon-shelter-perou" },
    update: amazonData,
    create: { slug: "amazon-shelter-perou", mission_id: missionPerou.id, ...amazonData },
  })

  // ── Kegalle (Sri Lanka) ────────────────────────────────────
  const kegalleData = {
    name: "Kegalle",
    country: "Sri Lanka",
    description: "Kegalle est une ville de la province de Sabaragamuwa, dans les collines verdoyantes du centre du Sri Lanka. Notre sanctuaire d'éléphants y accueille des éléphants blessés ou orphelins dans un cadre naturel préservé, loin du tourisme de masse.",
    image_url: "/images/locations/kegalle-sri-lanka.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "kegalle-sri-lanka" },
    update: kegalleData,
    create: { slug: "kegalle-sri-lanka", mission_id: missionSriLanka.id, ...kegalleData },
  })

  // ── Millenium Elephant Foundation (Sri Lanka) ──────────────
  const mefData = {
    name: "Millenium Elephant Foundation",
    country: "Sri Lanka",
    description: "La Millenium Elephant Foundation (MEF) créée en 1999 à Kegalle a pour objectif la protection des éléphants sauvages et domestiques du Sri Lanka. Les éléphants malades et maltraités y sont accueillis. Plus de 60 éléphants ont pu y être hébergés.",
    image_url: "/images/locations/mef-sri-lanka.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "mef-sri-lanka" },
    update: mefData,
    create: { slug: "mef-sri-lanka", mission_id: missionSriLanka.id, ...mefData },
  })

  // ── Bohorok (Sumatra) ──────────────────────────────────────
  const bohorokData = {
    name: "Bohorok",
    country: "Indonésie",
    description: "Bohorok est un village situé à l'orée du Parc national de Gunung Leuser, à Sumatra Nord. Ce parc est l'un des derniers endroits au monde où cohabitent orang-outans, tigres de Sumatra, rhinocéros et éléphants.",
    image_url: "/images/locations/bohorok-sumatra.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "bohorok-sumatra" },
    update: bohorokData,
    create: { slug: "bohorok-sumatra", mission_id: missionSumatra.id, ...bohorokData },
  })

  // ── Batu Kapal Conservation (Sumatra) ─────────────────────
  const batuKapalData = {
    name: "Batu Kapal Conservation",
    country: "Indonésie",
    description: "Le sanctuaire de Batu Kapal se trouve au cœur de la forêt qui surplombe le parc national Gunung Leuser, classé au patrimoine mondial de l'UNESCO. Il accueille des visites fréquentes d'orangs-outans, espèce en danger critique dont la population a diminué de 86% en 100 ans.",
    image_url: "/images/locations/batu-kapal-sumatra.jpg",
    is_active: true,
  }
  await prisma.location.upsert({
    where: { slug: "batu-kapal-sumatra" },
    update: batuKapalData,
    create: { slug: "batu-kapal-sumatra", mission_id: missionSumatra.id, ...batuKapalData },
  })

  console.log("Locations créées (13)")

  // ============================================================
  // 5 — TÉMOIGNAGES
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
        mission_id: null,
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
// 6 — ACTIONS SUR LE TERRAIN
// ============================================================

const FIELD_ACTIONS = [
  {
    slug: 'fabrique-papier-maktau-kenya',
    title: 'Fabrique de papier écologique de Maktau',
    description: 'Soutien au développement d\'une activité économique durable grâce au recyclage de la bouse d\'éléphant.',
    content: `Afin de soutenir les communautés locales tout en préservant les richesses naturelles de leur territoire, nous avons accompagné le développement d'une fabrique de papier recyclé à partir de bouse d'éléphant. La fabrication de ce papier artisanal est entièrement naturelle. Elle repose sur des méthodes de production à faible impact environnemental, utilisant notamment l'énergie du soleil et du vent. Le processus de fabrication débute par le nettoyage des fibres contenues dans les déjections d'éléphants. Celles-ci sont ensuite bouillies pendant plusieurs heures pour être stérilisées et assouplies avant d'être transformées en pâte à papier.
    En choisissant ces créations, chacun contribue à soutenir les populations engagées dans la protection de leur environnement et à la préservation des éléphants et des forêts.`,
    country: 'Kenya',
    image_url: '/images/jardin_potager_kenya.jpg',
    tags: ['Environnement', 'Biodiversité'],
    odds: [8, 12, 15],
    gallery: ['/images/jardin_potager_kenya.jpg', '/images/locations/LUMO-kenya.jpeg', '/images/jardin_potager_senegal.jpg'],
  },

  {
    slug: 'patrouilles-rangers-lumo',
    title: 'Patrouilles avec les rangers du sanctuaire LUMO',
    description: 'Depuis plus de 10 ans, l\'association soutient les rangers du sanctuaire LUMO dans leur mission de lutte contre le braconnage.',
    content: `Depuis plus de 10 ans, l'association investit ses efforts au sanctuaire de LUMO, frontalier du Parc Tsavo, pour soutenir les rangers dans leur mission de lutte contre le braconnage.
    Soutien aux patrouilles, relevés de données sur la faune, entretien du matériel et du camp de base, nos volontaires ont régulièrement contribué à la vie du sanctuaire et à la protection de la vie animale.`,
    country: 'Kenya',
    image_url: '/images/locations/LUMO-kenya.jpeg',
    tags: ['Environnement', 'Biodiversité'],
    odds: [15, 16],
    gallery: ['/images/locations/LUMO-kenya.jpeg', '/images/jardin_potager_kenya.jpg'],
  },

  {
    slug: 'potager-agro-ecologique-ttnp',
    title: 'Potager agro-écologique face à la sécheresse',
    description: 'Projet mené avec les élèves du TTNP de Voi pour améliorer la production durable et diffuser les connaissances sur l\'agroécologie.',
    content: `Ce projet mené conjointement avec les élèves du TTNP de Voi vise à améliorer la production durable de cultures et de produits d'origine animale. Les objectifs spécifiques sont : utiliser la ferme pour diffuser les connaissances sur l'agriculture transformatrice en adoptant l'agroécologie, créer un environnement microclimatique pour atténuer les impacts climatiques, et adopter la diversification de la production.`,
    country: 'Kenya',
    image_url: '/images/locations/TTNP-kenya.jpeg',
    tags: ['Agriculture', 'Éducation'],
    odds: [2, 13, 15],
    gallery: ['/images/locations/TTNP-kenya.jpeg', '/images/jardin_potager_kenya.jpg'],
  },

  {
    slug: 'jardins-potagers-senegal',
    title: 'Jardins potagers et consommation responsable',
    description: 'En partenariat avec l\'association AGADA, installation de potagers dans les établissements scolaires de Casamance.',
    content: `Avec ce projet nous avons développé des échanges entre deux écoles primaires, quatre collèges et deux lycées de la Métropole de Nice et des établissements de la Casamance au Sénégal sur le thème de la consommation responsable. Nous avons installé, en partenariat avec l'association sénégalaise AGADA, des potagers dans les établissements dans le but de former les élèves à la production et à la consommation responsable. Les élèves de CEM Kénia ont mis en place un projet de jardin potager de 150m² dont la production abondante a permis d'ouvrir une boutique. Cette boutique est un moyen privilégié pour initier les élèves au monde de l'entrepreneuriat.`,
    country: 'Sénégal',
    image_url: '/images/jardin_potager_senegal.jpg',
    tags: ['Agriculture', 'Éducation'],
    odds: [3, 12, 15],
    gallery: ['/images/jardin_potager_senegal.jpg', '/images/locations/AGADA-senegal.jpg'],
  },

  {
    slug: 'correspondances-scolaires-senegal',
    title: 'Correspondances scolaires France — Sénégal',
    description: 'Échanges entre écoles de la Métropole de Nice et des établissements de Casamance sur le thème de la consommation responsable.',
    content: `En parallèle des projets de jardins potagers, les élèves de France et du Sénégal ont pu se rencontrer et échanger grâce au don d'un ordinateur portable au collège de Ziguinchor. Les élèves ont ainsi pu discuter de leurs cultures, habitudes scolaires, alimentaires, musicales, sportives, de leurs traditions et de production et consommation responsable. Une correspondance épistolaire a également été réalisée entre les élèves de Nice et de Ziguinchor dans le but de promouvoir la solidarité internationale.`,
    country: 'Sénégal / France',
    image_url: '/images/locations/AGADA-senegal.jpg',
    tags: ['Éducation', 'Échanges culturels'],
    odds: [4, 10, 17],
    gallery: ['/images/locations/AGADA-senegal.jpg', '/images/jardin_potager_senegal.jpg'],
  },

  {
    slug: 'correspondances-amazonie',
    title: 'Correspondances avec les écoles d\'Amazonie',
    description: 'Suite à la rencontre avec le Chef Raoni, mise en place d\'une correspondance entre des écoles françaises et le peuple Kukama kukamiria.',
    content: `Notre organisation a reçu les 5ᵉ trophées de l'Environnement de la ville de Nice par le Cacique Raoni Metuktire, Chef du peuple Kayapo (Brésil) le 6 juin 2014. Lors de cet échange, nous avons promis au Grand Chef Raoni de présenter la culture du peuple Kayapo aux scolaires français et de mettre en place une correspondance avec une école d'Amazonie. Nous avons choisi le thème "Un jardin au cœur de la forêt". Dans la forêt tropicale vivent les Indiens qui savent tirer parti de leur environnement sans le détruire.`,
    country: 'Pérou',
    image_url: '/images/jardin_potager_kenya.jpg',
    tags: ['Éducation', 'Échanges culturels'],
    odds: [4, 10, 15],
    gallery: ['/images/jardin_potager_kenya.jpg'],
  },

  {
    slug: 'projet-puits-sri-lanka',
    title: 'Accès à l\'eau potable dans les écoles',
    description: 'Financement de forages dans les écoles du Sri Lanka pour garantir un accès durable à l\'eau potable.',
    content: `Nous finançons des forages dans les écoles du Sri Lanka pour garantir un accès durable à l'eau potable aux élèves et aux communautés locales. ce projet contribue directement à l'amélioration des conditions de vie et de scolarisation des enfants, tout en renforçant la résilience des communautés face aux enjeux climatiques.`,
    country: 'Sri Lanka',
    image_url: '/images/puit-srilanka.jpg',
    tags: ['Accès à l\'eau', 'Éducation'],
    odds: [3, 6, 4],
    gallery: ['/images/puit-srilanka.jpg'],
  },

  {
    slug: 'fabrique-eco-maximus',
    title: 'Fabrique de papier Eco Maximus',
    description: 'Soutien à la fabrique Eco Maximus qui produit des objets artisanaux issus de bouse d\'éléphant au Sri Lanka.',
    content: `Sens Solidaire soutient la fabrique Eco Maximus en promouvant ses objets artisanaux issus de bouse d'éléphant, contribuant à la protection de la biodiversité et à l'économie locale au Sri Lanka. Cette initiative permet aux artisans locaux de valoriser des ressources naturelles tout en sensibilisant les visiteurs à la protection des éléphants et de leur habitat.`,
    country: 'Sri Lanka',
    image_url: '/images/fabrique_eco_maximus_srilanka.jpg',
    tags: ['Environnement', 'Biodiversité'],
    odds: [8, 12, 15],
    gallery: ['/images/fabrique_eco_maximus_srilanka.jpg'],
  },
]

// FieldActions
await prisma.fieldActionTag.deleteMany({})
await prisma.fieldActionODD.deleteMany({})
await prisma.fieldAction.deleteMany({})

for (const action of FIELD_ACTIONS) {
  const { tags, odds, gallery, ...actionData } = action
  const created = await prisma.fieldAction.create({
    data: {
      ...actionData,
      tags: { create: tags.map(tag => ({ tag })) },
      odds: { create: odds.map(n => ({ odd_number: n })) },
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

console.log("FieldActions créées (8)")

// ============================================================
// 7 — ARTICLES - MEDIAS ET ACTUALITES
// ============================================================

const MEDIA_POSTS = [
  // ── Newsletters ──
  {
    slug: 'newsletter-juin-2026',
    title: 'Newsletter Juin 2026',
    content: 'Découvrez les dernières nouvelles de Sens Solidaire : nos missions en cours, les témoignages de volontaires et les actions menées sur le terrain au Kenya, Sénégal, Sri Lanka, Pérou et Sumatra.',
    theme: 'Newsletter',
    date: new Date('2026-05-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2026/05/NEWSLETTER-Juin-26-3.pdf',
  },

  {
    slug: 'newsletter-juin-2025',
    title: 'Newsletter Juin 2025',
    content: 'Au sommaire : retour sur nos missions de printemps, portrait de volontaires et actualités de l\'association.',
    theme: 'Newsletter',
    date: new Date('2025-06-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/05/NEWSLETTER-JUIN-2025.pdf',
  },

  {
    slug: 'newsletter-mars-2025',
    title: 'Newsletter Mars 2025',
    content: 'Actualités de l\'association, nouvelles des missions et agenda des prochains événements.',
    theme: 'Newsletter',
    date: new Date('2025-03-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/03/NEWSLETTER-MARS-2025.pdf',
  },

  {
    slug: 'newsletter-decembre-2024',
    title: 'Newsletter Décembre 2024',
    content: 'Bilan de l\'année 2024 : missions, actions éducatives, témoignages et perspectives pour 2025.',
    theme: 'Newsletter',
    date: new Date('2024-12-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2024/12/NEWSLETTER-DECEMBRE-2024.pdf',
  },

  {
    slug: 'newsletter-juin-2024',
    title: 'Newsletter Juin 2024',
    content: 'Retour sur le printemps solidaire : missions au Kenya et au Sénégal, ateliers scolaires et nouvelles de nos partenaires.',
    theme: 'Newsletter',
    date: new Date('2024-06-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2024/07/NEWSLETTER-JUIN-2024.pdf',
  },

  {
    slug: 'newsletter-mars-2024',
    title: 'Newsletter Mars 2024',
    content: 'Ouverture de la saison des missions 2024, nouveaux partenariats et agenda des événements à venir.',
    theme: 'Newsletter',
    date: new Date('2024-03-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2024/03/NEWSLETTER-MARS-2024.pdf',
  },

  {
    slug: 'newsletter-decembre-2023',
    title: 'Newsletter Décembre 2023',
    content: 'Bilan 2023 : une année riche en missions, en rencontres et en projets solidaires sur tous nos terrains d\'action.',
    theme: 'Newsletter',
    date: new Date('2023-12-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/12/Newsletter-decembre-2023.pdf',
  },

  {
    slug: 'newsletter-juin-2023',
    title: 'Newsletter Juin 2023',
    content: 'Spécial été : missions, témoignages et actions éducatives menées dans les écoles partenaires.',
    theme: 'Newsletter',
    date: new Date('2023-06-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/06/Newsletter-Sens-Solidaires-JUIN-2023.pdf',
  },

  {
    slug: 'newsletter-mars-2023',
    title: 'Newsletter Mars 2023',
    content: 'Rentrée solidaire : nouvelles missions, nouveaux partenaires et retours d\'expérience de nos volontaires.',
    theme: 'Newsletter',
    date: new Date('2023-03-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/03/Newsletter-MARS-2023.pdf',
  },

  {
    slug: 'newsletter-janvier-2023',
    title: 'Newsletter Janvier 2023',
    content: 'Bonne année 2023 ! Découvrez nos projets pour cette nouvelle année et les missions déjà planifiées.',
    theme: 'Newsletter',
    date: new Date('2023-01-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/01/Newsletter-Janvier-2023.pdf',
  },

  {
    slug: 'newsletter-novembre-2022',
    title: 'Newsletter Novembre 2022',
    content: 'Actualités de fin d\'année : bilan des missions, exposition "De la Haute Savoie à la Casamance" et agenda de décembre.',
    theme: 'Newsletter',
    date: new Date('2022-11-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2022/12/Newsletter-NOVEMBRE-2022.pdf',
  },

  // ── Revue de presse ──
  {
    slug: 'article-papier-bouse-elephant-francophonie-2013',
    title: 'Le papier en bouse d\'éléphant — Jeux de la Francophonie 2013',
    content: 'Article sur le papier en bouse d\'éléphant issu de la lettre d\'information des jeux de la francophonie 2013. Sens Solidaire nommé pour représenter la France dans la discipline du développement durable.',
    theme: 'Revue de presse',
    date: new Date('2013-06-01'),
    image_url: '/images/fabrique_eco_maximus_srilanka.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2023/06/lettre_nice_francophonie-_2013.pdf',
  },

  {
    slug: 'article-conge-solidarite-club-rh-genevois',
    title: 'Congé de solidarité à l\'international — Club RH Genevois',
    content: 'Article du Club RH Genevois Français : Congé de solidarité à l\'international, être au cœur des actions d\'une ONG et augmenter votre impact social.',
    theme: 'Revue de presse',
    date: new Date('2022-01-01'),
    image_url: '/images/groupe-jeune-2.jpg',
    external_url: 'https://www.clubrh.click/ressources-rh/conge-de-solidarite-a-linternational-y-aviez-vous-deja-pense/',
  },

  {
    slug: 'article-nice-matin-festival-solidarites-2020',
    title: 'Festival des solidarités — Nice Matin 2020',
    content: 'Article de Nice-matin du 28 novembre 2020 sur le festival des solidarités et les interventions de Sens Solidaires dans les écoles élémentaires niçoises.',
    theme: 'Revue de presse',
    date: new Date('2020-11-28'),
    image_url: '/images/hero_missions.jpg',
    external_url: null,
  },

  {
    slug: 'article-nice-matin-journee-environnement-2016',
    title: '1ère journée de l\'Environnement — Nice Matin 2016',
    content: 'Article Nice Matin du 3 juin 2016 sur la 1ère journée de l\'Environnement organisée avec Sens Solidaire à Nice.',
    theme: 'Revue de presse',
    date: new Date('2016-06-03'),
    image_url: '/images/hero_missions.jpg',
    external_url: null,
  },

  // ── Interviews & Radio ──
  {
    slug: 'interview-quoi-dneuf-radio-magny-2024',
    title: 'Interview Radio — Quoi D\'Neuf (Radio Magny)',
    content: 'Présentation des activités de l\'association sur Annemasse (74). Découvrez en audio les missions et projets de Sens Solidaire sur le territoire du Grand Genève.',
    theme: 'Interview & radio',
    date: new Date('2024-01-12'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://soundcloud.com/user-534695513/quoi-dneuf-41-sens-solidaire-2024-01-12',
  },

  {
    slug: 'interview-france-bleu-personnalites-remarquables',
    title: 'Personnalités remarquables — France Bleu',
    content: 'Intervention de Delphine Thibaut au micro de Ségolène Alunni dans son émission Personnalités remarquables sur France Bleu, afin de promouvoir les départs en congé de solidarité et les projets de l\'association au Kenya.',
    theme: 'Interview & radio',
    date: new Date('2022-01-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.francebleu.fr/emissions/18-19-personnalites-remarquables',
  },

  {
    slug: 'emission-planete-bleu-donner-du-sens',
    title: 'Planète Bleu — "Donner du sens" (France Bleu)',
    content: 'Lors de l\'émission de Radio Planète Bleu de Benoît Prospero, Delphine Thibaut, fondatrice de l\'association explique ce qu\'est un congé de solidarité et Willy Rovelli partage son expérience au Kenya.',
    theme: 'Interview & radio',
    date: new Date('2022-06-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.francebleu.fr/emissions/planete-bleu-le-mag-planete-bleu-s-engage/donner-du-sens-3695876',
  },

  {
    slug: 'interview-france-bleu-carnaval-nice-2023',
    title: 'Carnaval de Nice 2023 — France Bleu',
    content: 'À l\'occasion du Carnaval de Nice 2023, Delphine Thibaut était au micro de Willy Rovelli afin de présenter les congés de solidarité de Sens Solidaires à l\'international, notamment au Kenya.',
    theme: 'Interview & radio',
    date: new Date('2023-02-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.francebleu.fr/emissions/on-n-est-pas-a-l-abri-d-faire-une-bonne-emission/en-direct-du-carnaval-de-nice-6228875#MainContent',
  },

  {
    slug: 'interview-france-bleu-pays-savoie-2022',
    title: 'Interview France Bleu Pays de Savoie — Exposition Casamance',
    content: 'Interview réalisé par Laurent Pascal de France Bleu Pays de Savoie dans sa chronique Plus vertes mes savoie, afin de promouvoir l\'exposition "De la Haute Savoie à la Casamance : comprendre la crise climatique".',
    theme: 'Interview & radio',
    date: new Date('2022-11-11'),
    image_url: '/images/locations/AGADA-senegal.jpg',
    external_url: null,
  },

  // ── Vie de l'association ──
  {
    slug: 'exposition-linogravures-felix-richard-2016',
    title: 'Exposition — Linogravures de Felix Richard',
    content: 'Novembre 2016 : Exposition des linogravures de Felix Richard sur le papier en bouse d\'éléphant du Sri Lanka. 25 euros le tableau encadré, l\'argent retourne directement à la Fabrique du papier pour maintenir son développement.',
    theme: 'Vie de l\'association',
    date: new Date('2016-11-01'),
    image_url: '/images/fabrique_eco_maximus_srilanka.jpg',
    external_url: null,
  },

  {
    slug: 'exposition-correspondances-maison-environnement-2017',
    title: 'Exposition des correspondances scolaires — Maison de l\'Environnement',
    content: 'Du 24 mai au 27 juin 2017, exposition des travaux des correspondances des élèves sur le développement durable à la Maison de l\'Environnement de Nice.',
    theme: 'Vie de l\'association',
    date: new Date('2017-05-24'),
    image_url: '/images/jardin_potager_senegal.jpg',
    external_url: null,
  },

  {
    slug: 'jardiniere-college-roland-garros-2021',
    title: 'Installation d\'une jardinière au collège Roland-Garros',
    content: '2021 : Installation d\'une jardinière au collège Roland-Garros de Nice dans le cadre de notre programme d\'éducation au développement durable.',
    theme: 'Éducation & sensibilisation',
    date: new Date('2021-01-01'),
    image_url: '/images/jardin_potager_senegal.jpg',
    external_url: null,
  },

  {
    slug: 'reprise-activites-grand-geneve-2020',
    title: 'Reprise des activités sur l\'antenne du Grand Genève',
    content: '2020 : Reprise des activités sur l\'antenne du Grand Genève après la crise sanitaire. Nouvelles animations et projets éducatifs pour les établissements scolaires de la région.',
    theme: 'Vie de l\'association',
    date: new Date('2020-09-01'),
    image_url: '/images/hero_missions.jpg',
    external_url: null,
  },
]

await prisma.mediaPost.deleteMany({})
await prisma.mediaPost.createMany({ data: MEDIA_POSTS })
console.log(`MediaPosts créés (${MEDIA_POSTS.length})`)

console.log(`MediaPosts créés (${MEDIA_POSTS.length})`)

// ============================================================
// 8 — ARTICLES :  EDUCATION ET SENSIBILISATIONS
// ============================================================

const EDUCATION_ITEMS = [
  // ── Ateliers ──
  {
    slug: 'atelier-elephant',
    title: 'Explorer le monde animal : l\'éléphant',
    description: 'Le plus grand mammifère terrestre est menacé d\'extinction (plus de 25 000 individus tués en 2019). Pourtant cet animal joue un rôle clé dans l\'écosystème.',
    content: `Le savais-tu ? Le plus grand mammifère terrestre est menacé d'extinction avec plus de 25 000 individus tués en 2019. Pourtant cet animal joue un rôle clé dans l'écosystème.

Cet atelier permet aux élèves de découvrir le monde fascinant des éléphants, leur rôle dans la biodiversité et les menaces qui pèsent sur leur survie. À travers des jeux pédagogiques et des supports visuels, les élèves développent leur sens de la solidarité et leur conscience environnementale.`,
    type: 'Atelier',
    public: 'primaire,college_lycee',
    image_url: '/images/fabrique_eco_maximus_srilanka.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/Plaquette-atelier-marque-page-elephant.pdf',
  },

  {
    slug: 'atelier-jeu-7-familles-mediterranee',
    title: 'Jeu de 7 familles : les écosystèmes de la mer Méditerranée',
    description: 'On estime qu\'environ 10% de la vie océanique est identifiée à ce jour. Avec le dérèglement climatique, des espèces que nous ne connaissons pas encore ont sûrement déjà disparu.',
    content: `Le savais-tu ? On estime qu'environ 10% de la vie océanique est identifiée à ce jour. Avec le dérèglement climatique des espèces que nous ne connaissons pas encore ont sûrement déjà disparues. Ce jeu de 7 familles pédagogique permet aux élèves de découvrir les différents écosystèmes de la mer Méditerranée, leurs habitants et les menaces qui pèsent sur eux. Un outil ludique pour sensibiliser à la protection des océans.`,
    type: 'Atelier',
    public: 'primaire,college_lycee',
    image_url: '/images/hero_missions.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/plaquette-ATELIERS-jeu-de-7-familles.pdf',
  },

  {
    slug: 'atelier-forets-primaires',
    title: 'À la découverte des forêts primaires',
    description: 'Les forêts tropicales primaires abritent l\'essentiel de la biodiversité terrestre : 70% des espèces végétales et 80% des espèces vertébrées.',
    content: `Le savais-tu ? Les forêts tropicales primaires abritent l'essentiel de la biodiversité terrestre : 70% des espèces végétales et 80% des espèces vertébrées. Cet atelier invite les élèves à explorer les forêts primaires du monde, comprendre leur importance pour la planète et découvrir les menaces qui pèsent sur ces écosystèmes uniques. Un voyage au cœur de la biodiversité.`,
    type: 'Atelier',
    public: 'primaire,college_lycee',
    image_url: '/images/locations/batu-kapal-sumatra.jpg',
    external_url: 'https://www.sensolidaire.org/wp-content/uploads/2025/01/Plaquette-atelier-forets-primaires.pdf',
  },

  {
    slug: 'atelier-ecsi-odd',
    title: 'Atelier d\'éducation à la citoyenneté et à la solidarité internationale (ECSI)',
    description: 'Découvrez les 17 ODD pour un monde plus juste, plus durable et plus solidaire. Grâce à des jeux pédagogiques, abordez les notions de vivre ensemble et de solidarité internationale.',
    content: `Découvrez avec nous les 17 ODD pour un monde plus juste, plus durable et plus solidaire. Grâce à différents jeux pédagogiques nous aborderons les notions de vivre ensemble, de stéréotypes, mais aussi différents types d'inégalités à travers le monde. Nous intervenons dans vos locaux (avec notre matériel) ou nous pouvons vous réserver une salle appropriée dans nos bureaux.`,
    type: 'Atelier',
    public: 'college_lycee,adultes',
    image_url: '/images/jardin_potager_senegal.jpg',
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
    image_url: '/images/jardin_potager_senegal.jpg',
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
    image_url: '/images/jardin_potager_kenya.jpg',
    external_url: null,
  },
]

await prisma.educationItem.deleteMany({})
await prisma.educationItem.createMany({ data: EDUCATION_ITEMS })
console.log(`EducationItems créés (${EDUCATION_ITEMS.length})`)

// Médias — correspondances scolaires
const correspondances = await prisma.educationItem.findUnique({ where: { slug: 'correspondances-scolaires' } })
await prisma.media.deleteMany({ where: { entity_type: 'education_item', entity_id: correspondances.id } })
await prisma.media.createMany({
  data: [
    { entity_type: 'education_item', entity_id: correspondances.id, file_url: 'https://webmedias.ac-nice.fr/africa2020/', file_type: 'link', label: 'Plateforme du Rectorat de Nice', display_order: 0 },
    { entity_type: 'education_item', entity_id: correspondances.id, file_url: '/images/jardin_potager_senegal.jpg', file_type: 'image', display_order: 1 },
    { entity_type: 'education_item', entity_id: correspondances.id, file_url: '/images/locations/AGADA-senegal.jpg', file_type: 'image', display_order: 2 },
  ]
})

// Médias — éco-école
const ecoEcole = await prisma.educationItem.findUnique({ where: { slug: 'programme-eco-ecole' } })
await prisma.media.deleteMany({ where: { entity_type: 'education_item', entity_id: ecoEcole.id } })
await prisma.media.createMany({
  data: [
    { entity_type: 'education_item', entity_id: ecoEcole.id, file_url: 'https://www.eco-ecole.org/', file_type: 'link', label: 'Site officiel Éco-École', display_order: 0 },
    { entity_type: 'education_item', entity_id: ecoEcole.id, file_url: 'http://espace-etablissement.eco-ecole.org/signup', file_type: 'link', label: 'S\'inscrire au programme (gratuit)', display_order: 1 },
    { entity_type: 'education_item', entity_id: ecoEcole.id, file_url: 'https://www.eco-ecole.org/webinaires-eco-ecole/', file_type: 'link', label: 'Modules de formation mensuels', display_order: 2 },
    { entity_type: 'education_item', entity_id: ecoEcole.id, file_url: 'https://www.eco-ecole.org/qui-sommes-nous/', file_type: 'link', label: 'Contacter l\'équipe Éco-École', display_order: 3 },
    { entity_type: 'education_item', entity_id: ecoEcole.id, file_url: '/images/jardin_potager_kenya.jpg', file_type: 'image', display_order: 4 },
  ]
})

console.log('Médias EducationItems créés')

// ============================================================
// 9 — ACTIVITY REPORTS
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
// 10 — DELEGATIONS
// ============================================================

await prisma.delegation.deleteMany({})
await prisma.delegation.createMany({
  data: [
    { pays: "Kenya", flag_code: "ke", image_url: "/images/locations/LUMO-kenya.jpeg", lieu: "LUMO Community Wildlife Sanctuary", contacts: "Denis (coordinateur), Ernest (chargé des projets biodiversité) et les 22 Rangers", display_order: 1 },
    { pays: "Kenya", flag_code: "ke", image_url: "/images/locations/TTNP-kenya.jpeg", lieu: "Taita Taveta National Polytechnic", contacts: "Kefa Okari (Coordinateur des missions, professeur de français), Madeline Nabwire (directrice du département de tourisme)", display_order: 2 },
    { pays: "Kenya", flag_code: "ke", image_url: "/images/locations/ECT-kenya.jpeg", lieu: "Elsa Conservation Trust", contacts: "Antony — Coordinateur des missions", display_order: 3 },
    { pays: "Sénégal", flag_code: "sn", image_url: "/images/locations/AGADA-senegal.jpg", lieu: "Association AGADA", contacts: "François Bassene et Penda Diémé", display_order: 4 },
    { pays: "Sénégal", flag_code: "sn", image_url: "/images/locations/campement-senegal.jpg", lieu: "Campement de l'Ile d'Effrane", contacts: "Mamadou Ndiaye", display_order: 5 },
    { pays: "Sri Lanka", flag_code: "lk", image_url: "/images/locations/mef-sri-lanka.jpg", lieu: "Millenium Elephant Foundation", contacts: "Nalaka — Chargé des volontaires, Sara — Coordinatrice des missions", display_order: 6 },
    { pays: "Pérou amazonien", flag_code: "pe", image_url: "/images/locations/amazon-shelter-perou.jpg", lieu: "Amazon Shelter", contacts: "Magali, Kim et Latam", display_order: 7 },
    { pays: "Sumatra", flag_code: "id", image_url: "/images/locations/batu-kapal-sumatra.jpg", lieu: "Batu Kapal Conservation", contacts: "L'équipe Batu Kapal Conservation", display_order: 8 },
  ]
})
console.log('Délégations créées (8)')

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
    // Direction
    { nom: "Delphine Thibaut", role: "Fondatrice et Chargée des Programmes", description: "Master administratrice S.I. Institut Bioforce — Ancienne guide spécialisée Afrique", avatar_url: "/avatar-women.png", category: "direction", display_order: 1 },
    { nom: "Arya Monchauzou", role: "Chargée des projets des Alpes-Maritimes", description: "Master Risques et Environnement", avatar_url: "/avatar-women.png", category: "direction", display_order: 2 },
    { nom: "Amna Labidi", role: "Chargée de mission Service Civique", description: "Licence Sciences de la vie — Master biologie (en cours)", avatar_url: "/avatar-women.png", category: "direction", display_order: 3 },
    { nom: "Emile Augsburger", role: "Chargé de mission Service Civique", description: "Ingénieur écologue HES-SO", avatar_url: "/avatar-men.png", category: "direction", display_order: 4 },
    { nom: "Clémence Armanet", role: "Chargée de mission Service Civique", description: "Master Ecologie de l'anthropocène", avatar_url: "/avatar-women.png", category: "direction", display_order: 5 },
    { nom: "Eymeric Coffi", role: "Chargé de mission Service Civique", description: "Master en science de Gestion et Marketing", avatar_url: "/avatar-men.png", category: "direction", display_order: 6 },
    // Bureau
    { nom: "Elodie Tisserand", role: "Présidente", description: "Management de projets culturels et innovation — Chargée des projets d'éducation populaire.", avatar_url: "/avatar-women.png", category: "bureau", display_order: 1 },
    { nom: "Hervé Caffin", role: "Trésorier", description: "Responsable affaires transition énergétique Paris — Ancien chargé de mission pour Energie Solidaire au Burkina Faso.", avatar_url: "/avatar-men.png", category: "bureau", display_order: 2 },
    { nom: "Lynda Tabet", role: "Secrétaire", description: "Coach professionnel — Professeur de Yoga — Coordinatrice projets Transition Bien-être.", avatar_url: "/avatar-women.png", category: "bureau", display_order: 3 },
    // CA
    { nom: "Ingrid von Anthoni", role: "Chargée des plaidoyers sur le massacre des éléphants", avatar_url: "/avatar-women.png", category: "ca", display_order: 1 },
    { nom: "Virginie Blumet", role: "Manager International Business Finance WWF", avatar_url: "/avatar-women.png", category: "ca", display_order: 2 },
    { nom: "Emilie della-guardia", role: "Professeure de Science et Vie de la Terre", avatar_url: "/avatar-women.png", category: "ca", display_order: 3 },
    { nom: "Crystel Cantariti", role: "Professeure des écoles", avatar_url: "/avatar-women.png", category: "ca", display_order: 4 },
    { nom: "Marc Olivier", role: "Consultant, professeur en ethnobotanique", avatar_url: "/avatar-men.png", category: "ca", display_order: 5 },
    { nom: "Coralie Pinchart", role: "Master 2 économie de développement à l'International", avatar_url: "/avatar-women.png", category: "ca", display_order: 6 },
    { nom: "John Rebmann", role: "Ancien directeur financier de Parcs Hôteliers", avatar_url: "/avatar-men.png", category: "ca", display_order: 7 },
    { nom: "Brigitte Schwarz", role: "Chargée de communication", avatar_url: "/avatar-women.png", category: "ca", display_order: 8 },
    { nom: "Patricia Valensi", role: "Docteur en Préhistoire, paléontologue", avatar_url: "/avatar-women.png", category: "ca", display_order: 9 },
    { nom: "Eduardo Widakowich", role: "Consultant en gestion de projet développement durable", avatar_url: "/avatar-men.png", category: "ca", display_order: 10 },
    { nom: "Johanna Zerbib", role: "Responsable Opérations Thompson Africa", avatar_url: "/avatar-women.png", category: "ca", display_order: 11 },
    // Également à nos côtés
    { nom: "Bertrand D.", role: "Infographiste", avatar_url: "/avatar-men.png", category: "egalement", display_order: 1 },
    { nom: "Thierry Montalban", role: "Agence de communication", avatar_url: "/avatar-men.png", category: "egalement", display_order: 2 },
    { nom: "Sabine Jerome", role: "Comptabilité", avatar_url: "/avatar-women.png", category: "egalement", display_order: 3 },
  ]
})
console.log('TeamMembers créés (23)')

// ============================================================
// 13 — LOGOS PARTENAIRES
// ============================================================

await prisma.partner.deleteMany({})
await prisma.partner.createMany({
  data: [
    { name: "AFD", logo_url: "/images/partners/afd.png", display_order: 1 },
    { name: "Alpes-Maritimes", logo_url: "/images/partners/alpes-maritimes.png", display_order: 2 },
    { name: "Annemasse", logo_url: "/images/partners/annemasse.png", display_order: 3 },
    { name: "Eco-Ecole", logo_url: "/images/partners/eco-ecole.png", display_order: 4 },
    { name: "Festival des Solidarités", logo_url: "/images/partners/festival-solidarites.png", display_order: 5 },
    { name: "Fonds Jacques Martel", logo_url: "/images/partners/fonds-jacques-martel.png", display_order: 6 },
    { name: "FONJEP", logo_url: "/images/partners/fonjep.png", display_order: 7 },
    { name: "France Volontaires", logo_url: "/images/partners/france-volontaires.png", display_order: 8 },
    { name: "Haute-Savoie", logo_url: "/images/partners/haute-savoie.png", display_order: 9 },
    { name: "IUCN", logo_url: "/images/partners/iucn.png", display_order: 10 },
    { name: "Jeunesse et Sport", logo_url: "/images/partners/jeunesse-sport.jpg", display_order: 11 },
    { name: "Métropole Nice Côte d'Azur", logo_url: "/images/partners/metropole-nice.png", display_order: 12 },
    { name: "Ministère des Affaires Étrangères", logo_url: "/images/partners/ministere-affaires-etrangeres.png", display_order: 13 },
    { name: "Ministère de l'Éducation", logo_url: "/images/partners/ministere-education.png", display_order: 14 },
    { name: "PNUE", logo_url: "/images/partners/pnue.png", display_order: 15 },
    { name: "Service Civique", logo_url: "/images/partners/service-civique.png", display_order: 16 },
    { name: "Territoires Solidaires", logo_url: "/images/partners/territoires-solidaires.png", display_order: 17 },
    { name: "Ville de Nice", logo_url: "/images/partners/ville-nice.png", display_order: 18 },
  ]
})
console.log('Partners créés (18)')

// ============================================================
// RÉCAP FINAL
// ============================================================
  console.log("")
  console.log("Seed terminé avec succès !")
  console.log("─────────────────────────────────────────")
  console.log(`Admin      : admin@sensolidaire.org`)
  console.log(`Password   : Admin1234!`)
  console.log(`Missions   : 9`)
  console.log(`Pricing    : 20 lignes`)
  console.log(`Locations  : 13`)
  console.log(`Témoignages: 7 (6 approved, 1 pending)`)
  console.log("─────────────────────────────────────────")
  console.log("Changer le mot de passe admin AVANT la mise en production !")
  console.log(`FieldActions: 8`)
  console.log(`MediaPosts : ${MEDIA_POSTS.length}`)
  console.log(`EducationItems créés (${EDUCATION_ITEMS.length})`)
  console.log('ActivityReports : 13')
  console.log('Délégations     : 8')
  console.log('MissionReports  : 17')
  console.log('TeamMembers     : 23')
  console.log('Partners        : 5')
}

seed()
  .catch((error) => {
    console.error("Erreur seed :", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

  