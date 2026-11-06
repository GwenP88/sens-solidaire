// YouTubeLinksField.jsx
// Saisie de vidéos YouTube dans un formulaire du dashboard (tâche 123) — la cliente colle un lien, l'aperçu de la miniature confirme qu'il est reconnu.

import { FiTrash2 } from 'react-icons/fi'
import { getYouTubeId, getYouTubeThumbnail } from '../../utils/youtube'

const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30 w-full'

// Props :
//   value    : [{ file_url, label }]
//   onChange : (nouvelleListe) => void
//   max      : nombre maximum de vidéos (même limite que le serveur)
//   error    : message affiché sous la liste
//   disabled : true → ajout impossible (ex. la carte ouvre un lien : pas de page article)
function YouTubeLinksField({ value, onChange, max = 5, error, disabled = false }) {
  const updateRow = (index, field, fieldValue) =>
    onChange(value.map((row, i) => (i === index ? { ...row, [field]: fieldValue } : row)))

  const removeRow = (index) => onChange(value.filter((_, i) => i !== index))

  const addRow = () => onChange([...value, { file_url: '', label: '' }])

  return (
    <div className="flex flex-col gap-3">
      {value.map((row, i) => {
        const id = getYouTubeId(row.file_url)
        const isInvalid = row.file_url.trim() !== '' && !id

        return (
          <div key={i} className="flex flex-col sm:flex-row gap-3 p-3 bg-white border border-gray-200 rounded-lg">
            {/* Miniature : preuve visuelle que le lien est bien reconnu */}
            <div className="w-full sm:w-32 aspect-video shrink-0 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
              {id
                ? <img src={getYouTubeThumbnail(id)} alt="" className="w-full h-full object-cover" />
                : <span className="text-xs text-dash-legend text-center px-2">Aperçu de la vidéo</span>}
            </div>

            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <label className="flex flex-col gap-1 text-sm font-medium text-dash-text">
                Lien de la vidéo YouTube
                <input
                  type="url"
                  value={row.file_url}
                  onChange={e => updateRow(i, 'file_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`${inputClass} ${isInvalid ? 'border-red-400' : ''}`}
                />
              </label>
              {isInvalid && (
                <span className="text-xs text-red-500">
                  Ce lien n'est pas reconnu. Sur YouTube, cliquez sur « Partager », puis « Copier », et collez le lien ici.
                </span>
              )}
              <label className="flex flex-col gap-1 text-sm font-medium text-dash-text">
                <span>Titre de la vidéo <span className="text-dash-legend font-normal text-xs">(facultatif, affiché au-dessus du lecteur)</span></span>
                <input
                  type="text"
                  value={row.label}
                  onChange={e => updateRow(i, 'label', e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => removeRow(i)}
              className="self-end sm:self-start p-2.5 text-dash-legend hover:text-dash-danger hover:bg-dash-danger/10 rounded"
              aria-label="Retirer cette vidéo"
              title="Retirer cette vidéo"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        )
      })}

      {value.length < max && !disabled && (
        <button
          type="button"
          onClick={addRow}
          className="self-start px-4 py-2 text-sm text-dash-action border border-dash-action rounded-lg hover:bg-dash-action/10 transition-colors"
        >
          + Ajouter une vidéo
        </button>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

export default YouTubeLinksField
