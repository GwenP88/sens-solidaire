// ActionDetail.jsx
// Page détail d'une action terrain — hero, description, ODD, galerie, CTA

import { useParams } from 'react-router-dom'
import HeroPage from '../components/layout/HeroPage'
import Badge from '../components/ui/BadgeODD'
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import ScrollToTop from '../components/ui/ScrollToTop'
import { IconPin } from '../utils/icons'

// Données statiques — à remplacer par API GET /api/actions/:slug
const ACTIONS = [
  {
    slug: 'fabrique-papier-maktau-kenya',
    title: 'Fabrique de papier écologique de Maktau',
    description: 'Soutien au développement d’une activité économique durable grâce au recyclage de la bouse d’éléphant.',
    content: `Afin de soutenir les communautés locales tout en préservant les richesses naturelles de leur territoire, nous avons accompagné le développement d’une fabrique de papier recyclé à partir de bouse d’éléphant. Cette initiative originale permet de créer une activité économique durable, génératrice de revenus pour les habitants, tout en valorisant une ressource naturelle abondante et respectueuse de l’environnement.

    La fabrication de ce papier artisanal est entièrement naturelle. Elle repose sur des méthodes de production à faible impact environnemental, utilisant notamment l’énergie du soleil et du vent. Les articles réalisés sont ensuite utilisés dans les écoles françaises, notamment dans le cadre des activités d’arts plastiques, créant ainsi un véritable lien entre sensibilisation, éducation et développement durable.

    Le processus de fabrication débute par le nettoyage des fibres contenues dans les déjections d’éléphants afin d’en retirer les impuretés. Celles-ci sont ensuite bouillies pendant plusieurs heures pour être stérilisées et assouplies avant d’être transformées en pâte à papier. Ce savoir-faire permet de produire de nombreux objets du quotidien : feuilles de papier au format A4, cahiers, albums photo, cadres, cartes postales, enveloppes ou encore marque-pages.

    En choisissant ces créations, chacun contribue à soutenir les populations engagées dans la protection de leur environnement. Ces achats participent également à la préservation des éléphants, à la protection des forêts et au développement d’une économie locale respectueuse du patrimoine naturel`,
    tags: ['Environnement', 'Biodiversité'],
    country: 'Kenya',
    image: '/images/jardin_potager_kenya.jpg',
    odds: [8, 12, 15],
    gallery: ['/images/jardin_potager_kenya.jpg', '/images/locations/LUMO-kenya.jpeg', '/images/jardin_potager_senegal.jpg'],
  },
  {
    slug: 'patrouilles-rangers-lumo',
    title: 'Patrouilles avec les rangers du sanctuaire LUMO',
    description: 'Depuis plus de 10 ans, l\'association investit ses efforts au sanctuaire de LUMO pour soutenir les rangers dans leur mission de lutte contre le braconnage.',
    content: `Depuis plus de 10 ans, l'association investit ses efforts au sanctuaire de LUMO, frontalier du Parc Tsavo, pour soutenir les rangers dans leur mission de lutte contre le braconnage.

Soutien aux patrouilles, relevés de données sur la faune, entretien du matériel et du camp de base, nos volontaires ont régulièrement contribué à la vie du sanctuaire et à la protection de vie animale.`,
    tags: ['Environnement', 'Biodiversité'],
    country: 'Kenya',
    image: '/images/locations/LUMO-kenya.jpeg',
    odds: [15, 16],
    gallery: ['/images/locations/LUMO-kenya.jpeg', '/images/jardin_potager_kenya.jpg'],
  },
  {
    slug: 'potager-agro-ecologique-ttnp',
    title: 'Potager agro-écologique face à la sécheresse',
    description: 'Projet mené conjointement avec les élèves du TTNP de Voi visant à améliorer la production durable de cultures et diffuser les connaissances sur l\'agroécologie.',
    content: `Ce projet mené conjointement avec les élèves du TTNP de Voi vise à améliorer la production durable de cultures et de produits d'origine animale.

Les objectifs spécifiques sont les suivants : utiliser la ferme pour diffuser les connaissances sur l'agriculture transformatrice aux agriculteurs et aux étudiants en adoptant l'agroécologie, créer un environnement microclimatique pour aider à atténuer les impacts climatiques, adopter la diversification de la production.`,
    tags: ['Agriculture', 'Éducation'],
    country: 'Kenya',
    image: '/images/locations/TTNP-kenya.jpeg',
    odds: [2, 13, 15],
    gallery: ['/images/locations/TTNP-kenya.jpeg', '/images/jardin_potager_kenya.jpg'],
  },
  {
    slug: 'jardins-potagers-senegal',
    title: 'Jardins potagers et consommation responsable',
    description: 'En partenariat avec l\'association AGADA, nous avons installé des potagers dans les établissements scolaires de Casamance.',
    content: `Avec ce projet nous avons développé des échanges entre deux écoles primaires, quatre collèges et deux lycées de la Métropole de Nice et une école primaire et quatre collèges dans le territoire de la Casamance au Sénégal sur le thème de la consommation responsable.

Nous avons installé, en partenariat avec l'association sénégalaise AGADA, des potagers dans les établissements dans le but de former les élèves à la production et à la consommation responsable, facteur bien être et de bonne santé.

Les élèves de CEM Kénia ont mis en place un projet de jardin potager de 150m² dont la production abondante a permis d'ouvrir une boutique à destination des professeurs de l'école et du personnel. Cette boutique est un moyen privilégié pour initier les élèves au monde de l'entrepreneuriat.`,
    tags: ['Agriculture', 'Éducation'],
    country: 'Sénégal',
    image: '/images/jardin_potager_senegal.jpg',
    odds: [3, 12, 15],
    gallery: ['/images/jardin_potager_senegal.jpg', '/images/locations/AGADA-senegal.jpg'],
  },
  {
    slug: 'correspondances-scolaires-senegal',
    title: 'Correspondances scolaires France — Sénégal',
    description: 'Des échanges entre écoles de la Métropole de Nice et des établissements de Casamance sur le thème de la consommation responsable.',
    content: `En parallèle des projets de jardins potagers, les élèves de France et du Sénégal ont pu se rencontrer et échanger sur leurs actions grâce au don d'un ordinateur portable au collège de Ziguinchor.

Les élèves ont ainsi pu discuter de leurs cultures, leurs habitudes scolaires, alimentaires, musicales, sportives, de leurs traditions, d'interculturalité au sens large, et de production et de consommation responsable.

Concernant les écoles primaires, une correspondance épistolaire a été réalisée entre les élèves de Nice et de Ziguinchor dans le but de promouvoir la solidarité internationale.`,
    tags: ['Éducation', 'Échanges culturels'],
    country: 'Sénégal / France',
    image: '/images/locations/AGADA-senegal.jpg',
    odds: [4, 10, 17],
    gallery: ['/images/locations/AGADA-senegal.jpg', '/images/jardin_potager_senegal.jpg'],
  },
  {
    slug: 'correspondances-amazonie',
    title: 'Correspondances avec les écoles d\'Amazonie',
    description: 'Suite à la rencontre avec le Chef Raoni, nous avons mis en place une correspondance entre des écoles françaises et le peuple Kukama kukamiria.',
    content: `Notre organisation a reçu les 5ᵉ trophées de l'Environnement de la ville de Nice par le Cacique Raoni Metuktire, Chef du peuple Kayapo (Brésil) le 6 juin 2014.

Lors de cet échange, nous avons promis au Grand Chef Raoni de répondre à sa demande : présenter la culture du peuple Kayapo aux scolaires français et de mettre en place une correspondance avec une école d'Amazonie.

Pour commencer une correspondance, nous avons choisi le thème "Un jardin au cœur de la forêt". Dans la forêt tropicale vivent les Indiens. Ils savent tirer parti de leur environnement sans le détruire. La forêt procure presque tout : de quoi se nourrir, se soigner, fabriquer des objets.`,
    tags: ['Éducation', 'Échanges culturels'],
    country: 'Pérou',
    image: '/images/jardin_potager_kenya.jpg',
    odds: [4, 10, 15],
    gallery: ['/images/jardin_potager_kenya.jpg'],
  },
  {
    slug: 'projet-puits-sri-lanka',
    title: 'Accès à l\'eau potable dans les écoles',
    description: 'Nous finançons des forages dans les écoles du Sri Lanka pour garantir un accès durable à l\'eau potable.',
    content: `Nous finançons des forages dans les écoles du Sri Lanka pour garantir un accès durable à l'eau potable aux élèves et aux communautés locales.

Ce projet contribue directement à l'amélioration des conditions de vie et de scolarisation des enfants, tout en renforçant la résilience des communautés face aux enjeux climatiques.`,
    tags: ['Accès à l\'eau', 'Éducation'],
    country: 'Sri Lanka',
    image: '/images/puit-srilanka.jpg',
    odds: [3, 6, 4],
    gallery: ['/images/puit-srilanka.jpg'],
  },
  {
    slug: 'fabrique-eco-maximus',
    title: 'Fabrique de papier Eco Maximus',
    description: 'Sens Solidaire soutient la fabrique Eco Maximus en promouvant ses objets artisanaux issus de bouse d\'éléphant.',
    content: `Sens Solidaire soutient la fabrique Eco Maximus en promouvant ses objets artisanaux issus de bouse d'éléphant, contribuant à la protection de la biodiversité et à l'économie locale au Sri Lanka.

Cette initiative permet aux artisans locaux de valoriser des ressources naturelles tout en sensibilisant les visiteurs à la protection des éléphants et de leur habitat.`,
    tags: ['Environnement', 'Biodiversité'],
    country: 'Sri Lanka',
    image: '/images/fabrique_eco_maximus_srilanka.jpg',
    odds: [8, 12, 15],
    gallery: ['/images/fabrique_eco_maximus_srilanka.jpg'],
  },
]

