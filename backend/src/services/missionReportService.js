// missionReportService.js
import prisma from '../config/db.js'

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