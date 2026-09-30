// src/services/storageService.js
// Gère le stockage sécurisé des fichiers reçus par Multer.
// Centralise l'écriture pour faciliter un futur stockage externe.

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'

// Dossier racine des fichiers uploadés.
const UPLOADS_ROOT = path.resolve('public/uploads')

// Sous-dossiers autorisés pour éviter l'écriture hors du répertoire prévu.
const ALLOWED_FOLDERS = ['images', 'videos', 'documents']

// Extension déterminée par le type MIME et non par le nom du fichier.
const EXTENSION_BY_MIMETYPE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'application/pdf': '.pdf',
}

// Tailles et qualités définies côté serveur selon l'usage.
const IMAGE_SIZES = {
  hero:    { width: 1920, quality: 80 },
  gallery: { width: 1600, quality: 80 },
  card:    { width: 800,  quality: 75 },
  avatar:  { width: 400,  quality: 75 },
}

// Nettoie le nom d'origine pour empêcher les chemins malveillants.
const slugifyOriginalName = (originalName) => {
  const base = path.basename(originalName || '', path.extname(originalName || ''))
  const withoutAccents = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const slug = withoutAccents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return slug || 'fichier'
}

// ── ENREGISTREMENT D'UN FICHIER ────────────────────────────────

// Enregistre le fichier et retourne son URL relative.
export const saveFile = async (file, folder, imageType) => {
  // Vérifie que le dossier cible est autorisé.
  if (!ALLOWED_FOLDERS.includes(folder)) {
    const error = new Error(`Invalid target folder: ${folder}`)
    error.status = 400
    throw error
  }

  // Génère un nom sécurisé et unique.
  const slug = slugifyOriginalName(file.originalname)
  const uniqueSuffix = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

  // Récupère le fichier et son extension selon le type MIME.
  let buffer = file.buffer
  let extension = EXTENSION_BY_MIMETYPE[file.mimetype]

  // Redimensionne les images et les convertit en WebP.
  if (folder === 'images') {
    const sizeConfig = IMAGE_SIZES[imageType]

    // Refuse un type d'image inconnu.
    if (!sizeConfig) {
      const error = new Error(`Type d'image invalide ou manquant : ${imageType}`)
      error.status = 400
      throw error
    }

    buffer = await sharp(file.buffer)
      // Évite d'agrandir une image plus petite que la taille cible.
      .resize({ width: sizeConfig.width, withoutEnlargement: true })
      .webp({ quality: sizeConfig.quality })
      .toBuffer()

    // Les images sont toujours enregistrées en WebP.
    extension = '.webp'
  }

  // Refuse les types de fichiers non supportés.
  if (!extension) {
    const error = new Error(`Unsupported file type: ${file.mimetype}`)
    error.status = 400
    throw error
  }

  // Construit le chemin puis écrit le fichier sur le disque.
  const uniqueName = `${uniqueSuffix}-${slug}${extension}`
  const targetDir = path.join(UPLOADS_ROOT, folder)
  const targetPath = path.join(targetDir, uniqueName)

  // Crée le dossier s'il n'existe pas.
  await fs.promises.mkdir(targetDir, { recursive: true })
  await fs.promises.writeFile(targetPath, buffer)

  // Retourne uniquement l'URL relative à enregistrer en BDD.
  return `/uploads/${folder}/${uniqueName}`
}

// ── SUPPRESSION D'UN FICHIER ───────────────────────────────────

// Supprime un ancien fichier lors de son remplacement.
export const deleteFile = async (relativeUrl) => {
  if (!relativeUrl) return

  const filePath = path.join(UPLOADS_ROOT, relativeUrl.replace('/uploads/', ''))

  // Bloque toute suppression en dehors du dossier uploads.
  if (!filePath.startsWith(UPLOADS_ROOT + path.sep)) {
    console.warn(`Deletion path escapes the uploads folder, ignored: ${relativeUrl}`)
    return
  }

  try {
    await fs.promises.unlink(filePath)
  } catch (err) {
    // Ignore un fichier déjà supprimé ou introuvable.
    console.warn(`File not found for deletion: ${relativeUrl}`)
  }
}