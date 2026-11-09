// App.jsx
// Composant racine de l'application — point d'entrée de tout le frontend
// BrowserRouter gère la navigation entre les pages sans rechargement

// ── React ────────────────────────────────────────────────────────────────
// lazy + Suspense (tâche 130) : chaque page est un fichier JavaScript séparé, téléchargé seulement
// quand on l'ouvre. Un visiteur du site ne télécharge jamais le code du dashboard.
// Restent chargés d'emblée : Layout (présent sur toutes les pages publiques) et Home (page d'arrivée la plus fréquente).
import { lazy, Suspense } from 'react'
import PageLoader from './components/ui/PageLoader'

// ── Router ───────────────────────────────────────────────────────────────
// react-router-dom — gère les URLs et la navigation sans rechargement de page.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RouteScrollReset from './components/navigation/RouteScrollReset'
import ProtectedRoute from './components/navigation/ProtectedRoute'

// ── Layout global ────────────────────────────────────────────────────────
// Wrapper Navbar + Footer, appliqué à toutes les pages publiques via <Outlet>.
import Layout from './components/layout/Layout'

// ── Pages publiques — Missions & lieux ──────────────────────────────────
// Volontariat individuel, Service Civique et les lieux partenaires associés.
import Home from './pages/Home'
const Missions = lazy(() => import('./pages/Missions'))
const MissionDetail = lazy(() => import('./pages/MissionDetail'))
const LocationDetail = lazy(() => import('./pages/LocationDetail'))

// ── Pages publiques — site principal ────────────────────────────────────
// Témoignages, contact, soutien et transparence financière.
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Contact = lazy(() => import('./pages/Contact'))
const Soutenir = lazy(() => import('./pages/Soutenir'))
const RapportsActivite = lazy(() => import('./pages/RapportsActivite'))

// ── Pages institutionnelles ──────────────────────────────────────────────
// Présentation de l'association, équipe, et pages légales obligatoires.
const APropos = lazy(() => import('./pages/APropos'))
const Equipe = lazy(() => import('./pages/Equipe'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'))
const Confidentialite = lazy(() => import('./pages/Confidentialite'))
const Cookies = lazy(() => import('./pages/Cookies'))

// ── Pages Notre Impact ────────────────────────────────────────────────────
// Actions sur le terrain, listées puis détaillées.
const Impact = lazy(() => import('./pages/Impact'))
const ImpactDetail = lazy(() => import('./pages/ImpactDetail'))

// ── Pages Médias & Actualités ────────────────────────────────────────────
// Articles publiés par l'association, listés puis détaillés.
const MediaEtActualites = lazy(() => import('./pages/MediaEtActualites'))
const MediaDetail = lazy(() => import('./pages/MediaDetail'))

// ── Pages Éducation & Sensibilisation ────────────────────────────────────
// Ateliers pédagogiques proposés aux écoles, listés puis détaillés.
const Education = lazy(() => import('./pages/Education'))
const EducationDetail = lazy(() => import('./pages/EducationDetail'))

// ── Pages admin — sans Navbar ni Footer ──────────────────────────────────
// Dashboard de gestion de contenu, protégé par ProtectedRoute (JWT requis).
const LoginAdmin = lazy(() => import('./pages/admin/LoginAdmin'))
const DashboardLayout = lazy(() => import('./components/admin/DashboardLayout'))
// pages/admin/Dashboard.jsx (accueil du dashboard) n'est pas encore branché : la vue d'ensemble
// sera construite prochainement. Remettre ici `import Dashboard from './pages/admin/Dashboard'` à ce moment-là.
const MissionsPage = lazy(() => import('./pages/admin/MissionsPage'))
const MissionFormPage = lazy(() => import('./pages/admin/MissionFormPage'))
const ServiceCiviqueFormPage = lazy(() => import('./pages/admin/ServiceCiviqueFormPage'))
const GaleriePage = lazy(() => import('./pages/admin/GaleriePage'))
const LocationsPage = lazy(() => import('./pages/admin/LocationsPage'))
const LocationFormPage = lazy(() => import('./pages/admin/LocationFormPage'))
const MediaPostsPage = lazy(() => import('./pages/admin/MediaPostsPage'))
const MediaPostFormPage = lazy(() => import('./pages/admin/MediaPostFormPage'))
const TeamMemberFormPage = lazy(() => import('./pages/admin/TeamMemberFormPage'))
const AProposPage = lazy(() => import('./pages/admin/AProposPage'))
const TemoignagesRapportsPage = lazy(() => import('./pages/admin/TemoignagesRapportsPage'))
const FieldActionsPage = lazy(() => import('./pages/admin/FieldActionsPage'))
const FieldActionFormPage = lazy(() => import('./pages/admin/FieldActionFormPage'))

function App() {
  return (
    // ── BrowserRouter — active la gestion des URLs dans toute l'application
    <BrowserRouter>

      <RouteScrollReset />

      {/* Suspense général : page de connexion et dashboard (les pages publiques ont le leur dans Layout) */}
      <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Routes publiques — avec Navbar + Footer via Layout ── */}
        {/* Toutes les routes ici passent par <Layout>, qui affiche Navbar + Footer autour du contenu */}
        <Route element={<Layout />}>

          {/* Page d'accueil */}
          <Route path="/" element={<Home />} />

          {/* Missions & lieux */}
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
          <Route path="temoignages-rapports" element={<TemoignagesRapportsPage />} />

          {/* Missions */}
          <Route path="missions" element={<MissionsPage />} />
          <Route path="missions/new" element={<MissionFormPage />} />
          <Route path="missions/:id/edit" element={<MissionFormPage />} />

          {/* Service civique */}
          <Route path="service-civique/new" element={<ServiceCiviqueFormPage />} />
          <Route path="service-civique/:id/edit" element={<ServiceCiviqueFormPage />} />

          {/* Lieux */}
          <Route path="lieux" element={<LocationsPage />} />
          <Route path="lieux/new" element={<LocationFormPage />} />
          <Route path="lieux/:id/edit" element={<LocationFormPage />} />

          {/* Médias */}
          <Route path="medias" element={<MediaPostsPage />} />
          <Route path="medias/new" element={<MediaPostFormPage />} />
          <Route path="medias/:id/edit" element={<MediaPostFormPage />} />

          {/* Équipe */}
          <Route path="equipe/new" element={<TeamMemberFormPage />} />
          <Route path="equipe/:id/edit" element={<TeamMemberFormPage />} />

          {/* À propos (équipe, délégations, rapports d'activité) */}
          <Route path="a-propos" element={<AProposPage />} />
          <Route path="a-propos/equipe/new" element={<TeamMemberFormPage />} />
          <Route path="a-propos/equipe/:id/edit" element={<TeamMemberFormPage />} />

          {/* Galerie */}
          <Route path="galerie" element={<GaleriePage />} />

          {/* Actions terrain */}
          <Route path="actions-terrain" element={<FieldActionsPage />} />
          <Route path="actions-terrain/new" element={<FieldActionFormPage />} />
          <Route path="actions-terrain/:id/edit" element={<FieldActionFormPage />} />

        </Route>

      </Routes>
      </Suspense>

    </BrowserRouter>
  )
}

export default App