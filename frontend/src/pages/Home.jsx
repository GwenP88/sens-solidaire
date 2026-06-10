// Home.jsx
// Page d'accueil — Hero + StatsBar + Sections

import Hero from '../components/layout/Hero'
import StatsBar from '../components/layout/StatsBar'
import MissionCard from '../components/missions/MissionCard'
import Button from '../components/ui/Button'
import TestimonialCard from '../components/testimonials/TestimonialCard'
import TestimonialCarousel from '../components/testimonials/TestimonialCarousel'
import ActionCard from '../components/actions/ActionCard'
import { useState, useEffect } from 'react'
import { fetchMissions } from '../services/api'
import { COUNTRY_IMAGES, getDuration, TYPE_LABELS } from '../utils/missions'

function Home() {

  const [missions, setMissions] = useState([])

  useEffect(() => {
    fetchMissions()
      .then(data => setMissions(data))
      .catch(err => console.error(err))
  }, [])

  const testimonials = [
    { quote: "Ce séjour à Batu Kapal a été une aventure extraordinaire, très riche en enseignements, en rencontres et en découverte, tant animales qu'humaines.", name: "Cathy et Laurent", mission: "Sri Lanka" },
    { quote: "Une expérience humaine incroyable. J'ai appris autant des rangers que des éléphants. Partir avec Sens Solidaire, c'est revenir transformé.", name: "Sophie L.", mission: "Kenya" },
    { quote: "Prendre soin des éléphants du sanctuaire MEF a été le plus beau cadeau que je me sois offert. Une aventure qui donne vraiment du sens.", name: "Thomas D.", mission: "Sri Lanka" },
    { quote: "Une immersion totale dans la forêt amazonienne. J'ai appris à voir le monde différemment.", name: "Marie P.", mission: "Pérou" },
    { quote: "Le reboisement de la mangrove avec les communautés locales, une expérience qui change la vie.", name: "Antoine R.", mission: "Sénégal" },
  ]

  const actions = [
    {
      slug: 'fabrique-eco-maximus',
      title: 'Fabrique de papier Eco Maximus',
      description: 'Sens Solidaire soutient la fabrique Eco Maximus en promouvant ses objets artisanaux issus de bouse d\'éléphant, contribuant à la protection de la biodiversité et à l\'économie locale au Sri Lanka.',
      tags: ['Environnement', 'Biodiversité', 'Artisanat'],
      country: 'Sri Lanka',
      image: '/images/fabrique_eco_maximus_srilanka.jpg',
      odds: [8, 12, 15]
    },
    {
      slug: 'projet-puits',
      title: 'Projet puits — accès à l\'eau potable',
      description: 'Nous finançons des forages dans les écoles du Sri Lanka pour garantir un accès durable à l\'eau potable aux élèves et aux communautés locales.',
      tags: ['Eau', 'Éducation', 'Solidarité'],
      country: 'Sri Lanka',
      image: '/images/puit-srilanka.jpg',
      odds: [3, 6, 4]
    },
    {
      slug: 'jardins-senegal',
      title: 'Jardins potagers au Sénégal',
      description: 'En partenariat avec l\'association AGADA, nous installons des potagers dans les écoles sénégalaises pour former les élèves à une consommation responsable.',
      tags: ['Agriculture', 'Éducation', 'Environnement'],
      country: 'Sénégal',
      image: '/images/jardin_potager_senegal.jpg',
      odds: [3, 12, 15]
    },
    {
      slug: 'potager-agro-ecologique',
      title: 'Potager agro-écologique',
      description: 'Avec les étudiants du TTNP de Voi, nous développons une ferme agro-écologique pour une agriculture durable face aux défis climatiques.',
      tags: ['Agriculture', 'Biodiversité', 'Éducation'],
      country: 'Kenya',
      image: '/images/jardin_potager_kenya.jpg',
      odds: [2, 13, 15]
    },
  ]

  const partners = [
    { name: 'AFD', logo: '/images/partners/afd.png' },
    { name: 'Alpes-Maritimes', logo: '/images/partners/alpes-maritimes.png' },
    { name: 'Annemasse', logo: '/images/partners/annemasse.png' },
    { name: 'Eco-Ecole', logo: '/images/partners/eco-ecole.png' },
    { name: 'Festival des Solidarités', logo: '/images/partners/festival-solidarites.png' },
    { name: 'Fonds Jacques Martel', logo: '/images/partners/fonds-jacques-martel.png' },
    { name: 'FONJEP', logo: '/images/partners/fonjep.png' },
    { name: 'France Volontaires', logo: '/images/partners/france-volontaires.png' },
    { name: 'Haute-Savoie', logo: '/images/partners/haute-savoie.png' },
    { name: 'IUCN', logo: '/images/partners/iucn.png' },
    { name: 'Jeunesse et Sport', logo: '/images/partners/jeunesse-sport.jpg' },
    { name: 'Métropole Nice Côte d\'Azur', logo: '/images/partners/metropole-nice.png' },
    { name: 'Ministère des Affaires Étrangères', logo: '/images/partners/ministere-affaires-etrangeres.png' },
    { name: 'Ministère de l\'Éducation', logo: '/images/partners/ministere-education.png' },
    { name: 'PNUE', logo: '/images/partners/pnue.png' },
    { name: 'Service Civique', logo: '/images/partners/service-civique.png' },
    { name: 'Territoires Solidaires', logo: '/images/partners/territoires-solidaires.png' },
    { name: 'Ville de Nice', logo: '/images/partners/ville-nice.png' },
  ]

  return (
    <div>
      {/* Hero + StatsBar */}
      <Hero />
      <StatsBar />

      {/* Section Missions */}
      <section className="section-padding bg-surface">
        <div className="section-header">
          <div>
            <h2 className="section-title text-primary">Nos missions</h2>
            <p className="section-subtitle text-primary/80">
              Engagez-vous avec nous et nos partenaires dans des missions variées, pour un but commun : la protection de la biodiversité.
            </p>
          </div>
          <Button label="Voir toutes les missions →" variant="secondary" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          {missions.map((mission) => (
            <MissionCard
              key={mission.slug}
              slug={mission.slug}
              title={mission.title}
              description={mission.short_description}
              image={COUNTRY_IMAGES[mission.country] || '/images/hero_missions.jpg'}
              badge={TYPE_LABELS[mission.type] || mission.type}
              duration={getDuration(mission.pricing)}
            />
          ))}
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="section-padding bg-accent-2">
        <div className="section-header">
          <div>
            <h2 className="section-title text-surface">Ils sont partis</h2>
            <p className="section-subtitle text-surface/80">Découvrez les retours d'expérience de nos volontaires engagés à nos côtés sur le terrain.</p>
          </div>
          <Button label="Voir tous les témoignages →" variant="secondary" />
        </div>
        <TestimonialCarousel testimonials={testimonials} />
      </section>

      {/* Section Actions terrain */}
      <section className="section-padding bg-surface">
        <div className="section-header">
          <div>
            <h2 className="section-title text-primary">Nos actions sur le terrain</h2>
            <p className="section-subtitle text-primary/80">Depuis plus de 15 ans, nous agissons aux côtés des communautés locales pour un impact concret et durable.</p>
          </div>
          <Button label="Voir toutes les actions →" variant="secondary" />
        </div>
        <div className="grid grid-cols-2 gap-12">
          {actions.map((action) => (
            <ActionCard key={action.slug} {...action} />
          ))}
        </div>
      </section>

      {/* Section Partenaires */}
      <section className="section-padding bg-primary">
        <div className="section-header">
          <div>
            <h2 className="section-title text-surface">Ils nous font confiance</h2>
            <p className="section-subtitle text-surface/80">Collectivités, institutions et associations s'engagent à nos côtés pour construire un monde plus solidaire.</p>
          </div>
          <Button label="En savoir plus sur nous →" variant="primary" />
        </div>
        <div className="grid grid-cols-6 gap-8 items-center">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center justify-center bg-white rounded-xl shadow-sm h-24">
              <img src={partner.logo} alt={partner.name} className="max-h-14 max-w-full object-contain" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home