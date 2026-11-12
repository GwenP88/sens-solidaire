// services/api/education.js
// Éducation et sensibilisation — lecture publique (sections, cards) + gestion depuis le dashboard (tâches 172 / 172A).

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── SECTIONS DE LA PAGE ──────────────────────────────────────────────────
// Sections visibles dans l'ordre choisi, avec leurs cards, photos (images) et boutons (buttons).
export const fetchEducationSections = async () => {
  const response = await fetch(`${API_URL}/education-sections`)
  if (!response.ok) throw new Error("Impossible de charger la page Éducation. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── CARDS (ateliers…) ────────────────────────────────────────────────────

// Récupère toutes les cards visibles
export const fetchEducationItems = async () => {
  const response = await fetch(`${API_URL}/education-items`)
  if (!response.ok) throw new Error("Impossible de charger les ateliers éducatifs. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// Récupère une card complète par son slug (page détail)
export const fetchEducationItemBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/education-items/${slug}`)
  if (!response.ok) throw new Error(`Atelier introuvable (slug : ${slug})`)
  return await response.json()
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── Utilitaire local : requête admin + message d'erreur du serveur ───────
// Le serveur renvoie un message écrit pour la cliente (ex. « Ajoutez au maximum 3 boutons. ») :
// on le transmet tel quel ; fallback seulement s'il n'y en a pas.
// key : clé de l'objet dans la réponse ({ section }, { item }…) — absente = réponse renvoyée entière.
const sendAdmin = async (path, { method = 'GET', body, fallback, key } = {}) => {
  const response = await authFetch(`${API_URL}/admin/${path}`, {
    method,
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || fallback)
  return key ? data[key] : data
}

// ── SECTIONS ─────────────────────────────────────────────────────────────

// Toutes les sections (visibles + masquées), dans l'ordre, avec leurs cards
export const fetchAdminEducationSections = () =>
  sendAdmin('education-sections', { key: 'sections', fallback: "Impossible de charger les sections." })

// Une section pour le formulaire d'édition (avec photos et boutons)
export const fetchAdminEducationSectionById = (id) =>
  sendAdmin(`education-sections/${id}`, { key: 'section', fallback: "Impossible de charger cette section." })

// Crée une section (placée en dernière position)
export const createEducationSection = (sectionData) =>
  sendAdmin('education-sections', { method: 'POST', body: sectionData, key: 'section', fallback: "Échec de la création de la section." })

// Modifie une section (seuls les champs envoyés sont modifiés)
export const updateEducationSection = (id, sectionData) =>
  sendAdmin(`education-sections/${id}`, { method: 'PATCH', body: sectionData, key: 'section', fallback: "Échec de l'enregistrement de la section." })

// Remplace les photos et les boutons d'une section
// images : [{ file_url, label }] — buttons : [{ label, url }] (3 au maximum)
export const updateEducationSectionMedia = (id, { images = [], buttons = [] }) =>
  sendAdmin(`education-sections/${id}/media`, { method: 'PUT', body: { images, buttons }, fallback: "Échec de l'enregistrement des photos et des boutons." })

// Enregistre l'ordre des sections — ids : liste complète dans le nouvel ordre
export const reorderEducationSections = (ids) =>
  sendAdmin('education-sections/order', { method: 'PUT', body: { ids }, fallback: "Échec du changement d'ordre." })

// Rend une section visible ou la masque (sans la supprimer)
export const toggleEducationSectionActive = (id, is_active) =>
  sendAdmin(`education-sections/${id}/toggle`, { method: 'PATCH', body: { is_active }, key: 'section', fallback: "Échec du changement de statut." })

// Supprime DÉFINITIVEMENT une section — ses cards sont conservées, détachées
export const hardDeleteEducationSection = (id) =>
  sendAdmin(`education-sections/${id}`, { method: 'DELETE', fallback: "Échec de la suppression." })

// ── CARDS ────────────────────────────────────────────────────────────────

// Toutes les cards (visibles + masquées), avec le titre de leur section
export const fetchAdminEducationItems = () =>
  sendAdmin('education-items', { key: 'items', fallback: "Impossible de charger les cards." })

// Une card pour le formulaire d'édition
export const fetchAdminEducationItemById = (id) =>
  sendAdmin(`education-items/${id}`, { key: 'item', fallback: "Impossible de charger cette card." })

// Crée une card — public : ['primaire', 'college_lycee', 'adultes'] (au moins un)
export const createEducationItem = (itemData) =>
  sendAdmin('education-items', { method: 'POST', body: itemData, key: 'item', fallback: "Échec de la création de la card." })

// Modifie une card (seuls les champs envoyés sont modifiés)
export const updateEducationItem = (id, itemData) =>
  sendAdmin(`education-items/${id}`, { method: 'PATCH', body: itemData, key: 'item', fallback: "Échec de l'enregistrement de la card." })

// Rend une card visible ou la masque (sans la supprimer)
export const toggleEducationItemActive = (id, is_active) =>
  sendAdmin(`education-items/${id}/toggle`, { method: 'PATCH', body: { is_active }, key: 'item', fallback: "Échec du changement de statut." })

// Supprime DÉFINITIVEMENT une card — irréversible
export const hardDeleteEducationItem = (id) =>
  sendAdmin(`education-items/${id}`, { method: 'DELETE', fallback: "Échec de la suppression." })
