// ════════════════════════════════════════════════════════════════
// LocationFormPage.jsx
// Création / édition d'un lieu partenaire
// Photo hero (radio parmi la galerie) + galerie + missions associées
// La partie "ajouter/modifier une délégation" sera ajoutée à l'étape suivante.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminLocationById, createLocation, updateLocation, updateLocationMedia,
  fetchAdminMissions, fetchCountryNames, createDelegation, updateDelegation,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, TextareaField } from '../../components/admin/FormElements'

const EMPTY_FORM = {
  name: '',
  country: '',
  description: '',
  mission_ss: '', // "mission de Sens Solidaires" — facultatif
  map_url: '',
  website_url: '',
  photos: [], // [{ file_url, label, is_hero }]
  mission_ids: [],
}

// Slug technique, jamais affiché — même principe que pour les cartes pays Service Civique
const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function LocationFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [allMissions, setAllMissions] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState(null)
  const [countryNames, setCountryNames] = useState([])
  const [showDelegationPanel, setShowDelegationPanel] = useState(false)
  const [delegationId, setDelegationId] = useState(null)
  const [delegationCountry, setDelegationCountry] = useState('')
  const [delegationPhoto, setDelegationPhoto] = useState([])
  const [delegationContacts, setDelegationContacts] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Charge toutes les missions (tous types) pour les cases à cocher
  useEffect(() => {
    fetchAdminMissions()
      .then(data => setAllMissions(data.filter(m => !m.slug.startsWith('ancre-'))))
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetchCountryNames().then(setCountryNames).catch(console.error)
  }, [])

  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const location = await fetchAdminLocationById(id)

        const photos = [
          ...(location.image_url ? [{ file_url: location.image_url, label: '', is_hero: true }] : []),
          ...(location.gallery || []).map(m => ({ file_url: m.file_url, label: m.label || '', is_hero: false })),
        ]

        if (location.delegation) {
          setDelegationId(location.delegation.id)
          setDelegationCountry(location.delegation.pays || '')
          setDelegationPhoto(location.delegation.image_url ? [{ file_url: location.delegation.image_url, label: '' }] : [])
          setDelegationContacts(location.delegation.contacts || '')
        }

        setFormData({
          name: location.name || '',
          country: location.country || '',
          description: location.description || '',
          mission_ss: location.mission_ss || '',
          map_url: location.map_url || '',
          website_url: location.website_url || '',
          photos,
          mission_ids: (location.missions || []).map(m => m.id),
        })
      } catch (err) {
        setError("Impossible de charger ce lieu.")
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

  const handleMissionToggle = (missionId) => {
    setFormData(prev => ({
      ...prev,
      mission_ids: prev.mission_ids.includes(missionId)
        ? prev.mission_ids.filter(id => id !== missionId)
        : [...prev.mission_ids, missionId],
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim())        newErrors.name = "Le titre est obligatoire."
    if (!formData.country.trim())     newErrors.country = "Le pays est obligatoire."
    if (!formData.description.trim()) newErrors.description = "La description est obligatoire."
    if (formData.photos.length < 1)   newErrors.photos = "Au moins une photo est obligatoire."
    if (formData.photos.length > 0 && !formData.photos.some(p => p.is_hero)) {
      newErrors.photos = "Sélectionnez une photo principale."
    }
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

    setSubmitting(true)

    try {
      // Délégation — créée/modifiée AVANT le lieu, pour avoir son id à rattacher
      let finalDelegationId = delegationId
      if (showDelegationPanel) {
        const delegationPayload = {
          pays: delegationCountry,
          lieu: `Délégation nationale — ${delegationCountry}`,
          image_url: delegationPhoto[0]?.file_url || '',
          contacts: delegationContacts,
        }
        if (delegationId) {
          await updateDelegation(delegationId, delegationPayload)
        } else {
          const created = await createDelegation(delegationPayload)
          finalDelegationId = created.id
        }
      }

      const heroPhoto = formData.photos.find(p => p.is_hero)
      const galleryPhotos = formData.photos.filter(p => !p.is_hero)

      const payload = {
        name: formData.name,
        country: formData.country,
        description: formData.description,
        mission_ss: formData.mission_ss,
        map_url: formData.map_url,
        website_url: formData.website_url,
        image_url: heroPhoto.file_url,
        mission_ids: formData.mission_ids,
        delegation_id: finalDelegationId,
        slug: `${slugify(formData.name)}-${slugify(formData.country)}`,
      }

      let locationId

      if (isEditing) {
        await updateLocation(Number(id), payload)
        locationId = Number(id)
      } else {
        const created = await createLocation(payload)
        locationId = created.id
      }

      const images = galleryPhotos.map(p => ({ file_url: p.file_url, label: p.label || null }))
      await updateLocationMedia(locationId, images)

      navigate('/admin/lieux')
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-dash-legend text-sm italic p-8">Chargement...</p>

  return (
    <div className="max-w-4xl mx-auto py-10">

      <button
        onClick={() => navigate('/admin/lieux')}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour aux lieux
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier le lieu' : 'Ajouter un lieu'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        <FormSection title="Informations">
          <Field label="Titre" name="name" value={formData.name} onChange={handleChange} required />
          <Field label="Pays" name="country" value={formData.country} onChange={handleChange} required />
          <TextareaField
            label="Description" name="description"
            value={formData.description} onChange={handleChange}
            rows={5}
          />
          <TextareaField
            label="Mission de Sens Solidaires liées au lieux (facultatif)" name="mission_ss"
            value={formData.mission_ss} onChange={handleChange}
            rows={4}
          />
        </FormSection>

        <FormSection
          title="Photos"
          description="Sélectionnez la photo principale de la fiche. Les autres photos seront affichées dans la galerie."
        >
          <AdminFileUpload
            value={formData.photos}
            onChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
            accept="image/*"
            maxFiles={15}
            imageType="gallery"
            showLabel={true}
            showHeroSelector={true}
            layout="grid"
            allowReorder={false}
          />
          {fieldErrors.photos && <span className="text-xs text-red-500">{fieldErrors.photos}</span>}
        </FormSection>

        <FormSection title="Infos pratiques">
          <Field label="Lien Google Maps" name="map_url" value={formData.map_url} onChange={handleChange} />
          <Field label="Site web (facultatif)" name="website_url" value={formData.website_url} onChange={handleChange} />
        </FormSection>

        <FormSection title="Missions associées" description="Coche la ou les missions liées à ce lieu.">
          <div className="flex flex-col gap-2">
            {allMissions.map(mission => (
              <label key={mission.id} className="flex items-center gap-2 text-sm text-dash-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.mission_ids.includes(mission.id)}
                  onChange={() => handleMissionToggle(mission.id)}
                  className="w-4 h-4 accent-dash-action"
                />
                {mission.title} <span className="text-dash-legend">({mission.country})</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Délégation">
          <button
            type="button"
            onClick={() => setShowDelegationPanel(prev => !prev)}
            className="self-start px-4 py-2 text-sm font-medium border border-dash-action text-dash-action rounded-lg hover:bg-dash-action/10 transition-colors"
          >
            {delegationId ? 'Modifier la délégation' : 'Ajouter une délégation'}
          </button>

          {showDelegationPanel && (
            <div className="flex flex-col gap-4 mt-4 p-4 border border-gray-200 rounded-lg">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-dash-text">Titre</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-dash-legend whitespace-nowrap">Délégation nationale —</span>
                  <input
                    type="text"
                    list="country-list"
                    value={delegationCountry}
                    onChange={e => setDelegationCountry(e.target.value)}
                    placeholder="Choisis un pays"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-dash-action/30"
                  />
                  <datalist id="country-list">
                    {countryNames.map(name => <option key={name} value={name} />)}
                  </datalist>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-dash-text">Photo</label>
                <AdminFileUpload
                  value={delegationPhoto}
                  onChange={setDelegationPhoto}
                  accept="image/*"
                  maxFiles={1}
                  imageType="card"
                  showLabel={false}
                />
              </div>

              <TextareaField
                label="Description"
                hint="Indiquez les noms/prénoms des personnes présentes."
                name="delegation_contacts"
                value={delegationContacts}
                onChange={e => setDelegationContacts(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </FormSection>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/lieux')}
            className="px-5 py-2 text-sm text-dash-legend hover:text-dash-text hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium bg-dash-action text-white rounded-lg hover:bg-dash-action/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer le lieu'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default LocationFormPage