// testimonialController.js
// Couche controller des témoignages
// Rôle : extraire les données de la requête, VALIDER les entrées,
//        appeler le service, formater et renvoyer la réponse JSON
// Ne contient AUCUNE logique métier — tout est délégué à testimonialService.js

import {
  getValidatedTestimonials,  // public — liste des témoignages validés
  submitTestimonial,         // public — soumission d'un témoignage
  findAllForAdmin,           // admin  — liste complète (modération)
  updateStatus,              // admin  — approve / reject
  remove,                    // admin  — hard delete RGPD
} from "../services/testimonialService.js"

// ── CONSTANTES DE VALIDATION ──────────────────────────────────────────────────
// Whitelist des statuts autorisés — mêmes valeurs que la doc BDD.
// Toute valeur hors de cette liste = entrée client suspecte → 400.
const VALID_STATUSES = ['pending', 'approved', 'rejected']


// ── GET PUBLIC TESTIMONIALS ───────────────────────────────────────────────────
// GET /api/testimonials — témoignages validés (côté visiteur)
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await getValidatedTestimonials()
    res.json(testimonials)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

// ── CREATE TESTIMONIAL ────────────────────────────────────────────────────────
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


// ── GET ALL TESTIMONIALS (ADMIN) ──────────────────────────────────────────────
// GET /api/admin/testimonials
// Route PROTÉGÉE : montée derrière authMiddleware (token valide).
// Query param optionnel : ?status=pending
//   /api/admin/testimonials                  → tous les témoignages (tous statuts)
//   /api/admin/testimonials?status=pending   → uniquement la file de modération
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const { status } = req.query

    // Validation du paramètre "status" — optionnel, validé seulement s'il est fourni
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: true,
          message: `Statut invalide. Valeurs acceptées : ${VALID_STATUSES.join(', ')}`,
        })
      }
    }

    const filters = {
      status, // undefined si non fourni → le service ne filtre pas
    }

    const testimonials = await findAllForAdmin(filters)

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
export const approveTestimonial = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: 'Id invalide' })
    }

    const testimonial = await updateStatus(id, 'approved')

    return res.status(200).json({ success: true, testimonial })
  } catch (error) {
    next(error)
  }
}

// ── REJECT TESTIMONIAL (ADMIN) ────────────────────────────────────────────────
// PATCH /api/admin/testimonials/:id/reject
export const rejectTestimonial = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: 'Id invalide' })
    }

    const testimonial = await updateStatus(id, 'rejected')

    return res.status(200).json({ success: true, testimonial })
  } catch (error) {
    next(error)
  }
}

// ── DELETE TESTIMONIAL (ADMIN — RGPD) ─────────────────────────────────────────
// DELETE /api/admin/testimonials/:id
// HARD DELETE : effacement définitif (droit à l'oubli RGPD).
// Route PROTÉGÉE (authMiddleware).
export const deleteTestimonial = async (req, res, next) => {
  try {
    // 1. Valider l'id depuis l'URL (même logique que deleteMission)
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: true, message: "Id invalide" })
    }

    // 2. Suppression via le service (lève 404 si l'id n'existe pas)
    const testimonial = await remove(id)

    // 3. Réponse 200 + confirmation
    return res.status(200).json({
      success: true,
      message: "Témoignage supprimé définitivement",
      testimonial,
    })

  } catch (error) {
    next(error)   // attrape le 404 (P2025) renvoyé par le service
  }
}