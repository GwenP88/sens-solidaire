// StatsBar.jsx
// Barre de statistiques d'impact — chiffres clés de l'association

// ── Données statiques — chiffres clés (contenu fixe, mis à jour manuellement)
const STATS = [
  { number: '120+', label: "Actions réalisées" },
  { number: '10 000+', label: "Bénéficiaires" },
  { number: '20+', label: "Ans d'expérience" },
  { number: '12 000+', label: "Jeunes sensibilisés" },
  { number: '1 800+', label: "Arbres plantés" },
]

function StatsBar() {
  return (
    // ── Bande verte foncée avec les compteurs répartis sur toute la largeur
    <div className="bg-primary flex flex-wrap justify-around items-center px-6 md:px-16 py-6 md:py-8 gap-6 md:gap-0">
      {STATS.map(stat => (
        <div key={stat.number}>
          {/* Chiffre principal */}
          <p className="text-stat text-surface">{stat.number}</p>
          {/* Label descriptif */}
          <p className="text-label text-surface-dark">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsBar