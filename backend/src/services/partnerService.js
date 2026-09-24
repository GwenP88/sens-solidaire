// partnerService.js
import prisma from '../config/db.js'

// ── GET (PUBLIC) ────────────────────────────────────────────────────────
export const getPartners = async () => {
  return await prisma.partner.findMany({
    where: { is_active: true },
    orderBy: { display_order: 'asc' },
  })
}

// ── FIND ALL FOR ADMIN ─────────────────────────────────────────────────
export const findAllForAdmin = async () => {
  return prisma.partner.findMany({
    orderBy: { display_order: 'asc' },
  })
}

// ── FIND BY ID (ADMIN) ─────────────────────────────────────────────────
export const findById = async (id) => {
  return prisma.partner.findUnique({ where: { id } })
}

// ── CREATE ──────────────────────────────────────────────────────────────
export const create = async (data) => {
  return prisma.partner.create({
    data: {
      name: data.name,
      logo_url: data.logo_url || null,
      website_url: data.website_url || null,
      display_order: data.display_order || 0,
    },
  })
}

// ── UPDATE ──────────────────────────────────────────────────────────────
export const update = async (id, data) => {
  return prisma.partner.update({
    where: { id },
    data: {
      name: data.name,
      logo_url: data.logo_url,
      website_url: data.website_url,
      display_order: data.display_order,
    },
  })
}

// ── TOGGLE ACTIVE — pause/reprise ───────────────────────────────────────
export const toggleActive = async (id, is_active) => {
  return prisma.partner.update({
    where: { id },
    data: { is_active },
  })
}

// ── HARD DELETE ───────────────────────────────────────────────────────────
export const hardDelete = async (id) => {
  return prisma.partner.delete({ where: { id } })
}