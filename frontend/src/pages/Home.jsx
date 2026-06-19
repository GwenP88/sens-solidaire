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
import { fetchTestimonials, fetchFieldActions, fetchPartners } from '../services/api'

function Home() {

  const missionTypes = [
    {
      slug: 'volontariat-individuel',
      title: 'Partir en mission individuel',
      description: 'Partez seul ou à deux et participez à des projets concrets de préservation de la biodiversité aux côtés des communautés locales et des acteurs de terrain.',
      image: '/images/hero_missions.jpg',
      badge: 'Volontariat individuel',
      duration: '2 à 4 semaines',
      ctaLabel: 'Découvrir →',
      ctaUrl: '/missions?filter=individuel',
    },
    {
      slug: 'service-civique',
      title: 'Effectuer un service civique',
      description: 'Une expérience engagée pour les 16-25 ans qui permet de développer de nouvelles compétences tout en agissant pour l\'environnement et la solidarité internationale.',
      image: '/images/service_civique.jpg',
      badge: 'Service civique',
      duration: '3 à 12 mois',
      ctaLabel: 'Découvrir →',
      ctaUrl: '/missions?filter=service_civique',
    },
    {
      slug: 'groupe-jeune',
      title: 'Aventure Solidaire Jeunes',
      description: 'Des séjours solidaires conçus pour les établissements scolaires, MJC et associations souhaitant vivre une aventure collective porteuse de sens.',
      image: '/images/groupe-jeune-2.jpg',
      badge: 'Groupe jeunes',
      duration: '10 jours',
      ctaLabel: 'Découvrir →',
      ctaUrl: '/missions?filter=groupe_jeunes',
    },
    {
      slug: 'conge-solidaire',
      title: 'S\'engager en entreprise',
      description: 'Mobilisez vos collaborateurs autour d\'une mission à impact et renforcez la cohésion de vos équipes grâce à une expérience humaine et solidaire.',
      image: '/images/conge-solidaire-2.jpg',
      badge: 'Congé solidaire',
      duration: '1 à 3 semaines',
      ctaLabel: 'Découvrir →',
      ctaUrl: '/missions?filter=conge_solidaire',
    },
  ]

    const [testimonials, setTestimonials] = useState([])
    const [actions, setActions] = useState([])
    const [partners, setPartners] = useState([])

    useEffect(() => {
      fetchTestimonials()
        .then(data => setTestimonials(data.filter(t => t.show_homepage)))
        .catch(console.error)

      fetchFieldActions()
        .then(data => setActions(data.slice(0, 4)))
        .catch(console.error)

      fetchPartners()
        .then(setPartners)
        .catch(console.error)
    }, [])

  return (
    <div>
      {/* Hero + StatsBar */}
      <Hero />
      <StatsBar />

      {/* Section Missions */}
      <section className="section-padding bg-surface">
        <div className="section-header">
          <div className="max-w-4xl">
            <h2 className="section-title text-primary">Nos missions</h2>
            <p className="section-subtitle text-primary/80">
              Il existe mille façons de s'engager. Mission individuelle, service civique, séjour en groupe ou congé solidaire : découvrez des expériences adaptées à chaque parcours pour contribuer à des projets concrets de protection de la biodiversité.
            </p>
          </div>
            <a href="/missions">
              <Button label="Voir toutes les missions →" variant="secondary" />
            </a>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {missionTypes.map((type) => (
            <MissionCard
              key={type.slug}
              slug={type.slug}
              title={type.title}
              description={type.description}
              image={type.image}
              badge={type.badge}
              duration={type.duration}
              ctaLabel={type.ctaLabel}
              ctaUrl={type.ctaUrl}
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
            <a href="/temoignages">
              <Button label="Voir tous les témoignages →" variant="secondary" />
            </a>
        </div>
        <TestimonialCarousel
          testimonials={testimonials.map(t => ({
            quote: t.content,
            name: t.author_name,
            mission: t.mission?.title || '',
          }))}
        />
      </section>

      {/* Section Actions terrain */}
      <section className="section-padding bg-surface">
        <div className="section-header">
          <div>
            <h2 className="section-title text-primary">Nos actions sur le terrain</h2>
            <p className="section-subtitle text-primary/80">Depuis plus de 15 ans, nous agissons aux côtés des communautés locales pour un impact concret et durable.</p>
          </div>
            <a href="/notre-impact">
              <Button label="Voir toutes les actions →" variant="secondary" />
            </a>
        </div>
        <div className="grid grid-cols-2 gap-12">
          {actions.map(action => (
            <ActionCard
              key={action.slug}
              slug={action.slug}
              title={action.title}
              description={action.description}
              image={action.image_url}
              tags={action.tags.map(t => t.tag)}
              odds={action.odds.map(o => o.odd_number)}
              country={action.country}
            />
          ))}
        </div>
      </section>

      {/* Section Partenaires */}
      <section className="section-padding bg-accent-2">
        <div className="section-header">
          <div>
            <h2 className="section-title text-surface">Ils nous font confiance</h2>
            <p className="section-subtitle text-surface/80">Collectivités, institutions et associations s'engagent à nos côtés pour construire un monde plus solidaire.</p>
          </div>
            <a href="/a-propos">
              <Button label="En savoir plus sur nous →" variant="secondary" />
            </a>
        </div>
        <div className="grid grid-cols-6 gap-8 items-center">
          {partners.map(partner => (
            <div key={partner.id} className="flex items-center justify-center bg-white rounded-xl shadow-sm h-24">
              <img src={partner.logo_url} alt={partner.name} className="max-h-14 max-w-full object-contain" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home