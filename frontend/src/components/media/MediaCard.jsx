// MediaCard.jsx
// Card média & actualités — photo, date, thème, titre, extrait, CTA
// Layout : portrait (image haut / contenu bas) en mobile et à partir de 1024px
//          paysage (image gauche / contenu droite) uniquement entre 768px et 1024px,
//          car la grille passe à 1 colonne sur cette plage et le format portrait y est moins lisible
// Hauteur fixe dans les deux layouts — garantit des cards identiques dans la grille

function MediaCard({ title, content, theme, date, image_url, slug, external_url }) {

  // ── Formate la date en français
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // ── Lien : PDF/externe direct ou page détail
  const href = external_url || `/medias/${slug}`
  const isExternal = !!external_url

  return (
    // ── flex-col par défaut (portrait) → md:flex-row (paysage 768-1023px) → lg:flex-col (retour portrait dès 1024px)
    // ── Hauteur fixe différente par layout : h-[480px] portrait / md:h-[280px] paysage / lg:h-[480px] retour portrait
    <article className="flex flex-col md:flex-row lg:flex-col h-[440px] md:h-[260px] lg:h-[480px] bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* Image — hauteur fixe en portrait, largeur fixe en paysage, shrink-0 dans les deux cas */}
      <div className="w-full h-48 md:w-64 md:h-full lg:w-full lg:h-48 shrink-0 overflow-hidden">
        <img
          src={image_url || '/images/hero/hero-missions.jpg'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenu — occupe le reste de l'espace, 3 zones réparties par justify-between */}
      <div className="flex flex-col justify-between flex-1 min-w-0 p-6">

        {/* ── Zone haute — date + thème ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-caption text-primary/50">{formattedDate}</span>
          <span className="text-caption text-primary/30">—</span>
          <span className="text-eyebrow text-accent-2">{theme}</span>
        </div>

        {/* ── Zone centrale — titre (2 lignes max) + extrait (4 lignes max) ── */}
        <div className="flex flex-col gap-2 flex-1 justify-center">
          <h3 className="h3-style text-primary line-clamp-2">{title}</h3>
          <p className="text-body text-primary/60 line-clamp-4">{content}</p>
        </div>

        {/* ── Zone basse — CTA toujours aligné en bas ── */}
        <a
          href={href}
          target={isExternal ? '_blank' : '_self'}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="link-cta text-accent hover:text-accent/80 mt-2"
        >
          {isExternal ? 'Consulter →' : 'Lire la suite →'}
        </a>

      </div>
    </article>
  )
}

export default MediaCard