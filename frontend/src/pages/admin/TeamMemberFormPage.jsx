// ════════════════════════════════════════════════════════════════
// pages/admin/TeamMemberFormPage.jsx
// Création / édition d'un membre de l'équipe
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminTeamMemberById, createTeamMember, updateTeamMember,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, TextareaField } from '../../components/admin/FormElements'

const EMPTY_FORM = {
  nom: '',
  role: '',
  description: '',
  category: '',
  photo: [], // [{ file_url, label }] — un seul élément max (photo facultative)
}

// Catégories fixes — valeur enregistrée en base / libellé affiché
const CATEGORIES = [
  { value: 'direction', label: 'Direction' },
  { value: 'bureau', label: 'Membre du bureau' },
  { value: 'ca', label: "Conseil d'administration" },
  { value: 'egalement', label: 'Autre' },
]

function TeamMemberFormPage() {
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
        const member = await fetchAdminTeamMemberById(id)
        setFormData({
          nom: member.nom || '',
          role: member.role || '',
          description: member.description || '',
          category: member.category || '',
          photo: member.avatar_url ? [{ file_url: member.avatar_url, label: '' }] : [],
        })
      } catch (err) {
        setError("Impossible de charger ce membre.")
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
    if (!formData.nom.trim())  newErrors.nom      = "Le nom est obligatoire."
    if (!formData.role.trim()) newErrors.role     = "Le rôle est obligatoire."
    if (!formData.category)    newErrors.category = "Choisissez une catégorie."
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        nom: formData.nom,
        role: formData.role,
        description: formData.description || null,
        category: formData.category,
        avatar_url: formData.photo[0]?.file_url || null,
      }

      if (isEditing) {
        await updateTeamMember(Number(id), payload)
      } else {
        await createTeamMember(payload)
      }

      navigate('/admin/a-propos')
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-dash-legend text-sm italic p-8">Chargement...</p>

  return (
    <div className="max-w-3xl mx-auto py-10">

      <button
        onClick={() => navigate('/admin/a-propos')}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour à l'équipe
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier le membre' : 'Ajouter un membre'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        <FormSection title="Photo" description="Facultative — un portrait neutre s'affiche par défaut si absente.">
          <AdminFileUpload
            value={formData.photo}
            onChange={(photo) => setFormData(prev => ({ ...prev, photo }))}
            accept="image/*"
            maxFiles={1}
            imageType="avatar"
            showLabel={false}
          />
        </FormSection>

        <FormSection title="Informations">
          <Field
            label="Nom / prénom" name="nom" value={formData.nom} onChange={handleChange}
            required error={fieldErrors.nom}
          />
          <Field
            label="Rôle dans l'association" name="role" value={formData.role} onChange={handleChange}
            required error={fieldErrors.role}
          />
          <TextareaField
            label="Description (facultatif)" name="description"
            value={formData.description} onChange={handleChange}
            rows={4}
          />
        </FormSection>

        <FormSection title="Catégorie">
          <div className="flex flex-col gap-2">
            {CATEGORIES.map(cat => (
              <label key={cat.value} className="flex items-center gap-2 text-sm text-dash-text cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={handleChange}
                  className="w-4 h-4 accent-dash-action"
                />
                {cat.label}
              </label>
            ))}
          </div>
          {fieldErrors.category && <span className="text-xs text-red-500">{fieldErrors.category}</span>}
        </FormSection>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/a-propos')}
            className="px-5 py-2 text-sm text-dash-legend hover:text-dash-text hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium bg-dash-action text-white rounded-lg hover:bg-dash-action/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer le membre'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default TeamMemberFormPage