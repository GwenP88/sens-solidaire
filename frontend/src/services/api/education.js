// services/api/education.js
// Éducation et sensibilisation — lecture publique (pas encore de CRUD admin).

import { API_URL } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── ÉDUCATION ET SENSIBILISATION ─────────────────────────────────────────
// Ateliers pédagogiques proposés aux écoles, listés puis détaillés.

// Récupère tous les ateliers éducatifs
export const fetchEducationItems = async () => {
  const response = await fetch(`${API_URL}/education-items`)
  if (!response.ok) throw new Error("Impossible de charger les ateliers éducatifs. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// Récupère un atelier complet par son slug
export const fetchEducationItemBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/education-items/${slug}`)
  if (!response.ok) throw new Error(`Atelier introuvable (slug : ${slug})`)
  return await response.json()
}
