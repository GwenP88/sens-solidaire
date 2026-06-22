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
import ScrollToTop from '../components/ui/ScrollToTop'

// ── Composants métier
import TeamMemberCardLarge from '../components/team/TeamMemberCardLarge'
import TeamMemberCardSmall from '../components/team/TeamMemberCardSmall'
import DelegationCard from '../components/team/DelegationCard'

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
        image="/images/hero/hero-missions.jpg"
        title="Notre équipe"
        subtitle="Des femmes et des hommes engagés, en France et à l'international, pour un monde plus juste et la protection de la biodiversité."
      />

      {/* ── Direction — cards larges 3 colonnes ── */}
      <section className="section-padding bg-surface">
        <h2 className="section-title text-primary mb-8">Direction</h2>
        <div className="grid grid-cols-3 gap-6">
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

      {/* ── Bureau — cards larges 3 colonnes, fond inversé ── */}
      <section className="section-padding bg-surface-mid">
        <h2 className="section-title text-primary mb-8">Membres du bureau</h2>
        <div className="grid grid-cols-3 gap-6">
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

      {/* ── Conseil d'administration — cards compactes 4 colonnes ── */}
      <section className="section-padding bg-surface">
        <h2 className="section-title text-primary mb-8">Conseil d'administration</h2>
        <div className="grid grid-cols-4 gap-6">
          {ca.map(m => (
            <TeamMemberCardSmall
              key={m.id}
              nom={m.nom}
              role={m.role}
              avatar={m.avatar_url}
            />
          ))}
        </div>
      </section>

      {/* ── Également à nos côtés — cards compactes 3 colonnes ── */}
      <section className="section-padding bg-surface-mid">
        <h2 className="section-title text-primary mb-8">Également à nos côtés</h2>
        <div className="grid grid-cols-3 gap-6">
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

      {/* ── Délégations internationales — cards immersives 3 colonnes ── */}
      <section className="section-padding bg-surface">
        <h2 className="section-title text-primary mb-8">Nos délégations et partenaires terrain</h2>
        <div className="grid grid-cols-3 gap-6">
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
      </section>

      {/* ── CTA contact ── */}
      <section className="section-padding bg-accent-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-title text-surface mb-2">Envie de rejoindre l'aventure ?</h2>
            <p className="font-body text-surface/80 text-sm">Bénévole, volontaire, enseignant, partenaire... Il existe mille façons d'agir avec nous.</p>
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