// testimonialService.js
// Logique métier — témoignages

import prisma from '../config/db.js'

// Récupère tous les témoignages validés — avec la mission liée
export const getValidatedTestimonials = async () => {
  return await prisma.testimonial.findMany({
    where: { status: 'approved' },
    include: {
      mission: {
        select: { title: true, type: true, country: true, slug: true }
      }
    },
    orderBy: { created_at: 'desc' }
  })
}

// Soumet un nouveau témoignage — status pending par défaut
export const submitTestimonial = async (data) => {
  return await prisma.testimonial.create({
    data: {
      author_name: data.author_name,
      content: data.content,
      mission_id: data.mission_id || null,
      avatar_url: data.avatar_url || null,
      annee: data.annee || null,
      consent_given: true,
      status: 'pending',
    }
  })
}
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

// ── UPDATE STATUS (ADMIN) ─────────────────────────────────────────────────────
// Change le statut d'un témoignage : modération approve / reject.
// Fonction générique : le STATUT est décidé par le controller (valeur en dur),
// JAMAIS par le client.
// Règle métier : un témoignage REFUSÉ ne peut pas rester sur la homepage
//                → on force show_homepage = false dans ce cas.
// Paramètres : id (number), status (string déjà figé : "approved" | "rejected")
// Retourne   : le témoignage mis à jour
// Throw      : 404 si l'id n'existe pas
export const updateStatus = async (id, status) => {
  try {
    // On part du changement de statut...
    const data = { status }

    // ...et si on refuse, on retire d'office le témoignage de la homepage.
    // (cohérence : impossible qu'un témoignage "rejected" reste affiché).
    if (status === "rejected") {
      data.show_homepage = false
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },   // on cible par l'id (stable)
      data,            // { status } ou { status, show_homepage: false }
    })
    return testimonial

  } catch (error) {
    // P2025 = "record to update not found" → l'id n'existe pas
    if (error.code === "P2025") {
      const err = new Error("Témoignage introuvable")
      err.status = 404
      err.code = "TESTIMONIAL_NOT_FOUND"   // clé stable pour le front
      throw err
    }
    throw error
  }
}
