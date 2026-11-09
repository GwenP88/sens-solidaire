// Button.jsx
// Composant réutilisable — trois variants : primary (terracotta), secondary (bleu-vert), light (clair)
// Rendu selon les props : `to` → lien interne (<Link>), `href` → lien externe (nouvel onglet), sinon <button>.

// ── Router
import { Link } from 'react-router-dom'

// ── Styles par variant — fond, texte, hover, bordure
const STYLES = {
  primary:   'bg-accent text-surface hover:bg-surface hover:text-accent hover:border-accent border border-transparent',
  secondary: 'bg-primary text-surface hover:bg-surface hover:text-primary hover:border-primary border border-transparent',
  light: 'bg-surface text-accent-2 hover:bg-dark hover:text-surface hover:border-surface border border-transparent',
}

// Props :
//   label, variant, fullWidth, className : apparence
//   to        : chemin interne (ex. "/contact") → <Link>, sans rechargement de page
//   href      : adresse externe → <a target="_blank">, ouverte dans un nouvel onglet
//   onClick, type, disabled : uniquement pour un vrai bouton (<button>)
//
// Accessibilité (tâche 173) : un lien qui ressemble à un bouton doit être UN lien, pas un <button>
// placé dans un <a> (HTML invalide, deux arrêts au clavier sur le même élément).
function Button({ label, variant = 'primary', onClick, fullWidth = false, type = 'button', disabled = false, to, href, className = '' }) {
  const classes = `btn-base ${STYLES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`

  // inline-block + text-center : un lien est « inline » par défaut, il doit garder la forme d'un bouton
  if (to) {
    return <Link to={to} className={`${classes} inline-block text-center`}>{label}</Link>
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${classes} inline-block text-center`}>
        {label}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  )
}

export default Button
