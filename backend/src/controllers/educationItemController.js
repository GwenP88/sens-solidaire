// educationItemController.js
import { getAllEducationItems, getEducationItemBySlug } from '../services/educationItemService.js'

export const getEducationItems = async (req, res) => {
  try {
    const items = await getAllEducationItems()
    res.json(items)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getEducationItemBySlugController = async (req, res) => {
  try {
    const item = await getEducationItemBySlug(req.params.slug)
    if (!item) return res.status(404).json({ error: 'Item introuvable' })
    res.json(item)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}