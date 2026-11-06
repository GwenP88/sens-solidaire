// services/api/uploads.js
// Envoi de fichiers — visiteur (formulaire témoignage) et dashboard (images, PDF, audio).

import { API_URL, authFetch } from './client.js'

// ═══ PUBLIC — sans authentification (site vitrine) ═══════════════════════

// ── UPLOAD DE FICHIERS (visiteur) ───────────────────────────────────────────
// Upload sans authentification, utilisé uniquement par le formulaire témoignage.

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

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── UPLOAD DE FICHIERS ───────────────────────────────────────────────────
// Upload authentifié via le dashboard — images et PDF.

// Upload un fichier via le dashboard (protégé par auth).
// type : 'hero' | 'gallery' | 'card' | 'avatar' — détermine la taille de
// redimensionnement côté serveur (voir IMAGE_SIZES dans storageService.js).
// Sans objet pour un PDF — le serveur ignore `type` hors dossier images.
export const uploadAdminFile = async (file, label = '', type = '') => {
  const formData = new FormData()
  formData.append('file', file)
  if (label) formData.append('label', label)
  if (type) formData.append('type', type)

  const response = await authFetch(`${API_URL}/admin/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "L'envoi du fichier a échoué.")
  }

  return await response.json() // { url, label }
}
