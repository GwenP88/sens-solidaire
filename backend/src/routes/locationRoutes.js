// locationRoutes.js
// Routes — lieux partenaires

import express from 'express'
import { getLocationBySlug } from '../controllers/locationController.js'

const router = express.Router()

router.get('/:slug', getLocationBySlug)

export default router