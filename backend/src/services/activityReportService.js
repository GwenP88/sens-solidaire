// activityReportService.js
import prisma from '../config/db.js'

export const getActivityReports = async () => {
  return await prisma.activityReport.findMany({
    where: { is_active: true },
    orderBy: { annee: 'desc' },
  })
}