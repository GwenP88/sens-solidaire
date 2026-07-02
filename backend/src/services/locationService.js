// locationService.js
// Logique métier — lieux partenaires

import prisma from '../config/db.js'

export const getLocationBySlugService = async (slug) => {
  return await prisma.location.findUnique({
    where: { slug },
    include: {
      mission: { select: { slug: true, title: true } },
      delegation: { select: { contacts: true, lieu: true } },
    },
  })
}