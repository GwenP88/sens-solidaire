// mediaPostRoutes.js
// Routes — médias & actualités

import { Router } from 'express'
import { getMediaPosts, getMediaPostBySlugController } from '../controllers/mediaPostController.js'

const router = Router()

router.get('/', getMediaPosts)
router.get('/:slug', getMediaPostBySlugController)

export default router