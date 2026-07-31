// Missions.jsx
// Page liste des missions — Hero + 4 sections par type de mission

// ── React
import { useState, useEffect, useRef } from 'react'

// ── Router
import { Link, useSearchParams } from 'react-router-dom'

// ── API ──
import { fetchMissions, fetchTestimonials, fetchFieldActions } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import FilterChips from '../components/navigation/FilterChips'
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants métier ──
import ImpactCard from '../components/actions/ImpactCard'
import MissionCard from '../components/missions/MissionCard'
import MissionSection from '../components/missions/MissionSection'
import TestimonialCard from '../components/testimonials/TestimonialCard'

// ── Utils
import { getDuration, TYPE_LABELS } from '../utils/missions'
import { FILTERS_MISSION_TYPE } from '../utils/filters'
import {
  IconPerson, IconClock, IconPin, IconMoney,
  IconFrance, IconAbroad, IconGrow, IconBuilding,
  IconHand, IconPeople, IconHeart, IconLeaf, IconPayment
} from '../utils/icons'

function Missions() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [testimonials, setTestimonials] = useState([])
  const [actions, setActions] = useState([])
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || null)
  const filtersRef = useRef(null)

  // Listes de pays fixes par section — pas de lien BDD direct type↔pays
  const COUNTRIES_SERVICE_CIVIQUE = ['Kenya', 'Sénégal']
  const COUNTRIES_GROUPE_JEUNES   = ['Kenya', 'Sénégal']
  const COUNTRIES_CONGE_SOLIDAIRE = ['Kenya', 'Sénégal']

  const LIEUX_MISSION_SERVICE_CIVIQUE = [
  {
    pays: 'Au Kenya',
    bullets: [
      "Auprès de notre partenaire local l'école polytechnique de Taita Taveta, vous participerez à la vie quotidienne du campus, notamment auprès des étudiants en tourisme et les appuierez dans leur apprentissage du français.",
      "Vous suivrez et développerez les projets de l'association sur place avec différents partenaires engagés pour la préservation de l'environnement, notamment autour d'un projet de potager agroécologique avec le club biodiversité des étudiants.",
      "Au sanctuaire de LUMO, au cœur du Parc Tsavo, vous suivrez l'avancée du projet de sentier botanique.",
      "Vous accueillerez également les volontaires français en mission courte et apporterez les correspondances scolaires de France aux jeunes Kényans et les aiderez à écrire leur réponse.",
      "Cette mission vous permettra de mettre en pratique votre anglais !",
    ],
    liens: [
      { label: 'le TTNP', slug: 'ttnp-kenya' },
      { label: 'LUMO', slug: 'lumo-kenya' },
    ],
  },
  {
    pays: 'Au Sénégal',
    bullets: [
      "Auprès de l'association sénégalaise AGADA, dans la région de la Casamance, vous suivrez et participerez à leurs activités sur le terrain, notamment les actions de reboisement de la mangrove et d'agriculture durable.",
      "Vous apporterez les correspondances françaises aux élèves sénégalais et les aiderez à répondre.",
      "Vous réaliserez le suivi d'après-projet de la construction d'un puits et de l'utilisation de kits de filtration de l'eau, et ferez un diagnostic des besoins des communautés locales.",
      "Vous accueillerez les groupes de volontaires de l'association.",
    ],
    liens: [
      { label: 'AGADA', slug: 'agada-senegal' },
    ],
  },
  {
    pays: "En Côte d'Ivoire",
    bullets: [
      "À Abidjan, capitale du pays, vous soutiendrez les actions de l'institut Georges Aristide et de l'association Zéro Plastique AZEP.",
      "Vous appuierez la distribution de la correspondance scolaire Nice-Abidjan et la rédaction des réponses.",
      "Vous proposerez des ateliers de sensibilisation au développement durable pour les élèves des écoles partenaires.",
      "Vous réaliserez un état des lieux des activités du partenaire ivoirien et de l'accueil des volontaires pour de futurs projets : nettoyage du littoral, reboisement de la mangrove, diagnostic de la production de l'attiéké par les ateliers de femmes, traitement des déchets plastiques.",
      "Vous serez un membre actif d'AZEP et mobiliserez la communauté des jeunes pour lutter contre la pollution plastique et la pollution de la lagune Ébrié.",
    ],
    liens: [], // pas de Location en base — en attente de confirmation cliente (C2/C3)
  },
]

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

  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error) return <p className="text-body text-accent p-12">Erreur : {error}</p>

  const missionVolontariat    = missions.filter(m => m.type === 'volontariat_individuel')
  const missionServiceCivique = missions.filter(m => m.type === 'service_civique')

  const stepsServiceCivique = [
    {
      icon: IconFrance,
      title: 'Mission en France',
      description: 'Pendant plusieurs mois, sur Nice ou Annemasse, vous animez des actions de sensibilisation au développement durable et découvrez le fonctionnement de l\'association avant votre mission à l\'international',
      list: ['Animation d\'ateliers pédagogiques', 'Promotion des projets de l\'association', 'Préparation au départ'],
    },
    {
      icon: IconAbroad,
      title: 'Mission à l\'étranger',
      description: 'Vous rejoignez l\'une de nos délégations au Kenya, au Sénégal ou en Côte d\'Ivoire pour participer à des projets concrets de préservation de la biodiversité et d\'éducation.',
      list: ['Protection de l\'environnement', 'Actions éducatives', 'Vie avec les partenaires locaux'],
    },
    {
      icon: IconGrow,
      title: 'Une expérience unique',
      description: 'Cette expérience vous permet de gagner en autonomie, de travailler en équipe et de développer des compétences valorisées dans votre parcours personnel et professionnel.',
      list: ['Gestion de projet', 'Coopération internationale', 'Travail en équipe'],
    },
  ]

  const stepsGroupeJeunes = [
    {
      icon: IconFrance,
      title: 'Construire un projet collectif',
      description: 'Nous accompagnons les jeunes et les encadrants afin de préparer la mission dans les meilleures conditions.',
      list: ['Réunion de préparation avec les encadrants', 'Échanges avec les partenaires locaux', 'Organisation logistique et administrative'],
    },
    {
      icon: IconAbroad,
      title: 'Une immersion de 10 jours au Kenya ou au Sénégal',
      description: 'Les jeunes participent à des actions concrètes tout en découvrant une nouvelle culture',
      list: ['Actions environnementales', 'Rencontres locales', 'Découverte du territoire'],
    },
    {
      icon: IconGrow,
      title: 'Partager et poursuivre l\'engagement',
      description: 'Au retour, les participants valorisent leur expérience auprès de leur établissement et de leur entourage.',
      list: ['Restitution auprès de l\'établissement', 'Rédaction du rapport de mission', 'Sensibilisation des pairs'],
    },
  ]

  const stepsCongeSolidaire = [
    {
      icon: IconBuilding,
      title: 'Construire un projet adapté',
      description: 'Nous définissons ensemble une mission correspondant aux compétences des participants et aux besoins du terrain.',
      list: ['Analyse des besoins', 'Choix du projet', 'Préparation logistique'],
    },
    {
      icon: IconLeaf,
      title: 'Agir au Kenya, au Sénégal ou à Sumatra',
      description: 'Vous rejoignez l\'une de nos délégations au Kenya, au Sénégal ou à Sumatra afin de mettre vos compétences au service de projets portés par nos partenaires locaux.',
      list: ['Immersion locale', 'Partage de compétences', 'Accompagnement par l\'association'],
    },
    {
      icon: IconHand,
      title: 'Valoriser l\'engagement',
      description: 'Nous accompagnons l\'entreprise dans la valorisation de son engagement et de son impact.',
      list: ['Rapport de mission', 'Communication RSE', 'Avantage fiscal'],
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
        image="/images/hero/hero-missions.jpg"
        title="Partez en mission et agissez concrètement"
        subtitle="Parce que l'engagement est ouvert à tous, nos missions s'adaptent à chaque profil : seul, à deux, en groupe, en famille ou avec votre entreprise, vivez une expérience humaine et solidaire au service de la biodiversité."
      />

      {/* ── Bloc orientation — quelle mission est faite pour vous ? ── */}
      <section className="padding-y padding-x bg-surface-mid">
        <h2 className="h2-style text-primary">Quelle mission est faite pour vous ?</h2>
        {/* gap-sm : entre les cards d'orientation */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-sm">
          {[
            { icon: IconPerson,   situation: 'Vous souhaitez partir seul, à deux ou en petit groupe pour participer concrètement à un projet solidaire ?', label: 'Volontariat individuel', filter: 'individuel' },
            { icon: IconClock,    situation: 'Vous avez entre 16 et 25 ans et recherchez une expérience citoyenne riche de sens ?', label: 'Service Civique', filter: 'service_civique' },
            { icon: IconPeople,   situation: 'Vous représentez un lycée ou une structure jeunesse et souhaitez organiser un projet collectif ?', label: 'Mission de groupe', filter: 'groupe_jeunes' },
            { icon: IconBuilding, situation: 'Vous êtes salarié et souhaitez donner du sens à vos congés en vous engageant dans un projet solidaire à impact positif ?', label: 'Congé solidaire', filter: 'conge_solidaire' },
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
          decorImage="/images/ui/one-line-1.png"
          image="/images/placeholders/placeholder-photo.png"
          imageAlt="Volontariat individuel"
          introSlot={
            <>
              <p className="text-body text-primary/80">
                Partir en mission avec Sens Solidaires, c'est soutenir des projets menés toute l'année avec nos partenaires locaux au Kenya, au Sénégal, au Pérou, au Sri Lanka et à Sumatra.
              </p>

              <p className="text-body text-primary/80">
                Pendant 10 jours à 4 semaines, vous découvrez une autre culture tout en participant à des actions concrètes au service des communautés locales. <strong className="text-primary/70">Aucune compétence particulière n'est demandée</strong> : votre motivation et votre envie de vous engager sont l'essentiel.
              </p>

              <p className="text-body text-primary/80">
                Chaque mission est aussi une expérience humaine unique, riche en rencontres, en partage de compétences et en découvertes culturelles et environnementales.
              </p>

              <p className="text-mention text-primary/60">
                Les frais engagés pour votre mission peuvent ouvrir droit à une réduction d'impôt de 66 % (selon la législation en vigueur). Un reçu fiscal est délivré à l'issue de votre mission.
              </p>
            </>
          }
          infoBarItems={[
            { icon: IconPerson,  label: 'Individuel ou groupe' },
            { icon: IconClock,   label: '10 jours à 4 semaines' },
            { icon: IconPayment, label: 'à partir de 1175€' },
            { icon: IconMoney,   label: 'Réduction d\'impôt 66 %' },
          ]}
          testimonialsUrl="/temoignages"
          carouselItems={missionVolontariat}
          carouselSlidesPerView={3}
          renderSlide={(mission) => (
            <MissionCard
              slug={mission.slug}
              title={mission.title}
              description={mission.short_description}
              image={mission.image_url}
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
          decorImage="/images/ui/one-line-2.png"
          image="/images/placeholders/placeholder-photo.png"
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
          testimonialsUrl="/temoignages?type=service_civique"
          stepsTitle="Comment ça fonctionne ?"
          steps={stepsServiceCivique}
          bgCard="bg-white"
        >

          {/* Témoignages — masqué si aucun témoignage approuvé pour ce type */}
          {testimonialsServiceCivique.length > 0 && (
            <div className="mt-12 bg-primary rounded-2xl p-6 lg:p-10">
              <h3 className="h3-style text-surface mb-0">Ils ont vécu l'aventure</h3>
              <p className="text-body text-surface/60 mb-8">
                Découvrez les retours de nos volontaires en service civique au Kenya, au Sénégal et en Côte d'Ivoire.
              </p>
              <Carousel
                items={testimonialsServiceCivique}
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
              <h3 className="h3-style text-primary mb-0">Notre impact sur le terrain</h3>
              <p className="text-body text-primary/60 mb-8">
                Découvrez quelques-unes des actions menées avec nos partenaires locaux.
              </p>
              <Carousel
                items={actionsServiceCivique.slice(0, 4)}
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
            <h3 className="h3-style text-primary mb-0">Quelques instants sur le terrain</h3>
            <p className="text-body text-primary/60 mb-8">
              Un aperçu des moments vécus lors de nos missions — la galerie sera enrichie au fil des prochains départs.
            </p>
            <Carousel
              items={[1, 2, 3, 4]}
              showPagination={true}
              color="primary"
              renderSlide={(_, i) => (
                <img src={`/images/placeholders/placeholder-galerie-${i + 1}.png`} alt="" aria-hidden="true" className="w-full h-56 object-cover rounded-xl" />
              )}
            />
          </div>
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
          decorImage="/images/ui/one-line-3.png"
          image="/images/placeholders/placeholder-photo.png"
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
          testimonialsUrl="/temoignages?type=groupe_jeune"
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
            {/* gap-md : entre les deux cards PDF */}
            <div className="flex flex-col sm:flex-row gap-md">
              {[
                { title: "Mission groupe — Kenya",   size: "1,2 Mo" },
                { title: "Mission groupe — Sénégal", size: "1,2 Mo" },
              ].map(pdf => (
                <div key={pdf.title} className="flex items-center justify-between bg-surface-mid rounded-xl px-6 py-4 flex-1">
                  {/* gap-sm : entre icône PDF et texte */}
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
              <h3 className="h3-style text-surface mb-0">Ils ont vécu l'aventure</h3>
              <p className="text-body text-surface/60 mb-8">
                Rencontres, découvertes, projets de terrain, moments de partage... découvrez quelques souvenirs de nos missions de groupe au Kenya et au Sénégal.
              </p>
              <Carousel
                items={testimonialsGroupeJeunes}
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
              <h3 className="h3-style text-primary mb-0">Notre impact sur le terrain</h3>
              <p className="text-body text-primary/60 mb-8">
                Découvrez quelques-unes des actions menées avec nos partenaires locaux.
              </p>
              <Carousel
                items={actionsGroupeJeunes.slice(0, 4)}
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
            <h3 className="h3-style text-primary mb-0">Quelques instants sur le terrain</h3>
            <p className="text-body text-primary/60 mb-8">
              Un aperçu des moments vécus lors de nos missions — la galerie sera enrichie au fil des prochains départs.
            </p>
            <Carousel
              items={[1, 2, 3, 4]}
              showPagination={true}
              color="primary"
              renderSlide={(_, i) => (
                <img src={`/images/placeholders/placeholder-galerie-${i + 1}.png`} alt="" aria-hidden="true" className="w-full h-56 object-cover rounded-xl" />
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
          decorImage="/images/ui/one-line-4.png"
          image="/images/placeholders/placeholder-photo.png"
          imageAlt="Congé solidaire"
          introSlot={
            <p className="text-body text-primary/80">
              Le congé solidaire permet à un salarié de s'engager temporairement auprès d'une association tout en conservant son statut professionnel. Pour les entreprises, c'est également une opportunité de renforcer leur démarche RSE, développer l'engagement des équipes et soutenir des actions à impact positif.
            </p>
          }
          infoBarItems={[
            { icon: IconBuilding, label: 'Salariés & entreprises' },
            { icon: IconClock,    label: '10 jours à 4 semaines' },
            { icon: IconPin,      label: 'Kenya ou Sénégal' },
            { icon: IconMoney,    label: 'Réduction d\'impôt 60 %' },
          ]}
          primaryAction={{ label: 'En savoir plus →', href: 'https://france-volontaires.org/le-conge-de-solidarite-internationale/', external: true }}
          testimonialsUrl="/temoignages?type=conge_solidaire"
          stepsTitle="Comment ça fonctionne ?"
          steps={stepsCongeSolidaire}
          bgCard="bg-surface"
        >
          {/* Témoignages — masqué si aucun témoignage approuvé pour ce type de mission */}
          {testimonialsCongeSolidaire.length > 0 && (
            <div className="mt-12 bg-primary rounded-2xl p-6 lg:p-10">
              <h3 className="h3-style text-surface mb-0">Des collaborateurs engagés sur le terrain</h3>
              <p className="text-body text-surface/60 mb-8">
                Découvrez quelques moments vécus lors de nos missions solidaires réalisées avec des entreprises partenaires au Kenya et au Sénégal.
              </p>
              <Carousel
                items={testimonialsCongeSolidaire}
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
              <h3 className="h3-style text-primary mb-0">Notre impact sur le terrain</h3>
              <p className="text-body text-primary/60 mb-8">
                Découvrez quelques-unes des actions menées avec nos partenaires locaux.
              </p>
              <Carousel
                items={actionsCongeSolidaire.slice(0, 4)}
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
            <h3 className="h3-style text-primary mb-0">Quelques instants sur le terrain</h3>
            <p className="text-body text-primary/60 mb-8">
              Un aperçu des moments vécus lors de nos missions — la galerie sera enrichie au fil des prochains départs.
            </p>
            <Carousel
              items={[1, 2, 3, 4]}
              showPagination={true}
              color="primary"
              renderSlide={(_, i) => (
                <img src={`/images/placeholders/placeholder-galerie-${i + 1}.png`} alt="" aria-hidden="true" className="w-full h-56 object-cover rounded-xl" />
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