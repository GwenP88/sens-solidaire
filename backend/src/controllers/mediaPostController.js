// mediaPostController.js
// Contrôleur — médias & actualités

import {
  getAllMediaPosts, getMediaPostBySlug, getThemes,
  findAllForAdmin, findById, create, update, toggleActive, hardDelete,
} from '../services/mediaPostService.js'
import { isFilled } from '../utils/validation.js'

// ── VALIDATION ─────────────────────────────────────────────────────────────
// partial = true pour une modification (PATCH) : on ne vérifie que les champs
// envoyés, mais un champ envoyé vide ou invalide est refusé.
const validateMediaPost = (body, { partial = false } = {}) => {
  const isChecked = (field) => !partial || field in body

  if (isChecked('title') && !isFilled(body.title)) return "Le titre est obligatoire."
  if (isChecked('theme') && !isFilled(body.theme)) return "Choisissez ou saisissez un thème."
  if (isChecked('date')) {
    if (!isFilled(body.date))                 return "La date est obligatoire."
    if (isNaN(new Date(body.date).getTime())) return "Indiquez une date valide."
  }
  // Sans lien ni fichier, la carte mène à la page article : il faut un texte.
  // En PATCH, on ne contrôle que si les deux champs sont envoyés (le formulaire
  // envoie toujours le formulaire complet).
  if ((!partial || ('content' in body && 'external_url' in body))
      && !isFilled(body.external_url) && !isFilled(body.content)) {
    return "Ajoutez un texte, ou un lien / fichier à consulter."
  }
  return null
}

// ── GET (PUBLIC) ────────────────────────────────────────────────────────────
export const getMediaPosts = async (req, res) => {
  try {
    const posts = await getAllMediaPosts()
    res.json(posts)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getMediaPostBySlugController = async (req, res) => {
  try {
    const post = await getMediaPostBySlug(req.params.slug)
    if (!post) return res.status(404).json({ error: 'Article introuvable' })
    res.json(post)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// GET /api/media-posts/themes — suggestions du formulaire (et futurs filtres)
export const getMediaPostThemes = async (req, res, next) => {
  try {
    const themes = await getThemes()
    return res.status(200).json(themes)
  } catch (error) {
    next(error)
  }
}

// ── GET ALL (ADMIN) ─────────────────────────────────────────────────────────
// GET /api/admin/media-posts
export const getAllMediaPostsAdmin = async (req, res, next) => {
  try {
    const posts = await findAllForAdmin()
    return res.status(200).json({ posts })
  } catch (error) {
    next(error)
  }
}

// ── GET BY ID (ADMIN) ───────────────────────────────────────────────────────
// GET /api/admin/media-posts/:id
export const getMediaPostByIdAdmin = async (req, res, next) => {
  try {
    const post = await findById(Number(req.params.id))
    if (!post) return res.status(404).json({ error: true, message: "Publication introuvable." })
    return res.status(200).json({ post })
  } catch (error) {
    next(error)
  }
}

// ── CREATE (ADMIN) ──────────────────────────────────────────────────────────
// POST /api/admin/media-posts
export const createMediaPost = async (req, res, next) => {
  try {
    const validationError = validateMediaPost(req.body)
    if (validationError) {
      return res.status(400).json({ error: true, message: validationError })
    }
    const post = await create(req.body)
    return res.status(201).json({ post })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE (ADMIN) ──────────────────────────────────────────────────────────
// PATCH /api/admin/media-posts/:id
export const updateMediaPost = async (req, res, next) => {
  try {
    const validationError = validateMediaPost(req.body, { partial: true })
    if (validationError) {
      return res.status(400).json({ error: true, message: validationError })
    }
    const post = await update(Number(req.params.id), req.body)
    return res.status(200).json({ post })
  } catch (error) {
    next(error)
  }
}

// ── TOGGLE ACTIVE (ADMIN) — pause/reprise ───────────────────────────────────
// PATCH /api/admin/media-posts/:id/toggle
export const toggleMediaPostActive = async (req, res, next) => {
  try {
    const post = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ post })
  } catch (error) {
    next(error)
  }
}

// ── HARD DELETE (ADMIN) ─────────────────────────────────────────────────────
// DELETE /api/admin/media-posts/:id
export const hardDeleteMediaPost = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}