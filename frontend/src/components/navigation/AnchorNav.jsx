// AnchorNav.jsx
// Barre de navigation d'ancrage interne — défilement doux vers les sections
// Utilisée sur les pages longues : MissionDetail, LocationDetail...
// Props :
//   sections : [{ label: string, id: string }]

function AnchorNav({ sections }) {

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-surface border-b border-surface-dark shadow-sm">
      <div className="flex gap-1 px-16 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            className="font-body text-sm text-primary/60 hover:text-primary px-4 py-4 whitespace-nowrap border-b-2 border-transparent hover:border-accent transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AnchorNav