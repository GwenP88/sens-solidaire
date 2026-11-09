// EducationDetail.jsx
// Page détail d'un atelier éducatif — contenu, public cible, CTA

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams } from 'react-router-dom'

// ── API
import { fetchEducationItemBySlug } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'
import CTASection from '../components/ui/CTASection'

// ── Référencement
import useSEO from '../hooks/useSEO'

function EducationDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEducationItemBySlug(slug)
      .then(setItem)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  // ── Référencement : titre d'onglet, description Google, aperçu réseaux sociaux (tâche 174)
  useSEO({ title: item?.title, description: item?.content, image: item?.image_url })

  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (!item) return (
    <div className="p-12 text-center">
      <p className="text-body text-primary/50 italic">Atelier introuvable.</p>
      <a href="/education-sensibilisation" className="link-inline text-accent">← Retour aux ateliers</a>
    </div>
  )

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image={item.image_url || '/images/design/hero/hero-education.jpg'}
        title={item.title}
        tags={item.public?.split(',').map(p => p.trim())}
      />

      {/* ── Contenu principal ── */}
      <section className="padding-y padding-x bg-surface">

        {/* Lien retour */}
        <div className="flex flex-col gap-sm mb-8">
          <a href="/education-sensibilisation" className="link-nav text-primary/50 hover:text-primary">
            ← Retour aux ateliers
          </a>
        </div>

        {/* Grid contenu + aside */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">

          {/* Colonne contenu — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-sm">
            {item.content?.split('\n\n').map((para, i) => (
              <p key={i} className="text-body text-primary/80">{para}</p>
            ))}
          </div>

          {/* Aside — infos clés + CTA */}
          <aside className="sticky top-24 self-start bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
            {/* h3-style mb-0 : dans flex flex-col gap-sm, marge redondante avec gap */}
            <h3 className="h3-style text-primary mb-0">Informations pratiques</h3>
            <div className="flex flex-col gap-xs text-body text-primary/70">
              {item.type && <p><strong>Type :</strong> {item.type}</p>}
              {item.public && <p><strong>Public :</strong> {item.public}</p>}
              {item.duration && <p><strong>Durée :</strong> {item.duration}</p>}
            </div>
            {item.external_url && (
              <Button href={item.external_url} label="Télécharger la fiche →" variant="primary" fullWidth />
            )}
            <Button to="/contact" label="Nous contacter →" variant="secondary" fullWidth />
          </aside>

        </div>
      </section>

      <CTASection
        title="Vous souhaitez accueillir une intervention ?"
        text="Notre équipe se déplace dans vos locaux ou vous accueille dans nos bureaux."
        ctaLabel="Nous contacter →"
        ctaHref="/contact"
      />

      <ScrollToTop />
    </div>
  )
}

export default EducationDetail