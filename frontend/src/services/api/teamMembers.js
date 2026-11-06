// services/api/teamMembers.js
// Membres de l'équipe — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── MEMBRES DE L'ÉQUIPE ──────────────────────────────────────────────────
// Direction, bureau, conseil d'administration, affichés sur la page Équipe.

// Récupère les membres de l'équipe, filtrables par catégorie et limitables en nombre
export const fetchTeamMembers = async (category = null, limit = null) => {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (limit) params.append('limit', limit)
  const response = await fetch(`${API_URL}/team-members?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les membres de l'équipe. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── TEAM MEMBERS ─────────────────────────────────────────────────────────
// CRUD complet des membres de l'équipe, plus statut actif/inactif.

// Récupère tous les membres (actifs + inactifs) pour le dashboard admin
export const fetchAdminTeamMembers = async () => {
  const response = await authFetch(`${API_URL}/admin/team-members`)
  if (!response.ok) throw new Error("Impossible de charger les membres de l'équipe.")
  const data = await response.json()
  return data.members
}

// Récupère un membre par son id pour le formulaire d'édition
export const fetchAdminTeamMemberById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/team-members/${id}`)
  if (!response.ok) throw new Error("Impossible de charger ce membre.")
  const data = await response.json()
  return data.member
}

// Crée un nouveau membre
export const createTeamMember = async (memberData) => {
  const response = await authFetch(`${API_URL}/admin/team-members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création du membre.")
  }
  const data = await response.json()
  return data.member
}

// Met à jour partiellement un membre existant
export const updateTeamMember = async (id, memberData) => {
  const response = await authFetch(`${API_URL}/admin/team-members/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour du membre.")
  }
  const data = await response.json()
  return data.member
}

// Active ou désactive un membre (pause/reprise, sans le supprimer)
export const toggleTeamMemberActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/team-members/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

// Supprime DÉFINITIVEMENT un membre (hard delete) — irréversible.
export const hardDeleteTeamMember = async (id) => {
  const response = await authFetch(`${API_URL}/admin/team-members/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}
