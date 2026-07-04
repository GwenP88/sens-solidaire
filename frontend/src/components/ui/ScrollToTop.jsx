// ScrollToTop.jsx
// Bouton fixe retour en haut de page — affiché sur toutes les pages longues

// ── Icônes
import { FiArrowUpCircle } from 'react-icons/fi'

function ScrollToTop() {
  // ── Scroll doux vers le haut de la page
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    // ── Bouton fixe en bas à droite — z-index élevé pour passer au-dessus du contenu
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 bg-accent text-surface w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-accent transition-colors"
      aria-label="Retour en haut de page"
    >
      <FiArrowUpCircle className="text-2xl" />
    </button>
  )
}

export default ScrollToTop