// src/controllers/pricingController.js
// Gestion des tarifs d'une mission — route admin protégée

import { upsertPricing } from '../services/pricingService.js'

// ── UPDATE MISSION PRICING ────────────────────────────────────
// PUT /api/admin/missions/:id/pricing
// Remplace toutes les lignes de tarif d'une mission.
// Body : { lines: [{ duration_label, price }] }
export const updateMissionPricing = async (req, res, next) => {
  try {
    // 1. Valider l'id
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    // 2. Valider le body
    const { lines } = req.body
    if (!Array.isArray(lines)) {
      return res.status(400).json({ error: true, message: "lines doit être un tableau" })
    }

    // 3. Valider chaque ligne
    for (const line of lines) {
      if (!line.duration_label || line.duration_label.trim() === '') {
        return res.status(400).json({ error: true, message: "Chaque ligne doit avoir une durée" })
      }
    }

    // 4. Appel du service
    await upsertPricing(id, lines)

    return res.status(200).json({ success: true })

  } catch (error) {
    next(error)
  }
}