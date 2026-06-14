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
    orderBy: { created_at: "asc" },
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

  if (!mission) {
    const error = new Error("Aucune mission trouvée")
    error.status = 404
    throw error
  }

  // Formatage des témoignages pour correspondre aux props de TestimonialCard
  return {
    ...mission,
    testimonials: mission.testimonials.map(t => ({
      ...t,
      quote: t.content,
      name: t.author_name,
      mission: mission.title,
    }))
  }
}

// ── CREATE ───────────────────────────────────────────────────────────────────
// Crée une nouvelle mission en base
// Paramètre : data (objet) — champs DÉJÀ validés par le controller
// Retourne  : la mission créée
// Throw     : 409 si le slug existe déjà (contrainte @unique violée)
export const create = async (data) => {
  try {
    const mission = await prisma.mission.create({
      data: {
        // ⚠️ WHITELIST — chaque champ autorisé est listé UN PAR UN.
        // Tout ce qui n'est pas ici est ignoré → bloque le mass assignment.
        // Absents volontairement : id / created_at / updated_at (gérés par Prisma),
        //                          is_active (default true), relations (location/pricing).

        // — Champs OBLIGATOIRES —
        title:             data.title,
        country:           data.country,
        slug:              data.slug,
        short_description: data.short_description,
        type:              data.type, // défaut en base, mais validé en amont

        // — Champs OPTIONNELS —
        description:       data.description,
        volunteer_role:    data.volunteer_role,
        programme:         data.programme,
        included:          data.included,
        not_include:       data.not_include,
        admin_info:        data.admin_info,
        ministry_url:      data.ministry_url,
        health_info:       data.health_info,
        helloasso_url:     data.helloasso_url,
        image_url:         data.image_url,
        how_to_go:         data.how_to_go,
      },
    })

    return mission

  } catch (error) {
    // P2002 = violation de contrainte @unique (ici : slug déjà pris)
    if (error.code === "P2002") {
      const err = new Error("Une mission avec ce slug existe déjà")
      err.status = 409
      err.code = "SLUG_TAKEN" // 👈 clé stable pour le front
      throw err
    }
    throw error // toute autre erreur → errorHandler global
  }
}