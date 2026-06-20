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
import { ODDS } from '../utils/odds'
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
    if (activeFilter && !a.tags.some(t => t.tag === activeFilter)) return false
    if (activeCountry && !a.country.includes(activeCountry)) return false
    return true
  })

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero_missions.jpg"
        title="Notre impact"
        subtitle="Depuis plus de 15 ans, nous agissons aux côtés des communautés locales pour un impact concret et durable."
      />

      {/* ── Barre de filtres — collée au hero ── */}
      <div className="bg-primary px-24 py-6 flex items-center gap-12">

        {/* Menu déroulant pays */}
        <select
          value={activeCountry || ''}
          onChange={e => setActiveCountry(e.target.value || null)}
          className="font-body text-sm text-primary border border-surface-dark rounded-xl px-4 py-2 bg-surface focus:outline-none focus:border-primary shrink-0"
        >
          <option value="">Tous les pays</option>
          <option value="Kenya">Kenya</option>
          <option value="Sénégal">Sénégal</option>
          <option value="Sri Lanka">Sri Lanka</option>
          <option value="Pérou">Pérou</option>
          <option value="Sumatra">Sumatra</option>
        </select>

        {/* Chips de filtrage par thème */}
        <FilterChips
          filters={FILTERS_ACTION_TAGS}
          active={activeFilter}
          onChange={setActiveFilter}
          variant="dark"
        />

      </div>

      <section className="section-padding">

        {/* ── Texte d'introduction ── */}
        <p className="font-body text-sm text-primary/80 leading-relaxed mb-10">
          Sens Solidaire s'investit sur tous les continents afin de collaborer sur des projets tournés vers la sauvegarde de la biodiversité, le bien-être des populations locales et un développement durable. Nos actions combinent éducation, échanges interculturels et projets environnementaux concrets.
        </p>

        {/* ── Grille des actions — 2 colonnes ── */}
        {loading ? (
          <p className="font-body text-sm text-primary/50 italic">Chargement...</p>
        ) : filteredActions.length === 0 ? (
          <p className="font-body text-sm text-primary/50 italic">Aucune action pour ce filtre.</p>
        ) : (
          <div className="grid grid-cols-2 gap-8">
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

      {/* ── Section ODD — icônes officielles ONU avec labels français ── */}
      <section className="section-padding bg-surface-mid">
        <div className="section-header">
          <div className="max-w-5xl">
            <h2 className="section-title text-primary mb-2">Nos actions et les Objectifs de Développement Durable</h2>
            <p className="font-body text-sm text-primary/60">
              Les Objectifs de Développement Durable (ODD) sont 17 grands objectifs définis par l'ONU pour relever les défis sociaux, environnementaux et économiques de notre époque.<br /><br />
              À notre échelle, chacun de nos projets s'inscrit dans cette dynamique. Qu'il s'agisse de protéger la biodiversité, favoriser l'accès à l'éducation, soutenir les communautés locales ou sensibiliser les jeunes aux enjeux environnementaux, nous contribuons concrètement à bâtir un monde plus juste, plus solidaire et plus respectueux du vivant.
            </p>
          </div>
          <a href="https://www.un.org/sustainabledevelopment/fr/" target="_blank" rel="noopener noreferrer">
            <Button label="Découvrir les 17 ODD →" variant="secondary" />
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
              <p className="font-body text-xs text-primary/60 leading-tight">{odd.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA missions ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-surface mb-2">Envie de vous engager à nos côtés ?</h2>
            <p className="font-body text-surface/80 text-sm">Découvrez nos missions et participez à des projets concrets sur le terrain.</p>
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