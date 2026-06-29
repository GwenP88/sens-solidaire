// components/navigation/ProtectedRoute.jsx
// Garde de route côté front : protège les pages admin.
// ⚠️ RAPPEL : ceci est du CONFORT UX, pas de la sécurité.
//    La vraie sécurité est côté back (authMiddleware). Le front est public.
// Rôle : si pas de token en localStorage → redirige vers le login.
//        sinon → affiche la page demandée (passée en children).

import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  // 1. On lit le token stocké au moment du login
  const token = localStorage.getItem('admin_token')

  // 2. Pas de token → l'utilisateur n'est pas connecté → redirection
  //    'replace' évite d'empiler /admin dans l'historique du navigateur
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  // 3. Token présent → on affiche la page protégée
  return children
}

export default ProtectedRoute
