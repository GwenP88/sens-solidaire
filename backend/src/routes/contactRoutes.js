// contactRoutes.js
// Routes — contact

import { Router } from 'express'
import { sendContact } from '../controllers/contactController.js'

const router = Router()

// POST /api/contact
router.post('/', sendContact)

export default router