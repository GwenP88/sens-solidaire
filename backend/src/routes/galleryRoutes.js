import express from 'express'
import { getTypeGallery } from '../controllers/galleryController.js'

const router = express.Router()
router.get('/:type', getTypeGallery)

export default router