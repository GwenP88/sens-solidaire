// FormElements.jsx
// Composants de formulaire partagés — utilisés par MissionFormPage,
// ServiceCiviqueFormPage, et tout futur formulaire admin.

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
export function Field({ label, name, value, onChange, required, hint, pattern, title: fieldTitle, error, autoComplete, list }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-dash-text">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-dash-legend font-normal ml-1 text-xs">({hint})</span>}
      </label>
      <input
        type="text"
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