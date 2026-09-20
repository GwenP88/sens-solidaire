// src/controllers/mediaController.js
// Gestion des médias liés à une mission — route admin protégée

import { upsertMedia, syncGalleryImages } from '../services/mediaService.js'

// ── UPDATE MISSION MEDIA ──────────────────────────────────────
// PUT /api/admin/missions/:id/media
// Body : { images?: [{ file_url, label?, force_display? }], pdf?: { file_url, label } | null }
// images et pdf sont TOUS LES DEUX optionnels et indépendants — absent =
// on ne touche pas. MissionFormPage n'envoie que pdf, la page Galerie
// n'enverra que images.
export const updateMissionMedia = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    const { images, pdf } = req.body

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({ error: true, message: "images doit être un tableau" })
      }
      await syncGalleryImages('mission', id, images)
    }

    if (pdf !== undefined) {
      if (pdf && pdf.file_url) {
        await upsertMedia('mission', id, 'pdf', [{ file_url: pdf.file_url, label: pdf.label || 'Guide du volontaire' }])
      } else {
        await upsertMedia('mission', id, 'pdf', [])
      }
    }

    return res.status(200).json({ success: true })

  } catch (error) {
    next(error)
  }
}