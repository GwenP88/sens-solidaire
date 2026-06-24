// LoginAdmin.jsx
// Page de connexion admin — split layout : image gauche, formulaire droite, sans Navbar ni Footer

// ── React
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginAdmin() {
  const navigate = useNavigate()

  // ── États du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // ── Soumission du formulaire — envoi vers l'API auth
  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Email ou mot de passe incorrect.')
        return
      }

      // ── Stockage du token JWT et redirection
      localStorage.setItem('admin_token', data.token)
      navigate('/admin')

    } catch (err) {
      setError('Impossible de contacter le serveur. Vérifie que le backend est démarré.')
    } finally {
      setLoading(false)
    }
  }

  // ── Classe CSS commune pour les champs
  const inputClass = "text-body text-primary border border-surface-dark rounded px-4 py-2 focus:outline-none focus:border-primary w-full"

  return (
    <div className="flex h-screen">

      {/* Côté gauche — image immersive avec overlay — masquée sur mobile */}
      <div className="relative w-1/2 hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/images/hero/hero-home.jpg)` }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Côté droit — formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white gap-4">

        {/* Logo */}
        <div className="rounded-full p-2">
          <img src="/Logo.png" alt="Sens Solidaire" className="h-24" />
        </div>

        {/* Titre */}
        <h1 className="h1-style text-primary">Connexion</h1>
        <p className="text-body text-primary/60">Accédez à votre espace administration.</p>

        {/* Formulaire */}
        <div className="w-full max-w-sm flex flex-col gap-4 mt-4">

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-body px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-eyebrow text-primary">Email</label>
            <input
              type="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1">
            <label className="text-eyebrow text-primary">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Se souvenir de moi */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="accent-primary" />
            <label htmlFor="remember" className="text-body text-primary/60">Se souvenir de moi</label>
          </div>

          {/* Bouton connexion */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-accent text-surface text-label px-5 py-2 rounded hover:bg-surface hover:text-accent hover:border-accent border border-transparent transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Je me connecte →'}
          </button>

          {/* Mot de passe oublié */}
          <a href="#" className="link-nav text-primary/60 hover:text-primary text-center">
            Mot de passe oublié ?
          </a>

        </div>

        {/* Footer légal */}
        <p className="text-caption text-primary/40 mt-8">© Sens Solidaire</p>

      </div>
    </div>
  )
}

export default LoginAdmin