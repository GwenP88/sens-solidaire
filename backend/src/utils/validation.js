// validation.js
// Règles de validation réutilisables dans les controllers.
// ⚠️ Copie de frontend/src/utils/validation.js — garder les deux identiques.

// Champ rempli : accepte texte ou nombre, refuse vide / espaces / null / undefined.
export const isFilled = (value) => String(value ?? '').trim() !== ''

// Année sur 4 chiffres, dans une plage réaliste pour l'association.
export const isValidYear = (value) => {
  const year = Number(value)
  return /^\d{4}$/.test(String(value).trim()) && year >= 2000 && year <= new Date().getFullYear() + 1
}

// Adresse de page (slug) : minuscules sans accents, chiffres, tirets simples.
// Ex. : volontariat-kenya-biodiversite
export const isValidSlug = (value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(value ?? '').trim())