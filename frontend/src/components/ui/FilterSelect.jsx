// FilterSelect.jsx
// Groupe de filtres par menus déroulants — réutilisable

function FilterSelect({ filters, values, onChange }) {
  return (
    <div className="flex gap-6">
      {filters.map((filter) => {
        // Filtre conditionnel — n'affiche pas si la condition n'est pas remplie
        if (filter.condition && !filter.condition(values)) return null

        return (
          <select
            key={filter.key}
            value={values[filter.key] || ''}
            onChange={e => onChange(filter.key, e.target.value || null)}
            className="font-body text-sm text-primary bg-surface border border-surface-dark rounded-xl px-4 py-1 cursor-pointer"
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