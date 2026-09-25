// fieldActionService.js
// Logique métier — actions terrain

import prisma from '../config/db.js'
import { deriveTagsFromOdds } from '../utils/odds.js'

// ── GET (PUBLIC) — liste ─────────────────────────────────────────────────
export const getAllFieldActions = async (country = null) => {
  const where = { is_active: true }
  if (country) where.countries = { some: { country: { contains: country } } }

  return await prisma.fieldAction.findMany({
    where,
    include: {
      tags: true,
      odds: { orderBy: { odd_number: 'asc' } },
      countries: true,
    },
    orderBy: { created_at: 'desc' },
  })
}

// ── GET (PUBLIC) — détail par slug ───────────────────────────────────────
export const getFieldActionBySlugService = async (slug) => {
  const action = await prisma.fieldAction.findUnique({
    where: { slug },
    include: {
      tags: true,
      odds: { orderBy: { odd_number: 'asc' } },
      countries: true,
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

// ── FIND ALL FOR ADMIN — actives + inactives ─────────────────────────────
export const findAllForAdmin = async () => {
  return prisma.fieldAction.findMany({
    include: {
      tags: true,
      odds: { orderBy: { odd_number: 'asc' } },
      countries: true,
    },
    orderBy: { created_at: 'desc' },
  })
}

// ── FIND BY ID (ADMIN) — pour le formulaire d'édition ────────────────────
export const findById = async (id) => {
  const action = await prisma.fieldAction.findUnique({
    where: { id },
    include: {
      tags: true,
      odds: { orderBy: { odd_number: 'asc' } },
      countries: true,
    },
  })

  if (!action) return null

  const gallery = await prisma.media.findMany({
    where: { entity_type: 'field_action', entity_id: action.id },
    orderBy: { display_order: 'asc' },
  })

  return { ...action, gallery }
}

// ── CREATE ────────────────────────────────────────────────────────────────
// Ne gère PAS la galerie — l'id est nécessaire en amont, voir updateGallery.
export const create = async (data) => {
  const tags = deriveTagsFromOdds(data.odds || [])

  return prisma.fieldAction.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      image_url: data.image_url || null,
      tags:      { create: tags.map(tag => ({ tag })) },
      odds:      { create: (data.odds || []).map(n => ({ odd_number: n })) },
      countries: { create: (data.countries || []).map(c => ({ country: c })) },
    },
  })
}

// ── UPDATE ──────────────────────────────────────────────────────────────
// tags/odds/countries : on efface tout puis on recrée — plus simple et fiable
// qu'un diff ligne à ligne, ces tables n'ont pas de sens hors de l'action.
export const update = async (id, data) => {
  const tags = deriveTagsFromOdds(data.odds || [])

  return prisma.fieldAction.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      image_url: data.image_url,
      tags: {
        deleteMany: {},
        create: tags.map(tag => ({ tag })),
      },
      odds: {
        deleteMany: {},
        create: (data.odds || []).map(n => ({ odd_number: n })),
      },
      countries: {
        deleteMany: {},
        create: (data.countries || []).map(c => ({ country: c })),
      },
    },
  })
}

// ── UPDATE GALLERY — même principe que Location/Mission ─────────────────
export const updateGallery = async (id, images) => {
  await prisma.media.deleteMany({ where: { entity_type: 'field_action', entity_id: id } })
  if (images.length === 0) return
  await prisma.media.createMany({
    data: images.map((img, i) => ({
      entity_type: 'field_action',
      entity_id: id,
      file_url: img.file_url,
      file_type: 'image',
      label: img.label || null,
      display_order: i,
    })),
  })
}

// ── TOGGLE ACTIVE — pause/reprise ───────────────────────────────────────
export const toggleActive = async (id, is_active) => {
  return prisma.fieldAction.update({
    where: { id },
    data: { is_active },
  })
}

// ── HARD DELETE — nettoyage dans l'ordre des contraintes FK ─────────────
export const hardDelete = async (id) => {
  await prisma.fieldActionTag.deleteMany({ where: { action_id: id } })
  await prisma.fieldActionODD.deleteMany({ where: { action_id: id } })
  await prisma.fieldActionCountry.deleteMany({ where: { action_id: id } })
  await prisma.media.deleteMany({ where: { entity_type: 'field_action', entity_id: id } })
  return prisma.fieldAction.delete({ where: { id } })
}