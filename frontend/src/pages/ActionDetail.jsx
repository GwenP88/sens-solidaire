// ActionDetail.jsx
// Page détail d'une action terrain — hero, description, ODD, galerie, CTA

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchFieldActionBySlug } from '../services/api'
import HeroPage from '../components/layout/HeroPage'
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import ScrollToTop from '../components/ui/ScrollToTop'
import { IconPin } from '../utils/icons'
import { ODDS_LABELS } from '../utils/odds'

function ActionDetail() {
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

  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error || !action) return (
    <div className="p-12 text-center">
      <p className="font-body text-primary/60">Action introuvable.</p>
      <a href="/notre-impact" className="text-accent underline text-sm">← Retour aux actions</a>
    </div>
  )

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image={action.image_url}
        title={action.title}
      />

      {/* ── Contenu principal ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6">

          {/* Lien retour */}
          <a href="/notre-impact" className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
            ← Retour aux actions
          </a>

          {/* Tags */}
          <div className="flex gap-3 flex-wrap">
            {action.tags.map(t => (
              <span key={t.tag} className="font-body text-xs text-primary/70 border border-primary/20 rounded-full px-3 py-1">
                {t.tag}
              </span>
            ))}
          </div>

          {/* H2 pleine largeur */}
          <h2 className="section-title text-primary">{action.description}</h2>

          {/* 2/3 texte + 1/3 sidebar */}
          <div className="flex gap-12 items-start">

            {/* Texte — 2/3 */}
            <div className="flex-1 flex flex-col gap-4">
              {action.content.split('\n\n').map((para, i) => (
                <p key={i} className="font-body text-sm text-primary/80 leading-relaxed">
                  {para}
                </p>
              ))}

              {/* CTA + pays */}
              <div className="flex items-center justify-center gap-8 mt-4">
                <p className="font-heading font-bold text-primary flex items-center gap-2 shrink-0">
                  <IconPin className="text-accent-2" /> {action.country}
                </p>
                <a href={`/notre-impact?pays=${action.country}`}>
                  <Button label={`Voir toutes les actions au ${action.country} →`} variant="secondary" />
                </a>
              </div>
            </div>

            {/* Sidebar — 1/3 */}
            <div className="w-1/3 shrink-0 flex flex-col gap-6">

              {/* Image */}
              <div className="w-full h-56 overflow-hidden rounded-2xl">
                <img src={action.image_url} alt={action.title} className="w-full h-full object-cover" />
              </div>

              {/* ODD */}
              <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-3">
                <p className="font-body text-xs font-bold text-primary/40 uppercase tracking-widest">ODD associés</p>
                <div className="grid grid-cols-3 gap-3 justify-items-center">
                  {action.odds.map(o => (
                    <div key={o.odd_number} className="flex flex-col items-center gap-1">
                      <img
                        src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(o.odd_number).padStart(2, '0')}.jpg`}
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

      {/* ── Galerie ── */}
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

      {/* ── CTA bas de page ── */}
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