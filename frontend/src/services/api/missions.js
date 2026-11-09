// services/api/missions.js
// Missions (volontariat individuel, Service Civique) — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── MISSIONS ─────────────────────────────────────────────────────────────
// Volontariat individuel et Service Civique — lecture seule côté public.

// Récupère toutes les missions actives
// Paramètres optionnels : filters = { type, country }
export const fetchMissions = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await fetch(`${API_URL}/missions?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les missions. Vérifiez votre connexion ou réessayez.")
  const data = await response.json()
  return data.missions
}

// Récupère une mission complète par son slug
export const fetchMissionBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/missions/${slug}`)
  if (!response.ok) throw new Error(`Mission introuvable (slug : ${slug})`)
  const data = await response.json()
  return data.mission
}

// GET /api/missions/service-civique/gallery — galerie combinée de tous les
// pays Service Civique (photos forcées + plus récentes, plafonné à 10)
export const fetchServiceCiviqueGallery = async () => {
  const response = await fetch(`${API_URL}/missions/service-civique/gallery`)
  if (!response.ok) throw new Error("Impossible de charger la galerie Service Civique.")
  const data = await response.json()
  return data.media
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── MISSIONS ─────────────────────────────────────────────────────────────
// CRUD complet des missions, plus tarifs et médias associés.

// Récupère TOUTES les missions (actives + inactives) pour le dashboard admin.
export const fetchAdminMissions = async (signal) => {
  const response = await authFetch(`${API_URL}/admin/missions`, {
    signal,   // undefined si non fourni → fetch() l'ignore, aucun risque de casse ailleurs
  })
  if (!response.ok) {
    throw new Error("Impossible de charger les missions (admin).")
  }
  const data = await response.json()
  return data.missions
}

// Crée une nouvelle mission.
export const createMission = async (missionData) => {
  const response = await authFetch(`${API_URL}/admin/missions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(missionData),
  })
  if (!response.ok) {
    // On propage le message d'erreur précis du backend (400 champs manquants,
    // 409 slug dupliqué...) plutôt qu'un message générique.
    const data = await response.json()
    throw new Error(data.message || "Échec de la création de la mission.")
  }
  const data = await response.json()
  return data.mission
}

// Met à jour partiellement une mission existante.
export const updateMission = async (id, missionData) => {
  const response = await authFetch(`${API_URL}/admin/missions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(missionData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour de la mission.")
  }
  const data = await response.json()
  return data.mission
}

// Supprime (soft delete) une mission — is_active passe à false côté backend.
export const deleteMission = async (id) => {
  const response = await authFetch(`${API_URL}/admin/missions/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Échec de la suppression de la mission.")
  }
  return await response.json()
}

// Supprime DÉFINITIVEMENT une mission (hard delete) — irréversible.
export const hardDeleteMission = async (id) => {
  const response = await authFetch(`${API_URL}/admin/missions/${id}/permanent`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Échec de la suppression définitive de la mission.")
  }
  return await response.json()
}

// Récupère une mission par son id pour le formulaire d'édition
export const fetchAdminMissionById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/missions/${id}`)
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Mission introuvable.")
  }
  const data = await response.json()
  return data.mission
}

// Remplace tous les tarifs d'une mission
export const updateMissionPricing = async (id, lines) => {
  const response = await authFetch(`${API_URL}/admin/missions/${id}/pricing`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines }),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Échec de la mise à jour des tarifs.')
  }
  return await response.json()
}

// Remplace les médias (images galerie + PDF) d'une mission
export const updateMissionMedia = async (id, images, pdf) => {
  const response = await authFetch(`${API_URL}/admin/missions/${id}/media`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images, pdf }),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Échec de la mise à jour des médias.')
  }
  return await response.json()
}
