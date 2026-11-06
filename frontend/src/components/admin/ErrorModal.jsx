// ErrorModal.jsx
// Modale d'erreur du dashboard (remplace les alert()) — s'appuie sur DashboardModal, un seul bouton « Fermer ».

import DashboardModal from './DashboardModal'

function ErrorModal({ title = 'Une erreur est survenue', message, onClose }) {
  return (
    <DashboardModal title={title} titleClassName="text-center text-dash-danger">
      <p className="text-sm text-dash-legend whitespace-pre-line">
        {message}
      </p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          autoFocus
          className="px-4 py-2 text-sm text-white rounded-lg bg-dash-action hover:bg-dash-action/90"
        >
          Fermer
        </button>
      </div>
    </DashboardModal>
  )
}

export default ErrorModal
