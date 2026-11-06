// components/admin/DashboardMobileNav.jsx
// Barre de navigation du dashboard sur téléphone (< md) — modération des témoignages et articles uniquement (tâche 125).

import { NavLink } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { mobileNavItems } from './dashboardNav'

// En haut de l'écran (sticky) : le bas est déjà occupé par la barre
// « Annuler / Enregistrer » des formulaires (FormActionBar, en position fixed).
function DashboardMobileNav({ onLogout }) {
  return (
    <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200">
      <nav className="flex items-stretch" aria-label="Navigation du dashboard">
        {mobileNavItems.map(({ mobileLabel, label, path, icon: Icon, activeClass }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              // min-h-12 (48 px) : zone tactile confortable au doigt
              `flex-1 min-h-12 flex items-center justify-center gap-2 px-3 text-sm font-medium transition-colors ${
                isActive ? activeClass : 'text-dash-legend'
              }`
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{mobileLabel || label}</span>
          </NavLink>
        ))}

        <button
          onClick={onLogout}
          className="min-h-12 px-4 flex items-center justify-center text-dash-legend hover:text-dash-danger border-l border-gray-200"
          aria-label="Déconnexion"
          title="Déconnexion"
        >
          <FiLogOut size={18} aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}

export default DashboardMobileNav
