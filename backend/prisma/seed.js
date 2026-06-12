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
  // ÉTAPE 1 — ADMIN
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
  // ÉTAPE 2 — MISSIONS
  // ============================================================

  // ── Mission 1 : Kenya ──────────────────────────────────────
  const kenyaData = {
    type: "volontariat_individuel",
    title: "Programme de volontariat au Kenya",
    country: "Kenya",
    image_url: "/images/kenya.jpg",
    short_description: "Patrouilles avec les rangers, recensement de la faune et échanges interculturels avec les élèves kényans.",
    description: "Partez au Kenya pour contribuer à la préservation de la biodiversité aux côtés des communautés locales, des étudiants et des rangers. Entre réserves naturelles, projets éducatifs et initiatives de développement durable, vivez une expérience immersive, utile et profondément humaine.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Patrouilles avec les rangers et participation aux actions de conservation de la biodiversité.</li><li>Recensement de la faune sauvage et des espèces d'oiseaux.</li><li>Entretien des équipements et appui aux projets environnementaux.</li><li>Mise en place et suivi des correspondances scolaires entre la France et le Kenya.</li><li>Accompagnement des élèves et étudiants dans leurs projets éducatifs et interculturels.</li><li>Partage de compétences selon votre expérience : informatique, gestion de projet, tourisme solidaire, hôtellerie, restauration, communication, etc.</li><li>Soutien aux initiatives locales de développement durable, d'agroécologie et d'entrepreneuriat.</li></ul>",
    programme: "Jour 1 : Transfert depuis l'aéroport, déjeuner, installation, briefing et orientation avant le dîner.\nJour 2 : Formation sur l'observation de la faune, recommandations sécurité, rencontre avec le référent rangers et le chargé des projets biodiversité, présentation de la communauté locale.\nJours 3-6 : Programme des volontaires : 4 jours enrichissants en participant aux projets de développement.\nWeek-end : Quartier libre — visite des Sanctuaires, Parc Tsavo, Hell's Gate, Lac Naivasha, Parc Amboseli ou côte océanienne de Mombasa.\nJours 9-13 : Finalisation du programme de développement avec les communautés.\nJour 14 : Séparation avec la communauté et transfert vers l'aéroport.",
    included: "Les frais de mission comprennent l'hébergement, la restauration, les déplacements sur place ainsi que l'encadrement par nos équipes et partenaires locaux.",
    not_include: "Les frais de mission ne comprennent pas l'adhésion à l'association (25 €), les billets d'avion (~700 €, avec option annulation fortement recommandée), l'assurance voyage, les frais de visa (32 €), ainsi que les éventuels vaccins et frais de pharmacie et les activités du week-end et les déplacements personnels hors programme.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Mombasa ou Paris › Nairobi",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et nous les envoyer",
      "Payer les frais de mission et adhérer à l'association (25 €)",
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
    where: { slug: "kenya" },
    update: kenyaData,
    create: { slug: "kenya", ...kenyaData },
  })

  // ── Mission 2 : Sénégal ────────────────────────────────────
  const senegalData = {
    type: "volontariat_individuel",
    title: "Programme de volontariat au Sénégal",
    country: "Sénégal",
    image_url: "/images/senegal.jpg",
    short_description: "Correspondances scolaires, jardins potagers, reboisement de la mangrove et appui aux femmes maraîchères.",
    description: "Partez à la découverte de la Casamance et engagez-vous aux côtés de nos partenaires locaux à Ziguinchor. Entre échanges avec les écoles, soutien aux jardins potagers, projets d'accès à l'eau et rencontres avec les communautés, vous contribuerez à des actions concrètes tout en vivant une expérience humaine authentique au cœur du Sénégal.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Correspondance scolaire et échanges interculturels avec les élèves locaux.</li><li>Visites terrain et suivi des projets en cours.</li><li>Appui aux projets jardin potager, filtres à eau et puits.</li><li>Sensibilisation communautaire au développement durable.</li><li>Soutien aux groupements de femmes maraîchères.</li><li>Reboisement de la mangrove et actions environnementales.</li><li>Coordination des visioconférences collèges entre Nice et le Sénégal.</li><li>Contribution au chantier de digue sur l'île d'Effrane.</li></ul>",
    programme: "8h : Petit déjeuner.\n9h à 12h : Activités de la matinée — correspondance scolaire, visites terrain.\n12h : Déjeuner.\n14h à 17h : Visite de l'avancement des projets sur place — jardin potager, utilisation des filtres à eau et puits.\n19h : Dîner.",
    included: "Hébergement chez l'habitant ou en gîte local, repas, encadrement sur place, transport local.",
    not_include: "Billet d'avion (~800€, avec option annulation fortement recommandée), assurance voyage, vaccins, visa (ressortissants hors CEDEAO), dépenses personnelles.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Cap Skirring puis prendre la navette jusqu’à Ziguinchor.",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et nous les envoyer",
      "Payer les frais de mission et adhérer à l'association (25 €)",
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
    where: { slug: "senegal" },
    update: senegalData,
    create: { slug: "senegal", ...senegalData },
  })

  // ── Mission 3 : Pérou ──────────────────────────────────────
  const perouData = {
    type: "volontariat_individuel",
    title: "Programme de volontariat au Pérou",
    country: "Pérou",
    image_url: "/images/perou.jpg",
    short_description: "Soins aux animaux sauvages en réhabilitation et sensibilisation des communautés indigènes à la protection de l'Amazonie.",
    description: "Rejoignez nos partenaires à Puerto Maldonado, au cœur de l'Amazonie péruvienne, et participez à des actions concrètes en faveur de la biodiversité. Aux côtés des équipes locales, vous contribuerez au soin des animaux du sanctuaire et aux actions de conservation menées sur le terrain. Une connaissance élémentaire de l'espagnol ou de l'anglais vous permettra de profiter pleinement de cette immersion et de faciliter les échanges avec les équipes locales.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Préparation des régimes alimentaires adaptés à chaque espèce.</li><li>Nourrissage des animaux, dont les singes hurleurs.</li><li>Cueillette de feuilles sauvages pour les animaux du sanctuaire.</li><li>Entretien et réparation des structures et enclos.</li><li>Nettoyage des espaces de vie des animaux.</li><li>Sensibilisation des communautés locales à la protection de l'Amazonie.</li><li>Soins aux perroquets, toucans, tapir.</li><li>Repérage des singes hurleurs en forêt primaire.</li><li>Sorties nocturnes pour recensement des douroucoulis.</li><li>Observation des singes laineux et atèles en réhabilitation.</li><li>Sorties dans les communautés indigènes.</li></ul>",
    programme: "7h30 : Petit déjeuner pour les volontaires.\n8h00 : Préparation des régimes alimentaires pour les animaux.\n8h30 à 9h30 : Nourrir les animaux.\n10h00 : Cueillette de feuilles sauvages pour les singes hurleurs.\n11h00 à 13h00 : Projets spécifiques — entretien et réparation.\n13h00 : Déjeuner des volontaires.\n14h00 : Régime alimentaire de l'après-midi et alimentation des animaux.\n16h00 : Nettoyage des enclos et vaisselle.\n17h00 : Préparation de la soirée — couvertures et lait.\n18h00 : Temps de repos des bénévoles.\n19h00 : Dîner des bénévoles. \n20h00 : Activités bénévoles du soir ou repos.",
    included: "Hébergement sur site, repas, encadrement par les coordinateurs locaux, formation à l'arrivée.",
    not_include: "Vols internationaux (~900€, avec option annulation fortement recommandée), assurance, visa, vaccins, équipement personnel.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Puerto Maldonado",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et nous les envoyer",
      "Payer les frais de mission et adhérer à l'association (25 €)",
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
    where: { slug: "perou" },
    update: perouData,
    create: { slug: "perou", ...perouData },
  })

  // ── Mission 4 : Sri Lanka ──────────────────────────────────
  const sriLankaData = {
    type: "volontariat_individuel",
    title: "Programme de volontariat au Sri Lanka",
    country: "Sri Lanka",
    image_url: "/images/srilanka.jpg",
    short_description: "Prenez soin des éléphants du sanctuaire MEF et participez à la préservation de la biodiversité sri lankaise.",
    description: "Partez à la rencontre des éléphants d'Asie et contribuez à leur protection au sein du sanctuaire de Kegalle. Entre soins aux animaux, découverte de la faune locale et immersion dans les traditions sri-lankaises, vivez une expérience humaine et enrichissante au cœur du Sri Lanka. Une connaissance élémentaire de l'anglais est recommandée pour faciliter les échanges avec les équipes locales et profiter pleinement de cette immersion culturelle.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Préparation des médicaments et vitamines pour les éléphants.</li><li>Nourrissage et examen vétérinaire quotidien.</li><li>Baignade des éléphants.</li><li>Nettoyage des enclos et litières.</li><li>Travaux de jardinage, peinture et recyclage dans le sanctuaire.</li><li>Gestion des soins avec le Mahout attitré</li><li>Entretien du jardin biologique, plantation d'arbres fruitiers et plantes médicinales.</li><li>Initiation à la médecine Ayurveda et aux plantes locales.</li><li>Apprendre à reconnaître les sons, mouvements, humeurs de l'éléphant</li></ul>",
    programme: "7h30 : Préparation des médicaments et vitamines des éléphants.\n8h00 : Nourrissage des éléphants et examen vétérinaire.\n8h30 : Nettoyage des enclos.\n9h00 : Petit déjeuner à la Colonial House.\n10h00 : Baignade des éléphants.\n11h00 : Nettoyage des litières.\n12h00 à 14h00 : Pause du midi.\n14h00 : Visite de la fabrique de papier Ecomaximus ou du jardin, apprentissage de la médecine Ayurveda.\n15h00 à 17h00 : Travaux dans le sanctuaire (jardinage, peinture, recyclage).\n17h00 à 18h00 : Temps libre.\n18h00 : Dîner.",
    included: "Hébergement à la Colonial House, repas, encadrement vétérinaire, initiation à la médecine Ayurveda.",
    not_include: "Vols internationaux  (~800€, avec option annulation fortement recommandée), assurance, visa Sri Lanka (52€), vaccins, dépenses personnelles.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Colombo",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et nous les envoyer",
      "Payer les frais de mission et adhérer à l'association (25 €)",
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
    where: { slug: "sri-lanka" },
    update: sriLankaData,
    create: { slug: "sri-lanka", ...sriLankaData },
  })

  // ── Mission 5 : Sumatra ────────────────────────────────────
  const sumatraData = {
    type: "volontariat_individuel",
    title: "Programme de volontariat à Sumatra",
    country: "Sumatra",
    image_url: "/images/sumatra.jpg",
    short_description: "Cartographie des habitats d'orang-outans et création de corridors forestiers pour protéger la biodiversité.",
    description: "Partez au cœur de la forêt tropicale de Sumatra et engagez-vous aux côtés de nos partenaires locaux pour protéger les orangs-outans et préserver l'un des écosystèmes les plus riches au monde. Entre observation de la faune, reboisement, projets d'éco-construction et échanges avec l'école du village, vivez une expérience humaine unique au plus près de la nature. Des bases en anglais sont recommandées pour faciliter les échanges avec les équipes locales et profiter pleinement de cette immersion.",
    volunteer_role: "<p>Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :</p><ul><li>Observation de la faune (GPS, photos, notes de terrain).</li><li>Activités de conservation : surveillance, enquête et création de corridors pour la faune.</li><li>Projets plastique Eco-Brick et gestion des déchets.</li><li>Pépinières et reboisement de la forêt tropicale.</li><li>Entretien du jardin potager.</li><li>Soutien à l'école Selang Pangeran Jungle School (aide aux cours d'anglais, sensibilisation environnementale).</li><li>Cartographies GPS des habitats orang-outans et primates.</li><li>Développer un programme de reconstitution des espèces vulnérables.</li><li>Créer des corridors entre parcs nationaux et zone tampon.</li><li>Développer meilleures pratiques agriculture et écotourisme.</li></ul>",
    programme: "6h30 : Observation de la faune — GPS, photos et notes d'observations.\n8h00 : Aide à la préparation du petit déjeuner.\n9h00 : Début des activités de conservation (surveillance, enquête et création de corridors pour la faune).\n12h00 : Aide à la préparation du déjeuner.\n13h00 à 17h00 : Selon les besoins du site — programme de conservation, projets plastique (Eco-Brick), pépinières et reboisement, entretien du jardin potager, projet école.\n17h30 : Aide à la préparation du dîner.\n18h30 : Dîner.\n19h30 à 22h30 : Promenade nocturne (repérage de mycticèbes, civettes, léopards, porcs-épics), détente, feu de camp et guitare.",
    included: "Hébergement en lodge dans la forêt, repas, encadrement par les coordinateurs locaux, équipement d'observation.",
    not_include: "Vols internationaux (~800€, avec option annulation fortement recommandée), assurance, visa Indonésie (32€), vaccins, équipement personnel de randonnée.",
    how_to_go: JSON.stringify([
      "Vérifier les vols Paris › Medan (Sumatra Nord)",
      "Nous contacter par mail à contact@sensolidaire.org",
      "Réserver vos billets d'avion et nous les envoyer",
      "Payer les frais de mission et adhérer à l'association (25 €)",
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
    where: { slug: "sumatra" },
    update: sumatraData,
    create: { slug: "sumatra", ...sumatraData },
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
  // ÉTAPE 3 — MISSION PRICING
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
  // ÉTAPE 4 — LOCATIONS
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
  // ÉTAPE 5 — TÉMOIGNAGES
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
}

seed()
  .catch((error) => {
    console.error("Erreur seed :", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })