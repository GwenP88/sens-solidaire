// components/admin/MissionForm.jsx
// Formulaire modal — création ou édition selon la présence de initialData.

import { useState } from 'react'

const VALID_TYPES = [
  { value: 'volontariat_individuel', label: 'Volontariat individuel' },
  { value: 'service_civique', label: 'Service civique' },
  { value: 'groupe_jeunes', label: 'Groupe de jeunes' },
  { value: 'conge_solidaire', label: 'Congé solidaire' },
]

function MissionForm({ initialData, onSubmit, onCancel }) {
  const isEditing = Boolean(initialData)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    country: initialData?.country || '',
    slug: initialData?.slug || '',
    short_description: initialData?.short_description || '',
    type: initialData?.type || '',
    is_active: initialData?.is_active ?? true,
  })

  const [error, setError] = useState(null)
  // Bloque les double-soumissions (double-clic, latence réseau pendant la démo)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(formData)
      // Le parent (MissionsPage) ferme la modale au succès
    } catch (err) {
      // On affiche l'erreur DANS la modale — pas de raison de la fermer
      // si la soumission a échoué, l'utilisateur doit pouvoir corriger.
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="font-heading font-bold text-lg mb-4">
          {isEditing ? 'Modifier la mission' : 'Créer une nouvelle mission'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pays *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug * <span className="text-gray-400 font-normal">(utilisé dans l'URL)</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              pattern="[a-z0-9\-]+"
              title="Uniquement minuscules, chiffres et tirets"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description courte *
            </label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">— Non spécifié —</option>
              {VALID_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Réactivation possible uniquement en édition — une mission créée
              est active par défaut, pas besoin de la case à la création. */}
          {isEditing && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Mission active
            </label>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MissionForm
