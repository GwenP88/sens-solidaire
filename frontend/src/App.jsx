// App.jsx
// Composant racine de l'application — point d'entrée de tout le frontend
// BrowserRouter gère la navigation entre les pages sans rechargement de la page

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Missions from './pages/Missions' //import rajouté d'Alison
import LoginAdmin from './pages/admin/LoginAdmin'

function App() {
  return (
    // BrowserRouter — active la gestion des URLs dans toute l'application
    <BrowserRouter>

      {/* Routes — définit toutes les pages et leurs URLs */}
      <Routes>

        {/* Routes publiques — avec Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/missions" element={<Missions />} /> {/* Route ajouté pour mission Ali  */}
        </Route>

        {/* Routes admin — sans Navbar ni Footer */}
        <Route path="/admin/login" element={<LoginAdmin />} />

      </Routes>

    </BrowserRouter>
  )
}

// Export du composant pour qu'il soit utilisable dans main.jsx
export default App