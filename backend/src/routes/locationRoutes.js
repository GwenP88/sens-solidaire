// locationRoutes.js
// Routes — lieux partenaires

import express from 'express'
import { getLocationBySlug, getLocations } from '../controllers/locationController.js'

const router = express.Router()

router.get('/', getLocations)
router.get('/:slug', getLocationBySlug)

export default router