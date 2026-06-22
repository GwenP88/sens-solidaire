// src/controllers/testimonialController.js
// Couche controller des témoignages
// Rôle : extraire les données de la requête, VALIDER les entrées,
//        appeler le service, formater et renvoyer la réponse JSON
// Ne contient AUCUNE logique métier — tout est délégué à testimonialService.js

// Import des fonctions du service témoignages
import { findAllForAdmin } from "../services/testimonialService.js"

// ── CONSTANTES DE VALIDATION ──────────────────────────────────────────────────
// Whitelist des statuts autorisés — mêmes valeurs que la doc BDD.
// Toute valeur hors de cette liste = entrée client suspecte → 400.
// On ne fait JAMAIS confiance à un paramètre venu du client.
const VALID_STATUSES = ["pending", "approved", "rejected"]


// ── GET ALL TESTIMONIALS (ADMIN) ──────────────────────────────────────────────
// GET /api/admin/testimonials
// Route PROTÉGÉE : montée derrière authMiddleware (token valide).
// Query param optionnel : ?status=pending
// Exemples :
//   /api/admin/testimonials                  → tous les témoignages (tous statuts)
//   /api/admin/testimonials?status=pending   → uniquement la file de modération
export const getTestimonials = async (req, res, next) => {
  try {
    const { status } = req.query

    // ── Validation du paramètre "status" ──
    // Optionnel : on ne valide que s'il est fourni.
    // S'il est fourni mais hors whitelist → 400 Bad Request.
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: true,
          message: `Statut invalide. Valeurs acceptées : ${VALID_STATUSES.join(", ")}`,
        })
      }
    }

    // Construit l'objet filtres après validation.
    // status est soit une valeur propre de la whitelist, soit undefined
    // (→ ignoré par le service, qui renverra alors tous les témoignages).
    const filters = {
      status, // undefined si non fourni → le service ne filtre pas
    }

    // Délègue la récupération au service
    const testimonials = await findAllForAdmin(filters)

    // Retourne la liste en JSON — même format que missionController
    return res.status(200).json({
      success: true,
      testimonials,
    })

  } catch (error) {
    next(error)
  }
}
