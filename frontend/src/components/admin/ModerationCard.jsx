// components/admin/ModerationCard.jsx
// COMPOSANT PRÉSENTATIONNEL — aucun appel API ici.
// Reçoit un témoignage + des fonctions d'action par props, et se contente d'afficher.

import { FaCheck, FaXmark, FaStar } from "react-icons/fa6";

function ModerationCard({ testimonial, onApprove, onReject, onToggleHomepage }) {
  return (
    <div className="border-b border-gray-200 py-6 flex flex-col gap-3">

      {/* ── Haut : avatar + identité + date ── */}
      <div className="flex items-start gap-4">

        {/* Pas de photo dans la donnée → on réutilise le placeholder de Gwen.
            Le alt doit décrire QUI : mets le nom de l'auteur. */}
        <img
          src="/images/placeholders/placeholder-testimonials.png"
          alt={testimonial.author_name}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />

        <div className="flex-1">
          {/* Nom de l'auteur */}
          <p className="font-semibold">{testimonial.author_name}</p>

          {/* Contexte mission : titre + pays (c'est une relation imbriquée !) */}
          <p className="text-sm text-gray-500">
            {testimonial.mission.title} — {testimonial.mission.country}
          </p>
        </div>

        {/* Date de création, formatée en français */}
        <time className="text-xs text-gray-400">
          {new Date(testimonial.created_at).toLocaleDateString("fr-FR")}
        </time>
      </div>

      {/* ── Le témoignage lui-même ── */}
      <p className="text-gray-700 italic">"{testimonial.content}"</p>

      {/* ── Les actions ── */}
      <div className="flex items-center gap-2">

        {/* Valider : on appelle la fonction reçue en prop, en lui passant l'id du témoignage */}
        <button
          onClick={() => onApprove(testimonial.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded
                     bg-emerald-600 text-white text-sm hover:bg-emerald-700"
        >
          <FaCheck /> Valider
        </button>

        {/* Refuser */}
        <button
          onClick={() => onReject(testimonial.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded
                     bg-red-100 text-red-700 text-sm hover:bg-red-200"
        >
          <FaXmark /> Refuser
        </button>

        {/* À la une : l'apparence change selon le booléen show_homepage */}
        <button
          onClick={() => onToggleHomepage(testimonial.id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ml-auto ${
            testimonial.show_homepage
              ? "bg-amber-400 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaStar /> À la une
        </button>
      </div>
    </div>
  );
}

export default ModerationCard;