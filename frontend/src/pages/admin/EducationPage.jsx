// ════════════════════════════════════════════════════════════════
// pages/admin/EducationPage.jsx
// Page Éducation & sensibilisation du dashboard (tâche 172A) : sections (ordre, visibilité) et cartes (ateliers…)
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import {
  fetchAdminEducationSections, reorderEducationSections, toggleEducationSectionActive, hardDeleteEducationSection,
  fetchAdminEducationItems, toggleEducationItemActive, hardDeleteEducationItem,
} from '../../services/api'
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ErrorModal from '../../components/admin/ErrorModal'
import { ADMIN_ERRORS } from '../../utils/adminErrors'
import { RATTACHEMENT_LABELS } from '../../utils/rattachement'
import { FILTERS_EDUCATION_PUBLIC } from '../../utils/filters'

// ── Badges ──────────────────────────────────────────────────────────────────
const StatusBadge = ({ active }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
    active ? 'bg-dash-success/10 text-dash-success' : 'bg-dash-warning/10 text-dash-warning'
  }`}>
    {active ? 'Visible' : 'Masquée'}
  </span>
)

// Pays non renseigné : signalé en orange pour que la cliente pense à le compléter
const RattachementBadge = ({ value }) => (
  value
    ? <span>{RATTACHEMENT_LABELS[value]}</span>
    : <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-dash-warning/10 text-dash-warning">À renseigner</span>
)

// Codes de public → libellés lisibles (« primaire,adultes » → « Maternelle & Primaire, Adultes & Étudiants »)
const PUBLIC_LABELS = Object.fromEntries(FILTERS_EDUCATION_PUBLIC.filter(f => f.value).map(f => [f.value, f.label]))
const formatPublic = (codes) => (codes || '').split(',').map(c => PUBLIC_LABELS[c.trim()] || c).join(', ')

const addButtonClass = 'px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors'

function EducationPage() {
  const navigate = useNavigate()
  const [sections, setSections] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  // Élément en attente de confirmation : { kind: 'section' | 'item', row }
  const [toToggle, setToToggle] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const load = async () => {
    try {
      const [sectionsData, itemsData] = await Promise.all([fetchAdminEducationSections(), fetchAdminEducationItems()])
      setSections(sectionsData)
      setItems(itemsData)
    } catch (err) {
      console.error('Erreur chargement éducation :', err)
      setError('Impossible de charger la page Éducation. Rechargez la page ou réessayez plus tard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── Ordre : échange la section avec sa voisine, puis enregistre l'ordre complet ──
  const moveSection = async (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const reordered = [...sections]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    setSections(reordered) // affichage immédiat, sans attendre le serveur
    try {
      await reorderEducationSections(reordered.map(s => s.id))
    } catch (err) {
      console.error('Erreur dashboard (ordre) :', err)
      setActionError(ADMIN_ERRORS.update)
      await load() // revient à l'ordre réellement enregistré
    }
  }

  const confirmToggle = async () => {
    const { kind, row } = toToggle
    try {
      if (kind === 'section') await toggleEducationSectionActive(row.id, !row.is_active)
      else await toggleEducationItemActive(row.id, !row.is_active)
      await load()
    } catch (err) {
      console.error('Erreur dashboard (toggle) :', err)
      setActionError(ADMIN_ERRORS.toggle)
    } finally {
      setToToggle(null)
    }
  }

  const confirmDelete = async () => {
    const { kind, row } = toDelete
    try {
      if (kind === 'section') await hardDeleteEducationSection(row.id)
      else await hardDeleteEducationItem(row.id)
      await load()
    } catch (err) {
      console.error('Erreur dashboard (delete) :', err)
      setActionError(ADMIN_ERRORS.delete)
    } finally {
      setToDelete(null)
    }
  }

  // ── Colonnes ──────────────────────────────────────────────────────────────
  const SECTION_COLUMNS = [
    {
      key: 'order',
      label: 'Ordre',
      render: (row) => {
        const index = sections.findIndex(s => s.id === row.id)
        return (
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => moveSection(index, -1)}
              disabled={index === 0}
              className="p-1 text-dash-legend hover:text-dash-action disabled:opacity-20 disabled:hover:text-dash-legend"
              aria-label={`Monter « ${row.title} »`}
            >
              <FiChevronUp size={16} />
            </button>
            <button
              type="button"
              onClick={() => moveSection(index, 1)}
              disabled={index === sections.length - 1}
              className="p-1 text-dash-legend hover:text-dash-action disabled:opacity-20 disabled:hover:text-dash-legend"
              aria-label={`Descendre « ${row.title} »`}
            >
              <FiChevronDown size={16} />
            </button>
          </div>
        )
      },
    },
    { key: 'title', label: 'Titre' },
    { key: 'items', label: 'Cartes', hideOnMobile: true, render: (row) => row.items.length },
    { key: 'rattachement', label: 'Pays concerné', hideOnMobile: true, render: (row) => <RattachementBadge value={row.rattachement} /> },
    { key: 'is_active', label: 'Statut', render: (row) => <StatusBadge active={row.is_active} /> },
  ]

  const ITEM_COLUMNS = [
    { key: 'title', label: 'Titre' },
    { key: 'section', label: 'Section', hideOnMobile: true, render: (row) => row.section?.title || <span className="text-dash-warning">Aucune (non affichée)</span> },
    { key: 'public', label: 'Public', hideOnMobile: true, render: (row) => formatPublic(row.public) },
    { key: 'is_active', label: 'Statut', render: (row) => <StatusBadge active={row.is_active} /> },
  ]

  if (loading) return <p className="text-dash-legend text-sm italic">Chargement...</p>
  if (error)   return <p className="text-dash-danger text-sm">{error}</p>

  const pendingTitle = (pending) => pending.row.title

  return (
    <div className="flex flex-col gap-12">

      {/* ── Sections de la page ── */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="font-heading font-bold text-2xl text-dash-title">Éducation & sensibilisation</h1>
          <button onClick={() => navigate('/admin/education/sections/new')} className={addButtonClass}>
            + Ajouter une section
          </button>
        </div>
        <p className="text-sm text-dash-legend mb-6">
          Chaque section est un bloc de la page Éducation du site. Utilisez les flèches pour choisir leur ordre d'affichage.
        </p>
        <DashboardTable
          columns={SECTION_COLUMNS}
          data={sections}
          onEdit={(row) => navigate(`/admin/education/sections/${row.id}/edit`)}
          onDelete={(row) => setToToggle({ kind: 'section', row })}
          onHardDelete={(row) => setToDelete({ kind: 'section', row })}
        />
      </div>

      {/* ── Cartes (ateliers…) ── */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="font-heading font-bold text-xl text-dash-title">Cartes</h2>
          <button onClick={() => navigate('/admin/education/cartes/new')} className={addButtonClass}>
            + Ajouter une carte
          </button>
        </div>
        <p className="text-sm text-dash-legend mb-6">
          Les cartes (ateliers…) s'affichent en carrousel dans la section choisie.
        </p>
        <DashboardTable
          columns={ITEM_COLUMNS}
          data={items}
          onEdit={(row) => navigate(`/admin/education/cartes/${row.id}/edit`)}
          onDelete={(row) => setToToggle({ kind: 'item', row })}
          onHardDelete={(row) => setToDelete({ kind: 'item', row })}
        />
      </div>

      {toDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={toDelete.kind === 'section'
            ? `Voulez-vous supprimer définitivement la section "${pendingTitle(toDelete)}" ?\n\nSes photos et ses boutons seront supprimés. Ses cartes sont conservées : vous pourrez les placer dans une autre section.\n\nCette action est irréversible.`
            : `Voulez-vous supprimer définitivement la carte "${pendingTitle(toDelete)}" ?\n\nCette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      {toToggle && (
        <ConfirmModal
          variant={toToggle.row.is_active ? 'warning' : 'success'}
          title={toToggle.row.is_active ? 'Masquer' : 'Rendre visible'}
          message={toToggle.row.is_active
            ? `Masquer "${pendingTitle(toToggle)}" ?\n\nElle deviendra invisible sur le site, mais reste récupérable.`
            : `Rendre visible "${pendingTitle(toToggle)}" ?\n\nElle apparaîtra de nouveau sur le site.`}
          confirmLabel={toToggle.row.is_active ? 'Masquer' : 'Rendre visible'}
          onConfirm={confirmToggle}
          onCancel={() => setToToggle(null)}
        />
      )}

      {actionError && <ErrorModal message={actionError} onClose={() => setActionError(null)} />}
    </div>
  )
}

export default EducationPage
