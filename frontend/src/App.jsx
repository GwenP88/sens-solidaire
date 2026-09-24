// App.jsx
// Composant racine de l'application — point d'entrée de tout le frontend
// BrowserRouter gère la navigation entre les pages sans rechargement

// ── Router ───────────────────────────────────────────────────────────────
// react-router-dom — gère les URLs et la navigation sans rechargement de page.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RouteScrollReset from './components/navigation/RouteScrollReset'

// ── Layout global ────────────────────────────────────────────────────────
// Wrapper Navbar + Footer, appliqué à toutes les pages publiques via <Outlet>.
import Layout from './components/layout/Layout'

// ── Pages publiques — Missions & lieux ──────────────────────────────────
// Volontariat individuel, Service Civique et les lieux partenaires associés.
import Home from './pages/Home'
import Missions from './pages/Missions'
import MissionDetail from './pages/MissionDetail'
import ServiceCiviqueDetail from './pages/ServiceCiviqueDetail'
import LocationDetail from './pages/LocationDetail'

// ── Pages publiques — site principal ────────────────────────────────────
// Témoignages, contact, soutien et transparence financière.
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import Soutenir from './pages/Soutenir'
import RapportsActivite from './pages/RapportsActivite'

// ── Pages institutionnelles ──────────────────────────────────────────────
// Présentation de l'association, équipe, et pages légales obligatoires.
import APropos from './pages/APropos'
import Equipe from './pages/Equipe'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'
import Cookies from './pages/Cookies'

// ── Pages Notre Impact ────────────────────────────────────────────────────
// Actions sur le terrain, listées puis détaillées.
import Impact from './pages/Impact'
import ImpactDetail from './pages/ImpactDetail'

// ── Pages Médias & Actualités ────────────────────────────────────────────
// Articles publiés par l'association, listés puis détaillés.
import MediaEtActualites from './pages/MediaEtActualites'
import MediaDetail from './pages/MediaDetail'

// ── Pages Éducation & Sensibilisation ────────────────────────────────────
// Ateliers pédagogiques proposés aux écoles, listés puis détaillés.
import Education from './pages/Education'
import EducationDetail from './pages/EducationDetail'

// ── Pages admin — sans Navbar ni Footer ──────────────────────────────────
// Dashboard de gestion de contenu, protégé par ProtectedRoute (JWT requis).
import LoginAdmin from './pages/admin/LoginAdmin'
import ProtectedRoute from './components/navigation/ProtectedRoute'
import DashboardLayout from './components/admin/DashboardLayout'
import Dashboard from './pages/admin/Dashboard'
import MissionsPage from './pages/admin/MissionsPage'
import MissionFormPage from './pages/admin/MissionFormPage'
import ServiceCiviquePage from './pages/admin/ServiceCiviquePage'
import ServiceCiviqueFormPage from './pages/admin/ServiceCiviqueFormPage'
import GaleriePage from './pages/admin/GaleriePage'
import LocationsPage from './pages/admin/LocationsPage'
import LocationFormPage from './pages/admin/LocationFormPage'

function App() {
  return (
    // ── BrowserRouter — active la gestion des URLs dans toute l'application
    <BrowserRouter>

      <RouteScrollReset />

      <Routes>

        {/* ── Routes publiques — avec Navbar + Footer via Layout ── */}
        {/* Toutes les routes ici passent par <Layout>, qui affiche Navbar + Footer autour du contenu */}
        <Route element={<Layout />}>

          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />

          {/* Missions & lieux */}
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/:slug" element={<MissionDetail />} />
          <Route path="/service-civique/:slug" element={<ServiceCiviqueDetail />} />
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
          <Route path="/notre-impact/:slug" element={<ImpactDetail />} />

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
        {/* /admin/login reste libre d'accès ; tout le reste passe par ProtectedRoute (JWT requis) */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Vue d'ensemble */}
          <Route index element={<div>Vue d'ensemble — à construire</div>} />

          {/* Témoignages */}
          <Route path="temoignages" element={<Dashboard />} />

          {/* Missions */}
          <Route path="missions" element={<MissionsPage />} />
          <Route path="missions/new" element={<MissionFormPage />} />
          <Route path="missions/:id/edit" element={<MissionFormPage />} />

          {/* Service civique */}
          <Route path="service-civique" element={<ServiceCiviquePage />} />
          <Route path="service-civique/new" element={<ServiceCiviqueFormPage />} />
          <Route path="service-civique/:id/edit" element={<ServiceCiviqueFormPage />} />

          {/* Lieux */}
          <Route path="lieux" element={<LocationsPage />} />
          <Route path="lieux/new" element={<LocationFormPage />} />
          <Route path="lieux/:id/edit" element={<LocationFormPage />} />

          {/* Galerie */}
          <Route path="galerie" element={<GaleriePage />} />

          {/* À ajouter au fur et à mesure : équipe, actions-terrain, médias,
              rapports d'activité, a-propos, soutenir, contact, paramètres */}
        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App