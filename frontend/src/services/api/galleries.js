// services/api/galleries.js
// Galeries par type (Groupe jeunes, Congé de solidarité) — lecture publique + gestion admin.

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── GALERIES PAR TYPE (Groupe jeunes, Congé de solidarité — pas de mission) ─
// Pas de sélection de pays pour ces 2 types : une seule galerie par type,
// pas rattachée à une mission (voir galleryController.js côté backend).

// Récupère la galerie publique d'un type (Groupe jeunes ou Congé de solidarité)
export const fetchTypeGallery = async (type) => {
  const response = await fetch(`${API_URL}/gallery/${type}`)
  if (!response.ok) throw new Error("Impossible de charger la galerie.")
  const data = await response.json()
  return data.media
}

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── GALERIES PAR TYPE (Groupe jeunes, Congé de solidarité) ─────────────────
// Édition dashboard des galeries sans mission associée (voir bloc public équivalent).

// Récupère toutes les photos de la galerie d'un type (admin — pas juste le
// top 10 public, pour pouvoir tout éditer)
export const fetchAdminTypeGallery = async (type) => {
  const response = await authFetch(`${API_URL}/admin/gallery/${type}`)
  if (!response.ok) throw new Error("Impossible de charger la galerie.")
  const data = await response.json()
  return data.media
}

// Enregistre la galerie complète d'un type (remplace le contenu de
// syncGalleryImages côté serveur — préserve created_at des photos existantes)
export const updateTypeGalleryMedia = async (type, images) => {
  const response = await authFetch(`${API_URL}/admin/gallery/${type}/media`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de l'enregistrement.")
  }
  return await response.json()
}
