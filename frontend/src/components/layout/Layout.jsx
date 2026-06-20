// Layout.jsx
// Mise en page globale — Navbar + contenu + Footer + bannière cookies

// ── Router
import { Outlet, useLocation } from 'react-router-dom'

// ── Composants layout
import Navbar from './Navbar'
import Footer from './Footer'

// ── Composants UI
import CookieBanner from '../ui/CookieBanner'

// ── Pages sans CTA footer — le CTA "Partir en mission" est inapproprié sur ces pages
const NO_CTA_PAGES = ['/mentions-legales', '/confidentialite', '/cookies', '/rapports-activite']

function Layout() {
  // ── Détection de la page courante pour masquer le CTA footer si nécessaire
  const location = useLocation()
  const hideCta = NO_CTA_PAGES.includes(location.pathname)

  return (
    <div>
      {/* ── Barre de navigation — transparente sur les heroes ── */}
      <Navbar />

      {/* ── Contenu de la page courante via React Router ── */}
      <main>
        <Outlet />
      </main>

      {/* ── Pied de page — CTA masqué sur les pages légales ── */}
      <Footer hideCta={hideCta} />

      {/* ── Bannière consentement cookies CNIL ── */}
      <CookieBanner />
    </div>
  )
}

export default Layout