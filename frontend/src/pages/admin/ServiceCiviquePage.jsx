// ════════════════════════════════════════════════════════════════
// pages/admin/ServiceCiviquePage.jsx
// Page dashboard — liste et gestion des missions Service Civique
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAdminMissions, deleteMission, updateMission, hardDeleteMission } from '../../services/api'
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
          : 'bg-gray-100 text-dash-legend'
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
  const [missionToTogglePause, setMissionToTogglePause] = useState(null)

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

  const handleDelete = (mission) => {
    setMissionToTogglePause(mission)
  }

  const confirmTogglePause = async () => {
    try {
      if (missionToTogglePause.is_active) {
        await deleteMission(missionToTogglePause.id)
      } else {
        await updateMission(missionToTogglePause.id, { is_active: true })
      }
      await reloadMissions()
    } catch (err) {
      console.error('Erreur changement de statut :', err)
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setMissionToTogglePause(null)
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

  if (loading) return <p className="text-dash-legend text-sm italic p-8">Chargement...</p>
  if (error)   return <p className="text-red-500 text-sm p-8">{error}</p>

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading font-bold text-2xl text-dash-title">Service Civique</h1>
        <button
          onClick={handleCreate}
          className="px-5 py-2 text-sm font-medium bg-dash-action text-white rounded-lg hover:bg-dash-action/90 transition-colors"
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

      {missionToTogglePause && (
        <ConfirmModal
          variant={missionToTogglePause.is_active ? 'warning' : 'success'}
          title={missionToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          message={
            missionToTogglePause.is_active
              ? `Mettre en pause la mission "${missionToTogglePause.title}" ?\n\nElle disparaîtra du site, mais reste récupérable.`
              : `Réactiver la mission "${missionToTogglePause.title}" ?\n\nElle redeviendra visible sur le site.`
          }
          confirmLabel={missionToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          onConfirm={confirmTogglePause}
          onCancel={() => setMissionToTogglePause(null)}
        />
      )}
    </div>
  )
}

export default ServiceCiviquePage