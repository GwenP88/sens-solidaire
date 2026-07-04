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
  // Supprime uniquement les médias du même type pour cette entité
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
    }))
  })
}