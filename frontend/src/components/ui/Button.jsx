// Button.jsx
// Composant réutilisable — deux variants : primary (terracotta) et secondary (vert foncé)

function Button({ label, variant = 'primary', onClick }) {

  const styles = {
    primary:   'bg-accent text-surface hover:bg-surface hover:text-accent hover:border-accent border border-transparent',
    secondary: 'bg-primary text-surface hover:bg-surface hover:text-primary hover:border-primary border border-transparent',
  }

  return (
    <button onClick={onClick} className={`px-5 py-2 rounded font-body font-semibold transition-colors cursor-pointer uppercase tracking-wider ${styles[variant]}`}>
      {label}
    </button>
  )
}

export default Button
