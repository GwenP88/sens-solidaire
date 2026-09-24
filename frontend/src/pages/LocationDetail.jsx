// LocationDetail.jsx
// Page détail d'un lieu partenaire — hero, description, infos pratiques, galerie

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams, useSearchParams } from 'react-router-dom'

// ── API
import { fetchLocationBySlug } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Carousel from '../components/ui/Carousel'
import ScrollToTop from '../components/ui/ScrollToTop'
import Modal from '../components/ui/Modal'

// ── Utils
import { IconPin, IconGlobe, IconPerson } from '../utils/icons'

// Construit l'URL d'intégration à partir de ce que la cliente a collé.
// Accepte : un lien Google Maps normal (@lat,lng extrait automatiquement)
// ou, par rétrocompatibilité, l'ancien format d'intégration déjà complet.
function buildMapEmbedUrl(url) {
  if (!url) return null
  if (url.includes('/maps/embed')) return url

  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)

  if (!match) return null

  const [, lat, lng] = match

  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`
}

function LocationDetail() {
  // ── État local — lieu + chargement + erreur
  // delegation est maintenant inclus directement dans location via l'API
  const { slug } = useParams()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDelegationModal, setShowDelegationModal] = useState(false)
  const [searchParams] = useSearchParams()

  const fromSlug = searchParams.get('from')
  const originMission = location?.missions?.find(
    mission => mission.slug === fromSlug
  )

  // ── Chargement du lieu depuis l'API
  // delegation inclus via include Prisma
  useEffect(() => {
    fetchLocationBySlug(slug)
      .then(data => setLocation(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  // ── États de chargement et d'erreur
  if (loading) {
    return (
      <p className="text-body text-primary/50 italic p-12">
        Chargement...
      </p>
    )
  }

  if (error || !location) {
    return (
      <div className="p-12 text-center">
        <p className="text-body text-primary/50 italic">
          Lieu introuvable.
        </p>

        <a
          href="/missions"
          className="link-inline text-accent"
        >
          ← Retour aux missions
        </a>
      </div>
    )
  }

  // ── Médias — galerie sans la première image utilisée dans le hero
  const extraImages = location.gallery || []

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif — image du lieu + titre + pays ── */}
      <HeroPage
        image={
          location.image_url ||
          '/images/placeholders/placeholder-action-1.webp'
        }
        title={location.name}
        country={location.country || null}
      />

      {/* ── Contenu principal ── */}
      <section className="padding-y padding-x bg-surface">

        <div className="flex flex-col gap-lg">

          {/* ── Lien retour ── */}
          {originMission ? (
            <a
              href={`/missions/${originMission.slug}`}
              className="link-nav text-primary/50 hover:text-primary"
            >
              ← Retour à la mission {originMission.title}
            </a>
          ) : (
            <a
              href="/missions"
              className="link-nav text-primary/50 hover:text-primary"
            >
              ← Retour aux missions
            </a>
          )}

          {/* ── Contenu en deux colonnes sur desktop ── */}
          <div className="flex flex-col lg:flex-row gap-lg">

            {/* ── Colonne principale ── */}
            <div className="flex-1 flex flex-col gap-lg">

              {/* ── Présentation du lieu ── */}
              <div className="flex flex-col gap-md">

                <h2 className="h2-style text-primary">
                  À propos de ce lieu
                </h2>

                {/* Description — découpage par double saut de ligne */}
                <div className="flex flex-col gap-sm">
                  {location.description.split('\n\n').map((para, i) => (
                    <p
                      key={i}
                      className="text-body text-primary/80"
                    >
                      {para}
                    </p>
                  ))}
                </div>

              </div>

              {/* ── Mission de Sens Solidaires sur ce lieu ── */}
              {/* Affichée uniquement si le contenu existe */}
              {location.mission_ss && (
                <div className="rounded-2xl p-6 flex flex-col gap-sm">

                  <h3 className="h3-style text-accent mb-0">
                    La mission de Sens Solidaires
                  </h3>

                  <p className="text-body text-primary/70 border-l-4 border-accent pl-4">
                    {location.mission_ss}
                  </p>

                </div>
              )}

            </div>

            {/* ── Colonne informations pratiques ── */}
            <div className="w-full lg:w-1/3 shrink-0 lg:sticky lg:top-24 lg:self-start">

              <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-md">

                <h3 className="h3-style text-primary mb-0">
                  Informations pratiques
                </h3>

                {/* ── Contacts sur place ── */}
                {location.delegation?.contacts && (
                  <div className="flex flex-col gap-xs">

                    <span className="text-eyebrow text-primary/40">
                      Contact sur place
                    </span>

                    <div className="flex items-start gap-xs">
                      <p className="text-body text-primary/80">
                        {location.delegation.contacts}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowDelegationModal(true)}
                      className="flex items-center gap-xs link-cta text-accent hover:text-accent/80"
                    >
                      <IconPerson className="shrink-0" />
                      Voir la délégation →
                    </button>

                  </div>
                )}

                {/* ── Site web ── */}
                {location.website_url && (
                  <div className="flex flex-col gap-xs">

                    <span className="text-eyebrow text-primary/40">
                      Site web
                    </span>

                    <a
                      href={location.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-xs link-cta text-accent hover:text-accent/80"
                    >
                      <IconGlobe className="shrink-0" />
                      Visiter le site →
                    </a>

                  </div>
                )}

                {/* ── Localisation ── */}
                <div className="flex flex-col gap-xs">

                  <span className="text-eyebrow text-primary/40">
                    Localisation
                  </span>

                  {buildMapEmbedUrl(location.map_url) ? (
                    <iframe
                      src={buildMapEmbedUrl(location.map_url)}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                  ) : (
                    <div className="bg-surface rounded-xl p-4 text-center">

                      <IconPin className="text-primary/20 text-2xl mx-auto mb-1" />

                      <p className="text-caption text-primary/40 italic">
                        Localisation à renseigner
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ── Galerie photos ── */}
      {/* Masquée s'il n'y a pas d'images supplémentaires */}
      {extraImages.length > 0 && (
        <section className="padding-y padding-x bg-surface-mid">

          <h2 className="h2-style text-primary">
            Galerie photos
          </h2>

          {extraImages.length <= 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">

              {extraImages.map((media, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl"
                >
                  <img
                    src={media.file_url}
                    alt=""
                    onError={e => {
                      e.target.src =
                        '/images/placeholders/placeholder-action-1.webp'
                    }}
                    className="w-full h-56 object-cover"
                  />
                </div>
              ))}

            </div>
          ) : (
            <Carousel
              items={extraImages}
              showPagination={true}
              color="primary"
              renderSlide={media => (
                <div className="w-full h-56 overflow-hidden rounded-xl">

                  <img
                    src={media.file_url}
                    alt=""
                    onError={e => {
                      e.target.src =
                        '/images/placeholders/placeholder-action-1.webp'
                    }}
                    className="w-full h-full object-cover"
                  />

                </div>
              )}
            />
          )}

        </section>
      )}

      {/* ── Modal délégation ── */}
      {showDelegationModal && location.delegation && (
        <Modal
          isOpen={true}
          onClose={() => setShowDelegationModal(false)}
          title={location.delegation.lieu}
          size="small"
        >

          <img
            src={
              location.delegation.image_url ||
              '/images/placeholders/placeholder-delegation.webp'
            }
            alt={location.delegation.lieu}
            onError={e => {
              e.target.src =
                '/images/placeholders/placeholder-delegation.webp'
            }}
            className="w-full aspect-video object-cover rounded-xl mb-4"
          />

          <p className="text-body text-primary/80 text-center whitespace-pre-line">
            {location.delegation.contacts}
          </p>

        </Modal>
      )}

      {/* ── Bouton retour en haut ── */}
      <ScrollToTop />

    </div>
  )
}

export default LocationDetail