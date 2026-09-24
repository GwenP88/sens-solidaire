// activityReportController.js
import {
  getActivityReports,
  findAllForAdmin, findById, create, update, toggleActive, hardDelete,
} from '../services/activityReportService.js'

// ── GET (PUBLIC) ────────────────────────────────────────────────────────
export const getActivityReportsController = async (req, res) => {
  try {
    const reports = await getActivityReports()
    res.json(reports)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ── GET ALL (ADMIN) ────────────────────────────────────────────────────────
// GET /api/admin/activity-reports
export const getAllActivityReportsAdmin = async (req, res, next) => {
  try {
    const reports = await findAllForAdmin()
    return res.status(200).json({ reports })
  } catch (error) {
    next(error)
  }
}

// ── GET BY ID (ADMIN) ──────────────────────────────────────────────────────
// GET /api/admin/activity-reports/:id
export const getActivityReportByIdAdmin = async (req, res, next) => {
  try {
    const report = await findById(Number(req.params.id))
    if (!report) return res.status(404).json({ error: true, message: "Rapport introuvable." })
    return res.status(200).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── CREATE (ADMIN) ─────────────────────────────────────────────────────────
// POST /api/admin/activity-reports
export const createActivityReport = async (req, res, next) => {
  try {
    if (!req.body.annee || !req.body.url) {
      return res.status(400).json({ error: true, message: "Année et lien du PDF sont obligatoires." })
    }
    const report = await create(req.body)
    return res.status(201).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE (ADMIN) ─────────────────────────────────────────────────────────
// PATCH /api/admin/activity-reports/:id
export const updateActivityReport = async (req, res, next) => {
  try {
    const report = await update(Number(req.params.id), req.body)
    return res.status(200).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── TOGGLE ACTIVE (ADMIN) — pause/reprise ──────────────────────────────────
// PATCH /api/admin/activity-reports/:id/toggle
export const toggleActivityReportActive = async (req, res, next) => {
  try {
    const report = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ report })
  } catch (error) {
    next(error)
  }
}

// ── HARD DELETE (ADMIN) ────────────────────────────────────────────────────
// DELETE /api/admin/activity-reports/:id
export const hardDeleteActivityReport = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}