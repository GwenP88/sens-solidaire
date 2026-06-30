// Missions.jsx
// Page liste des missions — Hero + 4 sections par type de mission

// ── React
import { useState, useEffect, useRef } from 'react'

// ── Router
import { useSearchParams } from 'react-router-dom'

// ── API
import { fetchMissions } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import FilterChips from '../components/navigation/FilterChips'
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants métier
import MissionCard from '../components/missions/MissionCard'
import MissionSection from '../components/missions/MissionSection'

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
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || null)
  const filtersRef = useRef(null)

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
    if (activeFilter) {
      setTimeout(() => filtersRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error) return <p className="text-body text-accent p-12">Erreur : {error}</p>

  const missionVolontariat = missions.filter(m => m.type === 'volontariat_individuel')
  const missionServiceCivique = missions.filter(m => m.type === 'service_civique')

  const stepsServiceCivique = [
    {
      icon: IconFrance,
      title: 'Mission en France : Nice ou Annemasse',
      description: 'Pendant la première partie de votre Service Civique, vous intervenez auprès de scolaires et du grand public pour sensibiliser aux enjeux du développement durable.',
      list: ['L\'animation d\'ateliers autour des 17 Objectifs de Développement Durable', 'La coordination de correspondances scolaires avec nos partenaires étrangers', 'La promotion de nos actions et projets', 'La recherche de nouveaux partenaires', 'La communication et la recherche de financements'],
    },
    {
      icon: IconAbroad,
      title: 'Une immersion à l\'international',
      description: 'Après cette première expérience en France, vous rejoignez pendant au moins trois mois l\'un de nos partenaires au Kenya, au Sénégal ou en Côte d\'Ivoire.',
      list: ['La préservation de la biodiversité', 'L\'éducation et les échanges interculturels', 'L\'agriculture durable', 'La sensibilisation à l\'environnement', 'Le développement de nouveaux projets locaux'],
    },
    {
      icon: IconGrow,
      title: 'Une expérience qui vous fait grandir',
      description: 'Le Service Civique est bien plus qu\'une mission. C\'est l\'occasion de prendre confiance en vous et de développer des compétences recherchées dans de nombreux domaines.',
      list: ['Gestion de projet', 'Education au développement durable', 'Animation et sensibilisation', 'Coopération internationale', 'Travail sur le terrain'],
    },
  ]

  const stepsGroupeJeunes = [
    {
      icon: IconFrance,
      title: 'Préparer la mission ensemble',
      description: 'Avant le départ, notre équipe accompagne le groupe dans la préparation interculturelle et logistique pour aborder la mission dans les meilleures conditions.',
      list: ['Réunion de préparation avec les encadrants', 'Sensibilisation interculturelle', 'Échanges avec les partenaires locaux', 'Organisation logistique et administrative'],
    },
    {
      icon: IconAbroad,
      title: '10 jours de terrain au Kenya ou au Sénégal',
      description: 'Sur place, les jeunes participent à des projets concrets : réhabilitation d\'espaces naturels, ateliers éducatifs, rencontres avec les communautés et les rangers.',
      list: ['Projets environnementaux avec les partenaires', 'Rencontres avec les jeunes locaux', 'Ateliers interculturels et artistiques', 'Découverte de la faune et de la flore'],
    },
    {
      icon: IconGrow,
      title: 'Valoriser et transmettre l\'expérience',
      description: 'De retour en France, les jeunes partagent leur vécu et deviennent à leur tour ambassadeurs de la solidarité internationale dans leur établissement.',
      list: ['Restitution auprès de l\'établissement', 'Rédaction du rapport de mission', 'Sensibilisation des pairs', 'Suivi des projets à distance'],
    },
  ]

  const stepsCongeSolidaire = [
    {
      icon: IconBuilding,
      title: 'Construire une mission adaptée',
      description: 'Nous échangeons avec l\'entreprise afin de comprendre ses objectifs, identifier les compétences mobilisables et construire une mission cohérente avec les besoins du terrain.',
      list: ['Diagnostic des compétences disponibles', 'Choix du terrain et du partenaire local', 'Définition des objectifs de mission', 'Accompagnement administratif et logistique'],
    },
    {
      icon: IconLeaf,
      title: 'Vivre l\'expérience sur le terrain',
      description: 'Les participants rejoignent nos partenaires locaux pour partager leurs compétences, découvrir d\'autres réalités et contribuer à des projets concrets.',
      list: ['Immersion complète avec les équipes locales', 'Apport de compétences métier concrètes', 'Projets de terrain adaptés au profil', 'Encadrement et suivi par Sens Solidaire'],
    },
    {
      icon: IconHand,
      title: 'Donner du sens à l\'engagement',
      description: 'De retour en France, nous accompagnons l\'entreprise dans la valorisation de son engagement RSE et la restitution auprès des équipes.',
      list: ['Rapport de mission détaillé', 'Restitution auprès des équipes', 'Contenu pour la communication RSE', 'Réduction d\'impôt à 60 % (art. 238 bis CGI)'],
    },
  ]

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-missions.jpg"
        title="Partez en mission et agissez concrètement"
        subtitle="Parce que l'engagement est ouvert à tous, nos missions s'adaptent à chaque profil : seul, à deux, en groupe, en famille ou avec votre entreprise, vivez une expérience humaine et solidaire au service de la biodiversité."
      />

      {/* ── Bloc orientation ── */}
      <section className="padding-y padding-x bg-surface-mid">
        <h2 className="h2-style text-primary mb-8">Quelle mission est faite pour vous ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { icon: IconPerson, situation: 'Vous souhaitez partir seul, à deux ou en petit groupe pour participer concrètement à un projet solidaire ?', label: 'Volontariat individuel', filter: 'individuel' },
            { icon: IconClock, situation: 'Vous avez entre 16 et 25 ans et recherchez une expérience citoyenne riche de sens ?', label: 'Service Civique', filter: 'service_civique' },
            { icon: IconPeople, situation: 'Vous représentez un lycée ou une structure jeunesse et souhaitez organiser un projet collectif ?', label: 'Mission de groupe', filter: 'groupe_jeunes' },
            { icon: IconBuilding, situation: 'Vous êtes salarié et souhaitez donner du sens à vos congés en vous engageant dans un projet solidaire à impact positif ?', label: 'Congé solidaire', filter: 'conge_solidaire' },
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.filter}
                onClick={() => handleFilter(item.filter)}
                className="flex flex-col gap-4 bg-surface rounded-2xl p-6 text-left hover:shadow-md transition-shadow group"
              >
                <Icon className="text-accent-2 text-2xl" />
                <p className="text-body text-primary/60 flex-1">{item.situation}</p>
                <p className="h3-style text-primary group-hover:text-accent transition-colors">{item.label} →</p>
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
          image="/images/missions/kenya.jpg"
          imageAlt="Volontariat individuel"
          introSlot={
            <>
              <p className="text-body text-primary/80">
                Partir en mission avec Sens Solidaire, c'est rejoindre des projets menés toute l'année avec nos partenaires locaux au Kenya, au Sénégal, au Pérou, au Sri Lanka ou à Sumatra.
              </p>
              <p className="text-body text-primary/80">
                Pendant 10 jours à 4 semaines, vous découvrez une autre culture tout en participant à des actions concrètes. <strong className="text-primary/70">Aucune compétence particulière n'est demandée.</strong>
              </p>
              <p className="text-mention text-primary/60">
                En tant que particulier, vous pouvez bénéficier d'une réduction d'impôt de 66 % sur les frais de mission engagés.
              </p>
            </>
          }
          infoBarItems={[
            { icon: IconPerson, label: 'Individuel ou groupe' },
            { icon: IconClock, label: '10 jours à 4 semaines' },
            { icon: IconPayment, label: 'à partir de 1175€' },
            { icon: IconMoney, label: 'Réduction d\'impôt 66 %' },
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
          image="/images/missions/service-civique.jpg"
          imageAlt="Service civique"
          introSlot={
            <p className="text-body text-primary/80">
              Vous avez entre 16 et 25 ans (jusqu'à 30 ans en situation de handicap) et souhaitez vous engager dans une mission utile, enrichissante et porteuse de sens ? Le Service Civique vous permet de consacrer plusieurs mois à une mission d'intérêt général tout en bénéficiant d'une indemnité mensuelle.
            </p>
          }
          infoBarItems={[
            { icon: IconPerson, label: '16-25 ans' },
            { icon: IconClock, label: '6 à 12 mois' },
            { icon: IconPin, label: 'France & étranger' },
            { icon: IconMoney, label: 'Indemnité mensuelle' },
          ]}
          primaryAction={{ label: 'Candidater →', href: 'https://www.service-civique.gouv.fr/', external: true }}
          testimonialsUrl="/temoignages?type=service_civique"
          stepsTitle="Comment ça fonctionne ?"
          steps={stepsServiceCivique}
          bgCard="bg-white"
          carouselItems={missionServiceCivique}
          carouselTitle="Nos missions de service civique"
          carouselSubtitle="Partez en France puis à l'international pour une expérience unique de 6 à 12 mois."
          carouselSlidesPerView={2}
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

      {/* ── Section Groupe jeunes ── */}
      {(activeFilter === null || activeFilter === 'groupe_jeunes') && (
        <MissionSection
          id="groupe-jeunes"
          bg="bg-surface"
          title="Je pars avec mon groupe"
          audience="Pour les lycées, MJC et structures de jeunesse"
          description="Organisez une mission solidaire au Kenya ou au Sénégal et faites vivre à votre groupe une expérience éducative et interculturelle unique."
          decorImage="/images/ui/one-line-3.png"
          image="/images/missions/groupe-jeune.jpg"
          imageAlt="Mission groupe jeunes"
          introSlot={
            <p className="text-body text-primary/80">
              Nous accompagnons les établissements scolaires, les MJC, les centres sociaux et les structures jeunesse dans l'organisation de missions solidaires au Kenya ou au Sénégal. Pendant 10 jours, les jeunes découvrent une autre culture, participent à des actions concrètes sur le terrain et développent leur ouverture au monde.
            </p>
          }
          infoBarItems={[
            { icon: IconPeople, label: 'Groupe encadré' },
            { icon: IconClock, label: '10 jours' },
            { icon: IconPin, label: 'Kenya ou Sénégal' },
            { icon: IconHeart, label: 'Projet éducatif' },
          ]}
          primaryAction={{ label: 'Monter votre projet →', href: '/contact' }}
          testimonialsUrl="/temoignages?type=groupe_jeune"
          stepsTitle="Une mission en trois temps"
          steps={stepsGroupeJeunes}
          bgCard="bg-surface-mid"
        >
          {/* PDFs */}
          <div className="mt-12">
            <h3 className="h3-style text-primary mb-2">Tout ce qu'il faut savoir avant de s'engager</h3>
            <p className="text-body text-primary/60 mb-8">
              Retrouvez les dossiers de présentation détaillés pour découvrir les objectifs pédagogiques, le déroulement des missions, les conditions de participation et les informations pratiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              {[
                { title: "Mission groupe — Kenya", size: "1,2 Mo" },
                { title: "Mission groupe — Sénégal", size: "1,2 Mo" },
              ].map(pdf => (
                <div key={pdf.title} className="flex items-center justify-between bg-surface-mid rounded-xl px-6 py-4 flex-1">
                  <div className="flex items-center gap-4">
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

          {/* Galerie */}
          <div className="mt-12">
            <h3 className="h3-style text-primary mb-2">Ils ont vécu l'aventure</h3>
            <p className="text-body text-primary/60 mb-8">
              Rencontres, découvertes, projets de terrain, moments de partage... découvrez quelques souvenirs de nos missions de groupe au Kenya et au Sénégal.
            </p>
            <Carousel
              items={[1, 2, 3, 4]}
              slidesPerView={3}
              spaceBetween={16}
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
          image="/images/missions/conge-solidaire.jpg"
          imageAlt="Congé solidaire"
          introSlot={
            <p className="text-body text-primary/80">
              Le congé solidaire permet à un salarié de s'engager temporairement auprès d'une association tout en conservant son statut professionnel. Pour les entreprises, c'est également une opportunité de renforcer leur démarche RSE, développer l'engagement des équipes et soutenir des actions à impact positif.
            </p>
          }
          infoBarItems={[
            { icon: IconBuilding, label: 'Salariés & entreprises' },
            { icon: IconClock, label: '10 jours à 4 semaines' },
            { icon: IconPin, label: 'Kenya ou Sénégal' },
            { icon: IconMoney, label: 'Réduction d\'impôt 60 %' },
          ]}
          primaryAction={{ label: 'En savoir plus →', href: 'https://france-volontaires.org/le-conge-de-solidarite-internationale/', external: true }}
          testimonialsUrl="/temoignages?type=conge_solidaire"
          stepsTitle="Comment ça fonctionne ?"
          steps={stepsCongeSolidaire}
          bgCard="bg-surface"
        >
          <div className="mt-12">
            <h3 className="h3-style text-primary mb-2">Des collaborateurs engagés sur le terrain</h3>
            <p className="text-body text-primary/60 mb-8">
              Découvrez quelques moments vécus lors de nos missions solidaires réalisées avec des entreprises partenaires au Kenya et au Sénégal.
            </p>
            <Carousel
              items={[1, 2, 3, 4]}
              slidesPerView={3}
              spaceBetween={16}
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