// FilterChips.jsx
// Puces filtrantes réutilisables — puce active = couleur unie / inactive = contour
// Props :
//   filters  : [{ label: string, value: any }]
//   active   : valeur active (null = toutes)
//   onChange : fonction appelée au clic avec la nouvelle valeur
//   variant  : "light" (défaut, fond clair) | "dark" (fond foncé bg-primary)

function FilterChips({ filters, active, onChange, variant = 'light' }) {
  return (
    // ── Conteneur flex — les puces passent à la ligne si débordement
    <div className="flex gap-3 flex-wrap">
      {filters.map(f => (

        // ── Puce individuelle — style adapté selon variant et état actif
        <button
          key={f.label}
          onClick={() => onChange(f.value)}
          className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
            variant === 'dark'
              ? active === f.value
                ? 'bg-surface text-primary border-surface'           // actif sur fond sombre
                : 'bg-transparent text-surface border-surface hover:bg-surface/10' // inactif sur fond sombre
              : active === f.value
                ? 'bg-primary text-surface border-primary'           // actif sur fond clair
                : 'bg-transparent text-primary border-primary hover:bg-primary/10' // inactif sur fond clair
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export default FilterChips