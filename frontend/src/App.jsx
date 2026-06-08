// App.jsx
// Composant racine de l'application — point d'entrée de tout le frontend
// BrowserRouter gère la navigation entre les pages sans rechargement de la page

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

function App() {
  return (
    // BrowserRouter — active la gestion des URLs dans toute l'application
    <BrowserRouter>

      {/* Routes — définit toutes les pages et leurs URLs */}
      <Routes>

        {/* Layout — enveloppe toutes les pages avec Navbar + Footer */}
        <Route element={<Layout />}>

          {/* Route Accueil — page principale du site */}
          <Route path="/" element={<Home />} />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

// Export du composant pour qu'il soit utilisable dans main.jsx
export default App