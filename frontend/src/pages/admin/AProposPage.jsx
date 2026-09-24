// ════════════════════════════════════════════════════════════════
// pages/admin/AProposPage.jsx
// Page dashboard "À propos" — Équipe, Délégations, Rapports d'activité
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchAdminTeamMembers, toggleTeamMemberActive, hardDeleteTeamMember,
  fetchAdminDelegations,
  fetchAdminActivityReports, toggleActivityReportActive, hardDeleteActivityReport,
} from '../../services/api'
import AnchorNav from '../../components/navigation/AnchorNav'
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'
import DelegationEditModal from '../../components/admin/DelegationEditModal'
import ActivityReportEditModal from '../../components/admin/ActivityReportEditModal'

const ANCHOR_SECTIONS = [
  { label: 'Équipe', id: 'equipe' },
  { label: 'Délégations', id: 'delegations' },
  { label: "Rapports d'activité", id: 'rapports' },
]

const CATEGORY_LABELS = {
  direction: 'Direction',
  bureau: 'Membre du bureau',
  ca: "Conseil d'administration",
  egalement: 'Autre',
}

const TEAM_COLUMNS = [
  { key: 'nom', label: 'Nom' },
  { key: 'role', label: 'Rôle' },
  {
    key: 'category',
    label: 'Catégorie',
    render: (row) => CATEGORY_LABELS[row.category] || row.category,
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

const DELEGATION_COLUMNS = [
  { key: 'lieu', label: 'Titre' },
  { key: 'pays', label: 'Pays' },
]

const REPORT_COLUMNS = [
  { key: 'annee', label: 'Année' },
  {
    key: 'url',
    label: 'PDF',
    render: (row) => (
      <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-dash-action hover:underline">
        Voir le PDF →
      </a>
    ),
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

function AProposPage() {
  const navigate = useNavigate()

  // ── Équipe ──────────────────────────────────────────────────────────────
  const [members, setMembers] = useState([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [memberToTogglePause, setMemberToTogglePause] = useState(null)
  const [memberToHardDelete, setMemberToHardDelete] = useState(null)

  // ── Délégations ─────────────────────────────────────────────────────────
  const [delegations, setDelegations] = useState([])
  const [delegationsLoading, setDelegationsLoading] = useState(true)
  const [editingDelegation, setEditingDelegation] = useState(null)

  // ── Rapports d'activité ─────────────────────────────────────────────────
  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState(null) // null = création
  const [reportToTogglePause, setReportToTogglePause] = useState(null)
  const [reportToHardDelete, setReportToHardDelete] = useState(null)

  const loadMembers = async () => {
    try {
      setMembers(await fetchAdminTeamMembers())
    } catch (err) {
      console.error('Erreur chargement équipe :', err)
    } finally {
      setMembersLoading(false)
    }
  }

  const loadDelegations = async () => {
    try {
      setDelegations(await fetchAdminDelegations())
    } catch (err) {
      console.error('Erreur chargement délégations :', err)
    } finally {
      setDelegationsLoading(false)
    }
  }

  const loadReports = async () => {
    try {
      setReports(await fetchAdminActivityReports())
    } catch (err) {
      console.error('Erreur chargement rapports :', err)
    } finally {
      setReportsLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
    loadDelegations()
    loadReports()
  }, [])

  // ── Actions Équipe ──────────────────────────────────────────────────────
  const filteredMembers = categoryFilter
    ? members.filter(m => m.category === categoryFilter)
    : members

  const confirmMemberTogglePause = async () => {
    try {
      await toggleTeamMemberActive(memberToTogglePause.id, !memberToTogglePause.is_active)
      await loadMembers()
    } catch (err) {
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setMemberToTogglePause(null)
    }
  }

  const confirmMemberHardDelete = async () => {
    try {
      await hardDeleteTeamMember(memberToHardDelete.id)
      await loadMembers()
    } catch (err) {
      alert('Échec de la suppression. Réessaie.')
    } finally {
      setMemberToHardDelete(null)
    }
  }

  // ── Actions Rapports ────────────────────────────────────────────────────
  const confirmReportTogglePause = async () => {
    try {
      await toggleActivityReportActive(reportToTogglePause.id, !reportToTogglePause.is_active)
      await loadReports()
    } catch (err) {
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setReportToTogglePause(null)
    }
  }

  const confirmReportHardDelete = async () => {
    try {
      await hardDeleteActivityReport(reportToHardDelete.id)
      await loadReports()
    } catch (err) {
      alert('Échec de la suppression. Réessaie.')
    } finally {
      setReportToHardDelete(null)
    }
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-6">À propos</h1>

      <AnchorNav sections={ANCHOR_SECTIONS} variant="dashboard" />

      {/* ── Section Équipe ── */}
      <section id="equipe" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-dash-title">Équipe</h2>
          <button
            onClick={() => navigate('/admin/a-propos/equipe/new')}
            className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
          >
            + Ajouter un membre
          </button>
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="mb-4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {membersLoading ? (
          <p className="text-dash-legend text-sm italic">Chargement...</p>
        ) : (
          <DashboardTable
            columns={TEAM_COLUMNS}
            data={filteredMembers}
            onEdit={(m) => navigate(`/admin/a-propos/equipe/${m.id}/edit`)}
            onDelete={(m) => setMemberToTogglePause(m)}
            onHardDelete={(m) => setMemberToHardDelete(m)}
          />
        )}
      </section>

      {/* ── Section Délégations ── */}
      <section id="delegations" className="mt-12">
        <h2 className="font-heading font-semibold text-lg text-dash-title mb-2">Délégations</h2>
        <p className="text-sm text-dash-legend mb-4">
          Pour ajouter une nouvelle délégation, rendez-vous dans l'onglet « Lieux et délégations », puis ouvrez
          le lieu concerné. La délégation sera automatiquement associée au bon pays. Depuis cette page, vous
          pouvez uniquement modifier la photo et les personnes référentes d'une délégation existante.
        </p>

        {delegationsLoading ? (
          <p className="text-dash-legend text-sm italic">Chargement...</p>
        ) : (
          <DashboardTable
            columns={DELEGATION_COLUMNS}
            data={delegations}
            onEdit={(d) => setEditingDelegation(d)}
          />
        )}
      </section>

      {/* ── Section Rapports d'activité ── */}
      <section id="rapports" className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-dash-title">Rapports d'activité</h2>
          <button
            onClick={() => { setEditingReport(null); setReportModalOpen(true) }}
            className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
          >
            + Ajouter un rapport
          </button>
        </div>

        {reportsLoading ? (
          <p className="text-dash-legend text-sm italic">Chargement...</p>
        ) : (
          <DashboardTable
            columns={REPORT_COLUMNS}
            data={reports}
            onEdit={(r) => { setEditingReport(r); setReportModalOpen(true) }}
            onDelete={(r) => setReportToTogglePause(r)}
            onHardDelete={(r) => setReportToHardDelete(r)}
          />
        )}
      </section>

      {/* ── Modales ── */}

      {editingDelegation && (
        <DelegationEditModal
          delegation={editingDelegation}
          onClose={() => setEditingDelegation(null)}
          onSaved={() => { setEditingDelegation(null); loadDelegations() }}
        />
      )}

      {reportModalOpen && (
        <ActivityReportEditModal
          report={editingReport}
          onClose={() => setReportModalOpen(false)}
          onSaved={() => { setReportModalOpen(false); loadReports() }}
        />
      )}

      {memberToTogglePause && (
        <ConfirmModal
          variant={memberToTogglePause.is_active ? 'warning' : 'success'}
          title={memberToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          message={
            memberToTogglePause.is_active
              ? `Mettre en pause "${memberToTogglePause.nom}" ?\n\nIl/elle deviendra invisible sur le site, mais reste récupérable.`
              : `Réactiver "${memberToTogglePause.nom}" ?\n\nIl/elle redeviendra visible sur le site.`
          }
          confirmLabel={memberToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          onConfirm={confirmMemberTogglePause}
          onCancel={() => setMemberToTogglePause(null)}
        />
      )}

      {memberToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Voulez-vous supprimer définitivement "${memberToHardDelete.nom}" ?\n\nCette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmMemberHardDelete}
          onCancel={() => setMemberToHardDelete(null)}
        />
      )}

      {reportToTogglePause && (
        <ConfirmModal
          variant={reportToTogglePause.is_active ? 'warning' : 'success'}
          title={reportToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          message={
            reportToTogglePause.is_active
              ? `Mettre en pause le rapport ${reportToTogglePause.annee} ?\n\nIl deviendra invisible sur le site, mais reste récupérable.`
              : `Réactiver le rapport ${reportToTogglePause.annee} ?\n\nIl redeviendra visible sur le site.`
          }
          confirmLabel={reportToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          onConfirm={confirmReportTogglePause}
          onCancel={() => setReportToTogglePause(null)}
        />
      )}

      {reportToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Voulez-vous supprimer définitivement le rapport ${reportToHardDelete.annee} ?\n\nCette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmReportHardDelete}
          onCancel={() => setReportToHardDelete(null)}
        />
      )}

    </div>
  )
}

export default AProposPage