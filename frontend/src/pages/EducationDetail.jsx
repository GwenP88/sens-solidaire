// EducationDetail.jsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchEducationItemBySlug } from '../services/api'
import HeroPage from '../components/layout/HeroPage'
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
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

  const images = item.media?.filter(m => m.file_type === 'image') || []
  const links = item.media?.filter(m => m.file_type === 'link') || []
  const videos = item.media?.filter(m => m.file_type === 'video') || []
  const audios = item.media?.filter(m => m.file_type === 'audio') || []
  const pdfs = item.media?.filter(m => m.file_type === 'pdf') || []

  const mainImage = images[0]
  const extraImages = images.slice(1)
  const hasResources = links.length > 0 || videos.length > 0 || audios.length > 0 || pdfs.length > 0

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image={item.image_url || '/images/hero_missions.jpg'}
        title={item.title}
      />

      {/* ── Contenu principal ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6">

          {/* Lien retour */}
          <a href="/actions-educatives" className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
            ← Retour aux ateliers
          </a>

          {/* Type + public */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-xs font-bold text-accent-2">{item.type}</span>
            <span className="font-body text-xs text-primary/30">—</span>
            <span className="font-body text-xs text-primary/50">{publicLabels}</span>
          </div>

          {/* H2 pleine largeur */}
          <h2 className="section-title text-primary">{item.description}</h2>

          {/* 2/3 texte + 1/3 sidebar */}
          <div className="flex gap-12 items-start">

            {/* Texte — 2/3 */}
            <div className="flex-1 flex flex-col gap-4">
              {item.content && item.content.split('\n\n').map((para, i) => (
                <p key={i} className="font-body text-sm text-primary/80 leading-relaxed">
                  {para}
                </p>
              ))}

              {/* CTA PDF plaquette */}
              {item.external_url && (
                <div className="mt-2">
                  <a href={item.external_url} target="_blank" rel="noopener noreferrer">
                    <Button label="Télécharger la plaquette ↓" variant="secondary" />
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar — 1/3 */}
            <div className="w-1/3 shrink-0 flex flex-col gap-6">

              {/* Image principale */}
              {mainImage && (
                <div className="w-full overflow-hidden rounded-2xl">
                  <img src={mainImage.file_url} alt={item.title} className="w-full h-56 object-cover" />
                </div>
              )}

              {/* Ressources */}
              {hasResources && (
                <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-4">
                  <p className="font-body text-xs font-bold text-primary/40 uppercase tracking-widest">Ressources</p>

                  {[...links, ...videos, ...audios, ...pdfs].map((m, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <a href={m.file_url} target="_blank" rel="noopener noreferrer">
                        <Button
                          label={
                            m.label ? m.label + ' →' :
                            m.file_type === 'pdf' ? 'Télécharger ↓' :
                            m.file_type === 'video' ? 'Voir la vidéo →' :
                            m.file_type === 'audio' ? 'Écouter →' :
                            'Voir le lien →'
                          }
                          variant="secondary"
                          fullWidth
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── Photos supplémentaires ── */}
      {extraImages.length > 0 && (
        <section className="section-padding bg-surface-mid">
          <h2 className="section-title text-primary mb-8">Photos</h2>
          {extraImages.length <= 2 ? (
            <div className="grid grid-cols-3 gap-4">
              {extraImages.map((m, i) => (
                <div key={i} className="overflow-hidden rounded-xl">
                  <img src={m.file_url} alt="" className="w-full h-56 object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <Carousel
              items={extraImages}
              slidesPerView={3}
              spaceBetween={16}
              showPagination={true}
              color="primary"
              renderSlide={(m) => (
                <div className="w-full h-56 overflow-hidden rounded-xl">
                  <img src={m.file_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            />
          )}
        </section>
      )}

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