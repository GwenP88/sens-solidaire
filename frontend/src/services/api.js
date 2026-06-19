// services/api.js
// Centralise tous les appels API du frontend
// Toutes les fonctions retournent les données directement ou lèvent une erreur

// URL de base de l'API — pointe vers le backend Express
const API_URL = "http://localhost:3000/api"

// ── MISSIONS ─────────────────────────────────────────────────────────────────

// Récupère toutes les missions actives
// Paramètres optionnels : filters = { type, country }
export const fetchMissions = async (filters = {}) => {
  // Construit les query params dynamiquement depuis l'objet filters
  const params = new URLSearchParams(filters)
  const response = await fetch(`${API_URL}/missions?${params}`)
  if (!response.ok) throw new Error("Erreur lors de la récupération des missions")
  const data = await response.json()
  return data.missions
}

// Récupère une mission complète par son slug
// Paramètre : slug (string) — ex: "volontariat-kenya-faune-sauvage"
export const fetchMissionBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/missions/${slug}`)
  if (!response.ok) throw new Error("Mission introuvable")
  const data = await response.json()
  return data.mission
}

// ── TÉMOIGNAGES ──────────────────────────────────────────────────────────────

// Récupère tous les témoignages validés
export const fetchTestimonials = async () => {
  const response = await fetch(`${API_URL}/testimonials`)
  if (!response.ok) throw new Error("Erreur lors de la récupération des témoignages")
  return await response.json()
}

// Soumet un nouveau témoignage
export const submitTestimonial = async (data) => {
  const response = await fetch(`${API_URL}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error("Erreur lors de l'envoi du témoignage")
  return await response.json()
}

// ── FIELD ACTIONS ─────────────────────────────────────────────

export const fetchFieldActions = async () => {
  const response = await fetch(`${API_URL}/field-actions`)
  if (!response.ok) throw new Error('Erreur lors de la récupération des actions')
  return await response.json()
}

export const fetchFieldActionBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/field-actions/${slug}`)
  if (!response.ok) throw new Error('Action introuvable')
  return await response.json()
}

// ── MEDIA POSTS ───────────────────────────────────────────────

export const fetchMediaPosts = async () => {
  const response = await fetch(`${API_URL}/media-posts`)
  if (!response.ok) throw new Error('Erreur lors de la récupération des médias')
  return await response.json()
}

export const fetchMediaPostBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/media-posts/${slug}`)
  if (!response.ok) throw new Error('Article introuvable')
  return await response.json()
}