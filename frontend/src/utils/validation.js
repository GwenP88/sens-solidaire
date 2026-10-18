// validation.js
// Règles de validation réutilisables dans les formulaires du dashboard.

// Année sur 4 chiffres, dans une plage réaliste pour l'association.
export const isValidYear = (value) => {
  const year = Number(value)
  return /^\d{4}$/.test(String(value).trim()) && year >= 2000 && year <= new Date().getFullYear() + 1
}
