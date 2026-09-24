// ════════════════════════════════════════════════════════════════
// pages/admin/AProposPage.jsx
// Page dashboard "À propos" — Équipe, Délégations, Rapports d'activité
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchAdminTeamMembers, toggleTeamMemberActive, hardDeleteTeamMember,
  fetchAdminActivityReports, toggleActivityReportActive, hardDeleteActivityReport,
  fetchAdminPartners, togglePartnerActive, hardDeletePartner,
} from '../../services/api'
import AnchorNav from '../../components/navigation/AnchorNav'
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ActivityReportEditModal from '../../components/admin/ActivityReportEditModal'
import PartnerEditModal from '../../components/admin/PartnerEditModal'
import { FiEdit2, FiPause, FiPlay, FiTrash2, FiCheck, FiX } from 'react-icons/fi'

const ANCHOR_SECTIONS = [
  { label: 'Équipe', id: 'equipe' },
  { label: "Rapports d'activité", id: 'rapports' },
  { label: 'Partenaires', id: 'partenaires' },
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

const PARTNER_COLUMNS = [
  {
    key: 'logo_url',
    label: 'Logo',
    render: (row) => row.logo_url ? (
      <img src={row.logo_url} alt={`Logo de ${row.name}`} className="h-10 w-auto object-contain" />
    ) : (
      <span className="text-dash-legend text-xs italic">Aucun</span>
    ),
  },
  { key: 'name', label: 'Nom' },
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

  // ── Rapports d'activité ─────────────────────────────────────────────────
  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState(null) // null = création
  const [reportToTogglePause, setReportToTogglePause] = useState(null)
  const [reportToHardDelete, setReportToHardDelete] = useState(null)

  // ── Partenaires ─────────────────────────────────────────────────────────
  const [partners, setPartners] = useState([])
  const [partnersLoading, setPartnersLoading] = useState(true)
  const [partnerModalOpen, setPartnerModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState(null) // null = création
  const [partnerToTogglePause, setPartnerToTogglePause] = useState(null)
  const [partnerToHardDelete, setPartnerToHardDelete] = useState(null)

  const loadMembers = async () => {
    try {
      setMembers(await fetchAdminTeamMembers())
    } catch (err) {
      console.error('Erreur chargement équipe :', err)
    } finally {
      setMembersLoading(false)
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

  const loadPartners = async () => {
    try {
      setPartners(await fetchAdminPartners())
    } catch (err) {
      console.error('Erreur chargement partenaires :', err)
    } finally {
      setPartnersLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
    loadReports()
    loadPartners()
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

  // ── Actions Partenaires ─────────────────────────────────────────────────
  const confirmPartnerTogglePause = async () => {
    try {
      await togglePartnerActive(partnerToTogglePause.id, !partnerToTogglePause.is_active)
      await loadPartners()
    } catch (err) {
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setPartnerToTogglePause(null)
    }
  }

  const confirmPartnerHardDelete = async () => {
    try {
      await hardDeletePartner(partnerToHardDelete.id)
      await loadPartners()
    } catch (err) {
      alert('Échec de la suppression. Réessaie.')
    } finally {
      setPartnerToHardDelete(null)
    }
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-6">Association & partenaires</h1>

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

      {/* ── Section Partenaires ── */}
      <section id="partenaires" className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-dash-title">Partenaires</h2>
          <button
            onClick={() => { setEditingPartner(null); setPartnerModalOpen(true) }}
            className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
          >
            + Ajouter un partenaire
          </button>
        </div>

        {partnersLoading ? (
          <p className="text-dash-legend text-sm italic">Chargement...</p>
        ) : partners.length === 0 ? (
          <p className="text-dash-legend text-sm py-8 text-center">Aucun partenaire pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partners.map(p => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-4">

                <span className={`self-start px-2 py-0.5 rounded-full text-xs font-medium ${
                  p.is_active ? 'bg-dash-success/10 text-dash-success' : 'bg-dash-warning/10 text-dash-warning'
                }`}>
                  {p.is_active ? 'Actif' : 'Inactif'}
                </span>

                <div className="h-16 w-full bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={`Logo de ${p.name}`} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-dash-legend text-xs italic">Aucun logo</span>
                  )}
                </div>

                <p className="text-sm text-dash-text font-medium truncate" title={p.name}>{p.name}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingPartner(p); setPartnerModalOpen(true) }}
                      className="p-1.5 text-dash-legend hover:text-dash-action hover:bg-dash-action/10 rounded"
                      aria-label={`Modifier ${p.name}`}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => setPartnerToTogglePause(p)}
                      className={`p-1.5 text-dash-legend rounded ${
                        p.is_active ? 'hover:text-dash-warning hover:bg-dash-warning/10' : 'hover:text-dash-success hover:bg-dash-success/10'
                      }`}
                      aria-label={p.is_active ? `Mettre en pause ${p.name}` : `Reprendre ${p.name}`}
                    >
                      {p.is_active ? <FiPause size={16} /> : <FiPlay size={16} />}
                    </button>
                    <button
                      onClick={() => setPartnerToHardDelete(p)}
                      className="p-1.5 text-dash-legend hover:text-dash-danger hover:bg-dash-danger/10 rounded"
                      aria-label={`Supprimer définitivement ${p.name}`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <span className="flex items-center gap-1 text-xs text-dash-legend" title={p.website_url ? p.website_url : 'Aucun site web renseigné'}>
                    URL
                    {p.website_url ? (
                      <FiCheck className="text-dash-success" size={14} />
                    ) : (
                      <FiX className="text-dash-danger" size={14} />
                    )}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Modales ── */}
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

      {partnerModalOpen && (
        <PartnerEditModal
          partner={editingPartner}
          onClose={() => setPartnerModalOpen(false)}
          onSaved={() => { setPartnerModalOpen(false); loadPartners() }}
        />
      )}

      {partnerToTogglePause && (
        <ConfirmModal
          variant={partnerToTogglePause.is_active ? 'warning' : 'success'}
          title={partnerToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          message={
            partnerToTogglePause.is_active
              ? `Mettre en pause "${partnerToTogglePause.name}" ?\n\nIl deviendra invisible sur le site, mais reste récupérable.`
              : `Réactiver "${partnerToTogglePause.name}" ?\n\nIl redeviendra visible sur le site.`
          }
          confirmLabel={partnerToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          onConfirm={confirmPartnerTogglePause}
          onCancel={() => setPartnerToTogglePause(null)}
        />
      )}

      {partnerToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Voulez-vous supprimer définitivement "${partnerToHardDelete.name}" ?\n\nCette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmPartnerHardDelete}
          onCancel={() => setPartnerToHardDelete(null)}
        />
      )}

    </div>
  )
}

export default AProposPage