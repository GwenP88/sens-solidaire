// services/api/fieldActions.js
// Actions sur le terrain (page Notre Impact) — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── ACTIONS SUR LE TERRAIN ───────────────────────────────────────────────
// Actions affichées sur la page Notre Impact, listées puis détaillées.

// Récupère les actions terrain, filtrables par pays
export const fetchFieldActions = async (country = null) => {
  const params = country ? `?country=${encodeURIComponent(country)}` : ''
  const response = await fetch(`${API_URL}/field-actions${params}`)
  if (!response.ok) throw new Error("Impossible de charger les actions terrain. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// Récupère une action terrain complète par son slug
export const fetchFieldActionBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/field-actions/${slug}`)
  if (!response.ok) throw new Error(`Action terrain introuvable (slug : ${slug})`)
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── FIELD ACTIONS ────────────────────────────────────────────────────────
// CRUD complet des actions terrain — tags déduits des ODD côté backend.

// Récupère toutes les actions (actives + inactives) pour le dashboard admin
export const fetchAdminFieldActions = async () => {
  const response = await authFetch(`${API_URL}/admin/field-actions`)
  if (!response.ok) throw new Error("Impossible de charger les actions terrain.")
  const data = await response.json()
  return data.actions
}

// Récupère une action par son id pour le formulaire d'édition
export const fetchAdminFieldActionById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/field-actions/${id}`)
  if (!response.ok) throw new Error("Impossible de charger cette action.")
  const data = await response.json()
  return data.action
}

// Crée une nouvelle action
export const createFieldAction = async (actionData) => {
  const response = await authFetch(`${API_URL}/admin/field-actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actionData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création de l'action.")
  }
  const data = await response.json()
  return data.action
}

// Met à jour partiellement une action existante
export const updateFieldAction = async (id, actionData) => {
  const response = await authFetch(`${API_URL}/admin/field-actions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actionData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour de l'action.")
  }
  const data = await response.json()
  return data.action
}

// Remplace la galerie photo d'une action
export const updateFieldActionMedia = async (id, images) => {
  const response = await authFetch(`${API_URL}/admin/field-actions/${id}/media`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour des photos.")
  }
  return await response.json()
}

// Active ou désactive une action (pause/reprise, sans la supprimer)
export const toggleFieldActionActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/field-actions/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

// Supprime DÉFINITIVEMENT une action (hard delete) — irréversible.
export const hardDeleteFieldAction = async (id) => {
  const response = await authFetch(`${API_URL}/admin/field-actions/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}
