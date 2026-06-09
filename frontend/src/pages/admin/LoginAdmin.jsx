// LoginAdmin.jsx
// Page de connexion admin — split layout : image gauche, formulaire droite, sans Navbar ni Footer

function LoginAdmin() {
  return (
    <div className="flex h-screen">

      {/* Côté gauche — image immersive avec overlay */}
      <div className="relative w-1/2 hidden lg:block">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/images/hero_home.jpg)` }}></div>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Côté droit — formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white">

        {/* Logo */}
        <div className="rounded-full p-2 mb-4">
          <img src="/Logo.png" alt="Sens Solidaire" className="h-24" />
        </div>

        {/* Titre */}
        <h1 className="font-heading font-bold text-primary text-2xl mb-1">Connexion</h1>
        <p className="font-body text-primary/60 text-sm mb-8">Accédez à votre espace administration.</p>

        {/* Formulaire */}
        <div className="w-full max-w-sm flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-primary">Email</label>
            <input
              type="email"
              placeholder="votre.email@exemple.com"
              className="border border-surface-dark rounded px-4 py-2 font-body text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1">
            <label className="font-body text-sm font-semibold text-primary">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-surface-dark rounded px-4 py-2 font-body text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Se souvenir de moi */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="accent-primary" />
            <label htmlFor="remember" className="font-body text-sm text-primary/70">Se souvenir de moi</label>
          </div>

          {/* Bouton */}
          <button className="bg-accent text-surface font-body font-semibold uppercase tracking-wider px-5 py-2 rounded hover:bg-surface hover:text-accent hover:border-accent border border-transparent transition-colors cursor-pointer">
            Je me connecte →
          </button>

          {/* Mot de passe oublié */}
          <a href="#" className="font-body text-sm text-primary/60 hover:text-primary text-center transition-colors">
            Mot de passe oublié ?
          </a>

        </div>

        {/* Footer légal */}
        <p className="font-body text-primary/50 text-xs mt-12">© Sens Solidaires</p>

      </div>
    </div>
  )
}

export default LoginAdmin