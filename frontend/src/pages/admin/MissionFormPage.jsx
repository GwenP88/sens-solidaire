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

// Labels fixes pour les 7 étapes "Comment partir"
const HOW_TO_GO_LABELS = [
  "Vérifier les vols",
  "Nous contacter",
  "Réserver les billets",
  "Payer les frais de mission",
  "Signer les termes d'engagement",
  "Recevoir les conseils de préparation",
  "Recevoir la fiche mission",
]

// État initial du formulaire
const EMPTY_FORM = {
  title:             '',
  country:           '',
  slug:              '',
  short_description: '',
  type:              '',
  image_url:         '',
  description:       '',
  volunteer_role:    '',
  programme:         [],
  included:          '',
  not_include:       '',
  how_to_go:         ['', '', '', '', '', '', ''],
  helloasso_url:     '',
  ministry_url:      '',
  health_info:       '',
  admin_info:        '',
  is_active:         true,
}


// ════════════════════════════════════════════════════════════════
// SOUS-COMPOSANTS
// ════════════════════════════════════════════════════════════════

function FormSection({ title, description, children }) {
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

function Field({ label, name, value, onChange, required, hint, pattern, title: fieldTitle }) {
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
        required={required}
        pattern={pattern}
        title={fieldTitle}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}

function TextareaField({ label, name, value, onChange, required, rows = 4, hint }) {
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
        required={required}
        rows={rows}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono"
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

  const [formData, setFormData]     = useState(EMPTY_FORM)
  const [loading, setLoading]       = useState(isEditing)
  const [error, setError]           = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // ── Chargement en mode édition ──
  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const mission = await fetchAdminMissionById(id)

        let programme = []
        try { programme = mission.programme ? JSON.parse(mission.programme) : [] } catch {}

        let howToGo = ['', '', '', '', '', '', '']
        try {
          const parsed = mission.how_to_go ? JSON.parse(mission.how_to_go) : []
          howToGo = HOW_TO_GO_LABELS.map((_, i) => parsed[i] || '')
        } catch {}

        setFormData({
          title:             mission.title             || '',
          country:           mission.country           || '',
          slug:              mission.slug              || '',
          short_description: mission.short_description || '',
          type:              mission.type              || '',
          image_url:         mission.image_url         || '',
          description:       mission.description       || '',
          volunteer_role:    mission.volunteer_role    || '',
          programme,
          included:          mission.included          || '',
          not_include:       mission.not_include       || '',
          how_to_go:         howToGo,
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

  // ── Handlers champs simples ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ── Handlers programme ──
  const handleProgrammeChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.programme]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, programme: updated }
    })
  }

  const addProgrammeLine = () => {
    setFormData(prev => ({
      ...prev,
      programme: [...prev.programme, { label: '', content: '' }],
    }))
  }

  const removeProgrammeLine = (index) => {
    setFormData(prev => ({
      ...prev,
      programme: prev.programme.filter((_, i) => i !== index),
    }))
  }

  // ── Handlers how_to_go ──
  const handleHowToGoChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.how_to_go]
      updated[index] = value
      return { ...prev, how_to_go: updated }
    })
  }

  // ── Soumission ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        programme: JSON.stringify(formData.programme),
        how_to_go: JSON.stringify(formData.how_to_go),
      }

      if (isEditing) {
        await updateMission(Number(id), payload)
      } else {
        await createMission(payload)
      }

      navigate('/admin/missions')
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <p className="text-gray-400 text-sm italic p-8">Chargement de la mission...</p>
  )


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

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">

        {/* ── BLOC 1 : Informations essentielles ── */}
        <FormSection title="Informations essentielles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Titre" name="title" value={formData.title} onChange={handleChange} required />
            <Field
              label="Pays" name="country" value={formData.country} onChange={handleChange} required
              pattern="[a-zA-ZÀ-ÿ\s\-&]+" title="Lettres, espaces, tirets et & uniquement"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Slug" name="slug" value={formData.slug} onChange={handleChange} required
              hint="utilisé dans l'URL" pattern="[a-z0-9\-]+" title="Minuscules, chiffres et tirets uniquement"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                name="type" value={formData.type} onChange={handleChange}
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
            label="Description courte" name="short_description"
            value={formData.short_description} onChange={handleChange}
            required rows={3} hint="Affichée sur la card mission"
          />
        </FormSection>

        {/* ── BLOC 2 : Visuel ── */}
        <FormSection title="Visuel">
          <Field
            label="URL de l'image hero" name="image_url"
            value={formData.image_url} onChange={handleChange}
            hint="/images/missions/nom-du-fichier.jpg"
          />
          {formData.image_url && (
            <img
              src={formData.image_url} alt="Aperçu"
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
              onError={e => e.target.style.display = 'none'}
            />
          )}
        </FormSection>

        {/* ── BLOC 3 : Contenu ── */}
        <FormSection
          title="Contenu de la page détail"
          description="Ces informations apparaissent sur la page mission publique."
        >
          <TextareaField
            label="Description longue" name="description"
            value={formData.description} onChange={handleChange}
            rows={5} hint="Section 'La mission'"
          />
          <TextareaField
            label="Rôle du volontaire" name="volunteer_role"
            value={formData.volunteer_role} onChange={handleChange}
            rows={6}
            hint="Une ligne = une puce dans le front"
          />
          <p className="text-xs text-gray-300 -mt-2 italic">
            La phrase d'introduction est fixe et s'affiche automatiquement dans le front.
          </p>
        </FormSection>

        {/* ── BLOC 4 : Programme ── */}
        <FormSection
          title="Programme"
          description="Colonne gauche = horaire ou jour (ex: 8h00, Jour 1). Colonne droite = activité."
        >
          <div className="flex flex-col gap-2">
            {formData.programme.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={step.label}
                  onChange={e => handleProgrammeChange(i, 'label', e.target.value)}
                  placeholder="8h00"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  value={step.content}
                  onChange={e => handleProgrammeChange(i, 'content', e.target.value)}
                  placeholder="Description de l'activité"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => removeProgrammeLine(i)}
                  className="text-gray-300 hover:text-red-500 text-xl shrink-0 transition-colors"
                  aria-label="Supprimer cette ligne"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addProgrammeLine}
            className="text-sm text-primary hover:text-primary/70 border border-dashed border-primary/30 rounded-lg px-4 py-2 transition-colors"
          >
            + Ajouter une ligne
          </button>
        </FormSection>

        {/* ── BLOC 5 : Logistique ── */}
        <FormSection
          title="Logistique & inscription"
          description="Une ligne = un item dans la liste du front."
        >
          <TextareaField
            label="Ce qui est inclus" name="included"
            value={formData.included} onChange={handleChange}
            rows={4} hint="Une ligne = un item — ex: Hébergement sur site"
          />
          <TextareaField
            label="Ce qui n'est pas inclus" name="not_include"
            value={formData.not_include} onChange={handleChange}
            rows={4} hint="Une ligne = un item — ex: Billet d'avion (~700 €)"
          />
          <Field
            label="Lien HelloAsso" name="helloasso_url"
            value={formData.helloasso_url} onChange={handleChange}
            hint="Bouton S'inscrire"
          />
        </FormSection>

        {/* ── BLOC 6 : Comment partir ── */}
        <FormSection
          title="Comment partir ?"
          description="7 étapes fixes — complétez le texte de chaque étape. Les icônes sont automatiques."
        >
          <div className="flex flex-col gap-3">
            {HOW_TO_GO_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-6 shrink-0 text-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-gray-400 w-48 shrink-0">{label}</span>
                <input
                  type="text"
                  value={formData.how_to_go[i]}
                  onChange={e => handleHowToGoChange(i, e.target.value)}
                  placeholder={`Texte affiché dans le front...`}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
          </div>
        </FormSection>

        {/* ── BLOC 7 : Infos pratiques ── */}
        <FormSection
          title="Infos pratiques"
          description="Une ligne = une puce dans le front. Les titres de section sont fixes."
        >
          <TextareaField
            label='Infos santé' name="health_info"
            value={formData.health_info} onChange={handleChange}
            rows={4}
            hint='Titre fixe : "Avant le départ : santé & prévention"'
          />
          <TextareaField
            label='Infos administratives' name="admin_info"
            value={formData.admin_info} onChange={handleChange}
            rows={4}
            hint='Titre fixe : "Avant de prendre votre envol"'
          />
          <Field
            label="Lien site du ministère" name="ministry_url"
            value={formData.ministry_url} onChange={handleChange}
            hint="Bouton Recommandations officielles"
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