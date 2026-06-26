// TeamMemberCardLarge.jsx
// Card membre équipe large — direction et bureau
// Portrait sur mobile+768+1024, horizontal sur desktop
// Props :
//   nom         : nom complet du membre
//   role        : intitulé du poste
//   description : formation ou expérience courte (optionnel)
//   avatar      : URL de la photo (avatar neutre par défaut)
//   bg          : classe Tailwind de fond — "bg-surface-mid" (défaut) | "bg-surface"

function TeamMemberCardLarge({ nom, role, description, avatar, bg = 'bg-surface-mid' }) {
  return (
    <div className={`flex flex-col items-center xl:flex-row xl:items-start gap-4 ${bg} rounded-2xl p-6 text-center xl:text-left`}>

      {/* Photo du membre */}
      <img
        src={avatar || '/images/placeholders/avatar-women.png'}
        alt={nom}
        className="w-20 h-20 rounded-full object-cover shrink-0"
      />

      {/* Infos texte */}
      <div className="flex flex-col gap-1">
        <p className="h3-style text-primary">{nom}</p>
        <p className="text-eyebrow text-accent-2">{role}</p>
        {description && (
          <p className="text-caption text-primary/60">{description}</p>
        )}
      </div>

    </div>
  )
}

export default TeamMemberCardLarge