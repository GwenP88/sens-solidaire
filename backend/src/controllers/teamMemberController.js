// teamMemberController.js
import { getTeamMembers } from '../services/teamMemberService.js'

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