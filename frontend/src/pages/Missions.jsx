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
import LocationCard from '../components/locations/LocationCard'
import MissionSection from '../components/missions/MissionSection'

// ── Utils
import { getDuration, TYPE_LABELS } from '../utils/missions'
import { FILTERS_MISSION_TYPE } from '../utils/filters'
import {
  IconPerson, IconClock, IconPin, IconMoney,
  IconFrance, IconAbroad, IconGrow,
  IconBuilding, IconHand, IconPeople, IconHeart, IconLeaf,
} from '../utils/icons'

function Missions() {
  // ── État local — missions + chargement + erreur + filtre actif
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Initialisation du filtre depuis l'URL (?filter=service_civique)
  const [searchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || null)

  // ── Référence sur la barre de filtres pour scroll automatique
  const filtersRef = useRef(null)

  // ── Changement de filtre + scroll vers la barre
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

  // ── Chargement des missions depuis l'API au montage
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

  // ── Scroll automatique vers les filtres si filtre actif à l'arrivée
  useEffect(() => {
    if (activeFilter) {
      setTimeout(() => {
        filtersRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  // ── États de chargement et d'erreur
  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error) return <p className="p-12 font-body text-accent">Erreur : {error}</p>

  // ── Missions filtrées par type
  const missionVolontariat = missions.filter(m => m.type === 'volontariat_individuel')

  // ── Steps — Service civique
  const stepsServiceCivique = [
    {
      icon: IconFrance,
      title: 'Mission en France : Nice ou Annemasse',
      subtitle: 'Agir et sensibiliser',
      description: 'Basé(e) à Nice ou Annemasse, vous intervenez auprès des scolaires pour leur faire découvrir le monde et les enjeux du développement durable.',
      list: [
        'Animations pédagogiques sur les 17 ODD',
        'Interventions scolaires — correspondances étrangères',
        'Communication et promotion sur les réseaux',
        'Démarchage de nouveaux partenaires',
        'Aide à la recherche de fonds',
      ],
    },
    {
      icon: IconAbroad,
      title: 'Mission à l\'étranger : Kenya ou Sénégal',
      subtitle: 'Découvrir et contribuer',
      description: 'Cap sur le Kenya ou le Sénégal pour 3 mois minimum. Au Kenya, au cœur du sanctuaire LUMO et du campus de Taita Taveta. Au Sénégal, aux côtés de l\'association AGADA en Casamance.',
      list: [
        'Coordination des correspondances scolaires France-étranger',
        'Suivi des activités du partenaire local',
        'Développement de projets biodiversité locaux',
        'Accueil des volontaires en mission courte',
      ],
    },
    {
      icon: IconGrow,
      title: 'Grandir et s\'engager pour un monde plus solidaire',
      subtitle: 'Une expérience qui vous transforme',
      description: 'Partez avec des valeurs, revenez avec des compétences. Le Service Civique, c\'est une expérience qui compte vraiment — pour vous, pour les autres, et pour votre avenir.',
      list: [
        'Chargé(e) de projets et mission de terrain',
        'Éducation au Développement Durable',
        'Coopération territoriale et internationale',
        'Communication et recherche de fonds',
      ],
    },
  ]

  // ── Steps — Groupe jeunes
  const stepsGroupeJeunes = [
    {
      icon: IconFrance,
      title: 'Préparer la mission ensemble',
      subtitle: 'En amont du départ',
      description: 'Avant le départ, notre équipe accompagne le groupe dans la préparation interculturelle et logistique pour aborder la mission dans les meilleures conditions.',
      list: [
        'Réunion de préparation avec les encadrants',
        'Sensibilisation interculturelle',
        'Échanges avec les partenaires locaux',
        'Organisation logistique et administrative',
      ],
    },
    {
      icon: IconAbroad,
      title: '10 jours de terrain au Kenya ou au Sénégal',
      subtitle: 'L\'expérience au cœur de l\'action',
      description: 'Sur place, les jeunes participent à des projets concrets : réhabilitation d\'espaces naturels, ateliers éducatifs, rencontres avec les communautés et les rangers.',
      list: [
        'Projets environnementaux avec les partenaires',
        'Rencontres avec les jeunes locaux',
        'Ateliers interculturels et artistiques',
        'Découverte de la faune et de la flore',
      ],
    },
    {
      icon: IconGrow,
      title: 'Valoriser et transmettre l\'expérience',
      subtitle: 'Après le retour',
      description: 'De retour en France, les jeunes partagent leur vécu et deviennent à leur tour ambassadeurs de la solidarité internationale dans leur établissement.',
      list: [
        'Restitution auprès de l\'établissement',
        'Rédaction du rapport de mission',
        'Sensibilisation des pairs',
        'Suivi des projets à distance',
      ],
    },
  ]

  // ── Steps — Congé solidaire
  const stepsCongeSolidaire = [
    {
      icon: IconBuilding,
      title: 'Construire une mission adaptée',
      subtitle: 'Cadrage et personnalisation',
      description: 'Nous échangeons avec l\'entreprise afin de comprendre ses objectifs, identifier les compétences mobilisables et construire une mission cohérente avec les besoins du terrain.',
      list: [
        'Diagnostic des compétences disponibles',
        'Choix du terrain et du partenaire local',
        'Définition des objectifs de mission',
        'Accompagnement administratif et logistique',
      ],
    },
    {
      icon: IconLeaf,
      title: 'Vivre l\'expérience sur le terrain',
      subtitle: 'L\'engagement en action',
      description: 'Les participants rejoignent nos partenaires locaux pour partager leurs compétences, découvrir d\'autres réalités et contribuer à des projets concrets.',
      list: [
        'Immersion complète avec les équipes locales',
        'Apport de compétences métier concrètes',
        'Projets de terrain adaptés au profil',
        'Encadrement et suivi par Sens Solidaire',
      ],
    },
    {
      icon: IconHand,
      title: 'Donner du sens à l\'engagement',
      subtitle: 'Impact et communication RSE',
      description: 'De retour en France, nous accompagnons l\'entreprise dans la valorisation de son engagement RSE et la restitution auprès des équipes.',
      list: [
        'Rapport de mission détaillé',
        'Restitution auprès des équipes',
        'Contenu pour la communication RSE',
        'Réduction d\'impôt à 60 % (art. 238 bis CGI)',
      ],
    },
  ]

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/hero/hero-missions.jpg"
        title="Partez en mission et agissez concrètement"
        subtitle="Seul, en groupe ou avec votre entreprise, vivez une expérience humaine unique au service de la biodiversité et des communautés locales"
      />

      {/* ── Bloc orientation — Quelle mission est faite pour moi ? ── */}
      <section className="section-padding bg-surface-mid">
        <h2 className="section-title text-primary mb-8">Quelle mission est faite pour moi ?</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              icon: IconPerson,
              situation: 'Vous souhaitez partir seul ou en petit groupe',
              label: 'Volontariat individuel',
              anchor: '#individuel',
              filter: 'individuel',
            },
            {
              icon: IconClock,
              situation: 'Vous avez entre 16 et 25 ans',
              label: 'Service Civique',
              anchor: '#service-civique',
              filter: 'service_civique',
            },
            {
              icon: IconPeople,
              situation: 'Vous représentez un lycée ou une structure jeunesse',
              label: 'Mission de groupe',
              anchor: '#groupe-jeunes',
              filter: 'groupe_jeunes',
            },
            {
              icon: IconBuilding,
              situation: 'Vous êtes salarié ou responsable d\'entreprise',
              label: 'Congé solidaire',
              anchor: '#conge-solidaire',
              filter: 'conge_solidaire',
            },
          ].map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.filter}
                onClick={() => handleFilter(item.filter)}
                className="flex flex-col gap-4 bg-surface rounded-2xl p-6 text-left hover:shadow-md transition-shadow group"
              >
                <Icon className="text-accent-2 text-2xl" />
                <p className="font-body text-sm text-primary/60 leading-relaxed flex-1">
                  {item.situation}
                </p>
                <p className="font-heading font-bold text-primary text-sm group-hover:text-accent transition-colors">
                  {item.label} →
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Barre de filtres par type de mission — collée au hero ── */}
      <div ref={filtersRef} className="py-6 px-24 bg-primary">
        <FilterChips
          filters={FILTERS_MISSION_TYPE}
          active={activeFilter}
          onChange={handleFilter}
          variant="dark"
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          Section Volontariat individuel
      ══════════════════════════════════════════════════════ */}
      {(activeFilter === null || activeFilter === 'individuel') && (
        <MissionSection
          id="individuel"
          bg="bg-surface"
          title="Je pars en mission"
          audience="Pour les volontaires individuels"
          description="Vivez une expérience utile, authentique et accessible à tous."
          decorImage="/images/ui/one-line-1.png"
          image="/images/missions/kenya.jpg"
          imageAlt="Volontariat individuel"
          introSlot={
            <>
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                Partir en mission avec Sens Solidaires, c'est rejoindre des projets menés toute l'année avec nos partenaires locaux au Kenya, au Sénégal, au Pérou, au Sri Lanka ou à Sumatra.
              </p>
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                Pendant 10 jours à 4 semaines, vous découvrez une autre culture tout en participant à des actions concrètes : préservation de la biodiversité, soutien aux populations locales, éducation à l'environnement ou agriculture durable. Vous pouvez partir seul(e), en couple, entre amis ou en famille.
                <span className="font-bold text-primary/70"> Aucune compétence particulière n'est demandée. Nous recherchons avant tout des personnes curieuses, respectueuses et motivées à vivre une expérience de solidarité internationale.</span>
              </p>
              <p className="font-body text-sm text-primary/60 leading-relaxed italic">
                Les frais de mission peuvent ouvrir droit à une réduction fiscale de 66 % selon la législation en vigueur.
              </p>
            </>
          }
          infoBarItems={[
            { icon: IconPerson, label: 'Individuel ou groupe' },
            { icon: IconClock,  label: '10 jours à 4 semaines' },
            { icon: IconPin,    label: 'à l\'étranger' },
            { icon: IconMoney,  label: 'à partir de 1175€' },
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

      {/* ══════════════════════════════════════════════════════
          Section Service Civique
      ══════════════════════════════════════════════════════ */}
      {(activeFilter === null || activeFilter === 'service_civique') && (
        <MissionSection
          id="service-civique"
          bg="bg-surface-mid"
          title="Je m'engage en Service Civique"
          audience="Pour les 16 à 25 ans"
          description="Vivez une expérience de plusieurs mois en France et à l'international tout en développant vos compétences et votre engagement."
          decorImage="/images/ui/one-line-2.png"
          image="/images/missions/service-civique.jpg"
          imageAlt="Service civique"
          introSlot={
            <p className="section-subtitle text-primary/80">
              Vous avez entre 16 et 25 ans (jusqu'à 30 ans en situation de handicap) et vous souhaitez vivre une expérience qui a du sens ? <br /><br />Le Service Civique vous permet de consacrer plusieurs mois à une mission d'intérêt général tout en percevant une indemnité mensuelle. <br />Avec Sens Solidaires, vous participez à des actions d'éducation au développement durable en France avant de rejoindre nos partenaires au Kenya ou au Sénégal pour plusieurs mois. C'est l'occasion de développer votre autonomie, découvrir d'autres réalités de vie et acquérir de nouvelles compétences utiles pour votre avenir personnel et professionnel.
            </p>
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
          carouselItems={[
            { slug: "lumo-kenya", name: "Sanctuaire LUMO", image_url: "/images/lieux-missions/lumo-kenya.jpeg" },
            { slug: "ttnp-kenya", name: "Taita Taveta National Polytechnic", image_url: "/images/lieux-missions/ttnp-kenya.jpeg" },
            { slug: "agada-senegal", name: "ONG AGADA", image_url: "/images/lieux-missions/agada-senegal.jpg" },
          ]}
          carouselTitle="En savoir plus sur nos lieux d'action"
          carouselSubtitle="Nos partenaires locaux sont au cœur de chaque mission. Engagés dans la protection de la biodiversité et le développement des communautés, ils accueillent les volontaires et les accompagnent tout au long de leur expérience."
          carouselSlidesPerView={3}
          renderSlide={(loc) => <LocationCard {...loc} />}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          Section Groupe jeunes
      ══════════════════════════════════════════════════════ */}
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
            <p className="section-subtitle text-primary/80">
              Nous accompagnons les établissements scolaires, les MJC, les centres sociaux et les structures jeunesse dans l'organisation de missions solidaires au Kenya ou au Sénégal. Pendant 10 jours, les jeunes découvrent une autre culture, participent à des actions concrètes sur le terrain et développent leur ouverture au monde. <br />Au-delà du voyage, cette expérience favorise l'autonomie, l'esprit d'équipe, la citoyenneté et la confiance en soi.
            </p>
          }
          infoBarItems={[
            { icon: IconPeople, label: 'Groupe encadré' },
            { icon: IconClock,  label: '10 jours' },
            { icon: IconPin,    label: 'Kenya ou Sénégal' },
            { icon: IconHeart,  label: 'Projet éducatif' },
          ]}
          primaryAction={{ label: 'Monter votre projet →', href: '/contact' }}
          testimonialsUrl="/temoignages?type=groupe_jeune"
          stepsTitle="Une mission en trois temps"
          steps={stepsGroupeJeunes}
          bgCard="bg-surface-mid"
        >
          {/* ── Bloc PDFs — pleine largeur ── */}
          <div className="mt-12">
            <h3 className="font-heading font-bold text-primary text-base mb-2">Tout ce qu'il faut savoir avant de s'engager</h3>
              <p className="font-body text-sm text-primary/60 mb-8">
                Retrouvez les dossiers de présentation détaillés pour découvrir les objectifs pédagogiques, le déroulement des missions, les conditions de participation et les informations pratiques.
              </p>
            <div className="flex gap-6">
              {[
                { title: "Mission groupe — Kenya", size: "1,2 Mo" },
                { title: "Mission groupe — Sénégal", size: "1,2 Mo" },
              ].map(pdf => (
                <div key={pdf.title} className="flex items-center justify-between bg-surface-mid rounded-xl px-6 py-4 flex-1">
                  <div className="flex items-center gap-4">
                    <span className="font-body text-sm font-bold text-primary/40 uppercase">PDF</span>
                    <div>
                      <p className="font-body font-semibold text-primary text-sm">{pdf.title}</p>
                      <p className="font-body text-xs text-primary/40">{pdf.size}</p>
                    </div>
                  </div>
                  <button className="font-body text-sm text-primary/60 hover:text-primary transition-colors">↓</button>
                </div>
              ))}
            </div>
          </div>
          {/* ── Carrousel photos groupe jeunes ── */}
          <div className="mt-12">
            <h3 className="font-heading font-bold text-primary text-base mb-2">Ils ont vécu l'aventure</h3>
            <p className="font-body text-sm text-primary/60 mb-8">
              Rencontres, découvertes, projets de terrain, moments de partage... découvrez quelques souvenirs de nos missions de groupe au Kenya et au Sénégal.
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
          </div>
        </MissionSection>
      )}

      {/* ══════════════════════════════════════════════════════
          Section Congé solidaire
      ══════════════════════════════════════════════════════ */}
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
            <p className="section-subtitle text-primary/80">
              Le congé solidaire permet à un salarié de s'engager temporairement auprès d'une association tout en conservant son statut professionnel. Accompagnés par Sens Solidaires et nos partenaires locaux, les participants mettent leurs compétences au service de projets environnementaux et de développement local au Kenya ou au Sénégal. <br />Pour les entreprises, c'est également une opportunité de renforcer leur démarche RSE, développer l'engagement des équipes et soutenir des actions à impact positif.
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
          {/* ── Bloc additionnel — galerie */}
          <div className="mt-12">
            <h3 className="font-heading font-bold text-primary text-base mb-2">Des collaborateurs engagés sur le terrain</h3>
            <p className="font-body text-sm text-primary/60 mb-8">
              Découvrez quelques moments vécus lors de nos missions solidaires réalisées avec des entreprises partenaires au Kenya et au Sénégal.
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
          </div>
        </MissionSection>
      )}

      <ScrollToTop />
    </div>
  )
}

export default Missions