// ════════════════════════════════════════════════════════════════
// GaleriePage.jsx
// Gestion centralisée des galeries photo — dashboard admin.
// 3 sélecteurs en cascade : Domaine → Type → Pays.
// "Pays" propose aussi "Tous les pays" — vue combinée en lecture/gestion
// seule (case "Toujours afficher" + suppression), pas d'upload possible
// dans ce mode (impossible de savoir à quelle mission rattacher une
// nouvelle photo sans avoir choisi un pays précis).
// Groupe jeunes / Congé de solidarité n'ont PAS de notion de pays — une seule
// galerie par type, pas rattachée à une mission (voir galleryController.js
// côté backend) — le sélecteur "Pays" est masqué pour ces 2 types, l'éditeur
// s'ouvre directement.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import {
  fetchAdminMissions, fetchAdminMissionById, updateMissionMedia,
  fetchAdminTypeGallery, updateTypeGalleryMedia,
} from '../../services/api'
import AdminFileUpload from '../../components/admin/AdminFileUpload'

const DOMAINES = [
  { value: 'missions', label: 'Missions' },
  { value: 'education', label: 'Éducation & sensibilisation', disabled: true },
]

const TYPES = [
  { value: 'volontariat_individuel', label: 'Volontariat individuel' },
  { value: 'service_civique', label: 'Service Civique' },
  { value: 'groupe_jeunes', label: 'Groupe jeunes' },
  { value: 'conge_solidaire', label: 'Congé de solidarité' },
]

// Types sans notion de pays — une seule galerie, pas de mission derrière
const TYPE_ONLY_TYPES = ['groupe_jeunes', 'conge_solidaire']

