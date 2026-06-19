// EducationDetail.jsx
// Page détail éducation & sensibilisation

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchEducationItemBySlug } from '../services/api'
import HeroPage from '../components/layout/HeroPage'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

function EducationDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEducationItemBySlug(slug)
      .then(data => setItem(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error || !item) return (
    <div className="p-12 text-center">
      <p className="font-body text-primary/60">Atelier introuvable.</p>
      <a href="/actions-educatives" className="text-accent underline text-sm">← Retour aux ateliers</a>
    </div>
  )

  const publicLabels = item.public.split(',').map(p => {
    if (p === 'primaire') return 'Maternelle & Primaire'
    if (p === 'college_lycee') return 'Collège & Lycée'
    if (p === 'adultes') return 'Adultes & Étudiants'
    return p
  }).join(' · ')

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image={item.image_url || '/images/hero_missions.jpg'}
        title={item.title}
      />

      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6 max-w-3xl">

          {/* Retour */}
          <a href="/actions-educatives" className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
            ← Retour aux ateliers
          </a>

          {/* Type + public */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-xs font-bold text-accent-2">{item.type}</span>
            <span className="font-body text-xs text-primary/30">—</span>
            <span className="font-body text-xs text-primary/50">{publicLabels}</span>
          </div>

          {/* Description */}
          <h2 className="section-title text-primary">{item.description}</h2>

          {/* Contenu */}
          {item.content && item.content.split('\n\n').map((para, i) => (
            <p key={i} className="font-body text-sm text-primary/80 leading-relaxed">
              {para}
            </p>
          ))}

          {/* CTA PDF si disponible */}
          {item.external_url && (
            <a href={item.external_url} target="_blank" rel="noopener noreferrer">
              <Button label="Télécharger la plaquette ↓" variant="secondary" />
            </a>
          )}

        </div>
      </section>

      {/* ── CTA contact ── */}
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

export default EducationDetail