// DashboardModal.jsx
// Coquille commune à toutes les modales du dashboard — fond assombri + carte
// blanche centrée. Réutilisée par ConfirmModal et toute modale contenant un
// vrai formulaire (ex: DelegationEditModal).

// ── React
import { useEffect, useId, useRef } from 'react'

function DashboardModal({ title, titleClassName = 'text-dash-title', children, maxWidth = 'max-w-md' }) {
  const titleId = useId()          // relie la fenêtre à son titre (aria-labelledby)
  const dialogRef = useRef(null)

  // ── Accessibilité (tâche 173) : focus placé dans la modale à l'ouverture (sauf si un champ l'a déjà,
  // ex. autoFocus), puis rendu à l'élément d'origine à la fermeture
  useEffect(() => {
    const previous = document.activeElement
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus()
    return () => previous?.focus?.()
  }, [])

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} p-6 flex flex-col gap-4 outline-none`}
      >
        {title && (
          <h2 id={titleId} className={`font-heading font-bold text-lg ${titleClassName}`}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}

export default DashboardModal
