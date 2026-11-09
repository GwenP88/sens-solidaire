// Modal.jsx
// Modale générique réutilisable — s'ouvre/ferme via prop isOpen + onClose
// size : 'default' (défaut, lg→2xl→6xl) | 'small' (lg fixe, pour un contenu léger)
// Accessibilité (tâche 173) : annoncée comme fenêtre de dialogue, focus placé dedans à l'ouverture
// puis rendu à l'élément d'origine à la fermeture.

// ── React
import { useEffect, useId, useRef } from 'react'

// ── Icônes
import { IoCloseOutline } from 'react-icons/io5'

const SIZE_CLASSES = {
  default: 'max-w-lg md:max-w-2xl lg:max-w-6xl',
  small: 'max-w-lg',
}

const TITLE_SIZE_CLASSES = {
  default: 'h2-style',
  small: 'h3-style',
}

function Modal({ isOpen, onClose, title, children, size = 'default' }) {
  const titleId = useId()          // relie la fenêtre à son titre (aria-labelledby)
  const dialogRef = useRef(null)

  // ── Focus : entre dans la modale à l'ouverture, revient au bouton qui l'a ouverte à la fermeture
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement
    dialogRef.current?.focus()
    return () => previous?.focus?.()
  }, [isOpen])

  // ── Fermeture avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // ── Bloque le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // ── Overlay — clic en dehors ferme la modale
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-8 lg:p-12"
      onClick={onClose}
    >
      {/* Contenu — stoppe la propagation du clic */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`bg-surface rounded-2xl shadow-xl w-full ${SIZE_CLASSES[size]} p-8 relative max-h-[90vh] overflow-y-auto outline-none`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — bouton fermer en position absolue pour pouvoir centrer le titre */}
        <div className="relative mb-4">
          <h2 id={titleId} className={`${TITLE_SIZE_CLASSES[size]} text-primary text-center pr-8`}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-0 right-0 text-primary/40 hover:text-primary transition-colors"
            aria-label="Fermer"
          >
            <IoCloseOutline aria-hidden="true" className="text-2xl" />
          </button>
        </div>

        {/* Contenu injecté via children */}
        {children}

      </div>
    </div>
  )
}

export default Modal