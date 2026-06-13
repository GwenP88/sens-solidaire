// Navbar.jsx
// Barre de navigation principale — transparente sur le Hero
import { useState, useRef } from 'react'
import Button from '../ui/Button'
import { useLocation } from 'react-router-dom'
import { GrHomeRounded } from "react-icons/gr"
import { IoChevronDownSharp } from "react-icons/io5"

// Liste des missions pour le dropdown — à mettre à jour si nouvelles missions
const MISSIONS = [
  { label: "Kenya", slug: "volontariat-kenya-environnement-biodiversite" },
  { label: "Sénégal", slug: "volontariat-senegal-casamance-agroecologie-mangrove" },
  { label: "Pérou", slug: "volontariat-perou-amazonie-biodiversite" },
  { label: "Sri Lanka", slug: "volontariat-sri-lanka-elephant-environnement" },
  { label: "Sumatra", slug: "volontariat-sumatra-biodiversite-orang-outan" },
]

function Navbar() {
  const location = useLocation()

  // État d'ouverture du dropdown missions
  const [missionsOpen, setMissionsOpen] = useState(false)

  // Vérifie si le chemin courant correspond à une page mission
  const isOnMissions = location.pathname.startsWith('/missions')

  // Timer de fermeture du dropdown — évite la fermeture intempestive au passage de la souris
  const closeTimer = useRef(null)

  return (
    <nav className="w-full flex items-center justify-between px-16 h-20 bg-transparent absolute top-0 left-0 z-10">

      {/* Logo */}
      <div className="bg-white/40 rounded-full p-1">
        <img src="/Logo.png" alt="Sens Solidaire" className="h-14" />
      </div>

      {/* Liens navigation */}
      <div className="flex items-center gap-8">

        {/* Accueil */}
        <a
          href="/"
          className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/' ? 'underline underline-offset-4' : ''}`}
        >
          <GrHomeRounded />
        </a>

        {/* Nos missions — dropdown au survol */}
        <div
          className="relative"
          onMouseEnter={() => {
            clearTimeout(closeTimer.current)
            setMissionsOpen(true)
          }}

          // Ferme après 150ms — laisse le temps de passer sur le dropdown
          onMouseLeave={() => {
            closeTimer.current = setTimeout(() => setMissionsOpen(false), 150)
          }}
        >
          <a
            href="/missions"
            className={`font-body font-bold text-base text-surface hover:text-accent transition-colors inline-flex items-center gap-1 ${isOnMissions ? 'underline underline-offset-4' : ''}`}
          >
            Nos missions<IoChevronDownSharp className="text-xs" />
          </a>

          {/* Menu déroulant */}
          {missionsOpen && (
            <div className="absolute top-full left-0 mt-2 bg-primary rounded-xl shadow-lg py-2 min-w-48 z-20">

              {/* Lien vers la page liste complète */}
              <a
                href="/missions"
                className="block px-5 py-2 font-body text-sm text-surface hover:text-accent transition-colors border-b border-surface/10"
              >
                Toutes les missions
              </a>

              {/* Liens vers chaque page détail */}
              {MISSIONS.map((m) => (
                <a
                  key={m.slug}
                  href={`/missions/${m.slug}`}
                  className={`block px-5 py-2 font-body text-sm text-surface hover:text-accent transition-colors ${location.pathname === `/missions/${m.slug}` ? 'text-accent' : ''}`}
                >
                  {m.label}
                </a>
              ))}

            </div>
          )}
        </div>

        {/* À propos */}
        <a
          href="/a-propos"
          className={`font-body font-bold text-base text-surface hover:text-accent transition-colors inline-flex items-center gap-1 ${location.pathname === '/a-propos' ? 'underline underline-offset-4' : ''}`}
        >
          À propos<IoChevronDownSharp className="text-xs" />
        </a>

        {/* Notre impact */}
        <a
          href="/notre-impact"
          className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/notre-impact' ? 'underline underline-offset-4' : ''}`}
        >
          Notre impact
        </a>

        {/* Actions éducatives */}
        <a
          href="/actions-educatives"
          className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/actions-educatives' ? 'underline underline-offset-4' : ''}`}
        >
          Actions éducatives
        </a>

        {/* Médias & actualités */}
        <a
          href="/medias-et-actualites"
          className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/medias-et-actualites' ? 'underline underline-offset-4' : ''}`}
        >
          Médias & actualités
        </a>

        {/* Contact */}
        <a
          href="/contact"
          className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/contact' ? 'underline underline-offset-4' : ''}`}
        >
          Contact
        </a>

      </div>

      {/* Actions droite — langue + CTA */}
      <div className="flex items-center gap-4">
        <button className="font-bold text-surface hover:text-accent transition-colors inline-flex items-center gap-1">
          FR<IoChevronDownSharp className="text-xs" />
        </button>
        <Button label="Faire un don" variant="primary" />
      </div>

    </nav>
  )
}

export default Navbar