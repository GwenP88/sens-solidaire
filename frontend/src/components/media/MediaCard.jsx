// MediaCard.jsx
// Card média & actualités — photo, date, thème, titre, extrait, CTA

function MediaCard({ title, content, theme, date, image_url, slug, external_url }) {

  // Formate la date
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Tronque le contenu à 150 caractères
  const excerpt = content?.length > 150 ? content.slice(0, 150) + '...' : content

  // Lien : PDF/externe direct ou page détail
  const href = external_url || `/medias/${slug}`
  const isExternal = !!external_url

  return (
    <article className="flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* Image */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={image_url || '/images/hero/hero-missions.jpg'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenu */}
      <div className="flex flex-col gap-3 p-6 flex-1">

        {/* Date + thème */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body text-xs text-primary/50">{formattedDate}</span>
          <span className="font-body text-xs text-primary/30">—</span>
          <span className="font-body text-xs font-bold text-accent-2">{theme}</span>
        </div>

        {/* Titre */}
        <h3 className="font-heading font-bold text-primary text-base leading-snug">{title}</h3>

        {/* Extrait */}
        <p className="font-body text-sm text-primary/60 leading-relaxed flex-1">{excerpt}</p>

        {/* CTA */}
        <a
          href={href}
          target={isExternal ? '_blank' : '_self'}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="font-body text-sm font-bold text-accent hover:text-accent/80 transition-colors mt-2"
        >
          {isExternal ? 'Consulter →' : 'Lire la suite →'}
        </a>

      </div>
    </article>
  )
}

export default MediaCard