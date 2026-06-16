import { FiArrowUpCircle } from 'react-icons/fi'

function ScrollToTop() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 bg-primary text-surface w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-accent transition-colors"
      aria-label="Retour en haut de page"
    >
      <FiArrowUpCircle className="text-2xl" />
    </button>
  )
}

export default ScrollToTop