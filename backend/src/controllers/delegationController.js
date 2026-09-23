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

import { findById, create, update } from '../services/delegationService.js'

// GET /api/admin/delegations/:id
export const getDelegationByIdAdmin = async (req, res, next) => {
  try {
    const delegation = await findById(Number(req.params.id))
    if (!delegation) return res.status(404).json({ error: true, message: "Délégation introuvable." })
    return res.status(200).json({ delegation })
  } catch (error) {
    next(error)
  }
}

// POST /api/admin/delegations
export const createDelegation = async (req, res, next) => {
  try {
    if (!req.body.pays || !req.body.lieu) {
      return res.status(400).json({ error: true, message: "Pays et titre sont obligatoires." })
    }
    const delegation = await create(req.body)
    return res.status(201).json({ delegation })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/admin/delegations/:id
export const updateDelegation = async (req, res, next) => {
  try {
    const delegation = await update(Number(req.params.id), req.body)
    return res.status(200).json({ delegation })
  } catch (error) {
    next(error)
  }
}