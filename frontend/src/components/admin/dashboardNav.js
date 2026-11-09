// components/admin/dashboardNav.js
// Liens du dashboard — partagés par DashboardSidebar (desktop) et DashboardMobileNav (téléphone).

import {
  FiHome,
  FiGlobe,
  FiFlag,
  FiMessageCircle,
  FiUsers,
  FiMapPin,
  FiRss,
  FiImage,
} from 'react-icons/fi'

// Source unique de vérité pour la nav — modifier ici seulement.
// Couleurs calées sur la maquette (chaque section a sa teinte propre).
export const navItems = [
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
    label: 'Projets réalisés',
    path: '/admin/actions-terrain',
    icon: FiFlag,
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
    label: 'Médias & actualités',
    mobileLabel: 'Articles',
    mobile: true, // disponible sur téléphone (tâche 125)
    path: '/admin/medias',
    icon: FiRss,
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
    mobileLabel: 'Témoignages',
    mobile: true, // disponible sur téléphone (tâche 125)
    path: '/admin/temoignages-rapports',
    icon: FiMessageCircle,
    activeClass: 'bg-dash-action/10 text-dash-action',
    iconActive: 'text-dash-action',
  },
]

// Sur téléphone, seules la modération des témoignages et la publication d'articles
// sont prévues (tâche 125) — les autres pages affichent un avertissement.
export const mobileNavItems = navItems.filter(item => item.mobile)
