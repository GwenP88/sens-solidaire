// odds.js
// Labels et données ODD — partagés entre ActionDetail, NotreImpact, ActionsEducatives

export const ODDS_LABELS = {
  1: "Pas de pauvreté",
  2: "Faim « zéro »",
  3: "Bonne santé et bien-être",
  4: "Éducation de qualité",
  5: "Égalité entre les sexes",
  6: "Eau propre et assainissement",
  7: "Énergie propre et d'un coût abordable",
  8: "Travail décent et croissance économique",
  9: "Industrie, innovation et infrastructure",
  10: "Inégalités réduites",
  11: "Villes et communautés durables",
  12: "Consommation et production responsables",
  13: "Mesures relatives à la lutte contre les changements climatiques",
  14: "Vie aquatique",
  15: "Vie terrestre",
  16: "Paix, justice et institutions efficaces",
  17: "Partenariats pour la réalisation des objectifs",
}

export const ODDS = Object.entries(ODDS_LABELS).map(([n, label]) => ({
  n: Number(n),
  label,
}))

// Icône officielle de l'ONU d'un ODD (ex. 4 → E_SDG_Icons-04.jpg)
export const oddIconUrl = n =>
  `https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${String(n).padStart(2, '0')}.jpg`

// Page officielle des ODD, en français (lien « En savoir plus » des composants ODD)
export const ODD_INFO_URL = 'https://www.un.org/sustainabledevelopment/fr/'

// Mapping ODD → catégorie thématique
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