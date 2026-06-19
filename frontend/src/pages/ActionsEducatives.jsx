// ActionsEducatives.jsx
// Page Éducation & Sensibilisation — ateliers, correspondances, éco-école

// ── React
import { useState, useEffect, useRef } from 'react'

// ── API
import { fetchEducationItems } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import FilterChips from '../components/navigation/FilterChips'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

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

  // ── Filtrage par public cible — le champ public est une chaîne CSV (ex: "primaire,college_lycee")
  const filteredItems = activeFilter
    ? items.filter(item => item.public.split(',').includes(activeFilter))
    : items

  // ── Helper — traduit les codes public en labels lisibles
  const formatPublic = (pub) => pub.split(',').map(p => {
    if (p === 'primaire') return 'Maternelle & Primaire'
    if (p === 'college_lycee') return 'Collège & Lycée'
    if (p === 'adultes') return 'Adultes & Étudiants'
    return p
  }).join(' · ')

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero_missions.jpg"
        title="Éducation & Sensibilisation"
        subtitle="Nous intervenons dans les écoles, collèges et lycées pour sensibiliser les jeunes à la biodiversité et au développement durable."
      />

      {/* ── Barre de filtres par public cible — collée au hero ── */}
      <div ref={filtersRef} className="bg-primary px-24 py-6">
        <FilterChips
          filters={FILTERS_EDUCATION_PUBLIC}
          active={activeFilter}
          onChange={handleFilter}
          variant="dark"
        />
      </div>

      {/* ── Grille des ateliers ── */}
      <section className="section-padding">
        {loading ? (
          <p className="font-body text-sm text-primary/50 italic">Chargement...</p>
        ) : filteredItems.length === 0 ? (
          <p className="font-body text-sm text-primary/50 italic">Aucun atelier pour ce public.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <article key={item.slug} className="flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                {/* Image de couverture */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={item.image_url || '/images/hero_missions.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenu de la card */}
                <div className="flex flex-col gap-3 p-6 flex-1">

                  {/* Type et public cible */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-xs font-bold text-accent-2">{item.type}</span>
                    <span className="font-body text-xs text-primary/30">—</span>
                    <span className="font-body text-xs text-primary/50">{formatPublic(item.public)}</span>
                  </div>

                  {/* Titre */}
                  <h3 className="font-heading font-bold text-primary text-base leading-snug">{item.title}</h3>

                  {/* Description courte */}
                  <p className="font-body text-sm text-primary/60 leading-relaxed flex-1">{item.description}</p>

                  {/* CTA — PDF externe ou page détail interne */}
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

      {/* ── CTA contact — invitation à accueillir une intervention ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-surface mb-2">Vous souhaitez accueillir une intervention ?</h2>
            <p className="font-body text-surface/80 text-sm">Notre équipe se déplace dans vos locaux ou vous accueille dans nos bureaux.</p>
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