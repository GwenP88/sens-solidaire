<<<<<<< HEAD
// testimonialController.js
// Contrôleur — témoignages

import { getValidatedTestimonials, submitTestimonial } from '../services/testimonialService.js'

// GET /api/testimonials — témoignages validés
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await getValidatedTestimonials()
    res.json(testimonials)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// POST /api/testimonials — soumission d'un témoignage
export const createTestimonial = async (req, res) => {
  try {
    const { author_name, content, mission_id, annee } = req.body

    if (!author_name || !content) {
      return res.status(400).json({ error: 'Nom et témoignage obligatoires' })
    }

    if (content.length > 280) {
      return res.status(400).json({ error: 'Témoignage limité à 280 caractères' })
    }

    if (!req.body.consent_given) {
      return res.status(400).json({ error: 'Consentement RGPD obligatoire' })
    }

    const testimonial = await submitTestimonial({ author_name, content, mission_id, annee })
    res.status(201).json(testimonial)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
=======
// src/controllers/testimonialController.js
// Couche controller des témoignages
// Rôle : extraire les données de la requête, VALIDER les entrées,
//        appeler le service, formater et renvoyer la réponse JSON
// Ne contient AUCUNE logique métier — tout est délégué à testimonialService.js

// Import des fonctions du service témoignages
import { findAllForAdmin, updateStatus } from "../services/testimonialService.js"

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

// ── APPROVE TESTIMONIAL (ADMIN) ───────────────────────────────────────────────
// PATCH /api/admin/testimonials/:id/approve
// Statut "approved" codé EN DUR → le client ne décide jamais de la valeur.
export const approveTestimonial = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    const testimonial = await updateStatus(id, "approved")

    return res.status(200).json({ success: true, testimonial })

  } catch (error) {
    next(error)
  }
}

// ── REJECT TESTIMONIAL (ADMIN) ────────────────────────────────────────────────
// PATCH /api/admin/testimonials/:id/reject
// Statut "rejected" en dur (+ le service retire le homepage).
export const rejectTestimonial = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    const testimonial = await updateStatus(id, "rejected")

    return res.status(200).json({ success: true, testimonial })

  } catch (error) {
    next(error)
  }
}
>>>>>>> dev-back
