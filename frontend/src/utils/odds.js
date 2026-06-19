// odds.js
// Labels et données ODD — partagés entre ActionDetail, NotreImpact, ActionsEducatives

export const ODDS_LABELS = {
  1: "Pas de pauvreté",
  2: "Faim zéro",
  3: "Bonne santé",
  4: "Éducation de qualité",
  5: "Égalité des sexes",
  6: "Eau propre",
  7: "Énergie propre",
  8: "Travail décent",
  9: "Industrie & innovation",
  10: "Inégalités réduites",
  11: "Villes durables",
  12: "Consommation responsable",
  13: "Lutte contre le climat",
  14: "Vie aquatique",
  15: "Vie terrestre",
  16: "Paix & justice",
  17: "Partenariats",
}

export const ODDS = Object.entries(ODDS_LABELS).map(([n, label]) => ({
  n: Number(n),
  label,
}))