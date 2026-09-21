// Missions.jsx
// Page liste des missions — Hero + 4 sections par type de mission

// ── React
import { useState, useEffect, useRef } from 'react'

// ── Router
import { Link, useSearchParams } from 'react-router-dom'

// ── API ──
import { fetchMissions, fetchTestimonials, fetchFieldActions, fetchServiceCiviqueGallery } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import FilterChips from '../components/navigation/FilterChips'
import ScrollToTop from '../components/ui/ScrollToTop'
import Modal from '../components/ui/Modal'

// ── Composants métier ──
import ImpactCard from '../components/actions/ImpactCard'
import MissionCard from '../components/missions/MissionCard'
import MissionSection from '../components/missions/MissionSection'
import SubsectionEyebrow from '../components/missions/SubsectionEyebrow'
import TestimonialCard from '../components/testimonials/TestimonialCard'

// ── Utils
import { getDuration, TYPE_LABELS } from '../utils/missions'
import { FILTERS_MISSION_TYPE } from '../utils/filters'
import {
  IconPerson, IconClock, IconPin, IconMoney,
  IconFrance, IconAbroad, IconGrow, IconBuilding,
  IconHand, IconPeople, IconHeart, IconLeaf, IconPayment, IconGallery
} from '../utils/icons'

function Missions() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [testimonials, setTestimonials] = useState([])
  const [actions, setActions] = useState([])
  const [selectedCountryCard, setSelectedCountryCard] = useState(null)
  const [serviceCiviqueGallery, setServiceCiviqueGallery] = useState([])
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || null)
  const filtersRef = useRef(null)

  // Listes de pays fixes par section — pas de lien BDD direct type↔pays
  const COUNTRIES_SERVICE_CIVIQUE = ['Kenya', 'Sénégal', 'Côte D\'Ivoire']
  const COUNTRIES_GROUPE_JEUNES   = ['Kenya', 'Sénégal']
  const COUNTRIES_CONGE_SOLIDAIRE = ['Kenya', 'Sénégal']

  const handleFilter = (value) => {
    setActiveFilter(value)
    setTimeout(() => {
      const el = filtersRef.current
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 50)
  }

  useEffect(() => {
    const loadMissions = async () => {
      try {
        const data = await fetchMissions()
        setMissions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadMissions()
  }, [])

  useEffect(() => {
    fetchTestimonials().then(setTestimonials).catch(console.error)
  }, [])

  useEffect(() => {
    fetchFieldActions().then(setActions).catch(console.error)
  }, [])

  useEffect(() => {
    if (activeFilter) {
      setTimeout(() => filtersRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  useEffect(() => {
    fetchServiceCiviqueGallery().then(setServiceCiviqueGallery).catch(console.error)
  }, [])

  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error) return <p className="text-body text-accent p-12">Erreur : {error}</p>

  const missionVolontariat    = missions.filter(m => m.type === 'volontariat_individuel')
  const missionServiceCivique = missions.filter(m => m.type === 'service_civique')

  const stepsServiceCivique = [
    {
      icon: IconFrance,
      title: 'Une première partie en France',
      description: 'À Nice ou Annemasse, vous animez des actions de sensibilisation au développement durable et découvrez le fonctionnement de l\'association avant votre mission à l\'international.',
    },
    {
      icon: IconAbroad,
      title: 'Puis une immersion à l\'étranger',
      description: 'Vous rejoignez l\'une de nos délégations au Kenya, au Sénégal ou en Côte d\'Ivoire pour participer à des projets concrets de préservation de la biodiversité et d\'éducation.',
    },
    {
      icon: IconGrow,
      title: 'Développer de nouvelles compétences',
      description: 'Cette expérience vous permet de gagner en autonomie, de travailler en équipe et de développer des compétences valorisées dans votre parcours personnel et professionnel.',
    },
  ]

  const stepsGroupeJeunes = [
    {
      icon: IconFrance,
      title: 'Construire un projet collectif',
      description: 'Nous accompagnons les jeunes et leurs encadrants dans la préparation pédagogique, logistique et administrative de la mission, en lien avec nos partenaires locaux.',
    },
    {
      icon: IconAbroad,
      title: 'Vivre une immersion de 10 jours',
      description: 'Au Kenya ou au Sénégal, les jeunes participent à des actions concrètes avec nos partenaires locaux, rencontrent les communautés et découvrent le territoire et sa culture.',
    },
    {
      icon: IconGrow,
      title: 'Partager et poursuivre l\'engagement',
      description: 'Au retour, les participants partagent leur expérience au sein de leur établissement et auprès de leur entourage afin de valoriser le projet et de sensibiliser à leur tour.',
    },
  ]

  const stepsCongeSolidaire = [
    {
      icon: IconBuilding,
      title: 'Construire votre mission',
      description: 'Nous construisons avec l’entreprise une mission adaptée aux profils et aux compétences des participants, en lien avec les besoins identifiés par nos partenaires locaux.',
    },
    {
      icon: IconLeaf,
      title: 'S’engager sur le terrain',
      description: 'Les participants rejoignent nos partenaires au Kenya ou au Sénégal et prennent part à leurs projets aux côtés des équipes et des communautés locales.',
    },
    {
      icon: IconHand,
      title: 'Partager et valoriser l’expérience',
      description: 'Au retour, l’expérience vécue peut être partagée avec les équipes et valorisée au sein de l’entreprise dans le cadre de sa démarche RSE.',
    },
  ]

  // Témoignages filtrés par type de mission — utilisés pour masquer les galeries si vides
  const testimonialsGroupeJeunes = testimonials.filter(t => t.mission?.type === 'groupe_jeunes')
  const testimonialsCongeSolidaire = testimonials.filter(t => t.mission?.type === 'conge_solidaire')
  const testimonialsServiceCivique = testimonials.filter(t => t.mission?.type === 'service_civique')

  const actionsServiceCivique  = actions.filter(a => a.countries?.some(c => COUNTRIES_SERVICE_CIVIQUE.includes(c.country)))
  const actionsGroupeJeunes    = actions.filter(a => a.countries?.some(c => COUNTRIES_GROUPE_JEUNES.includes(c.country)))
  const actionsCongeSolidaire  = actions.filter(a => a.countries?.some(c => COUNTRIES_CONGE_SOLIDAIRE.includes(c.country)))

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/design/hero/hero-missions.jpg"
        title="Partez en mission et agissez concrètement"
        subtitle="Parce que l'engagement est ouvert à tous, nos missions s'adaptent à chaque profil : seul, à deux, en groupe, en famille ou avec votre entreprise, vivez une expérience humaine et solidaire au service de projets utiles et durables."
      />

      {/* ── Bloc orientation — quelle mission est faite pour vous ? ── */}
      <section className="padding-y padding-x bg-surface-mid">
        <h2 className="h2-style text-primary">Quelle mission est faite pour vous ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-sm">
          {[
            { icon: IconPerson,   situation: 'Vous souhaitez partir seul, à deux ou en petit groupe pour participer concrètement à un projet solidaire ?', label: 'Volontariat individuel', filter: 'individuel' },
            { icon: IconClock,    situation: 'Vous avez entre 16 et 25 ans et recherchez une expérience citoyenne riche de sens ?', label: 'Service Civique', filter: 'service_civique' },
            { icon: IconPeople,   situation: 'Vous représentez un lycée ou une structure jeunesse et souhaitez organiser un projet collectif ?', label: 'Mission de groupe', filter: 'groupe_jeunes' },
            { icon: IconBuilding, situation: 'Vous êtes salarié et souhaitez donner du sens à vos congés en vous engageant dans un projet solidaire ?', label: 'Congé solidaire', filter: 'conge_solidaire' },
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.filter}
                onClick={() => handleFilter(item.filter)}
                className="flex flex-col gap-sm bg-surface rounded-2xl p-6 text-left hover:shadow-md transition-shadow group"
              >
                <Icon className="text-accent-2 text-2xl" />
                <p className="text-body text-primary/60 flex-1">{item.situation}</p>
                <p className="h3-style text-primary mb-0 group-hover:text-accent transition-colors">{item.label} →</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Barre de filtres ── */}
      <div ref={filtersRef} className="py-4 px-4 lg:px-24 bg-primary flex justify-center lg:justify-start">
        <FilterChips filters={FILTERS_MISSION_TYPE} active={activeFilter} onChange={handleFilter} variant="dark" />
      </div>
      

      {/* ── Section Volontariat individuel ── */}
      {(activeFilter === null || activeFilter === 'individuel') && (
        <MissionSection
          id="individuel"
          bg="bg-surface"
          title="Je pars en mission individuelle"
          audience="Pour les volontaires individuels"
          description="Vivez une expérience utile, authentique et accessible à tous."
          decorImage="/images/design/ui/one-line-1.png"
          image="/images/placeholders/placeholder-photo.webp"
          imageAlt="Volontariat individuel"
          carouselTitle="Où partir ?"
          carouselSubtitle="Découvrez les missions à l'international proposées selon les destinations."
          introSlot={
            <>
              <p className="text-body text-primary/80">
                Partir en mission avec Sens Solidaires, c'est soutenir des projets menés toute l'année avec nos partenaires locaux au Kenya, au Sénégal, au Pérou, au Sri Lanka et à Sumatra.
              </p>
              <p className="text-body text-primary/80">
                Pendant 10 jours à 4 semaines, vous découvrez une autre culture tout en participant à des actions concrètes au service des communautés locales. <strong className="text-primary/70">Aucune compétence particulière n'est demandée</strong> : votre motivation et votre envie de vous engager sont l'essentiel.
              </p>
              <p className="text-body text-primary/80">
                Chaque mission est aussi une expérience humaine unique, riche en rencontres, en échanges et en découvertes.
              </p>
              <p className="text-mention text-primary/60">
                Les frais engagés pour votre mission peuvent ouvrir droit à une réduction d'impôt de 66 % (selon la législation en vigueur). Un reçu fiscal est délivré à l'issue de votre mission.
              </p>
            </>
          }
          infoBarItems={[
            { icon: IconPerson,  label: 'Seul, à deux ou en petit groupe' },
            { icon: IconClock,   label: '10 jours à 4 semaines' },
            { icon: IconPayment, label: 'à partir de 1175€' },
            { icon: IconMoney,   label: 'Réduction d\'impôt 66 %' },
          ]}
          secondaryAction={{ label: "Voir les témoignages →", href: "/temoignages?type=individuel" }}
          carouselItems={missionVolontariat}
          carouselSlidesPerView={3}
          renderSlide={(mission) => (
            <MissionCard
              slug={mission.slug}
              title={mission.title}
              description={mission.short_description}
              image={mission.photo_hero_url}
              badge={TYPE_LABELS[mission.type]}
              duration={getDuration(mission.pricing)}
              ctaLabel="En savoir plus →"
            />
          )}
        />
      )}

      {/* ── Section Service Civique ── */}
      {(activeFilter === null || activeFilter === 'service_civique') && (
        <MissionSection
          id="service-civique"
          bg="bg-surface-mid"
          title="Je m'engage en Service Civique à l'international"
          audience="Pour les 16 à 25 ans"
          description="Vivez une expérience de plusieurs mois en France et à l'international tout en développant vos compétences et votre engagement."
          decorImage="/images/design/ui/one-line-2.png"
          image="/images/placeholders/placeholder-photo.webp"
          imageAlt="Service civique"
          introSlot={
            <>
              <p className="text-body text-primary/80">
                Vous avez entre 16 et 25 ans (jusqu'à 30 ans en situation de handicap) et souhaitez vous engager dans une mission utile, enrichissante et porteuse de sens ? Le Service Civique vous permet de consacrer 6 à 12 mois à une mission d'intérêt général tout en bénéficiant d'une indemnité mensuelle.
              </p>
              <p className="text-body text-primary/80">
                Avec Sens Solidaires, vous participez à des projets d'éducation au développement durable, de solidarité internationale et de préservation de l'environnement. Selon la mission, votre engagement se déroule en France, puis à l'international (Kenya, Sénégal ou Côte d'Ivoire) aux côtés de nos partenaires locaux.
              </p>
              <p className="text-body text-primary/80">
                Au-delà des actions menées sur le terrain, cette expérience vous permet de développer de nouvelles compétences, de gagner en autonomie, de vivre une immersion culturelle et de contribuer concrètement à des projets porteurs de sens.
              </p>
            </>
          }
          infoBarItems={[
            { icon: IconPerson, label: '16-25 ans' },
            { icon: IconClock,  label: '6 à 12 mois' },
            { icon: IconPin,    label: 'France & étranger' },
            { icon: IconMoney,  label: 'Indemnité mensuelle' },
          ]}
          primaryAction={{ label: 'Candidater →', href: 'https://www.service-civique.gouv.fr/', external: true }}
          secondaryAction={{
            label: "Plus d'informations →",
            href: "https://www.service-civique.gouv.fr/comprendre-le-service-civique",
            external: true,
          }}
          stepsTitle="Comment ça fonctionne ?"
          steps={stepsServiceCivique}
          bgCard="bg-white"
        >

          {/* Destinations — une card par pays réellement créé côté dashboard */}
          {missionServiceCivique.length > 0 && (
            <div className="mt-12">
              <SubsectionEyebrow label="Où partir en mission ?" />
              <p className="text-body text-primary/60 mb-8">
                Découvrez les missions à l'international proposées selon les destinations.
              </p>
              <Carousel
                items={missionServiceCivique}
                showPagination={true}
                color="primary"
                renderSlide={(mission) => (
                  <MissionCard
                    image={mission.photo_hero_url}
                    badge="Service civique"
                    title={mission.title}
                    description={mission.short_description}
                    ctaLabel="En savoir plus →"
                    onClick={() => setSelectedCountryCard(mission)}
                  />
                )}
              />
            </div>
          )}

          {/* Témoignages — masqué si aucun témoignage approuvé pour ce type */}
          {testimonialsServiceCivique.length > 0 && (
            <div className="mt-12 bg-primary rounded-2xl p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-sm mb-8">
                <div>
                  <h3 className="h3-style text-surface mb-0">Ils ont vécu l'aventure</h3>
                  <p className="text-body text-surface/60">
                    Découvrez les retours de nos volontaires en service civique.
                  </p>
                </div>
                <Link to="/temoignages?type=service_civique">
                  <Button label="Voir tous les témoignages →" variant="primary" />
                </Link>
              </div>
              <Carousel
                items={testimonialsServiceCivique.slice(0, 10)}
                showPagination={true}
                color="surface"
                renderSlide={(t) => (
                  <TestimonialCard
                    quote={t.content}
                    name={t.author_name}
                    mission={t.mission?.title || ''}
                    avatar={t.avatar_url || undefined}
                  />
                )}
              />
            </div>
          )}

          {/* Actions terrain — masqué si aucune action dans ces pays */}
          {actionsServiceCivique.length > 0 && (
            <div className="mt-12">
              <SubsectionEyebrow label="Notre impact sur le terrain" />
              <p className="text-body text-primary/60 mb-8">
                Découvrez quelques-unes des actions menées avec nos partenaires locaux.
              </p>
              <Carousel
                items={actionsServiceCivique.slice(0, 6)}
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
            </div>
          )}

          {/* Galerie photos — combinée de tous les pays Service Civique */}
          {serviceCiviqueGallery.length > 0 && (
            <div className="mt-12">
              <SubsectionEyebrow label="Des images au cœur de l’action" />
              <p className="text-body text-primary/60 mb-8">
                Un aperçu des moments vécus lors de nos missions.
              </p>
              <Carousel
                items={serviceCiviqueGallery}
                showPagination={true}
                color="primary"
                renderSlide={(item) => (
                  <img src={item.file_url} alt={item.label || ''} className="w-full h-56 object-cover rounded-xl" />
                )}
              />
            </div>
          )}

          {selectedCountryCard && (
            <Modal
              isOpen={true}
              onClose={() => setSelectedCountryCard(null)}
              title={selectedCountryCard.title}
            >
              <div className="flex flex-col lg:flex-row gap-md">
                <img
                  src={selectedCountryCard.photo_hero_url}
                  alt={selectedCountryCard.photo_hero_alt || selectedCountryCard.title}
                  className="w-full lg:w-[280px] h-64 object-cover rounded-xl shrink-0"
                />
                <p className="text-body text-primary/80 whitespace-pre-line lg:w-2/3">
                  {selectedCountryCard.description?.replace('---', '').trim()}
                </p>
              </div>
            </Modal>
          )}
        </MissionSection>
      )}

      {/* ── Section Groupe jeunes ── */}
      {(activeFilter === null || activeFilter === 'groupe_jeunes') && (
        <MissionSection
          id="groupe-jeunes"
          bg="bg-surface"
          title="Je pars avec mon groupe"
          audience="Pour les lycées, MJC et structures de jeunesse"
          description="Organisez une mission solidaire au Kenya ou au Sénégal et faites vivre à votre groupe une expérience éducative et interculturelle unique."
          decorImage="/images/design/ui/one-line-3.png"
          image="/images/placeholders/placeholder-photo.webp"
          imageAlt="Mission groupe jeunes"
          introSlot={
            <p className="text-body text-primary/80">
              Nous accompagnons les établissements scolaires, les MJC, les centres sociaux et les structures jeunesse dans l'organisation de missions solidaires au Kenya ou au Sénégal. Pendant 10 jours, les jeunes découvrent une autre culture, participent à des actions concrètes sur le terrain et développent leur ouverture au monde.
            </p>
          }
          infoBarItems={[
            { icon: IconPeople, label: 'Groupe encadré' },
            { icon: IconClock,  label: '10 jours' },
            { icon: IconPin,    label: 'Kenya ou Sénégal' },
            { icon: IconHeart,  label: 'Projet éducatif' },
          ]}
          secondaryAction={{ label: "Voir les témoignages →", href: "/temoignages?type=groupe_jeunes" }}
          stepsTitle="Une mission en trois temps"
          steps={stepsGroupeJeunes}
          bgCard="bg-surface-mid"
        >
          {/* PDFs téléchargeables */}
          <div className="mt-12">
            <h3 className="h3-style text-primary mb-0">Tout ce qu'il faut savoir avant de s'engager</h3>
            <p className="text-body text-primary/60 mb-8">
              Retrouvez les dossiers de présentation détaillés pour découvrir les objectifs pédagogiques, le déroulement des missions, les conditions de participation et les informations pratiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-md">
              {[
                { title: "Mission groupe — Kenya",   size: "1,2 Mo" },
                { title: "Mission groupe — Sénégal", size: "1,2 Mo" },
              ].map(pdf => (
                <div key={pdf.title} className="flex items-center justify-between bg-surface-mid rounded-xl px-6 py-4 flex-1">
                  <div className="flex items-center gap-sm">
                    <span className="text-eyebrow text-primary/40">PDF</span>
                    <div>
                      <p className="text-body text-primary">{pdf.title}</p>
                      <p className="text-caption text-primary/40">{pdf.size}</p>
                    </div>
                  </div>
                  <button className="link-nav text-primary/60 hover:text-primary">↓</button>
                </div>
              ))}
            </div>
          </div>

          {/* Témoignages — masqué si aucun témoignage approuvé pour ce type de mission */}
          {testimonialsGroupeJeunes.length > 0 && (
            <div className="mt-12 bg-primary rounded-2xl p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-sm mb-8">
                <div>
                  <h3 className="h3-style text-surface mb-0">Ils ont vécu l'aventure</h3>
                  <p className="text-body text-surface/60">
                    Rencontres, découvertes, projets de terrain, moments de partage... découvrez quelques souvenirs de nos missions de groupe au Kenya et au Sénégal.
                  </p>
                </div>
                <Link to="/temoignages?type=groupe_jeunes">
                  <Button label="Voir tous les témoignages →" variant="primary" />
                </Link>
              </div>
              <Carousel
                items={testimonialsGroupeJeunes.slice(0, 10)}
                showPagination={true}
                color="surface"
                renderSlide={(t) => (
                  <TestimonialCard
                    quote={t.content}
                    name={t.author_name}
                    mission={t.mission?.title || ''}
                    avatar={t.avatar_url || undefined}
                  />
                )}
              />
            </div>
          )}

          {/* Actions terrain — masqué si aucune action dans ces pays */}
          {actionsGroupeJeunes.length > 0 && (
            <div className="mt-12">
              <SubsectionEyebrow label="Notre impact sur le terrain" />
              <p className="text-body text-primary/60 mb-8">
                Découvrez quelques-unes des actions menées avec nos partenaires locaux.
              </p>
              <Carousel
                items={actionsGroupeJeunes.slice(0, 6)}
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
            </div>
          )}

          {/* Galerie photos — toujours visible, emplacement réservé */}
          <div className="mt-12">
            <SubsectionEyebrow label="Des images au cœur de l’action" />
            <p className="text-body text-primary/60 mb-8">
              Un aperçu des moments vécus lors de nos missions.
            </p>
            <Carousel
              items={[1, 2, 3, 4]}
              showPagination={true}
              color="primary"
              renderSlide={(_, i) => (
                <img src={`/images/placeholders/placeholder-galerie-${i + 1}.webp`} alt="" aria-hidden="true" className="w-full h-56 object-cover rounded-xl" />
              )}
            />
          </div>

        </MissionSection>
      )}

      {/* ── Section Congé solidaire ── */}
      {(activeFilter === null || activeFilter === 'conge_solidaire') && (
        <MissionSection
          id="conge-solidaire"
          bg="bg-surface-mid"
          title="J'agis avec mon entreprise"
          audience="Pour les salariés et les entreprises"
          description="Une expérience humaine forte pour les salariés et un engagement concret pour les entreprises."
          decorImage="/images/design/ui/one-line-4.png"
          image="/images/placeholders/placeholder-photo.webp"
          imageAlt="Congé solidaire"
          introSlot={
            <>
              <p className="text-body text-primary/80">
                Le congé solidaire permet aux salariés de consacrer une partie de leurs congés à une mission de solidarité internationale. Avec Sens Solidaires, ils rejoignent des projets menés avec nos partenaires locaux et mettent leur temps, leur énergie et leurs compétences au service d'actions concrètes sur le terrain. C'est aussi l'occasion de découvrir un nouvel environnement, de partager des savoir-faire et de vivre une expérience humaine et interculturelle forte.
              </p>

              <p className="text-body text-primary/80">
                Pour l'entreprise, le congé solidaire permet de soutenir des projets utiles tout en donnant aux collaborateurs la possibilité de s'engager concrètement. Il s'inscrit dans une démarche RSE et contribue à développer l'engagement des équipes, à valoriser leurs compétences et à donner une dimension collective aux actions de solidarité portées par l'entreprise.
              </p>
            </>
          }
          infoBarItems={[
            { icon: IconBuilding, label: 'Salariés & entreprises' },
            { icon: IconClock,    label: '10 jours à 4 semaines' },
            { icon: IconPin,      label: 'Kenya ou Sénégal' },
            { icon: IconMoney,    label: 'Réduction d\'impôt 60 %' },
          ]}
          primaryAction={{ label: 'En savoir plus →', href: 'https://france-volontaires.org/le-conge-de-solidarite-internationale/', external: true }}
          secondaryAction={{ label: "Voir les témoignages →", href: "/temoignages?type=conge_solidaire" }}
          stepsTitle="Comment ça fonctionne ?"
          steps={stepsCongeSolidaire}
          bgCard="bg-surface"
        >
          {/* Témoignages — masqué si aucun témoignage approuvé pour ce type de mission */}
          {testimonialsCongeSolidaire.length > 0 && (
            <div className="mt-12 bg-primary rounded-2xl p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-sm mb-8">
                <div>
                  <h3 className="h3-style text-surface mb-0">Des collaborateurs engagés sur le terrain</h3>
                  <p className="text-body text-surface/60">
                    Découvrez quelques moments vécus lors de nos missions solidaires réalisées avec des entreprises partenaires au Kenya et au Sénégal.
                  </p>
                </div>
                <Link to="/temoignages?type=conge_solidaire">
                  <Button label="Voir tous les témoignages →" variant="primary" />
                </Link>
              </div>
              <Carousel
                items={testimonialsCongeSolidaire.slice(0, 10)}
                showPagination={true}
                color="surface"
                renderSlide={(t) => (
                  <TestimonialCard
                    quote={t.content}
                    name={t.author_name}
                    mission={t.mission?.title || ''}
                    avatar={t.avatar_url || undefined}
                  />
                )}
              />
            </div>
          )}

          {/* Actions terrain — masqué si aucune action dans ces pays */}
          {actionsCongeSolidaire.length > 0 && (
            <div className="mt-12">
              <SubsectionEyebrow label="Notre impact sur le terrain" />
              <p className="text-body text-primary/60 mb-8">
                Découvrez quelques-unes des actions menées avec nos partenaires locaux.
              </p>
              <Carousel
                items={actionsCongeSolidaire.slice(0, 6)}
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
            </div>
          )}

          {/* Galerie photos — toujours visible, emplacement réservé */}
          <div className="mt-12">
            <SubsectionEyebrow label="Des images au cœur de l’action" />
            <p className="text-body text-primary/60 mb-8">
              Un aperçu des moments vécus lors de nos missions.
            </p>
            <Carousel
              items={[1, 2, 3, 4]}
              showPagination={true}
              color="primary"
              renderSlide={(_, i) => (
                <img src={`/images/placeholders/placeholder-galerie-${i + 1}.webp`} alt="" aria-hidden="true" className="w-full h-56 object-cover rounded-xl" />
              )}
            />
          </div>

        </MissionSection>
      )}

      <ScrollToTop />
    </div>
  )
}

export default Missions