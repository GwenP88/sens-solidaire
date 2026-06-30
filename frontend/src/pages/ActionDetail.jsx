// ActionDetail.jsx
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

// ── Utils
import { ODDS_LABELS } from '../utils/odds'

function ActionDetail() {
  // ── État local — données de l'action + chargement
  const { slug } = useParams()
  const [action, setAction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Chargement de l'action depuis l'API au montage
  useEffect(() => {
    fetchFieldActionBySlug(slug)
      .then(data => setAction(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  // ── États de chargement et d'erreur
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
        <div className="flex flex-col gap-4 mb-8">

          {/* Lien retour */}
          <a href="/notre-impact" className="link-nav text-primary/50 hover:text-primary">
            ← Retour aux actions
          </a>

          {/* Description courte — H2 pleine largeur */}
          <h2 className="h2-style text-primary">{action.description}</h2>

        </div>

        {/* Grid texte + aside sticky */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* Colonne texte — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {action.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-body text-primary/80">{para}</p>
            ))}
          </div>

          {/* Aside ODD — sticky 1/3 */}
          <aside className="sticky top-24 self-start bg-surface-mid rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-eyebrow text-primary/40">ODD associés</p>

            {/* Liste ODD compacte */}
            <div className="flex flex-col gap-3">
              {action.odds.map(o => (
                <div key={o.odd_number} className="flex items-center gap-3">
                  {/* Icône officielle ONU */}
                  <img
                    src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(o.odd_number).padStart(2, '0')}.jpg`}
                    alt={`ODD ${o.odd_number}`}
                    className="w-16 h-16 rounded shrink-0 object-cover"
                  />
                  {/* Label ODD */}
                  <p className="text-body text-primary/70">{ODDS_LABELS[o.odd_number]}</p>
                </div>
              ))}
            </div>

            {/* CTA vers la page ODD ONU */}
            <a href="https://www.un.org/sustainabledevelopment/fr/" target="_blank" rel="noopener noreferrer">
              <Button label="En savoir plus sur les 17 ODD →" variant="primary" />
            </a>
          </aside>

        </div>
      </section>

      {/* ── Galerie photos — carousel si médias disponibles ── */}
      {action.gallery?.length > 0 && (
        <section className="padding-y padding-x bg-surface-mid">
          <h2 className="h2-style text-primary mb-8">Galerie photos</h2>
          <Carousel
            items={action.gallery}
            slidesPerView={3}
            spaceBetween={16}
            showPagination={true}
            color="primary"
            renderSlide={(media) => (
              <div className="w-full h-56 overflow-hidden rounded-xl">
                <img src={media.file_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          />
        </section>
      )}

      {/* ── CTA bas de page — invitation à s'engager ── */}
      <section className="padding-y padding-x bg-accent-2">
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

export default ActionDetail