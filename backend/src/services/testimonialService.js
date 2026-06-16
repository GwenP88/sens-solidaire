// testimonialService.js
// Logique métier — témoignages

import prisma from '../config/db.js'

// Récupère tous les témoignages validés — avec la mission liée
export const getValidatedTestimonials = async () => {
  return await prisma.testimonial.findMany({
    where: { status: 'validated' },
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