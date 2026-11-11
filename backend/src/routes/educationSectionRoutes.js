// educationSectionRoutes.js
// Routes publiques — sections de la page Éducation & sensibilisation (tâche 172)

import { Router } from 'express'
import { getEducationSections } from '../controllers/educationSectionController.js'

const router = Router()

router.get('/', getEducationSections)

export default router