function GaleriePage() {
  const [domaine, setDomaine] = useState('missions')
  const [type, setType] = useState('volontariat_individuel')
  const [missions, setMissions] = useState([])
  const [selectedMissionId, setSelectedMissionId] = useState('')
  const [loading, setLoading] = useState(true)

  // ── Mode "un seul pays" ET mode "galerie par type" — même éditeur, source différente ──
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  // ── Mode "Tous les pays" ──
  const [allPhotos, setAllPhotos] = useState([]) // [{ ...media, country, missionId }]
  const [loadingAll, setLoadingAll] = useState(false)

  const isTypeOnlyGallery = TYPE_ONLY_TYPES.includes(type)
  const isAllCountries = selectedMissionId === 'all'

  // Charge toutes les missions du type sélectionné, pour peupler le sélecteur
  // pays — inutile pour les types sans pays (Groupe jeunes/Congé de solidarité)
  useEffect(() => {
    if (isTypeOnlyGallery) {
      setMissions([])
      setSelectedMissionId('')
      setLoading(false)
      return
    }
    setLoading(true)
    fetchAdminMissions()
      .then(data => {
        setMissions(data.filter(m => m.type === type && !m.slug.startsWith('ancre-')))
        setSelectedMissionId('')
      })
      .catch(() => setMissions([]))
      .finally(() => setLoading(false))
  }, [type])

  // Mode "un seul pays" — charge la galerie de la mission choisie
  useEffect(() => {
    if (isTypeOnlyGallery || !selectedMissionId || isAllCountries) {
      if (!isTypeOnlyGallery) setGalleryPhotos([])
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

  // Mode "galerie par type" (Groupe jeunes/Congé de solidarité) — charge dès que
  // le type change, pas d'étape "pays" à attendre
  useEffect(() => {
    if (!isTypeOnlyGallery) return
    setLoadingGallery(true)
    setSaveMessage(null)
    fetchAdminTypeGallery(type)
      .then(media => {
        const photos = media.map(m => ({ file_url: m.file_url, label: m.label || '', force_display: m.force_display || false }))
        setGalleryPhotos(photos)
      })
      .catch(() => setGalleryPhotos([]))
      .finally(() => setLoadingGallery(false))
  }, [type])

  // Mode "Tous les pays" — charge et combine la galerie de toutes les missions du type
  useEffect(() => {
    if (!isAllCountries) {
      setAllPhotos([])
      return
    }
    setLoadingAll(true)
    Promise.all(missions.map(m => fetchAdminMissionById(m.id)))
      .then(fullMissions => {
        const combined = fullMissions.flatMap(mission =>
          (mission.media || [])
            .filter(m => m.file_type === 'image')
            .map(m => ({
              file_url: m.file_url,
              label: m.label || '',
              force_display: m.force_display || false,
              country: mission.country,
              missionId: mission.id,
            }))
        )
        setAllPhotos(combined)
      })
      .catch(() => setAllPhotos([]))
      .finally(() => setLoadingAll(false))
  }, [selectedMissionId, missions])

  // ── Enregistrement groupé (bouton) — branche selon le mode ──
  const handleSave = async () => {
    setSaving(true)
    setSaveMessage(null)
    try {
      const images = galleryPhotos.map(p => ({
        file_url: p.file_url,
        label: p.label || null,
        force_display: p.force_display || false,
      }))
      if (isTypeOnlyGallery) {
        await updateTypeGalleryMedia(type, images)
      } else {
        await updateMissionMedia(selectedMissionId, images)
      }
      setSaveMessage({ type: 'success', text: 'Galerie enregistrée.' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  // ── Mode "Tous les pays" — chaque action s'enregistre immédiatement,
  //    sur la mission d'origine de la photo concernée uniquement ──
  const saveOnePhotoChange = async (missionId, updatedPhotosForThisMission) => {
    const images = updatedPhotosForThisMission.map(p => ({
      file_url: p.file_url,
      label: p.label || null,
      force_display: p.force_display || false,
    }))
    await updateMissionMedia(missionId, images)
  }

  const handleToggleForceDisplay = async (photo) => {
    const updated = allPhotos.map(p =>
      p.file_url === photo.file_url ? { ...p, force_display: !p.force_display } : p
    )
    setAllPhotos(updated)

    const thisMissionPhotos = updated.filter(p => p.missionId === photo.missionId)
    try {
      await saveOnePhotoChange(photo.missionId, thisMissionPhotos)
    } catch (err) {
      alert("Échec de l'enregistrement. Réessaie.")
    }
  }

  const handleDeletePhoto = async (photo) => {
    const confirmed = window.confirm(`Supprimer cette photo de la galerie ${photo.country} ?`)
    if (!confirmed) return

    const updated = allPhotos.filter(p => p.file_url !== photo.file_url)
    setAllPhotos(updated)

    const thisMissionPhotos = updated.filter(p => p.missionId === photo.missionId)
    try {
      await saveOnePhotoChange(photo.missionId, thisMissionPhotos)
    } catch (err) {
      alert("Échec de la suppression. Réessaie.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-8">Galeries photos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dash-text">Domaine</label>
          <select
            value={domaine}
            onChange={e => setDomaine(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
          >
            {DOMAINES.map(d => (
              <option key={d.value} value={d.value} disabled={d.disabled}>
                {d.label}{d.disabled ? ' (bientôt disponible)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-dash-text">Type de mission</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
          >
            {TYPES.map(t => (
              <option key={t.value} value={t.value} disabled={t.disabled}>
                {t.label}{t.disabled ? ' (bientôt disponible)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Pas de sélecteur "Pays" pour Groupe jeunes/Congé de solidarité — une seule galerie */}
        {isTypeOnlyGallery ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">Pays</label>
            <p className="text-sm text-dash-legend italic px-3 py-2">
              Pas de pays pour ce type de mission
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-dash-text">Pays</label>
            <select
              value={selectedMissionId}
              onChange={e => setSelectedMissionId(e.target.value)}
              disabled={loading || missions.length === 0}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
            >
              <option value="">{loading ? 'Chargement...' : 'Choisir un pays'}</option>
              {missions.length > 1 && <option value="all">Tous les pays</option>}
              {missions.map(m => (
                <option key={m.id} value={m.id}>{m.country}</option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* ── Éditeur — "galerie par type" OU "un seul pays" (même composant) ── */}
      {(isTypeOnlyGallery || (selectedMissionId && !isAllCountries)) && (
        <div className="flex flex-col gap-4">
          {loadingGallery ? (
            <p className="text-dash-legend text-sm italic">Chargement de la galerie...</p>
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
                helperText="Formats : JPG, JPEG, PNG, WEBP, AVIF, SVG. Cochez « Toujours afficher » pour qu’une photo reste visible sur le site. Sinon, les 10 photos les plus récentes sont affichées automatiquement."
              />
              {saveMessage && (
                <p className={`text-sm ${saveMessage.type === 'error' ? 'text-dash-danger' : 'text-dash-success'}`}>
                  {saveMessage.text}
                </p>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="self-start px-6 py-2 text-sm font-medium bg-dash-editorial text-white rounded-lg hover:bg-dash-editorial/90 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer la galerie'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Mode "Tous les pays" — consultation/gestion, pas d'upload ── */}
      {isAllCountries && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-dash-legend italic">
            Les photos de tous les pays sont affichées ici. Pour ajouter une photo, sélectionnez d'abord un pays.
          </p>
          {loadingAll ? (
            <p className="text-dash-legend text-sm italic">Chargement...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allPhotos.map((photo, i) => (
                <div key={photo.file_url} className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3">
                  <img src={photo.file_url} alt="" className="w-full h-32 object-cover rounded" />
                  <span className="text-sm text-dash-text truncate">{photo.label || 'Sans légende'}</span>
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-dash-legend cursor-pointer">
                      <input
                        type="checkbox"
                        checked={photo.force_display}
                        onChange={() => handleToggleForceDisplay(photo)}
                        className="w-4 h-4 accent-dash-success"
                      />
                      Toujours afficher
                    </label>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-dash-editorial/10 text-dash-editorial whitespace-nowrap">
                      {photo.country}
                    </span>
                    <button
                      onClick={() => handleDeletePhoto(photo)}
                      className="text-gray-300 hover:text-dash-danger text-xl shrink-0"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GaleriePage