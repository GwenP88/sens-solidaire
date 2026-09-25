// src/app.js
// Point d'entrée de l'application Express
// Assemble tous les middlewares et routes dans le bon ordre
// L'ordre d'initialisation est critique — ne pas modifier

// ── DÉPENDANCES EXTERNES ─────────────────────────────────────────────────────
// Packages npm utilisés par le serveur — sécurité, réseau, cookies.
import express from "express"
import helmet from "helmet"       // Sécurise les headers HTTP (clickjacking, fingerprinting...)
import cors from "cors"           // Autorise le frontend à appeler l'API en cross-origin
import cookieParser from "cookie-parser" // Permet de lire req.cookies (refresh token)

// ── ROUTES PUBLIQUES ──────────────────────────────────────────────────────────
// Endpoints accessibles sans authentification — consommés par le site public.
import authRouter from "./routes/auth.js"
import missionsRouter from "./routes/missions.js"
import testimonialRouter from "./routes/testimonialRoutes.js"
import contactRouter from "./routes/contactRoutes.js"
import fieldActionRouter from "./routes/fieldActionRoutes.js"
import mediaPostRouter from "./routes/mediaPostRoutes.js"
import educationItemRouter from "./routes/educationItemRoutes.js"
import teamMemberRouter from "./routes/teamMemberRoutes.js"
import activityReportRouter from "./routes/activityReportRoutes.js"
import delegationRouter from "./routes/delegationRoutes.js"
import missionReportRouter from "./routes/missionReportRoutes.js"
import partnerRouter from "./routes/partnerRoutes.js"
import locationRouter from "./routes/locationRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import galleryRouter from "./routes/galleryRoutes.js"

// ── ROUTES ADMIN (protégées) ─────────────────────────────────────────────────
// Endpoints réservés au dashboard — chaque routeur vérifie le JWT en interne.
import adminMissionRoutes from "./routes/adminMissionRoutes.js"
import adminTestimonialRoutes from "./routes/adminTestimonialRoutes.js"
import adminUploadRoutes from "./routes/adminUploadRoutes.js"
import adminGalleryRoutes from "./routes/adminGalleryRoutes.js"
import adminLocationRoutes from "./routes/adminLocationRoutes.js"
import adminDelegationRoutes from "./routes/adminDelegationRoutes.js"
import adminCountryRoutes from "./routes/adminCountryRoutes.js"
import adminTeamMemberRoutes from "./routes/adminTeamMemberRoutes.js"
import adminActivityReportRoutes from "./routes/adminActivityReportRoutes.js"
import adminPartnerRoutes from "./routes/adminPartnerRoutes.js"
import adminMissionReportRoutes from "./routes/adminMissionReportRoutes.js"
import adminFieldActionRoutes from "./routes/adminFieldActionRoutes.js"


// ── INITIALISATION EXPRESS ───────────────────────────────────────────────────
// Crée l'instance de l'application — point de départ de tout le reste.
const app = express()


// ── MIDDLEWARES GLOBAUX ──────────────────────────────────────────────────────
// Exécutés sur TOUTES les requêtes, dans cet ordre précis

// Helmet EN PREMIER — sécurise les headers avant tout traitement
app.use(helmet())

// CORS — origin : accepte localhost (Vite), ngrok et IP locale (tests mobile)
// credentials : true → autorise l'envoi des cookies (refresh token)
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      /\.ngrok-free\.app$/,
      /\.ngrok\.io$/,
      /^http:\/\/192\.168\./,
    ]
    if (!origin || allowed.some(p => typeof p === 'string' ? p === origin : p.test(origin))) {
      callback(null, true)
    } else {
      callback(new Error('CORS non autorisé'))
    }
  },
  credentials: true
}))

// Cookie-parser AVANT les routes — pour que req.cookies soit disponible
app.use(cookieParser())

// Parse le body des requêtes en JSON — sans ça, req.body serait undefined
app.use(express.json())

// Fichiers statiques — dossier uploads accessible publiquement
// Ex: /uploads/images/photo.jpg
app.use('/uploads', express.static('public/uploads'))


// ── ROUTE DE SANTÉ ────────────────────────────────────────────────────────────
// Utilisée par Docker healthcheck et les outils de monitoring
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
})


// ── ROUTES PUBLIQUES ──────────────────────────────────────────────────────────
// Montées sans middleware d'authentification.
app.use("/api/auth", authRouter)
app.use("/api/missions", missionsRouter)
app.use("/api/testimonials", testimonialRouter)
app.use("/api/contact", contactRouter)
app.use('/api/field-actions', fieldActionRouter)
app.use('/api/media-posts', mediaPostRouter)
app.use('/api/education-items', educationItemRouter)
app.use('/api/team-members', teamMemberRouter)
app.use('/api/activity-reports', activityReportRouter)
app.use('/api/delegations', delegationRouter)
app.use('/api/mission-reports', missionReportRouter)
app.use('/api/partners', partnerRouter)
app.use('/api/locations', locationRouter)
app.use('/api/upload', uploadRoutes)
app.use('/api/gallery', galleryRouter)


// ── ROUTES ADMIN (protégées) ──────────────────────────────────────────────────
// Montées derrière authMiddleware (vérifié dans chaque routeur, pas ici).
app.use("/api/admin/missions", adminMissionRoutes)
app.use("/api/admin/testimonials", adminTestimonialRoutes)
app.use("/api/admin/upload", adminUploadRoutes)
app.use('/api/admin/gallery', adminGalleryRoutes)
app.use('/api/admin/locations', adminLocationRoutes)
app.use('/api/admin/delegations', adminDelegationRoutes)
app.use('/api/admin/countries', adminCountryRoutes)
app.use('/api/admin/team-members', adminTeamMemberRoutes)
app.use('/api/admin/activity-reports', adminActivityReportRoutes)
app.use('/api/admin/partners', adminPartnerRoutes)
app.use('/api/admin/mission-reports', adminMissionReportRoutes)
app.use('/api/admin/field-actions', adminFieldActionRoutes)


// ── ROUTE NON TROUVÉE (404) ───────────────────────────────────────────────────
// Doit être APRÈS toutes les routes — n'est atteint que si aucune n'a matché
// Format JSON cohérent avec le middleware d'erreurs ci-dessous
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: "Route non trouvée",
    status: 404
  })
})


// ── MIDDLEWARE ERREURS ───────────────────────────────────────────────────────
// Doit être EN DERNIER — attrape toutes les erreurs lancées par les routes
// Format : (err, req, res, next) → 4 paramètres = middleware d'erreur pour Express
app.use((err, req, res, next) => {

  // Log l'erreur en console pour le debugging
  // En production on utiliserait un vrai logger (Winston, Pino...)
  console.error(`[ERROR] ${err.message}`)

  // Multer lève ses propres erreurs (fichier trop gros, champ inattendu...)
  // sans jamais poser err.status — sans ce mapping elles tombent dans le
  // 500 par défaut ci-dessous, et un visiteur qui envoie juste un fichier
  // trop lourd voit "erreur serveur" alors que c'est une erreur de sa part.
  const MULTER_STATUS = {
    LIMIT_FILE_SIZE: 413,
    LIMIT_UNEXPECTED_FILE: 400,
    LIMIT_FILE_COUNT: 400,
    LIMIT_PART_COUNT: 400,
  }
  if (MULTER_STATUS[err.code]) err.status = MULTER_STATUS[err.code]

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