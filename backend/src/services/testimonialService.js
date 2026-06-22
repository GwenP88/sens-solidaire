// src/services/testimonialService.js
// Logique métier des témoignages
// Gère (pour l'instant) : récupération liste admin avec filtre statut optionnel
// Interactions : Prisma (base de données)

import prisma from "../config/db.js"

// ── FIND ALL FOR ADMIN ───────────────────────────────────────────────────────
// Récupère les témoignages pour l'espace admin (TOUS les statuts).
// Différence avec le public : l'admin voit aussi pending et rejected,
// car c'est précisément ce qu'il doit modérer.
// Paramètres : filters (objet) — peut contenir status
// Retourne : tableau de témoignages (vide si aucun, jamais null)

export const findAllForAdmin = async (filters = {}) => {

  // Construction du filtre WHERE dynamique — même pattern que findAll missions.
  // On n'ajoute le filtre status que s'il est fourni dans la requête.
  // Avantage : on pourra empiler d'autres filtres plus tard (mission_id, etc.)
  // sans réécrire la logique.
  const where = {}
  if (filters.status) where.status = filters.status

  // findMany → retourne un tableau (vide si aucun résultat, jamais null)
  // include mission : on joint le titre pour la carte de modération.
  // mission_id peut être null (témoignage sans mission précise) → mission sera
  // null pour ces lignes, à gérer au front ("Mission non précisée").
  // select minimal : id + title seulement, pas toute la mission.
  const testimonials = await prisma.testimonial.findMany({
    where,
    include: {
      mission: { select: { id: true, title: true } },
    },
    // File de modération FIFO : du plus ancien au plus récent.
    // On traite en priorité ce qui attend depuis le plus longtemps.
    orderBy: { created_at: "asc" },
  })

  return testimonials
}
