// server.js
// Point d'entrée du serveur backend
// Initialise Express et démarre le serveur sur le port défini

import express from 'express'       // Framework serveur
import cors from 'cors'             // Autorise les requêtes cross-origin depuis le frontend
import helmet from 'helmet'         // Sécurise les headers HTTP automatiquement
import dotenv from 'dotenv'         // Charge les variables d'environnement depuis .env

// Charge les variables d'environnement en premier
dotenv.config()

const app = express()               // Crée l'application Express
const PORT = process.env.PORT || 3000 // Port du serveur — défini dans .env ou 3000 par défaut

// ── Middlewares globaux ──────────────────────────────
app.use(helmet())                   // Applique les headers de sécurité sur toutes les requêtes
app.use(cors())                     // Autorise le frontend (React) à communiquer avec ce serveur
app.use(express.json())             // Permet de lire le JSON dans le body des requêtes

// ── Route de test ────────────────────────────────────
app.get('/api/health', (req, res) => {
  // Route de vérification — permet de tester que le serveur tourne
  res.json({ status: 'ok', message: 'Serveur Sens Solidaire opérationnel' })
})

// ── Démarrage du serveur ─────────────────────────────
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})