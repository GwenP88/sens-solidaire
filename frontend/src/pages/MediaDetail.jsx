// MediaDetail.jsx
// Page détail média & actualité — hero, contenu, médias attachés, CTA

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchMediaPostBySlug } from '../services/api'
import HeroPage from '../components/layout/HeroPage'
import Button from '../components/ui/Button'
import ScrollToTop from '../components/ui/ScrollToTop'

function MediaDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMediaPostBySlug(slug)
      .then(data => setPost(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="p-12 font-body text-primary">Chargement...</p>
  if (error || !post) return (
    <div className="p-12 text-center">
      <p className="font-body text-primary/60">Article introuvable.</p>
      <a href="/medias-et-actualites" className="text-accent underline text-sm">← Retour aux médias</a>
    </div>
  )

  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="bg-surface min-h-screen">

      <HeroPage
        image={post.image_url || '/images/hero_missions.jpg'}
        title={post.title}
      />

      {/* ── Contenu principal ── */}
      <section className="section-padding bg-surface">
        <div className="flex flex-col gap-6 max-w-3xl">

          {/* Retour */}
          <a href="/medias-et-actualites" className="font-body text-sm text-primary/50 hover:text-primary transition-colors">
            ← Retour aux médias
          </a>

          {/* Date + thème */}
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-primary/50">{formattedDate}</span>
            <span className="font-body text-xs text-primary/30">—</span>
            <span className="font-body text-xs font-bold text-accent-2">{post.theme}</span>
          </div>

          {/* Contenu texte */}
          {post.content && post.content.split('\n\n').map((para, i) => (
            <p key={i} className="font-body text-sm text-primary/80 leading-relaxed">
              {para}
            </p>
          ))}

          {/* Médias attachés */}
          {post.media?.length > 0 && (
            <div className="flex flex-col gap-6 mt-4">
              {post.media.map((m, i) => {
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
                    <Button label="Télécharger le PDF ↓" variant="secondary" />
                  </a>
                )
                if (m.file_type === 'link') return (
                  <a key={i} href={m.file_url} target="_blank" rel="noopener noreferrer">
                    <Button label="Voir le lien →" variant="secondary" />
                  </a>
                )
                return null
              })}
            </div>
          )}

        </div>
      </section>

      <ScrollToTop />
    </div>
  )
}

export default MediaDetail