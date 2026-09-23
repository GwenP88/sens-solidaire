// locationService.js
// Logique métier — lieux partenaires

import prisma from '../config/db.js'

export const getLocationBySlugService = async (slug) => {
  const location = await prisma.location.findUnique({
    where: { slug },
    include: {
      missions: { select: { slug: true, title: true } },
      delegation: { select: { contacts: true, lieu: true, image_url: true } },
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

// ── FIND ALL (ADMIN) — tous les lieux, actifs ou non ──────────────────────
export const findAllForAdmin = async () => {
  return prisma.location.findMany({
    include: {
      delegation: true,
      missions: { select: { id: true, title: true, type: true } },
    },
    orderBy: { name: 'asc' },
  })
}

// ── FIND BY ID (ADMIN) — pour le formulaire d'édition ──────────────────────
export const findById = async (id) => {
  const location = await prisma.location.findUnique({
    where: { id },
    include: {
      delegation: true,
      missions: { select: { id: true, title: true, type: true } },
    },
  })
  if (!location) return null

  const gallery = await prisma.media.findMany({
    where: { entity_type: 'location', entity_id: id },
    orderBy: { display_order: 'asc' },
  })

  return { ...location, gallery }
}

// ── CREATE ──────────────────────────────────────────────────────────────
export const create = async (data) => {
  return prisma.location.create({
    data: {
      slug: data.slug,
      name: data.name,
      country: data.country,
      description: data.description,
      mission_ss: data.mission_ss || null,
      image_url: data.image_url || null,
      image_alt: data.image_alt || null,
      map_url: data.map_url || null,
      website_url: data.website_url || null,
      delegation_id: data.delegation_id || null,
      missions: data.mission_ids?.length
        ? { connect: data.mission_ids.map(id => ({ id })) }
        : undefined,
    },
  })
}

// ── UPDATE ──────────────────────────────────────────────────────────────
export const update = async (id, data) => {
  return prisma.location.update({
    where: { id },
    data: {
      name: data.name,
      country: data.country,
      description: data.description,
      mission_ss: data.mission_ss,
      image_url: data.image_url || null,
      image_alt: data.image_alt || null,
      map_url: data.map_url,
      website_url: data.website_url,
      delegation_id: data.delegation_id,
      missions: data.mission_ids
        ? { set: data.mission_ids.map(id => ({ id })) }
        : undefined,
    },
  })
}

// ── TOGGLE ACTIVE — pause/reprise, même principe que pour les missions ────
export const toggleActive = async (id, is_active) => {
  return prisma.location.update({ where: { id }, data: { is_active } })
}

// ── HARD DELETE — supprime aussi les médias, dans une transaction ─────────
export const hardDelete = async (id) => {
  return prisma.$transaction(async (tx) => {
    await tx.media.deleteMany({ where: { entity_type: 'location', entity_id: id } })
    return tx.location.delete({ where: { id } })
  })
}