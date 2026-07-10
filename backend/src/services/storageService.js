// src/services/storageService.js
// Service de stockage des fichiers uploadés
// SEULE cette fonction changera si on bascule vers un stockage externe
// (Cloudinary, S3...) — le reste de l'app ne doit jamais savoir où vivent les fichiers.

import fs from 'fs'
import path from 'path'

// Dossier racine des uploads, à la racine du backend
const UPLOADS_ROOT = path.resolve('public/uploads')

// ── SAUVEGARDE D'UN FICHIER ──────────────────────────────────
// Reçoit un fichier Multer (buffer en mémoire) + le sous-dossier cible
// Renvoie une URL relative à stocker en BDD (jamais d'URL absolue !)
export const saveFile = async (file, folder) => {
  // Génère un nom unique pour éviter les collisions
  const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`

  const targetDir = path.join(UPLOADS_ROOT, folder)
  const targetPath = path.join(targetDir, uniqueName)

  // Écrit le buffer reçu par Multer sur le disque
  await fs.promises.writeFile(targetPath, file.buffer)

  // URL relative — le frontend préfixera avec API_URL au moment de l'affichage
  return `/uploads/${folder}/${uniqueName}`
}

// ── SUPPRESSION D'UN FICHIER ─────────────────────────────────
// Utile plus tard pour nettoyer un ancien fichier lors d'un remplacement
export const deleteFile = async (relativeUrl) => {
  if (!relativeUrl) return
  const filePath = path.join(UPLOADS_ROOT, relativeUrl.replace('/uploads/', ''))
  try {
    await fs.promises.unlink(filePath)
  } catch (err) {
    // Fichier déjà absent — pas grave, on ignore
    console.warn(`Fichier introuvable pour suppression : ${relativeUrl}`)
  }
}