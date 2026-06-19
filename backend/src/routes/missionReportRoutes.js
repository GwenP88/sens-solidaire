// missionReportRoutes.js
import { Router } from 'express'
import { getMissionReportsController } from '../controllers/missionReportController.js'

const router = Router()
router.get('/', getMissionReportsController)

export default router