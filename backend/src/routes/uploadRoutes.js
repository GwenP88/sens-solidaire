// src/routes/uploadRoutes.js
// Route publique — upload d'une image seule (formulaire témoignage)

import { Router } from 'express'
import { uploadPublic } from '../middlewares/uploadMiddleware.js'
import { handlePublicUpload } from '../controllers/uploadController.js'

const router = Router()

// 'file' = nom du champ attendu dans le FormData envoyé par le frontend
router.post('/', uploadPublic.single('file'), handlePublicUpload)

export default router