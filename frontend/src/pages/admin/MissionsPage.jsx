// pages/admin/MissionsPage.jsx
// Page métier : charge les missions, gère les actions CRUD, orchestre la modale.

import { useState, useEffect } from 'react'
import {
  fetchAdminMissions,
  createMission,
  updateMission,
  deleteMission,
} from '../../services/api'
import DashboardTable from '../../components/admin/DashboardTable'
import MissionForm from '../../components/admin/MissionForm'

// Config des colonnes — SEULE partie qui change d'une section à l'autre.
const columns = [
  { key: 'title', label: 'Titre' },
  { key: 'country', label: 'Pays' },
  { key: 'slug', label: 'Slug' },
  {
    key: 'is_active',
    label: 'Statut',
    render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        row.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {row.is_active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
]

function MissionsPage() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // null = modale fermée | {} = mode création | {...mission} = mode édition
  const [editingMission, setEditingMission] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const loadMissions = async () => {
    try {
      const data = await fetchAdminMissions()
      setMissions(data)
    } catch (err) {
      console.error('Erreur chargement missions:', err)
      setError('Impossible de charger les missions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMissions()
  }, [])

  const handleCreate = () => {
    setEditingMission(null)  // pas de données initiales → mode création
    setShowForm(true)
  }

  const handleEdit = (mission) => {
    setEditingMission(mission)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    if (editingMission) {
      await updateMission(editingMission.id, formData)
    } else {
      await createMission(formData)
    }
    setShowForm(false)
    await loadMissions()  // resynchronise l'affichage avec le backend
  }

  const handleDelete = async (mission) => {
    // Confirmation native — suffisant pour un MVP, accessible par défaut.
    const confirmed = window.confirm(
      `Supprimer la mission "${mission.title}" ? Cette action la masquera du site (récupérable en base).`
    )
    if (!confirmed) return

    try {
      await deleteMission(mission.id)
      await loadMissions()
    } catch (err) {
      console.error('Erreur suppression mission:', err)
      alert('Échec de la suppression.')
    }
  }

  if (loading) return <div className="text-gray-500">Chargement...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-gray-900">Missions</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white text-sm rounded-lg"
        >
          + Ajouter une mission
        </button>
      </div>

      <DashboardTable
        columns={columns}
        data={missions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <MissionForm
          initialData={editingMission}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default MissionsPage
