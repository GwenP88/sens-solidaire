// locationController.js
// Contrôleur — lieux partenaires

import { getLocationBySlugService, findAllByCountry } from '../services/locationService.js'

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

// ── GET LOCATIONS (PUBLIC) — liste filtrée par pays ───────────────────────────
// GET /api/locations?country=Kenya,Senegal
export const getLocations = async (req, res) => {
  try {
    const { country } = req.query
    if (!country) {
      return res.status(400).json({ error: true, message: "Paramètre country requis" })
    }
    const countries = country.split(',').map(c => c.trim())
    const locations = await findAllByCountry(countries)
    res.json({ success: true, locations })
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}