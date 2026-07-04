// locationService.js
// Logique métier — lieux partenaires

import prisma from '../config/db.js'

export const getLocationBySlugService = async (slug) => {
  const location = await prisma.location.findUnique({
    where: { slug },
    include: {
      mission: { select: { slug: true, title: true } },
      delegation: { select: { contacts: true, lieu: true } },
    },
  })

  if (!location) return null

  // Médias récupérés séparément — relation polymorphique sans FK directe
  const gallery = await prisma.media.findMany({
    where: { entity_type: 'location', entity_id: location.id },
    orderBy: { display_order: 'asc' },
  })

  return { ...location, gallery }
}