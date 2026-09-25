// ════════════════════════════════════════════════════════════════
// pages/admin/FieldActionFormPage.jsx
// Création / édition d'une action terrain
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminFieldActionById, createFieldAction, updateFieldAction, updateFieldActionMedia,
  fetchCountryNames,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field } from '../../components/admin/FormElements'
import { ODDS } from '../../utils/odds'

// Même mapping que côté public/backend — juste pour l'aperçu en direct.
// Le calcul qui fait foi (celui vraiment enregistré) se fait côté backend.
const ODD_TO_CATEGORY_PREVIEW = {
  14: 'Biodiversité', 15: 'Biodiversité',
  1: 'Solidarité', 10: 'Solidarité',
  2: 'Alimentation',
  3: 'Santé',
  4: 'Éducation',
  5: 'Egalité',
  8: 'Développement', 9: 'Développement', 11: 'Développement',
  16: 'Coopération', 17: 'Coopération',
  6: 'Environnement', 7: 'Environnement', 12: 'Environnement', 13: 'Environnement',
}

// ── Découpage description/contenu — marqueur "---" ──────────────────────
// Différence avec Mission : ici on SCINDE vraiment le texte (rien avant
// le marqueur ne se retrouve dupliqué dans le contenu), plutôt que de
// dériver un simple résumé qui chevauche le texte intégral.
const CUT_MARKER = '---'
const H2_MAX_LENGTH = 150

const truncateAtSentence = (text, maxLength) => {
  if (text.length <= maxLength) return text
  const truncated = text.slice(0, maxLength)
  const lastEnd = Math.max(
    truncated.lastIndexOf('. '), truncated.lastIndexOf('! '), truncated.lastIndexOf('? ')
  )
  if (lastEnd > 0) return truncated.slice(0, lastEnd + 1).trim()
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trim() + '…'
}

const splitDescriptionContent = (fullText, maxLength = H2_MAX_LENGTH) => {
  const markerIndex = fullText.indexOf(CUT_MARKER)

  if (markerIndex !== -1) {
    const before = fullText.slice(0, markerIndex).trim()
    const after = fullText.slice(markerIndex + CUT_MARKER.length).trim()
    const description = before.length <= maxLength ? before : truncateAtSentence(before, maxLength)
    // Si rien après le marqueur, on évite un contenu vide — le texte avant sert aux deux.
    return { description, content: after || before }
  }

  // Pas de marqueur — description = résumé auto, content = texte intégral.
  return { description: truncateAtSentence(fullText, maxLength), content: fullText }
}

const EMPTY_FORM = {
  title: '',
  descriptionRaw: '', // textarea unique — scindé en description/content à l'enregistrement
  countries: [],
  odds: [],
  photos: [], // [{ file_url, label, is_hero }] — 1ère = hero, le reste = galerie
}

