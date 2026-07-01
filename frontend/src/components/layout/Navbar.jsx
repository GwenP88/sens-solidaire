// ════════════════════════════════════════════════════════════════
// Navbar.jsx
// Barre de navigation principale — transparente sur le Hero
// Responsive : burger menu mobile + dropdowns desktop (survol ET clic)
// ════════════════════════════════════════════════════════════════

// ── React
import { useState, useRef } from 'react'

// ── Router
import { useLocation, Link } from 'react-router-dom'

// ── Composants UI
import Button from '../ui/Button'

// ── Icônes
import { GrHomeRounded } from 'react-icons/gr'
import { IoChevronDownSharp, IoCloseSharp, IoMenuSharp } from 'react-icons/io5'


// ════════════════════════════════════════════════════════════════
// DONNÉES STATIQUES
// ════════════════════════════════════════════════════════════════

const MISSIONS = [
  { label: "Kenya", slug: "volontariat-kenya-environnement-biodiversite" },
  { label: "Sénégal", slug: "volontariat-senegal-casamance-agroecologie-mangrove" },
  { label: "Pérou", slug: "volontariat-perou-amazonie-biodiversite" },
  { label: "Sri Lanka", slug: "volontariat-sri-lanka-elephant-environnement" },
  { label: "Sumatra", slug: "volontariat-sumatra-biodiversite-orang-outan" },
]

const APROPOS = [
  { label: "Notre association", href: "/a-propos" },
  { label: "Notre équipe", href: "/equipe" },
]


