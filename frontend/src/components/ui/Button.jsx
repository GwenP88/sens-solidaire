// Button.jsx
// Composant réutilisable — deux variants : primary (terracotta) et secondary (vert foncé)

function Button({ label, variant = 'primary', onClick, fullWidth = false, type = 'button', disabled = false }) {

  // ── Styles par variant — fond, texte, hover, bordure
  const styles = {
    primary:   'bg-accent text-surface hover:bg-surface hover:text-accent hover:border-accent border border-transparent',
    secondary: 'bg-primary text-surface hover:bg-surface hover:text-primary hover:border-primary border border-transparent',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded text-label transition-colors cursor-pointer ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  )
}

export default Button