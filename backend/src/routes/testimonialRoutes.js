// testimonialRoutes.js
// Routes — témoignages

import { Router } from 'express'
import { getTestimonials, createTestimonial } from '../controllers/testimonialController.js'

const router = Router()

// GET /api/testimonials — témoignages validés publics
router.get('/', getTestimonials)

// POST /api/testimonials — soumission publique
router.post('/', createTestimonial)

export default router