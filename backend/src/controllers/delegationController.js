// delegationController.js
import { getDelegations } from '../services/delegationService.js'

export const getDelegationsController = async (req, res) => {
  try {
    const delegations = await getDelegations()
    res.json(delegations)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}