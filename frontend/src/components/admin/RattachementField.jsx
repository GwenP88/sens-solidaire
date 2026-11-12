// RattachementField.jsx
// Cases « France » / « Suisse » des formulaires du dashboard (tâche 172D) — sections Éducation, projets réalisés, articles.

import { toCheckboxes, fromCheckboxes } from '../../utils/rattachement'

// Props :
//   value    : 'FRANCE' | 'SUISSE' | 'COMMUN' | null
//   onChange : (nouvelleValeur) => void
//   error    : message affiché sous les cases
function RattachementField({ value, onChange, error }) {
  const checked = toCheckboxes(value)

  const toggle = (country) => onChange(fromCheckboxes({ ...checked, [country]: !checked[country] }))

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="sr-only">Pages pays</legend>
      <div className="flex flex-wrap gap-6">
        {[
          { key: 'france', label: 'France' },
          { key: 'suisse', label: 'Suisse' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm text-dash-text cursor-pointer">
            <input
              type="checkbox"
              checked={checked[key]}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-dash-action"
            />
            {label}
          </label>
        ))}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </fieldset>
  )
}

export default RattachementField
