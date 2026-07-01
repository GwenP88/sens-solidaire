// TeamMemberCardLarge.jsx
// Card membre équipe large — direction et bureau
// Portrait sur mobile+768+1024, horizontal sur desktop

function TeamMemberCardLarge({ nom, role, description, avatar, bg = 'bg-surface-mid' }) {
  return (
    <div className={`flex flex-col items-center xl:flex-row xl:items-start gap-sm ${bg} rounded-2xl p-6 text-center xl:text-left`}>

      {/* Photo du membre */}
      <img
        src={avatar || '/images/placeholders/avatar-women.png'}
        alt={nom}
        className="w-20 h-20 rounded-full object-cover shrink-0"
      />

      {/* Infos texte — h3-style et text-eyebrow neutralisés car dans flex flex-col gap-xs */}
      <div className="flex flex-col gap-xs">
        <p className="h3-style text-primary mb-0">{nom}</p>
        <p className="text-eyebrow text-accent-2 mb-0">{role}</p>
        {description && (
          <p className="text-caption text-primary/60">{description}</p>
        )}
      </div>

    </div>
  )
}

export default TeamMemberCardLarge