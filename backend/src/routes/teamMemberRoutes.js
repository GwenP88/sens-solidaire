// teamMemberRoutes.js
import { Router } from 'express'
import { getTeamMembersController } from '../controllers/teamMemberController.js'

const router = Router()
router.get('/', getTeamMembersController)

export default router