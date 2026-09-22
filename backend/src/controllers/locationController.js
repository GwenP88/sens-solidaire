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

import { syncGalleryImages } from '../services/mediaService.js'
import {
  findAllForAdmin, findById, create, update, toggleActive, hardDelete,
} from '../services/locationService.js'

// GET /api/admin/locations
export const getAllLocationsAdmin = async (req, res, next) => {
  try {
    const locations = await findAllForAdmin()
    return res.status(200).json({ locations })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/locations/:id
export const getLocationByIdAdmin = async (req, res, next) => {
  try {
    const location = await findById(Number(req.params.id))
    if (!location) return res.status(404).json({ error: true, message: "Lieu introuvable." })
    return res.status(200).json({ location })
  } catch (error) {
    next(error)
  }
}

// POST /api/admin/locations
export const createLocation = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.country || !req.body.slug) {
      return res.status(400).json({ error: true, message: "Titre, pays et slug sont obligatoires." })
    }
    const location = await create(req.body)
    return res.status(201).json({ location })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/admin/locations/:id
export const updateLocation = async (req, res, next) => {
  try {
    const location = await update(Number(req.params.id), req.body)
    return res.status(200).json({ location })
  } catch (error) {
    next(error)
  }
}

// PUT /api/admin/locations/:id/media — galerie (hors hero, géré via update)
export const updateLocationMedia = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { images } = req.body
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: true, message: "images doit être un tableau" })
    }
    await syncGalleryImages('location', id, images)
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/admin/locations/:id/toggle — pause/reprise
export const toggleLocationActive = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const location = await toggleActive(id, req.body.is_active)
    return res.status(200).json({ location })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/admin/locations/:id
export const hardDeleteLocation = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}