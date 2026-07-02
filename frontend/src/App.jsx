// App.jsx
// Composant racine de l'application — point d'entrée de tout le frontend
// BrowserRouter gère la navigation entre les pages sans rechargement

// ── Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ── Layout global
import Layout from './components/layout/Layout'

// ── Pages publiques — site principal
import Home from './pages/Home'
import Missions from './pages/Missions'
import MissionDetail from './pages/MissionDetail'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import Soutenir from './pages/Soutenir'
import RapportsActivite from './pages/RapportsActivite'

// ── Pages institutionnelles
import APropos from './pages/APropos'
import Equipe from './pages/Equipe'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'
import Cookies from './pages/Cookies'

// ── Pages Notre Impact
import Impact from './pages/Impact'
import ActionDetail from './pages/ActionDetail'

// ── Pages Médias & Actualités
import MediaEtActualites from './pages/MediaEtActualites'
import MediaDetail from './pages/MediaDetail'

// ── Pages Éducation & Sensibilisation
import Education from './pages/Education'
import EducationDetail from './pages/EducationDetail'

// ── Pages admin — sans Navbar ni Footer
import LoginAdmin from './pages/admin/LoginAdmin'
import Dashboard from './pages/admin/Dashboard'
import ProtectedRoute from './components/navigation/ProtectedRoute'

//  ── Pages lieux
import LocationDetail from './pages/LocationDetail'

function App() {
  return (
    // ── BrowserRouter — active la gestion des URLs dans toute l'application
    <BrowserRouter>

      <Routes>

        {/* ── Routes publiques — avec Navbar + Footer via Layout ── */}
        <Route element={<Layout />}>

          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />

          {/* Missions */}
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/:slug" element={<MissionDetail />} />
          <Route path="/lieux/:slug" element={<LocationDetail />} />

          {/* Témoignages & rapports */}
          <Route path="/temoignages" element={<Testimonials />} />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* Soutenir & transparence */}
          <Route path="/soutenir" element={<Soutenir />} />
          <Route path="/rapports-activite" element={<RapportsActivite />} />

          {/* À propos & équipe */}
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/equipe" element={<Equipe />} />

          {/* Notre Impact */}
          <Route path="/notre-impact" element={<Impact />} />
          <Route path="/notre-impact/:slug" element={<ActionDetail />} />

          {/* Médias & Actualités */}
          <Route path="/medias-et-actualites" element={<MediaEtActualites />} />
          <Route path="/medias/:slug" element={<MediaDetail />} />

          {/* Éducation & Sensibilisation */}
          <Route path="/education-sensibilisation" element={<Education />} />
          <Route path="/education-sensibilisation/:slug" element={<EducationDetail />} />

          {/* Pages légales */}
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/cookies" element={<Cookies />} />

        </Route>

        {/* ── Routes admin — sans Navbar ni Footer ── */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

      </Routes>

    </BrowserRouter>
  )
}

export default App
