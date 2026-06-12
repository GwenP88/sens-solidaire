// App.jsx
// Composant racine de l'application — point d'entrée de tout le frontend
// BrowserRouter gère la navigation entre les pages sans rechargement de la page

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
<<<<<<< HEAD
import Missions from './pages/Missions' //import rajouté d'Alison
=======
import Missions from './pages/Missions'
import MissionDetail from './pages/MissionDetail'
>>>>>>> dev
import LoginAdmin from './pages/admin/LoginAdmin'
import Dashboard from './pages/admin/Dashboard'

function App() {
  return (
    // BrowserRouter — active la gestion des URLs dans toute l'application
    <BrowserRouter>

      {/* Routes — définit toutes les pages et leurs URLs */}
      <Routes>

        {/* Routes publiques — avec Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
<<<<<<< HEAD
          <Route path="/missions" element={<Missions />} /> {/* Route ajouté pour mission Ali  */}
=======
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/:slug" element={<MissionDetail />} />
>>>>>>> dev
        </Route>

        {/* Routes admin — sans Navbar ni Footer */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>
  )
}

// Export du composant pour qu'il soit utilisable dans main.jsx
export default App