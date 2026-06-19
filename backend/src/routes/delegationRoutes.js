// delegationRoutes.js
import { Router } from 'express'
import { getDelegationsController } from '../controllers/delegationController.js'

const router = Router()
router.get('/', getDelegationsController)

export default router