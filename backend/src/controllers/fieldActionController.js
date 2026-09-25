// fieldActionController.js
// Contrôleur — actions terrain

import {
  getAllFieldActions, getFieldActionBySlugService,
  findAllForAdmin, findById, create, update, updateGallery, toggleActive, hardDelete,
} from '../services/fieldActionService.js'

// ── PUBLIC ────────────────────────────────────────────────────────────────
export const getFieldActions = async (req, res) => {
  try {
    const { country } = req.query
    const actions = await getAllFieldActions(country || null)
    res.json(actions)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getFieldActionBySlug = async (req, res) => {
  try {
    const action = await getFieldActionBySlugService(req.params.slug)
    if (!action) return res.status(404).json({ error: 'Action introuvable' })
    res.json(action)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ── GET ALL (ADMIN) ────────────────────────────────────────────────────────
// GET /api/admin/field-actions
export const getAllFieldActionsAdmin = async (req, res, next) => {
  try {
    const actions = await findAllForAdmin()
    return res.status(200).json({ actions })
  } catch (error) {
    next(error)
  }
}

// ── GET BY ID (ADMIN) ──────────────────────────────────────────────────────
// GET /api/admin/field-actions/:id
export const getFieldActionByIdAdmin = async (req, res, next) => {
  try {
    const action = await findById(Number(req.params.id))
    if (!action) return res.status(404).json({ error: true, message: "Action introuvable." })
    return res.status(200).json({ action })
  } catch (error) {
    next(error)
  }
}

// ── CREATE (ADMIN) ─────────────────────────────────────────────────────────
// POST /api/admin/field-actions
export const createFieldAction = async (req, res, next) => {
  try {
    if (!req.body.slug || !req.body.title || !req.body.description || !req.body.content) {
      return res.status(400).json({ error: true, message: "Titre, description courte et contenu sont obligatoires." })
    }
    const action = await create(req.body)
    return res.status(201).json({ action })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: true, message: "Une action avec ce titre existe déjà." })
    }
    next(error)
  }
}

// ── UPDATE (ADMIN) ─────────────────────────────────────────────────────────
// PATCH /api/admin/field-actions/:id
export const updateFieldAction = async (req, res, next) => {
  try {
    const action = await update(Number(req.params.id), req.body)
    return res.status(200).json({ action })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE GALLERY (ADMIN) ─────────────────────────────────────────────────
// PUT /api/admin/field-actions/:id/media
export const updateFieldActionGallery = async (req, res, next) => {
  try {
    await updateGallery(Number(req.params.id), req.body.images || [])
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}

// ── TOGGLE ACTIVE (ADMIN) — pause/reprise ──────────────────────────────────
// PATCH /api/admin/field-actions/:id/toggle
export const toggleFieldActionActive = async (req, res, next) => {
  try {
    const action = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ action })
  } catch (error) {
    next(error)
  }
}

// ── HARD DELETE (ADMIN) ────────────────────────────────────────────────────
// DELETE /api/admin/field-actions/:id
export const hardDeleteFieldAction = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}