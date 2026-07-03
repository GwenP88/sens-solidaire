// CTASection.jsx
// Bloc CTA de fin de page — titre + texte + bouton, fond accent-2 fixe

import Button from './Button'

function CTASection({ title, text, ctaLabel, ctaHref, onCtaClick }) {
  return (
    <section className="padding-y padding-x bg-accent-2">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-md">
        <div>
          <h2 className="h2-style text-surface max-w-5xl">{title}</h2>
          <p className="text-body text-surface/80 max-w-4xl">{text}</p>
        </div>
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