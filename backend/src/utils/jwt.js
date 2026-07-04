// src/utils/jwt.js
// Helpers pour la génération et la vérification des tokens JWT
// Utilisé par authService (génération) et authMiddleware (vérification)

import jwt from "jsonwebtoken"

// Génère un access token — valide 15 minutes
// Contient : id et role de l'admin
export const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

// Génère un refresh token — valide 7 jours
// Contient uniquement l'id (moins d'infos = plus sûr)
export const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  )
}

// Vérifie et décode un access token
// Retourne le payload décodé si valide, lève une erreur sinon
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

// Vérifie et décode un refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}
