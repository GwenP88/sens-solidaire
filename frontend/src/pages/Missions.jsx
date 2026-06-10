// Missions.jsx
// Page liste des missions — Hero + 4 sections par type de mission

import { useState, useEffect } from 'react'
import { fetchMissions } from '../services/api'
import MissionCard from '../components/missions/MissionCard'
import HeroPage from '../components/layout/HeroPage'
import { COUNTRY_IMAGES, getDuration, TYPE_LABELS } from '../utils/missions'


// Sections dans l'ordre d'affichage
const SECTIONS = [
  {
    key: 'individuel',
    label: 'Volontariat individuel',
    description: 'Partez seul ou à plusieurs pour une expérience humaine unique au contact des communautés locales.',
    types: ['volontariat_individuel'],
  },
  {
    key: 'service_civique',
    label: 'Service civique',
    description: 'Engagez-vous 6 à 12 mois à l\'international pour l\'éducation au développement durable. Ouvert aux 16-25 ans.',
    types: ['service_civique'],
  },
  {
    key: 'groupe_jeunes',
    label: 'Groupe jeune',
    description: 'Partez en groupe avec votre établissement scolaire ou votre association de jeunesse.',
    types: ['groupe_jeunes'],
  },
  {
    key: 'conge_solidaire',
    label: 'Congé solidaire',
    description: 'Mobilisez vos collaborateurs sur une mission courte et impactante pendant leur temps de travail.',
    types: ['conge_solidaire'],
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
                  image={COUNTRY_IMAGES[mission.country]}
                  badge={TYPE_LABELS[mission.type] || mission.type}
                  duration={getDuration(mission.pricing)}
                />
              ))}
            </div>
          </section>
        )
      })}

    </div>
  )
}

export default Missions