// services/api/client.js
// Socle commun à tous les fichiers d'API : URL de base + authFetch (token, refresh silencieux, erreurs réseau).

// URL relative : le proxy Vite (vite.config.js) redirige /api vers le backend
export const API_URL = "/api"

// authFetch — ajoute le token à chaque requête protégée du dashboard.
// Au 1er 401 (access token expiré, 15 min), tente un refresh SILENCIEUX via
// le cookie HTTP-Only avant de déconnecter.
// Chaque appel réseau est protégé individuellement : si fetch() échoue avant
// même d'obtenir une réponse (serveur injoignable, pas de connexion...), on
// remplace le message brut du navigateur par un message compréhensible.
export const NETWORK_ERROR_MESSAGE = "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez."

export const authFetch = async (url, options = {}) => {
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
    throw new Error(NETWORK_ERROR_MESSAGE, { cause: err })
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
      throw new Error(NETWORK_ERROR_MESSAGE, { cause: err })
    }

    if (refreshed.ok) {
      const { accessToken } = await refreshed.json()
      localStorage.setItem("admin_token", accessToken)
      try {
        response = await doFetch(accessToken)
      } catch (err) {
        if (err.name === 'AbortError') throw err
        throw new Error(NETWORK_ERROR_MESSAGE, { cause: err })
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
