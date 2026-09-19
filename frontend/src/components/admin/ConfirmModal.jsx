// ConfirmModal.jsx
// Modale de confirmation générique — remplace window.confirm avec le style du dashboard.
// variant : 'danger' (rouge, action irréversible/destructive — défaut, inchangé pour la
// suppression) | 'default' (vert primary, action neutre/réversible — ex: mise en pause).

const VARIANT_STYLES = {
  danger: {
    title: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700',
  },
  default: {
    title: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700',
  },
}

function ConfirmModal({ title, message, confirmLabel = 'Confirmer', onConfirm, onCancel, variant = 'danger' }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.danger

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className={`font-heading font-bold text-lg text-center mb-6 ${styles.title}`}>
          {title}
        </h2>
        <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded-lg ${styles.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal