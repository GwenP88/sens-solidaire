// TestimonialCard.jsx
// Carte témoignage — citation, auteur, mission, avatar

// ── React
import { VscQuote } from "react-icons/vsc"

function TestimonialCard({ quote, name, mission, avatar = '/images/placeholders/placeholder-testimonials.png' }) {
  return (
    <article className="bg-surface rounded-2xl p-6 h-[310px] md:h-[210px] lg:h-[280px] xl:h-[300px] w-full flex flex-col justify-between gap-4">

      {/* Guillemets + Citation */}
      <div className="flex gap-3 overflow-hidden">
        <span className="font-heading text-4xl text-surface-dark/70 leading-none shrink-0"><VscQuote /></span>
        <p className="text-body text-primary/80 italic text-[0.80rem] md:text-base">
          {quote}
        </p>
      </div>

      {/* Auteur */}
      <div className="flex items-center gap-3 mt-2">
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