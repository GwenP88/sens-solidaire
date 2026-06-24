// Hero.jsx
// Section Hero — image immersive pleine largeur avec titre, accroche et CTA

// ── Composants UI
import Button from '../ui/Button'

function Hero() {
  return (
    <section className="relative w-full h-screen flex items-end" style={{ backgroundImage: `url(/images/hero/hero-home.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative px-6 pb-12 md:px-16 md:pb-24 flex flex-col gap-6">

        {/* Surtitre */}
        <p className="text-eyebrow text-surface">
          Sens Solidaire
        </p>

        {/* Titre */}
        <h1 className="h1-style text-surface max-w-3xl">
          Une expérience unique de volontariat international
        </h1>

        {/* Accroche */}
        <p className="text-lead text-surface max-w-4xl">
          Nous sommes une association d'intérêt général composée de professionnels qualifiés et diplomés qui agissent pour la préservation de l'environnement et le développement territorial à travers des actions de solidarité internationale.
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