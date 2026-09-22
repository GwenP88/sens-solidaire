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
import {
  fetchAdminMissionById,
  createMission,
  updateMission,
  updateMissionPricing,
  updateMissionMedia,
} from '../../services/api'

// ── Composants 
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, TextareaField } from '../../components/admin/FormElements'
import AnchorNav from '../../components/navigation/AnchorNav'

// ── Composants utils
import { previewShortDescription } from '../../utils/shortDescription'


// ════════════════════════════════════════════════════════════════
// CONSTANTES
// ════════════════════════════════════════════════════════════════

const VALID_TYPES = [
  { value: 'volontariat_individuel', label: 'Volontariat individuel' },
  { value: 'service_civique',        label: 'Service Civique'        },
  { value: 'groupe_jeunes',          label: 'Groupe jeunes'          },
  { value: 'conge_solidaire',        label: 'Congé solidaire'        },
]

// État initial du formulaire
const EMPTY_FORM = {
  title:             '',
  country:           '',
  slug:              '',
  type:              'volontariat_individuel',  // ← seul type créable pour l'instant
  description:       '',
  volunteer_role:    '',
  programme:         [],
  included: `Hébergement
  Restauration
  Déplacements sur place
  Encadrement par nos équipes et partenaires locaux`,
  not_include: `Adhésion à l'association (25 €)
  Billets d'avion (prix à ajuster selon la destination)
  Assurance voyage
  Frais de visa
  Vaccins et frais de pharmacie`,
  // Comment partir — un seul champ modifiable : les villes
  how_to_go_villes:  '',
  helloasso_url:     '',
  ministry_url:      '',
  health_info:       '',
  admin_info:        '',
  is_active:         true,
  pricing: [
    { duration_label: '10 jours',   price: '1175' },
    { duration_label: '2 semaines', price: '1500' },
    { duration_label: '3 semaines', price: '2000' },
    { duration_label: '4 semaines', price: '2500' },
  ], // [{ duration_label, price }]
  // 2 photos obligatoires : position 1 = hero, position 2 = section "La mission".
  // Les flèches ▲▼ du composant suffisent pour réordonner seulement 2 photos.
  mission_photos:    [],
  // Guide du volontaire — 1 fichier max. [{ file_url, label }]
  guide_pdf:         [],
}

// Étapes fixes "Comment partir" — seule la première est modifiable (les villes)
const HOW_TO_GO_FIXED = [
  null,                                      // étape 1 — modifiable (villes)
  "Nous contacter par mail à contact@sensolidaires.org",
  "Réserver vos billets d'avion et nous les envoyer",
  "Payer les frais de mission, adhérer à l'association (25 €)",
  "Signer les termes d'engagement",
  "Recevoir les conseils pratiques de préparation",
  "Recevoir votre fiche mission à remplir à votre retour",
]

const HOW_TO_GO_STEP1_LABEL = "Comparer et vérifier les vols"

