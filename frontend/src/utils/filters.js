// filters.js
// Filtres partagés entre plusieurs pages
// Organisation : 1) listes de données brutes (FILTERS_*) — utilisées par FilterChips ou comme source
//                2) configs prêtes pour FilterSelect (FILTER_CONFIG_*) — dérivées des listes ci-dessus

// ════════════════════════════════════════════════════════════════
// 1. LISTES DE DONNÉES BRUTES
// ════════════════════════════════════════════════════════════════

// ── Pays ──
// Source unique pour tous les filtres pays du site (Testimonials + Impact)
export const FILTERS_COUNTRY = [
  { label: "Tous les pays", value: null },
  { label: "Kenya", value: "Kenya" },
  { label: "Sénégal", value: "Sénégal" },
  { label: "Sri Lanka", value: "Sri Lanka" },
  { label: "Pérou", value: "Pérou" },
  { label: "Sumatra", value: "Sumatra" },
  { label: "France", value: "France" },
  { label: "Côte d'Ivoire", value: "Côte d'Ivoire" },
]

// ── Type de mission ──
export const FILTERS_MISSION_TYPE = [
  { label: "Toutes", value: null },
  { label: "Volontariat individuel", value: "individuel" },
  { label: "Service civique", value: "service_civique" },
  { label: "Groupe jeunes", value: "groupe_jeunes" },
  { label: "Congé solidaire", value: "conge_solidaire" },
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
export const FILTERS_ACTION_TAGS = [
  { label: "Tous les thèmes", value: null },
  { label: "Biodiversité", value: "Biodiversité" },
  { label: "Solidarité", value: "Solidarité" },
  { label: "Éducation", value: "Éducation et sensibilisation" },
  { label: "Développement local", value: "Développement local" },
  { label: "Coopération", value: "Coopération" },
  { label: "Climat & Ressources", value: "Climat & Ressources" },
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
]


// ════════════════════════════════════════════════════════════════
// 2. CONFIGS POUR FilterSelect
// Format attendu par le composant : { key, placeholder, options: [{ value, label }], condition? }
// ════════════════════════════════════════════════════════════════

// ── Filtre pays réutilisable ──
// Dérivée de FILTERS_COUNTRY, sans dupliquer la liste de pays
// Utilisable par n'importe quelle page ayant besoin d'un filtre pays via FilterSelect (ex: Impact)
export const FILTER_CONFIG_COUNTRY = [
  {
    key: 'country',
    placeholder: 'Tous les pays',
    options: FILTERS_COUNTRY.filter(f => f.value !== null).map(f => ({ value: f.value, label: f.label })),
  },
]

// ── Filtres — page Témoignages ──
// 4 filtres combinés : vue (témoignages/rapports), type de mission, destination, année
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
    options: FILTERS_COUNTRY.filter(f => f.value !== null).map(f => ({ value: f.value?.toLowerCase(), label: f.label })),
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