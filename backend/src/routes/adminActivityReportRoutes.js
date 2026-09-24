import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllActivityReportsAdmin, getActivityReportByIdAdmin,
  createActivityReport, updateActivityReport, toggleActivityReportActive, hardDeleteActivityReport,
} from '../controllers/activityReportController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllActivityReportsAdmin)
router.get('/:id', getActivityReportByIdAdmin)
router.post('/', createActivityReport)
router.patch('/:id', updateActivityReport)
router.patch('/:id/toggle', toggleActivityReportActive)
router.delete('/:id', hardDeleteActivityReport)

export default router