const FORM_SECTIONS = [
  { label: "Infos",            id: "informations" },
  { label: "Photos",           id: "photos" },
  { label: "Présentation",     id: "presentation" },
  { label: "Programme",        id: "programme" },
  { label: "Tarifs",           id: "tarifs" },
  { label: "Logistique",       id: "logistique" },
  { label: "Comment partir",   id: "comment-partir" },
  { label: "Infos pratiques",  id: "infos-pratiques" },
]
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
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // ── Chargement en mode édition ──
  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const mission = await fetchAdminMissionById(id)

        // Parsing programme JSON
        let programme = []
        try { programme = mission.programme ? JSON.parse(mission.programme) : [] } catch {}

        // Parsing how_to_go — on récupère l'étape 1, en retirant le label
        // qu'on lui a préfixé à la sauvegarde (sinon il se réempile à chaque édition)
        let how_to_go_villes = ''
        try {
          const parsed = mission.how_to_go ? JSON.parse(mission.how_to_go) : []
          const step1 = parsed[0] || ''
          const prefix = `${HOW_TO_GO_STEP1_LABEL} : `
          how_to_go_villes = step1.startsWith(prefix) ? step1.slice(prefix.length) : step1
        } catch {}

        // Pricing trié par display_order
        const pricing = mission.pricing
          ? mission.pricing
              .sort((a, b) => a.display_order - b.display_order)
              .map(p => ({ duration_label: p.duration_label, price: String(p.price) }))
          : []

        // 2 photos reconstituées depuis les champs dédiés (plus de galerie ici)
        const mission_photos = []
        if (mission.photo_hero_url) {
          mission_photos.push({ file_url: mission.photo_hero_url, label: mission.photo_hero_alt || '' })
        }
        if (mission.photo_section_url) {
          mission_photos.push({ file_url: mission.photo_section_url, label: mission.photo_section_alt || '' })
        }

        // PDF guide du volontaire
        const pdfMedia = mission.media
          ? mission.media.find(m => m.file_type === 'pdf')
          : null
        const guide_pdf = pdfMedia
          ? [{ file_url: pdfMedia.file_url, label: pdfMedia.label || '' }]
          : []

        setFormData({
          title:             mission.title             || '',
          country:           mission.country           || '',
          slug:              mission.slug              || '',
          type:              mission.type              || '',
          description:       mission.description       || '',
          volunteer_role:    mission.volunteer_role    || '',
          programme,
          included:          mission.included          || '',
          not_include:       mission.not_include       || '',
          how_to_go_villes,
          helloasso_url:     mission.helloasso_url     || '',
          ministry_url:      mission.ministry_url      || '',
          health_info:       mission.health_info       || '',
          admin_info:        mission.admin_info        || '',
          is_active:         mission.is_active         ?? true,
          pricing,
          mission_photos,
          guide_pdf,
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

    // Efface l'erreur du champ dès que l'utilisateur le corrige
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // ── Validation — champs obligatoires du bloc 1 ──
  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim())             newErrors.title             = "Le titre est obligatoire."
    if (!formData.country.trim())           newErrors.country           = "Le pays est obligatoire."
    if (!formData.slug.trim())              newErrors.slug              = "Le slug est obligatoire."
    if (!formData.description.trim())       newErrors.description       = "La description est obligatoire."
    if (formData.mission_photos.length < 2) newErrors.mission_photos = "2 photos sont obligatoires (hero + illustration)."
    return newErrors
  }

  // ── Handlers programme ──
  const handleProgrammeChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.programme]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, programme: updated }
    })
  }
  const addProgrammeLine = () => setFormData(prev => ({ ...prev, programme: [...prev.programme, { label: '', content: '' }] }))
  const removeProgrammeLine = (index) => setFormData(prev => ({ ...prev, programme: prev.programme.filter((_, i) => i !== index) }))

  // ── Handlers pricing ──
  const handlePricingChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.pricing]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, pricing: updated }
    })
  }
  const addPricingLine = () => setFormData(prev => ({ ...prev, pricing: [...prev.pricing, { duration_label: '', price: '' }] }))
  const removePricingLine = (index) => setFormData(prev => ({ ...prev, pricing: prev.pricing.filter((_, i) => i !== index) }))

  // ── Soumission ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation des champs obligatoires — arrête tout si erreurs
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)

    try {
      // Reconstruction du tableau how_to_go complet (7 étapes)
      // Étape 1 = saisie libre, étapes 2-7 = texte fixe
      const howToGoFull = HOW_TO_GO_FIXED.map((fixed, i) =>
        i === 0 ? `${HOW_TO_GO_STEP1_LABEL} : ${formData.how_to_go_villes}` : fixed
      )

      // photo : hero et section "la mission"
      const [heroPhoto, sectionPhoto] = formData.mission_photos

      const payload = {
        ...formData,
        photo_hero_url:    heroPhoto ? heroPhoto.file_url : '',
        photo_hero_alt:    heroPhoto ? heroPhoto.label : '',
        photo_section_url: sectionPhoto ? sectionPhoto.file_url : '',
        photo_section_alt: sectionPhoto ? sectionPhoto.label : '',
        programme: JSON.stringify(formData.programme),
        how_to_go: JSON.stringify(howToGoFull),
      }
      // Champs gérés séparément — on les retire du payload mission
      delete payload.pricing
      delete payload.mission_photos
      delete payload.guide_pdf
      delete payload.how_to_go_villes

      let missionId

      if (isEditing) {
        await updateMission(Number(id), payload)
        missionId = Number(id)
      } else {
        const created = await createMission(payload)
        missionId = created.id
      }

      // Sauvegarde des tarifs
      if (formData.pricing.length > 0) {
        await updateMissionPricing(missionId, formData.pricing)
      }

      // Sauvegarde du PDF uniquement — la galerie n'est plus gérée ici
      const pdf = formData.guide_pdf[0]
        ? { file_url: formData.guide_pdf[0].file_url, label: formData.guide_pdf[0].label || 'Guide du volontaire' }
        : null
      await updateMissionMedia(missionId, undefined, pdf)

      navigate('/admin/missions')
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <p className="text-dash-legend text-sm italic p-8">Chargement de la mission...</p>
  )

  const shortDescriptionPreview = previewShortDescription(formData.description)

  // ════════════════════════════════════════════════════════════════
  // RENDU
  // ════════════════════════════════════════════════════════════════

  return (
    <div className="max-w-4xl mx-auto py-16">

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/admin/missions')}
            className="text-sm text-dash-legend hover:text-dash-action mb-6 flex items-center gap-1"
          >
            ← Retour aux missions
          </button>
          <h1 className="font-heading font-bold text-2xl text-dash-title">
            {isEditing ? 'Modifier la mission' : 'Créer une mission'}
          </h1>
        </div>
        {isEditing && (
          <label className="flex items-center gap-2 text-sm text-dash-legend cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 accent-dash-success"
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

      <AnchorNav sections={FORM_SECTIONS} variant="dashboard" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        {/* ── BLOC 1 : Informations essentielles ── */}
        <FormSection
          id="informations"
          title="Informations essentielles"
          description="Ces informations sont affichées sur la carte de la mission et en haut de sa page détaillée."
        >
          {/* Ligne 1 — Titre et pays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Titre de la mission" name="title" value={formData.title} onChange={handleChange} required />
            <Field
            label="Pays" name="country" value={formData.country} onChange={handleChange} required
            pattern="[a-zA-ZÀ-ÿ\s\-&]+" title="Lettres, espaces, tirets et & uniquement"
            />
          </div>

          {/* Ligne 3 — Slug, pleine largeur */}
          <Field
            label="URL de la mission" name="slug" value={formData.slug} onChange={handleChange} required
            hint="Partie de l’URL qui identifie la mission. Utilisez des mots-clés courts et descriptifs, séparés par des tirets. Ex. : volontariat-kenya-biodiversite" pattern="[a-z0-9\-]+" title="Minuscules, chiffres et tirets uniquement, sans espaces ni accents"
          />

        </FormSection>

        {/* ── BLOC 2 : Photos ── */}
        <FormSection
          id="photos"
          title="Photos"
          description="2 photos obligatoires. La première est affichée en haut de la page, la seconde illustre la section « La mission ». Utilisez les flèches pour modifier leur ordre."
        >
          <AdminFileUpload
            value={formData.mission_photos}
            onChange={(mission_photos) => setFormData(prev => ({ ...prev, mission_photos }))}
            accept="image/*"
            maxFiles={2}
            imageType="hero"
            showLabel={true}
            helperText="Formats : JPG, JPEG, PNG, WEBP, AVIF, SVG. La légende décrit l'image pour l'accessibilité."
          />
          {fieldErrors.mission_photos && <span className="text-xs text-red-500">{fieldErrors.mission_photos}</span>}
        </FormSection>

        {/* ── BLOC 3 : Contenu ── */}
        <FormSection
          id="presentation"
          title="Présentation de la mission"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">
              Description longue <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-dash-legend -mt-0.5">
              Astuce : insère <code className="bg-gray-100 px-1 rounded">---</code> à l'endroit où tu veux que le résumé s'arrête (sinon coupé automatiquement à la fin de la dernière phrase complète).
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
                  Aperçu de la description courte (carte + hero) — {shortDescriptionPreview.length}/150 caractères
                </p>
                <p className="text-sm text-dash-text italic">{shortDescriptionPreview}</p>
              </div>
            )}
          </div>
          <TextareaField
            label="Rôle du volontaire'" name="volunteer_role"
            value={formData.volunteer_role} onChange={handleChange}
            rows={10} hint="Un rôle par ligne. Chaque ligne sera affichée sous forme de puce."
          />
        </FormSection>

        {/* ── BLOC 4 : Programme ── */}
        <FormSection
          id="programme"
          title="Programme de volontariat"
          description="Colonne gauche : horaire ou jour. Colonne droite : activité."
        >
          <div className="flex flex-col gap-2">
            {formData.programme.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={step.label}
                  onChange={e => handleProgrammeChange(i, 'label', e.target.value)}
                  placeholder="8h00"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 shrink-0 focus:outline-none focus:ring-2 focus:ring-dash-action/30"
                />
                <input
                  type="text"
                  value={step.content}
                  onChange={e => handleProgrammeChange(i, 'content', e.target.value)}
                  placeholder="Description de l'activité"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-dash-action/30"
                />
                <button type="button" onClick={() => removeProgrammeLine(i)}
                  className="text-gray-300 hover:text-red-500 text-xl shrink-0 transition-colors">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addProgrammeLine}
            className="text-sm text-dash-action hover:text-dash-action/70 border border-dashed border-dash-action/30 rounded-lg px-4 py-2 transition-colors">
            + Ajouter une ligne
          </button>
        </FormSection>

        {/* ── BLOC 5 : Tarifs & durées ── */}
        <FormSection
          id="tarifs"
          title="Durées et tarifs"
          description="Colonne gauche : durée. Colonne droite : prix en €."
        >
          <div className="flex flex-col gap-2">
            {formData.pricing.map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={line.duration_label}
                  onChange={e => handlePricingChange(i, 'duration_label', e.target.value)}
                  placeholder="10 jours"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-dash-action/30"
                />
                <input
                  type="number"
                  value={line.price}
                  onChange={e => handlePricingChange(i, 'price', e.target.value)}
                  placeholder="1175"
                  min="0"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 shrink-0 focus:outline-none focus:ring-2 focus:ring-dash-action/30"
                />
                <span className="text-sm text-dash-legend shrink-0">€</span>
                <button type="button" onClick={() => removePricingLine(i)}
                  className="text-gray-300 hover:text-red-500 text-xl shrink-0 transition-colors">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addPricingLine}
            className="text-sm text-dash-action hover:text-dash-action/70 border border-dashed border-dash-action/30 rounded-lg px-4 py-2 transition-colors">
            + Ajouter une durée
          </button>
        </FormSection>

        {/* ── BLOC 6 : Logistique ── */}
        <FormSection
          id="logistique"
          title="Inclus / non inclus"
          description="Un élément par ligne. Chaque ligne sera affichée sous forme de puce."
        >
          <TextareaField
            label="Ce qui est inclus" name="included"
            value={formData.included} onChange={handleChange}
            rows={6}
          />
          <TextareaField
            label="Ce qui n'est pas inclus" name="not_include"
            value={formData.not_include} onChange={handleChange}
            rows={6}
          />
          <Field
            label="Lien HelloAsso" name="helloasso_url"
            value={formData.helloasso_url} onChange={handleChange}
            hint="Lien utilisé par le bouton « S’inscrire »."
          />
        </FormSection>

        {/* ── BLOC 7 : Comment partir ── */}
        <FormSection
          id="comment-partir"
          title="Comment partir ?"
          description="Seule la première étape est à renseigner. Les suivantes sont identiques pour toutes les missions."
        >
          <div className="flex flex-col gap-3">

            {/* Étape 1 — modifiable */}
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold text-dash-legend w-6 shrink-0 text-center mt-2.5">01</span>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-sm text-dash-legend font-medium">Comparer / Vérifier les vols</p>
                <input
                  type="text"
                  name="how_to_go_villes"
                  value={formData.how_to_go_villes}
                  onChange={handleChange}
                  placeholder="ex: Paris › Nairobi ou Paris › Mombasa"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
                />
              </div>
            </div>

            {/* Étapes 2-7 — fixes, affichées en lecture seule */}
            {HOW_TO_GO_FIXED.slice(1).map((texte, i) => (
              <div key={i} className="flex items-center gap-3 opacity-40">
                <span className="text-xs font-bold text-dash-legend w-6 shrink-0 text-center">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <p className="text-sm text-dash-legend flex-1">{texte}</p>
                <span className="text-xs text-gray-300 shrink-0 italic">fixe</span>
              </div>
            ))}

          </div>
        </FormSection>

        {/* ── BLOC 8 : Infos pratiques ── */}
        <FormSection
          id="infos-pratiques"
          title="Préparer votre départ"
          description="Informations utiles pour préparer le départ : santé, formalités et documents."
        >
          <TextareaField
            label='Infos santé' name="health_info"
            value={formData.health_info} onChange={handleChange}
            rows={6} hint='Vaccins, traitements, condition physique ou autres précautions de santé. Un élément par ligne.'
          />
          <TextareaField
            label='Infos administratives' name="admin_info"
            value={formData.admin_info} onChange={handleChange}
            rows={6} hint='Passeport, visa et autres formalités nécessaires au voyage. Un élément par ligne.'
          />
          <Field
            label="Lien des recommandations officielles" name="ministry_url"
            value={formData.ministry_url} onChange={handleChange}
            hint="Lien vers les conseils aux voyageurs du ministère pour le pays concerné.s"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">Guide du volontaire (PDF)</label>
            <AdminFileUpload
              value={formData.guide_pdf}
              onChange={(guide_pdf) => setFormData(prev => ({ ...prev, guide_pdf }))}
              accept="application/pdf"
              maxFiles={1}
              showLabel={false}
            />
          </div>
        </FormSection>

        {/* ── Actions — barre collante en bas de l'écran, toujours accessible sans scroller ── */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-6 py-4 flex items-center justify-between z-10">
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
            className="px-6 py-2 text-sm font-medium bg-dash-action text-white rounded-lg hover:bg-dash-action/90 disabled:opacity-50 transition-colors"
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