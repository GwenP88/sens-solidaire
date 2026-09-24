import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllMissionReportsAdmin, getMissionReportByIdAdmin,
  createMissionReport, updateMissionReport, toggleMissionReportActive, hardDeleteMissionReport,
} from '../controllers/missionReportController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllMissionReportsAdmin)
router.get('/:id', getMissionReportByIdAdmin)
router.post('/', createMissionReport)
router.patch('/:id', updateMissionReport)
router.patch('/:id/toggle', toggleMissionReportActive)
router.delete('/:id', hardDeleteMissionReport)

export default router