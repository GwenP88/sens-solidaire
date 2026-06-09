// src/routes/missions.js
// Définit les endpoints publics des missions
// Préfixe /api/missions ajouté dans app.js
// Toutes les routes sont publiques — aucun JWT requis
// Les visiteurs peuvent consulter les missions sans être connectés

// Router Express — permet de grouper des routes dans un fichier séparé
import { Router } from "express"

// Import des fonctions controller des missions
import {
  getMissions,      // gère GET / → liste toutes les missions (avec filtres optionnels)
  getMissionBySlug  // gère GET /:slug → détail d'une mission
} from "../controllers/missionController.js"

// Création du router Express
const router = Router()


// ── ROUTES PUBLIQUES ─────────────────────────────────────────────────────────
// Accessibles sans token — les missions sont visibles par tous les visiteurs

// GET /api/missions
// Query params optionnels : ?type=faune_sauvage&country=Kenya
// Retourne : tableau de toutes les missions actives (filtrées ou non)
router.get("/", getMissions)

// GET /api/missions/:slug
// Paramètre : slug — ex: /api/missions/volontariat-kenya-faune-sauvage
// Retourne : une mission complète avec pricing, location et témoignages
// Retourne 404 si le slug ne correspond à aucune mission
router.get("/:slug", getMissionBySlug)


// Export du router pour être branché dans app.js
export default router
