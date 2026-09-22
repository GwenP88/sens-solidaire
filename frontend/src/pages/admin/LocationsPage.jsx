// ════════════════════════════════════════════════════════════════
// pages/admin/LocationsPage.jsx
// Liste et gestion des lieux partenaires
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAdminLocations, toggleLocationActive, hardDeleteLocation } from '../../services/api'
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'

const COLUMNS = [
  { key: 'name', label: 'Nom' },
  { key: 'country', label: 'Pays' },
  {
    key: 'delegation',
    label: 'Délégation',
    render: (row) => row.delegation ? row.delegation.lieu : <span className="text-dash-legend">—</span>,
  },
  {
    key: 'is_active',
    label: 'Statut',
    render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        row.is_active
          ? 'bg-dash-success/10 text-dash-success'
          : 'bg-dash-warning/10 text-dash-warning'
      }`}>
        {row.is_active ? 'Actif' : 'Inactif'}
      </span>
    ),
  },
]

function LocationsPage() {
  const navigate = useNavigate()

  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [locationToHardDelete, setLocationToHardDelete] = useState(null)
  const [locationToTogglePause, setLocationToTogglePause] = useState(null)

  const load = async () => {
    try {
      const data = await fetchAdminLocations()
      setLocations(data)
    } catch (err) {
      console.error('Erreur chargement lieux :', err)
      setError('Impossible de charger les lieux.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = () => navigate('/admin/lieux/new')
  const handleEdit = (location) => navigate(`/admin/lieux/${location.id}/edit`)

  const handleTogglePause = (location) => {
    setLocationToTogglePause(location)
  }

  const confirmTogglePause = async () => {
    try {
      await toggleLocationActive(locationToTogglePause.id, !locationToTogglePause.is_active)
      await load()
    } catch (err) {
      console.error('Erreur changement statut :', err)
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setLocationToTogglePause(null)
    }
  }

  const confirmHardDelete = async () => {
    try {
      await hardDeleteLocation(locationToHardDelete.id)
      await load()
    } catch (err) {
      console.error('Erreur suppression définitive :', err)
      alert('Échec de la suppression. Réessaie.')
    } finally {
      setLocationToHardDelete(null)
    }
  }

  if (loading) return <p className="text-dash-legend text-sm italic">Chargement...</p>
  if (error)   return <p className="text-dash-danger text-sm">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dash-title">Lieux partenaires</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
        >
          + Ajouter un lieu
        </button>
      </div>

      <DashboardTable
        columns={COLUMNS}
        data={locations}
        onEdit={handleEdit}
        onDelete={handleTogglePause}
        onHardDelete={(location) => setLocationToHardDelete(location)}
      />

      {locationToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Voulez-vous supprimer définitivement le lieu "${locationToHardDelete.name}" ?\n\nCette action est irréversible. La galerie associée sera supprimée. La délégation, si présente, ne sera pas supprimée.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmHardDelete}
          onCancel={() => setLocationToHardDelete(null)}
        />
      )}

      {locationToTogglePause && (
        <ConfirmModal
          variant={locationToTogglePause.is_active ? 'warning' : 'success'}
          title={locationToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          message={
            locationToTogglePause.is_active
              ? `Mettre en pause le lieu "${locationToTogglePause.name}" ?\n\nIl deviendra invisible sur le site, mais reste récupérable.`
              : `Réactiver le lieu "${locationToTogglePause.name}" ?\n\nIl redeviendra visible sur le site.`
          }
          confirmLabel={locationToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          onConfirm={confirmTogglePause}
          onCancel={() => setLocationToTogglePause(null)}
        />
      )}
    </div>
  )
}

export default LocationsPage