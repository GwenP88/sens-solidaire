// FormElements.jsx
// Composants de formulaire partagés — utilisés par MissionFormPage,
// ServiceCiviqueFormPage, et tout futur formulaire admin.

export function FormSection({ title, description, children }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-gray-200 pb-2">
        <h2 className="font-heading font-semibold text-base text-primary">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

// error : message de validation à afficher sous le champ (texte rouge)
export function Field({ label, name, value, onChange, required, hint, pattern, title: fieldTitle, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1 text-xs">({hint})</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        pattern={pattern}
        title={fieldTitle}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

export function TextareaField({ label, name, value, onChange, required, rows = 4, hint, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 -mt-0.5">{hint}</p>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-y font-mono ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}