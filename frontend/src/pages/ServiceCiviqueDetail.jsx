// ════════════════════════════════════════════════════════════════
// ServiceCiviqueDetail.jsx
// Page détail d'une mission Service Civique — Hero, mission, infos
// pratiques & rôle, lieux, procédure, impact, témoignages, galerie
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
import LignesToPuces from '../components/ui/LignesToPuces'

// ── Composants métier
import TestimonialCard from '../components/testimonials/TestimonialCard'
import LocationCard from '../components/locations/LocationCard'
import ImpactCard from '../components/actions/ImpactCard'

// ── Utils
import { IconPerson, IconFrance, IconAbroad, IconCheck } from '../utils/icons'
import {
  IconEligibilite, IconCandidature, IconEtudeDossier,
  IconEntretien, IconValidation, IconPreparation, IconDepart,
} from '../utils/icons'

// ── Icônes fixes pour les 7 étapes "Procédure"
const PROCEDURE_ICONS = [
  IconEligibilite, IconCandidature, IconEtudeDossier,
  IconEntretien, IconValidation, IconPreparation, IconDepart,
]

// ── Contenu fixe — identique pour toutes les missions Service Civique
const PROCEDURE_STEPS = [
  "Vérifier son éligibilité et choisir sa mission",
  "Déposer sa candidature",
  "Étude du dossier",
  "Entretien",
  "Validation et signature du contrat",
  "Préparation au départ",
  "Début de la mission",
]

