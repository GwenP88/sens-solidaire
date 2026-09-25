// ════════════════════════════════════════════════════════════════
// pages/admin/FieldActionsPage.jsx
// Liste et gestion des actions terrain
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAdminFieldActions, toggleFieldActionActive, hardDeleteFieldAction } from '../../services/api'
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'

const COLUMNS = [
  { key: 'title', label: 'Titre' },
  {
    key: 'countries',
    label: 'Pays',
    render: (row) => row.countries.map(c => c.country).join(', ') || '—',
  },
  {
    key: 'tags',
    label: 'Thèmes (déduits des ODD)',
    render: (row) => row.tags.map(t => t.tag).join(', ') || '—',
  },
  {
    key: 'is_active',
    label: 'Statut',
    render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        row.is_active ? 'bg-dash-success/10 text-dash-success' : 'bg-dash-warning/10 text-dash-warning'
      }`}>
        {row.is_active ? 'Actif' : 'Inactif'}
      </span>
    ),
  },
]

function FieldActionsPage() {
  const navigate = useNavigate()

  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionToHardDelete, setActionToHardDelete] = useState(null)
  const [actionToTogglePause, setActionToTogglePause] = useState(null)

  const load = async () => {
    try {
      const data = await fetchAdminFieldActions()
      setActions(data)
    } catch (err) {
      console.error('Erreur chargement actions terrain :', err)
      setError('Impossible de charger les actions terrain.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = () => navigate('/admin/actions-terrain/new')
  const handleEdit = (action) => navigate(`/admin/actions-terrain/${action.id}/edit`)

  const confirmTogglePause = async () => {
    try {
      await toggleFieldActionActive(actionToTogglePause.id, !actionToTogglePause.is_active)
      await load()
    } catch (err) {
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setActionToTogglePause(null)
    }
  }

  const confirmHardDelete = async () => {
    try {
      await hardDeleteFieldAction(actionToHardDelete.id)
      await load()
    } catch (err) {
      alert('Échec de la suppression. Réessaie.')
    } finally {
      setActionToHardDelete(null)
    }
  }

  if (loading) return <p className="text-dash-legend text-sm italic">Chargement...</p>
  if (error)   return <p className="text-dash-danger text-sm">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dash-title">Actions terrain</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
        >
          + Ajouter une action
        </button>
      </div>

      <DashboardTable
        columns={COLUMNS}
        data={actions}
        onEdit={handleEdit}
        onDelete={(action) => setActionToTogglePause(action)}
        onHardDelete={(action) => setActionToHardDelete(action)}
      />

      {actionToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Voulez-vous supprimer définitivement "${actionToHardDelete.title}" ?\n\nCette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmHardDelete}
          onCancel={() => setActionToHardDelete(null)}
        />
      )}

      {actionToTogglePause && (
        <ConfirmModal
          variant={actionToTogglePause.is_active ? 'warning' : 'success'}
          title={actionToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          message={
            actionToTogglePause.is_active
              ? `Mettre en pause "${actionToTogglePause.title}" ?\n\nElle deviendra invisible sur le site, mais reste récupérable.`
              : `Réactiver "${actionToTogglePause.title}" ?\n\nElle redeviendra visible sur le site.`
          }
          confirmLabel={actionToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          onConfirm={confirmTogglePause}
          onCancel={() => setActionToTogglePause(null)}
        />
      )}
    </div>
  )
}

export default FieldActionsPage