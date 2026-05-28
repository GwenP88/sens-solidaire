// main.jsx
// Point d'entrée JavaScript de l'application - fichier chargé en premier par Vite — il monte React dans la page HTML

import { StrictMode } from 'react'              // Mode strict React — détecte les erreurs potentielles en développement
import { createRoot } from 'react-dom/client'   // Fonction qui relie React au DOM HTML
import './index.css'                            // Import des styles globaux (Tailwind)
import App from './App.jsx'                     // Import du composant racine

// Sélectionne la div id="root" dans index.html et y monte l'application React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* App est le composant racine — tout le site est rendu à partir d'ici */}
    <App />
  </StrictMode>,
)