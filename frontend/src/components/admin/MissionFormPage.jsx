// ════════════════════════════════════════════════════════════════
// MissionFormPage.jsx
// Page de création et d'édition d'une mission — dashboard admin
// Détecte le mode via useParams : id présent = édition, absent = création
// ════════════════════════════════════════════════════════════════

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams, useNavigate } from 'react-router-dom'

// ── API
import { fetchAdminMissionById, createMission, updateMission } from '../../services/api'


// ════════════════════════════════════════════════════════════════
// CONSTANTES
// ════════════════════════════════════════════════════════════════

const VALID_TYPES = [
  { value: 'volontariat_individuel', label: 'Volontariat individuel' },
  { value: 'service_civique',        label: 'Service Civique'        },
  { value: 'groupe_jeunes',          label: 'Groupe jeunes'          },
  { value: 'conge_solidaire',        label: 'Congé solidaire'        },
]

// État initial du formulaire — tous les champs à vide
const EMPTY_FORM = {
  title:             '',
  country:           '',
  slug:              '',
  short_description: '',
  type:              '',
  image_url:         '',
  description:       '',
  volunteer_role:    '',
  programme:         '',
  included:          '',
  not_include:       '',
  helloasso_url:     '',
  ministry_url:      '',
  health_info:       '',
  admin_info:        '',
  is_active:         true,
}


// ════════════════════════════════════════════════════════════════
// SOUS-COMPOSANTS — blocs visuels du formulaire
// ════════════════════════════════════════════════════════════════

// Séparateur de section avec titre
function FormSection({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading font-semibold text-base text-primary border-b border-gray-200 pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

// Champ texte simple
function Field({ label, name, value, onChange, required, hint, pattern, title: fieldTitle }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        title={fieldTitle}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}

// Textarea
function TextareaField({ label, name, value, onChange, required, rows = 4, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1 text-xs">{hint}</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
      />
    </div>
  )
}


// ════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ════════════════════════════════════════════════════════════════

function MissionFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  // ── États ──
  const [formData, setFormData]   = useState(EMPTY_FORM)
  const [loading, setLoading]     = useState(isEditing) // true seulement si édition
  const [error, setError]         = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // ── Chargement de la mission en mode édition ──
  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const mission = await fetchAdminMissionById(id)
        // On préremplit uniquement les champs du formulaire
        setFormData({
          title:             mission.title             || '',
          country:           mission.country           || '',
          slug:              mission.slug              || '',
          short_description: mission.short_description || '',
          type:              mission.type              || '',
          image_url:         mission.image_url         || '',
          description:       mission.description       || '',
          volunteer_role:    mission.volunteer_role    || '',
          programme:         mission.programme         || '',
          included:          mission.included          || '',
          not_include:       mission.not_include       || '',
          helloasso_url:     mission.helloasso_url     || '',
          ministry_url:      mission.ministry_url      || '',
          health_info:       mission.health_info       || '',
          admin_info:        mission.admin_info        || '',
          is_active:         mission.is_active         ?? true,
        })
      } catch (err) {
        setError("Impossible de charger la mission.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEditing])

  // ── Gestion des changements ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ── Soumission ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (isEditing) {
        await updateMission(Number(id), formData)
      } else {
        await createMission(formData)
      }
      // Retour à la liste missions du dashboard
      navigate('/admin/missions')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── États de chargement / erreur ──
  if (loading) return (
    <div className="p-12 text-primary/50 italic text-sm">Chargement de la mission...</div>
  )


  // ════════════════════════════════════════════════════════════════
  // RENDU
  // ════════════════════════════════════════════════════════════════

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/admin/missions')}
            className="text-sm text-gray-400 hover:text-primary mb-1 flex items-center gap-1"
          >
            ← Retour aux missions
          </button>
          <h1 className="font-heading font-bold text-2xl text-primary">
            {isEditing ? 'Modifier la mission' : 'Créer une mission'}
          </h1>
        </div>

        {/* Statut actif/inactif — uniquement en édition */}
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

      {/* ── Message d'erreur global ── */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* ── Formulaire ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">

        {/* ── BLOC 1 : Informations essentielles ── */}
        <FormSection title="Informations essentielles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Field
              label="Pays"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              pattern="[a-zA-ZÀ-ÿ\s\-]+"
              title="Lettres, espaces et tirets uniquement"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              hint="utilisé dans l'URL"
              pattern="[a-z0-9\-]+"
              title="Minuscules, chiffres et tirets uniquement"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">— Non spécifié —</option>
                {VALID_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <TextareaField
            label="Description courte"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            required
            rows={3}
            hint="— affichée sur la card mission"
          />
        </FormSection>

        {/* ── BLOC 2 : Visuel ── */}
        <FormSection title="Visuel">
          <Field
            label="URL de l'image hero"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            hint="/images/missions/nom-du-fichier.jpg"
          />
          {/* Prévisualisation si une URL est renseignée */}
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Aperçu"
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
              onError={e => e.target.style.display = 'none'}
            />
          )}
        </FormSection>

        {/* ── BLOC 3 : Contenu de la page détail ── */}
        <FormSection title="Contenu de la page détail">
          <TextareaField
            label="Description longue"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            hint="— section 'La mission' de la page détail"
          />
          <TextareaField
            label="Rôle du volontaire"
            name="volunteer_role"
            value={formData.volunteer_role}
            onChange={handleChange}
            rows={5}
            hint="— section 'Rôle & Programme'"
          />
          <TextareaField
            label="Programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
            rows={5}
            hint="— journée type, déroulé de la mission"
          />
        </FormSection>

        {/* ── BLOC 4 : Logistique ── */}
        <FormSection title="Logistique & inscription">
          <TextareaField
            label="Ce qui est inclus"
            name="included"
            value={formData.included}
            onChange={handleChange}
            rows={4}
            hint="— section 'Coût & durée'"
          />
          <TextareaField
            label="Ce qui n'est pas inclus"
            name="not_include"
            value={formData.not_include}
            onChange={handleChange}
            rows={4}
            hint="— section 'Coût & durée'"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Lien HelloAsso"
              name="helloasso_url"
              value={formData.helloasso_url}
              onChange={handleChange}
              hint="bouton S'inscrire"
            />
            <Field
              label="Lien ministère"
              name="ministry_url"
              value={formData.ministry_url}
              onChange={handleChange}
              hint="service civique"
            />
          </div>
        </FormSection>

        {/* ── BLOC 5 : Infos pratiques ── */}
        <FormSection title="Infos pratiques">
          <TextareaField
            label="Infos santé"
            name="health_info"
            value={formData.health_info}
            onChange={handleChange}
            rows={4}
            hint="— vaccins, conditions médicales, etc."
          />
          <TextareaField
            label="Infos administratives"
            name="admin_info"
            value={formData.admin_info}
            onChange={handleChange}
            rows={4}
            hint="— visa, passeport, assurance, etc."
          />
        </FormSection>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/missions')}
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

export default MissionFormPage