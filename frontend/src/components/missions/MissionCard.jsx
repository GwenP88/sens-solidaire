// MissionCard.jsx
// Carte mission — image immersive, badge, titre, description, durée, CTA

// ── Composants UI
import Button from '../ui/Button'
import { IconClock } from '../../utils/icons'

function MissionCard({ image, badge, title, description, duration, slug, ctaLabel, ctaUrl }) {

  // ── Couleurs des badges par type de mission
  const badgeColors = {
    'Volontariat individuel': '#2F8A3A',
    'Service civique': '#1D6FA4',
    'Groupe jeunes': '#8B5E3C',
    'Congé solidaire': '#8B6914',
  }

  // ── Lien = ctaUrl si fourni, sinon construit depuis le slug
  const href = ctaUrl || `/missions/${slug}`

  return (
    <a href={href}>
      <article className="w-full h-auto min-h-[240px] md:h-[240px] rounded-[20px] relative overflow-hidden cursor-pointer">

        {/* Image de fond */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Contenu */}
        <div className="relative h-full flex flex-col justify-between p-6 gap-4">

          {/* Badge type de mission */}
          <div className="w-fit">
            <span className="text-eyebrow text-surface px-2 py-1 rounded text-[0.6rem] md:text-[0.75rem]" style={{ backgroundColor: badgeColors[badge] }}>
              {badge}
            </span>
          </div>

          {/* Bas de carte — titre + description + durée + bouton */}
          <div className="flex flex-col gap-1">
            <h3 className="h3-style text-surface">{title}</h3>
            <p className="text-body text-surface">{description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-caption text-surface flex items-center gap-2">
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