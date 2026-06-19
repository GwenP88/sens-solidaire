// educationItemService.js
import prisma from '../config/db.js'

export const getAllEducationItems = async () => {
  return await prisma.educationItem.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'asc' },
  })
}

export const getEducationItemBySlug = async (slug) => {
  return await prisma.educationItem.findUnique({
    where: { slug },
  })
}