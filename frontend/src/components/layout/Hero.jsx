// Hero.jsx
// Section Hero — image immersive pleine largeur avec titre, accroche et CTA

// ── Composants UI
import Button from '../ui/Button'

function Hero() {
  return (
    <section className="relative w-full h-screen flex items-end" style={{ backgroundImage: `url(/images/hero/hero-home.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50"></div>
      {/* gap-sm gère l'espacement entre tous les enfants — text-eyebrow et text-lead
          neutralisés (mb-0) pour éviter le cumul avec ce gap */}
      <div className="relative padding-x pt-24 md:pt-0 hero-py flex flex-col gap-sm w-full md:w-auto text-center md:text-left items-center md:items-start">

        {/* Surtitre */}
        <p className="text-eyebrow text-surface mb-0">
          Sens Solidaires
        </p>

        {/* Titre */}
        <h1 className="h1-style text-surface">
          Une expérience unique de volontariat international
        </h1>

        {/* Accroche */}
        <p className="text-lead text-surface">
          Nous sommes une association d'intérêt général composée de professionnels qualifiés et diplomés qui agissent pour la préservation de l'environnement et le développement territorial à travers des actions de solidarité internationale.
        </p>

        {/* Boutons CTA */}
        <div className="flex gap-sm">
          <a href="/missions">
            <Button label="Partir en mission →" variant="primary" />
          </a>
        </div>

      </div>
    </section>
  )
}

export default Hero