// src/routes/adminTestimonialRoutes.js
// Routeur des routes ADMIN témoignages (modération).
// ⚠️ TOUTES les routes de ce fichier sont protégées par authMiddleware.
//    Le public ne passe JAMAIS par ici.
//    (La soumission publique d'un témoignage, elle, passera par un futur
//     testimonialRoutes.js — POST /api/testimonials — pas par ce fichier.)

import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware.js"

import { getTestimonials, approveTestimonial, rejectTestimonial, } from "../controllers/testimonialController.js"

const router = Router()

// Le middleware s'applique à TOUT le routeur d'un coup — même pattern que
// adminMissionRoutes : la porte est gardée en amont, aucune route ne peut
// être exposée par oubli.
router.use(authMiddleware)

// GET /api/admin/testimonials
// Query param optionnel : ?status=pending
// Retourne la liste des témoignages (tous statuts, ou filtrés).
router.get("/", getTestimonials)

// PATCH /api/admin/testimonials/:id/approve  → passe le statut à "approved"
router.patch("/:id/approve", approveTestimonial)

// PATCH /api/admin/testimonials/:id/reject   → passe le statut à "rejected" (+ retire homepage)
router.patch("/:id/reject", rejectTestimonial)

export default router