function Navbar() {
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileMissionsOpen, setMobileMissionsOpen] = useState(false)
  const [mobileAproposOpen, setMobileAproposOpen] = useState(false)
  const [missionsOpen, setMissionsOpen] = useState(false)
  const [aproposOpen, setAproposOpen] = useState(false)
  const closeTimer = useRef(null)
  const closeTimerApropos = useRef(null)

  const isOnMissions = location.pathname.startsWith('/missions')
  const isOnApropos = location.pathname.startsWith('/a-propos') || location.pathname.startsWith('/equipe')

  const handleMobileNav = () => {
    setMobileOpen(false)
    setMobileMissionsOpen(false)
    setMobileAproposOpen(false)
  }

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          BARRE PRINCIPALE
          Note : px-4 lg:px-8 xl:px-16 volontairement différent de padding-x
          la navbar a besoin de moins de marge pour ne pas étouffer les liens
          ════════════════════════════════════════════════════════════════ */}
      <nav className="w-full flex items-center justify-between px-4 lg:px-8 xl:px-16 h-20 bg-transparent absolute top-0 left-0 z-10">

        <Link to="/">
          <div className="bg-white/40 rounded-full p-1">
            <img src="/logo.png" alt="Sens Solidaire" className="h-12 md:h-14" />
          </div>
        </Link>

        {/* ────────────────────────────────────────────────────────────
            LIENS DESKTOP
            ──────────────────────────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-sm xl:gap-lg">

          <Link to="/" className={`link-nav text-surface hover:text-accent font-bold ${location.pathname === '/' ? 'underline underline-offset-4' : ''}`}>
            <GrHomeRounded />
          </Link>

          {/* ── DROPDOWN "NOS MISSIONS" ── */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => { clearTimeout(closeTimer.current); setMissionsOpen(true) }}
            onMouseLeave={() => { closeTimer.current = setTimeout(() => setMissionsOpen(false), 150) }}
          >
            <Link
              to="/missions"
              onClick={(e) => { e.preventDefault(); setMissionsOpen(prev => !prev) }}
              className={`link-nav text-surface hover:text-accent font-bold inline-flex items-center gap-xs ${isOnMissions ? 'underline underline-offset-4' : ''}`}
            >
              Nos missions<IoChevronDownSharp className="text-xs" />
            </Link>
            {missionsOpen && (
              <div className="absolute top-full left-0 mt-2 bg-primary rounded-xl shadow-lg py-2 min-w-48 z-20">
                <Link to="/missions" onClick={() => setMissionsOpen(false)} className="block px-5 py-2 link-nav text-surface hover:text-accent border-b border-surface/10">
                  Toutes les missions
                </Link>
                {MISSIONS.map(m => (
                  <Link key={m.slug} to={`/missions/${m.slug}`} onClick={() => setMissionsOpen(false)} className={`block px-5 py-2 link-nav text-surface hover:text-accent ${location.pathname === `/missions/${m.slug}` ? 'text-accent' : ''}`}>
                    {m.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── DROPDOWN "À PROPOS" ── */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => { clearTimeout(closeTimerApropos.current); setAproposOpen(true) }}
            onMouseLeave={() => { closeTimerApropos.current = setTimeout(() => setAproposOpen(false), 150) }}
          >
            <Link
              to="/a-propos"
              onClick={(e) => { e.preventDefault(); setAproposOpen(prev => !prev) }}
              className={`link-nav text-surface hover:text-accent font-bold inline-flex items-center gap-xs ${isOnApropos ? 'underline underline-offset-4' : ''}`}
            >
              À propos<IoChevronDownSharp className="text-xs" />
            </Link>
            {aproposOpen && (
              <div className="absolute top-full left-0 mt-2 bg-primary rounded-xl shadow-lg py-2 min-w-48 z-20">
                {APROPOS.map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setAproposOpen(false)} className={`block px-5 py-2 link-nav text-surface hover:text-accent ${location.pathname === item.href ? 'text-accent' : ''}`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/notre-impact" className={`link-nav text-surface hover:text-accent font-bold ${location.pathname === '/notre-impact' ? 'underline underline-offset-4' : ''}`}>Notre impact</Link>
          <Link to="/actions-educatives" className={`link-nav text-surface hover:text-accent font-bold ${location.pathname === '/actions-educatives' ? 'underline underline-offset-4' : ''}`}>Éducation & sensibilisation</Link>
          <Link to="/medias-et-actualites" className={`link-nav text-surface hover:text-accent font-bold ${location.pathname === '/medias-et-actualites' ? 'underline underline-offset-4' : ''}`}>Médias & actualités</Link>
          <Link to="/contact" className={`link-nav text-surface hover:text-accent font-bold ${location.pathname === '/contact' ? 'underline underline-offset-4' : ''}`}>Contact</Link>

        </div>

        {/* ── ACTIONS DROITE ── */}
        <div className="flex items-center gap-sm">
          <button className="hidden lg:inline-flex link-nav text-surface hover:text-accent font-bold items-center gap-xs">
            FR<IoChevronDownSharp className="text-xs" />
          </button>
          <Link to="/soutenir">
            <Button label="Faire un don" variant="primary" />
          </Link>
          <button
            className="lg:hidden text-surface text-2xl"
            onClick={() => { if (mobileOpen) { setMobileMissionsOpen(false); setMobileAproposOpen(false) } setMobileOpen(!mobileOpen) }}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <IoCloseSharp /> : <IoMenuSharp />}
          </button>
        </div>

      </nav>

      {/* ════════════════════════════════════════════════════════════════
          MENU MOBILE
          padding-x pour cohérence horizontale avec le reste du site
          ════════════════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed top-20 left-0 w-screen overflow-x-hidden bg-primary z-40 flex flex-col py-6 padding-x gap-xs lg:hidden overflow-y-auto max-h-[calc(100vh-5rem)]">

          <Link to="/" onClick={handleMobileNav} className="link-nav text-surface font-bold py-3 border-b border-surface/10">Accueil</Link>

          {/* ── ACCORDÉON "NOS MISSIONS" ── */}
          <div>
            <button onClick={() => setMobileMissionsOpen(!mobileMissionsOpen)} className="w-full flex items-center justify-between link-nav text-surface font-bold py-3 border-b border-surface/10">
              Nos missions
              <IoChevronDownSharp className={`transition-transform ${mobileMissionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileMissionsOpen && (
              <div className="flex flex-col pl-4 py-2 gap-xs">
                <Link to="/missions" onClick={handleMobileNav} className="link-nav text-surface/80 hover:text-accent py-2">Toutes les missions</Link>
                {MISSIONS.map(m => (
                  <Link key={m.slug} to={`/missions/${m.slug}`} onClick={handleMobileNav} className="link-nav text-surface/80 hover:text-accent py-2">{m.label}</Link>
                ))}
              </div>
            )}
          </div>

          {/* ── ACCORDÉON "À PROPOS" ── */}
          <div>
            <button onClick={() => setMobileAproposOpen(!mobileAproposOpen)} className="w-full flex items-center justify-between link-nav text-surface font-bold py-3 border-b border-surface/10">
              À propos
              <IoChevronDownSharp className={`transition-transform ${mobileAproposOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileAproposOpen && (
              <div className="flex flex-col pl-4 py-2 gap-xs">
                {APROPOS.map(item => (
                  <Link key={item.href} to={item.href} onClick={handleMobileNav} className="link-nav text-surface/80 hover:text-accent py-2">{item.label}</Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/notre-impact" onClick={handleMobileNav} className="link-nav text-surface font-bold py-3 border-b border-surface/10">Notre impact</Link>
          <Link to="/actions-educatives" onClick={handleMobileNav} className="link-nav text-surface font-bold py-3 border-b border-surface/10">Éducation & sensibilisation</Link>
          <Link to="/medias-et-actualites" onClick={handleMobileNav} className="link-nav text-surface font-bold py-3 border-b border-surface/10">Médias & actualités</Link>
          <Link to="/contact" onClick={handleMobileNav} className="link-nav text-surface font-bold py-3 border-b border-surface/10">Contact</Link>

          <button className="link-nav text-surface font-bold py-3 text-left">FR / EN</button>

        </div>
      )}

    </>
  )
}

export default Navbar