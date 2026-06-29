// services/api.js
// Centralise tous les appels API du frontend
// Toutes les fonctions retournent les données directement ou lèvent une erreur

// URL de base de l'API — variable d'env Vite en priorité, fallback localhost
const API_URL = "/api"

// ── AUTH ADMIN ───────────────────────────────────────────────────────────────

// Connexion admin : envoie email + password, récupère l'access token.
// credentials: "include" → indispensable pour que le navigateur accepte
// le cookie HTTP-Only (refresh token) renvoyé par le back.
export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",                       // 👈 pour le cookie refresh
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    // Le back renvoie { error, message } en cas de 400/401
    const data = await response.json()
    throw new Error(data.message || "Email ou mot de passe incorrect.")
  }

  const data = await response.json()
  return data.accessToken
}


// ── MISSIONS ─────────────────────────────────────────────────────────────────

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

// ── TÉMOIGNAGES ──────────────────────────────────────────────────────────────

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("L'envoi du témoignage a échoué. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── ACTIONS SUR LE TERRAIN ───────────────────────────────────────────────────

export const fetchFieldActions = async (country = null) => {
  const params = country ? `?country=${encodeURIComponent(country)}` : ''
  const response = await fetch(`${API_URL}/field-actions${params}`)
  if (!response.ok) throw new Error("Impossible de charger les actions terrain. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

export const fetchFieldActionBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/field-actions/${slug}`)
  if (!response.ok) throw new Error(`Action terrain introuvable (slug : ${slug})`)
  return await response.json()
}

// ── MÉDIAS ET ACTUALITÉS ─────────────────────────────────────────────────────

export const fetchMediaPosts = async () => {
  const response = await fetch(`${API_URL}/media-posts`)
  if (!response.ok) throw new Error("Impossible de charger les médias et actualités. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

export const fetchMediaPostBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/media-posts/${slug}`)
  if (!response.ok) throw new Error(`Article introuvable (slug : ${slug})`)
  return await response.json()
}

// ── ÉDUCATION ET SENSIBILISATION ─────────────────────────────────────────────

export const fetchEducationItems = async () => {
  const response = await fetch(`${API_URL}/education-items`)
  if (!response.ok) throw new Error("Impossible de charger les ateliers éducatifs. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

export const fetchEducationItemBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/education-items/${slug}`)
  if (!response.ok) throw new Error(`Atelier introuvable (slug : ${slug})`)
  return await response.json()
}

// ── MEMBRES DE L'ÉQUIPE ──────────────────────────────────────────────────────

export const fetchTeamMembers = async (category = null, limit = null) => {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (limit) params.append('limit', limit)
  const response = await fetch(`${API_URL}/team-members?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les membres de l'équipe. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── RAPPORTS D'ACTIVITÉ ──────────────────────────────────────────────────────

export const fetchActivityReports = async () => {
  const response = await fetch(`${API_URL}/activity-reports`)
  if (!response.ok) throw new Error("Impossible de charger les rapports d'activité. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── DÉLÉGATIONS ──────────────────────────────────────────────────────────────

export const fetchDelegations = async () => {
  const response = await fetch(`${API_URL}/delegations`)
  if (!response.ok) throw new Error("Impossible de charger les délégations. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── RAPPORTS DE MISSION ──────────────────────────────────────────────────────

export const fetchMissionReports = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await fetch(`${API_URL}/mission-reports?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les rapports de mission. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── PARTENAIRES ──────────────────────────────────────────────────────────────

export const fetchPartners = async () => {
  const response = await fetch(`${API_URL}/partners`)
  if (!response.ok) throw new Error("Impossible de charger les partenaires. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── LIEUX LIÉS AUX MISSIONS ──────────────────────────────────────────────────

export const fetchLocationBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/locations/${slug}`)
  if (!response.ok) throw new Error(`Lieu introuvable (slug : ${slug})`)
  return await response.json()
}

// ── ADMIN — TÉMOIGNAGES ──────────────────────────────────────────────────────

// Récupère TOUS les témoignages pour la modération (tous statuts).
// Route protégée → on doit envoyer le token dans le header Authorization.
export const fetchAdminTestimonials = async () => {
  // 1. On récupère le token stocké au login
  const token = localStorage.getItem("admin_token")

  const response = await fetch(`${API_URL}/admin/testimonials`, {
    headers: {
      // 2. Le header qui authentifie la requête.
      //    Format exact attendu par ton back : "Bearer <token>"
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Impossible de charger les témoignages (admin).")
  }

  const data = await response.json()
  return data.testimonials
}

// Approuve un témoignage (statut → "approved", figé côté back).
export const approveTestimonial = async (id) => {
  const token = localStorage.getItem("admin_token")

  const response = await fetch(`${API_URL}/admin/testimonials/${id}/approve`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Échec de l'approbation du témoignage.")
  }

  return await response.json()
}

// Refuse un témoignage (statut → "rejected" + retire de l'accueil, figé côté back).
export const rejectTestimonial = async (id) => {
  const token = localStorage.getItem("admin_token")

  const response = await fetch(`${API_URL}/admin/testimonials/${id}/reject`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Échec du refus du témoignage.")
  }

  return await response.json()
}
