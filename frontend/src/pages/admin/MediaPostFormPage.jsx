// ════════════════════════════════════════════════════════════════
// pages/admin/MediaPostFormPage.jsx
// Création / modification d'une publication « Médias & actualités ».
// Un seul formulaire pour tous les posts. Règle automatique :
//   - lien OU fichier renseigné → la carte l'ouvre (« Consulter → »)
//   - rien → la carte ouvre la page article (« Lire la suite → »),
//     le texte est alors obligatoire
// Adresse de page (slug) générée par le serveur, jamais visible ici.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchAdminMediaPostById,
  createMediaPost,
  updateMediaPost,
  fetchMediaPostThemes,
  updateMediaPostMedia,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'
import { FormSection, Field, FormActionBar } from '../../components/admin/FormElements'
import { previewShortDescription } from '../../utils/shortDescription'

const CARD_SUMMARY_LENGTH = 200 // même valeur que le backend (mediaPostService.js)

// Un fichier envoyé via le dashboard a une adresse de notre serveur ;
// un lien externe commence par http(s):// vers un autre site.
// Sert uniquement à remettre la valeur dans le bon champ en modification.
// ⚠️ À vérifier au premier test avec l'adresse réelle d'un fichier envoyé.
const isUploadedFile = (url) => url.startsWith('/') || url.includes('/uploads/')

const today = () => new Date().toISOString().slice(0, 10)

const EMPTY_FORM = {
  title: '',
  theme: '',
  date: today(),
  content: '',
  image: [],   // [{ file_url, label }] — 1 image max
  url: '',     // lien vers un autre site
  file: [],    // [{ file_url, label }] — 1 fichier max (PDF, audio, vidéo)
  images: [],  // [{ file_url, label }] — photos de l'article (carrousel)
  author: '',
  source: '',
  show_homepage: false,
}

function MediaPostFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [themes, setThemes] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // La carte ouvre-t-elle un lien / fichier ? (sinon : page article)
  const hasLink = Boolean(formData.url.trim()) || formData.file.length > 0

  // ── Chargement en modification ──
  useEffect(() => {
    if (!isEditing) return

    const load = async () => {
      try {
        const post = await fetchAdminMediaPostById(id)
        const link = post.external_url || ''
        const isFile = link && isUploadedFile(link)

        setFormData({
          title: post.title || '',
          theme: post.theme || '',
          date: post.date ? post.date.slice(0, 10) : today(),
          content: post.content || '',
          image: post.image_url ? [{ file_url: post.image_url, label: '' }] : [],
          url: link && !isFile ? link : '',
          file: isFile ? [{ file_url: link, label: '' }] : [],
          images: (post.images || []).map(m => ({ file_url: m.file_url, label: m.label || '' })),
          author: post.author || '',
          source: post.source || '',
          show_homepage: Boolean(post.show_homepage),
        })
      } catch (err) {
        setError("Impossible de charger cette publication. Rechargez la page ou réessayez plus tard.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEditing])

  // ── Thèmes existants, triés à la française (« Événement » à sa place) ──
  useEffect(() => {
    fetchMediaPostThemes()
      .then(list => setThemes([...list].sort((a, b) => a.localeCompare(b, 'fr'))))
      .catch(console.error)
  }, [])

  // ── Mise à jour d'un champ + effacement de son erreur ──
  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleChange = (e) => setField(e.target.name, e.target.value)

  // ── Validation (mêmes règles que le serveur) ──
  const validate = () => {
    const newErrors = {}
    const url = formData.url.trim()

    if (!formData.title.trim()) newErrors.title = "Le titre est obligatoire."
    if (!formData.theme.trim()) newErrors.theme = "Choisissez ou saisissez un thème."
    if (!formData.date)         newErrors.date = "La date est obligatoire."

    if (url && formData.file.length > 0) {
      newErrors.url = "Gardez soit un lien, soit un fichier, pas les deux."
    } else if (url && !/^https?:\/\//.test(url)) {
      newErrors.url = "L'adresse doit commencer par http:// ou https://"
    }

    if (!hasLink && !formData.content.trim()) {
      newErrors.content = "Ajoutez un texte, ou un lien / fichier à consulter."
    }
    return newErrors
  }

  const shortDescriptionPreview = previewShortDescription(formData.content, CARD_SUMMARY_LENGTH)

  // ── Envoi ──
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
      const payload = {
        title: formData.title,
        theme: formData.theme,
        date: formData.date,
        content: formData.content,
        image_url: formData.image[0]?.file_url || null,
        external_url: formData.url.trim() || formData.file[0]?.file_url || null,
        author: formData.author,
        source: formData.source,
        show_homepage: formData.show_homepage,
      }

      // On a besoin de l'id pour rattacher les photos : en création, c'est le serveur qui le donne
      const postId = isEditing
        ? Number(id)
        : (await createMediaPost(payload)).id
      if (isEditing) await updateMediaPost(postId, payload)

      // Photos seulement pour une page article ; sinon on vide (elles ne seraient jamais visibles)
      await updateMediaPostMedia(postId, hasLink ? [] : formData.images)

      navigate('/admin/medias')
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
        onClick={() => navigate('/admin/medias')}
        className="text-sm text-dash-legend hover:text-dash-action mb-1 flex items-center gap-1"
      >
        ← Retour aux médias
      </button>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">
        {isEditing ? 'Modifier la publication' : 'Ajouter une publication'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

        <datalist id="theme-list">
          {themes.map(theme => <option key={theme} value={theme} />)}
        </datalist>

        {/* ── BLOC 1 : Informations ── */}
        <FormSection title="Informations">
          <Field
            label="Titre" name="title" value={formData.title} onChange={handleChange}
            required error={fieldErrors.title}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Thème" name="theme" value={formData.theme} onChange={handleChange}
              required list="theme-list" autoComplete="off" error={fieldErrors.theme}
              hint="choisissez dans la liste ou saisissez un nouveau thème"
            />
            <Field
              label="Date" name="date" type="date" value={formData.date} onChange={handleChange}
              required error={fieldErrors.date}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Field
              label="Source (facultatif)" name="source" value={formData.source} onChange={handleChange}
              hint="Nom du média, affiché sur la carte et la page de l'article"
            />
            <Field
              label="Auteur (facultatif)" name="author" value={formData.author} onChange={handleChange}
              hint="Nom de l'auteur, affiché sur la carte et la page de l'article"
            />
          </div>
        </FormSection>

        {/* ── BLOC 2 : Image ── */}
        <FormSection
          title="Image"
          description="Facultative — une illustration par défaut s'affiche si aucune image n'est ajoutée."
        >
          <AdminFileUpload
            value={formData.image}
            onChange={(image) => setField('image', image)}
            accept="image/*"
            maxFiles={1}
            imageType="card"
            showLabel={false}
          />
        </FormSection>

        {/* ── BLOC 3 : Texte ── */}
        <FormSection title="Texte">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">
              Texte {!hasLink && <span className="text-red-500">*</span>}
            </label>
            <p className="text-xs text-dash-legend -mt-0.5">
              Astuce : insérez <code className="bg-gray-100 px-1 rounded">---</code> à l'endroit où le résumé de la carte doit s'arrêter. Sans repère, il s'arrête à la fin de la dernière phrase complète.
            </p>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-y ${
                fieldErrors.content ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-dash-action/30'
              }`}
            />
            {fieldErrors.content && <span className="text-xs text-red-500">{fieldErrors.content}</span>}
            {formData.content && (
              <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs font-medium text-dash-legend mb-1">
                  Aperçu de la carte — {shortDescriptionPreview.length}/{CARD_SUMMARY_LENGTH} caractères
                </p>
                <p className="text-sm text-dash-text italic">{shortDescriptionPreview}</p>
              </div>
            )}
          </div>
        </FormSection>

        {/* ── BLOC 4 : Lien ou fichier ── */}
        <FormSection
          title="Lien ou fichier à consulter (facultatif)"
          description="Si vous ajoutez un lien ou un fichier, la carte l'ouvre directement. Sinon, elle ouvre la page de l'article."
        >
          <Field
            label="Lien vers un autre site" name="url" value={formData.url} onChange={handleChange}
            error={fieldErrors.url}
            hint="ex. : https://www.francebleu.fr/..."
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-dash-text">Ou fichier depuis votre ordinateur</p>
            <AdminFileUpload
              value={formData.file}
              onChange={(file) => { setField('file', file); setField('url', formData.url) }}
              accept="application/pdf,audio/*,video/*"
              maxFiles={1}
              showLabel={false}
              helperText="PDF, audio ou vidéo."
            />
          </div>
        </FormSection>

        {/* ── BLOC 5 : Photos de l'article — seulement si la carte mène à la page article ── */}
        {!hasLink && (
          <FormSection
            title="Photos de l'article (facultatif)"
            description="Affichées en carrousel sur la page de l'article. La légende décrit la photo pour les personnes malvoyantes."
          >
            <AdminFileUpload
              value={formData.images}
              onChange={(images) => setField('images', images)}
              accept="image/*"
              maxFiles={15}
              imageType="gallery"
              showLabel={true}
              layout="grid"
              allowReorder={false}
            />
          </FormSection>
        )}

        {/* ── BLOC 6 : Mise en avant ── */}
        <FormSection title="Mise en avant">
          <label className="flex items-center gap-2 text-sm text-dash-text cursor-pointer">
            <input
              type="checkbox"
              checked={formData.show_homepage}
              onChange={(e) => setField('show_homepage', e.target.checked)}
              className="w-4 h-4 accent-dash-action"
            />
            Afficher sur la page d'accueil
          </label>
        </FormSection>

        {/* ── Actions — barre collante en bas de l'écran ── */}
        <FormActionBar
          onCancel={() => navigate('/admin/medias')}
          submitting={submitting}
          submitLabel={isEditing ? 'Enregistrer les modifications' : 'Créer la publication'}
        />

      </form>
    </div>
  )
}

export default MediaPostFormPage