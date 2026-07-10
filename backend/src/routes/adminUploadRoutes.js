// src/routes/adminUploadRoutes.js
// Route protégée — upload dashboard (images, vidéos, PDF)

import { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { uploadAdmin } from '../middlewares/uploadMiddleware.js'
import { handleAdminUpload } from '../controllers/uploadController.js'

const router = Router()

router.use(authMiddleware)
router.post('/', uploadAdmin.single('file'), handleAdminUpload)

export default router