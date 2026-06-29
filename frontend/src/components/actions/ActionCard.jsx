// ActionCard.jsx

// ── Composants UI
import Badge from '../ui/BadgeODD'
import Button from '../ui/Button'
import { IconPin } from '../../utils/icons'

function ActionCard({ title, description, tags, slug, country, image, odds }) {
  return (
    <article className="flex flex-col xl:flex-row rounded-xl overflow-hidden bg-accent-2 text-surface h-auto xl:h-[280px]">

      {/* Zone image */}
      <div className="relative w-full h-40 xl:w-1/3 xl:h-auto shrink-0">
        <img src={image || '/images/placeholders/placeholder-action-1.png'} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 flex gap-4">
          {odds.map(n => <Badge key={n} number={n} />)}
        </div>
      </div>

      {/* Zone contenu */}
      <div className="flex flex-col justify-between flex-1 p-6 gap-4">

        {/* Titre — haut */}
        <h3 className="h3-style text-surface">{title}</h3>

        {/* Description — milieu */}
        <p className="text-body text-surface/80 flex-1 line-clamp-3">{description}</p>

        {/* Bas — tags + CTA + pays */}
        <div className="flex flex-col gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="text-caption text-surface/70 italic">• {tag}</span>
            ))}
          </div>
          {/* CTA + pays */}
          <div className="flex items-center justify-between">
            <a href={`/notre-impact/${slug}`}>
              <Button label="Découvrir →" variant="primary" />
            </a>
            <span className="text-caption text-surface/60 flex items-center gap-1">
              <IconPin className="text-xs" />{country}
            </span>
          </div>
        </div>

      </div>

    </article>
  )
}

export default ActionCard