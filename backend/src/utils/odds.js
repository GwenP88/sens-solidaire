// odds.js
// Mapping ODD → catégorie thématique — même logique que frontend/src/utils/odds.js
// Dupliqué ici volontairement : le backend ne peut pas importer du code frontend.
// ⚠️ Si tu modifies un jour la répartition côté frontend, pense à répercuter ici aussi.

export const ODD_TO_CATEGORY = {
  14: 'Biodiversité',
  15: 'Biodiversité',
  1:  'Solidarité',
  10: 'Solidarité',
  2:  'Alimentation',
  3:  'Santé',
  4:  'Éducation',
  5:  'Egalité',
  8:  'Développement',
  9:  'Développement',
  11: 'Développement',
  16: 'Coopération',
  17: 'Coopération',
  6:  'Environnement',
  7:  'Environnement',
  12: 'Environnement',
  13: 'Environnement',
}

// Déduit la liste des catégories (tags) uniques à partir d'une liste de numéros ODD.
export const deriveTagsFromOdds = (oddNumbers = []) => {
  const categories = oddNumbers.map(n => ODD_TO_CATEGORY[n]).filter(Boolean)
  return [...new Set(categories)] // dédoublonne (ex: ODD 8 et 9 → "Développement" une seule fois)
}