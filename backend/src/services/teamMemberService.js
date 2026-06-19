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