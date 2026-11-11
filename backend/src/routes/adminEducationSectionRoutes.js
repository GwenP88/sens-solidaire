// adminEducationSectionRoutes.js
// Routes admin (protégées) — sections de la page Éducation & sensibilisation (tâche 172)

import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllEducationSectionsAdmin, getEducationSectionByIdAdmin,
  createEducationSection, updateEducationSection, updateEducationSectionMedia,
  reorderEducationSections, toggleEducationSectionActive, hardDeleteEducationSection,
} from '../controllers/educationSectionController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllEducationSectionsAdmin)
// /order AVANT /:id : sinon Express lirait « order » comme un id
router.put('/order', reorderEducationSections)
router.get('/:id', getEducationSectionByIdAdmin)
router.post('/', createEducationSection)
router.patch('/:id', updateEducationSection)
router.put('/:id/media', updateEducationSectionMedia)
router.patch('/:id/toggle', toggleEducationSectionActive)
router.delete('/:id', hardDeleteEducationSection)

export default router
