// TeamMemberCardSmall.jsx
// Card membre équipe compacte — conseil d'administration et "également à nos côtés"
// Props :
//   nom    : nom complet du membre
//   role   : intitulé du poste
//   avatar : URL de la photo (avatar neutre par défaut)
//   bg     : classe Tailwind de fond — "bg-surface-mid" (défaut) | "bg-surface"

function TeamMemberCardSmall({ nom, role, avatar, bg = 'bg-surface-mid' }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${bg} rounded-2xl p-4 text-center`}>

      {/* Photo du membre */}
      <img
        src={avatar || '/images/placeholders/avatar-women.png'}
        alt={nom}
        className="w-16 h-16 rounded-full object-cover"
      />

      {/* Nom */}
      <p className="h3-style text-primary">{nom}</p>

      {/* Rôle */}
      <p className="text-caption text-primary/60">{role}</p>

    </div>
  )
}

export default TeamMemberCardSmall