function ActionDetail() {
  const { slug } = useParams()
  const action = ACTIONS.find(a => a.slug === slug)

  if (!action) return (
    <div className="p-12 text-center">
      <p className="font-body text-primary/60">Action introuvable.</p>
      <a href="/notre-impact" className="text-accent underline text-sm">← Retour aux actions</a>
    </div>
  )

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image={action.image}
        title={action.title}
      />

      {/* ── Contenu principal ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6">

          {/* Lien retour */}
          <a href="/notre-impact" className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
            ← Retour aux actions
          </a>

          {/* Tags */}
          <div className="flex gap-3 flex-wrap">
            {action.tags.map(tag => (
              <span key={tag} className="font-body text-xs text-primary/70 border border-primary/20 rounded-full px-3 py-1">
                {tag}
              </span>
            ))}
          </div>

          {/* H2 pleine largeur */}
          <h2 className="section-title text-primary">{action.description}</h2>

          {/* 2/3 texte + 1/3 sidebar */}
          <div className="flex gap-12 items-start">

            {/* Texte — 2/3 */}
            <div className="flex-1 flex flex-col gap-4">
              {action.content.split('\n\n').map((para, i) => (
                <p key={i} className="font-body text-sm text-primary/80 leading-relaxed">
                  {para}
                </p>
              ))}

              {/* CTA + pays */}
              <div className="flex items-center justify-center gap-8 mt-4">
                <p className="font-heading font-bold text-primary flex items-center gap-2 shrink-0">
                  <IconPin className="text-accent-2" /> {action.country}
                </p>
                <a href={`/notre-impact?pays=${action.country}`}>
                  <Button label={`Voir toutes les actions au ${action.country} →`} variant="secondary" />
                </a>
              </div>
            </div>

            {/* Sidebar — 1/3 */}
            <div className="w-1/3 shrink-0 flex flex-col gap-6">

              {/* Image */}
              <div className="w-full h-56 overflow-hidden rounded-2xl">
                <img src={action.image} alt={action.title} className="w-full h-full object-cover" />
              </div>

              {/* ODD */}
              <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-3">
                <p className="font-body text-xs font-bold text-primary/40 uppercase tracking-widest">ODD associés</p>
                <div className="grid grid-cols-3 gap-3 justify-items-center">
                  {action.odds.map(n => (
                    <div key={n} className="flex flex-col items-center gap-1">
                      <img
                        src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(n).padStart(2, '0')}.jpg`}
                        alt={`ODD ${n}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Galerie ── */}
      {action.gallery?.length > 0 && (
        <section className="section-padding bg-accent-2">
          <h2 className="section-title text-surface mb-8">Galerie photos</h2>
          <Carousel
            items={action.gallery}
            slidesPerView={3}
            spaceBetween={16}
            showPagination={true}
            color="primary"
            renderSlide={(img) => (
              <div className="w-full h-56 overflow-hidden rounded-xl">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          />
        </section>
      )}

      <ScrollToTop />
    </div>
  )
}

export default ActionDetail