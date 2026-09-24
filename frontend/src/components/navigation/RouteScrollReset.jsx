// RouteScrollReset.jsx
// Remet le scroll en haut de page à chaque changement de route.
// Sans ce composant, React Router garde la position de scroll précédente —
// une page longue suivie d'une page courte peut afficher son bas au lieu du haut.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function RouteScrollReset() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default RouteScrollReset