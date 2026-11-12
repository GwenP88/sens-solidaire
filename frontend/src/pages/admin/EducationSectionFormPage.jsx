// ════════════════════════════════════════════════════════════════
// pages/admin/EducationSectionFormPage.jsx
// Création / modification d'une section de la page Éducation (tâche 172A) — un seul formulaire pour toutes les sections
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminEducationSectionById, createEducationSection, updateEducationSection, updateEducationSectionMedia,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import ButtonLinksField from '../../components/admin/ButtonLinksField'
import RattachementField from '../../components/admin/RattachementField'
import { FormSection, Field, TextareaField, FormActionBar } from '../../components/admin/FormElements'
import AnchorNav from '../../components/navigation/AnchorNav'
import { isValidButtonUrl } from '../../utils/validation'
import { SECTION_AUDIENCE_OPTIONS } from '../../utils/filters'

// Bouton proposé d'office à la création : la plupart des sections invitent à prendre contact
const DEFAULT_BUTTONS = [{ label: 'Nous contacter', url: '/contact', kind: 'link' }]

const EMPTY_FORM = {
  eyebrow: '',
  title: '',
  content: '',
  audience: [],     // codes cochés : ['maternelle', 'college'…]
  price_eur: '',
  price_chf: '',
  price_detail: '',
  photos: [],       // [{ file_url, label }] — carrousel « En images »
  buttons: DEFAULT_BUTTONS,
  rattachement: null,
}

// Bouton chargé depuis la base : un document envoyé depuis l'ordinateur est rangé dans /uploads/
const buttonKind = (url) => (String(url).startsWith('/uploads/') ? 'document' : 'link')

const BACK = '/admin/education'

