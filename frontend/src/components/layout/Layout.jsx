// Layout.jsx
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

// Pages sans CTA footer
const NO_CTA_PAGES = ['/mentions-legales', '/confidentialite', '/cookies']

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
    </div>
  )
}

export default Layout