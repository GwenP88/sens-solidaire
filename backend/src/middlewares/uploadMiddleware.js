// src/middlewares/uploadMiddleware.js
// Multer configuration — receives files IN MEMORY (not written to disk directly)
// storageService.js is the one that decides where they actually get written.

import multer from 'multer'

// ── In-memory storage ──
// The file arrives as req.file.buffer — no disk write happens here
const storage = multer.memoryStorage()

// ── Filter: allowed file types ──
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf'],
}

// Rejecting a file for its type is a client mistake, not a server failure —
// tag the error with status 400 so it doesn't fall through to the generic
// 500 in app.js's error handler.
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
