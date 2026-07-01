// TestimonialCard.jsx
// Carte témoignage — citation, auteur, mission, avatar

// ── React
import { VscQuote } from "react-icons/vsc"

function TestimonialCard({ quote, name, mission, avatar = '/images/placeholders/placeholder-testimonials.png' }) {
  return (
    <article className="bg-surface rounded-2xl p-6 h-[310px] md:h-[210px] lg:h-[280px] xl:h-[300px] w-full flex flex-col justify-between gap-sm">

      {/* Guillemets + Citation — text-body remplace text-[0.80rem] md:text-base (même valeurs, centralisées) */}
      <div className="flex gap-xs overflow-hidden">
        <span className="font-heading text-4xl text-surface-dark/70 leading-none shrink-0"><VscQuote /></span>
        <p className="text-body text-primary/80 italic">{quote}</p>
      </div>

      {/* Auteur — mt-2 retiré, justify-between du parent gère le positionnement en bas */}
      <div className="flex items-center gap-xs">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover" />
        <div>
          {/* h3-style sans mb-0 : pas de conteneur gap ici, la marge automatique sert normalement */}
          <p className="h3-style text-primary">{name}</p>
          <p className="text-caption text-primary/60">{mission}</p>
        </div>
      </div>

    </article>
  )
}

export default TestimonialCard