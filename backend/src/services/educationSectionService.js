// educationSectionService.js
// Logique métier — sections de la page Éducation & sensibilisation (tâche 172) : contenu, ordre, photos et boutons.

import prisma from '../config/db.js'
import { slugify } from '../utils/slugify.js'
import { toRattachement } from '../utils/rattachement.js'
import { syncGalleryImages, upsertMedia } from './mediaService.js'

// Type d'entité dans la table Media (polymorphe) : photos (file_type 'image') et boutons (file_type 'link')
const ENTITY_TYPE = 'education_section'

// Publics d'une section (cases à cocher du dashboard)
// ⚠️ Même liste que SECTION_AUDIENCE_OPTIONS (frontend/src/utils/filters.js)
export const SECTION_AUDIENCES = ['maternelle', 'elementaire', 'college', 'lycee', 'adultes']

// ── CHAMPS MODIFIABLES ────────────────────────────────────────────────────
// Liste explicite : rien d'autre que ces champs n'est lu dans req.body (pas d'assignation en masse).
// slug, display_order et is_active ont leurs propres règles (voir plus bas).
const pickFields = (data) => {
  const fields = allFields(data)
  // Modification partielle (PATCH) : un champ absent de la requête n'est pas vidé en base
  return Object.fromEntries(Object.entries(fields).filter(([key]) => key in data))
}

const allFields = (data) => ({
  eyebrow:      data.eyebrow || null,
  title:        data.title,
  content:      data.content,
  // Public : tableau de codes (cases à cocher) → texte « maternelle,college »
  audience:     (Array.isArray(data.audience) ? data.audience.join(',') : data.audience) || null,
  price_eur:    data.price_eur || null,
  price_chf:    data.price_chf || null,
  price_detail: data.price_detail || null,
  rattachement: toRattachement(data.rattachement),
})

// ── ADRESSE D'ANCRE UNIQUE ────────────────────────────────────────────────
// Générée depuis le titre à la création, jamais modifiée ensuite (un lien partagé vers #ancre reste valable).
const generateUniqueSlug = async (title) => {
  const base = slugify(title)
  let slug = base
  let suffix = 2
  while (await prisma.educationSection.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`
    suffix++
  }
  return slug
}

// ── PHOTOS ET BOUTONS D'UNE LISTE DE SECTIONS ─────────────────────────────
// Une seule requête pour toutes les sections (évite une requête par section).
const attachMedia = async (sections) => {
  const media = await prisma.media.findMany({
    where: { entity_type: ENTITY_TYPE, entity_id: { in: sections.map(s => s.id) } },
    orderBy: [{ display_order: 'asc' }, { created_at: 'asc' }],
  })
  return sections.map(section => {
    const own = media.filter(m => m.entity_id === section.id)
    return {
      ...section,
      images:  own.filter(m => m.file_type === 'image'),
      buttons: own.filter(m => m.file_type === 'link'),
    }
  })
}

// ── GET (PUBLIC) — sections visibles, dans l'ordre, avec leurs cards ──────
export const getAllEducationSections = async () => {
  const sections = await prisma.educationSection.findMany({
    where: { is_active: true },
    include: { items: { where: { is_active: true }, orderBy: { created_at: 'asc' } } },
    orderBy: [{ display_order: 'asc' }, { id: 'asc' }],
  })
  return attachMedia(sections)
}

// ── FIND ALL (ADMIN) — visibles + masquées ────────────────────────────────
export const findAllForAdmin = async () => {
  const sections = await prisma.educationSection.findMany({
    include: { items: { orderBy: { created_at: 'asc' } } },
    orderBy: [{ display_order: 'asc' }, { id: 'asc' }],
  })
  return attachMedia(sections)
}

// ── FIND BY ID (ADMIN) — pour le formulaire d'édition ─────────────────────
export const findById = async (id) => {
  const section = await prisma.educationSection.findUnique({
    where: { id },
    include: { items: { orderBy: { created_at: 'asc' } } },
  })
  if (!section) return null
  const [withMedia] = await attachMedia([section])
  return withMedia
}

// ── CREATE — placée en dernière position ──────────────────────────────────
// Ne gère PAS les photos ni les boutons : l'id est nécessaire en amont, voir updateMedia.
export const create = async (data) => {
  const last = await prisma.educationSection.aggregate({ _max: { display_order: true } })
  return prisma.educationSection.create({
    data: {
      ...pickFields(data),
      slug: await generateUniqueSlug(data.title),
      display_order: (last._max.display_order ?? -1) + 1,
    },
  })
}

// ── UPDATE — le slug n'est jamais modifié ─────────────────────────────────
export const update = async (id, data) => {
  return prisma.educationSection.update({
    where: { id },
    data: pickFields(data),
  })
}

// ── PHOTOS + BOUTONS ──────────────────────────────────────────────────────
// Photos : syncGalleryImages conserve celles déjà en base (même logique que les articles).
// Boutons : remplacés en bloc, l'ordre de la liste devient l'ordre d'affichage (display_order).
export const updateMedia = async (id, { images = [], buttons = [] }) => {
  await syncGalleryImages(ENTITY_TYPE, id, images, 'image')
  await upsertMedia(ENTITY_TYPE, id, 'link', buttons.map(b => ({ file_url: b.url, label: b.label })))
}

// ── ORDRE DES SECTIONS ────────────────────────────────────────────────────
// ids : liste complète des sections dans le nouvel ordre. Transaction : tout ou rien.
export const reorder = async (ids) => {
  return prisma.$transaction(
    ids.map((id, index) => prisma.educationSection.update({
      where: { id },
      data: { display_order: index },
    }))
  )
}

// ── VISIBLE / MASQUÉE ─────────────────────────────────────────────────────
export const toggleActive = async (id, is_active) => {
  return prisma.educationSection.update({
    where: { id },
    data: { is_active },
  })
}

// ── SUPPRESSION ───────────────────────────────────────────────────────────
// Media n'a pas de clé étrangère (table polymorphe) : ses lignes sont supprimées à la main.
// Les cards ne sont PAS supprimées : la base les détache (section_id → vide, ON DELETE SET NULL).
export const hardDelete = async (id) => {
  return prisma.$transaction([
    prisma.media.deleteMany({ where: { entity_type: ENTITY_TYPE, entity_id: id } }),
    prisma.educationSection.delete({ where: { id } }),
  ])
}
