// Navbar.jsx
// Barre de navigation principale — transparente sur le Hero
// Responsive : burger menu mobile + dropdowns desktop au survol

// ── React
import { useState, useRef } from 'react'

// ── Router
import { useLocation, Link } from 'react-router-dom'

// ── Composants UI
import Button from '../ui/Button'

// ── Icônes
import { GrHomeRounded } from 'react-icons/gr'
import { IoChevronDownSharp, IoCloseSharp, IoMenuSharp } from 'react-icons/io5'

// ── Liste des missions pour le dropdown — à mettre à jour si nouvelles missions
const MISSIONS = [
  { label: "Kenya", slug: "volontariat-kenya-environnement-biodiversite" },
  { label: "Sénégal", slug: "volontariat-senegal-casamance-agroecologie-mangrove" },
  { label: "Pérou", slug: "volontariat-perou-amazonie-biodiversite" },
  { label: "Sri Lanka", slug: "volontariat-sri-lanka-elephant-environnement" },
  { label: "Sumatra", slug: "volontariat-sumatra-biodiversite-orang-outan" },
]

// ── Liens À propos pour le dropdown
const APROPOS = [
  { label: "Notre association", href: "/a-propos" },
  { label: "Notre équipe", href: "/equipe" },
]

function Navbar() {
  const location = useLocation()

  // ── État menu mobile
  const [mobileOpen, setMobileOpen] = useState(false)

  // ── État accordéons mobile
  const [mobileMissionsOpen, setMobileMissionsOpen] = useState(false)
  const [mobileAproposOpen, setMobileAproposOpen] = useState(false)

  // ── État dropdowns desktop
  const [missionsOpen, setMissionsOpen] = useState(false)
  const [aproposOpen, setAproposOpen] = useState(false)

  // ── Timers fermeture dropdowns desktop
  const closeTimer = useRef(null)
  const closeTimerApropos = useRef(null)

  // ── Détection pages actives
  const isOnMissions = location.pathname.startsWith('/missions')
  const isOnApropos = location.pathname.startsWith('/a-propos') || location.pathname.startsWith('/equipe')

  // ── Ferme le menu mobile au clic sur un lien
  const handleMobileNav = () => setMobileOpen(false)

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 md:px-16 h-20 bg-transparent absolute top-0 left-0 z-10">

        {/* ── Logo ── */}
        <Link to="/">
          <div className="bg-white/40 rounded-full p-1">
            <img src="/logo.png" alt="Sens Solidaire" className="h-12 md:h-14" />
          </div>
        </Link>

        {/* ── Liens desktop — masqués sur mobile ── */}
        <div className="hidden lg:flex items-center gap-8">

          {/* Accueil */}
          <Link
            to="/"
            className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/' ? 'underline underline-offset-4' : ''}`}
          >
            <GrHomeRounded />
          </Link>

          {/* Nos missions — dropdown hover */}
          <div
            className="relative"
            onMouseEnter={() => { clearTimeout(closeTimer.current); setMissionsOpen(true) }}
            onMouseLeave={() => { closeTimer.current = setTimeout(() => setMissionsOpen(false), 150) }}
          >
            <Link
              to="/missions"
              className={`font-body font-bold text-base text-surface hover:text-accent transition-colors inline-flex items-center gap-1 ${isOnMissions ? 'underline underline-offset-4' : ''}`}
            >
              Nos missions<IoChevronDownSharp className="text-xs" />
            </Link>
            {missionsOpen && (
              <div className="absolute top-full left-0 mt-2 bg-primary rounded-xl shadow-lg py-2 min-w-48 z-20">
                <Link to="/missions" className="block px-5 py-2 font-body text-sm text-surface hover:text-accent transition-colors border-b border-surface/10">
                  Toutes les missions
                </Link>
                {MISSIONS.map(m => (
                  <Link
                    key={m.slug}
                    to={`/missions/${m.slug}`}
                    className={`block px-5 py-2 font-body text-sm text-surface hover:text-accent transition-colors ${location.pathname === `/missions/${m.slug}` ? 'text-accent' : ''}`}
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* À propos — dropdown hover */}
          <div
            className="relative"
            onMouseEnter={() => { clearTimeout(closeTimerApropos.current); setAproposOpen(true) }}
            onMouseLeave={() => { closeTimerApropos.current = setTimeout(() => setAproposOpen(false), 150) }}
          >
            <Link
              to="/a-propos"
              className={`font-body font-bold text-base text-surface hover:text-accent transition-colors inline-flex items-center gap-1 ${isOnApropos ? 'underline underline-offset-4' : ''}`}
            >
              À propos<IoChevronDownSharp className="text-xs" />
            </Link>
            {aproposOpen && (
              <div className="absolute top-full left-0 mt-2 bg-primary rounded-xl shadow-lg py-2 min-w-48 z-20">
                {APROPOS.map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`block px-5 py-2 font-body text-sm text-surface hover:text-accent transition-colors ${location.pathname === item.href ? 'text-accent' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notre impact */}
          <Link to="/notre-impact" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/notre-impact' ? 'underline underline-offset-4' : ''}`}>
            Notre impact
          </Link>

          {/* Éducation */}
          <Link to="/actions-educatives" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/actions-educatives' ? 'underline underline-offset-4' : ''}`}>
            Éducation & sensibilisation
          </Link>

          {/* Médias */}
          <Link to="/medias-et-actualites" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/medias-et-actualites' ? 'underline underline-offset-4' : ''}`}>
            Médias & actualités
          </Link>

          {/* Contact */}
          <Link to="/contact" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/contact' ? 'underline underline-offset-4' : ''}`}>
            Contact
          </Link>

        </div>

        {/* ── Actions droite ── */}
        <div className="flex items-center gap-4">

          {/* Langue — desktop uniquement */}
          <button className="hidden lg:inline-flex font-bold text-surface hover:text-accent transition-colors items-center gap-1">
            FR<IoChevronDownSharp className="text-xs" />
          </button>

          {/* Faire un don — toujours visible */}
          <Link to="/soutenir">
            <Button label="Faire un don" variant="primary" />
          </Link>

          {/* Burger — mobile uniquement */}
          <button
            className="lg:hidden text-surface text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <IoCloseSharp /> : <IoMenuSharp />}
          </button>

        </div>
      </nav>

      {/* ── Menu mobile — pleine largeur, s'ouvre vers le bas ── */}
      {mobileOpen && (
        <div className="fixed top-20 left-0 w-full bg-primary z-40 flex flex-col py-6 px-6 gap-1 lg:hidden overflow-y-auto max-h-[calc(100vh-5rem)]">

          {/* Accueil */}
          <Link to="/" onClick={handleMobileNav} className="font-body font-bold text-surface py-3 border-b border-surface/10">
            Accueil
          </Link>

          {/* Nos missions — accordéon */}
          <div>
            <button
              onClick={() => setMobileMissionsOpen(!mobileMissionsOpen)}
              className="w-full flex items-center justify-between font-body font-bold text-surface py-3 border-b border-surface/10"
            >
              Nos missions
              <IoChevronDownSharp className={`transition-transform ${mobileMissionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileMissionsOpen && (
              <div className="flex flex-col pl-4 py-2 gap-1">
                <Link to="/missions" onClick={handleMobileNav} className="font-body text-sm text-surface/80 hover:text-accent py-2">
                  Toutes les missions
                </Link>
                {MISSIONS.map(m => (
                  <Link
                    key={m.slug}
                    to={`/missions/${m.slug}`}
                    onClick={handleMobileNav}
                    className="font-body text-sm text-surface/80 hover:text-accent py-2"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* À propos — accordéon */}
          <div>
            <button
              onClick={() => setMobileAproposOpen(!mobileAproposOpen)}
              className="w-full flex items-center justify-between font-body font-bold text-surface py-3 border-b border-surface/10"
            >
              À propos
              <IoChevronDownSharp className={`transition-transform ${mobileAproposOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileAproposOpen && (
              <div className="flex flex-col pl-4 py-2 gap-1">
                {APROPOS.map(item => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleMobileNav}
                    className="font-body text-sm text-surface/80 hover:text-accent py-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notre impact */}
          <Link to="/notre-impact" onClick={handleMobileNav} className="font-body font-bold text-surface py-3 border-b border-surface/10">
            Notre impact
          </Link>

          {/* Éducation */}
          <Link to="/actions-educatives" onClick={handleMobileNav} className="font-body font-bold text-surface py-3 border-b border-surface/10">
            Éducation & sensibilisation
          </Link>

          {/* Médias */}
          <Link to="/medias-et-actualites" onClick={handleMobileNav} className="font-body font-bold text-surface py-3 border-b border-surface/10">
            Médias & actualités
          </Link>

          {/* Contact */}
          <Link to="/contact" onClick={handleMobileNav} className="font-body font-bold text-surface py-3 border-b border-surface/10">
            Contact
          </Link>

          {/* Langue */}
          <button className="font-body font-bold text-surface py-3 text-left">
            FR / EN
          </button>

        </div>
      )}
    </>
  )
}

export default Navbar