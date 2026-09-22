// services/api.js
// Centralise tous les appels API du frontend
// Toutes les fonctions retournent les données directement ou lèvent une erreur

// URL de base de l'API — variable d'env Vite en priorité, fallback localhost
const API_URL = "/api"

// ── AUTH & INFRASTRUCTURE ─────────────────────────────────────────────────
// Fonctions bas niveau réutilisées par tous les appels protégés du dashboard.

// authFetch — ajoute le token à chaque requête protégée du dashboard.
// Au 1er 401 (access token expiré, 15 min), tente un refresh SILENCIEUX via
// le cookie HTTP-Only avant de déconnecter.
// Chaque appel réseau est protégé individuellement : si fetch() échoue avant
// même d'obtenir une réponse (serveur injoignable, pas de connexion...), on
// remplace le message brut du navigateur par un message compréhensible.
const NETWORK_ERROR_MESSAGE = "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez."

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("admin_token")

  const doFetch = (accessToken) => fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${accessToken}`,
    },
  })

  let response
  try {
    response = await doFetch(token)
  } catch (err) {
    if (err.name === 'AbortError') throw err   // navigation/démontage — pas une vraie panne réseau
    throw new Error(NETWORK_ERROR_MESSAGE)
  }

  if (response.status === 401) {
    let refreshed
    try {
      refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      if (err.name === 'AbortError') throw err
      throw new Error(NETWORK_ERROR_MESSAGE)
    }

    if (refreshed.ok) {
      const { accessToken } = await refreshed.json()
      localStorage.setItem("admin_token", accessToken)
      try {
        response = await doFetch(accessToken)
      } catch (err) {
        if (err.name === 'AbortError') throw err
        throw new Error(NETWORK_ERROR_MESSAGE)
      }
    }
  }

  if (response.status === 401) {
    localStorage.removeItem("admin_token")
    window.location.href = "/admin/login"
    throw new Error("SESSION_EXPIRED")
  }

  return response
}

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


// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC
// Endpoints accessibles sans authentification — consommés par le site vitrine.
// ═══════════════════════════════════════════════════════════════════════════

// ── MISSIONS ─────────────────────────────────────────────────────────────
// Volontariat individuel et Service Civique — lecture seule côté public.

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

// GET /api/missions/service-civique/gallery — galerie combinée de tous les
// pays Service Civique (photos forcées + plus récentes, plafonné à 10)
export const fetchServiceCiviqueGallery = async () => {
  const response = await fetch(`${API_URL}/missions/service-civique/gallery`)
  if (!response.ok) throw new Error("Impossible de charger la galerie Service Civique.")
  const data = await response.json()
  return data.media
}

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

// ── ACTIONS SUR LE TERRAIN ───────────────────────────────────────────────
// Actions affichées sur la page Notre Impact, listées puis détaillées.

// Récupère les actions terrain, filtrables par pays
export const fetchFieldActions = async (country = null) => {
  const params = country ? `?country=${encodeURIComponent(country)}` : ''
  const response = await fetch(`${API_URL}/field-actions${params}`)
  if (!response.ok) throw new Error("Impossible de charger les actions terrain. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// Récupère une action terrain complète par son slug
export const fetchFieldActionBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/field-actions/${slug}`)
  if (!response.ok) throw new Error(`Action terrain introuvable (slug : ${slug})`)
  return await response.json()
}

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

// ── MEMBRES DE L'ÉQUIPE ──────────────────────────────────────────────────
// Direction, bureau, conseil d'administration, affichés sur la page Équipe.

