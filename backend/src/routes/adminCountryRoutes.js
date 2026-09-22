import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { getCountries } from '../controllers/countryController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getCountries)

export default router