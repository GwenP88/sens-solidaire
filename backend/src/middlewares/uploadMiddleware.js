// src/middlewares/uploadMiddleware.js
// Configuration de Multer — reçoit les fichiers EN MÉMOIRE (rien n'est écrit sur le disque ici)
// C'est storageService.js qui décide où ils sont réellement enregistrés.

import multer from 'multer'

// ── Stockage en mémoire ──
// Le fichier arrive dans req.file.buffer — aucune écriture sur le disque ici
const storage = multer.memoryStorage()

// ── Filtre : types de fichiers autorisés ──
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf'],
  // mp3 (format courant des interviews) + m4a (enregistrements de téléphone)
  audio: ['audio/mpeg', 'audio/mp4', 'audio/x-m4a'],
}

// Un fichier refusé à cause de son type est une erreur de l'utilisateur, pas une panne
// du serveur : on attache le statut 400 à l'erreur, sinon elle tomberait dans le 500
// par défaut du gestionnaire d'erreurs de app.js.
const rejectFile = (message) => {
  const error = new Error(message)
  error.status = 400
  return error
}

const fileFilter = (req, file, cb) => {
  const allAllowed = Object.values(ALLOWED_TYPES).flat()
  if (allAllowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(rejectFile(`Type de fichier non autorisé : ${file.mimetype}`), false)
  }
}

// ── Upload PUBLIC — formulaire témoignage ──
// Images uniquement, 5 Mo max (annoncé dans TestimonialForm.jsx)
export const uploadPublic = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.image.includes(file.mimetype)) cb(null, true)
    else cb(rejectFile('Seules les images sont autorisées'), false)
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
