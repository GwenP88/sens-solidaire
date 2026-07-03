// components/admin/DashboardLayout.jsx
// Coquille du dashboard : Sidebar fixe + zone de contenu dynamique (<Outlet />).

import { Outlet, useNavigate } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'

function DashboardLayout() {
  const navigate = useNavigate()

  // Déconnexion : on annule exactement la condition vérifiée par ProtectedRoute
  // (présence du token en localStorage), puis on redirige.
  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar onLogout={handleLogout} />

      {/* md:ml-64 : compense la sidebar en position fixed (w-64) sur desktop.
          Sur mobile, la sidebar est masquée donc pas de marge nécessaire. */}
      <main className="flex-1 md:ml-64 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout