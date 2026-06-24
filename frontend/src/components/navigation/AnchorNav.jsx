// AnchorNav.jsx
// Barre de navigation d'ancrage interne — défilement doux vers les sections
// Utilisée sur les pages longues : MissionDetail, Soutenir...
// Props :
//   sections : [{ label: string, id: string }]
//   variant  : "light" (défaut, bg-surface) | "dark" (bg-primary)

function AnchorNav({ sections, variant = 'light' }) {

  // ── Scroll doux vers la section cible avec offset pour la navbar sticky
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 50
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    // ── Barre sticky — reste visible au scroll, fond adapté au variant
    <div className={`sticky top-0 z-10 border-b shadow-sm ${
      variant === 'dark'
        ? 'bg-primary border-surface/10'
        : 'bg-surface border-surface-dark'
    }`}>

      {/* ── Liste des liens d'ancrage — scroll horizontal si débordement ── */}
      <div className="flex gap-1 px-4 md:px-16 overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            className={`link-nav px-4 py-4 whitespace-nowrap border-b-2 border-transparent transition-colors ${
              variant === 'dark'
                ? 'text-surface/60 hover:text-surface hover:border-surface'
                : 'text-primary/60 hover:text-primary hover:border-accent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AnchorNav