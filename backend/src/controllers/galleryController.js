// ── GALLERY CONTROLLER ───────────────────────────────────────────────────
// Galeries génériques par type (Groupe jeunes, Congé solidaire...), sans
// mission associée — entity_type = le type, entity_id = 0 fixe.
import { findTypeGallery, syncGalleryImages } from '../services/mediaService.js'
import prisma from '../config/db.js'

const ALLOWED_TYPES = ['groupe_jeunes', 'conge_solidaire']

// GET /api/gallery/:type — public
export const getTypeGallery = async (req, res, next) => {
  try {
    const { type } = req.params
    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ error: true, message: "Type de galerie invalide." })
    }
    const media = await findTypeGallery(type)
    return res.status(200).json({ media })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/gallery/:type — admin, toutes les photos (pas juste le top 10 public)
export const getAdminTypeGallery = async (req, res, next) => {
  try {
    const { type } = req.params
    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ error: true, message: "Type de galerie invalide." })
    }
    const media = await prisma.media.findMany({
      where: { entity_type: type, entity_id: 0, file_type: 'image' },
      orderBy: { created_at: 'desc' },
    })
    return res.status(200).json({ media })
  } catch (error) {
    next(error)
  }
}

// PUT /api/admin/gallery/:type/media — admin
export const updateTypeGalleryMedia = async (req, res, next) => {
  try {
    const { type } = req.params
    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ error: true, message: "Type de galerie invalide." })
    }
    const { images } = req.body
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: true, message: "images doit être un tableau" })
    }
    await syncGalleryImages(type, 0, images)
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}