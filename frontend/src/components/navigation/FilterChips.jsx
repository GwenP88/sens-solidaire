// FilterChips.jsx
// Puces filtrantes réutilisables — puce active = couleur unie / inactive = contour
// Props :
//   filters  : [{ label: string, value: any }]
//   active   : valeur active (null = toutes)
//   onChange : fonction appelée au clic avec la nouvelle valeur

function FilterChips({ filters, active, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.label}
          onClick={() => onChange(f.value)}
          className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
            active === f.value
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