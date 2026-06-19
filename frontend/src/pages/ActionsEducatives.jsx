// ActionsEducatives.jsx
// Page Éducation & Sensibilisation — ateliers, correspondances, éco-école

import { useState, useEffect, useRef } from 'react'
import HeroPage from '../components/layout/HeroPage'
import FilterChips from '../components/navigation/FilterChips'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import { fetchEducationItems } from '../services/api'

const FILTERS = [
  { label: "Tous", value: null },
  { label: "Maternelle & Primaire", value: "primaire" },
  { label: "Collège & Lycée", value: "college_lycee" },
  { label: "Adultes & Étudiants", value: "adultes" },
]

function ActionsEducatives() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)
  const filtersRef = useRef(null)

  useEffect(() => {
    fetchEducationItems()
      .then(data => setItems(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleFilter = (value) => {
    setActiveFilter(value)
    setTimeout(() => {
      filtersRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const filteredItems = activeFilter
    ? items.filter(item => item.public.split(',').includes(activeFilter))
    : items

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/hero_missions.jpg"
        title="Éducation & Sensibilisation"
        subtitle="Nous intervenons dans les écoles, collèges et lycées pour sensibiliser les jeunes à la biodiversité et au développement durable."
      />

      {/* Filtres — collés au hero */}
      <div ref={filtersRef} className="bg-primary px-24 py-6">
        <FilterChips
          filters={FILTERS}
          active={activeFilter}
          onChange={handleFilter}
          variant="dark"
        />
      </div>

      <section className="section-padding">
        {loading ? (
          <p className="font-body text-sm text-primary/50 italic">Chargement...</p>
        ) : filteredItems.length === 0 ? (
          <p className="font-body text-sm text-primary/50 italic">Aucun atelier pour ce public.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <article key={item.slug} className="flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                {/* Image */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={item.image_url || '/images/hero_missions.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenu */}
                <div className="flex flex-col gap-3 p-6 flex-1">

                  {/* Type + public */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-xs font-bold text-accent-2">{item.type}</span>
                    <span className="font-body text-xs text-primary/30">—</span>
                    <span className="font-body text-xs text-primary/50">
                      {item.public.split(',').map(p => {
                        if (p === 'primaire') return 'Maternelle & Primaire'
                        if (p === 'college_lycee') return 'Collège & Lycée'
                        if (p === 'adultes') return 'Adultes & Étudiants'
                        return p
                      }).join(' · ')}
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="font-heading font-bold text-primary text-base leading-snug">{item.title}</h3>

                  {/* Description */}
                  <p className="font-body text-sm text-primary/60 leading-relaxed flex-1">{item.description}</p>

                  {/* CTA */}
                  <div className="mt-2">
                    {item.external_url ? (
                      <a
                        href={item.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                      >
                        Découvrir l'atelier →
                      </a>
                    ) : (
                      <a
                        href={`/actions-educatives/${item.slug}`}
                        className="font-body text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                      >
                        En savoir plus →
                      </a>
                    )}
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ScrollToTop />
    </div>
  )
}

export default ActionsEducatives