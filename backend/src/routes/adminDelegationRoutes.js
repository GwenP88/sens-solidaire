import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getDelegationByIdAdmin, createDelegation, updateDelegation,
} from '../controllers/delegationController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/:id', getDelegationByIdAdmin)
router.post('/', createDelegation)
router.patch('/:id', updateDelegation)

export default router