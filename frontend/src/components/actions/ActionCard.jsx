// ActionCard.jsx
// Carte action terrain — layout horizontal, image gauche avec badges ODD, contenu droite, CTA

import Badge from '../ui/BadgeODD'
import Button from '../ui/Button'
import { FaMapMarkerAlt } from 'react-icons/fa'

function ActionCard({ title, description, tags, slug, country, image, odds }) {
  return (
    <article className="flex rounded-xl overflow-hidden bg-primary text-surface h-[240px]">

      {/* Zone image — relative pour positionner les badges en overlay */}
      <div className="relative w-1/3 shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {/* Badges ODD superposés en haut à gauche */}
        <div className="absolute top-4 left-4 flex gap-4">
          {odds.map(n => <Badge key={n} number={n} />)}
        </div>
      </div>

      {/* Zone contenu — flex colonne avec espace entre les éléments */}
      <div className="flex flex-col justify-between p-5 gap-3">
        {/* Titre */}
        <h3 className="font-heading text-xl font-bold">{title}</h3>
        {/* Description */}
        <p className="font-body text-sm opacity-80">{description}</p>
        {/* Tags thématiques */}
        <div className="flex gap-3 italic text-xs opacity-70">
          {tags.map(tag => <span key={tag}>• {tag}</span>)}
        </div>
        {/* Bouton CTA + localisation */}
        <div className="flex items-center justify-between">
          <Button variant="primary" label="Découvrir →" />
          <span className="flex items-center gap-1 text-xs opacity-70">
            <FaMapMarkerAlt /> {country}
          </span>
        </div>
      </div>

    </article>
  )
}

export default ActionCard