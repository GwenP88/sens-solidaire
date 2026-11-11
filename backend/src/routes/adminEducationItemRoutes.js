// adminEducationItemRoutes.js
// Routes admin (protégées) — cards de la page Éducation (ateliers…) (tâche 172A)

import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllEducationItemsAdmin, getEducationItemByIdAdmin,
  createEducationItem, updateEducationItem, toggleEducationItemActive, hardDeleteEducationItem,
} from '../controllers/educationItemController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllEducationItemsAdmin)
router.get('/:id', getEducationItemByIdAdmin)
router.post('/', createEducationItem)
router.patch('/:id', updateEducationItem)
router.patch('/:id/toggle', toggleEducationItemActive)
router.delete('/:id', hardDeleteEducationItem)

export default router
