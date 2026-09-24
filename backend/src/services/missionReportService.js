// missionReportService.js
import prisma from '../config/db.js'

// ── GET (PUBLIC) ────────────────────────────────────────────────────────
export const getMissionReports = async (filters = {}) => {
  const where = { is_active: true }
  if (filters.type) where.type = filters.type
  if (filters.destination) where.destination = filters.destination
  if (filters.annee) where.annee = Number(filters.annee)

  return await prisma.missionReport.findMany({
    where,
    orderBy: { annee: 'desc' },
  })
}

// ── FIND ALL FOR ADMIN ─────────────────────────────────────────────────
export const findAllForAdmin = async () => {
  return prisma.missionReport.findMany({
    orderBy: { annee: 'desc' },
  })
}

// ── FIND BY ID (ADMIN) ─────────────────────────────────────────────────
export const findById = async (id) => {
  return prisma.missionReport.findUnique({ where: { id } })
}

// ── CREATE ──────────────────────────────────────────────────────────────
export const create = async (data) => {
  return prisma.missionReport.create({
    data: {
      auteur: data.auteur,
      type: data.type,
      destination: data.destination || null,
      annee: data.annee,
      pdf_url: data.pdf_url,
    },
  })
}

// ── UPDATE ──────────────────────────────────────────────────────────────
export const update = async (id, data) => {
  return prisma.missionReport.update({
    where: { id },
    data: {
      auteur: data.auteur,
      type: data.type,
      destination: data.destination,
      annee: data.annee,
      pdf_url: data.pdf_url,
    },
  })
}

// ── TOGGLE ACTIVE — pause/reprise ───────────────────────────────────────
export const toggleActive = async (id, is_active) => {
  return prisma.missionReport.update({
    where: { id },
    data: { is_active },
  })
}

// ── HARD DELETE ───────────────────────────────────────────────────────────
export const hardDelete = async (id) => {
  return prisma.missionReport.delete({ where: { id } })
}