// Récupère les membres de l'équipe, filtrables par catégorie et limitables en nombre
export const fetchTeamMembers = async (category = null, limit = null) => {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (limit) params.append('limit', limit)
  const response = await fetch(`${API_URL}/team-members?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les membres de l'équipe. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── RAPPORTS D'ACTIVITÉ ───────────────────────────────────────────────────
// Rapports annuels PDF affichés sur la page Rapports d'activité.

// Récupère tous les rapports d'activité
export const fetchActivityReports = async () => {
  const response = await fetch(`${API_URL}/activity-reports`)
  if (!response.ok) throw new Error("Impossible de charger les rapports d'activité. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── LIEUX ─────────────────────────────────────────────────────────────────
// Lieux partenaires associés aux missions, affichés sur les pages mission et lieu.

// Récupère les lieux correspondant à une liste de pays
export const fetchLocationsByCountry = async (countries) => {
  const params = new URLSearchParams({ country: countries.join(',') })
  const response = await fetch(`${API_URL}/locations?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les lieux partenaires.")
  const data = await response.json()
  return data.locations
}

// Récupère un lieu complet par son slug
export const fetchLocationBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/locations/${slug}`)
  if (!response.ok) throw new Error(`Lieu introuvable (slug : ${slug})`)
  return await response.json()
}

// ── DÉLÉGATIONS ──────────────────────────────────────────────────────────
// Délégations nationales affichées sur la page Équipe.

// Récupère toutes les délégations
export const fetchDelegations = async () => {
  const response = await fetch(`${API_URL}/delegations`)
  if (!response.ok) throw new Error("Impossible de charger les délégations. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── RAPPORTS DE MISSION ───────────────────────────────────────────────────
// Comptes-rendus rédigés par les volontaires à leur retour de mission.

// Récupère les rapports de mission, filtrables (ex: par pays)
export const fetchMissionReports = async (filters = {}) => {
  const params = new URLSearchParams(filters)
  const response = await fetch(`${API_URL}/mission-reports?${params}`)
  if (!response.ok) throw new Error("Impossible de charger les rapports de mission. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

// ── PARTENAIRES ──────────────────────────────────────────────────────────
// Logos partenaires affichés sur la page À propos.

// Récupère tous les partenaires
export const fetchPartners = async () => {
  const response = await fetch(`${API_URL}/partners`)
  if (!response.ok) throw new Error("Impossible de charger les partenaires. Vérifiez votre connexion ou réessayez.")
  return await response.json()
}

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


// ═══════════════════════════════════════════════════════════════════════════
// ADMIN
// Endpoints protégés par JWT (via authFetch) — consommés par le dashboard.
// ═══════════════════════════════════════════════════════════════════════════

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

// ── TÉMOIGNAGES ──────────────────────────────────────────────────────────
// Modération dashboard : lecture de tous les statuts, approbation, refus.

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

// ── MISSIONS ─────────────────────────────────────────────────────────────
// CRUD complet des missions, plus tarifs et médias associés.

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

// Supprime DÉFINITIVEMENT une mission (hard delete) — irréversible.
export const hardDeleteMission = async (id) => {
  const response = await authFetch(`${API_URL}/admin/missions/${id}/permanent`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Échec de la suppression définitive de la mission.")
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

// ── LOCATIONS ────────────────────────────────────────────────────────────
// CRUD complet des lieux partenaires, plus leur galerie photo et statut actif/inactif.

// Récupère tous les lieux (actifs + inactifs) pour le dashboard admin
export const fetchAdminLocations = async () => {
  const response = await authFetch(`${API_URL}/admin/locations`)
  if (!response.ok) throw new Error("Impossible de charger les lieux.")
  const data = await response.json()
  return data.locations
}

// Récupère un lieu par son id pour le formulaire d'édition
export const fetchAdminLocationById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}`)
  if (!response.ok) throw new Error("Impossible de charger ce lieu.")
  const data = await response.json()
  return data.location
}

// Crée un nouveau lieu
export const createLocation = async (locationData) => {
  const response = await authFetch(`${API_URL}/admin/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création du lieu.")
  }
  const data = await response.json()
  return data.location
}

// Met à jour partiellement un lieu existant
export const updateLocation = async (id, locationData) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour du lieu.")
  }
  const data = await response.json()
  return data.location
}

// Remplace la galerie photo d'un lieu
export const updateLocationMedia = async (id, images) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}/media`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour des photos.")
  }
  return await response.json()
}

// Active ou désactive un lieu (pause/reprise, sans le supprimer)
export const toggleLocationActive = async (id, is_active) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  })
  if (!response.ok) throw new Error("Échec du changement de statut.")
  return await response.json()
}

// Supprime DÉFINITIVEMENT un lieu (hard delete) — irréversible.
export const hardDeleteLocation = async (id) => {
  const response = await authFetch(`${API_URL}/admin/locations/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error("Échec de la suppression.")
  return await response.json()
}

// ── DELEGATIONS ──────────────────────────────────────────────────────────
// Utilisées à la fois par l'onglet Équipe et par le panneau déplié du
// formulaire Lieu — mêmes fonctions, même ligne en base dans les deux cas.

// Récupère une délégation par son id pour le formulaire d'édition
export const fetchAdminDelegationById = async (id) => {
  const response = await authFetch(`${API_URL}/admin/delegations/${id}`)
  if (!response.ok) throw new Error("Impossible de charger cette délégation.")
  const data = await response.json()
  return data.delegation
}

// Crée une nouvelle délégation
export const createDelegation = async (delegationData) => {
  const response = await authFetch(`${API_URL}/admin/delegations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(delegationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la création de la délégation.")
  }
  const data = await response.json()
  return data.delegation
}

// Met à jour partiellement une délégation existante
export const updateDelegation = async (id, delegationData) => {
  const response = await authFetch(`${API_URL}/admin/delegations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(delegationData),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || "Échec de la mise à jour de la délégation.")
  }
  const data = await response.json()
  return data.delegation
}

// ── LISTE DES PAYS (pour le <datalist> du formulaire lieu/délégation) ──────
// Alimente l'autocomplétion pays, partagée par Mission, Service Civique et Lieu.

// Récupère la liste des noms de pays (FR) pour alimenter le <datalist>
export const fetchCountryNames = async () => {
  const response = await authFetch(`${API_URL}/admin/countries`)
  if (!response.ok) throw new Error("Impossible de charger la liste des pays.")
  const data = await response.json()
  return data.countries
}