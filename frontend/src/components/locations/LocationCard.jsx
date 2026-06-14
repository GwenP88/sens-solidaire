// LocationCard.jsx
// Card lieu partenaire — réutilisée sur Missions.jsx et MissionDetail.jsx
// TODO V2 : page /lieux/:slug à créer

import { Link } from 'react-router-dom'

function LocationCard({ slug, name, image_url }) {
  return (
    <Link to={`/lieux/${slug}`} className="group">
      <div className="rounded-xl overflow-hidden bg-surface hover:shadow-md transition-shadow">
        <div className="h-40 overflow-hidden">
          <img
            src={image_url || '/images/placeholder.jpg'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex flex-col gap-2">
          <p className="font-heading font-bold text-primary text-sm">{name}</p>
          <span className="font-body text-xs font-semibold text-accent group-hover:text-primary transition-colors">
            En savoir plus →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default LocationCard