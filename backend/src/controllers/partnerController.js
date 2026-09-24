// partnerController.js
import {
  getPartners,
  findAllForAdmin, findById, create, update, toggleActive, hardDelete,
} from '../services/partnerService.js'

// ── GET (PUBLIC) ────────────────────────────────────────────────────────
export const getPartnersController = async (req, res) => {
  try {
    const partners = await getPartners()
    res.json(partners)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ── GET ALL (ADMIN) ────────────────────────────────────────────────────────
// GET /api/admin/partners
export const getAllPartnersAdmin = async (req, res, next) => {
  try {
    const partners = await findAllForAdmin()
    return res.status(200).json({ partners })
  } catch (error) {
    next(error)
  }
}

// ── GET BY ID (ADMIN) ──────────────────────────────────────────────────────
// GET /api/admin/partners/:id
export const getPartnerByIdAdmin = async (req, res, next) => {
  try {
    const partner = await findById(Number(req.params.id))
    if (!partner) return res.status(404).json({ error: true, message: "Partenaire introuvable." })
    return res.status(200).json({ partner })
  } catch (error) {
    next(error)
  }
}

// ── CREATE (ADMIN) ─────────────────────────────────────────────────────────
// POST /api/admin/partners
export const createPartner = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: true, message: "Le nom est obligatoire." })
    }
    const partner = await create(req.body)
    return res.status(201).json({ partner })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE (ADMIN) ─────────────────────────────────────────────────────────
// PATCH /api/admin/partners/:id
export const updatePartner = async (req, res, next) => {
  try {
    const partner = await update(Number(req.params.id), req.body)
    return res.status(200).json({ partner })
  } catch (error) {
    next(error)
  }
}

// ── TOGGLE ACTIVE (ADMIN) — pause/reprise ──────────────────────────────────
// PATCH /api/admin/partners/:id/toggle
export const togglePartnerActive = async (req, res, next) => {
  try {
    const partner = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ partner })
  } catch (error) {
    next(error)
  }
}

// ── HARD DELETE (ADMIN) ────────────────────────────────────────────────────
// DELETE /api/admin/partners/:id
export const hardDeletePartner = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}