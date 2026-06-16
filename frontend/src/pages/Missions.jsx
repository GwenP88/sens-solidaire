// Missions.jsx
// Page liste des missions — Hero + 4 sections par type de mission

import { useState, useEffect, useRef } from 'react'
import { fetchMissions } from '../services/api'
import MissionCard from '../components/missions/MissionCard'
import HeroPage from '../components/layout/HeroPage'
import { getDuration, TYPE_LABELS } from '../utils/missions'
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import SectionHero from '../components/ui/SectionHero'
import LocationCard from '../components/locations/LocationCard'
import FilterChips from '../components/navigation/FilterChips'
import ScrollToTop from '../components/ui/ScrollToTop'
import { IconPerson, IconClock, IconPin, IconMoney, IconFrance, IconAbroad, IconGrow } from '../utils/icons'

// Filtres disponibles — correspond aux clés de section
const FILTERS = [
  { label: "Toutes", value: null },
  { label: "Volontariat individuel", value: "individuel" },
  { label: "Service civique", value: "service_civique" },
  { label: "Groupe jeunes", value: "groupe_jeunes" },
  { label: "Congé solidaire", value: "conge_solidaire" },
]

function Missions() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtre actif — null = toutes les sections visibles
  const [activeFilter, setActiveFilter] = useState(null)

  // Ref sur la barre de filtres — pour scroll automatique au clic
  const filtersRef = useRef(null)

  // Gestion du filtre — scroll vers la barre de filtres au clic
  const handleFilter = (value) => {
    setActiveFilter(value)
    setTimeout(() => {
      const el = filtersRef.current
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 0
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

  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error) return <p className="p-12 font-body text-accent">Erreur : {error}</p>

  // Missions volontariat individuel filtrées depuis l'API
  const missionVolontariat = missions.filter(m => m.type === 'volontariat_individuel')

  return (
    <div className="bg-surface min-h-screen">

      {/* Hero page */}
      <HeroPage
        image="/images/hero_missions.jpg"
        title="Nos missions"
        subtitle="Agissez concrètement pour la protection de la biodiversité et le soutien des communautés locales."
      />

      {/* ── Filtres par type de mission ── */}
      <div ref={filtersRef} className="py-6 px-24 bg-primary">
        <FilterChips
          filters={FILTERS}
          active={activeFilter}
          onChange={handleFilter}
          variant="dark"
        />
      </div>

      {/* ── Section Volontariat individuel ── */}
      {(activeFilter === null || activeFilter === 'individuel') && (
        <section id="individuel" className="section-padding bg-surface">
          <SectionHero
            title="Partir en mission"
            audience="Pour les volontaires individuels"
            description="Agissez concrètement pour la protection de la biodiversité et le soutien des communautés locales."
            image="/images/one-line-1.png"
          />

          <div className="mb-10">
            <p className="font-body text-sm text-primary/80 leading-relaxed">
              En rejoignant une mission de volontariat avec Sens Solidaires, vous participez à des projets de terrain menés en partenariat avec des acteurs locaux au Kenya, au Sénégal, au Pérou, au Sri Lanka et à Sumatra. Selon vos disponibilités, vous pouvez vous engager pour une durée de 10 jours à 4 semaines.
            </p>
            <p className="font-body text-sm text-primary/80 leading-relaxed mt-3">
              Seul(e), en couple ou entre amis, engagez-vous aux côtés de rangers, de soigneurs animaliers, d'agriculteurs et d'associations locales pour contribuer directement à des actions de préservation de l'environnement et de développement durable.
              <span className="font-bold text-primary/70"> Aucune expérience n'est requise : seule votre motivation compte.</span>
            </p>
            <p className="font-body text-sm text-primary/80 leading-relaxed mt-3">
              Découvrez les missions disponibles et trouvez celle qui vous permettra de vous engager à nos côtés.
              <br /><br />
              <span className="italic text-primary/60">Les frais de mission ouvrent droit à une réduction d'impôt de 66 %.</span>
            </p>
          </div>

          {/* Carrousel — 3 missions visibles, navigation flèches custom */}
          <Carousel
            color="primary"
            showPagination={true}
            items={missionVolontariat}
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
            slidesPerView={3}
            spaceBetween={24}
          />
        </section>
      )}

      {/* ── Section Service Civique ── */}
      {(activeFilter === null || activeFilter === 'service_civique') && (
        <section id="service-civique" className="section-padding bg-surface-mid">
          <SectionHero
            title="Effectuer un service civique"
            audience="Pour les 16 à 25 ans"
            description="Vivez une expérience de plusieurs mois en France et à l'international tout en développant vos compétences et votre engagement."
            image="/images/one-line-2.png"
          />

          {/* Texte + icônes + boutons + image */}
          <div className="flex gap-16 items-center mb-16">
            <div className="flex flex-col gap-6 flex-1">
              <p className="section-subtitle text-primary/80">
                Le Service Civique, c'est l'opportunité de s'engager concrètement pour la société, sans condition de diplôme. Entre 16 et 25 ans (jusqu'à 30 ans en situation de handicap), partez en mission avec Sens Solidaire et vivez une expérience humaine unique de 6 à 12 mois à raison d'au moins 24h hebdomadaires, en France puis à l'étranger (3 mois minimum chacun).
              </p>

              {/* Icônes infos clés + CTAs — même largeur */}
              <div className="flex flex-col gap-4">

                {/* Icônes avec séparateurs */}
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="font-body text-sm text-primary/60 flex flex-col items-center gap-1">
                    <IconPerson className="text-primary text-xl" /><span>16-25 ans</span>
                  </span>
                  <div className="w-[2px] h-12 bg-surface-dark" />
                  <span className="font-body text-sm text-primary/60 flex flex-col items-center gap-1">
                    <IconClock className="text-primary text-xl" /><span>6 à 12 mois</span>
                  </span>
                  <div className="w-[2px] h-12 bg-surface-dark" />
                  <span className="font-body text-sm text-primary/60 flex flex-col items-center gap-1">
                    <IconPin className="text-primary text-xl" /><span>France & étranger</span>
                  </span>
                  <div className="w-[2px] h-12 bg-surface-dark" />
                  <span className="font-body text-sm text-primary/60 flex flex-col items-center gap-1">
                    <IconMoney className="text-primary text-xl" /><span>Indemnité mensuelle</span>
                  </span>
                </div>

                {/* CTAs pleine largeur — même largeur que les icônes */}
                <div className="flex gap-4">
                  <a href="https://www.service-civique.gouv.fr/..." target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button label="Candidater →" variant="primary" fullWidth />
                  </a>
                  <div className="flex-1">
                    <Button label="Nous contacter →" variant="secondary" fullWidth />
                  </div>
                </div>

              </div>

            </div>
            <div className="w-2/5 shrink-0">
              <img src="/images/service_civique.jpg" alt="Service civique" className="w-full h-72 object-cover rounded-xl" />
            </div>
          </div>

          {/* Comment ça fonctionne — 3 étapes */}
          <h3 className="font-heading font-bold text-primary text-base text-center mb-2">Comment ça fonctionne ?</h3>
          <div className="grid grid-cols-3 gap-6 mb-16 items-stretch">

            <div className="bg-white rounded-xl p-6 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-6">
                <IconFrance className="text-primary text-3xl shrink-0" />
                <span className="font-heading font-bold text-primary text-2xl">1</span>
                <div>
                  <h4 className="font-heading font-bold text-primary text-base">Mission en France : Nice ou Ansemasse</h4>
                  <p className="font-body text-sm text-primary/60">Agir et sensibiliser</p>
                </div>
              </div>
              <p className="font-body text-sm text-primary/80 min-h-[80px]">
                Basé(e) à Nice ou Annemasse, vous intervenez auprès des scolaires pour leur faire découvrir le monde et les enjeux du développement durable — avant de partir à l'aventure sur le terrain.
              </p>
              <ul className="flex flex-col gap-1">
                {['Animations pédagogiques sur les 17 ODD', 'Interventions scolaires — correspondances étrangères', 'Communication et promotion sur les réseaux', 'Démarchage de nouveaux partenaires', 'Aide à la recherche de fonds'].map(item => (
                  <li key={item} className="font-body text-sm text-primary/60">- {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-6">
                <IconAbroad className="text-primary text-3xl shrink-0" />
                <span className="font-heading font-bold text-primary text-2xl">2</span>
                <div>
                  <h4 className="font-heading font-bold text-primary text-base">Mission à l'étranger : Kenya ou Sénégal</h4>
                  <p className="font-body text-sm text-primary/60">Découvrir et contribuer</p>
                </div>
              </div>
              <p className="font-body text-sm text-primary/80 min-h-[80px]">
                Cap sur le Kenya ou le Sénégal pour 3 mois minimum. Au Kenya, au cœur du sanctuaire LUMO et du campus de Taita Taveta. Au Sénégal, aux côtés de l'association AGADA en Casamance.
              </p>
              <ul className="flex flex-col gap-1">
                {['Coordination des correspondances scolaires France-étranger', 'Suivi des activités du partenaire local', 'Développement de projets biodiversité locaux', 'Accueil des volontaires en mission courte'].map(item => (
                  <li key={item} className="font-body text-sm text-primary/60">- {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-6">
                <IconGrow className="text-primary text-3xl shrink-0" />
                <span className="font-heading font-bold text-primary text-2xl">3</span>
                <div>
                  <h4 className="font-heading font-bold text-primary text-base">Grandir et s'engager pour un monde plus solidaire</h4>
                  <p className="font-body text-sm text-primary/60">Développer ses compétences</p>
                </div>
              </div>
              <p className="font-body text-sm text-primary/80 min-h-[80px]">
                Partez avec des valeurs, revenez avec des compétences. Le Service Civique, c'est une expérience qui compte vraiment — pour vous, pour les autres, et pour votre avenir.
              </p>
              <ul className="flex flex-col gap-1">
                {["Chargé(e) de projets et mission de terrain", 'Éducation au Développement Durable', 'Coopération territoriale et internationale', 'Communication et recherche de fonds'].map(item => (
                  <li key={item} className="font-body text-sm text-primary/60">- {item}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Liens vers les pages lieux — carousel LocationCard */}
          <div className="mt-12">
            <h3 className="font-heading font-bold text-primary text-base mb-2">En savoir plus sur nos lieux d'action</h3>
            <p className="font-body text-sm text-primary/60 mb-8">Nos partenaires locaux sont au cœur de chaque mission. Engagés dans la protection de la biodiversité et le développement des communautés, ils accueillent les volontaires et les accompagnent tout au long de leur expérience sur le terrain.</p>
            <Carousel
              items={[
                { slug: "lumo-kenya", name: "Sanctuaire LUMO", image_url: "/images/locations/LUMO-kenya.jpeg" },
                { slug: "ttnp-kenya", name: "Taita Taveta National Polytechnic", image_url: "/images/locations/TTNP-kenya.jpeg" },
                { slug: "agada-senegal", name: "ONG AGADA", image_url: "/images/locations/AGADA-senegal.jpg" },
              ]}
              slidesPerView={3}
              spaceBetween={24}
              showPagination={false}
              color="primary"
              renderSlide={(loc) => <LocationCard {...loc} />}
            />
          </div>
        </section>
      )}

      {/* ── Section Groupe jeune ── */}
      {(activeFilter === null || activeFilter === 'groupe_jeunes') && (
        <section id="groupe-jeunes" className="section-padding bg-surface">
          <SectionHero
            title="Partir en groupe"
            audience="Pour les lycées, MJC et structures de jeunesse"
            description="Organisez une mission solidaire au Kenya ou au Sénégal et faites vivre à votre groupe une expérience éducative et interculturelle unique."
            image="/images/one-line-3.png"
          />

          {/* 3 colonnes */}
          <div className="flex gap-8 items-stretch">

            {/* Bloc texte + CTA rapports */}
            <div className="flex flex-col justify-between gap-4 w-1/2">
              <div className="flex flex-col gap-4">
                <p className="font-body text-sm text-primary/80 leading-relaxed">
                  Pendant 10 jours, les participants découvrent une autre culture tout en contribuant à des projets de protection de la biodiversité et de soutien aux communautés locales.
                </p>
                <p className="font-body text-sm text-primary/80 leading-relaxed">
                  Une expérience collective qui favorise l'autonomie, l'ouverture au monde et l'engagement citoyen.
                </p>
              </div>
              <div className="bg-surface-mid rounded-xl p-6 flex flex-col gap-3">
                <p className="font-heading font-bold text-primary text-base">Ils sont partis en missions jeunes</p>
                <p className="font-body text-sm text-primary/60">Découvrez les retours d'expérience et les rapports de nos missions de groupe.</p>
                <Button label="Voir les rapports de missions →" variant="secondary" fullWidth />
              </div>
            </div>

            {/* Bloc PDF téléchargement */}
            <div className="flex flex-col gap-4 w-1/4 bg-surface-mid rounded-xl p-6">
              <p className="font-heading font-bold text-primary text-base">Documents à télécharger</p>
              {[
                { title: "Mission groupe — Kenya", size: "1,2 Mo" },
                { title: "Mission groupe — Sénégal", size: "1,2 Mo" },
              ].map((pdf) => (
                <div key={pdf.title} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-primary/60">PDF</span>
                    <div>
                      <p className="font-body font-semibold text-primary text-sm">{pdf.title}</p>
                      <p className="font-body text-xs text-primary/40">{pdf.size}</p>
                    </div>
                  </div>
                  <button className="font-body text-sm text-primary/60 hover:text-primary transition-colors">↓</button>
                </div>
              ))}
            </div>

            {/* Bloc contact */}
            <div className="flex flex-col justify-between gap-4 w-1/4 shrink-0 bg-surface-mid rounded-xl p-6">
              <div className="flex flex-col gap-4">
                <p className="font-heading font-bold text-primary text-base">Une question ?</p>
                <p className="font-body text-sm text-primary/60">
                  Une question, un doute ou besoin d'être accompagné ? Notre équipe est à votre écoute pour vous guider à chaque étape de votre projet de volontariat.
                </p>
              </div>
              <Button label="Nous contacter →" variant="secondary" fullWidth />
            </div>

          </div>
        </section>
      )}

      {/* ── Section Congé solidaire ── */}
      {(activeFilter === null || activeFilter === 'conge_solidaire') && (
        <section id="conge-solidaire" className="section-padding bg-surface-mid">
          <SectionHero
            title="S'engager en entreprise"
            audience="Pour les salariés et les entreprises"
            description="Mettez vos compétences au service de projets solidaires tout en conciliant engagement citoyen et vie professionnelle."
            image="/images/one-line-4.png"
          />

          {/* 2 colonnes — texte + contact */}
          <div className="flex gap-8 items-start">

            {/* Bloc texte */}
            <div className="flex flex-col gap-4 flex-1">
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                Le congé solidaire permet aux entreprises d'offrir à leurs collaborateurs une expérience humaine et professionnelle porteuse de sens, tout en soutenant des projets concrets au Kenya et au Sénégal.
              </p>
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                Depuis plus de 20 ans, Sens Solidaires accompagne des entreprises et leurs salariés dans la réalisation de missions de volontariat au Kenya et au Sénégal. Ces missions peuvent être réalisées individuellement ou en groupe, selon les objectifs de l'entreprise et les compétences mobilisées.
              </p>
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                Dans le cadre du mécénat de compétences, l'entreprise met un salarié à disposition sur son temps de travail tout en maintenant sa rémunération et sa protection sociale. Les volontaires interviennent aux côtés de nos partenaires locaux pour contribuer à des actions en faveur de l'environnement, de l'éducation et du développement des communautés.
              </p>
              <p className="font-body text-sm text-primary/80 leading-relaxed">
                Les frais de mission sont pris en charge par l'entreprise et ouvrent droit à une réduction d'impôt de 60 % conformément à l'article 238 bis du Code Général des Impôts. Sens Solidaires accompagne chaque projet et assure la mise en place des conventions nécessaires entre l'entreprise, le salarié et l'organisme bénéficiaire.
              </p>
            </div>

            {/* Bloc contact */}
            <div className="flex flex-col gap-4 w-1/4 shrink-0 bg-surface rounded-xl p-6">
              <p className="font-heading font-bold text-primary text-base">Construisons votre projet</p>
              <p className="font-body text-sm text-primary/60">
                Notre équipe vous accompagne dans la mise en place d'un congé solidaire sur mesure.
              </p>
              <Button label="Nous contacter →" variant="secondary" fullWidth />
              <a href="https://france-volontaires.org/le-conge-de-solidarite-internationale/" target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button label="En savoir plus →" variant="secondary" fullWidth />
              </a>
            </div>

          </div>
        </section>
      )}
      <ScrollToTop />
    </div>
  )
}

export default Missions