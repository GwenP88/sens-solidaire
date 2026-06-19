// filters.js
// Filtres partagés entre plusieurs pages

export const FILTERS_COUNTRY = [
  { label: "Tous les pays", value: null },
  { label: "Kenya", value: "Kenya" },
  { label: "Sénégal", value: "Sénégal" },
  { label: "Sri Lanka", value: "Sri Lanka" },
  { label: "Pérou", value: "Pérou" },
  { label: "Sumatra", value: "Sumatra" },
]

export const FILTERS_MISSION_TYPE = [
  { label: "Toutes", value: null },
  { label: "Volontariat individuel", value: "individuel" },
  { label: "Service civique", value: "service_civique" },
  { label: "Groupe jeunes", value: "groupe_jeunes" },
  { label: "Congé solidaire", value: "conge_solidaire" },
]

export const FILTERS_EDUCATION_PUBLIC = [
  { label: "Tous", value: null },
  { label: "Maternelle & Primaire", value: "primaire" },
  { label: "Collège & Lycée", value: "college_lycee" },
  { label: "Adultes & Étudiants", value: "adultes" },
]

export const FILTERS_ACTION_TAGS = [
  { label: "Tous les thèmes", value: null },
  { label: "Environnement", value: "Environnement" },
  { label: "Biodiversité", value: "Biodiversité" },
  { label: "Agriculture", value: "Agriculture" },
  { label: "Éducation", value: "Éducation" },
  { label: "Échanges culturels", value: "Échanges culturels" },
  { label: "Accès à l'eau", value: "Accès à l'eau" },
  { label: "Sensibilisation", value: "Sensibilisation" },
]

export const FILTERS_MEDIA_THEME = [
  { label: "Tous les thèmes", value: null },
  { label: "Newsletter", value: "Newsletter" },
  { label: "Revue de presse", value: "Revue de presse" },
  { label: "Interview & radio", value: "Interview & radio" },
  { label: "Vie de l'association", value: "Vie de l'association" },
  { label: "Éducation & sensibilisation", value: "Éducation & sensibilisation" },
]