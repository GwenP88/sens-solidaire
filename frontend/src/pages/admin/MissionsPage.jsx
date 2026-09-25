// ════════════════════════════════════════════════════════════════
// pages/admin/MissionsPage.jsx
// Page dashboard — liste et gestion de TOUTES les missions (tous types),
// avec filtres type/pays/statut. Fusion de l'ancienne page "Missions
// individuelles" et de "Service Civique" (#128) — même table Mission
// en base, juste des formulaires d'édition différents selon le type.
// Les 3 missions "ancres" (service civique/groupe jeunes/congé de solidarité,
// non éditables, slug préfixé "ancre-") sont exclues de la liste.
// ════════════════════════════════════════════════════════════════

// ── React
import { useState, useEffect, useMemo } from 'react'

// ── Router
import { useNavigate } from 'react-router-dom'

// ── API
import { fetchAdminMissions, deleteMission, updateMission, hardDeleteMission } from '../../services/api'

// ── Composants admin
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'


// ════════════════════════════════════════════════════════════════
// CONFIGURATION DES COLONNES
// ════════════════════════════════════════════════════════════════

const TYPE_LABELS = {
  volontariat_individuel: 'Volontariat individuel',
  service_civique:        'Service Civique',
  groupe_jeunes:           'Groupe jeunes',
  conge_solidaire:         'Congé de solidarité',
}

const COLUMNS = [
  { key: 'title',   label: 'Titre' },
  { key: 'country', label: 'Pays'  },
  { key: 'type',    label: 'Type', render: (row) => TYPE_LABELS[row.type] || row.type },
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
  const [allMissions, setAllMissions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [missionToHardDelete, setMissionToHardDelete] = useState(null)
  const [missionToTogglePause, setMissionToTogglePause] = useState(null)

  // ── Filtres ──
  const [typeFilter, setTypeFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // ── Chargement initial ──────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const data = await fetchAdminMissions(controller.signal)
        // Exclut les 3 missions "ancres" — jamais éditables, servent
        // uniquement à rattacher des témoignages
        setAllMissions(data.filter(m => !m.slug.startsWith('ancre-')))
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Erreur chargement missions :', err)
        setError('Impossible de charger les missions.')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  // ── Rechargement ponctuel ───────────────────────────────────
  const reloadMissions = async () => {
    try {
      const data = await fetchAdminMissions()
      setAllMissions(data.filter(m => !m.slug.startsWith('ancre-')))
    } catch (err) {
      console.error('Erreur rechargement missions :', err)
      setError('Impossible de recharger les missions.')
    }
  }

  // ── Pays disponibles — dynamique, dépend des missions chargées ──
  const availableCountries = useMemo(() => {
    const countries = new Set(allMissions.map(m => m.country))
    return [...countries].sort()
  }, [allMissions])

  // ── Application des filtres ─────────────────────────────────
  const missions = allMissions.filter(m => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false
    if (countryFilter !== 'all' && m.country !== countryFilter) return false
    if (statusFilter === 'active' && !m.is_active) return false
    if (statusFilter === 'inactive' && m.is_active) return false
    return true
  })

  // ── Navigation — création (2 chemins, formulaires distincts) ──
  const handleCreateIndividuel = () => navigate('/admin/missions/new')
  const handleCreateServiceCivique = () => navigate('/admin/service-civique/new')

  // ── Navigation — édition (dépend du type) ───────────────────
  const handleEdit = (mission) => {
    if (mission.type === 'volontariat_individuel') {
      navigate(`/admin/missions/${mission.id}/edit`)
    } else {
      navigate(`/admin/service-civique/${mission.id}/edit`)
    }
  }

  // ── Suppression (soft delete) ───────────────────────────────
  const handleDelete = (mission) => {
    setMissionToTogglePause(mission)
  }

  const confirmTogglePause = async () => {
    try {
      if (missionToTogglePause.is_active) {
        await deleteMission(missionToTogglePause.id)       // désactive
      } else {
        await updateMission(missionToTogglePause.id, { is_active: true })  // réactive
      }
      await reloadMissions()
    } catch (err) {
      console.error('Erreur changement de statut :', err)
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setMissionToTogglePause(null)
    }
  }

  // ── Suppression définitive ──────────────────────────────────
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

  // ── États de chargement / erreur ────────────────────────────
  if (loading) return (
    <p className="text-dash-legend text-sm italic">Chargement des missions...</p>
  )

  if (error) return (
    <p className="text-dash-danger text-sm">{error}</p>
  )

  // ── Rendu ───────────────────────────────────────────────────
  return (
    <div>

      {/* ── En-tête ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <h1 className="font-heading font-bold text-2xl text-dash-title">
          Missions
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleCreateIndividuel}
            className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
          >
            + Volontariat individuel
          </button>
          <button
            onClick={handleCreateServiceCivique}
            className="px-4 py-2 bg-dash-editorial text-white text-sm rounded-lg hover:bg-dash-editorial/90 transition-colors"
          >
            + Service Civique
          </button>
        </div>
      </div>

      {/* ── Filtres ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
        >
          <option value="all">Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={countryFilter}
          onChange={e => setCountryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
        >
          <option value="all">Tous les pays</option>
          {availableCountries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actives</option>
          <option value="inactive">Inactives</option>
        </select>
      </div>

      {/* ── Tableau des missions ── */}
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

export default MissionsPage