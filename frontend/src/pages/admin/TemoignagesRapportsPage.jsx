// ════════════════════════════════════════════════════════════════
// pages/admin/TemoignagesRapportsPage.jsx
// Page dashboard "Témoignages & rapports de mission"
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import {
  fetchAdminTestimonials, approveTestimonial, rejectTestimonial, hardDeleteTestimonial, updateTestimonial,
  fetchAdminMissionReports, toggleMissionReportActive, hardDeleteMissionReport,
} from '../../services/api'
import AnchorNav from '../../components/navigation/AnchorNav'
import ConfirmModal from '../../components/admin/ConfirmModal'
import TestimonialEditModal from '../../components/admin/TestimonialEditModal'
import MissionReportEditModal from '../../components/admin/MissionReportEditModal'
import { FILTERS_MISSION_TYPE, FILTERS_COUNTRY } from '../../utils/filters'
import { FiEdit2, FiPause, FiPlay, FiTrash2 } from 'react-icons/fi'

const ANCHOR_SECTIONS = [
  { label: 'Témoignages', id: 'temoignages' },
  { label: 'Rapports de mission', id: 'rapports' },
]

const STATUS_LABELS = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Refusé',
}

const STATUS_STYLES = {
  pending: 'bg-dash-warning/10 text-dash-warning',
  approved: 'bg-dash-success/10 text-dash-success',
  rejected: 'bg-dash-danger/10 text-dash-danger',
}

const MONTHS = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const REPORT_TYPE_LABELS = {
  individuel: 'Volontariat individuel',
  service_civique: 'Service civique',
  groupe_jeunes: 'Groupe jeunes',
  conge_solidaire: 'Congé solidaire',
}

const PAGE_SIZE = 10

function TemoignagesRapportsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  // ── Témoignages ─────────────────────────────────────────────────
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [creatingTestimonial, setCreatingTestimonial] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState(null)
  const [statusChangeTarget, setStatusChangeTarget] = useState(null)
  const [pendingTestimonials, setPendingTestimonials] = useState([])

  // ── Rapports de mission ─────────────────────────────────────────────────
  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState(null) // null = création
  const [reportToTogglePause, setReportToTogglePause] = useState(null)
  const [reportToHardDelete, setReportToHardDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const { testimonials, total } = await fetchAdminTestimonials({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        country: countryFilter || undefined,
        limit,
      })
      setTestimonials(testimonials)
      setTotal(total)
    } catch (err) {
      console.error('Erreur chargement témoignages :', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPending = async () => {
    try {
      const { testimonials } = await fetchAdminTestimonials({ status: 'pending', limit: 100 })
      setPendingTestimonials(testimonials)
    } catch (err) {
      console.error('Erreur chargement témoignages en attente :', err)
    }
  }

  const loadReports = async () => {
    try {
      setReports(await fetchAdminMissionReports())
    } catch (err) {
      console.error('Erreur chargement rapports :', err)
    } finally {
      setReportsLoading(false)
    }
  }

  useEffect(() => {
    load()
    loadPending()
  }, [statusFilter, typeFilter, countryFilter, limit])

  useEffect(() => {
    loadReports()
  }, [])

  // Revenir à la 1ère page quand un filtre change
  const handleFilterChange = (setter) => (e) => {
    setLimit(PAGE_SIZE)
    setter(e.target.value)
  }

  const confirmStatusChange = async () => {
    const { testimonial, newStatus } = statusChangeTarget
    try {
      if (newStatus === 'approved') {
        await approveTestimonial(testimonial.id)
      } else {
        await rejectTestimonial(testimonial.id)
      }
      await load()
      await loadPending()
    } catch (err) {
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setStatusChangeTarget(null)
    }
  }

  const handleToggleHomepage = async (t) => {
    try {
      await updateTestimonial(t.id, { show_homepage: !t.show_homepage })
      await load()
    } catch (err) {
      alert('Échec de la mise à jour. Réessaie.')
    }
  }

  const confirmDelete = async () => {
    try {
      await hardDeleteTestimonial(testimonialToDelete.id)
      await load()
      await loadPending()
    } catch (err) {
      alert('Échec de la suppression. Réessaie.')
    } finally {
      setTestimonialToDelete(null)
    }
  }

  const confirmReportTogglePause = async () => {
    try {
      await toggleMissionReportActive(reportToTogglePause.id, !reportToTogglePause.is_active)
      await loadReports()
    } catch (err) {
      alert('Échec du changement de statut. Réessaie.')
    } finally {
      setReportToTogglePause(null)
    }
  }

  const confirmReportHardDelete = async () => {
    try {
      await hardDeleteMissionReport(reportToHardDelete.id)
      await loadReports()
    } catch (err) {
      alert('Échec de la suppression. Réessaie.')
    } finally {
      setReportToHardDelete(null)
    }
  }

  const renderTestimonialCard = (t) => (
    <div key={t.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 bg-white">

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {t.avatar_url && (
            <img src={t.avatar_url} alt={t.author_name} className="w-8 h-8 rounded-full object-cover" />
          )}
          <span className="text-sm font-medium text-dash-text">{t.author_name}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLES[t.status]}`}>
          {STATUS_LABELS[t.status]}
        </span>
      </div>

      <p className="text-sm text-dash-text italic">{t.content}</p>

      <div className="flex items-center justify-between text-xs text-dash-legend">
        <span>
          {t.mission ? `${t.mission.title} — ${t.mission.country}` : 'Aucune mission liée'}
          {(t.mois || t.annee) && ` · ${t.mois ? MONTHS[t.mois] : ''} ${t.annee || ''}`}
        </span>
        <label className="flex items-center gap-1 text-dash-action cursor-pointer">
          <input
            type="checkbox"
            checked={t.show_homepage}
            onChange={() => handleToggleHomepage(t)}
            className="w-3.5 h-3.5 accent-dash-action"
          />
          Afficher sur la page d'accueil
        </label>
      </div>

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => setEditingTestimonial(t)}
          className="px-3 py-1.5 text-xs text-dash-action border border-dash-action rounded-lg hover:bg-dash-action/10 transition-colors"
        >
          Modifier
        </button>
        {t.status !== 'approved' && (
          <button
            onClick={() => setStatusChangeTarget({ testimonial: t, newStatus: 'approved' })}
            className="px-3 py-1.5 text-xs text-dash-success border border-dash-success rounded-lg hover:bg-dash-success/10 transition-colors"
          >
            Approuver
          </button>
        )}
        {t.status !== 'rejected' && (
          <button
            onClick={() => setStatusChangeTarget({ testimonial: t, newStatus: 'rejected' })}
            className="px-3 py-1.5 text-xs text-dash-warning border border-dash-warning rounded-lg hover:bg-dash-warning/10 transition-colors"
          >
            Refuser
          </button>
        )}
        <button
          onClick={() => setTestimonialToDelete(t)}
          className="px-3 py-1.5 text-xs text-dash-danger border border-dash-danger rounded-lg hover:bg-dash-danger/10 transition-colors"
        >
          Supprimer
        </button>
      </div>

    </div>
  )

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-dash-title mb-6">Témoignages & rapports de mission</h1>

      <AnchorNav sections={ANCHOR_SECTIONS} variant="dashboard" />

      {/* ── Section Témoignages ── */}
      <section id="temoignages" className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-dash-title">Témoignages</h2>
          <button
            onClick={() => setCreatingTestimonial(true)}
            className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
          >
            + Ajouter un témoignage
          </button>
        </div>

        {pendingTestimonials.length > 0 && (
          <div className="mb-6 p-4 bg-dash-warning/5 border border-dash-warning/30 rounded-lg">
            <h3 className="text-sm font-semibold text-dash-warning mb-3">
              Témoignages en attente de validation ({pendingTestimonials.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingTestimonials.map(t => renderTestimonialCard(t))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={handleFilterChange(setTypeFilter)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
          >
            <option value="">Toutes les missions</option>
            {FILTERS_MISSION_TYPE.filter(f => f.value !== null).map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={handleFilterChange(setCountryFilter)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dash-action/30"
          >
            <option value="">Tous les pays</option>
            {FILTERS_COUNTRY.filter(f => f.value !== null).map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>


        {loading ? (
          <p className="text-dash-legend text-sm italic">Chargement...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-dash-legend text-sm py-8 text-center">Aucun témoignage pour ces critères.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {testimonials.map(t => renderTestimonialCard(t))}
            </div>

            {testimonials.length < total && (
              <button
                onClick={() => setLimit(prev => prev + PAGE_SIZE)}
                className="mt-4 w-full py-2 text-sm text-dash-action border border-dash-action rounded-lg hover:bg-dash-action/10 transition-colors"
              >
                Afficher plus ({testimonials.length}/{total})
              </button>
            )}
          </>
        )}
      </section>

      {/* ── Section Rapports de mission ── */}
      <section id="rapports" className="mt-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-heading font-semibold text-lg text-dash-title">
              Rapports de mission
            </h2>
            <p className="text-sm text-dash-legend mt-1">
              Ajoutez et gérez les rapports rédigés à la suite des missions.
              Les rapports actifs sont visibles et téléchargeables sur le site.
            </p>
          </div>

          <button
            onClick={() => { setEditingReport(null); setReportModalOpen(true) }}
            className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors shrink-0"
          >
            + Ajouter un rapport
          </button>
        </div>

        {reportsLoading ? (
          <p className="text-dash-legend text-sm italic">Chargement...</p>
        ) : reports.length === 0 ? (
          <p className="text-dash-legend text-sm py-8 text-center">Aucun rapport pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reports.map(r => (
              <div key={r.id} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-3 bg-dash-action/5">

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.is_active ? 'bg-dash-success/10 text-dash-success' : 'bg-dash-warning/10 text-dash-warning'
                  }`}>
                    {r.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  <span className="text-xs text-dash-legend">{r.annee}</span>
                </div>

                <div>
                  <p className="text-sm text-dash-text font-medium truncate" title={r.auteur}>{r.auteur}</p>
                  <p className="text-xs text-dash-legend">
                    {REPORT_TYPE_LABELS[r.type] || r.type}{r.destination ? ` — ${r.destination}` : ''}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingReport(r); setReportModalOpen(true) }}
                    className="p-1.5 text-dash-legend hover:text-dash-action hover:bg-dash-action/10 rounded"
                    aria-label={`Modifier le rapport de ${r.auteur}`}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => setReportToTogglePause(r)}
                    className={`p-1.5 text-dash-legend rounded ${
                      r.is_active ? 'hover:text-dash-warning hover:bg-dash-warning/10' : 'hover:text-dash-success hover:bg-dash-success/10'
                    }`}
                    aria-label={r.is_active ? `Mettre en pause` : `Reprendre`}
                  >
                    {r.is_active ? <FiPause size={16} /> : <FiPlay size={16} />}
                  </button>
                  <button
                    onClick={() => setReportToHardDelete(r)}
                    className="p-1.5 text-dash-legend hover:text-dash-danger hover:bg-dash-danger/10 rounded"
                    aria-label={`Supprimer définitivement`}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Modales ── */}

      {editingTestimonial && (
        <TestimonialEditModal
          testimonial={editingTestimonial}
          onClose={() => setEditingTestimonial(null)}
          onSaved={() => { setEditingTestimonial(null); load(); loadPending() }}
        />
      )}

      {creatingTestimonial && (
        <TestimonialEditModal
          testimonial={null}
          onClose={() => setCreatingTestimonial(false)}
          onSaved={() => { setCreatingTestimonial(false); load(); loadPending() }}
        />
      )}

      {testimonialToDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Voulez-vous supprimer définitivement le témoignage de "${testimonialToDelete.author_name}" ?\n\nCette action est définitive et le témoignage ne pourra pas être récupéré.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmDelete}
          onCancel={() => setTestimonialToDelete(null)}
        />
      )}

      {statusChangeTarget && (
      <ConfirmModal
        variant={statusChangeTarget.newStatus === 'approved' ? 'success' : 'warning'}
        title={statusChangeTarget.newStatus === 'approved' ? 'Approuver ce témoignage' : 'Refuser ce témoignage'}
        message={
          statusChangeTarget.newStatus === 'approved'
            ? `Approuver le témoignage de "${statusChangeTarget.testimonial.author_name}" ?\n\nUne fois approuvé, ce témoignage sera visible sur le site.`
            : `Refuser le témoignage de "${statusChangeTarget.testimonial.author_name}" ?\n\nCe témoignage ne sera pas visible sur le site et sera retiré de la page d'accueil s'il y était affiché..`
        }
        confirmLabel={statusChangeTarget.newStatus === 'approved' ? 'Approuver' : 'Refuser'}
        onConfirm={confirmStatusChange}
        onCancel={() => setStatusChangeTarget(null)}
      />
    )}

    {reportModalOpen && (
      <MissionReportEditModal
        report={editingReport}
        onClose={() => setReportModalOpen(false)}
        onSaved={() => { setReportModalOpen(false); loadReports() }}
      />
    )}

    {reportToTogglePause && (
      <ConfirmModal
        variant={reportToTogglePause.is_active ? 'warning' : 'success'}
        title={reportToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
        message={
          reportToTogglePause.is_active
            ? `Mettre en pause le rapport de "${reportToTogglePause.auteur}" ?\n\nLe rapport ne sera plus visible sur le site, mais restera enregistré dans le tableau de bord. Vous pourrez le réactiver à tout moment.`
            : `Réactiver le rapport de "${reportToTogglePause.auteur}" ?\n\nLe rapport sera de nouveau visible et téléchargeable sur le site.`
        }
        confirmLabel={reportToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
        onConfirm={confirmReportTogglePause}
        onCancel={() => setReportToTogglePause(null)}
      />
    )}

    {reportToHardDelete && (
      <ConfirmModal
        title="Supprimer définitivement"
        message={`Voulez-vous supprimer définitivement le rapport de "${reportToHardDelete.auteur}" ?\n\nCette action est irréversible.`}
        confirmLabel="Supprimer définitivement"
        onConfirm={confirmReportHardDelete}
        onCancel={() => setReportToHardDelete(null)}
      />
    )}

    </div>
  )
}

export default TemoignagesRapportsPage