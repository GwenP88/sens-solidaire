// components/admin/DashboardSidebar.jsx
// Navigation latérale du dashboard admin — desktop uniquement.
// Mobile (< md) : sidebar masquée, cf. maquette DB_temoignages_mobile.

import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiGlobe,
  FiFlag,
  FiMessageCircle,
  FiBookOpen,
  FiFileText,
  FiUsers,
  FiMapPin,
  FiHeart,
  FiMail,
  FiSettings,
  FiLogOut,
  FiImage,
} from 'react-icons/fi'

// Source unique de vérité pour la nav — modifier ici seulement.
// Couleurs calées sur la maquette (chaque section a sa teinte propre).
const navItems = [
  {
    label: 'Tableau de bord',
    path: '/admin',
    end: true, // évite que ce lien reste actif sur /admin/missions etc.
    icon: FiHome,
    activeClass: 'bg-dash-action/10 text-dash-action',
    iconActive: 'text-dash-action',
  },
  {
    label: 'Missions',
    path: '/admin/missions',
    icon: FiGlobe,
    activeClass: 'bg-dash-action/10 text-dash-action',
    iconActive: 'text-dash-action',
  },
    {
    label: 'Lieux & délégations',
    path: '/admin/lieux',
    icon: FiMapPin,
    activeClass: 'bg-dash-action/10 text-dash-action',
    iconActive: 'text-dash-action',
  },
  {
    label: 'Galerie',
    path: '/admin/galerie',
    icon: FiImage,
    activeClass: 'bg-dash-action/10 text-dash-action',
    iconActive: 'text-dash-action',
  },
  {
    label: 'Association & partenaires',
    path: '/admin/a-propos',
    icon: FiUsers,
    activeClass: 'bg-dash-action/10 text-dash-action',
    iconActive: 'text-dash-action',
  },
  {
    label: 'Témoignages & rapports',
    path: '/admin/temoignages-rapports',
    icon: FiMessageCircle,
    activeClass: 'bg-dash-action/10 text-dash-action',
    iconActive: 'text-dash-action',
  },
]

function DashboardSidebar({ onLogout }) {
  return (
    <aside className="hidden md:flex w-64 h-screen bg-white border-r border-gray-200 flex-col fixed left-0 top-0 z-20">

      <div className="flex items-center gap-2 px-6 py-6">
        <img src="/logo.png" alt="Sens Solidaires" className="h-12" />
        <span className="font-heading font-bold text-lg text-dash-title">
          Sens Solidaires
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-1">
        {navItems.map(({ label, path, end, icon: Icon, activeClass, iconActive }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? activeClass : 'text-dash-legend hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? iconActive : 'text-dash-legend'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 mx-3 mb-6 rounded-lg text-sm font-medium text-dash-legend hover:bg-dash-danger/10 hover:text-dash-danger transition-colors"
      >
        <FiLogOut size={18} />
        <span>Déconnexion</span>
      </button>
    </aside>
  )
}

export default DashboardSidebar