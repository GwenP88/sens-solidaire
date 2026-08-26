// src/utils/jwt.js
// JWT generation/verification helpers, used by authService (issuing tokens)
// and authMiddleware (verifying them).
//
// Two-token design, deliberately asymmetric:
// - the ACCESS token is SHORT-LIVED (15 min by default). It travels in the
//   Authorization header of every request, so a leak (XSS, logs, a proxy)
//   only stays valid for a few minutes.
// - the REFRESH token is LONG-LIVED (7 days by default) but stays protected:
//   HttpOnly cookie (never readable by JS), hashed in the DB, rotated on use.
//   Its longevity is only safe *because* of those protections — if the
//   access token shared the same lifetime, rotation would protect nothing.

import jwt from "jsonwebtoken"

// Génère un access token — courte durée de vie (15 min par défaut)
// Contient : id et role de l'admin
export const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  )
}

// Génère un refresh token — longue durée de vie (7 jours par défaut)
// Contient uniquement l'id (moins d'infos = plus sûr)
export const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
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
