// CTASection.jsx
// Bloc CTA de fin de page — titre + texte + bouton, fond accent-2 fixe
// Pattern répété à l'identique sur la majorité des pages
// Toujours bg-accent-2 + text-surface — pas de prop bg/textColor, contrairement à Section
// Props :
//   title      : titre affiché en h2
//   text       : texte d'accroche
//   ctaLabel   : label du bouton
//   ctaHref    : lien de navigation (utilisé si onCtaClick absent)
//   onCtaClick : fonction appelée au clic (ex: ouvrir une modale) — prioritaire sur ctaHref

// ── Composants UI
import Button from './Button'

function CTASection({ title, text, ctaLabel, ctaHref, onCtaClick }) {
  return (
    <section className="padding-y padding-x bg-accent-2">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-md">
        <div>
          <h2 className="h2-style text-surface max-w-5xl">{title}</h2>
          <p className="text-body text-surface/80 max-w-4xl">{text}</p>
        </div>
        {/* onCtaClick prioritaire sur ctaHref — évite une navigation non voulue si modale */}
        {onCtaClick ? (
          <Button label={ctaLabel} variant="primary" onClick={onCtaClick} />
        ) : (
          <a href={ctaHref}>
            <Button label={ctaLabel} variant="primary" />
          </a>
        )}
      </div>
    </section>
  )
}

export default CTASection