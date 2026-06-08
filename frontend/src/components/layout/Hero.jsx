// Hero.jsx
// Section Hero — image immersive pleine largeur avec titre, accroche et CTA

import Button from '../ui/Button'

function Hero() {
  return (
    <section className="relative w-full h-screen bg-gray-400 flex items-end">
      <div className="px-16 pb-24 flex flex-col gap-6">
        {/* Surtitre */}
        <p className="font-body font-bold text-surface text-sm uppercase tracking-widest">
          Sens Solidaire
        </p>

        {/* Titre */}
        <h1 className="font-heading font-bold text-surface text-6xl max-w-2xl leading-tight">
          Une expérience unique de volontariat international
        </h1>

        {/* Accroche */}
        <p className="font-body text-surface text-lg max-w-xl">
          Sens Solidaire agit en France et à l'international pour l'éducation, l'environnement et la solidarité.
        </p>

        {/* Boutons CTA */}
        <div className="flex gap-4">
          <Button label="Partir en mission →" variant="primary" />
        </div>
      </div>
    </section>
  )
}

export default Hero