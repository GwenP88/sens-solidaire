// ════════════════════════════════════════════════════════════════
// pages/admin/MissionsPage.jsx
// Page dashboard — liste et gestion des missions (CRUD)
// Responsabilités :
//   - charger et afficher toutes les missions (actives + inactives)
//   - naviguer vers la page de création (/admin/missions/new)
//   - naviguer vers la page d'édition  (/admin/missions/:id/edit)
//   - gérer la suppression (soft delete) avec confirmation
// ════════════════════════════════════════════════════════════════

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useNavigate } from 'react-router-dom'

// ── API
import { fetchAdminMissions, deleteMission, hardDeleteMission } from '../../services/api'

// ── Composants admin
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'


// ════════════════════════════════════════════════════════════════
// CONFIGURATION DES COLONNES
// Définit ce qu'affiche DashboardTable — un objet par colonne.
// render() est optionnel : permet de personnaliser l'affichage
// (badge coloré, date formatée, etc.) sans toucher à DashboardTable.
// ════════════════════════════════════════════════════════════════

const COLUMNS = [
  { key: 'title',   label: 'Titre' },
  { key: 'country', label: 'Pays'  },
  { key: 'type',    label: 'Type'  },
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


// ════════════════════════════════════════════════════════════════
// COMPOSANT
// ════════════════════════════════════════════════════════════════

function MissionsPage() {
  const navigate = useNavigate()

  // ── États ──
  const [missions, setMissions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [missionToHardDelete, setMissionToHardDelete] = useState(null)


  // ── Chargement initial ──────────────────────────────────────
  // AbortController : annule le fetch si l'utilisateur navigue
  // avant la fin du chargement → évite un setState sur composant
  // démonté (warning React + fuite mémoire potentielle).
  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const data = await fetchAdminMissions(controller.signal)
        setMissions(data.filter(m => m.type === 'volontariat_individuel'))
      } catch (err) {
        if (err.name === 'AbortError') return // navigation avant fin du fetch — silencieux
        console.error('Erreur chargement missions :', err)
        setError('Impossible de charger les missions.')
      } finally {
        setLoading(false)
      }
    }

    load()

    // Nettoyage : annule le fetch au démontage du composant
    return () => controller.abort()
  }, [])


  // ── Rechargement ponctuel ───────────────────────────────────
  // Appelé après une suppression pour resynchroniser l'affichage.
  // Pas d'AbortController ici : c'est un appel déclenché par une
  // action utilisateur, pas lié au cycle de vie du composant.
  const reloadMissions = async () => {
    try {
      const data = await fetchAdminMissions()
      setMissions(data.filter(m => m.type === 'volontariat_individuel'))
    } catch (err) {
      console.error('Erreur rechargement missions :', err)
      setError('Impossible de recharger les missions.')
    }
  }


  // ── Navigation ──────────────────────────────────────────────

  // Bouton "+ Ajouter" → page de création
  const handleCreate = () => navigate('/admin/missions/new')

  // Bouton crayon → page d'édition avec l'id de la mission
  const handleEdit = (mission) => navigate(`/admin/missions/${mission.id}/edit`)


  // ── Suppression ─────────────────────────────────────────────
  // Soft delete : is_active passe à false côté backend.
  // La mission reste en base (récupérable) mais disparaît du site.
  const handleDelete = async (mission) => {
    const confirmed = window.confirm(
      `Supprimer la mission "${mission.title}" ?\n\nCette action la masquera du site. Elle reste récupérable en base de données.`
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

  // ── Suppression définitive ──────────────────────────────────
// Hard delete : la mission ET ses données dépendantes (tarifs, médias)
// sont effacées de la base. IRRÉVERSIBLE.
// Ouvre la modale de confirmation
const handleHardDelete = (mission) => {
  setMissionToHardDelete(mission)
}

// Exécute la suppression définitive après confirmation dans la modale
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

  // ── États de chargement / erreur ────────────────────────────

  if (loading) return (
    <p className="text-gray-400 text-sm italic">Chargement des missions...</p>
  )

  if (error) return (
    <p className="text-red-600 text-sm">{error}</p>
  )


  // ── Rendu ───────────────────────────────────────────────────

  return (
    <div>

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-gray-900">
          Missions
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Ajouter une mission
        </button>
      </div>

      {/* ── Tableau des missions ── */}
      {/* DashboardTable est générique : on lui passe les colonnes,
          les données et les callbacks — il ne connaît pas le métier. */}
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
          message={`Voulez-vous supprimer définitivement la mission "${missionToHardDelete.title}" ?\n\nCette action est irréversible. La mission, ses tarifs et toutes les photos associées seront supprimés définitivement.\n\nLes lieux partenaires utilisés par d'autres missions ne seront pas supprimés.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmHardDelete}
          onCancel={() => setMissionToHardDelete(null)}
        />
      )}
    </div>
  )
}

export default MissionsPage