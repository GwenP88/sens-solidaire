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
  13: "Mesure relative à la Lutte contre les changements climatiques",
  14: "Vie aquatique",
  15: "Vie terrestre",
  16: "Paix, justice et institutions efficaces",
  17: "Partenariats pour la réalisation des objectifs",
}

export const ODDS = Object.entries(ODDS_LABELS).map(([n, label]) => ({
  n: Number(n),
  label,
}))

// Mapping ODD → catégorie thématique
export const ODD_TO_CATEGORY = {
  14: 'Biodiversité',
  15: 'Biodiversité',
  1:  'Solidarité',
  2:  'Solidarité',
  3:  'Solidarité',
  5:  'Solidarité',
  10: 'Solidarité',
  4:  'Éducation et sensibilisation',
  8:  'Développement local',
  9:  'Développement local',
  11: 'Développement local',
  16: 'Coopération',
  17: 'Coopération',
  6:  'Climat & Ressources',
  7:  'Climat & Ressources',
  12: 'Climat & Ressources',
  13: 'Climat & Ressources',
}