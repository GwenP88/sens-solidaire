// TeamMemberCardSmall.jsx
function TeamMemberCardSmall({ nom, role, avatar, bg = 'bg-surface-mid' }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${bg} rounded-2xl p-4 text-center`}>
      <img
        src={avatar || '/avatar-women.png'}
        alt={nom}
        className="w-16 h-16 rounded-full object-cover"
      />
      <p className="font-heading font-bold text-primary text-sm">{nom}</p>
      <p className="font-body text-xs text-primary/60 leading-relaxed">{role}</p>
    </div>
  )
}

export default TeamMemberCardSmall