// Layout.jsx
// Mise en page globale — lien d'évitement + Navbar + contenu + Footer + bannière cookies

// ── React
import { Suspense } from 'react'

// ── Router
import { Outlet, useLocation } from 'react-router-dom'

// ── Composants layout
import Navbar from './Navbar'
import Footer from './Footer'

// ── Composants UI
import CookieBanner from '../ui/CookieBanner'
import PageLoader from '../ui/PageLoader'

// ── Pages sans CTA footer — le CTA "Partir en mission" est inapproprié sur ces pages
const NO_CTA_PAGES = ['/mentions-legales', '/confidentialite', '/cookies', '/rapports-activite']

function Layout() {
  // ── Détection de la page courante pour masquer le CTA footer si nécessaire
  const location = useLocation()
  const hideCta = NO_CTA_PAGES.includes(location.pathname)

  return (
    <div>
      {/* ── Lien d'évitement (tâche 173) — premier élément atteint avec Tab, invisible tant qu'il n'a
          pas le focus : permet de sauter la navigation et d'aller directement au contenu ── */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-surface focus:text-primary focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Aller au contenu
      </a>

      {/* ── Barre de navigation — transparente sur les heroes ── */}
      <Navbar />

      {/* ── Contenu de la page courante via React Router ──
          id="contenu" : cible du lien d'évitement ; tabIndex -1 : le focus peut y être placé
          Suspense (tâche 130) : affiche PageLoader pendant le téléchargement d'une page chargée à la demande,
          la Navbar et le Footer restent affichés */}
      <main id="contenu" tabIndex={-1} className="outline-none">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      {/* ── Pied de page — CTA masqué sur les pages légales ── */}
      <Footer hideCta={hideCta} />

      {/* ── Bannière consentement cookies CNIL ── */}
      <CookieBanner />
    </div>
  )
}

export default Layout
