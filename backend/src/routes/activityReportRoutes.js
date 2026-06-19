// activityReportRoutes.js
import { Router } from 'express'
import { getActivityReportsController } from '../controllers/activityReportController.js'

const router = Router()
router.get('/', getActivityReportsController)

export default router