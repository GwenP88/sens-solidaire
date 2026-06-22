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
import { IconPin } from '../utils/icons'
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
  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error || !action) return (
    <div className="p-12 text-center">
      <p className="font-body text-primary/60">Action introuvable.</p>
      <a href="/notre-impact" className="text-accent underline text-sm">← Retour aux actions</a>
    </div>
  )

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image={action.image_url}
        title={action.title}
      />

      {/* ── Contenu principal — texte 2/3 + sidebar 1/3 ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6">

          {/* Lien retour vers la liste des actions */}
          <a href="/notre-impact" className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
            ← Retour aux actions
          </a>

          {/* Description courte — affichée en H2 pleine largeur */}
          <h2 className="section-title text-primary">{action.description}</h2>

          {/* Layout 2 colonnes — texte + sidebar */}
          <div className="flex gap-12 items-start">

            {/* Colonne texte — 2/3 */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Contenu long — paragraphes séparés par double saut de ligne */}
              {action.content.split('\n\n').map((para, i) => (
                <p key={i} className="font-body text-sm text-primary/80 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Colonne sidebar — 1/3 */}
            <div className="w-1/3 shrink-0 flex flex-col gap-6">

              {/* Bloc ODD — icônes officielles ONU + labels français */}
              <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-3">
                <p className="font-body text-xs font-bold text-primary/40 uppercase tracking-widest">ODD associés</p>
                <div className="grid grid-cols-3 gap-3 justify-items-center">
                  {action.odds.map(o => (
                    <div key={o.odd_number} className="flex flex-col items-center gap-1">
                      <img
                        src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(o.odd_number).padStart(2, '00')}.jpg`}
                        alt={`ODD ${o.odd_number}`}
                        className="w-full rounded-lg"
                      />
                      <p className="font-body text-xs text-primary/60 leading-tight text-center">
                        {ODDS_LABELS[o.odd_number]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Galerie photos — carousel si médias disponibles ── */}
      {action.gallery?.length > 0 && (
        <section className="section-padding bg-surface-mid">
          <h2 className="section-title text-primary mb-8">Galerie photos</h2>
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

export default ActionDetail