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
]

export const FILTERS_MEDIA_THEME = [
  { label: "Tous les thèmes", value: null },
  { label: "Newsletter", value: "Newsletter" },
  { label: "Revue de presse", value: "Revue de presse" },
  { label: "Interview & radio", value: "Interview & radio" },
  { label: "Vie de l'association", value: "Vie de l'association" },
  { label: "Éducation & sensibilisation", value: "Éducation & sensibilisation" },
  { value: 'Événement', label: 'Événement' },
]

export const FILTER_CONFIG_TEMOIGNAGES = [
  {
    key: 'vue',
    placeholder: 'Tous les types',
    options: [
      { value: 'temoignages', label: 'Témoignages' },
      { value: 'rapports', label: 'Rapports de mission' },
    ]
  },
  {
    key: 'type',
    placeholder: 'Toutes les missions',
    options: FILTERS_MISSION_TYPE.filter(f => f.value !== null).map(f => ({ value: f.value, label: f.label })),
  },
  {
    key: 'destination',
    placeholder: 'Toutes les destinations',
    condition: (values) => !values.type || values.type === 'individuel',
    options: FILTERS_COUNTRY.filter(f => f.value !== null).map(f => ({ value: f.value?.toLowerCase(), label: f.label })),
  },
  {
    key: 'annee',
    placeholder: 'Toutes les années',
    options: [2026, 2025, 2024, 2023, 2022, 2021, 2020].map(a => ({ value: String(a), label: String(a) })),
  },
]

export const FILTER_CONFIG_MEDIAS = [
  {
    key: 'theme',
    placeholder: 'Tous les thèmes',
    options: FILTERS_MEDIA_THEME.filter(f => f.value !== null).map(f => ({ value: f.value, label: f.label })),
  },
  {
    key: 'annee',
    placeholder: 'Toutes les années',
    options: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2017, 2016, 2013]
      .map(a => ({ value: String(a), label: String(a) })),
  },
]