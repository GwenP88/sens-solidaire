// src/app.js
// Point d'entrée de l'application Express
// Assemble tous les middlewares et routes dans le bon ordre
// L'ordre d'initialisation est critique — ne pas modifier

// Import du framework Express
import express from "express"

// Helmet sécurise automatiquement les headers HTTP
// Ex : empêche le clickjacking, masque la technologie utilisée, etc.
import helmet from "helmet"

// CORS autorise le frontend (localhost:5173) à appeler l'API
// Sans ça, le navigateur bloque toutes les requêtes cross-origin
import cors from "cors"

// Cookie-parser permet à Express de lire req.cookies
// Nécessaire pour lire le refresh token stocké dans le cookie HTTP-Only
import cookieParser from "cookie-parser"

// Import du router d'authentification
import authRouter from "./routes/auth.js"
// Import du router de missions 
import missionsRouter from "./routes/missions.js"
// Import du router témoignages
import testimonialRouter from "./routes/testimonialRoutes.js"
// Import du router contact
import contactRouter from "./routes/contactRoutes.js"
// Import du router admin CUD(Create, update, delete)
import adminMissionRoutes from "./routes/adminMissionRoutes.js"


// ── INITIALISATION EXPRESS ───────────────────────────────────────────────────

// Crée l'instance Express — c'est l'application
const app = express()


// ── MIDDLEWARES GLOBAUX ──────────────────────────────────────────────────────
// Exécutés sur TOUTES les requêtes, dans cet ordre précis

// 1. Helmet EN PREMIER — sécurise les headers avant tout traitement
app.use(helmet())

// 2. CORS — autorise uniquement le frontend à appeler l'API
// origin : seul localhost:5173 (Vite) est autorisé en développement
// credentials : true → autorise l'envoi des cookies (refresh token)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true // obligatoire pour que les cookies fonctionnent
}))

// 3. Cookie-parser — parse les cookies entrants
// Doit être AVANT les routes pour que req.cookies soit disponible
app.use(cookieParser())

// 4. Express JSON — parse le body des requêtes en JSON
// Sans ça, req.body serait undefined
app.use(express.json())


// ── ROUTES ───────────────────────────────────────────────────────────────────

// Route de santé — permet de vérifier que le serveur tourne
// Utilisée par Docker healthcheck et les outils de monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
})

// Route d'authentification — préfixe /api/auth
// Ex : POST /api/auth/login, GET /api/auth/verify...
app.use("/api/auth", authRouter)
// Route missions — préfixe /api/missions
// Ex : GET /api/missions, GET /api/missions/:slug
app.use("/api/missions", missionsRouter)
// Route témoignages
app.use("/api/testimonials", testimonialRouter)
// Route contact
app.use("/api/contact", contactRouter)
// Route admin missions (écriture, protégées)
app.use("/api/admin/missions", adminMissionRoutes)


// ── MIDDLEWARE ERREURS ───────────────────────────────────────────────────────
// Doit être EN DERNIER — attrape toutes les erreurs lancées par les routes
// Format : (err, req, res, next) → 4 paramètres = middleware d'erreur pour Express
app.use((err, req, res, next) => {

  // Log l'erreur en console pour le debugging
  // En production on utiliserait un vrai logger (Winston, Pino...)
  console.error(`[ERROR] ${err.message}`)

  // Utilise le status attaché à l'erreur par le service (ex: 401, 404)
  // Si pas de status défini → 500 Internal Server Error par défaut
  const status = err.status || 500

  // Ne jamais exposer les détails techniques en production
  // En dev on affiche le message, en prod un message générique
  const message = process.env.NODE_ENV === "production"
    ? "Une erreur est survenue"
    : err.message

  res.status(status).json({
    error: true,
    message,
    status,
    ...(err.code && {code: err.code})
  })
})


// Export de l'app pour être utilisée dans server.js
export default app
