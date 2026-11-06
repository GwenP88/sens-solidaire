// services/api/countries.js
// Liste des noms de pays (datalist des formulaires du dashboard).

import { API_URL, authFetch } from './client.js'

// ═══ ADMIN — protégé par JWT via authFetch (dashboard) ═════════════════════

// ── LISTE DES PAYS (pour le <datalist> du formulaire lieu/délégation) ──────
// Alimente l'autocomplétion pays, partagée par Mission, Service Civique et Lieu.

// Récupère la liste des noms de pays (FR) pour alimenter le <datalist>
export const fetchCountryNames = async () => {
  const response = await authFetch(`${API_URL}/admin/countries`)
  if (!response.ok) throw new Error("Impossible de charger la liste des pays.")
  const data = await response.json()
  return data.countries
}
