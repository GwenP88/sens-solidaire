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
  	  locations: true,
    },
    orderBy: { created_at: "asc" },
})

  return missions
}

// ── FIND ALL FOR ADMIN ───────────────────────────────────────────────────────
// Récupère TOUTES les missions (actives ET inactives) pour le dashboard admin.
// Différence avec findAll : AUCUN filtre is_active → les soft-deleted sont visibles.
// Retourne : tableau de missions (vide si aucune, jamais null)

export const findAllForAdmin = async () => {

  const missions = await prisma.mission.findMany({

    include: {
      pricing: true,
  	  locations: true,
    },
    orderBy: { created_at: "asc" },
  })

  return missions
}

// ── FIND BY ID (ADMIN) ───────────────────────────────────────────────────────
// Récupère une mission complète par son id — pour le formulaire d'édition
// Paramètre : id (number)
// Retourne  : la mission avec ses relations OU throw 404
export const findById = async (id) => {
  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      pricing: true,
      locations: true,
    }
  })

  if (!mission) {
    const err = new Error("Mission introuvable")
    err.status = 404
    err.code = "MISSION_NOT_FOUND"
    throw err
  }

  const media = await prisma.media.findMany({
    where: { entity_type: 'mission', entity_id: id },
    orderBy: { display_order: 'asc' },
  })

  return { ...mission, media }
}

// ── FIND BY SLUG ─────────────────────────────────────────────────────────────
// Récupère une mission complète par son slug
// Paramètres : slug (string) — ex: "volontariat-kenya-faune-sauvage"
// Retourne : la mission avec toutes ses relations OU throw 404

export const findBySlug = async (slug) => {

  // Requête Prisma
  // findUnique → retourne null si aucun résultat
  const mission = await prisma.mission.findFirst({
    where: { slug, is_active: true, },
    include: {
      pricing: true,
      locations: true,
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

  // Récupère les médias liés à cette mission (galerie + PDF)
  const media = await prisma.media.findMany({
    where: { entity_type: 'mission', entity_id: mission.id },
    orderBy: { display_order: 'asc' },
  })

  // Formatage des témoignages pour correspondre aux props de TestimonialCard
  return {
    ...mission,
    media,
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

// ── UPDATE ───────────────────────────────────────────────────────────────────
// Met à jour une mission existante (modification PARTIELLE - PATCH)
// Paramètres : id (number), data (objet — uniquement les champs à modifier, déjà validés)
// Retourne   : la mission mise à jour
// Throw      : 404 si l'id n'existe pas · 409 si le nouveau slug est déjà pris
export const update = async (id, data) => {
  try {
    const mission = await prisma.mission.update({
      where: { id },   // on cible par l'id (stable), pas le slug
      data,            // objet déjà filtré par le controller (whitelist + champs fournis only)
    })
    return mission

  } catch (error) {
    // P2025 = "record to update not found" → l'id n'existe pas
    if (error.code === "P2025") {
      const err = new Error("Mission introuvable")
      err.status = 404
      err.code = "MISSION_NOT_FOUND"
      throw err
    }
    // P2002 = violation @unique → le nouveau slug est déjà pris par une autre mission
    if (error.code === "P2002") {
      const err = new Error("Une mission avec ce slug existe déjà")
      err.status = 409
      err.code = "SLUG_TAKEN"
      throw err
    }
    throw error
  }
}

// ── SOFT DELETE ──────────────────────────────────────────────────────────────
// "Supprime" une mission en la DÉSACTIVANT (is_active = false).
// La ligne reste en base (réversible + traçabilité), mais disparaît du public
// car findAll filtre déjà sur is_active = true.
// Paramètre : id (number)
// Retourne  : la mission désactivée
// Throw     : 404 si l'id n'existe pas
export const softDelete = async (id) => {
  try {
    const mission = await prisma.mission.update({
      where: { id },
      data: { is_active: false },   // le cœur du soft delete : on bascule le flag
    })
    return mission

  } catch (error) {
    // P2025 = "record to update not found" → l'id n'existe pas
    if (error.code === "P2025") {
      const err = new Error("Mission introuvable")
      err.status = 404
      err.code = "MISSION_NOT_FOUND"
      throw err
    }
    throw error
  }
}
