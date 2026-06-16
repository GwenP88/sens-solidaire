// MissionCard.jsx
// Carte mission — image immersive, badge, titre, description, durée, CTA
import Button from '../ui/Button'
import { IconClock } from '../../utils/icons'

function MissionCard({ image, badge, title, description, duration, slug, ctaLabel, ctaUrl }) {
  
  const badgeColors = {
    'Volontariat individuel': '#2F8A3A',
    'Service civique': '#1D6FA4',
    'Groupe jeunes': '#8B5E3C',
    'Congé solidaire': '#8B6914',
  }

// Lien = ctaUrl si fourni, sinon construit depuis le slug
const href = ctaUrl || `/missions/${slug}`

  return (
    <a href={href}>
      <article className="w-full h-[240px] rounded-[20px] relative overflow-hidden cursor-pointer">
        {/* Image de fond */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/45"></div>
        {/* Contenu */}
        <div className="relative h-full flex flex-col justify-between p-6">
          {/* Badge */}
          <div className="w-fit">
            <span className="font-body text-xs font-bold text-surface px-2 py-1 rounded" style={{ backgroundColor: badgeColors[badge]}}>
              {badge}
            </span>
          </div>

          {/* Bas de carte : titre + description + durée + bouton */}
          <div className="flex flex-col gap-1">
            <h3 className="font-heading font-bold text-surface text-xl">{title}</h3>
            <p className="font-body text-surface text-sm line-clamp-2">{description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-body text-surface text-xs flex items-center gap-2">
                <IconClock /> {duration}
              </span>
              <Button label={ctaLabel} variant="primary" />
            </div>
          </div>
        </div>
      </article>
    </a>
  )
}

export default MissionCard