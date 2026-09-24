import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllPartnersAdmin, getPartnerByIdAdmin,
  createPartner, updatePartner, togglePartnerActive, hardDeletePartner,
} from '../controllers/partnerController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllPartnersAdmin)
router.get('/:id', getPartnerByIdAdmin)
router.post('/', createPartner)
router.patch('/:id', updatePartner)
router.patch('/:id/toggle', togglePartnerActive)
router.delete('/:id', hardDeletePartner)

export default router