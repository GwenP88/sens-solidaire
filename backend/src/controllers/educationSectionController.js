// educationSectionController.js
// Contrôleur — sections de la page Éducation & sensibilisation (tâche 172) : validation des entrées et codes HTTP.

import {
  getAllEducationSections, findAllForAdmin, findById,
  create, update, updateMedia, reorder, toggleActive, hardDelete,
  SECTION_AUDIENCES,
} from '../services/educationSectionService.js'
import { isFilled, isValidButtonUrl } from '../utils/validation.js'
import { isValidRattachement } from '../utils/rattachement.js'

// Nombre maximum de boutons dans le bloc « Informations pratiques »
const MAX_BUTTONS = 3

// ── VALIDATION ─────────────────────────────────────────────────────────────
// partial = true pour une modification (PATCH) : seuls les champs envoyés sont vérifiés.
const validateSection = (body, { partial = false } = {}) => {
  const isChecked = (field) => !partial || field in body

  if (isChecked('title') && !isFilled(body.title))     return "Le titre de la section est obligatoire."
  if (isChecked('content') && !isFilled(body.content)) return "Le texte de présentation est obligatoire."
  if (!isValidRattachement(body.rattachement))         return "Le pays concerné est invalide. Cochez France, Suisse ou les deux."
  // Public facultatif, mais chaque code envoyé doit être connu
  if (isFilled(body.audience)) {
    const codes = (Array.isArray(body.audience) ? body.audience : String(body.audience).split(',')).map(c => String(c).trim())
    if (codes.some(c => !SECTION_AUDIENCES.includes(c))) return "Le public choisi est invalide. Rechargez la page et cochez de nouveau les cases."
  }
  return null
}

// Boutons : [{ label, url }] — au plus MAX_BUTTONS, libellé et lien valides
const validateButtons = (buttons) => {
  if (!Array.isArray(buttons))       return "La liste des boutons est invalide."
  if (buttons.length > MAX_BUTTONS)  return `Ajoutez au maximum ${MAX_BUTTONS} boutons.`
  for (const b of buttons) {
    if (!isFilled(b?.label))         return "Chaque bouton doit avoir un texte."
    if (!isValidButtonUrl(String(b?.url ?? '').trim())) {
      return "Le lien d'un bouton est invalide. Indiquez une page du site (ex. /contact) ou une adresse complète (https://…)."
    }
  }
  return null
}

// ── GET (PUBLIC) ────────────────────────────────────────────────────────────
// GET /api/education-sections
export const getEducationSections = async (req, res, next) => {
  try {
    const sections = await getAllEducationSections()
    return res.status(200).json(sections)
  } catch (error) {
    next(error)
  }
}

// ── GET ALL (ADMIN) ─────────────────────────────────────────────────────────
// GET /api/admin/education-sections
export const getAllEducationSectionsAdmin = async (req, res, next) => {
  try {
    const sections = await findAllForAdmin()
    return res.status(200).json({ sections })
  } catch (error) {
    next(error)
  }
}

// ── GET BY ID (ADMIN) ───────────────────────────────────────────────────────
// GET /api/admin/education-sections/:id
export const getEducationSectionByIdAdmin = async (req, res, next) => {
  try {
    const section = await findById(Number(req.params.id))
    if (!section) return res.status(404).json({ error: true, message: "Section introuvable." })
    return res.status(200).json({ section })
  } catch (error) {
    next(error)
  }
}

// ── CREATE (ADMIN) ──────────────────────────────────────────────────────────
// POST /api/admin/education-sections
export const createEducationSection = async (req, res, next) => {
  try {
    const validationError = validateSection(req.body)
    if (validationError) return res.status(400).json({ error: true, message: validationError })

    const section = await create(req.body)
    return res.status(201).json({ section })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE (ADMIN) ──────────────────────────────────────────────────────────
// PATCH /api/admin/education-sections/:id
export const updateEducationSection = async (req, res, next) => {
  try {
    const validationError = validateSection(req.body, { partial: true })
    if (validationError) return res.status(400).json({ error: true, message: validationError })

    const section = await update(Number(req.params.id), req.body)
    return res.status(200).json({ section })
  } catch (error) {
    next(error)
  }
}

// ── PHOTOS + BOUTONS (ADMIN) ────────────────────────────────────────────────
// PUT /api/admin/education-sections/:id/media
// Body : { images: [{ file_url, label }], buttons: [{ label, url }] }
export const updateEducationSectionMedia = async (req, res, next) => {
  try {
    const { images = [], buttons = [] } = req.body
    if (!Array.isArray(images) || images.some(img => !isFilled(img?.file_url))) {
      return res.status(400).json({ error: true, message: "La liste des photos est invalide." })
    }
    const buttonsError = validateButtons(buttons)
    if (buttonsError) return res.status(400).json({ error: true, message: buttonsError })

    const id = Number(req.params.id)
    if (!(await findById(id))) return res.status(404).json({ error: true, message: "Section introuvable." })

    await updateMedia(id, {
      images,
      buttons: buttons.map(b => ({ label: b.label.trim(), url: b.url.trim() })),
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}

// ── ORDRE DES SECTIONS (ADMIN) ──────────────────────────────────────────────
// PUT /api/admin/education-sections/order — Body : { ids: [3, 1, 2] }
export const reorderEducationSections = async (req, res, next) => {
  try {
    const { ids } = req.body
    const isIdList = Array.isArray(ids) && ids.length > 0 && ids.every(id => Number.isInteger(id) && id > 0)
    if (!isIdList || new Set(ids).size !== ids.length) {
      return res.status(400).json({ error: true, message: "L'ordre des sections est invalide. Rechargez la page et réessayez." })
    }
    await reorder(ids)
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error) // id inexistant → P2025 → 404 (gestionnaire global, utils/prismaErrors.js)
  }
}

// ── VISIBLE / MASQUÉE (ADMIN) ───────────────────────────────────────────────
// PATCH /api/admin/education-sections/:id/toggle — Body : { is_active: true | false }
export const toggleEducationSectionActive = async (req, res, next) => {
  try {
    if (typeof req.body.is_active !== 'boolean') {
      return res.status(400).json({ error: true, message: "Indiquez si la section doit être visible ou masquée." })
    }
    const section = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ section })
  } catch (error) {
    next(error)
  }
}

// ── SUPPRESSION (ADMIN) ─────────────────────────────────────────────────────
// DELETE /api/admin/education-sections/:id — les cards de la section sont conservées (détachées)
export const hardDeleteEducationSection = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}
