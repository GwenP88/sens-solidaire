// StatsBar.jsx
// Barre de statistiques d'impact — 4 compteurs

function StatsBar() {

  const stats = [
    { number: '120+', label: "Actions réalisées" },
    { number: '10 000+', label: "Bénéficiares" },
    { number: '20+', label: "Ans d'expérience"  },
    { number: '12 000+', label: "Jeunes sensibilisés" }
  ]

  return (
    <div className="bg-primary flex justify-around items-center px-16 py-8">
      {stats.map((stat) => (
        <div key={stat.number}>
          <p className="font-heading font-bold text-surface text-4xl">{stat.number}</p>
          <p className="font-body text-surface-dark text-sm uppercase tracking-widest">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsBar