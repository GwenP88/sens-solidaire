// activityReportController.js
import { getActivityReports } from '../services/activityReportService.js'

export const getActivityReportsController = async (req, res) => {
  try {
    const reports = await getActivityReports()
    res.json(reports)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}