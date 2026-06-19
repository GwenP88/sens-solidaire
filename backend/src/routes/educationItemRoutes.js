// educationItemRoutes.js
import { Router } from 'express'
import { getEducationItems, getEducationItemBySlugController } from '../controllers/educationItemController.js'

const router = Router()

router.get('/', getEducationItems)
router.get('/:slug', getEducationItemBySlugController)

export default router