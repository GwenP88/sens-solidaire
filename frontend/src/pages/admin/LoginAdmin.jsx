// LoginAdmin.jsx
// Page de connexion admin — split layout : image gauche, formulaire droite, sans Navbar ni Footer

// ── React
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── API
import { loginAdmin } from '../../services/api'

function LoginAdmin() {
  const navigate = useNavigate()

  // États du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Soumission du formulaire
  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    try {
      // loginAdmin gère déjà : bonne URL (proxy Vite), credentials: "include"
      // pour le cookie refresh token, et le message d'erreur du backend
      const token = await loginAdmin(email, password)

      // Stockage du token JWT en localStorage
      localStorage.setItem('admin_token', token)

      // Redirection vers le dashboard
      navigate('/admin')

    } catch (err) {
      console.error("Erreur login:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">

      {/* Côté gauche — image immersive avec overlay */}
      <div className="relative w-1/2 hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/images/hero/hero-home.jpg)` }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Côté droit — formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white">

        {/* Logo */}
        <div className="rounded-full p-2 mb-4">
          <img src="/logo.png" alt="Sens Solidaires" className="h-24" />
        </div>

        {/* Titre */}
        <h1 className="font-heading font-bold text-primary text-2xl mb-1">Connexion</h1>
        <p className="font-body text-primary/60 text-sm mb-8">Accédez à votre espace administration.</p>

        {/* Formulaire */}
        <div className="w-full max-w-sm flex flex-col gap-4">

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 font-body text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-primary">Email</label>
            <input
              type="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-surface-dark rounded px-4 py-2 font-body text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-primary">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-surface-dark rounded px-4 py-2 font-body text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Se souvenir de moi */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="accent-primary" />
            <label htmlFor="remember" className="font-body text-sm text-primary/60">Se souvenir de moi</label>
          </div>

          {/* Bouton */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-accent text-surface font-body font-semibold uppercase tracking-wider px-5 py-2 rounded hover:bg-surface hover:text-accent hover:border-accent border border-transparent transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Je me connecte →'}
          </button>

          {/* Mot de passe oublié */}
          <a href="#" className="font-body text-sm text-primary/60 hover:text-primary text-center transition-colors">
            Mot de passe oublié ?
          </a>

        </div>

        {/* Footer légal */}
        <p className="font-body text-primary/60 text-xs mt-12">© Sens Solidaires</p>

      </div>
    </div>
  )
}

export default LoginAdmin