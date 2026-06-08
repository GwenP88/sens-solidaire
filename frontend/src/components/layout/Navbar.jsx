// Navbar.jsx
// Barre de navigation principale — transparente sur le Hero
import Button from '../ui/Button'

function Navbar() {
  return (
    <nav className={`w-full flex items-center justify-between px-16 h-20 bg-primary absolute top-0 left-0 z-10`}>
      <div className="bg-white/40 rounded-full p-1">
        <img src="/Logo.png" alt="Sens Solidaire" className="h-14" />
      </div>
      <div className="flex items-center gap-8">
        <a href="/" className="font-body text-surface font-body font-bold text-base hover:text-accent transition-colors">Accueil</a>
        <a href="/missions" className="font-body text-surface font-body font-bold text-base hover:text-accent transition-colors">Nos missions</a>
        <a href="/a-propos" className="font-body text-surface font-body font-bold text-base hover:text-accent transition-colors">À propos</a>
        <a href="/notre-impact" className="font-body text-surface font-body font-bold text-base hover:text-accent transition-colors">Notre impact</a>
        <a href="/nos-actions-educatives" className="font-body text-surface font-body font-bold text-base hover:text-accent transition-colors">Actions éducatives</a>
        <a href="/medias-et-actualites" className="font-body text-surface font-body font-bold text-base hover:text-accent transition-colors">Médias & actualités</a>
        <a href="/contact" className="font-body text-surface font-body font-bold text-base hover:text-accent transition-colors">Contact</a>
      </div>
      <div className="flex items-center gap-4">
        <button className="font-body text-surface hover:text-accent transition-colors">
          FR
        </button>
        <Button label="Faire un don" variant="primary" />
      </div>
    </nav>
  )
}

export default Navbar