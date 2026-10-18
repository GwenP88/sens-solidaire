// mediaPostService.js
// Logique métier — médias & actualités

import prisma from '../config/db.js'
import { slugify } from '../utils/slugify.js'
import { deriveShortDescription } from '../utils/shortDescription.js'

// Résumé affiché sur les cartes (4 lignes ≈ 200 caractères)
const CARD_SUMMARY_LENGTH = 200

// Ajoute le résumé calculé, sans le stocker en base
const withSummary = (post) => ({
  ...post,
  short_description: deriveShortDescription(post.content || '', CARD_SUMMARY_LENGTH).shortDescription,
})

// Découpe le texte en chapô (= résumé de la carte) + suite de l'article
const CUT_MARKER = '---'
const splitLead = (content) => {
  if (!content) return { lead: null, body: null }

  const markerIndex = content.indexOf(CUT_MARKER)
  if (markerIndex !== -1) {
    return {
      lead: content.slice(0, markerIndex).trim() || null,
      body: content.slice(markerIndex + CUT_MARKER.length).trim() || null,
    }
  }

  // Sans repère : le résumé auto est le début exact du texte, sauf s'il a été coupé (« … »)
  const { shortDescription } = deriveShortDescription(content, CARD_SUMMARY_LENGTH)
  if (shortDescription && !shortDescription.endsWith('…') && content.startsWith(shortDescription)) {
    return { lead: shortDescription, body: content.slice(shortDescription.length).trim() || null }
  }
  return { lead: null, body: content }
}

// ── OUTILS INTERNES ─────────────────────────────────────────────────────────

// '' → null (champ vidé par la cliente) ; undefined → undefined (champ non
// envoyé en PATCH : Prisma ne le touche pas)
const toNullable = (value) => {
  if (value === undefined) return undefined   // champ non envoyé (PATCH) : on n'y touche pas
  if (value === null) return null             // champ vidé
  return String(value).trim() || null         // '' ou espaces → null
}

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
  const posts = await prisma.mediaPost.findMany({
    where: { is_active: true },
    orderBy: { date: 'desc' },
  })
  return posts.map(withSummary)
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

  // Le marqueur --- ne sert qu'à couper le résumé : on le retire de l'article
  const { lead, body } = splitLead(post.content)
  return { ...post, lead, content: body, media }
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
  const post = await prisma.mediaPost.findUnique({ where: { id } })
  if (!post) return null

  // Photos de l'article — pour pré-remplir le formulaire
  const images = await prisma.media.findMany({
    where: { entity_type: 'media_post', entity_id: id, file_type: 'image' },
    orderBy: { display_order: 'asc' },
  })
  return { ...post, images }
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