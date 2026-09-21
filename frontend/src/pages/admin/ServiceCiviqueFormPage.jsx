// ════════════════════════════════════════════════════════════════
// ServiceCiviqueFormPage.jsx
// Création / édition d'une "carte pays" Service Civique
// (titre, pays, description, 1 photo — réutilise la table Mission,
// type: 'service_civique_pays'). Pas de slug visible : généré
// automatiquement, la cliente ne le gère jamais.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminMissionById,
  createMission,
  updateMission,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, TextareaField } from '../../components/admin/FormElements'
import { previewShortDescription } from '../../utils/shortDescription'

const EMPTY_FORM = {
  title: '',
  country: '',
  description: '',
  photo: [], // [{ file_url, label }] — 1 seule photo, carte + modale
}

// Génère un slug technique à partir du titre + pays — jamais affiché,
// juste pour satisfaire la contrainte unique de la table Mission.
const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function ServiceCiviqueFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const mission = await fetchAdminMissionById(id)
        setFormData({
          title: mission.title || '',
          country: mission.country || '',
          description: mission.description || '',
          photo: mission.photo_hero_url
            ? [{ file_url: mission.photo_hero_url, label: mission.photo_hero_alt || '' }]
            : [],
        })
      } catch (err) {
        setError("Impossible de charger cette carte.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim())       newErrors.title = "Le titre est obligatoire."
    if (!formData.country.trim())     newErrors.country = "Le pays est obligatoire."
    if (!formData.description.trim()) newErrors.description = "La description est obligatoire."
    if (formData.photo.length < 1)    newErrors.photo = "Une photo est obligatoire."
    return newErrors
  }

  const shortDescriptionPreview = previewShortDescription(formData.description)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      return
    }

    setSubmitting(true)

    try {
      const photo = formData.photo[0]

      const payload = {
        title: formData.title,
        country: formData.country,
        description: formData.description,
        type: 'service_civique',
        slug: `service-civique-${slugify(formData.title)}-${slugify(formData.country)}`,
        photo_hero_url: photo.file_url,
        photo_hero_alt: photo.label || '',
      }

      if (isEditing) {
        await updateMission(Number(id), payload)
      } else {
        await createMission(payload)
      }

      navigate('/admin/missions')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <p className="text-dash-legend text-sm italic p-8">Chargement...</p>
  )

  return (
    <div className="max-w-3xl mx-auto py-10">

      <button
        onClick={() => navigate('/admin/missions')}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour aux missions
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier la carte pays' : 'Ajouter une carte pays'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        <FormSection title="Informations">
          <Field label="Titre" name="title" value={formData.title} onChange={handleChange} required />
          <Field label="Pays" name="country" value={formData.country} onChange={handleChange} required />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">
              Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-dash-legend -mt-0.5">
              Astuce : insère <code className="bg-gray-100 px-1 rounded">---</code> à l'endroit où tu veux que le résumé (carte) s'arrête.
            </p>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-y ${
                fieldErrors.description ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-dash-action/30'
              }`}
            />
            {fieldErrors.description && <span className="text-xs text-red-500">{fieldErrors.description}</span>}
            {formData.description && (
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs font-medium text-dash-legend mb-1">
                  Aperçu de la carte — {shortDescriptionPreview.length}/150 caractères
                </p>
                <p className="text-sm text-dash-text italic">{shortDescriptionPreview}</p>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="Photo">
          <AdminFileUpload
            value={formData.photo}
            onChange={(photo) => setFormData(prev => ({ ...prev, photo }))}
            accept="image/*"
            maxFiles={1}
            imageType="hero"
            showLabel={true}
            helperText="Une seule photo — utilisée à la fois en fond de carte et dans la fenêtre détail."
          />
          {fieldErrors.photo && <span className="text-xs text-red-500">{fieldErrors.photo}</span>}
        </FormSection>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/missions')}
            className="px-5 py-2 text-sm text-dash-legend hover:text-dash-text hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium bg-dash-editorial text-white rounded-lg hover:bg-dash-editorial/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer la carte'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default ServiceCiviqueFormPage