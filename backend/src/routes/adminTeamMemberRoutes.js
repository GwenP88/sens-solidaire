import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllTeamMembersAdmin, getTeamMemberByIdAdmin,
  createTeamMember, updateTeamMember, toggleTeamMemberActive, hardDeleteTeamMember,
} from '../controllers/teamMemberController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllTeamMembersAdmin)
router.get('/:id', getTeamMemberByIdAdmin)
router.post('/', createTeamMember)
router.patch('/:id', updateTeamMember)
router.patch('/:id/toggle', toggleTeamMemberActive)
router.delete('/:id', hardDeleteTeamMember)

export default router