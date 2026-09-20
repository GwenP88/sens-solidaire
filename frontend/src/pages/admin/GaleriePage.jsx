// ════════════════════════════════════════════════════════════════
// GaleriePage.jsx
// Gestion centralisée des galeries photo — dashboard admin.
// 3 sélecteurs en cascade : Domaine → Type → Pays.
// Pour l'instant : seul Domaine=Missions / Type=Volontariat individuel
// est actif — les autres options existent dans l'interface mais sont
// désactivées, prêtes pour une extension future (#124-128).
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { fetchAdminMissions, fetchAdminMissionById, updateMissionMedia } from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'

const DOMAINES = [
  { value: 'missions', label: 'Missions' },
  { value: 'education', label: 'Éducation & sensibilisation', disabled: true },
]

const TYPES = [
  { value: 'volontariat_individuel', label: 'Volontariat individuel' },
  { value: 'service_civique', label: 'Service Civique', disabled: true },
  { value: 'groupe_jeunes', label: 'Groupe jeunes', disabled: true },
  { value: 'conge_solidaire', label: 'Congé solidaire', disabled: true },
]

function GaleriePage() {
  const [domaine, setDomaine] = useState('missions')
  const [type, setType] = useState('volontariat_individuel')
  const [missions, setMissions] = useState([])
  const [selectedMissionId, setSelectedMissionId] = useState('')
  const [loading, setLoading] = useState(true)
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  // Charge toutes les missions du type sélectionné, pour peupler le sélecteur pays
  useEffect(() => {
    setLoading(true)
    fetchAdminMissions()
      .then(data => {
        setMissions(data.filter(m => m.type === type))
        setSelectedMissionId('')
      })
      .catch(() => setMissions([]))
      .finally(() => setLoading(false))
  }, [type])

  // Charge la galerie existante dès qu'une mission est sélectionnée
  useEffect(() => {
    if (!selectedMissionId) {
      setGalleryPhotos([])
      return
    }
    setLoadingGallery(true)
    setSaveMessage(null)
    fetchAdminMissionById(selectedMissionId)
      .then(mission => {
        const photos = (mission.media || [])
          .filter(m => m.file_type === 'image')
          .map(m => ({ file_url: m.file_url, label: m.label || '', force_display: m.force_display || false }))
        setGalleryPhotos(photos)
      })
      .catch(() => setGalleryPhotos([]))
      .finally(() => setLoadingGallery(false))
  }, [selectedMissionId])

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage(null)
    try {
      const images = galleryPhotos.map(p => ({
        file_url: p.file_url,
        label: p.label || null,
        force_display: p.force_display || false,
      }))
      await updateMissionMedia(selectedMissionId, images)
      setSaveMessage({ type: 'success', text: 'Galerie enregistrée.' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="font-heading font-bold text-2xl text-primary mb-8">Galerie photo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Domaine</label>
          <select
            value={domaine}
            onChange={e => setDomaine(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {DOMAINES.map(d => (
              <option key={d.value} value={d.value} disabled={d.disabled}>
                {d.label}{d.disabled ? ' (bientôt disponible)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Type de mission</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {TYPES.map(t => (
              <option key={t.value} value={t.value} disabled={t.disabled}>
                {t.label}{t.disabled ? ' (bientôt disponible)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Pays</label>
          <select
            value={selectedMissionId}
            onChange={e => setSelectedMissionId(e.target.value)}
            disabled={loading || missions.length === 0}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">{loading ? 'Chargement...' : 'Choisir un pays'}</option>
            {missions.map(m => (
              <option key={m.id} value={m.id}>{m.country}</option>
            ))}
          </select>
        </div>

      </div>

      {selectedMissionId && (
        <div className="flex flex-col gap-4">

          {loadingGallery ? (
            <p className="text-gray-400 text-sm italic">Chargement de la galerie...</p>
          ) : (
            <>
              <AdminFileUpload
                value={galleryPhotos}
                onChange={setGalleryPhotos}
                accept="image/*"
                maxFiles={30}
                imageType="gallery"
                showLabel={true}
                showForceDisplay={true}
                layout="grid"
                allowReorder={false}
                helperText="Formats : JPG, JPEG, PNG, WEBP, AVIF, SVG. Cochez « Toujours afficher » pour conserver une photo dans la galerie. Sinon, les 10 photos les plus récentes sont affichées automatiquement."
              />

              {saveMessage && (
                <p className={`text-sm ${saveMessage.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                  {saveMessage.text}
                </p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="self-start px-6 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer la galerie'}
              </button>
            </>
          )}

        </div>
      )}
    </div>
  )
}

export default GaleriePage