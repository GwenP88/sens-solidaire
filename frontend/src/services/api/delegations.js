// services/api/delegations.js
// Délégations nationales — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── DÉLÉGATIONS ──────────────────────────────────────────────────────────
// Délégations nationales affichées sur la page Équipe.

// Récupère toutes les délégations
export const fetchDelegations = async () => {
  const response = await fetch(`${API_URL}/delegations`)
  if (!response.ok) throw new Error("Impossible de charger les délégations. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── DELEGATIONS ──────────────────────────────────────────────────────────
// Utilisées à la fois par l'onglet Équipe et par le panneau déplié du
// formulaire Lieu — mêmes fonctions, même ligne en base dans les deux cas.

// Récupère une délégation par son id pour le formulaire d'édition
export const fetchAdminDelegationById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/delegations/${id}`)
  if (!response.ok) throw new Error("Impossible de charger cette délégation.")
  const data = await response.json()
  return data.delegation
}

// Crée une nouvelle délégation
export const createDelegation = async (delegationData) => {
  const response = await authFetch(`${API_URL}/admin/delegations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(delegationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création de la délégation.")
  }
  const data = await response.json()
  return data.delegation
}

// Met à jour partiellement une délégation existante
export const updateDelegation = async (id, delegationData) => {
  const response = await authFetch(`${API_URL}/admin/delegations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(delegationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour de la délégation.")
  }
  const data = await response.json()
  return data.delegation
}
