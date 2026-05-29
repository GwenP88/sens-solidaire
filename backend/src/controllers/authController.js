// src/services/authService.js
// Logique métier de l'authentification admin
// Gère : login, logout, refresh token
// Interactions : Prisma (base de données), bcrypt (hash), jwt utils (tokens)

// Import de bcrypt pour hasher et comparer les mots de passe
import bcrypt from "bcrypt"

// Import de l'instance Prisma unique pour accéder à la base de données
import prisma from "../config/db.js"

// Import des fonctions utilitaires JWT créées dans utils/jwt.js
import {
  generateAccessToken,   // génère un access token (15min)
  generateRefreshToken,  // génère un refresh token (7j)
  verifyRefreshToken     // vérifie et décode un refresh token
} from "../utils/jwt.js"


// ── LOGIN ────────────────────────────────────────────────────────────────────
// Fonction appelée quand l'admin soumet le formulaire de connexion
// Paramètres : email (string), password (string saisi en clair)
// Retourne : { accessToken, refreshToken }
export const login = async (email, password) => {

  // Cherche un admin en base dont l'email correspond exactement
  // findUnique → retourne null si aucun résultat (pas d'erreur)
  const admin = await prisma.admin.findUnique({
    where: { email }
  })

  // Compare le password saisi avec le hash stocké en base
  // bcrypt.compare retourne true si ça correspond, false sinon
  // Si admin est null (email inconnu), on met false directement
  // → évite un crash ET garde le même comportement que si le password était faux
  const validPassword = admin
    ? await bcrypt.compare(password, admin.password_hash)
    : false

  // Si email inconnu OU password faux → même message d'erreur dans les deux cas
  // Sécurité : un attaquant ne peut pas savoir lequel des deux est faux
  // error.status = 401 → sera lu par le errorMiddleware pour formater la réponse
  if (!admin || !validPassword) {
    const error = new Error("Identifiants invalides")
    error.status = 401
    throw error
  }

  // Génère l'access token (contient id + role, valide 15min)
  const accessToken = generateAccessToken(admin)

  // Génère le refresh token (contient uniquement id, valide 7j)
  const refreshToken = generateRefreshToken(admin)

  // Hashe le refresh token avant de le stocker en base
  // Le facteur de coût 10 = niveau de sécurité recommandé (bon équilibre sécurité/performance)
  // On ne stocke JAMAIS un token en clair — si la BDD est compromise,
  // les hashes sont inutilisables sans le token original
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

  // Met à jour l'admin en base avec le nouveau hash du refresh token
  // Écrase l'ancien s'il y en avait un → une seule session active à la fois
  await prisma.admin.update({
    where: { id: admin.id },
    data: { refresh_token_hash: refreshTokenHash }
  })

  // Retourne les deux tokens au controller qui les enverra au frontend
  return { accessToken, refreshToken }
}


// ── LOGOUT ───────────────────────────────────────────────────────────────────
// Fonction appelée quand l'admin clique sur "Se déconnecter"
// Paramètres : adminId (integer) — l'id de l'admin connecté
// Retourne : rien (void)
export const logout = async (adminId) => {

  // Supprime le refresh token en base → révoque la session immédiatement
  // Même si l'access token est encore valide (15min max),
  // l'admin ne pourra plus en obtenir un nouveau après expiration
  await prisma.admin.update({
    where: { id: adminId },
    data: { refresh_token_hash: null } // null = aucune session active
  })
}


// ── REFRESH ──────────────────────────────────────────────────────────────────
// Fonction appelée automatiquement par le frontend quand l'access token expire
// Échange un refresh token valide contre un nouvel access token + nouveau refresh token
// Paramètres : refreshToken (string) — lu depuis le cookie HTTP-Only
// Retourne : { accessToken, refreshToken }
export const refresh = async (refreshToken) => {

  // Vérifie la signature cryptographique du refresh token
  // Si expiré ou falsifié → jwt.verify lance une erreur qu'on attrape ici
  let payload
  try {
    payload = verifyRefreshToken(refreshToken) // retourne { id, iat, exp }
  } catch {
    const error = new Error("Refresh token invalide ou expiré")
    error.status = 401
    throw error
  }

  // Récupère l'admin en base grâce à l'id extrait du token
  const admin = await prisma.admin.findUnique({
    where: { id: payload.id }
  })

  // Si l'admin n'existe plus OU n'a pas de refresh token en base
  // → session invalide, on refuse
  if (!admin || !admin.refresh_token_hash) {
    const error = new Error("Session expirée")
    error.status = 401
    throw error
  }

  // Vérifie que le refresh token envoyé correspond bien au hash stocké en base
  // Protection contre la réutilisation d'un ancien token après rotation
  const validToken = await bcrypt.compare(refreshToken, admin.refresh_token_hash)

  if (!validToken) {
    // Le token ne correspond pas au hash → quelqu'un utilise un ancien token
    // C'est le signe d'une possible compromission
    // On révoque TOUTES les sessions de cet admin par sécurité
    await prisma.admin.update({
      where: { id: admin.id },
      data: { refresh_token_hash: null }
    })
    const error = new Error("Token compromis — toutes les sessions révoquées")
    error.status = 401
    throw error
  }

  // Rotation des tokens : on génère deux nouveaux tokens
  // L'ancien refresh token sera remplacé → ne peut plus être réutilisé
  const newAccessToken = generateAccessToken(admin)
  const newRefreshToken = generateRefreshToken(admin)

  // Hashe le nouveau refresh token avant stockage
  const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10)

  // Remplace l'ancien hash par le nouveau en base
  // → l'ancien refresh token est maintenant invalide
  await prisma.admin.update({
    where: { id: admin.id },
    data: { refresh_token_hash: newRefreshTokenHash }
  })

  // Retourne les nouveaux tokens au controller
  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}
