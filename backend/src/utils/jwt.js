// src/utils/jwt.js
// Fonctions utilitaires pour générer et vérifier les tokens JWT.
// L'application utilise :
// - un access token de courte durée pour accéder aux routes protégées ;
// - un refresh token de plus longue durée pour renouveler l'access token.

import jwt from "jsonwebtoken"

// Génère un access token pour l'administrateur.
// Contient son identifiant et son rôle.
// Utilise le secret JWT dédié aux access tokens.
// Durée de vie : 15 minutes par défaut.
export const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  )
}

// Génère un refresh token pour l'administrateur.
// Contient uniquement son identifiant.
// Utilise un secret différent de celui de l'access token.
// Durée de vie : 7 jours par défaut.
export const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  )
}

// Vérifie la validité d'un access token avec le secret correspondant.
// Retourne les données du token s'il est valide.
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

// Vérifie la validité d'un refresh token avec le secret correspondant.
// Retourne les données du token s'il est valide.
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}