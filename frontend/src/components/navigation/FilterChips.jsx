// FilterChips.jsx
// Puces filtrantes réutilisables — scroll horizontal sur mobile, wrap à partir de lg
// Props :
//   filters  : [{ label: string, value: any }]
//   active   : valeur active (null = toutes)
//   onChange : fonction appelée au clic avec la nouvelle valeur
//   variant  : "light" (défaut) | "dark"

function FilterChips({ filters, active, onChange, variant = 'light', nowrap = false }) {
  return (
    <div className={`flex gap-3 overflow-x-auto pb-3 scrollbar-hide ${nowrap ? 'flex-nowrap' : 'lg:flex-wrap'}`}>
      {filters.map(f => (
        <button
          key={f.label}
          onClick={() => onChange(f.value)}
          className={`link-nav px-4 py-2 rounded-full border transition-colors shrink-0 ${
            variant === 'dark'
              ? active === f.value
                ? 'bg-surface text-primary border-surface'
                : 'bg-transparent text-surface border-surface hover:bg-surface/10'
              : active === f.value
                ? 'bg-primary text-surface border-primary'
                : 'bg-transparent text-primary border-primary hover:bg-primary/10'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export default FilterChips