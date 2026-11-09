// services/api/activityReports.js
// Rapports d'activité annuels — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── RAPPORTS D'ACTIVITÉ ───────────────────────────────────────────────────
// Rapports annuels PDF affichés sur la page Rapports d'activité.

// Récupère tous les rapports d'activité
export const fetchActivityReports = async () => {
  const response = await fetch(`${API_URL}/activity-reports`)
  if (!response.ok) throw new Error("Impossible de charger les rapports d'activité. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── ACTIVITY REPORTS ──────────────────────────────────────────────────────
// CRUD complet des rapports d'activité annuels (PDF), plus statut actif/inactif.

// Récupère tous les rapports (actifs + inactifs) pour le dashboard admin
export const fetchAdminActivityReports = async () => {
  const response = await authFetch(`${API_URL}/admin/activity-reports`)
  if (!response.ok) throw new Error("Impossible de charger les rapports d'activité.")
  const data = await response.json()
  return data.reports
}

// Récupère un rapport par son id pour le formulaire d'édition
export const fetchAdminActivityReportById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/activity-reports/${id}`)
  if (!response.ok) throw new Error("Impossible de charger ce rapport.")
  const data = await response.json()
  return data.report
}

// Crée un nouveau rapport
export const createActivityReport = async (reportData) => {
  const response = await authFetch(`${API_URL}/admin/activity-reports`, {
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
export const updateActivityReport = async (id, reportData) => {
  const response = await authFetch(`${API_URL}/admin/activity-reports/${id}`, {
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
export const toggleActivityReportActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/activity-reports/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

// Supprime DÉFINITIVEMENT un rapport (hard delete) — irréversible.
export const hardDeleteActivityReport = async (id) => {
  const response = await authFetch(`${API_URL}/admin/activity-reports/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}
