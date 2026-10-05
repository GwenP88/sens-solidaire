// partnerController.js
import {
  getPartners,
  findAllForAdmin, findById, create, update, toggleActive, hardDelete,
} from '../services/partnerService.js'

// ── VALIDATION ─────────────────────────────────────────────────────────────
// Nom et logo obligatoires (le logo est affiché dans le bandeau public).
// partial = true pour une modification (PATCH) : on ne vérifie que les champs
// envoyés, mais un champ envoyé vide est refusé.
const validatePartner = (body, { partial = false } = {}) => {
  if ((!partial || 'name' in body) && !body.name?.trim()) {
    return "Le nom du partenaire est obligatoire."
  }
  if ((!partial || 'logo_url' in body) && !body.logo_url?.trim()) {
    return "Le logo du partenaire est obligatoire."
  }
  return null
}

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
    const validationError = validatePartner(req.body)
    if (validationError) {
      return res.status(400).json({ error: true, message: validationError })
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
    const validationError = validatePartner(req.body, { partial: true })
    if (validationError) {
      return res.status(400).json({ error: true, message: validationError })
    }
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