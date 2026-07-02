// ImpactDetail.jsx
// Page détail d'une action terrain — hero, description, ODD, galerie, CTA

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams } from 'react-router-dom'

// ── API
import { fetchFieldActionBySlug } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import ScrollToTop from '../components/ui/ScrollToTop'
import Section from '../components/ui/Section'
import CTASection from '../components/ui/CTASection'

// ── Utils
import { ODDS_LABELS } from '../utils/odds'

function ImpactDetail() {
  const { slug } = useParams()
  const [action, setAction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFieldActionBySlug(slug)
      .then(data => setAction(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error || !action) return (
    <div className="p-12 text-center">
      <p className="text-body text-primary/50 italic">Action introuvable.</p>
      <a href="/notre-impact" className="link-inline text-accent">← Retour aux actions</a>
    </div>
  )

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image={action.image_url}
        title={action.title}
        country={action.country}
        tags={action.tags?.map(t => t.tag)}
      />

      {/* ── Contenu principal — texte 2/3 + sidebar ODD sticky 1/3 ── */}
      <section className="padding-y padding-x bg-surface">

        {/* Lien retour + titre */}
        <div className="flex flex-col gap-sm">
          <a href="/notre-impact" className="link-nav text-primary/50 hover:text-primary">
            ← Retour aux actions
          </a>
          <h2 className="h2-style text-primary">{action.description}</h2>
        </div>

        {/* Grid texte + aside sticky */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">

          {/* Colonne texte — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-sm">
            {action.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-body text-primary/80">{para}</p>
            ))}
          </div>

          {/* Aside ODD — sticky 1/3 */}
          <aside className="sticky top-24 self-start bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
            <p className="text-eyebrow text-primary/40 mb-0">ODD associés</p>
            <div className="flex flex-col md:flex-row md:items-start lg:flex-col gap-sm">
              <div className="flex flex-col gap-xs flex-1">
                {action.odds.map(o => (
                  <div key={o.odd_number} className="flex items-center gap-xs">
                    <img
                      src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(o.odd_number).padStart(2, '0')}.jpg`}
                      alt={`ODD ${o.odd_number}`}
                      className="w-16 h-16 rounded shrink-0 object-cover"
                    />
                    <p className="text-body text-primary/70">{ODDS_LABELS[o.odd_number]}</p>
                  </div>
                ))}
              </div>
              <a href="https://www.un.org/sustainabledevelopment/fr/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                <Button label="En savoir plus sur les 17 ODD →" variant="primary" />
              </a>
            </div>
          </aside>

        </div>
      </section>

      {/* ── Galerie photos — carousel si médias disponibles ── */}
      {action.gallery?.length > 0 && (
        <Section title="Galerie photos" bg="bg-surface-mid">
          <Carousel
            items={action.gallery}
            showPagination={true}
            color="primary"
            renderSlide={(media) => (
              <div className="w-full h-56 overflow-hidden rounded-xl">
                <img src={media.file_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          />
        </Section>
      )}

      {/* ── CTA bas de page ── */}
      <CTASection
        title="Envie de vous engager à nos côtés ?"
        text="Découvrez nos missions et participez à des projets concrets sur le terrain."
        ctaLabel="Voir nos missions →"
        ctaHref="/missions"
      />

      <ScrollToTop />
    </div>
  )
}

export default ImpactDetail