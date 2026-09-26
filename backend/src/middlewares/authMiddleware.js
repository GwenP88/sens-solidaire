// src/middlewares/authMiddleware.js
// Middleware de protection des routes administrateur.
// Vérifie l'access token puis contrôle que l'utilisateur possède le rôle "admin".

import { verifyAccessToken } from "../utils/jwt.js"

const authMiddleware = (req, res, next) => {
  try {
    // Récupère le header Authorization de la requête.
    // Format attendu : "Bearer <token>"
    const authHeader = req.headers.authorization

    // Refuse la requête si le header Authorization est absent.
    if (!authHeader) {
      return res.status(401).json({
        error: true,
        message: "Token manquant"
      })
    }

    // Sépare "Bearer" du token et récupère uniquement le token.
    const token = authHeader.split(" ")[1]

    // Refuse la requête si le token est absent ou mal formaté.
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Format du token invalide — attendu : Bearer <token>"
      })
    }

    // Vérifie la validité de l'access token.
    // Si le token est valide, récupère les données qu'il contient.
    const payload = verifyAccessToken(token)

    // Ajoute l'identifiant et le rôle de l'utilisateur à la requête.
    // Ces informations restent accessibles pour la suite du traitement.
    req.user = {
      id: payload.id,
      role: payload.role
    }

    // Refuse l'accès si l'utilisateur authentifié n'a pas le rôle "admin".
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: true,
        message: "Accès refusé"
      })
    }

    // L'utilisateur est authentifié et autorisé.
    // Passe au middleware ou au contrôleur suivant.
    next()

  } catch (error) {
    // Refuse la requête si le token est invalide ou expiré.
    return res.status(401).json({
      error: true,
      message: "Token invalide ou expiré"
    })
  }
}

export default authMiddleware