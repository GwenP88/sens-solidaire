// services/api/locations.js
// Lieux partenaires — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── LIEUX ─────────────────────────────────────────────────────────────────
// Lieux partenaires associés aux missions, affichés sur les pages mission et lieu.

// Récupère les lieux correspondant à une liste de pays
export const fetchLocationsByCountry = async (countries) => {
  const params = new URLSearchParams({ country: countries.join(',') })
  const response = await fetch(`${API_URL}/locations?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les lieux partenaires.")
  const data = await response.json()
  return data.locations
}

// Récupère un lieu complet par son slug
export const fetchLocationBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/locations/${slug}`)
  if (!response.ok) throw new Error(`Lieu introuvable (slug : ${slug})`)
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── LOCATIONS ────────────────────────────────────────────────────────────
// CRUD complet des lieux partenaires, plus leur galerie photo et statut actif/inactif.

// Récupère tous les lieux (actifs + inactifs) pour le dashboard admin
export const fetchAdminLocations = async () => {
  const response = await authFetch(`${API_URL}/admin/locations`)
  if (!response.ok) throw new Error("Impossible de charger les lieux.")
  const data = await response.json()
  return data.locations
}

// Récupère un lieu par son id pour le formulaire d'édition
export const fetchAdminLocationById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}`)
  if (!response.ok) throw new Error("Impossible de charger ce lieu.")
  const data = await response.json()
  return data.location
}

// Crée un nouveau lieu
export const createLocation = async (locationData) => {
  const response = await authFetch(`${API_URL}/admin/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création du lieu.")
  }
  const data = await response.json()
  return data.location
}

// Met à jour partiellement un lieu existant
export const updateLocation = async (id, locationData) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour du lieu.")
  }
  const data = await response.json()
  return data.location
}

// Remplace la galerie photo d'un lieu
export const updateLocationMedia = async (id, images) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}/media`, {
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

// Active ou désactive un lieu (pause/reprise, sans le supprimer)
export const toggleLocationActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

// Supprime DÉFINITIVEMENT un lieu (hard delete) — irréversible.
export const hardDeleteLocation = async (id) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}
