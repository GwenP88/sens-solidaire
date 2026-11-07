// prismaErrors.js
// Traduit les erreurs Prisma « attendues » en réponse HTTP claire (utilisé par le gestionnaire d'erreurs de app.js).

// P2025 : l'enregistrement à modifier / supprimer n'existe pas (ex. PATCH /api/admin/partners/999999)
//         → 404, et non 500 : ce n'est pas une panne du serveur, l'id demandé n'existe pas.
// P2002 : valeur déjà utilisée sur un champ @unique (ex. slug, année d'un rapport d'activité)
//         → 409 Conflict.
const PRISMA_TO_HTTP = {
  P2025: { status: 404, message: "Élément introuvable. Il a peut-être déjà été supprimé." },
  P2002: { status: 409, message: "Cette valeur est déjà utilisée par un autre élément." },
}

// Retourne { status, message } pour une erreur Prisma connue, sinon null.
// Une erreur qui porte déjà un status (posé par un service) est laissée telle quelle.
export const prismaErrorToHttp = (err) => {
  if (!err || err.status) return null
  return PRISMA_TO_HTTP[err.code] || null
}
