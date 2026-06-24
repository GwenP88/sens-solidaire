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
    <div className="bg-primary lex flex-wrap justify-around items-center px-6 md:px-16 py-6 md:py-8 gap-6 md:gap-0">
      {STATS.map(stat => (
        <div key={stat.number}>
          {/* Chiffre principal */}
          <p className="font-heading font-bold text-surface text-2xl md:text-4xl">{stat.number}</p>
          {/* Label descriptif */}
          <p className="font-body text-surface-dark text-sm uppercase tracking-widest">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsBar