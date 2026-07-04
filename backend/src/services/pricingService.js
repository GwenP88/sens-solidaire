// src/services/pricingService.js
// Gestion des tarifs liés à une mission (MissionPricing)
// Pattern : remplacement complet — deleteMany + createMany

import prisma from '../config/db.js'

// ── UPSERT PRICING ────────────────────────────────────────────
// Remplace toutes les lignes de tarif d'une mission.
// Paramètres :
//   missionId (number) — id de la mission parente
//   lines (array)      — [{ duration_label, price }]
// Retourne : les nouvelles lignes créées
export const upsertPricing = async (missionId, lines) => {
  // Supprime toutes les lignes existantes pour cette mission
  await prisma.missionPricing.deleteMany({
    where: { mission_id: missionId }
  })

  // Recrée les lignes avec display_order automatique
  const created = await prisma.missionPricing.createMany({
    data: lines.map((line, index) => ({
      mission_id:     missionId,
      duration_label: line.duration_label,
      price:          Number(line.price) || 0,
      display_order:  index + 1,
    }))
  })

  return created
}