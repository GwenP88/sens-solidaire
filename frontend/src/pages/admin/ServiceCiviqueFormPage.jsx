// ════════════════════════════════════════════════════════════════
// ServiceCiviqueFormPage.jsx
// Création / édition d'une "carte pays" Service Civique
// (titre, pays, description, 1 photo — réutilise la table Mission,
// type: 'service_civique'). Pas de slug visible : généré
// automatiquement, la cliente ne le gère jamais.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminMissionById,
  createMission,
  updateMission,
  fetchCountryNames
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, FormActionBar } from '../../components/admin/FormElements'
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
  const [countryNames, setCountryNames] = useState([])

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
        setError("Impossible de charger cette mission en service civique.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEditing])

  useEffect(() => {
    fetchCountryNames().then(setCountryNames).catch(console.error)
  }, [])


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
    <div className="max-w-3xl mx-auto py-10 pb-24">

      <button
        onClick={() => navigate('/admin/missions')}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour aux missions
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier la mission de service civique' : 'Creer une mission de service civique'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        <datalist id="country-list">
          {countryNames.map(name => <option key={name} value={name} />)}
        </datalist>

        <FormSection title="Informations sur la mission">
          <Field label="Titre de la mission" name="title" value={formData.title} onChange={handleChange} required error={fieldErrors.title}/>
          <p className="text-xs text-dash-legend -mt-0.5">Exemple : Service civique à l'international au Kenya</p>
          <Field label="Pays" name="country" value={formData.country} onChange={handleChange} required list="country-list" autoComplete="off" error={fieldErrors.country}/>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">
              Description de la mission et rôle du volontaire<span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-dash-legend -mt-0.5">
              Décris le rôle et les activités du volontaire dans ce pays. Ce texte sera affiché en entier lorsque le visiteur cliquera sur « En savoir plus ». Pour choisir le résumé affiché sur la carte, ajoute <code className="bg-gray-100 px-1 rounded">---</code> après la partie que tu souhaites utiliser comme résumé.
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
                  Aperçu du résumé affiché sur la carte — {shortDescriptionPreview.length}/150 caractères
                </p>
                <p className="text-sm text-dash-text italic">{shortDescriptionPreview}</p>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title={<>Photo de présentation <span className="text-red-500">*</span></>}>
          <AdminFileUpload
            value={formData.photo}
            onChange={(photo) => {
              setFormData(prev => ({ ...prev, photo }))
              if (fieldErrors.photo) setFieldErrors(prev => ({ ...prev, photo: null }))
            }}
            accept="image/*"
            maxFiles={1}
            imageType="hero"
            showLabel={true}
            helperText="Cette photo sera affichée sur la carte du Service Civique et dans la fenêtre de détail."
            error={fieldErrors.photo}
          />
          {fieldErrors.photo && <span className="text-xs text-red-500">{fieldErrors.photo}</span>}
        </FormSection>

        {/* ── Actions — barre collante en bas de l'écran ── */}
        <FormActionBar
          onCancel={() => navigate('/admin/missions')}
          submitting={submitting}
          submitLabel={isEditing ? 'Enregistrer les modifications' : 'Ajouter cette mission'}
        />

      </form>
    </div>
  )
}

export default ServiceCiviqueFormPage