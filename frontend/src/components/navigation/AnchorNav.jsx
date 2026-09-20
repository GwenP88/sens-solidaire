// AnchorNav.jsx
// Barre de navigation d'ancrage interne — défilement doux vers les sections
// Utilisée sur les pages longues : MissionDetail, Soutenir (variant light/dark)
// et le dashboard (variant dashboard — carte arrondie, pas collée au bloc suivant)
// Props :
//   sections : [{ label: string, id: string }]
//   variant  : "light" (défaut, bg-surface) | "dark" (bg-primary) | "dashboard"

const VARIANT_STYLES = {
  light: {
    wrapper: 'bg-surface border-b border-surface-dark',
    link: 'text-primary/60 hover:text-primary hover:border-accent',
  },
  dark: {
    wrapper: 'bg-primary border-b border-surface/10',
    link: 'text-surface/60 hover:text-surface hover:border-surface',
  },
  dashboard: {
    wrapper: 'bg-white border border-gray-200 rounded-xl mb-6',
    link: 'text-dash-legend hover:text-dash-action hover:border-dash-action',
  },
}

function AnchorNav({ sections, variant = 'light' }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.light

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 50
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const isDashboard = variant === 'dashboard'

  return (
    <div className={`sticky top-0 z-10 shadow-sm ${styles.wrapper}`}>
      <div className={`flex gap-xs overflow-x-auto scroll-pb lg:pb-0 ${isDashboard ? 'px-2 justify-center' : 'padding-x'}`}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            className={`link-nav whitespace-nowrap border-b-2 border-transparent transition-colors ${isDashboard ? 'px-2 py-3 text-sm' : 'px-4 py-4'} ${styles.link}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AnchorNav