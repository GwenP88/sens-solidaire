// src/controllers/authController.js
// Couche controller de l'authentification admin
// Rôle : extraire les données de la requête, appeler le service,
//        formater et renvoyer la réponse JSON
// Ne contient AUCUNE logique métier — tout est délégué à authService.js

// Import des fonctions du service d'authentification
import { login, logout, refresh } from "../services/authService.js"


// ── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Corps attendu : { email: string, password: string }
export const loginAdmin = async (req, res, next) => {
  try {
    // Extrait email et password du corps de la requête
    const { email, password } = req.body

    // Vérifie que les deux champs sont présents
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email et mot de passe requis"
      })
    }

    // Délègue la vérification des credentials au service
    // Le service retourne { accessToken, refreshToken } ou lance une erreur
    const { accessToken, refreshToken } = await login(email, password)

    // Stocke le refresh token dans un cookie HTTP-Only
    // HTTP-Only : JavaScript ne peut jamais lire ce cookie → protège contre XSS
    // Secure : cookie envoyé uniquement en HTTPS (activé en production)
    // SameSite Strict : protège contre CSRF
    // maxAge : 7 jours en millisecondes
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Retourne l'access token dans le body
    // On ne retourne JAMAIS le refresh token dans le body
    return res.status(200).json({
      success: true,
      accessToken
    })

  } catch (error) {
    // Passe l'erreur au errorMiddleware
    next(error)
  }
}


// ── LOGOUT ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// Protégé par authMiddleware → req.user est disponible
export const logoutAdmin = async (req, res, next) => {
  try {
    // req.user.id injecté par authMiddleware après vérification du JWT
    await logout(req.user.id)

    // Supprime le cookie refresh token côté navigateur
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })

    return res.status(200).json({
      success: true,
      message: "Déconnexion réussie"
    })

  } catch (error) {
    next(error)
  }
}


// ── REFRESH ──────────────────────────────────────────────────────────────────
// POST /api/auth/refresh
// Lit le refresh token depuis le cookie HTTP-Only
export const refreshToken = async (req, res, next) => {
  try {
    // Lit le refresh token depuis le cookie HTTP-Only
    const token = req.cookies.refreshToken

    // Si pas de cookie → non connecté
    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Refresh token manquant"
      })
    }

    // Délègue au service — retourne les nouveaux tokens
    const { accessToken, refreshToken: newRefreshToken } = await refresh(token)

    // Remplace l'ancien cookie par le nouveau refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      success: true,
      accessToken
    })

  } catch (error) {
    next(error)
  }
}


// ── VERIFY ───────────────────────────────────────────────────────────────────
// GET /api/auth/verify
// Protégé par authMiddleware → si on arrive ici, le token est valide
export const verifyToken = async (req, res) => {
  // Token valide → retourne les infos admin extraites du token par authMiddleware
  return res.status(200).json({
    success: true,
    admin: req.user // { id, role } injecté par authMiddleware
  })
}