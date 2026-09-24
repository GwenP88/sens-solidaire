// src/routes/adminTestimonialRoutes.js
// Routeur des routes ADMIN témoignages (modération).
// ⚠️ TOUTES les routes de ce fichier sont protégées par authMiddleware.
//    Le public ne passe JAMAIS par ici.
//    (La soumission publique d'un témoignage, elle, passera par un futur
//     testimonialRoutes.js — POST /api/testimonials — pas par ce fichier.)

import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware.js"

import { getAdminTestimonials, approveTestimonial, rejectTestimonial, updateTestimonial, createAdminTestimonial, deleteTestimonial } from "../controllers/testimonialController.js"

const router = Router()

// Le middleware s'applique à TOUT le routeur d'un coup — même pattern que
// adminMissionRoutes : la porte est gardée en amont, aucune route ne peut
// être exposée par oubli.
router.use(authMiddleware)

// GET /api/admin/testimonials
// Query params optionnels : ?status=pending&type=individuel&country=Kenya&limit=10&offset=0
// Retourne la liste des témoignages (filtrée/paginée) + le total.
router.get("/", getAdminTestimonials)

// POST /api/admin/testimonials
// Création directe par la cliente — publié immédiatement (statut "approved").
router.post("/", createAdminTestimonial)

// PATCH /api/admin/testimonials/:id/approve  → passe le statut à "approved"
router.patch("/:id/approve", approveTestimonial)

// PATCH /api/admin/testimonials/:id/reject   → passe le statut à "rejected" (+ retire homepage)
router.patch("/:id/reject", rejectTestimonial)

// PATCH /api/admin/testimonials/:id
// Modifie un témoignage existant (n'importe quel statut) — notamment mission_id.
router.patch("/:id", updateTestimonial)

// DELETE /api/admin/testimonials/:id
// HARD DELETE — effacement définitif (droit à l'oubli RGPD art. 17).
// ⚠️ Irréversible : la ligne disparaît vraiment de la base (≠ soft delete missions).
router.delete("/:id", deleteTestimonial)

export default router