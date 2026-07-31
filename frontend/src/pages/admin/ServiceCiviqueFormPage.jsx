// ════════════════════════════════════════════════════════════════
// ServiceCiviqueFormPage.jsx
// Page de création et d'édition d'une mission Service Civique — dashboard admin
// Détecte le mode via useParams : id présent = édition, absent = création
// ════════════════════════════════════════════════════════════════

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams, useNavigate } from 'react-router-dom'

// ── API
import {
  fetchAdminMissionById,
  createMission,
  updateMission,
  updateMissionMedia,
} from '../../services/api'

// ── Composants admin
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, TextareaField } from '../../components/admin/FormElements'


// ════════════════════════════════════════════════════════════════
// CONSTANTES
// ════════════════════════════════════════════════════════════════

// État initial du formulaire — type figé, pas de select (page dédiée)
const EMPTY_FORM = {
  title:             '',
  country:           '',
  slug:              '',
  short_description: '',
  type:              'service_civique',
  description:       '',
  age_min:           '',
  age_max:           '',
  duration_label:    '',
  admin_info:        '', // paragraphe "Infos pratiques" — texte libre
  role_france:       '',
  role_etranger:     '',
  candidater_url:    '',
  is_active:         true,
  // Photos — la 1ère devient l'image principale (hero), les suivantes la galerie
  photos:            [],
}


// ════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════════

function ServiceCiviqueFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData]       = useState(EMPTY_FORM)
  const [loading, setLoading]         = useState(isEditing)
  const [error, setError]             = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting]   = useState(false)

  // ── Chargement en mode édition ──
  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const mission = await fetchAdminMissionById(id)

        // Galerie — médias de type image, triés
        const galerieMedia = mission.media
          ? mission.media
              .filter(m => m.file_type === 'image')
              .sort((a, b) => a.display_order - b.display_order)
              .map(m => ({ file_url: m.file_url, label: m.label || '' }))
          : []

        // Photos reconstituées — l'image principale existante en 1ère position
        const photos = mission.image_url
          ? [{ file_url: mission.image_url, label: mission.image_alt || '' }, ...galerieMedia]
          : galerieMedia

        setFormData({
          title:             mission.title             || '',
          country:           mission.country           || '',
          slug:              mission.slug              || '',
          short_description: mission.short_description || '',
          type:              'service_civique',
          description:       mission.description       || '',
          age_min:           mission.age_min ?? '',
          age_max:           mission.age_max ?? '',
          duration_label:    mission.duration_label     || '',
          admin_info:        mission.admin_info         || '',
          role_france:       mission.role_france         || '',
          role_etranger:     mission.role_etranger       || '',
          candidater_url:    mission.candidater_url      || '',
          is_active:         mission.is_active ?? true,
          photos,
        })
      } catch (err) {
        setError("Impossible de charger la mission.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEditing])

  // ── Handler champs simples ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // ── Validation — champs obligatoires ──
  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim())             newErrors.title             = "Le titre est obligatoire."
    if (!formData.country.trim())           newErrors.country           = "Le pays est obligatoire."
    if (!formData.slug.trim())              newErrors.slug              = "Le slug est obligatoire."
    if (!formData.short_description.trim()) newErrors.short_description = "La description courte est obligatoire."
    return newErrors
  }

  if (loading) return (
    <p className="text-gray-400 text-sm italic p-8">Chargement de la mission...</p>
  )

  // ── Soumission ──
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
      // La 1ère photo devient l'image principale (hero), les suivantes la galerie
      const [heroPhoto, ...galeriePhotos] = formData.photos
      const image_url = heroPhoto ? heroPhoto.file_url : ''
      const image_alt = heroPhoto ? heroPhoto.label : ''

      const payload = {
        title:             formData.title,
        country:           formData.country,
        slug:              formData.slug,
        short_description: formData.short_description,
        type:              'service_civique',
        description:       formData.description,
        age_min:           formData.age_min !== '' ? Number(formData.age_min) : null,
        age_max:           formData.age_max !== '' ? Number(formData.age_max) : null,
        duration_label:    formData.duration_label,
        admin_info:        formData.admin_info,
        role_france:       formData.role_france,
        role_etranger:     formData.role_etranger,
        candidater_url:    formData.candidater_url,
        is_active:         formData.is_active,
        image_url,
        image_alt,
      }

      let missionId

      if (isEditing) {
        await updateMission(Number(id), payload)
        missionId = Number(id)
      } else {
        const created = await createMission(payload)
        missionId = created.id
      }

      // Sauvegarde des médias (galerie uniquement — pas de PDF pour Service Civique)
      const images = galeriePhotos.map(p => ({ file_url: p.file_url, label: p.label || null }))
      await updateMissionMedia(missionId, images, null)

      navigate('/admin/service-civique')
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }


  // ════════════════════════════════════════════════════════════════
  // RENDU
  // ════════════════════════════════════════════════════════════════

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/admin/service-civique')}
            className="text-sm text-gray-400 hover:text-primary mb-1 flex items-center gap-1"
          >
            ← Retour au Service Civique
          </button>
          <h1 className="font-heading font-bold text-2xl text-primary">
            {isEditing ? 'Modifier la mission Service Civique' : 'Créer une mission Service Civique'}
          </h1>
        </div>
        {isEditing && (
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 accent-primary"
            />
            Mission active
          </label>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        {/* ── BLOC 1 : Informations essentielles ── */}
        <FormSection
          title="Informations essentielles"
          description="Affichées sur la card mission et dans le hero de la page détail."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Titre" name="title" value={formData.title} onChange={handleChange}
              required error={fieldErrors.title}
              hint="ex: Service Civique au Kenya"
            />
            <Field
              label="Pays" name="country" value={formData.country} onChange={handleChange}
              required pattern="[a-zA-ZÀ-ÿ\s\-&]+" title="Lettres, espaces, tirets et & uniquement"
              error={fieldErrors.country}
            />
          </div>
          <Field
            label="Slug" name="slug" value={formData.slug} onChange={handleChange}
            required hint="utilisé dans l'URL" pattern="[a-z0-9\-]+" title="Minuscules, chiffres et tirets uniquement"
            error={fieldErrors.slug}
          />
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-medium ${
              formData.short_description.length >= 140 ? 'text-red-500' :
              formData.short_description.length >= 120 ? 'text-orange-500' :
              'text-gray-700'
            }`}>
              Description courte <span className="text-red-500">*</span>
              <span className="font-normal ml-1 text-xs">— {formData.short_description.length}/150 caractères</span>
            </label>
            <p className="text-xs text-gray-400 -mt-0.5">Affichée sur la card et dans le hero de la page détail</p>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              maxLength={150}
              rows={3}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-y font-mono ${
                fieldErrors.short_description ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'
              }`}
            />
            {fieldErrors.short_description && <span className="text-xs text-red-500">{fieldErrors.short_description}</span>}
          </div>
        </FormSection>

        {/* ── BLOC 2 : Photos de la mission ── */}
        <FormSection
          title="Photos de la mission"
          description="La 1ère photo devient l'image principale (hero). Les suivantes forment la galerie de la page détail."
        >
          <AdminFileUpload
            value={formData.photos}
            onChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
            accept="image/*"
            maxFiles={10}
            showLabel={true}
            helperText="Formats : JPG, PNG, WEBP. La légende sert de texte alternatif (accessibilité)."
          />
        </FormSection>

        {/* ── BLOC 3 : Infos du hero (âge / durée) ── */}
        <FormSection
          title="Barre d'infos du hero"
          description="Affichées sous le titre, sur la page détail."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Âge minimum" name="age_min" value={formData.age_min} onChange={handleChange}
              hint="ex: 16"
            />
            <Field
              label="Âge maximum" name="age_max" value={formData.age_max} onChange={handleChange}
              hint="ex: 25 (30 en situation de handicap)"
            />
          </div>
          <Field
            label="Durée" name="duration_label" value={formData.duration_label} onChange={handleChange}
            hint="ex: 6 à 12 mois"
          />
        </FormSection>

        {/* ── BLOC 4 : Infos pratiques ── */}
        <FormSection
          title="Section 'Infos pratiques'"
          description="Paragraphe libre affiché sur la page détail (indemnité, conditions, etc.)."
        >
          <TextareaField
            label="Texte" name="admin_info"
            value={formData.admin_info} onChange={handleChange}
            rows={6} hint="Rédigez librement — indemnité, conditions, ce que vous souhaitez."
          />
          <Field
            label="Lien du bouton 'Candidater'" name="candidater_url"
            value={formData.candidater_url} onChange={handleChange}
            hint="ex: https://www.service-civique.gouv.fr/"
          />
          <p className="text-xs text-gray-300 -mt-2 italic">
            Le bouton "Nous contacter" est fixe (contact@sensolidaires.org) et ne nécessite aucune saisie.
          </p>
        </FormSection>

        {/* ── BLOC 5 : Votre rôle (2 colonnes) ── */}
        <FormSection
          title="Section 'Votre rôle'"
          description="Une ligne = une puce affichée dans chaque colonne."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextareaField
              label="Mission en France" name="role_france"
              value={formData.role_france} onChange={handleChange}
              rows={8}
            />
            <TextareaField
              label="Mission à l'étranger" name="role_etranger"
              value={formData.role_etranger} onChange={handleChange}
              rows={8}
            />
          </div>
        </FormSection>

        {/* ── Actions — barre collante en bas de l'écran ── */}
        <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/service-civique')}
            className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {submitting
              ? 'Enregistrement...'
              : isEditing ? 'Enregistrer les modifications' : 'Créer la mission'
            }
          </button>
        </div>

      </form>
    </div>
  )
}

export default ServiceCiviqueFormPage