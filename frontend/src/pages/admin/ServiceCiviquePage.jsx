// ════════════════════════════════════════════════════════════════
// pages/admin/ServiceCiviquePage.jsx
// Page dashboard — liste et gestion des missions Service Civique
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAdminMissions, deleteMission, hardDeleteMission } from '../../services/api'
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'

const COLUMNS = [
  { key: 'title',   label: 'Titre' },
  { key: 'country', label: 'Pays'  },
  {
    key: 'is_active',
    label: 'Statut',
    render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        row.is_active
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-500'
      }`}>
        {row.is_active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
]

function ServiceCiviquePage() {
  const navigate = useNavigate()

  const [missions, setMissions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [missionToHardDelete, setMissionToHardDelete] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const data = await fetchAdminMissions(controller.signal)
        setMissions(data.filter(m => m.type === 'service_civique'))
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Erreur chargement missions Service Civique :', err)
        setError('Impossible de charger les missions.')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  const reloadMissions = async () => {
    try {
      const data = await fetchAdminMissions()
      setMissions(data.filter(m => m.type === 'service_civique'))
    } catch (err) {
      console.error('Erreur rechargement missions Service Civique :', err)
      setError('Impossible de recharger les missions.')
    }
  }

  const handleCreate = () => navigate('/admin/service-civique/new')
  const handleEdit = (mission) => navigate(`/admin/service-civique/${mission.id}/edit`)

  const handleDelete = async (mission) => {
    const confirmed = window.confirm(
      `Rendre invisible la mission "${mission.title}" ?\n\nElle disparaîtra du site mais reste récupérable.`
    )
    if (!confirmed) return

    try {
      await deleteMission(mission.id)
      await reloadMissions()
    } catch (err) {
      console.error('Erreur suppression mission :', err)
      alert('Échec de la suppression. Réessaie.')
    }
  }

  const handleHardDelete = (mission) => {
    setMissionToHardDelete(mission)
  }

  const confirmHardDelete = async () => {
    try {
      await hardDeleteMission(missionToHardDelete.id)
      await reloadMissions()
    } catch (err) {
      console.error('Erreur suppression définitive :', err)
      alert('Échec de la suppression définitive. Réessaie.')
    } finally {
      setMissionToHardDelete(null)
    }
  }

  if (loading) return <p className="text-gray-400 text-sm italic p-8">Chargement...</p>
  if (error)   return <p className="text-red-500 text-sm p-8">{error}</p>

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-2xl text-primary">Service Civique</h1>
        <button
          onClick={handleCreate}
          className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Ajouter une mission
        </button>
      </div>

      <DashboardTable
        columns={COLUMNS}
        data={missions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onHardDelete={handleHardDelete}
      />

      {missionToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Supprimer DÉFINITIVEMENT la mission "${missionToHardDelete.title}" ?\n\nCette action est irréversible : la mission et ses photos seront perdues pour toujours.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmHardDelete}
          onCancel={() => setMissionToHardDelete(null)}
        />
      )}
    </div>
  )
}

export default ServiceCiviquePage