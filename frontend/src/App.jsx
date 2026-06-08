// App.jsx
// Composant racine de l'application — point d'entrée de tout le frontend
// BrowserRouter gère la navigation entre les pages sans rechargement de la page

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Badge from './components/ui/BadgeODD'
import Button from './components/ui/Button'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Import temporaire des pages — seront créées au fur et à mesure
// import Home from './pages/Home'

function App() {
  return (
    // BrowserRouter — active la gestion des URLs dans toute l'application
    <BrowserRouter>

      {/* Routes — définit toutes les pages et leurs URLs */}
      <Routes>

        {/* Route temporaire — sera remplacée par les vraies pages */}
        <Route path="/" element={<div className="bg-surface min-h-screen"><Footer /></div>} />

      </Routes>

    </BrowserRouter>
  )
}

// Export du composant pour qu'il soit utilisable dans main.jsx
export default App