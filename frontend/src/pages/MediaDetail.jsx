// MediaDetail.jsx
// Page détail média & actualité — layout éditorial magazine
// Structure prête pour les évolutions futures (auteur, tags, galerie, articles liés...)

// ── React
import { useState, useEffect } from 'react'

// ── Router
import { useParams } from 'react-router-dom'

// ── API
import { fetchMediaPostBySlug } from '../services/api'

// ── Composants layout
import HeroPage from '../components/layout/HeroPage'
import CTASection from '../components/ui/CTASection'

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

  // ── Séparation des médias par type — pour un rendu adapté
  const mediaImages = post.media?.filter(m => m.file_type === 'image') || []
  const mediaPdfs   = post.media?.filter(m => m.file_type === 'pdf')   || []
  const mediaLinks  = post.media?.filter(m => m.file_type === 'link')  || []
  const mediaVideos = post.media?.filter(m => m.file_type === 'video') || []
  const mediaAudios = post.media?.filter(m => m.file_type === 'audio') || []

  // ── Ressources à afficher dans la sidebar — PDF + liens externes
  const sidebarResources = [...mediaPdfs, ...mediaLinks]

  // ── Ressources dans le contenu — vidéos + audio + images
  const contentResources = [...mediaVideos, ...mediaAudios, ...mediaImages]

  // ── Rendu d'une ressource dans le contenu
  const renderContentMedia = (m, i) => {
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
    return null
  }

  return (
    <div className="bg-surface min-h-screen">

      {/* ── Hero immersif ── */}
      <HeroPage
        image={post.image_url || '/images/hero/hero-missions.jpg'}
        title={post.title}
      />

      {/* ── Contenu principal — layout éditorial 2 colonnes ── */}
      <section className="padding-y padding-x bg-surface">

        {/* Lien retour */}
        <a href="/medias-et-actualites" className="link-nav text-primary/50 hover:text-primary block mb-8">
          ← Retour aux médias
        </a>

        {/* Grid — colonne contenu 70% + sidebar 30% à partir de lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">

          {/* ── Colonne gauche — contenu éditorial (2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-md">

            {/* Contenu long — paragraphes lisibles */}
            {/* max-w-prose : limite la longueur des lignes pour le confort de lecture */}
            {post.content && (
              <div className="flex flex-col gap-sm max-w-prose">
                {post.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-body text-primary/80">{para}</p>
                ))}
              </div>
            )}

            {/* ── Ressources dans le contenu — vidéos, audio, images ── */}
            {/* Séparées du texte pour ne pas interrompre la lecture */}
            {contentResources.length > 0 && (
              <div className="flex flex-col gap-md">
                <h3 className="h3-style text-primary mb-0">Ressources associées</h3>
                {contentResources.map((m, i) => renderContentMedia(m, i))}
              </div>
            )}

          </div>

          {/* ── Colonne droite — sidebar informations pratiques ── */}
          {/* sticky : reste visible pendant le scroll du contenu */}
          <aside className="sticky top-24 self-start flex flex-col gap-md">

            {/* Card infos — n'affiche que les données disponibles */}
            <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
              <h3 className="h3-style text-primary mb-0">Informations</h3>

              {/* Thème */}
              {post.theme && (
                <div className="flex flex-col gap-xs">
                  <span className="text-eyebrow text-primary/40">Thème</span>
                  <span className="text-body text-primary/80">{post.theme}</span>
                </div>
              )}

              {/* Date */}
              {post.date && (
                <div className="flex flex-col gap-xs">
                  <span className="text-eyebrow text-primary/40">Date</span>
                  <span className="text-body text-primary/80">{formattedDate}</span>
                </div>
              )}

              {/* Lien externe principal — si disponible */}
              {post.external_url && (
                <a
                  href={post.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2"
                >
                  <Button label="Voir la source →" variant="primary" fullWidth />
                </a>
              )}

              {/* ── Champs futurs — décommenter quand disponibles en BDD ──
              {post.author && (
                <div className="flex flex-col gap-xs">
                  <span className="text-eyebrow text-primary/40">Auteur</span>
                  <span className="text-body text-primary/80">{post.author}</span>
                </div>
              )}
              {post.source && (
                <div className="flex flex-col gap-xs">
                  <span className="text-eyebrow text-primary/40">Source</span>
                  <a href={post.source} target="_blank" rel="noopener noreferrer"
                    className="link-cta text-accent">Voir la source →</a>
                </div>
              )}
              {post.read_time && (
                <div className="flex flex-col gap-xs">
                  <span className="text-eyebrow text-primary/40">Lecture</span>
                  <span className="text-body text-primary/80">{post.read_time} min</span>
                </div>
              )}
              */}
            </div>

            {/* ── Ressources téléchargeables — PDFs + liens en cards ── */}
            {sidebarResources.length > 0 && (
              <div className="bg-surface-mid rounded-2xl p-6 flex flex-col gap-sm">
                <h3 className="h3-style text-primary mb-0">Documents</h3>
                {sidebarResources.map((m, i) => (
                  <a
                    key={i}
                    href={m.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-xs p-3 bg-surface rounded-xl hover:shadow-sm transition-shadow"
                  >
                    {/* Icône selon le type */}
                    <span className="text-accent text-lg shrink-0">
                      {m.file_type === 'pdf' ? '📄' : '🔗'}
                    </span>
                    <span className="text-body text-primary/80 line-clamp-2">
                      {m.label || (m.file_type === 'pdf' ? 'Télécharger le PDF' : 'Voir le lien')}
                    </span>
                  </a>
                ))}
              </div>
            )}

          </aside>

        </div>
      </section>

      {/* ── CTA bas de page ── */}
      <CTASection
        title="Envie de vous engager à nos côtés ?"
        text="Découvrez nos missions et participez à des projets concrets sur le terrain."
        ctaLabel="Voir nos missions →"
        ctaHref="/missions"
      />

      <ScrollToTop />
    </div>
  )
}

export default MediaDetail