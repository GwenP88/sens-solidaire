// delegationService.js
import prisma from '../config/db.js'

export const getDelegations = async () => {
  return await prisma.delegation.findMany({
    where: { is_active: true },
    orderBy: { display_order: 'asc' },
  })
}