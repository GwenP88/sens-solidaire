// TeamMemberCard.jsx
// Card membre équipe — fusion de TeamMemberCardLarge et TeamMemberCardSmall
// Props :
//   variant     : "large" (direction/bureau) | "small" (CA/également)
//   nom         : nom complet
//   role        : intitulé du poste
//   description : formation/expérience (large uniquement)
//   avatar      : URL de la photo
//   bg          : classe de fond (défaut : bg-surface-mid)

function TeamMemberCard({ variant = 'large', nom, role, description, avatar, bg = 'bg-surface-mid' }) {

  if (variant === 'large') {
    return (
      <div className={`flex flex-col items-center xl:flex-row xl:items-start gap-sm ${bg} rounded-2xl p-6 text-center xl:text-left`}>
        <img
          src={avatar || '/images/placeholders/avatar-women.png'}
          alt={nom}
          className="w-20 h-20 rounded-full object-cover shrink-0"
        />
        <div className="flex flex-col gap-xs">
          <p className="h3-style text-primary mb-0">{nom}</p>
          <p className="text-eyebrow text-accent-2 mb-0">{role}</p>
          {description && <p className="text-caption text-primary/60">{description}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-sm ${bg} rounded-2xl p-4 text-center`}>
      <img
        src={avatar || '/images/placeholders/avatar-women.png'}
        alt={nom}
        className="w-16 h-16 rounded-full object-cover"
      />
      <p className="h3-style text-primary">{nom}</p>
      <p className="text-caption text-primary/60">{role}</p>
    </div>
  )
}

export default TeamMemberCard