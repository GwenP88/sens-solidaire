// adminMediaPostRoutes.js
// Routes admin — médias & actualités (toutes protégées par authMiddleware)

import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllMediaPostsAdmin, getMediaPostByIdAdmin,
  createMediaPost, updateMediaPost, updateMediaPostMedia, toggleMediaPostActive, hardDeleteMediaPost,
} from '../controllers/mediaPostController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllMediaPostsAdmin)
router.get('/:id', getMediaPostByIdAdmin)
router.post('/', createMediaPost)
router.patch('/:id', updateMediaPost)
router.patch('/:id/toggle', toggleMediaPostActive)
router.put('/:id/media', updateMediaPostMedia)
router.delete('/:id', hardDeleteMediaPost)

export default router