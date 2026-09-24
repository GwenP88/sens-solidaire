// ════════════════════════════════════════════════════════════════
// pages/admin/TemoignagesRapportsPage.jsx
// Page dashboard "Témoignages & rapports de mission"
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import {
  fetchAdminTestimonials, approveTestimonial, rejectTestimonial, hardDeleteTestimonial, updateTestimonial,
} from '../../services/api'
import AnchorNav from '../../components/navigation/AnchorNav'
import ConfirmModal from '../../components/admin/ConfirmModal'
import TestimonialEditModal from '../../components/admin/TestimonialEditModal'
import { FILTERS_MISSION_TYPE, FILTERS_COUNTRY } from '../../utils/filters'

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

const PAGE_SIZE = 10

function TemoignagesRapportsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [countryFilter, setCountryFilter] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [creatingTestimonial, setCreatingTestimonial] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState(null)
  const [statusChangeTarget, setStatusChangeTarget] = useState(null)
  const [pendingTestimonials, setPendingTestimonials] = useState([])

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

  useEffect(() => {
    load()
    loadPending()
  }, [statusFilter, typeFilter, countryFilter, limit])

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
          Sur l'accueil
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
              À modérer ({pendingTestimonials.length})
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
        <h2 className="font-heading font-semibold text-lg text-dash-title mb-2">Rapports de mission</h2>
        <p className="text-dash-legend text-sm italic">À venir.</p>
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
          message={`Voulez-vous supprimer définitivement le témoignage de "${testimonialToDelete.author_name}" ?\n\nCette action est irréversible (droit à l'oubli RGPD).`}
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
            ? `Approuver le témoignage de "${statusChangeTarget.testimonial.author_name}" ?\n\nIl sera visible sur le site.`
            : `Refuser le témoignage de "${statusChangeTarget.testimonial.author_name}" ?\n\nIl ne sera plus visible sur le site, et retiré de l'accueil si mis en avant.`
        }
        confirmLabel={statusChangeTarget.newStatus === 'approved' ? 'Approuver' : 'Refuser'}
        onConfirm={confirmStatusChange}
        onCancel={() => setStatusChangeTarget(null)}
      />
    )}

    </div>
  )
}

export default TemoignagesRapportsPage