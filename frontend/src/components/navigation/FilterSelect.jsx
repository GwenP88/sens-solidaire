// FilterSelect.jsx
// Groupe de filtres par menus déroulants — réutilisable sur plusieurs pages
// Props :
//   filters  : [{ key, placeholder, options: [{ value, label }], condition? }]
//   values   : objet des valeurs actives { [key]: value }
//   onChange : fonction appelée avec (key, value) au changement

function FilterSelect({ filters, values, onChange }) {
  return (
    // ── Conteneur — empilé pleine largeur en mobile, en ligne à partir de 768px
    <div className="flex flex-col md:flex-row gap-3 md:gap-6">
      {filters.map(filter => {

        // ── Filtre conditionnel — masqué si la condition n'est pas remplie
        if (filter.condition && !filter.condition(values)) return null

        return (
          <select
            key={filter.key}
            value={values[filter.key] || ''}
            onChange={e => onChange(filter.key, e.target.value || null)}
            className="w-full md:w-52 lg:w-60 xl:w-72 text-body text-primary bg-surface border border-surface-dark rounded-xl px-4 py-1 cursor-pointer"
          >
            {/* Option par défaut — remet le filtre à null */}
            <option value="">{filter.placeholder}</option>

            {/* Options disponibles */}
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