// missionReportController.js
import {
  getMissionReports,
  findAllForAdmin, findById, create, update, toggleActive, hardDelete,
} from '../services/missionReportService.js'
import { isFilled, isValidYear } from '../utils/validation.js'

const validateMissionReport = (body, { partial = false } = {}) => {
  const isChecked = (field) => !partial || field in body

  if (isChecked('auteur') && !isFilled(body.auteur)) return "Le nom de l'auteur est obligatoire."
  if (isChecked('type') && !isFilled(body.type))     return "Choisissez un type de mission."
  if (isChecked('annee')) {
    if (!isFilled(body.annee))    return "L'année de la mission est obligatoire."
    if (!isValidYear(body.annee)) return "Indiquez une année valide, par exemple 2025."
  }
  if (isChecked('pdf_url') && !isFilled(body.pdf_url)) return "Ajoutez le rapport au format PDF."
  return null
}

// ── GET (PUBLIC) ────────────────────────────────────────────────────────
export const getMissionReportsController = async (req, res) => {
  try {
    const reports = await getMissionReports(req.query)
    res.json(reports)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ── GET ALL (ADMIN) ────────────────────────────────────────────────────────
// GET /api/admin/mission-reports
export const getAllMissionReportsAdmin = async (req, res, next) => {
  try {
    const reports = await findAllForAdmin()
    return res.status(200).json({ reports })
  } catch (error) {
    next(error)
  }
}

// ── GET BY ID (ADMIN) ──────────────────────────────────────────────────────
// GET /api/admin/mission-reports/:id
export const getMissionReportByIdAdmin = async (req, res, next) => {
  try {
    const report = await findById(Number(req.params.id))
    if (!report) return res.status(404).json({ error: true, message: "Rapport introuvable." })
    return res.status(200).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── CREATE (ADMIN) ─────────────────────────────────────────────────────────
// POST /api/admin/mission-reports
export const createMissionReport = async (req, res, next) => {
  try {
    const validationError = validateMissionReport(req.body)
    if (validationError) {
      return res.status(400).json({ error: true, message: validationError })
    }
    const report = await create(req.body)
    return res.status(201).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE (ADMIN) ─────────────────────────────────────────────────────────
// PATCH /api/admin/mission-reports/:id
export const updateMissionReport = async (req, res, next) => {
  try {
    const validationError = validateMissionReport(req.body, { partial: true })
    if (validationError) {
      return res.status(400).json({ error: true, message: validationError })
    }
    const report = await update(Number(req.params.id), req.body)
    return res.status(200).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── TOGGLE ACTIVE (ADMIN) — pause/reprise ──────────────────────────────────
// PATCH /api/admin/mission-reports/:id/toggle
export const toggleMissionReportActive = async (req, res, next) => {
  try {
    const report = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── HARD DELETE (ADMIN) ────────────────────────────────────────────────────
// DELETE /api/admin/mission-reports/:id
export const hardDeleteMissionReport = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}