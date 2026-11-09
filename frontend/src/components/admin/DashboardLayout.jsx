// components/admin/DashboardLayout.jsx
// Coquille du dashboard : Sidebar fixe (desktop) ou barre du haut (téléphone) + zone de contenu dynamique (<Outlet />).

import { Suspense } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'
import DashboardMobileNav from './DashboardMobileNav'
import { mobileNavItems } from './dashboardNav'
import PageLoader from '../ui/PageLoader'
import useSEO from '../../hooks/useSEO'

function DashboardLayout() {
  // Dashboard : titre d'onglet clair et page exclue de Google (tâche 174)
  useSEO({ title: 'Tableau de bord', noindex: true })

  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Pages prévues sur téléphone : celles de la barre mobile et leurs sous-pages (ex. /admin/medias/new)
  const isMobileReady = mobileNavItems.some(item => pathname.startsWith(item.path))

  // Déconnexion : on annule exactement la condition vérifiée par ProtectedRoute
  // (présence du token en localStorage), puis on redirige.
  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <DashboardSidebar onLogout={handleLogout} />
      <DashboardMobileNav onLogout={handleLogout} />

      {/* md:ml-64 : compense la sidebar en position fixed (w-64) sur desktop.
          Sur mobile, la sidebar est masquée donc pas de marge nécessaire.
          p-4 sur mobile : plus de place pour le contenu sur un écran de 375 px. */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-w-0">
        {!isMobileReady && (
          <p className="md:hidden mb-4 p-3 text-sm text-dash-warning bg-dash-warning/10 border border-dash-warning/30 rounded-lg">
            Cette page est prévue pour un ordinateur. Sur téléphone, vous pouvez modérer les témoignages et publier des articles.
          </p>
        )}
        {/* Pages du dashboard chargées à la demande (tâche 130) : la barre latérale reste affichée pendant le chargement */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default DashboardLayout