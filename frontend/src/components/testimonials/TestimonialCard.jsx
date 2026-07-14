// TestimonialCard.jsx
// Carte témoignage — citation, auteur, mission, avatar

// ── React
import { VscQuote } from "react-icons/vsc"

function TestimonialCard({ quote, name, mission, avatar = '/images/placeholders/placeholder-testimonials.png' }) {
  return (
    <article className="bg-surface rounded-2xl p-6 h-[310px] md:h-[210px] lg:h-[280px] xl:h-[300px] w-full flex flex-col gap-sm">

      {/* Guillemets + Citation — centrée verticalement dans l'espace disponible.
          overflow-hidden en filet de sécurité, mais la limite de 280 caractères
          côté formulaire (TestimonialForm) garantit normalement que le texte
          tient dans la hauteur fixe de la card, sans avoir besoin de le tronquer. */}
      <div className="flex gap-xs flex-1 items-center overflow-hidden">
        <span className="font-heading text-4xl text-surface-dark/70 leading-none shrink-0 self-start"><VscQuote /></span>
        <p className="text-body text-primary/80 italic">{quote}</p>
      </div>

      {/* Auteur — toujours collé en bas grâce au flex-1 de la citation au-dessus */}
      <div className="flex items-center gap-xs shrink-0">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover" />
        <div>
          <p className="h3-style text-primary">{name}</p>
          <p className="text-caption text-primary/60">{mission}</p>
        </div>
      </div>

    </article>
  )
}

export default TestimonialCard