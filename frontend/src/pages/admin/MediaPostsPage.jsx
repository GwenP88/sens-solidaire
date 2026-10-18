// ════════════════════════════════════════════════════════════════
// pages/admin/MediaPostsPage.jsx
// Liste et gestion des publications « Médias & actualités »
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAdminMediaPosts, toggleMediaPostActive, hardDeleteMediaPost } from '../../services/api'
import DashboardTable from '../../components/admin/DashboardTable'
import ConfirmModal from '../../components/admin/ConfirmModal'

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const COLUMNS = [
  { key: 'title', label: 'Titre' },
  { key: 'theme', label: 'Thème' },
  { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
  {
    key: 'external_url',
    label: 'Bouton sur la carte',
    // Même règle que sur le site : lien/fichier → « Consulter », sinon « Lire la suite »
    render: (row) => row.external_url ? 'Consulter (lien ou fichier)' : 'Lire la suite (article)',
  },
  {
    key: 'show_homepage',
    label: 'Accueil',
    render: (row) => row.show_homepage ? 'Oui' : <span className="text-dash-legend">—</span>,
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

function MediaPostsPage() {
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [postToHardDelete, setPostToHardDelete] = useState(null)
  const [postToTogglePause, setPostToTogglePause] = useState(null)

  const load = async () => {
    try {
      const data = await fetchAdminMediaPosts()
      setPosts(data)
    } catch (err) {
      console.error('Erreur chargement publications :', err)
      setError('Impossible de charger les publications. Rechargez la page ou réessayez plus tard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = () => navigate('/admin/medias/new')
  const handleEdit = (post) => navigate(`/admin/medias/${post.id}/edit`)

  const confirmTogglePause = async () => {
    try {
      await toggleMediaPostActive(postToTogglePause.id, !postToTogglePause.is_active)
      await load()
    } catch (err) {
      console.error('Erreur changement statut :', err)
      alert('Échec du changement de statut. Réessayez.')
    } finally {
      setPostToTogglePause(null)
    }
  }

  const confirmHardDelete = async () => {
    try {
      await hardDeleteMediaPost(postToHardDelete.id)
      await load()
    } catch (err) {
      console.error('Erreur suppression définitive :', err)
      alert('Échec de la suppression. Réessayez.')
    } finally {
      setPostToHardDelete(null)
    }
  }

  if (loading) return <p className="text-dash-legend text-sm italic">Chargement...</p>
  if (error)   return <p className="text-dash-danger text-sm">{error}</p>

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="font-heading font-bold text-2xl text-dash-title">Médias & actualités</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-dash-action text-white text-sm rounded-lg hover:bg-dash-action/90 transition-colors"
        >
          + Ajouter une publication
        </button>
      </div>

      <DashboardTable
        columns={COLUMNS}
        data={posts}
        onEdit={handleEdit}
        onDelete={(post) => setPostToTogglePause(post)}
        onHardDelete={(post) => setPostToHardDelete(post)}
      />

      {postToHardDelete && (
        <ConfirmModal
          title="Supprimer définitivement"
          message={`Voulez-vous supprimer définitivement la publication "${postToHardDelete.title}" ?\n\nCette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmHardDelete}
          onCancel={() => setPostToHardDelete(null)}
        />
      )}

      {postToTogglePause && (
        <ConfirmModal
          variant={postToTogglePause.is_active ? 'warning' : 'success'}
          title={postToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          message={
            postToTogglePause.is_active
              ? `Mettre en pause la publication "${postToTogglePause.title}" ?\n\nElle deviendra invisible sur le site, mais reste récupérable.`
              : `Réactiver la publication "${postToTogglePause.title}" ?\n\nElle redeviendra visible sur le site.`
          }
          confirmLabel={postToTogglePause.is_active ? 'Mettre en pause' : 'Réactiver'}
          onConfirm={confirmTogglePause}
          onCancel={() => setPostToTogglePause(null)}
        />
      )}
    </div>
  )
}

export default MediaPostsPage