// utils/missions.js
// Fonctions et constantes partagées pour les missions

// Calcule la fourchette de durée depuis le tableau pricing
export const getDuration = (pricing) => {
  if (!pricing || pricing.length === 0) return null
  if (pricing.length === 1) return pricing[0].duration_label
  return `${pricing[0].duration_label} à ${pricing[pricing.length - 1].duration_label}`
}

// Labels lisibles pour chaque type de mission
export const TYPE_LABELS = {
  volontariat_individuel: 'Volontariat individuel',
  service_civique: 'Service civique',
  groupe_jeunes: 'Groupe jeunes',
  conge_solidaire: 'Congé solidaire',
}