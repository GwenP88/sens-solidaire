// Equipe.jsx
// Page équipe — direction, bureau, conseil d'administration, délégations

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchTeamMembers, fetchDelegations } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import ScrollToTop from '../components/ui/ScrollToTop'
import Section from '../components/ui/Section'
import AnchorNav from '../components/navigation/AnchorNav'

// ── Composants métier
import TeamMemberCard from '../components/team/TeamMemberCard'
import DelegationCard from '../components/team/DelegationCard'

// ── Sections de l'AnchorNav
const ANCHOR_SECTIONS = [
  { label: "Direction",                id: "direction"   },
  { label: "Bureau",                   id: "bureau"      },
  { label: "Conseil d'administration", id: "ca"          },
  { label: "Également à nos côtés",    id: "egalement"   },
  { label: "Délégations",              id: "delegations" },
]

function Equipe() {
  // ── État local — membres par catégorie + délégations
  const [direction, setDirection] = useState([])
  const [bureau, setBureau] = useState([])
  const [ca, setCa] = useState([])
  const [egalement, setEgalement] = useState([])
  const [delegations, setDelegations] = useState([])

  // ── Chargement de toutes les données en parallèle au montage
  useEffect(() => {
    fetchTeamMembers('direction').then(setDirection).catch(console.error)
    fetchTeamMembers('bureau').then(setBureau).catch(console.error)
    fetchTeamMembers('ca').then(setCa).catch(console.error)
    fetchTeamMembers('egalement').then(setEgalement).catch(console.error)
    fetchDelegations().then(setDelegations).catch(console.error)
  }, [])

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image="/images/design/hero/hero-missions.jpg"
        title="Notre équipe"
        subtitle="Des femmes et des hommes engagés, en France et à l'international, pour un monde plus juste et la protection de la biodiversité."
      />

      {/* ── Navigation par ancre ── */}
      <AnchorNav sections={ANCHOR_SECTIONS} variant="dark" />

      {/* ── Direction — cards larges, 3 colonnes ── */}
      <Section title="Direction" id="direction">
        <div className="grid-cards-3">
          {direction.map(m => (
            <TeamMemberCard
              key={m.id}
              variant="large"
              nom={m.nom}
              role={m.role}
              description={m.description}
              avatar={m.avatar_url}
            />
          ))}
        </div>
      </Section>

      {/* ── Bureau — cards larges, 3 colonnes, fond inversé ── */}
      <Section title="Membres du bureau" bg="bg-surface-mid" id="bureau">
        <div className="grid-cards-3">
          {bureau.map(m => (
            <TeamMemberCard
              key={m.id}
              variant="large"
              nom={m.nom}
              role={m.role}
              description={m.description}
              avatar={m.avatar_url}
              bg="bg-surface"
            />
          ))}
        </div>
      </Section>

      {/* ── Conseil d'administration — cards compactes, 4 colonnes ── */}
      <Section title="Conseil d'administration" id="ca">
        <div className="grid-cards-4">
          {ca.map(m => (
            <TeamMemberCard
              key={m.id}
              variant="small"
              nom={m.nom}
              role={m.role}
              avatar={m.avatar_url}
            />
          ))}
        </div>
      </Section>

      {/* ── Également à nos côtés — cards compactes, 4 colonnes, fond inversé ── */}
      <Section title="Également à nos côtés" bg="bg-surface-mid" id="egalement">
        <div className="grid-cards-4">
          {egalement.map(m => (
            <TeamMemberCard
              key={m.id}
              variant="small"
              nom={m.nom}
              role={m.role}
              avatar={m.avatar_url}
              bg="bg-surface"
            />
          ))}
        </div>
      </Section>

      {/* ── Délégations — cards immersives, 4 colonnes ── */}
      <Section title="Nos délégations et partenaires terrain" id="delegations">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
          {delegations.map(d => (
            <DelegationCard
              key={d.id}
              pays={d.pays}
              flag={`https://flagcdn.com/w40/${d.flag_code}.png`}
              image={d.image_url}
              lieu={d.lieu}
              contacts={d.contacts}
            />
          ))}
        </div>
      </Section>

      <ScrollToTop />
    </div>
  )
}

export default Equipe