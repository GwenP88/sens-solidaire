// MissionDetail.jsx
// Page détail d'une mission — Hero, description, rôle, programme, tarifs, lieux, témoignages

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams } from 'react-router-dom'

// ── API
import { fetchMissionBySlug, fetchFieldActions } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Carousel from '../components/ui/Carousel'
import Button from '../components/ui/Button'
import AnchorNav from '../components/navigation/AnchorNav'
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants métier
import TestimonialCard from '../components/testimonials/TestimonialCard'
import LocationCard from '../components/locations/LocationCard'
import ActionCard from '../components/actions/ActionCard'

// ── Utils
import { getDuration } from '../utils/missions'
import {
  IconClock, IconPin, IconMoney,
  IconFlight, IconContact, IconBooking,
  IconPayment, IconContract, IconGuide,
  IconFileMission, IconCheck, IconTimes,
} from '../utils/icons'

// ── Données statiques — icônes fixes pour les étapes "Comment partir"
const HOW_TO_GO_ICONS = [
  IconFlight, IconContact, IconBooking,
  IconPayment, IconContract, IconGuide, IconFileMission,
]

// ── Sections de l'AnchorNav
const ANCHOR_SECTIONS = [
  { label: "La mission", id: "description" },
  { label: "Rôle & Programme", id: "role-programme" },
  { label: "Lieux partenaires", id: "lieux" },
  { label: "Impact terrain", id: "impact" },
  { label: "Coût & durée", id: "cout" },
  { label: "Comment partir", id: "comment-partir" },
  { label: "Infos pratiques", id: "infos-pratiques" },
  { label: "Témoignages", id: "temoignages" },
  { label: "Galerie", id: "galerie" },
]

