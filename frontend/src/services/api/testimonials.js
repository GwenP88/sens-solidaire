// services/api/testimonials.js
// Témoignages — lecture publique, soumission visiteur, modération admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── TÉMOIGNAGES ──────────────────────────────────────────────────────────
// Lecture publique des témoignages validés + soumission par un visiteur.

// Récupère tous les témoignages validés
export const fetchTestimonials = async () => {
  const response = await fetch(`${API_URL}/testimonials`)
  if (!response.ok) throw new Error("Impossible de charger les témoignages. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// Soumet un nouveau témoignage
export const submitTestimonial = async (data) => {
  const response = await fetch(`${API_URL}/testimonials`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("L'envoi du témoignage a échoué. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── TÉMOIGNAGES ──────────────────────────────────────────────────────────
// Modération dashboard : lecture de tous les statuts, approbation, refus.

// Récupère les témoignages pour la modération / la liste filtrée.
// filters : { status?, type?, country?, limit?, offset? } — tous optionnels
// Retourne { testimonials, total } (total sert à la pagination "Afficher plus").
export const fetchAdminTestimonials = async (filters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  const query = params.toString() ? `?${params.toString()}` : ''

  const response = await authFetch(`${API_URL}/admin/testimonials${query}`)

  if (!response.ok) {
    throw new Error("Impossible de charger les témoignages (admin).")
  }

  const data = await response.json()
  return { testimonials: data.testimonials, total: data.total }
}

// Crée un témoignage directement depuis le dashboard — publié immédiatement (statut "approved").
export const createAdminTestimonial = async (testimonialData) => {
  const response = await authFetch(`${API_URL}/admin/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testimonialData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création du témoignage.")
  }
  const data = await response.json()
  return data.testimonial
}

// Approuve un témoignage (statut → "approved", figé côté back).
export const approveTestimonial = async (id) => {
  const response = await authFetch(`${API_URL}/admin/testimonials/${id}/approve`, {
    method: "PATCH",
  })

  if (!response.ok) {
    throw new Error("Échec de l'approbation du témoignage.")
  }

  return await response.json()
}

// Refuse un témoignage (statut → "rejected" + retire de l'accueil, figé côté back).
export const rejectTestimonial = async (id) => {
  const response = await authFetch(`${API_URL}/admin/testimonials/${id}/reject`, {
    method: "PATCH",
  })

  if (!response.ok) {
    throw new Error("Échec du refus du témoignage.")
  }

  return await response.json()
}

// Modifie un témoignage existant (n'importe quel statut, notamment mission_id).
export const updateTestimonial = async (id, testimonialData) => {
  const response = await authFetch(`${API_URL}/admin/testimonials/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testimonialData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour du témoignage.")
  }
  const data = await response.json()
  return data.testimonial
}

// Supprime DÉFINITIVEMENT un témoignage (droit à l'oubli RGPD) — irréversible.
export const hardDeleteTestimonial = async (id) => {
  const response = await authFetch(`${API_URL}/admin/testimonials/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}
