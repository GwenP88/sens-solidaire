// educationItemController.js
// Contrôleur — cards de la page Éducation (ateliers…) : lecture publique et gestion depuis le dashboard (tâche 172A).

import {
  getAllEducationItems, getEducationItemBySlug,
  findAllForAdmin, findById, sectionExists, create, update, toggleActive, hardDelete,
  EDUCATION_PUBLICS,
} from '../services/educationItemService.js'
import { isFilled } from '../utils/validation.js'

// Fiche PDF : fichier envoyé depuis l'ordinateur (/uploads/…) ou adresse complète (https://…)
const isValidFileUrl = (url) => /^\/uploads\/\S+$/.test(url) || /^https?:\/\/\S+$/i.test(url)

// Public : liste de codes (tableau ou texte séparé par des virgules), au moins un, tous connus
const toPublicList = (value) =>
  (Array.isArray(value) ? value : String(value ?? '').split(',')).map(p => String(p).trim()).filter(Boolean)

// ── VALIDATION ─────────────────────────────────────────────────────────────
// partial = true pour une modification (PATCH) : seuls les champs envoyés sont vérifiés.
const validateItem = (body, { partial = false } = {}) => {
  const isChecked = (field) => !partial || field in body

  if (isChecked('title') && !isFilled(body.title))             return "Le titre est obligatoire."
  if (isChecked('description') && !isFilled(body.description)) return "La description courte est obligatoire."
  if (isChecked('type') && !isFilled(body.type))               return "La catégorie est obligatoire (ex. Atelier)."
  if (isChecked('public')) {
    const list = toPublicList(body.public)
    if (list.length === 0 || list.some(p => !EDUCATION_PUBLICS.includes(p))) {
      return "Choisissez au moins un public."
    }
  }
  if (isFilled(body.external_url) && !isValidFileUrl(String(body.external_url).trim())) {
    return "La fiche est invalide. Envoyez un fichier PDF depuis votre ordinateur ou indiquez une adresse complète (https://…)."
  }
  if (isFilled(body.section_id) && !(Number.isInteger(Number(body.section_id)) && Number(body.section_id) > 0)) {
    return "La section choisie est invalide."
  }
  return null
}

// Section choisie inexistante (supprimée entre-temps) : 400 clair plutôt qu'une erreur de clé étrangère
const checkSection = async (body) => {
  if (!isFilled(body.section_id)) return null
  return (await sectionExists(Number(body.section_id)))
    ? null
    : "La section choisie n'existe plus. Rechargez la page et choisissez une autre section."
}

// ── GET (PUBLIC) ────────────────────────────────────────────────────────────
export const getEducationItems = async (req, res) => {
  try {
    const items = await getAllEducationItems()
    res.json(items)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getEducationItemBySlugController = async (req, res) => {
  try {
    const item = await getEducationItemBySlug(req.params.slug)
    if (!item) return res.status(404).json({ error: 'Item introuvable' })
    res.json(item)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ── GET ALL (ADMIN) ─────────────────────────────────────────────────────────
// GET /api/admin/education-items
export const getAllEducationItemsAdmin = async (req, res, next) => {
  try {
    const items = await findAllForAdmin()
    return res.status(200).json({ items })
  } catch (error) {
    next(error)
  }
}

// ── GET BY ID (ADMIN) ───────────────────────────────────────────────────────
// GET /api/admin/education-items/:id
export const getEducationItemByIdAdmin = async (req, res, next) => {
  try {
    const item = await findById(Number(req.params.id))
    if (!item) return res.status(404).json({ error: true, message: "Card introuvable." })
    return res.status(200).json({ item })
  } catch (error) {
    next(error)
  }
}

// ── CREATE (ADMIN) ──────────────────────────────────────────────────────────
// POST /api/admin/education-items
export const createEducationItem = async (req, res, next) => {
  try {
    const validationError = validateItem(req.body) || await checkSection(req.body)
    if (validationError) return res.status(400).json({ error: true, message: validationError })

    const item = await create({ ...req.body, public: toPublicList(req.body.public) })
    return res.status(201).json({ item })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE (ADMIN) ──────────────────────────────────────────────────────────
// PATCH /api/admin/education-items/:id
export const updateEducationItem = async (req, res, next) => {
  try {
    const validationError = validateItem(req.body, { partial: true }) || await checkSection(req.body)
    if (validationError) return res.status(400).json({ error: true, message: validationError })

    const data = 'public' in req.body ? { ...req.body, public: toPublicList(req.body.public) } : req.body
    const item = await update(Number(req.params.id), data)
    return res.status(200).json({ item })
  } catch (error) {
    next(error)
  }
}

// ── VISIBLE / MASQUÉE (ADMIN) ───────────────────────────────────────────────
// PATCH /api/admin/education-items/:id/toggle — Body : { is_active: true | false }
export const toggleEducationItemActive = async (req, res, next) => {
  try {
    if (typeof req.body.is_active !== 'boolean') {
      return res.status(400).json({ error: true, message: "Indiquez si la card doit être visible ou masquée." })
    }
    const item = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ item })
  } catch (error) {
    next(error)
  }
}

// ── SUPPRESSION (ADMIN) ─────────────────────────────────────────────────────
// DELETE /api/admin/education-items/:id
export const hardDeleteEducationItem = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}
