// Navbar.jsx
// Barre de navigation principale — transparente sur le Hero
import Button from '../ui/Button'
// useLocation — permet de détecter la page active pour souligner le lien correspondant
import { useLocation } from 'react-router-dom'
import { GrHomeRounded } from "react-icons/gr"
import { IoChevronDownSharp } from "react-icons/io5"

function Navbar() {
  const location = useLocation()
  return (
    <nav className={`w-full flex items-center justify-between px-16 h-20 bg-primary absolute top-0 left-0 z-10`}>
      <div className="bg-white/40 rounded-full p-1">
        <img src="/Logo.png" alt="Sens Solidaire" className="h-14" />
      </div>
      <div className="flex items-center gap-8">
        <a href="/" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/' ? 'underline underline-offset-4' : ''}`}><GrHomeRounded /></a>
        <a href="/missions" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors inline-flex items-center gap-1 ${location.pathname === '/missions' ? 'underline underline-offset-4' : ''}`}>Nos missions<IoChevronDownSharp className="text-xs" /></a>
        <a href="/a-propos" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors inline-flex items-center gap-1 ${location.pathname === '/a-propos' ? 'underline underline-offset-4' : ''}`}>À propos<IoChevronDownSharp className="text-xs" /></a>
        <a href="/notre-impact" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/notre-impact' ? 'underline underline-offset-4' : ''}`}>Notre impact</a>
        <a href="/actions-educatives" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/actions-educatives' ? 'underline underline-offset-4' : ''}`}>Actions éducatives</a>
        <a href="/medias-et-actualites" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/medias-et-actualites' ? 'underline underline-offset-4' : ''}`}>Médias & actualités</a>
        <a href="/contact" className={`font-body font-bold text-base text-surface hover:text-accent transition-colors ${location.pathname === '/contact' ? 'underline underline-offset-4' : ''}`}>Contact</a>
      </div>
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