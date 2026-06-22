// LocationDetail.jsx
// Page détail d'un lieu partenaire — hero, description, galerie, mission liée, CTA

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams } from 'react-router-dom'

// ── API
import { fetchLocationBySlug } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import ScrollToTop from '../components/ui/ScrollToTop'

function LocationDetail() {
  // ── État local — lieu + chargement + erreur
  const { slug } = useParams()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Chargement du lieu depuis l'API au montage
  useEffect(() => {
    fetchLocationBySlug(slug)
      .then(data => setLocation(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  // ── États de chargement et d'erreur
  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error || !location) return (
    <div className="p-12 text-center">
      <p className="font-body text-primary/60">Lieu introuvable.</p>
      <a href="/missions" className="text-accent underline text-sm">← Retour aux missions</a>
    </div>
  )

  // ── Séparation des médias — première image en sidebar, reste en galerie
  const images = location.gallery || []
  const mainImage = images[0]
  const extraImages = images.slice(1)

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif — nom du lieu ── */}
      <HeroPage
        image={location.image_url || '/images/hero/hero-missions.jpg'}
        title={location.name}
      />

      {/* ── Contenu principal — texte 2/3 + sidebar 1/3 ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6">

          {/* Lien retour vers la mission parente */}
          {location.mission?.slug ? (
            <a href={`/missions/${location.mission.slug}`} className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
              ← Retour à la mission
            </a>
          ) : (
            <a href="/missions" className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
              ← Retour aux missions
            </a>
          )}

          {/* Pays + mission associée */}
          <div className="flex items-center gap-2">
            <span className="font-body text-xs font-bold text-accent-2">{location.country}</span>
            {location.mission?.title && (
              <>
                <span className="font-body text-xs text-primary/30">—</span>
                <span className="font-body text-xs text-primary/50">{location.mission.title}</span>
              </>
            )}
          </div>

          {/* Titre du lieu en H2 pleine largeur */}
          <h2 className="section-title text-primary">{location.title}</h2>

          {/* Layout 2 colonnes — texte + sidebar */}
          <div className="flex gap-12 items-start">

            {/* Colonne texte — 2/3 */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Description longue — paragraphes séparés par double saut de ligne */}
              {location.description.split('\n\n').map((para, i) => (
                <p key={i} className="font-body text-sm text-primary/80 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Colonne sidebar — 1/3 */}
            <div className="w-1/3 shrink-0 flex flex-col gap-6">

              {/* Image principale — galerie ou image de couverture */}
              <div className="w-full overflow-hidden rounded-2xl">
                <img
                  src={mainImage?.file_url || location.image_url || '/images/hero/hero-missions.jpg'}
                  alt={location.name}
                  className="w-full h-56 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Galerie photos — grille si ≤ 2 images, carousel sinon ── */}
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

      <ScrollToTop />
    </div>
  )
}

export default LocationDetail