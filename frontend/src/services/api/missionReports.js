// services/api/missionReports.js
// Rapports de mission — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── RAPPORTS DE MISSION ───────────────────────────────────────────────────
// Comptes-rendus rédigés par les volontaires à leur retour de mission.

// Récupère les rapports de mission, filtrables (ex: par pays)
export const fetchMissionReports = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await fetch(`${API_URL}/mission-reports?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les rapports de mission. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── MISSION REPORTS ──────────────────────────────────────────────────────
// CRUD complet des rapports de mission, plus statut actif/inactif.

// Récupère tous les rapports (actifs + inactifs) pour le dashboard admin
export const fetchAdminMissionReports = async () => {
  const response = await authFetch(`${API_URL}/admin/mission-reports`)
  if (!response.ok) throw new Error("Impossible de charger les rapports de mission.")
  const data = await response.json()
  return data.reports
}

// Récupère un rapport par son id pour le formulaire d'édition
export const fetchAdminMissionReportById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/mission-reports/${id}`)
  if (!response.ok) throw new Error("Impossible de charger ce rapport.")
  const data = await response.json()
  return data.report
}

// Crée un nouveau rapport
export const createMissionReport = async (reportData) => {
  const response = await authFetch(`${API_URL}/admin/mission-reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création du rapport.")
  }
  const data = await response.json()
  return data.report
}

// Met à jour partiellement un rapport existant
export const updateMissionReport = async (id, reportData) => {
  const response = await authFetch(`${API_URL}/admin/mission-reports/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour du rapport.")
  }
  const data = await response.json()
  return data.report
}

// Active ou désactive un rapport (pause/reprise, sans le supprimer)
export const toggleMissionReportActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/mission-reports/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

// Supprime DÉFINITIVEMENT un rapport (hard delete) — irréversible.
export const hardDeleteMissionReport = async (id) => {
  const response = await authFetch(`${API_URL}/admin/mission-reports/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}
