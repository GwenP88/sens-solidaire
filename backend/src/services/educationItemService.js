// educationItemService.js
import prisma from '../config/db.js'

export const getAllEducationItems = async () => {
  return await prisma.educationItem.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'asc' },
  })
}

export const getEducationItemBySlug = async (slug) => {
  const item = await prisma.educationItem.findUnique({
    where: { slug },
  })

  if (!item) return null

  const media = await prisma.media.findMany({
    where: { entity_type: 'education_item', entity_id: item.id },
    orderBy: { display_order: 'asc' },
  })

  return { ...item, media }
}