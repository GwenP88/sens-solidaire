// NotreImpact.jsx
// Page Notre Impact — actions terrain connectées à l'API

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useSearchParams } from 'react-router-dom'

// ── API
import { fetchFieldActions } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import FilterChips from '../components/navigation/FilterChips'

// ── Composants métier
import ActionCard from '../components/actions/ActionCard'

// ── Utils
import { ODDS, ODD_TO_CATEGORY } from '../utils/odds'
import { FILTERS_ACTION_TAGS } from '../utils/filters'

function NotreImpact() {
  // ── État local — actions + chargement + filtres
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)

  // ── Initialisation du filtre pays depuis l'URL (?pays=Kenya)
  const [searchParams] = useSearchParams()
  const [activeCountry, setActiveCountry] = useState(searchParams.get('pays') || null)

  // ── Chargement des actions depuis l'API au montage
  useEffect(() => {
    fetchFieldActions()
      .then(data => setActions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // ── Filtrage combiné — par tag thématique ET par pays
  const filteredActions = actions.filter(a => {
    if (activeFilter) {
      const categories = a.odds.map(o => ODD_TO_CATEGORY[o.odd_number])
      if (!categories.includes(activeFilter)) return false
    }
    if (activeCountry && !a.country.includes(activeCountry)) return false
    return true
  })

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-missions.jpg"
        title="Notre impact"
        subtitle="Depuis plus de 15 ans, nous agissons aux côtés des communautés locales pour un impact concret et durable."
      />

      {/* ── Section ODD — icônes officielles ONU avec labels français ── */}
      <section className="section-padding bg-surface-mid">
        <div className="section-header">
          <div className="max-w-5xl">
            <h2 className="h2-style text-primary mb-2">Nos actions au service des Objectifs de Développement Durable</h2>
            <p className="text-body text-primary/60">
              Sens Solidaire s'engage en France et à l'international à travers des projets dédiés à la préservation de la biodiversité, au soutien des populations locales et à la promotion d'un développement durable. Nos actions allient éducation, échanges interculturels et initiatives environnementales concrètes, tout en s'inscrivant dans les <span className='font-black text-primary/80'> 17 Objectifs de Développement Durable (ODD) définis par l'ONU</span>. Ces 17 objectifs, adoptés par 193 pays en 2015, constituent un cadre universel pour répondre aux grands défis de notre planète d'ici 2030.<br /> <br /> À notre échelle, chaque projet contribue à relever les défis sociaux, environnementaux et économiques de notre époque, en protégeant le vivant, en favorisant l'accès à l'éducation, en accompagnant les communautés locales et en sensibilisant les jeunes. Ensemble, nous œuvrons pour construire un monde plus juste, plus solidaire et plus durable.
            </p>
          </div>
          <a href="https://www.un.org/sustainabledevelopment/fr/" target="_blank" rel="noopener noreferrer">
            <Button label="En savoir plus sur les 17 ODD →" variant="primary" />
          </a>
        </div>

        {/* Grille ODD — flex wrap centré */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {ODDS.map(odd => (
            <div key={odd.n} className="flex flex-col items-center gap-2 w-20 text-center">
              <img
                src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(odd.n).padStart(2, '0')}.jpg`}
                alt={`ODD ${odd.n}`}
                className="w-full rounded-lg object-cover"
              />
              <p className="text-caption text-primary/60 leading-tight">{odd.label}</p>
            </div>
          ))}
        </div>
      </section>

            {/* ── Barre de filtres — collée au hero ── */}
      <div className="bg-primary px-4 lg:px-24 py-4 lg:py-6">

        {/* ── Mobile + 768 — deux selects ── */}
        <div className="flex flex-col md:flex-row gap-4 lg:hidden">

          <select
            value={activeCountry || ''}
            onChange={e => setActiveCountry(e.target.value || null)}
            className="w-full text-body text-primary border border-surface-dark rounded-xl px-4 py-1 bg-surface focus:outline-none focus:border-primary"
          >
            <option value="">Tous les pays</option>
            <option value="Kenya">Kenya</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Pérou">Pérou</option>
            <option value="Sumatra">Sumatra</option>
            <option value="France">France</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          </select>

          <select
            value={activeFilter || ''}
            onChange={e => setActiveFilter(e.target.value || null)}
            className="w-full text-body text-primary border border-surface-dark rounded-xl px-4 py-1 bg-surface focus:outline-none focus:border-primary"
          >
            {FILTERS_ACTION_TAGS.map(f => (
              <option key={f.label} value={f.value || ''}>{f.label}</option>
            ))}
          </select>

        </div>

        {/* ── Desktop 1024+ — select pays + FilterChips scrollable ── */}
        <div className="hidden lg:flex flex-row items-start lg:gap-18 xl:gap-26">

          <select
            value={activeCountry || ''}
            onChange={e => setActiveCountry(e.target.value || null)}
            className="min-w-[220px] text-body text-primary border border-surface-dark rounded-xl px-4 py-1 bg-surface focus:outline-none focus:border-primary shrink-0"
          >
            <option value="">Tous les pays</option>
            <option value="Kenya">Kenya</option>
            <option value="Sénégal">Sénégal</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Pérou">Pérou</option>
            <option value="Sumatra">Sumatra</option>
            <option value="France">France</option>
            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          </select>

          <div className="overflow-x-auto pb-2 flex-1 min-w-0">
            <FilterChips
              filters={FILTERS_ACTION_TAGS}
              active={activeFilter}
              onChange={setActiveFilter}
              variant="dark"
              nowrap={true}
            />
          </div>

        </div>

      </div>

      {/* ── Grille des actions ── */}
      <section className="section-padding">
        {loading ? (
          <p className="text-body text-primary/50 italic">Chargement...</p>
        ) : filteredActions.length === 0 ? (
          <p className="text-body text-primary/50 italic">Aucune action pour ce filtre.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredActions.map(action => (
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
        )}
      </section>

      {/* ── CTA missions ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div>
            <h2 className="h2-style text-surface">Envie de vous engager à nos côtés ?</h2>
            <p className="text-body text-surface/80">Découvrez nos missions et participez à des projets concrets sur le terrain.</p>
          </div>
          <a href="/missions">
            <Button label="Voir nos missions →" variant="primary" />
          </a>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default NotreImpact