function EducationSectionFormPage() {
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
        const section = await fetchAdminEducationSectionById(id)
        setFormData({
          eyebrow: section.eyebrow || '',
          title: section.title || '',
          content: section.content || '',
          audience: (section.audience || '').split(',').map(c => c.trim()).filter(Boolean),
          price_eur: section.price_eur || '',
          price_chf: section.price_chf || '',
          price_detail: section.price_detail || '',
          photos: (section.images || []).map(m => ({ file_url: m.file_url, label: m.label || '' })),
          buttons: (section.buttons || []).map(b => ({ label: b.label || '', url: b.file_url, kind: buttonKind(b.file_url) })),
          rattachement: section.rattachement,
        })
      } catch (err) {
        console.error('Erreur chargement :', err)
        setError("Impossible de charger cette section. Rechargez la page ou réessayez plus tard.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEditing])

  // ── Mise à jour d'un champ (texte ou valeur directe) + effacement de son erreur ──
  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }))
  }
  const handleChange = (e) => setField(e.target.name, e.target.value)

  const toggleAudience = (code) => setField(
    'audience',
    formData.audience.includes(code) ? formData.audience.filter(c => c !== code) : [...formData.audience, code]
  )

  const validate = () => {
    const errors = {}
    if (!formData.title.trim())   errors.title = "Le titre de la section est obligatoire."
    if (!formData.content.trim()) errors.content = "Le texte de présentation est obligatoire."

    const buttons = formData.buttons
    if (buttons.some(b => !b.label.trim())) {
      errors.buttons = "Chaque bouton doit avoir un texte. Retirez les boutons inutilisés avec la corbeille."
    } else if (buttons.some(b => b.kind === 'document' && !b.url)) {
      errors.buttons = "Importez le document de chaque bouton « Document à importer », ou retirez ce bouton."
    } else if (buttons.some(b => b.kind === 'link' && !b.url.trim())) {
      errors.buttons = "Indiquez le lien de chaque bouton, ou retirez ce bouton."
    } else if (buttons.some(b => !isValidButtonUrl(b.url))) {
      errors.buttons = "Un des liens n'est pas reconnu : corrigez-le (message sous le bouton concerné)."
    }

    if (!formData.rattachement) errors.rattachement = "Cochez au moins un pays : France, Suisse ou les deux."
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setError("Certains champs sont à compléter ou à corriger : voir les messages en rouge.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        eyebrow: formData.eyebrow,
        title: formData.title,
        content: formData.content,
        audience: formData.audience,
        price_eur: formData.price_eur,
        price_chf: formData.price_chf,
        price_detail: formData.price_detail,
        rattachement: formData.rattachement,
      }

      let sectionId
      if (isEditing) {
        await updateEducationSection(Number(id), payload)
        sectionId = Number(id)
      } else {
        const created = await createEducationSection(payload)
        sectionId = created.id
      }

      await updateEducationSectionMedia(sectionId, {
        images: formData.photos.map(p => ({ file_url: p.file_url, label: p.label || null })),
        buttons: formData.buttons.map(b => ({ label: b.label.trim(), url: b.url.trim() })),
      })

      navigate(BACK)
    } catch (err) {
      setError(err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-dash-legend text-sm italic p-8">Chargement...</p>

  // Menu d'ancres du formulaire
  const formSections = [
    { label: 'Présentation',    id: 'presentation' },
    { label: 'Infos pratiques', id: 'infos-pratiques' },
    { label: 'Photos',          id: 'photos' },
    { label: 'Pays concerné',   id: 'pays-concerne' },
  ]

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-24">

      <button
        onClick={() => navigate(BACK)}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour à Éducation & sensibilisation
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier une section' : 'Créer une section'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <AnchorNav sections={formSections} variant="dashboard" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        {/* ── Présentation ── */}
        <FormSection id="presentation" title="Présentation">
          <Field
            label="Petit titre au-dessus (facultatif)" name="eyebrow" value={formData.eyebrow} onChange={handleChange}
            hint="ex. : Programme international"
          />
          <Field
            label="Titre de la section" name="title" value={formData.title} onChange={handleChange}
            required error={fieldErrors.title} hint="ex. : Label Éco-École"
          />
          <TextareaField
            label="Texte de présentation" name="content" value={formData.content} onChange={handleChange}
            required error={fieldErrors.content} rows={12}
            hint="Mise en page : laissez une ligne vide pour commencer un nouveau paragraphe. Commencez une ligne par « - » pour créer une puce."
          />
        </FormSection>

        {/* ── Informations pratiques ── */}
        <FormSection
          id="infos-pratiques"
          title="Informations pratiques (facultatif)"
          description="Encadré affiché à côté du texte de présentation. Les champs laissés vides n'apparaissent pas."
        >
          {/* Public : cases à cocher */}
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-dash-text mb-1">Public concerné</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {SECTION_AUDIENCE_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-dash-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.audience.includes(opt.value)}
                    onChange={() => toggleAudience(opt.value)}
                    className="w-4 h-4 accent-dash-action"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Tarif : euros (page France) et francs suisses (page Suisse) */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-dash-text">Tarif</p>
            <p className="text-xs text-dash-legend -mt-0.5">
              La page France affiche le tarif en euros, la page Suisse le tarif en francs suisses, la page Éducation les deux.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Tarif en euros" name="price_eur" value={formData.price_eur} onChange={handleChange}
              hint="ex. : 500 €, Gratuit, Sur devis"
            />
            <Field
              label="Tarif en francs suisses" name="price_chf" value={formData.price_chf} onChange={handleChange}
              hint="ex. : 480 CHF, Gratuit, Sur devis"
            />
          </div>
          <Field
            label="Précision sur le tarif" name="price_detail" value={formData.price_detail} onChange={handleChange}
            hint="ex. : pour l'ensemble du projet sur l'année scolaire"
          />

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-dash-text">Boutons</p>
            <p className="text-xs text-dash-legend -mt-0.5 mb-1">
              Jusqu'à 3 boutons, affichés en bas de l'encadré. Un bouton peut mener à une page, à un autre site ou à un document (plaquette, programme…).
            </p>
            <ButtonLinksField
              value={formData.buttons}
              onChange={(buttons) => setField('buttons', buttons)}
              error={fieldErrors.buttons}
            />
          </div>
        </FormSection>

        {/* ── Photos ── */}
        <FormSection
          id="photos"
          title="Photos (facultatif)"
          description="Affichées en carrousel « En images » sous la section."
        >
          <AdminFileUpload
            value={formData.photos}
            onChange={(photos) => setField('photos', photos)}
            accept="image/*"
            maxFiles={15}
            imageType="gallery"
            showLabel={true}
            layout="grid"
          />
        </FormSection>

        {/* ── Pays concerné (rattachement financeurs) ── */}
        <FormSection
          id="pays-concerne"
          title={<>Pays concerné <span className="text-red-500">*</span></>}
          description="Pour quel pays cette section est-elle mise en avant auprès des financeurs ? Cochez les deux si elle concerne la France et la Suisse."
        >
          <RattachementField
            value={formData.rattachement}
            onChange={(value) => setField('rattachement', value)}
            error={fieldErrors.rattachement}
          />
        </FormSection>

        <FormActionBar
          onCancel={() => navigate(BACK)}
          submitting={submitting}
          submitLabel={isEditing ? 'Enregistrer les modifications' : 'Ajouter la section'}
        />

      </form>
    </div>
  )
}

export default EducationSectionFormPage
