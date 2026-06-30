// MediaDetail.jsx
// Page détail média & actualité — hero, contenu, médias attachés, CTA

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams } from 'react-router-dom'

// ── API
import { fetchMediaPostBySlug } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'

// ── Composants UI
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

function MediaDetail() {
  // ── État local — article + chargement + erreur
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Chargement de l'article depuis l'API au montage
  useEffect(() => {
    fetchMediaPostBySlug(slug)
      .then(data => setPost(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  // ── États de chargement et d'erreur
  if (loading) return <p className="text-body text-primary/50 italic p-12">Chargement...</p>
  if (error || !post) return (
    <div className="p-12 text-center">
      <p className="text-body text-primary/50 italic">Article introuvable.</p>
      <a href="/medias-et-actualites" className="link-inline text-accent">← Retour aux médias</a>
    </div>
  )

  // ── Formatage de la date en français
  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  // ── Rendu d'un média selon son type
  const renderMedia = (m, i) => {
    if (m.file_type === 'image') return (
      <img key={i} src={m.file_url} alt="" className="w-full rounded-2xl object-cover" />
    )
    if (m.file_type === 'video') return (
      <div key={i} className="aspect-video w-full rounded-2xl overflow-hidden">
        <iframe src={m.file_url} className="w-full h-full" allowFullScreen />
      </div>
    )
    if (m.file_type === 'audio') return (
      <audio key={i} controls className="w-full">
        <source src={m.file_url} />
      </audio>
    )
    if (m.file_type === 'pdf') return (
      <a key={i} href={m.file_url} target="_blank" rel="noopener noreferrer">
        <Button label={m.label ? m.label + ' ↓' : 'Télécharger le PDF ↓'} variant="secondary" />
      </a>
    )
    if (m.file_type === 'link') return (
      <a key={i} href={m.file_url} target="_blank" rel="noopener noreferrer">
        <Button label={m.label ? m.label + ' →' : 'Voir le lien →'} variant="secondary" />
      </a>
    )
    return null
  }

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image={post.image_url || '/images/hero/hero-missions.jpg'}
        title={post.title}
      />

      {/* ── Contenu principal — colonne centrée max-w-3xl ── */}
      <section className="padding-y padding-x bg-surface">
        <div className="flex flex-col gap-6 max-w-3xl">

          {/* Lien retour */}
          <a href="/medias-et-actualites" className="link-nav text-primary/50 hover:text-primary">
            ← Retour aux médias
          </a>

          {/* Date + thème */}
          <div className="flex items-center gap-2">
            <span className="text-caption text-primary/50">{formattedDate}</span>
            <span className="text-caption text-primary/30">—</span>
            <span className="text-eyebrow text-accent-2">{post.theme}</span>
          </div>

          {/* Contenu long */}
          {post.content && post.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-body text-primary/80">{para}</p>
          ))}

          {/* Médias attachés */}
          {post.media?.length > 0 && (
            <div className="flex flex-col gap-6 mt-4">
              {post.media.map((m, i) => renderMedia(m, i))}
            </div>
          )}

        </div>
      </section>

      {/* ── CTA bas de page ── */}
      <section className="padding-y padding-x bg-accent-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="h2-style text-surface">Envie de vous engager à nos côtés ?</h2>
            <p className="text-body text-surface/80">Découvrez nos missions et participez à des projets concrets sur le terrain.</p>
          </div>
          <a href="/missions">
            <Button label="Voir nos missions →" variant="primary" />
          </a>
        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default MediaDetail