// Slug technique, jamais affiché — même principe que Lieux/Missions
const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function FieldActionFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [countryInput, setCountryInput] = useState('')
  const [countryNames, setCountryNames] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCountryNames().then(setCountryNames).catch(console.error)
  }, [])

  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const action = await fetchAdminFieldActionById(id)
        // Reconstitue le textarea unique à partir des 2 champs existants,
        // pour que le marqueur --- soit de nouveau modifiable ensemble.
        const descriptionRaw = action.content && action.content !== action.description
          ? `${action.description}${CUT_MARKER}${action.content}`
          : (action.description || action.content || '')

        const photos = [
          ...(action.image_url ? [{ file_url: action.image_url, label: '', is_hero: true }] : []),
          ...(action.gallery || []).map(m => ({ file_url: m.file_url, label: m.label || '', is_hero: false })),
        ]

        setFormData({
          title: action.title || '',
          descriptionRaw,
          countries: action.countries.map(c => c.country),
          odds: action.odds.map(o => o.odd_number),
          photos,
        })
      } catch (err) {
        setError("Impossible de charger cette action.")
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

  const handleAddCountry = () => {
    const value = countryInput.trim()
    if (!value || formData.countries.includes(value)) return
    setFormData(prev => ({ ...prev, countries: [...prev.countries, value] }))
    setCountryInput('')
  }

  const handleRemoveCountry = (country) => {
    setFormData(prev => ({ ...prev, countries: prev.countries.filter(c => c !== country) }))
  }

  const handleToggleOdd = (n) => {
    setFormData(prev => ({
      ...prev,
      odds: prev.odds.includes(n)
        ? prev.odds.filter(o => o !== n)
        : [...prev.odds, n],
    }))
  }

  // Aperçus en direct — H2 dérivé + tags déduits
  const { description: previewH2, content: previewContent } = splitDescriptionContent(formData.descriptionRaw || '')
  const previewTags = [...new Set(formData.odds.map(n => ODD_TO_CATEGORY_PREVIEW[n]).filter(Boolean))]

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim())          newErrors.title = "Le titre est obligatoire."
    if (!formData.descriptionRaw.trim()) newErrors.descriptionRaw = "La description est obligatoire."
    if (formData.odds.length === 0)      newErrors.odds = "Sélectionnez au moins un ODD."
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

    try {
      const { description, content } = splitDescriptionContent(formData.descriptionRaw)
      const heroPhoto = formData.photos.find(p => p.is_hero)
      const galleryPhotos = formData.photos.filter(p => !p.is_hero)

      const payload = {
        title: formData.title,
        description,
        content,
        countries: formData.countries,
        odds: formData.odds,
        image_url: heroPhoto ? heroPhoto.file_url : null,
        slug: slugify(formData.title),
      }

      let actionId

      if (isEditing) {
        await updateFieldAction(Number(id), payload)
        actionId = Number(id)
      } else {
        const created = await createFieldAction(payload)
        actionId = created.id
      }

      const images = galleryPhotos.map(p => ({ file_url: p.file_url, label: p.label || null }))
      await updateFieldActionMedia(actionId, images)

      navigate('/admin/actions-terrain')
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
        onClick={() => navigate('/admin/actions-terrain')}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour aux actions terrain
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier l\'action' : 'Ajouter une action'}
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

        <FormSection title="Informations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Titre" name="title" value={formData.title} onChange={handleChange}
              required error={fieldErrors.title}
            />

            {/* ── Pays — champ + datalist + étiquettes retirables ── */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-dash-text">Pays concernés</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  list="country-list"
                  autoComplete="off"
                  value={countryInput}
                  onChange={e => setCountryInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCountry() } }}
                  placeholder="Choisis un pays"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-dash-action/30"
                />
                <button
                  type="button"
                  onClick={handleAddCountry}
                  className="px-4 py-2 text-sm font-medium border border-dash-action text-dash-action rounded-lg hover:bg-dash-action/10 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              {formData.countries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.countries.map(c => (
                    <span key={c} className="flex items-center gap-1 px-3 py-1 bg-dash-action/10 text-dash-action text-sm rounded-full">
                      {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveCountry(c)}
                        className="hover:text-dash-danger"
                        aria-label={`Retirer ${c}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Description unique — scindée en H2 + contenu via --- ── */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">
              Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-dash-legend -mt-0.5">
              Astuce : insère <code className="bg-gray-100 px-1 rounded">---</code> à l'endroit où tu veux que le titre (H2) s'arrête — le reste devient le contenu de la page. Sans marqueur, le titre est déduit automatiquement du début du texte.
            </p>
            <textarea
              name="descriptionRaw"
              value={formData.descriptionRaw}
              onChange={handleChange}
              rows={10}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-y ${
                fieldErrors.descriptionRaw ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-dash-action/30'
              }`}
            />
            {fieldErrors.descriptionRaw && <span className="text-xs text-red-500">{fieldErrors.descriptionRaw}</span>}
            {formData.descriptionRaw && (
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-2">
                <div>
                  <p className="text-xs font-medium text-dash-legend mb-1">
                    Aperçu du titre (H2) — {previewH2.length}/{H2_MAX_LENGTH} caractères
                  </p>
                  <p className="text-sm text-dash-text italic">{previewH2}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-dash-legend mb-1">Aperçu du contenu</p>
                  <p className="text-sm text-dash-text line-clamp-3">{previewContent}</p>
                </div>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection
          title="Photos"
          description="Sélectionnez la photo principale. Les autres seront affichées dans la galerie."
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
          />
          {fieldErrors.photos && <span className="text-xs text-red-500">{fieldErrors.photos}</span>}
        </FormSection>

        <FormSection
          title="Objectifs de Développement Durable (ODD)"
          description="Les thèmes affichés sur le site sont déduits automatiquement des ODD sélectionnés."
        >
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
            {ODDS.map(odd => {
              const selected = formData.odds.includes(odd.n)
              return (
                <button
                  type="button"
                  key={odd.n}
                  onClick={() => handleToggleOdd(odd.n)}
                  className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                    selected ? 'ring-2 ring-dash-action' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <img
                    src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(odd.n).padStart(2, '0')}.jpg`}
                    alt={`ODD ${odd.n}`}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover"
                  />
                  <span className="text-[10px] text-dash-legend text-center leading-tight">{odd.label}</span>
                </button>
              )
            })}
          </div>
          {fieldErrors.odds && <span className="text-xs text-red-500 block mt-2">{fieldErrors.odds}</span>}

          {previewTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-dash-legend">Thèmes déduits :</span>
              {previewTags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-dash-action/10 text-dash-action text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </FormSection>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/actions-terrain')}
            className="px-5 py-2 text-sm text-dash-legend hover:text-dash-text hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium bg-dash-action text-white rounded-lg hover:bg-dash-action/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Créer l\'action'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default FieldActionFormPage