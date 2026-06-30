// Home.jsx
// Page d'accueil — Hero + StatsBar + Sections

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchTestimonials, fetchFieldActions, fetchPartners, fetchMediaPosts } from '../services/api'

// ── Composants layout
import Hero from '../components/layout/Hero'
import StatsBar from '../components/layout/StatsBar'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import { ODDS } from '../utils/odds'
import Carousel from '../components/ui/Carousel'

// ── Composants métier
import MissionCard from '../components/missions/MissionCard'
import ActionCard from '../components/actions/ActionCard'
import MediaCard from '../components/media/MediaCard'
import TestimonialCard from '../components/testimonials/TestimonialCard'

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
    title: 'Effectuer un service civique à l\'international',
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
    description: 'Des missions solidaires conçues pour les établissements scolaires, MJC et associations souhaitant vivre une aventure collective porteuse de sens.',
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
  const [mediaPosts, setMediaPosts] = useState([])

  // ── Chargement en parallèle au montage
  useEffect(() => {
    fetchTestimonials()
      .then(data => setTestimonials(data.filter(t => t.show_homepage)))
      .catch(console.error)

    // ── Actions terrain — 6 dernières créées, triées par created_at décroissant
    // NOTE : sélection manuelle par la cliente prévue en V2 (dashboard + champ BDD dédié, à coordonner avec Alison)
    fetchFieldActions()
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setActions(sorted.slice(0, 6))
      })
      .catch(console.error)

    fetchPartners()
      .then(setPartners)
      .catch(console.error)

    fetchMediaPosts()
      .then(data => setMediaPosts(data.slice(0, 6)))
      .catch(console.error)
  }, [])

  return (
    <div>

      {/* ── Hero immersif + barre de statistiques ── */}
      <Hero />
      <StatsBar />

      {/* ── Section types de missions — 4 cards 2x2 ── */}
      <section className="section-padding bg-surface">
        <div className="section-header flex-col xl:flex-row">
          <div className="max-w-4xl">
            <h2 className="h2-style text-primary">Nos missions</h2>
            <p className="text-body text-primary/80">
              Parce que chaque parcours est unique, nous proposons différentes formes d'engagement adaptées à vos envies et à vos disponibilités. Mission individuelle, service civique, mission de groupe ou congé solidaire : rejoignez des projets concrets au service de la biodiversité et vivez une expérience humaine riche en rencontres et en découvertes.
            </p>
          </div>
          <a href="/missions">
            <Button label="Voir toutes les missions →" variant="primary" />
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <div className="section-header flex-col xl:flex-row">
          <div className="max-w-4xl">
            <h2 className="h2-style text-surface">Ils racontent leur aventure</h2>
            <p className="text-body text-surface/80">Découvrez les retours d'expérience de nos volontaires engagés à nos côtés sur le terrain.</p>
          </div>
          <a href="/temoignages">
            <Button label="Voir tous les témoignages →" variant="primary" />
          </a>
        </div>
        <Carousel
          color="surface"
          items={testimonials}
          renderSlide={(t) => (
            <TestimonialCard
              quote={t.content}
              name={t.author_name}
              mission={t.mission?.title || ''}
            />
          )}
          slidesPerView={3}
          spaceBetween={24}
          showPagination={true}
        />
      </section>

      {/* ── Section actions terrain — 6 dernières actions depuis l'API, en carousel ── */}
      <section className="section-padding bg-surface">
        <div className="section-header flex-col xl:flex-row">
          <div className="max-w-4xl">
            <h2 className="h2-style text-primary">Des actions concrètes au cœur des territoires</h2>
            <p className="text-body text-primary/80">Depuis plus de 20 ans, nous menons des projets en faveur des Objectifs de Développement Durable (ODD), un cadre international regroupant 17 objectifs fixés par les Nations Unies pour préserver la planète, réduire les inégalités et améliorer les conditions de vie de tous.</p>
          </div>
            <a href="/notre-impact">
              <Button label="Voir toutes les actions →" variant="primary" />
            </a>
        </div>

        {/* ── Ligne ODD — icônes officielles ONU ── */}
        <div className="flex flex-col items-center gap-6 my-8">
          <div className="flex flex-wrap justify-center gap-2">
            {ODDS.map(odd => (
              <img
                key={odd.n}
                src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(odd.n).padStart(2, '0')}.jpg`}
                alt={`ODD ${odd.n}`}
                className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded object-cover"
              />
            ))}
          </div>
          <a href="https://sdgs.un.org/goals" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" label="En savoir plus sur les ODD →" />
          </a>
        </div>

        {/* ── Carousel — 6 dernières actions, tous breakpoints ── */}
        <Carousel
          items={actions}
          renderSlide={(action) => (
            <ActionCard
              slug={action.slug}
              title={action.title}
              description={action.description}
              image={action.image_url}
              tags={action.tags.map(t => t.tag)}
              odds={action.odds.map(o => o.odd_number)}
              country={action.country}
            />
          )}
          slidesPerView={3}
          spaceBetween={24}
          showPagination={true}
          color="primary"
        />
      </section>

      {/* ── Section Actualités ── */}
      {mediaPosts.length > 0 && (
        <section className="section-padding bg-surface-mid">
          <div className="section-header flex-col xl:flex-row">
            <div className="max-w-4xl">
              <h2 className="h2-style text-primary">Actualités & Médias</h2>
              <p className="text-body text-primary/80">Suivez la vie de Sens Solidaires à travers nos événements, nos projets, nos interventions dans les médias et nos actions de sensibilisation. Découvrez les temps forts de notre engagement qui font vivre l'association, en France comme à l'international.</p>
            </div>
            <a href="/medias-et-actualites">
              <Button label="Voir toutes les actualités →" variant="primary" />
            </a>
          </div>
          <Carousel
            items={mediaPosts}
            renderSlide={(post) => <MediaCard key={post.slug} {...post} />}
            slidesPerView={3}
            spaceBetween={24}
            showPagination={true}
            color="primary"
          />
        </section>
      )}

      {/* ── Section partenaires — logos depuis l'API ── */}
      <section className="section-padding bg-accent-2">
        <div className="section-header flex-col xl:flex-row">
          <div>
            <h2 className="h2-style text-surface">Ils nous font confiance</h2>
            <p className="text-body text-surface/80">Collectivités, institutions et associations s'engagent à nos côtés pour construire un monde plus solidaire.</p>
          </div>
          <a href="/a-propos">
            <Button label="En savoir plus sur nous →" variant="primary" />
          </a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
          {partners.map(partner => (
            <div key={partner.id} className="flex items-center justify-center bg-white rounded-xl shadow-sm h-24 p-1">
              <img src={partner.logo_url} alt={partner.name} className="max-h-14 max-w-full object-contain" />
            </div>
          ))}
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Home