// src/services/storageService.js
// File storage service for uploaded files (Multer buffers written to disk).
// This is the ONLY function that changes if we move to external storage
// (Cloudinary, S3...) — the rest of the app must never know where files live.
//
// SECURITY: this file used to trust client input for both the destination
// filename and its extension. That allowed a path traversal write (arbitrary
// file overwrite via "../" segments in file.originalname) and a MIME/extension
// mismatch (stored XSS: an HTML file mislabeled as image/png, saved with a
// .html extension, then served as HTML by express.static). Every rule below
// closes one of those two holes — see the comment next to each rule.

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'

// Root uploads folder, at the backend root
const UPLOADS_ROOT = path.resolve('public/uploads')

// Whitelist of writable/deletable subfolders. Closes: a caller passing an
// arbitrary `folder` string could otherwise target any path via
// path.join(UPLOADS_ROOT, folder, ...).
const ALLOWED_FOLDERS = ['images', 'videos', 'documents']

// Extension is derived from the (Multer-validated) MIME type, never from the
// client-supplied filename. Closes: a file named "payload.html" declared as
// image/png would otherwise keep its real .html extension and get served as
// HTML by express.static('public/uploads') — stored XSS on our own origin.
const EXTENSION_BY_MIMETYPE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'application/pdf': '.pdf',
}

// Table des tailles cibles par contexte d'usage — jamais fournie par le
// client, toujours résolue côté serveur à partir du `imageType` reçu.
const IMAGE_SIZES = {
  hero:    { width: 1920, quality: 80 },
  gallery: { width: 1600, quality: 80 },
  card:    { width: 800,  quality: 75 },
  avatar:  { width: 400,  quality: 75 },
}

// Turns the client-supplied original name into a harmless display label,
// never a path. path.basename() strips any directory component first (so
// "../../../../x" becomes "x"), then the whitelist regex keeps only
// [a-z0-9-] — no dots, slashes, or null bytes survive to smuggle a
// traversal or a double extension through.
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

// ── SAVE A FILE ───────────────────────────────────────────────
// Prend un fichier Multer (buffer en mémoire) + le sous-dossier cible.
// imageType (hero/gallery/card/avatar) n'est utilisé QUE pour les images —
// il détermine la taille de redimensionnement (voir IMAGE_SIZES).
// Retourne une URL relative à stocker en BDD (jamais une URL absolue).
export const saveFile = async (file, folder, imageType) => {
  // 1. Dossier cible autorisé ? (whitelist — voir commentaire ALLOWED_FOLDERS)
  if (!ALLOWED_FOLDERS.includes(folder)) {
    const error = new Error(`Invalid target folder: ${folder}`)
    error.status = 400
    throw error
  }

  // 2. Nom de fichier sûr — slug du nom original + suffixe unique (anti-collision)
  const slug = slugifyOriginalName(file.originalname)
  const uniqueSuffix = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

  // Buffer et extension par défaut — écrasés ci-dessous si c'est une image
  let buffer = file.buffer
  let extension = EXTENSION_BY_MIMETYPE[file.mimetype]

  // 3. Images uniquement : redimensionnement + conversion WebP via Sharp
  //    imageType vient du client, mais la TAILLE vient d'IMAGE_SIZES (serveur)
  //    → même principe que pour l'extension : jamais confiance dans le client
  if (folder === 'images') {
    const sizeConfig = IMAGE_SIZES[imageType]

    // imageType absent ou inconnu → on refuse plutôt que de deviner une taille
    if (!sizeConfig) {
      const error = new Error(`Type d'image invalide ou manquant : ${imageType}`)
      error.status = 400
      throw error
    }

    buffer = await sharp(file.buffer)
      // withoutEnlargement : ne jamais agrandir une image plus petite que la cible
      .resize({ width: sizeConfig.width, withoutEnlargement: true })
      .webp({ quality: sizeConfig.quality })
      .toBuffer()

    // Peu importe le format d'origine (jpg/png/webp) : la sortie est toujours .webp
    extension = '.webp'
  }

  // 4. Vidéos/PDF : si le mimetype n'était pas dans la table → type non supporté
  if (!extension) {
    const error = new Error(`Unsupported file type: ${file.mimetype}`)
    error.status = 400
    throw error
  }

  // 5. Écriture sur disque
  const uniqueName = `${uniqueSuffix}-${slug}${extension}`
  const targetDir = path.join(UPLOADS_ROOT, folder)
  const targetPath = path.join(targetDir, uniqueName)

  // Le sous-dossier peut ne pas encore exister (checkout tout frais, volume neuf)
  await fs.promises.mkdir(targetDir, { recursive: true })
  await fs.promises.writeFile(targetPath, buffer)

  // URL relative — le front ajoute API_URL devant pour l'affichage
  return `/uploads/${folder}/${uniqueName}`
}

// ── DELETE A FILE ─────────────────────────────────────────────
// Used to clean up an old file when it gets replaced.
export const deleteFile = async (relativeUrl) => {
  if (!relativeUrl) return

  const filePath = path.join(UPLOADS_ROOT, relativeUrl.replace('/uploads/', ''))

  // Defense in depth: relativeUrl normally comes back from our own DB
  // (built by saveFile above), but never unlink a path that resolves
  // outside UPLOADS_ROOT — one bad value here must not become an
  // arbitrary-delete primitive.
  if (!filePath.startsWith(UPLOADS_ROOT + path.sep)) {
    console.warn(`Deletion path escapes the uploads folder, ignored: ${relativeUrl}`)
    return
  }

  try {
    await fs.promises.unlink(filePath)
  } catch (err) {
    // File already gone — not an error, just a heads-up.
    console.warn(`File not found for deletion: ${relativeUrl}`)
  }
}
