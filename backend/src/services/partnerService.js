// partnerService.js
import prisma from '../config/db.js'

export const getPartners = async () => {
  return await prisma.partner.findMany({
    where: { is_active: true },
    orderBy: { display_order: 'asc' },
  })
}