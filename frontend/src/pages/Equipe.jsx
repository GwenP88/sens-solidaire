// Equipe.jsx
// Page équipe — direction, bureau, conseil d'administration, délégations

// ── React
import { useState, useEffect } from 'react'

// ── API
import { fetchTeamMembers, fetchDelegations } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import Carousel from '../components/ui/Carousel'
import ScrollToTop from '../components/ui/ScrollToTop'
import Section from '../components/ui/Section'
import CTASection from '../components/ui/CTASection'

// ── Composants métier
import TeamMemberCardLarge from '../components/team/TeamMemberCardLarge'
import TeamMemberCardSmall from '../components/team/TeamMemberCardSmall'
import DelegationCard from '../components/team/DelegationCard'

function Equipe() {
  const [direction, setDirection] = useState([])
  const [bureau, setBureau] = useState([])
  const [ca, setCa] = useState([])
  const [egalement, setEgalement] = useState([])
  const [delegations, setDelegations] = useState([])

  useEffect(() => {
    fetchTeamMembers('direction').then(setDirection).catch(console.error)
    fetchTeamMembers('bureau').then(setBureau).catch(console.error)
    fetchTeamMembers('ca').then(setCa).catch(console.error)
    fetchTeamMembers('egalement').then(setEgalement).catch(console.error)
    fetchDelegations().then(setDelegations).catch(console.error)
  }, [])

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image="/images/hero/hero-missions.jpg"
        title="Notre équipe"
        subtitle="Des femmes et des hommes engagés, en France et à l'international, pour un monde plus juste et la protection de la biodiversité."
      />

      {/* ── Direction — grille responsive ── */}
      <Section title="Direction">
        <div className="grid-cards-3">
          {direction.map(m => (
            <TeamMemberCardLarge
              key={m.id}
              nom={m.nom}
              role={m.role}
              description={m.description}
              avatar={m.avatar_url}
            />
          ))}
        </div>
      </Section>

      {/* ── Bureau — grille responsive ── */}
      <Section title="Membres du bureau" bg="bg-surface-mid">
        <div className="grid-cards-3">
          {bureau.map(m => (
            <TeamMemberCardLarge
              key={m.id}
              nom={m.nom}
              role={m.role}
              description={m.description}
              avatar={m.avatar_url}
              bg="bg-surface"
            />
          ))}
        </div>
      </Section>

      {/* ── Conseil d'administration — carousel toutes tailles ── */}
      <Section title="Conseil d'administration">
        <Carousel
          items={ca}
          renderSlide={(m) => (
            <TeamMemberCardSmall
              nom={m.nom}
              role={m.role}
              avatar={m.avatar_url}
            />
          )}
          slidesPerView={3}
          spaceBetween={24}
          showPagination={true}
          color="primary"
        />
      </Section>

      {/* ── Également à nos côtés — grille responsive ── */}
      <Section title="Également à nos côtés" bg="bg-surface-mid">
        <div className="grid-cards-3">
          {egalement.map(m => (
            <TeamMemberCardSmall
              key={m.id}
              nom={m.nom}
              role={m.role}
              avatar={m.avatar_url}
              bg="bg-surface"
            />
          ))}
        </div>
      </Section>

      {/* ── Délégations — carousel toutes tailles ── */}
      <Section title="Nos délégations et partenaires terrain">
        <Carousel
          items={delegations}
          renderSlide={(d) => (
            <DelegationCard
              pays={d.pays}
              flag={`https://flagcdn.com/w40/${d.flag_code}.png`}
              image={d.image_url}
              lieu={d.lieu}
              contacts={d.contacts}
            />
          )}
          slidesPerView={3}
          spaceBetween={24}
          showPagination={true}
          color="primary"
        />
      </Section>

      {/* ── CTA contact ── */}
      <CTASection
        title="Envie de rejoindre l'aventure ?"
        text="Bénévole, volontaire, enseignant, partenaire... Il existe mille façons d'agir avec nous."
        ctaLabel="Nous contacter →"
        ctaHref="/contact"
      />

      <ScrollToTop />
    </div>
  )
}

export default Equipe