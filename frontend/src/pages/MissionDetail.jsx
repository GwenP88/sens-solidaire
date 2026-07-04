// ════════════════════════════════════════════════════════════════
// MissionDetail.jsx
// Page détail d'une mission — Hero, description, rôle, programme,
// tarifs, lieux, impact, comment partir, infos pratiques, témoignages, galerie
// ════════════════════════════════════════════════════════════════

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
import ImpactCard from '../components/actions/ImpactCard'

// ── Utils
import { getDuration } from '../utils/missions'
import {
  IconClock, IconPin, IconMoney,
  IconFlight, IconContact, IconBooking,
  IconPayment, IconContract, IconGuide,
  IconFileMission, IconCheck, IconTimes,
} from '../utils/icons'

// ── Icônes fixes pour les 7 étapes "Comment partir"
const HOW_TO_GO_ICONS = [
  IconFlight, IconContact, IconBooking,
  IconPayment, IconContract, IconGuide, IconFileMission,
]

// ── Sections de l'AnchorNav
const ANCHOR_SECTIONS = [
  { label: "La mission",        id: "description"     },
  { label: "Rôle & Programme",  id: "role-programme"  },
  { label: "Lieux partenaires", id: "lieux"           },
  { label: "Impact terrain",    id: "impact"          },
  { label: "Coût & durée",      id: "cout"            },
  { label: "Comment partir",    id: "comment-partir"  },
  { label: "Infos pratiques",   id: "infos-pratiques" },
  { label: "Témoignages",       id: "temoignages"     },
  { label: "Galerie",           id: "galerie"         },
]

// ── Utilitaire — transforme un texte multi-lignes en tableau de puces
// Chaque ligne non vide devient un élément <li>
function LignesToPuces({ texte, className = "" }) {
  if (!texte) return null
  const lignes = texte.split('\n').filter(l => l.trim() !== '')
  return (
    <ul className={`flex flex-col gap-0 list-none ${className}`}>
      {lignes.map((ligne, i) => (
        <li key={i} className="flex items-start gap-xs text-body text-primary/80">
          <span className="text-accent mt-1 shrink-0">•</span>
          <span>{ligne.trim()}</span>
        </li>
      ))}
    </ul>
  )
}

