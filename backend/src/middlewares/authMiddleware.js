// src/middlewares/authMiddleware.js
// Middleware de protection des routes admin
// S'exécute AVANT le controller sur toutes les routes /api/admin/*
// Vérifie la validité du JWT et attache les infos admin à req.user

// Import de la fonction de vérification du token depuis utils/jwt.js
import { verifyAccessToken } from "../utils/jwt.js"

// ── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
// Paramètres Express standard :
// req  → la requête entrante
// res  → la réponse à envoyer
// next → fonction pour passer au middleware/controller suivant
const authMiddleware = (req, res, next) => {
  try {
    // Lit le header Authorization de la requête
    // Format attendu : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers.authorization

    // Si le header est absent → pas de token → non autorisé
    if (!authHeader) {
      return res.status(401).json({
        error: true,
        message: "Token manquant"
      })
    }

    // Le header a le format "Bearer <token>"
    // split(" ") découpe en ["Bearer", "<token>"]
    // [1] récupère uniquement le token
    const token = authHeader.split(" ")[1]

    // Si le format est incorrect (pas de "Bearer " devant)
    // token sera undefined → on refuse
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Format du token invalide — attendu : Bearer <token>"
      })
    }

    // Vérifie la signature cryptographique du token avec JWT_SECRET
    // Si le token est expiré, falsifié ou invalide → lance une erreur
    // Si valide → retourne le payload { id, role, iat, exp }
    const payload = verifyAccessToken(token)

    // Attache les infos de l'admin au contexte de la requête
    // req.user sera accessible dans tous les controllers qui suivent
    // Ex : req.user.id → utilisé dans logoutAdmin pour révoquer la session
    req.user = {
      id: payload.id,
      role: payload.role
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: true, message: "Accès refusé" })
    }

    // Token valide → on laisse passer la requête vers le controller
    next()

  } catch (error) {
    // jwt.verify a lancé une erreur → token expiré ou invalide
    // On renvoie 401 avec un message générique
    // On ne précise pas POURQUOI le token est invalide (sécurité)
    return res.status(401).json({
      error: true,
      message: "Token invalide ou expiré"
    })
  }
}

export default authMiddleware
