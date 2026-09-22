import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {
  getAllLocationsAdmin, getLocationByIdAdmin, createLocation, updateLocation,
  updateLocationMedia, toggleLocationActive, hardDeleteLocation,
} from '../controllers/locationController.js'

const router = express.Router()
router.use(authMiddleware)

router.get('/', getAllLocationsAdmin)
router.get('/:id', getLocationByIdAdmin)
router.post('/', createLocation)
router.patch('/:id', updateLocation)
router.put('/:id/media', updateLocationMedia)
router.patch('/:id/toggle', toggleLocationActive)
router.delete('/:id', hardDeleteLocation)

export default router