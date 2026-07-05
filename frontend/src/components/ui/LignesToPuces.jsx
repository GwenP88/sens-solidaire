// LignesToPuces.jsx
// Transforme un texte multi-lignes (\n) en liste à puces
// Utilisé par MissionDetail pour les champs texte libre (santé, admin, rôle volontaire)

function LignesToPuces({ texte, className = "" }) {
  if (!texte) return null
  const lignes = texte.split('\n').filter(l => l.trim() !== '')
  return (
    <ul className={`flex flex-col gap-0 list-none ${className}`}>
      {lignes.map((ligne, i) => (
        <li key={i} className="flex items-start gap-xs text-body text-primary/80">
          <span className="text-accent mt-1 shrink-0">•</span>
          <span>{ligne.trim()}</span>
        </li>
      ))}
    </ul>
  )
}

export default LignesToPuces