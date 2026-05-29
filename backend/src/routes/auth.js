// src/routes/auth.js
// Définit les endpoints d'authentification admin
// Préfixe /api/auth ajouté dans app.js
// Routes publiques  : login, refresh
// Routes protégées  : logout, verify (nécessitent un JWT valide)

// Router Express — permet de grouper des routes dans un fichier séparé
import { Router } from "express"

// Import des fonctions controller de l'authentification
import {
  loginAdmin,    // gère POST /login
  logoutAdmin,   // gère POST /logout
  refreshToken,  // gère POST /refresh
  verifyToken    // gère GET  /verify
} from "../controllers/authController.js"

// Import du middleware qui vérifie le JWT
// Utilisé uniquement sur les routes protégées
import authMiddleware from "../middlewares/authMiddleware.js"

// Création du router Express
const router = Router()


// ── ROUTES PUBLIQUES ─────────────────────────────────────────────────────────
// Accessibles sans token — l'admin n'est pas encore connecté

// POST /api/auth/login
// Corps : { email, password }
// Retourne : { accessToken } + cookie refreshToken
router.post("/login", loginAdmin)

// POST /api/auth/refresh
// Lit le cookie refreshToken automatiquement
// Retourne : nouveau { accessToken } + nouveau cookie refreshToken
router.post("/refresh", refreshToken)


// ── ROUTES PROTÉGÉES ─────────────────────────────────────────────────────────
// authMiddleware s'exécute EN PREMIER avant le controller
// Si token invalide → authMiddleware bloque et renvoie 401
// Si token valide   → authMiddleware appelle next() → controller s'exécute

// POST /api/auth/logout
// Révoque la session en base + supprime le cookie
router.post("/logout", authMiddleware, logoutAdmin)

// GET /api/auth/verify
// Vérifie que l'access token est encore valide
// Utilisé par le frontend au chargement de la page dashboard
router.get("/verify", authMiddleware, verifyToken)


// Export du router pour être branché dans app.js
export default router
