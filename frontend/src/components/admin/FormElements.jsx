// FormElements.jsx
// Composants de formulaire partagés — utilisés par MissionFormPage,
// ServiceCiviqueFormPage, et tout futur formulaire admin.

import { previewShortDescription, CUT_MARKER } from '../../utils/shortDescription'

export function FormSection({ title, description, children, tone = 'bg-dash-action/5', id }) {
  return (
    <div id={id} className={`form-section flex flex-col gap-4 p-6 rounded-xl border border-gray-200 ${tone} transition-colors`}>
      <div className="border-b border-gray-200 pb-2">
        <h2 className="font-heading font-semibold text-base text-dash-title">{title}</h2>
        {description && <p className="text-xs text-dash-legend mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// error : message de validation à afficher sous le champ (texte rouge)
export function Field({ label, name, value, onChange, required, hint, pattern, title: fieldTitle, error, autoComplete, list, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-dash-text">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-dash-legend font-normal ml-1 text-xs">({hint})</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        pattern={pattern}
        title={fieldTitle}
        autoComplete={autoComplete}
        list={list}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-dash-action/30'
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

export function TextareaField({ label, name, value, onChange, required, rows = 4, hint, error, clearable }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-dash-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {clearable && (
          <button
            type="button"
            onClick={() => onChange({ target: { name, value: '' } })}
            className="text-gray-300 hover:text-dash-danger text-xl leading-none transition-colors"
            aria-label={`Effacer ${label}`}
          >
            ×
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-dash-legend -mt-0.5">{hint}</p>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-y font-mono ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-dash-action/30'
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

// ── Barre d'actions collée en bas de l'écran ──────────────────────────────
// Annuler / Enregistrer toujours accessibles sans avoir à scroller.
// À placer DANS le <form> : le bouton Enregistrer est un type="submit".
// Le conteneur de la page doit avoir un padding-bas suffisant (pb-24)
// pour que la dernière section ne passe pas sous la barre.
export function FormActionBar({ onCancel, submitting, submitLabel, submittingLabel = 'Enregistrement...' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-6 py-4 flex items-center justify-between z-10">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2 text-sm text-dash-legend hover:text-dash-text hover:bg-gray-100 rounded-lg transition-colors"
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2 text-sm font-medium bg-dash-action text-white rounded-lg hover:bg-dash-action/90 disabled:opacity-50 transition-colors"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </div>
  )
}

// ── Aperçu du résumé de carte ──────────────────────────────────────────────
// Affiche le résumé tel qu'il apparaîtra sur la carte, et prévient la cliente
// quand son repère --- est placé trop loin (sinon il est ignoré en silence).
export function ShortDescriptionPreview({ text, maxLength = 150, label = 'Aperçu de la carte' }) {
  if (!text) return null

  const preview = previewShortDescription(text, maxLength)

  // Longueur du passage avant le repère (null s'il n'y a pas de repère)
  const markerIndex = text.indexOf(CUT_MARKER)
  const excerptLength = markerIndex !== -1 ? text.slice(0, markerIndex).trim().length : null
  const isMarkerTooFar = excerptLength !== null && excerptLength > maxLength

  return (
    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-xs font-medium text-dash-legend mb-1">
        {label} — {preview.length}/{maxLength} caractères
      </p>
      <p className="text-sm text-dash-text italic">{preview}</p>

      {isMarkerTooFar && (
        <p role="status" className="text-xs text-dash-warning mt-2">
          ⚠️ Le passage avant <code className="bg-gray-100 px-1 rounded">{CUT_MARKER}</code> fait {excerptLength} caractères (maximum {maxLength}) : la carte n'en affichera que {preview.length}. Placez le repère plus tôt.
        </p>
      )}
    </div>
  )
}