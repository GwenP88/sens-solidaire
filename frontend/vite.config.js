// vite.config.js
// Fichier de configuration de Vite — l'outil qui compile et sert notre application React

import { defineConfig } from 'vite'           // Fonction qui définit la config Vite
import react from '@vitejs/plugin-react'       // Plugin qui permet à Vite de comprendre React (JSX)
import tailwindcss from '@tailwindcss/vite'    // Plugin qui intègre Tailwind CSS dans Vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 5173,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    // Autorise les hosts externes — nécessaire pour ngrok
    allowedHosts: ['couch-stray-twistable.ngrok-free.dev'],
    // Proxy — redirige les appels /api vers le backend local
    // Permet d'accéder au backend depuis ngrok sans second tunnel
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  // Configuration Vitest — au même niveau que plugins/server, pas dedans
  test: {
    environment: 'jsdom',                 // simule un navigateur pour les tests
    setupFiles: './src/setupTests.js',    // fichier de config globale (à créer ensuite)
  },
})