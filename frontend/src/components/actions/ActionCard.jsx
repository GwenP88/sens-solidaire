// ActionCard.jsx
// Card action terrain — photo, badges ODD, titre, description, tags, CTA, pays
// Layout : portrait (image haut / contenu bas) en mobile et à partir de 1024px
//          paysage (image gauche / contenu droite) uniquement entre 768px et 1024px
// Hauteur fixe dans les deux layouts — garantit des cards identiques dans la grille

// ── Composants UI
import Badge from '../ui/BadgeODD'
import Button from '../ui/Button'
import { IconPin } from '../../utils/icons'

function ActionCard({ title, description, tags, slug, country, image, odds }) {
  return (
    // ── flex-col par défaut (portrait) → md:flex-row (paysage 768-1023px) → lg:flex-col (retour portrait dès 1024px)
    <article className="flex flex-col md:flex-row lg:flex-col h-[440px] md:h-[260px] lg:h-[480px] rounded-xl overflow-hidden bg-accent-2 text-surface">

      {/* Zone image — hauteur fixe en portrait, largeur fixe en paysage, shrink-0 dans les deux cas */}
      <div className="relative w-full h-48 md:w-64 md:h-full lg:w-full lg:h-48 shrink-0">
        <img src={image || '/images/placeholders/placeholder-action-1.png'} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 flex gap-xs">
          {odds.map(n => <Badge key={n} number={n} />)}
        </div>
      </div>

      {/* Zone contenu — occupe le reste de l'espace, 3 zones réparties par justify-between */}
      <div className="flex flex-col justify-between flex-1 min-w-0 p-5 gap-sm">

        {/* ── Zone haute — titre (2 lignes max) ── */}
        <h3 className="h3-style text-surface line-clamp-2">{title}</h3>

        {/* ── Zone centrale — description (3 lignes max) + tags ── */}
        <div className="flex flex-col gap-xs flex-1 justify-center">
          <p className="text-body text-surface line-clamp-3">{description}</p>
          <div className="text-caption text-surface/70 flex gap-xs italic flex-wrap">
            {tags.map(tag => <span key={tag}>• {tag}</span>)}
          </div>
        </div>

        {/* ── Zone basse — CTA + pays, toujours alignés en bas ── */}
        <div className="flex items-center justify-between">
          <a href={`/notre-impact/${slug}`}>
            <Button variant="primary" label="Découvrir →" />
          </a>
          <span className="text-caption text-surface/70 flex items-center gap-xs">
            <IconPin /> {country}
          </span>
        </div>

      </div>

    </article>
  )
}

export default ActionCard