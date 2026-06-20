// Modal.jsx
// Modale générique réutilisable — s'ouvre/ferme via prop isOpen + onClose

// ── React
import { useEffect } from 'react'

// ── Composants UI
import { IoCloseOutline } from 'react-icons/io5'

function Modal({ isOpen, onClose, title, children }) {

  // Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Bloque le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Overlay — clic en dehors ferme la modale
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Contenu — stoppe la propagation du clic */}
      <div
        className="bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-primary text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="text-primary/40 hover:text-primary transition-colors"
            aria-label="Fermer"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        {/* Contenu injecté via children */}
        {children}

      </div>
    </div>
  )
}

export default Modal