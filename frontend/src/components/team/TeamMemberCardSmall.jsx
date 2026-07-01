// TeamMemberCardSmall.jsx
// Card membre équipe compacte — conseil d'administration et "également à nos côtés"

function TeamMemberCardSmall({ nom, role, avatar, bg = 'bg-surface-mid' }) {
  return (
    <div className={`flex flex-col items-center gap-sm ${bg} rounded-2xl p-4 text-center`}>

      {/* Photo du membre */}
      <img
        src={avatar || '/images/placeholders/avatar-women.png'}
        alt={nom}
        className="w-16 h-16 rounded-full object-cover"
      />

      {/* Nom — h3-style pas dans un conteneur gap, marge automatique s'applique normalement */}
      <p className="h3-style text-primary">{nom}</p>

      {/* Rôle */}
      <p className="text-caption text-primary/60">{role}</p>

    </div>
  )
}

export default TeamMemberCardSmall