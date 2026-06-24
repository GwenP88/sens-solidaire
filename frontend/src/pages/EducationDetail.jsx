// EducationDetail.jsx
// Page détail d'un atelier éducatif — hero, contenu, ressources, galerie, CTA

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
import Carousel from '../components/ui/Carousel'
import ScrollToTop from '../components/ui/ScrollToTop'

function EducationDetail() {
  // ── État local — item + chargement + erreur
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Chargement de l'atelier depuis l'API au montage
  useEffect(() => {
    fetchEducationItemBySlug(slug)
      .then(data => setItem(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  // ── États de chargement et d'erreur
  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error || !item) return (
    <div className="p-12 text-center">
      <p className="text-body text-primary/60">Atelier introuvable.</p>
      <a href="/actions-educatives" className="link-inline text-accent">← Retour aux ateliers</a>
    </div>
  )

  // ── Formatage des labels public cible
  const publicLabels = item.public.split(',').map(p => {
    if (p === 'primaire') return 'Maternelle & Primaire'
    if (p === 'college_lycee') return 'Collège & Lycée'
    if (p === 'adultes') return 'Adultes & Étudiants'
    return p
  }).join(' · ')

  // ── Séparation des médias par type
  const images = item.media?.filter(m => m.file_type === 'image') || []
  const links = item.media?.filter(m => m.file_type === 'link') || []
  const videos = item.media?.filter(m => m.file_type === 'video') || []
  const audios = item.media?.filter(m => m.file_type === 'audio') || []
  const pdfs = item.media?.filter(m => m.file_type === 'pdf') || []

  // ── Première image = sidebar, reste = galerie
  const mainImage = images[0]
  const extraImages = images.slice(1)
  const hasResources = links.length > 0 || videos.length > 0 || audios.length > 0 || pdfs.length > 0

  // ── Label dynamique selon le type de média
  const getMediaLabel = (m) => {
    if (m.label) return m.label + ' →'
    if (m.file_type === 'pdf') return 'Télécharger ↓'
    if (m.file_type === 'video') return 'Voir la vidéo →'
    if (m.file_type === 'audio') return 'Écouter →'
    return 'Voir le lien →'
  }

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image={item.image_url || '/images/hero/hero-missions.jpg'}
        title={item.title}
      />

      {/* ── Contenu principal — texte 2/3 + sidebar 1/3 ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6">

          {/* Lien retour vers la liste des ateliers */}
          <a href="/actions-educatives" className="link-nav text-primary/50 hover:text-primary">
            ← Retour aux ateliers
          </a>

          {/* Type et public cible */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-eyebrow text-accent-2">{item.type}</span>
            <span className="text-caption text-primary/30">—</span>
            <span className="text-caption text-primary/50">{publicLabels}</span>
          </div>

          {/* Description courte — affichée en H2 pleine largeur */}
          <h2 className="h2-style text-primary">{item.description}</h2>

          {/* Layout 2 colonnes — texte + sidebar */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

            {/* Colonne texte — 2/3 */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Contenu long — paragraphes séparés par double saut de ligne */}
              {item.content && item.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-body text-primary/80">
                  {para}
                </p>
              ))}

              {/* CTA téléchargement plaquette PDF si disponible */}
              {item.external_url && (
                <div className="mt-2">
                  <a href={item.external_url} target="_blank" rel="noopener noreferrer">
                    <Button label="Télécharger la plaquette ↓" variant="secondary" />
                  </a>
                </div>
              )}
            </div>

            {/* Colonne sidebar — 1/3 */}
            <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-6">

              {/* Image principale depuis les médias attachés */}
              {mainImage && (
                <div className="w-full overflow-hidden rounded-2xl">
                  <img src={mainImage.file_url} alt={item.title} className="w-full h-56 object-cover" />
                </div>
              )}

              {/* Bloc ressources — liens, vidéos, audios, PDFs */}
              {hasResources && (
                <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-4">
                  <p className="text-eyebrow text-primary/40">Ressources</p>
                  {[...links, ...videos, ...audios, ...pdfs].map((m, i) => (
                    <a key={i} href={m.file_url} target="_blank" rel="noopener noreferrer">
                      <Button label={getMediaLabel(m)} variant="secondary" fullWidth />
                    </a>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── Galerie photos supplémentaires — grille ou carousel ── */}
      {extraImages.length > 0 && (
        <section className="section-padding bg-surface-mid">
          <h2 className="h2-style text-primary mb-8">Photos</h2>
          {extraImages.length <= 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* ── CTA contact — invitation à accueillir une intervention ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="h2-style text-surface">Vous souhaitez accueillir une intervention ?</h2>
            <p className="text-body text-surface/80">Notre équipe se déplace dans vos locaux ou vous accueille dans nos bureaux.</p>
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