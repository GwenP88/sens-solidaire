// ButtonLinksField.jsx
// Saisie des boutons d'une section Éducation (tâche 172A) : texte + lien OU document importé, 3 au maximum — même présentation que YouTubeLinksField.

import { FiTrash2 } from 'react-icons/fi'
import AdminFileUpload from './AdminFileUpload'
import { isValidButtonUrl } from '../../utils/validation'

const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30 w-full'

// Deux façons de remplir un bouton — le choix ne sert qu'au formulaire : en base, seul le lien est enregistré
const KINDS = [
  { value: 'link', label: 'Lien vers une page' },
  { value: 'document', label: 'Document à importer' },
]

// Props :
//   value    : [{ label, url, kind: 'link' | 'document' }]
//   onChange : (nouvelleListe) => void
//   max      : nombre maximum de boutons (même limite que le serveur)
//   error    : message affiché sous la liste
function ButtonLinksField({ value, onChange, max = 3, error }) {
  const updateRow = (index, changes) =>
    onChange(value.map((row, i) => (i === index ? { ...row, ...changes } : row)))

  const removeRow = (index) => onChange(value.filter((_, i) => i !== index))

  const addRow = () => onChange([...value, { label: '', url: '', kind: 'link' }])

  return (
    <div className="flex flex-col gap-3">
      {value.map((row, i) => {
        const isInvalid = row.kind === 'link' && row.url.trim() !== '' && !isValidButtonUrl(row.url)

        return (
          <div key={i} className="flex flex-col sm:flex-row gap-3 p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex-1 flex flex-col gap-3 min-w-0">

              <label className="flex flex-col gap-1 text-sm font-medium text-dash-text">
                <span>
                  Texte du bouton
                  {i === 0 && <span className="text-dash-legend font-normal text-xs ml-1">(premier bouton : mis en avant, en orange)</span>}
                </span>
                <input
                  type="text"
                  value={row.label}
                  onChange={e => updateRow(i, { label: e.target.value })}
                  placeholder="ex. : Nous contacter"
                  className={inputClass}
                />
              </label>

              {/* Choix : lien ou document — changer de choix vide le lien précédent */}
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Le bouton mène à">
                {KINDS.map(kind => (
                  <button
                    key={kind.value}
                    type="button"
                    role="radio"
                    aria-checked={row.kind === kind.value}
                    onClick={() => row.kind !== kind.value && updateRow(i, { kind: kind.value, url: '' })}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      row.kind === kind.value
                        ? 'bg-dash-action text-white border-dash-action'
                        : 'border-gray-300 text-dash-legend hover:border-dash-action hover:text-dash-action'
                    }`}
                  >
                    {kind.label}
                  </button>
                ))}
              </div>

              {row.kind === 'link' ? (
                <label className="flex flex-col gap-1 text-sm font-medium text-dash-text">
                  Lien du bouton
                  <input
                    type="text"
                    value={row.url}
                    onChange={e => updateRow(i, { url: e.target.value })}
                    placeholder="ex. : https://www.eco-ecole.org"
                    className={`${inputClass} ${isInvalid ? 'border-red-400' : ''}`}
                  />
                  <span className="text-xs text-dash-legend font-normal">
                    Pour un autre site : copiez l'adresse complète depuis votre navigateur. Pour une page de ce site : commencez par « / » (ex. : /contact).
                  </span>
                  {isInvalid && (
                    <span className="text-xs text-red-500 font-normal">
                      Ce lien n'est pas reconnu. L'adresse d'un autre site commence par https://
                    </span>
                  )}
                </label>
              ) : (
                <AdminFileUpload
                  value={row.url ? [{ file_url: row.url, label: '' }] : []}
                  onChange={(files) => updateRow(i, { url: files[0]?.file_url || '' })}
                  accept="application/pdf"
                  maxFiles={1}
                  showLabel={false}
                  helperText="Document au format PDF, 20 Mo maximum."
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => removeRow(i)}
              className="self-end sm:self-start p-2.5 text-dash-legend hover:text-dash-danger hover:bg-dash-danger/10 rounded"
              aria-label="Retirer ce bouton"
              title="Retirer ce bouton"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        )
      })}

      {value.length < max && (
        <button
          type="button"
          onClick={addRow}
          className="self-start px-4 py-2 text-sm text-dash-action border border-dash-action rounded-lg hover:bg-dash-action/10 transition-colors"
        >
          + Ajouter un bouton
        </button>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

export default ButtonLinksField
