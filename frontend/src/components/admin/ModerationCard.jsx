// components/admin/ModerationCard.jsx
// Carte de modération d'un témoignage (accueil du dashboard) — affichage seul, sans appel API.
// Dashboard.jsx possède les données et les appels API ; ce composant reçoit
// le témoignage et les actions (onApprove / onReject) par les props.

import { FaCheck, FaXmark } from "react-icons/fa6";

function ModerationCard({ testimonial, onApprove, onReject }) {
  return (
    <div className="border-b border-gray-200 py-6 flex flex-col gap-3">

      {/* ── Haut : avatar + identité + date ── */}
      <div className="flex items-start gap-4">

        {/* Photo réelle si elle existe, sinon image par défaut (fallback ||) */}
        <img
          src={testimonial.avatar_url || "/images/placeholders/placeholder-testimonials.webp"}
          alt={testimonial.author_name}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />

        {/* min-w-0 : autorise le texte à passer à la ligne au lieu de pousser la date hors écran */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{testimonial.author_name}</p>
          <p className="text-sm text-dash-legend">
            {testimonial.mission?.title} — {testimonial.mission?.country}
          </p>
        </div>

        <time className="text-xs text-dash-legend shrink-0">
          {new Date(testimonial.created_at).toLocaleDateString("fr-FR")}
        </time>
      </div>

      {/* ── Le témoignage ── */}
      <p className="text-dash-text italic">"{testimonial.content}"</p>

      {/* ── Actions — pleine largeur et plus hautes sur téléphone (zone tactile), compactes dès 768 px ── */}
      <div className="flex items-center gap-2">
        {/* emerald-600 conservé plutôt que le token dash-success (#14B8A6) : texte blanc sur dash-success = contraste insuffisant */}
        <button
          onClick={() => onApprove(testimonial.id)}
          className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-3 md:py-1.5 rounded
                     bg-emerald-600 text-white text-sm hover:bg-emerald-700"
        >
          <FaCheck aria-hidden="true" /> Valider
        </button>

        <button
          onClick={() => onReject(testimonial.id)}
          className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-3 md:py-1.5 rounded
                     bg-dash-danger/10 text-dash-danger text-sm hover:bg-dash-danger/20"
        >
          <FaXmark aria-hidden="true" /> Refuser
        </button>
      </div>
    </div>
  );
}

export default ModerationCard;
