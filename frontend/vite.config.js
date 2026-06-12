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
  },
})