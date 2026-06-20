// locationController.js
// Contrôleur — lieux partenaires

import { getLocationBySlugService } from '../services/locationService.js'

export const getLocationBySlug = async (req, res) => {
  try {
    const location = await getLocationBySlugService(req.params.slug)
    if (!location) return res.status(404).json({ error: 'Lieu introuvable' })
    res.json(location)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}