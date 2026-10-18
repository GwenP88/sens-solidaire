// mediaPostService.js
// Logique métier — médias & actualités

import prisma from '../config/db.js'
import { slugify } from '../utils/slugify.js'

// ── OUTILS INTERNES ─────────────────────────────────────────────────────────

// '' → null (champ vidé par la cliente) ; undefined → undefined (champ non
// envoyé en PATCH : Prisma ne le touche pas)
const toNullable = (value) => (value === undefined ? undefined : (String(value).trim() || null))

// Adresse unique : "titre", puis "titre-2", "titre-3"... si déjà prise
const generateUniqueSlug = async (title) => {
  const base = slugify(title)
  let slug = base
  let suffix = 2
  while (await prisma.mediaPost.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`
    suffix++
  }
  return slug
}

// Réutilise l'orthographe d'un thème existant si la cliente tape le même
// avec une casse différente ("événement" → "Événement") — évite les doublons
const normalizeTheme = async (theme) => {
  const cleaned = String(theme).trim()
  const existing = await prisma.mediaPost.findFirst({
    where: { theme: { equals: cleaned, mode: 'insensitive' } },
    select: { theme: true },
  })
  return existing?.theme || cleaned
}

// ── GET (PUBLIC) ────────────────────────────────────────────────────────────
export const getAllMediaPosts = async () => {
  return prisma.mediaPost.findMany({
    where: { is_active: true },
    orderBy: { date: 'desc' },
  })
}

// Corrigé : un post en pause n'est plus accessible par son adresse
export const getMediaPostBySlug = async (slug) => {
  const post = await prisma.mediaPost.findFirst({
    where: { slug, is_active: true },
  })

  if (!post) return null

  // Médias attachés via table Media polymorphe
  const media = await prisma.media.findMany({
    where: { entity_type: 'media_post', entity_id: post.id },
    orderBy: { display_order: 'asc' },
  })

  return { ...post, media }
}

// Liste des thèmes déjà utilisés — suggestions du formulaire (et futurs filtres)
export const getThemes = async () => {
  const rows = await prisma.mediaPost.findMany({
    distinct: ['theme'],
    select: { theme: true },
    orderBy: { theme: 'asc' },
  })
  return rows.map(row => row.theme)
}

// ── FIND ALL FOR ADMIN ──────────────────────────────────────────────────────
export const findAllForAdmin = async () => {
  return prisma.mediaPost.findMany({
    orderBy: { date: 'desc' },
  })
}

// ── FIND BY ID (ADMIN) ──────────────────────────────────────────────────────
export const findById = async (id) => {
  return prisma.mediaPost.findUnique({ where: { id } })
}

// ── CREATE ──────────────────────────────────────────────────────────────────
export const create = async (data) => {
  return prisma.mediaPost.create({
    data: {
      slug: await generateUniqueSlug(data.title),
      title: data.title.trim(),
      theme: await normalizeTheme(data.theme),
      date: new Date(data.date),
      content: toNullable(data.content),
      image_url: toNullable(data.image_url),
      external_url: toNullable(data.external_url),
      show_homepage: Boolean(data.show_homepage),
    },
  })
}

// ── UPDATE ──────────────────────────────────────────────────────────────────
// Le slug n'est JAMAIS modifié : changer l'adresse casserait les liens
// déjà partagés (réseaux sociaux, newsletters...)
export const update = async (id, data) => {
  return prisma.mediaPost.update({
    where: { id },
    data: {
      title: data.title?.trim(),
      theme: data.theme !== undefined ? await normalizeTheme(data.theme) : undefined,
      date: data.date !== undefined ? new Date(data.date) : undefined,
      content: toNullable(data.content),
      image_url: toNullable(data.image_url),
      external_url: toNullable(data.external_url),
      show_homepage: data.show_homepage !== undefined ? Boolean(data.show_homepage) : undefined,
    },
  })
}

// ── TOGGLE ACTIVE — pause/reprise ───────────────────────────────────────────
export const toggleActive = async (id, is_active) => {
  return prisma.mediaPost.update({
    where: { id },
    data: { is_active },
  })
}

// ── HARD DELETE ─────────────────────────────────────────────────────────────
// Supprime aussi les médias liés : sans clé étrangère (table polymorphe),
// la base ne le ferait pas toute seule
export const hardDelete = async (id) => {
  return prisma.$transaction([
    prisma.media.deleteMany({ where: { entity_type: 'media_post', entity_id: id } }),
    prisma.mediaPost.delete({ where: { id } }),
  ])
}