function MissionDetail() {
  const { slug } = useParams()
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actions, setActions] = useState([])

  useEffect(() => {
    const loadMission = async () => {
      try {
        const data = await fetchMissionBySlug(slug)
        setMission(data)
        fetchFieldActions(data.country).then(setActions).catch(console.error)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadMission()
  }, [slug])

  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error || !mission) return (
    <div className="p-12 text-center">
      <p className="text-body text-primary/50 italic">Mission introuvable.</p>
      <a href="/missions" className="link-inline text-accent">← Retour aux missions</a>
    </div>
  )

  const howToGoSteps = mission.how_to_go ? JSON.parse(mission.how_to_go) : []

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif avec prix et durée ── */}
      <HeroPage
        image={mission.image_url}
        title={mission.title}
        subtitle={mission.short_description}
        duration={getDuration(mission.pricing)}
        price={mission.pricing?.sort((a, b) => a.display_order - b.display_order)[0]?.price || null}
      />

      {/* ── Navigation ancres ── */}
      <AnchorNav variant="dark" sections={ANCHOR_SECTIONS} />

      {/* ── Description — texte + image ── */}
      {mission.description && (
        <section id="description" className="section-padding bg-surface-mid">
          <h2 className="h2-style text-primary mb-4">{mission.title}</h2>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

            <div className="flex flex-col gap-10 w-full md:w-2/3">
              <p className="text-body text-primary/80">{mission.description}</p>
              <h3 className="h3-style text-primary">De nombreux volontaires ont déjà sauté le pas…</h3>
              <p className="text-body text-primary/80">
                Découvrez la satisfaction de participer à des projets porteurs de sens. Que vous soyez étudiant, en activité ou retraité, aucun diplôme particulier n'est requis : nous recherchons avant tout des personnes motivées, ouvertes aux autres et désireuses de s'engager.
              </p>
            </div>

            <div className="w-full md:w-1/3 shrink-0">
              <img src={mission.image_url} alt={mission.title} className="w-full h-72 object-cover rounded-xl" />
            </div>
          </div>
        </section>
      )}

      {/* ── Rôle du volontaire + Programme ── */}
      {(mission.volunteer_role || mission.programme) && (
        <section id="role-programme" className="section-padding bg-surface">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

            {mission.volunteer_role && (
              <div className="w-full md:w-2/5">
                <h2 className="h2-style text-primary mb-4">Votre rôle sur le terrain</h2>
                <div
                  className="text-body text-primary/80 rich-text"
                  dangerouslySetInnerHTML={{ __html: mission.volunteer_role }}
                />
              </div>
            )}

            {mission.programme && (
              <div className="w-full md:w-3/5">
                <h2 className="h2-style text-primary mb-4">Programme de volontariat</h2>
                <div className="flex flex-col gap-1">
                  {mission.programme.split('\n').map((line, i) => {
                    if (!line.trim()) return null
                    const [label, ...rest] = line.split(':')
                    const content = rest.join(':').trim()
                    return (
                      <div key={i} className="flex items-stretch border-l-4 border-accent rounded-r-xl overflow-hidden">
                        <span className="text-body text-accent font-semibold bg-surface-dark px-4 py-3 shrink-0 w-32 flex items-center">
                          {label.trim()}
                        </span>
                        <span className="text-body text-primary/80 bg-surface-mid px-5 py-3 flex-1 flex items-center">
                          {content}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 border border-surface-dark rounded-xl px-5 py-4">
                  <p className="text-mention text-primary/40">
                    La nature exacte de la mission dépendra des priorités du moment sur le terrain.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Lieux partenaires ── */}
      {mission.location?.length > 0 && (
        <section id="lieux" className="section-padding bg-surface-mid">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="h2-style text-primary mb-2">Nos lieux partenaires</h2>
              <p className="text-body text-primary/60">
                Nos partenaires locaux sont au cœur de chaque mission. Engagés dans la protection de la biodiversité et le développement des communautés, ils accueillent les volontaires et les accompagnent tout au long de leur expérience.
              </p>
            </div>
            <div className="hidden md:block w-1/4 shrink-0">
              <img src="/images/ui/one-line-3.png" alt="" aria-hidden="true" className="w-full object-contain max-h-40" />
            </div>
          </div>
          <Carousel
            items={mission.location}
            slidesPerView={3}
            spaceBetween={24}
            showPagination={true}
            color="primary"
            renderSlide={(loc) => <LocationCard {...loc} />}
          />
        </section>
      )}

      {/* ── Impact terrain ── */}
      <section id="impact" className="section-padding bg-surface">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2 max-w-4xl">
            <h2 className="h2-style text-primary mb-4">Votre impact sur le terrain</h2>
            <p className="text-body text-primary/60">
              Depuis plus de 20 ans, des centaines de volontaires mettent leur temps, leur énergie et leurs compétences au service de projets portés par nos partenaires locaux.
            </p>
          </div>
          <a href={`/notre-impact?pays=${mission.country}`}>
            <Button label="Voir toutes les actions →" variant="secondary" />
          </a>
        </div>

        {actions.length === 0 ? (
          <div className="flex items-center justify-center bg-surface-mid rounded-xl h-64">
            <p className="text-body text-primary/40 italic text-center px-8">
              Nous préparons actuellement la présentation des actions menées avec nos partenaires au {mission.country}. Revenez bientôt pour les découvrir.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {actions.slice(0, 4).map(action => (
              <ActionCard
                key={action.slug}
                slug={action.slug}
                title={action.title}
                description={action.description}
                image={action.image_url}
                tags={action.tags.map(t => t.tag)}
                odds={action.odds.map(o => o.odd_number)}
                country={action.country}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Coût & durée ── */}
      {mission.pricing?.length > 0 && (
        <section id="cout" className="section-padding bg-surface-mid">
          <h2 className="h2-style text-primary mb-4">Durée du séjour & participation</h2>
          <p className="text-body text-primary/60 mb-8">
            Choisissez la durée de séjour qui correspond le mieux à vos disponibilités et à votre projet d'engagement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

            {/* Tableau tarifs */}
            <div className="flex flex-col bg-surface rounded-xl p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-dark">
                    <th className="text-left py-2 text-primary font-semibold flex items-center gap-3">
                      <IconClock className="text-accent" /> Durée
                    </th>
                    <th className="text-right py-2 text-primary font-semibold">
                      <span className="flex items-center justify-end gap-3">
                        <IconMoney className="text-accent" /> Prix
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mission.pricing.sort((a, b) => a.display_order - b.display_order).map((p) => (
                    <tr key={p.id} className="border-b border-surface-dark/50">
                      <td className="py-3 text-body text-primary/80">{p.duration_label}</td>
                      <td className="py-3 text-right text-body font-semibold text-primary">
                        {p.price > 0 ? `${p.price} €` : 'Nous contacter'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inclus / non inclus */}
            <div className="flex flex-col justify-between self-stretch gap-6">
              {mission.included && (
                <div>
                  <h3 className="h3-style text-primary flex items-center gap-2 mb-2">
                    <IconCheck className="text-accent-2" /> Inclus
                  </h3>
                  <p className="text-body text-primary/80">{mission.included}</p>
                </div>
              )}
              {mission.not_include && (
                <div>
                  <h3 className="h3-style text-primary flex items-center gap-2 mb-2">
                    <IconTimes className="text-accent" /> Non inclus
                  </h3>
                  <p className="text-body text-primary/80">{mission.not_include}</p>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="h-full flex flex-col gap-4 justify-between">
              <div className="bg-surface rounded-xl p-4 flex flex-col gap-3">
                <h3 className="h3-style text-primary">Prêt à vous engager ?</h3>
                <a href={mission.helloasso_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button label="Je pars en mission →" variant="primary" fullWidth />
                </a>
              </div>
              <div className="bg-surface rounded-xl p-4 flex flex-col gap-3">
                <h3 className="h3-style text-primary">Besoin de plus d'informations ?</h3>
                <Button label="Nous contacter →" variant="secondary" fullWidth />
              </div>
            </div>

            {/* Répartition des frais */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-surface-dark">
              <div className="flex flex-col gap-3">
                <h3 className="h3-style text-primary">À quoi servent les frais de mission ?</h3>
                <p className="text-body text-primary/60">
                  Chez Sens Solidaire, nous avons à cœur de vous informer en toute transparence sur l'utilisation des fonds qui soutiennent nos actions sur le terrain.
                </p>
              </div>
              <div className="bg-accent-2/10 rounded-xl p-4">
                <p className="text-stat text-accent-2">30 – 40 %</p>
                <p className="text-body text-primary/60 mt-2">
                  Préparation des missions, accompagnement des volontaires, suivi des projets et fonctionnement de l'association.
                </p>
              </div>
              <div className="bg-accent-2/10 rounded-xl p-4">
                <p className="text-stat text-accent-2">60 – 70 %</p>
                <p className="text-body text-primary/60 mt-2">
                  Reversés aux partenaires locaux : hébergement, repas, transports, équipes locales et projets terrain.
                </p>
              </div>
            </div>

            {/* Mention fiscale */}
            <div className="col-span-1 md:col-span-3">
              <p className="text-mention text-primary/40">
                Conformément aux articles 200 et 238 bis du CGI, 66 % du montant engagé est déductible de vos impôts. Un reçu fiscal vous sera délivré à l'issue de votre mission.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Comment partir ── */}
      {howToGoSteps.length > 0 && (
        <section id="comment-partir" className="section-padding bg-surface">
          <h2 className="h2-style text-primary mb-4">Comment partir ?</h2>
          <p className="text-body text-primary/60 mb-8">
            Nous accueillons des volontaires toute l'année. Ensemble, nous définissons la période de départ la plus adaptée à votre projet, à vos disponibilités et aux besoins de nos partenaires.
          </p>
          <div className="flex flex-col md:flex-row items-start gap-2">
            {howToGoSteps.map((step, i) => {
              const Icon = HOW_TO_GO_ICONS[i]
              return (
                <div key={i} className="flex items-start gap-2 flex-1">
                  <div className="flex flex-col items-center gap-3 flex-1">
                    <div className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center shrink-0">
                      <Icon className="text-primary/80 text-xl" />
                    </div>
                    <p className="text-eyebrow text-primary/80 text-center">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="text-caption text-primary/60 text-center leading-tight">{step}</p>
                  </div>
                  {i < howToGoSteps.length - 1 && (
                    <span className="hidden md:block text-primary/40 text-lg mt-4 shrink-0">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Infos pratiques ── */}
      {(mission.health_info || mission.admin_info) && (
        <section id="infos-pratiques" className="section-padding bg-surface-mid">
          <h2 className="h2-style text-primary mb-4">Préparer votre départ</h2>
          <p className="text-body text-primary/60 mb-8">
            Pour vivre cette expérience dans les meilleures conditions, prenez le temps de préparer votre départ grâce à nos recommandations et informations pratiques.
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            {mission.health_info && (
              <div className="flex-1 bg-surface rounded-xl p-6">
                <h3 className="h3-style text-primary mb-2">Avant le départ : santé & prévention</h3>
                <div className="text-body text-primary/80 rich-text" dangerouslySetInnerHTML={{ __html: mission.health_info }} />
              </div>
            )}
            {mission.admin_info && (
              <div className="flex-1 bg-surface rounded-xl p-6">
                <h3 className="h3-style text-primary mb-2">Avant de prendre votre envol</h3>
                <div className="text-body text-primary/80 rich-text" dangerouslySetInnerHTML={{ __html: mission.admin_info }} />
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-surface rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="h3-style text-primary">Guide du volontaire</h3>
                <p className="text-body text-primary/60">Votre guide complet pour préparer votre mission.</p>
              </div>
              <Button label="Télécharger ↓" variant="secondary" />
            </div>
            <div className="flex-1 bg-surface rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="h3-style text-primary">Recommandations officielles</h3>
                <p className="text-body text-primary/60">Consultez les informations officielles avant votre départ.</p>
              </div>
              <a href={mission.ministry_url || '#'} target="_blank" rel="noopener noreferrer">
                <Button label="Consulter →" variant="secondary" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Témoignages ── */}
      {mission.testimonials?.length > 0 && (
        <section id="temoignages" className="section-padding bg-accent-2">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="h2-style text-surface mb-4">Ils ont vécu l'aventure, découvrez leurs témoignages</h2>
              <p className="text-body text-surface/60">
                Chaque mission est une expérience unique. Découvrez les récits de volontaires partis avant vous.
              </p>
            </div>
            <a href="/temoignages">
              <Button label="Voir tous les témoignages →" variant="secondary" />
            </a>
          </div>
          <Carousel
            items={mission.testimonials}
            renderSlide={(t) => <TestimonialCard {...t} />}
            slidesPerView={3}
            spaceBetween={24}
            showPagination={true}
            color="surface"
          />
        </section>
      )}

      {/* ── Galerie photos ── */}
      <section id="galerie" className="section-padding bg-surface-mid">
        <h2 className="h2-style text-primary mb-4">Plongez dans l'aventure</h2>
        <p className="text-body text-primary/60 mb-8">
          Explorez la mission à travers les images de nos volontaires et découvrez l'environnement, les projets et les expériences qui vous attendent sur le terrain.
        </p>
        <Carousel
          items={[1, 2, 3, 4]}
          slidesPerView={3}
          spaceBetween={16}
          showPagination={true}
          color="primary"
          renderSlide={(_, i) => (
            <img
              src={`/images/placeholders/placeholder-galerie-${i + 1}.png`}
              alt=""
              aria-hidden="true"
              className="w-full h-56 object-cover rounded-xl"
            />
          )}
        />
      </section>

      <ScrollToTop />
    </div>
  )
}

export default MissionDetail