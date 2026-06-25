// src/services/testimonialService.js
// Logique métier des témoignages (public + admin)
// Interactions : Prisma (base de données)

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
      consent_given: true,
      status:       "pending",
    },
  })
}

// ── FIND ALL FOR ADMIN ───────────────────────────────────────────────────────
// Récupère les témoignages pour l'espace admin (TOUS les statuts).
// L'admin voit aussi pending et rejected, car c'est ce qu'il doit modérer.
export const findAllForAdmin = async (filters = {}) => {
  const where = {}
  if (filters.status) where.status = filters.status

  const testimonials = await prisma.testimonial.findMany({
    where,
    include: {
      mission: { select: { id: true, title: true } },
    },
    orderBy: { created_at: "asc" }, // file de modération FIFO
  })

  return testimonials
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
