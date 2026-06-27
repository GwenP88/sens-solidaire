// components/admin/ModerationCard.jsx
// COMPOSANT PRÉSENTATIONNEL — aucun appel API ici.
// Reçoit un témoignage + des fonctions d'action par props, et se contente d'afficher.

import { FaCheck, FaXmark } from "react-icons/fa6";

function ModerationCard({ testimonial, onApprove, onReject }) {
  return (
    <div className="border-b border-gray-200 py-6 flex flex-col gap-3">

      {/* ── Haut : avatar + identité + date ── */}
      <div className="flex items-start gap-4">

        {/* Photo réelle si elle existe, sinon placeholder de Gwen (fallback ||) */}
        <img
          src={testimonial.avatar_url || "/images/placeholders/placeholder-testimonials.png"}
          alt={testimonial.author_name}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />

        <div className="flex-1">
          <p className="font-semibold">{testimonial.author_name}</p>
          <p className="text-sm text-gray-500">
            {testimonial.mission?.title} — {testimonial.mission.country}
          </p>
        </div>

        <time className="text-xs text-gray-400">
          {new Date(testimonial.created_at).toLocaleDateString("fr-FR")}
        </time>
      </div>

      {/* ── Le témoignage ── */}
      <p className="text-gray-700 italic">"{testimonial.content}"</p>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onApprove(testimonial.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded
                     bg-emerald-600 text-white text-sm hover:bg-emerald-700"
        >
          <FaCheck /> Valider
        </button>

        <button
          onClick={() => onReject(testimonial.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded
                     bg-red-100 text-red-700 text-sm hover:bg-red-200"
        >
          <FaXmark /> Refuser
        </button>
      </div>
    </div>
  );
}

export default ModerationCard;