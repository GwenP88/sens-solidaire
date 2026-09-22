import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { updateTypeGalleryMedia, getAdminTypeGallery } from '../controllers/galleryController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/:type', getAdminTypeGallery)
router.put('/:type/media', updateTypeGalleryMedia)


export default router