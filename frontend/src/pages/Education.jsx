// Education.jsx
// Page Éducation & Sensibilisation — ateliers, correspondances, éco-école

// ── React
import { useState, useEffect, useRef } from 'react'

// ── API
import { fetchEducationItems } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Filters from '../components/navigation/Filters'
import ScrollToTop from '../components/ui/ScrollToTop'
import Section from '../components/ui/Section'
import CTASection from '../components/ui/CTASection'

// ── Composants métier
import EducationCard from '../components/education/EducationCard'

// ── Utils
import { FILTERS_EDUCATION_PUBLIC } from '../utils/filters'

function Education() {
  // ── État local — items + chargement + filtre actif
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)

  // ── Référence pour le scroll vers la barre de filtres
  const filtersRef = useRef(null)

  // ── Chargement des ateliers depuis l'API au montage
  useEffect(() => {
    fetchEducationItems()
      .then(data => setItems(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // ── Changement de filtre + scroll vers la barre
  const handleFilter = (value) => {
    setActiveFilter(value)
    setTimeout(() => {
      filtersRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  // ── Filtrage par public cible — champ public en chaîne CSV (ex: "primaire,college_lycee")
  const filteredItems = activeFilter
    ? items.filter(item => item.public.split(',').includes(activeFilter))
    : items

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-education.jpg"
        title="Éducation & Sensibilisation"
        subtitle="Nous intervenons dans les écoles, collèges et lycées pour sensibiliser les jeunes à la biodiversité et au développement durable."
      />

      {/* ── Barre de filtres par public cible ── */}
      <div ref={filtersRef} className="bg-primary padding-x filter-py">
        <Filters
          chips={{
            filters: FILTERS_EDUCATION_PUBLIC,
            active: activeFilter,
            onChange: handleFilter,
            variant: 'dark',
          }}
        />
      </div>

      {/* ── Grille des ateliers ── */}
      <Section title="Nos ateliers">
        {loading ? (
          <p className="text-body text-primary/50 italic">Chargement...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-body text-primary/50 italic">Aucun atelier pour ce public.</p>
        ) : (
          <div className="grid-cards-3">
            {filteredItems.map(item => (
              <EducationCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </Section>

      {/* ── CTA contact ── */}
      <CTASection
        title="Vous souhaitez accueillir une intervention ?"
        text="Notre équipe se déplace dans vos locaux ou vous accueille dans nos bureaux."
        ctaLabel="Nous contacter →"
        ctaHref="/contact"
      />

      <ScrollToTop />
    </div>
  )
}

export default Education