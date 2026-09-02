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
// Takes a Multer file (in-memory buffer) + the target subfolder.
// Returns a relative URL to store in the DB (never an absolute URL!)
export const saveFile = async (file, folder) => {
  if (!ALLOWED_FOLDERS.includes(folder)) {
    const error = new Error(`Invalid target folder: ${folder}`)
    error.status = 400
    throw error
  }

  const extension = EXTENSION_BY_MIMETYPE[file.mimetype]
  if (!extension) {
    const error = new Error(`Unsupported file type: ${file.mimetype}`)
    error.status = 400
    throw error
  }

  const slug = slugifyOriginalName(file.originalname)
  // Timestamp + short random suffix avoids collisions even for two files
  // uploaded in the same millisecond with the same slug.
  const uniqueName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${slug}${extension}`

  const targetDir = path.join(UPLOADS_ROOT, folder)
  const targetPath = path.join(targetDir, uniqueName)

  // The subfolder may not exist yet (fresh checkout, fresh volume).
  await fs.promises.mkdir(targetDir, { recursive: true })

  await fs.promises.writeFile(targetPath, file.buffer)

  // Relative URL — the frontend prefixes it with API_URL when displaying it
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
