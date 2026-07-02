// ImpactCard.jsx
// Card action terrain — wrapper de BaseContentCard
// Zone haute : badges ODD | Zone centrale : titre + description + tags | Zone basse : CTA + pays

// ── Composants UI
import Badge from '../ui/BadgeODD'
import Button from '../ui/Button'
import BaseContentCard from '../ui/BaseContentCard'
import { IconPin } from '../../utils/icons'

function ImpactCard({ title, description, tags, slug, country, image, odds }) {
  return (
    <BaseContentCard
      image={image}
      fallbackImage="/images/placeholders/placeholder-action-1.png"
      alt={title}
      bg="bg-accent-2"
      className="text-surface"
      imageOverlay={
        <div className="absolute top-4 left-4 flex gap-xs">
          {odds.map(n => <Badge key={n} number={n} />)}
        </div>}
    >

      {/* ── Zone centrale — titre + description + tags ── */}
      <div className="flex flex-col gap-xs flex-1 justify-center">
        <h3 className="h3-style text-surface line-clamp-2 mb-0">{title}</h3>
        <p className="text-body text-surface line-clamp-3">{description}</p>
        <div className="text-caption text-surface/70 flex gap-xs italic flex-wrap">
          {tags.map(tag => <span key={tag}>• {tag}</span>)}
        </div>
      </div>

      {/* ── Zone basse — CTA + pays ── */}
      <div className="flex items-center justify-between">
        <a href={`/notre-impact/${slug}`}>
          <Button variant="light" label="Découvrir →" />
        </a>
        <span className="text-caption text-surface/70 flex items-center gap-xs">
          <IconPin /> {country}
        </span>
      </div>

    </BaseContentCard>
  )
}

export default ImpactCard