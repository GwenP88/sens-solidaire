// fieldActionController.js
// Contrôleur — actions terrain

import { getAllFieldActions, getFieldActionBySlugService } from '../services/fieldActionService.js'

export const getFieldActions = async (req, res) => {
  try {
    const { country } = req.query
    const actions = await getAllFieldActions(country || null)
    res.json(actions)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getFieldActionBySlug = async (req, res) => {
  try {
    const action = await getFieldActionBySlugService(req.params.slug)
    if (!action) return res.status(404).json({ error: 'Action introuvable' })
    res.json(action)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}