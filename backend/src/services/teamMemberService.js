// teamMemberService.js
import prisma from '../config/db.js'

export const getTeamMembers = async (category = null, limit = null) => {
  const where = { is_active: true }
  if (category) where.category = category

  const query = {
    where,
    orderBy: [{ category: 'asc' }, { display_order: 'asc' }],
  }
  if (limit) query.take = limit

  return await prisma.teamMember.findMany(query)
}

export const findAllForAdmin = async () => {
  return await prisma.teamMember.findMany({
    orderBy: [{ category: 'asc' }, { display_order: 'asc' }],
  })
}

export const findById = async (id) => {
  return prisma.teamMember.findUnique({ where: { id } })
}

export const create = async (data) => {
  return prisma.teamMember.create({
    data: {
      nom: data.nom,
      role: data.role,
      description: data.description || null,
      avatar_url: data.avatar_url || null,
      category: data.category,
      display_order: data.display_order || 0,
    },
  })
}

export const update = async (id, data) => {
  return prisma.teamMember.update({
    where: { id },
    data: {
      nom: data.nom,
      role: data.role,
      description: data.description,
      avatar_url: data.avatar_url,
      category: data.category,
      display_order: data.display_order,
    },
  })
}

export const toggleActive = async (id, is_active) => {
  return prisma.teamMember.update({
    where: { id },
    data: { is_active },
  })
}

export const hardDelete = async (id) => {
  return prisma.teamMember.delete({ where: { id } })
}