// partnerController.js
import { getPartners } from '../services/partnerService.js'

export const getPartnersController = async (req, res) => {
  try {
    const partners = await getPartners()
    res.json(partners)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}