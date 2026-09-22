// delegationService.js
import prisma from '../config/db.js'
import { getCountryCode } from '../utils/countries.js'

export const getDelegations = async () => {
  return await prisma.delegation.findMany({
    where: { is_active: true },
    orderBy: { display_order: 'asc' },
  })
}

// ── FIND BY ID (ADMIN) — pour le formulaire d'édition ──────────────────────
export const findById = async (id) => {
  return prisma.delegation.findUnique({ where: { id } })
}

// ── CREATE ──────────────────────────────────────────────────────────────
// Utilisée à la fois par l'onglet Équipe et par le panneau déplié du
// formulaire Lieu — même fonction, même ligne en base dans les deux cas.
export const create = async (data) => {
  return prisma.delegation.create({
    data: {
      pays: data.pays,
      flag_code: getCountryCode(data.pays),
      image_url: data.image_url,
      lieu: data.lieu,
      contacts: data.contacts,
    },
  })
}

// ── UPDATE ──────────────────────────────────────────────────────────────
export const update = async (id, data) => {
  return prisma.delegation.update({
    where: { id },
    data: {
      pays: data.pays,
      flag_code: getCountryCode(data.pays),
      image_url: data.image_url,
      lieu: data.lieu,
      contacts: data.contacts,
    },
  })
}