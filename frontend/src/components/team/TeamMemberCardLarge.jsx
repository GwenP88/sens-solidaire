// TeamMemberCardLarge.jsx
// Card membre équipe large — direction et bureau
// Props :
//   nom         : nom complet du membre
//   role        : intitulé du poste
//   description : formation ou expérience courte (optionnel)
//   avatar      : URL de la photo (avatar neutre par défaut)
//   bg          : classe Tailwind de fond — "bg-surface-mid" (défaut) | "bg-surface"

function TeamMemberCardLarge({ nom, role, description, avatar, bg = 'bg-surface-mid' }) {
  return (
    // ── Card horizontale — avatar à gauche + infos à droite
    <div className={`flex gap-4 items-start ${bg} rounded-2xl p-6`}>

      {/* Photo du membre — avatar neutre si absente */}
      <img
        src={avatar || '/avatar-women.png'}
        alt={nom}
        className="w-16 h-16 rounded-full object-cover shrink-0"
      />

      {/* Infos texte — nom, rôle, description */}
      <div className="flex flex-col gap-1">
        <p className="h3-style text-primary">{nom}</p>
        <p className="text-eyebrow text-accent-2">{role}</p>

        {/* Description optionnelle — formation ou expérience */}
        {description && (
          <p className="text-caption text-primary/60">{description}</p>
        )}
      </div>

    </div>
  )
}

export default TeamMemberCardLarge