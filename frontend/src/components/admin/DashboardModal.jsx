// DashboardModal.jsx
// Coquille commune à toutes les modales du dashboard — fond assombri + carte
// blanche centrée. Réutilisée par ConfirmModal et toute modale contenant un
// vrai formulaire (ex: DelegationEditModal).

function DashboardModal({ title, titleClassName = 'text-dash-title', children, maxWidth = 'max-w-md' }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-xl w-full ${maxWidth} p-6 flex flex-col gap-4`}>
        {title && (
          <h2 className={`font-heading font-bold text-lg ${titleClassName}`}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}

export default DashboardModal