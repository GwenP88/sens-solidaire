// FilterSelect.jsx
// Groupe de filtres par menus déroulants — réutilisable sur plusieurs pages
// Props :
//   filters  : [{ key, placeholder, options: [{ value, label }], condition? }]
//   values   : objet des valeurs actives { [key]: value }
//   onChange : fonction appelée avec (key, value) au changement

function FilterSelect({ filters, values, onChange }) {
  return (
    // ── Conteneur — empilé pleine largeur en mobile, en ligne à partir de 768px
    <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row gap-xs lg:gap-lg">
      {filters.map(filter => {

        if (filter.condition && !filter.condition(values)) return null

        return (
          <select
            key={filter.key}
            value={values[filter.key] || ''}
            onChange={e => onChange(filter.key, e.target.value || null)}
            className="w-full lg:w-60 xl:w-72 text-body text-primary bg-surface border border-surface-dark rounded-xl px-4 py-1 cursor-pointer"
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )
      })}
    </div>
  )
}

export default FilterSelect