// ConfirmModal.jsx
// Modale de confirmation générique — s'appuie sur DashboardModal pour la coquille.
// variant : 'danger' (rouge, défaut) | 'warning' (orange) | 'success' (vert).

import DashboardModal from './DashboardModal'

const VARIANT_STYLES = {
  danger: {
    title: 'text-dash-danger',
    button: 'bg-dash-danger hover:bg-dash-danger/90',
  },
  warning: {
    title: 'text-dash-warning',
    button: 'bg-dash-warning hover:bg-dash-warning/90',
  },
  success: {
    title: 'text-dash-success',
    button: 'bg-dash-success hover:bg-dash-success/90',
  },
}

function ConfirmModal({ title, message, confirmLabel = 'Confirmer', onConfirm, onCancel, variant = 'danger' }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.danger

  return (
    <DashboardModal title={title} titleClassName={`text-center ${styles.title}`}>
      <p className="text-sm text-dash-legend whitespace-pre-line">
        {message}
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-dash-legend hover:bg-gray-100 rounded-lg"
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
    </DashboardModal>
  )
}

export default ConfirmModal