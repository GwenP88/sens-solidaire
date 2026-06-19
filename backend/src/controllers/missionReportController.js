// missionReportController.js
import { getMissionReports } from '../services/missionReportService.js'

export const getMissionReportsController = async (req, res) => {
  try {
    const reports = await getMissionReports(req.query)
    res.json(reports)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}