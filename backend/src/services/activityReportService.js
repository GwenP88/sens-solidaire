// activityReportService.js
import prisma from '../config/db.js'

// ── GET (PUBLIC) ────────────────────────────────────────────────────────
export const getActivityReports = async () => {
  return await prisma.activityReport.findMany({
    where: { is_active: true },
    orderBy: { annee: 'desc' },
  })
}

// ── FIND ALL FOR ADMIN ─────────────────────────────────────────────────
export const findAllForAdmin = async () => {
  return prisma.activityReport.findMany({
    orderBy: { annee: 'desc' },
  })
}

// ── FIND BY ID (ADMIN) ─────────────────────────────────────────────────
export const findById = async (id) => {
  return prisma.activityReport.findUnique({ where: { id } })
}

// ── CREATE ──────────────────────────────────────────────────────────────
export const create = async (data) => {
  try {
    return await prisma.activityReport.create({
      data: {
        annee: data.annee,
        url: data.url,
      },
    })
  } catch (error) {
    // P2002 = violation @unique — une entrée existe déjà pour cette année
    if (error.code === 'P2002') {
      const err = new Error("Un rapport existe déjà pour cette année.")
      err.status = 409
      err.code = 'YEAR_TAKEN'
      throw err
    }
    throw error
  }
}

// ── UPDATE ──────────────────────────────────────────────────────────────
export const update = async (id, data) => {
  try {
    return await prisma.activityReport.update({
      where: { id },
      data: {
        annee: data.annee,
        url: data.url,
      },
    })
  } catch (error) {
    if (error.code === 'P2025') {
      const err = new Error("Rapport introuvable.")
      err.status = 404
      err.code = 'REPORT_NOT_FOUND'
      throw err
    }
    if (error.code === 'P2002') {
      const err = new Error("Un rapport existe déjà pour cette année.")
      err.status = 409
      err.code = 'YEAR_TAKEN'
      throw err
    }
    throw error
  }
}

// ── TOGGLE ACTIVE — pause/reprise ───────────────────────────────────────
export const toggleActive = async (id, is_active) => {
  return prisma.activityReport.update({
    where: { id },
    data: { is_active },
  })
}

// ── HARD DELETE ───────────────────────────────────────────────────────────
export const hardDelete = async (id) => {
  return prisma.activityReport.delete({ where: { id } })
}