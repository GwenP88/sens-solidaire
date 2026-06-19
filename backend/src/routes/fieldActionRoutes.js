// fieldActionRoutes.js
// Routes publiques — actions terrain

import { Router } from 'express'
import { getFieldActions, getFieldActionBySlug } from '../controllers/fieldActionController.js'

const router = Router()

router.get('/', getFieldActions)
router.get('/:slug', getFieldActionBySlug)

export default router