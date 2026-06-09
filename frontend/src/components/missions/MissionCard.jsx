// MissionCard.jsx
// Carte mission — image immersive, badge, titre, description, durée, CTA
import Button from '../ui/Button'
import { PiClockCounterClockwiseBold } from "react-icons/pi";

function MissionCard({ image, badge, title, description, duration, slug }) {
  return (
    <article className="w-[380px] h-[240px] rounded-[20px] relative overflow-hidden cursor-pointer">
      {/* Image de fond */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>
      {/* Contenu */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Badge */}
        <div className="w-fit">
          <span className="font-body text-xs font-bold text-surface bg-accent-green/80 px-2 py-1 rounded">
            {badge}
          </span>
        </div>

        {/* Bas de carte : titre + description + durée + bouton */}
        <div className="flex flex-col gap-1">
          <h3 className="font-heading font-bold text-surface text-xl">{title}</h3>
          <p className="font-body text-surface text-sm line-clamp-2">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-surface text-xs flex items-center gap-2">
              <PiClockCounterClockwiseBold /> {duration}
            </span>
            <Button label="je veux partir →" variant="primary" />
          </div>
        </div>
      </div>
    </article>
  )
}

export default MissionCard