// Home.jsx
// Page d'accueil — Hero + StatsBar + Sections

import Hero from '../components/layout/Hero'
import StatsBar from '../components/layout/StatsBar'
import MissionCard from '../components/missions/MissionCard'
import Button from '../components/ui/Button'
import TestimonialCard from '../components/testimonials/TestimonialCard'
import TestimonialCarousel from '../components/testimonials/TestimonialCarousel'

function Home() {

  const missions = [
    {
      slug: 'kenya',
      badge: 'Volontariat individuel',
      title: 'Volontariat au Kenya',
      description: 'Patrouilles avec les rangers, recensement de la faune et échanges interculturels avec les élèves kényans.',
      duration: '2 à 4 semaines',
      image: '/images/kenya.jpg'
    },
    {
      slug: 'sri-lanka',
      badge: 'Volontariat individuel',
      title: 'Volontariat au Sri Lanka',
      description: 'Prenez soin des éléphants du sanctuaire MEF et participez à la préservation de la biodiversité sri lankaise.',
      duration: '2 à 3 semaines',
      image: '/images/srilanka.jpg'
    },
    {
      slug: 'perou',
      badge: 'Volontariat individuel',
      title: 'Volontariat au Pérou',
      description: 'Soins aux animaux sauvages en réhabilitation et sensibilisation des communautés indigènes à la protection de l\'Amazonie.',
      duration: '2 à 4 semaines',
      image: '/images/perou.jpg'
    },
    {
      slug: 'senegal',
      badge: 'Volontariat individuel',
      title: 'Volontariat au Sénégal',
      description: 'Correspondances scolaires, jardins potagers, reboisement de la mangrove et appui aux femmes maraîchères.',
      duration: '2 à 4 semaines',
      image: '/images/senegal.jpg'
    },
    {
      slug: 'sumatra',
      badge: 'Volontariat individuel',
      title: 'Volontariat à Sumatra',
      description: 'Cartographie des habitats d\'orang-outans et création de corridors forestiers pour protéger la biodiversité.',
      duration: '2 à 4 semaines',
      image: '/images/sumatra.jpg'
    },
    {
      slug: 'service-civique',
      badge: 'Service civique',
      title: 'Service civique à l\'international',
      description: 'Engagez-vous 6 à 12 mois au Kenya ou au Sénégal pour l\'éducation au développement durable. Ouvert aux 16-25 ans.',
      duration: '6 à 12 mois',
      image: '/images/service_civique.jpg'
    },
  ]

  const testimonials = [
    { quote: "Ce séjour à Batu Kapal a été une aventure extraordinaire, très riche en enseignements, en rencontres et en découverte, tant animales qu'humaines.", name: "Cathy et Laurent", mission: "Sri Lanka" },
    { quote: "Une expérience humaine incroyable. J'ai appris autant des rangers que des éléphants. Partir avec Sens Solidaire, c'est revenir transformé.", name: "Sophie L.", mission: "Kenya" },
    { quote: "Prendre soin des éléphants du sanctuaire MEF a été le plus beau cadeau que je me sois offert. Une aventure qui donne vraiment du sens.", name: "Thomas D.", mission: "Sri Lanka" },
    { quote: "Une immersion totale dans la forêt amazonienne. J'ai appris à voir le monde différemment.", name: "Marie P.", mission: "Pérou" },
    { quote: "Le reboisement de la mangrove avec les communautés locales, une expérience qui change la vie.", name: "Antoine R.", mission: "Sénégal" },
  ]

  return (
    <div>
      {/* Hero + StatsBar */}
      <Hero />
      <StatsBar />

      {/* Section Missions */}
      <section className="bg-surface py-16 px-12">

        {/* En-tête de section */}
        <div className="flex justify-between items-start mb-10 px-12">
          <div>
            <h2 className="font-heading font-bold text-primary text-4xl mb-2">Nos missions</h2>
            <p className="font-body text-primary/80 text-base">
              Engagez-vous avec nous et nos partenaires dans des missions variées, pour un but commun : la protection de la biodiversité.
            </p>
          </div>
          <Button label="Voir toutes les missions →" variant="secondary" />
        </div>

        {/* Grille de missions */}
        <div className="flex flex-wrap justify-between px-12 gap-y-6">
          {missions.map((mission) => (
            <MissionCard key={mission.slug} {...mission} />
          ))}
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="bg-primary pt-16 pb-12 px-12">
        <div className="flex justify-between items-start mb-10 px-12">
          <div>
            <h2 className="font-heading font-bold text-surface text-4xl mb-2">Ils sont partis</h2>
            <p className="font-body text-surface/80 text-base">Découvrez les retours d'expérience de nos volontaires engagés à nos côtés sur le terrain.</p>
          </div>
          <Button label="Voir tous les témoignages →" variant="secondary" />
        </div>
        <div className="px-12">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Section Actions terrain */}

      {/* Section Partenaires */}
    </div>
  )
}

export default Home