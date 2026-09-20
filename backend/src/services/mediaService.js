// src/services/mediaService.js
// Gestion des médias liés à une entité (mission, location, field_action...)
// Pattern : remplacement complet par type — deleteMany + createMany

import prisma from '../config/db.js'

// ── UPSERT MEDIA ──────────────────────────────────────────────
// Remplace tous les médias d'un type donné pour une entité.
// Paramètres :
//   entityType (string) — ex: 'mission'
//   entityId   (number) — id de l'entité parente
//   fileType   (string) — 'image' | 'pdf'
//   urls       (array)  — [{ file_url, label? }]
export const upsertMedia = async (entityType, entityId, fileType, urls) => {
  await prisma.media.deleteMany({
    where: { entity_type: entityType, entity_id: entityId, file_type: fileType }
  })

  if (urls.length === 0) return

  await prisma.media.createMany({
    data: urls.map((item, index) => ({
      entity_type:   entityType,
      entity_id:     entityId,
      file_url:      item.file_url,
      file_type:     fileType,
      label:         item.label || null,
      display_order: index + 1,
      force_display: item.force_display || false,
    }))
  })
}

// ── SYNC GALLERY IMAGES ─────────────────────────────────────────────────────
// Contrairement à upsertMedia (tout supprimer/recréer), celle-ci PRÉSERVE les
// photos déjà en base — indispensable pour que le tri "les plus récentes"
// garde un sens dans le temps. Les photos déjà présentes gardent leur
// created_at d'origine ; seules les nouvelles sont créées, seules celles
// retirées sont supprimées.
export const syncGalleryImages = async (entityType, entityId, items) => {
  const existing = await prisma.media.findMany({
    where: { entity_type: entityType, entity_id: entityId, file_type: 'image' },
  })

  const incomingUrls = new Set(items.map(i => i.file_url))
  const existingByUrl = new Map(existing.map(m => [m.file_url, m]))

  // Supprime celles qui ne sont plus dans la liste envoyée
  const toDelete = existing.filter(m => !incomingUrls.has(m.file_url))
  if (toDelete.length > 0) {
    await prisma.media.deleteMany({ where: { id: { in: toDelete.map(m => m.id) } } })
  }

  // Met à jour celles qui existent déjà (label, force_display — jamais created_at)
  // et crée celles qui sont vraiment nouvelles
  for (const item of items) {
    const match = existingByUrl.get(item.file_url)
    if (match) {
      await prisma.media.update({
        where: { id: match.id },
        data: {
          label: item.label || null,
          force_display: item.force_display || false,
        },
      })
    } else {
      await prisma.media.create({
        data: {
          entity_type: entityType,
          entity_id: entityId,
          file_url: item.file_url,
          file_type: 'image',
          label: item.label || null,
          force_display: item.force_display || false,
          display_order: 0, // plus utilisé pour le tri galerie — voir created_at
        },
      })
    }
  }
}