// components/admin/DashboardSidebar.jsx
// Navigation latérale du dashboard admin — desktop uniquement.
// Mobile (< md) : sidebar masquée, cf. maquette DB_temoignages_mobile.

import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiGlobe,
  FiMessageCircle,
  FiBookOpen,
  FiFileText,
  FiUsers,
  FiMapPin,
  FiHeart,
  FiMail,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'

// Source unique de vérité pour la nav — modifier ici seulement.
// Couleurs calées sur la maquette (chaque section a sa teinte propre).
const navItems = [
  {
    label: 'Tableau de bord',
    path: '/admin',
    end: true, // évite que ce lien reste actif sur /admin/missions etc.
    icon: FiHome,
    activeClass: 'bg-emerald-50 text-emerald-700',
    iconActive: 'text-emerald-600',
  },
  {
    label: 'Missions',
    path: '/admin/missions',
    icon: FiGlobe,
    activeClass: 'bg-emerald-50 text-emerald-700',
    iconActive: 'text-emerald-600',
  },
  {
    label: 'Témoignages',
    path: '/admin/temoignages',
    icon: FiMessageCircle,
    activeClass: 'bg-blue-50 text-blue-700',
    iconActive: 'text-blue-600',
  },
  {
    label: 'Actions éducatives',
    path: '/admin/ateliers',
    icon: FiBookOpen,
    activeClass: 'bg-indigo-50 text-indigo-800',
    iconActive: 'text-indigo-800',
  },
  {
    label: 'Médias & actualités',
    path: '/admin/medias',
    icon: FiFileText,
    activeClass: 'bg-orange-50 text-orange-700',
    iconActive: 'text-orange-600',
  },
  {
    label: 'À propos',
    path: '/admin/a-propos',
    icon: FiUsers,
    activeClass: 'bg-purple-50 text-purple-700',
    iconActive: 'text-purple-600',
  },
  {
    label: 'Projets réalisés',
    path: '/admin/actions-terrain', // chemin conservé du cahier des charges
    icon: FiMapPin,
    activeClass: 'bg-violet-50 text-violet-700',
    iconActive: 'text-violet-600',
  },
  {
    label: 'Soutenir',
    path: '/admin/soutenir', // 👀 à confirmer — pas dans le tableau d'origine
    icon: FiHeart,
    activeClass: 'bg-red-50 text-red-700',
    iconActive: 'text-red-500',
  },
  {
    label: 'Contact',
    path: '/admin/contact',
    icon: FiMail,
    activeClass: 'bg-teal-50 text-teal-700',
    iconActive: 'text-teal-600',
  },
  {
    label: 'Paramètres',
    path: '/admin/parametres',
    icon: FiSettings,
    activeClass: 'bg-gray-100 text-gray-700',
    iconActive: 'text-gray-500',
  },
]

function DashboardSidebar({ onLogout }) {
  return (
    <aside className="hidden md:flex w-64 h-screen bg-white border-r border-gray-200 flex-col fixed left-0 top-0 z-20">

      <div className="flex items-center gap-2 px-6 py-6">
        <span className="text-2xl">🌍</span>
        <span className="font-heading font-bold text-lg text-gray-900">
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
                isActive ? activeClass : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? iconActive : 'text-gray-400'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 mx-3 mb-6 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <FiLogOut size={18} />
        <span>Déconnexion</span>
      </button>
    </aside>
  )
}

export default DashboardSidebar