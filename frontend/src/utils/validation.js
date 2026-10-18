// validation.js
// Règles de validation réutilisables dans les formulaires du dashboard.

// Année sur 4 chiffres, dans une plage réaliste pour l'association.
export const isValidYear = (value) => {
  const year = Number(value)
  return /^\d{4}$/.test(String(value).trim()) && year >= 2000 && year <= new Date().getFullYear() + 1
}


// Adresse de page (slug) : minuscules sans accents, chiffres, tirets simples.
// ⚠️ Même règle que backend/src/utils/validation.js — garder les deux identiques.
export const isValidSlug = (value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(value ?? '').trim())
