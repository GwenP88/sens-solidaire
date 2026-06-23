// Home.jsx
// Page d'accueil — Hero + StatsBar + Sections

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchTestimonials, fetchFieldActions, fetchPartners } from '../services/api'

// ── Composants layout
import Hero from '../components/layout/Hero'
import StatsBar from '../components/layout/StatsBar'

// ── Composants UI
import Button from '../components/ui/Button'
import { ODDS } from '../utils/odds'

// ── Composants métier
import MissionCard from '../components/missions/MissionCard'
import TestimonialCarousel from '../components/testimonials/TestimonialCarousel'
import ActionCard from '../components/actions/ActionCard'

// ── Données statiques — 4 types de missions (contenu fixe, non géré en BDD)
const MISSION_TYPES = [
  {
    slug: 'volontariat-individuel',
    title: 'Partir en mission individuel',
    description: 'Partez seul, à deux ou à plusieurs et participez à des projets concrets de préservation de la biodiversité aux côtés des communautés locales et des acteurs de terrain.',
    image: '/images/hero/hero-missions.jpg',
    badge: 'Volontariat individuel',
    duration: '10 jours à 4 semaines',
    ctaLabel: 'Découvrir →',
    ctaUrl: '/missions?filter=individuel',
  },
  {
    slug: 'service-civique',
    title: 'Effectuer un service civique à l\'internationnal',
    description: 'Une expérience engagée pour les 16-25 ans qui permet de développer de nouvelles compétences tout en agissant pour l\'environnement et la solidarité internationale.',
    image: '/images/missions/service-civique.jpg',
    badge: 'Service civique',
    duration: '3 à 12 mois',
    ctaLabel: 'Découvrir →',
    ctaUrl: '/missions?filter=service_civique',
  },
  {
    slug: 'groupe-jeune',
    title: 'Rejoindre un chantier solidaire jeunes',
    description: 'Des missions solidaires conçus pour les établissements scolaires, MJC et associations souhaitant vivre une aventure collective porteuse de sens.',
    image: '/images/missions/groupe-jeune-2.jpg',
    badge: 'Groupe jeunes',
    duration: '10 jours à 3 semaines',
    ctaLabel: 'Découvrir →',
    ctaUrl: '/missions?filter=groupe_jeunes',
  },
  {
    slug: 'conge-solidaire',
    title: 'Partir en congé solidaire',
    description: 'Donnez du sens à vos congés en vivant une expérience solidaire unique, au service de la biodiversité et des communautés locales.',
    image: '/images/missions/conge-solidaire-2.jpg',
    badge: 'Congé solidaire',
    duration: '10 jours à 4 semaines',
    ctaLabel: 'Découvrir →',
    ctaUrl: '/missions?filter=conge_solidaire',
  },
]

function Home() {
  // ── État local — données dynamiques depuis l'API
  const [testimonials, setTestimonials] = useState([])
  const [actions, setActions] = useState([])
  const [partners, setPartners] = useState([])

  // ── Chargement en parallèle au montage
  useEffect(() => {
    // Témoignages filtrés sur show_homepage = true
    fetchTestimonials()
      .then(data => setTestimonials(data.filter(t => t.show_homepage)))
      .catch(console.error)

    // 4 premières actions terrain
    fetchFieldActions()
      .then(data => setActions(data.slice(0, 4)))
      .catch(console.error)

    // Tous les partenaires
    fetchPartners()
      .then(setPartners)
      .catch(console.error)
  }, [])

  return (
    <div>

      {/* ── Hero immersif + barre de statistiques ── */}
      <Hero />
      <StatsBar />

      {/* ── Section types de missions — 4 cards 2x2 ── */}
      <section className="section-padding bg-surface">
        <div className="section-header">
          <div className="max-w-4xl">
            <h2 className="section-title text-primary">Nos missions</h2>
            <p className="section-subtitle text-primary/80">
              Parce que chaque parcours est unique, nous proposons différentes formes d'engagement adaptées à vos envies et à vos disponibilités. Mission individuelle, service civique, mission de groupe ou congé solidaire : rejoignez des projets concrets au service de la biodiversité et vivez une expérience humaine riche en rencontres et en découvertes
            </p>
          </div>
          <a href="/missions">
            <Button label="Voir toutes les missions →" variant="secondary" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {MISSION_TYPES.map(type => (
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

      {/* ── Section témoignages — carousel depuis l'API (show_homepage) ── */}
      <section className="section-padding bg-accent-2">
        <div className="section-header">
          <div className="max-w-4xl">
            <h2 className="section-title text-surface">Ils ont franchi le pas et vécu l'aventure. Découvrez leurs témoignages.</h2>
            <p className="section-subtitle text-surface/80">Découvrez les retours d'expérience de nos volontaires engagés à nos côtés sur le terrain.</p>
          </div>
          <a href="/temoignages">
            <Button label="Voir tous les témoignages →" variant="primary" />
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

      {/* ── Section actions terrain — 4 premières actions depuis l'API ── */}
      <section className="section-padding bg-surface">
        <div className="section-header">
          <div className="max-w-4xl">
            <h2 className="section-title text-primary">Des actions concrètes au cœur des territoires</h2>
            <p className="section-subtitle text-primary/80">Depuis plus de 20 ans, nous accompagnons les communautés locales dans la réalisation de projets concrets en faveur de la biodiversité et du développement des territoires.</p>
          </div>
          <a href="/notre-impact">
            <Button label="Voir toutes les actions →" variant="secondary" />
          </a>
        </div>

        {/* ── Ligne ODD — icônes officielles ONU ── */}
        <div className="flex justify-between items-center my-8">
          {ODDS.map(odd => (
            <img
              key={odd.n}
              src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(odd.n).padStart(2, '0')}.jpg`}
              alt={`ODD ${odd.n}`}
              className="w-16 h-16 rounded object-cover"
            />
          ))}
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

      {/* ── Section partenaires — logos depuis l'API ── */}
      <section className="section-padding bg-accent-2">
        <div className="section-header">
          <div>
            <h2 className="section-title text-surface">Ils nous font confiance</h2>
            <p className="section-subtitle text-surface/80">Collectivités, institutions et associations s'engagent à nos côtés pour construire un monde plus solidaire.</p>
          </div>
          <a href="/a-propos">
            <Button label="En savoir plus sur nous →" variant="primary" />
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