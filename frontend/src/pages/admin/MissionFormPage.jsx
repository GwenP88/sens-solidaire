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

// ── Composants admin
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, TextareaField } from '../../components/admin/FormElements'


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
  short_description: '',
  type:              'volontariat_individuel',  // ← seul type créable pour l'instant
  description:       '',
  volunteer_role:    '',
  programme:         [],
  included:          '',
  not_include:       '',
  // Comment partir — un seul champ modifiable : les villes
  how_to_go_villes:  '',
  helloasso_url:     '',
  ministry_url:      '',
  health_info:       '',
  admin_info:        '',
  is_active:         true,
  pricing:           [], // [{ duration_label, price }]
  // Photos de la mission — la 1ère devient l'image principale (hero),
  // les suivantes forment la galerie. [{ file_url, label }]
  photos:            [],
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

        // Parsing how_to_go — on récupère uniquement l'étape 1 (les villes)
        let how_to_go_villes = ''
        try {
          const parsed = mission.how_to_go ? JSON.parse(mission.how_to_go) : []
          how_to_go_villes = parsed[0] || ''
        } catch {}

        // Pricing trié par display_order
        const pricing = mission.pricing
          ? mission.pricing
              .sort((a, b) => a.display_order - b.display_order)
              .map(p => ({ duration_label: p.duration_label, price: String(p.price) }))
          : []

        // Galerie — médias de type image, triés
        const galerieMedia = mission.media
          ? mission.media
              .filter(m => m.file_type === 'image')
              .sort((a, b) => a.display_order - b.display_order)
              .map(m => ({ file_url: m.file_url, label: m.label || '' }))
          : []

        // Photos reconstituées — l'image principale existante en 1ère position,
        // suivie de la galerie déjà enregistrée
        const photos = mission.image_url
          ? [{ file_url: mission.image_url, label: mission.image_alt || '' }, ...galerieMedia]
          : galerieMedia

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
          short_description: mission.short_description || '',
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
          photos,
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
    if (!formData.short_description.trim()) newErrors.short_description = "La description courte est obligatoire."
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
        i === 0 ? formData.how_to_go_villes : fixed
      )

      // La 1ère photo devient l'image principale (hero), les suivantes la galerie
      const [heroPhoto, ...galeriePhotos] = formData.photos
      const image_url = heroPhoto ? heroPhoto.file_url : ''
      const image_alt = heroPhoto ? heroPhoto.label : ''

      const payload = {
        ...formData,
        image_url,
        image_alt,
        programme: JSON.stringify(formData.programme),
        how_to_go: JSON.stringify(howToGoFull),
      }
      // Champs gérés séparément — on les retire du payload mission
      delete payload.pricing
      delete payload.photos
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

      // Sauvegarde des médias (galerie + PDF)
      const images = galeriePhotos.map(p => ({ file_url: p.file_url, label: p.label || null }))
      const pdf = formData.guide_pdf[0]
        ? { file_url: formData.guide_pdf[0].file_url, label: formData.guide_pdf[0].label || 'Guide du volontaire' }
        : null
      await updateMissionMedia(missionId, images, pdf)

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
            />
            <Field
              label="Pays" name="country" value={formData.country} onChange={handleChange}
              required pattern="[a-zA-ZÀ-ÿ\s\-&]+" title="Lettres, espaces, tirets et & uniquement"
              error={fieldErrors.country}
            />
          </div>
          {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
            <Field
              label="Slug" name="slug" value={formData.slug} onChange={handleChange}
              required hint="utilisé dans l'URL" pattern="[a-z0-9\-]+" title="Minuscules, chiffres et tirets uniquement"
              error={fieldErrors.slug}
            />
            {/* Type de mission — masqué : seul "Volontariat individuel" est gérable en dashboard pour l'instant.
                Les autres types (service civique, groupe jeunes, congé solidaire) sont du contenu fixe côté front.
                Réactiver ce select quand ces types seront pris en charge par le dashboard (V2). */}
            {/*
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
            */}
          {/*</div>*/}
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

        {/* ── BLOC 2 : Photos de la mission (fusion image principale + galerie) ── */}
        <FormSection
          title="Photos de la mission"
          description="La 1ère photo devient l'image principale (hero). Les suivantes forment la galerie de la page détail. Glissez les flèches pour réordonner."
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

        {/* ── BLOC 3 : Contenu ── */}
        <FormSection
          title="Contenu de la page détail"
          description="Ces informations apparaissent sur la page mission détaillée."
        >
          <TextareaField
            label="Description longue" name="description"
            value={formData.description} onChange={handleChange}
            rows={6} hint="Section 'La mission'"
          />
          <TextareaField
            label="Section 'Votre rôle sur le terrain'" name="volunteer_role"
            value={formData.volunteer_role} onChange={handleChange}
            rows={10} hint="Une ligne = une puce affichée"
          />
          <p className="text-xs text-gray-300 -mt-2 italic">
            La phrase d'introduction est fixe et s'affiche automatiquement.
          </p>
        </FormSection>

        {/* ── BLOC 4 : Programme ── */}
        <FormSection
          title="Section 'Programme de volontariat'"
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
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  value={step.content}
                  onChange={e => handleProgrammeChange(i, 'content', e.target.value)}
                  placeholder="Description de l'activité"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button type="button" onClick={() => removeProgrammeLine(i)}
                  className="text-gray-300 hover:text-red-500 text-xl shrink-0 transition-colors">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addProgrammeLine}
            className="text-sm text-primary hover:text-primary/70 border border-dashed border-primary/30 rounded-lg px-4 py-2 transition-colors">
            + Ajouter une ligne
          </button>
        </FormSection>

        {/* ── BLOC 5 : Tarifs & durées ── */}
        <FormSection
          title="Tableau durée / prix"
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
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="number"
                  value={line.price}
                  onChange={e => handlePricingChange(i, 'price', e.target.value)}
                  placeholder="1175"
                  min="0"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm text-gray-400 shrink-0">€</span>
                <button type="button" onClick={() => removePricingLine(i)}
                  className="text-gray-300 hover:text-red-500 text-xl shrink-0 transition-colors">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addPricingLine}
            className="text-sm text-primary hover:text-primary/70 border border-dashed border-primary/30 rounded-lg px-4 py-2 transition-colors">
            + Ajouter une durée
          </button>
        </FormSection>

        {/* ── BLOC 6 : Logistique ── */}
        <FormSection
          title="Section 'Inclus/non inclus'"
          description="une ligne = un item dans la liste inclus / non inclus."
        >
          <TextareaField
            label="Ce qui est inclus" name="included"
            value={formData.included} onChange={handleChange}
            rows={6} hint="Une ligne = un item — ex: Hébergement sur site"
          />
          <TextareaField
            label="Ce qui n'est pas inclus" name="not_include"
            value={formData.not_include} onChange={handleChange}
            rows={6} hint="Une ligne = un item — ex: Billet d'avion (~700 €)"
          />
          <Field
            label="Lien HelloAsso" name="helloasso_url"
            value={formData.helloasso_url} onChange={handleChange}
            hint="Bouton S'inscrire"
          />
        </FormSection>

        {/* ── BLOC 7 : Comment partir ── */}
        <FormSection
          title="Section 'Comment partir ?'"
          description="Seule la première étape est à renseigner — les autres sont fixes pour toutes les missions."
        >
          <div className="flex flex-col gap-3">

            {/* Étape 1 — modifiable */}
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold text-gray-400 w-6 shrink-0 text-center mt-2.5">01</span>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-sm text-gray-500 font-medium">Réserver votre vol</p>
                <input
                  type="text"
                  name="how_to_go_villes"
                  value={formData.how_to_go_villes}
                  onChange={handleChange}
                  placeholder="ex: Paris › Nairobi ou Paris › Mombasa"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Étapes 2-7 — fixes, affichées en lecture seule */}
            {HOW_TO_GO_FIXED.slice(1).map((texte, i) => (
              <div key={i} className="flex items-center gap-3 opacity-40">
                <span className="text-xs font-bold text-gray-400 w-6 shrink-0 text-center">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <p className="text-sm text-gray-500 flex-1">{texte}</p>
                <span className="text-xs text-gray-300 shrink-0 italic">fixe</span>
              </div>
            ))}

          </div>
        </FormSection>

        {/* ── BLOC 8 : Infos pratiques ── */}
        <FormSection
          title="Section 'Préparer votre départ'"
          description="Une ligne = une puce affichée."
        >
          <TextareaField
            label='Infos santé' name="health_info"
            value={formData.health_info} onChange={handleChange}
            rows={6} hint='Titre fixe : "Avant le départ : santé & prévention"'
          />
          <TextareaField
            label='Infos administratives' name="admin_info"
            value={formData.admin_info} onChange={handleChange}
            rows={6} hint='Titre fixe : "Avant de prendre votre envol"'
          />
          <Field
            label="Lien site du ministère" name="ministry_url"
            value={formData.ministry_url} onChange={handleChange}
            hint="Bouton Recommandations officielles"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Guide du volontaire (PDF)</label>
            <AdminFileUpload
              value={formData.guide_pdf}
              onChange={(guide_pdf) => setFormData(prev => ({ ...prev, guide_pdf }))}
              accept="application/pdf"
              maxFiles={1}
              showLabel={true}
              helperText="Le libellé s'affiche sur le bouton de téléchargement (ex: Guide du volontaire Kenya)."
            />
          </div>
        </FormSection>

        {/* ── Actions — barre collante en bas de l'écran, toujours accessible sans scroller ── */}
        <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between">
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