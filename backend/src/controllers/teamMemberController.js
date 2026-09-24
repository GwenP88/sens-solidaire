// teamMemberController.js
import {
  getTeamMembers,
  findAllForAdmin, findById, create, update, toggleActive, hardDelete,
} from '../services/teamMemberService.js'

export const getTeamMembersController = async (req, res) => {
  try {
    const { category, limit } = req.query
    const members = await getTeamMembers(category, limit ? Number(limit) : null)
    res.json(members)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// GET /api/admin/team-members
export const getAllTeamMembersAdmin = async (req, res, next) => {
  try {
    const members = await findAllForAdmin()
    return res.status(200).json({ members })
  } catch (error) {
    next(error)
  }
}

// GET /api/admin/team-members/:id
export const getTeamMemberByIdAdmin = async (req, res, next) => {
  try {
    const member = await findById(Number(req.params.id))
    if (!member) return res.status(404).json({ error: true, message: "Membre introuvable." })
    return res.status(200).json({ member })
  } catch (error) {
    next(error)
  }
}

// POST /api/admin/team-members
export const createTeamMember = async (req, res, next) => {
  try {
    if (!req.body.nom || !req.body.role || !req.body.category) {
      return res.status(400).json({ error: true, message: "Nom, rôle et catégorie sont obligatoires." })
    }
    const member = await create(req.body)
    return res.status(201).json({ member })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/admin/team-members/:id
export const updateTeamMember = async (req, res, next) => {
  try {
    const member = await update(Number(req.params.id), req.body)
    return res.status(200).json({ member })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/admin/team-members/:id/toggle
export const toggleTeamMemberActive = async (req, res, next) => {
  try {
    const member = await toggleActive(Number(req.params.id), req.body.is_active)
    return res.status(200).json({ member })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/admin/team-members/:id
export const hardDeleteTeamMember = async (req, res, next) => {
  try {
    await hardDelete(Number(req.params.id))
    return res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}