function MissionDetail() {
  const { slug } = useParams()
  const [mission, setMission]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [actions, setActions]   = useState([])

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

  // ── Parsing des champs JSON ──
  // how_to_go : JSON array de strings ["étape 1", "étape 2"...]
  const howToGoSteps = (() => {
    try { return mission.how_to_go ? JSON.parse(mission.how_to_go) : [] }
    catch { return [] }
  })()

  // programme : JSON array [{label: "Jour 1", content: "..."}]
  const programmeSteps = (() => {
    try { return mission.programme ? JSON.parse(mission.programme) : [] }
    catch { return [] }
  })()


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

      <AnchorNav variant="dark" sections={ANCHOR_SECTIONS} />

      {/* ── Description ── */}
      {mission.description && (
        <section id="description" className="padding-y padding-x bg-surface-mid">
          <h2 className="h2-style text-primary">{mission.title}</h2>
          <div className="flex flex-col lg:flex-row gap-lg items-start">
            <div className="flex flex-col gap-md w-full lg:w-2/3">
              <p className="text-body text-primary/80">{mission.description}</p>
              <h3 className="h3-style text-primary mb-0">De nombreux volontaires ont déjà sauté le pas…</h3>
              <p className="text-body text-primary/80">
                Découvrez la satisfaction de participer à des projets porteurs de sens. Que vous soyez étudiant, en activité ou retraité, aucun diplôme particulier n'est requis : nous recherchons avant tout des personnes motivées, ouvertes aux autres et désireuses de s'engager.
              </p>
            </div>
            <div className="w-full lg:w-1/3 shrink-0">
              <img
                src={mission.image_url || '/images/placeholders/placeholder-galerie-1.png'}
                alt={mission.title}
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Rôle du volontaire + Programme ── */}
      {(mission.volunteer_role || programmeSteps.length > 0) && (
        <section id="role-programme" className="padding-y padding-x bg-surface">
          <div className="flex flex-col lg:flex-row gap-lg items-start">

            {/* ── Rôle du volontaire ── */}
            {mission.volunteer_role && (
              <div className="w-full lg:w-2/5 flex flex-col gap-md">
                <h2 className="h2-style text-primary">Votre rôle sur le terrain</h2>
                {/* Phrase fixe — introduction de la liste */}
                <p className="text-body text-primary/80">
                  Au cours de votre mission, vous pourrez participer à différentes actions selon les besoins du terrain :
                </p>
                {/* Lignes saisies dans le dashboard → puces */}
                <LignesToPuces texte={mission.volunteer_role} />
              </div>
            )}

            {/* ── Programme jour par jour ── */}
            {programmeSteps.length > 0 && (
              <div className="w-full lg:w-3/5 flex flex-col gap-md">
                <h2 className="h2-style text-primary">Programme de volontariat</h2>
                <div className="flex flex-col gap-xs">
                  {programmeSteps.map((step, i) => (
                    <div key={i} className="flex items-stretch border-l-4 border-accent rounded-r-xl overflow-hidden">
                      <span className="text-body text-accent font-semibold bg-surface-dark px-4 py-3 shrink-0 w-32 flex items-center">
                        {step.label}
                      </span>
                      <span className="text-body text-primary/80 bg-surface-mid px-5 py-3 flex-1 flex items-center">
                        {step.content}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border border-surface-dark rounded-xl px-5 py-4">
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
        <section id="lieux" className="padding-y padding-x bg-surface-mid">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-sm mb-6">
            <div>
              <h2 className="h2-style text-primary">Nos lieux partenaires</h2>
              <p className="text-body text-primary/60">
                Nos partenaires locaux sont au cœur de chaque mission. Engagés dans la protection de la biodiversité et le développement des communautés, ils accueillent les volontaires et les accompagnent tout au long de leur expérience.
              </p>
            </div>
          </div>
          <Carousel
            items={mission.location}
            showPagination={true}
            color="primary"
            renderSlide={(loc) => <LocationCard {...loc} />}
          />
        </section>
      )}

      {/* ── Impact terrain ── */}
      <section id="impact" className="padding-y padding-x bg-surface">
        <div className="flex flex-col xl:flex-row items-start justify-between gap-sm mb-8">
          <div className="flex flex-col gap-xs max-w-4xl">
            <h2 className="h2-style text-primary">Votre impact sur le terrain</h2>
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
          <Carousel
            items={actions.slice(0, 4)}
            showPagination={true}
            color="primary"
            renderSlide={(action) => (
              <ImpactCard
                slug={action.slug}
                title={action.title}
                description={action.description}
                image={action.image_url}
                tags={action.tags.map(t => t.tag)}
                odds={action.odds.map(o => o.odd_number)}
                country={action.country}
              />
            )}
          />
        )}
      </section>

      {/* ── Coût & durée ── */}
      {mission.pricing?.length > 0 && (
        <section id="cout" className="padding-y padding-x bg-surface-mid">
          <h2 className="h2-style text-primary">Durée du séjour & participation</h2>
          <p className="text-body text-primary/60 mb-8">
            Choisissez la durée de séjour qui correspond le mieux à vos disponibilités et à votre projet d'engagement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-md items-stretch">

            {/* Tableau tarifs */}
            <div className="flex flex-col bg-surface rounded-xl p-4 xl:col-span-1">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-dark">
                    <th className="text-left py-2 text-primary font-semibold">
                      <span className="flex items-center gap-xs">
                        <IconClock className="text-accent" /> Durée
                      </span>
                    </th>
                    <th className="text-right py-2 text-primary font-semibold">
                      <span className="flex items-center justify-end gap-xs">
                        <IconMoney className="text-accent" /> Prix
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mission.pricing
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((p) => (
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
            <div className="flex flex-col justify-between self-stretch gap-md xl:col-span-2">
              {mission.included && (
                <div>
                  <h3 className="h3-style text-primary flex items-center gap-xs mb-0">
                    <IconCheck className="text-accent-2" /> Inclus
                  </h3>
                  <LignesToPuces texte={mission.included} />
                </div>
              )}
              {mission.not_include && (
                <div>
                  <h3 className="h3-style text-primary flex items-center gap-xs mb-0">
                    <IconTimes className="text-accent" /> Non inclus
                  </h3>
                  <LignesToPuces texte={mission.not_include} />
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="col-span-1 md:col-span-2 xl:col-span-1 h-full flex flex-col md:flex-row xl:flex-col gap-sm justify-between">
              <div className="bg-surface rounded-xl p-4 flex flex-col gap-sm flex-1">
                <h3 className="h3-style text-primary mb-0">Prêt à vous engager ?</h3>
                <a href={mission.helloasso_url} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button label="Je pars en mission →" variant="primary" fullWidth />
                </a>
              </div>
              <div className="bg-surface rounded-xl p-4 flex flex-col gap-sm flex-1">
                <h3 className="h3-style text-primary mb-0">Besoin de plus d'informations ?</h3>
                <a href="/contact">
                  <Button label="Nous contacter →" variant="secondary" fullWidth />
                </a>
              </div>
            </div>

            {/* Répartition des frais */}
           <div className="col-span-1 md:col-span-2 xl:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-md pt-6 border-t border-surface-dark">
              <div className="flex flex-col gap-sm">
                <h3 className="h3-style text-primary mb-0">À quoi servent les frais de mission ?</h3>
                <p className="text-body text-primary/60">
                  Chez Sens Solidaires, nous avons à cœur de vous informer en toute transparence sur l'utilisation des fonds qui soutiennent nos actions sur le terrain.
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
            <div className="col-span-1 md:col-span-2 xl:col-span-4">
              <p className="text-mention text-primary/40">
                Conformément aux articles 200 et 238 bis du CGI, 66 % du montant engagé est déductible de vos impôts. Un reçu fiscal vous sera délivré à l'issue de votre mission.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Comment partir — 7 étapes fixes avec icônes ── */}
      {howToGoSteps.length > 0 && (
        <section id="comment-partir" className="padding-y padding-x bg-surface">
          <h2 className="h2-style text-primary">Comment partir ?</h2>
          <p className="text-body text-primary/60 mb-8">
            Nous accueillons des volontaires toute l'année. Ensemble, nous définissons la période de départ la plus adaptée à votre projet, à vos disponibilités et aux besoins de nos partenaires.
          </p>

          {/* Mobile — scroll horizontal */}
          <div className="relative lg:hidden">
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
            <div className="flex flex-row items-start gap-xs overflow-x-auto pb-3">
              {howToGoSteps.map((step, i) => {
                const Icon = HOW_TO_GO_ICONS[i]
                return (
                  <div key={i} className="flex items-start gap-xs shrink-0 min-w-[140px]">
                    <div className="flex flex-col items-center gap-sm flex-1">
                      <div className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center shrink-0">
                        <Icon className="text-primary/80 text-xl" />
                      </div>
                      <p className="text-eyebrow text-primary/80 text-center">{String(i + 1).padStart(2, '0')}</p>
                      <p className="text-caption text-primary/60 text-center leading-tight">{step}</p>
                    </div>
                    {i < howToGoSteps.length - 1 && (
                      <span className="text-primary/40 text-lg mt-4 shrink-0">→</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Desktop — flex centré */}
          <div className="hidden lg:flex flex-row items-center gap-xs">
            {howToGoSteps.map((step, i) => {
              const Icon = HOW_TO_GO_ICONS[i]
              return (
                <div key={i} className="flex items-start gap-xs flex-1">
                  <div className="flex flex-col items-center gap-sm flex-1">
                    <div className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center shrink-0">
                      <Icon className="text-primary/80 text-xl" />
                    </div>
                    <p className="text-eyebrow text-primary/80 text-center">{String(i + 1).padStart(2, '0')}</p>
                    <p className="text-caption text-primary/60 text-center leading-tight">{step}</p>
                  </div>
                  {i < howToGoSteps.length - 1 && (
                    <span className="text-primary/40 text-lg mt-4 shrink-0">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Infos pratiques ── */}
      {(mission.health_info || mission.admin_info) && (
        <section id="infos-pratiques" className="padding-y padding-x bg-surface-mid">
          <h2 className="h2-style text-primary">Préparer votre départ</h2>
          <p className="text-body text-primary/60 mb-8">
            Pour vivre cette expérience dans les meilleures conditions, prenez le temps de préparer votre départ grâce à nos recommandations et informations pratiques.
          </p>
          <div className="flex flex-col lg:flex-row gap-md">

            {/* Infos santé */}
            {mission.health_info && (
              <div className="flex-1 bg-surface rounded-xl p-6 flex flex-col gap-md">
                <h3 className="h3-style text-primary mb-0">Avant le départ : santé & prévention</h3>
                {/* Lignes saisies dans le dashboard → puces */}
                <LignesToPuces texte={mission.health_info} />
              </div>
            )}

            {/* Infos administratives */}
            {mission.admin_info && (
              <div className="flex-1 bg-surface rounded-xl p-6 flex flex-col gap-md">
                <h3 className="h3-style text-primary mb-0">Avant de prendre votre envol</h3>
                {/* Lignes saisies dans le dashboard → puces */}
                <LignesToPuces texte={mission.admin_info} />
              </div>
            )}

          </div>

          {/* Guide + lien ministère */}
          <div className="mt-8 flex flex-col lg:flex-row gap-md">
            <div className="flex-1 bg-surface rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-sm">
              <div>
                <h3 className="h3-style text-primary mb-0">Guide du volontaire</h3>
                <p className="text-body text-primary/60">Votre guide complet pour préparer votre mission.</p>
              </div>
              {mission.guide_url
                ? <a href={mission.guide_url} target="_blank" rel="noopener noreferrer">
                    <Button label="Télécharger ↓" variant="secondary" />
                  </a>
                : <Button label="Télécharger ↓" variant="secondary" />
              }
            </div>
            <div className="flex-1 bg-surface rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-sm">
              <div>
                <h3 className="h3-style text-primary mb-0">Recommandations officielles</h3>
                <p className="text-body text-primary/60">Consultez les informations officielles avant votre départ.</p>
              </div>
              <a href={mission.ministry_url || 'https://www.diplomatie.gouv.fr'} target="_blank" rel="noopener noreferrer">
                <Button label="Consulter →" variant="secondary" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Témoignages ── */}
      {mission.testimonials?.length > 0 && (
        <section id="temoignages" className="padding-y padding-x bg-accent-2">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-sm mb-8">
            <div>
              <h2 className="h2-style text-surface">Ils ont vécu l'aventure, découvrez leurs témoignages</h2>
              <p className="text-body text-surface/60">
                Chaque mission est une expérience unique. Découvrez les récits de volontaires partis avant vous.
              </p>
            </div>
            <a href="/temoignages">
              <Button label="Voir tous les témoignages →" variant="primary" />
            </a>
          </div>
          <Carousel
            items={mission.testimonials}
            showPagination={true}
            color="surface"
            renderSlide={(t) => <TestimonialCard {...t} />}
          />
        </section>
      )}

      {/* ── Galerie photos ── */}
      <section id="galerie" className="padding-y padding-x bg-surface-mid">
        <h2 className="h2-style text-primary">Plongez dans l'aventure</h2>
        <p className="text-body text-primary/60 mb-8">
          Explorez la mission à travers les images de nos volontaires et découvrez l'environnement, les projets et les expériences qui vous attendent sur le terrain.
        </p>
        <Carousel
          items={[1, 2, 3, 4]}
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