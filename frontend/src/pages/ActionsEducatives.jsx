// ActionsEducatives.jsx
// Page Éducation & Sensibilisation — ateliers, correspondances, éco-école

// ── React
import { useState, useEffect, useRef } from 'react'

// ── API
import { fetchEducationItems } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Filters from '../components/navigation/Filters'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants métier
import EducationCard from '../components/education/EducationCard'

// ── Utils
import { FILTERS_EDUCATION_PUBLIC } from '../utils/filters'

function ActionsEducatives() {
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

      {/* ── Barre de filtres par public cible — via Filters (orchestrateur FilterSelect/FilterChips) ── */}
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
      <section className="padding-y padding-x">
        {loading ? (
          <p className="text-body text-primary/50 italic">Chargement...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-body text-primary/50 italic">Aucun atelier pour ce public.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <EducationCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA contact — invitation à accueillir une intervention ── */}
      <section className="padding-y padding-x bg-accent-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="h2-style text-surface">Vous souhaitez accueillir une intervention ?</h2>
            <p className="text-body text-surface/80">Notre équipe se déplace dans vos locaux ou vous accueille dans nos bureaux.</p>
          </div>
          <a href="/contact">
            <Button label="Nous contacter →" variant="primary" />
          </a>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default ActionsEducatives