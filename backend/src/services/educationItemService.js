// educationItemService.js
// Logique métier — cards de la page Éducation (ateliers…) : lecture publique et gestion depuis le dashboard (tâche 172A).

import prisma from '../config/db.js'
import { slugify } from '../utils/slugify.js'
import { deriveShortDescription } from '../utils/shortDescription.js'

// Longueur maximale du résumé affiché sur la carte (3 lignes environ)
export const CARD_SUMMARY_LENGTH = 200

// Type d'entité dans la table Media (polymorphe) — photos de la page détail d'une card
const ENTITY_TYPE = 'education_item'

// Codes de public acceptés (copie de FILTERS_EDUCATION_PUBLIC, frontend/src/utils/filters.js)
export const EDUCATION_PUBLICS = ['primaire', 'college_lycee', 'adultes']

// ── CHAMPS MODIFIABLES ────────────────────────────────────────────────────
// Liste explicite (pas d'assignation en masse). PATCH : un champ absent n'est pas vidé en base.
// Texte unique (comme les missions et les articles) : content garde le repère « --- » saisi par la cliente,
// description (le résumé de la carte) en est déduite — jamais envoyée par le formulaire.
const pickFields = (data) => {
  const fields = {
    title:        data.title?.trim(),
    content:      data.content?.trim(),
    type:         data.type?.trim(),
    public:       Array.isArray(data.public) ? data.public.join(',') : data.public,
    image_url:    data.image_url || null,
    external_url: data.external_url || null,
    section_id:   data.section_id ? Number(data.section_id) : null,
  }
  const picked = Object.fromEntries(Object.entries(fields).filter(([key]) => key in data))
  if ('content' in picked) {
    picked.description = deriveShortDescription(picked.content, CARD_SUMMARY_LENGTH).shortDescription
  }
  return picked
}

// Site public : le repère « --- » ne doit jamais apparaître sur la page détail
const withCleanContent = (item) => ({
  ...item,
  content: item.content ? deriveShortDescription(item.content, CARD_SUMMARY_LENGTH).cleanedFullText : item.content,
})

// ── ADRESSE DE PAGE UNIQUE — générée depuis le titre, jamais modifiée ─────
const generateUniqueSlug = async (title) => {
  const base = slugify(title)
  let slug = base
  let suffix = 2
  while (await prisma.educationItem.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`
    suffix++
  }
  return slug
}

// ── GET (PUBLIC) — liste ──────────────────────────────────────────────────
export const getAllEducationItems = async () => {
  const items = await prisma.educationItem.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'asc' },
  })
  return items.map(withCleanContent)
}

// ── GET (PUBLIC) — détail par slug ────────────────────────────────────────
// findFirst + is_active : une card masquée n'est plus accessible par son adresse (même règle que les articles)
export const getEducationItemBySlug = async (slug) => {
  const item = await prisma.educationItem.findFirst({
    where: { slug, is_active: true },
  })

  if (!item) return null

  const media = await prisma.media.findMany({
    where: { entity_type: ENTITY_TYPE, entity_id: item.id },
    orderBy: { display_order: 'asc' },
  })

  return { ...withCleanContent(item), media }
}

// ── FIND ALL (ADMIN) — visibles + masquées, avec le titre de leur section ─
export const findAllForAdmin = async () => {
  return prisma.educationItem.findMany({
    include: { section: { select: { id: true, title: true } } },
    orderBy: { created_at: 'asc' },
  })
}

// ── FIND BY ID (ADMIN) ────────────────────────────────────────────────────
export const findById = async (id) => {
  return prisma.educationItem.findUnique({ where: { id } })
}

// ── LA SECTION EXISTE-T-ELLE ? (contrôle avant d'y rattacher une card) ────
export const sectionExists = async (id) => {
  return Boolean(await prisma.educationSection.findUnique({ where: { id }, select: { id: true } }))
}

// ── CREATE ────────────────────────────────────────────────────────────────
export const create = async (data) => {
  return prisma.educationItem.create({
    data: {
      ...pickFields(data),
      slug: await generateUniqueSlug(data.title),
    },
  })
}

// ── UPDATE — le slug n'est jamais modifié ─────────────────────────────────
export const update = async (id, data) => {
  return prisma.educationItem.update({
    where: { id },
    data: pickFields(data),
  })
}

// ── VISIBLE / MASQUÉE ─────────────────────────────────────────────────────
export const toggleActive = async (id, is_active) => {
  return prisma.educationItem.update({
    where: { id },
    data: { is_active },
  })
}

// ── SUPPRESSION — avec ses photos (Media n'a pas de clé étrangère) ────────
export const hardDelete = async (id) => {
  return prisma.$transaction([
    prisma.media.deleteMany({ where: { entity_type: ENTITY_TYPE, entity_id: id } }),
    prisma.educationItem.delete({ where: { id } }),
  ])
}
