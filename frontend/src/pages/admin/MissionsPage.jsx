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
import { fetchAdminMissions, updateMission, deleteMission, hardDeleteMission } from '../../services/api'

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
          ? 'bg-dash-success/10 text-dash-success'
          : 'bg-dash-warning/10 text-dash-warning'
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
  const [missionToTogglePause, setMissionToTogglePause] = useState(null)


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
    // Ouvre la modale (pause ou reprise, selon l'état actuel)
  const handleTogglePause = (mission) => {
    setMissionToTogglePause(mission)
  }

  // Exécute la pause (soft delete) ou la reprise (is_active: true) après confirmation
  const confirmTogglePause = async () => {
    try {
      if (missionToTogglePause.is_active) {
        await deleteMission(missionToTogglePause.id)
      } else {
        await updateMission(missionToTogglePause.id, { is_active: true })
      }
      await reloadMissions()
    } catch (err) {
      console.error('Erreur pause/reprise mission :', err)
      alert('Échec de l\'opération. Réessaie.')
    } finally {
      setMissionToTogglePause(null)
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
    <p className="text-dash-legend text-sm italic">Chargement des missions...</p>
  )

  if (error) return (
    <p className="text-red-600 text-sm">{error}</p>
  )


  // ── Rendu ───────────────────────────────────────────────────

  return (
    <div>

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dash-title">
          Missions
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
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
        onDelete={handleTogglePause}
        onHardDelete={handleHardDelete} 
      />

      {missionToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement la mission ?"
          message={`Cette action est irréversible. La mission "${missionToHardDelete.title}", ses tarifs et toutes les photos associées seront définitivement supprimés. ?\n\nLes lieux partenaires utilisés par d’autres missions seront conservés.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmHardDelete}
          onCancel={() => setMissionToHardDelete(null)}
        />
      )}

      {missionToTogglePause && (
        <ConfirmModal
          variant="default"
          title={missionToTogglePause.is_active ? 'Mettre la mission en pause ?' : 'Réactiver la mission ?'}
          message={
            missionToTogglePause.is_active
              ? `La mission "${missionToTogglePause.title}" ne sera plus visible sur le site. \n\nVous pourrez la réactiver à tout moment.`
              : `La mission "${missionToTogglePause.title}" sera de nouveau visible sur le site.`
          }
          confirmLabel={missionToTogglePause.is_active ? 'Mettre en pause' : 'Reprendre'}
          onConfirm={confirmTogglePause}
          onCancel={() => setMissionToTogglePause(null)}
        />
      )}
    </div>
  )
}

export default MissionsPage