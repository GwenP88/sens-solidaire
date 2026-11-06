// services/api/auth.js
// Connexion au dashboard — n'utilise PAS authFetch (le login produit l'auth, il ne la consomme pas).

import { API_URL } from './client.js'

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
