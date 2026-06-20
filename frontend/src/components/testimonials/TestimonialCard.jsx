// TestimonialCard.jsx
// Carte témoignage — citation, auteur, mission, avatar

// ── React
import { VscQuote } from "react-icons/vsc"

function TestimonialCard({ quote, name, mission, avatar = '/placeholder-testimonials.png' }) {
  return (
    <article className="bg-surface rounded-2xl p-6 h-[270px] w-full flex flex-col justify-between gap-4">

      {/* Guillemets + Citation */}
      <div className="flex gap-3 overflow-hidden">
        <span className="font-heading text-4xl text-surface-dark/70 leading-none shrink-0"><VscQuote /></span>
        <p className="font-heading text-sm text-primary">
          {quote}
        </p>
      </div>

      {/* Auteur */}
      <div className="flex items-center gap-3 mt-2">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover" />
        <div>
          <p className="font-body font-bold text-primary/70 text-sm">{name}</p>
          <p className="font-body italic font-bold text-surface-dark text-xs">{mission}</p>
        </div>
      </div>
    </article>
  )
}

export default TestimonialCard