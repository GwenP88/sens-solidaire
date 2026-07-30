// src/routes/adminMissionRoutes.js
// Routeur des routes ADMIN missions (écriture : create / update / delete)
// ⚠️ TOUTES les routes de ce fichier sont protégées par authMiddleware.
//    Le public ne passe JAMAIS par ici — lui utilise missionRoutes (lecture).

import { Router } from "express"
import  authMiddleware  from "../middlewares/authMiddleware.js"
import { createMission, updateMission, deleteMission, hardDeleteMission, getMissionsForAdmin, getMissionById } from "../controllers/missionController.js"
import { updateMissionPricing } from '../controllers/pricingController.js'
import { updateMissionMedia } from '../controllers/mediaController.js'

const router = Router()

// Le middleware s'applique à TOUT le routeur d'un coup.
// → impossible d'oublier de protéger une route : la porte est gardée en amont.
router.use(authMiddleware)

// GET /api/admin/missions → liste complète (admin)
router.get("/", getMissionsForAdmin)

// POST /api/admin/missions  → créer une mission
router.post("/", createMission)

router.patch("/:id", updateMission)

router.delete("/:id", deleteMission)
router.delete("/:id/permanent", hardDeleteMission)

// GET /api/admin/missions/:id → une mission pour le formulaire d'édition
router.get("/:id", getMissionById)

// PUT /api/admin/missions/:id/pricing → remplace tous les tarifs
router.put("/:id/pricing", updateMissionPricing)

// PUT /api/admin/missions/:id/media → remplace images et PDF de la mission
router.put("/:id/media", updateMissionMedia)

export default router