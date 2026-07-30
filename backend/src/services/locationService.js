// locationService.js
// Logique métier — lieux partenaires

import prisma from '../config/db.js'

export const getLocationBySlugService = async (slug) => {
  const location = await prisma.location.findUnique({
    where: { slug },
    include: {
      missions: { select: { slug: true, title: true } },
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

// ── FIND ALL BY COUNTRY (PUBLIC) ──────────────────────────────────────────────
// Liste des lieux actifs, filtrés par un ou plusieurs pays.
// Utilisé pour les sections non reliées à une Mission BDD (ex: Service Civique).
export const findAllByCountry = async (countries) => {
  return await prisma.location.findMany({
    where: {
      country: { in: countries },
      is_active: true,
    },
    orderBy: { name: 'asc' },
  })
}