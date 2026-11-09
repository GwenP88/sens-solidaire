// filters.js
// Filtres partagés entre plusieurs pages
// Organisation : 1) listes de données brutes (FILTERS_*) — utilisées par FilterChips ou comme source
//                2) configs prêtes pour FilterSelect (FILTER_CONFIG_*) — dérivées des listes ci-dessus

// ════════════════════════════════════════════════════════════════
// 1. LISTES DE DONNÉES BRUTES
// ════════════════════════════════════════════════════════════════

// ── Pays ──
// Plus de liste figée (tâche 170) : les pays proposés sont DÉRIVÉS des données
// réellement publiées (actions terrain, témoignages, rapports, missions).
// → un pays n'apparaît que s'il a au moins un résultat, et un nouveau pays
//   saisi dans le dashboard apparaît tout seul.
//
// buildCountryOptions(names, { lowercaseValue })
//   names : tableau de noms de pays (doublons, vides et casse différente tolérés)
//   lowercaseValue : true → value en minuscules (page Témoignages : ?destination=kenya)
//   retourne [{ value, label }] trié par ordre alphabétique français
export const buildCountryOptions = (names, { lowercaseValue = false } = {}) => {
  const byKey = new Map() // clé en minuscules → 1 seule entrée pour "Kenya" et "kenya"
  names.forEach(name => {
    const label = name?.trim()
    if (!label) return
    const key = label.toLowerCase()
    if (!byKey.has(key)) byKey.set(key, label)
  })
  return [...byKey.entries()]
    .sort(([, a], [, b]) => a.localeCompare(b, 'fr'))
    .map(([key, label]) => ({ value: lowercaseValue ? key : label, label }))
}

// ── Type de mission ──
export const FILTERS_MISSION_TYPE = [
  { label: "Toutes", value: null },
  { label: "Volontariat individuel", value: "individuel" },
  { label: "Service civique", value: "service_civique" },
  { label: "Groupe jeunes", value: "groupe_jeunes" },
  { label: "Congé de solidarité", value: "conge_solidaire" },
]

// ── Public cible — page Éducation & Sensibilisation ──
export const FILTERS_EDUCATION_PUBLIC = [
  { label: "Tous", value: null },
  { label: "Maternelle & Primaire", value: "primaire" },
  { label: "Collège & Lycée", value: "college_lycee" },
  { label: "Adultes & Étudiants", value: "adultes" },
]

// ── Catégories ODD — page Notre Impact (FilterChips) ──
// Mapping ODD → catégorie géré séparément dans utils/odds.js (ODD_TO_CATEGORY)
// Les `value` doivent correspondre EXACTEMENT aux valeurs de ODD_TO_CATEGORY.
export const FILTERS_ACTION_TAGS = [
  { label: "Tous les thèmes", value: null },
  { label: "Biodiversité", value: "Biodiversité" },
  { label: "Solidarité", value: "Solidarité" },
  { label: "Alimentation", value: "Alimentation" },
  { label: "Santé", value: "Santé" },
  { label: "Éducation", value: "Éducation" },
  { label: "Égalité", value: "Egalité" },
  { label: "Développement", value: "Développement" },
  { label: "Coopération", value: "Coopération" },
  { label: "Environnement", value: "Environnement" },
]

// ── Thème — page Médias & Actualités ──
export const FILTERS_MEDIA_THEME = [
  { label: "Tous les thèmes", value: null },
  { label: "Newsletter", value: "Newsletter" },
  { label: "Revue de presse", value: "Revue de presse" },
  { label: "Interview & radio", value: "Interview & radio" },
  { label: "Vie de l'association", value: "Vie de l'association" },
  { label: "Éducation & sensibilisation", value: "Éducation & sensibilisation" },
  { value: 'Événement', label: 'Événement' },
  { value: 'Ils parlent de nous', label: 'Ils parlent de nous' },
]


// ════════════════════════════════════════════════════════════════
// 2. CONFIGS POUR FilterSelect
// Format attendu par le composant : { key, placeholder, options: [{ value, label }], condition? }
// ════════════════════════════════════════════════════════════════

// ── Filtre pays réutilisable ──
// countryOptions : résultat de buildCountryOptions() — calculé par la page à partir de ses données
// Utilisable par n'importe quelle page ayant besoin d'un filtre pays via FilterSelect (ex: Impact)
export const getFilterConfigCountry = (countryOptions) => [
  {
    key: 'country',
    placeholder: 'Tous les pays',
    options: countryOptions,
  },
]

// ── Filtres — page Témoignages ──
// 4 filtres combinés : vue (témoignages/rapports), type de mission, destination, année
// destinationOptions : buildCountryOptions(..., { lowercaseValue: true })
export const getFilterConfigTemoignages = (destinationOptions) => [
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
    options: destinationOptions,
  },
  {
    key: 'annee',
    placeholder: 'Toutes les années',
    options: [2026, 2025, 2024, 2023, 2022, 2021, 2020].map(a => ({ value: String(a), label: String(a) })),
  },
]

// ── Filtres — page Médias & Actualités ──
// 2 filtres combinés : thème, année
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