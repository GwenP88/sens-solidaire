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
      <div className="flex flex-col justify-between p-5 gap-3">
        <h3 className="h3-style text-surface">{title}</h3>
        <p className="text-body text-surface">{description}</p>
        <div className="text-caption text-surface/70 flex gap-3 italic">
          {tags.map(tag => <span key={tag}>• {tag}</span>)}
        </div>
        <div className="flex items-center justify-between">
          <a href={`/notre-impact/${slug}`}>
            <Button variant="primary" label="Découvrir →" />
          </a>
          <span className="text-caption text-surface/70 flex items-center gap-1">
            <IconPin /> {country}
          </span>
        </div>
      </div>

    </article>
  )
}

export default ActionCard