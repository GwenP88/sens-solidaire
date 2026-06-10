// src/server.js
// Point d'entrée de l'application — fichier exécuté par Node.js au démarrage
// Importe l'app Express configurée et démarre le serveur HTTP

// Charge les variables d'environnement depuis .env — doit être en premier
import "dotenv/config"

// Import de l'application Express configurée dans app.js
import app from "./app.js"

// Lit le port depuis les variables d'environnement
// Si PORT n'est pas défini dans .env → utilise 3000 par défaut
const PORT = process.env.PORT || 3000

// Démarre le serveur sur le port défini
// Le callback s'exécute une fois le serveur prêt
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
  console.log(`📦 Environnement : ${process.env.NODE_ENV || "development"}`)
  console.log(`🔍 Health check : http://localhost:${PORT}/api/health`)
})
