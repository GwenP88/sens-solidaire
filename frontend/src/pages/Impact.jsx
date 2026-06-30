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
import Filters from '../components/navigation/Filters'

// ── Composants métier
import ActionCard from '../components/actions/ActionCard'

// ── Utils
import { ODDS } from '../utils/odds'
import { FILTERS_ACTION_TAGS, FILTER_CONFIG_COUNTRY } from '../utils/filters'

function NotreImpact() {
  // ── État local — actions + chargement + filtre thématique (chips)
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)

  // ── État du filtre pays — géré via FilterSelect (objet { country: valeur })
  // Initialisation depuis l'URL (?pays=Kenya) au montage
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({ country: searchParams.get('pays') || null })

  // ── Mise à jour du filtre pays — signature attendue par FilterSelect (key, value)
  const handleCountryFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // ── Chargement des actions depuis l'API au montage
  useEffect(() => {
    fetchFieldActions()
      .then(data => setActions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // ── Filtrage combiné — par tag thématique ET par pays
  const filteredActions = actions.filter(a => {
    if (activeFilter && !a.tags.some(t => t.tag === activeFilter)) return false
    if (filters.country && !a.country.includes(filters.country)) return false
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
            <h2 className="h2-style text-primary mb-2">Nos actions et les Objectifs de Développement Durable</h2>
            <p className="text-body text-primary/60">
              Les Objectifs de Développement Durable (ODD) sont 17 grands objectifs définis par l'ONU pour relever les défis sociaux, environnementaux et économiques de notre époque.<br /><br />
              À notre échelle, chacun de nos projets s'inscrit dans cette dynamique. Qu'il s'agisse de protéger la biodiversité, favoriser l'accès à l'éducation, soutenir les communautés locales ou sensibiliser les jeunes aux enjeux environnementaux, nous contribuons concrètement à bâtir un monde plus juste, plus solidaire et plus respectueux du vivant.
            </p>
          </div>
          <a href="https://www.un.org/sustainabledevelopment/fr/" target="_blank" rel="noopener noreferrer">
            <Button label="Découvrir les 17 ODD →" variant="primary" />
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

      {/* ── Barre de filtres — select pays + chips thématiques, via Filters (cas combiné) ── */}
      <div className="bg-primary filter-bar-padding py-4 md:py-6">
        <Filters
          selects={FILTER_CONFIG_COUNTRY}
          selectValues={filters}
          onSelectChange={handleCountryFilter}
          chips={{
            filters: FILTERS_ACTION_TAGS,
            active: activeFilter,
            onChange: setActiveFilter,
            variant: 'dark',
          }}
        />
      </div>

      {/* ── Grille des actions ── */}
      <section className="section-padding">
        {loading ? (
          <p className="text-body text-primary/50 italic">Chargement...</p>
        ) : filteredActions.length === 0 ? (
          <p className="text-body text-primary/50 italic">Aucune action pour ce filtre.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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