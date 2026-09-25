// src/services/testimonialService.js
// Business logic for testimonials (public submission + admin moderation).
// Handles: public listing/submission, admin listing, status updates, deletion.
// Interactions: Prisma (database).
// Design note: testimonials are HARD-deleted (GDPR art. 17), unlike missions
// (soft delete) — they carry personal data (author_name, content), so the
// row must actually disappear when erasure is requested.

import prisma from "../config/db.js"

// ── GET VALIDATED (PUBLIC) ────────────────────────────────────────────────────
// Récupère tous les témoignages approuvés, avec la mission liée.
export const getValidatedTestimonials = async () => {
  return await prisma.testimonial.findMany({
    where: { status: "approved" },
    include: {
      mission: {
        select: { title: true, type: true, country: true, slug: true },
      },
    },
    orderBy: { created_at: "desc" },
  })
}

// ── SUBMIT (PUBLIC) ───────────────────────────────────────────────────────────
// Soumet un nouveau témoignage — status "pending" par défaut.
export const submitTestimonial = async (data) => {
  return await prisma.testimonial.create({
    data: {
      author_name:  data.author_name,
      content:      data.content,
      mission_id:   data.mission_id || null,
      avatar_url:   data.avatar_url || null,
      annee:        data.annee || null,
      mois:         data.mois || null,
      type:         data.type || null,
      consent_given: data.consent_given === true,
      status:       "pending",
    },
  })
}

// ── FIND ALL FOR ADMIN — modération + liste filtrée/paginée ─────────────────
// filters : { status?, type?, country?, limit = 10, offset = 0 }
// type/country filtrent sur la mission liée (relation Mission).
export const findAllForAdmin = async (filters = {}) => {
  const where = {}
  if (filters.status) where.status = filters.status
  if (filters.type) where.type = filters.type
  if (filters.country) where.mission = { country: filters.country }

  const limit = filters.limit || 10
  const offset = filters.offset || 0

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      include: {
        mission: { select: { id: true, title: true, type: true, country: true } },
      },
      orderBy: { created_at: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.testimonial.count({ where }),
  ])

  return { testimonials, total }
}

// ── UPDATE STATUS (ADMIN) ─────────────────────────────────────────────────────
// Modération approve / reject. Le statut est figé par le controller, jamais le client.
// Règle métier : un témoignage rejeté ne peut pas rester sur la homepage.
export const updateStatus = async (id, status) => {
  try {
    const data = { status }
    if (status === "rejected") {
      data.show_homepage = false
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    })
    return testimonial

  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Témoignage introuvable")
      err.status = 404
      err.code = "TESTIMONIAL_NOT_FOUND"
      throw err
    }
    throw error
  }
}

// ── HARD DELETE (RGPD) ────────────────────────────────────────────────────────
// Supprime DÉFINITIVEMENT un témoignage (droit à l'effacement, RGPD art. 17).
// Contrairement aux missions (soft delete), la ligne disparaît vraiment :
// le témoignage contient des données personnelles (author_name, content).
export const remove = async (id) => {
  try {
    const testimonial = await prisma.testimonial.delete({
      where: { id },
    })
    return testimonial

  } catch (error) {
    if (error.code === "P2025") {
      const err = new Error("Témoignage introuvable")
      err.status = 404
      err.code = "TESTIMONIAL_NOT_FOUND"
      throw err
    }
    throw error
  }
}

// ── UPDATE (ADMIN) — modifie n'importe quel champ, y compris mission_id ────
export const update = async (id, data) => {
  try {
    return await prisma.testimonial.update({
      where: { id },
      data: {
        author_name: data.author_name,
        content: data.content,
        mission_id: data.mission_id,
        annee: data.annee,
        mois: data.mois,
        type: data.type,
        avatar_url: data.avatar_url,
        show_homepage: data.show_homepage,
      },
    })
  } catch (error) {
    if (error.code === 'P2025') {
      const err = new Error("Témoignage introuvable.")
      err.status = 404
      err.code = 'TESTIMONIAL_NOT_FOUND'
      throw err
    }
    throw error
  }
}

// ── ADMIN CREATE — créé par la cliente, publié directement ─────────────────
// Contrairement à submitTestimonial (public), statut forcé "approved" —
// la cliente valide le contenu en même temps qu'elle le crée.
export const adminCreate = async (data) => {
  return await prisma.testimonial.create({
    data: {
      author_name: data.author_name,
      content: data.content,
      mission_id: data.mission_id || null,
      annee: data.annee || null,
      mois: data.mois || null,
      type: data.type || null,
      avatar_url: data.avatar_url || null,
      consent_given: true,
      status: "approved",
      show_homepage: data.show_homepage === true,
    },
  })
}