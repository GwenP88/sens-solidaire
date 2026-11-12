// ════════════════════════════════════════════════════════════════
// pages/admin/EducationItemFormPage.jsx
// Création / modification d'une carte de la page Éducation (ateliers…) (tâche 172A)
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminEducationItemById, fetchAdminEducationItems, fetchAdminEducationSections,
  createEducationItem, updateEducationItem,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, FormActionBar, ShortDescriptionPreview } from '../../components/admin/FormElements'
import { FILTERS_EDUCATION_PUBLIC } from '../../utils/filters'

// Publics proposés (sans l'option « Tous » des filtres du site)
const PUBLIC_OPTIONS = FILTERS_EDUCATION_PUBLIC.filter(f => f.value)

// Longueur maximale du résumé de la carte — même valeur que CARD_SUMMARY_LENGTH (backend, educationItemService.js)
const CARD_SUMMARY_LENGTH = 200

const EMPTY_FORM = {
  title: '',
  type: 'Atelier',
  section_id: '',
  public: [],       // ['primaire', 'adultes'…]
  content: '',      // texte unique : avant « --- » = résumé de la carte, l'ensemble = page de l'atelier
  photo: [],        // [{ file_url, label }] — 0 ou 1 photo
  pdf: [],          // [{ file_url, label }] — 0 ou 1 fichier
}

const BACK = '/admin/education'

function EducationItemFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [sections, setSections] = useState([])
  const [typeSuggestions, setTypeSuggestions] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Sections (liste déroulante) + catégories déjà utilisées (suggestions)
  useEffect(() => {
    fetchAdminEducationSections().then(setSections).catch(console.error)
    fetchAdminEducationItems()
      .then(items => setTypeSuggestions([...new Set(items.map(i => i.type).filter(Boolean))]))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const item = await fetchAdminEducationItemById(id)
        setFormData({
          title: item.title || '',
          type: item.type || '',
          section_id: item.section_id ? String(item.section_id) : '',
          public: (item.public || '').split(',').map(p => p.trim()).filter(Boolean),
          // Cartes créées avant le texte unique : pas de texte complet → on repart du résumé
          content: item.content || item.description || '',
          photo: item.image_url ? [{ file_url: item.image_url, label: '' }] : [],
          pdf: item.external_url ? [{ file_url: item.external_url, label: '' }] : [],
        })
      } catch (err) {
        console.error('Erreur chargement :', err)
        setError("Impossible de charger cette carte. Rechargez la page ou réessayez plus tard.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEditing])

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }))
  }
  const handleChange = (e) => setField(e.target.name, e.target.value)

  const togglePublic = (code) => setField(
    'public',
    formData.public.includes(code) ? formData.public.filter(p => p !== code) : [...formData.public, code]
  )

  const validate = () => {
    const errors = {}
    if (!formData.title.trim())       errors.title = "Le titre est obligatoire."
    if (!formData.type.trim())        errors.type = "La catégorie est obligatoire (ex. : Atelier)."
    if (formData.public.length === 0) errors.public = "Cochez au moins un public."
    if (!formData.content.trim())     errors.content = "La description est obligatoire."
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setError("Certains champs sont à compléter : voir les messages en rouge.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        section_id: formData.section_id ? Number(formData.section_id) : null,
        public: formData.public,
        content: formData.content, // le résumé de la carte est déduit par le serveur
        image_url: formData.photo[0]?.file_url || '',
        external_url: formData.pdf[0]?.file_url || '',
      }

      if (isEditing) await updateEducationItem(Number(id), payload)
      else await createEducationItem(payload)

      navigate(BACK)
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-dash-legend text-sm italic p-8">Chargement...</p>

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-24">

      <button
        onClick={() => navigate(BACK)}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour à Éducation & sensibilisation
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier une carte' : 'Créer une carte'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        <datalist id="education-types">
          {typeSuggestions.map(type => <option key={type} value={type} />)}
        </datalist>

        {/* ── Présentation ── */}
        <FormSection title="Présentation de la carte">
          <Field
            label="Titre" name="title" value={formData.title} onChange={handleChange}
            required error={fieldErrors.title} hint="ex. : À la découverte des forêts primaires"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Catégorie" name="type" value={formData.type} onChange={handleChange}
              required error={fieldErrors.type} list="education-types"
              hint="petit titre de la carte, ex. : Atelier"
            />
            <div className="flex flex-col gap-1">
              <label htmlFor="section_id" className="text-sm font-medium text-dash-text">Section où l'afficher</label>
              <select
                id="section_id"
                name="section_id"
                value={formData.section_id}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-dash-action/30"
              >
                <option value="">— Aucune (carte non affichée) —</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
          </div>

          {/* Public : cases à cocher */}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-dash-text mb-1">
              Public <span className="text-red-500">*</span>
            </legend>
            <div className="flex flex-wrap gap-6">
              {PUBLIC_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-dash-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.public.includes(opt.value)}
                    onChange={() => togglePublic(opt.value)}
                    className="w-4 h-4 accent-dash-action"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {fieldErrors.public && <span className="text-xs text-red-500">{fieldErrors.public}</span>}
          </fieldset>

          {/* Texte unique avec repère --- : même principe que les missions et les articles */}
          <div className="flex flex-col gap-1">
            <label htmlFor="content" className="text-sm font-medium text-dash-text">
              Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-dash-legend -mt-0.5">
              Astuce : insérez <code className="bg-gray-100 px-1 rounded">---</code> à l'endroit où le résumé de la carte doit s'arrêter. Le texte entier s'affiche sur la page de l'atelier. Sans repère, le résumé s'arrête à la fin de la dernière phrase complète.
            </p>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-y ${
                fieldErrors.content ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-dash-action/30'
              }`}
            />
            {fieldErrors.content && <span className="text-xs text-red-500">{fieldErrors.content}</span>}
            <ShortDescriptionPreview text={formData.content} maxLength={CARD_SUMMARY_LENGTH} label="Aperçu de la carte" />
          </div>
        </FormSection>

        {/* ── Photo ── */}
        <FormSection title="Photo (facultatif)" description="Affichée en haut de la carte.">
          <AdminFileUpload
            value={formData.photo}
            onChange={(files) => setField('photo', files)}
            accept="image/*"
            maxFiles={1}
            imageType="card"
            showLabel={false}
          />
        </FormSection>

        {/* ── Fiche PDF ── */}
        <FormSection
          title="Fiche PDF (facultatif)"
          description="Si la carte a une fiche PDF et pas de texte complet, un clic sur la carte ouvre directement la fiche."
        >
          <AdminFileUpload
            value={formData.pdf}
            onChange={(files) => setField('pdf', files)}
            accept="application/pdf"
            maxFiles={1}
            showLabel={false}
          />
        </FormSection>

        <FormActionBar
          onCancel={() => navigate(BACK)}
          submitting={submitting}
          submitLabel={isEditing ? 'Enregistrer les modifications' : 'Ajouter la carte'}
        />

      </form>
    </div>
  )
}

export default EducationItemFormPage
