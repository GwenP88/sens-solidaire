// src/middlewares/uploadMiddleware.js
// Configuration Multer — reçoit les fichiers EN MÉMOIRE (pas sur disque directement)
// C'est storageService.js qui décide ensuite où les écrire réellement.

import multer from 'multer'

// ── Stockage mémoire ──
// Le fichier arrive en req.file.buffer — aucune écriture disque ici
const storage = multer.memoryStorage()

// ── Filtre : types de fichiers acceptés ──
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf'],
}

const fileFilter = (req, file, cb) => {
  const allAllowed = Object.values(ALLOWED_TYPES).flat()
  if (allAllowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Type de fichier non autorisé : ${file.mimetype}`), false)
  }
}

// ── Upload PUBLIC — formulaire témoignage ──
// Images uniquement, 5 Mo max (annoncé dans TestimonialForm.jsx)
export const uploadPublic = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.image.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Seules les images sont autorisées'), false)
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
})

// ── Upload ADMIN — dashboard ──
// Images, vidéos, PDF — 20 Mo max
export const uploadAdmin = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 Mo
})