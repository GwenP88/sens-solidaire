// services/api.js
// Centralise tous les appels API du frontend
// Toutes les fonctions retournent les données directement ou lèvent une erreur

// URL de base de l'API — variable d'env Vite en priorité, fallback localhost
const API_URL = "/api"

// ── AUTH HELPERS ─────────────────────────────────────────────────────────────

// Wrapper autour de fetch pour les appels admin authentifiés.
// Rôle :
//   1. Injecte automatiquement le Bearer token dans les headers.
//   2. Intercepte les 401 (token expiré, invalide, révoqué) :
//      → efface le token
//      → redirige vers /admin/login
//      → throw pour interrompre proprement la chaîne d'appels
//
// À NE PAS utiliser pour loginAdmin (produit l'auth, ne la consomme pas)
// ni pour les fetch publics (pas de token à envoyer).
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("admin_token")

  // Merge des headers : ceux fournis par l'appelant priment sur les nôtres,
  // sauf Authorization qu'on ajoute systématiquement.
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${token}`,
    },
  })

  // Interception centralisée du 401 : session invalide → on dégage.
  // Ordre critique : (1) supprimer le token, (2) rediriger, (3) throw.
  // Sans le throw, l'appelant tenterait de lire response.ok sur undefined
  // pendant les quelques ms avant que le navigateur ne charge /admin/login.
  if (response.status === 401) {
    localStorage.removeItem("admin_token")
    window.location.href = "/admin/login"
    throw new Error("SESSION_EXPIRED")
  }

  return response
}

// ── AUTH ADMIN ───────────────────────────────────────────────────────────────

// Connexion admin : envoie email + password, récupère l'access token.
// credentials: "include" → indispensable pour que le navigateur accepte
// le cookie HTTP-Only (refresh token) renvoyé par le back.
// ⚠️ Ne PAS passer par authFetch : le login PRODUIT l'auth, il ne la consomme pas.
// Sans ça, un mauvais mot de passe → 401 → redirection en boucle sur /admin/login.
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

// ── UPLOAD DE FICHIERS ───────────────────────────────────────────────────────

// Upload public d'une image (utilisé par le formulaire témoignage visiteur)
// Contrairement aux autres appels, le body est un FormData — pas de JSON.stringify,
// pas de header Content-Type (le navigateur le génère lui-même avec le bon boundary).
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "L'envoi de la photo a échoué. Vérifiez votre connexion ou réessayez.")
  }

  const data = await response.json()
  return data.url
}

// ── UPLOAD DE FICHIERS (ADMIN) ────────────────────────────────────────────────

// Upload admin — images, vidéos, PDF (dashboard, route protégée)
// label optionnel — texte alternatif/légende fourni par la cliente
export const uploadAdminFile = async (file, label = '') => {
  const formData = new FormData()
  formData.append('file', file)
  if (label) formData.append('label', label)

  const response = await authFetch(`${API_URL}/admin/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "L'envoi du fichier a échoué.")
  }

  return await response.json() // { url, label }
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
    headers: { "Content-Type": "application/json" },
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

// Récupère les témoignages pour la modération.
// status optionnel : "pending" | "approved" | "rejected" | undefined (= tous)
export const fetchAdminTestimonials = async (status) => {
  const params = new URLSearchParams()
  if (status) {
    params.append("status", status)   // ajoute la paire clé/valeur "status=pending"
  }

  const query = params.toString() ? `?${params.toString()}` : ''

  const response = await authFetch(`${API_URL}/admin/testimonials${query}`)

  if (!response.ok) {
    throw new Error("Impossible de charger les témoignages (admin).")
  }

  const data = await response.json()
  return data.testimonials
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

// ── ADMIN — MISSIONS ─────────────────────────────────────────────────────────

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
