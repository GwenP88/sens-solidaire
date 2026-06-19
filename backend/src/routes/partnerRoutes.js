// partnerRoutes.js
import { Router } from 'express'
import { getPartnersController } from '../controllers/partnerController.js'

const router = Router()
router.get('/', getPartnersController)

export default router