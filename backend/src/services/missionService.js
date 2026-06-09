// src/services/missionService.js
// Logique métier des missions
// Gère : récupération liste avec filtres, récupération détail par slug
// Interactions : Prisma (base de données)

import prisma from "../config/db.js"

// ── FIND ALL ─────────────────────────────────────────────────────────────────
// Récupère toutes les missions actives avec filtres optionnels
// Paramètres : filters (objet) — peut contenir type et/ou country
// Retourne : tableau de missions

export const findAll = async (filters = {}) => {

  // Construction du filtre WHERE dynamique
  // On n'ajoute un filtre que s'il est fourni dans la requête
  const where = {}
  if (filters.type)    where.type = filters.type
  if (filters.country) where.country = filters.country
  where.is_active = true

  // Requête Prisma
  // findMany → retourne un tableau (vide si aucun résultat, jamais null)
  // On inclut pricing et location pour afficher les infos sur les cards
  const missions = await prisma.mission.findMany({
    where,
    include: {
      pricing: true,
  	  location: true,
    },
    orderBy: { created_at: "desc" },
})

  return missions
}


// ── FIND BY SLUG ─────────────────────────────────────────────────────────────
// Récupère une mission complète par son slug
// Paramètres : slug (string) — ex: "volontariat-kenya-faune-sauvage"
// Retourne : la mission avec toutes ses relations OU throw 404

export const findBySlug = async (slug) => {

  // Requête Prisma
  // findUnique → retourne null si aucun résultat
  const mission = await prisma.mission.findUnique({
    where: { slug },
    include: {
		pricing: true,
		location: true,
      testimonials: {
    where: { status: "approved" }
  	}
    }
  })

  // Si aucune mission trouvée → erreur 404
  // Même pattern que dans authService pour les erreurs
  if (!mission) {
    const error = new Error("Aucune mission trouvée")
  error.status = 404
  throw error
  }

  return mission
}