// Hero.jsx
// Section Hero — image immersive pleine largeur avec titre, accroche et CTA

// ── Composants UI
import Button from '../ui/Button'

function Hero() {
  return (
    <section className="relative w-full h-screen flex items-end" style={{ backgroundImage: `url(/images/hero_home.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative px-16 pb-24 flex flex-col gap-6">
        {/* Surtitre */}
        <p className="font-body font-bold text-surface text-lg uppercase tracking-widest">
          Sens Solidaire
        </p>

        {/* Titre */}
        <h1 className="font-heading font-bold text-surface text-6xl max-w-3xl leading-tight">
          Une expérience unique de volontariat international
        </h1>

        {/* Accroche */}
        <p className="font-body font-semibold text-surface text-lg max-w-xl">
          Sens Solidaire agit en France et à l'international pour l'éducation, l'environnement et la solidarité.
        </p>

        {/* Boutons CTA */}
        <div className="flex gap-4">
          <a href="/missions">
            <Button label="Partir en mission →" variant="primary" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero