// ActionCard.jsx

// ── Composants UI
import Badge from '../ui/BadgeODD'
import Button from '../ui/Button'
import { IconPin } from '../../utils/icons'

function ActionCard({ title, description, tags, slug, country, image, odds }) {
  return (
    <article className="flex rounded-xl overflow-hidden bg-primary text-surface h-[240px]">

      {/* Zone image */}
      <div className="relative w-1/3 shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 flex gap-4">
          {odds.map(n => <Badge key={n} number={n} />)}
        </div>
      </div>

      {/* Zone contenu */}
      <div className="flex flex-col justify-between p-5 gap-3">
        <h3 className="font-heading text-xl font-bold">{title}</h3>
        <p className="font-body text-sm opacity-80">{description}</p>
        <div className="flex gap-3 italic text-xs opacity-70">
          {tags.map(tag => <span key={tag}>• {tag}</span>)}
        </div>
        <div className="flex items-center justify-between">
          <a href={`/notre-impact/${slug}`}>
            <Button variant="primary" label="Découvrir →" />
          </a>
          <span className="flex items-center gap-1 text-xs opacity-70">
            <IconPin /> {country}
          </span>
        </div>
      </div>

    </article>
  )
}

export default ActionCard