// src/controllers/uploadController.js
// Reçoit le fichier déjà validé par Multer, appelle storageService, renvoie l'URL

import { saveFile } from '../services/storageService.js'

// ── Détermine le sous-dossier selon le type MIME ──
const getFolderFromMimetype = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images'
  if (mimetype.startsWith('video/')) return 'videos'
  if (mimetype === 'application/pdf') return 'documents'
  return 'others'
}

// ── UPLOAD PUBLIC ─────────────────────────────────────────────
// POST /api/upload — utilisé par le formulaire témoignage
export const handlePublicUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "Aucun fichier reçu" })
    }

    const folder = getFolderFromMimetype(req.file.mimetype)
    const url = await saveFile(req.file, folder)

    return res.status(200).json({ url })

  } catch (error) {
    next(error)
  }
}

// ── UPLOAD ADMIN ──────────────────────────────────────────────
// POST /api/admin/upload — utilisé par le dashboard (images, vidéos, PDF)
export const handleAdminUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "Aucun fichier reçu" })
    }

    const folder = getFolderFromMimetype(req.file.mimetype)
    const url = await saveFile(req.file, folder)

    // label optionnel — texte alternatif fourni par la cliente pour l'accessibilité
    return res.status(200).json({ url, label: req.body.label || null })

  } catch (error) {
    next(error)
  }
}