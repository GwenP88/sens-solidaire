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

// ── Utils
import { IconPin, IconGlobe, IconPerson } from '../utils/icons'

function LocationDetail() {
  // ── État local — lieu + chargement + erreur
  // delegation est maintenant inclus directement dans location via l'API
  const { slug } = useParams()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const fromSlug = searchParams.get('from')
  const originMission = location?.missions?.find(m => m.slug === fromSlug)

  // ── Chargement du lieu depuis l'API — delegation inclus via include Prisma
  useEffect(() => {
    fetchLocationBySlug(slug)
      .then(data => setLocation(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  // ── États de chargement et d'erreur
  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error || !location) return (
    <div className="p-12 text-center">
      <p className="text-body text-primary/50 italic">Lieu introuvable.</p>
      <a href="/missions" className="link-inline text-accent">← Retour aux missions</a>
    </div>
  )

  // ── Médias — galerie sans la première image (utilisée dans le hero)
  const images = location.gallery || []
  const extraImages = images.slice(1)

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif — image du lieu + titre + pays si disponible ── */}
      <HeroPage
        image={location.image_url || '/images/placeholders/placeholder-action-1.png'}
        title={location.name}
        country={location.country || null}
      />

      {/* ── Contenu principal — 2 colonnes à partir de lg ── */}
      <section className="padding-y padding-x bg-surface">
        <div className="flex flex-col gap-md">

          {/* Lien retour — mission parente si disponible, sinon liste missions */}
          {originMission ? (
            <a href={`/missions/${originMission.slug}`} className="link-nav text-primary/50 hover:text-primary">
              ← Retour à la mission {originMission.title}
            </a>
          ) : (
            <a href="/missions" className="link-nav text-primary/50 hover:text-primary">
              ← Retour aux missions
            </a>
          )}

          {/* Layout 2 colonnes — description à gauche, card infos à droite */}
          {/* gap-lg : entre deux grands blocs — responsive via @media dans index.css */}
          <div className="flex flex-col lg:flex-row gap-lg items-start">

            {/* ── Colonne gauche — description + encart mission ── */}
            <div className="flex-1 flex flex-col gap-md">

              <h2 className="h2-style text-primary">À propos de ce lieu</h2>

              {/* Description — découpage par double saut de ligne */}
              {/* gap-sm : entre les paragraphes */}
              <div className="flex flex-col gap-sm">
                {location.description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-body text-primary/80">{para}</p>
                ))}
              </div>

              {/* Encart "Notre mission ici" */}
              <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
                <h3 className="h3-style text-primary mb-0">Notre mission ici</h3>
                <p className="text-body text-primary/70">
                  Les volontaires Sens Solidaires interviennent directement avec les équipes de ce partenaire local.
                  Chaque action menée sur place s'inscrit dans une démarche durable et en lien étroit avec les communautés.
                </p>
              </div>

            </div>

            {/* ── Colonne droite — card informations pratiques ── */}
            <div className="w-full lg:w-1/3 shrink-0">
              <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-md">

                <h3 className="h3-style text-primary mb-0">Informations pratiques</h3>

                {/* Contacts — inclus directement via location.delegation (FK BDD) */}
                {location.delegation?.contacts && (
                  <div className="flex flex-col gap-xs">
                    <span className="text-eyebrow text-primary/40">Sur place</span>
                    <div className="flex items-start gap-xs">
                      <IconPerson className="text-accent shrink-0 mt-0.5" />
                      <p className="text-body text-primary/80">{location.delegation.contacts}</p>
                    </div>
                  </div>
                )}

                {/* Site web — location.website_url, champ optionnel pas encore en BDD */}
                {location.website_url && (
                <div className="flex flex-col gap-xs">
                  <span className="text-eyebrow text-primary/40">Site web</span>
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

                {/* Localisation — lien carte ou placeholder */}
                <div className="flex flex-col gap-xs">
                  <span className="text-eyebrow text-primary/40">Localisation</span>

                  {location.map_url ? (
                    <iframe
                      src={location.map_url}
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
                      <p className="text-caption text-primary/40 italic">Localisation à renseigner</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Galerie photos — masquée s'il n'y a pas d'images supplémentaires ── */}
      {extraImages.length > 0 && (
        <section className="padding-y padding-x bg-surface-mid">

          {/* h2-style porte déjà margin-bottom: 2rem — pas de mb- en dur */}
          <h2 className="h2-style text-primary">Galerie photos</h2>

          {extraImages.length <= 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {extraImages.map((m, i) => (
                <div key={i} className="overflow-hidden rounded-xl">
                  <img
                    src={m.file_url}
                    alt=""
                    onError={e => { e.target.src = '/images/placeholders/placeholder-action-1.png' }}
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
              renderSlide={(m) => (
                <div className="w-full h-56 overflow-hidden rounded-xl">
                  <img
                    src={m.file_url}
                    alt=""
                    onError={e => { e.target.src = '/images/placeholders/placeholder-action-1.png' }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            />
          )}

        </section>
      )}

      {/* ── ScrollToTop — bouton flottant, suit le scroll sur toute la page ── */}
      <ScrollToTop />

    </div>
  )
}

export default LocationDetail