function ServiceCiviqueDetail() {
  const { slug } = useParams()
  const [mission, setMission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
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
  if (error || !mission || mission.type !== 'service_civique') return (
    <div className="p-12 text-center">
      <p className="text-body text-primary/50 italic">Mission introuvable.</p>
      <a href="/missions" className="link-inline text-accent">← Retour aux missions</a>
    </div>
  )

  const ageLabel = mission.age_min && mission.age_max
    ? `${mission.age_min} - ${mission.age_max}`
    : mission.age_min || mission.age_max || null

  const anchorSections = [
    { label: "La mission", id: "description", show: true },
    { label: "Rôle et compétences", id: "role-competences", show: !!mission.admin_info || !!mission.role_france || !!mission.role_etranger },
    { label: "Lieux partenaires",    id: "lieux",           show: mission.locations?.length > 0 },
    { label: "Procédure",            id: "procedure",       show: true },
    { label: "Impact terrain",       id: "impact",          show: actions.length > 0 },
    { label: "Témoignages",          id: "temoignages",     show: mission.testimonials?.length > 0 },
    { label: "Galerie",              id: "galerie",         show: mission.media?.filter(m => m.file_type === 'image').length > 0 },
  ].filter(s => s.show)

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif avec âge et durée ── */}
      <HeroPage
        image={mission.image_url}
        title={mission.title}
        subtitle={mission.short_description}
        duration={mission.duration_label}
        age={ageLabel}
      />

      <AnchorNav variant="dark" sections={anchorSections} />

      {/* ── La mission ── */}
      <section id="description" className="padding-y padding-x bg-surface-mid">
        <h2 className="h2-style text-primary">{mission.title}</h2>
        <div className="flex flex-col lg:flex-row gap-lg items-start">
          <div className="flex flex-col gap-md w-full lg:w-2/3">

            {/* Paragraphe fixe — identique pour toutes les missions Service Civique */}
            <p className="text-body text-primary/80">
              Cette mission s'adresse aux jeunes de 16 à 25 ans (30 ans en situation de handicap) souhaitant réaliser un Service Civique à l'international. Le Service Civique ouvre droit à une indemnité mensuelle versée conformément à la réglementation en vigueur.
            </p>
            <p className="text-body text-primary/80">
              Le volontaire effectue une première partie de sa mission (3 mois minimum) en France afin de participer aux actions de sensibilisation de l'association, puis poursuit son engagement à l'étranger (3 mois minimum) auprès de nos partenaires locaux.
            </p>

            <h3 className="h3-style text-primary mb-0">Aucun diplôme ni compétence particulière ne sont requis.</h3>
            <p className="text-body text-primary/80">
              La motivation, l'ouverture d'esprit et l'envie de s'engager sont les qualités essentielles. Un accompagnement est assuré avant le départ ainsi que tout au long de la mission.
            </p>

          </div>
          <div className="w-full lg:w-1/3 shrink-0">
            <img
              src={mission.image_url || '/images/placeholders/placeholder-galerie-1.png'}
              alt={mission.image_alt || mission.title}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ── Rôle & compétences ── */}
      {(mission.admin_info || mission.role_france || mission.role_etranger) && (
        <section id="role-competences" className="padding-y padding-x bg-surface">
          <h2 className="h2-style text-primary">Ce que vous ferez et ce que vous apprendrez</h2>

          {/* Paragraphes libres — texte propre à la mission */}
          {mission.admin_info && (
            <div className="flex flex-col gap-md mb-8">
              {mission.admin_info.split('\n\n').filter(p => p.trim()).map((p, i) => (
                <p key={i} className="text-body text-primary/80">{p.trim()}</p>
              ))}
            </div>
          )}

          {/* Rôle — 2 blocs côte à côte, avec icône */}
          {(mission.role_france || mission.role_etranger) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-10">
              {mission.role_france && (
                <div className="bg-surface-mid rounded-xl p-6 flex flex-col gap-md">
                  <div className="flex items-center gap-sm">
                    <IconFrance className="text-accent-2 text-2xl shrink-0" />
                    <div>
                      <h3 className="h3-style text-primary mb-0">En France</h3>
                      <p className="text-caption text-primary/50">À Nice ou Annemasse — 3 mois minimum</p>
                    </div>
                  </div>
                  <LignesToPuces texte={mission.role_france} />
                </div>
              )}
              {mission.role_etranger && (
                <div className="bg-surface-mid rounded-xl p-6 flex flex-col gap-md">
                  <div className="flex items-center gap-sm">
                    <IconAbroad className="text-accent-2 text-2xl shrink-0" />
                    <div>
                      <h3 className="h3-style text-primary mb-0">À l'étranger</h3>
                      <p className="text-caption text-primary/50">{mission.country} — 3 mois minimum</p>
                    </div>
                  </div>
                  <LignesToPuces texte={mission.role_etranger} />
                </div>
              )}
            </div>
          )}

          {/* Compétences — bloc plein, même couleur que l'AnchorNav */}
          {mission.competences && (
            <div className="bg-primary rounded-xl p-6 flex flex-col gap-md">
              <h3 className="h3-style text-surface mb-0">Compétences développées</h3>
              <div className="flex flex-wrap gap-sm">
                {mission.competences.split('\n').filter(c => c.trim()).map((c, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-xs text-body text-primary bg-surface px-4 py-2 rounded-full"
                  >
                    <IconCheck style={{ color: '#2F8A3A' }} className="text-sm shrink-0" />
                    {c.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Lieux partenaires ── */}
      {mission.locations?.length > 0 && (
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
            items={mission.locations}
            showPagination={true}
            color="primary"
            renderSlide={(loc) => <LocationCard {...loc} fromMissionSlug={mission.slug} />}
          />
        </section>
      )}

      {/* ── Procédure — 7 étapes fixes avec icônes ── */}
      <section id="procedure" className="padding-y padding-x bg-surface">
        <h2 className="h2-style text-primary">Comment candidater ?</h2>
        <p className="text-body text-primary/60 mb-8">
          Voici le déroulement habituel, depuis la candidature jusqu'au départ en mission.
        </p>

        {/* Mobile — scroll horizontal */}
        <div className="relative lg:hidden">
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
          <div className="flex flex-row items-start gap-xs overflow-x-auto pb-3">
            {PROCEDURE_STEPS.map((step, i) => {
              const Icon = PROCEDURE_ICONS[i]
              return (
                <div key={i} className="flex items-start gap-xs shrink-0 min-w-[140px]">
                  <div className="flex flex-col items-center gap-sm flex-1">
                    <div className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center shrink-0">
                      <Icon className="text-primary/80 text-xl" />
                    </div>
                    <p className="text-eyebrow text-primary/80 text-center">{String(i + 1).padStart(2, '0')}</p>
                    <p className="text-caption text-primary/60 text-center leading-tight">{step}</p>
                  </div>
                  {i < PROCEDURE_STEPS.length - 1 && (
                    <span className="text-primary/40 text-lg mt-4 shrink-0">→</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop — flex centré */}
        <div className="hidden lg:flex flex-row items-center gap-xs">
          {PROCEDURE_STEPS.map((step, i) => {
            const Icon = PROCEDURE_ICONS[i]
            return (
              <div key={i} className="flex items-start gap-xs flex-1">
                <div className="flex flex-col items-center gap-sm flex-1">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center shrink-0">
                    <Icon className="text-primary/80 text-xl" />
                  </div>
                  <p className="text-eyebrow text-primary/80 text-center">{String(i + 1).padStart(2, '0')}</p>
                  <p className="text-caption text-primary/60 text-center leading-tight">{step}</p>
                </div>
                {i < PROCEDURE_STEPS.length - 1 && (
                  <span className="text-primary/40 text-lg mt-4 shrink-0">→</span>
                )}
              </div>
            )
          })}
        </div>
        {/* CTA — Candidater + Nous contacter + En savoir plus */}
        <div className="flex flex-col sm:flex-row gap-md mt-8">
          {mission.candidater_url && (
            <a href={mission.candidater_url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button label="Candidater →" variant="primary" fullWidth />
            </a>
          )}
          <a href="mailto:contact@sensolidaires.org" className="flex-1">
            <Button label="Nous contacter →" variant="secondary" fullWidth />
          </a>
          {mission.info_service_civique_url && (
            <a href={mission.info_service_civique_url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button label="Comprendre le Service Civique →" variant="secondary" fullWidth />
            </a>
          )}
        </div>
      </section>

      {/* ── Impact terrain — masquée si aucune action ── */}
      {actions.length > 0 && (
        <section id="impact" className="padding-y padding-x bg-surface-mid">
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
                country={action.countries?.map(c => c.country).join(', ')}
              />
            )}
          />
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
          items={mission.media?.filter(m => m.file_type === 'image') || []}
          showPagination={true}
          color="primary"
          renderSlide={(item) => (
            <img
              src={item.file_url}
              alt={item.label || ''}
              className="w-full h-56 object-cover rounded-xl"
            />
          )}
        />
      </section>

      <ScrollToTop />
    </div>
  )
}

export default ServiceCiviqueDetail