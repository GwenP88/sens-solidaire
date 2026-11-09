// services/api/partners.js
// Partenaires — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── PARTENAIRES ──────────────────────────────────────────────────────────
// Logos partenaires affichés sur la page À propos.

// Récupère tous les partenaires
export const fetchPartners = async () => {
  const response = await fetch(`${API_URL}/partners`)
  if (!response.ok) throw new Error("Impossible de charger les partenaires. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── PARTNERS ─────────────────────────────────────────────────────────────
// CRUD complet des logos partenaires, plus statut actif/inactif.

// Récupère tous les partenaires (actifs + inactifs) pour le dashboard admin
export const fetchAdminPartners = async () => {
  const response = await authFetch(`${API_URL}/admin/partners`)
  if (!response.ok) throw new Error("Impossible de charger les partenaires.")
  const data = await response.json()
  return data.partners
}

// Récupère un partenaire par son id pour le formulaire d'édition
export const fetchAdminPartnerById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/partners/${id}`)
  if (!response.ok) throw new Error("Impossible de charger ce partenaire.")
  const data = await response.json()
  return data.partner
}

// Crée un nouveau partenaire
export const createPartner = async (partnerData) => {
  const response = await authFetch(`${API_URL}/admin/partners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partnerData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création du partenaire.")
  }
  const data = await response.json()
  return data.partner
}

// Met à jour partiellement un partenaire existant
export const updatePartner = async (id, partnerData) => {
  const response = await authFetch(`${API_URL}/admin/partners/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partnerData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour du partenaire.")
  }
  const data = await response.json()
  return data.partner
}

// Active ou désactive un partenaire (pause/reprise, sans le supprimer)
export const togglePartnerActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/partners/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

// Supprime DÉFINITIVEMENT un partenaire (hard delete) — irréversible.
export const hardDeletePartner = async (id) => {
  const response = await authFetch(`${API_URL}/admin/partners/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}
