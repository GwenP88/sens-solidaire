// src/controllers/mediaController.js
// Gestion des médias liés à une mission — route admin protégée

import { upsertMedia } from '../services/mediaService.js'

// ── UPDATE MISSION MEDIA ──────────────────────────────────────
// PUT /api/admin/missions/:id/media
// Body : { images: [{ file_url }], pdf: { file_url, label } | null }
// Remplace séparément les images et le PDF de la mission.
export const updateMissionMedia = async (req, res, next) => {
  try {
    // 1. Valider l'id
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    const { images = [], pdf = null } = req.body

    // 2. Valider images
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: true, message: "images doit être un tableau" })
    }

    // 3. Sauvegarder les images
    await upsertMedia('mission', id, 'image', images)

    // 4. Sauvegarder le PDF si fourni
    if (pdf && pdf.file_url) {
      await upsertMedia('mission', id, 'pdf', [{ file_url: pdf.file_url, label: pdf.label || 'Guide du volontaire' }])
    } else {
      // Supprime le PDF existant si aucun fourni
      await upsertMedia('mission', id, 'pdf', [])
    }

    return res.status(200).json({ success: true })

  } catch (error) {
    next(error)
  }
}