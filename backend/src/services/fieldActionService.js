// fieldActionService.js
// Logique métier — actions terrain

import prisma from '../config/db.js'

export const getAllFieldActions = async (country = null) => {
  const where = { is_active: true }
  if (country) where.country = { contains: country }

  return await prisma.fieldAction.findMany({
    where,
    include: {
      tags: true,
      odds: { orderBy: { odd_number: 'asc' } },
    },
    orderBy: { created_at: 'desc' },
  })
}

export const getFieldActionBySlugService = async (slug) => {
  const action = await prisma.fieldAction.findUnique({
    where: { slug },
    include: {
      tags: true,
      odds: { orderBy: { odd_number: 'asc' } },
    },
  })

  if (!action) return null

  // Récupère la galerie via table Media polymorphe
  const gallery = await prisma.media.findMany({
    where: { entity_type: 'field_action', entity_id: action.id },
    orderBy: { display_order: 'asc' },
  })

  return { ...action, gallery }
}
