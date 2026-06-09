// Home.jsx
// Page d'accueil — Hero + StatsBar + Sections

import Hero from '../components/layout/Hero'
import StatsBar from '../components/layout/StatsBar'
import MissionCard from '../components/missions/MissionCard'

function Home() {
  return (
    <div>
      {/* Hero + StatsBar — positionnement relatif pour le chevauchement */}
      <Hero />
      <StatsBar />
      {/* Section Missions */}
      <div className="bg-surface py-16 px-16">
        <MissionCard
          image="/images/kenya.jpg"
          badge="Volontariat individuel"
          title="Volontariat au Kenya"
          description="Préservation de la biodiversité et liens interculturels avec les communautés locales."
          duration="2 à 4 semaines"
          slug="kenya"
        />
      </div>
      {/* Section Témoignages */}
      {/* Section Actions terrain */}
      {/* Section Partenaires */}
    </div>
  )
}

export default Home