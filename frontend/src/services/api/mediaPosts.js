// services/api/mediaPosts.js
// Médias et actualités — lecture publique + CRUD admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── MÉDIAS ET ACTUALITÉS ─────────────────────────────────────────────────
// Articles publiés par l'association, listés puis détaillés.

// Récupère tous les articles publiés
export const fetchMediaPosts = async () => {
  const response = await fetch(`${API_URL}/media-posts`)
  if (!response.ok) throw new Error("Impossible de charger les médias et actualités. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// Récupère un article complet par son slug
export const fetchMediaPostBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/media-posts/${slug}`)
  if (!response.ok) throw new Error(`Article introuvable (slug : ${slug})`)
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── MÉDIAS & ACTUALITÉS (ADMIN) ─────────────────────────────────────────────

export const fetchMediaPostThemes = async () => {
  const response = await fetch(`${API_URL}/media-posts/themes`)
  if (!response.ok) throw new Error("Impossible de charger les thèmes.")
  return await response.json()
}

export const fetchAdminMediaPosts = async () => {
  const response = await authFetch(`${API_URL}/admin/media-posts`)
  if (!response.ok) throw new Error("Impossible de charger les publications.")
  const data = await response.json()
  return data.posts
}

export const fetchAdminMediaPostById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/media-posts/${id}`)
  if (!response.ok) throw new Error("Impossible de charger cette publication.")
  const data = await response.json()
  return data.post
}

export const createMediaPost = async (postData) => {
  const response = await authFetch(`${API_URL}/admin/media-posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Échec de l'enregistrement.")
  return data.post
}

export const updateMediaPost = async (id, postData) => {
  const response = await authFetch(`${API_URL}/admin/media-posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "Échec de l'enregistrement.")
  return data.post
}

export const toggleMediaPostActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/media-posts/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

export const hardDeleteMediaPost = async (id) => {
  const response = await authFetch(`${API_URL}/admin/media-posts/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}

// Photos du carrousel + vidéos YouTube (tâche 123).
// videos facultatif : non transmis → le serveur ne touche pas aux vidéos existantes.
export const updateMediaPostMedia = async (id, images, videos) => {
  const response = await authFetch(`${API_URL}/admin/media-posts/${id}/media`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images, videos }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "L'enregistrement des photos et vidéos n'a pas abouti. Réessayez.")
  return data
}
