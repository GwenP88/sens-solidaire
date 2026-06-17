// TeamMemberCardLarge.jsx
function TeamMemberCardLarge({ nom, role, description, avatar, bg = 'bg-surface-mid' }) {
  return (
    <div className={`flex gap-4 items-start ${bg} rounded-2xl p-6`}>
      <img
        src={avatar || '/avatar-women.png'}
        alt={nom}
        className="w-16 h-16 rounded-full object-cover shrink-0"
      />
      <div className="flex flex-col gap-1">
        <p className="font-heading font-bold text-primary text-sm">{nom}</p>
        <p className="font-body font-bold text-accent-2 text-xs">{role}</p>
        {description && (
          <p className="font-body text-xs text-primary/60 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}

export default TeamMemberCardLarge