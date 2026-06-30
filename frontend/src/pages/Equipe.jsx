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
      <section className="padding-y padding-x bg-surface">
        <h2 className="h2-style text-primary mb-8">Direction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>

      {/* ── Bureau — grille responsive ── */}
      <section className="padding-y padding-x bg-surface-mid">
        <h2 className="h2-style text-primary mb-8">Membres du bureau</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>

      {/* ── Conseil d'administration — carousel toutes tailles ── */}
      <section className="padding-y padding-x bg-surface">
        <h2 className="h2-style text-primary mb-8">Conseil d'administration</h2>
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
      </section>

      {/* ── Également à nos côtés — grille responsive ── */}
      <section className="padding-y padding-x bg-surface-mid">
        <h2 className="h2-style text-primary mb-8">Également à nos côtés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>

      {/* ── Délégations — carousel toutes tailles ── */}
      <section className="padding-y padding-x bg-surface">
        <h2 className="h2-style text-primary mb-8">Nos délégations et partenaires terrain</h2>
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
      </section>

      {/* ── CTA contact ── */}
      <section className="padding-y padding-x bg-accent-2">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div>
            <h2 className="h2-style text-surface">Envie de rejoindre l'aventure ?</h2>
            <p className="text-body text-surface/80">Bénévole, volontaire, enseignant, partenaire... Il existe mille façons d'agir avec nous.</p>
          </div>
          <a href="/contact">
            <Button label="Nous contacter →" variant="primary" />
          </a>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default Equipe