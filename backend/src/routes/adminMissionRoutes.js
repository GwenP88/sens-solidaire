// src/routes/adminMissionRoutes.js
// Routeur des routes ADMIN missions (écriture : create / update / delete)
// ⚠️ TOUTES les routes de ce fichier sont protégées par authMiddleware.
//    Le public ne passe JAMAIS par ici — lui utilise missionRoutes (lecture).

import { Router } from "express"
import  authMiddleware  from "../middlewares/authMiddleware.js"

import { createMission, updateMission, deleteMission } from "../controllers/missionController.js"

const router = Router()

// Le middleware s'applique à TOUT le routeur d'un coup.
// → impossible d'oublier de protéger une route : la porte est gardée en amont.
router.use(authMiddleware)

// POST /api/admin/missions  → créer une mission
router.post("/", createMission)

router.patch("/:id", updateMission)

router.delete("/:id", deleteMission)

export default router