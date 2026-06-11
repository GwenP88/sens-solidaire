// Missions.jsx
// Page liste des missions — Hero + 4 sections par type de mission

import { useState, useEffect } from 'react'
import { fetchMissions } from '../services/api'
import MissionCard from '../components/missions/MissionCard'
import HeroPage from '../components/layout/HeroPage'
import { getDuration, TYPE_LABELS } from '../utils/missions'
import Button from '../components/ui/Button'
import { IconPerson, IconClock, IconPin, IconMoney, IconFrance, IconAbroad, IconGrow } from '../utils/icons'


// Sections dans l'ordre d'affichage
const SECTIONS = [
  {
    key: 'individuel',
    label: 'Volontariat individuel',
    description: 'Partez seul ou à plusieurs pour une expérience humaine unique au contact des communautés locales.',
    types: ['volontariat_individuel'],
  },
]

function Missions() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="bg-surface min-h-screen">

      {/* Hero page */}
      <HeroPage
        image="/images/hero_missions.jpg"
        title="Nos missions"
        subtitle="Agissez pour la Biodiversité : Engagez-vous avec nous et nos partenaires dans des missions variées, pour un but commun : la protection de la biodiversité."
      />

      {/* 4 sections par type */}
      {SECTIONS.map((section) => {
        // Filtre les missions correspondant aux types de cette section
        const sectionMissions = missions.filter(m => section.types.includes(m.type))

        // Cache la section si aucune mission
        if (sectionMissions.length === 0) return null

        return (
          <section key={section.key} className="section-padding bg-surface">
            <div className="mb-10">
              <h2 className="section-title text-primary">{section.label}</h2>
              <p className="section-subtitle text-primary/70">{section.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {sectionMissions.map((mission) => (
                <MissionCard
                  key={mission.slug}
                  slug={mission.slug}
                  title={mission.title}
                  description={mission.short_description}
                  image={mission.image_url}
                  badge={TYPE_LABELS[mission.type]}
                  duration={getDuration(mission.pricing)}
                  ctaLabel="Je candidate →"
                  ctaUrl="https://www.service-civique.gouv.fr"
                />
              ))}
            </div>
          </section>
        )
      })}
      
      {/* Section Service civique */}
      <section className="section-padding bg-surface-mid">

        {/* Bloc hero — titre + infos + image */}
        <div className="flex gap-16 items-center mb-16">
          <div className="flex flex-col gap-6 flex-1">
            <div>
              <h2 className="section-title text-primary">Service Civique</h2>
              <p className="section-subtitle text-primary/80 mt-2">
                Le Service Civique, c'est l'opportunité de s'engager concrètement pour la société, sans condition de diplôme. Entre 16 et 25 ans (jusqu'à 30 ans en situation de handicap), partez en mission avec Sens Solidaire et vivez une expérience humaine unique de 6 à 12 mois à raison d'au moins 24h hebdomadaires, en France puis à l'étranger (3 mois minimum chacun).
                <span className="text-accent font-semibold"> Ouvert aux 16-25 ans.</span>
              </p>
            </div>
            <div className="flex gap-8">
                <span className="font-body text-sm text-primary/70 flex flex-col items-center gap-1">
                  <IconPerson className="text-primary text-xl" /><span>16-25 ans</span>
                </span>
                <span className="font-body text-sm text-primary/70 flex flex-col items-center gap-1">
                  <IconClock className="text-primary text-xl" /><span>6 à 12 mois</span>
                </span>
                <span className="font-body text-sm text-primary/70 flex flex-col items-center gap-1">
                  <IconPin className="text-primary text-xl" /><span>France & étranger</span>
                </span>
                <span className="font-body text-sm text-primary/70 flex flex-col items-center gap-1">
                  <IconMoney className="text-primary text-xl" /><span>Indemnité mensuelle</span>
                </span>
            </div>
            <div className="flex gap-4">
              <a href="https://www.service-civique.gouv.fr/trouver-ma-mission/education-au-developpement-durable-pour-les-scolaires-mission-kenya-senegal-cote-divoire-69ef2a8c972b1-68163269c2b5bb451540d603" target="_blank" rel="noopener noreferrer">
                <Button label="Candidater →" variant="primary" />
              </a>
              <Button label="Nous contacter →" variant="secondary" />
            </div>
          </div>
          <div className="w-2/5 shrink-0">
            <img src="/images/service_civique.jpg" alt="Service civique" className="w-full h-72 object-cover rounded-xl" />
          </div>
        </div>

        {/* Comment ça fonctionne */}
        <h3 className="font-heading font-bold text-primary text-2xl text-center mb-8">Comment ça fonctionne ?</h3>
        <div className="grid grid-cols-3 gap-6 mb-16 items-stretch">

          {/* Étape 1 — Mission en France */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3 h-full">
            <div className="flex items-center gap-6">
              <IconFrance className="text-primary text-3xl shrink-0" />
              <span className="font-heading font-bold text-primary text-2xl">1</span>
              <div>
                <h4 className="font-heading font-bold text-primary text-base">Mission en France</h4>
                <p className="font-body text-sm text-primary/60">Agir et sensibiliser</p>
              </div>
            </div>
            <p className="font-body text-sm text-primary/70 min-h-[80px]">
              Basé(e) à Nice ou Annemasse, vous intervenez auprès des scolaires pour leur faire découvrir le monde et les enjeux du développement durable — avant de partir à l'aventure sur le terrain.
            </p>
            <ul className="flex flex-col gap-1">
              {[
                'Animations pédagogiques sur les 17 ODD',
                'Interventions scolaires — correspondances étrangères',
                'Communication et promotion sur les réseaux',
                'Démarchage de nouveaux partenaires',
                'Aide à la recherche de fonds',
              ].map(item => (
                <li key={item} className="font-body text-sm text-primary/70">- {item}</li>
              ))}
            </ul>
          </div>

          {/* Étape 2 — Mission à l'étranger */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3 h-full">
            <div className="flex items-center gap-6">
              <IconAbroad className="text-primary text-3xl shrink-0" />
              <span className="font-heading font-bold text-primary text-2xl">2</span>
              <div>
                <h4 className="font-heading font-bold text-primary text-base">Mission à l'étranger</h4>
                <p className="font-body text-sm text-primary/60">Découvrir et contribuer</p>
              </div>
            </div>
            <p className="font-body text-sm text-primary/70 min-h-[80px]">
              Cap sur le Kenya ou le Sénégal pour 3 mois minimum. Au Kenya, au cœur du sanctuaire LUMO et du campus de Taita Taveta. Au Sénégal, aux côtés de l'association AGADA en Casamance.
            </p>
            <ul className="flex flex-col gap-1">
              {[
                'Coordination des correspondances scolaires France-étranger',
                'Suivi des activités du partenaire local',
                'Développement de projets biodiversité locaux',
                'Accueil des volontaires en mission courte',
              ].map(item => (
                <li key={item} className="font-body text-sm text-primary/70">- {item}</li>
              ))}
            </ul>
          </div>

          {/* Étape 3 — Grandir et s'engager */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3 h-full">
            <div className="flex items-center gap-6">
              <IconGrow className="text-primary text-3xl shrink-0" />
              <span className="font-heading font-bold text-primary text-2xl">3</span>
              <div>
                <h4 className="font-heading font-bold text-primary text-base">Grandir et s'engager</h4>
                <p className="font-body text-sm text-primary/60">Développer ses compétences</p>
              </div>
            </div>
            <p className="font-body text-sm text-primary/70 min-h-[80px]">
              Partez avec des valeurs, revenez avec des compétences. Le Service Civique, c'est une expérience qui compte vraiment — pour vous, pour les autres, et pour votre avenir.
            </p>
            <ul className="flex flex-col gap-1">
              {[
                'Chargé(e) de projets et mission de terrain',
                'Éducation au Développement Durable',
                'Coopération territoriale et internationale',
                'Communication et recherche de fonds',
              ].map(item => (
                <li key={item} className="font-body text-sm text-primary/70">- {item}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Destinations */}
        <h3 className="font-heading font-bold text-primary text-2xl text-center mb-8">Nos destinations Service Civique</h3>
        <div className="grid grid-cols-2 gap-6">
          {missions.filter(m => m.type === 'service_civique').map((mission) => (
            <MissionCard
              key={mission.slug}
              slug={mission.slug}
              title={mission.title}
              description={mission.short_description}
              image={mission.image_url}
              badge={TYPE_LABELS[mission.type] || mission.type}
              duration={getDuration(mission.pricing)}
              ctaLabel="Je candidate →"
              ctaUrl="https://www.service-civique.gouv.fr"
            />
          ))}
        </div>

      </section>
    </div>
  )
}

export default Missions