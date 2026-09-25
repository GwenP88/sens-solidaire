import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllFieldActionsAdmin, getFieldActionByIdAdmin,
  createFieldAction, updateFieldAction, updateFieldActionGallery,
  toggleFieldActionActive, hardDeleteFieldAction,
} from '../controllers/fieldActionController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllFieldActionsAdmin)
router.get('/:id', getFieldActionByIdAdmin)
router.post('/', createFieldAction)
router.patch('/:id', updateFieldAction)
router.put('/:id/media', updateFieldActionGallery)
router.patch('/:id/toggle', toggleFieldActionActive)
router.delete('/:id', hardDeleteFieldAction)

export default router