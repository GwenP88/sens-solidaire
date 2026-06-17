// Layout.jsx
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieBanner from '../ui/CookieBanner'

// Pages sans CTA footer
const NO_CTA_PAGES = ['/mentions-legales', '/confidentialite', '/cookies', '/rapports-activite']

function Layout() {
  const location = useLocation()
  const hideCta = NO_CTA_PAGES.includes(location.pathname)
  

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer hideCta={hideCta} />
      <CookieBanner />
    </div>
  )
}

export default Layout